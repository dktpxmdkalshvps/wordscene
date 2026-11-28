import React, { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Lumi } from '../common/Lumi';

export const OnboardingModal: React.FC = () => {
  const { showOnboarding, setShowOnboarding, setActiveTab } = useApp();
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!showOnboarding || !root.current || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    root.current.querySelectorAll('.lemon-reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [showOnboarding]);
  if (!showOnboarding) return null;
  const enter = (tab = 'home') => {
    localStorage.setItem('ws_onboarding_complete', 'true');
    setActiveTab(tab); setShowOnboarding(false); window.scrollTo(0, 0);
  };
  return <div ref={root} className="lemon-landing">
    <a className="lemon-skip" href="#story">소개 내용으로 건너뛰기</a>
    <header className="lemon-nav"><a href="#top" className="lemon-brand">✳ WordScene</a><nav aria-label="서비스 소개"><a href="#story">학습 방법</a><a href="#garden">문장 정원</a><button className="lemon-button small" onClick={() => enter()}>무료로 시작하기</button></nav></header>
    <main>
      <section id="top" className="lemon-hero">
        <div className="lemon-hero-copy"><span className="lemon-eyebrow">A LITTLE STORY, EVERY DAY</span><h1 id="entry-title">영어가 자라는<br/>작은 이야기 습관<span className="lemon-dot">.</span></h1><p>외워야 할 단어 대신, 기억하고 싶은 장면.<br/>루미와 원서·영화 속 한 문장을 만나보세요.</p><div className="lemon-actions"><button className="lemon-button" onClick={() => enter()}>루미와 시작하기 <span>↗</span></button><button className="lemon-link" onClick={() => enter('explore')}>작품 둘러보기 →</button></div><small>복잡한 가입 없이 · 나의 속도로 학습</small></div>
        <div className="lemon-hero-art"><div className="lemon-orbit"/><span className="lemon-sticker sticker-one">한 문장부터, 천천히!</span><Lumi/><span className="lemon-sticker sticker-two">읽기 ✓ 퀴즈 ✓ 복습</span><span className="lemon-spark" aria-hidden="true">✧</span></div>
        <a className="lemon-scroll" href="#story">루미의 학습 노트 펼쳐보기 ↓</a>
      </section>
      <div className="lemon-ticker" aria-hidden="true">READ A LITTLE ✳ LEARN A LITTLE ✳ GROW EVERY DAY ✳ WORDSCENE ✳</div>
      <section id="story" className="lemon-section lemon-story">
        <div className="lemon-section-heading lemon-reveal"><span className="lemon-eyebrow">01 / YOUR DAILY CHAPTER</span><h2>큰 결심보다,<br/>끝낼 수 있는 작은 한 장.</h2><p>문맥을 읽고, 직접 풀고, 다시 만나는 학습 흐름.</p></div>
        <div className="lemon-step-grid">{[['01','auto_stories','장면 속에서 읽기','작품 속 원문과 번역으로 표현의 맥락을 만나세요.'],['02','extension','직접 풀며 기억하기','빈칸 채우기와 단어 배열, 번역 선택으로 확인해요.'],['03','psychiatry','다시 만나 내 것으로','틀린 문장을 복습하고, 좋아하는 문장을 보관하세요.']].map(([n,icon,title,copy]) => <article key={n} className="lemon-card lemon-reveal"><span className="lemon-step-number">{n}</span><span className="material-symbols-outlined lemon-step-icon" aria-hidden="true">{icon}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </section>
      <section className="lemon-section lemon-preview lemon-reveal"><div className="lemon-preview-note"><span className="lemon-eyebrow">A SENTENCE TO KEEP</span><blockquote>“High above the city, on a tall column, stood the statue of the Happy Prince.”</blockquote><p>The Happy Prince · Oscar Wilde</p><span className="lemon-note-tag">이야기는 한 문장에서 시작되니까.</span></div><div><h2>문제집 밖에서 만나는<br/>살아 있는 영어.</h2><p>행복한 왕자부터 셜록 홈즈까지.<br/>읽고 싶은 작품에서 오늘의 학습을 시작하세요.</p><button className="lemon-link" onClick={() => enter('explore')}>나의 첫 작품 찾기 →</button></div></section>
      <section id="garden" className="lemon-section lemon-garden-intro"><div className="lemon-reveal"><span className="lemon-eyebrow">02 / A GARDEN OF SENTENCES</span><h2>배운 문장이 모여<br/>나만의 작은 정원이 돼요.</h2><p>작품별 완료 문장을 꽃으로 표현해요.<br/>어제보다 조금 더 자란 나를 만나보세요.</p></div><div className="lemon-garden-demo lemon-reveal" aria-label="문장 정원 소개 일러스트"><Lumi/><span aria-hidden="true">🌼</span><span aria-hidden="true">🌷</span><span aria-hidden="true">🌱</span><small>작은 학습이 쌓이는 모습 · 예시</small></div></section>
      <section className="lemon-final lemon-reveal"><span className="lemon-eyebrow">YOUR NEXT CHAPTER</span><h2>오늘, 첫 문장을 심어볼까요?</h2><p>잘하는 것보다, 다시 펼치는 게 중요하니까.</p><button className="lemon-button" onClick={() => enter()}>나의 학습 시작하기 ↗</button></section>
    </main><footer className="lemon-footer"><b>✳ WordScene</b><span>루미와 함께, 매일 한 문장.</span><small>© WordScene</small></footer>
  </div>;
};
