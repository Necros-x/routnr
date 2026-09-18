'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Apparatus, GymnasticSkill, Routine, RoutineSkill, ActiveTab } from '../types/gymnastics';
import { MOCK_ROUTINES } from '../data/mockRoutines';
import { MOCK_SKILLS } from '../data/mockSkills';
import {
  calculateRoutineScore,
  calculateDynamicDScore,
  DynamicDScoreResult,
} from '../utils/scoreCalculator';

export { calculateRoutineScore, calculateDynamicDScore };

interface GymnasticsStoreContextValue {
  routines: Routine[];
  skills: GymnasticSkill[];
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeRoutineId: string | null;
  setActiveRoutineId: (id: string | null) => void;
  selectedSkill: GymnasticSkill | null;
  setSelectedSkill: (skill: GymnasticSkill | null) => void;
  favoriteSkillIds: string[];
  toggleFavorite: (skillId: string) => void;
  recentlyViewedSkills: GymnasticSkill[];
  markSkillViewed: (skill: GymnasticSkill) => void;
  isCreateRoutineModalOpen: boolean;
  setCreateRoutineModalOpen: (open: boolean) => void;
  isSkillPickerModalOpen: boolean;
  setSkillPickerModalOpen: (open: boolean) => void;
  createRoutine: (name: string, apparatus: Apparatus, notes?: string) => string;
  deleteRoutine: (id: string) => void;
  updateRoutineNotes: (id: string, notes: string) => void;
  updateRoutineTitle: (id: string, name: string) => void;
  addSkillToRoutine: (routineId: string, skill: GymnasticSkill, connectionBonus?: number) => void;
  removeSkillFromRoutine: (routineId: string, instanceId: string) => void;
  updateSkillConnectionBonus: (routineId: string, instanceId: string, connectionBonus: number) => void;
  moveSkillOrder: (routineId: string, index: number, direction: 'up' | 'down') => void;
  reorderSkills: (routineId: string, startIndex: number, endIndex: number) => void;
  calculateActiveRoutineDScore: () => DynamicDScoreResult;
  getActiveRoutine: () => Routine | null;
  openRoutineInBuilder: (id: string) => void;
}

const GymnasticsStoreContext = createContext<GymnasticsStoreContextValue | null>(null);

const FAVORITES_STORAGE_KEY = 'gym_routine_favorites_v1';
const ROUTINES_STORAGE_KEY = 'gym_routine_routines_v1';

export const GymnasticsStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [skills] = useState<GymnasticSkill[]>(MOCK_SKILLS);
  const [routines, setRoutines] = useState<Routine[]>(() =>
    MOCK_ROUTINES.map((routine) => ({
      ...routine,
      summary: calculateRoutineScore(routine.skills, routine.apparatus),
    }))
  );

  const [activeRoutineId, setActiveRoutineId] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<GymnasticSkill | null>(null);
  const [favoriteSkillIds, setFavoriteSkillIds] = useState<string[]>(['fx-01', 'hb-02', 'sr-01']);
  const [hasHydrated, setHasHydrated] = useState(false);

  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([
    'fx-01',
    'hb-02',
    'ph-03',
    'sr-01',
  ]);

  const [isCreateRoutineModalOpen, setCreateRoutineModalOpen] = useState(false);
  const [isSkillPickerModalOpen, setSkillPickerModalOpen] = useState(false);

  // Hydrate browser-only data after mount so Next.js can prerender safely.
  useEffect(() => {
    try {
      const savedRoutines = localStorage.getItem(ROUTINES_STORAGE_KEY);
      const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);

      if (savedRoutines) {
        const parsed: Routine[] = JSON.parse(savedRoutines);
        setRoutines(
          parsed.map((routine) => ({
            ...routine,
            summary: calculateRoutineScore(routine.skills, routine.apparatus),
          }))
        );
      }

      if (savedFavorites) {
        setFavoriteSkillIds(JSON.parse(savedFavorites));
      }
    } catch {
      // Keep the bundled starter data if browser storage is unavailable/corrupt.
    } finally {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    try {
      localStorage.setItem(ROUTINES_STORAGE_KEY, JSON.stringify(routines));
    } catch {
      // Browser storage can be unavailable in restricted contexts.
    }
  }, [hasHydrated, routines]);

  useEffect(() => {
    if (!hasHydrated) return;
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteSkillIds));
    } catch {
      // Browser storage can be unavailable in restricted contexts.
    }
  }, [favoriteSkillIds, hasHydrated]);

  const toggleFavorite = (skillId: string) => {
    setFavoriteSkillIds((prev) =>
      prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]
    );
  };

  const markSkillViewed = (skill: GymnasticSkill) => {
    setRecentlyViewedIds((prev) => [skill.id, ...prev.filter((id) => id !== skill.id)].slice(0, 8));
  };

  const recentlyViewedSkills = recentlyViewedIds
    .map((id) => skills.find((s) => s.id === id))
    .filter((s): s is GymnasticSkill => !!s);

  const createRoutine = (name: string, apparatus: Apparatus, notes?: string): string => {
    const newId = `routine-${Date.now()}`;
    const newRoutine: Routine = {
      id: newId,
      name: name.trim() || `New ${apparatus} Routine`,
      apparatus,
      lastEdited: 'Just now',
      notes: notes || '',
      skills: [],
      summary: {
        difficultyValue: 0.0,
        elementGroupValue: 0.0,
        connectionBonus: 0.0,
        totalDScore: 0.0,
      },
    };
    setRoutines((prev) => [newRoutine, ...prev]);
    setActiveRoutineId(newId);
    return newId;
  };

  const deleteRoutine = (id: string) => {
    setRoutines((prev) => prev.filter((r) => r.id !== id));
    if (activeRoutineId === id) {
      setActiveRoutineId(null);
    }
  };

  const updateRoutineNotes = (id: string, notes: string) => {
    setRoutines((prev) =>
      prev.map((r) => (r.id === id ? { ...r, notes, lastEdited: 'Just now' } : r))
    );
  };

  const updateRoutineTitle = (id: string, name: string) => {
    setRoutines((prev) =>
      prev.map((r) => (r.id === id ? { ...r, name, lastEdited: 'Just now' } : r))
    );
  };

  const addSkillToRoutine = (routineId: string, skill: GymnasticSkill, connectionBonus: number = 0) => {
    setRoutines((prev) =>
      prev.map((routine) => {
        if (routine.id !== routineId) return routine;
        const newInstance: RoutineSkill = {
          instanceId: `inst-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          skillId: skill.id,
          skill,
          order: routine.skills.length + 1,
          connectionBonus,
        };
        const updatedSkills = [...routine.skills, newInstance];
        const newSummary = calculateRoutineScore(updatedSkills, routine.apparatus);
        return {
          ...routine,
          skills: updatedSkills,
          summary: newSummary,
          lastEdited: 'Just now',
        };
      })
    );
  };

  const removeSkillFromRoutine = (routineId: string, instanceId: string) => {
    setRoutines((prev) =>
      prev.map((routine) => {
        if (routine.id !== routineId) return routine;
        const filtered = routine.skills.filter((s) => s.instanceId !== instanceId);
        const reordered = filtered.map((s, idx) => ({ ...s, order: idx + 1 }));
        const newSummary = calculateRoutineScore(reordered, routine.apparatus);
        return {
          ...routine,
          skills: reordered,
          summary: newSummary,
          lastEdited: 'Just now',
        };
      })
    );
  };

  const updateSkillConnectionBonus = (routineId: string, instanceId: string, connectionBonus: number) => {
    setRoutines((prev) =>
      prev.map((routine) => {
        if (routine.id !== routineId) return routine;
        const updatedSkills = routine.skills.map((s) =>
          s.instanceId === instanceId ? { ...s, connectionBonus } : s
        );
        const newSummary = calculateRoutineScore(updatedSkills, routine.apparatus);
        return {
          ...routine,
          skills: updatedSkills,
          summary: newSummary,
          lastEdited: 'Just now',
        };
      })
    );
  };

  const moveSkillOrder = (routineId: string, index: number, direction: 'up' | 'down') => {
    setRoutines((prev) =>
      prev.map((routine) => {
        if (routine.id !== routineId) return routine;
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= routine.skills.length) return routine;

        const newSkills = [...routine.skills];
        const [movedItem] = newSkills.splice(index, 1);
        newSkills.splice(targetIndex, 0, movedItem);

        const updated = newSkills.map((s, idx) => ({ ...s, order: idx + 1 }));
        const newSummary = calculateRoutineScore(updated, routine.apparatus);
        return {
          ...routine,
          skills: updated,
          summary: newSummary,
          lastEdited: 'Just now',
        };
      })
    );
  };

  const reorderSkills = (routineId: string, startIndex: number, endIndex: number) => {
    setRoutines((prev) =>
      prev.map((routine) => {
        if (routine.id !== routineId) return routine;
        const newSkills = [...routine.skills];
        const [moved] = newSkills.splice(startIndex, 1);
        newSkills.splice(endIndex, 0, moved);
        const updated = newSkills.map((s, idx) => ({ ...s, order: idx + 1 }));
        return {
          ...routine,
          skills: updated,
          summary: calculateRoutineScore(updated, routine.apparatus),
          lastEdited: 'Just now',
        };
      })
    );
  };

  const getActiveRoutine = (): Routine | null => {
    if (!activeRoutineId) return routines[0] || null;
    return routines.find((r) => r.id === activeRoutineId) || routines[0] || null;
  };

  const calculateActiveRoutineDScore = (): DynamicDScoreResult => {
    const active = getActiveRoutine();
    if (!active) {
      return calculateDynamicDScore([]);
    }
    return calculateDynamicDScore(active.skills, active.apparatus);
  };

  const openRoutineInBuilder = (id: string) => {
    setActiveRoutineId(id);
    setActiveTab('routines');
  };

  return (
    <GymnasticsStoreContext.Provider
      value={{
        routines,
        skills,
        activeTab,
        setActiveTab,
        activeRoutineId,
        setActiveRoutineId,
        selectedSkill,
        setSelectedSkill,
        favoriteSkillIds,
        toggleFavorite,
        recentlyViewedSkills,
        markSkillViewed,
        isCreateRoutineModalOpen,
        setCreateRoutineModalOpen,
        isSkillPickerModalOpen,
        setSkillPickerModalOpen,
        createRoutine,
        deleteRoutine,
        updateRoutineNotes,
        updateRoutineTitle,
        addSkillToRoutine,
        removeSkillFromRoutine,
        updateSkillConnectionBonus,
        moveSkillOrder,
        reorderSkills,
        calculateActiveRoutineDScore,
        getActiveRoutine,
        openRoutineInBuilder,
      }}
    >
      {children}
    </GymnasticsStoreContext.Provider>
  );
};

export const useGymnasticsStore = () => {
  const context = useContext(GymnasticsStoreContext);
  if (!context) {
    throw new Error('useGymnasticsStore must be used within a GymnasticsStoreProvider');
  }
  return context;
};
