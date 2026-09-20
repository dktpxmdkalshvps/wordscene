export type PendingBookContent = {
  candidateId: string;
  workId: string;
  segmentHeading: string;
  originalText: string;
  translationKo: string;
};

export type PendingMovieQuote = {
  id: number;
  movieTitle: string;
  quoteNo: string;
  originalKo: string;
  translationEn: string;
  notes: string | null;
};

type DbPendingBookContent = {
  candidate_id: string;
  work_id: string;
  segment_heading: string;
  original_text: string;
  translation_ko: string;
};

type DbPendingMovieQuote = {
  id: number;
  movie_title: string;
  quote_no: string;
  original_ko: string;
  translation_en: string;
  notes: string | null;
};

const restGet = async <T,>(path: string): Promise<T> => {
  const url = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '');
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase environment is not configured');
  const response = await fetch(`${url}/rest/v1/${path}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!response.ok) throw new Error(`Admin review request failed (${response.status})`);
  return response.json() as Promise<T>;
};

export const fetchPendingBookContents = async (): Promise<PendingBookContent[]> => {
  const rows = await restGet<DbPendingBookContent[]>(
    'book_contents?select=candidate_id,work_id,segment_heading,original_text,translation_ko&review_status=eq.candidate&order=work_id.asc'
  );
  return rows.map(r => ({
    candidateId: r.candidate_id,
    workId: r.work_id,
    segmentHeading: r.segment_heading,
    originalText: r.original_text,
    translationKo: r.translation_ko,
  }));
};

export const fetchPendingMovieQuotes = async (): Promise<PendingMovieQuote[]> => {
  const rows = await restGet<DbPendingMovieQuote[]>(
    'movie_quotes_ko_en?select=id,movie_title,quote_no,original_ko,translation_en,notes&review_status=eq.drafted&order=movie_title.asc,quote_no.asc'
  );
  return rows.map(r => ({
    id: r.id,
    movieTitle: r.movie_title,
    quoteNo: r.quote_no,
    originalKo: r.original_ko,
    translationEn: r.translation_en,
    notes: r.notes,
  }));
};

export type ApprovedSentence = {
  sourceTable: 'book_contents' | 'movie_quotes_ko_en';
  sourceId: string;
  workTitle: string;
  englishText: string;
  koreanText: string;
  questionType: GeneratedQuestionType;
};

// createQuestions/createMovieQuestions in contentService.ts assign a fixed
// type per rank within a work's top-3 (0=fill_blank, 1=word_order,
// 2=translation_match) — an AI question generated for the wrong type would
// never match and silently do nothing after approval, so this list must
// mirror that assignment exactly.
const QUESTION_TYPE_BY_RANK: GeneratedQuestionType[] = ['fill_blank', 'word_order', 'translation_match'];

// Only the top-3-per-work sentences are ever actually turned into a quiz
// question (see createQuestions/createMovieQuestions in contentService.ts —
// books rank by selection_score, movies take the first 3 by quote_no). This
// mirrors that exact selection so an admin can never generate a question for
// a sentence that the live app would never show, which would silently do
// nothing after approval.
export const fetchApprovedSentences = async (): Promise<ApprovedSentence[]> => {
  const [bookRows, works, movieRows] = await Promise.all([
    restGet<{ candidate_id: string; work_id: string; original_text: string; translation_ko: string; selection_score: number }[]>(
      'book_contents?select=candidate_id,work_id,original_text,translation_ko,selection_score&review_status=eq.selected&order=work_id.asc'
    ),
    restGet<{ id: string; title: string }[]>('works?select=id,title'),
    restGet<{ id: number; movie_title: string; original_ko: string; translation_en: string; quote_no: string }[]>(
      'movie_quotes_ko_en?select=id,movie_title,original_ko,translation_en,quote_no&review_status=eq.selected&order=movie_title.asc,quote_no.asc'
    ),
  ]);
  const workTitleById = new Map(works.map(w => [w.id, w.title]));

  const topBookRows = Object.values(
    bookRows.reduce<Record<string, typeof bookRows>>((groups, row) => {
      (groups[row.work_id] ??= []).push(row);
      return groups;
    }, {})
  ).flatMap(group =>
    [...group]
      .sort((a, b) => Number(b.selection_score) - Number(a.selection_score))
      .slice(0, 3)
      .map((row, rank) => ({ ...row, questionType: QUESTION_TYPE_BY_RANK[rank] }))
  );

  const topMovieRows = Object.values(
    movieRows.reduce<Record<string, typeof movieRows>>((groups, row) => {
      (groups[row.movie_title] ??= []).push(row);
      return groups;
    }, {})
  ).flatMap(group => group.slice(0, 3).map((row, rank) => ({ ...row, questionType: QUESTION_TYPE_BY_RANK[rank] })));

  const books: ApprovedSentence[] = topBookRows.map(r => ({
    sourceTable: 'book_contents',
    sourceId: r.candidate_id,
    workTitle: workTitleById.get(r.work_id) ?? r.work_id,
    englishText: r.original_text,
    koreanText: r.translation_ko,
    questionType: r.questionType,
  }));
  const movies: ApprovedSentence[] = topMovieRows.map(r => ({
    sourceTable: 'movie_quotes_ko_en',
    sourceId: String(r.id),
    workTitle: r.movie_title,
    englishText: r.translation_en,
    koreanText: r.original_ko,
    questionType: r.questionType,
  }));
  return [...books, ...movies];
};

export type GeneratedQuestionType = 'fill_blank' | 'word_order' | 'translation_match';

export type PendingGeneratedQuestion = {
  id: number;
  sourceTable: 'book_contents' | 'movie_quotes_ko_en';
  sourceId: string;
  questionType: GeneratedQuestionType;
  workTitle: string;
  author: string;
  prompt: string;
  promptKorean: string | null;
  sentence: string;
  options: string[];
  correctAnswer: string | string[];
  explanation: string;
};

type DbGeneratedQuestion = {
  id: number;
  source_table: string;
  source_id: string;
  question_type: string;
  work_title: string;
  author: string;
  prompt: string;
  prompt_korean: string | null;
  sentence: string;
  options: string[];
  correct_answer: string | string[];
  explanation: string;
};

export const fetchPendingGeneratedQuestions = async (): Promise<PendingGeneratedQuestion[]> => {
  const rows = await restGet<DbGeneratedQuestion[]>(
    'generated_questions?select=id,source_table,source_id,question_type,work_title,author,prompt,prompt_korean,sentence,options,correct_answer,explanation&review_status=eq.drafted&order=created_at.desc'
  );
  return rows.map(r => ({
    id: r.id,
    sourceTable: r.source_table as PendingGeneratedQuestion['sourceTable'],
    sourceId: r.source_id,
    questionType: r.question_type as GeneratedQuestionType,
    workTitle: r.work_title,
    author: r.author,
    prompt: r.prompt,
    promptKorean: r.prompt_korean,
    sentence: r.sentence,
    options: r.options,
    correctAnswer: r.correct_answer,
    explanation: r.explanation,
  }));
};

export const generateQuestion = async (
  passcode: string,
  sourceTable: 'book_contents' | 'movie_quotes_ko_en',
  sourceId: string,
  questionType: GeneratedQuestionType
): Promise<void> => {
  const url = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '');
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase environment is not configured');

  const response = await fetch(`${url}/functions/v1/generate-question`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ passcode, sourceTable, sourceId, questionType }),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = data?.validationNotes ? ` (${data.validationNotes})` : '';
    throw new Error(`${data?.error || `Generation failed (${response.status})`}${detail}`);
  }
};

export type ReviewTable = 'book_contents' | 'movie_quotes_ko_en' | 'generated_questions';
export type ReviewAction = 'approve' | 'reject';

export const submitReview = async (
  passcode: string,
  table: ReviewTable,
  id: string | number,
  action: ReviewAction
): Promise<void> => {
  const url = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '');
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase environment is not configured');

  const response = await fetch(`${url}/functions/v1/admin-review`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ passcode, table, id, action }),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error || `Review action failed (${response.status})`);
  }
};
