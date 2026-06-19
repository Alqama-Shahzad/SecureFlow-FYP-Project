export interface StatsCardData {
  id: string;
  label: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  iconName: string;
}

export interface SecurityAlert {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  message: string;
  source: string;
  timestamp: string;
  status: "active" | "mitigated" | "investigating";
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userEmail: string;
  role: string;
  action: string;
  resource: string;
  ipAddress: string;
  status: "success" | "failed";
}

export interface ProjectSummary {
  id: string;
  name: string;
  code: string;
  progress: number;
  status: "active" | "completed" | "on-hold" | "delayed";
  securityCompliance: number; // e.g. 98.4
  lead: string;
  tasksCount: { total: number; active: number; completed: number };
  lastUpdated: string;
}

export interface TaskSummary {
  id: string;
  title: string;
  projectCode: string;
  assignedTo: string;
  priority: "critical" | "high" | "medium" | "low";
  status: "backlog" | "in-progress" | "in-review" | "done";
  dueDate: string;
  commentsCount: number;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: "security" | "project" | "system" | "task";
}

export interface Activity {
  id: string;
  userId: string;
  userEmail: string;
  avatarText: string;
  description: string;
  timestamp: string;
}

// Responses for dashboard endpoints (mock/real api contracts)
export interface AdminDashboardResponse {
  kpis: {
    totalUsers: number;
    totalProjects: number;
    activeTasks: number;
    securityComplianceScore: number;
    idsAlertsCount: number;
    systemUptime: string;
  };
  threatTrends: Array<{ time: string; blockCount: number; scanCount: number }>;
  userActivityTrends: Array<{ date: string; activeCount: number }>;
  projectDistribution: Array<{ name: string; value: number }>;
  recentAuditLogs: AuditLog[];
  recentSecurityAlerts: SecurityAlert[];
  allProjects: ProjectSummary[];
  allTasks: TaskSummary[];
  systemHealth: {
    apiGateway: "healthy" | "degraded" | "failed";
    authService: "healthy" | "degraded" | "failed";
    idsEngine: "healthy" | "degraded" | "failed";
    databasePostgre: "healthy" | "degraded" | "failed";
  };
}

export interface ProjectManagerDashboardResponse {
  kpis: {
    assignedProjects: number;
    teamMembers: number;
    activeTasks: number;
    upcomingDeadlines: number;
  };
  projectProgress: Array<{ project: string; progress: number; compliance: number }>;
  teamPerformance: Array<{ name: string; completedTasks: number; reviewTasks: number }>;
  activityFeed: Activity[];
  projectsList: ProjectSummary[];
  deadlinesList: Array<{ taskId: string; title: string; projectCode: string; dueDate: string }>;
  reportsSummary: Array<{ id: string; title: string; generatedOn: string; scope: string }>;
}

export interface DeveloperDashboardResponse {
  kpis: {
    myTasks: number;
    completedTasks: number;
    pendingReviews: number;
    upcomingDeadlines: number;
  };
  myTasksList: TaskSummary[];
  weeklyProductivity: Array<{ day: string; completed: number; reviewed: number }>;
  recentComments: Array<{ id: string; taskId: string; taskTitle: string; author: string; content: string; timestamp: string }>;
  activityFeed: Activity[];
}
