'use client';

import React, { useState } from 'react';
import { House, Search, ListChecks, Menu, Plus, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { GymnasticsStoreProvider, useGymnasticsStore } from './hooks/useGymnasticsStore';
import { HomeScreen } from './screens/HomeScreen';
import { SkillLibraryScreen } from './screens/SkillLibraryScreen';
import { MyRoutinesScreen } from './screens/MyRoutinesScreen';
import { RoutineBuilderScreen } from './screens/RoutineBuilderScreen';
import { SkillDetailModal } from './screens/SkillDetailModal';
import { CreateRoutineModal } from './screens/CreateRoutineModal';
import { APP_CONFIG } from './config/app';
import type { ActiveTab } from './types/gymnastics';

const NAV_SLIDE = {
  type: 'spring' as const,
  stiffness: 500,
  damping: 28,
  mass: 0.78,
};

function MainAppContent() {
  const {
    activeTab,
    setActiveTab,
    activeRoutineId,
    setActiveRoutineId,
    routines,
    setCreateRoutineModalOpen,
  } = useGymnasticsStore();

  const [menuOpen, setMenuOpen] = useState(false);

  const changeTab = (tab: ActiveTab) => {
    if (tab !== 'routines') setActiveRoutineId(null);
    setActiveTab(tab);
    setMenuOpen(false);
  };

  const openBuilder = (routineId: string) => {
    setActiveRoutineId(routineId);
    setActiveTab('routines');
  };

  const activeNavIndex = menuOpen
    ? 3
    : activeTab === 'home'
      ? 0
      : activeTab === 'skills'
        ? 1
        : 2;

  const itemClass =
    'relative z-10 flex h-12 items-center justify-center rounded-[24px] transition-colors duration-150';

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--text-primary)]">
      <div className="mx-auto min-h-screen w-full max-w-6xl px-4 pb-28 pt-4 sm:px-6 sm:pt-6 lg:px-8">
        <header className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => changeTab('home')}
            className="text-left"
            aria-label="ROUTNR home"
          >
            <div className="flex items-center gap-2.5">
              <span className="glass-float flex h-9 w-9 items-center justify-center rounded-[18px] text-sm font-black tracking-[-0.08em]">
                R
              </span>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-tertiary)]">
                  Gymnastics
                </p>
                <p className="text-base font-black tracking-[-0.05em]">{APP_CONFIG.name}</p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setCreateRoutineModalOpen(true)}
            className="glass-float flex h-10 items-center justify-center rounded-[20px] px-4 text-[var(--text-primary)] transition-transform hover:-translate-y-0.5"
            aria-label="Create routine"
          >
            <Plus className="h-4 w-4" />
          </button>
        </header>

        <main className="mt-8">
          {activeTab === 'home' && <HomeScreen />}
          {activeTab === 'skills' && <SkillLibraryScreen />}
          {activeTab === 'routines' &&
            (activeRoutineId ? (
              <RoutineBuilderScreen onBack={() => setActiveRoutineId(null)} />
            ) : (
              <MyRoutinesScreen onOpenBuilder={openBuilder} />
            ))}
        </main>
      </div>

      <nav className="glass-nav backdrop-blur-[2px] fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-[30px] p-1.5">
        <div className="relative grid grid-cols-4 overflow-hidden rounded-[24px]">
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-1/4 rounded-[24px] bg-[var(--accent)]"
            animate={{ x: `${activeNavIndex * 100}%` }}
            transition={NAV_SLIDE}
          />

          <button
            type="button"
            onClick={() => changeTab('home')}
            className={`${itemClass} ${
              activeNavIndex === 0
                ? 'text-white'
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
            }`}
            aria-label="Home"
          >
            <House className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => changeTab('skills')}
            className={`${itemClass} ${
              activeNavIndex === 1
                ? 'text-white'
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
            }`}
            aria-label="Skills"
          >
            <Search className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => changeTab('routines')}
            className={`${itemClass} ${
              activeNavIndex === 2
                ? 'text-white'
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
            }`}
            aria-label="Routines"
          >
            <ListChecks className="h-5 w-5" />
            {routines.length > 0 && (
              <span
                className={`absolute right-2.5 top-1.5 min-w-4 rounded-full px-1 text-center text-[9px] font-bold transition-colors duration-150 ${
                  activeNavIndex === 2
                    ? 'bg-white text-[var(--accent)]'
                    : 'bg-[var(--app-bg-strong)] text-[var(--text-primary)]'
                }`}
              >
                {routines.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className={`${itemClass} ${
              activeNavIndex === 3
                ? 'text-white'
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
            }`}
            aria-label="Menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.span
                  key="close"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.12 }}
                >
                  <X className="h-5 w-5" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.12 }}
                >
                  <Menu className="h-5 w-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="glass-float backdrop-blur-[2px] fixed inset-x-4 bottom-[88px] z-40 mx-auto max-w-md rounded-[24px] p-3"
          >
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setCreateRoutineModalOpen(true);
              }}
              className="flex w-full items-center justify-between rounded-[12px] px-4 py-3 text-left hover:bg-white/55"
            >
              <div>
                <p className="text-sm font-semibold">New routine</p>
                <p className="mt-0.5 text-[11px] text-[var(--text-tertiary)]">
                  Start from an apparatus
                </p>
              </div>
              <Plus className="h-4 w-4" />
            </button>

            <div className="mt-1 rounded-[12px] bg-white/45 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
                Code cycle
              </p>
              <p className="mt-1 text-xs font-medium">{APP_CONFIG.codeCycle}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SkillDetailModal />
      <CreateRoutineModal />
    </div>
  );
}

export default function App() {
  return (
    <GymnasticsStoreProvider>
      <MainAppContent />
    </GymnasticsStoreProvider>
  );
}
