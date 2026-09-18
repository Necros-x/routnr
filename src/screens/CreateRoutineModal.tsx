import React, { useState } from 'react';
import { useGymnasticsStore } from '../hooks/useGymnasticsStore';
import { ModalSheet } from '../components/ui/ModalSheet';
import { PillButton } from '../components/ui/PillButton';
import { ALL_APPARATUS } from '../data/mockSkills';
import { Apparatus } from '../types/gymnastics';

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

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = createRoutine(
      name.trim() || `${selectedApparatus} Competition Routine`,
      selectedApparatus,
      notes.trim()
    );
    setCreateRoutineModalOpen(false);
    openRoutineInBuilder(newId);
    // Reset form
    setName('');
    setNotes('');
  };

  return (
    <ModalSheet
      isOpen={isCreateRoutineModalOpen}
      onClose={() => setCreateRoutineModalOpen(false)}
      title="Create New Routine"
      subtitle="Define apparatus and routine parameters"
    >
      <form onSubmit={handleCreate} className="space-y-4 pb-4">
        {/* Routine Name */}
        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1.5">
            Routine Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Olympic Trials Floor Set"
            className="w-full h-11 px-3.5 rounded-2xl bg-white/[0.05] border border-white/[0.1] text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20"
          />
        </div>

        {/* Apparatus Selector */}
        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1.5">
            Apparatus
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ALL_APPARATUS.map((app) => {
              const isSelected = selectedApparatus === app.name;
              return (
                <button
                  key={app.name}
                  type="button"
                  onClick={() => setSelectedApparatus(app.name as Apparatus)}
                  className={`h-11 px-3 rounded-xl border flex items-center justify-between text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white text-black font-semibold border-white shadow-sm'
                      : 'bg-white/[0.04] text-neutral-300 border-white/[0.08] hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  <span>{app.name}</span>
                  <span className="font-mono text-[10px] opacity-75">{app.code}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Coaching Notes */}
        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1.5">
            Tactical / Training Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="e.g., Focus on sticking dismount, test alternate punch entry in warmup..."
            className="w-full p-3 rounded-2xl bg-white/[0.05] border border-white/[0.1] text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 resize-none"
          />
        </div>

        {/* Submit */}
        <div className="pt-2">
          <PillButton type="submit" variant="primary" fullWidth size="lg">
            Create & Open Builder
          </PillButton>
        </div>
      </form>
    </ModalSheet>
  );
};
