import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SecurityService } from "../services/security.service";

// Hook 1: IDS Overview & Statistics
export function useIDS() {
  return useQuery({
    queryKey: ["ids-overview"],
    queryFn: () => SecurityService.getIDSOverview(),
    refetchInterval: 10000, // Poll every 10 seconds for threat scores Updates
  });
}

// Hook 2: Get Paginated alerts with filters
export function useAlerts(filters: {
  search?: string;
  severity?: string;
  status?: string;
  attackType?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["alerts", filters],
    queryFn: () => SecurityService.getAlerts(filters),
    placeholderData: (previousData) => previousData, // Stabilize interface
  });
}

// Hook 3: Single alert detail view & mutation triggers
export function useAlert(id: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["alert", id],
    queryFn: () => SecurityService.getAlertById(id),
    enabled: !!id,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ 
      status, 
      operator, 
      notes 
    }: { 
      status: "New" | "Investigating" | "Resolved" | "Ignored"; 
      operator: string; 
      notes: string; 
    }) => SecurityService.updateAlertStatus(id, status, operator, notes),
    onSuccess: () => {
      // Invalidate both single and general collections to keep UI perfectly synchronized
      queryClient.invalidateQueries({ queryKey: ["alert", id] });
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      queryClient.invalidateQueries({ queryKey: ["ids-overview"] });
      queryClient.invalidateQueries({ queryKey: ["security-analytics"] });
    },
  });

  return {
    ...query,
    updateStatus: updateStatusMutation.mutateAsync,
    isUpdating: updateStatusMutation.isPending,
  };
}

// Hook 4: Security Analytics aggregation data
export function useSecurityAnalytics() {
  return useQuery({
    queryKey: ["security-analytics"],
    queryFn: () => SecurityService.getSecurityAnalytics(),
  });
}

// Hook 5: System Health Daemon status checker
export function useSystemHealth() {
  return useQuery({
    queryKey: ["system-health"],
    queryFn: () => SecurityService.getSystemHealth(),
    refetchInterval: 5000, // Poll SRE metrics rapidly for high fidelity monitoring feel
  });
}
