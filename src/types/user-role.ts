export type UserRole = "Admin" | "Project Manager" | "Developer";
export type UserStatus = "Active" | "Inactive" | "Suspended";

export interface AssignedProject {
  id: string;
  name: string;
  role: string;
  progress: number;
}

export interface AssignedTask {
  id: string;
  title: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Backlog" | "In_Progress" | "Review" | "Completed";
  dueDate: string;
}

export interface UserActivity {
  id: string;
  action: string;
  timestamp: string;
  ipAddress: string;
  device: string;
  type: "security" | "project" | "task" | "auth";
  status: "success" | "warning" | "alert";
}

export interface SecurityEvent {
  id: string;
  event: string;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: string;
  details: string;
}

export interface UserDTO {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  department: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  lastLogin?: string;
  createdDate: string;
  projects?: AssignedProject[];
  tasks?: AssignedTask[];
  activities?: UserActivity[];
  securityEvents?: SecurityEvent[];
}

// Role Management Interfaces
export interface RoleDTO {
  id: string;
  name: string;
  description: string;
  color: string; // Tailwind hex or class prefix (e.g., "emerald", "indigo", "rose")
  usersCount: number;
  permissionsCount: number;
  accessLevel: "Full Control" | "Write & Manage" | "Reviewer / Read Only";
  createdDate: string;
  permissions: string[]; // List of permission keys (e.g., "dashboard.read")
}

// Permission Matrix Model
export interface PermissionMatrixRow {
  module: string;
  displayName: string;
  permissions: {
    read: boolean;
    write: boolean;
    update: boolean;
    delete: boolean;
    approve: boolean;
    export: boolean;
    assign: boolean;
    manage: boolean;
  };
}

export interface PermissionMatrixDTO {
  role: UserRole | string;
  rows: PermissionMatrixRow[];
}
