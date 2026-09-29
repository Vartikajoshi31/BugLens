import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../ui/Modal';
import {
  Search,
  PlusCircle,
  LayoutDashboard,
  Bug,
  FolderKanban,
  Users,
  BarChart3,
  Moon,
  Sun,
  Settings,
  ArrowRight,
} from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  const commands = [
    {
      id: 'create-bug',
      title: 'Create Bug & Visual Report',
      description: 'Upload screenshot and annotate with visual tools',
      icon: <PlusCircle className="w-5 h-5 text-brand-500" />,
      action: () => {
        onClose();
        navigate('/bugs/new');
      },
    },
    {
      id: 'search-bugs',
      title: 'Search Bugs',
      description: 'Filter and inspect open bug reports',
      icon: <Bug className="w-5 h-5 text-indigo-500" />,
      action: () => {
        onClose();
        navigate('/bugs');
      },
    },
    {
      id: 'open-kanban',
      title: 'Open Kanban Board',
      description: 'Drag & drop bugs by workflow columns',
      icon: <FolderKanban className="w-5 h-5 text-emerald-500" />,
      action: () => {
        onClose();
        navigate('/kanban');
      },
    },
    {
      id: 'open-dashboard',
      title: 'Open Dashboard',
      description: 'View overall project health, metrics, and activity',
      icon: <LayoutDashboard className="w-5 h-5 text-sky-500" />,
      action: () => {
        onClose();
        navigate('/dashboard');
      },
    },
    {
      id: 'open-projects',
      title: 'Open Projects Hub',
      description: 'View active projects and team assignments',
      icon: <FolderKanban className="w-5 h-5 text-purple-500" />,
      action: () => {
        onClose();
        navigate('/projects');
      },
    },
    {
      id: 'open-team',
      title: 'Open Team Directory',
      description: 'Check active workloads and member roles',
      icon: <Users className="w-5 h-5 text-amber-500" />,
      action: () => {
        onClose();
        navigate('/team');
      },
    },
    {
      id: 'open-analytics',
      title: 'Open Analytics & Reports',
      description: 'Resolution trends, browser distributions, and charts',
      icon: <BarChart3 className="w-5 h-5 text-rose-500" />,
      action: () => {
        onClose();
        navigate('/analytics');
      },
    },
    {
      id: 'toggle-theme',
      title: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
      description: 'Toggle visual theme preference',
      icon: theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-400" />,
      action: () => {
        toggleTheme();
        onClose();
      },
    },
  ];

  const filtered = commands.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl">
      <div className="-m-6">
        {/* Command Search Input */}
        <div className="relative border-b border-gray-200 dark:border-gray-800 p-4 flex items-center">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search (e.g., Create Bug)..."
            className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none text-base"
            autoFocus
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold text-gray-400 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700">
            ESC
          </kbd>
        </div>

        {/* Command List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">
              No matching commands found.
            </div>
          ) : (
            filtered.map((cmd) => (
              <button
                key={cmd.id}
                onClick={cmd.action}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50">
                    {cmd.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors">
                      {cmd.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{cmd.description}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/90 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 rounded-b-2xl">
          <div className="flex items-center gap-2">
            <span>Navigation shortcut:</span>
            <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded text-[10px] font-mono">⌘K</kbd>
          </div>
          <span>BugLens Command Engine v1.0</span>
        </div>
      </div>
    </Modal>
  );
};
