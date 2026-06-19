import { Task, TaskComment, TaskAttachment, TaskHistory, TaskStatus, TaskPriority } from "../types/project-task";

const STORAGE_KEYS = {
  TASKS: "secureflow_tasks",
  TASK_HISTORY: "secureflow_task_history"
};

const DEFAULT_TASKS: Task[] = [
  {
    id: "TSK-101",
    title: "Enforce JWT Signing Algorithm HS512",
    description: "Refactor security tokens middleware block to disallow fallback HS256 signatures, mandating at least HS512 cryptographic verification keys. Verify HSM interaction metrics under heavy payload conditions.",
    projectId: "proj-1",
    projectName: "Commercial Banking Portal",
    projectKey: "CBP",
    assigneeId: "usr-dev1",
    assigneeName: "Kaelen Mercer",
    assigneeAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    priority: "Critical",
    status: "In Progress",
    labels: ["Security", "Backend", "JWT"],
    dueDate: "2026-06-25",
    estimatedHours: 16,
    progress: 75,
    dependencies: [],
    createdDate: "2026-06-10T08:00:00Z",
    attachments: [
      {
        id: "att-1",
        name: "HS512_Specification_Internal.pdf",
        size: "240 KB",
        type: "pdf",
        url: "#",
        uploadedBy: "Alex Rivera",
        uploadedAt: "2026-06-11T10:30:00Z",
        version: 1
      }
    ],
    comments: [
      {
        id: "com-1",
        author: "Sarah Jenkins",
        authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
        content: "Please ensure unit benchmarks verify latency overhead of HS512 stays below 3ms per handshake cycle on our target nodes.",
        timestamp: "2026-06-12T09:15:00Z",
        reactions: [{ emoji: "👍", count: 2, users: ["usr-admin", "usr-dev1"] }]
      },
      {
        id: "com-2",
        author: "Kaelen Mercer",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        content: "Will verify in test harnesses first. Benchmark scripts uploaded to files directory.",
        timestamp: "2026-06-12T14:40:00Z"
      }
    ]
  },
  {
    id: "TSK-102",
    title: "TLS 1.3 Strict Compliance Cipher Migration",
    description: "Harden NGINX and microservice entrypoints, dropping retro-compatibility for TLS 1.0/1.1/1.2 entirely. Enforce restricted cipher suites (e.g., TLS_AES_256_GCM_SHA384).",
    projectId: "proj-1",
    projectName: "Commercial Banking Portal",
    projectKey: "CBP",
    assigneeId: "usr-dev1",
    assigneeName: "Kaelen Mercer",
    assigneeAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    priority: "Critical",
    status: "Todo",
    labels: ["Infrastructure", "SSL-TLS"],
    dueDate: "2026-06-20",
    estimatedHours: 24,
    progress: 0,
    dependencies: [],
    createdDate: "2026-06-14T11:00:00Z",
    attachments: [],
    comments: []
  },
  {
    id: "TSK-103",
    title: "Sanitize SQL Parameters in Ledger Vault",
    description: "Inspect Drizzle query mappings and bulk transaction executions inside accounting vaults. Eliminate dynamic raw query builders with strict prepared queries.",
    projectId: "proj-2",
    projectName: "SWIFT Gateway Reconciler",
    projectKey: "SGR",
    assigneeId: "usr-dev2",
    assigneeName: "Elena Petrova",
    assigneeAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    priority: "High",
    status: "Review",
    labels: ["Database", "Ledger"],
    dueDate: "2026-06-19",
    estimatedHours: 12,
    progress: 90,
    dependencies: [],
    createdDate: "2026-06-15T09:30:00Z",
    attachments: [],
    comments: [
      {
        id: "com-3",
        author: "Alex Rivera",
        authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        content: "Looks good. Elena, can you do a quick audit of the batch query statements inside Drizzle files to assure SQL injection filters are coverage-tested?",
        timestamp: "2026-06-18T16:00:00Z"
      }
    ]
  },
  {
    id: "TSK-104",
    title: "HSM Virtual Key Backup Validation Review",
    description: "Validate automated daily backups of AES wrapping keys from physical HSM cards. Ensure direct replication to isolated DR secure zones operates cleanly.",
    projectId: "proj-2",
    projectName: "SWIFT Gateway Reconciler",
    projectKey: "SGR",
    assigneeId: "usr-admin",
    assigneeName: "Alex Rivera",
    assigneeAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    priority: "Critical",
    status: "Todo",
    labels: ["Security", "Infrastructure", "HSM"],
    dueDate: "2026-07-02",
    estimatedHours: 8,
    progress: 0,
    dependencies: [],
    createdDate: "2026-06-16T15:00:00Z",
    attachments: [],
    comments: []
  },
  {
    id: "TSK-105",
    title: "Performance Optimisation of SWIFT Buffer Indexes",
    description: "Prisma schema index modifications. Add composite indexes on matching sequence log columns and processing timestamps to cut table-scan latency in half.",
    projectId: "proj-2",
    projectName: "SWIFT Gateway Reconciler",
    projectKey: "SGR",
    assigneeId: "usr-dev2",
    assigneeName: "Elena Petrova",
    assigneeAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    priority: "Medium",
    status: "In Progress",
    labels: ["Database", "SQL"],
    dueDate: "2026-06-30",
    estimatedHours: 18,
    progress: 40,
    dependencies: [],
    createdDate: "2026-06-12T10:00:00Z",
    attachments: [],
    comments: []
  },
  {
    id: "TSK-106",
    title: "Draft Settlement Flow Specs",
    description: "Design comprehensive multi-sig transaction pipeline documentation. Map the visual approval state transitions from regional treasuries to Fedwire routing engines.",
    projectId: "proj-3",
    projectName: "Fedwire Liquidity Engine",
    projectKey: "FLE",
    assigneeId: "usr-pm",
    assigneeName: "Sarah Jenkins",
    assigneeAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    priority: "Low",
    status: "Todo",
    labels: ["Documentation", "Fedwire"],
    dueDate: "2026-06-28",
    estimatedHours: 6,
    progress: 10,
    dependencies: [],
    createdDate: "2026-06-17T11:45:00Z",
    attachments: [],
    comments: []
  },
  {
    id: "TSK-107",
    title: "Harden API Keys with HSM Root Wrapper",
    description: "Write automated rotational hook. Sync API keys securely by enclosing them in the root Key-Encrypting-Key (KEK) wrappers inside AWS CloudHSM modules.",
    projectId: "proj-5",
    projectName: "HSM Hardware Upgrade Initiative",
    projectKey: "HHU",
    assigneeId: "usr-dev1",
    assigneeName: "Kaelen Mercer",
    assigneeAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    priority: "High",
    status: "Done",
    labels: ["Security", "Hardware"],
    dueDate: "2026-06-15",
    estimatedHours: 32,
    progress: 100,
    dependencies: [],
    createdDate: "2026-06-01T08:00:00Z",
    attachments: [],
    comments: []
  }
];

const DEFAULT_HISTORY: Record<string, TaskHistory[]> = {
  "TSK-101": [
    { id: "h-1", user: "Sarah Jenkins", action: "Assigned project task to Kaelen Mercer", timestamp: "2026-06-11T11:00:00Z" },
    { id: "h-2", user: "Kaelen Mercer", action: "Shifted status from Todo -> In Progress", timestamp: "2026-06-12T10:15:00Z" },
    { id: "h-3", user: "Kaelen Mercer", action: "Added benchmark attachment", timestamp: "2026-06-12T14:41:00Z" }
  ],
  "TSK-103": [
    { id: "h-4", user: "Elena Petrova", action: "Shifted status from In Progress -> Review", timestamp: "2026-06-18T15:15:00Z" }
  ]
};

const initLocalStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(DEFAULT_TASKS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TASK_HISTORY)) {
    localStorage.setItem(STORAGE_KEYS.TASK_HISTORY, JSON.stringify(DEFAULT_HISTORY));
  }
};

const getStoredTasks = (): Task[] => {
  initLocalStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || "[]");
};

const saveStoredTasks = (tasks: Task[]) => {
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
};

const getStoredHistory = (): Record<string, TaskHistory[]> => {
  initLocalStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.TASK_HISTORY) || "{}");
};

const saveStoredHistory = (history: Record<string, TaskHistory[]>) => {
  localStorage.setItem(STORAGE_KEYS.TASK_HISTORY, JSON.stringify(history));
};

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export const TaskApiService = {
  async getTasks(projectId?: string): Promise<Task[]> {
    await delay(300);
    const tasks = getStoredTasks();
    if (projectId) {
      return tasks.filter((t) => t.projectId === projectId);
    }
    return tasks;
  },

  async getTaskById(id: string): Promise<Task | null> {
    await delay(150);
    const tasks = getStoredTasks();
    return tasks.find((t) => t.id === id) || null;
  },

  async createTask(task: Omit<Task, "id" | "comments" | "attachments" | "createdDate" | "progress">): Promise<Task> {
    await delay(450);
    const tasks = getStoredTasks();
    const taskCount = tasks.length + 101;
    const newTask: Task = {
      ...task,
      id: `TSK-${taskCount}`,
      comments: [],
      attachments: [],
      progress: task.status === "Done" ? 100 : task.status === "Review" ? 90 : task.status === "In Progress" ? 25 : 0,
      createdDate: new Date().toISOString()
    };

    const finalTasks = [newTask, ...tasks];
    saveStoredTasks(finalTasks);

    // Initial history
    const historyMap = getStoredHistory();
    const taskHist = historyMap[newTask.id] || [];
    taskHist.unshift({
      id: "hist-" + Math.random().toString(36).substr(2, 9),
      user: "System Operations",
      action: `Created cryptographic task node. Priority: ${newTask.priority}`,
      timestamp: new Date().toISOString()
    });
    historyMap[newTask.id] = taskHist;
    saveStoredHistory(historyMap);

    return newTask;
  },

  async updateTask(id: string, updatedFields: Partial<Task>): Promise<Task> {
    await delay(350);
    const tasks = getStoredTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error(`Task with ID "${id}" is non-existent within registry.`);
    }

    const prevTask = tasks[index];
    const updatedTask: Task = {
      ...prevTask,
      ...updatedFields
    };

    // Auto progress mapping
    if (updatedFields.status) {
      if (updatedFields.status === "Done") updatedTask.progress = 100;
      else if (updatedFields.status === "Review") updatedTask.progress = 90;
      else if (updatedFields.status === "In Progress" && prevTask.status === "Todo") updatedTask.progress = 25;
      else if (updatedFields.status === "Todo") updatedTask.progress = 0;
    }

    tasks[index] = updatedTask;
    saveStoredTasks(tasks);

    // Save history logs for auditing
    const historyMap = getStoredHistory();
    const taskHist = historyMap[id] || [];
    const changedKeys = Object.keys(updatedFields).filter(
      (k) => (updatedFields as any)[k] !== (prevTask as any)[k]
    );

    if (changedKeys.length > 0) {
      changedKeys.forEach((key) => {
        let actionStr = `Updated parameter: "${key}"`;
        if (key === "status") {
          actionStr = `Shifted status from [${prevTask.status}] to [${updatedTask.status}]`;
        } else if (key === "assigneeName") {
          actionStr = `Reassigned task node to ${updatedTask.assigneeName || "Unassigned"}`;
        }

        taskHist.unshift({
          id: "hist-" + Math.random().toString(36).substr(2, 9),
          user: "Security Controller",
          action: actionStr,
          timestamp: new Date().toISOString(),
          from: (prevTask as any)[key]?.toString(),
          to: (updatedTask as any)[key]?.toString()
        });
      });
      historyMap[id] = taskHist;
      saveStoredHistory(historyMap);
    }

    return updatedTask;
  },

  async deleteTask(id: string): Promise<boolean> {
    await delay(250);
    const tasks = getStoredTasks();
    const filtered = tasks.filter((t) => t.id !== id);
    if (tasks.length === filtered.length) {
      return false;
    }
    saveStoredTasks(filtered);

    // Cleanup history
    const historyMap = getStoredHistory();
    delete historyMap[id];
    saveStoredHistory(historyMap);
    return true;
  },

  async addComment(taskId: string, author: string, content: string, avatar?: string): Promise<TaskComment> {
    await delay(200);
    const tasks = getStoredTasks();
    const index = tasks.findIndex((t) => t.id === taskId);
    if (index === -1) throw new Error("Task not found");

    const newComment: TaskComment = {
      id: "com-" + Math.random().toString(36).substr(2, 9),
      author,
      authorAvatar: avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      content,
      timestamp: new Date().toISOString(),
      reactions: []
    };

    tasks[index].comments.push(newComment);
    saveStoredTasks(tasks);

    // Log in history
    const historyMap = getStoredHistory();
    const taskHist = historyMap[taskId] || [];
    taskHist.unshift({
      id: "hist-" + Math.random().toString(36).substr(2, 9),
      user: author,
      action: "Appended dynamic task thread discussion",
      timestamp: new Date().toISOString()
    });
    historyMap[taskId] = taskHist;
    saveStoredHistory(historyMap);

    return newComment;
  },

  async toggleReaction(taskId: string, commentId: string, emoji: string, user: string): Promise<TaskComment[]> {
    const tasks = getStoredTasks();
    const tIndex = tasks.findIndex((t) => t.id === taskId);
    if (tIndex === -1) throw new Error("Task not found");

    const t = tasks[tIndex];
    t.comments = t.comments.map((c) => {
      if (c.id === commentId) {
        let reactions = c.reactions || [];
        const existingReact = reactions.find((r) => r.emoji === emoji);
        if (existingReact) {
          if (existingReact.users.includes(user)) {
            // Remove user from reaction
            existingReact.users = existingReact.users.filter((u) => u !== user);
            existingReact.count--;
          } else {
            // Add user
            existingReact.users.push(user);
            existingReact.count++;
          }
        } else {
          // New reaction
          reactions.push({
            emoji,
            count: 1,
            users: [user]
          });
        }
        // Clean empty reactions
        reactions = reactions.filter((r) => r.count > 0);
        return {
          ...c,
          reactions
        };
      }
      return c;
    });

    tasks[tIndex] = t;
    saveStoredTasks(tasks);
    return t.comments;
  },

  async addAttachment(taskId: string, file: Omit<TaskAttachment, "id" | "uploadedAt" | "version">): Promise<TaskAttachment> {
    await delay(300);
    const tasks = getStoredTasks();
    const index = tasks.findIndex((t) => t.id === taskId);
    if (index === -1) throw new Error("Task not found");

    const newAttach: TaskAttachment = {
      ...file,
      id: "att-" + Math.random().toString(36).substr(2, 9),
      uploadedAt: new Date().toISOString(),
      version: 1
    };

    tasks[index].attachments.push(newAttach);
    saveStoredTasks(tasks);

    // History log
    const historyMap = getStoredHistory();
    const taskHist = historyMap[taskId] || [];
    taskHist.unshift({
      id: "hist-" + Math.random().toString(36).substr(2, 9),
      user: file.uploadedBy,
      action: `Uploaded cryptographic audit file asset: ${file.name}`,
      timestamp: new Date().toISOString()
    });
    historyMap[taskId] = taskHist;
    saveStoredHistory(historyMap);

    return newAttach;
  },

  async getTaskHistory(taskId: string): Promise<TaskHistory[]> {
    await delay(100);
    const historyMap = getStoredHistory();
    return historyMap[taskId] || [];
  }
};
