'use client';

import React, { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  Check,
  Copy,
  PencilLine,
  Trash2,
  X,
} from 'lucide-react';
import { motion } from 'motion/react';
import { POPUP_INITIAL_Y, POPUP_SPRING } from '../config/motion';
import type { Routine } from '../types/gymnastics';

interface RoutineActionsSheetProps {
  routine: Routine | null;
  isOpen: boolean;
  onClose: () => void;
  onOpen: (routineId: string) => void;
  onDuplicate: (routineId: string) => void;
  onRename: (routineId: string, name: string) => void;
  onDelete: (routineId: string) => void;
}

type SheetMode = 'actions' | 'rename' | 'delete';

export function RoutineActionsSheet({
  routine,
  isOpen,
  onClose,
  onOpen,
  onDuplicate,
  onRename,
  onDelete,
}: RoutineActionsSheetProps) {
  const [mode, setMode] = useState<SheetMode>('actions');
  const [draftName, setDraftName] = useState('');

  useEffect(() => {
    if (!isOpen || !routine) {
      setMode('actions');
      setDraftName('');
      return;
    }

    setMode('actions');
    setDraftName(routine.name);

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (mode !== 'actions') {
          setMode('actions');
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, routine?.id, onClose, mode]);

  if (!isOpen || !routine) return null;

  const saveRename = (event: React.FormEvent) => {
    event.preventDefault();

    const nextName = draftName.trim();
    if (!nextName) return;

    onRename(routine.id, nextName);
    onClose();
  };

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
              {mode === 'rename'
                ? 'Rename routine'
                : mode === 'delete'
                  ? 'Delete routine'
                  : routine.name}
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

        {mode === 'actions' && (
          <div className="mt-4 space-y-1">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpen(routine.id);
              }}
              className="flex w-full items-center gap-3 rounded-[12px] px-4 py-3 text-left hover:bg-white/55"
            >
              <ArrowUpRight className="h-4 w-4 text-[var(--text-secondary)]" />
              <div>
                <p className="text-sm font-semibold">Open builder</p>
                <p className="mt-0.5 text-[10px] text-[var(--text-tertiary)]">
                  Edit skills, order, score and notes
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setDraftName(routine.name);
                setMode('rename');
              }}
              className="flex w-full items-center gap-3 rounded-[12px] px-4 py-3 text-left hover:bg-white/55"
            >
              <PencilLine className="h-4 w-4 text-[var(--text-secondary)]" />
              <div>
                <p className="text-sm font-semibold">Rename</p>
                <p className="mt-0.5 text-[10px] text-[var(--text-tertiary)]">
                  Change the routine name
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
                <p className="text-sm font-semibold">Duplicate</p>
                <p className="mt-0.5 text-[10px] text-[var(--text-tertiary)]">
                  Copy this routine into the same event
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setMode('delete')}
              className="flex w-full items-center gap-3 rounded-[12px] px-4 py-3 text-left text-[var(--danger)] hover:bg-[#fff1f1]"
            >
              <Trash2 className="h-4 w-4" />
              <div>
                <p className="text-sm font-semibold">Delete</p>
                <p className="mt-0.5 text-[10px] text-[var(--danger)] opacity-70">
                  Remove this routine from this device
                </p>
              </div>
            </button>
          </div>
        )}

        {mode === 'rename' && (
          <form onSubmit={saveRename} className="mt-4 rounded-[12px] bg-white/45 p-4">
            <label
              htmlFor="routine-rename"
              className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]"
            >
              Routine name
            </label>

            <input
              id="routine-rename"
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
              autoFocus
              maxLength={80}
              className="mt-2 h-11 w-full rounded-[10px] border border-[var(--border-subtle)] bg-white/70 px-3.5 text-sm outline-none focus:border-[var(--border-strong)]"
            />

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode('actions')}
                className="h-11 rounded-[22px] border border-[var(--border-medium)] bg-white/60 text-xs font-semibold"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!draftName.trim()}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-[22px] bg-[var(--accent)] px-4 text-xs font-semibold text-white disabled:opacity-40"
              >
                <Check className="h-3.5 w-3.5" />
                Save
              </button>
            </div>
          </form>
        )}

        {mode === 'delete' && (
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
                onClick={() => setMode('actions')}
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
