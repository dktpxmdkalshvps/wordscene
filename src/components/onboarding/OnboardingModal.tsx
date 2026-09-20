import React from 'react';
import { useApp } from '../../context/AppContext';

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
      <h1 id="entry-title" className="sr-only">WordScene, 반짝이는 나의 영어 여정</h1>
      <div className="wordscene-entry__frame">
        <img
          src="/wordscene-entry.png"
          alt="WordScene 마스코트가 반짝이는 책을 들고 있는 시작 화면. 목표 설정, 실력 진단, 매일 10분 학습 계획을 안내합니다."
          className="wordscene-entry__art"
        />
        <button type="button" className="wordscene-entry__start" aria-label="WordScene 무료로 시작하기" onClick={() => enterApp('WordScene에 오신 것을 환영합니다!')} />
        <button type="button" className="wordscene-entry__login" aria-label="로그인" onClick={() => enterApp('로그인은 다음 단계에서 제공됩니다. 지금은 체험 모드로 시작합니다.')} />
      </div>
    </div>
  );
};
