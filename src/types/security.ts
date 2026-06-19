export interface SecurityEvent {
  id: string;
  timestamp: string;
  attackType: "Brute Force" | "SQL Injection" | "Rate Limit Violation" | "Suspicious Request";
  sourceIP: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  status: "New" | "Investigating" | "Resolved" | "Ignored";
  responseAction: string;
  endpoint: string;
  userAgent?: string;
  payload?: string;
  country?: string;
}

export interface ThreatSummary {
  bruteForce: {
    failedLogins: number;
    blockedAttempts: number;
    affectedAccounts: number;
    trend: number; // positive/negative change percentage
  };
  sqlInjection: {
    attackCount: number;
    affectedEndpoints: number;
    severity: "High" | "Critical";
    topPatterns: string[];
  };
  rateLimit: {
    requestsBlocked: number;
    affectedIPs: number;
    topSources: string[];
  };
  recentTimeline: SecurityEvent[];
  stats: {
    bruteForceAttempts: number;
    sqlInjectionAttempts: number;
    rateLimitViolations: number;
    suspiciousRequests: number;
    blockedIPs: number;
    threatScore: number;
  };
}

export interface Alert {
  id: string;
  attackType: "Brute Force" | "SQL Injection" | "Rate Limit Violation" | "Suspicious Request" | "Privilege Escalation" | "Anomalous Access";
  severity: "Low" | "Medium" | "High" | "Critical";
  sourceIP: string;
  detectedAt: string;
  status: "New" | "Investigating" | "Resolved" | "Ignored";
  responseAction: string;
  targetEndpoint: string;
}

export interface AlertDetails extends Alert {
  country: string;
  userAgent: string;
  payload?: string;
  riskScore: number;
  timeline: {
    stage: "Detected" | "Blocked" | "Investigated" | "Resolved";
    timestamp: string;
    operator: string;
    notes: string;
  }[];
  evidence: {
    type: string;
    rawLog: string;
    mitigationHash?: string;
  };
}

export interface HealthMetrics {
  cpuUsage: number;
  memoryUsage: number;
  responseTimeMs: number;
  uptimePercentage: number;
}

export interface HealthService {
  name: string;
  status: "Operational" | "Degraded" | "Offline";
  metrics: HealthMetrics;
  lastHealthCheck: string;
  version: string;
  host: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  type: "Project" | "Security" | "User" | "Task" | "System";
  generatedDate: string;
  status: "Ready" | "Generating" | "Failed";
  format: "PDF" | "CSV" | "Excel";
  fileSize: string;
  generatedBy: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  category: "Security" | "Project" | "Task" | "System" | "User";
  timestamp: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Read" | "Unread" | "Archived";
  actionUrl?: string;
  actionText?: string;
}

export interface SecurityAnalyticsData {
  loginTrend: { timestamp: string; success: number; failed: number }[];
  threatTrend: { timestamp: string; blockRate: number; attempts: number }[];
  userBehavior: { username: string; score: number; requests: number }[];
  attackCategories: { name: string; value: number }[];
  failedLoginTrend: { timestamp: string; value: number }[];
  topThreatSources: { source: string; count: number; country: string }[];
  riskScoreHistory: { date: string; value: number }[];
}

export interface AnalyticsResponse {
  threatScore: number;
  totalAttacks: number;
  blockedRequests: number;
  suspiciousUsers: number;
  avgResponseTimeMs: number;
  analytics: SecurityAnalyticsData;
}
