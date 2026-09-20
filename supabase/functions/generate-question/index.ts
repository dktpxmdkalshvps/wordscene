// Supabase Edge Function (Deno runtime).
// "생성 → 검증 → 저장" pipeline: takes an already-approved sentence, asks Gemini
// (JSON mode) for a higher-quality quiz variant, runs rule-based validation,
// and only on success inserts a row into generated_questions (review_status
// 'drafted') for a human admin to approve/reject via admin-review.
// A validation failure returns an error and saves nothing — the app already
// falls back to contentService.ts's deterministic generator whenever no
// approved AI variant exists, so no separate fallback logic is needed here.
// Deploy with: npx supabase functions deploy generate-question --project-ref <ref>
// Requires the same ADMIN_PASSCODE and GEMINI_API_KEY secrets as
// admin-review / sentence-tutor.

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type SourceTable = 'book_contents' | 'movie_quotes_ko_en';
type QuestionType = 'fill_blank' | 'word_order' | 'translation_match';

type GenerateRequestBody = {
  passcode?: string;
  sourceTable?: SourceTable;
  sourceId?: string;
  questionType?: QuestionType;
};

type SourceSentence = {
  englishText: string;
  koreanText: string;
  workTitle: string;
  author: string;
  sourceContext: string;
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });

const hash = (text: string) => [...text].reduce((acc, char) => ((acc * 31) + char.charCodeAt(0)) >>> 0, 2166136271);

const shuffle = <T,>(items: T[], seed: string): T[] => {
  const result = [...items];
  let state = hash(seed);
  for (let i = result.length - 1; i > 0; i -= 1) {
    state = (state * 1664525 + 1013904223) >>> 0;
    const j = state % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const tokenize = (text: string) =>
  (text.match(/[A-Za-z]+(?:'[A-Za-z]+)?/g) ?? []).map(w => w.toLowerCase());

const restGet = async <T,>(supabaseUrl: string, serviceKey: string, path: string): Promise<T> => {
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
  });
  if (!response.ok) throw new Error(`Source fetch failed (${response.status})`);
  return response.json() as Promise<T>;
};

const fetchSource = async (
  supabaseUrl: string,
  serviceKey: string,
  sourceTable: SourceTable,
  sourceId: string
): Promise<SourceSentence | null> => {
  if (sourceTable === 'book_contents') {
    const rows = await restGet<any[]>(
      supabaseUrl, serviceKey,
      `book_contents?candidate_id=eq.${encodeURIComponent(sourceId)}&select=candidate_id,work_id,original_text,translation_ko,segment_heading`
    );
    const row = rows[0];
    if (!row) return null;
    const works = await restGet<any[]>(
      supabaseUrl, serviceKey,
      `works?id=eq.${encodeURIComponent(row.work_id)}&select=title,author`
    );
    const work = works[0];
    return {
      englishText: row.original_text,
      koreanText: row.translation_ko,
      workTitle: work?.title ?? row.work_id,
      author: work?.author ?? '',
      sourceContext: row.segment_heading ?? '',
    };
  }

  const rows = await restGet<any[]>(
    supabaseUrl, serviceKey,
    `movie_quotes_ko_en?id=eq.${encodeURIComponent(sourceId)}&select=id,movie_title,quote_no,original_ko,translation_en,notes`
  );
  const row = rows[0];
  if (!row) return null;
  return {
    englishText: row.translation_en,
    koreanText: row.original_ko,
    workTitle: row.movie_title,
    author: '영화 대사',
    sourceContext: row.notes || `대사 ${row.quote_no}`,
  };
};

const SCHEMAS: Record<QuestionType, object> = {
  fill_blank: {
    type: 'OBJECT',
    properties: {
      answer: { type: 'STRING', description: '문장에서 빈칸으로 만들 핵심 단어 (원문에 그대로 등장하는 단어)' },
      distractors: { type: 'ARRAY', items: { type: 'STRING' }, minItems: 3, maxItems: 3 },
      explanation: { type: 'STRING', description: '한국어로 된 해설' },
    },
    required: ['answer', 'distractors', 'explanation'],
  },
  word_order: {
    type: 'OBJECT',
    properties: {
      words: { type: 'ARRAY', items: { type: 'STRING' }, description: '원문을 공백 기준으로 나눈 단어 목록 (원문 그대로, 순서 유지)' },
      explanation: { type: 'STRING', description: '한국어로 된 해설' },
    },
    required: ['words', 'explanation'],
  },
  translation_match: {
    type: 'OBJECT',
    properties: {
      distractors: { type: 'ARRAY', items: { type: 'STRING' }, minItems: 3, maxItems: 3, description: '그럴듯하지만 틀린 한국어 번역 3개' },
      explanation: { type: 'STRING', description: '한국어로 된 해설' },
    },
    required: ['distractors', 'explanation'],
  },
};

const buildPrompt = (type: QuestionType, source: SourceSentence) => {
  const base = `작품: ${source.workTitle} (${source.author})\n영어 원문: "${source.englishText}"\n한국어 번역: "${source.koreanText}"`;
  if (type === 'fill_blank') {
    return `${base}\n\n위 영어 원문에서 학습자가 빈칸 채우기로 익히기 좋은 핵심 단어 하나를 고르세요. 그 단어와 품사·난이도가 비슷하지만 명백히 오답인 단어 3개(distractors)를 만드세요. answer는 원문에 실제로 등장하는 철자 그대로여야 합니다.`;
  }
  if (type === 'word_order') {
    return `${base}\n\n위 영어 원문을 공백 기준으로 단어 목록으로 나누세요(구두점은 단어에 붙여도 됩니다). 원문 순서 그대로, 단어를 새로 만들거나 생략하지 마세요.`;
  }
  return `${base}\n\n위 한국어 번역과 다르지만 그럴듯한 오답 한국어 번역 3개를 만드세요. 각 오답은 서로 다르고, 실제 번역과 명확히 구분되는 의미 차이가 있어야 합니다.`;
};

type ValidationResult = { ok: true } | { ok: false; reason: string };

const validateFillBlank = (data: any, source: SourceSentence): ValidationResult => {
  const { answer, distractors, explanation } = data;
  if (typeof answer !== 'string' || !answer.trim()) return { ok: false, reason: 'answer가 비어 있습니다.' };
  if (!Array.isArray(distractors) || distractors.length !== 3) return { ok: false, reason: 'distractors는 정확히 3개여야 합니다.' };
  if (typeof explanation !== 'string' || !explanation.trim()) return { ok: false, reason: 'explanation이 비어 있습니다.' };
  const wordRegex = new RegExp(`\\b${answer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
  if (!wordRegex.test(source.englishText)) return { ok: false, reason: 'answer가 원문에 존재하지 않습니다.' };
  const all = [answer, ...distractors].map(s => String(s).trim().toLowerCase());
  if (new Set(all).size !== all.length) return { ok: false, reason: '보기 중 중복된 단어가 있습니다.' };
  return { ok: true };
};

const validateWordOrder = (data: any, source: SourceSentence): ValidationResult => {
  const { words, explanation } = data;
  if (!Array.isArray(words) || words.length < 3) return { ok: false, reason: 'words가 너무 짧습니다.' };
  if (typeof explanation !== 'string' || !explanation.trim()) return { ok: false, reason: 'explanation이 비어 있습니다.' };
  const generatedTokens = words.flatMap((w: string) => tokenize(String(w))).sort();
  const sourceTokens = tokenize(source.englishText).sort();
  if (JSON.stringify(generatedTokens) !== JSON.stringify(sourceTokens)) {
    return { ok: false, reason: 'words가 원문 단어 구성과 일치하지 않습니다.' };
  }
  return { ok: true };
};

const validateTranslationMatch = (data: any, source: SourceSentence): ValidationResult => {
  const { distractors, explanation } = data;
  if (!Array.isArray(distractors) || distractors.length !== 3) return { ok: false, reason: 'distractors는 정확히 3개여야 합니다.' };
  if (typeof explanation !== 'string' || !explanation.trim()) return { ok: false, reason: 'explanation이 비어 있습니다.' };
  const all = [source.koreanText, ...distractors].map(s => String(s).trim());
  if (new Set(all).size !== all.length) return { ok: false, reason: '오답이 정답과 중복됩니다.' };
  return { ok: true };
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS });
  if (req.method !== 'POST') return jsonResponse({ error: 'POST 요청만 지원합니다.' }, 405);

  try {
    const { passcode, sourceTable, sourceId, questionType } = (await req.json()) as GenerateRequestBody;

    const expectedPasscode = Deno.env.get('ADMIN_PASSCODE');
    if (!expectedPasscode) return jsonResponse({ error: '관리자 기능이 아직 설정되지 않았습니다.' }, 500);
    if (!passcode || passcode !== expectedPasscode) return jsonResponse({ error: '패스코드가 올바르지 않습니다.' }, 401);

    if (sourceTable !== 'book_contents' && sourceTable !== 'movie_quotes_ko_en') {
      return jsonResponse({ error: '지원하지 않는 소스 테이블입니다.' }, 400);
    }
    if (!sourceId) return jsonResponse({ error: 'sourceId가 필요합니다.' }, 400);
    if (!questionType || !SCHEMAS[questionType]) {
      return jsonResponse({ error: '지원하지 않는 문제 유형입니다.' }, 400);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!supabaseUrl || !serviceKey || !apiKey) {
      console.error('Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / GEMINI_API_KEY');
      return jsonResponse({ error: '기능이 아직 설정되지 않았습니다.' }, 500);
    }

    const source = await fetchSource(supabaseUrl, serviceKey, sourceTable, sourceId);
    if (!source) return jsonResponse({ error: '원본 문장을 찾을 수 없습니다.' }, 404);

    const model = Deno.env.get('GEMINI_MODEL') ?? 'gemini-3.6-flash';
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: buildPrompt(questionType, source) }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: SCHEMAS[questionType],
            temperature: 0.6,
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      console.error('Gemini error', geminiResponse.status, await geminiResponse.text());
      return jsonResponse({ error: 'AI 생성에 실패했습니다.' }, 502);
    }

    const geminiData = await geminiResponse.json();
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      console.error('Gemini returned no content', JSON.stringify(geminiData));
      return jsonResponse({ error: 'AI 생성에 실패했습니다.' }, 502);
    }

    let parsed: any;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      return jsonResponse({ error: 'AI 응답을 해석하지 못했습니다.', validationNotes: rawText.slice(0, 300) }, 502);
    }

    const validator = questionType === 'fill_blank'
      ? validateFillBlank
      : questionType === 'word_order'
      ? validateWordOrder
      : validateTranslationMatch;
    const validation = validator(parsed, source);
    if (!validation.ok) {
      return jsonResponse({ error: '생성된 문제가 검증을 통과하지 못했습니다.', validationNotes: validation.reason }, 422);
    }

    let prompt: string;
    let promptKorean: string;
    let sentence: string;
    let options: string[];
    let correctAnswer: string | string[];

    if (questionType === 'fill_blank') {
      const answer = String(parsed.answer);
      prompt = '원문에 들어갈 단어를 고르세요.';
      promptKorean = source.koreanText;
      sentence = source.englishText.replace(new RegExp(`\\b${answer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i'), '_____');
      options = shuffle([answer, ...parsed.distractors.map(String)], sourceId);
      correctAnswer = answer;
    } else if (questionType === 'word_order') {
      const words = parsed.words.map(String);
      prompt = '주어진 단어를 원문 순서로 배열하세요.';
      promptKorean = source.koreanText;
      sentence = words.join(' ');
      options = shuffle(words, sourceId);
      correctAnswer = words;
    } else {
      prompt = '원문과 가장 잘 맞는 한국어 번역을 고르세요.';
      promptKorean = source.englishText;
      sentence = source.englishText;
      options = shuffle([source.koreanText, ...parsed.distractors.map(String)], sourceId);
      correctAnswer = source.koreanText;
    }

    const insertResponse = await fetch(`${supabaseUrl}/rest/v1/generated_questions`, {
      method: 'POST',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        source_table: sourceTable,
        source_id: sourceId,
        question_type: questionType,
        work_title: source.workTitle,
        author: source.author,
        prompt,
        prompt_korean: promptKorean,
        sentence,
        options,
        correct_answer: correctAnswer,
        explanation: String(parsed.explanation),
        validation_status: 'passed',
        review_status: 'drafted',
      }),
    });

    if (!insertResponse.ok) {
      console.error('Insert failed', insertResponse.status, await insertResponse.text());
      return jsonResponse({ error: '생성 결과 저장에 실패했습니다.' }, 502);
    }

    const inserted = await insertResponse.json();
    return jsonResponse({ ok: true, question: inserted[0] });
  } catch (error) {
    console.error('generate-question unexpected error', error);
    return jsonResponse({ error: '요청을 처리하지 못했습니다.' }, 500);
  }
});
