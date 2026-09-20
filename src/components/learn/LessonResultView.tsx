import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';

export const LessonResultView: React.FC = () => {
  const { lastResult, setActiveTab, startReviewSession, resetDemoData, user, dismissResult } = useApp();

  useEffect(() => {
    // Fire festive iridescent confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#67E8F9', '#F472B6', '#FDE047', '#C084FC']
      });
    } catch {}
  }, []);

  if (!lastResult) return null;

  const hasWrongAnswers = lastResult.answers.some(a => !a.isCorrect);

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8 space-y-6">
      {/* Trophy / Mascot Badge Header */}
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary-container via-secondary-container to-tertiary-container flex items-center justify-center shadow-[0_8px_24px_rgba(103,232,249,0.5)] ring-4 ring-white">
          <span className="material-symbols-outlined text-4xl text-on-surface" style={{ fontVariationSettings: "'FILL' 1" }}>
            celebration
          </span>
        </div>
        <span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold shadow-xs">
          세션 목표 달성!
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface">
          멋져요! 오늘 학습을 완주했어요!
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant font-medium">
          {lastResult.workTitle} 세션을 성공적으로 끝마쳤습니다.
        </p>
      </div>

      {/* Rewards & Stats Summary Bento */}
      <div className="grid grid-cols-3 gap-3">
        {/* XP Bonus */}
        <div className="p-4 rounded-3xl bg-surface-container-lowest border border-white/80 shadow-xs flex flex-col items-center text-center">
          <span className="material-symbols-outlined text-tertiary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            bolt
          </span>
          <span className="text-[11px] font-bold text-on-surface-variant mt-1">획득 경험치</span>
          <span className="text-lg font-extrabold text-tertiary">+{lastResult.earnedXp} XP</span>
        </div>

        {/* Accuracy */}
        <div className="p-4 rounded-3xl bg-surface-container-lowest border border-white/80 shadow-xs flex flex-col items-center text-center">
          <span className="material-symbols-outlined text-primary text-2xl">
            target
          </span>
          <span className="text-[11px] font-bold text-on-surface-variant mt-1">정답률</span>
          <span className="text-lg font-extrabold text-primary">{lastResult.accuracy}%</span>
        </div>

        {/* Streak */}
        <div className="p-4 rounded-3xl bg-surface-container-lowest border border-white/80 shadow-xs flex flex-col items-center text-center">
          <span className="material-symbols-outlined text-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            local_fire_department
          </span>
          <span className="text-[11px] font-bold text-on-surface-variant mt-1">연속 스트릭</span>
          <span className="text-lg font-extrabold text-secondary">{user.streakDays}일차</span>
        </div>
      </div>

      {/* Question Results Breakdown */}
      <div className="rounded-3xl p-5 bg-surface-container-lowest border border-white/80 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-lg">checklist</span>
          문제별 결과 복습
        </h3>

        <div className="space-y-2.5">
          {lastResult.answers.map((ans, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border flex items-start gap-3 text-xs ${
                ans.isCorrect
                  ? 'bg-primary-container/10 border-primary-container text-on-surface'
                  : 'bg-error-container/20 border-error-container text-on-surface'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold ${
                  ans.isCorrect ? 'bg-primary text-on-primary' : 'bg-error text-on-error'
                }`}
              >
                {ans.isCorrect ? '✓' : '✕'}
              </span>

              <div className="flex-1 min-w-0 space-y-1">
                <p className="font-semibold text-on-surface">{ans.question.sentence}</p>
                <p className="text-on-surface-variant text-[11px]">
                  {ans.isCorrect ? '정답 제출 완료' : `해설: ${ans.question.explanation}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        {hasWrongAnswers && (
          <button
            onClick={startReviewSession}
            className="w-full h-14 rounded-full bg-secondary text-on-secondary font-extrabold text-sm shadow-md hover:bg-secondary/90 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">restart_alt</span>
            <span>오답 바로 복습하기</span>
          </button>
        )}

        <button
          onClick={() => {
            dismissResult();
            setActiveTab('home');
          }}
          className="w-full h-14 rounded-full bg-gradient-to-r from-[#67E8F9] via-[#C084FC] to-[#F472B6] text-[#1E1B4B] font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">cottage</span>
          <span>홈으로 돌아가기</span>
        </button>

        <button
          onClick={() => {
            dismissResult();
            setActiveTab('explore');
          }}
          className="w-full py-3 rounded-full text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer text-center"
        >
          다른 원서 탐색하기
        </button>
      </div>
    </div>
  );
};
