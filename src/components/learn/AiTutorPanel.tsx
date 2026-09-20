import React, { useState } from 'react';
import { ChatMessage } from '../../types';
import { askSentenceTutor } from '../../lib/aiTutor';

interface AiTutorPanelProps {
  englishSentence: string;
  koreanTranslation: string;
  workTitle: string;
  author: string;
  onClose: () => void;
}

export const AiTutorPanel: React.FC<AiTutorPanelProps> = ({
  englishSentence,
  koreanTranslation,
  workTitle,
  author,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      role: 'user',
      text: trimmed,
      createdAt: new Date().toISOString(),
    };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setIsSending(true);

    try {
      const reply = await askSentenceTutor({
        englishSentence,
        koreanTranslation,
        workTitle,
        author,
        history: nextMessages.map(m => ({ role: m.role, text: m.text })),
        userMessage: trimmed,
      });
      setMessages(prev => [
        ...prev,
        { id: `msg-${Date.now()}-m`, role: 'model', text: reply, createdAt: new Date().toISOString() },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now()}-e`,
          role: 'model',
          text: 'AI 튜터 연결에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
          createdAt: new Date().toISOString(),
          isError: true,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="rounded-t-3xl sm:rounded-3xl bg-surface-container-lowest border border-white/80 shadow-2xl flex flex-col overflow-hidden h-[85vh] sm:h-[70vh] w-full sm:max-w-md">
        {/* Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-surface-container-high shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-xl text-secondary">smart_toy</span>
            <h3 className="text-sm font-bold text-on-surface">AI 튜터에게 물어보기</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
            title="닫기"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Sentence context */}
        <div className="px-4 py-3 border-b border-surface-container-high shrink-0 bg-surface-container-low">
          <p className="text-xs font-semibold text-on-surface leading-relaxed">{englishSentence}</p>
          {koreanTranslation && (
            <p className="text-[11px] text-on-surface-variant mt-1">{koreanTranslation}</p>
          )}
        </div>

        {/* Message list */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.length === 0 && (
            <p className="text-xs text-on-surface-variant text-center pt-6">
              이 문장의 어휘, 문법, 맥락에 대해 무엇이든 물어보세요.
            </p>
          )}
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-primary text-on-primary'
                    : msg.isError
                    ? 'bg-error-container/40 border border-error text-on-surface'
                    : 'bg-surface-container-low text-on-surface'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isSending && (
            <div className="flex justify-start">
              <div className="max-w-[80%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm bg-surface-container-low text-on-surface-variant">
                답변을 생성하는 중...
              </div>
            </div>
          )}
        </div>

        {/* Input row */}
        <div className="p-3 border-t border-surface-container-high shrink-0 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSending}
            placeholder="문장에 대해 궁금한 점을 입력하세요"
            className="flex-1 px-4 py-2.5 rounded-full bg-surface-container-low text-sm text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
          />
          <button
            onClick={handleSend}
            disabled={isSending || !input.trim()}
            className="p-2.5 rounded-full bg-primary text-on-primary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors hover:bg-primary/90"
            title="전송"
          >
            <span className="material-symbols-outlined text-xl">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
