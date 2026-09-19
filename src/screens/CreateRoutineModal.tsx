import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Plus, X } from 'lucide-react';
import { useGymnasticsStore } from '../hooks/useGymnasticsStore';
import { ALL_APPARATUS } from '../data/mockSkills';
import { Apparatus } from '../types/gymnastics';
import { POPUP_INITIAL_Y, POPUP_SPRING } from '../config/motion';

export const CreateRoutineModal: React.FC = () => {
  const {
    isCreateRoutineModalOpen,
    setCreateRoutineModalOpen,
    createRoutine,
    openRoutineInBuilder,
  } = useGymnasticsStore();

  const [name, setName] = useState('');
  const [selectedApparatus, setSelectedApparatus] = useState<Apparatus>('Floor Exercise');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!isCreateRoutineModalOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setCreateRoutineModalOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isCreateRoutineModalOpen, setCreateRoutineModalOpen]);

  if (!isCreateRoutineModalOpen) return null;

  const handleCreate = (event: React.FormEvent) => {
    event.preventDefault();
    const newId = createRoutine(
      name.trim() || `${selectedApparatus} Routine`,
      selectedApparatus,
      notes.trim()
    );
    setName('');
    setNotes('');
    setCreateRoutineModalOpen(false);
    openRoutineInBuilder(newId);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.16, ease: 'easeOut' }}
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/20 p-0 backdrop-blur-[5px] sm:items-center sm:p-5"
      onMouseDown={() => setCreateRoutineModalOpen(false)}
    >
      <motion.div
        initial={{ opacity: 0, y: POPUP_INITIAL_Y, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={POPUP_SPRING}
        role="dialog"
        aria-modal="true"
        aria-label="Create routine"
        onMouseDown={(event) => event.stopPropagation()}
        className="glass-float backdrop-blur-[2px] max-h-[92vh] w-full overflow-y-auto rounded-t-[28px] p-4 sm:max-w-2xl sm:rounded-[28px] sm:p-4"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">New workspace</p>
            <h2 className="font-display mt-1 text-xl font-semibold">Create a routine</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">Choose the apparatus first. You can build the full sequence next.</p>
          </div>
          <button
            type="button"
            onClick={() => setCreateRoutineModalOpen(false)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface-soft)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleCreate} className="mt-6 space-y-5">
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">Routine name</label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={`${selectedApparatus} Routine`}
              autoFocus
              className="mt-2 h-12 w-full rounded-[12px] border border-[var(--border-subtle)] bg-[var(--surface-soft)] px-4 text-sm outline-none transition-colors placeholder:text-[var(--text-tertiary)] focus:border-[var(--border-strong)]"
            />
          </div>

          <div>
            <label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">Apparatus</label>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {ALL_APPARATUS.map((item) => {
                const selected = selectedApparatus === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setSelectedApparatus(item.name as Apparatus)}
                    className={`rounded-[12px] border p-3 text-left transition-colors ${selected ? 'border-[var(--accent)] bg-[var(--accent)] text-white' : 'border-[var(--border-subtle)] bg-[var(--surface-soft)] text-[var(--text-primary)] hover:border-[var(--border-medium)]'}`}
                  >
                    <span className="block text-[10px] font-black tracking-[-0.03em] opacity-70">{item.code}</span>
                    <span className="mt-3 block text-xs font-semibold">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">Notes <span className="normal-case tracking-normal">(optional)</span></label>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={3}
              placeholder="Training goal, connection ideas, landing cues…"
              className="mt-2 w-full resize-none rounded-[12px] border border-[var(--border-subtle)] bg-[var(--surface-soft)] p-4 text-sm leading-6 outline-none transition-colors placeholder:text-[var(--text-tertiary)] focus:border-[var(--border-strong)]"
            />
          </div>

          <button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" />
            Create and open builder
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};
