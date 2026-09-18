'use client';

import React, { useState } from 'react';
import { House, Search, ListChecks, Menu, Plus, X } from 'lucide-react';
import { GymnasticsStoreProvider, useGymnasticsStore } from './hooks/useGymnasticsStore';
import { HomeScreen } from './screens/HomeScreen';
import { SkillLibraryScreen } from './screens/SkillLibraryScreen';
import { MyRoutinesScreen } from './screens/MyRoutinesScreen';
import { RoutineBuilderScreen } from './screens/RoutineBuilderScreen';
import { SkillDetailModal } from './screens/SkillDetailModal';
import { CreateRoutineModal } from './screens/CreateRoutineModal';
import { APP_CONFIG } from './config/app';
import type { ActiveTab } from './types/gymnastics';

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
              <span className="flex h-9 w-9 items-center justify-center rounded-[14px] border border-[var(--border-medium)] bg-white text-sm font-black tracking-[-0.08em]">
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
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-medium)] bg-white text-[var(--text-primary)] shadow-sm transition-transform hover:-translate-y-0.5"
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

      <nav className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-[26px] border border-[var(--border-medium)] bg-white/95 p-1.5 shadow-[0_18px_45px_rgba(28,28,25,0.12)] backdrop-blur-xl">
        <div className="grid grid-cols-4 gap-1">
          <button
            type="button"
            onClick={() => changeTab('home')}
            className={`flex h-14 items-center justify-center rounded-[20px] transition-colors ${
              activeTab === 'home'
                ? 'bg-[var(--accent)] text-white'
                : 'text-[var(--text-tertiary)] hover:bg-[var(--surface-soft)] hover:text-[var(--text-primary)]'
            }`}
            aria-label="Home"
          >
            <House className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => changeTab('skills')}
            className={`flex h-14 items-center justify-center rounded-[20px] transition-colors ${
              activeTab === 'skills'
                ? 'bg-[var(--accent)] text-white'
                : 'text-[var(--text-tertiary)] hover:bg-[var(--surface-soft)] hover:text-[var(--text-primary)]'
            }`}
            aria-label="Skills"
          >
            <Search className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => changeTab('routines')}
            className={`relative flex h-14 items-center justify-center rounded-[20px] transition-colors ${
              activeTab === 'routines'
                ? 'bg-[var(--accent)] text-white'
                : 'text-[var(--text-tertiary)] hover:bg-[var(--surface-soft)] hover:text-[var(--text-primary)]'
            }`}
            aria-label="Routines"
          >
            <ListChecks className="h-5 w-5" />
            {routines.length > 0 && (
              <span className="absolute right-3 top-2 min-w-4 rounded-full bg-[var(--app-bg-strong)] px-1 text-center text-[9px] font-bold text-[var(--text-primary)]">
                {routines.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className={`flex h-14 items-center justify-center rounded-[20px] transition-colors ${
              menuOpen
                ? 'bg-[var(--accent)] text-white'
                : 'text-[var(--text-tertiary)] hover:bg-[var(--surface-soft)] hover:text-[var(--text-primary)]'
            }`}
            aria-label="Menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-x-4 bottom-[92px] z-40 mx-auto max-w-md rounded-[24px] border border-[var(--border-medium)] bg-white p-3 shadow-[0_18px_45px_rgba(28,28,25,0.12)]">
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              setCreateRoutineModalOpen(true);
            }}
            className="flex w-full items-center justify-between rounded-[18px] px-4 py-3 text-left hover:bg-[var(--surface-soft)]"
          >
            <div>
              <p className="text-sm font-semibold">New routine</p>
              <p className="mt-0.5 text-[11px] text-[var(--text-tertiary)]">Start from an apparatus</p>
            </div>
            <Plus className="h-4 w-4" />
          </button>
          <div className="mt-1 rounded-[18px] bg-[var(--surface-soft)] px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
              Code cycle
            </p>
            <p className="mt-1 text-xs font-medium">{APP_CONFIG.codeCycle}</p>
          </div>
        </div>
      )}

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
