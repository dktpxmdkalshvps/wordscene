import React from 'react';
import { useApp } from '../../context/AppContext';

const features = [
  ['auto_stories', 'cyan', '이야기 속 문맥 학습', '명작의 감정과 장면 안에서 표현을 만나 직역과 자연스러운 번역의 차이까지 익힙니다.'],
  ['psychology', 'pink', 'AI 문장 튜터', '현재 문장과 검증된 작품 문맥 안에서 어휘, 문법, 뉘앙스를 짧고 명확하게 설명합니다.'],
  ['military_tech', 'gold', '퀴즈와 스트릭', '빈칸 채우기, 단어 배열, 번역 선택을 5~10분 학습 세션으로 반복합니다.'],
  ['library_books', 'violet', '출처가 분명한 컬렉션', 'Project Gutenberg 판본을 기준으로 원문 출처와 검수 상태를 확인할 수 있습니다.'],
];

const books = [
  ['The Happy Prince', '행복한 왕자', 'Oscar Wilde', 'cyan'],
  ['Sherlock Holmes', '셜록 홈즈의 모험', 'Arthur Conan Doyle', 'pink'],
  ['The Great Gatsby', '위대한 개츠비', 'F. Scott Fitzgerald', 'gold'],
  ['Pride and Prejudice', '오만과 편견', 'Jane Austen', 'violet'],
];

export const OnboardingModal: React.FC = () => {
  const { showOnboarding, setShowOnboarding, setActiveTab, showToast } = useApp();
  if (!showOnboarding) return null;

  const enterApp = (tab = 'home', message = 'WordScene에 오신 것을 환영합니다!') => {
    localStorage.setItem('ws_onboarding_complete', 'true');
    setShowOnboarding(false);
    setActiveTab(tab);
    showToast(message);
  };

  return (
    <div className="wordscene-entry" role="dialog" aria-modal="true" aria-labelledby="entry-title">
      <div className="ws-landing-orb ws-landing-orb--one" />
      <div className="ws-landing-orb ws-landing-orb--two" />

      <header className="ws-landing-nav">
        <a className="ws-brand" href="#top" aria-label="WordScene 처음으로">
          <span className="ws-brand__icon material-symbols-outlined">auto_stories</span>
          <b>Word<span>Scene</span></b>
        </a>
        <nav className="ws-nav-links" aria-label="온보딩 메뉴">
          <a href="#features">주요 기능</a><a href="#method">학습 방법</a><a href="#library">명작 도서관</a><a href="#faq">FAQ</a>
        </nav>
        <div className="ws-nav-actions">
          <button className="ws-login" type="button" onClick={() => enterApp('home', '체험 모드로 시작합니다.')}>로그인</button>
          <button className="ws-small-cta" type="button" onClick={() => enterApp()}>무료로 시작하기</button>
        </div>
      </header>

      <main id="top" className="ws-landing-main">
        <section className="ws-hero">
          <div className="ws-hero__copy">
            <div className="ws-kicker"><span /> 출처가 분명한 영어 원서 마이크로러닝</div>
            <h1 id="entry-title">원서 속 <em>명문장</em>이<br />내 영어 실력이 되는 마법</h1>
            <p>오스카 와일드부터 제인 오스틴까지, 하루 5~10분. 이야기가 있는 문장으로 독해하고 듣고 표현하는 감각을 쌓아보세요.</p>
            <div className="ws-hero__actions">
              <button className="ws-primary-cta" type="button" onClick={() => enterApp()}><span>무료로 시작하기</span><span className="material-symbols-outlined">arrow_forward</span></button>
              <button className="ws-secondary-cta" type="button" onClick={() => enterApp('explore', '명작 도서관을 둘러보세요.')}><span className="material-symbols-outlined">play_circle</span>작품 둘러보기</button>
            </div>
            <div className="ws-proof"><span>📚 구텐베르크 명작 5권</span><span>✨ 학습 카드 15개</span><span>🎯 퀴즈 3종</span></div>
          </div>

          <div className="ws-product-card" aria-label="WordScene 학습 화면 미리보기">
            <div className="ws-product-card__bar"><div><i /><i /><i /></div><span>✨ Today · 5 min</span></div>
            <div className="ws-product-card__visual"><img src="/wordscene-entry.png" alt="WordScene 캐릭터와 반짝이는 학습 화면" /><span>⚡ +10 XP</span></div>
            <div className="ws-product-steps">
              <div><b>🎯</b><span><strong>Step 1 · 작품 선택</strong><small>읽고 싶은 고전을 골라보세요</small></span><i>✓</i></div>
              <div className="active"><b>🧠</b><span><strong>Step 2 · 한 문장 몰입</strong><small className="ws-mini-progress"><i /></small></span><i>진행중</i></div>
              <div><b>📅</b><span><strong>Step 3 · 매일 복습</strong><small>틀린 표현을 다시 만나세요</small></span><i>🔒</i></div>
            </div>
            <button type="button" onClick={() => enterApp()}>체험 학습 바로가기 <span>↗</span></button>
            <div className="ws-floating-book"><span>📖</span><small>오늘의 명작</small><strong>The Happy Prince</strong></div>
          </div>
        </section>

        <section id="method" className="ws-demo-section">
          <div className="ws-section-label">LIVE EXPERIENCE</div>
          <div className="ws-demo-heading"><div><h2>직접 눌러서 문맥을 느껴보세요</h2><p>원문과 자연스러운 번역, 핵심 표현이 한 장의 카드 안에서 이어집니다.</p></div><span>오스카 와일드 · 행복한 왕자</span></div>
          <div className="ws-sentence-card">
            <div className="ws-sentence-meta"><span>🔊 원어민 오디오 · Slow / Natural</span><b>난이도 B1</b></div>
            <blockquote>“The unexpected <mark className="pink">delight</mark> made her cheeks <mark>glow</mark> like the morning sun.”</blockquote>
            <p>“예기치 못한 기쁨이 그녀의 두 뺨을 아침 햇살처럼 빛나게 했다.”</p>
            <div className="ws-word-detail"><span>✨</span><div><strong>delight <small>[dɪˈlaɪt]</small></strong><p>큰 기쁨, 즐거움 · 마음 깊은 곳에서 번지는 환희의 뉘앙스</p></div><button type="button" onClick={() => enterApp()}>학습해보기</button></div>
          </div>
        </section>

        <section id="features" className="ws-features-section">
          <div className="ws-section-intro"><span>WHY WORDSCENE</span><h2>단순 암기는 그만,<br /><em>한 편의 장면</em>으로 기억되는 학습</h2><p>읽기부터 복습까지, 이야기가 있는 문장을 하나의 학습 흐름으로 연결했습니다.</p></div>
          <div className="ws-feature-grid">
            {features.map(([icon, tone, title, copy]) => <article className={`ws-feature-card ws-feature-card--${tone}`} key={title}><span className="material-symbols-outlined">{icon}</span><h3>{title}</h3><p>{copy}</p><div className="ws-feature-art"><i /><i /><i /></div></article>)}
          </div>
        </section>

        <section id="library" className="ws-library-section">
          <div className="ws-library-heading"><div><span>CURATED MASTERPIECES</span><h2>지금 만날 수 있는 원서</h2></div><button type="button" onClick={() => enterApp('explore', '명작 도서관을 둘러보세요.')}>명작 도서관 전체보기 →</button></div>
          <div className="ws-book-grid">
            {books.map(([title, ko, author, color], index) => <article className={`ws-book ws-book--${color}`} key={title}><div className="ws-book__cover"><span>COLLECTION 0{index + 1}</span><strong>{title}</strong><i>WordScene Classics</i></div><h3>{ko}</h3><p>{title} · {author}</p><small>★ 학습 문장 3개</small></article>)}
          </div>
        </section>

        <section id="faq" className="ws-faq-section">
          <div className="ws-section-intro"><span>FAQ</span><h2>시작하기 전에 궁금한 점</h2></div>
          <div className="ws-faq-list">
            <details><summary>영어 초보도 시작할 수 있나요?</summary><p>네. 원문을 먼저 보고 의미를 추측한 뒤 번역과 해설을 단계적으로 확인할 수 있습니다.</p></details>
            <details><summary>어떤 작품을 학습하나요?</summary><p>행복한 왕자, 셜록 홈즈, 위대한 개츠비, 오만과 편견, 프랑켄슈타인의 공개 판본을 사용합니다.</p></details>
            <details><summary>AI는 어디에 사용되나요?</summary><p>현재 문장의 어휘, 문법, 문맥을 설명하는 보조 튜터로 사용하며 AI 답변임을 구분해 표시합니다.</p></details>
          </div>
        </section>

        <section className="ws-final-cta"><span>✨ 지금 바로 한 문장부터</span><h2>매일 5분, 반짝이는<br />나만의 영어 여정을 시작하세요</h2><p>복잡한 가입 없이 체험 콘텐츠로 바로 시작할 수 있습니다.</p><button type="button" onClick={() => enterApp()}>무료로 체험 시작하기 <span>→</span></button></section>
      </main>

      <footer className="ws-landing-footer"><div className="ws-brand"><span className="ws-brand__icon material-symbols-outlined">auto_stories</span><b>Word<span>Scene</span></b></div><p>명작 속 생생한 문장으로 기억되는 영어 학습</p><small>© 2026 WordScene · Project Gutenberg 공개 판본 기반</small></footer>
    </div>
  );
};
