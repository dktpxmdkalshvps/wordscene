import type { Difficulty, Question, Work } from '../types';
import { INITIAL_WORKS, HAPPY_PRINCE_QUESTIONS } from '../data/mockData';

type DbWork = { id: string; title: string; author: string; sort_order: number };
type DbContent = {
  candidate_id: string;
  work_id: string;
  segment_heading: string;
  original_text: string;
  translation_ko: string;
  difficulty: string;
  learning_focus: string[] | null;
  selection_score: number;
};

type DbMovieQuote = {
  id: number;
  movie_title: string;
  quote_no: string;
  original_ko: string;
  translation_en: string;
  notes: string | null;
};

type DbGeneratedQuestion = {
  source_table: 'book_contents' | 'movie_quotes_ko_en';
  source_id: string;
  question_type: string;
  prompt: string;
  prompt_korean: string | null;
  sentence: string;
  options: string[];
  correct_answer: string | string[];
  explanation: string;
};

export type ContentCatalog = {
  works: Work[];
  questionsByWork: Record<string, Question[]>;
  source: 'supabase' | 'local';
};

const STOPWORDS = new Set(['about', 'after', 'again', 'before', 'could', 'every', 'their', 'there', 'these', 'those', 'would']);

const BOOK_KOREAN_TITLES: Record<string, string> = {
  BOOK_HP_1888: '행복한 왕자',
  BOOK_SH_1892: '셜록 홈즈의 모험',
  BOOK_GG_1925: '위대한 개츠비',
  BOOK_PP_1813: '오만과 편견',
  BOOK_FR_1818: '프랑켄슈타인',
};

const BOOK_COVERS: Record<string, string> = {
  BOOK_HP_1888: 'https://img.hankyung.com/photo/200804/2008041725411_2008041877881.jpg',
  BOOK_SH_1892: 'https://m.media-amazon.com/images/I/71XFTiuB1-L.jpg',
  BOOK_GG_1925: 'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9780743273565.jpg?t=2982968',
  BOOK_PP_1813: 'https://fcs-img.s3.amazonaws.com/1ebda62b-7f02-4fab-8e39-a5e6016ae6b4/9ab485cd-23e6-434f-8139-b1be014aa45d/XL.jpg',
  BOOK_FR_1818: 'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9780451532244.jpg?t=2979022',
};

const MOVIE_COVERS: Record<string, string> = {
  건축학개론: 'https://flexible.img.hani.co.kr/flexible/normal/900/600/imgdb/original/2023/1027/20231027502448.jpg',
  극한직업: 'https://sm.ign.com/ign_kr/screenshot/default/1_b4g2.jpg',
  '남산의 부장들': 'https://i.ytimg.com/vi/BIKz5KQpiog/sddefault.jpg',
  베테랑: 'https://pds.joongang.co.kr/news/component/htmlphoto_mmdata/201508/29/htm_20150829091350949.jpg',
  부당거래: 'https://i.namu.wiki/i/rf4P7RGqafHygOtysazAWKQzcA7YHU2faRr2iQc_7-IH8wjfOolRXgi-MGRANDK69_nH0sIOYxmVUl4cCmaj8A.webp',
  아저씨: 'https://img.hankyung.com/photo/202112/01.28216191.1.jpg',
  올드보이: 'https://i.namu.wiki/i/-NRuOEma3DmirkkSyK1bdSY94gm1CpT8UJbh7XRlBH7N2KB2wsDcFsLbO4FNzugZA91gufpIzAKxX0MUNSuTvg.webp',
  '친절한 금자씨': 'https://i.namu.wiki/i/sYQ1SZGDVhLM3cwl5Ann-6biY6a95O-66jxXDMI-wpqx4PUbZotrZQjz9gHDm3PyP6ADru8XfbkcBsdgn4Qjqw.webp',
  타짜: 'https://i.namu.wiki/i/-oIsPiB0O_KNfRKpD5NyltnQWUZfShe2X43cdDQ4U9YDOCBbR_k7LbYxDz5L_7KrVfdtt8xHhRAg21-8ofcReQ.webp',
};

const FILL_BLANK_DISTRACTOR_POOL = ['remember', 'different', 'beautiful', 'through', 'silence', 'forever', 'possible', 'necessary'];

const difficultyOf = (value: string): Difficulty => {
  if (/upper|advanced/i.test(value)) return '고급';
  if (/intermediate/i.test(value)) return '중급';
  return '초급';
};

const hash = (text: string) => [...text].reduce((acc, char) => ((acc * 31) + char.charCodeAt(0)) >>> 0, 2166136261);

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

const cleanWords = (text: string) => text.match(/[A-Za-z]+(?:'[A-Za-z]+)?[.,!?;:]?/g) ?? [];

const createQuestions = (work: DbWork, cards: DbContent[]): Question[] => {
  if (cards.length === 0) return [];
  const selected = [...cards].sort((a, b) => Number(b.selection_score) - Number(a.selection_score)).slice(0, 3);
  const translations = cards.map(card => card.translation_ko).filter(Boolean);

  return selected.map((card, index) => {
    const base = {
      id: `${card.candidate_id}-q`,
      sentenceId: card.candidate_id,
      workTitle: work.title,
      author: work.author,
      sourceContext: card.segment_heading,
      vocabularies: [],
    };

    if (index % 3 === 0) {
      const candidates = cleanWords(card.original_text)
        .map(word => word.replace(/[^A-Za-z']/g, ''))
        .filter(word => word.length >= 5 && !STOPWORDS.has(word.toLowerCase()));
      const answer = candidates.sort((a, b) => b.length - a.length)[0] ?? cleanWords(card.original_text)[0] ?? '';
      const sentence = card.original_text.replace(new RegExp(`\\b${answer}\\b`, 'i'), '_____');
      const distractors = FILL_BLANK_DISTRACTOR_POOL
        .filter(word => word.toLowerCase() !== answer.toLowerCase())
        .slice(0, 3);
      return {
        ...base,
        type: 'fill_blank',
        prompt: '원문에 들어갈 단어를 고르세요.',
        promptKorean: card.translation_ko,
        sentence,
        options: shuffle([answer, ...distractors], card.candidate_id),
        correctAnswer: answer,
        explanation: `원문의 핵심 표현은 “${answer}”입니다. 문맥과 한국어 번역을 함께 확인해 보세요.`,
      };
    }

    if (index % 3 === 1) {
      const words = cleanWords(card.original_text).slice(0, 12);
      return {
        ...base,
        type: 'word_order',
        prompt: '주어진 단어를 원문 순서로 배열하세요.',
        promptKorean: card.translation_ko,
        sentence: words.join(' '),
        options: shuffle(words, card.candidate_id),
        correctAnswer: words,
        explanation: '원문의 어순과 문장 구조를 기준으로 배열합니다.',
      };
    }

    const distractors = translations.filter(item => item !== card.translation_ko).slice(0, 3);
    while (distractors.length < 3) distractors.push('문맥과 일치하지 않는 번역입니다.');
    return {
      ...base,
      type: 'translation_match',
      prompt: '원문과 가장 잘 맞는 한국어 번역을 고르세요.',
      promptKorean: card.original_text,
      sentence: card.original_text,
      options: shuffle([card.translation_ko, ...distractors], card.candidate_id),
      correctAnswer: card.translation_ko,
      explanation: `이 문장의 검토 대상 번역은 “${card.translation_ko}”입니다.`,
    };
  });
};

const createMovieQuestions = (movieTitle: string, quotes: DbMovieQuote[]): Question[] => {
  if (quotes.length === 0) return [];
  const selected = quotes.slice(0, 3);
  const translations = quotes.map(quote => quote.original_ko).filter(Boolean);

  return selected.map((quote, index) => {
    const base = {
      id: `movie-${quote.id}-q`,
      sentenceId: `movie-${quote.id}`,
      workTitle: movieTitle,
      author: '영화 대사',
      sourceContext: quote.notes || `대사 ${quote.quote_no}`,
      vocabularies: [],
    };

    if (index % 3 === 0) {
      const candidates = cleanWords(quote.translation_en)
        .map(word => word.replace(/[^A-Za-z']/g, ''))
        .filter(word => word.length >= 5 && !STOPWORDS.has(word.toLowerCase()));
      const answer = candidates.sort((a, b) => b.length - a.length)[0] ?? cleanWords(quote.translation_en)[0] ?? '';
      const sentence = quote.translation_en.replace(new RegExp(`\\b${answer}\\b`, 'i'), '_____');
      const distractors = FILL_BLANK_DISTRACTOR_POOL
        .filter(word => word.toLowerCase() !== answer.toLowerCase())
        .slice(0, 3);
      return {
        ...base,
        type: 'fill_blank',
        prompt: '대사에 들어갈 단어를 고르세요.',
        promptKorean: quote.original_ko,
        sentence,
        options: shuffle([answer, ...distractors], String(quote.id)),
        correctAnswer: answer,
        explanation: `이 대사의 핵심 표현은 “${answer}”입니다. 원본 한국어 대사와 함께 확인해 보세요.`,
      };
    }

    if (index % 3 === 1) {
      const words = cleanWords(quote.translation_en).slice(0, 12);
      return {
        ...base,
        type: 'word_order',
        prompt: '주어진 단어를 영어 대사 순서로 배열하세요.',
        promptKorean: quote.original_ko,
        sentence: words.join(' '),
        options: shuffle(words, String(quote.id)),
        correctAnswer: words,
        explanation: '영어 대사의 어순을 기준으로 배열합니다.',
      };
    }

    const distractors = translations.filter(item => item !== quote.original_ko).slice(0, 3);
    while (distractors.length < 3) distractors.push('문맥과 일치하지 않는 번역입니다.');
    return {
      ...base,
      type: 'translation_match',
      prompt: '영어 대사와 가장 잘 맞는 한국어 원문을 고르세요.',
      promptKorean: quote.translation_en,
      sentence: quote.translation_en,
      options: shuffle([quote.original_ko, ...distractors], String(quote.id)),
      correctAnswer: quote.original_ko,
      explanation: `이 대사의 한국어 원문은 “${quote.original_ko}”입니다.`,
    };
  });
};

const buildMovieWorks = (
  quotes: DbMovieQuote[],
  stageOffset: number,
  coverPool: string[]
): { works: Work[]; questionsByWork: Record<string, Question[]> } => {
  const byTitle = new Map<string, DbMovieQuote[]>();
  quotes.forEach(quote => {
    const list = byTitle.get(quote.movie_title) ?? [];
    list.push(quote);
    byTitle.set(quote.movie_title, list);
  });

  const works: Work[] = [];
  const questionsByWork: Record<string, Question[]> = {};

  [...byTitle.entries()].forEach(([movieTitle, movieQuotes], index) => {
    const id = `MOVIE_${movieTitle}`;
    works.push({
      id,
      title: movieTitle,
      koreanTitle: movieTitle,
      author: '영화 대사',
      category: 'cinema',
      difficulty: '중급',
      totalSentences: movieQuotes.length,
      completedSentences: 0,
      description: `${movieQuotes.length}개의 명대사로 배우는 실전 회화 표현`,
      coverImage: MOVIE_COVERS[movieTitle] ?? coverPool[index % coverPool.length],
      badge: index === 0 ? '영화 명대사' : '학습 가능',
      isLocked: false,
      stageNumber: stageOffset + index + 1,
    });
    questionsByWork[id] = createMovieQuestions(movieTitle, movieQuotes);
  });

  return { works, questionsByWork };
};

const request = async <T,>(path: string): Promise<T> => {
  const url = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '');
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase environment is not configured');
  const response = await fetch(`${url}/rest/v1/${path}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!response.ok) throw new Error(`Content request failed (${response.status})`);
  return response.json() as Promise<T>;
};

export const localCatalog = (): ContentCatalog => ({
  works: INITIAL_WORKS,
  questionsByWork: Object.fromEntries(INITIAL_WORKS.map(work => [work.id, HAPPY_PRINCE_QUESTIONS])),
  source: 'local',
});

export const loadContentCatalog = async (): Promise<ContentCatalog> => {
  try {
    const [dbWorks, contents] = await Promise.all([
      request<DbWork[]>('works?select=id,title,author,sort_order&order=sort_order.asc'),
      request<DbContent[]>('book_contents?select=candidate_id,work_id,segment_heading,original_text,translation_ko,difficulty,learning_focus,selection_score&review_status=eq.selected&order=work_id.asc,no_in_work.asc'),
    ]);
    if (!dbWorks.length || !contents.length) return localCatalog();

    const fallbackCovers = INITIAL_WORKS.map(work => work.coverImage);
    const works: Work[] = dbWorks.map((work, index) => {
      const cards = contents.filter(card => card.work_id === work.id);
      return {
        id: work.id,
        title: work.title,
        koreanTitle: BOOK_KOREAN_TITLES[work.id] ?? work.title,
        author: work.author,
        category: 'books',
        difficulty: difficultyOf(cards[0]?.difficulty ?? 'Beginner'),
        totalSentences: cards.length,
        completedSentences: 0,
        description: cards[0]?.learning_focus?.join(' · ') || '명작 원문으로 문맥과 표현을 함께 익혀보세요.',
        coverImage: BOOK_COVERS[work.id] ?? fallbackCovers[index % fallbackCovers.length],
        badge: index === 0 ? '오늘의 추천' : '학습 가능',
        isLocked: false,
        stageNumber: work.sort_order,
      };
    });

    const questionsByWork: Record<string, Question[]> = Object.fromEntries(
      dbWorks.map(work => [work.id, createQuestions(work, contents.filter(card => card.work_id === work.id))])
    );

    // Movie quotes are additive and independently resilient — a failure here
    // must not take down the (already working) book catalog above.
    try {
      const movieQuotes = await request<DbMovieQuote[]>(
        'movie_quotes_ko_en?select=id,movie_title,quote_no,original_ko,translation_en,notes&review_status=eq.selected&order=movie_title.asc,quote_no.asc'
      );
      if (movieQuotes.length) {
        const movieCatalog = buildMovieWorks(movieQuotes, works.length, fallbackCovers);
        works.push(...movieCatalog.works);
        Object.assign(questionsByWork, movieCatalog.questionsByWork);
      }
    } catch {
      // movies unavailable — books-only catalog is still returned below
    }

    // Admin-approved AI-generated questions are an optional quality upgrade
    // over the deterministic ones above. A failure here must not affect the
    // (already working) catalog — every entry just keeps its deterministic
    // question, exactly the fallback behavior this feature is designed around.
    try {
      const generated = await request<DbGeneratedQuestion[]>(
        'generated_questions?select=source_table,source_id,question_type,prompt,prompt_korean,sentence,options,correct_answer,explanation&review_status=eq.selected'
      );
      if (generated.length) {
        const bySentenceIdAndType = new Map<string, DbGeneratedQuestion>();
        generated.forEach(g => {
          const sentenceId = g.source_table === 'movie_quotes_ko_en' ? `movie-${g.source_id}` : g.source_id;
          bySentenceIdAndType.set(`${sentenceId}::${g.question_type}`, g);
        });
        for (const workId of Object.keys(questionsByWork)) {
          questionsByWork[workId] = questionsByWork[workId].map(q => {
            const match = bySentenceIdAndType.get(`${q.sentenceId}::${q.type}`);
            if (!match) return q;
            return {
              ...q,
              prompt: match.prompt,
              promptKorean: match.prompt_korean ?? undefined,
              sentence: match.sentence,
              options: match.options,
              correctAnswer: match.correct_answer,
              explanation: match.explanation,
            };
          });
        }
      }
    } catch {
      // AI-enhanced questions unavailable — deterministic questions stand as-is
    }

    return { works, questionsByWork, source: 'supabase' };
  } catch {
    return localCatalog();
  }
};

// Reconstructs a clean (unblanked, unscrambled) English/Korean sentence pair
// from any Question, regardless of its quiz type — used wherever the app
// wants to show a plain preview of a work's content rather than a live quiz.
// Dialogue sentences often already carry their own quote marks in the source
// text — strip a single matching outer pair so callers can safely wrap the
// result in “…” without ever producing a doubled-up "“"the words"”" look.
const stripOuterQuotes = (text: string) => text.trim().replace(/^["“”]+/, '').replace(/["“”]+$/, '');

export const getPreviewSentence = (
  questionsByWork: Record<string, Question[]>,
  workId: string
): { english: string; korean: string } | null => {
  const question = questionsByWork[workId]?.[0];
  if (!question) return null;

  if (question.type === 'fill_blank' && typeof question.correctAnswer === 'string') {
    return {
      english: stripOuterQuotes(question.sentence.replace('_____', question.correctAnswer)),
      korean: stripOuterQuotes(question.promptKorean ?? ''),
    };
  }
  if (question.type === 'translation_match') {
    return {
      english: stripOuterQuotes(question.sentence),
      korean: stripOuterQuotes(typeof question.correctAnswer === 'string' ? question.correctAnswer : ''),
    };
  }
  return { english: stripOuterQuotes(question.sentence), korean: stripOuterQuotes(question.promptKorean ?? '') };
};
