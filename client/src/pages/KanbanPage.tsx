import React, { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import { Bug, BugStatus, Project } from '../types';
import { KanbanBoard } from '../components/kanban/KanbanBoard';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { FolderKanban, PlusCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../hooks/useSocket';

export const KanbanPage: React.FC = () => {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchKanbanBugs = async () => {
    setIsLoading(true);
    try {
      const url = selectedProjectId ? `/bugs?project=${selectedProjectId}` : '/bugs';
      const [bugList, projList] = await Promise.all([
        apiRequest<Bug[]>(url),
        apiRequest<Project[]>('/projects'),
      ]);
      setBugs(bugList);
      setProjects(projList);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKanbanBugs();
  }, [selectedProjectId]);

  useSocket('bug:created', fetchKanbanBugs);
  useSocket('bug:updated', fetchKanbanBugs);
  useSocket('bug:deleted', fetchKanbanBugs);

  const handleMoveBug = async (bugId: string, newStatus: BugStatus) => {
    try {
      await apiRequest(`/bugs/${bugId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      toast('Kanban Updated', `Moved bug to ${newStatus}`, 'info');
    } catch (err: any) {
      toast('Move Failed', err.message, 'error');
      fetchKanbanBugs();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-brand-500" />
            Interactive Kanban Workflow
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Drag and drop bug cards across columns with real-time Socket.IO synchronization.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Project filter */}
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-xs rounded-xl p-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
          >
            <option value="">All Projects</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.key})
              </option>
            ))}
          </select>

          <button
            onClick={fetchKanbanBugs}
            className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
            title="Refresh Board"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <Button onClick={() => navigate('/bugs/new')} leftIcon={<PlusCircle className="w-4 h-4" />}>
            Report Bug
          </Button>
        </div>
      </div>

      {/* Board Stage */}
      {isLoading ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} height={500} className="flex-1 min-w-[280px] rounded-2xl" />
          ))}
        </div>
      ) : (
        <KanbanBoard bugs={bugs} onMoveBug={handleMoveBug} />
      )}
    </div>
  );
};
