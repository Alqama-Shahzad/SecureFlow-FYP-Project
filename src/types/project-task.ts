export type ProjectStatus = "Planning" | "Active" | "On Hold" | "Completed" | "Cancelled";
export type ProjectPriority = "Low" | "Medium" | "High" | "Critical";
export type ProjectVisibility = "Private" | "Internal" | "Public";
export type ProjectRiskLevel = "Low" | "Medium" | "High" | "Critical";

export interface ProjectMember {
  id: string;
  fullName: string;
  email: string;
  role: string;
  avatar?: string;
  onlineStatus: "online" | "offline" | "away";
  capacity: number; // Percentage, e.g. 80
}

export interface Project {
  id: string;
  name: string;
  key: string; // Project key (e.g., "SWIFT")
  description: string;
  projectManager: string; // PM name or ID
  projectManagerId?: string;
  teamMembers: ProjectMember[];
  startDate: string;
  deadline: string;
  priority: ProjectPriority;
  status: ProjectStatus;
  department: string;
  tags: string[];
  riskLevel: ProjectRiskLevel;
  budget: number;
  visibility: ProjectVisibility;
  progress: number; // 0 to 100
  createdDate: string;
}

export type TaskStatus = "Todo" | "In Progress" | "Review" | "Done";
export type TaskPriority = "Low" | "Medium" | "High" | "Critical";

export interface TaskAttachment {
  id: string;
  name: string;
  size: string;
  type: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  version: number;
}

export interface TaskComment {
  id: string;
  author: string;
  authorAvatar?: string;
  content: string;
  timestamp: string;
  reactions?: Array<{ emoji: string; count: number; users: string[] }>;
  replies?: TaskComment[];
}

export interface TaskHistory {
  id: string;
  user: string;
  action: string; // e.g., "Status updated", "Assigned Kaelen Mercer"
  timestamp: string;
  from?: string;
  to?: string;
}

export interface Task {
  id: string; // e.g., "TSK-001"
  title: string;
  description: string;
  projectId: string;
  projectName: string;
  projectKey: string;
  assigneeId?: string;
  assigneeName?: string;
  assigneeAvatar?: string;
  priority: TaskPriority;
  status: TaskStatus;
  labels: string[];
  dueDate: string;
  estimatedHours: number;
  attachments: TaskAttachment[];
  comments: TaskComment[];
  dependencies: string[]; // List of other task IDs
  progress: number;
  createdDate: string;
}

export interface ProjectActivity {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  target?: string;
  targetType: "task" | "project" | "team" | "file" | "security";
}

export interface ProjectSummary {
  total: number;
  active: number;
  completed: number;
  delayed: number;
  critical: number;
  upcomingDeadlines: number;
}
