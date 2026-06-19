import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuditApiService } from "../services/audit.service";
import { SeverityType, HashStatus } from "../types/audit-log";

/**
 * Hook to retrieve and cache search-filtered, paginated, and sorted audit logs
 */
export function useAuditLogs(filters: {
  search?: string;
  user?: string;
  module?: string;
  actionType?: string;
  severity?: SeverityType | "";
  status?: HashStatus | "";
  sort?: "newest" | "oldest";
  page?: number;
  limit?: number;
} = {}) {
  return useQuery({
    queryKey: ["auditLogs", filters],
    queryFn: () => AuditApiService.getAuditLogs(filters),
    placeholderData: (previousData) => previousData, // keep ui responsive on filter change
    staleTime: 5000,
  });
}

/**
 * Hook to retrieve forensic event details for a single log block
 */
export function useAuditLog(id: string) {
  return useQuery({
    queryKey: ["auditLog", id],
    queryFn: () => AuditApiService.getAuditLogById(id),
    enabled: !!id,
    staleTime: 10000,
  });
}

/**
 * Hook to manage total hash-chain validation operations and trigger calculations
 */
export function useHashVerification() {
  const queryClient = useQueryClient();

  const verifyChainMutation = useMutation({
    mutationFn: () => AuditApiService.verifyAuditChain(),
    onSuccess: () => {
      // Invalidate both log listings and diagnostic histories on verification complete
      queryClient.invalidateQueries({ queryKey: ["auditLogs"] });
      queryClient.invalidateQueries({ queryKey: ["verificationHistory"] });
    }
  });

  const verifyLogBlockMutation = useMutation({
    mutationFn: (logId: string) => AuditApiService.verifyLogBlock(logId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["auditLogs"] });
      queryClient.invalidateQueries({ queryKey: ["auditLog", data.logId] });
    }
  });

  const recalculateHashMutation = useMutation({
    mutationFn: (logId: string) => AuditApiService.recalculateLogHash(logId)
  });

  const tamperLogMutation = useMutation({
    mutationFn: (params: { id: string; field: any; newValue: string }) => 
      AuditApiService.tamperAuditLog(params.id, params.field, params.newValue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auditLogs"] });
    }
  });

  const restoreChainMutation = useMutation({
    mutationFn: () => AuditApiService.restoreAuditChain(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auditLogs"] });
      queryClient.invalidateQueries({ queryKey: ["verificationHistory"] });
    }
  });

  return {
    verifyChain: verifyChainMutation.mutateAsync,
    isVerifyingChain: verifyChainMutation.isPending,
    chainVerificationResult: verifyChainMutation.data,

    verifyLogBlock: verifyLogBlockMutation.mutateAsync,
    isVerifyingLogBlock: verifyLogBlockMutation.isPending,

    recalculateHash: recalculateHashMutation.mutateAsync,
    isRecalculatingHash: recalculateHashMutation.isPending,

    tamperLog: tamperLogMutation.mutateAsync,
    isTamperingLog: tamperLogMutation.isPending,

    restoreChain: restoreChainMutation.mutateAsync,
    isRestoringChain: restoreChainMutation.isPending,
  };
}

/**
 * Hook to retrieve historical list of hash verification cycles
 */
export function useVerificationHistory() {
  return useQuery({
    queryKey: ["verificationHistory"],
    queryFn: () => AuditApiService.getVerificationHistory(),
    staleTime: 5000,
  });
}

/**
 * Hooks to extract unique dropdown values for optimal filtering
 */
export function useUniqueAuditFilters() {
  return useQuery({
    queryKey: ["uniqueAuditFilters"],
    queryFn: async () => {
      const [users, modules] = await Promise.all([
        AuditApiService.getUniqueUsers(),
        AuditApiService.getUniqueModules()
      ]);
      return { users, modules };
    },
    staleTime: 60000,
  });
}
