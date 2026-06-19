import { UserRole, UserStatus, AssignedProject, AssignedTask, UserActivity, SecurityEvent } from "./user-role";

export interface UserProfile {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  department: string;
  position: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  lastLogin?: string;
  createdDate: string;
  bio?: string;
  timezone: string;
  location: string;
  employeeId: string;
  projects?: AssignedProject[];
  tasks?: AssignedTask[];
  activities?: UserActivity[];
  securityEvents?: SecurityEvent[];
}

export interface ProfileActivity extends UserActivity {}

export interface Session {
  id: string;
  deviceName: string;
  ipAddress: string;
  browser: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeoutMinutes: number;
  passwordExpiryDays: number;
  rememberDevice: boolean;
  ipRestrictions: string;
  failedLoginThreshold: number;
  accountLockDurationMinutes: number;
  trustedDevicesOnly: boolean;
  loginAlertsEnabled: boolean;
  securityNotificationsEnabled: boolean;
  suspiciousActivityAlertsEnabled: boolean;
}

export interface GeneralSettings {
  appearance: "dark" | "light" | "system";
  language: string;
  dateFormat: string;
  timezone: string;
  compactMode: boolean;
  defaultLandingPage: string;
  sidebarBehavior: "collapsed" | "expanded" | "hover";
  cardDensity: "compact" | "normal" | "spacious";
  notificationPreferences: NotificationPreferences;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  desktopNotifications: boolean;
  projectAlerts: boolean;
  systemAlerts: boolean;
}

export interface PasswordChangeRequest {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}
