import React from 'react';
import { BugSeverity } from '../../types';
import { Badge } from '../ui/Badge';
import { AlertOctagon, AlertTriangle, ArrowDown, ShieldAlert } from 'lucide-react';

interface SeverityBadgeProps {
  severity: BugSeverity;
  size?: 'sm' | 'md';
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, size = 'md' }) => {
  const configs: Record<
    BugSeverity,
    { variant: 'danger' | 'warning' | 'primary' | 'info'; label: string; icon: React.ReactNode }
  > = {
    CRITICAL: {
      variant: 'danger',
      label: 'Critical',
      icon: <AlertOctagon className="w-3 h-3 mr-1 animate-pulse" />,
    },
    HIGH: {
      variant: 'warning',
      label: 'High',
      icon: <AlertTriangle className="w-3 h-3 mr-1" />,
    },
    MEDIUM: {
      variant: 'primary',
      label: 'Medium',
      icon: <ShieldAlert className="w-3 h-3 mr-1" />,
    },
    LOW: {
      variant: 'info',
      label: 'Low',
      icon: <ArrowDown className="w-3 h-3 mr-1" />,
    },
  };

  const config = configs[severity] || { variant: 'info', label: severity, icon: null };

  return (
    <Badge variant={config.variant} size={size}>
      {config.icon}
      {config.label}
    </Badge>
  );
};
