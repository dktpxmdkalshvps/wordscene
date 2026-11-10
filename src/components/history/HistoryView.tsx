import React from 'react';
import { useApp } from '../../context/AppContext';

export const HistoryView: React.FC = () => {
  const { user, weeklyStats } = useApp();

  const sessionLogs = [
    {
      date: '2026-09-18 (오늘)',
      workTitle: 'The Happy Prince (챕터 3)',
      accuracy: 100,
      xp: 85,
      count: 4,
      status: '완료'
    },
    {
      date: '2026-09-17 (어제)',
      workTitle: 'Alice in Wonderland (챕터 1)',
      accuracy: 90,
      xp: 75,
      count: 10,
      status: '완료'
    },
    {
      date: '2026-09-16',
      workTitle: 'The Little Prince (챕터 5)',
      accuracy: 95,
      xp: 80,
      count: 12,
      status: '완료'
    },
    {
      date: '2026-09-15',
      workTitle: '랜덤 문장 퀵 세션',
      accuracy: 100,
      xp: 50,
      count: 5,
      status: '완료'
    }
  ];

  return (
    <div className="w-full max-w-[1040px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
          학습 기록 및 통계
        </h1>
        <p className="text-sm text-on-surface-variant">
          매일 성장하는 나의 영어 문장 습득 여정과 출석 기록입니다.
        </p>
      </div>

      {/* Cumulative Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-surface-container-lowest border border-white/80 shadow-xs space-y-1">
          <span className="material-symbols-outlined text-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            local_fire_department
          </span>
          <p className="text-xs text-on-surface-variant font-medium">연속 학습</p>
          <p className="text-2xl font-extrabold text-on-surface">{user.streakDays}일째</p>
        </div>

        <div className="p-5 rounded-3xl bg-surface-container-lowest border border-white/80 shadow-xs space-y-1">
          <span className="material-symbols-outlined text-tertiary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            bolt
          </span>
          <p className="text-xs text-on-surface-variant font-medium">누적 경험치</p>
          <p className="text-2xl font-extrabold text-on-surface">{user.totalXp} XP</p>
        </div>

        <div className="p-5 rounded-3xl bg-surface-container-lowest border border-white/80 shadow-xs space-y-1">
          <span className="material-symbols-outlined text-primary text-2xl">
            verified
          </span>
          <p className="text-xs text-on-surface-variant font-medium">완료한 문장</p>
          <p className="text-2xl font-extrabold text-on-surface">31문장</p>
        </div>

        <div className="p-5 rounded-3xl bg-surface-container-lowest border border-white/80 shadow-xs space-y-1">
          <span className="material-symbols-outlined text-secondary text-2xl">
            target
          </span>
          <p className="text-xs text-on-surface-variant font-medium">평균 정답률</p>
          <p className="text-2xl font-extrabold text-on-surface">94%</p>
        </div>
      </div>

      {/* Weekly Calendar Card */}
      <div className="p-6 rounded-3xl bg-surface-container-lowest border border-white/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">calendar_month</span>
            이번 주 학습 캘린더
          </h3>
          <span className="text-xs font-bold text-secondary">3일 출석 완료</span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weeklyStats.map((stat, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 border ${
                stat.isToday
                  ? 'bg-secondary-fixed/40 border-secondary ring-2 ring-secondary/30'
                  : stat.isCompleted
                  ? 'bg-primary-container/20 border-primary-container'
                  : 'bg-surface-container-low border-transparent opacity-60'
              }`}
            >
              <span className="text-xs font-bold text-on-surface-variant">{stat.dayName}</span>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  stat.isToday
                    ? 'bg-secondary text-on-secondary shadow-xs'
                    : stat.isCompleted
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-high text-on-surface-variant'
                }`}
              >
                {stat.isCompleted || stat.isToday ? '✓' : stat.dateStr.replace('일', '')}
              </div>
              <span className="text-[10px] text-on-surface-variant">
                {stat.isCompleted ? `${stat.count}문장` : '-'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Session Log History List */}
      <div className="rounded-3xl p-6 bg-surface-container-lowest border border-white/80 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-xl">history</span>
          최근 학습 세션 기록
        </h3>

        <div className="space-y-3">
          {sessionLogs.map((log, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-surface-container-low/70 border border-white/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-on-surface-variant font-medium">{log.date}</span>
                  <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-bold">
                    {log.status}
                  </span>
                </div>
                <p className="text-sm font-bold text-on-surface">{log.workTitle}</p>
                <p className="text-xs text-on-surface-variant">{log.count}개 문장 학습 완료</p>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold">
                <div className="text-right">
                  <span className="text-primary block font-extrabold">{log.accuracy}% 정답</span>
                  <span className="text-tertiary block">+{log.xp} XP</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
