import { Project, ProjectActivity, ProjectSummary, ProjectMember } from "../types/project-task";

const STORAGE_KEYS = {
  PROJECTS: "secureflow_projects",
  PROJECT_ACTIVITIES: "secureflow_project_activities"
};

const DEFAULT_MEMBERS: ProjectMember[] = [
  {
    id: "usr-pm",
    fullName: "Sarah Jenkins",
    email: "pm@secureflow.app",
    role: "Lead Portfolio Manager",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    onlineStatus: "online",
    capacity: 90
  },
  {
    id: "usr-dev1",
    fullName: "Kaelen Mercer",
    email: "dev@secureflow.app",
    role: "Lead Cryptography Engineer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    onlineStatus: "online",
    capacity: 75
  },
  {
    id: "usr-dev2",
    fullName: "Elena Petrova",
    email: "elena@secureflow.app",
    role: "Identity Architect",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    onlineStatus: "online",
    capacity: 60
  },
  {
    id: "usr-dev3",
    fullName: "Helena Wu",
    email: "helena@secureflow.app",
    role: "Compliance Auditor",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
    onlineStatus: "away",
    capacity: 10
  }
];

const DEFAULT_PROJECTS: Project[] = [
  {
    id: "proj-1",
    name: "Commercial Banking Portal",
    key: "CBP",
    description: "Multi-factor authenticated commercial banking portal for enterprise transactions. Incorporates transaction signing and hardware security modules (HSM) bridging secure endpoints.",
    projectManager: "Sarah Jenkins",
    projectManagerId: "usr-pm",
    teamMembers: [DEFAULT_MEMBERS[0], DEFAULT_MEMBERS[1], DEFAULT_MEMBERS[2]],
    startDate: "2026-01-10",
    deadline: "2026-08-30",
    priority: "High",
    status: "Active",
    department: "Secured Banking",
    tags: ["HSM", "Audit", "React", "OAuth"],
    riskLevel: "Medium",
    budget: 450000,
    visibility: "Internal",
    progress: 72,
    createdDate: "2026-01-10T08:00:00Z"
  },
  {
    id: "proj-2",
    name: "SWIFT Gateway Reconciler",
    key: "SGR",
    description: "Automated reconciliation pipeline parsing daily standard financial transaction records and validating integrity against local ledger accounts to avoid double-spend attacks.",
    projectManager: "Alex Rivera",
    projectManagerId: "usr-admin",
    teamMembers: [DEFAULT_MEMBERS[1], DEFAULT_MEMBERS[3]],
    startDate: "2026-03-01",
    deadline: "2026-06-25",
    priority: "Critical",
    status: "Active",
    department: "Compliance Architecture",
    tags: ["SWIFT", "Ledger", "Security"],
    riskLevel: "High",
    budget: 280000,
    visibility: "Private",
    progress: 89,
    createdDate: "2026-03-01T09:15:00Z"
  },
  {
    id: "proj-3",
    name: "Fedwire Liquidity Engine",
    key: "FLE",
    description: "A highly resilient liquidity routing core that connects regional bank balances to Fedwire settlement accounts, prioritizing transaction sequences by treasury cost benchmarks.",
    projectManager: "Sarah Jenkins",
    projectManagerId: "usr-pm",
    teamMembers: [DEFAULT_MEMBERS[0], DEFAULT_MEMBERS[2], DEFAULT_MEMBERS[3]],
    startDate: "2026-05-15",
    deadline: "2026-11-20",
    priority: "High",
    status: "Planning",
    department: "Treasury Operations",
    tags: ["Payments", "Liquidity", "Fedwire"],
    riskLevel: "Critical",
    budget: 950000,
    visibility: "Internal",
    progress: 15,
    createdDate: "2026-05-15T11:00:00Z"
  },
  {
    id: "proj-4",
    name: "Retail Card Ledger Integration",
    key: "RCL",
    description: "API microservice connecting Visa/Mastercard processing logs with Core Banking ledger networks for direct debit clearing operations.",
    projectManager: "Marcus Vane",
    projectManagerId: "usr-pm2",
    teamMembers: [DEFAULT_MEMBERS[2], DEFAULT_MEMBERS[3]],
    startDate: "2025-08-01",
    deadline: "2025-12-15",
    priority: "Low",
    status: "Completed",
    department: "Consumer Credit",
    tags: ["Card", "API", "Visa"],
    riskLevel: "Low",
    budget: 150000,
    visibility: "Public",
    progress: 100,
    createdDate: "2025-08-01T08:00:00Z"
  },
  {
    id: "proj-5",
    name: "HSM Hardware Upgrade Initiative",
    key: "HHU",
    description: "Upgrade phase replacing aging physical HSM card units across three critical hosting zones. Incorporates safe dual-key backups and zero-downtime cutover scripts.",
    projectManager: "Alex Rivera",
    projectManagerId: "usr-admin",
    teamMembers: [DEFAULT_MEMBERS[1]],
    startDate: "2026-02-10",
    deadline: "2026-06-18",
    priority: "Critical",
    status: "On Hold",
    department: "Infrastructure Security",
    tags: ["Upgrade", "Hardware", "Backup"],
    riskLevel: "High",
    budget: 320000,
    visibility: "Private",
    progress: 60,
    createdDate: "2026-02-10T10:30:00Z"
  }
];

const DEFAULT_ACTIVITIES: Record<string, ProjectActivity[]> = {
  "proj-1": [
    { id: "act-101", user: "Sarah Jenkins", action: "Updated Project Timeline parameters", timestamp: "2026-06-19T01:05:00Z", targetType: "project" },
    { id: "act-102", user: "Kaelen Mercer", action: "Submitted revision code for JWT alg verification review", timestamp: "2026-06-18T18:20:00Z", targetType: "task" },
    { id: "act-103", user: "Elena Petrova", action: "Linked secure HSM certificate package files", timestamp: "2026-06-17T14:40:00Z", targetType: "file" }
  ],
  "proj-2": [
    { id: "act-201", user: "Alex Rivera", action: "Executed master deployment staging validation script", timestamp: "2026-06-19T02:15:00Z", targetType: "project" },
    { id: "act-202", user: "Helena Wu", action: "Completed full transaction log schema dry-run audit", timestamp: "2026-06-16T11:55:00Z", targetType: "security" }
  ]
};

const initLocalStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(DEFAULT_PROJECTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROJECT_ACTIVITIES)) {
    localStorage.setItem(STORAGE_KEYS.PROJECT_ACTIVITIES, JSON.stringify(DEFAULT_ACTIVITIES));
  }
};

const getStoredProjects = (): Project[] => {
  initLocalStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || "[]");
};

const saveStoredProjects = (projects: Project[]) => {
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
};

const getStoredActivities = (): Record<string, ProjectActivity[]> => {
  initLocalStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECT_ACTIVITIES) || "{}");
};

const saveStoredActivities = (activities: Record<string, ProjectActivity[]>) => {
  localStorage.setItem(STORAGE_KEYS.PROJECT_ACTIVITIES, JSON.stringify(activities));
};

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const ProjectApiService = {
  async getProjects(): Promise<Project[]> {
    await delay(350);
    return getStoredProjects();
  },

  async getProjectById(id: string): Promise<Project | null> {
    await delay(150);
    const projects = getStoredProjects();
    return projects.find((p) => p.id === id) || null;
  },

  async createProject(project: Omit<Project, "id" | "progress" | "createdDate">): Promise<Project> {
    await delay(450);
    const projects = getStoredProjects();
    const newProject: Project = {
      ...project,
      id: "proj-" + Math.random().toString(36).substr(2, 9),
      progress: project.status === "Completed" ? 100 : 0,
      createdDate: new Date().toISOString()
    };
    
    // Add default manager if missing or empty
    if (!newProject.projectManager) {
      newProject.projectManager = "Sarah Jenkins";
      newProject.projectManagerId = "usr-pm";
    }

    const finalProjects = [newProject, ...projects];
    saveStoredProjects(finalProjects);

    // Save initial activity
    const activities = getStoredActivities();
    const projectActivities = activities[newProject.id] || [];
    projectActivities.unshift({
      id: "act-" + Math.random().toString(36).substr(2, 9),
      user: "System Admin",
      action: `Created new project portfolio "${newProject.name}" [code: ${newProject.key}]`,
      timestamp: new Date().toISOString(),
      targetType: "project"
    });
    activities[newProject.id] = projectActivities;
    saveStoredActivities(activities);

    return newProject;
  },

  async updateProject(id: string, updatedFields: Partial<Project>): Promise<Project> {
    await delay(400);
    const projects = getStoredProjects();
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Project node with unique ID "${id}" is non-existent within registry.`);
    }

    const prevProj = projects[index];
    const updatedProj: Project = {
      ...prevProj,
      ...updatedFields
    };

    // Auto update progress according to status
    if (updatedFields.status === "Completed") {
      updatedProj.progress = 100;
    } else if (updatedFields.status === "Planning" && prevProj.status !== "Planning") {
      updatedProj.progress = 0;
    }

    projects[index] = updatedProj;
    saveStoredProjects(projects);

    // Save activity
    const activities = getStoredActivities();
    const projectActivities = activities[id] || [];
    const changedKeys = Object.keys(updatedFields).filter(k => (updatedFields as any)[k] !== (prevProj as any)[k]);
    if (changedKeys.length > 0) {
      projectActivities.unshift({
        id: "act-" + Math.random().toString(36).substr(2, 9),
        user: "System Operations",
        action: `Modified parameters: ${changedKeys.join(", ")}`,
        timestamp: new Date().toISOString(),
        targetType: "project"
      });
      activities[id] = projectActivities;
      saveStoredActivities(activities);
    }

    return updatedProj;
  },

  async deleteProject(id: string): Promise<boolean> {
    await delay(300);
    const projects = getStoredProjects();
    const filtered = projects.filter((p) => p.id !== id);
    if (projects.length === filtered.length) {
      return false;
    }
    saveStoredProjects(filtered);

    // Cleanup activities
    const activities = getStoredActivities();
    delete activities[id];
    saveStoredActivities(activities);
    return true;
  },

  async getProjectActivities(projectId: string): Promise<ProjectActivity[]> {
    await delay(150);
    const activities = getStoredActivities();
    return activities[projectId] || [];
  },

  async getProjectSummary(): Promise<ProjectSummary> {
    const projects = getStoredProjects();
    const currentDate = new Date();
    
    let active = 0;
    let completed = 0;
    let delayed = 0;
    let critical = 0;
    let upcomingDeadlines = 0;

    projects.forEach((p) => {
      if (p.status === "Active") active++;
      if (p.status === "Completed") completed++;
      if (p.priority === "Critical") critical++;
      
      const deadlineDate = new Date(p.deadline);
      const isOverdue = deadlineDate < currentDate && p.status !== "Completed";
      if (isOverdue) delayed++;

      // Deadline within 10 days
      const diffTime = deadlineDate.getTime() - currentDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays <= 10 && p.status !== "Completed") upcomingDeadlines++;
    });

    return {
      total: projects.length,
      active,
      completed,
      delayed,
      critical,
      upcomingDeadlines
    };
  },

  async addProjectMember(projectId: string, member: ProjectMember): Promise<Project> {
    const projects = getStoredProjects();
    const index = projects.findIndex((p) => p.id === projectId);
    if (index === -1) throw new Error("Project not found");
    
    const proj = projects[index];
    if (proj.teamMembers.some((m) => m.id === member.id)) {
       throw new Error("Member is already allocated to this system node");
    }

    proj.teamMembers.push(member);
    projects[index] = proj;
    saveStoredProjects(projects);

    // Save activity
    const activities = getStoredActivities();
    const projectActivities = activities[projectId] || [];
    projectActivities.unshift({
      id: "act-" + Math.random().toString(36).substr(2, 9),
      user: "SecOps Coordinator",
      action: `Added team member "${member.fullName}" with role ${member.role}`,
      timestamp: new Date().toISOString(),
      targetType: "team"
    });
    activities[projectId] = projectActivities;
    saveStoredActivities(activities);

    return proj;
  },

  async removeProjectMember(projectId: string, memberId: string): Promise<Project> {
    const projects = getStoredProjects();
    const index = projects.findIndex((p) => p.id === projectId);
    if (index === -1) throw new Error("Project not found");

    const proj = projects[index];
    const removedMember = proj.teamMembers.find(m => m.id === memberId);
    proj.teamMembers = proj.teamMembers.filter((m) => m.id !== memberId);
    projects[index] = proj;
    saveStoredProjects(projects);

    if (removedMember) {
      const activities = getStoredActivities();
      const projectActivities = activities[projectId] || [];
      projectActivities.unshift({
        id: "act-" + Math.random().toString(36).substr(2, 9),
        user: "SecOps Coordinator",
        action: `Removed team member "${removedMember.fullName}" from project registry`,
        timestamp: new Date().toISOString(),
        targetType: "team"
      });
      activities[projectId] = projectActivities;
      saveStoredActivities(activities);
    }

    return proj;
  }
};
