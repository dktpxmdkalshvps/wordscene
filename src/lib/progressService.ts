import { supabaseFetch } from './supabaseRest';

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

export const loadProgress = async (deviceId: string): Promise<RemoteProgress | null> => {
  try {
    const rows = await supabaseFetch<DbDeviceProgress[]>(
      `rest/v1/device_progress?device_id=eq.${encodeURIComponent(deviceId)}&select=total_xp,streak_days,work_progress`
    );
    if (!rows?.length) return null;
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
    await supabaseFetch('rest/v1/device_progress?on_conflict=device_id', {
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

export const deleteProgress = async (deviceId: string): Promise<void> => {
  try {
    await supabaseFetch(`rest/v1/device_progress?device_id=eq.${encodeURIComponent(deviceId)}`, {
      method: 'DELETE',
      headers: { Prefer: 'return=minimal' },
    });
  } catch {
    // Keep factory reset usable offline
  }
};
