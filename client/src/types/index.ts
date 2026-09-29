export type UserRole = 'Admin' | 'Developer' | 'QA Tester';

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export type BugSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type BugPriority = 'URGENT' | 'HIGH' | 'NORMAL' | 'LOW';
export type BugStatus = 'OPEN' | 'IN PROGRESS' | 'IN REVIEW' | 'TESTING' | 'RESOLVED' | 'CLOSED';

export interface EnvironmentInfo {
  browser: string;
  os: string;
  device: string;
  resolution: string;
  url: string;
}

export interface ReproductionSteps {
  steps: string;
  expected: string;
  actual: string;
}

export interface Attachment {
  name: string;
  url: string;
  size?: number;
}

export interface Bug {
  _id: string;
  bugId: string;
  title: string;
  description: string;
  severity: BugSeverity;
  priority: BugPriority;
  status: BugStatus;
  reporter: User;
  assignee?: User | null;
  project: { _id: string; name: string; key: string };
  labels: string[];
  environment: EnvironmentInfo;
  reproduction: ReproductionSteps;
  screenshotUrl: string;
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  name: string;
  key: string;
  description: string;
  owner: User;
  members: User[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  bug: string;
  author: User;
  text: string;
  mentions: User[];
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  _id: string;
  bug: { _id: string; bugId: string; title: string; severity: BugSeverity; status: BugStatus };
  project?: string;
  actor: User;
  action: string;
  details?: any;
  createdAt: string;
}

export interface NotificationItem {
  _id: string;
  recipient: string;
  actor: User;
  type: 'BUG_ASSIGNED' | 'MENTION' | 'COMMENT' | 'STATUS_CHANGE' | 'BUG_RESOLVED' | 'BUG_REOPENED';
  bug: { _id: string; bugId: string; title: string };
  read: boolean;
  message?: string;
  createdAt: string;
}

export interface DashboardMetrics {
  totalBugs: number;
  openBugs: number;
  inProgress: number;
  inTesting: number;
  resolved: number;
  criticalBugs: number;
  avgResolutionHours: number;
  createdThisWeek: number;
  resolvedThisWeek: number;
}

export interface DashboardAnalytics {
  metrics: DashboardMetrics;
  charts: {
    bySeverity: { name: string; value: number; color: string }[];
    byStatus: { _id: string; count: number }[];
    bugsOverTime: { date: string; created: number; resolved: number }[];
    developerWorkload: {
      _id: string;
      name: string;
      avatar: string;
      role: UserRole;
      activeBugs: number;
      resolvedBugs: number;
    }[];
  };
  recentActivity: Activity[];
}
