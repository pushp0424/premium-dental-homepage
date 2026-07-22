"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks/useMounted";

type ToastTone = "success" | "error" | "warning" | "info";

interface Toast {
  id: number;
  title: string;
  description?: string;
  tone: ToastTone;
}

const ToastContext = createContext<{
  push: (t: Omit<Toast, "id">) => void;
} | null>(null);

const toneConfig: Record<ToastTone, { icon: typeof Info; classes: string }> = {
  success: { icon: CheckCircle2, classes: "text-success-600 bg-success-50" },
  error: { icon: XCircle, classes: "text-danger-600 bg-danger-50" },
  warning: { icon: AlertTriangle, classes: "text-warning-600 bg-warning-50" },
  info: { icon: Info, classes: "text-brand-600 bg-brand-50" },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const mounted = useMounted();

  const push = useCallback((t: Omit<Toast, "id">) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  }, []);

  const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      {mounted &&
        createPortal(
          <div className="fixed bottom-4 right-4 z-200 flex flex-col gap-2 w-full max-w-sm" aria-live="polite">
            <AnimatePresence>
              {toasts.map((t) => {
                const { icon: Icon, classes } = toneConfig[t.tone];
                return (
                  <motion.div
                    key={t.id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 60, transition: { duration: 0.15 } }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
                    className="flex items-start gap-3 rounded-2xl border border-ink-200 bg-white p-4 shadow-lift"
                    role="status"
                  >
                    <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-full", classes)}>
                      <Icon className="size-4.5" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink-900">{t.title}</p>
                      {t.description && <p className="text-sm text-ink-500 mt-0.5">{t.description}</p>}
                    </div>
                    <button
                      onClick={() => dismiss(t.id)}
                      aria-label="Dismiss notification"
                      className="text-ink-400 hover:text-ink-700"
                    >
                      <X className="size-4" />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
