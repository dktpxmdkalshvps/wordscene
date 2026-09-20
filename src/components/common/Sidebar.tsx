import React from 'react';
import { useApp } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, reviewItems, user, setShowOnboarding } = useApp();

  const unmasteredCount = reviewItems.filter(r => !r.mastered).length;

  const navItems = [
    { id: 'home', label: '홈', icon: 'home' },
    { id: 'explore', label: '탐색', icon: 'explore' },
    { id: 'learn', label: '학습', icon: 'school' },
    { id: 'review', label: '복습', icon: 'neurology', badge: unmasteredCount > 0 ? unmasteredCount : undefined },
    { id: 'history', label: '기록', icon: 'history' },
  ];

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-full w-60 bg-surface-container-lowest/85 backdrop-blur-xl border-r border-surface-container-high/60 z-50 flex-col justify-between py-6 px-4">
      <div className="flex flex-col gap-6">
        {/* Brand Logo */}
        <div
          className="flex items-center gap-3 px-2 cursor-pointer"
          onClick={() => setActiveTab('home')}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-container via-secondary-fixed to-tertiary-container flex items-center justify-center shadow-[0_4px_12px_rgba(103,232,249,0.45)]">
            <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg text-on-surface tracking-tight leading-none">
              WordScene
            </span>
            <span className="text-[11px] text-secondary font-bold leading-tight mt-1">
              반짝이는 나의 영어 여정
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1.5 mt-2">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center justify-between px-4 py-3 rounded-full transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-container/70 to-secondary-fixed/70 text-on-surface font-bold shadow-[0_4px_16px_-2px_rgba(103,232,249,0.3)]'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`material-symbols-outlined text-xl transition-transform group-hover:scale-110 ${
                      isActive ? 'text-primary' : ''
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="text-sm font-semibold">{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full bg-secondary text-on-secondary text-[11px] font-bold shadow-xs">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Summary Card */}
      <div className="flex flex-col gap-2">
        <div className="p-3.5 rounded-2xl bg-surface-container-low/80 backdrop-blur-md border border-white/60 shadow-[0_4px_16px_-2px_rgba(244,114,182,0.1)] flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setActiveTab('profile')}
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-secondary-container/40 flex items-center justify-center text-on-secondary-container font-extrabold text-sm">
                {user.level}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-primary-container rounded-full border-2 border-surface-container-lowest"></span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-on-surface">{user.name}</span>
              <span className="text-[11px] text-primary font-semibold">{user.totalXp} XP</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('profile')}
              className="p-1.5 rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer"
              title="설정"
            >
              <span className="material-symbols-outlined text-lg">settings</span>
            </button>
            <button
              onClick={() => setShowOnboarding(true)}
              className="p-1.5 rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-secondary transition-colors cursor-pointer"
              title="시작 가이드 / 온보딩"
            >
              <span className="material-symbols-outlined text-lg">help_outline</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
