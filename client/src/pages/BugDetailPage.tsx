import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { apiRequest } from '../services/api';
import { Bug, Comment, Activity, User, BugStatus } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { SeverityBadge } from '../components/common/SeverityBadge';
import { ReproductionContext } from '../components/bug/ReproductionContext';
import { ActivityTimeline } from '../components/bug/ActivityTimeline';
import { CommentSection } from '../components/bug/CommentSection';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';
import {
  ArrowLeft,
  Camera,
  Maximize2,
  Trash2,
  Share2,
  CheckCircle2,
  ChevronDown,
  UserCheck,
  Building,
} from 'lucide-react';
import { useSocket } from '../hooks/useSocket';
import { useAuthStore } from '../store/useAuthStore';

export const BugDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const { toast } = useToast();

  const [bug, setBug] = useState<Bug | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'comments' | 'activity'>('comments');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [isFullscreenImage, setIsFullscreenImage] = useState(false);

  const fetchBugDetails = async () => {
    if (!id) return;
    try {
      const [bugData, commentsData, usersData] = await Promise.all([
        apiRequest<Bug>(`/bugs/${id}`),
        apiRequest<Comment[]>(`/comments/bug/${id}`),
        apiRequest<User[]>('/auth/users'),
      ]);

      setBug(bugData);
      setComments(commentsData);
      setTeamMembers(usersData);

      // Fetch activity stream
      const dashRes = await apiRequest<any>('/analytics/dashboard');
      const filteredAct = (dashRes.recentActivity || []).filter(
        (a: any) => a.bug && (a.bug._id === bugData._id || a.bug.bugId === bugData.bugId)
      );
      setActivities(filteredAct);
    } catch (err: any) {
      toast('Bug Not Found', err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBugDetails();
  }, [id]);

  useSocket('bug:updated', (updatedBug) => {
    if (bug && updatedBug._id === bug._id) {
      setBug(updatedBug);
    }
  });

  useSocket('comment:created', (data) => {
    if (bug && (data.bugId === bug._id || data.bugId === bug.bugId)) {
      setComments((prev) => [...prev, data.comment]);
    }
  });

  const handleStatusChange = async (newStatus: BugStatus) => {
    if (!bug) return;
    const oldStatus = bug.status;
    setBug({ ...bug, status: newStatus });
    setShowStatusDropdown(false);

    if (newStatus === 'RESOLVED') {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }

    try {
      await apiRequest(`/bugs/${bug._id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      toast('Status Updated', `Bug status changed to ${newStatus}`, 'success');
      fetchBugDetails();
    } catch (err: any) {
      setBug({ ...bug, status: oldStatus });
      toast('Update Failed', err.message, 'error');
    }
  };

  const handleAssigneeChange = async (assigneeId: string) => {
    if (!bug) return;
    try {
      const updated = await apiRequest<Bug>(`/bugs/${bug._id}`, {
        method: 'PUT',
        body: JSON.stringify({ assignee: assigneeId || null }),
      });
      setBug(updated);
      toast('Assignee Updated', 'Bug assignment updated.', 'success');
    } catch (err: any) {
      toast('Update Failed', err.message, 'error');
    }
  };

  const handleAddComment = async (text: string) => {
    if (!bug) return;
    const newComment = await apiRequest<Comment>(`/comments/bug/${bug._id}`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
    setComments((prev) => [...prev, newComment]);
  };

  const handleDeleteComment = async (commentId: string) => {
    await apiRequest(`/comments/${commentId}`, { method: 'DELETE' });
    setComments((prev) => prev.filter((c) => c._id !== commentId));
  };

  const handleDeleteBug = async () => {
    if (!bug) return;
    if (window.confirm('Are you sure you want to delete this bug report?')) {
      await apiRequest(`/bugs/${bug._id}`, { method: 'DELETE' });
      toast('Bug Removed', 'Bug report has been deleted.', 'info');
      navigate('/bugs');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton height={60} className="w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton height={400} className="lg:col-span-2 rounded-2xl" />
          <Skeleton height={400} className="rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!bug) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold">Bug Report Not Found</h2>
        <Button onClick={() => navigate('/bugs')} className="mt-4">
          Back to Bugs
        </Button>
      </div>
    );
  }

  const statuses: BugStatus[] = ['OPEN', 'IN PROGRESS', 'IN REVIEW', 'TESTING', 'RESOLVED', 'CLOSED'];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/bugs')}
            className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-black text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded-lg border border-brand-500/20">
                {bug.bugId}
              </span>
              <SeverityBadge severity={bug.severity} />
              <StatusBadge status={bug.status} />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
              {bug.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentUser?.role === 'Admin' && (
            <Button variant="danger" size="sm" onClick={handleDeleteBug} leftIcon={<Trash2 className="w-4 h-4" />}>
              Delete Bug
            </Button>
          )}
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Bug Information & Reproduction (4 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm space-y-4">
            <h3 className="font-bold text-base text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
              Description & Summary
            </h3>
            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {bug.description || 'No additional description provided.'}
            </p>

            {bug.labels && bug.labels.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {bug.labels.map((lbl) => (
                  <span
                    key={lbl}
                    className="px-2.5 py-1 text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg"
                  >
                    #{lbl}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm space-y-4">
            <h3 className="font-bold text-base text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
              Steps to Reproduce
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800/40 p-3 rounded-xl border border-gray-200/50 dark:border-gray-700/50 font-mono text-xs text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
              {bug.reproduction?.steps || '1. Open application\n2. Perform action'}
            </div>

            <div className="grid grid-cols-1 gap-3 pt-2">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-1">
                  Expected Behavior
                </span>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                  {bug.reproduction?.expected || 'Expected successful operation.'}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-1">
                  Actual Behavior
                </span>
                <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
                  {bug.reproduction?.actual || 'Observed failure.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Large Visual Screenshot Evidence (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-brand-500" />
                <h3 className="font-bold text-base text-gray-900 dark:text-white">
                  Visual Screenshot Evidence
                </h3>
              </div>
              {bug.screenshotUrl && (
                <button
                  onClick={() => setIsFullscreenImage(true)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
                  title="Fullscreen Lightbox"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {bug.screenshotUrl ? (
              <div
                onClick={() => setIsFullscreenImage(true)}
                className="relative rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden cursor-zoom-in group bg-gray-950 min-h-[250px] flex items-center justify-center"
              >
                <img
                  src={bug.screenshotUrl}
                  alt={bug.title}
                  className="max-h-80 object-contain w-full"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3 py-1.5 rounded-xl bg-white/90 text-gray-900 font-bold text-xs shadow-lg flex items-center gap-1.5">
                    <Maximize2 className="w-4 h-4" /> View Fullscreen Evidence
                  </span>
                </div>
              </div>
            ) : (
              <div className="h-48 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl flex items-center justify-center text-xs text-gray-400">
                No visual screenshot attached
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Status & Environment Metadata (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm space-y-4">
            <h3 className="font-bold text-base text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
              Management Controls
            </h3>

            {/* Interactive Animated Status Dropdown */}
            <div className="relative">
              <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">
                Workflow Status
              </label>
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-brand-500 transition-colors"
              >
                <StatusBadge status={bug.status} />
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {showStatusDropdown && (
                <div className="absolute left-0 mt-2 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl p-2 z-40 animate-fadeIn space-y-1">
                  {statuses.map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(st)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                        bug.status === st ? 'bg-brand-500/10 text-brand-500' : ''
                      }`}
                    >
                      <StatusBadge status={st} size="sm" />
                      {bug.status === st && <CheckCircle2 className="w-4 h-4 text-brand-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Assignee Selector */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">
                Assignee
              </label>
              <select
                value={bug.assignee?._id || ''}
                onChange={(e) => handleAssigneeChange(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold"
              >
                <option value="">Unassigned</option>
                {teamMembers.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name} ({m.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Reporter */}
            {bug.reporter && (
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-1">
                  Reporter
                </span>
                <div className="flex items-center gap-2.5">
                  <Avatar name={bug.reporter.name} src={bug.reporter.avatar} size="xs" />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                      {bug.reporter.name}
                    </h4>
                    <span className="text-[10px] text-gray-400">{bug.reporter.role}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reproduction Context Inspector Banner */}
      <ReproductionContext
        environment={bug.environment}
        reporter={bug.reporter}
        createdAt={bug.createdAt}
      />

      {/* Bottom Section: Discussion Comments & Activity Timeline Tabs */}
      <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm">
        <div className="flex items-center gap-6 border-b border-gray-100 dark:border-gray-800 pb-3 mb-6">
          <button
            onClick={() => setActiveTab('comments')}
            className={`font-bold text-sm transition-colors ${
              activeTab === 'comments'
                ? 'text-brand-600 dark:text-brand-400 border-b-2 border-brand-500 pb-3 -mb-3.5'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
            }`}
          >
            Discussion ({comments.length})
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`font-bold text-sm transition-colors ${
              activeTab === 'activity'
                ? 'text-brand-600 dark:text-brand-400 border-b-2 border-brand-500 pb-3 -mb-3.5'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
            }`}
          >
            Activity Timeline ({activities.length})
          </button>
        </div>

        {activeTab === 'comments' ? (
          <CommentSection
            comments={comments}
            teamMembers={teamMembers}
            onAddComment={handleAddComment}
            onDeleteComment={handleDeleteComment}
          />
        ) : (
          <ActivityTimeline activities={activities} />
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isFullscreenImage && bug.screenshotUrl && (
        <div
          onClick={() => setIsFullscreenImage(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <img
            src={bug.screenshotUrl}
            alt="Fullscreen Evidence"
            className="max-w-full max-h-[92vh] object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
