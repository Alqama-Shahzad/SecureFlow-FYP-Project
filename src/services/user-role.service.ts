import { UserDTO, RoleDTO, PermissionMatrixRow, UserRole, UserStatus } from "../types/user-role";

// Helper keys for local storage
const STORAGE_KEYS = {
  USERS: "secureflow_users",
  ROLES: "secureflow_roles",
  PERMISSIONS: "secureflow_permissions",
};

// Initial Data Generators
const DEFAULT_USERS: UserDTO[] = [
  {
    id: "usr-admin",
    fullName: "Alex Rivera",
    email: "admin@secureflow.app",
    phoneNumber: "+1 (555) 0192-384",
    department: "SecOps Command",
    role: "Admin",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    lastLogin: "2026-06-19T02:30:11Z",
    createdDate: "2025-01-10T08:00:00Z",
    projects: [
      { id: "proj-1", name: "Commercial Banking Portal", role: "Auditor", progress: 99.2 },
      { id: "proj-2", name: "SWIFT Gateway Reconciler", role: "Security Admin", progress: 100.0 }
    ],
    tasks: [
      { id: "task-201", title: "Review Root HSM Key Rotation Policy", priority: "Critical", status: "In_Progress", dueDate: "2026-06-25" }
    ],
    activities: [
      { id: "act-1", action: "Authorized master key HSM rotation", timestamp: "2026-06-19T02:15:00Z", ipAddress: "10.0.4.150", device: "macOS - Chrome Enterprise", type: "security", status: "success" },
      { id: "act-2", action: "Accessed secure root session admin level", timestamp: "2026-06-19T01:30:00Z", ipAddress: "10.0.4.150", device: "macOS - Chrome Enterprise", type: "auth", status: "success" },
      { id: "act-3", action: "Revoked legacy developer node cert", timestamp: "2026-06-18T16:45:00Z", ipAddress: "10.0.4.150", device: "macOS - Chrome Enterprise", type: "security", status: "warning" }
    ],
    securityEvents: [
      { id: "ev-1", event: "Master Credential Escalation State Audit", severity: "medium", timestamp: "2026-06-19T01:30:00Z", details: "Manual verification check of root level credentials passed without anomalies." }
    ]
  },
  {
    id: "usr-pm",
    fullName: "Sarah Jenkins",
    email: "pm@secureflow.app",
    phoneNumber: "+1 (555) 7283-911",
    department: "Engineering PMO",
    role: "Project Manager",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    lastLogin: "2026-06-19T01:10:45Z",
    createdDate: "2025-03-15T09:30:00Z",
    projects: [
      { id: "proj-1", name: "Commercial Banking Portal", role: "Lead PM", progress: 99.2 },
      { id: "proj-3", name: "Fedwire Payment Liquidity Engine", role: "Project Coordinator", progress: 96.8 }
    ],
    tasks: [
      { id: "task-103", title: "TLS 1.3 strict compliance cipher migration", priority: "Critical", status: "Backlog", dueDate: "2026-06-20" },
      { id: "task-105", title: "Prisma Schema DB index optimization", priority: "Medium", status: "In_Progress", dueDate: "2026-06-30" }
    ],
    activities: [
      { id: "act-4", action: "Created milestone Sprint 24 Final Deliverable", timestamp: "2026-06-19T01:05:00Z", ipAddress: "10.2.8.44", device: "Windows 11 - Edge", type: "project", status: "success" },
      { id: "act-5", action: "Assigned target task-103 to Developer Kaelen Mercer", timestamp: "2026-06-18T18:20:00Z", ipAddress: "10.2.8.44", device: "Windows 11 - Edge", type: "task", status: "success" }
    ],
    securityEvents: []
  },
  {
    id: "usr-dev1",
    fullName: "Kaelen Mercer",
    email: "dev@secureflow.app",
    phoneNumber: "+1 (555) 9482-104",
    department: "Cryptographic Engineering",
    role: "Developer",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    lastLogin: "2026-06-19T02:44:02Z",
    createdDate: "2025-05-20T10:15:00Z",
    projects: [
      { id: "proj-1", name: "Commercial Banking Portal", role: "Senior Cryptography dev", progress: 99.2 }
    ],
    tasks: [
      { id: "task-101", title: "Enforce JWT signing algorithm HS512", priority: "Critical", status: "In_Progress", dueDate: "2026-06-22" }
    ],
    activities: [
      { id: "act-6", action: "Pushed 4 commits to repo main (Ledger HSM branch)", timestamp: "2026-06-19T02:40:00Z", ipAddress: "192.168.1.18", device: "Linux - VS Code SSH Client", type: "project", status: "success" },
      { id: "act-7", action: "Updated task status: JWT Signing algorithm to In_Progress", timestamp: "2026-06-19T02:10:00Z", ipAddress: "192.168.1.18", device: "Linux - VS Code SSH Client", type: "task", status: "success" }
    ],
    securityEvents: []
  },
  {
    id: "usr-dev2",
    fullName: "Elena Petrova",
    email: "elena@secureflow.app",
    phoneNumber: "+1 (555) 4382-990",
    department: "Identity & Core Architecture",
    role: "Developer",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    lastLogin: "2026-06-18T15:20:00Z",
    createdDate: "2025-07-02T11:40:00Z",
    projects: [
      { id: "proj-2", name: "SWIFT Gateway Reconciler", role: "Junior Node Architect", progress: 100.0 }
    ],
    tasks: [
      { id: "task-104", title: "Sanitize SQL parameters in ledger vault", priority: "High", status: "Review", dueDate: "2026-06-19" }
    ],
    activities: [
      { id: "act-8", action: "Submitted merge request for parameter sanitizer", timestamp: "2026-06-18T15:15:00Z", ipAddress: "10.0.12.98", device: "macOS - Chrome", type: "project", status: "success" }
    ],
    securityEvents: []
  },
  {
    id: "usr-dev3",
    fullName: "Helena Wu",
    email: "helena@secureflow.app",
    phoneNumber: "+1 (555) 2341-998",
    department: "Compliance Architecture",
    role: "Developer",
    status: "Suspended",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
    lastLogin: "2026-06-11T23:55:00Z",
    createdDate: "2025-02-18T09:15:00Z",
    projects: [
      { id: "proj-4", name: "Retail Card Ledger Integration", role: "Audit Consultant", progress: 98.4 }
    ],
    tasks: [],
    activities: [
      { id: "act-9", action: "Attempted to access /api/v1/root-keys repeatedly", timestamp: "2026-06-11T23:54:00Z", ipAddress: "185.123.49.5", device: "Debian - untrusted-curl-client", type: "security", status: "alert" }
    ],
    securityEvents: [
      { id: "ev-2", event: "Untrusted Subnet Payload Injection Alarm", severity: "critical", timestamp: "2026-06-11T23:54:00Z", details: "WAF block triggered on route /api/v1/root-keys. User device parameters match untrusted VPN network. Node suspended automatically." }
    ]
  },
  {
    id: "usr-pm2",
    fullName: "Marcus Vane",
    email: "marcus@secureflow.app",
    phoneNumber: "+1 (555) 8872-451",
    department: "Ledger Payment Systems",
    role: "Project Manager",
    status: "Inactive",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    lastLogin: "2026-05-30T10:45:00Z",
    createdDate: "2025-06-12T08:00:00Z",
    projects: [
      { id: "proj-3", name: "Fedwire Payment Liquidity Engine", role: "Owner", progress: 96.8 }
    ],
    tasks: [],
    activities: [],
    securityEvents: []
  }
];

const DEFAULT_ROLES: RoleDTO[] = [
  {
    id: "role-admin",
    name: "Admin",
    description: "Full cryptographic key rotation, IAM privilege administration, raw monitoring, ledger auditing, and general platform deployment actions.",
    color: "rose",
    usersCount: 1,
    permissionsCount: 80,
    accessLevel: "Full Control",
    createdDate: "2025-01-01T00:00:00Z",
    permissions: [
      "dashboard.read", "dashboard.write",
      "projects.read", "projects.write", "projects.update", "projects.delete",
      "tasks.read", "tasks.write", "tasks.update", "tasks.delete", "tasks.assign",
      "users.read", "users.write", "users.update", "users.delete", "users.manage",
      "roles.read", "roles.write", "roles.update", "roles.delete",
      "audit.read", "audit.export",
      "ids.read", "ids.manage",
      "security.read", "security.manage",
      "reports.read", "reports.export",
      "settings.read", "settings.write"
    ]
  },
  {
    id: "role-pm",
    name: "Project Manager",
    description: "Sprint scheduling, task creation and dispatching, pipeline deployment monitoring, team throughput summary report generation.",
    color: "amber",
    usersCount: 2,
    permissionsCount: 45,
    accessLevel: "Write & Manage",
    createdDate: "2025-01-02T00:00:00Z",
    permissions: [
      "dashboard.read",
      "projects.read", "projects.write", "projects.update",
      "tasks.read", "tasks.write", "tasks.update", "tasks.assign",
      "audit.read",
      "ids.read",
      "reports.read", "reports.export",
      "settings.read"
    ]
  },
  {
    id: "role-dev",
    name: "Developer",
    description: "Core software engineering workflows, secure task compilation reviews, local sandbox debugging operations, read-only system metrics.",
    color: "emerald",
    usersCount: 3,
    permissionsCount: 22,
    accessLevel: "Reviewer / Read Only",
    createdDate: "2025-01-03T00:00:00Z",
    permissions: [
      "dashboard.read",
      "projects.read",
      "tasks.read", "tasks.update",
      "reports.read",
      "settings.read"
    ]
  }
];

const DEFAULT_MODULE_ROWS: string[][] = [
  ["dashboard", "Dashboard"],
  ["projects", "Projects"],
  ["tasks", "Tasks"],
  ["users", "Users"],
  ["roles", "Roles Management"],
  ["audit", "Cryptographic Audit Logs"],
  ["ids", "Intrusion Detection System (IDS)"],
  ["security", "Threat Analytics"],
  ["reports", "Compliance Reports"],
  ["settings", "System Settings"]
];

// Helper to initialize local storage
const initLocalStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ROLES)) {
    localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(DEFAULT_ROLES));
  }
};

const getStoredUsers = (): UserDTO[] => {
  initLocalStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || "[]");
};

const saveStoredUsers = (users: UserDTO[]) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

const getStoredRoles = (): RoleDTO[] => {
  initLocalStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.ROLES) || "[]");
};

const saveStoredRoles = (roles: RoleDTO[]) => {
  localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(roles));
};

// Simulation Delay helper
const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

export const SecureFlowApiService = {
  // ================= USERS MODULE =================
  async getUsers(): Promise<UserDTO[]> {
    await delay(350);
    return getStoredUsers();
  },

  async getUserById(id: string): Promise<UserDTO | null> {
    await delay(200);
    const users = getStoredUsers();
    return users.find(u => u.id === id) || null;
  },

  async createUser(user: Omit<UserDTO, "id" | "createdDate" | "lastLogin">): Promise<UserDTO> {
    await delay(500);
    const users = getStoredUsers();
    const newUser: UserDTO = {
      ...user,
      id: "usr-" + Math.random().toString(36).substr(2, 9),
      createdDate: new Date().toISOString(),
      lastLogin: undefined,
      projects: [],
      tasks: [],
      activities: [
        {
          id: "act-init",
          action: "Account initialized",
          timestamp: new Date().toISOString(),
          ipAddress: "127.0.0.1",
          device: "SecOps System Hook",
          type: "auth",
          status: "success"
        }
      ],
      securityEvents: []
    };

    const finalUsers = [newUser, ...users];
    saveStoredUsers(finalUsers);

    // Sync Roles User Counts
    this.syncRolesUserCounts();

    return newUser;
  },

  async updateUser(id: string, updatedFields: Partial<UserDTO>): Promise<UserDTO> {
    await delay(500);
    const users = getStoredUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error(`User with ID ${id} not found.`);
    }

    // Capture changes for activity log
    const prevUser = users[index];
    const auditActivities = [...(prevUser.activities || [])];
    
    if (updatedFields.role && updatedFields.role !== prevUser.role) {
      auditActivities.unshift({
        id: "act-audit-" + Date.now(),
        action: `Primacy state upgraded. Role shifted: "${prevUser.role}" -> "${updatedFields.role}"`,
        timestamp: new Date().toISOString(),
        ipAddress: "10.0.4.150",
        device: "SecOps Controller Interface",
        type: "security",
        status: "warning"
      });
    }

    if (updatedFields.status && updatedFields.status !== prevUser.status) {
      auditActivities.unshift({
        id: "act-audit-status-" + Date.now(),
        action: `Access criteria modifed. Status modified: "${prevUser.status}" -> "${updatedFields.status}"`,
        timestamp: new Date().toISOString(),
        ipAddress: "10.0.4.150",
        device: "SecOps Controller Interface",
        type: "security",
        status: updatedFields.status === "Suspended" ? "alert" : "warning"
      });
    }

    const updatedUser: UserDTO = {
      ...prevUser,
      ...updatedFields,
      activities: auditActivities
    };

    users[index] = updatedUser;
    saveStoredUsers(users);

    // Sync Roles User Counts
    this.syncRolesUserCounts();

    return updatedUser;
  },

  async deleteUser(id: string): Promise<boolean> {
    await delay(400);
    const users = getStoredUsers();
    const filteredUsers = users.filter(u => u.id !== id);
    if (users.length === filteredUsers.length) {
      return false;
    }
    saveStoredUsers(filteredUsers);
    
    // Sync Roles User Counts
    this.syncRolesUserCounts();
    return true;
  },


  // ================= ROLES MODULE =================
  async getRoles(): Promise<RoleDTO[]> {
    await delay(300);
    return getStoredRoles();
  },

  async getRoleById(id: string): Promise<RoleDTO | null> {
    await delay(200);
    const roles = getStoredRoles();
    return roles.find(r => r.id === id) || null;
  },

  async createRole(role: Omit<RoleDTO, "id" | "createdDate" | "usersCount">): Promise<RoleDTO> {
    await delay(450);
    const roles = getStoredRoles();
    
    const newRole: RoleDTO = {
      ...role,
      id: "role-" + Math.random().toString(36).substr(2, 9),
      usersCount: 0,
      createdDate: new Date().toISOString()
    };

    const finalRoles = [...roles, newRole];
    saveStoredRoles(finalRoles);
    return newRole;
  },

  async updateRole(id: string, updatedFields: Partial<RoleDTO>): Promise<RoleDTO> {
    await delay(450);
    const roles = getStoredRoles();
    const index = roles.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error(`Role with ID ${id} not found.`);
    }

    const updatedRole: RoleDTO = {
      ...roles[index],
      ...updatedFields
    };

    roles[index] = updatedRole;
    saveStoredRoles(roles);
    return updatedRole;
  },

  async deleteRole(id: string): Promise<boolean> {
    await delay(350);
    const roles = getStoredRoles();
    const filteredRoles = roles.filter(r => r.id !== id);
    if (roles.length === filteredRoles.length) {
      return false;
    }
    saveStoredRoles(filteredRoles);
    return true;
  },

  async duplicateRole(id: string): Promise<RoleDTO> {
    await delay(400);
    const roles = getStoredRoles();
    const sourceRole = roles.find(r => r.id === id);
    if (!sourceRole) {
      throw new Error(`Role with ID ${id} not found.`);
    }

    const duplicatedRole: RoleDTO = {
      ...sourceRole,
      id: "role-" + Math.random().toString(36).substr(2, 9),
      name: `${sourceRole.name} (Copy)`,
      usersCount: 0,
      createdDate: new Date().toISOString()
    };

    const finalRoles = [...roles, duplicatedRole];
    saveStoredRoles(finalRoles);
    return duplicatedRole;
  },


  // ================= PERMISSION MATRIX =================
  async getPermissionMatrixForRole(roleName: string): Promise<PermissionMatrixRow[]> {
    await delay(250);
    const roles = getStoredRoles();
    const matchedRole = roles.find(r => r.name.toLowerCase() === roleName.toLowerCase());
    const permissions = matchedRole ? matchedRole.permissions : [];

    // Create a rows list from defaults
    return DEFAULT_MODULE_ROWS.map(([moduleKey, display]) => {
      return {
        module: moduleKey,
        displayName: display,
        permissions: {
          read: permissions.includes(`${moduleKey}.read`) || permissions.includes(`${moduleKey}.manage`),
          write: permissions.includes(`${moduleKey}.write`) || permissions.includes(`${moduleKey}.manage`),
          update: permissions.includes(`${moduleKey}.update`) || permissions.includes(`${moduleKey}.manage`),
          delete: permissions.includes(`${moduleKey}.delete`) || permissions.includes(`${moduleKey}.manage`),
          approve: permissions.includes(`${moduleKey}.approve`) || permissions.includes(`${moduleKey}.manage`),
          export: permissions.includes(`${moduleKey}.export`) || permissions.includes(`${moduleKey}.manage`),
          assign: permissions.includes(`${moduleKey}.assign`) || permissions.includes(`${moduleKey}.manage`),
          manage: permissions.includes(`${moduleKey}.manage`)
        }
      };
    });
  },

  async savePermissionMatrixForRole(roleName: string, rows: PermissionMatrixRow[]): Promise<boolean> {
    await delay(500);
    const roles = getStoredRoles();
    const index = roles.findIndex(r => r.name.toLowerCase() === roleName.toLowerCase());
    if (index === -1) return false;

    // Build permissions list from rows
    const permissionsList: string[] = [];
    rows.forEach(row => {
      const keys = Object.keys(row.permissions) as Array<keyof typeof row.permissions>;
      keys.forEach(key => {
        if (row.permissions[key]) {
          permissionsList.push(`${row.module}.${key}`);
        }
      });
    });

    roles[index].permissions = permissionsList;
    roles[index].permissionsCount = permissionsList.length;
    saveStoredRoles(roles);
    return true;
  },


  // ================= SYNCHRONIZATION HELPERS =================
  syncRolesUserCounts() {
    const roles = JSON.parse(localStorage.getItem(STORAGE_KEYS.ROLES) || "[]") as RoleDTO[];
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || "[]") as UserDTO[];

    const updatedRoles = roles.map(role => {
      const count = users.filter(user => user.role.toLowerCase() === role.name.toLowerCase()).length;
      return {
        ...role,
        usersCount: count
      };
    });

    localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(updatedRoles));
  }
};
