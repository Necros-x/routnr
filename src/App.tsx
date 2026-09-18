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

const NAV_SPRING = {
  type: 'spring' as const,
  stiffness: 430,
  damping: 27,
  mass: 0.72,
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

  const navItemClass =
    'relative flex h-12 items-center justify-center overflow-hidden rounded-full px-4 transition-colors duration-200';

  const navIconClass = 'relative z-10 h-5 w-5';

  const ActivePill = () => (
    <motion.span
      layoutId="routnr-active-nav-pill"
      className="absolute inset-0 rounded-full bg-[var(--accent)]"
      transition={NAV_SPRING}
    />
  );

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
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-medium)] bg-white text-sm font-black tracking-[-0.08em]">
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
            className="flex h-10 items-center justify-center rounded-full border border-[var(--border-medium)] bg-white px-4 text-[var(--text-primary)] shadow-sm transition-transform hover:-translate-y-0.5"
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

      <motion.nav
        layout
        transition={NAV_SPRING}
        className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-full border border-[var(--border-medium)] bg-white/95 p-1.5 shadow-[0_18px_45px_rgba(28,28,25,0.12)] backdrop-blur-xl"
      >
        <div className="grid grid-cols-4 gap-1">
          <motion.button
            type="button"
            onClick={() => changeTab('home')}
            whileTap={{ scale: 0.9 }}
            transition={NAV_SPRING}
            className={`${navItemClass} ${
              activeTab === 'home' && !menuOpen
                ? 'text-white'
                : 'text-[var(--text-tertiary)] hover:bg-[var(--surface-soft)] hover:text-[var(--text-primary)]'
            }`}
            aria-label="Home"
          >
            {activeTab === 'home' && !menuOpen && <ActivePill />}
            <motion.span
              className="relative z-10"
              animate={{
                scale: activeTab === 'home' && !menuOpen ? 1.08 : 1,
                y: activeTab === 'home' && !menuOpen ? -0.5 : 0,
              }}
              transition={NAV_SPRING}
            >
              <House className={navIconClass} />
            </motion.span>
          </motion.button>

          <motion.button
            type="button"
            onClick={() => changeTab('skills')}
            whileTap={{ scale: 0.9 }}
            transition={NAV_SPRING}
            className={`${navItemClass} ${
              activeTab === 'skills' && !menuOpen
                ? 'text-white'
                : 'text-[var(--text-tertiary)] hover:bg-[var(--surface-soft)] hover:text-[var(--text-primary)]'
            }`}
            aria-label="Skills"
          >
            {activeTab === 'skills' && !menuOpen && <ActivePill />}
            <motion.span
              className="relative z-10"
              animate={{
                scale: activeTab === 'skills' && !menuOpen ? 1.08 : 1,
                y: activeTab === 'skills' && !menuOpen ? -0.5 : 0,
              }}
              transition={NAV_SPRING}
            >
              <Search className={navIconClass} />
            </motion.span>
          </motion.button>

          <motion.button
            type="button"
            onClick={() => changeTab('routines')}
            whileTap={{ scale: 0.9 }}
            transition={NAV_SPRING}
            className={`${navItemClass} ${
              activeTab === 'routines' && !menuOpen
                ? 'text-white'
                : 'text-[var(--text-tertiary)] hover:bg-[var(--surface-soft)] hover:text-[var(--text-primary)]'
            }`}
            aria-label="Routines"
          >
            {activeTab === 'routines' && !menuOpen && <ActivePill />}
            <motion.span
              className="relative z-10"
              animate={{
                scale: activeTab === 'routines' && !menuOpen ? 1.08 : 1,
                y: activeTab === 'routines' && !menuOpen ? -0.5 : 0,
              }}
              transition={NAV_SPRING}
            >
              <ListChecks className={navIconClass} />
            </motion.span>

            {routines.length > 0 && (
              <motion.span
                layout
                className={`absolute right-2.5 top-1.5 z-20 min-w-4 rounded-full px-1 text-center text-[9px] font-bold ${
                  activeTab === 'routines' && !menuOpen
                    ? 'bg-white text-[var(--accent)]'
                    : 'bg-[var(--app-bg-strong)] text-[var(--text-primary)]'
                }`}
                transition={NAV_SPRING}
              >
                {routines.length}
              </motion.span>
            )}
          </motion.button>

          <motion.button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            whileTap={{ scale: 0.9 }}
            transition={NAV_SPRING}
            className={`${navItemClass} ${
              menuOpen
                ? 'text-white'
                : 'text-[var(--text-tertiary)] hover:bg-[var(--surface-soft)] hover:text-[var(--text-primary)]'
            }`}
            aria-label="Menu"
          >
            {menuOpen && <ActivePill />}
            <motion.span
              className="relative z-10"
              animate={{
                rotate: menuOpen ? 90 : 0,
                scale: menuOpen ? 1.08 : 1,
              }}
              transition={NAV_SPRING}
            >
              {menuOpen ? <X className={navIconClass} /> : <Menu className={navIconClass} />}
            </motion.span>
          </motion.button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.97 }}
            transition={NAV_SPRING}
            className="fixed inset-x-4 bottom-[88px] z-40 mx-auto max-w-md rounded-[24px] border border-[var(--border-medium)] bg-white p-3 shadow-[0_18px_45px_rgba(28,28,25,0.12)]"
          >
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setCreateRoutineModalOpen(true);
              }}
              className="flex w-full items-center justify-between rounded-full px-4 py-3 text-left hover:bg-[var(--surface-soft)]"
            >
              <div>
                <p className="text-sm font-semibold">New routine</p>
                <p className="mt-0.5 text-[11px] text-[var(--text-tertiary)]">Start from an apparatus</p>
              </div>
              <Plus className="h-4 w-4" />
            </button>

            <div className="mt-1 rounded-full bg-[var(--surface-soft)] px-4 py-3">
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
