import { supabaseFetch } from './supabaseRest';

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
  const data = await supabaseFetch<{ reply?: string; error?: string }>('functions/v1/sentence-tutor', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!data?.reply) throw new Error(data?.error || 'AI tutor returned an empty reply');
  return data.reply;
};
