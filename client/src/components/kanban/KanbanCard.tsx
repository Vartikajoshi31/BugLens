import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Bug } from '../../types';
import { SeverityBadge } from '../common/SeverityBadge';
import { Avatar } from '../ui/Avatar';
import { Camera, GripVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface KanbanCardProps {
  bug: Bug;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ bug }) => {
  const navigate = useNavigate();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: bug._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3.5 bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all group ${
        isDragging ? 'ring-2 ring-brand-500 shadow-xl z-20' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </button>
          <span
            onClick={() => navigate(`/bugs/${bug.bugId || bug._id}`)}
            className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400 cursor-pointer hover:underline"
          >
            {bug.bugId}
          </span>
        </div>
        <SeverityBadge severity={bug.severity} size="sm" />
      </div>

      <h4
        onClick={() => navigate(`/bugs/${bug.bugId || bug._id}`)}
        className="font-semibold text-xs text-gray-900 dark:text-white line-clamp-2 cursor-pointer hover:text-brand-500 transition-colors mb-3"
      >
        {bug.title}
      </h4>

      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800/80 text-[11px] text-gray-400">
        <div className="flex items-center gap-1.5">
          {bug.screenshotUrl && (
            <span title="Has visual screenshot evidence">
              <Camera className="w-3.5 h-3.5 text-brand-500" />
            </span>
          )}
          <span>{bug.project?.key}</span>
        </div>

        {bug.assignee ? (
          <Avatar name={bug.assignee.name} src={bug.assignee.avatar} size="xs" />
        ) : (
          <span className="text-[10px] italic text-gray-400">Unassigned</span>
        )}
      </div>
    </div>
  );
};
