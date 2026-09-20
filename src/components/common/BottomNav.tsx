import React from 'react';
import { useApp } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, reviewItems, startDailyLesson } = useApp();

  const unmasteredCount = reviewItems.filter(r => !r.mastered).length;

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface-container-lowest/90 backdrop-blur-2xl border-t border-surface-container-high/60 shadow-[0_-4px_24px_rgba(36,0,91,0.06)] pb-safe">
      <div className="max-w-md mx-auto h-18 px-2 flex items-center justify-around">
        {/* Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center gap-0.5 w-14 min-h-[48px] transition-all cursor-pointer ${
            activeTab === 'home' ? 'text-primary font-bold scale-105' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">cottage</span>
          <span className="text-[11px] font-semibold">홈</span>
        </button>

        {/* Explore */}
        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center justify-center gap-0.5 w-14 min-h-[48px] transition-all cursor-pointer ${
            activeTab === 'explore' ? 'text-primary font-bold scale-105' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">explore</span>
          <span className="text-[11px] font-semibold">탐색</span>
        </button>

        {/* Central Prominent Study Action Button */}
        <div className="flex items-center justify-center -mt-6">
          <button
            onClick={() => {
              setActiveTab('learn');
              startDailyLesson();
            }}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary via-primary-container to-secondary flex flex-col items-center justify-center text-on-primary shadow-[0_8px_24px_-2px_rgba(103,232,249,0.6),0_2px_8px_rgba(164,48,115,0.4)] ring-4 ring-surface active:scale-95 transition-all cursor-pointer"
            title="오늘의 학습 시작"
          >
            <span className="material-symbols-outlined text-[24px]">school</span>
            <span className="text-[9px] font-extrabold tracking-tight">학습</span>
          </button>
        </div>

        {/* Review */}
        <button
          onClick={() => setActiveTab('review')}
          className={`flex flex-col items-center justify-center gap-0.5 w-14 min-h-[48px] transition-all relative cursor-pointer ${
            activeTab === 'review' ? 'text-primary font-bold scale-105' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">sync_saved_locally</span>
          <span className="text-[11px] font-semibold">복습</span>
          {unmasteredCount > 0 && (
            <span className="absolute top-1.5 right-2 px-1.5 py-0.2 rounded-full bg-secondary text-on-secondary text-[10px] font-bold shadow-[0_2px_6px_rgba(164,48,115,0.4)]">
              {unmasteredCount}
            </span>
          )}
        </button>

        {/* Profile */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center gap-0.5 w-14 min-h-[48px] transition-all cursor-pointer ${
            activeTab === 'profile' ? 'text-primary font-bold scale-105' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">face</span>
          <span className="text-[11px] font-semibold">프로필</span>
        </button>
      </div>
    </nav>
  );
};
