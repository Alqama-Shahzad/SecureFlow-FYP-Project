import { GeneralSettings, SecuritySettings, Session } from "../types/profile-settings";

const STORAGE_KEYS = {
  GENERAL: "secureflow_general_settings",
  SECURITY: "secureflow_security_settings",
  SESSIONS: "secureflow_active_sessions"
};

const DEFAULT_GENERAL_SETTINGS: GeneralSettings = {
  appearance: "dark",
  language: "en-US",
  dateFormat: "YYYY-MM-DD",
  timezone: "America/New_York",
  compactMode: false,
  defaultLandingPage: "/dashboard",
  sidebarBehavior: "expanded",
  cardDensity: "normal",
  notificationPreferences: {
    emailNotifications: true,
    pushNotifications: false,
    desktopNotifications: true,
    projectAlerts: true,
    systemAlerts: true,
  }
};

const DEFAULT_SECURITY_SETTINGS: SecuritySettings = {
  twoFactorEnabled: true,
  sessionTimeoutMinutes: 30,
  passwordExpiryDays: 90,
  rememberDevice: true,
  ipRestrictions: "10.0.0.0/8, 192.168.1.0/24",
  failedLoginThreshold: 5,
  accountLockDurationMinutes: 15,
  trustedDevicesOnly: false,
  loginAlertsEnabled: true,
  securityNotificationsEnabled: true,
  suspiciousActivityAlertsEnabled: true,
};

const DEFAULT_SESSIONS: Session[] = [
  {
    id: "sess-1",
    deviceName: "macOS Workstation - Chrome Enterprise",
    ipAddress: "10.0.4.150",
    browser: "Chrome (124.0.0)",
    lastActive: "Active Now",
    isCurrent: true,
  },
  {
    id: "sess-2",
    deviceName: "iPad Pro - Enterprise MDM Safari",
    ipAddress: "172.16.50.8",
    browser: "Safari Mobile (17.4)",
    lastActive: "2 hours ago",
    isCurrent: false,
  },
  {
    id: "sess-3",
    deviceName: "Windows 11 VPN - SecOps Gateway",
    ipAddress: "10.2.8.44",
    browser: "Edge (123.0)",
    lastActive: "3 days ago",
    isCurrent: false,
  }
];

export const SettingsService = {
  async getGeneralSettings(): Promise<GeneralSettings> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const stored = localStorage.getItem(STORAGE_KEYS.GENERAL);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.GENERAL, JSON.stringify(DEFAULT_GENERAL_SETTINGS));
      return DEFAULT_GENERAL_SETTINGS;
    }
    return JSON.parse(stored);
  },

  async updateGeneralSettings(settings: Partial<GeneralSettings>): Promise<GeneralSettings> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const current = await this.getGeneralSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.GENERAL, JSON.stringify(updated));
    return updated;
  },

  async getSecuritySettings(): Promise<SecuritySettings> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const stored = localStorage.getItem(STORAGE_KEYS.SECURITY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.SECURITY, JSON.stringify(DEFAULT_SECURITY_SETTINGS));
      return DEFAULT_SECURITY_SETTINGS;
    }
    return JSON.parse(stored);
  },

  async updateSecuritySettings(settings: Partial<SecuritySettings>): Promise<SecuritySettings> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const current = await this.getSecuritySettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.SECURITY, JSON.stringify(updated));
    return updated;
  },

  async getActiveSessions(): Promise<Session[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const stored = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(DEFAULT_SESSIONS));
      return DEFAULT_SESSIONS;
    }
    return JSON.parse(stored);
  },

  async terminateSession(sessionId: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const sessions = await this.getActiveSessions();
    const filtered = sessions.filter(s => s.id !== sessionId);
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(filtered));
    return true;
  }
};
