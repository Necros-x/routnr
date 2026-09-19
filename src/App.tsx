'use client';

import React, { useEffect, useState } from 'react';
import { Download, House, Search, ListChecks, Menu, Plus, Settings2, UserRound, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { GymnasticsStoreProvider, useGymnasticsStore } from './hooks/useGymnasticsStore';
import { HomeScreen } from './screens/HomeScreen';
import { SkillLibraryScreen } from './screens/SkillLibraryScreen';
import { MyRoutinesScreen } from './screens/MyRoutinesScreen';
import { RoutineBuilderScreen } from './screens/RoutineBuilderScreen';
import { SkillDetailModal } from './screens/SkillDetailModal';
import { CreateRoutineModal } from './screens/CreateRoutineModal';
import { DownloadManagerModal } from './components/DownloadManagerModal';
import { ProfileModal } from './components/ProfileModal';
import { SettingsModal } from './components/SettingsModal';
import { APP_CONFIG } from './config/app';
import { OFFLINE_STORAGE_KEY } from './config/code';
import type { ActiveTab } from './types/gymnastics';

const NAV_SLIDE = {
  type: 'spring' as const,
  stiffness: 500,
  damping: 28,
  mass: 0.78,
};

const SCREEN_SPRING = {
  type: 'spring' as const,
  stiffness: 390,
  damping: 34,
  mass: 0.82,
};

const TAB_ORDER: Record<ActiveTab, number> = {
  home: 0,
  skills: 1,
  routines: 2,
};

function MainAppContent() {
  const reduceMotion = useReducedMotion();

  const {
    activeTab,
    setActiveTab,
    activeRoutineId,
    setActiveRoutineId,
    routines,
    setCreateRoutineModalOpen,
  } = useGymnasticsStore();

  const [menuOpen, setMenuOpen] = useState(false);
  const [downloadManagerOpen, setDownloadManagerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [screenDirection, setScreenDirection] = useState<1 | -1>(1);

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !('serviceWorker' in navigator) ||
      !localStorage.getItem(OFFLINE_STORAGE_KEY)
    ) {
      return;
    }

    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {
      // The download manager can retry registration when the user refreshes the pack.
    });
  }, []);

  const getScreenPosition = (
    tab: ActiveTab,
    routineId: string | null = activeRoutineId,
  ) => {
    if (tab === 'routines' && routineId) return 3;
    return TAB_ORDER[tab];
  };

  const changeTab = (tab: ActiveTab) => {
    const nextRoutineId = tab === 'routines' ? activeRoutineId : null;
    const currentPosition = getScreenPosition(activeTab, activeRoutineId);
    const nextPosition = getScreenPosition(tab, nextRoutineId);

    if (nextPosition !== currentPosition) {
      setScreenDirection(nextPosition > currentPosition ? 1 : -1);
    }

    if (tab !== 'routines') setActiveRoutineId(null);
    setActiveTab(tab);
    setMenuOpen(false);
  };

  const openBuilder = (routineId: string) => {
    setScreenDirection(1);
    setActiveRoutineId(routineId);
    setActiveTab('routines');
  };

  const closeBuilder = () => {
    setScreenDirection(-1);
    setActiveRoutineId(null);
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

  const screenKey =
    activeTab === 'routines' && activeRoutineId
      ? `builder-${activeRoutineId}`
      : activeTab;

  const screenInitialX = reduceMotion ? 0 : screenDirection * 54;
  const screenExitX = reduceMotion ? 0 : screenDirection * -54;

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--text-primary)]">
      <div className="mx-auto min-h-screen w-full max-w-6xl px-4 pb-28 pt-4 sm:px-6 sm:pt-6 lg:px-8">
        <header className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => changeTab('home')}
            className="text-left text-base font-black tracking-[-0.05em]"
            aria-label="ROUTNR home"
          >
            {APP_CONFIG.name}
          </button>

          <button
            type="button"
            onClick={() => setDownloadManagerOpen(true)}
            className="glass-float backdrop-blur-[2px] flex h-10 w-10 items-center justify-center rounded-[20px] text-[var(--text-primary)] transition-transform hover:-translate-y-0.5"
            aria-label="Open download manager"
          >
            <Download className="h-4 w-4" />
          </button>
        </header>

        <main className="mt-8 overflow-x-clip">
          <AnimatePresence
            initial={false}
            mode="popLayout"
            custom={screenDirection}
          >
            <motion.section
              key={screenKey}
              custom={screenDirection}
              initial={{
                x: screenInitialX,
                opacity: 0,
              }}
              animate={{
                x: 0,
                opacity: 1,
              }}
              exit={{
                x: screenExitX,
                opacity: 0,
              }}
              transition={
                reduceMotion
                  ? { duration: 0.14, ease: 'easeOut' }
                  : SCREEN_SPRING
              }
              className="w-full"
            >
              {activeTab === 'home' && <HomeScreen />}
              {activeTab === 'skills' && <SkillLibraryScreen />}
              {activeTab === 'routines' &&
                (activeRoutineId ? (
                  <RoutineBuilderScreen onBack={closeBuilder} />
                ) : (
                  <MyRoutinesScreen onOpenBuilder={openBuilder} />
                ))}
            </motion.section>
          </AnimatePresence>
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
                setProfileOpen(true);
              }}
              className="flex w-full items-center justify-between rounded-[12px] px-4 py-3 text-left hover:bg-white/55"
            >
              <div className="flex items-center gap-3">
                <UserRound className="h-4 w-4 text-[var(--text-secondary)]" />
                <div>
                  <p className="text-sm font-semibold">Profile</p>
                  <p className="mt-0.5 text-[11px] text-[var(--text-tertiary)]">
                    Local gymnast profile
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setSettingsOpen(true);
              }}
              className="mt-1 flex w-full items-center justify-between rounded-[12px] px-4 py-3 text-left hover:bg-white/55"
            >
              <div className="flex items-center gap-3">
                <Settings2 className="h-4 w-4 text-[var(--text-secondary)]" />
                <div>
                  <p className="text-sm font-semibold">Settings</p>
                  <p className="mt-0.5 text-[11px] text-[var(--text-tertiary)]">
                    App preferences and storage
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setCreateRoutineModalOpen(true);
              }}
              className="mt-1 flex w-full items-center justify-between rounded-[12px] px-4 py-3 text-left hover:bg-white/55"
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
      <DownloadManagerModal
        isOpen={downloadManagerOpen}
        onClose={() => setDownloadManagerOpen(false)}
      />
      <ProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onOpenDownloads={() => setDownloadManagerOpen(true)}
      />
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
