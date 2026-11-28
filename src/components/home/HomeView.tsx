import React from 'react';
import { useApp } from '../../context/AppContext';
import { getPreviewSentence } from '../../lib/contentService';
import { Lumi } from '../common/Lumi';

export const HomeView: React.FC = () => {
  const { user, works, questionsByWork, todayStatus, reviewItems, savedSentences, startDailyLesson, startWorkLesson, startReviewSession, setActiveTab } = useApp();
  const current = works.find(w => !w.isLocked && w.completedSentences < w.totalSentences) ?? works.find(w => !w.isLocked);
  const preview = current ? getPreviewSentence(questionsByWork, current.id) : null;
  const pending = reviewItems.filter(r => !r.mastered).length;
  const completed = works.reduce((n,w) => n + w.completedSentences, 0);
  const blooms = works.filter(w => w.completedSentences > 0);
  return <div className="lemon-home">
    <header className="lemon-home-heading"><div><span className="lemon-eyebrow">MY LITTLE LEARNING NOTE</span><h1>{user.name}님의 오늘<span className="lemon-dot">.</span></h1><p>부담 없이 한 문장, 루미와 함께해요.</p></div><Lumi/></header>
    <div className="lemon-home-grid"><section className="lemon-card lemon-daily"><span className="lemon-eyebrow">TODAY'S CHAPTER</span><h2>오늘의 학습</h2><p className="lemon-big-status">{todayStatus === 'completed' ? '오늘도 해냈어요!' : '한 문장부터 시작해요'}</p><ul className="lemon-task-list"><li><span>📖 문장과 퀴즈</span><b>{todayStatus === 'completed' ? '학습 완료 ✓' : '학습 대기'}</b></li><li><span>↻ 오답 복습</span><button onClick={() => setActiveTab('review')}>{pending}개 보기 →</button></li><li><span>☆ 저장한 문장</span><button onClick={() => setActiveTab('review')}>{savedSentences.length}개 보기 →</button></li></ul><button className="lemon-button" onClick={todayStatus === 'completed' && pending > 0 ? startReviewSession : startDailyLesson}>{todayStatus === 'completed' && pending > 0 ? '오늘 학습 복습하기' : '오늘의 학습 시작하기'} <span>→</span></button><small>읽고, 풀고, 복습하며 나의 속도로.</small></section>
    <section className="lemon-card lemon-garden"><div className="lemon-card-heading"><h2>나의 문장 정원</h2><span>{completed}문장</span></div><p>작품별 완료 문장이 작은 꽃이 되었어요.</p><div className="lemon-flower-bed" aria-label={`${completed}개 완료 문장, ${blooms.length}개 학습한 작품`}>{blooms.length ? blooms.map(w => <div className="lemon-flower" key={w.id}><span aria-hidden="true">🌼</span><b>{w.koreanTitle}</b><small>{w.completedSentences}문장</small></div>) : <div className="lemon-empty-garden"><span aria-hidden="true">🌱</span><b>첫 문장을 심어주세요</b><small>학습을 마치면 이곳에 꽃이 피어요.</small></div>}</div><button className="lemon-link" onClick={() => setActiveTab('history')}>나의 학습 기록 보기 →</button></section>
    {current && <section className="lemon-card lemon-continue"><div className="lemon-card-heading"><h2>이어서 읽기</h2><button className="lemon-link" onClick={() => setActiveTab('explore')}>전체 작품 →</button></div><div className="lemon-work-row"><div className="lemon-book-cover" aria-hidden="true">✳<span>{current.title}</span></div><div><small>{current.author}</small><h3>{current.koreanTitle}</h3><progress aria-label="작품 학습 진도" max={Math.max(1,current.totalSentences)} value={current.completedSentences}/><p>{current.completedSentences} / {current.totalSentences} 문장</p></div><button className="lemon-circle" aria-label={`${current.koreanTitle} 학습하기`} onClick={() => startWorkLesson(current)}>→</button></div></section>}
    {preview && <section className="lemon-card lemon-sentence"><span className="lemon-eyebrow">A SENTENCE TO KEEP</span><h2>오늘의 문장</h2><blockquote>{preview.english}</blockquote><p>{preview.korean}</p><small>{current?.title} · {current?.author}</small></section>}
    </div><p className="lemon-home-foot">조금씩, 꾸준히. 오늘의 작은 한 장도 충분해요. ✳</p>
  </div>;
};
