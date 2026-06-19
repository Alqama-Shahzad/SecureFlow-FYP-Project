import React, { useState, useMemo } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { 
  ShieldCheck, 
  Menu, 
  X, 
  Search, 
  Bell, 
  User, 
  LogOut, 
  Layers, 
  CheckSquare, 
  Users, 
  Fingerprint, 
  Terminal, 
  Activity, 
  LayoutDashboard, 
  FileText, 
  Settings, 
  Key, 
  Eye, 
  Check, 
  Grid,
  Sparkles,
  AlertOctagon,
  ChevronRight,
  RefreshCw
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { Logo } from "../Logo";
import { cn } from "@/lib/utils";

interface SidebarItem {
  name: string;
  icon: React.ComponentType<any>;
  path: string;
  category: "main" | "management" | "security" | "system";
  roles: Array<"Admin" | "Project Manager" | "Developer">;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  // MAIN
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard", category: "main", roles: ["Admin", "Project Manager", "Developer"] },
  { name: "Projects", icon: Layers, path: "/projects", category: "main", roles: ["Admin", "Project Manager", "Developer"] },
  { name: "Tasks", icon: CheckSquare, path: "/tasks", category: "main", roles: ["Admin", "Project Manager", "Developer"] },
  
  // MANAGEMENT
  { name: "Users", icon: Users, path: "/users", category: "management", roles: ["Admin"] },
  { name: "Roles & Permissions", icon: Key, path: "/roles", category: "management", roles: ["Admin"] },
  
  // SECURITY
  { name: "Audit Logs", icon: Fingerprint, path: "/audit-logs", category: "security", roles: ["Admin", "Project Manager", "Developer"] },
  { name: "IDS Monitoring", icon: Terminal, path: "/security/ids", category: "security", roles: ["Admin", "Project Manager"] },
  { name: "Security Analytics", icon: Activity, path: "/security/analytics", category: "security", roles: ["Admin"] },
  
  // SYSTEM
  { name: "Reports", icon: FileText, path: "/reports", category: "system", roles: ["Admin", "Project Manager"] },
  { name: "Notifications", icon: Bell, path: "/notifications", category: "system", roles: ["Admin", "Project Manager", "Developer"] },
  { name: "Settings", icon: Settings, path: "/settings/general", category: "system", roles: ["Admin", "Project Manager", "Developer"] },
];

export default function AppShell() {
  const { user, logout, login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sandboxActionMessage, setSandboxActionMessage] = useState<string | null>(null);

  // Active modular overlay triggers for simulated workspace views
  const [demoModal, setDemoModal] = useState<{ isOpen: boolean; title: string; desc: string; list: string[] } | null>(null);

  // Mock Notifications for dropdown menu
  const [notifications, setNotifications] = useState([
    { id: "1", title: "IP Throttled", desc: "Excessive payload attempts logged on /api/v1/crypto-keys", time: "5m ago", unread: true, type: "security" },
    { id: "2", title: "Project Milestones CBP", desc: "Sarah J updated critical path dependency schedule", time: "1h ago", unread: true, type: "project" },
    { id: "3", title: "New Task Assigned", desc: "Implement JWT signing rotational key vectors", time: "2h ago", unread: false, type: "task" },
    { id: "4", title: "Dependency CVE Audit", desc: "Scheduled weekly automated compliance check passed", time: "1d ago", unread: false, type: "system" }
  ]);

  const activeRole = user?.role || "Admin";

  // Filter sidebar based on target user's role 
  const filteredSidebarItems = useMemo(() => {
    return SIDEBAR_ITEMS.filter(item => item.roles.includes(activeRole as any));
  }, [activeRole]);

  // Determine current active navigation name
  const currentNavName = useMemo(() => {
    // If exact match of dashboard
    if (location.pathname.includes("/dashboard/admin")) return "Admin Command Center";
    if (location.pathname.includes("/dashboard/pm")) return "Project Delivery Workspace";
    if (location.pathname.includes("/dashboard/developer")) return "Developer Activity Center";
    
    const matched = SIDEBAR_ITEMS.find(item => location.pathname === item.path);
    return matched ? matched.name : "Dashboard Workspace";
  }, [location.pathname]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const clearNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Safe handler to preview different dashboards directly from top level
  // Perfect for reviewers and instant dynamic testing
  const triggerSandboxRoleSwitch = (targetRole: "Admin" | "Project Manager" | "Developer") => {
    let email = "admin@secureflow.app";
    let targetPath = "/dashboard/admin";
    
    if (targetRole === "Project Manager") {
      email = "pm@secureflow.app";
      targetPath = "/dashboard/pm";
    } else if (targetRole === "Developer") {
      email = "dev@secureflow.app";
      targetPath = "/dashboard/developer";
    }

    login({
      id: "usr-" + targetRole.toLowerCase(),
      email,
      role: targetRole
    });

    setIsProfileOpen(false);
    navigate(targetPath);
    
    setSandboxActionMessage(`Session context reconfigured to ${targetRole}.`);
    setTimeout(() => setSandboxActionMessage(null), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSidebarItemClick = (item: SidebarItem) => {
    // Role-based dashboards have exclusive routes
    if (item.path === "/dashboard") {
      if (activeRole === "Admin") navigate("/dashboard/admin");
      else if (activeRole === "Project Manager") navigate("/dashboard/pm");
      else navigate("/dashboard/developer");
      return;
    }

    if (["/users", "/roles", "/projects", "/tasks", "/audit-logs", "/security/ids", "/security/analytics", "/reports", "/notifications", "/security/system-health", "/settings/general", "/settings/security", "/profile"].includes(item.path)) {
      navigate(item.path);
      return;
    }

    // For all other sub modules, display beautiful Sandbox drawer mock to keep UI 100% interactive and fully loaded!
    let mockList: string[] = [];
    let desc = "";

    if (item.path === "/projects") {
      desc = "Active high-trust projects in SecureFlow Ledger Sync";
      mockList = [
        "Commercial Banking Portal (CBP) - 99.2% Sec Compliance (Sarah Jenkins)",
        "SWIFT Gateway Reconciler (SGR) - 100.0% Sec Compliance (Alex Rivera)",
        "Fedwire Payment Liquidity Engine (FPLE) - 96.8% Sec Compliance (Marcus Vane)",
        "Retail Card Ledger Integration (RCLI) - 98.4% Sec Compliance (Helena Wu)"
      ];
    } else if (item.path === "/tasks") {
      desc = "Cryptography rotation tasks and penetration testing targets";
      mockList = [
        "[CRITICAL] task-101: Enforce JWT signing algorithm HS512 (Kaelen Mercer)",
        "[HIGH] task-102: Remediate secure dependency CVE-2025-4921 (Liam Henderson)",
        "[CRITICAL] task-103: Implement TLS 1.3 strict compliance ciphers (Sarah Jenkins)",
        "[HIGH] task-104: Sanitize SQL parameters in ledger vault (Elena Petrova)"
      ];
    } else if (item.path === "/users") {
      desc = "Secure workspace sandbox validated developer log directory";
      mockList = [
        "Admin Account (admin@secureflow.app) - Role: Admin [Trusted Device]",
        "Sarah Jenkins (pm@secureflow.app) - Role: Project Manager [Trusted Device]",
        "Kaelen Mercer (dev@secureflow.app) - Role: Developer [Trusted Device]",
        "Elena Petrova (elena@secureflow.app) - Role: Developer [Trusted Device]"
      ];
    } else if (item.path === "/roles") {
      desc = "Permissions framework descriptors (Banking compliance controls)";
      mockList = [
        "Admin: Read-write, cryptology rotational token injection, full auditing log inspection",
        "Project Manager: Team metrics compilation, project milestone setting, pipeline deployment triggers",
        "Developer: Task completion commits, secure local package validations, read-only audit overview"
      ];
    } else if (item.path === "/audit-logs") {
      desc = "Immutable cryptographic tamper-proof ledger audit logs";
      mockList = [
        "2026-06-18 04:12:15 - admin@secureflow.app rotated vault keys on /api/v1/crypto [SUCCESS]",
        "2026-06-18 03:55:40 - pm@secureflow.app updated task descriptor task-101 [SUCCESS]",
        "2026-06-18 02:44:02 - dev@secureflow.app pushed secure commits PR #242 [SUCCESS]",
        "2026-06-18 01:30:11 - anonymous@untrusted.xyz attempted unauthorized admin GET [FAILED]"
      ];
    } else if (item.path === "/ids-monitoring") {
      desc = "Active Snort / WAF threat mitigation status metrics";
      mockList = [
        "[IPS_WAF_04] Critical - SQL Injection filter matched from 185.220.101.44 [Investigating]",
        "[OWASP_SCAN_DEMON] High - Spring security package out of date [Active Fix]",
        "[API_THROTTLE] Medium - API rate limit buffer exceeded for 192.168.10.11 [Rate Limiting Applied]",
        "[SSL_DAEMON] Low - SSL renewal deadline in 22 days [Normal State]"
      ];
    } else if (item.path === "/reports") {
      desc = "Regulatory banking SDLC compliance export profiles";
      mockList = [
        "Q3 SOC-2 Security Audits and Pentest Projections (Generated: today)",
        "Fedwire Payment Liquidity Stress Compliance Indexes (Generated: 2 days ago)",
        "Open-source Supply Chain Dependency Integrity Snyk Log (Generated: 8 days ago)"
      ];
    } else if (item.path === "/settings") {
      desc = "Cryptographic compliance settings";
      mockList = [
        "Rotational Signatures Algorithm: HS512 with hourly renewal",
        "Minimum Cryptographic Entropy Matrix Score: 100% required",
        "Tamper-proof Log Vault Sync Target: AWS CloudHSM Module"
      ];
    } else {
      desc = "Workspace active telemetrics log parameters";
      mockList = ["Telemetry profile synchronizer status: Active", "Gateway ping: 14ms", "Active session key ID: ssc-0x77ae"];
    }

    setDemoModal({
      isOpen: true,
      title: item.name,
      desc,
      list: mockList
    });
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 font-sans flex overflow-hidden">
      
      {/* Dynamic Floating Toast Message when switching sandbox role */}
      {sandboxActionMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-950 border border-indigo-500/30 px-4 py-3 rounded-xl flex items-center gap-3 shadow-[0_12px_40px_rgba(99,102,241,0.3)] animate-fade-in text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-200">{sandboxActionMessage}</span>
        </div>
      )}

      {/* 1. Desktop Sidebar Container */}
      <aside className={cn(
        "hidden md:flex flex-col bg-[#090d16] border-r border-slate-900 shadow-[4px_0_24px_rgba(0,0,0,0.3)] shrink-0 transition-all duration-300 relative z-30",
        isSidebarOpen ? "w-[240px]" : "w-[68px]"
      )}>
        {/* Sidebar Header with Logo */}
        <div className={cn(
          "h-16 flex items-center border-b border-slate-900 bg-[#070b12]/50 transition-all duration-350",
          isSidebarOpen ? "justify-start px-6" : "justify-center px-0"
        )}>
          <div className={cn(
            "flex items-center overflow-hidden",
            isSidebarOpen ? "justify-start" : "justify-center"
          )}>
            <Logo size={isSidebarOpen ? 46 : 32} className="shrink-0 transition-all duration-350" />
          </div>
        </div>

        {/* Sidebar items grouped by category */}
        <div className="flex-1 py-4 overflow-y-auto space-y-5 px-3">
          {/* Main Group */}
          <div>
            {isSidebarOpen && (
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono px-3 block mb-2">
                Main
              </span>
            )}
            <nav className="space-y-1">
              {filteredSidebarItems.filter(i => i.category === "main").map((item) => {
                const isActive = location.pathname.includes(item.path) || 
                  (item.path === "/dashboard" && location.pathname.includes("/dashboard/"));
                return (
                  <button
                    key={item.name}
                    onClick={() => handleSidebarItemClick(item)}
                    className={cn(
                      "w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 group text-left",
                      isActive 
                        ? "bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-500 font-bold" 
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                    )}
                  >
                    <item.icon size={16} className={cn("shrink-0", isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200")} />
                    {isSidebarOpen && <span>{item.name}</span>}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Management Group (Only visible to Admin) */}
          {filteredSidebarItems.some(i => i.category === "management") && (
            <div>
              {isSidebarOpen && (
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono px-3 block mb-2">
                  Management
                </span>
              )}
              <nav className="space-y-1">
                {filteredSidebarItems.filter(i => i.category === "management").map((item) => {
                  const isActive = location.pathname.includes(item.path);
                  return (
                    <button
                      key={item.name}
                      onClick={() => handleSidebarItemClick(item)}
                      className={cn(
                        "w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 group text-left",
                        isActive 
                          ? "bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-500 font-bold" 
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                      )}
                    >
                      <item.icon size={16} className={cn("shrink-0", isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200")} />
                      {isSidebarOpen && <span>{item.name}</span>}
                    </button>
                  );
                })}
              </nav>
            </div>
          )}

          {/* Security Group */}
          {filteredSidebarItems.some(i => i.category === "security") && (
            <div>
              {isSidebarOpen && (
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono px-3 block mb-2">
                  Security
                </span>
              )}
              <nav className="space-y-1">
                {filteredSidebarItems.filter(i => i.category === "security").map((item) => {
                  const isActive = location.pathname.includes(item.path);
                  return (
                    <button
                      key={item.name}
                      onClick={() => handleSidebarItemClick(item)}
                      className={cn(
                        "w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 group text-left",
                        isActive 
                          ? "bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-500 font-bold" 
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                      )}
                    >
                      <item.icon size={16} className={cn("shrink-0", isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200")} />
                      {isSidebarOpen && <span>{item.name}</span>}
                    </button>
                  );
                })}
              </nav>
            </div>
          )}

          {/* System Group */}
          <div>
            {isSidebarOpen && (
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono px-3 block mb-2">
                System
              </span>
            )}
            <nav className="space-y-1">
              {filteredSidebarItems.filter(i => i.category === "system").map((item) => {
                const isActive = location.pathname.includes(item.path);
                return (
                  <button
                    key={item.name}
                    onClick={() => handleSidebarItemClick(item)}
                    className={cn(
                      "w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 group text-left",
                      isActive 
                        ? "bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-500 font-bold" 
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                    )}
                  >
                    <item.icon size={16} className={cn("shrink-0", isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200")} />
                    {isSidebarOpen && <span>{item.name}</span>}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Collapse Toggle & Mini Status Indicator */}
        <div className="p-3 border-t border-slate-900 bg-[#070b12]/50 flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-900 hover:text-white text-slate-400 transition-all mx-auto md:mx-0"
          >
            <Menu size={14} />
          </button>
          
          {isSidebarOpen && (
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block tracking-tight truncate">
                {activeRole} Session
              </span>
              <span className="text-[9px] font-bold text-emerald-400 uppercase font-mono block tracking-widest flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse inline-block" /> ONLINE
              </span>
            </div>
          )}
        </div>
      </aside>

      {/* 2. Mobile Nav Drawer Slide */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileSidebarOpen(false)} />
          <aside className="w-[260px] bg-[#090d16] border-r border-slate-900 flex flex-col p-5 relative z-50 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-900">
              <div className="flex items-center gap-3 justify-start">
                <Logo size={42} className="shrink-0" />
                <span className="text-sm font-black text-white uppercase tracking-tight font-sans">
                  SecureFlow
                </span>
              </div>
              <button onClick={() => setIsMobileSidebarOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X size={18} />
              </button>
            </div>

            {/* Mobile Sandbox Switcher */}
            <div className="p-3 bg-indigo-950/40 border border-indigo-500/10 rounded-xl space-y-2">
              <span className="text-[8px] font-extrabold uppercase font-mono tracking-widest text-indigo-400 block px-1">
                SANDBOX ROLE SWITCH:
              </span>
              <div className="grid grid-cols-3 gap-1">
                {(["Admin", "Project Manager", "Developer"] as const).map((rl) => (
                  <button
                    key={rl}
                    onClick={() => {
                      triggerSandboxRoleSwitch(rl);
                      setIsMobileSidebarOpen(false);
                    }}
                    className={cn(
                      "text-[9px] font-extrabold py-1.5 rounded-lg uppercase tracking-wider font-mono transition-all text-center",
                      activeRole === rl 
                        ? "bg-indigo-600 text-white font-extrabold shadow" 
                        : "text-slate-400 bg-slate-900/50 hover:bg-slate-900 hover:text-slate-200"
                    )}
                  >
                    {rl === "Project Manager" ? "PM" : rl}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 space-y-5">
              <div>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono block mb-2">Main</span>
                <nav className="space-y-1">
                  {filteredSidebarItems.filter(i => i.category === "main").map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        setIsMobileSidebarOpen(false);
                        handleSidebarItemClick(item);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-950 text-left"
                    >
                      <item.icon size={15} className="text-slate-400 shrink-0" />
                      <span>{item.name}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {filteredSidebarItems.some(i => i.category === "management") && (
                <div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono block mb-2">Management</span>
                  <nav className="space-y-1">
                    {filteredSidebarItems.filter(i => i.category === "management").map((item) => (
                      <button
                        key={item.name}
                        onClick={() => {
                          setIsMobileSidebarOpen(false);
                          handleSidebarItemClick(item);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-950 text-left"
                      >
                        <item.icon size={15} className="text-slate-400 shrink-0" />
                        <span>{item.name}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              )}

              {filteredSidebarItems.some(i => i.category === "security") && (
                <div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono block mb-2">Security</span>
                  <nav className="space-y-1">
                    {filteredSidebarItems.filter(i => i.category === "security").map((item) => (
                      <button
                        key={item.name}
                        onClick={() => {
                          setIsMobileSidebarOpen(false);
                          handleSidebarItemClick(item);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-950 text-left"
                      >
                        <item.icon size={15} className="text-slate-400 shrink-0" />
                        <span>{item.name}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              )}

              <div>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono block mb-2">System</span>
                <nav className="space-y-1">
                  {filteredSidebarItems.filter(i => i.category === "system").map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        setIsMobileSidebarOpen(false);
                        handleSidebarItemClick(item);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-950 text-left"
                    >
                      <item.icon size={15} className="text-slate-400 shrink-0" />
                      <span>{item.name}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-900">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold text-rose-400 hover:bg-slate-950 rounded-lg text-left"
              >
                <LogOut size={15} />
                <span>Sign Out Account</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* 3. Main Workspace Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative z-10">
        
        {/* Top Header */}
        <header className="h-16 shrink-0 bg-[#060913]/90 backdrop-blur-md border-b border-slate-900 flex items-center justify-between px-6 sticky top-0 z-20">
          
          {/* Logo, Menu Button & Breadcrumbs */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-900 md:hidden text-slate-400 hover:text-white transition-all"
            >
              <Menu size={16} />
            </button>

            {/* Path Breadcrumbs */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">
              <span>SecureFlow</span>
              <ChevronRight size={10} className="text-slate-600" />
              <span className="text-indigo-400 font-bold">{currentNavName}</span>
            </div>
          </div>

          {/* Search Bar, Sandbox switcher & Tooltips */}
          <div className="flex items-center gap-4 flex-1 justify-end max-w-xl">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-[240px] hidden md:block">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                <Search size={14} />
              </span>
              <input
                type="text"
                placeholder="Secure audit cache lookup..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950/75 border border-slate-880 text-xs text-slate-200 placeholder:text-slate-600 pl-9 pr-3 rounded-lg w-full h-8.5 focus:border-indigo-500/50 outline-none transition-all"
              />
            </div>

            {/* Sandbox Global Role Quick Switcher Selector */}
            <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-xl bg-indigo-950/40 border border-indigo-500/20">
              <span className="text-[9px] font-extrabold uppercase font-mono tracking-widest text-indigo-400 px-1">
                SANDBOX ROLE SWITCH:
              </span>
              <div className="flex gap-1">
                {(["Admin", "Project Manager", "Developer"] as const).map((rl) => (
                  <button
                    key={rl}
                    onClick={() => triggerSandboxRoleSwitch(rl)}
                    className={cn(
                      "text-[9px] font-extrabold px-2 py-1 rounded-lg uppercase tracking-wider font-mono transition-all",
                      activeRole === rl 
                        ? "bg-indigo-600 text-white font-extrabold shadow" 
                        : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                    )}
                  >
                    {rl}
                  </button>
                ))}
              </div>
            </div>

            {/* Unified Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-white transition-all relative"
              >
                <Bell size={14} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#060913] animate-pulse" />
                )}
              </button>

              {isNotificationsOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsNotificationsOpen(false)} />
                  <div className="absolute right-0 mt-3 w-80 bg-[#0d1323] border border-slate-800 rounded-xl shadow-[0_12px_44px_rgba(0,0,0,0.6)] py-2 z-40 animate-fade-in divide-y divide-slate-800/80">
                    <div className="px-4 py-2 flex items-center justify-between bg-slate-950/20">
                      <span className="text-[10px] font-extrabold font-mono uppercase tracking-wider text-slate-400">
                        Secured Queue Alerts
                      </span>
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAllNotificationsRead}
                          className="text-[9px] text-indigo-400 hover:underline font-bold uppercase font-mono"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/30">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center text-slate-500 text-xs">
                          All notification logs cleared.
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            className={cn(
                              "p-3.5 flex items-start gap-3 transition-colors cursor-pointer hover:bg-slate-900/60",
                              notif.unread ? "bg-indigo-500/5" : ""
                            )}
                          >
                            <span className={cn(
                              "w-1.5 h-1.5 rounded-full mt-1.5 shrink-0",
                              notif.unread ? "bg-indigo-500 animate-pulse" : "bg-slate-700"
                            )} />
                            <div className="flex-1 min-w-0">
                              <h5 className="text-[11px] font-bold text-slate-200">{notif.title}</h5>
                              <p className="text-[10px] text-slate-400 leading-normal mt-0.5">{notif.desc}</p>
                              <span className="text-[8px] text-slate-500 font-mono inline-block mt-1 font-bold">{notif.time}</span>
                            </div>
                            <button 
                              onClick={(e) => clearNotification(notif.id, e)}
                              className="text-slate-600 hover:text-slate-400 shrink-0 self-center"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="px-4 py-2 text-center">
                      <button 
                        onClick={() => handleSidebarItemClick({ name: "Notifications", icon: Bell, path: "/notifications", category: "system", roles: [] })}
                        className="text-[10px] font-bold font-mono uppercase tracking-widest text-slate-500 hover:text-indigo-400 transition-colors w-full"
                      >
                        Secure Stream Logs
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-900 hover:border-slate-700 transition-all text-left group"
              >
                <div className="w-6 h-6 rounded-md bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold font-mono text-xs uppercase shadow-inner shrink-0 group-hover:bg-indigo-600/30">
                  {user?.email[0].toUpperCase() || "A"}
                </div>
                <div className="hidden sm:block min-w-0 max-w-[120px]">
                  <p className="text-[10px] font-extrabold text-white leading-none truncate">{user?.email}</p>
                  <p className="text-[8px] font-bold text-indigo-400 tracking-wider uppercase font-mono leading-none mt-1 truncate">{activeRole}</p>
                </div>
              </button>

              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsProfileOpen(false)} />
                  <div className="absolute right-0 mt-3 w-56 bg-[#0d1323] border border-slate-800 rounded-xl shadow-[0_12px_44px_rgba(0,0,0,0.6)] py-1.5 z-40 animate-fade-in divide-y divide-slate-800/80">
                    
                    <div className="px-4 py-2.5">
                      <p className="text-xs font-bold text-white truncate">{user?.email}</p>
                      <span className="text-[9px] uppercase font-mono font-extrabold text-indigo-400 bg-indigo-950/80 border border-indigo-500/20 px-1.5 py-0.5 rounded-md mt-1 inline-block">
                        {activeRole} Active
                      </span>
                    </div>

                    <div className="p-2 space-y-0.5">
                      <span className="text-[8px] font-bold font-mono uppercase tracking-widest text-slate-500 px-2 block mb-1">
                        My Account
                      </span>
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-900 transition-colors text-left"
                      >
                        <User size={13} className="text-indigo-400 shrink-0" />
                        <span>Profile Workspace</span>
                      </Link>
                      <Link
                        to="/settings/general"
                        onClick={() => setIsProfileOpen(false)}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-900 transition-colors text-left"
                      >
                        <Settings size={13} className="text-emerald-400 shrink-0" />
                        <span>General Settings</span>
                      </Link>
                      <Link
                        to="/settings/security"
                        onClick={() => setIsProfileOpen(false)}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-900 transition-colors text-left"
                      >
                        <ShieldCheck size={13} className="text-rose-400 shrink-0" />
                        <span>Security Settings</span>
                      </Link>
                    </div>

                    {/* Roles toggle inside dropdown for extreme accessibility */}
                    <div className="p-2 space-y-1">
                      <span className="text-[8px] font-bold font-mono uppercase tracking-widest text-slate-500 px-2 block mb-1">
                        Active Role Context
                      </span>
                      {(["Admin", "Project Manager", "Developer"] as const).map((rl) => (
                        <button
                          key={rl}
                          onClick={() => triggerSandboxRoleSwitch(rl)}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-900 transition-colors text-left"
                        >
                          <span>{rl} View</span>
                          {activeRole === rl && <Check size={12} className="text-indigo-400" />}
                        </button>
                      ))}
                    </div>

                    <div className="p-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/5 transition-colors text-left"
                      >
                        <LogOut size={13} />
                        <span>Terminate Cryptographic Session</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content View Routing Anchor */}
        <div className="flex-1 p-6 sm:p-8 space-y-8 max-w-[1440px] mx-auto w-full">
          <Outlet />
        </div>

        {/* Footer info banner */}
        <footer className="py-6 px-8 border-t border-slate-900 text-center flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-widest font-mono">
          <span>SECURE INSTANCE RUNTIME: PORT 3000 // CRYPTO-MODULE ENGAGED</span>
          <span>SYSTEM ACCREDITED FOR AUDITS IN 2026</span>
        </footer>

      </main>

      {/* Unified Sandbox Drawer Dialog for all Submodules */}
      {demoModal?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setDemoModal(null)} />
          <div className="bg-[#0c1223] border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] shadow-[0_24px_50px_rgba(0,0,0,0.7)] overflow-y-auto relative z-50 animate-fade-in flex flex-col">
            
            {/* Drawer Window bar */}
            <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  {demoModal.title} Module Workspace
                </h4>
              </div>
              <button 
                onClick={() => setDemoModal(null)} 
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900"
              >
                <X size={15} />
              </button>
            </div>

            {/* Contents */}
            <div className="p-6 space-y-4">
              <div className="p-3 bg-indigo-950/40 border border-indigo-500/20 rounded-xl text-indigo-300 text-xs font-medium flex items-center gap-2">
                <Sparkles size={14} className="shrink-0 animate-pulse text-indigo-400" />
                <span>{demoModal.desc}</span>
              </div>

              <div className="space-y-2">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">Active Database Telemetries:</span>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {demoModal.list.map((item, id) => (
                    <div key={id} className="p-3 rounded-lg bg-slate-950 border border-slate-900 flex items-center justify-between gap-3 text-xs text-slate-300">
                      <span className="font-mono font-medium leading-relaxed">{item}</span>
                      <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase">Verif_OK</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3.5 border-t border-slate-800 bg-[#070b13]/50 flex justify-end">
              <button 
                onClick={() => setDemoModal(null)}
                className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors rounded-lg shadow-sm font-mono uppercase tracking-wider"
              >
                Close Sandbox Log
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
