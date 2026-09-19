'use client';

import React, { useEffect } from 'react';
import { Check } from 'lucide-react';
import { motion } from 'motion/react';
import { POPUP_SPRING } from '../config/motion';

interface AppToastProps {
  message: string;
  onDone: () => void;
}

export function AppToast({ message, onDone }: AppToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, 2200);
    return () => window.clearTimeout(timer);
  }, [message, onDone]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={POPUP_SPRING}
      className="glass-float backdrop-blur-[2px] fixed bottom-[92px] left-1/2 z-[70] flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-2.5 rounded-[22px] px-4 py-3 shadow-lg"
      role="status"
      aria-live="polite"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[14px] bg-[var(--accent)] text-white">
        <Check className="h-3.5 w-3.5" />
      </span>
      <p className="truncate text-xs font-semibold">{message}</p>
    </motion.div>
  );
}
