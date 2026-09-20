import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const features = [
  ['auto_stories', 'cyan', '단어 암기가 아닌, 스토리 속 문맥 학습', '원서 속 장면을 따라 읽으며 문장의 흐름을 익힙니다. 명작의 감정과 표현을 한 문장씩 자연스럽게 체화하세요.'],
  ['psychology', 'pink', '에빙하우스 기반 스마트 복습 큐', '처음 읽은 문장을 잊기 전에 다시 만납니다. 복습할수록 내 문장이 되는 흐름을 경험하세요.'],
  ['military_tech', 'gold', '동기부여를 채우는 퀘스트 & 스트릭', '매일 5분의 작은 완성으로 학습 흐름을 이어갑니다. 오늘의 문장을 끝까지 만나보세요.'],
  ['library_books', 'violet', '소설에서 영화·명언·팝송까지 미디어 확장', '고전 원서에서 시작해 검수된 문화 콘텐츠로 학습 세계를 넓혀갑니다.'],
];

const books = [
  ['The Happy Prince', '행복한 왕자', 'Oscar Wilde', 'cyan'],
  ['Adventures of Sherlock Holmes', '셜록 홈즈의 모험', 'Arthur Conan Doyle', 'pink'],
  ['The Great Gatsby', '위대한 개츠비', 'F. Scott Fitzgerald', 'gold'],
  ['Pride and Prejudice', '오만과 편견', 'Jane Austen', 'violet'],
  ['Frankenstein', '프랑켄슈타인', 'Mary Shelley', 'cyan'],
];

const audiences = [
  ['💼', '토익·오픽 준비생', '단어 목록 암기 대신, 실전 문장과 맥락 속에서 표현을 익히고 싶은 분께 맞습니다.'],
  ['📖', '원서 완독에 도전하는 분', '완역이 아닌 원문으로, 짧은 핵심 문장부터 부담 없이 시작할 수 있습니다.'],
  ['🎬', '영화·미디어로 배우고 싶은 분', '고전 소설뿐 아니라 영화 명대사로도 같은 방식의 문맥 학습을 이어갈 수 있습니다.'],
];

const featureDetails: Record<string, { label: string; items: string[] }> = {
  cyan: { label: '학습 흐름', items: ['장면 읽기', '문장 이해', '표현 복습'] },
  pink: { label: '복습 주기', items: ['24시간 후', '3일 후', '7일 후'] },
  gold: { label: '오늘의 퀘스트', items: ['문장 1개', '퀴즈 3개', '스트릭 유지'] },
  violet: { label: '콘텐츠 확장', items: ['고전 원서', '영화 대사', '준비 중'] },
};

export const OnboardingModal: React.FC = () => {
  const { showOnboarding, setShowOnboarding, setActiveTab, showToast, updateUserProfile } = useApp();
  const [onboardingPage, setOnboardingPage] = useState<'landing' | 'goal'>('landing');
  const [goal, setGoal] = useState('시험 & 스펙 완성');
  const [level, setLevel] = useState('초급 (A2)');
  const [minutes, setMinutes] = useState(10);
  if (!showOnboarding) return null;

  const enterApp = (tab = 'home', message = 'WordScene에 오신 것을 환영합니다!') => {
    localStorage.setItem('ws_onboarding_complete', 'true');
    setShowOnboarding(false);
    setActiveTab(tab);
    showToast(message);
  };

  const finishSetup = () => {
    updateUserProfile({ targetDailyMinutes: minutes });
    enterApp('home', `${goal} 목표로 하루 ${minutes}분 학습을 시작합니다.`);
  };

  if (showOnboarding && onboardingPage === 'goal') {
    const goals: Array<[string, string, string, string[], string]> = [
      ['🎯', '시험 & 스펙 완성', '토익, 오픽, 실전 원서 독해 및 구문 분석', ['#토익고득점', '#원서독해'], 'cyan'],
      ['✈️', '생생한 해외 여행', '현지 뉘앙스, 감성 레스토랑 & 호텔 회화', ['#자유여행', '#실전회화'], 'pink'],
      ['📖', '취미 & 원서 완독', '영미 고전문학, 영화 명대사, 팝송 속 문장', ['#고전소설', '#스크린영어'], 'gold'],
      ['💼', '비즈니스 & 커리어', '격식 있는 영문 메일, 프레젠테이션, 인터뷰', ['#이메일작성', '#글로벌이직'], 'blue'],
    ];

    return (
      <div className="ws-goal-page" role="dialog" aria-modal="true" aria-labelledby="goal-title">
        <header className="ws-goal-nav">
          <button className="ws-goal-brand" type="button" onClick={() => setOnboardingPage('landing')}><span className="material-symbols-outlined">auto_awesome</span><b>WordScene</b></button>
          <nav><button type="button">언어 설정</button><button className="current" type="button">학습 목표</button><button type="button">수준 진단</button><button type="button">테마 선택</button></nav>
          <div><span className="ws-language">文 한국어</span><button type="button" onClick={() => enterApp('home', '체험 모드로 시작합니다.')}>로그인</button><button className="skip" type="button" onClick={() => enterApp('home', '게스트 체험을 시작합니다.')}>건너뛰기</button><i className="material-symbols-outlined">person</i></div>
        </header>
        <main className="ws-goal-main">
          <div className="ws-goal-orb ws-goal-orb--cyan" /><div className="ws-goal-orb ws-goal-orb--pink" /><div className="ws-goal-orb ws-goal-orb--gold" />
          <div className="ws-goal-canvas">
            <section className="ws-lumi-stage">
              <div className="ws-lumi-stage__head"><span>✨ 3D 시각 몰입 학습</span><b>● Lumi와 함께 탐험</b></div>
              <div className="ws-lumi-image"><img src="/wordscene-entry.png" alt="루미 공식 마스코트" /><div><span className="material-symbols-outlined">menu_book</span><p><b>반짝이는 나의 영어 여정</b><small>생생한 장면 속에서 피어나는 언어 감각</small></p></div></div>
              <div className="ws-lumi-stats"><p><b>111개</b><span>엄선된 원서·영화 명문장</span></p><p><b>14편</b><span>고전 원서 + 영화</span></p><p><b>10분</b><span>권장 일일 학습</span></p></div>
            </section>
            <section className="ws-goal-panel">
              <div className="ws-goal-progress"><div><span>맞춤 학습 세팅 1단계</span><b>진행도 <em>1 / 3</em></b></div><i><b /></i></div>
              <h1 id="goal-title">어떤 목적으로 영어를 배우고 싶으신가요?</h1>
              <p className="ws-goal-subtitle">원서와 명대사 속에서 당신의 취향과 목표에 꼭 맞는 문장들을 매일 추천해 드려요.</p>
              <div className="ws-goal-grid">{goals.map(([emoji, title, text, tags, tone]) => <button type="button" className={`ws-goal-option ${goal === title ? 'selected' : ''} ${tone}`} key={title} onClick={() => setGoal(title)}><span>{emoji}</span><div><b>{title}</b><p>{text}</p><small>{tags.map(tag => <i key={tag}>{tag}</i>)}</small></div><em className="material-symbols-outlined">{goal === title ? 'check_circle' : 'radio_button_unchecked'}</em></button>)}</div>
              <div className="ws-choice-card"><header><span><i className="material-symbols-outlined">psychology</i>현재 내 체감 영어 레벨</span><b>1분 퀵 진단 연계</b></header><div className="ws-choice-row">{['입문 (A1)', '초급 (A2)', '중급 (B1~B2)', '고급 (C1+)'].map(item => <button type="button" className={level === item ? 'selected cyan' : ''} onClick={() => setLevel(item)} key={item}>{item}</button>)}</div></div>
              <div className="ws-choice-card"><header><span><i className="material-symbols-outlined pink-text">schedule</i>매일 목표 학습 시간</span><b className="gold-text">습관 형성 최적화</b></header><div className="ws-choice-row times">{[[5, '매일 5분 가볍게'], [10, '매일 10분 [추천]'], [20, '매일 20분 마스터']].map(([value, text]) => <button type="button" className={minutes === value ? 'selected pink' : ''} onClick={() => setMinutes(value as number)} key={value}>{text}</button>)}</div></div>
              <button className="ws-goal-start" type="button" onClick={finishSetup}>무료로 시작하기 (1분 레벨 진단) <span className="material-symbols-outlined">arrow_forward</span></button>
              <div className="ws-goal-links">이미 계정이 있으신가요? <button type="button" onClick={() => enterApp('home', '체험 모드로 시작합니다.')}>로그인</button><i /> <button type="button" onClick={() => enterApp('home', '게스트 체험을 시작합니다.')}>게스트로 둘러보기</button></div>
              <small className="ws-goal-trust">신용카드 등록 없이 즉시 무료 체험이 가능합니다.</small>
            </section>
          </div>
        </main>
      </div>
    );
  }

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
          <a href="#features">주요 기능</a><a href="#method">학습 방법</a><a href="#library">명작 도서관</a><a href="#reviews">수강 후기</a><a href="#faq">FAQ</a>
        </nav>
        <div className="ws-nav-actions">
          <button className="ws-login" type="button" onClick={() => enterApp('home', '체험 모드로 시작합니다.')}>로그인</button>
          <button className="ws-small-cta" type="button" onClick={() => enterApp()}>무료로 시작하기</button>
        </div>
      </header>

      <main id="top" className="ws-landing-main">
        <section className="ws-hero">
          <div className="ws-hero__copy">
            <div className="ws-kicker"><span /> 2026 차세대 인터랙티브 영어 원서 러닝</div>
            <h1 id="entry-title">원서 속 <em>명문장</em>이<br />내 영어 실력이 되는 마법</h1>
            <p>오스카 와일드부터 루이스 캐럴까지, 매일 5분. 영롱한 감성 원서로 익히는 직독직해 문장 몰입 학습. 단어 암기를 넘어 상상력으로 체화하세요.</p>
            <div className="ws-hero__actions">
              <button className="ws-primary-cta" type="button" onClick={() => setOnboardingPage('goal')}><span>무료로 시작하기 (첫 진단 테스트)</span><span className="material-symbols-outlined">arrow_forward</span></button>
              <button className="ws-secondary-cta" type="button" onClick={() => enterApp('explore', '명작 도서관을 둘러보세요.')}><span className="material-symbols-outlined">play_circle</span>작품 둘러보기</button>
            </div>
            <div className="ws-proof"><span>📚 엄선된 명문장·명대사 111개</span><span>🎬 원서 5권 · 영화 9편 수록</span><span>🤖 AI 튜터의 실시간 문장 설명</span></div>
          </div>

          <div className="ws-product-card" aria-label="WordScene 학습 화면 미리보기">
            <div className="ws-product-card__bar"><div><i /><i /><i /></div><span>✨ Today · 5 min</span></div>
            <div className="ws-product-card__visual"><img src="/wordscene-entry.png" alt="루미와 반짝이는 WordScene 학습 화면" /><span>📖 공개 판본 원문 그대로 학습</span></div>
            <div className="ws-product-steps">
              <div><b>🎯</b><span><strong>Step 1 · 관심 분야 선택하기</strong><small>행복한 왕자 · 셜록 홈즈의 모험</small></span><i>✓</i></div>
              <div className="active"><b>🧠</b><span><strong>Step 2 · 1분 실력 진단</strong><small className="ws-mini-progress"><i /></small></span><i>진행중</i></div>
              <div><b>📅</b><span><strong>Step 3 · 매일 5분 문장 습관</strong><small>출퇴근길 한 장면씩 완성</small></span><i>🔒</i></div>
            </div>
            <button type="button" onClick={() => setOnboardingPage('goal')}>체험판 바로 확인하기 <span>↗</span></button>
            <div className="ws-floating-book"><span>📖</span><small>오늘의 명작</small><strong>The Happy Prince</strong></div>
          </div>
        </section>

        <section id="method" className="ws-demo-section">
          <div className="ws-section-label">LIVE EXPERIENCE</div>
          <div className="ws-demo-heading"><div><h2>직접 눌러서 문맥을 느껴보세요</h2><p>원서 문장 속 핵심 어휘를 터치하면 발음과 문맥적 뉘앙스가 즉각 펼쳐집니다.</p></div><span>오스카 와일드 · 행복한 왕자</span></div>
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
            {features.map(([icon, tone, title, copy]) => {
              const detail = featureDetails[tone];
              return <article className={`ws-feature-card ws-feature-card--${tone}`} key={title}><span className="material-symbols-outlined">{icon}</span><h3>{title}</h3><p>{copy}</p><div className="ws-feature-foot"><small>{detail.label}</small><div>{detail.items.map((item, index) => <React.Fragment key={item}><b>{item}</b>{index < detail.items.length - 1 && <i>→</i>}</React.Fragment>)}</div></div></article>;
            })}
          </div>
        </section>

        <section id="library" className="ws-library-section">
          <div className="ws-library-heading"><div><span>CURATED MASTERPIECES</span><h2>지금 만날 수 있는 원서</h2></div><button type="button" onClick={() => enterApp('explore', '명작 도서관을 둘러보세요.')}>명작 도서관 전체보기 →</button></div>
          <div className="ws-book-grid">
            {books.map(([title, ko, author, color], index) => <article className={`ws-book ws-book--${color}`} key={title}><div className="ws-book__cover"><span>COLLECTION 0{index + 1}</span><strong>{title}</strong><i>WordScene Classics</i></div><h3>{ko}</h3><p>{title} · {author}</p><small>★ 학습 문장 3개</small></article>)}
          </div>
        </section>

        <section id="reviews" className="ws-reviews-section">
          <div className="ws-section-intro"><span>WHO IT'S FOR</span><h2>이런 분들께 <em>추천해요</em></h2></div>
          <div className="ws-review-grid">{audiences.map(([icon, persona, text], index) => <article key={persona}><span className={`ws-review-avatar avatar-${index}`}>{icon}</span><b>{persona}</b><p>{text}</p></article>)}</div>
        </section>

        <section id="faq" className="ws-faq-section">
          <div className="ws-section-intro"><span>FAQ</span><h2>시작하기 전에 궁금한 점</h2></div>
          <div className="ws-faq-list">
            <details><summary>영어 초보도 시작할 수 있나요?</summary><p>네. 원문을 먼저 보고 의미를 추측한 뒤 번역과 해설을 단계적으로 확인할 수 있습니다.</p></details>
            <details><summary>어떤 작품을 학습하나요?</summary><p>행복한 왕자, 셜록 홈즈, 위대한 개츠비, 오만과 편견, 프랑켄슈타인의 공개 판본을 사용합니다.</p></details>
            <details><summary>AI는 어디에 사용되나요?</summary><p>현재 문장의 어휘, 문법, 문맥을 설명하는 보조 튜터로 사용하며 AI 답변임을 구분해 표시합니다.</p></details>
          </div>
        </section>

        <section className="ws-final-cta"><span>✨ 지금 바로 1분 실력 진단</span><h2>지금 바로 1분 레벨 테스트로<br />반짝이는 나만의 영어 여정을 시작하세요</h2><p>복잡한 가입도 등록 없이 바로 시작할 수 있습니다. 당신에게 딱 맞는 첫 명작을 찾아드릴게요.</p><button type="button" onClick={() => setOnboardingPage('goal')}>무료 레벨 테스트 시작하기 <span>→</span></button><small>신규 가입 시 7일 무료 오디오 & AI 튜터 혜택</small></section>
      </main>

      <footer className="ws-landing-footer"><div className="ws-brand"><span className="ws-brand__icon material-symbols-outlined">auto_stories</span><b>Word<span>Scene</span></b></div><p>명작 속 생생한 문장으로 기억되는 영어 학습</p><small>© 2026 WordScene · Project Gutenberg 공개 판본 기반</small></footer>
    </div>
  );
};
