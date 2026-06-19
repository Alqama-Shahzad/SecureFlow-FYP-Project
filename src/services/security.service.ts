import { 
  ThreatSummary, 
  Alert, 
  AlertDetails, 
  HealthService, 
  AnalyticsResponse,
  SecurityEvent
} from "../types/security";

// Seed data
const INITIAL_SECURITY_EVENTS: SecurityEvent[] = [
  {
    id: "EV-202",
    timestamp: "2026-06-19T11:10:00Z",
    attackType: "SQL Injection",
    sourceIP: "45.143.203.12",
    severity: "Critical",
    status: "New",
    responseAction: "IP blacklisted via Cloudflare WAF block rule",
    endpoint: "/api/v1/ledger/transfer",
    userAgent: "Mozilla/5.0 (Header injection exploit)",
    country: "Russian Federation",
    payload: "UNION SELECT username, password_hash FROM users --"
  },
  {
    id: "EV-201",
    timestamp: "2026-06-19T10:45:12Z",
    attackType: "Brute Force",
    sourceIP: "185.190.141.5",
    severity: "High",
    status: "Investigating",
    responseAction: "Account login locked; JWT revocation triggered",
    endpoint: "/api/v1/auth/login",
    userAgent: "Hydra brute-force daemon",
    country: "Netherlands",
    payload: "Failed login sequence: 42 attempts in 1.4s"
  },
  {
    id: "EV-199",
    timestamp: "2026-06-19T09:30:15Z",
    attackType: "Rate Limit Violation",
    sourceIP: "103.54.120.33",
    severity: "Medium",
    status: "Resolved",
    responseAction: "Host rate-throttled for 3600 seconds",
    endpoint: "/api/v1/projects/proj-101/tasks",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ScriptingEngine",
    country: "India",
    payload: "Request rate 180 req/sec; threshold 60 req/sec"
  },
  {
    id: "EV-198",
    timestamp: "2026-06-19T08:12:44Z",
    attackType: "Suspicious Request",
    sourceIP: "89.248.165.17",
    severity: "Low",
    status: "Resolved",
    responseAction: "Request headers sanitized and logged",
    endpoint: "/api/v1/system/status",
    userAgent: "Shodan-Scanner",
    country: "Germany",
    payload: "Invalid custom header: X-Compliance-Bypass = true"
  },
  {
    id: "EV-190",
    timestamp: "2026-06-18T16:22:01Z",
    attackType: "SQL Injection",
    sourceIP: "93.184.216.34",
    severity: "High",
    status: "Ignored",
    responseAction: "False positive: parameter token matches structure",
    endpoint: "/api/v1/users/details",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    country: "United States",
    payload: "name=O'Connor"
  },
  {
    id: "EV-187",
    timestamp: "2026-06-18T14:10:55Z",
    attackType: "Brute Force",
    sourceIP: "203.0.113.88",
    severity: "Critical",
    status: "Resolved",
    responseAction: "IP block permanent; alert sent to SOC Coordinator",
    endpoint: "/api/v1/auth/mfa/verify",
    userAgent: "Go-http-client/1.1 exploit-kit",
    country: "China",
    payload: "MFA brute-force bypass pattern: 112 tokens verified"
  }
];

const INITIAL_ALERTS: AlertDetails[] = [
  {
    id: "SEC-901",
    attackType: "SQL Injection",
    severity: "Critical",
    sourceIP: "45.143.203.12",
    detectedAt: "2026-06-19T11:10:00Z",
    status: "New",
    responseAction: "IP blacklisted via Cloudflare WAF block rule",
    targetEndpoint: "/api/v1/ledger/transfer",
    country: "Russian Federation",
    userAgent: "Mozilla/5.0 (Exploit Scanner v4.2)",
    payload: "POST /api/v1/ledger/transfer HTTP/1.1\nHost: secureflow.app\nContent-Type: application/json\n\n{\"target\":\"99291\",\"amount\":\"1000' OR 1=1; --\"}",
    riskScore: 98,
    timeline: [
      { stage: "Detected", timestamp: "2026-06-19T11:10:00Z", operator: "IDS-ENGINE-V2", notes: "Signature match rule id 1182 (SQL UNION pattern in Transfer payload)" },
      { stage: "Blocked", timestamp: "2026-06-19T11:10:02Z", operator: "WAF-FIREWALL-DAEMON", notes: "Automated host blocking Rule SEC-WAF-02: Permanent drop" }
    ],
    evidence: {
      type: "Application Server Log Fragment",
      rawLog: "2026-06-19 11:10:00 UTC [FATAL] Database query aborted due to syntax threat.\nRequest source: 45.143.203.12\nUser Agent: Mozilla/5.0 (Exploit Scanner v4.2)\nParameters matched: 1=1, UNION SELECT, drop table\nSHA-SIG-CERT: f322fbaee432321aa80c98fbcde4421102919aa",
      mitigationHash: "sha256:56fa2b8db00f8983fb10c4bc795fa09199fb1ef4d0ccda53f95b542013f8c85c"
    }
  },
  {
    id: "SEC-902",
    attackType: "Brute Force",
    severity: "High",
    sourceIP: "185.190.141.5",
    detectedAt: "2026-06-19T10:45:12Z",
    status: "Investigating",
    responseAction: "Account login locked; JWT revocation triggered",
    targetEndpoint: "/api/v1/auth/login",
    country: "Netherlands",
    userAgent: "Hydra SSH/Web scanner daemon",
    payload: "FAILED LOGIN SEQUENCES:\nUsernames attempted: admin, poweruser, sysadmin, root, compliance_officer\nTotal attempts: 42 failures within 1.4 seconds",
    riskScore: 88,
    timeline: [
      { stage: "Detected", timestamp: "2026-06-19T10:45:12Z", operator: "AUTH-THROTTLE-DAEMON", notes: "Threshold rule: 5 failures/5 sec breached for source subnet" },
      { stage: "Blocked", timestamp: "2026-06-19T10:45:15Z", operator: "SYSTEM-GATEWAY", notes: "Route restricted. Suspicious account 'compliance_officer' temporarily suspended (30m cooldown)" },
      { stage: "Investigated", timestamp: "2026-06-19T11:00:00Z", operator: "SOC-Officer-10", notes: "Verifying if Netherlands IP correlates with registered employee VPN nodes. None found." }
    ],
    evidence: {
      type: "Security IAM Auditor Report",
      rawLog: "AUTH FAIL: target=compliance_officer, ip=185.190.141.5, type=PASSWORD\nAUTH FAIL: target=compliance_officer, ip=185.190.141.5, type=PASSWORD\nAUTH FAIL: target=compliance_officer, ip=185.190.141.5, type=MFA_BYPASS\n[ALERT] Trigger lock key: USR_LOCK_compliance_officer",
      mitigationHash: "sha256:7ba8fde4bb91c98fe3cb523f2de4459d81ce26e8db01f11cb20fabef893041a8"
    }
  },
  {
    id: "SEC-903",
    attackType: "Rate Limit Violation",
    severity: "Medium",
    sourceIP: "103.54.120.33",
    detectedAt: "2026-06-19T09:30:15Z",
    status: "Resolved",
    responseAction: "Host rate-throttled for 3600 seconds",
    targetEndpoint: "/api/v1/projects/proj-101/tasks",
    country: "India",
    userAgent: "Mozilla/5.0 ScriptingEngine",
    payload: "180 GET requests to /projects/proj-101/tasks within 10 seconds (Burst limit 30req/10s)",
    riskScore: 65,
    timeline: [
      { stage: "Detected", timestamp: "2026-06-19T09:30:15Z", operator: "INGRESS-RATE-LIMITER", notes: "Redis sliding-window bucket overflow count=180" },
      { stage: "Blocked", timestamp: "2026-06-19T09:30:16Z", operator: "INGRESS-RATE-LIMITER", notes: "429 Too Many Requests status assigned to IP segment for 1 hour" },
      { stage: "Resolved", timestamp: "250ms duration", operator: "REDIS-AUTOMATED-DAEMON", notes: "Auto cooldown threshold completed. No persistent malicious actions captured." }
    ],
    evidence: {
      type: "Ingress Router Trace",
      rawLog: "METRIC 429: Rate Limit Breached on path /api/v1/projects/*/tasks. Remote IP: 103.54.120.33. HTTP Headers: X-Forwarded-For: 103.54.120.33, Connection: keep-alive",
      mitigationHash: "sha256:e5ba138bcda02be31fde0ccda42111cf098bcde29aa8cf01b9aa3ecdc91abbfc"
    }
  },
  {
    id: "SEC-904",
    attackType: "Suspicious Request",
    severity: "Low",
    sourceIP: "89.248.165.17",
    detectedAt: "2026-06-19T08:12:44Z",
    status: "Resolved",
    responseAction: "Request headers sanitized and logged",
    targetEndpoint: "/api/v1/system/status",
    country: "Germany",
    userAgent: "Nmap Scripting Engine Scanner",
    payload: "GET /api/v1/system/status with abnormal TLS header flags indicating fingerprinting",
    riskScore: 35,
    timeline: [
      { stage: "Detected", timestamp: "2026-06-19T08:12:44Z", operator: "SSL-SENTRY", notes: "Non-standard cipher sequence requested in client hello" },
      { stage: "Blocked", timestamp: "2026-06-19T08:12:44Z", operator: "SSL-SENTRY", notes: "Connection terminated. Restructuring handshake negotiation requirements" },
      { stage: "Resolved", timestamp: "2026-06-19T08:15:00Z", operator: "SSL-SENTRY", notes: "Automatic certificate chain check complete. Normal traffic routing restored." }
    ],
    evidence: {
      type: "Nginx TLS Handshake Log",
      rawLog: "SSL Handshake Blocked: Remote: 89.248.165.17, Cipher Requested: DHE-RSA-AES256-SHA (Legacy/Insecure). Strict Policy SEC_POLICY_01 enforced.",
      mitigationHash: "sha255:3fbde11afbdebc98ff2a0ccda5421cde9bbb3cae9aa1ccd87e0fa9cfedee221d"
    }
  },
  {
    id: "SEC-905",
    attackType: "Anomalous Access",
    severity: "High",
    sourceIP: "198.51.100.41",
    detectedAt: "2026-06-18T18:40:02Z",
    status: "Ignored",
    responseAction: "Investigated: Certified compliance scan by SecOps team",
    targetEndpoint: "/api/v1/admin/audit-ledger/historical",
    country: "United States",
    userAgent: "Tenable.sc Nessus Scanner",
    payload: "Large scale historical ledger export check. High reading volume of 800 registers.",
    riskScore: 78,
    timeline: [
      { stage: "Detected", timestamp: "2026-06-18T18:40:02Z", operator: "LEDGER-GUARDIAN", notes: "Abnormal export size triggered volumetric breach alert" },
      { stage: "Blocked", timestamp: "2026-06-18T18:40:03Z", operator: "LEDGER-GUARDIAN", notes: "API transfer stream suspended. Admin signature requested." },
      { stage: "Investigated", timestamp: "2026-06-18T19:20:00Z", operator: "Admin-Lead", notes: "Confirmed scheduled internal compliance audit scan. Internal IP authenticated." },
      { stage: "Resolved", timestamp: "2026-06-18T19:22:00Z", operator: "Admin-Lead", notes: "Whitelisted testing session ID for the rest of compliance window." }
    ],
    evidence: {
      type: "SecOps Verification Consent Form",
      rawLog: "TICKET-SEC-8822: Nessus Compliance Scan authorize signature: RootAdminKey_X01. Scheduled activity window: June 18 18:00 - June 18 20:00.",
      mitigationHash: "sha256:01b3daeeefcb421aa80c95bcde09fabeeff1ad0ccda12cb90b21fa8a00efcd331"
    }
  },
  {
    id: "SEC-906",
    attackType: "Privilege Escalation",
    severity: "Critical",
    sourceIP: "203.0.113.88",
    detectedAt: "2026-06-18T14:10:55Z",
    status: "Resolved",
    responseAction: "Subnet permanently segregated; Active Session Keys blacklisted",
    targetEndpoint: "/api/v1/auth/role/assign",
    country: "China",
    userAgent: "Curl exploit binary v1",
    payload: "POST /auth/role/assign with forged JWT bearing corrupted 'Admin' claim block",
    riskScore: 99,
    timeline: [
      { stage: "Detected", timestamp: "2026-06-18T14:10:55Z", operator: "JWT-VAULT-VAL", notes: "HS512 key mismatch. Decrypted payload signature check failed." },
      { stage: "Blocked", timestamp: "2026-06-18T14:10:56Z", operator: "SESSION-TERMINATOR", notes: "Session ID revoked globally on Redis backend. IP subnet restricted in banking core firewall." },
      { stage: "Resolved", timestamp: "2026-06-18T14:30:00Z", operator: "SOC-Response-Team", notes: "Mitigation verified. Attacked target ledger sequence fully audited and intact." }
    ],
    evidence: {
      type: "JSON Web Token Validation Trace",
      rawLog: "FORGE_ATTEMPT ALERT: user=dev_intern@secureflow.app attempted upgrade to role=Admin. JWT signature didn't match master seed. Cryptographic validation aborted.",
      mitigationHash: "sha256:a5bfe29adbc0cc98eeb31fa09199fdeeefcbda42aaccda55ff09102919aa3bc3"
    }
  }
];

const INITIAL_HEALTH_SERVICES: HealthService[] = [
  {
    name: "API Server (Core Run Express)",
    status: "Operational",
    metrics: {
      cpuUsage: 12.4,
      memoryUsage: 45.2,
      responseTimeMs: 24,
      uptimePercentage: 99.98
    },
    lastHealthCheck: "2026-06-19T11:15:00Z",
    version: "v4.2.1-prod",
    host: "api-server-instance-09"
  },
  {
    name: "PostgreSQL Database Service",
    status: "Operational",
    metrics: {
      cpuUsage: 8.5,
      memoryUsage: 68.1,
      responseTimeMs: 3,
      uptimePercentage: 99.99
    },
    lastHealthCheck: "2026-06-19T11:15:00Z",
    version: "PostgreSQL 16.3-CloudSQL",
    host: "clsql-postgres-primary"
  },
  {
    name: "Redis Token In-Memory Storage",
    status: "Operational",
    metrics: {
      cpuUsage: 4.2,
      memoryUsage: 18.5,
      responseTimeMs: 1,
      uptimePercentage: 100.0
    },
    lastHealthCheck: "2026-06-19T11:15:01Z",
    version: "Redis v7.2.4-cluster",
    host: "redis-cache-cluster-01"
  },
  {
    name: "Authentication & Identity Provider",
    status: "Operational",
    metrics: {
      cpuUsage: 14.8,
      memoryUsage: 35.6,
      responseTimeMs: 42,
      uptimePercentage: 99.95
    },
    lastHealthCheck: "2026-06-19T11:14:58Z",
    version: "JWK-Identity-Secure-Edge",
    host: "iam-gateway-prod-02"
  },
  {
    name: "Audit Logging Service",
    status: "Operational",
    metrics: {
      cpuUsage: 5.1,
      memoryUsage: 22.4,
      responseTimeMs: 8,
      uptimePercentage: 100.0
    },
    lastHealthCheck: "2026-06-19T11:15:02Z",
    version: "SHA256-Ledger-Writer-v1.8",
    host: "ledger-validator-node"
  },
  {
    name: "IDS Engine (Active Snort Vector)",
    status: "Operational",
    metrics: {
      cpuUsage: 22.8,
      memoryUsage: 51.3,
      responseTimeMs: 12,
      uptimePercentage: 99.91
    },
    lastHealthCheck: "2026-06-19T11:15:00Z",
    version: "Snort3.0-IPS-Edge",
    host: "ids-detection-probe-01"
  }
];

// LocalStorage helpers to load/save state
const storageGet = <T>(key: string, defaultValue: T): T => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

const storageSet = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Error setting localStorage key " + key, e);
  }
};

const EVENTS_KEY = "sf_mock_events_data";
const ALERTS_KEY = "sf_mock_alerts_data";
const HEALTH_KEY = "sf_mock_health_data";

export class SecurityService {
  private static events(): SecurityEvent[] {
    return storageGet(EVENTS_KEY, INITIAL_SECURITY_EVENTS);
  }

  private static alerts(): AlertDetails[] {
    return storageGet(ALERTS_KEY, INITIAL_ALERTS);
  }

  private static health(): HealthService[] {
    return storageGet(HEALTH_KEY, INITIAL_HEALTH_SERVICES);
  }

  private static updateAlerts(alertsList: AlertDetails[]): void {
    storageSet(ALERTS_KEY, alertsList);
  }

  private static updateEvents(eventsList: SecurityEvent[]): void {
    storageSet(EVENTS_KEY, eventsList);
  }

  private static updateHealth(healthList: HealthService[]): void {
    storageSet(HEALTH_KEY, healthList);
  }

  // --- 1. IDS Overview API mock ---
  public static async getIDSOverview(): Promise<ThreatSummary> {
    const events = this.events();
    const alerts = this.alerts();

    // Compute stats from data
    const bruteForceAttempts = alerts.filter(a => a.attackType === "Brute Force").length * 15 + 42;
    const sqlInjectionAttempts = alerts.filter(a => a.attackType === "SQL Injection").length * 8 + 14;
    const rateLimitViolations = alerts.filter(a => a.attackType === "Rate Limit Violation").length * 30 + 122;
    const suspiciousRequests = alerts.filter(a => a.attackType === "Suspicious Request").length * 18 + 52;
    const blockedIPs = Array.from(new Set(alerts.map(a => a.sourceIP))).length;

    // Calc threat score. 0-100 based on counts of open high/critical alerts
    const activeUnresolvedHighCritical = alerts.filter(
      a => (a.severity === "High" || a.severity === "Critical") && a.status !== "Resolved"
    ).length;
    const baseThreatScore = 30 + activeUnresolvedHighCritical * 10;
    const threatScore = Math.min(98, Math.max(12, baseThreatScore));

    return {
      bruteForce: {
        failedLogins: bruteForceAttempts,
        blockedAttempts: alerts.filter(a => a.attackType === "Brute Force" && a.status === "Resolved").length * 8 + 34,
        affectedAccounts: 18,
        trend: 12.4
      },
      sqlInjection: {
        attackCount: sqlInjectionAttempts,
        affectedEndpoints: 6,
        severity: "Critical",
        topPatterns: [
          "UNION SELECT",
          "' OR 1=1;--",
          "admin' --",
          "injection payload payload"
        ]
      },
      rateLimit: {
        requestsBlocked: rateLimitViolations,
        affectedIPs: 9,
        topSources: ["103.54.120.33", "192.168.10.11", "90.110.42.11"]
      },
      recentTimeline: events,
      stats: {
        bruteForceAttempts,
        sqlInjectionAttempts,
        rateLimitViolations,
        suspiciousRequests,
        blockedIPs,
        threatScore
      }
    };
  }

  // --- 2. Alerts Center API mock ---
  public static async getAlerts(filters: {
    search?: string;
    severity?: string;
    status?: string;
    attackType?: string;
    page?: number;
    limit?: number;
  }): Promise<{ alerts: Alert[]; total: number; pages: number }> {
    const alertsList = this.alerts();
    let filtered = [...alertsList];

    // Apply Filter Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(
        a => 
          a.id.toLowerCase().includes(q) ||
          a.attackType.toLowerCase().includes(q) ||
          a.sourceIP.toLowerCase().includes(q) ||
          (a.targetEndpoint?.toLowerCase().includes(q))
      );
    }

    // Severity Filter
    if (filters.severity && filters.severity !== "") {
      filtered = filtered.filter(a => a.severity.toLowerCase() === filters.severity?.toLowerCase());
    }

    // Status Filter
    if (filters.status && filters.status !== "") {
      filtered = filtered.filter(a => a.status.toLowerCase() === filters.status?.toLowerCase());
    }

    // Attack Type Filter
    if (filters.attackType && filters.attackType !== "") {
      filtered = filtered.filter(a => a.attackType.toLowerCase() === filters.attackType?.toLowerCase());
    }

    const total = filtered.length;
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const pages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    
    // Slice paginated response
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      alerts: paginated.map(a => ({
        id: a.id,
        attackType: a.attackType,
        severity: a.severity,
        sourceIP: a.sourceIP,
        detectedAt: a.detectedAt,
        status: a.status,
        responseAction: a.responseAction,
        targetEndpoint: a.targetEndpoint
       })),
      total,
      pages
    };
  }

  // --- 3. Alert Details API mock ---
  public static async getAlertById(id: string): Promise<AlertDetails | null> {
    const alertsList = this.alerts();
    const alert = alertsList.find(a => a.id === id);
    return alert || null;
  }

  // Update alert status & add timeline audit trail entry
  public static async updateAlertStatus(
    id: string, 
    status: "New" | "Investigating" | "Resolved" | "Ignored",
    operator: string,
    notes: string
  ): Promise<AlertDetails | null> {
    const alertsList = this.alerts();
    const index = alertsList.findIndex(a => a.id === id);
    if (index === -1) return null;

    const alert = alertsList[index];
    const updatedAlert: AlertDetails = {
      ...alert,
      status,
      timeline: [
        ...alert.timeline,
        {
          stage: status as any,
          timestamp: new Date().toISOString(),
          operator,
          notes
        }
      ]
    };

    alertsList[index] = updatedAlert;
    this.updateAlerts(alertsList);

    // Also update matching general event status if it exists
    const events = this.events();
    const eventIdx = events.findIndex(e => e.id.replace("EV-", "SEC-") === id || e.id === id);
    if (eventIdx !== -1) {
      events[eventIdx] = {
        ...events[eventIdx],
        status
      };
      this.updateEvents(events);
    }

    return updatedAlert;
  }

  // Covert sandbox alert simulation trigger
  public static async injectSimulatedAttack(
    type: "Brute Force" | "SQL Injection" | "Rate Limit Violation" | "Suspicious Request" | "Privilege Escalation",
    ip: string
  ): Promise<AlertDetails> {
    const alertsList = this.alerts();
    const newId = `SEC-${Math.floor(100 + Math.random() * 900)}`;
    const newAlert: AlertDetails = {
      id: newId,
      attackType: type as any,
      severity: type === "Brute Force" || type === "Privilege Escalation" ? "Critical" : type === "SQL Injection" ? "High" : "Medium",
      sourceIP: ip,
      detectedAt: new Date().toISOString(),
      status: "New",
      responseAction: "Host locked under SecOps sandbox simulation",
      targetEndpoint: type === "SQL Injection" ? "/api/v1/ledger" : "/api/v1/sandbox-terminal",
      country: "Switzerland",
      userAgent: "Security-Breach-Sim-Kit v1.0",
      payload: `Attack Payload Simulator executed threat vector: [${type} Triggered]`,
      riskScore: type === "Privilege Escalation" ? 99 : type === "Brute Force" ? 92 : 82,
      timeline: [
        { stage: "Detected", timestamp: new Date().toISOString(), operator: "BREACH-SIM-ENGINE", notes: "Volumetric / pattern signature match" }
      ],
      evidence: {
        type: "Breach Simulator Log",
        rawLog: `SEC-COMPLIANCE-FAULT: Simulation attack vector ${type} spawned under current account credentials.\nsource: ${ip}`,
        mitigationHash: "sha256:" + Math.random().toString(16).substring(2, 32)
      }
    };

    const updatedAlerts = [newAlert, ...alertsList];
    this.updateAlerts(updatedAlerts);

    // Add also to events logs list
    const events = this.events();
    const newEvent: SecurityEvent = {
      id: `EV-${Math.floor(210 + Math.random() * 100)}`,
      timestamp: new Date().toISOString(),
      attackType: type as any,
      sourceIP: ip,
      severity: newAlert.severity,
      status: "New",
      responseAction: newAlert.responseAction,
      endpoint: newAlert.targetEndpoint,
      userAgent: newAlert.userAgent,
      country: newAlert.country,
      payload: newAlert.payload
    };
    this.updateEvents([newEvent, ...events]);

    return newAlert;
  }

  // Reset alert states back to pristine default setup helper
  public static async resetAlerts(): Promise<void> {
    localStorage.removeItem(ALERTS_KEY);
    localStorage.removeItem(EVENTS_KEY);
    localStorage.removeItem(HEALTH_KEY);
  }

  // --- 4. Security Analytics API mock ---
  public static async getSecurityAnalytics(): Promise<AnalyticsResponse> {
    const alerts = this.alerts();

    // Determine counts
    const bruteForceCount = alerts.filter(a => a.attackType === "Brute Force").length * 8 + 32;
    const sqlInjectionCount = alerts.filter(a => a.attackType === "SQL Injection").length * 12 + 18;
    const rateLimitCount = alerts.filter(a => a.attackType === "Rate Limit Violation").length * 20 + 72;
    const totalAttacks = bruteForceCount + sqlInjectionCount + rateLimitCount + alerts.length;

    // Login Trend: hourly successful vs failed logins
    const loginTrend = [
      { timestamp: "00:00", success: 120, failed: 2 },
      { timestamp: "04:00", success: 80, failed: 5 },
      { timestamp: "08:00", success: 480, failed: 12 },
      { timestamp: "12:00", success: 920, failed: 45 },
      { timestamp: "16:00", success: 1100, failed: 28 },
      { timestamp: "20:00", success: 650, failed: 18 }
    ];

    // Threat Trend: block rate vs attempts
    const threatTrend = [
      { timestamp: "Mon", blockRate: 98, attempts: 240 },
      { timestamp: "Tue", blockRate: 99, attempts: 180 },
      { timestamp: "Wed", blockRate: 100, attempts: 150 },
      { timestamp: "Thu", blockRate: 97, attempts: 310 },
      { timestamp: "Fri", blockRate: 99, attempts: totalAttacks }
    ];

    // User behavior anomalies list
    const userBehavior = [
      { username: "compliance_officer", score: 88, requests: 1422 },
      { username: "dev_intern@secureflow.app", score: 72, requests: 840 },
      { username: "lead_finance_op", score: 18, requests: 295 },
      { username: "hr_admin", score: 4, requests: 110 }
    ];

    // Failed login absolute trend (last 10 periods)
    const failedLoginTrend = [
      { timestamp: "06-13", value: 12 },
      { timestamp: "06-14", value: 8 },
      { timestamp: "06-15", value: 4 },
      { timestamp: "06-16", value: 22 },
      { timestamp: "06-17", value: 18 },
      { timestamp: "06-18", value: 38 },
      { timestamp: "06-19", value: 24 }
    ];

    // Threat distribution pie chart format
    const attackCategories = [
      { name: "SQL Injection", value: sqlInjectionCount },
      { name: "Brute Force", value: bruteForceCount },
      { name: "Rate Limits", value: rateLimitCount },
      { name: "Credential Stuffing", value: 14 },
      { name: "Anomalous Endpoint Probe", value: 28 }
    ];

    // Top malicious subnets
    const topThreatSources = [
      { source: "45.143.203.12", count: sqlInjectionCount, country: "Russian Federation" },
      { source: "185.190.141.5", count: bruteForceCount, country: "Netherlands" },
      { source: "103.54.120.33", count: rateLimitCount, country: "India" },
      { source: "89.248.165.17", count: 8, country: "Germany" }
    ];

    // Risk score chronology over time
    const riskScoreHistory = [
      { date: "June 13", value: 18 },
      { date: "June 14", value: 15 },
      { date: "June 15", value: 12 },
      { date: "June 16", value: 45 },
      { date: "June 17", value: 38 },
      { date: "June 18", value: 72 },
      { date: "June 19", value: 64 }
    ];

    // Calc active live metrics
    const threatScore = Math.round(alerts.reduce((acc, current) => acc + current.riskScore, 0) / alerts.length) || 45;

    return {
      threatScore,
      totalAttacks,
      blockedRequests: Math.round(totalAttacks * 0.985),
      suspiciousUsers: userBehavior.filter(b => b.score > 50).length,
      avgResponseTimeMs: 14,
      analytics: {
        loginTrend,
        threatTrend,
        userBehavior,
        attackCategories,
        failedLoginTrend,
        topThreatSources,
        riskScoreHistory
      }
    };
  }

  // --- 5. System Health API mock ---
  public static async getSystemHealth(): Promise<HealthService[]> {
    const baseHealth = this.health();
    
    // Simulate real-time metrics fluctuation naturally on query reload
    const animatedHealth = baseHealth.map(s => {
      // Small random fluctuation to keep dashboards authentic and ticking
      const cpuDelta = (Math.random() - 0.5) * 3;
      const memDelta = (Math.random() - 0.5) * 2;
      const respTimeDelta = Math.floor((Math.random() - 0.5) * 5);

      return {
        ...s,
        metrics: {
          ...s.metrics,
          cpuUsage: Math.min(99, Math.max(1, parseFloat((s.metrics.cpuUsage + cpuDelta).toFixed(1)))),
          memoryUsage: Math.min(99, Math.max(1, parseFloat((s.metrics.memoryUsage + memDelta).toFixed(1)))),
          responseTimeMs: Math.min(250, Math.max(1, s.metrics.responseTimeMs + respTimeDelta))
        },
        lastHealthCheck: new Date().toISOString()
      };
    });

    return animatedHealth;
  }

  // Inject service failure simulation to satisfy enterprise SRE posture checks
  public static async triggerServiceServiceStatus(name: string, status: "Operational" | "Degraded" | "Offline"): Promise<void> {
    const list = this.health();
    const idx = list.findIndex(h => h.name === name);
    if (idx !== -1) {
      list[idx].status = status;
      this.updateHealth(list);
    }
  }
}
