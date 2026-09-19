'use client';

import React, { useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import { motion } from 'motion/react';
import { POPUP_SPRING } from '../config/motion';

interface AppToastProps {
  message: string;
  onDone: () => void;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
}

export function AppToast({
  message,
  onDone,
  actionLabel,
  onAction,
  duration,
}: AppToastProps) {
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const timeout = duration ?? (actionLabel && onAction ? 4200 : 2200);
    const timer = window.setTimeout(() => onDoneRef.current(), timeout);
    return () => window.clearTimeout(timer);
  }, [actionLabel, duration, message, onAction]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.98 }}
      transition={POPUP_SPRING}
      className="glass-float backdrop-blur-[2px] fixed bottom-[92px] left-1/2 z-[70] flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-2.5 rounded-[22px] px-4 py-3 shadow-lg"
      role="status"
      aria-live="polite"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[14px] bg-[var(--accent)] text-white">
        <Check className="h-3.5 w-3.5" />
      </span>
      <p className="truncate text-xs font-semibold">{message}</p>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={() => {
            onDone();
            onAction();
          }}
          className="ml-1 shrink-0 rounded-[14px] bg-white/60 px-2.5 py-1.5 text-[10px] font-bold text-[var(--text-primary)] hover:bg-white/80"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
