import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { Bug, Project, User } from '../types';
import { BugCard } from '../components/bug/BugCard';
import { BugTable } from '../components/bug/BugTable';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  Search,
  PlusCircle,
  Filter,
  LayoutGrid,
  List,
  RotateCcw,
  Bug as BugIcon,
} from 'lucide-react';
import { useSocket } from '../hooks/useSocket';

export const BugListPage: React.FC = () => {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filter States
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [severity, setSeverity] = useState('');
  const [projectId, setProjectId] = useState('');
  const [assigneeId, setAssigneeId] = useState('');

  const navigate = useNavigate();

  const fetchBugs = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (status) params.append('status', status);
      if (severity) params.append('severity', severity);
      if (projectId) params.append('project', projectId);
      if (assigneeId) params.append('assignee', assigneeId);

      const data = await apiRequest<Bug[]>(`/bugs?${params.toString()}`);
      setBugs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFiltersData = async () => {
    try {
      const [projs, usr] = await Promise.all([
        apiRequest<Project[]>('/projects'),
        apiRequest<User[]>('/auth/users'),
      ]);
      setProjects(projs);
      setUsers(usr);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFiltersData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBugs();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, status, severity, projectId, assigneeId]);

  useSocket('bug:created', fetchBugs);
  useSocket('bug:updated', fetchBugs);
  useSocket('bug:deleted', fetchBugs);

  const clearFilters = () => {
    setSearch('');
    setStatus('');
    setSeverity('');
    setProjectId('');
    setAssigneeId('');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <BugIcon className="w-6 h-6 text-brand-500" />
            Bug Reports ({bugs.length})
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Search, filter, inspect reproduction steps, and manage bug lifecycles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-900 text-brand-600 dark:text-brand-400 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-gray-900 text-brand-600 dark:text-brand-400 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <Button onClick={() => navigate('/bugs/new')} leftIcon={<PlusCircle className="w-4 h-4" />}>
            Report Bug
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="w-full md:flex-1">
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Bug ID, title, description, or label..."
              leftIcon={<Search className="w-4 h-4 text-gray-400" />}
            />
          </div>

          <div className="w-full md:w-auto flex flex-wrap items-center gap-2">
            {/* Status Select */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-xs rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
            >
              <option value="">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN PROGRESS">In Progress</option>
              <option value="IN REVIEW">In Review</option>
              <option value="TESTING">Testing</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>

            {/* Severity Select */}
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-xs rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
            >
              <option value="">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

            {/* Project Select */}
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-xs rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium max-w-[140px]"
            >
              <option value="">All Projects</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} ({p.key})
                </option>
              ))}
            </select>

            {/* Assignee Select */}
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-xs rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium max-w-[140px]"
            >
              <option value="">All Assignees</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>

            {(search || status || severity || projectId || assigneeId) && (
              <button
                onClick={clearFilters}
                className="p-2.5 rounded-xl text-gray-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                title="Reset Filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content View */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} height={180} className="rounded-2xl" />
          ))}
        </div>
      ) : bugs.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto mb-4">
            <BugIcon className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">No matching bugs found</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or reset active filters to view all team reports.
          </p>
          <Button variant="outline" size="sm" onClick={clearFilters} className="mt-4">
            Reset Filters
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bugs.map((bug) => (
            <BugCard key={bug._id} bug={bug} />
          ))}
        </div>
      ) : (
        <BugTable bugs={bugs} />
      )}
    </div>
  );
};
