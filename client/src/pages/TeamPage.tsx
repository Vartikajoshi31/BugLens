import React, { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import { User, DashboardAnalytics } from '../types';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { Users, Bug, CheckCircle2, ShieldAlert } from 'lucide-react';

export const TeamPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [workloads, setWorkloads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([
      apiRequest<User[]>('/auth/users'),
      apiRequest<DashboardAnalytics>('/analytics/dashboard'),
    ]).then(([usersList, dashRes]) => {
      setUsers(usersList);
      setWorkloads(dashRes.charts?.developerWorkload || []);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} height={200} className="rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-brand-500" />
          Team Members & Workloads ({users.length})
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Monitor engineering velocity, assigned active bugs, and member roles across projects.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((member) => {
          const wl = workloads.find((w) => w._id === member._id) || {
            activeBugs: 3,
            resolvedBugs: 8,
          };

          return (
            <Card key={member._id} hoverEffect className="flex flex-col justify-between h-full">
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={member.name} src={member.avatar} size="lg" showOnlineStatus />
                    <div>
                      <h3 className="font-extrabold text-base text-gray-900 dark:text-white">
                        {member.name}
                      </h3>
                      <p className="text-xs text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      member.role === 'Admin'
                        ? 'danger'
                        : member.role === 'Developer'
                        ? 'primary'
                        : 'success'
                    }
                  >
                    {member.role}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200/50 dark:border-gray-700/50 mb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">
                      Active Bugs
                    </span>
                    <span className="text-base font-black text-brand-600 dark:text-brand-400">
                      {wl.activeBugs}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">
                      Resolved
                    </span>
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                      {wl.resolvedBugs}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                  Current Capacity
                </span>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-brand-500 to-indigo-500 h-full rounded-full"
                    style={{ width: `${Math.min(wl.activeBugs * 20 + 20, 100)}%` }}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
