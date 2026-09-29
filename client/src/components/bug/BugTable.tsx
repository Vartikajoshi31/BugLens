import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bug } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { SeverityBadge } from '../common/SeverityBadge';
import { Avatar } from '../ui/Avatar';
import { Camera } from 'lucide-react';

interface BugTableProps {
  bugs: Bug[];
}

export const BugTable: React.FC<BugTableProps> = ({ bugs }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/40 text-gray-500 font-semibold tracking-wider uppercase">
            <th className="py-3.5 px-4">Bug ID</th>
            <th className="py-3.5 px-4">Title & Evidence</th>
            <th className="py-3.5 px-4">Severity</th>
            <th className="py-3.5 px-4">Status</th>
            <th className="py-3.5 px-4">Assignee</th>
            <th className="py-3.5 px-4">Reporter</th>
            <th className="py-3.5 px-4">Updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {bugs.map((bug) => (
            <tr
              key={bug._id}
              onClick={() => navigate(`/bugs/${bug.bugId || bug._id}`)}
              className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors group"
            >
              <td className="py-3 px-4 font-mono font-bold text-brand-600 dark:text-brand-400">
                {bug.bugId}
              </td>
              <td className="py-3 px-4 max-w-xs">
                <div className="flex items-center gap-2">
                  {bug.screenshotUrl && (
                    <span title="Annotated Screenshot Attached">
                      <Camera className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                    </span>
                  )}
                  <span className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-brand-500 transition-colors">
                    {bug.title}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4">
                <SeverityBadge severity={bug.severity} size="sm" />
              </td>
              <td className="py-3 px-4">
                <StatusBadge status={bug.status} size="sm" />
              </td>
              <td className="py-3 px-4">
                {bug.assignee ? (
                  <div className="flex items-center gap-2">
                    <Avatar name={bug.assignee.name} src={bug.assignee.avatar} size="xs" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium truncate max-w-[100px]">
                      {bug.assignee.name}
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-400 italic">Unassigned</span>
                )}
              </td>
              <td className="py-3 px-4">
                {bug.reporter && (
                  <div className="flex items-center gap-2">
                    <Avatar name={bug.reporter.name} src={bug.reporter.avatar} size="xs" />
                    <span className="text-gray-600 dark:text-gray-400 truncate max-w-[100px]">
                      {bug.reporter.name}
                    </span>
                  </div>
                )}
              </td>
              <td className="py-3 px-4 text-gray-400">
                {new Date(bug.updatedAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
