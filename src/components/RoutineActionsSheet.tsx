'use client';

import React, { useEffect, useState } from 'react';
import { Copy, Pencil, Trash2, X } from 'lucide-react';
import { motion } from 'motion/react';
import { POPUP_INITIAL_Y, POPUP_SPRING } from '../config/motion';
import type { Routine } from '../types/gymnastics';

interface RoutineActionsSheetProps {
  routine: Routine | null;
  isOpen: boolean;
  onClose: () => void;
  onOpen: (routineId: string) => void;
  onDuplicate: (routineId: string) => void;
  onDelete: (routineId: string) => void;
}

export function RoutineActionsSheet({
  routine,
  isOpen,
  onClose,
  onOpen,
  onDuplicate,
  onDelete,
}: RoutineActionsSheetProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setConfirmDelete(false);
      return;
    }

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

  if (!isOpen || !routine) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.16, ease: 'easeOut' }}
      className="fixed inset-0 z-[95] flex items-end justify-center bg-black/15 p-0 backdrop-blur-[5px] sm:items-center sm:p-5"
      onMouseDown={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: POPUP_INITIAL_Y, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={POPUP_SPRING}
        role="dialog"
        aria-modal="true"
        aria-label={`Actions for ${routine.name}`}
        onMouseDown={(event) => event.stopPropagation()}
        className="glass-float backdrop-blur-[2px] w-full rounded-t-[28px] p-4 sm:max-w-md sm:rounded-[28px]"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--text-tertiary)]">
              {routine.apparatus}
            </p>
            <h2 className="mt-1 truncate text-lg font-semibold tracking-[-0.03em]">
              {routine.name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[18px] bg-white/45 text-[var(--text-secondary)] hover:bg-white/65 hover:text-[var(--text-primary)]"
            aria-label="Close routine actions"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {!confirmDelete ? (
          <div className="mt-4 space-y-1">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpen(routine.id);
              }}
              className="flex w-full items-center gap-3 rounded-[12px] px-4 py-3 text-left hover:bg-white/55"
            >
              <Pencil className="h-4 w-4 text-[var(--text-secondary)]" />
              <div>
                <p className="text-sm font-semibold">Open & edit</p>
                <p className="mt-0.5 text-[10px] text-[var(--text-tertiary)]">
                  Edit name, skills, order and notes
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                onDuplicate(routine.id);
                onClose();
              }}
              className="flex w-full items-center gap-3 rounded-[12px] px-4 py-3 text-left hover:bg-white/55"
            >
              <Copy className="h-4 w-4 text-[var(--text-secondary)]" />
              <div>
                <p className="text-sm font-semibold">Duplicate routine</p>
                <p className="mt-0.5 text-[10px] text-[var(--text-tertiary)]">
                  Copy the full routine into the same event
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="flex w-full items-center gap-3 rounded-[12px] px-4 py-3 text-left text-[var(--danger)] hover:bg-[#fff1f1]"
            >
              <Trash2 className="h-4 w-4" />
              <div>
                <p className="text-sm font-semibold">Delete routine</p>
                <p className="mt-0.5 text-[10px] text-[var(--danger)]/70">
                  This removes it from this device
                </p>
              </div>
            </button>
          </div>
        ) : (
          <div className="mt-4 rounded-[12px] bg-white/45 p-4">
            <p className="text-sm font-semibold">Delete this routine?</p>
            <p className="mt-1 text-[11px] leading-5 text-[var(--text-tertiary)]">
              {routine.name} will be removed from your saved routines. If it is
              the main routine for this event, another routine will be selected
              automatically when available.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="h-11 rounded-[22px] border border-[var(--border-medium)] bg-white/60 text-xs font-semibold"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  onDelete(routine.id);
                  onClose();
                }}
                className="h-11 rounded-[22px] bg-[var(--danger)] px-4 text-xs font-semibold text-white"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
