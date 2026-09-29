import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bug } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { SeverityBadge } from '../common/SeverityBadge';
import { Avatar } from '../ui/Avatar';
import { Card } from '../ui/Card';
import { Monitor, Paperclip } from 'lucide-react';

interface BugCardProps {
  bug: Bug;
}

export const BugCard: React.FC<BugCardProps> = ({ bug }) => {
  const navigate = useNavigate();

  return (
    <Card
      hoverEffect
      onClick={() => navigate(`/bugs/${bug.bugId || bug._id}`)}
      className="cursor-pointer flex flex-col justify-between h-full"
    >
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
            {bug.bugId}
          </span>
          <div className="flex items-center gap-1.5">
            <SeverityBadge severity={bug.severity} size="sm" />
            <StatusBadge status={bug.status} size="sm" />
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-2 mb-1.5 hover:text-brand-500 transition-colors">
          {bug.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
          {bug.description || bug.reproduction?.steps || 'No description provided.'}
        </p>

        {/* Labels */}
        {bug.labels && bug.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {bug.labels.slice(0, 3).map((lbl) => (
              <span
                key={lbl}
                className="px-2 py-0.5 text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md"
              >
                #{lbl}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          {bug.environment?.browser && (
            <span className="flex items-center gap-1 text-[11px]" title={bug.environment.browser}>
              <Monitor className="w-3.5 h-3.5 text-gray-400" />
              <span className="truncate max-w-[100px]">{bug.environment.browser.split(' ')[0]}</span>
            </span>
          )}
          {bug.screenshotUrl && (
            <span title="Has Visual Screenshot Evidence">
              <Paperclip className="w-3.5 h-3.5 text-brand-500" />
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {bug.assignee ? (
            <Avatar name={bug.assignee.name} src={bug.assignee.avatar} size="xs" />
          ) : (
            <span className="text-[10px] italic text-gray-400">Unassigned</span>
          )}
        </div>
      </div>
    </Card>
  );
};
