import React from 'react';
import { Home, Search, Layers3, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { ActiveTab } from '../types/gymnastics';
import { APP_CONFIG } from '../config/app';

interface AppNavbarProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  routinesCount: number;
  onNewRoutine: () => void;
}

export const AppNavbar: React.FC<AppNavbarProps> = ({
  activeTab,
  onChangeTab,
  routinesCount,
  onNewRoutine,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: <Home className="h-4 w-4" /> },
    { id: 'skills', label: 'Skills', icon: <Search className="h-4 w-4" /> },
    {
      id: 'routines',
      label: 'Routines',
      icon: <Layers3 className="h-4 w-4" />,
      badge: routinesCount,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-[#09090b]/[0.78] backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => onChangeTab('home')}
          className="group flex min-w-0 items-center gap-3 text-left"
          aria-label="Go to home"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[13px] border border-white/[0.1] bg-white text-[11px] font-bold tracking-[-0.04em] text-black shadow-[0_8px_24px_rgba(255,255,255,0.08)] transition-transform group-hover:scale-[1.03]">
            {APP_CONFIG.shortName}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-semibold tracking-[-0.02em] text-white">
                {APP_CONFIG.name}
              </span>
              <span className="hidden rounded-md border border-white/[0.07] bg-white/[0.045] px-1.5 py-0.5 text-[9px] font-mono text-neutral-500 sm:inline-flex">
                {APP_CONFIG.codeCycle}
              </span>
            </div>
            <span className="block truncate text-[10px] tracking-wide text-neutral-500">
              Skills · routines · D-score
            </span>
          </div>
        </button>

        <nav className="relative hidden items-center gap-1 rounded-[16px] border border-white/[0.07] bg-white/[0.025] p-1 md:flex">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChangeTab(item.id)}
                className="relative flex h-9 items-center gap-2 rounded-[12px] px-3.5 text-xs font-medium"
              >
                {isActive && (
                  <motion.div
                    layoutId="desktop-nav-active"
                    className="absolute inset-0 rounded-[12px] border border-white/[0.08] bg-white text-black shadow-sm"
                    transition={{ type: 'spring', stiffness: 430, damping: 34, mass: 0.8 }}
                  />
                )}
                <span
                  className={`relative z-10 flex items-center gap-2 transition-colors ${
                    isActive ? 'text-black' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {item.icon}
                  {item.label}
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[9px] font-mono ${
                        isActive ? 'bg-black/[0.07] text-black' : 'bg-white/[0.07] text-neutral-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={onNewRoutine}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-[13px] bg-white px-3.5 text-xs font-semibold text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">New routine</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>
    </header>
  );
};
