import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';

interface ModalSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxHeight?: string;
}

export const ModalSheet: React.FC<ModalSheetProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxHeight = 'max-h-[88vh]',
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
          <motion.button
            type="button"
            aria-label="Close modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/72 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: 48, opacity: 0, scale: 0.985 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 32, opacity: 0, scale: 0.985 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className={`relative z-10 flex w-full flex-col overflow-hidden rounded-t-[28px] border border-white/[0.1] bg-[#101013]/[0.96] shadow-[0_-18px_70px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:max-w-lg sm:rounded-[28px] ${maxHeight}`}
          >
            <div className="flex justify-center pb-0.5 pt-2.5 sm:hidden">
              <div className="h-1 w-10 rounded-full bg-white/[0.16]" />
            </div>

            <div className="flex shrink-0 items-center justify-between border-b border-white/[0.07] px-5 pb-3.5 pt-3">
              <div className="min-w-0 pr-4">
                <h3 className="truncate text-base font-semibold tracking-[-0.02em] text-white">{title}</h3>
                {subtitle && <p className="mt-0.5 truncate text-xs text-neutral-500">{subtitle}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[11px] border border-white/[0.08] bg-white/[0.045] text-neutral-400 transition-colors hover:bg-white/[0.08] hover:text-white"
                aria-label="Close sheet"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
