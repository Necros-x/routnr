import React from 'react';
import { Home, Search, Layers3 } from 'lucide-react';
import { motion } from 'motion/react';
import { ActiveTab } from '../types/gymnastics';

interface FloatingBottomNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  routinesCount?: number;
}

export const FloatingBottomNav: React.FC<FloatingBottomNavProps> = ({
  activeTab,
  onChangeTab,
  routinesCount,
}) => {
  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: <Home className="h-5 w-5" /> },
    { id: 'skills', label: 'Skills', icon: <Search className="h-5 w-5" /> },
    { id: 'routines', label: 'Routines', icon: <Layers3 className="h-5 w-5" />, badge: routinesCount },
  ];

  return (
    <nav
      aria-label="Bottom navigation"
      className="pointer-events-none fixed inset-x-0 bottom-3 z-40 flex justify-center px-4 md:hidden"
    >
      <div className="glass-nav safe-bottom pointer-events-auto flex w-full max-w-sm items-center gap-1 rounded-[22px] p-1.5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChangeTab(tab.id)}
              className="group relative flex h-12 flex-1 select-none flex-col items-center justify-center gap-0.5 rounded-[16px]"
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-active"
                  className="absolute inset-0 rounded-[16px] bg-white"
                  transition={{ type: 'spring', stiffness: 430, damping: 34 }}
                />
              )}
              <div
                className={`relative z-10 flex flex-col items-center gap-0.5 transition-colors ${
                  isActive ? 'text-black' : 'text-neutral-400 group-hover:text-neutral-200'
                }`}
              >
                <div className="relative">
                  {tab.icon}
                  {typeof tab.badge === 'number' && tab.badge > 0 && !isActive && (
                    <span className="absolute -right-2.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[8px] font-bold text-black">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium leading-none">{tab.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
