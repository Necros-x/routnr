import React, { useState, useMemo } from 'react';
import { Plus, Layers, ArrowUpDown, Search } from 'lucide-react';
import { useGymnasticsStore } from '../hooks/useGymnasticsStore';
import { ALL_APPARATUS } from '../data/mockSkills';
import { RoutineCard } from '../components/RoutineCard';
import { PillButton } from '../components/ui/PillButton';
import { FilterPill } from '../components/ui/FilterPill';
import { EmptyState } from '../components/ui/EmptyState';
import { SearchBar } from '../components/ui/SearchBar';
import { Routine } from '../types/gymnastics';

interface MyRoutinesScreenProps {
  onOpenBuilder: (routineId: string) => void;
}

export const MyRoutinesScreen: React.FC<MyRoutinesScreenProps> = ({ onOpenBuilder }) => {
  const { routines, deleteRoutine, setCreateRoutineModalOpen } = useGymnasticsStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApparatus, setSelectedApparatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'recent' | 'dscore' | 'skills'>('recent');

  const filteredRoutines = useMemo(() => {
    let result = [...routines];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.apparatus.toLowerCase().includes(q) ||
          r.notes?.toLowerCase().includes(q)
      );
    }

    if (selectedApparatus !== 'All') {
      result = result.filter((r) => r.apparatus === selectedApparatus);
    }

    // Sort
    if (sortBy === 'dscore') {
      result.sort((a, b) => b.summary.totalDScore - a.summary.totalDScore);
    } else if (sortBy === 'skills') {
      result.sort((a, b) => b.skills.length - a.skills.length);
    }

    return result;
  }, [routines, searchQuery, selectedApparatus, sortBy]);

  const handleOpenRoutine = (routine: Routine) => {
    onOpenBuilder(routine.id);
  };

  return (
    <div className="space-y-4 pb-28">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-neutral-400 block">
            Routine Vault
          </span>
          <h1 className="text-xl font-bold tracking-tight text-white font-display">
            My Routines
          </h1>
        </div>

        <PillButton
          variant="primary"
          size="sm"
          onClick={() => setCreateRoutineModalOpen(true)}
          icon={<Plus className="w-3.5 h-3.5 text-black" />}
        >
          New Routine
        </PillButton>
      </div>

      {/* Search & Sort Bar */}
      <div className="space-y-2.5">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Filter routines by name or notes..."
        />

        {/* Apparatus Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <FilterPill
            label="All Routines"
            active={selectedApparatus === 'All'}
            onClick={() => setSelectedApparatus('All')}
            count={routines.length}
          />
          {ALL_APPARATUS.map((app) => {
            const count = routines.filter((r) => r.apparatus === app.name).length;
            if (count === 0 && selectedApparatus !== app.name) return null;
            return (
              <FilterPill
                key={app.name}
                label={`${app.code} · ${app.name}`}
                active={selectedApparatus === app.name}
                onClick={() => setSelectedApparatus(app.name)}
                count={count}
              />
            );
          })}
        </div>

        {/* Sort bar */}
        <div className="flex items-center justify-between text-xs text-neutral-400 px-1 pt-1">
          <span className="font-mono">
            {filteredRoutines.length} {filteredRoutines.length === 1 ? 'routine' : 'routines'}
          </span>

          <div className="flex items-center gap-2">
            <span className="text-neutral-500">Sort:</span>
            <button
              type="button"
              onClick={() => {
                if (sortBy === 'recent') setSortBy('dscore');
                else if (sortBy === 'dscore') setSortBy('skills');
                else setSortBy('recent');
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-neutral-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ArrowUpDown className="w-3 h-3" />
              <span className="capitalize">
                {sortBy === 'recent'
                  ? 'Recent'
                  : sortBy === 'dscore'
                  ? 'D-Score'
                  : 'Element Count'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Routine Cards List */}
      {filteredRoutines.length === 0 ? (
        <EmptyState
          icon={<Layers className="w-6 h-6" />}
          title="No routines found"
          description={
            searchQuery || selectedApparatus !== 'All'
              ? 'No routines match your filter criteria.'
              : 'Start building your first FIG-compliant gymnastics routine.'
          }
          actionText="Create New Routine"
          onAction={() => setCreateRoutineModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRoutines.map((routine) => (
            <RoutineCard
              key={routine.id}
              routine={routine}
              onOpen={handleOpenRoutine}
              onDelete={deleteRoutine}
            />
          ))}
        </div>
      )}
    </div>
  );
};
