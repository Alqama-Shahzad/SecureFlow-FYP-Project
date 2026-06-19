import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectApiService as ProjService } from "../services/project.service";
import { TaskApiService as TaskService } from "../services/task.service";
import { Project, Task, ProjectMember, TaskComment, TaskAttachment } from "../types/project-task";

export const QUERY_KEYS = {
  PROJECTS: ["projects"] as const,
  PROJECT: (id: string) => ["projects", id] as const,
  PROJECT_SUMMARY: ["projects", "summary"] as const,
  PROJECT_ACTIVITIES: (id: string) => ["projects", id, "activities"] as const,
  TASKS: ["tasks"] as const,
  PROJECT_TASKS: (projectId?: string) => ["tasks", { projectId }] as const,
  TASK: (id: string) => ["tasks", id] as const,
  TASK_HISTORY: (id: string) => ["tasks", id, "history"] as const,
};

// ================= PROJECTS HOOKS =================

export function useProjects() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEYS.PROJECTS,
    queryFn: () => ProjService.getProjects(),
  });

  const createMutation = useMutation({
    mutationFn: (newProj: Omit<Project, "id" | "progress" | "createdDate">) =>
      ProjService.createProject(newProj),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECT_SUMMARY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, fields }: { id: string; fields: Partial<Project> }) =>
      ProjService.updateProject(id, fields),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECT(variables.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECT_SUMMARY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ProjService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECT_SUMMARY });
    },
  });

  return {
    projects: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createProject: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateProject: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteProject: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}

export function useProject(id: string) {
  const queryClient = useQueryClient();

  const projectQuery = useQuery({
    queryKey: QUERY_KEYS.PROJECT(id),
    queryFn: () => ProjService.getProjectById(id),
    enabled: !!id,
  });

  const activitiesQuery = useQuery({
    queryKey: QUERY_KEYS.PROJECT_ACTIVITIES(id),
    queryFn: () => ProjService.getProjectActivities(id),
    enabled: !!id,
  });

  const addMemberMutation = useMutation({
    mutationFn: (member: ProjectMember) => ProjService.addProjectMember(id, member),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECT(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECT_ACTIVITIES(id) });
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: (memberId: string) => ProjService.removeProjectMember(id, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECT(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECT_ACTIVITIES(id) });
    },
  });

  return {
    project: projectQuery.data,
    isLoading: projectQuery.isLoading,
    isError: projectQuery.isError,
    activities: activitiesQuery.data || [],
    isLoadingActivities: activitiesQuery.isLoading,
    addMember: addMemberMutation.mutateAsync,
    removeMember: removeMemberMutation.mutateAsync,
  };
}

export function useProjectSummary() {
  return useQuery({
    queryKey: QUERY_KEYS.PROJECT_SUMMARY,
    queryFn: () => ProjService.getProjectSummary(),
  });
}

// ================= TASKS HOOKS =================

export function useTasks(projectId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEYS.PROJECT_TASKS(projectId),
    queryFn: () => TaskService.getTasks(projectId),
  });

  const createMutation = useMutation({
    mutationFn: (newTask: Omit<Task, "id" | "comments" | "attachments" | "createdDate" | "progress">) =>
      TaskService.createTask(newTask),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECT_TASKS(variables.projectId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECT_TASKS(undefined) });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, fields }: { id: string; fields: Partial<Task> }) =>
      TaskService.updateTask(id, fields),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECT_TASKS(data.projectId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECT_TASKS(undefined) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASK(data.id) });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id, projectId }: { id: string; projectId: string }) =>
      TaskService.deleteTask(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECT_TASKS(variables.projectId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECT_TASKS(undefined) });
    },
  });

  return {
    tasks: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createTask: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateTask: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteTask: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}

export function useTask(id: string) {
  const queryClient = useQueryClient();

  const taskQuery = useQuery({
    queryKey: QUERY_KEYS.TASK(id),
    queryFn: () => TaskService.getTaskById(id),
    enabled: !!id,
  });

  const historyQuery = useQuery({
    queryKey: QUERY_KEYS.TASK_HISTORY(id),
    queryFn: () => TaskService.getTaskHistory(id),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (fields: Partial<Task>) => TaskService.updateTask(id, fields),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASK(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASK_HISTORY(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECT_TASKS(data.projectId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECT_TASKS(undefined) });
    },
  });

  const commentMutation = useMutation({
    mutationFn: ({ author, content, avatar }: { author: string; content: string; avatar?: string }) =>
      TaskService.addComment(id, author, content, avatar),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASK(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASK_HISTORY(id) });
    },
  });

  const reactionMutation = useMutation({
    mutationFn: ({ commentId, emoji, user }: { commentId: string; emoji: string; user: string }) =>
      TaskService.toggleReaction(id, commentId, emoji, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASK(id) });
    },
  });

  const attachmentMutation = useMutation({
    mutationFn: (file: Omit<TaskAttachment, "id" | "uploadedAt" | "version">) =>
      TaskService.addAttachment(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASK(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASK_HISTORY(id) });
    },
  });

  return {
    task: taskQuery.data,
    isLoading: taskQuery.isLoading,
    isError: taskQuery.isError,
    history: historyQuery.data || [],
    isLoadingHistory: historyQuery.isLoading,
    updateTask: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    addComment: commentMutation.mutateAsync,
    toggleReaction: reactionMutation.mutateAsync,
    addAttachment: attachmentMutation.mutateAsync,
  };
}
