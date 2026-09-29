import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  Bug as BugIcon,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  Activity as ActivityIcon,
  PlusCircle,
  Users,
  ShieldAlert,
} from 'lucide-react';
import { apiRequest } from '../services/api';
import { DashboardAnalytics } from '../types';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { StatusBadge } from '../components/common/StatusBadge';
import { SeverityBadge } from '../components/common/SeverityBadge';
import { useSocket } from '../hooks/useSocket';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const fetchDashboard = async () => {
    try {
      const res = await apiRequest<DashboardAnalytics>('/analytics/dashboard');
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Listen to Socket.IO real-time bug & comment updates to auto-refresh metrics!
  useSocket('bug:created', fetchDashboard);
  useSocket('bug:updated', fetchDashboard);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton height={120} className="w-full rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} height={100} className="rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton height={300} className="rounded-2xl" />
          <Skeleton height={300} className="rounded-2xl" />
        </div>
      </div>
    );
  }

  const metrics = data?.metrics;
  const charts = data?.charts;

  const statCards = [
    {
      title: 'Total Bugs',
      value: metrics?.totalBugs || 0,
      sub: `${metrics?.createdThisWeek || 0} created this week`,
      icon: <BugIcon className="w-5 h-5 text-brand-500" />,
      color: 'bg-brand-500/10 border-brand-500/20 text-brand-600 dark:text-brand-400',
    },
    {
      title: 'Open / In Progress',
      value: (metrics?.openBugs || 0) + (metrics?.inProgress || 0),
      sub: `${metrics?.inProgress || 0} active in dev`,
      icon: <ActivityIcon className="w-5 h-5 text-amber-500" />,
      color: 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400',
    },
    {
      title: 'Critical Bugs',
      value: metrics?.criticalBugs || 0,
      sub: 'Requires urgent patch',
      icon: <ShieldAlert className="w-5 h-5 text-rose-500" />,
      color: 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400',
    },
    {
      title: 'Avg Resolution Time',
      value: `${metrics?.avgResolutionHours || 18}h`,
      sub: `${metrics?.resolvedThisWeek || 0} resolved this week`,
      icon: <Clock className="w-5 h-5 text-emerald-500" />,
      color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-brand-500/15">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">QA Command Center</h1>
          <p className="text-xs sm:text-sm text-brand-100 mt-1">
            Real-time visual bug tracking, resolution velocity, and developer workload metrics.
          </p>
        </div>
        <Button
          onClick={() => navigate('/bugs/new')}
          leftIcon={<PlusCircle className="w-4 h-4" />}
          className="bg-white text-brand-700 hover:bg-brand-50 border-none shadow-lg shrink-0"
        >
          Report Visual Bug
        </Button>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
          >
            <Card hoverEffect className="flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {card.title}
                </span>
                <div className={`p-2 rounded-xl border ${card.color}`}>{card.icon}</div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                  {card.value}
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{card.sub}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bugs Trend Area Chart */}
        <Card className="lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
            <div>
              <h3 className="font-bold text-base text-gray-900 dark:text-white">
                Bug Creation vs Resolution Trend
              </h3>
              <p className="text-xs text-gray-500">Weekly velocity comparison across active projects</p>
            </div>
            <TrendingUp className="w-5 h-5 text-brand-500" />
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts?.bugsOverTime || []}>
                <defs>
                  <linearGradient id="createdGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="resolvedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="created" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#createdGrad)" name="Created" />
                <Area type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#resolvedGrad)" name="Resolved" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Severity Breakdown Donut Chart */}
        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
            <div>
              <h3 className="font-bold text-base text-gray-900 dark:text-white">Bugs by Severity</h3>
              <p className="text-xs text-gray-500">Distribution of critical issues</p>
            </div>
            <ShieldAlert className="w-5 h-5 text-rose-500" />
          </div>

          <div className="h-56 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts?.bySeverity || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(charts?.bySeverity || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
            {(charts?.bySeverity || []).map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-gray-600 dark:text-gray-400">{item.name}:</span>
                <span className="font-bold text-gray-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Grid: Team Workload & Live Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Workload Progress */}
        <Card className="lg:col-span-1">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-500" />
              <h3 className="font-bold text-base text-gray-900 dark:text-white">Team Workload</h3>
            </div>
          </div>

          <div className="space-y-4">
            {(charts?.developerWorkload || []).map((dev) => (
              <div key={dev._id} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={dev.name} src={dev.avatar} size="xs" />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white">{dev.name}</h4>
                      <span className="text-[10px] text-gray-400">{dev.role}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                    {dev.activeBugs} Active
                  </span>
                </div>

                {/* Progress Meter */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-brand-500 to-indigo-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(dev.activeBugs * 15 + 10, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Live Activity Feed */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 mb-4">
            <div className="flex items-center gap-2">
              <ActivityIcon className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold text-base text-gray-900 dark:text-white">Recent Team Activity</h3>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-mono text-[10px] font-bold">
              LIVE STREAM
            </span>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {(data?.recentActivity || []).map((act) => (
              <div
                key={act._id}
                onClick={() => act.bug && navigate(`/bugs/${act.bug.bugId || act.bug._id}`)}
                className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between gap-3 hover:bg-gray-100 dark:hover:bg-gray-800/80 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={act.actor?.name || 'User'} src={act.actor?.avatar} size="xs" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                      {act.actor?.name}{' '}
                      <span className="font-normal text-gray-500 dark:text-gray-400">{act.action}</span>
                    </p>
                    {act.bug && (
                      <span className="text-[11px] font-mono text-brand-600 dark:text-brand-400 font-bold truncate block">
                        {act.bug.bugId}: {act.bug.title}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 shrink-0">
                  {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
