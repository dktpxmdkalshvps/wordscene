import React from 'react';
import { useApp } from '../../context/AppContext';

export const Header: React.FC = () => {
  const { user, setActiveTab, showToast, setShowOnboarding } = useApp();

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-surface/85 backdrop-blur-xl border-b border-surface-container-high/60 lg:left-60">
      <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 max-w-[1360px] mx-auto">
        {/* Left: Mobile Brand & Language */}
        <div className="flex items-center gap-2.5">
          {/* Mobile brand (hidden on desktop where sidebar has brand) */}
          <div
            className="flex lg:hidden items-center gap-2 cursor-pointer"
            onClick={() => setActiveTab('home')}
            role="button"
            tabIndex={0}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-container via-secondary-container to-tertiary-container flex items-center justify-center shadow-[0_2px_8px_rgba(103,232,249,0.5)]">
              <span className="material-symbols-outlined text-on-surface text-[18px]">auto_awesome</span>
            </div>
            <span className="font-extrabold text-[17px] text-on-surface tracking-tight">WordScene</span>
          </div>

          {/* Language badge */}
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-xs border border-white/50 text-xs font-semibold text-on-surface">
            <span>{user.selectedLanguage}</span>
          </div>
        </div>

        {/* Right: Gamification Badges & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak pill */}
          <button
            onClick={() => setActiveTab('history')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-xs border border-secondary-fixed/50 hover:bg-secondary-fixed/20 transition-all cursor-pointer"
            title="연속 학습 기록 보기"
          >
            <span className="text-sm">🔥</span>
            <span className="text-xs font-bold text-secondary">{user.streakDays}일 연속</span>
          </button>

          {/* XP pill */}
          <button
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-xs border border-primary-fixed/50 hover:bg-primary-container/20 transition-all cursor-pointer"
            title="경험치 및 레벨 보기"
          >
            <span className="text-sm">✨</span>
            <span className="text-xs font-bold text-primary">{user.totalXp} XP</span>
          </button>

          {/* Notification icon */}
          <button
            onClick={() => showToast('새로운 주간 챌린지가 도착했습니다! 🌟')}
            className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors relative cursor-pointer"
            title="알림"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-secondary ring-2 ring-surface"></span>
          </button>

          {/* Profile Avatar / Onboarding guide trigger */}
          <div
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2 cursor-pointer group"
            title="내 프로필"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTJsvbOw3slgKmURAAFJ1tcP7aycW29UHNU9KeDSGICxNBSC6Y1IJm_WNb9pYmEQaTGkvs7m7_uhgjj8btipfXOOj80E6nX6-qC7ffVCwAQyzUBJj2ebjCgiF35H333gXlAfom4qLL5X0_w-VjbPCeujndboagTpr_4wkK9rFi-avrNkfjLZGSUdAQMmFOy1xOThTJaT1_PgrvgP__0Yel3GXUGyeReOYE72WagxJRtKeFyk9egbKpDg"
              alt="프로필 사진"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-container/80 shadow-sm group-hover:scale-105 transition-transform"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
