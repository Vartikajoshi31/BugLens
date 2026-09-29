import React from 'react';
import { Activity } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Clock, Activity as ActivityIcon } from 'lucide-react';

interface ActivityTimelineProps {
  activities: Activity[];
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities }) => {
  if (activities.length === 0) {
    return <p className="text-xs text-gray-500 py-4 italic">No activity logged yet.</p>;
  }

  return (
    <div className="space-y-4 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-800">
      {activities.map((act) => (
        <div key={act._id} className="relative flex items-start gap-4 pl-1">
          <div className="relative z-10">
            <Avatar name={act.actor?.name || 'System'} src={act.actor?.avatar} size="xs" />
          </div>

          <div className="flex-1 min-w-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-3 rounded-xl shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-gray-800 dark:text-gray-200">
                <span className="font-bold text-gray-900 dark:text-white">{act.actor?.name || 'System'}</span>{' '}
                <span className="text-gray-600 dark:text-gray-400">{act.action}</span>
              </p>
              <span className="text-[10px] text-gray-400 shrink-0">
                {new Date(act.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
