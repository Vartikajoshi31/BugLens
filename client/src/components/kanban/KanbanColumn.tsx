import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Bug, BugStatus } from '../../types';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  id: BugStatus;
  title: string;
  bugs: Bug[];
  color: string;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ id, title, bugs, color }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-w-[280px] max-w-[320px] bg-gray-100/70 dark:bg-gray-900/40 border border-gray-200/80 dark:border-gray-800/80 rounded-2xl p-3 flex flex-col h-[calc(100vh-180px)] transition-colors ${
        isOver ? 'bg-brand-500/10 border-brand-500/40 ring-2 ring-brand-500/20' : ''
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-2 pb-3 mb-2 border-b border-gray-200/60 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
          <h3 className="font-bold text-xs uppercase tracking-wider text-gray-800 dark:text-gray-200">
            {title}
          </h3>
        </div>
        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 shadow-2xs">
          {bugs.length}
        </span>
      </div>

      {/* Column Cards Container */}
      <SortableContext items={bugs.map((b) => b._id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {bugs.length === 0 ? (
            <div className="h-32 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl flex items-center justify-center text-xs text-gray-400 font-medium">
              No bugs
            </div>
          ) : (
            bugs.map((bug) => <KanbanCard key={bug._id} bug={bug} />)
          )}
        </div>
      </SortableContext>
    </div>
  );
};
