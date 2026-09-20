import React, { useEffect, useState } from 'react';
import {
  fetchPendingBookContents,
  fetchPendingMovieQuotes,
  fetchApprovedSentences,
  fetchPendingGeneratedQuestions,
  generateQuestion,
  submitReview,
  PendingBookContent,
  PendingMovieQuote,
  ApprovedSentence,
  PendingGeneratedQuestion,
  GeneratedQuestionType,
  ReviewTable,
} from '../../lib/adminReview';

const QUESTION_TYPE_LABELS: Record<GeneratedQuestionType, string> = {
  fill_blank: '빈칸 채우기',
  word_order: '어순 배열',
  translation_match: '번역 매칭',
};

const PASSCODE_KEY = 'ws_admin_passcode';

interface AdminReviewPanelProps {
  onClose: () => void;
}

export const AdminReviewPanel: React.FC<AdminReviewPanelProps> = ({ onClose }) => {
  const [passcode, setPasscode] = useState(() => sessionStorage.getItem(PASSCODE_KEY) || '');
  const [passcodeInput, setPasscodeInput] = useState(passcode);
  const [books, setBooks] = useState<PendingBookContent[]>([]);
  const [movies, setMovies] = useState<PendingMovieQuote[]>([]);
  const [approvedSentences, setApprovedSentences] = useState<ApprovedSentence[]>([]);
  const [generatedQuestions, setGeneratedQuestions] = useState<PendingGeneratedQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [generatingKey, setGeneratingKey] = useState<string | null>(null);

  const loadPending = () => {
    setIsLoading(true);
    setLoadError(null);
    Promise.all([
      fetchPendingBookContents(),
      fetchPendingMovieQuotes(),
      // generated_questions is a newer, separately-migrated table — isolate it
      // so a not-yet-applied migration doesn't take down the whole panel.
      fetchApprovedSentences().catch(() => []),
      fetchPendingGeneratedQuestions().catch(() => []),
    ])
      .then(([bookRows, movieRows, approvedRows, generatedRows]) => {
        setBooks(bookRows);
        setMovies(movieRows);
        setApprovedSentences(approvedRows);
        setGeneratedQuestions(generatedRows);
      })
      .catch(() => setLoadError('검수 대기 목록을 불러오지 못했습니다.'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleSavePasscode = () => {
    setPasscode(passcodeInput);
    sessionStorage.setItem(PASSCODE_KEY, passcodeInput);
    setActionError(null);
  };

  const handleAction = async (
    table: ReviewTable,
    id: string | number,
    action: 'approve' | 'reject'
  ) => {
    if (!passcode) {
      setActionError('먼저 패스코드를 입력해주세요.');
      return;
    }
    const key = `${table}-${id}`;
    setProcessingId(key);
    setActionError(null);
    try {
      await submitReview(passcode, table, id, action);
      if (table === 'book_contents') {
        setBooks(prev => prev.filter(b => b.candidateId !== id));
      } else if (table === 'movie_quotes_ko_en') {
        setMovies(prev => prev.filter(m => m.id !== id));
      } else {
        setGeneratedQuestions(prev => prev.filter(g => g.id !== id));
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes('401')) {
        sessionStorage.removeItem(PASSCODE_KEY);
        setPasscode('');
      }
      setActionError(err instanceof Error ? err.message : '처리 중 오류가 발생했습니다.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleGenerate = async (sentence: ApprovedSentence, type: GeneratedQuestionType) => {
    if (!passcode) {
      setActionError('먼저 패스코드를 입력해주세요.');
      return;
    }
    const key = `${sentence.sourceTable}-${sentence.sourceId}-${type}`;
    setGeneratingKey(key);
    setActionError(null);
    try {
      await generateQuestion(passcode, sentence.sourceTable, sentence.sourceId, type);
      const refreshed = await fetchPendingGeneratedQuestions();
      setGeneratedQuestions(refreshed);
    } catch (err) {
      if (err instanceof Error && err.message.includes('401')) {
        sessionStorage.removeItem(PASSCODE_KEY);
        setPasscode('');
      }
      setActionError(err instanceof Error ? err.message : 'AI 문제 생성에 실패했습니다.');
    } finally {
      setGeneratingKey(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-surface flex flex-col overflow-hidden">
      <header className="h-16 px-4 sm:px-6 bg-surface-container-lowest/90 backdrop-blur-md border-b border-surface-container-high flex items-center justify-between gap-4 shrink-0">
        <button
          onClick={onClose}
          className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
          title="닫기"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>
        <h1 className="text-sm font-bold text-on-surface">관리자 콘텐츠 검수</h1>
        <div className="w-9" />
      </header>

      <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 max-w-2xl mx-auto w-full space-y-6">
        {/* Passcode entry */}
        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-white/80 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-on-surface flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base text-secondary">lock</span>
            관리자 패스코드
          </h3>
          <div className="flex items-center gap-2">
            <input
              type="password"
              value={passcodeInput}
              onChange={e => setPasscodeInput(e.target.value)}
              placeholder="승인/거부에 필요한 패스코드"
              className="flex-1 px-4 py-2 rounded-full bg-surface-container-low text-sm text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleSavePasscode}
              className="px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-bold cursor-pointer hover:bg-primary/90"
            >
              저장
            </button>
          </div>
          {passcode && <p className="text-[11px] text-on-surface-variant">패스코드가 이 브라우저 세션에 저장되어 있습니다.</p>}
          {actionError && <p className="text-[11px] text-error font-semibold">{actionError}</p>}
        </div>

        {isLoading && <p className="text-xs text-on-surface-variant text-center py-6">검수 대기 목록을 불러오는 중...</p>}
        {loadError && <p className="text-xs text-error text-center py-6">{loadError}</p>}

        {!isLoading && !loadError && (
          <>
            {/* Books */}
            <section className="space-y-3">
              <h2 className="text-sm font-bold text-on-surface">
                도서 검수 대기 <span className="text-on-surface-variant font-normal">({books.length})</span>
              </h2>
              {books.length === 0 ? (
                <p className="text-xs text-on-surface-variant">검수 대기 중인 도서 문장이 없습니다.</p>
              ) : (
                <div className="space-y-2.5">
                  {books.map(b => (
                    <div
                      key={b.candidateId}
                      className="p-4 rounded-2xl bg-surface-container-lowest border border-white/80 shadow-xs space-y-2"
                    >
                      <p className="text-[11px] font-semibold text-secondary">{b.workId} · {b.segmentHeading}</p>
                      <p className="text-sm font-semibold text-on-surface leading-relaxed">{b.originalText}</p>
                      <p className="text-xs text-on-surface-variant leading-relaxed">{b.translationKo}</p>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          disabled={processingId === `book_contents-${b.candidateId}`}
                          onClick={() => handleAction('book_contents', b.candidateId, 'approve')}
                          className="flex-1 py-2 rounded-full bg-primary text-on-primary text-xs font-bold cursor-pointer hover:bg-primary/90 disabled:opacity-50"
                        >
                          승인
                        </button>
                        <button
                          disabled={processingId === `book_contents-${b.candidateId}`}
                          onClick={() => handleAction('book_contents', b.candidateId, 'reject')}
                          className="flex-1 py-2 rounded-full bg-surface-container-high text-error text-xs font-bold cursor-pointer hover:bg-error-container/30 disabled:opacity-50"
                        >
                          거부
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Movies */}
            <section className="space-y-3">
              <h2 className="text-sm font-bold text-on-surface">
                영화 대사 검수 대기 <span className="text-on-surface-variant font-normal">({movies.length})</span>
              </h2>
              {movies.length === 0 ? (
                <p className="text-xs text-on-surface-variant">검수 대기 중인 영화 대사가 없습니다.</p>
              ) : (
                <div className="space-y-2.5">
                  {movies.map(m => (
                    <div
                      key={m.id}
                      className="p-4 rounded-2xl bg-surface-container-lowest border border-white/80 shadow-xs space-y-2"
                    >
                      <p className="text-[11px] font-semibold text-secondary">{m.movieTitle} · 대사 {m.quoteNo}</p>
                      <p className="text-sm font-semibold text-on-surface leading-relaxed">{m.originalKo}</p>
                      <p className="text-xs text-on-surface-variant leading-relaxed">{m.translationEn}</p>
                      {m.notes && <p className="text-[11px] text-on-surface-variant/80 italic">{m.notes}</p>}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          disabled={processingId === `movie_quotes_ko_en-${m.id}`}
                          onClick={() => handleAction('movie_quotes_ko_en', m.id, 'approve')}
                          className="flex-1 py-2 rounded-full bg-primary text-on-primary text-xs font-bold cursor-pointer hover:bg-primary/90 disabled:opacity-50"
                        >
                          승인
                        </button>
                        <button
                          disabled={processingId === `movie_quotes_ko_en-${m.id}`}
                          onClick={() => handleAction('movie_quotes_ko_en', m.id, 'reject')}
                          className="flex-1 py-2 rounded-full bg-surface-container-high text-error text-xs font-bold cursor-pointer hover:bg-error-container/30 disabled:opacity-50"
                        >
                          거부
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* AI Question Generation */}
            <section className="space-y-3">
              <h2 className="text-sm font-bold text-on-surface">
                AI 문제 생성 <span className="text-on-surface-variant font-normal">(승인된 문장 {approvedSentences.length}개)</span>
              </h2>
              {approvedSentences.length === 0 ? (
                <p className="text-xs text-on-surface-variant">문제를 생성할 승인된 문장이 없습니다.</p>
              ) : (
                <div className="space-y-2.5">
                  {approvedSentences.map(s => (
                    <div
                      key={`${s.sourceTable}-${s.sourceId}`}
                      className="p-4 rounded-2xl bg-surface-container-lowest border border-white/80 shadow-xs space-y-2"
                    >
                      <p className="text-[11px] font-semibold text-secondary">
                        {s.workTitle} · 실제 출제 유형: {QUESTION_TYPE_LABELS[s.questionType]}
                      </p>
                      <p className="text-sm font-semibold text-on-surface leading-relaxed">{s.englishText}</p>
                      <p className="text-xs text-on-surface-variant leading-relaxed">{s.koreanText}</p>
                      <div className="flex items-center gap-2 pt-1 flex-wrap">
                        <button
                          disabled={generatingKey === `${s.sourceTable}-${s.sourceId}-${s.questionType}`}
                          onClick={() => handleGenerate(s, s.questionType)}
                          className="px-3 py-2 rounded-full bg-secondary-container/40 text-secondary text-xs font-bold cursor-pointer hover:bg-secondary-container/70 disabled:opacity-50"
                        >
                          {generatingKey === `${s.sourceTable}-${s.sourceId}-${s.questionType}`
                            ? '생성 중...'
                            : `AI로 "${QUESTION_TYPE_LABELS[s.questionType]}" 생성`}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Generated Question Review Queue */}
            <section className="space-y-3">
              <h2 className="text-sm font-bold text-on-surface">
                생성된 문제 검토 대기 <span className="text-on-surface-variant font-normal">({generatedQuestions.length})</span>
              </h2>
              {generatedQuestions.length === 0 ? (
                <p className="text-xs text-on-surface-variant">검토 대기 중인 생성 문제가 없습니다.</p>
              ) : (
                <div className="space-y-2.5">
                  {generatedQuestions.map(q => (
                    <div
                      key={q.id}
                      className="p-4 rounded-2xl bg-surface-container-lowest border border-white/80 shadow-xs space-y-2"
                    >
                      <p className="text-[11px] font-semibold text-secondary">
                        {q.workTitle} · {QUESTION_TYPE_LABELS[q.questionType]}
                      </p>
                      <p className="text-xs text-on-surface-variant">{q.prompt}</p>
                      <p className="text-sm font-semibold text-on-surface leading-relaxed">{q.sentence}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {q.options.map((opt, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-full bg-surface-container-low text-xs font-semibold text-on-surface"
                          >
                            {opt}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs font-bold text-primary">
                        정답: {Array.isArray(q.correctAnswer) ? q.correctAnswer.join(' ') : q.correctAnswer}
                      </p>
                      <p className="text-xs text-on-surface-variant leading-relaxed">{q.explanation}</p>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          disabled={processingId === `generated_questions-${q.id}`}
                          onClick={() => handleAction('generated_questions', q.id, 'approve')}
                          className="flex-1 py-2 rounded-full bg-primary text-on-primary text-xs font-bold cursor-pointer hover:bg-primary/90 disabled:opacity-50"
                        >
                          승인
                        </button>
                        <button
                          disabled={processingId === `generated_questions-${q.id}`}
                          onClick={() => handleAction('generated_questions', q.id, 'reject')}
                          className="flex-1 py-2 rounded-full bg-surface-container-high text-error text-xs font-bold cursor-pointer hover:bg-error-container/30 disabled:opacity-50"
                        >
                          거부
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
};
