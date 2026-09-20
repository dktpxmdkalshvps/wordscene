import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Work, Difficulty, MediaCategory } from '../../types';
import { getPreviewSentence } from '../../lib/contentService';

export const ExploreView: React.FC = () => {
  const { works, questionsByWork, startWorkLesson, showToast, exploreCategory, setExploreCategory } = useApp();
  const selectedCategory = exploreCategory;
  const setSelectedCategory = setExploreCategory;
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalWork, setActiveModalWork] = useState<Work | null>(null);

  const categories = [
    { id: 'all', label: '전체' },
    { id: 'books', label: '📖 클래식 도서' },
    { id: 'cinema', label: '🎬 영화 명대사' },
    { id: 'music', label: '🎵 팝송 가사' }
  ];

  const difficulties: { id: string; label: string }[] = [
    { id: 'all', label: '전체 난이도' },
    { id: '초급', label: '초급' },
    { id: '중급', label: '중급' },
    { id: '고급', label: '고급' }
  ];

  const filteredWorks = works.filter(w => {
    if (selectedCategory !== 'all' && w.category !== selectedCategory) return false;
    if (selectedDifficulty !== 'all' && w.difficulty !== selectedDifficulty) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        w.title.toLowerCase().includes(q) ||
        w.koreanTitle.toLowerCase().includes(q) ||
        w.author.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="w-full max-w-[1140px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Title & Description */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
          원서 & 미디어 서재 탐색
        </h1>
        <p className="text-sm text-on-surface-variant">
          50개 이상의 검증된 명작과 매력적인 대화문에서 실전 영어를 경험하세요.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative w-full max-w-xl">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="작품명, 작가, 키워드를 검색해보세요..."
          className="w-full h-12 pl-12 pr-4 rounded-full bg-surface-container-lowest/90 border border-white/80 shadow-xs text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary-container"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        )}
      </div>

      {/* Filter Chips Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-surface-container-high">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container-lowest/80 text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-1.5">
          {difficulties.map(diff => (
            <button
              key={diff.id}
              onClick={() => setSelectedDifficulty(diff.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedDifficulty === diff.id
                  ? 'bg-secondary-fixed text-on-secondary-fixed font-bold'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {diff.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Works */}
      {filteredWorks.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
          <span className="material-symbols-outlined text-5xl text-outline-variant">menu_book</span>
          <p className="text-base font-bold text-on-surface">검색 결과가 없습니다.</p>
          <p className="text-xs text-on-surface-variant">다른 키워드나 필터 조건을 선택해보세요.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedDifficulty('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-bold cursor-pointer"
          >
            필터 초기화
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWorks.map(work => {
            const progressPercent = Math.round((work.completedSentences / work.totalSentences) * 100);

            return (
              <div
                key={work.id}
                className="rounded-3xl p-5 bg-surface-container-lowest/90 backdrop-blur-xl border border-white/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4 group relative"
              >
                {/* Top Badge & Stage Tag */}
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      work.difficulty === '초급'
                        ? 'bg-primary-fixed text-on-primary-fixed'
                        : work.difficulty === '중급'
                        ? 'bg-secondary-fixed text-on-secondary-fixed'
                        : 'bg-tertiary-fixed text-on-tertiary-fixed'
                    }`}
                  >
                    {work.difficulty}
                  </span>

                  {work.isLocked ? (
                    <span className="flex items-center gap-1 text-xs text-on-surface-variant font-bold">
                      <span className="material-symbols-outlined text-sm">lock</span>
                      잠김
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-primary">
                      {work.completedSentences} / {work.totalSentences} 완료
                    </span>
                  )}
                </div>

                {/* Cover & Info */}
                <div className="flex items-start gap-4">
                  <img
                    src={work.coverImage}
                    alt={work.title}
                    className="w-20 h-24 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-extrabold text-on-surface truncate group-hover:text-primary transition-colors">
                      {work.koreanTitle}
                    </h3>
                    {work.title !== work.koreanTitle && (
                      <p className="text-xs font-semibold text-secondary truncate">{work.title}</p>
                    )}
                    <p className="text-xs text-on-surface-variant mt-1 line-clamp-1">{work.author}</p>
                    <p className="text-xs text-on-surface-variant/80 mt-1 line-clamp-2 leading-relaxed">
                      {work.description}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1 pt-1">
                  <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary via-primary-container to-secondary"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-surface-container-high/60">
                  <button
                    onClick={() => setActiveModalWork(work)}
                    className="flex-1 py-2 rounded-full bg-surface-container-low text-on-surface text-xs font-bold hover:bg-surface-container-high transition-colors cursor-pointer"
                  >
                    작품 상세
                  </button>

                  <button
                    onClick={() => startWorkLesson(work)}
                    className={`flex-1 py-2 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      work.isLocked
                        ? 'bg-surface-container-high text-outline'
                        : 'bg-primary text-on-primary hover:bg-primary/90 shadow-xs'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {work.isLocked ? 'lock' : 'play_arrow'}
                    </span>
                    <span>
                      {work.isLocked
                        ? '잠김'
                        : work.completedSentences === 0
                        ? '학습 시작'
                        : '이어서 학습'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Work Detail Modal */}
      {activeModalWork && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg rounded-3xl bg-surface-container-lowest border border-white/90 shadow-2xl p-6 space-y-5">
            <button
              onClick={() => setActiveModalWork(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>

            <div className="flex items-start gap-4">
              <img
                src={activeModalWork.coverImage}
                alt={activeModalWork.title}
                className="w-24 h-32 rounded-2xl object-cover shadow-md"
              />
              <div className="flex-1 min-w-0">
                <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold">
                  {activeModalWork.difficulty}
                </span>
                <h2 className="text-xl font-extrabold text-on-surface mt-2">{activeModalWork.koreanTitle}</h2>
                {activeModalWork.title !== activeModalWork.koreanTitle && (
                  <p className="text-xs font-bold text-secondary">{activeModalWork.title}</p>
                )}
                <p className="text-xs text-on-surface-variant mt-1">{activeModalWork.author}</p>
                <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-primary">
                  <span>총 {activeModalWork.totalSentences}개 핵심 문장</span>
                  <span>·</span>
                  <span>{activeModalWork.completedSentences}개 완료</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface-container-low/80 space-y-2">
              <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">작품 소개</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {activeModalWork.description}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">수록 명문장 맛보기</h4>
              {(() => {
                const preview = getPreviewSentence(questionsByWork, activeModalWork.id);
                return preview ? (
                  <div className="p-3 rounded-xl bg-surface-container-lowest border border-surface-container-high text-xs space-y-1">
                    <p className="font-semibold text-on-surface">“{preview.english}”</p>
                    <p className="text-on-surface-variant">{preview.korean}</p>
                  </div>
                ) : (
                  <p className="text-xs text-on-surface-variant">학습을 시작하면 명문장을 확인할 수 있어요.</p>
                );
              })()}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setActiveModalWork(null)}
                className="flex-1 py-3 rounded-full bg-surface-container-high text-on-surface text-xs font-bold hover:bg-surface-container-highest transition-colors cursor-pointer"
              >
                닫기
              </button>
              <button
                onClick={() => {
                  const workToStart = activeModalWork;
                  setActiveModalWork(null);
                  startWorkLesson(workToStart);
                }}
                disabled={activeModalWork.isLocked}
                className={`flex-1 py-3 rounded-full text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeModalWork.isLocked
                    ? 'bg-surface-container-high text-outline cursor-not-allowed'
                    : 'bg-primary text-on-primary hover:bg-primary/90'
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {activeModalWork.isLocked ? 'lock' : 'play_arrow'}
                </span>
                <span>{activeModalWork.isLocked ? '잠금 상태' : '이 작품으로 학습 시작'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
