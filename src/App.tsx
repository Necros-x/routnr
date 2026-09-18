'use client';

import React from 'react';
import {
  House,
  Search,
  ListChecks,
  Plus,
  ArrowUpRight,
} from 'lucide-react';
import { GymnasticsStoreProvider, useGymnasticsStore } from './hooks/useGymnasticsStore';
import { HomeScreen } from './screens/HomeScreen';
import { SkillLibraryScreen } from './screens/SkillLibraryScreen';
import { MyRoutinesScreen } from './screens/MyRoutinesScreen';
import { RoutineBuilderScreen } from './screens/RoutineBuilderScreen';
import { SkillDetailModal } from './screens/SkillDetailModal';
import { CreateRoutineModal } from './screens/CreateRoutineModal';
import { APP_CONFIG } from './config/app';
import type { ActiveTab } from './types/gymnastics';

const NAV_ITEMS: Array<{ id: ActiveTab; label: string; icon: React.ElementType }> = [
  { id: 'home', label: 'Home', icon: House },
  { id: 'skills', label: 'Skills', icon: Search },
  { id: 'routines', label: 'Routines', icon: ListChecks },
];

function MainAppContent() {
  const {
    activeTab,
    setActiveTab,
    activeRoutineId,
    setActiveRoutineId,
    routines,
    setCreateRoutineModalOpen,
  } = useGymnasticsStore();

  const changeTab = (tab: ActiveTab) => {
    if (tab !== 'routines') setActiveRoutineId(null);
    setActiveTab(tab);
  };

  const openBuilder = (routineId: string) => {
    setActiveRoutineId(routineId);
    setActiveTab('routines');
  };

  const pageLabel = activeRoutineId
    ? 'Routine Builder'
    : activeTab === 'skills'
      ? 'Skill Library'
      : activeTab === 'routines'
        ? 'My Routines'
        : 'Overview';

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--text-primary)] md:p-4">
      <div className="mx-auto min-h-screen max-w-[1680px] md:grid md:min-h-[calc(100vh-2rem)] md:grid-cols-[92px_minmax(0,1fr)] md:gap-4">
        <aside className="surface hidden rounded-[28px] p-3 md:flex md:flex-col md:items-center">
          <button
            type="button"
            onClick={() => changeTab('home')}
            className="focus-ring flex h-14 w-14 items-center justify-center rounded-[18px] bg-[var(--accent)] text-lg font-black tracking-[-0.08em] text-white"
            aria-label="Go home"
          >
            {APP_CONFIG.shortName}
          </button>

          <nav className="mt-10 flex w-full flex-col gap-2">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id && !(id === 'routines' && activeRoutineId);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => changeTab(id)}
                  className={`focus-ring group flex w-full flex-col items-center gap-1.5 rounded-[18px] px-2 py-3 text-[10px] font-semibold transition-colors ${
                    isActive
                      ? 'bg-[var(--accent-soft)] text-[var(--text-primary)]'
                      : 'text-[var(--text-tertiary)] hover:bg-[var(--surface-soft)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.9} />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto w-full space-y-2">
            <button
              type="button"
              onClick={() => setCreateRoutineModalOpen(true)}
              className="focus-ring flex w-full flex-col items-center gap-1.5 rounded-[18px] bg-[var(--accent)] px-2 py-3 text-[10px] font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              <Plus className="h-5 w-5" />
              <span>New</span>
            </button>
          </div>
        </aside>

        <section className="min-w-0 overflow-hidden md:surface md:rounded-[30px]">
          <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-[var(--border-subtle)] bg-[rgba(255,255,255,0.9)] px-4 backdrop-blur-xl sm:px-6 md:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => changeTab('home')}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[var(--accent)] font-black tracking-[-0.08em] text-white md:hidden"
                aria-label="ROUTNR home"
              >
                {APP_CONFIG.shortName}
              </button>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
                  {APP_CONFIG.name}
                </p>
                <h1 className="truncate text-sm font-semibold text-[var(--text-primary)]">{pageLabel}</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => changeTab('skills')}
                className="focus-ring hidden h-10 items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-soft)] px-4 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-hover)] sm:flex"
              >
                <Search className="h-4 w-4" />
                <span>Search skills</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-[var(--text-tertiary)]" />
              </button>
              <span className="hidden rounded-full border border-[var(--border-subtle)] bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)] lg:inline-flex">
                {APP_CONFIG.codeCycle}
              </span>
              <button
                type="button"
                onClick={() => setCreateRoutineModalOpen(true)}
                className="focus-ring inline-flex h-10 items-center gap-2 rounded-full bg-[var(--accent)] px-4 text-xs font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New routine</span>
              </button>
            </div>
          </header>

          <main className="mx-auto w-full max-w-[1480px] px-4 pb-28 pt-5 sm:px-6 md:px-8 md:pb-8 md:pt-8">
            {activeTab === 'home' && <HomeScreen />}
            {activeTab === 'skills' && <SkillLibraryScreen />}
            {activeTab === 'routines' &&
              (activeRoutineId ? (
                <RoutineBuilderScreen onBack={() => setActiveRoutineId(null)} />
              ) : (
                <MyRoutinesScreen onOpenBuilder={openBuilder} />
              ))}
          </main>
        </section>
      </div>

      <nav className="fixed inset-x-3 bottom-3 z-40 rounded-[22px] border border-[var(--border-medium)] bg-[rgba(255,255,255,0.94)] p-1.5 shadow-[var(--shadow-float)] backdrop-blur-xl md:hidden">
        <div className="grid grid-cols-3 gap-1">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id && !(id === 'routines' && activeRoutineId);
            return (
              <button
                key={id}
                type="button"
                onClick={() => changeTab(id)}
                className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-[17px] text-[10px] font-semibold transition-colors ${
                  isActive
                    ? 'bg-[var(--accent)] text-white'
                    : 'text-[var(--text-tertiary)] hover:bg-[var(--surface-soft)]'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
                {id === 'routines' && routines.length > 0 && (
                  <span className="absolute sr-only">{routines.length} routines</span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

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
