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

export type ReviewTable = 'book_contents' | 'movie_quotes_ko_en';
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
