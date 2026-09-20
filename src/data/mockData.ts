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
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXj5wz-gf-H0dGklBTSUIEfyEHN0UFxkUOlOPG_m66uaJ35j0rKdZauh2kPBRHH0nw6uGHNaCQB56DWMDtH-84aZr9SXpg4uAJTx7aigWYmNEeCcEHhuUXyGQptlgrgyQvuIcBZV7Lyi6Lz3J7h62jFX-3UdKIG7gRHNf4vAlN4_ZqgHJzpe-XWCmtZdYvPTzu_VG2ZiqCorg-TxW-LlxPyzxDpq_1cTjWFr8iTlwaiUFUtnea8ebYvg',
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
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqFffogrXtNdPEC1TKUeIDfnIIXWyEU76mMRvTQ3OZHYnLud8Xj25e5sw1a7cJpFhyEz2hO9Mrk6dMXNEMdC0OqDOdTcaSOtRrQLC4B3NH6S3oWE5tSwSvyR2uNwOE4F-ptAWILEDjaUuivWC6RfUcbSXL7aA_nJAN1OPizaAd-1OLwilMxqC2ZKUKYcbrBkIoEOaEp4Hxr-O_lEWCbZm1LiaEBE5Rb0v73Wi2X3JMyNtZTfQUdBOZDw',
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
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcdSQTh8cyOQ4uq7NsQA03QOBv1n-Emg0BA1dUGywC1_7T9OaP8NuvgC0-EORkolpSe_rFv6DXqSz-c7jvbQ-DMz68PIh2OmJHw4xUS0tPS92-qBXOn0syb6AF_j8Vt2YmIyHplOxrU286aR3CPAgR1iAgrgoUS7U0rWU1XkBw0eEVSjtDJvOcDTT3EjxmS-rDq2Fo4amyqfUckC3ABU7bCWcRfvql2mn_75FUkFAH6hXYIc_YkYivWA',
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
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXj5wz-gf-H0dGklBTSUIEfyEHN0UFxkUOlOPG_m66uaJ35j0rKdZauh2kPBRHH0nw6uGHNaCQB56DWMDtH-84aZr9SXpg4uAJTx7aigWYmNEeCcEHhuUXyGQptlgrgyQvuIcBZV7Lyi6Lz3J7h62jFX-3UdKIG7gRHNf4vAlN4_ZqgHJzpe-XWCmtZdYvPTzu_VG2ZiqCorg-TxW-LlxPyzxDpq_1cTjWFr8iTlwaiUFUtnea8ebYvg',
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
    coverImage: 'https://www.gutenberg.org/cache/epub/41445/pg41445.cover.medium.jpg',
    badge: 'Lv.6 오픈',
    isLocked: true,
    lockRequirement: '앞의 작품 학습을 완료하면 열립니다.',
    stageNumber: 5,
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
