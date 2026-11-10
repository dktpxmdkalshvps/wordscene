import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { speakEnglishText } from '../../utils/speech';
import { getDueDateLabel, getRepetitionStageInfo, isItemDueForReview } from '../../utils/srs';

export const ReviewCenterView: React.FC = () => {
  const {
    reviewItems,
    savedSentences,
    markReviewMastered,
    deleteSavedSentence,
    startReviewSession,
    startRandomSpeedLesson,
    user
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'wrong' | 'saved'>('wrong');
  const [filterWork, setFilterWork] = useState<string>('all');
  const [playingId, setPlayingId] = useState<string | null>(null);

  const unmastered = reviewItems.filter(r => !r.mastered);
  const dueItems = unmastered.filter(isItemDueForReview);

  // Filter works for saved sentences
  const workTitles = ['all', ...Array.from(new Set(savedSentences.map(s => s.workTitle)))];
  const filteredSaved = savedSentences.filter(s =>
    filterWork === 'all' ? true : s.workTitle === filterWork
  );

  const handlePlayTTS = (id: string, text: string) => {
    setPlayingId(id);
    speakEnglishText(text, user.speechRate);
    setTimeout(() => setPlayingId(null), 2000);
  };

  return (
    <div className="w-full max-w-[1040px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
          복습 센터
        </h1>
        <p className="text-sm text-on-surface-variant">
          에빙하우스 망각 곡선(SM-2) 기반 주기별 맞춤 복습과 나만의 문장 아카이브입니다.
        </p>
      </div>

      {/* Sub Tabs: 오답 복습 vs 저장한 문장 */}
      <div className="flex items-center gap-2 p-1.5 rounded-full bg-surface-container-lowest border border-white/80 shadow-xs max-w-sm">
        <button
          onClick={() => setActiveSubTab('wrong')}
          className={`flex-1 py-2 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'wrong'
              ? 'bg-secondary text-on-secondary shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-sm">neurology</span>
          <span>오답 복습</span>
          {unmastered.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-white/30 text-[10px]">
              {dueItems.length > 0 ? `${dueItems.length}개 오늘` : unmastered.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('saved')}
          className={`flex-1 py-2 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'saved'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
            bookmark
          </span>
          <span>저장한 문장</span>
          <span className="px-1.5 py-0.2 rounded-full bg-white/30 text-[10px]">
            {savedSentences.length}
          </span>
        </button>
      </div>

      {/* TAB 1: 오답 복습 큐 (SM-2 에빙하우스) */}
      {activeSubTab === 'wrong' && (
        <div className="space-y-4">
          {/* Action Header Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-secondary-fixed/50 via-surface-container-low to-surface-container-lowest border border-white/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-xl">update</span>
                에빙하우스 주기 복습 ({dueItems.length > 0 ? `오늘 대상 ${dueItems.length}개 / 전체 ${unmastered.length}개` : `전체 ${unmastered.length}개`})
              </h3>
              <p className="text-xs text-on-surface-variant">
                1일 → 6일 → 15일 → 30일 간격으로 복습하여 단기 기억을 영구 장기 기억으로 전환합니다.
              </p>
            </div>

            <button
              onClick={startReviewSession}
              disabled={unmastered.length === 0}
              className={`px-5 py-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                unmastered.length === 0
                  ? 'bg-surface-container-high text-outline cursor-not-allowed'
                  : 'bg-secondary text-on-secondary hover:bg-secondary/90 shadow-xs'
              }`}
            >
              <span className="material-symbols-outlined text-base">play_arrow</span>
              <span>{dueItems.length > 0 ? '오늘 복습 퀴즈 시작' : '오답 전체 복습 시작'}</span>
            </button>
          </div>

          {/* List of Wrong Items */}
          {unmastered.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-surface-container-lowest border border-white/80 space-y-3">
              <span className="material-symbols-outlined text-5xl text-primary">verified</span>
              <h4 className="text-base font-bold text-on-surface">현재 복습할 오답이 모두 해결되었습니다!</h4>
              <p className="text-xs text-on-surface-variant">
                새로운 원서 문장을 탐색하거나 랜덤 스피드 퀴즈로 감각을 유지하세요.
              </p>
              <button
                onClick={startRandomSpeedLesson}
                className="px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-bold cursor-pointer"
              >
                랜덤 퀴즈 풀기
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {unmastered.map(item => {
                const stageInfo = getRepetitionStageInfo(item);
                const dueText = getDueDateLabel(item.nextReviewAt);
                const isDue = isItemDueForReview(item);

                return (
                  <div
                    key={item.id}
                    className={`rounded-3xl p-5 bg-surface-container-lowest border shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-3 ${
                      isDue ? 'border-secondary/40 ring-1 ring-secondary/20' : 'border-white/80'
                    }`}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[11px] font-semibold">
                          {item.workTitle}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${stageInfo.colorClass}`}>
                          {stageInfo.label}
                        </span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        isDue ? 'bg-error-container text-error' : 'bg-surface-container-high text-on-surface-variant'
                      }`}>
                        {dueText}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm sm:text-base font-semibold text-on-surface">
                          {item.english}
                        </p>
                        <button
                          onClick={() => handlePlayTTS(item.id, item.english)}
                          className="p-1.5 rounded-full text-on-surface-variant hover:text-primary transition-colors shrink-0"
                          title="발음 듣기"
                        >
                          <span className="material-symbols-outlined text-lg">volume_up</span>
                        </button>
                      </div>
                      <p className="text-xs text-on-surface-variant">{item.korean}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold">
                          핵심어: {item.highlightWord}
                        </span>
                        <span className="text-[11px] text-on-surface-variant/80">
                          (EF: {item.easinessFactor ?? 2.5})
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-surface-container-high flex justify-end">
                      <button
                        onClick={() => markReviewMastered(item.id)}
                        className="px-3.5 py-1.5 rounded-full bg-surface-container-low text-primary hover:bg-primary-container text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">check</span>
                        <span>숙련 완료 처리 (+15 XP)</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: 저장한 문장 아카이브 (UI-007) */}
      {activeSubTab === 'saved' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {workTitles.map(title => (
              <button
                key={title}
                onClick={() => setFilterWork(title)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  filterWork === title
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {title === 'all' ? '전체 작품' : title}
              </button>
            ))}
          </div>

          {filteredSaved.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-surface-container-lowest border border-white/80 space-y-3">
              <span className="material-symbols-outlined text-5xl text-outline-variant">bookmarks</span>
              <h4 className="text-base font-bold text-on-surface">저장된 문장이 없습니다.</h4>
              <p className="text-xs text-on-surface-variant">
                학습 세션 중 북마크 아이콘을 눌러 기억하고 싶은 아름다운 문장을 저장하세요.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSaved.map(saved => (
                <div
                  key={saved.id}
                  className="rounded-3xl p-5 bg-surface-container-lowest border border-white/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-bold">
                      {saved.workTitle}
                    </span>
                    <span className="text-[11px] text-on-surface-variant">{saved.savedAt}</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm sm:text-base font-semibold text-on-surface leading-relaxed">
                        “{saved.english}”
                      </p>
                      <button
                        onClick={() => handlePlayTTS(saved.id, saved.english)}
                        className={`p-1.5 rounded-full transition-colors shrink-0 ${
                          playingId === saved.id ? 'text-secondary animate-pulse' : 'text-primary'
                        }`}
                        title="발음 듣기"
                      >
                        <span className="material-symbols-outlined text-lg">volume_up</span>
                      </button>
                    </div>
                    <p className="text-xs text-on-surface-variant">{saved.korean}</p>
                    <p className="text-[11px] text-on-surface-variant/80">{saved.author}</p>
                  </div>

                  <div className="pt-2 border-t border-surface-container-high flex justify-end">
                    <button
                      onClick={() => deleteSavedSentence(saved.id)}
                      className="text-xs text-on-surface-variant hover:text-error transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">bookmark_remove</span>
                      <span>보관 해제</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
