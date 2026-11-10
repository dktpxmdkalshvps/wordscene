import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminReviewPanel } from './AdminReviewPanel';

export const ProfileView: React.FC = () => {
  const { user, updateUserProfile, resetDemoData, setShowOnboarding } = useApp();

  const [name, setName] = useState(user.name);
  const [dailyMinutes, setDailyMinutes] = useState(user.targetDailyMinutes);
  const [soundEnabled, setSoundEnabled] = useState(user.soundEnabled);
  const [speechRate, setSpeechRate] = useState(user.speechRate);
  const [showAdminReview, setShowAdminReview] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      targetDailyMinutes: dailyMinutes,
      soundEnabled,
      speechRate
    });
  };

  return (
    <div className="w-full max-w-[800px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
          프로필 & 학습 설정
        </h1>
        <p className="text-sm text-on-surface-variant">
          학습 목표 시간, 발음 속도, 인터페이스 설정을 관리합니다.
        </p>
      </div>

      {/* User Info Header Card */}
      <div className="p-6 rounded-3xl bg-surface-container-lowest border border-white/80 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTJsvbOw3slgKmURAAFJ1tcP7aycW29UHNU9KeDSGICxNBSC6Y1IJm_WNb9pYmEQaTGkvs7m7_uhgjj8btipfXOOj80E6nX6-qC7ffVCwAQyzUBJj2ebjCgiF35H333gXlAfom4qLL5X0_w-VjbPCeujndboagTpr_4wkK9rFi-avrNkfjLZGSUdAQMmFOy1xOThTJaT1_PgrvgP__0Yel3GXUGyeReOYE72WagxJRtKeFyk9egbKpDg"
          alt="프로필 이미지"
          className="w-20 h-20 rounded-full object-cover ring-4 ring-primary-container shadow-md"
        />

        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-extrabold text-on-surface">{user.name}</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold">
              {user.levelTitle}
            </span>
          </div>

          <p className="text-xs text-on-surface-variant">
            영어 문학 원서와 미디어로 매일 성장하고 있는 언어 탐험가입니다.
          </p>

          <div className="flex items-center justify-center sm:justify-start gap-3 pt-2">
            <span className="text-xs font-bold text-primary">
              레벨 {user.level} · {user.totalXp} XP
            </span>
            <span className="text-xs font-bold text-secondary">
              🔥 {user.streakDays}일 연속 학습
            </span>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-5">
        {/* Daily Goal Setting */}
        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-white/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">timer</span>
            일일 학습 목표 시간
          </h3>

          <div className="grid grid-cols-4 gap-2.5">
            {[5, 10, 15, 20].map(mins => (
              <button
                type="button"
                key={mins}
                onClick={() => setDailyMinutes(mins)}
                className={`py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  dailyMinutes === mins
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                매일 {mins}분
              </button>
            ))}
          </div>
          <p className="text-xs text-on-surface-variant">
            권장: 바쁜 일상 속에서도 꾸준히 지속할 수 있는 <span className="text-primary font-bold">매일 10분 집중 학습</span>을 추천해요.
          </p>
        </div>

        {/* Audio & Pronunciation Settings */}
        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-white/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-xl">volume_up</span>
            발음 및 오디오 설정
          </h3>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-bold text-on-surface">원어민 발음 자동 재생</p>
              <p className="text-xs text-on-surface-variant">새로운 문장 제시 시 음성을 자동으로 들려줍니다.</p>
            </div>
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${
                soundEnabled ? 'bg-primary' : 'bg-surface-container-high'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>

          {/* Speech Rate */}
          <div className="space-y-2 pt-2 border-t border-surface-container-high">
            <p className="text-xs font-bold text-on-surface">음성 재생 속도</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '느리게 (0.75x)', val: 0.75 },
                { label: '보통 (0.9x)', val: 0.9 },
                { label: '표준 (1.0x)', val: 1.0 }
              ].map(rate => (
                <button
                  type="button"
                  key={rate.val}
                  onClick={() => setSpeechRate(rate.val)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    speechRate === rate.val
                      ? 'bg-secondary text-on-secondary shadow-xs'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {rate.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full h-14 rounded-full bg-primary text-on-primary font-bold text-sm shadow-md hover:bg-primary/90 transition-all cursor-pointer"
        >
          설정 저장하기
        </button>
      </form>

      {/* Extra Action Buttons (Onboarding & Reset) */}
      <div className="p-6 rounded-3xl bg-surface-container-lowest border border-white/80 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-on-surface">가이드 및 초기화</h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => setShowOnboarding(true)}
            className="flex-1 py-3 rounded-full bg-surface-container-low text-on-surface text-xs font-bold hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">auto_awesome</span>
            <span>첫 시작 온보딩 화면 보기</span>
          </button>

          <button
            type="button"
            onClick={resetDemoData}
            className="flex-1 py-3 rounded-full bg-surface-container-low text-error text-xs font-bold hover:bg-error-container/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">restart_alt</span>
            <span>모든 체험 데이터 삭제 후 처음부터 시작</span>
          </button>
        </div>
      </div>

      {/* Admin Section */}
      <div className="p-6 rounded-3xl bg-surface-container-lowest border border-white/80 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-on-surface">관리자</h3>
        <button
          type="button"
          onClick={() => setShowAdminReview(true)}
          className="w-full py-3 rounded-full bg-surface-container-low text-on-surface text-xs font-bold hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">fact_check</span>
          <span>관리자 검수</span>
        </button>
      </div>

      {showAdminReview && <AdminReviewPanel onClose={() => setShowAdminReview(false)} />}
    </div>
  );
};
