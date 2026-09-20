import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Question, QuestionType } from '../../types';
import { speakEnglishText } from '../../utils/speech';
import { AiTutorPanel } from './AiTutorPanel';

export const LearningSessionView: React.FC = () => {
  const {
    activeSession,
    submitSessionAnswer,
    finishCurrentSession,
    exitSession,
    toggleSaveSentence,
    isSentenceSaved,
    user
  } = useApp();

  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [arrangedWords, setArrangedWords] = useState<string[]>([]);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showAiTutor, setShowAiTutor] = useState(false);

  if (!activeSession) return null;

  const currentQIndex = activeSession.currentIndex;
  const currentQuestion: Question = activeSession.questions[currentQIndex] || activeSession.questions[0];
  const isLastQuestion = currentQIndex >= activeSession.questions.length - 1;
  const progressPercent = Math.round(((currentQIndex) / activeSession.questions.length) * 100);

  // Auto-speak on question load if sound enabled
  useEffect(() => {
    setSelectedAnswer('');
    setArrangedWords([]);
    setIsAnswerChecked(false);
    setIsCorrect(false);

    if (user.soundEnabled && currentQuestion.type !== 'word_order') {
      speakEnglishText(currentQuestion.sentence, user.speechRate);
    }
  }, [currentQIndex]);

  // Handle TTS
  const handleTTS = () => {
    setIsPlayingAudio(true);
    speakEnglishText(currentQuestion.sentence, user.speechRate);
    setTimeout(() => setIsPlayingAudio(false), 2000);
  };

  // Check Answer Handler
  const handleCheckAnswer = () => {
    if (isAnswerChecked) {
      // Proceed to next question or finish
      submitSessionAnswer(
        currentQuestion.id,
        currentQuestion.type === 'word_order' ? arrangedWords : selectedAnswer,
        isCorrect
      );

      if (isLastQuestion) {
        finishCurrentSession();
      }
      return;
    }

    // Evaluate
    let correct = false;
    if (currentQuestion.type === 'word_order') {
      const correctArr = Array.isArray(currentQuestion.correctAnswer)
        ? currentQuestion.correctAnswer
        : [currentQuestion.correctAnswer];
      correct = JSON.stringify(arrangedWords) === JSON.stringify(correctArr);
    } else {
      correct = selectedAnswer === currentQuestion.correctAnswer;
    }

    setIsCorrect(correct);
    setIsAnswerChecked(true);

    // Play feedback tone / pronunciation
    if (user.soundEnabled) {
      speakEnglishText(currentQuestion.sentence, user.speechRate);
    }
  };

  // Word order helper: add word
  const handlePickWord = (word: string, index: number) => {
    if (isAnswerChecked) return;
    setArrangedWords(prev => [...prev, word]);
  };

  // Word order helper: remove word
  const handleRemoveWord = (index: number) => {
    if (isAnswerChecked) return;
    setArrangedWords(prev => prev.filter((_, i) => i !== index));
  };

  const isReadyToSubmit =
    currentQuestion.type === 'word_order'
      ? arrangedWords.length === currentQuestion.options.length
      : selectedAnswer.trim() !== '';

  const isSaved = isSentenceSaved(currentQuestion.sentenceId);

  return (
    <div className="fixed inset-0 z-50 bg-surface flex flex-col overflow-hidden">
      {/* Top Header for Learning Session (Section 3.2: Hides global nav) */}
      <header className="h-16 px-4 sm:px-6 bg-surface-container-lowest/90 backdrop-blur-md border-b border-surface-container-high flex items-center justify-between gap-4">
        {/* Exit Button */}
        <button
          onClick={() => setShowExitConfirm(true)}
          className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
          title="학습 종료"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        {/* Progress bar and counter */}
        <div className="flex-1 max-w-md flex flex-col items-center gap-1">
          <div className="w-full h-2.5 rounded-full bg-surface-container-high overflow-hidden shadow-inner p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary-container via-secondary-container to-secondary transition-all duration-300"
              style={{ width: `${Math.max(5, progressPercent)}%` }}
            ></div>
          </div>
          <span className="text-[11px] font-bold text-on-surface-variant">
            {currentQIndex + 1} / {activeSession.questions.length} 문장
          </span>
        </div>

        {/* Action icons: Save & Audio */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() =>
              toggleSaveSentence({
                id: currentQuestion.sentenceId,
                english: currentQuestion.sentence,
                korean: currentQuestion.promptKorean || '명작 원서 문장',
                workTitle: currentQuestion.workTitle,
                author: currentQuestion.author,
                highlightWord: currentQuestion.vocabularies?.[0]?.word
              })
            }
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              isSaved ? 'text-secondary' : 'text-on-surface-variant hover:text-on-surface'
            }`}
            title={isSaved ? '문장 보관됨' : '단어장에 문장 저장'}
          >
            <span
              className="material-symbols-outlined text-2xl"
              style={isSaved ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              bookmark
            </span>
          </button>
        </div>
      </header>

      {/* Main Learning Content Area */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 max-w-2xl mx-auto w-full flex flex-col justify-between">
        <div className="space-y-6">
          {/* Question Type Tag & Work Context */}
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold shadow-xs">
              {currentQuestion.type === 'fill_blank' && '빈칸 채우기'}
              {currentQuestion.type === 'word_order' && '문장 어순 배열'}
              {currentQuestion.type === 'translation_match' && '한국어 의미 매칭'}
              {currentQuestion.type === 'source_guess' && '작품 및 출처 맞히기'}
            </span>
            <span className="text-xs font-semibold text-secondary">
              {currentQuestion.workTitle}
            </span>
          </div>

          {/* Question Prompt */}
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-on-surface">
              {currentQuestion.prompt}
            </h2>
          </div>

          {/* Target Sentence Card */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-white/80 shadow-sm relative space-y-3">
            <div className="flex items-start justify-between gap-3">
              <p className="text-base sm:text-lg font-semibold text-on-surface leading-relaxed">
                {currentQuestion.type === 'fill_blank' ? (
                  currentQuestion.sentence.replace(
                    '_____',
                    selectedAnswer ? `[ ${selectedAnswer} ]` : '_______'
                  )
                ) : (
                  currentQuestion.sentence
                )}
              </p>

              <div className="flex items-center gap-1.5 shrink-0">
                {/* Pronunciation speech button */}
                <button
                  onClick={handleTTS}
                  className={`p-2 rounded-full transition-all shrink-0 cursor-pointer ${
                    isPlayingAudio
                      ? 'bg-secondary text-on-secondary shadow-sm scale-105'
                      : 'bg-surface-container-low text-primary hover:bg-primary-container'
                  }`}
                  title="발음 듣기"
                >
                  <span className="material-symbols-outlined text-xl">volume_up</span>
                </button>

                {/* AI tutor button */}
                <button
                  onClick={() => setShowAiTutor(true)}
                  className="p-2 rounded-full transition-all shrink-0 cursor-pointer bg-surface-container-low text-secondary hover:bg-secondary-container"
                  title="AI 튜터에게 물어보기"
                >
                  <span className="material-symbols-outlined text-xl">smart_toy</span>
                </button>
              </div>
            </div>

            {(currentQuestion.type === 'fill_blank' || currentQuestion.type === 'word_order') &&
              currentQuestion.promptKorean && (
                <p className="text-sm text-secondary font-medium">
                  {currentQuestion.promptKorean}
                </p>
              )}
          </div>

          {/* Interactive Question Type Renderers (Section 7.2) */}
          {/* TYPE 1: Fill in the Blank */}
          {currentQuestion.type === 'fill_blank' && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              {currentQuestion.options.map(option => {
                const isSelected = selectedAnswer === option;
                let btnStyle = 'bg-surface-container-lowest border-surface-container-high text-on-surface hover:bg-surface-container-low';
                
                if (isAnswerChecked) {
                  if (option === currentQuestion.correctAnswer) {
                    btnStyle = 'bg-primary text-on-primary border-primary shadow-sm font-bold';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'bg-error text-on-error border-error shadow-sm';
                  } else {
                    btnStyle = 'opacity-50 bg-surface-container-low text-on-surface-variant';
                  }
                } else if (isSelected) {
                  btnStyle = 'bg-primary-container text-on-primary-container border-primary font-bold shadow-xs';
                }

                return (
                  <button
                    key={option}
                    disabled={isAnswerChecked}
                    onClick={() => setSelectedAnswer(option)}
                    className={`p-4 rounded-2xl border text-sm font-semibold transition-all cursor-pointer text-center ${btnStyle}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          )}

          {/* TYPE 2: Word Order Arrangement */}
          {currentQuestion.type === 'word_order' && (
            <div className="space-y-4 pt-2">
              {/* Answer Tray (Words placed by user) */}
              <div className="min-h-[64px] p-3 rounded-2xl bg-surface-container-low border-2 border-dashed border-outline-variant/60 flex flex-wrap gap-2 items-center">
                {arrangedWords.length === 0 ? (
                  <span className="text-xs text-on-surface-variant/70 pl-2">
                    아래 단어 조각을 터치하여 문장을 순서대로 완성하세요.
                  </span>
                ) : (
                  arrangedWords.map((word, idx) => (
                    <button
                      key={idx}
                      disabled={isAnswerChecked}
                      onClick={() => handleRemoveWord(idx)}
                      className="px-3 py-1.5 rounded-full bg-primary text-on-primary text-xs font-bold shadow-xs hover:bg-primary/80 transition-transform active:scale-95 cursor-pointer flex items-center gap-1"
                    >
                      <span>{word}</span>
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  ))
                )}
              </div>

              {/* Scrambled Word Bank */}
              <div className="flex flex-wrap gap-2 pt-2">
                {currentQuestion.options.map((word, idx) => {
                  // Count occurrences in arranged
                  const usedCount = arrangedWords.filter(w => w === word).length;
                  const totalCountInOptions = currentQuestion.options.filter(w => w === word).length;
                  const isUsed = usedCount >= totalCountInOptions;

                  return (
                    <button
                      key={idx}
                      disabled={isUsed || isAnswerChecked}
                      onClick={() => handlePickWord(word, idx)}
                      className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all shadow-xs ${
                        isUsed
                          ? 'bg-surface-container-high text-outline cursor-not-allowed opacity-40'
                          : 'bg-surface-container-lowest text-on-surface hover:bg-primary-container border border-white/80 cursor-pointer active:scale-95'
                      }`}
                    >
                      {word}
                    </button>
                  );
                })}
              </div>

              {arrangedWords.length > 0 && !isAnswerChecked && (
                <button
                  onClick={() => setArrangedWords([])}
                  className="text-xs text-secondary font-bold hover:underline flex items-center gap-1 pt-1"
                >
                  <span className="material-symbols-outlined text-sm">restart_alt</span>
                  배열 초기화
                </button>
              )}
            </div>
          )}

          {/* TYPE 3: Translation Match */}
          {currentQuestion.type === 'translation_match' && (
            <div className="space-y-2.5 pt-2">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedAnswer === option;
                let itemStyle = 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-low border-surface-container-high';

                if (isAnswerChecked) {
                  if (option === currentQuestion.correctAnswer) {
                    itemStyle = 'bg-primary text-on-primary border-primary font-bold shadow-sm';
                  } else if (isSelected && !isCorrect) {
                    itemStyle = 'bg-error text-on-error border-error shadow-sm';
                  } else {
                    itemStyle = 'opacity-50 bg-surface-container-low text-on-surface-variant';
                  }
                } else if (isSelected) {
                  itemStyle = 'bg-primary-container text-on-primary-container border-primary font-bold shadow-xs';
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswerChecked}
                    onClick={() => setSelectedAnswer(option)}
                    className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-start gap-3 cursor-pointer ${itemStyle}`}
                  >
                    <span className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{option}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* TYPE 4: Source Guessing */}
          {currentQuestion.type === 'source_guess' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {currentQuestion.options.map(option => {
                const isSelected = selectedAnswer === option;
                let cardStyle = 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-low border-surface-container-high';

                if (isAnswerChecked) {
                  if (option === currentQuestion.correctAnswer) {
                    cardStyle = 'bg-primary text-on-primary border-primary font-bold shadow-sm';
                  } else if (isSelected && !isCorrect) {
                    cardStyle = 'bg-error text-on-error border-error shadow-sm';
                  } else {
                    cardStyle = 'opacity-50 bg-surface-container-low text-on-surface-variant';
                  }
                } else if (isSelected) {
                  cardStyle = 'bg-secondary-fixed text-on-secondary-fixed border-secondary font-bold shadow-xs';
                }

                return (
                  <button
                    key={option}
                    disabled={isAnswerChecked}
                    onClick={() => setSelectedAnswer(option)}
                    className={`p-4 rounded-2xl border text-sm font-semibold transition-all text-left flex items-center gap-3 cursor-pointer ${cardStyle}`}
                  >
                    <span className="material-symbols-outlined text-xl text-primary">book</span>
                    <span className="leading-snug">{option}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Feedback Sheet and Bottom Action Dock (Section 7.1) */}
        <div className="pt-6">
          {isAnswerChecked && (
            <div
              className={`p-5 rounded-2xl mb-4 border transition-all ${
                isCorrect
                  ? 'bg-primary-container/30 border-primary text-on-surface'
                  : 'bg-error-container/40 border-error text-on-surface'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-2xl font-bold text-primary">
                  {isCorrect ? 'check_circle' : 'error'}
                </span>
                <span className="text-base font-extrabold">
                  {isCorrect ? '정답입니다! 완벽해요! ✨' : '아쉬워요, 다시 확인해볼까요?'}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                {currentQuestion.explanation}
              </p>

              {/* Vocab details if available */}
              {currentQuestion.vocabularies && currentQuestion.vocabularies.length > 0 && (
                <div className="mt-3 pt-3 border-t border-black/10 flex flex-wrap gap-2">
                  {currentQuestion.vocabularies.map((v, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-full bg-surface-container-lowest text-xs font-semibold text-on-surface shadow-xs"
                    >
                      {v.word}: {v.meaning}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Primary Action Button: 52px+ */}
          <button
            onClick={handleCheckAnswer}
            disabled={!isReadyToSubmit && !isAnswerChecked}
            className={`w-full min-h-[56px] py-4 px-6 rounded-full text-base font-extrabold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              !isReadyToSubmit && !isAnswerChecked
                ? 'bg-surface-container-high text-outline cursor-not-allowed'
                : isAnswerChecked
                ? isCorrect
                  ? 'bg-primary text-on-primary hover:bg-primary/90'
                  : 'bg-secondary text-on-secondary hover:bg-secondary/90'
                : 'bg-gradient-to-r from-primary via-secondary to-primary-container text-on-primary hover:scale-[1.01]'
            }`}
          >
            <span>
              {isAnswerChecked
                ? isLastQuestion
                  ? '결과 보기 ✨'
                  : '다음 문제로 이동'
                : '정답 확인하기'}
            </span>
            <span className="material-symbols-outlined text-xl">
              {isAnswerChecked ? (isLastQuestion ? 'celebration' : 'arrow_forward') : 'check'}
            </span>
          </button>
        </div>
      </main>

      {/* Exit Confirmation Dialog (Section 3.2) */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-surface-container-lowest p-6 border border-white/90 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-secondary-container/40 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-2xl">logout</span>
            </div>
            <h3 className="text-lg font-bold text-on-surface">학습을 종료하시겠습니까?</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              지금까지 푼 문제와 저장한 문장은 안전하게 보관됩니다. 언제든 다시 이어서 학습할 수 있어요.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-3 rounded-full bg-surface-container-high text-on-surface text-xs font-bold hover:bg-surface-container-highest cursor-pointer"
              >
                계속 학습하기
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  exitSession();
                }}
                className="flex-1 py-3 rounded-full bg-error text-on-error text-xs font-bold hover:bg-error/90 cursor-pointer"
              >
                종료하기
              </button>
            </div>
          </div>
        </div>
      )}

      {showAiTutor && (
        <AiTutorPanel
          englishSentence={currentQuestion.sentence}
          koreanTranslation={currentQuestion.promptKorean || ''}
          workTitle={currentQuestion.workTitle}
          author={currentQuestion.author}
          onClose={() => setShowAiTutor(false)}
        />
      )}
    </div>
  );
};
