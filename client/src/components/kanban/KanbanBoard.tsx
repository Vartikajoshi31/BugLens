import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import confetti from 'canvas-confetti';
import { Bug, BugStatus } from '../../types';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';

interface KanbanBoardProps {
  bugs: Bug[];
  onMoveBug: (bugId: string, newStatus: BugStatus) => Promise<void>;
}

const COLUMNS: { id: BugStatus; title: string; color: string }[] = [
  { id: 'OPEN', title: 'Open', color: 'bg-amber-500' },
  { id: 'IN PROGRESS', title: 'In Progress', color: 'bg-brand-500' },
  { id: 'IN REVIEW', title: 'In Review', color: 'bg-purple-500' },
  { id: 'TESTING', title: 'Testing', color: 'bg-sky-500' },
  { id: 'RESOLVED', title: 'Resolved', color: 'bg-emerald-500' },
  { id: 'CLOSED', title: 'Closed', color: 'bg-gray-400' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ bugs: initialBugs, onMoveBug }) => {
  const [bugs, setBugs] = useState<Bug[]>(initialBugs);
  const [activeBug, setActiveBug] = useState<Bug | null>(null);

  useEffect(() => {
    setBugs(initialBugs);
  }, [initialBugs]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const found = bugs.find((b) => b._id === active.id);
    if (found) setActiveBug(found);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveBug(null);

    if (!over) return;

    const bugId = active.id as string;
    const overId = over.id as string;

    const bugToMove = bugs.find((b) => b._id === bugId);
    if (!bugToMove) return;

    // Determine target column
    let newStatus: BugStatus | null = null;

    if (COLUMNS.some((col) => col.id === overId)) {
      newStatus = overId as BugStatus;
    } else {
      const overBug = bugs.find((b) => b._id === overId);
      if (overBug) newStatus = overBug.status;
    }

    if (newStatus && newStatus !== bugToMove.status) {
      // Optimistic UI update
      setBugs((prev) =>
        prev.map((b) => (b._id === bugId ? { ...b, status: newStatus! } : b))
      );

      // Trigger celebratory confetti if moving to RESOLVED
      if (newStatus === 'RESOLVED') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      try {
        await onMoveBug(bugId, newStatus);
      } catch (err) {
        // Revert on error
        setBugs(initialBugs);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-6">
        {COLUMNS.map((col) => {
          const colBugs = bugs.filter((b) => b.status === col.id);
          return (
            <KanbanColumn
              key={col.id}
              id={col.id}
              title={col.title}
              bugs={colBugs}
              color={col.color}
            />
          );
        })}
      </div>

      <DragOverlay>
        {activeBug ? <KanbanCard bug={activeBug} /> : null}
      </DragOverlay>
    </DndContext>
  );
};
