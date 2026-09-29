import React, { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import { DashboardAnalytics } from '../types';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { BarChart3, TrendingUp, Monitor, ShieldAlert, Users } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<DashboardAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    apiRequest<DashboardAnalytics>('/analytics/dashboard')
      .then((res) => {
        setData(res);
        setIsLoading(false);
      })
      .catch(console.error);
  }, []);

  if (isLoading) {
    return <Skeleton height={500} className="w-full rounded-2xl" />;
  }

  const browserData = [
    { name: 'Chrome', count: 24, fill: '#3b82f6' },
    { name: 'Safari', count: 10, fill: '#8b5cf6' },
    { name: 'Firefox', count: 6, fill: '#f97316' },
    { name: 'Edge', count: 4, fill: '#10b981' },
  ];

  const projectBreakdown = [
    { name: 'BugLens Web (BL)', open: 14, resolved: 22 },
    { name: 'Acme Pay (PAY)', open: 8, resolved: 16 },
    { name: 'DevPulse (DEV)', open: 6, resolved: 12 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-brand-500" />
          Analytics & QA Intelligence
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Deep-dive reports on resolution throughput, browser distributions, and project health.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bugs by Browser */}
        <Card>
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 mb-4">
            <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
              <Monitor className="w-5 h-5 text-sky-500" />
              Bugs Reported by Browser
            </h3>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={browserData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {browserData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Bugs by Project */}
        <Card>
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 mb-4">
            <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-500" />
              Project Bug Status Breakdown
            </h3>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectBreakdown}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="open" fill="#f59e0b" name="Open Bugs" radius={[6, 6, 0, 0]} />
                <Bar dataKey="resolved" fill="#10b981" name="Resolved Bugs" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
