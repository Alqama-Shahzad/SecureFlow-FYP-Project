import {
  AdminDashboardResponse,
  ProjectManagerDashboardResponse,
  DeveloperDashboardResponse,
  ProjectSummary,
  TaskSummary,
  AuditLog,
  SecurityAlert
} from "../types";

// Helper to simulate API requests with realistic delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const PROJECTS_MOCK: ProjectSummary[] = [
  {
    id: "proj-1",
    name: "Commercial Banking Portal",
    code: "CBP",
    progress: 88,
    status: "active",
    securityCompliance: 99.2,
    lead: "Sarah Jenkins",
    tasksCount: { total: 42, active: 11, completed: 31 },
    lastUpdated: "2026-06-18T03:15:00Z"
  },
  {
    id: "proj-2",
    name: "SWIFT Gateway Reconciler",
    code: "SGR",
    progress: 95,
    status: "active",
    securityCompliance: 100.0,
    lead: "Alex Rivera",
    tasksCount: { total: 28, active: 4, completed: 24 },
    lastUpdated: "2026-06-17T18:30:00Z"
  },
  {
    id: "proj-3",
    name: "Fedwire Payment Liquidity Engine",
    code: "FPLE",
    progress: 45,
    status: "active",
    securityCompliance: 96.8,
    lead: "Marcus Vane",
    tasksCount: { total: 60, active: 28, completed: 32 },
    lastUpdated: "2026-06-18T02:00:00Z"
  },
  {
    id: "proj-4",
    name: "Retail Card Ledger Integration",
    code: "RCLI",
    progress: 100,
    status: "completed",
    securityCompliance: 98.4,
    lead: "Helena Wu",
    tasksCount: { total: 35, active: 0, completed: 35 },
    lastUpdated: "2026-06-15T11:45:00Z"
  },
  {
    id: "proj-5",
    name: "Corporate Audit Log Vault",
    code: "CALV",
    progress: 20,
    status: "on-hold",
    securityCompliance: 95.0,
    lead: "Dmitry Vance",
    tasksCount: { total: 12, active: 8, completed: 4 },
    lastUpdated: "2026-06-10T14:40:00Z"
  }
];

const TASKS_MOCK: TaskSummary[] = [
  {
    id: "task-101",
    title: "Enforce JWT signing algorithm HS512 with rotation hook",
    projectCode: "SGR",
    assignedTo: "Kaelen Mercer",
    priority: "critical",
    status: "in-review",
    dueDate: "2026-06-20T17:00:00Z",
    commentsCount: 4
  },
  {
    id: "task-102",
    title: "Remediate open CVE-2025-4921 in core Spring framework dependencies",
    projectCode: "CBP",
    assignedTo: "Kaelen Mercer",
    priority: "high",
    status: "in-progress",
    dueDate: "2026-06-19T12:00:00Z",
    commentsCount: 2
  },
  {
    id: "task-103",
    title: "Implement TLS 1.3 handshake strict compliance cipher profiles",
    projectCode: "CBP",
    assignedTo: "Liam Henderson",
    priority: "critical",
    status: "done",
    dueDate: "2026-06-16T18:00:00Z",
    commentsCount: 5
  },
  {
    id: "task-104",
    title: "Sanitize SQL parameters across ledger history reporting handlers",
    projectCode: "CALV",
    assignedTo: "Liam Henderson",
    priority: "high",
    status: "in-progress",
    dueDate: "2026-06-22T17:00:00Z",
    commentsCount: 1
  },
  {
    id: "task-105",
    title: "Validate Fedwire ledger consistency check hash algorithms",
    projectCode: "FPLE",
    assignedTo: "Elena Petrova",
    priority: "high",
    status: "in-progress",
    dueDate: "2026-06-24T18:00:00Z",
    commentsCount: 0
  },
  {
    id: "task-106",
    title: "Review encryption-at-rest keys rotation intervals for SWIFT cache",
    projectCode: "SGR",
    assignedTo: "Kaelen Mercer",
    priority: "medium",
    status: "backlog",
    dueDate: "2026-06-25T17:00:00Z",
    commentsCount: 3
  },
  {
    id: "task-107",
    title: "Audit database schema mapping attributes for PII encryption",
    projectCode: "RCLI",
    assignedTo: "Elena Petrova",
    priority: "critical",
    status: "done",
    dueDate: "2026-06-14T17:00:00Z",
    commentsCount: 8
  }
];

const AUDIT_LOGS_MOCK: AuditLog[] = [
  {
    id: "aud-401",
    timestamp: "2026-06-18T04:12:15Z",
    userId: "usr-admin",
    userEmail: "admin@secureflow.app",
    role: "Admin",
    action: "KEYS_ROTATED",
    resource: "/api/v1/crypto/vault-keys",
    ipAddress: "10.140.22.84",
    status: "success"
  },
  {
    id: "aud-402",
    timestamp: "2026-06-18T03:55:40Z",
    userId: "usr-pm-1",
    userEmail: "pm@secureflow.app",
    role: "Project Manager",
    action: "TASK_ASSIGNED",
    resource: "task-101",
    ipAddress: "192.168.4.15",
    status: "success"
  },
  {
    id: "aud-403",
    timestamp: "2026-06-18T02:44:02Z",
    userId: "usr-dev-1",
    userEmail: "dev@secureflow.app",
    role: "Developer",
    action: "CODE_SUBMITTED",
    resource: "PR #242 - CBP",
    ipAddress: "192.168.10.11",
    status: "success"
  },
  {
    id: "aud-404",
    timestamp: "2026-06-18T01:30:11Z",
    userId: "usr-anon-attacker",
    userEmail: "anonymous@untrusted.xyz",
    role: "Guest",
    action: "UNAUTHORIZED_ADMIN_GET",
    resource: "/api/v1/auth/admin-config",
    ipAddress: "185.220.101.44",
    status: "failed"
  },
  {
    id: "aud-405",
    timestamp: "2026-06-17T21:10:00Z",
    userId: "usr-admin",
    userEmail: "admin@secureflow.app",
    role: "Admin",
    action: "FIREWALL_POLICY_MODIFIED",
    resource: "Network Policy Hub // Port 3000 Restrictions",
    ipAddress: "10.140.22.84",
    status: "success"
  }
];

const SECURITY_ALERTS_MOCK: SecurityAlert[] = [
  {
    id: "alr-301",
    severity: "critical",
    message: "SQL Injection vector registered from external IP 185.220.101.44 on web gateway handler",
    source: "IPS_WAF_04",
    timestamp: "2026-06-18T04:05:00Z",
    status: "investigating"
  },
  {
    id: "alr-302",
    severity: "high",
    message: "Outdated library CVE-2025-4921 active check in commercial backend dependencies",
    source: "OWASP_SCAN_DEMON",
    timestamp: "2026-06-18T02:22:00Z",
    status: "active"
  },
  {
    id: "alr-303",
    severity: "medium",
    message: "High API call intensity - rate limit buffer triggered for consumer 192.168.10.11",
    source: "API_GATEWAY_THROTTLE",
    timestamp: "2026-06-17T23:45:00Z",
    status: "mitigated"
  },
  {
    id: "alr-304",
    severity: "low",
    message: "SSL Certificate verification deadline approaching (22 days remaining)",
    source: "SSL_EXPIRE_DAEMON",
    timestamp: "2026-06-16T12:00:00Z",
    status: "active"
  }
];

export const dashboardService = {
  getAdminDashboard: async (): Promise<AdminDashboardResponse> => {
    await delay(1000); // realistic latency
    return {
      kpis: {
        totalUsers: 84,
        totalProjects: 5,
        activeTasks: 18,
        securityComplianceScore: 98.4,
        idsAlertsCount: 4,
        systemUptime: "99.98%"
      },
      // Threat metrics
      threatTrends: [
        { time: "00:00", blockCount: 12, scanCount: 120 },
        { time: "04:00", blockCount: 18, scanCount: 145 },
        { time: "08:00", blockCount: 8, scanCount: 110 },
        { time: "12:00", blockCount: 34, scanCount: 220 },
        { time: "16:00", blockCount: 15, scanCount: 180 },
        { time: "20:00", blockCount: 45, scanCount: 240 },
        { time: "24:00", blockCount: 22, scanCount: 195 }
      ],
      userActivityTrends: [
        { date: "Mon", activeCount: 64 },
        { date: "Tue", activeCount: 78 },
        { date: "Wed", activeCount: 72 },
        { date: "Thu", activeCount: 84 },
        { date: "Fri", activeCount: 80 },
        { date: "Sat", activeCount: 32 },
        { date: "Sun", activeCount: 45 }
      ],
      projectDistribution: [
        { name: "Banking Portal (CBP)", value: 40 },
        { name: "SWIFT Gateway (SGR)", value: 25 },
        { name: "Liquidity (FPLE)", value: 20 },
        { name: "Audit Vault (CALV)", value: 15 }
      ],
      recentAuditLogs: AUDIT_LOGS_MOCK,
      recentSecurityAlerts: SECURITY_ALERTS_MOCK,
      allProjects: PROJECTS_MOCK,
      allTasks: TASKS_MOCK,
      systemHealth: {
        apiGateway: "healthy",
        authService: "healthy",
        idsEngine: "healthy",
        databasePostgre: "healthy"
      }
    };
  },

  getProjectManagerDashboard: async (): Promise<ProjectManagerDashboardResponse> => {
    await delay(900);
    return {
      kpis: {
        assignedProjects: 3,
        teamMembers: 14,
        activeTasks: 12,
        upcomingDeadlines: 4
      },
      projectProgress: [
        { project: "Banking Portal (CBP)", progress: 88, compliance: 99.2 },
        { project: "SWIFT Gateway (SGR)", progress: 95, compliance: 100 },
        { project: "Liquidity Engine (FPLE)", progress: 45, compliance: 96.8 }
      ],
      teamPerformance: [
        { name: "Kaelen Mercer", completedTasks: 18, reviewTasks: 3 },
        { name: "Liam Henderson", completedTasks: 21, reviewTasks: 1 },
        { name: "Elena Petrova", completedTasks: 12, reviewTasks: 4 },
        { name: "Sarah Jenkins", completedTasks: 9, reviewTasks: 0 }
      ],
      activityFeed: [
        { id: "act-1", userId: "usr-dev-1", userEmail: "dev@secureflow.app", avatarText: "KM", description: "pushed security commit to CBP v1.2", timestamp: "2026-06-18T04:15:00Z" },
        { id: "act-2", userId: "usr-pm-1", userEmail: "pm@secureflow.app", avatarText: "SJ", description: "updated project CBI milestones to v2.0", timestamp: "2026-06-18T03:30:00Z" },
        { id: "act-3", userId: "usr-dev-2", userEmail: "elena@secureflow.app", avatarText: "EP", description: "updated task validation algorithms done in FPLE", timestamp: "2026-06-17T18:10:00Z" }
      ],
      projectsList: PROJECTS_MOCK.filter(p => ["proj-1", "proj-2", "proj-3"].includes(p.id)),
      deadlinesList: [
        { taskId: "task-102", title: "Remediate Spring Security CVE-2025-4921", projectCode: "CBP", dueDate: "2026-06-19T12:00:00Z" },
        { taskId: "task-101", title: "Enforce JWT signature rotational cryptograms", projectCode: "SGR", dueDate: "2026-06-20T17:00:00Z" },
        { taskId: "task-104", title: "SQL Parameter Sanitization", projectCode: "CALV", dueDate: "2026-06-22T17:00:00Z" }
      ],
      reportsSummary: [
        { id: "rep-1", title: "Q3 SOC-2 Security Compliance Audit Projections", generatedOn: "2026-06-18T01:00:00Z", scope: "Audit & Cyber Security" },
        { id: "rep-2", title: "Fedwire Integration Pipeline Performance Index", generatedOn: "2026-06-16T15:00:00Z", scope: "Developer Operations" },
        { id: "rep-3", title: "Monthly Open Source Snyk Dependency Audit Report", generatedOn: "2026-06-10T09:00:00Z", scope: "Supply Chain Risk" }
      ]
    };
  },

  getDeveloperDashboard: async (): Promise<DeveloperDashboardResponse> => {
    await delay(800);
    return {
      kpis: {
        myTasks: 4,
        completedTasks: 18,
        pendingReviews: 1,
        upcomingDeadlines: 2
      },
      myTasksList: TASKS_MOCK.filter(t => t.assignedTo === "Kaelen Mercer"),
      weeklyProductivity: [
        { day: "Mon", completed: 3, reviewed: 1 },
        { day: "Tue", completed: 4, reviewed: 0 },
        { day: "Wed", completed: 2, reviewed: 3 },
        { day: "Thu", completed: 5, reviewed: 2 },
        { day: "Fri", completed: 1, reviewed: 0 },
        { day: "Sat", completed: 0, reviewed: 0 },
        { day: "Sun", completed: 3, reviewed: 1 }
      ],
      recentComments: [
        { id: "com-1", taskId: "task-101", taskTitle: "Enforce JWT signing algorithm HS512 with rotation hook", author: "Sarah Jenkins (PM)", content: "Please verify if the rotation triggers an automatic session termination or transparent token exchange.", timestamp: "2026-06-18T04:10:00Z" },
        { id: "com-2", taskId: "task-102", taskTitle: "Remediate CVE-2025-4921 active check in dependencies", author: "Marcus Vane (WAF Lead)", content: "We should map this dependency update against the current regression test suites to bypass portal down times.", timestamp: "2026-06-17T15:33:00Z" }
      ],
      activityFeed: [
        { id: "act-400", userId: "usr-dev-1", userEmail: "dev@secureflow.app", avatarText: "KM", description: "completed secure review for SWIFT module ciphers", timestamp: "2026-06-18T02:00:00Z" },
        { id: "act-401", userId: "usr-dev-1", userEmail: "dev@secureflow.app", avatarText: "KM", description: "pushed branch hotfix/auth-leak-prevention to CBP", timestamp: "2026-06-17T17:12:00Z" }
      ]
    };
  }
};
