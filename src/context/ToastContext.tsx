import React, { createContext, useCallback, useContext, useState } from 'react';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number; // ms
}

interface ToastContextValue {
  push: (message: string, options?: { type?: Toast['type']; duration?: number }) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((message: string, options?: { type?: Toast['type']; duration?: number }) => {
    const id = Math.random().toString(36).slice(2);
    const toast: Toast = { id, message, type: options?.type || 'info', duration: options?.duration || 3000 };
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter(t => t.id !== id));
    }, toast.duration);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed z-[999] bottom-4 right-4 flex flex-col gap-3 max-w-sm">
        {toasts.map(t => (
          <div key={t.id} className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white animate-slide-up backdrop-blur-sm bg-opacity-90 ${
            t.type === 'success' ? 'bg-emerald-600' : t.type === 'error' ? 'bg-red-600' : 'bg-gray-800'
          }`}>{t.message}</div>
        ))}
      </div>
      <style>{`
        @keyframes slide-up { from { transform: translateY(8px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-up { animation: slide-up 0.35s cubic-bezier(.22,.68,.11,1.17); }
      `}</style>
    </ToastContext.Provider>
  );
};
