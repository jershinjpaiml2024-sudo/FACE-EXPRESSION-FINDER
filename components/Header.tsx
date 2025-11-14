
import React from 'react';
import type { UserRole } from '../types';

interface HeaderProps {
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
  userRoles: UserRole[];
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ currentUserRole, setCurrentUserRole, userRoles, toggleSidebar, isSidebarOpen }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex items-center justify-between z-20">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 mr-4">
           <i className={`fa-solid ${isSidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
        </button>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Smart Campus Planner</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
            <label htmlFor="user-role-select" className="text-sm font-medium">Viewing as:</label>
            <select
              id="user-role-select"
              value={currentUserRole}
              onChange={(e) => setCurrentUserRole(e.target.value as UserRole)}
              className="bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {userRoles.map(role => <option key={role} value={role}>{role}</option>)}
            </select>
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            {currentUserRole.charAt(0)}
        </div>
      </div>
    </header>
  );
};
