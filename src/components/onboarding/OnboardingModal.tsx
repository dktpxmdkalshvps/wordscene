import React from 'react';
import { useApp } from '../../context/AppContext';

const STEPS = [
  { icon: '🎯', title: 'Step 1: 목표를 설정하세요!', subtitle: '시험 준비, 여행, 취미' },
  { icon: '🧠', title: 'Step 2: 현재 실력을 진단합니다!', subtitle: '간단한 레벨 테스트로 시작' },
  { icon: '📅', title: 'Step 3: 나만의 학습 계획을 만드세요!', subtitle: '매일 10분 집중 학습' },
];

export const OnboardingModal: React.FC = () => {
  const { showOnboarding, setShowOnboarding, setActiveTab, showToast } = useApp();

  if (!showOnboarding) return null;

  const enterApp = (message?: string) => {
    localStorage.setItem('ws_onboarding_complete', 'true');
    setActiveTab('home');
    setShowOnboarding(false);
    if (message) showToast(message);
  };

  return (
    <div className="wordscene-entry" role="dialog" aria-modal="true" aria-labelledby="entry-title">
      <div className="wordscene-entry__frame">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-[0_8px_24px_-2px_rgba(103,232,249,0.45)] shrink-0">
            <span className="material-symbols-outlined text-[22px]">auto_stories</span>
          </div>
          <div>
            <h1 id="entry-title" className="text-2xl font-extrabold text-on-surface tracking-tight leading-none">
              Word<span className="text-primary">Scene</span>
            </h1>
            <p className="text-xs font-semibold text-on-surface-variant mt-1">반짝이는 나의 영어 여정</p>
          </div>
        </div>

        {/* Mascot artwork, cropped to the illustration band only */}
        <div
          className="relative w-full overflow-hidden rounded-[2rem] mt-5 shadow-[0_12px_32px_-4px_rgba(244,114,182,0.15),0_4px_12px_-2px_rgba(103,232,249,0.12)]"
          style={{ aspectRatio: '894 / 720' }}
        >
          <img
            src="/wordscene-entry.png"
            alt="WordScene 마스코트가 반짝이는 책을 읽고 있는 모습"
            className="absolute inset-x-0 top-0 w-full h-auto"
            style={{ transform: 'translateY(-15%)' }}
          />
        </div>

        {/* Step Cards */}
        <div className="flex flex-col gap-2.5 mt-5">
          {STEPS.map(step => (
            <div key={step.title} className="glass-panel rounded-2xl px-4 py-3 flex items-center gap-3">
              <span className="text-2xl shrink-0">{step.icon}</span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-on-surface">{step.title}</p>
                <p className="text-xs text-on-surface-variant">{step.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={() => enterApp('WordScene에 오신 것을 환영합니다!')}
          className="glass-capsule w-full h-14 rounded-full mt-6 flex items-center justify-center gap-2 text-on-surface font-extrabold text-base cursor-pointer active:scale-[0.98] transition-transform"
        >
          <span>무료로 시작하기</span>
          <span className="material-symbols-outlined text-xl">auto_awesome</span>
        </button>
        <button
          type="button"
          onClick={() => enterApp('로그인은 다음 단계에서 제공됩니다. 지금은 체험 모드로 시작합니다.')}
          className="w-full py-3 text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
        >
          로그인
        </button>
      </div>
    </div>
  );
};
