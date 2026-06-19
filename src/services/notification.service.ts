import { Notification } from "../types/security";

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "NOTIFY-101",
    title: "SQL Injection Probe Restrained",
    description: "Cloudflare WAF edge blocked suspicious request with UNION SELECT instruction payload from remote host 45.143.203.12.",
    category: "Security",
    timestamp: "2026-06-19T11:10:00Z",
    priority: "Critical",
    status: "Unread",
    actionUrl: "/security/alerts/SEC-901",
    actionText: "Inspect Payload Logs"
  },
  {
    id: "NOTIFY-102",
    title: "Account Login Lockout Triggered",
    description: "Account 'compliance_officer' temporarily suspended (30m cooldown) due to 42 failed authentication attempts in 1.4s.",
    category: "Security",
    timestamp: "2026-06-19T10:45:12Z",
    priority: "High",
    status: "Unread",
    actionUrl: "/security/alerts/SEC-902",
    actionText: "Verify Core Identity"
  },
  {
    id: "NOTIFY-103",
    title: "Milestone Dependencies Modified",
    description: "Sarah Jenkins rescheduled critical path milestones for Commercial Banking Portal (CBP). Check alignment index.",
    category: "Project",
    timestamp: "2026-06-19T09:12:00Z",
    priority: "Medium",
    status: "Unread",
    actionUrl: "/projects",
    actionText: "View Project Schedule"
  },
  {
    id: "NOTIFY-104",
    title: "Security Scan Report Ready",
    description: "Q2 SOC-2 compliance checklist profile compile completed, sign-off is required by Lead Information Security Auditor.",
    category: "System",
    timestamp: "2026-06-18T16:22:01Z",
    priority: "Low",
    status: "Read",
    actionUrl: "/reports",
    actionText: "Review Generated PDF"
  },
  {
    id: "NOTIFY-105",
    title: "API Ingress Rate Threshold Breached",
    description: "Client IP block 103.54.120.33 triggered volumetric burst rate mitigation filter (429 status response).",
    category: "Security",
    timestamp: "2026-06-18T14:10:55Z",
    priority: "Medium",
    status: "Read",
    actionUrl: "/security/alerts/SEC-903",
    actionText: "Examine Access Token"
  }
];

const NOTIFICATIONS_KEY = "sf_mock_notifications_data";

export class NotificationService {
  private static list(): Notification[] {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_KEY);
      return stored ? JSON.parse(stored) : INITIAL_NOTIFICATIONS;
    } catch (e) {
      return INITIAL_NOTIFICATIONS;
    }
  }

  private static save(list: Notification[]): void {
    try {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(list));
    } catch (e) {
      console.error("Failed to save notifications", e);
    }
  }

  // --- 1. Get notifications list ---
  public static async getNotifications(filters?: {
    category?: string;
    priority?: string;
    status?: string;
  }): Promise<Notification[]> {
    let raw = this.list();

    if (filters) {
      if (filters.category && filters.category !== "") {
        raw = raw.filter(n => n.category.toLowerCase() === filters.category?.toLowerCase());
      }
      if (filters.priority && filters.priority !== "") {
        raw = raw.filter(n => n.priority.toLowerCase() === filters.priority?.toLowerCase());
      }
      if (filters.status && filters.status !== "") {
        raw = raw.filter(n => n.status.toLowerCase() === filters.status?.toLowerCase());
      }
    }

    // Sort newest first
    return raw.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // --- 2. Mark notification read ---
  public static async markRead(id: string): Promise<Notification | null> {
    const raw = this.list();
    const idx = raw.findIndex(n => n.id === id);
    if (idx === -1) return null;

    raw[idx] = {
      ...raw[idx],
      status: "Read"
    };

    this.save(raw);
    return raw[idx];
  }

  // --- 3. Mark all notifications as read ---
  public static async markAllRead(): Promise<boolean> {
    const raw = this.list();
    const updated = raw.map(n => ({
      ...n,
      status: "Read" as const
    }));
    this.save(updated);
    return true;
  }

  // --- 4. Delete notification ---
  public static async deleteNotification(id: string): Promise<boolean> {
    const raw = this.list();
    const filtered = raw.filter(n => n.id !== id);
    this.save(filtered);
    return true;
  }

  // --- 5. Queue secure real-time notification ---
  public static async createNotification(input: {
    title: string;
    description: string;
    category: "Security" | "Project" | "Task" | "System" | "User";
    priority: "Low" | "Medium" | "High" | "Critical";
    actionUrl?: string;
    actionText?: string;
  }): Promise<Notification> {
    const raw = this.list();
    const newNotify: Notification = {
      id: `NOTIFY-${Math.floor(106 + Math.random() * 800)}`,
      title: input.title,
      description: input.description,
      category: input.category,
      timestamp: new Date().toISOString(),
      priority: input.priority,
      status: "Unread",
      actionUrl: input.actionUrl,
      actionText: input.actionText
    };

    this.save([newNotify, ...raw]);
    return newNotify;
  }
}
