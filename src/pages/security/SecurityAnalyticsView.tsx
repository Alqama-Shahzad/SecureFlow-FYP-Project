import React from "react";
import { Link } from "react-router-dom";
import { 
  Activity, 
  RefreshCw, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  CornerDownRight, 
  Lock,
  Globe,
  AlertTriangle,
  Flame,
  Zap,
  CheckCircle2,
  Server
} from "lucide-react";
import { useSecurityAnalytics } from "../../hooks/useSecurity";
import { ChartSkeleton, GridSkeletons, TableSkeleton } from "../../components/security-shared/SecuritySkeletons";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#8b5cf6", "#f59e0b"];

export default function SecurityAnalyticsView() {
  const { data: response, isLoading, error, refetch, isRefetching } = useSecurityAnalytics();

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 space-y-8 animate-fade-in">
        <div className="h-10 w-48 bg-slate-900 rounded" />
        <GridSkeletons count={4} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  if (error || !response) {
    return (
      <div className="p-8 max-w-xl mx-auto mt-12 border border-slate-900 bg-[#090d16] rounded-2xl text-center space-y-4">
        <AlertTriangle className="h-10 w-10 text-red-400 mx-auto" />
        <h3 className="text-base font-bold text-slate-200">SIEM Analytics Offline</h3>
        <p className="text-xs text-slate-400">Database server trace: {(error as Error)?.message}</p>
        <button onClick={() => refetch()} className="px-4 py-2 bg-indigo-950 border border-indigo-500/20 text-indigo-300 text-xs rounded-lg font-semibold mx-auto block hover:bg-indigo-900/40">
          Sync Connection
        </button>
      </div>
    );
  }

  const { threatScore, totalAttacks, blockedRequests, suspiciousUsers, avgResponseTimeMs, analytics } = response;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0c1222] border border-slate-800 p-3 rounded-lg shadow-2xl font-mono text-[11px] text-slate-350">
          <p className="font-bold mb-1 text-slate-200">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: <span className="font-bold text-slate-100">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-in">
      
      {/* 1. View Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-900">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2.5">
            <Activity className="h-7 w-7 text-indigo-400" />
            Security Operations Center (SOC)
          </h1>
          <p className="text-slate-400 text-sm mt-1">Deep analysis SIEM reports, credential health vectors, and mitigation parameters</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/security/system-health"
            className="px-4 py-2 border border-slate-900 hover:border-slate-800 bg-slate-950 hover:bg-slate-905 text-slate-300 hover:text-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Server className="h-4 w-4 text-emerald-400" /> SRE Cluster Health
          </Link>

          <button 
            onClick={() => refetch()}
            disabled={isRefetching}
            className="px-4 py-2 bg-slate-950 hover:bg-[#0c111e] border border-slate-900 rounded-lg text-xs font-semibold text-slate-350 hover:text-slate-100 transition flex items-center gap-2"
          >
            <RefreshCw className={`h-3 w-3 ${isRefetching ? "animate-spin" : ""}`} />
            Recalculate Metrices
          </button>
        </div>
      </div>

      {/* 2. Top Metric Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="border border-slate-900 bg-[#090d16]/30 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start text-xs font-mono text-slate-450 uppercase">
            <span>Threat Block Rate</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="my-3">
            <h2 className="text-3xl font-bold tracking-tight font-mono text-slate-100">99.8%</h2>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
              <TrendingUp className="h-3 w-3" /> +0.12% trend upgrade
            </span>
          </div>
          <p className="text-[10px] text-slate-450 border-t border-slate-900/60 pt-2 font-mono">
            {blockedRequests} of {totalAttacks} requests mitigated
          </p>
        </div>

        <div className="border border-slate-900 bg-[#090d16]/30 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start text-xs font-mono text-slate-450 uppercase">
            <span>Active Threats Interrogated</span>
            <Flame className="h-4 w-4 text-red-400" />
          </div>
          <div className="my-3">
            <h2 className="text-3xl font-bold tracking-tight font-mono text-slate-100">{totalAttacks}</h2>
            <span className="text-[10px] text-red-400 font-mono flex items-center gap-1 mt-0.5">
              Suspicious activity burst
            </span>
          </div>
          <p className="text-[10px] text-slate-450 border-t border-slate-900/60 pt-2 font-mono">
            Spike centered around SQL exploits
          </p>
        </div>

        <div className="border border-slate-900 bg-[#090d16]/30 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start text-xs font-mono text-slate-450 uppercase">
            <span>Critical Suspicious Accounts</span>
            <Users className="h-4 w-4 text-amber-400" />
          </div>
          <div className="my-3">
            <h2 className="text-3xl font-bold tracking-tight font-mono text-slate-100">{suspiciousUsers}</h2>
            <span className="text-[10px] text-amber-400 font-mono mt-0.5 block">Triggered anomaly thresholds</span>
          </div>
          <p className="text-[10px] text-slate-450 border-t border-slate-900/60 pt-2 font-mono">
            Flagged for Multi-MFA bypass try
          </p>
        </div>

        <div className="border border-slate-900 bg-[#090d16]/30 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start text-xs font-mono text-slate-450 uppercase">
            <span>WAF Filter Delay</span>
            <Zap className="h-4 w-4 text-blue-400" />
          </div>
          <div className="my-3">
            <h2 className="text-3xl font-bold tracking-tight font-mono text-slate-100">{avgResponseTimeMs}ms</h2>
            <span className="text-[10px] text-blue-400 font-mono mt-0.5 block">Subnet inspection latency</span>
          </div>
          <p className="text-[10px] text-slate-450 border-t border-slate-900/60 pt-2 font-mono">
            Cached sliding window Redis query
          </p>
        </div>

      </div>

      {/* 3. Recharts Graphics Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Core Line Chart: Risk Index Over Time */}
        <div className="border border-slate-900 bg-[#080c14]/45 rounded-2xl p-6 space-y-4">
          <div>
            <h3 className="font-bold text-slate-205 text-sm font-sans">SOC Risk Metric Vector</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Chronological system vulnerabilities index score over the last 7 days</p>
          </div>
          <div className="h-[250px] w-full font-sans">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.riskScoreHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                <XAxis dataKey="date" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  name="Risk Coefficient" 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8b5cf6" 
                  strokeWidth={2.5} 
                  dot={{ r: 4, strokeWidth: 1 }}
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Core Pie Chart: Threat Vector Breakdown */}
        <div className="border border-slate-900 bg-[#080c14]/45 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-205 text-sm font-sans">MITRE Intrusions Distribution</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Classification index of perimeter packets matching Snort patterns</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
            <div className="sm:col-span-2 h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.attackCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {analytics.attackCategories.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="sm:col-span-3 space-y-2 text-xs font-mono">
              {analytics.attackCategories.map((cat: any, index: number) => (
                <div key={cat.name} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2 text-slate-350">
                    <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="truncate max-w-[120px]">{cat.name}</span>
                  </div>
                  <span className="font-bold text-slate-100">{cat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stacked Area Chart: Dual login successful vs failed */}
        <div className="border border-slate-900 bg-[#080c14]/45 rounded-2xl p-6 space-y-4 lg:col-span-2">
          <div>
            <h3 className="font-bold text-slate-205 text-sm font-sans">Authentication Attestation Streams</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Tracking concurrent high-trust vs bad credential handshake attempts</p>
          </div>

          <div className="h-[250px] w-full font-sans">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.loginTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradientSuccess" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gradientFailed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                <XAxis dataKey="timestamp" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: "11px", fontFamily: "monospace" }} />
                <Area 
                  name="Verified Logs" 
                  type="monotone" 
                  dataKey="success" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#gradientSuccess)" 
                />
                <Area 
                  name="Failed Authentications" 
                  type="monotone" 
                  dataKey="failed" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#gradientFailed)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 4. Forensic Deep Lists: Top offenses and Anomalies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top offending IPs */}
        <div className="border border-slate-900 bg-[#070b13]/40 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-slate-900 bg-[#0a0f1b]/50">
            <h3 className="font-bold text-slate-200 text-sm font-sans flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-indigo-400" /> Offending Subnet Nodes
            </h3>
          </div>
          <div className="overflow-x-auto text-[11px] font-mono">
            <table className="w-full text-left text-slate-350 border-collapse">
              <thead>
                <tr className="border-b border-slate-900 bg-[#090e18]/25 text-[10px] uppercase font-bold text-slate-405">
                  <th className="py-3 px-5">IP remote</th>
                  <th className="py-3 px-5">Origin country</th>
                  <th className="py-3 px-5 text-right">Violation index</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60">
                {analytics.topThreatSources.map((s, index) => (
                  <tr key={s.source} className="hover:bg-[#0c1220]/20 transition">
                    <td className="py-3.5 px-5 font-bold text-slate-250 flex items-center gap-1.5">
                      <span className="text-slate-500 font-sans font-normal text-[10px]">{index + 1}.</span> {s.source}
                    </td>
                    <td className="py-3.5 px-5 text-slate-400">{s.country}</td>
                    <td className="py-3.5 px-5 text-right font-bold text-red-400">{s.count} hits</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Anomalous user ratings */}
        <div className="border border-slate-900 bg-[#070b13]/40 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-slate-900 bg-[#0a0f1b]/50">
            <h3 className="font-bold text-slate-200 text-sm font-sans flex items-center gap-1.5">
              <Users className="h-4 w-4 text-indigo-400" /> Credential Anomaly Flags
            </h3>
          </div>
          <div className="p-4 divide-y divide-slate-900/60">
            {analytics.userBehavior.map((usr) => (
              <div key={usr.username} className="py-3 flex items-center justify-between font-sans text-xs first:pt-0 last:pb-0">
                <div className="space-y-0.5">
                  <span className="font-bold font-mono text-slate-200 block">{usr.username}</span>
                  <span className="text-[10px] font-mono text-slate-450 block">{usr.requests} queries executed</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-slate-505">Risk Co-factor:</span>
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] border ${
                    usr.score > 70 
                      ? "text-red-400 bg-red-950/25 border-red-500/10" 
                      : usr.score > 30 
                        ? "text-amber-400 bg-amber-950/25 border-amber-500/10" 
                        : "text-slate-400 bg-slate-950 border-slate-900"
                  }`}>
                    {usr.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
