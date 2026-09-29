import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Bug,
  FolderKanban,
  Folder,
  Users,
  BarChart3,
  PlusCircle,
  Bell,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Avatar } from '../ui/Avatar';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const { user } = useAuthStore();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { to: '/bugs', label: 'Bug Reports', icon: <Bug className="w-5 h-5" /> },
    { to: '/kanban', label: 'Kanban Board', icon: <FolderKanban className="w-5 h-5" /> },
    { to: '/projects', label: 'Projects', icon: <Folder className="w-5 h-5" /> },
    { to: '/team', label: 'Team', icon: <Users className="w-5 h-5" /> },
    { to: '/analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { to: '/notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm sm:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-screen bg-white dark:bg-[#0E131F] border-r border-gray-200 dark:border-gray-800/80 transition-all duration-300 flex flex-col justify-between ${
          /* Desktop width */
          collapsed ? 'sm:w-20' : 'sm:w-64'
        } ${
          /* Mobile slide-in drawer behavior */
          isMobileOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full sm:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-800/80">
            <NavLink
              to="/dashboard"
              onClick={onCloseMobile}
              className="flex items-center gap-3 overflow-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-600/10 dark:bg-brand-500/20 border border-brand-500/30 flex items-center justify-center shrink-0 shadow-inner">
                <svg className="w-6 h-6 text-brand-600 dark:text-brand-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m8 2 1.88 1.88"/>
                  <path d="M14.12 3.88 16 2"/>
                  <path d="M9 7.13v-1a3.003 3.003 0 0 1 6 0v1"/>
                  <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6z"/>
                </svg>
              </div>
              {(!collapsed || isMobileOpen) && (
                <div>
                  <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-brand-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                    BUGLENS
                  </span>
                  <p className="text-[10px] font-semibold tracking-wider uppercase text-gray-400 -mt-1">
                    QA Collaboration
                  </p>
                </div>
              )}
            </NavLink>

            {/* Close button for mobile drawer */}
            {isMobileOpen ? (
              <button
                onClick={onCloseMobile}
                className="sm:hidden p-1.5 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={onToggleCollapse}
                className="hidden sm:block p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors"
              >
                {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            )}
          </div>

          {/* Primary Action Button */}
          <div className="p-3">
            <NavLink
              to="/bugs/new"
              onClick={onCloseMobile}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold shadow-md shadow-brand-500/20 transition-all ${
                collapsed && !isMobileOpen ? 'px-0' : ''
              }`}
            >
              <PlusCircle className="w-5 h-5 shrink-0" />
              {(!collapsed || isMobileOpen) && <span className="text-sm">Report Visual Bug</span>}
            </NavLink>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                    isActive
                      ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold border border-brand-500/20'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white'
                  }`
                }
                title={collapsed && !isMobileOpen ? item.label : undefined}
              >
                <div className="shrink-0">{item.icon}</div>
                {(!collapsed || isMobileOpen) && <span>{item.label}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Footer Profile */}
        {user && (
          <div className="p-3 border-t border-gray-100 dark:border-gray-800/80">
            <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200/50 dark:border-gray-800/50">
              <Avatar name={user.name} src={user.avatar} size="sm" showOnlineStatus />
              {(!collapsed || isMobileOpen) && (
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">{user.name}</h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{user.role}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
