
import React from 'react';
import type { UserRole, View } from '../types';
import { VIEW_ICONS, VIEW_NAMES } from '../constants';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  userRole: UserRole;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, userRole, isOpen }) => {
  const getNavItems = (): View[] => {
    switch (userRole) {
      case 'Admin':
      case 'Energy Manager':
        return ['dashboard', 'optimization-planner', 'device-control', 'reports'];
      case 'Faculty/Staff':
        return ['dashboard', 'optimization-planner', 'reports'];
      case 'Student':
        return ['dashboard'];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-lg z-30 transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}>
      <div className="flex items-center justify-center h-20 border-b dark:border-gray-700">
         <i className={`fa-solid fa-solar-panel text-3xl text-blue-500 ${!isOpen && 'mx-auto'}`}></i>
         {isOpen && <h1 className="text-xl font-bold ml-2">Energy Planner</h1>}
      </div>
      <nav className="mt-4">
        <ul>
          {navItems.map((view) => {
            const isActive = currentView === view;
            const isDisabled = view === 'device-control' && userRole !== 'Admin';
            return (
              <li key={view} className="px-4 py-1">
                <button
                  onClick={() => onViewChange(view)}
                  disabled={isDisabled}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200
                    ${isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <i className={`${VIEW_ICONS[view]} text-lg ${isOpen ? 'mr-4' : 'mx-auto'}`}></i>
                  {isOpen && <span className="font-semibold">{VIEW_NAMES[view]}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};
