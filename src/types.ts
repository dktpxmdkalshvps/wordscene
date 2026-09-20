export type QuestionType =
  | 'fill_blank'
  | 'word_order'
  | 'translation_match'
  | 'source_guess';

export type Difficulty = '초급' | '중급' | '고급';

export type MediaCategory = 'books' | 'cinema' | 'music';

export interface Vocabulary {
  word: string;
  meaning: string;
  pronunciation?: string;
  example?: string;
}

export interface SentenceItem {
  id: string;
  workId: string;
  workTitle: string;
  author: string;
  chapter: string;
  english: string;
  korean: string;
  highlightWord: string;
  vocabularies: Vocabulary[];
  difficulty: Difficulty;
  audioText?: string;
}

export interface Question {
  id: string;
  sentenceId: string;
  type: QuestionType;
  prompt: string;
  promptKorean?: string;
  sentence: string;
  options: string[];
  correctAnswer: string | string[]; // string or ordered words array
  explanation: string;
  workTitle: string;
  author: string;
  sourceContext?: string;
  vocabularies: Vocabulary[];
}

export interface Work {
  id: string;
  title: string;
  koreanTitle: string;
  author: string;
  category: MediaCategory;
  difficulty: Difficulty;
  totalSentences: number;
  completedSentences: number;
  description: string;
  coverImage: string;
  badge?: string;
  isLocked?: boolean;
  lockRequirement?: string;
  stars?: number;
  stageNumber: number;
}

export interface ReviewItem {
  id: string;
  questionId: string;
  sentenceId: string;
  workTitle: string;
  english: string;
  korean: string;
  wrongCount: number;
  lastMissedAt: string;
  mastered: boolean;
  highlightWord: string;
}

export interface SavedSentence {
  id: string;
  sentenceId: string;
  workTitle: string;
  author: string;
  english: string;
  korean: string;
  savedAt: string;
  highlightWord: string;
  vocabularies: Vocabulary[];
}

export interface LearningSession {
  sessionId: string;
  workId: string;
  workTitle: string;
  questions: Question[];
  currentIndex: number;
  answers: {
    questionId: string;
    userAnswer: string | string[];
    isCorrect: boolean;
  }[];
  startedAt: string;
  total: number;
}

export interface SessionResult {
  sessionId: string;
  workTitle: string;
  totalQuestions: number;
  correctCount: number;
  earnedXp: number;
  bonusXp: number;
  accuracy: number;
  completedAt: string;
  answers: {
    question: Question;
    userAnswer: string | string[];
    isCorrect: boolean;
  }[];
}

export interface UserProfile {
  name: string;
  level: number;
  levelTitle: string;
  totalXp: number;
  streakDays: number;
  targetDailyMinutes: number;
  selectedLanguage: string;
  soundEnabled: boolean;
  speechRate: number;
}

export type UserTodayStatus = 'not_started' | 'in_progress' | 'completed';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  createdAt: string;
  isError?: boolean;
}

export interface WeeklyStat {
  dayName: string;
  dateStr: string;
  isCompleted: boolean;
  isToday: boolean;
  count: number;
}
