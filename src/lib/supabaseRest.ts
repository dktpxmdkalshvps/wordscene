const getSupabaseConfig = () => {
  const url = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '');
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase environment is not configured');
  return { url, key };
};

export const supabaseFetch = async <T = unknown>(
  path: string,
  init?: RequestInit
): Promise<T> => {
  const { url, key } = getSupabaseConfig();
  const targetUrl = path.startsWith('http') ? path : `${url}/${path.replace(/^\//, '')}`;
  const response = await fetch(targetUrl, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });
  if (!response.ok) throw new Error(`Supabase request failed (${response.status})`);
  return response.status === 204 ? (undefined as T) : (response.json() as Promise<T>);
};
