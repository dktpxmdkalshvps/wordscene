import { ReviewItem } from '../types';

/**
 * SuperMemo SM-2 에빙하우스 간격 반복(Spaced Repetition System) 알고리즘
 * 
 * Quality Rating (q):
 * 5 - 완벽히 회상 (Easy)
 * 4 - 약간의 생각 후 정답 (Good)
 * 3 - 어렵게 정답 (Pass)
 * 2 - 오답이었으나 정답을 본 후 기억남 (Hard)
 * 1 - 오답 (Again)
 * 0 - 전혀 기억나지 않음 (Fail)
 */

export interface SRSCalculationResult {
  interval: number;         // 다음 복습까지의 일수 (days)
  repetition: number;       // 연속 성공 횟수
  easinessFactor: number;   // 난이도 계수 (EF, 최소 1.3)
  nextReviewAt: string;     // 다음 복습 예정 일시 (ISO 문자열)
  lastReviewedAt: string;   // 마지막 복습 일시 (ISO 문자열)
  mastered: boolean;        // 숙련 완료 여부 (interval >= 30 또는 repetition >= 4)
}

/**
 * SM-2 알고리즘 계산
 * @param item 기존 복습 항목 상태
 * @param quality 0~5의 회상 품질 점수 (또는 isCorrect 여부에 따른 자동 품질 점수)
 */
export const calculateSM2 = (
  item: Partial<ReviewItem>,
  quality: number
): SRSCalculationResult => {
  const q = Math.max(0, Math.min(5, quality));
  let interval = item.interval ?? 1;
  let repetition = item.repetition ?? 0;
  let ef = item.easinessFactor ?? 2.5;

  // EF (Easiness Factor) 업데이트 공식:
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  ef = ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (ef < 1.3) ef = 1.3;

  if (q >= 3) {
    // 성공적인 회상
    if (repetition === 0) {
      interval = 1;
    } else if (repetition === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * ef);
    }
    repetition += 1;
  } else {
    // 회상 실패: 연속 성공 횟수 초기화 및 1일 후 재복습
    repetition = 0;
    interval = 1;
  }

  const now = new Date();
  const nextDate = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);

  // repetition이 4 이상이거나 복습 간격이 30일 이상이면 장기 기억(마스터)으로 판정
  const mastered = repetition >= 4 || interval >= 30;

  return {
    interval,
    repetition,
    easinessFactor: Number(ef.toFixed(2)),
    nextReviewAt: nextDate.toISOString(),
    lastReviewedAt: now.toISOString(),
    mastered,
  };
};

/**
 * 특정 복습 항목이 오늘 복습 대상인지 검사합니다.
 */
export const isItemDueForReview = (item: ReviewItem): boolean => {
  if (item.mastered) return false;
  if (!item.nextReviewAt) return true; // 신규/기존 데이터는 즉시 복습 대상
  return new Date(item.nextReviewAt).getTime() <= Date.now();
};

/**
 * 다음 복습 예정일을 사용자가 알아보기 쉬운 한국어 레이블로 변환합니다.
 */
export const getDueDateLabel = (nextReviewAt?: string): string => {
  if (!nextReviewAt) return '오늘 복습 대상';
  const diffMs = new Date(nextReviewAt).getTime() - Date.now();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return '오늘 복습 대상';
  if (diffDays === 1) return '내일 복습 예정';
  return `${diffDays}일 후 복습 예정`;
};

/**
 * 에빙하우스 단계별 배지 정보를 반환합니다.
 */
export const getRepetitionStageInfo = (item: ReviewItem): { label: string; colorClass: string } => {
  if (item.mastered) {
    return { label: '장기 기억 완료', colorClass: 'bg-primary-fixed text-on-primary-fixed' };
  }
  const rep = item.repetition ?? 0;
  if (rep === 0) {
    return { label: '1일 차 (재학습)', colorClass: 'bg-error-container text-error' };
  }
  if (rep === 1) {
    return { label: '6일 주기 (단기)', colorClass: 'bg-tertiary-container text-on-tertiary-container' };
  }
  if (rep === 2) {
    return { label: '15일 주기 (중기)', colorClass: 'bg-secondary-container text-on-secondary-container' };
  }
  return { label: '30일 주기 (장기)', colorClass: 'bg-primary-container text-on-primary-container' };
};
