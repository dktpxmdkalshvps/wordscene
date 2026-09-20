import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  UserProfile,
  UserTodayStatus,
  Work,
  ReviewItem,
  SavedSentence,
  WeeklyStat,
  LearningSession,
  SessionResult,
  SentenceItem,
  Question
} from '../types';
import {
  INITIAL_WORKS,
  HAPPY_PRINCE_QUESTIONS,
  RANDOM_SPEED_QUESTIONS,
  INITIAL_REVIEWS,
  INITIAL_SAVED,
  INITIAL_WEEKLY_STATS,
  HERO_SENTENCE
} from '../data/mockData';
import { loadContentCatalog, localCatalog } from '../lib/contentService';
import { getDeviceId } from '../lib/deviceId';
import { deleteProgress, loadProgress, syncProgress, RemoteProgress } from '../lib/progressService';

interface AppContextType {
  user: UserProfile;
  todayStatus: UserTodayStatus;
  setTodayStatus: (status: UserTodayStatus) => void;
  works: Work[];
  questionsByWork: Record<string, Question[]>;
  activeSession: LearningSession | null;
  lastResult: SessionResult | null;
  reviewItems: ReviewItem[];
  savedSentences: SavedSentence[];
  weeklyStats: WeeklyStat[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  exploreCategory: string;
  setExploreCategory: (category: string) => void;
  selectedWorkDetail: Work | null;
  setSelectedWorkDetail: (work: Work | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;

  // Actions
  startDailyLesson: () => void;
  startWorkLesson: (work: Work) => void;
  startRandomSpeedLesson: () => void;
  startReviewSession: () => void;
  submitSessionAnswer: (questionId: string, answer: string | string[], isCorrect: boolean) => void;
  finishCurrentSession: () => void;
  exitSession: () => void;
  dismissResult: () => void;
  toggleSaveSentence: (sentence: { id: string; english: string; korean: string; workTitle: string; author?: string; highlightWord?: string }) => void;
  isSentenceSaved: (sentenceId: string) => boolean;
  markReviewMastered: (reviewId: string) => void;
  deleteSavedSentence: (saveId: string) => void;
  resetDemoData: () => Promise<void>;
  updateUserProfile: (partial: Partial<UserProfile>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const FRESH_PROFILE: UserProfile = {
  name: '은별',
  level: 1,
  levelTitle: 'Lv.1 첫 문장',
  totalXp: 0,
  streakDays: 0,
  targetDailyMinutes: 10,
  selectedLanguage: '영어 🇺🇸',
  soundEnabled: true,
  speechRate: 0.9,
};

const freshWeeklyStats = (): WeeklyStat[] => INITIAL_WEEKLY_STATS.map(day => ({
  ...day,
  isCompleted: false,
  count: 0,
}));

const freshWorks = (items: Work[]): Work[] => items.map(work => ({
  ...work,
  completedSentences: 0,
}));

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('ws_user');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return FRESH_PROFILE;
  });

  const [todayStatus, setTodayStatus] = useState<UserTodayStatus>('not_started');
  const [works, setWorks] = useState<Work[]>(() => freshWorks(INITIAL_WORKS));
  const [questionsByWork, setQuestionsByWork] = useState<Record<string, Question[]>>(() => localCatalog().questionsByWork);
  const [activeSession, setActiveSession] = useState<LearningSession | null>(null);
  const [lastResult, setLastResult] = useState<SessionResult | null>(null);
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>(() => {
    const saved = localStorage.getItem('ws_reviews');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [];
  });
  const [savedSentences, setSavedSentences] = useState<SavedSentence[]>(() => {
    const saved = localStorage.getItem('ws_saved');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [];
  });
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStat[]>(freshWeeklyStats);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [exploreCategory, setExploreCategory] = useState<string>('all');
  const [selectedWorkDetail, setSelectedWorkDetail] = useState<Work | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => (
    localStorage.getItem('ws_onboarding_complete') !== 'true'
  ));

  const [deviceId] = useState<string>(() => getDeviceId());
  const [hasHydratedRemote, setHasHydratedRemote] = useState(false);
  const remoteProgressRef = useRef<RemoteProgress | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('ws_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('ws_reviews', JSON.stringify(reviewItems));
  }, [reviewItems]);

  useEffect(() => {
    localStorage.setItem('ws_saved', JSON.stringify(savedSentences));
  }, [savedSentences]);

  useEffect(() => {
    let active = true;
    loadContentCatalog().then(catalog => {
      if (!active) return;
      const remote = remoteProgressRef.current;
      const merged = catalog.works.map(w => ({
        ...w,
        completedSentences: remote?.workProgress[w.id] ?? 0,
      }));
      setWorks(merged);
      setQuestionsByWork(catalog.questionsByWork);
    });
    return () => { active = false; };
  }, []);

  // Pull remote progress (anonymous device sync) and merge into local state
  useEffect(() => {
    let active = true;
    loadProgress(deviceId).then(remote => {
      if (!active) return;
      remoteProgressRef.current = remote;
      if (remote) {
        setUser(prev => ({ ...prev, totalXp: remote.totalXp, streakDays: remote.streakDays }));
        setWorks(prev => prev.map(w => ({
          ...w,
          completedSentences: remote.workProgress[w.id] ?? w.completedSentences,
        })));
      }
      setHasHydratedRemote(true);
    });
    return () => { active = false; };
  }, [deviceId]);

  // Push local progress to Supabase once remote hydration has completed,
  // debounced so rapid state changes don't spam the network.
  useEffect(() => {
    if (!hasHydratedRemote) return;
    const timer = setTimeout(() => {
      syncProgress(deviceId, {
        totalXp: user.totalXp,
        streakDays: user.streakDays,
        workProgress: Object.fromEntries(works.map(w => [w.id, w.completedSentences])),
      });
    }, 800);
    return () => clearTimeout(timer);
  }, [user.totalXp, user.streakDays, works, hasHydratedRemote, deviceId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 2800);
  };

  const startDailyLesson = () => {
    const firstWork = works.find(work => !work.isLocked) ?? works[0];
    const sessionQuestions = questionsByWork[firstWork?.id] ?? HAPPY_PRINCE_QUESTIONS;
    setActiveSession({
      sessionId: `session-${Date.now()}`,
      workId: firstWork?.id ?? 'happy-prince',
      workTitle: firstWork?.title ?? 'The Happy Prince',
      questions: sessionQuestions,
      currentIndex: 0,
      answers: [],
      startedAt: new Date().toISOString(),
      total: sessionQuestions.length,
    });
    setLastResult(null);
  };

  const startWorkLesson = (work: Work) => {
    if (work.isLocked) {
      showToast(`${work.lockRequirement || '아직 잠겨있는 스테이지입니다.'}`);
      return;
    }
    setSelectedWorkDetail(null);
    const sessionQuestions = questionsByWork[work.id] ?? HAPPY_PRINCE_QUESTIONS;
    setActiveSession({
      sessionId: `session-${Date.now()}`,
      workId: work.id,
      workTitle: work.title,
      questions: sessionQuestions,
      currentIndex: 0,
      answers: [],
      startedAt: new Date().toISOString(),
      total: sessionQuestions.length,
    });
    setLastResult(null);
  };

  const startRandomSpeedLesson = () => {
    setActiveSession({
      sessionId: `speed-${Date.now()}`,
      workId: 'random-mix',
      workTitle: '랜덤 문장 퀵 세션',
      questions: RANDOM_SPEED_QUESTIONS,
      currentIndex: 0,
      answers: [],
      startedAt: new Date().toISOString(),
      total: RANDOM_SPEED_QUESTIONS.length,
    });
    setLastResult(null);
  };

  const startReviewSession = () => {
    if (reviewItems.length === 0) {
      showToast('복습할 오답 항목이 없습니다! 랜덤 문장을 추천해요.');
      startRandomSpeedLesson();
      return;
    }
    // Form questions from review items
    const reviewQuestions = HAPPY_PRINCE_QUESTIONS.slice(0, 3);
    setActiveSession({
      sessionId: `review-${Date.now()}`,
      workId: 'review-queue',
      workTitle: '오답 집중 복습',
      questions: reviewQuestions,
      currentIndex: 0,
      answers: [],
      startedAt: new Date().toISOString(),
      total: reviewQuestions.length,
    });
    setLastResult(null);
  };

  const submitSessionAnswer = (questionId: string, answer: string | string[], isCorrect: boolean) => {
    if (!activeSession) return;

    const currentQuestion = activeSession.questions[activeSession.currentIndex];

    // If answer is incorrect, automatically queue for review
    if (!isCorrect && currentQuestion) {
      const exists = reviewItems.some(r => r.questionId === currentQuestion.id);
      if (!exists) {
        const newRev: ReviewItem = {
          id: `rev-${Date.now()}`,
          questionId: currentQuestion.id,
          sentenceId: currentQuestion.sentenceId,
          workTitle: currentQuestion.workTitle,
          english: currentQuestion.sentence,
          korean: currentQuestion.promptKorean || '문장 번역',
          wrongCount: 1,
          lastMissedAt: '방금 전',
          mastered: false,
          highlightWord: currentQuestion.vocabularies?.[0]?.word || 'keyword'
        };
        setReviewItems(prev => [newRev, ...prev]);
      }
    }

    setActiveSession(prev => {
      if (!prev) return null;
      const updatedAnswers = [
        ...prev.answers,
        { questionId, userAnswer: answer, isCorrect }
      ];
      return {
        ...prev,
        answers: updatedAnswers,
        currentIndex: prev.currentIndex + 1
      };
    });
  };

  const finishCurrentSession = () => {
    if (!activeSession) return;

    const total = activeSession.questions.length;
    const correctCount = activeSession.answers.filter(a => a.isCorrect).length;
    const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 100;
    const earnedXp = correctCount * 10;
    const bonusXp = 45; // Defined in Section 5.1 & 5.2
    const totalEarned = earnedXp + bonusXp;

    const result: SessionResult = {
      sessionId: activeSession.sessionId,
      workTitle: activeSession.workTitle,
      totalQuestions: total,
      correctCount,
      earnedXp: totalEarned,
      bonusXp,
      accuracy,
      completedAt: new Date().toISOString(),
      answers: activeSession.answers.map(ans => ({
        question: activeSession.questions.find(q => q.id === ans.questionId) || activeSession.questions[0],
        userAnswer: ans.userAnswer,
        isCorrect: ans.isCorrect
      }))
    };

    // Update user stats
    setUser(prev => ({
      ...prev,
      totalXp: prev.totalXp + totalEarned,
      streakDays: prev.streakDays + 1
    }));

    // Update works progress
    setWorks(prev => prev.map(w => {
      if (w.title === activeSession.workTitle || w.id === activeSession.workId) {
        const nextCompleted = Math.min(w.totalSentences, w.completedSentences + total);
        return {
          ...w,
          completedSentences: nextCompleted,
          badge: nextCompleted >= w.totalSentences ? '완료됨' : w.badge
        };
      }
      return w;
    }));

    // Update state to completed
    setTodayStatus('completed');
    setActiveSession(null);
    setLastResult(result);
  };

  const exitSession = () => {
    setActiveSession(null);
  };

  const dismissResult = () => {
    setLastResult(null);
  };

  const isSentenceSaved = (sentenceId: string) => {
    return savedSentences.some(s => s.sentenceId === sentenceId);
  };

  const toggleSaveSentence = (sentence: { id: string; english: string; korean: string; workTitle: string; author?: string; highlightWord?: string }) => {
    if (isSentenceSaved(sentence.id)) {
      setSavedSentences(prev => prev.filter(s => s.sentenceId !== sentence.id));
      showToast('저장한 문장에서 보관을 해제했습니다.');
    } else {
      const newSaved: SavedSentence = {
        id: `save-${Date.now()}`,
        sentenceId: sentence.id,
        workTitle: sentence.workTitle,
        author: sentence.author || '명작 도서',
        english: sentence.english,
        korean: sentence.korean,
        savedAt: new Date().toISOString().split('T')[0],
        highlightWord: sentence.highlightWord || '단어',
        vocabularies: []
      };
      setSavedSentences(prev => [newSaved, ...prev]);
      showToast('내 단어장에 소중한 문장을 저장했습니다! ✨');
    }
  };

  const markReviewMastered = (reviewId: string) => {
    setReviewItems(prev => prev.filter(r => r.id !== reviewId));
    showToast('오답 문장을 완벽히 마스터했습니다! +15 XP 획득 ✨');
    setUser(prev => ({ ...prev, totalXp: prev.totalXp + 15 }));
  };

  const deleteSavedSentence = (saveId: string) => {
    setSavedSentences(prev => prev.filter(s => s.id !== saveId));
    showToast('문장 보관을 해제했습니다.');
  };

  const resetDemoData = async () => {
    const approved = window.confirm('학습 진도, XP, 스트릭, 오답·저장 문장과 온보딩 기록을 모두 삭제하고 처음부터 시작할까요?');
    if (!approved) return;

    await deleteProgress(deviceId);
    Object.keys(localStorage)
      .filter(key => key.startsWith('ws_'))
      .forEach(key => localStorage.removeItem(key));
    window.location.reload();
  };

  const updateUserProfile = (partial: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...partial }));
    showToast('프로필 및 설정이 저장되었습니다.');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        todayStatus,
        setTodayStatus,
        works,
        questionsByWork,
        activeSession,
        lastResult,
        reviewItems,
        savedSentences,
        weeklyStats,
        activeTab,
        setActiveTab,
        exploreCategory,
        setExploreCategory,
        selectedWorkDetail,
        setSelectedWorkDetail,
        toastMessage,
        showToast,
        showOnboarding,
        setShowOnboarding,
        startDailyLesson,
        startWorkLesson,
        startRandomSpeedLesson,
        startReviewSession,
        submitSessionAnswer,
        finishCurrentSession,
        exitSession,
        dismissResult,
        toggleSaveSentence,
        isSentenceSaved,
        markReviewMastered,
        deleteSavedSentence,
        resetDemoData,
        updateUserProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
