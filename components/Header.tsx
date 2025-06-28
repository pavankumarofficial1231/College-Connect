import React from 'react';
import { PlusIcon, BellIcon } from './icons';

interface HeaderProps {
  onPostProject: () => void;
  notificationCount: number;
  currentUser: string;
  setCurrentUser: (user: string) => void;
  allUsers: string[];
  isFilterActive: boolean;
  onToggleNotificationFilter: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onPostProject, 
  notificationCount,
  currentUser,
  setCurrentUser,
  allUsers,
  isFilterActive,
  onToggleNotificationFilter
}) => {
  return (
    <header className="sticky top-0 bg-slate-900/70 backdrop-blur-lg z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 border-b border-slate-700">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text">
            College Connect
          </h1>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <label htmlFor="user-select" className="text-sm font-medium text-slate-400">Viewing as:</label>
                <select 
                  id="user-select"
                  value={currentUser}
                  onChange={(e) => setCurrentUser(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-md py-1 px-2 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  {allUsers.map(user => <option key={user} value={user}>{user}</option>)}
                </select>
            </div>
            <div className="relative">
              <button 
                onClick={onToggleNotificationFilter}
                className={`p-2 rounded-full transition-colors ${isFilterActive ? 'bg-teal-500/20 text-teal-400' : 'text-slate-400 hover:text-white'}`}
                aria-label="Toggle notifications filter"
              >
                <BellIcon className="w-7 h-7" />
              </button>
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white ring-2 ring-slate-900">
                  {notificationCount}
                </span>
              )}
            </div>
            <button
              onClick={onPostProject}
              className="flex items-center gap-2 bg-teal-500 text-white font-semibold py-2 px-5 rounded-lg hover:bg-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-teal-500/20"
            >
              <PlusIcon className="w-5 h-5" />
              Post a Project
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;