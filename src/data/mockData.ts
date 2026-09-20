import { Work, SentenceItem, Question, ReviewItem, SavedSentence, WeeklyStat } from '../types';

export const INITIAL_WORKS: Work[] = [
  {
    id: 'happy-prince',
    title: 'The Happy Prince',
    koreanTitle: '행복한 왕자',
    author: '오스카 와일드 (Oscar Wilde)',
    category: 'books',
    difficulty: '초급',
    totalSentences: 10,
    completedSentences: 4,
    description: '황금과 보석으로 치장된 왕자의 동상과 작은 제비의 따뜻하고 숭고한 사랑을 다룬 감동적인 고전 명작.',
    coverImage: 'https://img.hankyung.com/photo/200804/2008041725411_2008041877881.jpg',
    badge: '추천 원서',
    isLocked: false,
    stars: 3,
    stageNumber: 1,
  },
  {
    id: 'sherlock-holmes',
    title: 'The Adventures of Sherlock Holmes',
    koreanTitle: '셜록 홈즈의 모험',
    author: '아서 코난 도일 (Arthur Conan Doyle)',
    category: 'books',
    difficulty: '중급',
    totalSentences: 15,
    completedSentences: 0,
    description: '셜록 홈즈와 왓슨의 사건 기록을 통해 일상 대화체와 영국식 관용 표현을 익히는 고전 추리 단편집.',
    coverImage: 'https://m.media-amazon.com/images/I/71XFTiuB1-L.jpg',
    badge: '도전 가능',
    isLocked: false,
    stars: 2,
    stageNumber: 2,
  },
  {
    id: 'great-gatsby',
    title: 'The Great Gatsby',
    koreanTitle: '위대한 개츠비',
    author: 'F. 스콧 피츠제럴드 (F. Scott Fitzgerald)',
    category: 'books',
    difficulty: '고급',
    totalSentences: 20,
    completedSentences: 0,
    description: '1920년대 미국 재즈 시대를 배경으로 한 불멸의 문학. 아름다운 은유와 세련된 문장 구조 학습.',
    coverImage: 'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9780743273565.jpg?t=2982968',
    badge: 'Lv.5 오픈',
    isLocked: true,
    lockRequirement: '레벨 5 달성 시 오픈 (현재 Lv.4)',
    stageNumber: 3,
  },
  {
    id: 'pride-prejudice',
    title: 'Pride and Prejudice',
    koreanTitle: '오만과 편견',
    author: '제인 오스틴 (Jane Austen)',
    category: 'books',
    difficulty: '고급',
    totalSentences: 12,
    completedSentences: 12,
    description: '엘리자베스와 다아시의 관계를 따라 격식 표현, 복문과 도치 구문을 익히는 영국 문학 고전.',
    coverImage: 'https://fcs-img.s3.amazonaws.com/1ebda62b-7f02-4fab-8e39-a5e6016ae6b4/9ab485cd-23e6-434f-8139-b1be014aa45d/XL.jpg',
    badge: '완료됨',
    isLocked: false,
    stars: 3,
    stageNumber: 4,
  },
  {
    id: 'frankenstein',
    title: 'Frankenstein',
    koreanTitle: '프랑켄슈타인',
    author: '메리 셸리 (Mary Shelley)',
    category: 'books',
    difficulty: '중급',
    totalSentences: 10,
    completedSentences: 0,
    description: '1818년 판본의 감정적·철학적 문장을 통해 독해와 출처 매칭을 종합적으로 연습하는 작품.',
    coverImage: 'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9780451532244.jpg?t=2979022',
    badge: 'Lv.6 오픈',
    isLocked: true,
    lockRequirement: '앞의 작품 학습을 완료하면 열립니다.',
    stageNumber: 5,
  },
  {
    id: 'MOVIE_건축학개론',
    title: '건축학개론',
    koreanTitle: '건축학개론',
    author: '영화 대사',
    category: 'cinema',
    difficulty: '중급',
    totalSentences: 5,
    completedSentences: 0,
    description: '첫사랑의 아련한 기억과 일상 회화 표현집',
    coverImage: 'https://flexible.img.hani.co.kr/flexible/normal/900/600/imgdb/original/2023/1027/20231027502448.jpg',
    badge: '영화 명대사',
    isLocked: false,
    stageNumber: 6,
  },
  {
    id: 'MOVIE_극한직업',
    title: '극한직업',
    koreanTitle: '극한직업',
    author: '영화 대사',
    category: 'cinema',
    difficulty: '초급',
    totalSentences: 6,
    completedSentences: 0,
    description: '유쾌한 위트와 생생한 구어체 회화 표현',
    coverImage: 'https://sm.ign.com/ign_kr/screenshot/default/1_b4g2.jpg',
    badge: '학습 가능',
    isLocked: false,
    stageNumber: 7,
  },
  {
    id: 'MOVIE_남산의 부장들',
    title: '남산의 부장들',
    koreanTitle: '남산의 부장들',
    author: '영화 대사',
    category: 'cinema',
    difficulty: '고급',
    totalSentences: 5,
    completedSentences: 0,
    description: '긴장감 넘치는 격식 영문표현과 정치 드라마 명대사',
    coverImage: 'https://i.ytimg.com/vi/BIKz5KQpiog/sddefault.jpg',
    badge: '학습 가능',
    isLocked: false,
    stageNumber: 8,
  },
  {
    id: 'MOVIE_베테랑',
    title: '베테랑',
    koreanTitle: '베테랑',
    author: '영화 대사',
    category: 'cinema',
    difficulty: '중급',
    totalSentences: 5,
    completedSentences: 0,
    description: '강렬하고 임팩트 있는 실전 서부/액션 구어체',
    coverImage: 'https://pds.joongang.co.kr/news/component/htmlphoto_mmdata/201508/29/htm_20150829091350949.jpg',
    badge: '학습 가능',
    isLocked: false,
    stageNumber: 9,
  },
  {
    id: 'MOVIE_부당거래',
    title: '부당거래',
    koreanTitle: '부당거래',
    author: '영화 대사',
    category: 'cinema',
    difficulty: '고급',
    totalSentences: 5,
    completedSentences: 0,
    description: '날카로운 대사와 협상/설득 표현 문맥',
    coverImage: 'https://i.namu.wiki/i/rf4P7RGqafHygOtysazAWKQzcA7YHU2faRr2iQc_7-IH8wjfOolRXgi-MGRANDK69_nH0sIOYxmVUl4cCmaj8A.webp',
    badge: '학습 가능',
    isLocked: false,
    stageNumber: 10,
  },
  {
    id: 'MOVIE_아저씨',
    title: '아저씨',
    koreanTitle: '아저씨',
    author: '영화 대사',
    category: 'cinema',
    difficulty: '중급',
    totalSentences: 5,
    completedSentences: 0,
    description: '감성을 자극하는 명대사와 짧고 강렬한 구문',
    coverImage: 'https://img.hankyung.com/photo/202112/01.28216191.1.jpg',
    badge: '학습 가능',
    isLocked: false,
    stageNumber: 11,
  },
  {
    id: 'MOVIE_올드보이',
    title: '올드보이',
    koreanTitle: '올드보이',
    author: '영화 대사',
    category: 'cinema',
    difficulty: '고급',
    totalSentences: 5,
    completedSentences: 0,
    description: '철학적 상징과 독창적인 캐릭터 대화문',
    coverImage: 'https://i.namu.wiki/i/-NRuOEma3DmirkkSyK1bdSY94gm1CpT8UJbh7XRlBH7N2KB2wsDcFsLbO4FNzugZA91gufpIzAKxX0MUNSuTvg.webp',
    badge: '학습 가능',
    isLocked: false,
    stageNumber: 12,
  },
  {
    id: 'MOVIE_친절한 금자씨',
    title: '친절한 금자씨',
    koreanTitle: '친절한 금자씨',
    author: '영화 대사',
    category: 'cinema',
    difficulty: '중급',
    totalSentences: 5,
    completedSentences: 0,
    description: '감각적인 어조와 개성 넘치는 수사적 표현',
    coverImage: 'https://i.namu.wiki/i/sYQ1SZGDVhLM3cwl5Ann-6biY6a95O-66jxXDMI-wpqx4PUbZotrZQjz9gHDm3PyP6ADru8XfbkcBsdgn4Qjqw.webp',
    badge: '학습 가능',
    isLocked: false,
    stageNumber: 13,
  },
  {
    id: 'MOVIE_타짜',
    title: '타짜',
    koreanTitle: '타짜',
    author: '영화 대사',
    category: 'cinema',
    difficulty: '중급',
    totalSentences: 6,
    completedSentences: 0,
    description: '명장면 명대사 속에 담긴 생동감 넘치는 뉘앙스',
    coverImage: 'https://i.namu.wiki/i/-oIsPiB0O_KNfRKpD5NyltnQWUZfShe2X43cdDQ4U9YDOCBbR_k7LbYxDz5L_7KrVfdtt8xHhRAg21-8ofcReQ.webp',
    badge: '학습 가능',
    isLocked: false,
    stageNumber: 14,
  }
];

export const HERO_SENTENCE: SentenceItem = {
  id: 'hp-sent-4',
  workId: 'happy-prince',
  workTitle: 'The Happy Prince',
  author: '오스카 와일드',
  chapter: '챕터 3 : 제비의 전언',
  english: 'The unexpected compliment made her face glow with delight.',
  korean: '뜻밖의 칭찬에 그녀의 얼굴은 기쁨으로 환하게 빛났다.',
  highlightWord: 'glow',
  difficulty: '초급',
  vocabularies: [
    { word: 'glow', meaning: '빛나다, 온기를 띠다', pronunciation: '[ɡloʊ]', example: 'Her face glowed with pride.' },
    { word: 'delight', meaning: '큰 기쁨, 즐거움', pronunciation: '[dɪˈlaɪt]', example: 'She sang with great delight.' },
    { word: 'unexpected', meaning: '뜻밖의, 예기치 않은', pronunciation: '[ˌʌnɪkˈspektɪd]' }
  ]
};

export const HAPPY_PRINCE_QUESTIONS: Question[] = [
  {
    id: 'hp-q-4',
    sentenceId: 'hp-sent-4',
    type: 'fill_blank',
    prompt: '문맥에 어울리는 가장 적절한 단어를 고르세요.',
    promptKorean: '빈칸에 들어갈 알맞은 표현을 선택하세요.',
    sentence: 'The unexpected compliment made her face _____ with delight.',
    options: ['glow', 'frown', 'darken', 'fade'],
    correctAnswer: 'glow',
    explanation: '“glow with delight”는 기쁨으로 얼굴이 환해지거나 상기되는 긍정적 감정을 묘사하는 대표적인 영문학 표현입니다.',
    workTitle: 'The Happy Prince',
    author: '오스카 와일드',
    sourceContext: '챕터 3 : 제비의 전언',
    vocabularies: [
      { word: 'glow', meaning: '빛나다, 환해지다' },
      { word: 'delight', meaning: '기쁨, 황홀' }
    ]
  },
  {
    id: 'hp-q-5',
    sentenceId: 'hp-sent-5',
    type: 'word_order',
    prompt: '주어진 단어를 올바른 순서로 배열하여 문장을 완성하세요.',
    promptKorean: '“나는 살아있는 동안 궁전에서 살았다.”',
    sentence: 'When I was alive, I lived in the Palace.',
    options: ['When', 'I', 'was', 'alive,', 'I', 'lived', 'in', 'the', 'Palace.'],
    correctAnswer: ['When', 'I', 'was', 'alive,', 'I', 'lived', 'in', 'the', 'Palace.'],
    explanation: '시간의 부사절 “When I was alive”가 먼저 오고, 주절 “I lived in the Palace”가 연결됩니다.',
    workTitle: 'The Happy Prince',
    author: '오스카 와일드',
    sourceContext: '챕터 3',
    vocabularies: [
      { word: 'alive', meaning: '살아있는' },
      { word: 'palace', meaning: '궁전' }
    ]
  },
  {
    id: 'hp-q-6',
    sentenceId: 'hp-sent-6',
    type: 'translation_match',
    prompt: '원문의 올바른 한국어 번역을 고르세요.',
    promptKorean: '“Far away in a little street there is a poor house.”',
    sentence: 'Far away in a little street there is a poor house.',
    options: [
      '저 멀리 작은 골목길에 가난한 집 한 채가 있단다.',
      '길 건너편에 커다랗고 웅장한 집이 있단다.',
      '작은 골목길 끝에는 아무도 살지 않는 빈집이 있다.',
      '멀리 떨어진 궁전 근처에 작은 상점이 하나 있다.'
    ],
    correctAnswer: '저 멀리 작은 골목길에 가난한 집 한 채가 있단다.',
    explanation: '“Far away in a little street”는 ‘저 멀리 작은 골목길에’, “there is a poor house”는 ‘가난한 집 한 채가 있다’는 의미입니다.',
    workTitle: 'The Happy Prince',
    author: '오스카 와일드',
    sourceContext: '챕터 3',
    vocabularies: [
      { word: 'far away', meaning: '저 멀리' },
      { word: 'poor', meaning: '가난한, 불쌍한' }
    ]
  },
  {
    id: 'hp-q-7',
    sentenceId: 'hp-sent-7',
    type: 'source_guess',
    prompt: '다음 명문장이 등장하는 원서 작품을 맞혀보세요.',
    promptKorean: '작품의 배경과 작가를 연상해보세요.',
    sentence: '“Dear Little Swallow, you tell me of marvellous things, but more marvellous than anything is the suffering of men and women.”',
    options: [
      'The Happy Prince (오스카 와일드)',
      'Alice in Wonderland (루이스 캐럴)',
      'The Little Prince (생텍쥐페리)',
      'Peter Pan (J.M. 배리)'
    ],
    correctAnswer: 'The Happy Prince (오스카 와일드)',
    explanation: '행복한 왕자가 제비(Swallow)에게 도시의 비극과 인간의 고통을 관찰하며 전하는 명대사입니다.',
    workTitle: 'The Happy Prince',
    author: '오스카 와일드',
    sourceContext: '챕터 4 : 인간의 고통',
    vocabularies: [
      { word: 'marvellous', meaning: '놀라운, 경이로운' },
      { word: 'suffering', meaning: '고통, 괴로움' }
    ]
  }
];

export const RANDOM_SPEED_QUESTIONS: Question[] = [
  {
    id: 'rnd-1',
    sentenceId: 'alice-sent-1',
    type: 'fill_blank',
    prompt: '빈칸에 알맞은 단어를 선택하세요.',
    promptKorean: '“앨리스는 점점 더 기묘해진다고 외쳤다.”',
    sentence: '“Curiouser and curiouser!” cried Alice.',
    options: ['Curiouser', 'Happier', 'Quicker', 'Louder'],
    correctAnswer: 'Curiouser',
    explanation: '루이스 캐럴이 만든 유명한 신조어 curiouser(더 신기하고 이상한)입니다.',
    workTitle: 'Alice in Wonderland',
    author: '루이스 캐럴',
    vocabularies: [{ word: 'curious', meaning: '궁금한, 기묘한' }]
  },
  {
    id: 'rnd-2',
    sentenceId: 'gatsby-sent-1',
    type: 'translation_match',
    prompt: '올바른 한국어 번역을 고르세요.',
    promptKorean: '“So we beat on, boats against the current, borne back ceaselessly into the past.”',
    sentence: 'So we beat on, boats against the current, borne back ceaselessly into the past.',
    options: [
      '그리하여 우리는 조류를 거스르는 배처럼 끊임없이 과거로 밀려가면서도 앞으로 나아간다.',
      '우리는 바다를 건너 미래를 향해 쉬지 않고 노를 저어간다.',
      '시간이 흐르면 모든 기억은 강물처럼 깨끗하게 잊혀진다.',
      '배를 타고 먼 바다로 떠나 새로운 세상을 탐험하기로 했다.'
    ],
    correctAnswer: '그리하여 우리는 조류를 거스르는 배처럼 끊임없이 과거로 밀려가면서도 앞으로 나아간다.',
    explanation: '위대한 개츠비의 유명한 마지막 문장입니다.',
    workTitle: 'The Great Gatsby',
    author: 'F. 스콧 피츠제럴드',
    vocabularies: [
      { word: 'current', meaning: '조류, 물살' },
      { word: 'ceaselessly', meaning: '끊임없이' }
    ]
  },
  {
    id: 'rnd-3',
    sentenceId: 'little-sent-1',
    type: 'fill_blank',
    prompt: '빈칸에 알맞은 핵심 단어를 고르세요.',
    promptKorean: '“가장 중요한 것은 눈에 보이지 않아.”',
    sentence: 'What is essential is _____ to the eye.',
    options: ['invisible', 'painful', 'obvious', 'heavy'],
    correctAnswer: 'invisible',
    explanation: '어린 왕자에서 여우가 전해주는 가장 본질적인 교훈 문장입니다.',
    workTitle: 'The Little Prince',
    author: '앙투안 드 생텍쥐페리',
    vocabularies: [
      { word: 'essential', meaning: '본질적인, 필수적인' },
      { word: 'invisible', meaning: '보이지 않는' }
    ]
  }
];

export const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    questionId: 'hp-q-1',
    sentenceId: 'hp-sent-1',
    workTitle: 'The Happy Prince',
    english: 'He is as beautiful as a weathercock, only not quite so useful.',
    korean: '그는 풍향계만큼이나 아름답지만, 다만 그렇게 쓸모가 있지는 않다.',
    wrongCount: 2,
    lastMissedAt: '어제',
    mastered: false,
    highlightWord: 'weathercock'
  },
  {
    id: 'rev-2',
    questionId: 'alice-q-1',
    sentenceId: 'alice-sent-2',
    workTitle: 'Alice in Wonderland',
    english: 'It is a poor sort of memory that only works backwards.',
    korean: '과거로만 작용하는 기억이란 참으로 형편없는 기억이다.',
    wrongCount: 1,
    lastMissedAt: '오늘',
    mastered: false,
    highlightWord: 'backwards'
  },
  {
    id: 'rev-3',
    questionId: 'gatsby-q-2',
    sentenceId: 'gatsby-sent-3',
    workTitle: 'The Great Gatsby',
    english: 'In my younger and more vulnerable years my father gave me some advice.',
    korean: '내가 더 어리고 상처받기 쉬웠던 시절, 아버지는 내게 조언을 해주셨다.',
    wrongCount: 1,
    lastMissedAt: '2일 전',
    mastered: false,
    highlightWord: 'vulnerable'
  }
];

export const INITIAL_SAVED: SavedSentence[] = [
  {
    id: 'save-1',
    sentenceId: 'hp-sent-4',
    workTitle: 'The Happy Prince',
    author: '오스카 와일드',
    english: 'The unexpected compliment made her face glow with delight.',
    korean: '뜻밖의 칭찬에 그녀의 얼굴은 기쁨으로 환하게 빛났다.',
    savedAt: '2026-09-17',
    highlightWord: 'glow',
    vocabularies: [
      { word: 'glow', meaning: '빛나다, 얼굴이 환해지다' },
      { word: 'delight', meaning: '큰 기쁨' }
    ]
  },
  {
    id: 'save-2',
    sentenceId: 'little-sent-2',
    workTitle: 'The Little Prince',
    author: '생텍쥐페리',
    english: 'It is the time you have wasted for your rose that makes your rose so important.',
    korean: '네 장미가 그토록 소중해진 것은 네가 그 장미를 위해 바친 시간 때문이야.',
    savedAt: '2026-09-16',
    highlightWord: 'wasted',
    vocabularies: [
      { word: 'waste', meaning: '바치다, 쓰다' },
      { word: 'important', meaning: '소중한, 중요한' }
    ]
  },
  {
    id: 'save-3',
    sentenceId: 'gatsby-sent-1',
    workTitle: 'The Great Gatsby',
    author: 'F. 스콧 피츠제럴드',
    english: 'So we beat on, boats against the current, borne back ceaselessly into the past.',
    korean: '그리하여 우리는 조류를 거스르는 배처럼 끊임없이 과거로 밀려가면서도 앞으로 나아간다.',
    savedAt: '2026-09-15',
    highlightWord: 'ceaselessly',
    vocabularies: [
      { word: 'ceaselessly', meaning: '끊임없이' },
      { word: 'current', meaning: '물살, 조류' }
    ]
  }
];

export const INITIAL_WEEKLY_STATS: WeeklyStat[] = [
  { dayName: '월', dateStr: '14일', isCompleted: true, isToday: false, count: 8 },
  { dayName: '화', dateStr: '15일', isCompleted: true, isToday: false, count: 12 },
  { dayName: '오늘', dateStr: '16일', isCompleted: true, isToday: true, count: 4 },
  { dayName: '목', dateStr: '17일', isCompleted: false, isToday: false, count: 0 },
  { dayName: '금', dateStr: '18일', isCompleted: false, isToday: false, count: 0 },
  { dayName: '토', dateStr: '19일', isCompleted: false, isToday: false, count: 0 },
  { dayName: '일', dateStr: '20일', isCompleted: false, isToday: false, count: 0 }
];
