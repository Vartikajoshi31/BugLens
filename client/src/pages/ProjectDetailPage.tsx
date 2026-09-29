import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { Project, Activity, Bug } from '../types';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { BugTable } from '../components/bug/BugTable';
import { ArrowLeft, Folder, Bug as BugIcon, CheckCircle2, Activity as ActivityIcon } from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [projectData, setProjectData] = useState<{
    project: Project;
    stats: { totalBugs: number; openBugs: number; resolvedBugs: number; inProgressBugs: number };
    recentActivity: Activity[];
  } | null>(null);

  const [projectBugs, setProjectBugs] = useState<Bug[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      apiRequest<any>(`/projects/${id}`),
      apiRequest<Bug[]>(`/bugs?project=${id}`),
    ]).then(([projRes, bugRes]) => {
      setProjectData(projRes);
      setProjectBugs(bugRes);
      setIsLoading(false);
    });
  }, [id]);

  if (isLoading) {
    return <Skeleton height={300} className="w-full rounded-2xl" />;
  }

  if (!projectData) {
    return <div>Project Not Found</div>;
  }

  const { project, stats, recentActivity } = projectData;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-200 dark:border-gray-800 pb-4">
        <button
          onClick={() => navigate('/projects')}
          className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
              {project.key}
            </span>
            <span className="text-xs text-gray-500">Owner: {project.owner?.name}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
            {project.name}
          </h1>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <span className="text-xs uppercase font-bold text-gray-400">Total Bugs</span>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-2">{stats.totalBugs}</p>
        </Card>
        <Card>
          <span className="text-xs uppercase font-bold text-gray-400">Open Bugs</span>
          <p className="text-2xl font-black text-amber-500 mt-2">{stats.openBugs}</p>
        </Card>
        <Card>
          <span className="text-xs uppercase font-bold text-gray-400">In Progress</span>
          <p className="text-2xl font-black text-brand-500 mt-2">{stats.inProgressBugs}</p>
        </Card>
        <Card>
          <span className="text-xs uppercase font-bold text-gray-400">Resolved</span>
          <p className="text-2xl font-black text-emerald-500 mt-2">{stats.resolvedBugs}</p>
        </Card>
      </div>

      {/* Team Members */}
      <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm space-y-4">
        <h3 className="font-bold text-base text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
          Assigned Team Members ({project.members?.length || 0})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(project.members || []).map((m) => (
            <div key={m._id} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 flex items-center gap-3">
              <Avatar name={m.name} src={m.avatar} size="xs" />
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">{m.name}</h4>
                <span className="text-[10px] text-gray-400 truncate block">{m.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bugs Table */}
      <div className="space-y-4">
        <h3 className="font-bold text-base text-gray-900 dark:text-white">
          Project Bugs ({projectBugs.length})
        </h3>
        <BugTable bugs={projectBugs} />
      </div>
    </div>
  );
};
