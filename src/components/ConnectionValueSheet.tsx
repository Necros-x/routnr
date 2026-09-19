'use client';

import React, { useEffect } from 'react';
import { Check, Link2, X } from 'lucide-react';
import { motion } from 'motion/react';
import { POPUP_INITIAL_Y, POPUP_SPRING } from '../config/motion';
import type { RoutineSkill } from '../types/gymnastics';

interface ConnectionValueSheetProps {
  item: RoutineSkill | null;
  isOpen: boolean;
  onClose: () => void;
  onChange: (value: number) => void;
}

const CONNECTION_VALUES = [0, 0.1, 0.2] as const;

export function ConnectionValueSheet({
  item,
  isOpen,
  onClose,
  onChange,
}: ConnectionValueSheetProps) {
  useEffect(() => {
    if (!isOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const currentValue = Number(item.connectionBonus) || 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.16, ease: 'easeOut' }}
      className="fixed inset-0 z-[96] flex items-end justify-center bg-black/15 p-0 backdrop-blur-[5px] sm:items-center sm:p-5"
      onMouseDown={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: POPUP_INITIAL_Y, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={POPUP_SPRING}
        role="dialog"
        aria-modal="true"
        aria-label={`Connection value for ${item.skill.name}`}
        onMouseDown={(event) => event.stopPropagation()}
        className="glass-float backdrop-blur-[2px] w-full rounded-t-[28px] p-4 sm:max-w-md sm:rounded-[28px]"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[20px] bg-white/55 text-[var(--text-secondary)]">
              <Link2 className="h-4 w-4" />
            </span>

            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--text-tertiary)]">
                Connection value
              </p>
              <h2 className="mt-1 truncate text-lg font-semibold tracking-[-0.03em]">
                {item.skill.name}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[18px] bg-white/45 text-[var(--text-secondary)] hover:bg-white/65 hover:text-[var(--text-primary)]"
            aria-label="Close connection editor"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 rounded-[12px] bg-white/45 p-4">
          <p className="text-[11px] leading-5 text-[var(--text-secondary)]">
            Set the manual CV currently attached to this element in ROUTNR’s
            provisional scoring model.
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {CONNECTION_VALUES.map((value) => {
              const selected = Math.abs(currentValue - value) < 0.001;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    onChange(value);
                    onClose();
                  }}
                  className={`relative h-14 rounded-[16px] border text-sm font-semibold transition-colors ${
                    selected
                      ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                      : 'border-[var(--border-medium)] bg-white/65 text-[var(--text-primary)] hover:border-[var(--border-strong)]'
                  }`}
                  aria-pressed={selected}
                >
                  {value === 0 ? '0.0' : `+${value.toFixed(1)}`}
                  {selected && (
                    <Check className="absolute right-2 top-2 h-3.5 w-3.5" />
                  )}
                </button>
              );
            })}
          </div>

          <p className="mt-3 text-[9px] leading-4 text-[var(--text-tertiary)]">
            Eligibility will be validated automatically when the verified
            apparatus-specific scoring engine is added.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
