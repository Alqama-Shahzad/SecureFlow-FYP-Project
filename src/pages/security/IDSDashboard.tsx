import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ShieldAlert, 
  Terminal, 
  Flame, 
  Cpu, 
  Activity, 
  Zap, 
  Bomb, 
  UserX,
  Play, 
  Search, 
  RefreshCw,
  AlertTriangle,
  Globe,
  ArrowRight,
  Wifi,
  Radio
} from "lucide-react";
import { useIDS } from "../../hooks/useSecurity";
import { SecurityService } from "../../services/security.service";
import { SeverityBadge, StatusBadge } from "../../components/security-shared/Badge";
import { GridSkeletons, TableSkeleton } from "../../components/security-shared/SecuritySkeletons";
import { useQueryClient } from "@tanstack/react-query";

export default function IDSDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: idsData, isLoading, isRefetching, refetch, error } = useIDS();
  
  // Simulation States
  const [selectedSimType, setSelectedSimType] = useState<"Brute Force" | "SQL Injection" | "Rate Limit Violation" | "Suspicious Request" | "Privilege Escalation">("SQL Injection");
  const [simIP, setSimIP] = useState("185.112.44.92");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResult, setSimResult] = useState<string | null>(null);

  const handleSimulateAttack = async () => {
    setIsSimulating(true);
    setSimResult(null);
    try {
      // Small simulated packet lag for perfect visual immersion
      await new Promise(resolve => setTimeout(resolve, 800));
      const newAlert = await SecurityService.injectSimulatedAttack(selectedSimType, simIP);
      setSimResult(`Exploit payload transmitted. Assigned Security CID: ${newAlert.id}. Automated WAF rule intervened.`);
      
      // Invalidate queries to reload metrics and timeline
      queryClient.invalidateQueries({ queryKey: ["ids-overview"] });
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["security-analytics"] });
    } catch (e) {
      setSimResult("Simulation failed. Check console logger logs.");
    } finally {
      setIsSimulating(false);
    }
  };

  const getThreatScoreColor = (score: number) => {
    if (score < 35) return "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";
    if (score < 65) return "text-amber-400 border-amber-500/20 bg-amber-500/5";
    return "text-red-400 border-red-500/25 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.07)]";
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 space-y-8">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">IDS Security Audit center</h1>
            <p className="text-slate-400 text-sm">Synchronizing core Snort telemetry endpoints...</p>
          </div>
        </div>
        <GridSkeletons count={3} />
        <TableSkeleton rows={6} />
      </div>
    );
  }

  if (error || !idsData) {
    return (
      <div className="p-8 max-w-xl mx-auto mt-12 border border-red-500/20 bg-red-950/10 rounded-2xl p-6 text-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-red-400 mx-auto" />
        <h3 className="text-lg font-bold text-slate-200">IDS Metrics Sink Offline</h3>
        <p className="text-slate-400 text-sm">Failed to connect to Snort daemon probe. Check Docker virtual bridge interface. Error logs: {(error as Error)?.message || "No telemetry stream"}</p>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 bg-red-950 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-900/40 text-xs font-semibold flex items-center gap-2 mx-auto"
        >
          <RefreshCw className="h-3 w-3" /> Retry Stream Connection
        </button>
      </div>
    );
  }

  const { bruteForce, sqlInjection, rateLimit, recentTimeline, stats } = idsData;

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-in">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900/60 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest">WAF Edge Probe Connection Active</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-100 flex items-center gap-2.5">
            <Terminal className="h-7 w-7 text-indigo-400" />
            IDS Threat Monitoring
          </h1>
          <p className="text-slate-400 text-sm mt-1">Real-time perimeter intrusion audits & deep packet stream telemetry</p>
        </div>

        <div className="flex items-center gap-3">
          <Link 
            to="/security/alerts"
            className="px-4 py-2 bg-indigo-650 hover:bg-indigo-600 transition text-slate-100 rounded-lg text-xs font-semibold shadow-lg shadow-indigo-950/30 flex items-center gap-1.5"
          >
            <ShieldAlert className="h-4 w-4" /> Go to Alerts Center
          </Link>
          <button 
            onClick={() => refetch()}
            disabled={isRefetching}
            className="p-2 border border-slate-800 bg-[#090d16] hover:bg-slate-900 rounded-lg text-slate-400 hover:text-slate-200 disabled:opacity-50 transition"
            title="Refresh Telemetry Stream"
          >
            <RefreshCw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* 2. Top Analytics Indicators: Score and Quick Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Threat Score Card */}
        <div className={`col-span-1 border rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden transition ${getThreatScoreColor(stats.threatScore)}`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-900/10 rounded-full blur-3xl -mr-6 -mt-6 pointer-events-none" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest font-semibold opacity-70">SecOps Threat Index</p>
              <h2 className="text-3xl font-bold font-mono tracking-tight mt-1">{stats.threatScore}/100</h2>
            </div>
            <Activity className="h-5 w-5 opacity-85" />
          </div>
          <div className="mt-8 space-y-2">
            <div className="w-full bg-slate-900/60 rounded-full h-2 overflow-hidden border border-slate-850/50">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${stats.threatScore > 65 ? "bg-red-500" : stats.threatScore > 35 ? "bg-amber-500" : "bg-emerald-500"}`}
                style={{ width: `${stats.threatScore}%` }}
              />
            </div>
            <p className="text-[11px] font-medium opacity-80 leading-relaxed">
              {stats.threatScore > 65 
                ? "CRITICAL perimeter breaches monitored. Immediate audit intervention suggested." 
                : stats.threatScore > 35 
                  ? "Elevated access attempts logged. Routine VPN verification recommended." 
                  : "Perimeter system holding stable. Handshake checks nominal."
              }
            </p>
          </div>
        </div>

        {/* Quick Statistics Blocks */}
        <div className="col-span-1 border border-slate-900/80 bg-[#090d16]/35 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start text-slate-400">
            <span className="text-xs font-mono font-medium uppercase tracking-wider">SQL Injection Traps</span>
            <Flame className="h-4 w-4 text-orange-400" />
          </div>
          <div className="my-3">
            <h3 className="text-2xl font-bold font-mono text-slate-100">{stats.sqlInjectionAttempts}</h3>
            <span className="text-[10px] text-orange-400 font-mono mt-1 block">Active UNION pattern matches</span>
          </div>
          <div className="text-[11px] text-slate-400 border-t border-slate-900/60 pt-2 flex items-center justify-between">
            <span>Scan Count</span>
            <span className="font-mono text-slate-300">6 endpoints monitored</span>
          </div>
        </div>

        <div className="col-span-1 border border-slate-900/80 bg-[#090d16]/35 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start text-slate-400">
            <span className="text-xs font-mono font-medium uppercase tracking-wider">Brute Force Deflected</span>
            <Zap className="h-4 w-4 text-blue-400" />
          </div>
          <div className="my-3">
            <h3 className="text-2xl font-bold font-mono text-slate-100">{stats.bruteForceAttempts}</h3>
            <span className="text-[10px] text-blue-400 font-mono mt-1 block">Authentication locks applied</span>
          </div>
          <div className="text-[11px] text-slate-400 border-t border-slate-900/60 pt-2 flex items-center justify-between">
            <span>Suspected subnets</span>
            <span className="font-mono text-slate-300">{stats.blockedIPs} Unique IPs</span>
          </div>
        </div>

        <div className="col-span-1 border border-slate-900/80 bg-[#090d16]/35 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start text-slate-400">
            <span className="text-xs font-mono font-medium uppercase tracking-wider">Rate Violations Handled</span>
            <Bomb className="h-4 w-4 text-red-400" />
          </div>
          <div className="my-3">
            <h3 className="text-2xl font-bold font-mono text-slate-100">{stats.rateLimitViolations}</h3>
            <span className="text-[10px] text-red-400 font-mono mt-1 block">Blocked via 429 status code</span>
          </div>
          <div className="text-[11px] text-slate-400 border-t border-slate-900/60 pt-2 flex items-center justify-between">
            <span>Burst limit</span>
            <span className="font-mono text-slate-300">60 reqs / sec strict</span>
          </div>
        </div>
      </div>

      {/* 3. Threat Simulation & Penetration Audit Lab */}
      <div className="border border-slate-900 bg-[#090e18]/45 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-900/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-2 mb-4">
          <Play className="h-4 w-4 text-indigo-400" />
          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-indigo-400">SecOps Simulation Lab</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-400 font-medium">1. Choose Vector Type</label>
            <select 
              value={selectedSimType}
              onChange={(e) => setSelectedSimType(e.target.value as any)}
              className="w-full bg-[#05080f] border border-slate-900 hover:border-slate-800 text-slate-200 rounded-lg p-2 text-xs font-mono py-2.5 outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="SQL Injection">SQL Injection Exploit</option>
              <option value="Brute Force">Brute Force Sequence</option>
              <option value="Rate Limit Violation">Volumetric Rate Overflow</option>
              <option value="Suspicious Request">Custom Header Probe</option>
              <option value="Privilege Escalation">Credential Claim Forgery</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-400 font-medium">2. Source IP Signature</label>
            <input 
              type="text" 
              value={simIP}
              onChange={(e) => setSimIP(e.target.value)}
              placeholder="e.g. 45.143.203.12"
              className="w-full bg-[#05080f] border border-slate-900 text-slate-200 rounded-lg p-2 text-xs font-mono py-2.5 outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="md:col-span-2">
            <button 
              onClick={handleSimulateAttack}
              disabled={isSimulating}
              className="w-full px-5 py-2.5 bg-indigo-950 hover:bg-indigo-900/60 border border-indigo-500/30 text-indigo-300 rounded-lg hover:text-indigo-250 font-semibold text-xs font-mono transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="h-3 w-3 animate-spin text-indigo-400" /> Transmitting Malicious Headers Packet...
                </>
              ) : (
                <>
                  <Wifi className="h-3.5 w-3.5" /> Trigger Firewalled Simulation Sequence
                </>
              )}
            </button>
          </div>
        </div>

        {simResult && (
          <div className="mt-4 p-3 bg-indigo-950/20 border border-indigo-500/10 rounded-xl flex gap-3 animate-fade-in">
            <div className="bg-indigo-950/40 p-2 rounded-lg text-indigo-400 h-fit">
              <Terminal className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-mono text-slate-300 font-semibold">Firewall Daemon Command Response:</p>
              <p className="text-[11px] font-mono text-indigo-300">{simResult}</p>
            </div>
          </div>
        )}
      </div>

      {/* 4. Threat Logs Timeline */}
      <div className="border border-slate-900 bg-[#070b13]/40 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-slate-900 bg-[#0a0f1b]/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="font-bold text-slate-200 font-sans text-base">Active Perimeter Audit Timeline</h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">Continuous packet-matching logs from active SRE instances</p>
          </div>
          <div className="flex items-center gap-2">
            <Link 
              to="/security/alerts"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 hover:underline"
            >
              View Full Incident Register <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-900 bg-[#090e18]/20 text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                <th className="py-4 px-6">Event ID</th>
                <th className="py-4 px-6">Detected At</th>
                <th className="py-4 px-6">Violating IP</th>
                <th className="py-4 px-6">Attack vector</th>
                <th className="py-4 px-6">Gateway Action</th>
                <th className="py-4 px-6">Severity</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/60 font-sans text-xs">
              {recentTimeline.slice(0, 5).map((evt) => {
                const resolvedAlertId = evt.id.replace("EV-", "SEC-");
                return (
                  <tr key={evt.id} className="hover:bg-[#090d16]/30 transition group">
                    <td className="py-4 px-6 font-mono text-slate-400 font-semibold group-hover:text-slate-200">{evt.id}</td>
                    <td className="py-4 px-6 text-slate-400 font-mono">
                      {new Date(evt.timestamp).toLocaleString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false
                      })}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 font-mono">
                        <Globe className="h-3 w-3 text-slate-500" />
                        <span>{evt.sourceIP}</span>
                        {evt.country && (
                          <span className="text-[10px] text-slate-500">({evt.country})</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-slate-200">{evt.attackType}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-slate-400 line-clamp-1 max-w-[200px]" title={evt.responseAction}>
                        {evt.responseAction}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <SeverityBadge label={evt.severity} />
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge label={evt.status} />
                    </td>
                    <td className="py-4 px-6 text-right">
                      {/* Check if ID corresponds to list to make it fully drillable */}
                      <button 
                        onClick={() => navigate(`/security/alerts/${resolvedAlertId}`)}
                        className="px-3 py-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-slate-100 rounded-lg border border-slate-800 text-[11px] font-semibold transition"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
