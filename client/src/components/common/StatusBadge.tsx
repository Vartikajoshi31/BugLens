import React from 'react';
import { BugStatus } from '../../types';
import { Badge } from '../ui/Badge';

interface StatusBadgeProps {
  status: BugStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const configs: Record<BugStatus, { variant: 'default' | 'primary' | 'warning' | 'purple' | 'success' | 'info'; label: string }> = {
    OPEN: { variant: 'warning', label: 'Open' },
    'IN PROGRESS': { variant: 'primary', label: 'In Progress' },
    'IN REVIEW': { variant: 'purple', label: 'In Review' },
    TESTING: { variant: 'info', label: 'Testing' },
    RESOLVED: { variant: 'success', label: 'Resolved' },
    CLOSED: { variant: 'default', label: 'Closed' },
  };

  const config = configs[status] || { variant: 'default', label: status };

  return (
    <Badge variant={config.variant} size={size}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {config.label}
    </Badge>
  );
};
