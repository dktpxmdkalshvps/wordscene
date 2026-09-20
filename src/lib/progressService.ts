export type RemoteProgress = {
  totalXp: number;
  streakDays: number;
  workProgress: Record<string, number>;
};

type DbDeviceProgress = {
  total_xp: number;
  streak_days: number;
  work_progress: Record<string, number>;
};

const restRequest = async <T,>(path: string, init?: RequestInit): Promise<T> => {
  const url = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '');
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase environment is not configured');
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });
  if (!response.ok) throw new Error(`Progress request failed (${response.status})`);
  return response.status === 204 ? (undefined as T) : (response.json() as Promise<T>);
};

export const loadProgress = async (deviceId: string): Promise<RemoteProgress | null> => {
  try {
    const rows = await restRequest<DbDeviceProgress[]>(
      `device_progress?device_id=eq.${deviceId}&select=total_xp,streak_days,work_progress`
    );
    if (!rows.length) return null;
    return {
      totalXp: rows[0].total_xp,
      streakDays: rows[0].streak_days,
      workProgress: rows[0].work_progress ?? {},
    };
  } catch {
    return null;
  }
};

export const syncProgress = async (deviceId: string, snapshot: RemoteProgress): Promise<void> => {
  try {
    await restRequest('device_progress?on_conflict=device_id', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({
        device_id: deviceId,
        total_xp: snapshot.totalXp,
        streak_days: snapshot.streakDays,
        work_progress: snapshot.workProgress,
      }),
    });
  } catch {
    // localStorage remains the source of truth on failure
  }
};
