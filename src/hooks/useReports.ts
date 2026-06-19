import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ReportService } from "../services/report.service";

export function useReports(filters: {
  search?: string;
  type?: string;
  format?: string;
}) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["reports", filters],
    queryFn: () => ReportService.getReports(filters),
  });

  const generateMutation = useMutation({
    mutationFn: (reportInput: {
      title: string;
      description: string;
      type: "Project" | "Security" | "User" | "Task" | "System";
      format: "PDF" | "CSV" | "Excel";
      generatedBy: string;
    }) => ReportService.generateReport(reportInput),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ReportService.deleteReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    }
  });

  return {
    ...query,
    generateReport: generateMutation.mutateAsync,
    isGenerating: generateMutation.isPending,
    deleteReport: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
