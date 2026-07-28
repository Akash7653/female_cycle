import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, X, AlertTriangle } from 'lucide-react';

type ToastKind = 'success' | 'info' | 'error';
interface Toast {
  id: string;
  message: string;
  kind: ToastKind;
}

interface ToastContextValue {
  toast: (message: string, kind?: ToastKind) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, kind: ToastKind = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 max-w-sm">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="glass-card flex items-start gap-3 px-4 py-3 shadow-soft"
            >
              {t.kind === 'success' && <CheckCircle2 className="text-success-500 mt-0.5 shrink-0" size={18} />}
              {t.kind === 'info' && <Info className="text-accent-400 mt-0.5 shrink-0" size={18} />}
              {t.kind === 'error' && <AlertTriangle className="text-error-500 mt-0.5 shrink-0" size={18} />}
              <p className="text-sm font-medium text-ink-900 dark:text-ink-50 flex-1">{t.message}</p>
              <button onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))} className="text-ink-700/50 hover:text-ink-900">
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
