export type TutorHistoryTurn = { role: 'user' | 'model'; text: string };

export type TutorRequest = {
  englishSentence: string;
  koreanTranslation: string;
  workTitle: string;
  author: string;
  history: TutorHistoryTurn[];
  userMessage: string;
};

export const askSentenceTutor = async (payload: TutorRequest): Promise<string> => {
  const url = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '');
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase environment is not configured');

  const response = await fetch(`${url}/functions/v1/sentence-tutor`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error || `AI tutor request failed (${response.status})`);
  }
  if (!data?.reply) throw new Error('AI tutor returned an empty reply');
  return data.reply as string;
};
