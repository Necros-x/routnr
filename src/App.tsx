'use client';

import React from 'react';
import { GymnasticsStoreProvider, useGymnasticsStore } from './hooks/useGymnasticsStore';
import { AppNavbar } from './components/AppNavbar';
import { FloatingBottomNav } from './components/FloatingBottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { SkillLibraryScreen } from './screens/SkillLibraryScreen';
import { MyRoutinesScreen } from './screens/MyRoutinesScreen';
import { RoutineBuilderScreen } from './screens/RoutineBuilderScreen';
import { SkillDetailModal } from './screens/SkillDetailModal';
import { CreateRoutineModal } from './screens/CreateRoutineModal';

function MainAppContent() {
  const {
    activeTab,
    setActiveTab,
    activeRoutineId,
    setActiveRoutineId,
    routines,
    setCreateRoutineModalOpen,
  } = useGymnasticsStore();

  const handleOpenBuilder = (routineId: string) => {
    setActiveRoutineId(routineId);
    setActiveTab('routines');
  };

  const handleBackToRoutines = () => {
    setActiveRoutineId(null);
  };

  return (
    <div className="min-h-screen text-[var(--text-primary)]">
      <AppNavbar
        activeTab={activeTab}
        onChangeTab={(tab) => {
          if (tab !== 'routines') setActiveRoutineId(null);
          setActiveTab(tab);
        }}
        routinesCount={routines.length}
        onNewRoutine={() => setCreateRoutineModalOpen(true)}
      />

      <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 md:py-8 lg:px-8">
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'skills' && <SkillLibraryScreen />}
        {activeTab === 'routines' &&
          (activeRoutineId ? (
            <RoutineBuilderScreen onBack={handleBackToRoutines} />
          ) : (
            <MyRoutinesScreen onOpenBuilder={handleOpenBuilder} />
          ))}
      </main>

      <FloatingBottomNav
        activeTab={activeTab}
        onChangeTab={(tab) => {
          if (tab !== 'routines') setActiveRoutineId(null);
          setActiveTab(tab);
        }}
        routinesCount={routines.length}
      />

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
