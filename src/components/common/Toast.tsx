import React from 'react';
import { useApp } from '../../context/AppContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div
      id="toast-notification"
      role="status"
      aria-live="polite"
      className="fixed bottom-24 sm:bottom-8 right-4 sm:right-8 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-on-surface text-surface shadow-[0_12px_32px_rgba(36,0,91,0.25)] border border-white/20 animate-bounce"
    >
      <span className="material-symbols-outlined text-primary-container text-xl">
        check_circle
      </span>
      <span className="text-sm font-semibold tracking-tight">{toastMessage}</span>
    </div>
  );
};
