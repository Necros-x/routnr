'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ActiveTab,
  AllAroundSummary,
  Apparatus,
  GymnasticSkill,
  MagApparatus,
  PrimaryRoutineMap,
  Routine,
  RoutineSkill,
} from '../types/gymnastics';
import { MOCK_ROUTINES } from '../data/mockRoutines';
import { MAG_SKILLS } from '../data/mag/catalog';
import {
  calculateRoutineScore,
  calculateDynamicDScore,
  DynamicDScoreResult,
} from '../utils/scoreCalculator';
import {
  buildAllAroundRows,
  buildDefaultPrimaryRoutineMap,
  MAG_APPARATUS_ORDER,
} from '../config/mag';

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
  createRoutineInitialApparatus: Apparatus | null;
  openCreateRoutineModal: (apparatus?: Apparatus) => void;
  isSkillPickerModalOpen: boolean;
  setSkillPickerModalOpen: (open: boolean) => void;
  createRoutine: (name: string, apparatus: Apparatus, notes?: string) => string;
  duplicateRoutine: (id: string) => string | null;
  deleteRoutine: (id: string) => void;
  updateRoutineNotes: (id: string, notes: string) => void;
  updateRoutineTitle: (id: string, name: string) => void;
  addSkillToRoutine: (routineId: string, skill: GymnasticSkill, connectionBonus?: number) => void;
  removeSkillFromRoutine: (routineId: string, instanceId: string) => void;
  updateSkillConnectionBonus: (routineId: string, instanceId: string, connectionBonus: number) => void;
  moveSkillOrder: (routineId: string, index: number, direction: 'up' | 'down') => void;
  reorderSkills: (routineId: string, startIndex: number, endIndex: number) => void;
  reorderRoutineSkills: (routineId: string, orderedInstanceIds: string[]) => void;
  restoreRoutineSkill: (
    routineId: string,
    item: RoutineSkill,
    index: number,
  ) => void;
  calculateActiveRoutineDScore: () => DynamicDScoreResult;
  getActiveRoutine: () => Routine | null;
  openRoutineInBuilder: (id: string) => void;
  primaryRoutineIds: PrimaryRoutineMap;
  setPrimaryRoutine: (routineId: string) => void;
  isPrimaryRoutine: (routineId: string) => boolean;
  getPrimaryRoutineForApparatus: (apparatus: MagApparatus) => Routine | null;
  getAllAroundSummary: () => AllAroundSummary;
}

const GymnasticsStoreContext = createContext<GymnasticsStoreContextValue | null>(null);

const FAVORITES_STORAGE_KEY = 'gym_routine_favorites_v1';
const ROUTINES_STORAGE_KEY = 'gym_routine_routines_v1';
const PRIMARY_ROUTINES_STORAGE_KEY = 'gym_routine_primary_routines_v1';

const roundScore = (value: number) => Math.round(value * 100) / 100;

const bindRoutineToCurrentCatalog = (routine: Routine): Routine => {
  const currentById = new Map(MAG_SKILLS.map((skill) => [skill.id, skill]));

  const skills = routine.skills.map((item, index) => {
    const current = currentById.get(item.skillId);

    return {
      ...item,
      order: index + 1,
      skill:
        current ??
        ({
          ...item.skill,
          verificationStatus:
            item.skill.verificationStatus ?? 'provisional',
          sourceRefs: item.skill.sourceRefs ?? [],
        } satisfies GymnasticSkill),
    };
  });

  return {
    ...routine,
    skills,
    summary: calculateRoutineScore(skills, routine.apparatus),
  };
};

const resolvePrimaryRoutineMap = (
  routines: Routine[],
  saved: PrimaryRoutineMap = {},
): PrimaryRoutineMap => {
  const resolved = buildDefaultPrimaryRoutineMap(routines);

  MAG_APPARATUS_ORDER.forEach((apparatus) => {
    const savedId = saved[apparatus];
    if (
      savedId &&
      routines.some(
        (routine) =>
          routine.id === savedId && routine.apparatus === apparatus,
      )
    ) {
      resolved[apparatus] = savedId;
    }
  });

  return resolved;
};

export const GymnasticsStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [skills] = useState<GymnasticSkill[]>(MAG_SKILLS);
  const [routines, setRoutines] = useState<Routine[]>(() =>
    MOCK_ROUTINES.map((routine) => ({
      ...routine,
      summary: calculateRoutineScore(routine.skills, routine.apparatus),
    }))
  );

  const [primaryRoutineIds, setPrimaryRoutineIds] = useState<PrimaryRoutineMap>(
    () => buildDefaultPrimaryRoutineMap(MOCK_ROUTINES),
  );
  const [activeRoutineId, setActiveRoutineId] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<GymnasticSkill | null>(null);
  const [favoriteSkillIds, setFavoriteSkillIds] = useState<string[]>([
    'fx-iii-054',
    'hb-02',
    'sr-01',
  ]);
  const [hasHydrated, setHasHydrated] = useState(false);

  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([
    'fx-iii-054',
    'hb-02',
    'ph-03',
    'sr-01',
  ]);

  const [isCreateRoutineModalOpen, setCreateRoutineModalOpen] = useState(false);
  const [createRoutineInitialApparatus, setCreateRoutineInitialApparatus] =
    useState<Apparatus | null>(null);
  const [isSkillPickerModalOpen, setSkillPickerModalOpen] = useState(false);

  // Hydrate browser-only data after mount so Next.js can prerender safely.
  useEffect(() => {
    try {
      const savedRoutines = localStorage.getItem(ROUTINES_STORAGE_KEY);
      const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      const savedPrimaryRoutines = localStorage.getItem(
        PRIMARY_ROUTINES_STORAGE_KEY,
      );

      let hydratedRoutines = MOCK_ROUTINES.map(bindRoutineToCurrentCatalog);

      if (savedRoutines) {
        const parsed: Routine[] = JSON.parse(savedRoutines);
        hydratedRoutines = parsed.map(bindRoutineToCurrentCatalog);
        setRoutines(hydratedRoutines);
      }

      const parsedPrimary: PrimaryRoutineMap = savedPrimaryRoutines
        ? JSON.parse(savedPrimaryRoutines)
        : {};

      setPrimaryRoutineIds(
        resolvePrimaryRoutineMap(hydratedRoutines, parsedPrimary),
      );

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

  useEffect(() => {
    if (!hasHydrated) return;
    try {
      localStorage.setItem(
        PRIMARY_ROUTINES_STORAGE_KEY,
        JSON.stringify(primaryRoutineIds),
      );
    } catch {
      // Browser storage can be unavailable in restricted contexts.
    }
  }, [hasHydrated, primaryRoutineIds]);

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

  const openCreateRoutineModal = (apparatus?: Apparatus) => {
    setCreateRoutineInitialApparatus(apparatus ?? null);
    setCreateRoutineModalOpen(true);
  };

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

    if (MAG_APPARATUS_ORDER.includes(apparatus as MagApparatus)) {
      const magApparatus = apparatus as MagApparatus;
      setPrimaryRoutineIds((prev) =>
        prev[magApparatus]
          ? prev
          : { ...prev, [magApparatus]: newId },
      );
    }

    setActiveRoutineId(newId);
    return newId;
  };

  const duplicateRoutine = (id: string): string | null => {
    const source = routines.find((routine) => routine.id === id);
    if (!source) return null;

    const stamp = Date.now();
    const newId = `routine-${stamp}`;

    const duplicatedSkills = source.skills.map((item, index) => ({
      ...item,
      instanceId: `inst-${stamp}-${index}-${Math.random().toString(36).slice(2, 6)}`,
      order: index + 1,
    }));

    const baseName = source.name.replace(/ Copy(?: \d+)?$/, '');
    const sameEventNames = new Set(
      routines
        .filter((routine) => routine.apparatus === source.apparatus)
        .map((routine) => routine.name),
    );

    let duplicateName = `${baseName} Copy`;
    let copyNumber = 2;

    while (sameEventNames.has(duplicateName)) {
      duplicateName = `${baseName} Copy ${copyNumber}`;
      copyNumber += 1;
    }

    const duplicate: Routine = {
      ...source,
      id: newId,
      name: duplicateName,
      lastEdited: 'Just now',
      skills: duplicatedSkills,
      summary: calculateRoutineScore(duplicatedSkills, source.apparatus),
    };

    setRoutines((prev) => [duplicate, ...prev]);
    return newId;
  };

  const deleteRoutine = (id: string) => {
    const routineToDelete = routines.find((routine) => routine.id === id);

    setRoutines((prev) => prev.filter((routine) => routine.id !== id));

    if (
      routineToDelete &&
      MAG_APPARATUS_ORDER.includes(routineToDelete.apparatus as MagApparatus)
    ) {
      const apparatus = routineToDelete.apparatus as MagApparatus;

      setPrimaryRoutineIds((prev) => {
        if (prev[apparatus] !== id) return prev;

        const replacement = routines.find(
          (routine) =>
            routine.id !== id && routine.apparatus === apparatus,
        );

        const next = { ...prev };
        if (replacement) {
          next[apparatus] = replacement.id;
        } else {
          delete next[apparatus];
        }

        return next;
      });
    }

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
    const nextName = name.trim();
    if (!nextName) return;

    setRoutines((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, name: nextName, lastEdited: 'Just now' } : r,
      ),
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

  const reorderRoutineSkills = (
    routineId: string,
    orderedInstanceIds: string[],
  ) => {
    setRoutines((prev) =>
      prev.map((routine) => {
        if (routine.id !== routineId) return routine;

        const byId = new Map(
          routine.skills.map((item) => [item.instanceId, item]),
        );

        const ordered = orderedInstanceIds
          .map((instanceId) => byId.get(instanceId))
          .filter((item): item is RoutineSkill => Boolean(item));

        if (ordered.length !== routine.skills.length) return routine;

        const updated = ordered.map((item, index) => ({
          ...item,
          order: index + 1,
        }));

        return {
          ...routine,
          skills: updated,
          summary: calculateRoutineScore(updated, routine.apparatus),
          lastEdited: 'Just now',
        };
      }),
    );
  };

  const restoreRoutineSkill = (
    routineId: string,
    item: RoutineSkill,
    index: number,
  ) => {
    setRoutines((prev) =>
      prev.map((routine) => {
        if (routine.id !== routineId) return routine;

        const insertAt = Math.max(0, Math.min(index, routine.skills.length));
        const nextSkills = [...routine.skills];
        nextSkills.splice(insertAt, 0, item);

        const updated = nextSkills.map((skill, nextIndex) => ({
          ...skill,
          order: nextIndex + 1,
        }));

        return {
          ...routine,
          skills: updated,
          summary: calculateRoutineScore(updated, routine.apparatus),
          lastEdited: 'Just now',
        };
      }),
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

  const setPrimaryRoutine = (routineId: string) => {
    const routine = routines.find((candidate) => candidate.id === routineId);
    if (
      !routine ||
      !MAG_APPARATUS_ORDER.includes(routine.apparatus as MagApparatus)
    ) {
      return;
    }

    const apparatus = routine.apparatus as MagApparatus;
    setPrimaryRoutineIds((prev) => ({
      ...prev,
      [apparatus]: routine.id,
    }));
  };

  const isPrimaryRoutine = (routineId: string) => {
    const routine = routines.find((candidate) => candidate.id === routineId);
    if (
      !routine ||
      !MAG_APPARATUS_ORDER.includes(routine.apparatus as MagApparatus)
    ) {
      return false;
    }

    return (
      primaryRoutineIds[routine.apparatus as MagApparatus] === routine.id
    );
  };

  const getPrimaryRoutineForApparatus = (
    apparatus: MagApparatus,
  ): Routine | null => {
    const routineId = primaryRoutineIds[apparatus];
    if (!routineId) return null;

    return (
      routines.find(
        (routine) =>
          routine.id === routineId && routine.apparatus === apparatus,
      ) ?? null
    );
  };

  const getAllAroundSummary = (): AllAroundSummary => {
    const rows = buildAllAroundRows(routines, primaryRoutineIds);

    return {
      rows,
      completedEvents: rows.filter((row) => row.routineId).length,
      totalSkills: rows.reduce((sum, row) => sum + row.skills, 0),
      totalDifficulty: roundScore(
        rows.reduce((sum, row) => sum + row.difficultyValue, 0),
      ),
      totalGroup: roundScore(
        rows.reduce((sum, row) => sum + row.groupValue, 0),
      ),
      totalConnectionBonus: roundScore(
        rows.reduce((sum, row) => sum + row.connectionBonus, 0),
      ),
      totalDScore: roundScore(
        rows.reduce((sum, row) => sum + row.dScore, 0),
      ),
    };
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
        createRoutineInitialApparatus,
        openCreateRoutineModal,
        isSkillPickerModalOpen,
        setSkillPickerModalOpen,
        createRoutine,
        duplicateRoutine,
        deleteRoutine,
        updateRoutineNotes,
        updateRoutineTitle,
        addSkillToRoutine,
        removeSkillFromRoutine,
        updateSkillConnectionBonus,
        moveSkillOrder,
        reorderSkills,
        reorderRoutineSkills,
        restoreRoutineSkill,
        calculateActiveRoutineDScore,
        getActiveRoutine,
        openRoutineInBuilder,
        primaryRoutineIds,
        setPrimaryRoutine,
        isPrimaryRoutine,
        getPrimaryRoutineForApparatus,
        getAllAroundSummary,
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
