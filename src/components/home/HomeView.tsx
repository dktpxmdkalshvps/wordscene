import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getPreviewSentence } from '../../lib/contentService';
import { speakEnglishText } from '../../utils/speech';

const LIBRARY_SCENE_IMAGE =
  'https://polyfork.dev/files/library-book-stack-double-ce8d7f/renders/hero.png';

export const HomeView: React.FC = () => {
  const {
    user,
    todayStatus,
    setTodayStatus,
    works,
    questionsByWork,
    reviewItems,
    savedSentences,
    weeklyStats,
    startDailyLesson,
    startWorkLesson,
    startRandomSpeedLesson,
    startReviewSession,
    setActiveTab,
    showToast,
    setSelectedWorkDetail
  } = useApp();

  const [cinemaAlerted, setCinemaAlerted] = useState(false);
  const [musicAlerted, setMusicAlerted] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const unmasteredReviews = reviewItems.filter(r => !r.mastered);

  // The same work/question startDailyLesson would actually open
  const currentWork = works.find(w => !w.isLocked) ?? works[0];
  const currentQuestion = currentWork ? questionsByWork[currentWork.id]?.[0] : undefined;
  const currentPreview = currentWork ? getPreviewSentence(questionsByWork, currentWork.id) : null;

  // Play audio sentence
  const handlePlayAudio = () => {
    if (!currentPreview) return;
    setIsPlayingAudio(true);
    speakEnglishText(currentPreview.english, user.speechRate);
    setTimeout(() => setIsPlayingAudio(false), 2200);
  };

  // Main CTA configuration by state
  const getCtaConfig = () => {
    if (todayStatus === 'not_started') {
      return {
        badge: '당일 미시작',
        badgeClass: 'bg-surface-container-high text-on-surface-variant',
        progressText: '오늘의 목표 10문장 대기 중',
        percent: '0%',
        progressWidth: '4%',
        ctaText: '오늘의 학습 시작하기',
        helperText: '새로운 10개의 명작 문장이 준비되어 있습니다.',
        action: startDailyLesson,
        btnGradient: 'bg-primary text-on-primary hover:bg-[#005b63]'
      };
    }
    if (todayStatus === 'completed') {
      return {
        badge: '오늘 분량 완료',
        badgeClass: 'bg-tertiary-fixed text-on-tertiary-fixed font-bold',
        progressText: '10/10 완료 달성! +50 XP 획득',
        percent: '100%',
        progressWidth: '100%',
        ctaText: '오늘 학습 복습하기 (오답 체크)',
        helperText: '오늘 목표를 모두 완주하셨습니다! 복습으로 완벽히 기억해보세요.',
        action: startReviewSession,
        btnGradient: 'bg-secondary text-on-secondary hover:bg-[#8e2864]'
      };
    }
    // in_progress (default)
    return {
      badge: '세션 진행 중',
      badgeClass: 'bg-secondary-fixed text-on-secondary-fixed font-bold',
      progressText: '10개 중 4개 완료 · 약 3분 남음',
      percent: '40%',
      progressWidth: '40%',
      ctaText: '이어서 학습하기 (4/10)',
      helperText: '저장된 문장 위치에서 바로 재개됩니다. 3분 뒤 복습 주기에 반영돼요.',
      action: startDailyLesson,
      btnGradient: 'bg-primary text-on-primary hover:bg-[#005b63]'
    };
  };

  const ctaConfig = getCtaConfig();

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col xl:flex-row gap-6">
      {/* Main Column */}
      <div className="flex-1 min-w-0 flex flex-col space-y-6">
        
        {/* State Engine Simulator Banner */}
        <section className="hidden relative w-full rounded-2xl p-4 overflow-hidden bg-gradient-to-r from-primary-container/30 via-secondary-container/20 to-tertiary-container/30 backdrop-blur-xl border border-white/60 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
              </span>
              <span className="text-xs font-bold text-on-surface tracking-tight">상태 엔진 시뮬레이터</span>
              <span className="text-[11px] text-on-surface-variant hidden sm:inline">(원클릭으로 3가지 사용자 상태 테스트)</span>
            </div>

            {/* Dynamic State Simulator Tabs (Section 5.1 & 5.2) */}
            <div className="flex items-center bg-surface-container-lowest/90 rounded-full p-1 shadow-xs border border-white/80">
              <button
                onClick={() => setTodayStatus('not_started')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  todayStatus === 'not_started'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                미시작
              </button>
              <button
                onClick={() => setTodayStatus('in_progress')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  todayStatus === 'in_progress'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                진행 중
              </button>
              <button
                onClick={() => setTodayStatus('completed')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  todayStatus === 'completed'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                완료
              </button>
            </div>
          </div>
        </section>

        {/* Hero Daily Lesson Card (Section 5.1 & 5.2) */}
        <section className="relative w-full rounded-[1.5rem] p-5 sm:p-7 bg-white border border-[#dce5e4] shadow-[0_10px_30px_rgba(32,55,58,0.06)] overflow-hidden">

          <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-stretch">
            <div className="min-w-0">

          {/* Header Meta of Lesson Card */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-[#e5f3f0] text-[#176b68] text-xs font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px]">auto_stories</span>
                <span>원서 낭독 회차</span>
              </span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${ctaConfig.badgeClass}`}>
                {ctaConfig.badge}
              </span>
            </div>
            <div className="flex items-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
                stars
              </span>
              <span className="text-xs font-bold ml-1 text-tertiary">+45 XP 보너스</span>
            </div>
          </div>

          {/* Work Title & Author Context */}
          <div className="space-y-1 mb-5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-xl">bookmark_heart</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight">
                {currentWork?.koreanTitle ?? '학습 준비 중'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-on-surface-variant pl-7">
              {currentWork?.author}
              {currentQuestion?.sourceContext ? ` · ${currentQuestion.sourceContext}` : ''}
            </p>
          </div>

          {/* Sentence Focus Card with Holographic Tint */}
          <div className="relative rounded-xl p-5 bg-[#f6f8f6] border border-[#e5ecea] mb-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <span className="material-symbols-outlined text-primary text-2xl mt-0.5 shrink-0">format_quote</span>
                <div className="space-y-2 flex-1 min-w-0">
                  {currentPreview ? (
                    <>
                      <p className="text-base sm:text-lg text-on-surface font-semibold leading-relaxed break-words">
                        “{currentPreview.english}”
                      </p>
                      <p className="text-xs sm:text-sm text-on-surface-variant font-medium">
                        {currentPreview.korean}
                      </p>
                      {currentQuestion?.explanation && (
                        <p className="text-xs text-on-surface-variant/80 leading-relaxed pt-1">
                          {currentQuestion.explanation}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-on-surface-variant">학습 콘텐츠를 불러오는 중입니다...</p>
                  )}
                </div>
              </div>

              {/* TTS Voice Pronunciation Button */}
              <button
                onClick={handlePlayAudio}
                className={`p-2.5 rounded-full transition-all shrink-0 cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-secondary text-on-secondary scale-110 shadow-md animate-pulse'
                    : 'bg-white border border-[#dce5e4] text-primary hover:bg-[#e5f3f0] hover:text-on-primary-container'
                }`}
                title="원어민 발음 듣기"
              >
                <span className="material-symbols-outlined text-xl">volume_up</span>
              </button>
            </div>
          </div>

          {/* Progress Status Gauge */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between items-center text-xs font-bold text-on-surface-variant">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">timelapse</span>
                {ctaConfig.progressText}
              </span>
              <span className="font-extrabold text-primary">{ctaConfig.percent}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#e7eeec] overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: ctaConfig.progressWidth }}
              ></div>
            </div>
          </div>

          {/* Giant Single CTA: Strictly 52px+ and Aligned with "한 화면 한 행동" */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={ctaConfig.action}
              className={`w-full min-h-[54px] py-4 px-6 rounded-xl font-extrabold text-base sm:text-lg shadow-sm hover:shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 relative overflow-hidden group cursor-pointer ${ctaConfig.btnGradient}`}
            >
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                play_circle
              </span>
              <span className="tracking-tight">{ctaConfig.ctaText}</span>
              <span className="material-symbols-outlined text-xl transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </button>
            <span className="text-xs text-on-surface-variant text-center font-medium">
              {ctaConfig.helperText}
            </span>
          </div>
            </div>

            <aside className="relative hidden min-h-[20rem] overflow-hidden rounded-[1.25rem] bg-[#edf4f1] border border-[#dce5e4] lg:block">
              <img
                src={LIBRARY_SCENE_IMAGE}
                alt="책 더미가 놓인 작은 서재 장면"
                className="absolute inset-0 h-full w-full object-cover object-center mix-blend-multiply opacity-75 transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-x-3 bottom-3 rounded-xl border border-white/80 bg-white/95 p-3 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-primary">
                    Today&apos;s shelf
                  </span>
                  <span className="material-symbols-outlined text-base text-secondary" aria-hidden="true">
                    auto_stories
                  </span>
                </div>
                <p className="mt-1 text-xs font-bold leading-relaxed text-on-surface">
                  한 문장씩, 나만의 영어 서재를 채워요.
                </p>
                <p className="mt-1 text-[9px] text-on-surface-variant">
                  3D asset: Polyfork · CC BY 4.0
                </p>
              </div>
            </aside>
          </div>
        </section>

        {/* Section 5.3 빠른 학습 4대 카드 (Quick Actions Bento) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-xl text-secondary">flash_on</span>
              <h3 className="text-base sm:text-lg font-bold text-on-surface">빠른 집중 학습</h3>
            </div>
            <span className="text-xs text-on-surface-variant font-medium">단기 기억 강화 도구</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Card 1: 오답 복습 */}
            <div
              onClick={() => {
                setActiveTab('review');
              }}
              role="button"
              tabIndex={0}
              className="group relative rounded-xl p-4 bg-white border border-[#dce5e4] hover:border-primary/50 hover:shadow-sm active:scale-95 transition-all flex flex-col justify-between cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-[#f8e8e8] flex items-center justify-center">
                  <span className="material-symbols-outlined text-error text-[22px]">heart_broken</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-error text-on-error text-[11px] font-bold shadow-xs">
                  {unmasteredReviews.length}개 대기
                </span>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-extrabold text-on-surface group-hover:text-primary transition-colors">
                  오답 복습
                </h4>
                <p className="text-xs text-on-surface-variant mt-0.5">틀렸던 표현 재도전</p>
              </div>
            </div>

            {/* Card 2: 저장한 문장 */}
            <div
              onClick={() => setActiveTab('review')}
              role="button"
              tabIndex={0}
              className="group relative rounded-xl p-4 bg-white border border-[#dce5e4] hover:border-primary/50 hover:shadow-sm active:scale-95 transition-all flex flex-col justify-between cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-[#f5e8ef] flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    bookmarks
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-secondary text-on-secondary text-[11px] font-bold shadow-xs">
                  {savedSentences.length}개
                </span>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-extrabold text-on-surface group-hover:text-secondary transition-colors">
                  저장한 문장
                </h4>
                <p className="text-xs text-on-surface-variant mt-0.5">내 단어장 보관함</p>
              </div>
            </div>

            {/* Card 3: 랜덤 스피드 문장 */}
            <div
              onClick={startRandomSpeedLesson}
              role="button"
              tabIndex={0}
              className="group relative rounded-xl p-4 bg-white border border-[#dce5e4] hover:border-primary/50 hover:shadow-sm active:scale-95 transition-all flex flex-col justify-between cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-[#f4efcf] flex items-center justify-center">
                  <span className="material-symbols-outlined text-tertiary text-[22px]">timer</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed-dim text-on-tertiary-fixed text-[11px] font-bold">
                  1분 스피드
                </span>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-extrabold text-on-surface group-hover:text-primary transition-colors">
                  랜덤 문장 퀴즈
                </h4>
                <p className="text-xs text-on-surface-variant mt-0.5">감각 유지용 즉시 풀이</p>
              </div>
            </div>

            {/* Card 4: 전체 서재 */}
            <div
              onClick={() => setActiveTab('explore')}
              role="button"
              tabIndex={0}
              className="group relative rounded-xl p-4 bg-white border border-[#dce5e4] hover:border-primary/50 hover:shadow-sm active:scale-95 transition-all flex flex-col justify-between cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-[#e5f3f0] flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[22px]">library_books</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary text-[11px] font-bold">
                  원서 24편
                </span>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-extrabold text-on-surface group-hover:text-primary transition-colors">
                  전체 서재
                </h4>
                <p className="text-xs text-on-surface-variant mt-0.5">난이도별 탐색하기</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5.1 #5 이번 주 학습 현황 (Weekly Attendance & Performance) */}
        <section className="rounded-2xl p-6 bg-white border border-[#dce5e4] shadow-[0_8px_24px_rgba(32,55,58,0.05)] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-secondary-container/40 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary text-xl">calendar_month</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-on-surface">이번 주 달성도</h3>
                <p className="text-xs text-on-surface-variant">목표 달성률 85% 돌파!</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-extrabold text-secondary">{user.streakDays}일 연속</span>
            </div>
          </div>

          {/* Weekday Stamp Badges */}
          <div className="grid grid-cols-7 gap-2 pt-1">
            {weeklyStats.map((stat, idx) => (
              <div key={idx} className={`flex flex-col items-center gap-1.5 ${!stat.isCompleted && !stat.isToday ? 'opacity-60' : ''}`}>
                <span className={`text-xs font-semibold ${stat.isToday ? 'text-secondary font-extrabold' : 'text-on-surface-variant'}`}>
                  {stat.dayName}
                </span>
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    stat.isToday
                      ? 'bg-secondary text-on-secondary shadow-sm ring-2 ring-secondary/20'
                      : stat.isCompleted
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  {stat.isToday ? (
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  ) : stat.isCompleted ? (
                    <span className="material-symbols-outlined text-lg">check</span>
                  ) : (
                    <span className="text-xs font-semibold">{idx + 1}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stat Metre Dual Pills */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-surface-container-low flex items-center gap-3 border border-white/40">
              <div className="w-8 h-8 rounded-full bg-primary-container/40 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-lg">verified</span>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant font-medium">누적 완료 문장</p>
                <p className="text-base font-extrabold text-on-surface">28문장</p>
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-surface-container-low flex items-center gap-3 border border-white/40">
              <div className="w-8 h-8 rounded-full bg-secondary-container/40 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-lg">target</span>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant font-medium">퀴즈 정답률</p>
                <p className="text-base font-extrabold text-on-surface">92%</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 8 작품별 세로 학습 경로 (Stage Path Nodes) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-on-surface">원서 모험 여정</h3>
              <p className="text-xs text-on-surface-variant">스토리 라인을 따라 레벨업 하세요</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold shadow-xs">
              스테이지 맵
            </span>
          </div>

          {/* Vertical Path Container */}
          <div className="relative pl-6 space-y-6">
            {/* Connected Vertical Dotted Line */}
            <div className="absolute left-[39px] top-6 bottom-8 w-1 pointer-events-none">
              <div className="w-full h-full border-l-2 border-dashed border-outline-variant/60"></div>
            </div>

            {/* Path Node 1: The Happy Prince (Active Current) */}
            <div className="relative flex items-start gap-4">
              <div className="relative z-10 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm ring-4 ring-surface shrink-0">
                <span className="material-symbols-outlined text-2xl">menu_book</span>
              </div>
              <div className="flex-1 rounded-xl p-4 sm:p-5 bg-white border border-[#dce5e4] shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-1">
                  <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold">
                    초급 · 진행 중
                  </span>
                  <span className="text-xs font-bold text-primary">Stage 1</span>
                </div>
                <h4 className="text-base font-bold text-on-surface">The Happy Prince</h4>
                <p className="text-xs text-on-surface-variant mt-0.5">총 10개 세션 중 4번째 완료 중</p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-surface-container-high overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '40%' }}></div>
                  </div>
                  <span className="text-xs text-primary font-bold">40%</span>
                  <button
                    onClick={startDailyLesson}
                    className="px-3 py-1 rounded-full bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition-colors cursor-pointer"
                  >
                    이어서
                  </button>
                </div>
              </div>
            </div>

            {/* Path Node 2: Alice in Wonderland (Ready Challenge) */}
            <div className="relative flex items-start gap-4">
              <div className="relative z-10 w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-secondary shadow-sm ring-4 ring-surface shrink-0">
                <span className="material-symbols-outlined text-2xl">lock_open</span>
              </div>
              <div className="flex-1 rounded-xl p-4 sm:p-5 bg-white border border-[#dce5e4] shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-1">
                  <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold">
                    중급 · 도전 가능
                  </span>
                  <div className="flex text-tertiary">
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  </div>
                </div>
                <h4 className="text-base font-bold text-on-surface">Alice in Wonderland</h4>
                <p className="text-xs text-on-surface-variant mt-0.5">신비한 원더랜드 대화문 마스터</p>
                <button
                  onClick={() => {
                    const sherlock = works.find(w => /sherlock/i.test(w.title)) ?? works[1];
                    if (sherlock) startWorkLesson(sherlock);
                  }}
                  className="mt-3 w-full py-2.5 rounded-full bg-surface-container-high text-on-surface text-xs font-bold hover:bg-secondary-fixed transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>도전하기</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>
            </div>

            {/* Path Node 3: The Great Gatsby (Locked) */}
            <div className="relative flex items-start gap-4 opacity-75">
              <div className="relative z-10 w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant ring-4 ring-surface shrink-0">
                <span className="material-symbols-outlined text-xl">lock</span>
              </div>
              <div
                onClick={() => showToast('레벨 5 달성 시 오픈되는 고급 스테이지입니다. (현재 Lv.4)')}
                className="flex-1 rounded-xl p-4 sm:p-5 bg-[#f6f8f6] border border-[#e5ecea] cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant text-xs font-bold">
                    고급 · 잠김
                  </span>
                  <span className="text-xs text-on-surface-variant font-bold">Lv.5 오픈</span>
                </div>
                <h4 className="text-base font-bold text-on-surface-variant">The Great Gatsby</h4>
                <p className="text-xs text-on-surface-variant mt-0.5">화려한 어휘와 은유적 문장 트레이닝</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 9 미디어 확장 컬렉션 (Books & Cinema Quotes) */}
        <section className="space-y-3 pb-8">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-xl text-primary">movie_filter</span>
              <h3 className="text-base sm:text-lg font-bold text-on-surface">미디어 확장 컬렉션</h3>
            </div>
            <button
              onClick={() => setActiveTab('explore')}
              className="text-xs text-primary font-bold hover:underline cursor-pointer"
            >
              더보기
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Media Card 1: 명작 문학관 */}
            <div
              onClick={() => setActiveTab('explore')}
              className="rounded-xl p-4 bg-white border border-[#dce5e4] shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-20 rounded-xl bg-primary-container/30 shrink-0 flex flex-col items-center justify-center text-primary shadow-inner">
                <span className="material-symbols-outlined text-[28px]">local_library</span>
                <span className="text-[10px] font-bold mt-1">CLASSIC</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary text-[11px] font-bold">
                  24권 학습 가능
                </span>
                <h4 className="text-sm font-bold text-on-surface mt-1 truncate">영미 고전 오디오북 원서</h4>
                <p className="text-xs text-on-surface-variant line-clamp-1 mt-0.5">
                  원어민 발음 쉐도잉 및 실시간 어휘 해설
                </p>
              </div>
            </div>

            {/* Media Card 2: 영화 명대사관 */}
            <div className="rounded-xl p-4 bg-white border border-[#dce5e4] shadow-sm flex items-center gap-4 relative overflow-hidden">
              <div className="w-16 h-20 rounded-xl bg-secondary-fixed/50 shrink-0 flex flex-col items-center justify-center text-secondary shadow-inner">
                <span className="material-symbols-outlined text-[28px]">theaters</span>
                <span className="text-[10px] font-bold mt-1">CINEMA</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-secondary text-on-secondary text-[11px] font-bold">
                    준비 중
                  </span>
                  <span className="text-[11px] text-secondary font-bold">12월 공개</span>
                </div>
                <h4 className="text-sm font-bold text-on-surface mt-1 truncate">헐리우드 영화 명대사</h4>
                <p className="text-xs text-on-surface-variant line-clamp-1 mt-0.5">
                  생생한 구어체 표현과 위트 있는 표현집
                </p>
              </div>
              <button
                onClick={() => {
                  setCinemaAlerted(!cinemaAlerted);
                  showToast(cinemaAlerted ? '알림 예약을 취소했습니다.' : '영화 명대사 오픈 알림이 예약되었습니다! 🔔');
                }}
                className={`min-h-[40px] px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-all shrink-0 cursor-pointer ${
                  cinemaAlerted
                    ? 'bg-secondary text-on-secondary shadow-xs'
                    : 'bg-surface-container-high text-on-surface hover:bg-secondary-fixed'
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {cinemaAlerted ? 'check' : 'notifications'}
                </span>
                <span>{cinemaAlerted ? '예약됨' : '알림 받기'}</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Desktop Right Auxiliary Sidebar (>=1200px) */}
      <aside className="w-full xl:w-[280px] shrink-0 flex flex-col gap-5">
        {/* Consecutive Streak Widget */}
        <div className="p-5 rounded-xl bg-white border border-[#dce5e4] shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-xl">local_fire_department</span>
              연속 학습 스트릭
            </span>
            <span className="text-xs text-secondary font-bold">{user.streakDays}일째</span>
          </div>
          <p className="text-xs text-on-surface-variant">오늘 학습을 완료하고 4일 연속 배지를 획득하세요!</p>
          <div className="flex justify-between items-center pt-1">
            {['월', '화', '수', '목', '금'].map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    i < user.streakDays
                      ? 'bg-primary-container text-on-primary-container'
                      : 'bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  {day}
                </div>
                {i < user.streakDays ? (
                  <span className="material-symbols-outlined text-primary text-xs">check_circle</span>
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-outline-variant mt-1"></span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Goal */}
        <div className="p-5 rounded-xl bg-white border border-[#dce5e4] shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">flag</span>
              주간 목표
            </span>
            <span className="text-xs text-primary font-bold">70%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
            <div className="h-full rounded-full bg-primary w-[70%]"></div>
          </div>
          <div className="flex justify-between items-center text-on-surface-variant text-xs font-medium">
            <span>35 / 50 단어 완성</span>
            <span className="text-secondary font-bold">15개 남음</span>
          </div>
        </div>

        {/* Review Queue Card */}
        <div className="p-5 rounded-xl bg-white border border-[#dce5e4] shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary text-xl">schedule</span>
              복습 대기열
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-bold">
              {unmasteredReviews.length} 단어
            </span>
          </div>
          <p className="text-xs text-on-surface-variant">에빙하우스 망각 곡선 주기에 도달한 복습 단어가 기다리고 있어요.</p>
          <button
            onClick={startReviewSession}
            className="w-full py-2.5 px-4 rounded-lg bg-primary text-on-primary text-xs font-bold text-center shadow-sm hover:bg-[#005b63] transition-colors cursor-pointer"
          >
            지금 바로 복습하기
          </button>
        </div>
      </aside>
    </div>
  );
};
