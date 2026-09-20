// Supabase Edge Function (Deno runtime).
// Wraps the Gemini REST API so the API key never reaches the browser.
// Deploy with: npx supabase functions deploy sentence-tutor --project-ref <ref>
// Requires the GEMINI_API_KEY secret: npx supabase secrets set GEMINI_API_KEY=<key>

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type HistoryTurn = { role: 'user' | 'model'; text: string };

type TutorRequestBody = {
  englishSentence?: string;
  koreanTranslation?: string;
  workTitle?: string;
  author?: string;
  history?: HistoryTurn[];
  userMessage?: string;
};

const MAX_MESSAGE_LENGTH = 500;
const MAX_HISTORY_TURNS = 20;

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });

const buildSystemInstruction = (workTitle: string, author: string, englishSentence: string, koreanTranslation: string) =>
  `당신은 'WordScene AI 튜터'입니다. 아래 문장 하나에 대해서만 어휘, 문법, 관용구, 문학적/문화적 맥락을 한국어로 설명합니다.\n` +
  `작품: ${workTitle} (${author})\n` +
  `문장: "${englishSentence}" (번역: "${koreanTranslation}")\n` +
  `답변은 2~4문단 이내로 간결하고 친근하게 작성하세요. 이 문장과 무관한 질문을 받으면, 정중히 문장 관련 주제로 안내하세요.`;

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'POST 요청만 지원합니다.' }, 405);
  }

  try {
    const body = (await req.json()) as TutorRequestBody;
    const {
      englishSentence = '',
      koreanTranslation = '',
      workTitle = '',
      author = '',
      history = [],
      userMessage = '',
    } = body;

    const trimmedMessage = userMessage.trim();
    if (!trimmedMessage) {
      return jsonResponse({ error: '질문 내용이 비어 있습니다.' }, 400);
    }
    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      return jsonResponse({ error: `질문은 ${MAX_MESSAGE_LENGTH}자 이내로 입력해주세요.` }, 400);
    }
    if (!Array.isArray(history) || history.length > MAX_HISTORY_TURNS) {
      return jsonResponse({ error: '대화가 너무 길어졌습니다. 새 대화를 시작해주세요.' }, 400);
    }
    for (const turn of history) {
      if (typeof turn.text !== 'string' || turn.text.length > MAX_MESSAGE_LENGTH) {
        return jsonResponse({ error: '잘못된 대화 기록입니다.' }, 400);
      }
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not configured');
      return jsonResponse({ error: 'AI 튜터가 아직 설정되지 않았습니다.' }, 500);
    }
    const model = Deno.env.get('GEMINI_MODEL') ?? 'gemini-3.6-flash';

    const contents = [
      ...history.map(turn => ({ role: turn.role, parts: [{ text: turn.text }] })),
      { role: 'user', parts: [{ text: trimmedMessage }] },
    ];

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: buildSystemInstruction(workTitle, author, englishSentence, koreanTranslation) }],
          },
          contents,
          generationConfig: { temperature: 0.4, maxOutputTokens: 512 },
        }),
      }
    );

    if (!geminiResponse.ok) {
      console.error('Gemini API error', geminiResponse.status, await geminiResponse.text());
      return jsonResponse({ error: 'AI 응답 생성에 실패했습니다.' }, 502);
    }

    const data = await geminiResponse.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) {
      console.error('Gemini API returned no candidates', JSON.stringify(data));
      return jsonResponse({ error: 'AI 응답 생성에 실패했습니다.' }, 502);
    }

    return jsonResponse({ reply });
  } catch (error) {
    console.error('sentence-tutor unexpected error', error);
    return jsonResponse({ error: '요청을 처리하지 못했습니다.' }, 500);
  }
});
