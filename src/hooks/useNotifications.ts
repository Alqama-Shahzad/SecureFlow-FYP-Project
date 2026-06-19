import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationService } from "../services/notification.service";

export function useNotifications(filters?: {
  category?: string;
  priority?: string;
  status?: string;
}) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["notifications", filters],
    queryFn: () => NotificationService.getNotifications(filters),
    refetchInterval: 15000, // Background updates for new push items
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => NotificationService.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => NotificationService.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => NotificationService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return {
    ...query,
    markAsRead: markReadMutation.mutateAsync,
    isMarkingRead: markReadMutation.isPending,
    markAllAsRead: markAllReadMutation.mutateAsync,
    isMarkingAllRead: markAllReadMutation.isPending,
    deleteNotification: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
