import React, { useState } from "react";
import { 
  Heart, 
  Cpu, 
  Layers, 
  History, 
  RefreshCw, 
  AlertOctagon, 
  Play,
  Zap,
  Activity,
  UserCheck,
  CheckCircle2,
  Server,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { useSystemHealth } from "../../hooks/useSecurity";
import { SecurityService } from "../../services/security.service";
import { GridSkeletons, SkeletonLoader, TableSkeleton } from "../../components/security-shared/SecuritySkeletons";
import { useQueryClient } from "@tanstack/react-query";

export default function SystemHealthDashboard() {
  const queryClient = useQueryClient();
  const { data: healthList, isLoading, error, refetch, isRefetching } = useSystemHealth();

  // Load simulator control state
  const [selectedService, setSelectedService] = useState("");
  const [targetStatus, setTargetStatus] = useState<"Operational" | "Degraded" | "Offline">("Degraded");
  const [isInjecting, setIsInjecting] = useState(false);
  const [injectionFeedback, setInjectionFeedback] = useState<string | null>(null);

  const handleSimulateFail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    setIsInjecting(true);
    setInjectionFeedback(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      await SecurityService.triggerServiceServiceStatus(selectedService, targetStatus);
      
      setInjectionFeedback(`Successfully modified diagnostic endpoint status to ${targetStatus} for [${selectedService}]. Monitoring triggers logged inside SRE alert log buffers.`);
      queryClient.invalidateQueries({ queryKey: ["system-health"] });
    } catch (e) {
      setInjectionFeedback("Failure configuration injection aborted.");
    } finally {
      setIsInjecting(false);
    }
  };

  const getStatusStyle = (status: "Operational" | "Degraded" | "Offline") => {
    if (status === "Operational") return "bg-emerald-950/40 border-emerald-500/20 text-emerald-400";
    if (status === "Degraded") return "bg-amber-950/45 border-amber-500/20 text-amber-400 animate-pulse-subtle";
    return "bg-red-950/50 border-red-500/30 text-red-400 font-bold animate-pulse";
  };

  const getStatusDotColor = (status: "Operational" | "Degraded" | "Offline") => {
    if (status === "Operational") return "bg-emerald-400";
    if (status === "Degraded") return "bg-amber-400";
    return "bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.5)]";
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 space-y-8">
        <div className="h-10 w-48 bg-slate-900 rounded" />
        <GridSkeletons count={6} />
      </div>
    );
  }

  if (error || !healthList) {
    return (
      <div className="p-8 max-w-xl mx-auto mt-12 border border-slate-900 bg-[#090d16] rounded-2xl text-center space-y-4">
        <AlertOctagon className="h-10 w-10 text-red-400 mx-auto" />
        <h3 className="text-base font-bold text-slate-200">SRE Health Telemetry Drop</h3>
        <p className="text-xs text-slate-400">Unable to establish connection to cluster nodes: {(error as Error)?.message}</p>
        <button onClick={() => refetch()} className="px-4 py-2 bg-indigo-950 border border-indigo-500/20 text-indigo-300 text-xs rounded-lg font-semibold mx-auto block hover:bg-indigo-900/40">
          Reconnect System Telemetry
        </button>
      </div>
    );
  }

  // Prepopulate the selection with first service
  if (selectedService === "" && healthList.length > 0) {
    setSelectedService(healthList[0].name);
  }

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-in">
      
      {/* 1. SRE Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-900">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2.5">
            <Heart className="h-7 w-7 text-emerald-400" />
            System Health & SRE Command
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Cluster node CPU benchmarks, response delays, and sandbox failure injection tests
          </p>
        </div>

        <button 
          onClick={() => refetch()}
          disabled={isRefetching}
          className="px-4 py-2 bg-slate-950 hover:bg-[#0c111e] border border-slate-900 rounded-lg text-xs font-semibold text-slate-350 hover:text-slate-100 transition flex items-center gap-2"
        >
          <RefreshCw className={`h-3 w-3 ${isRefetching ? "animate-spin" : ""}`} />
          Daemon Refresh
        </button>
      </div>

      {/* 2. Interactive Service Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {healthList.map((srv) => (
          <div 
            key={srv.name} 
            className="border border-slate-900 bg-[#090d16]/30 rounded-2xl p-5 hover:border-slate-800 transition duration-150 flex flex-col justify-between space-y-5"
          >
            {/* Service Title and Status Badge */}
            <div className="flex justify-between items-start gap-2">
              <div>
                <h3 className="font-bold text-slate-200 text-sm font-sans flex items-center gap-1.5 leading-snug">
                  <Server className="h-4 w-4 text-indigo-400 shrink-0" /> {srv.name}
                </h3>
                <span className="text-[10px] font-mono text-slate-500 block mt-1">{srv.host}</span>
              </div>

              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-mono font-medium rounded-full border shrink-0 ${getStatusStyle(srv.status)}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(srv.status)}`} />
                {srv.status}
              </span>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-900/40 py-3.5 font-mono text-[11px]">
              <div className="space-y-0.5">
                <span className="text-slate-500 text-[10px] uppercase">CPU Core Load</span>
                <span className="text-slate-200 font-bold block">{srv.metrics.cpuUsage}%</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-500 text-[10px] uppercase">Alloc Memory</span>
                <span className="text-slate-200 font-bold block">{srv.metrics.memoryUsage}%</span>
              </div>
              <div className="space-y-0.5 mt-2">
                <span className="text-slate-500 text-[10px] uppercase">Node Latency</span>
                <span className="text-indigo-305 font-bold block">{srv.metrics.responseTimeMs} ms</span>
              </div>
              <div className="space-y-0.5 mt-2">
                <span className="text-slate-500 text-[10px] uppercase">SLO Uptime</span>
                <span className="text-emerald-400 font-bold block">{srv.metrics.uptimePercentage}%</span>
              </div>
            </div>

            {/* Bottom Version Metadata */}
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
              <span>Sync Check: <span className="text-slate-400">Just now</span></span>
              <span>{srv.version}</span>
            </div>

          </div>
        ))}
      </div>

      {/* 3. Chaos Engineering Sandbox Lab */}
      <div className="border border-slate-900 bg-[#0c0812]/40 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-900/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-4 w-4 text-purple-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-purple-400">Disaster Recovery (Chaos Lab)</h3>
        </div>

        <p className="text-xs text-slate-400 mb-6 max-w-2xl leading-relaxed">
          Simulate server failures, memory leaks, and dependency degraded states to audit downstream load balancers, secure JWT fallback protocols, and trigger instant PagerDuty mitigation sequences.
        </p>

        {injectionFeedback && (
          <div className="mb-6 p-3 bg-indigo-950/25 border border-indigo-500/20 text-indigo-350 text-xs rounded-xl flex gap-3 animate-fade-in font-mono leading-relaxed">
            <CheckCircle2 className="h-4.5 w-4.5 text-indigo-400 shrink-0" />
            <span>{injectionFeedback}</span>
          </div>
        )}

        <form onSubmit={handleSimulateFail} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-405 font-medium block">1. Select Destination Node</label>
            <select 
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full bg-[#05080e] border border-slate-900 hover:border-slate-800 text-slate-200 rounded-lg p-2.5 text-xs font-mono py-2 outline-none"
            >
              <option value="" disabled>Choose active node...</option>
              {healthList.map((srv) => (
                <option key={srv.name} value={srv.name}>{srv.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-405 font-medium block">2. Diagnostic State</label>
            <div className="grid grid-cols-3 gap-2 border border-slate-900 bg-slate-950 p-1 rounded-lg">
              {(["Operational", "Degraded", "Offline"] as const).map((st) => (
                <button
                  type="button"
                  key={st}
                  onClick={() => setTargetStatus(st)}
                  className={`py-1 text-[10px] font-mono rounded-md border border-transparent transition text-center ${
                    targetStatus === st 
                      ? st === "Operational" 
                        ? "bg-emerald-950 border-emerald-900 text-emerald-400" 
                        : st === "Degraded" 
                          ? "bg-amber-950 border-amber-900 text-amber-400" 
                          : "bg-red-950 border-red-900 text-red-400" 
                      : "text-slate-500 hover:text-slate-400"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <button 
              type="submit"
              disabled={isInjecting || !selectedService}
              className="w-full px-5 py-2 bg-slate-950 hover:bg-[#0c111d] hover:border-slate-850 border border-slate-900 hover:text-purple-300 text-slate-400 rounded-lg text-xs font-mono font-semibold transition flex items-center justify-center gap-1.5"
            >
              {isInjecting ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin text-purple-400" /> Connecting to Cluster Daemon...
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 text-purple-400" /> Inject Simulation Diagnostic Change
                </>
              )}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
