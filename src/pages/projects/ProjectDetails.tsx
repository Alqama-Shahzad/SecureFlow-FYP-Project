import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Edit3, 
  Layers, 
  Users, 
  FileCode, 
  ShieldAlert, 
  Activity as ActivityIcon, 
  Plus, 
  Trash2, 
  Upload, 
  CheckCircle, 
  Loader2,
  Lock,
  ExternalLink,
  Info,
  DollarSign
} from "lucide-react";
import { useProject, useTasks } from "../../hooks/use-projects-tasks";
import { StatusBadge, PriorityBadge, ProgressBar } from "../../components/shared/CommonParts";
import { cn } from "@/lib/utils";
import { SecureFlowApiService } from "../../services/user-role.service";
import { UserDTO } from "../../types/user-role";

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { project, isLoading, isError, activities, addMember, removeMember } = useProject(id || "");
  const { tasks, isLoading: isLoadingTasks, createTask } = useTasks(id);

  // Tabs setup
  const [activeTab, setActiveTab] = useState<"overview" | "team" | "tasks" | "activity" | "files" | "security">("overview");

  // File drag & drop simulator state
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([
    { id: "f-1", name: "HSM_Signer_Certificate_V2.pem", size: "12 KB", uploader: "Elena Petrova", date: "2026-06-17", version: 2 },
    { id: "f-2", name: "SWIFT_Payload_Format_Spec.pdf", size: "1.4 MB", uploader: "Sarah Jenkins", date: "2026-06-15", version: 1 },
    { id: "f-3", name: "Incident_Mitigation_Playbook_v4.pdf", size: "480 KB", uploader: "Alex Rivera", date: "2026-06-19", version: 4 }
  ]);

  // Security compliancechecklist items
  const [complianceChecks, setComplianceChecks] = useState([
    { id: "c-1", label: "HSM dual-control keys rotation scheme validated", passed: true, section: "Vault" },
    { id: "c-2", label: "Strict HS512/TLS 1.3 verification implemented in production builds", passed: true, section: "Cryptology" },
    { id: "c-3", label: "SQL parameterized input filters covering Drizzle files", passed: false, section: "Databases" },
    { id: "c-4", label: "Audit logs replication to cold-storage zones active", passed: true, section: "Infrastructure" },
    { id: "c-5", label: "IDS triggers configured for rate limit / VPN anomalies", passed: false, section: "Network" }
  ]);

  const [newMemberId, setNewMemberId] = useState("");
  const [allUsers, setAllUsers] = useState<UserDTO[]>([]);

  // Load all users on render to allow manual team allocations
  React.useEffect(() => {
    async function loadUsers() {
      try {
        const u = await SecureFlowApiService.getUsers();
        setAllUsers(u.filter(usr => usr.status === "Active"));
      } catch (err) {
        console.error(err);
      }
    }
    loadUsers();
  }, []);

  const availableUsersToAdd = useMemo(() => {
    if (!project) return [];
    const currentIds = project.teamMembers.map((m) => m.id);
    return allUsers.filter((u) => !currentIds.includes(u.id));
  }, [allUsers, project]);

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
        <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Loading subsystem portfolio variables...</span>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="py-12 text-center bg-[#090e1a] border border-slate-900 rounded-2xl max-w-lg mx-auto">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-4 animate-bounce" />
        <p className="text-xs font-mono text-rose-450 uppercase font-black">Subsystem node could not be retrieved from active systems</p>
        <button 
          onClick={() => navigate("/projects")}
          className="mt-4 px-4 py-2 bg-slate-900 rounded-xl text-slate-350 text-[10px] uppercase font-mono font-bold"
        >
          Return to portfolios
        </button>
      </div>
    );
  }

  // Handle member allocation add
  const handleAddMember = async () => {
    if (!newMemberId) return;
    const user = allUsers.find((u) => u.id === newMemberId);
    if (!user) return;

    try {
      await addMember({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role === "Project Manager" ? "Portfolio Coordinator" : "Field Specialist Engineer",
        avatar: user.avatar,
        onlineStatus: "online",
        capacity: 80
      });
      setNewMemberId("");
    } catch (err) {
       console.error(err);
    }
  };

  // Handle member deallocation
  const handleRemoveMember = async (memberId: string) => {
    if (window.confirm("Are you sure you want to deallocate this worker from the portfolio?")) {
      try {
        await removeMember(memberId);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Handle simple file drag drop simulation
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    // Simulate drop
    const mockFile = {
      id: "f-" + Math.random().toString(36).substr(2, 9),
      name: "Uploaded_SecOps_Asset_" + Date.now().toString().slice(-4) + ".pdf",
      size: "72 KB",
      uploader: "Alex Rivera",
      date: new Date().toISOString().split("T")[0],
      version: 1
    };
    setFiles([mockFile, ...files]);
  };

  // Toggle compliance checklist checkboxes
  const toggleCompliance = (cid: string) => {
    setComplianceChecks(prev =>
      prev.map(c => c.id === cid ? { ...c, passed: !c.passed } : c)
    );
  };

  const formattedBudget = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(project.budget);

  return (
    <div className="space-y-6">
      {/* Upper Navigation Title row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-900 pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/projects")}
            className="p-2 rounded-xl bg-slate-950 border border-slate-900 hover:border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white font-mono uppercase tracking-wider">
                {project.name}
              </h1>
              <span className="text-[10px] font-mono p-0.5 px-2 bg-indigo-950/40 border border-indigo-500/20 text-indigo-400 font-extrabold rounded">
                CODE: {project.key}
              </span>
            </div>
            <p className="text-xs text-slate-400 uppercase font-mono mt-0.5 tracking-widest leading-none">
              Officer: {project.projectManager} / Department: {project.department}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/projects/${project.id}/edit`)}
            className="p-2.5 px-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-[10px] font-black uppercase font-mono tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Edit3 size={13} />
            OVERRIDE PARAMETERS
          </button>
        </div>
      </div>

      {/* Tabs selectors row */}
      <div className="flex items-center gap-1.5 border-b border-slate-900 pb-px overflow-x-auto select-none">
        {[
          { id: "overview", label: "OVERVIEW DETAILS", icon: <Info size={13} /> },
          { id: "team", label: "ALLOCATED WORKERS", icon: <Users size={13} /> },
          { id: "tasks", label: "INTEGRATED TASKS", icon: <Layers size={13} /> },
          { id: "activity", label: "TACTICAL ACTIVITY", icon: <ActivityIcon size={13} /> },
          { id: "files", label: "CRYPTOGRAPHIC FILES", icon: <FileCode size={13} /> },
          { id: "security", label: "SECOP COMPLIANCE", icon: <ShieldAlert size={13} /> }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "py-3 px-4 font-mono text-[10px] font-black uppercase tracking-wider leading-none border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap",
                isActive 
                  ? "border-[#5f5bf6] text-[#60a5fa]" 
                  : "border-transparent text-slate-450 hover:text-slate-200 hover:border-slate-800"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Active Tab Panel */}
      <div className="mt-6">
        {/* ================= OVERVIEW TAB ================= */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Detailed Description */}
              <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md">
                <h3 className="text-xs font-mono text-[#3b82f6] uppercase tracking-widest font-black mb-3">[PORTFOLIO ACTION SCOPE]</h3>
                <p className="text-sm text-slate-300 leading-relaxed font-sans">{project.description}</p>

                {/* Subsystem Tag Groups */}
                {project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t border-slate-900/60">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-900 text-slate-400 font-mono text-[9px] font-bold">
                        #{tag.toUpperCase()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Tasks Summary linked with Recharts simulated breakdown */}
              <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md">
                <h3 className="text-xs font-mono text-[#10b981] uppercase tracking-widest font-black mb-4 flex items-center justify-between">
                  <span>[SUBSYSTEM TASKS COORD]</span>
                  <button 
                    onClick={() => navigate("/tasks")} 
                    className="text-[9px] hover:underline cursor-pointer text-indigo-400 flex items-center gap-0.5 font-bold"
                  >
                    KANBAN FEED 
                    <ExternalLink size={10} />
                  </button>
                </h3>

                {isLoadingTasks ? (
                  <div className="py-6 text-center text-slate-600 font-mono text-xs">QUERYING PORTFOLIO WORK NODES...</div>
                ) : tasks.length === 0 ? (
                  <div className="py-12 border-2 border-dashed border-slate-900 rounded-xl p-6 text-center space-y-3">
                    <p className="text-xs text-slate-500 font-mono">No tasks allocated for this subsystem workspace.</p>
                    <button 
                      onClick={() => navigate("/tasks/create")}
                      className="p-1 px-3 bg-indigo-600 text-[10px] text-white font-mono rounded"
                    >
                      ALLOCATE CRYPTO TASK
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { l: "Allocated", count: tasks.length, color: "text-slate-300 bg-slate-950/40" },
                      { l: "Todo / Ready", count: tasks.filter(t => t.status === "Todo").length, color: "text-indigo-400 bg-indigo-950/20" },
                      { l: "In Flight", count: tasks.filter(t => t.status === "In Progress").length, color: "text-blue-400 bg-blue-950/20" },
                      { l: "Audit Ready", count: tasks.filter(t => t.status === "Review").length, color: "text-amber-400 bg-amber-950/20" },
                    ].map((st, i) => (
                      <div key={i} className={`p-4 rounded-xl border border-slate-900/60 text-center ${st.color}`}>
                        <div className="text-2xl font-black font-mono leading-none text-white">{String(st.count).padStart(2, "0")}</div>
                        <div className="text-[9px] font-mono uppercase text-slate-400 font-bold mt-1 tracking-wider">{st.l}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar metadata details */}
            <div className="space-y-6">
              {/* Critical Specs Info Box */}
              <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-4">
                <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest font-black border-b border-slate-900 pb-2.5">
                  [NODE OVERWATCH VARIABLES]
                </h3>

                <div className="space-y-3.5 font-mono text-[10px]">
                  {/* Status */}
                  <div className="flex items-center justify-between gap-1 border-b border-slate-900/40 pb-2">
                    <span className="text-slate-500 font-bold">STATE CRITERION:</span>
                    <StatusBadge status={project.status} />
                  </div>

                  {/* Priority */}
                  <div className="flex items-center justify-between gap-1 border-b border-slate-900/40 pb-2">
                    <span className="text-slate-500 font-bold">PRIORITY RANK:</span>
                    <PriorityBadge priority={project.priority} />
                  </div>

                  {/* Risks */}
                  <div className="flex items-center justify-between gap-1 border-b border-slate-900/40 pb-2">
                    <span className="text-slate-500 font-bold">RISK CLASSIFICATION:</span>
                    <span className={cn(
                      "px-1.5 py-0.5 rounded font-mono text-[9px] font-bold border tracking-wider",
                      project.riskLevel === "Critical" ? "text-rose-400 bg-rose-955/20 border-rose-500/20" :
                      project.riskLevel === "High" ? "text-amber-400 bg-amber-955/20 border-amber-500/20" :
                      project.riskLevel === "Medium" ? "text-sky-400 bg-sky-955/20 border-sky-500/20" :
                      "text-slate-450 bg-slate-950 border-slate-900"
                    )}>
                      {project.riskLevel.toUpperCase()} LEVEL
                    </span>
                  </div>

                  {/* Visibility */}
                  <div className="flex items-center justify-between gap-1 border-b border-slate-900/40 pb-2">
                    <span className="text-slate-500 font-bold">SECOP SECURITY LEVEL:</span>
                    <span className="text-[#3b82f6] font-extrabold uppercase">{project.visibility} VAULT</span>
                  </div>

                  {/* Operational Budget */}
                  <div className="flex items-center justify-between gap-1 border-b border-slate-900/40 pb-2">
                    <span className="text-slate-500 font-bold">BUDGET ALLOCATED:</span>
                    <div className="flex items-center gap-0.5 text-white font-extrabold">
                      <DollarSign size={9} className="text-emerald-500" />
                      <span>{formattedBudget}</span>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-2 pt-1 border-b border-slate-900/40 pb-3">
                    <div>
                      <span className="text-slate-500 block text-[8px] font-black uppercase">START COMMITTED</span>
                      <span className="text-slate-205 font-bold">{project.startDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[8px] font-black uppercase font-bold text-slate-500">TARGET DEADLINE</span>
                      <span className="text-white font-black">{project.deadline}</span>
                    </div>
                  </div>
                </div>

                {/* Progress compliance bar */}
                <div className="pt-2">
                  <ProgressBar value={project.progress} showText />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= ALLOCATED WORKERS TAB ================= */}
        {activeTab === "team" && (
          <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-900 pb-4">
              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
                  Allocated Cryptographic & Audit Staff
                </h3>
                <p className="text-xs text-slate-400 mt-1">Manage specialist personnel permitted to interact with this compliance cell.</p>
              </div>

              {/* Add Member controller dropdown */}
              {availableUsersToAdd.length > 0 && (
                <div className="flex items-center gap-2.5">
                  <select
                    value={newMemberId}
                    onChange={(e) => setNewMemberId(e.target.value)}
                    className="bg-[#03060c] border border-slate-900 rounded-xl p-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-indigo-600"
                  >
                    <option value="">ALLOCATE WORKER...</option>
                    {availableUsersToAdd.map((avail) => (
                      <option key={avail.id} value={avail.id}>
                        {avail.fullName.toUpperCase()} - {avail.role.toUpperCase()}
                      </option>
                    ))}
                  </select>

                  <button
                    disabled={!newMemberId}
                    onClick={handleAddMember}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl text-[10px] font-black uppercase font-mono tracking-widest flex items-center gap-1 cursor-pointer transition-all"
                  >
                    <Plus size={12} />
                    PERMIT ACCESS
                  </button>
                </div>
              )}
            </div>

            {/* Allocated members tables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-slate-950/40 border border-slate-900 rounded-2xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={member.avatar || "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80"}
                      alt={member.fullName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-900"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-xs font-extrabold text-white">{member.fullName}</h4>
                      <p className="text-[10px] font-mono text-slate-500 leading-none uppercase mt-0.5">{member.role}</p>
                      
                      {/* Connection state */}
                      <span className="inline-flex items-center gap-1 text-[9px] text-[#10b981] font-mono font-bold mt-1.5 uppercase">
                        <span className="w-1 h-1 rounded-full bg-emerald-400" />
                        node-active
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right font-mono">
                      <span className="block text-[8px] text-slate-500 font-black uppercase">WORK CAPACITY</span>
                      <span className="text-xs font-extrabold text-slate-300">{member.capacity}% Max</span>
                    </div>

                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="p-1.5 rounded-lg border border-slate-900 hover:border-rose-950 hover:bg-rose-950/20 hover:text-rose-450 text-slate-600 transition-all cursor-pointer"
                      title="Deallocate and revoke access certs"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= INTEGRATED TASKS TAB ================= */}
        {activeTab === "tasks" && (
          <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md space-y-6">
            <div className="flex items-center justify-between border-b border-slate-900 pb-4">
              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
                  Allocated Cryptographic Task Nodes
                </h3>
                <p className="text-xs text-slate-400 mt-1">Specific security requirements mapped inside CBP pipeline.</p>
              </div>

              <button
                onClick={() => navigate("/tasks/create", { state: { prefilledProjectId: project.id } })}
                className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase font-mono tracking-widest flex items-center gap-1 transition-all cursor-pointer"
              >
                <Plus size={13} />
                ALLOCATE NEW TASK
              </button>
            </div>

            {isLoadingTasks ? (
              <div className="py-6 text-center text-slate-650 font-mono text-xs animate-pulse">RECONCILING AUDIT LOGS...</div>
            ) : tasks.length === 0 ? (
              <div className="py-12 text-center text-slate-500 font-mono text-xs">NO ACTIONS DECLARED IN TASK ARCHIVE yet.</div>
            ) : (
              <div className="divide-y divide-slate-900/60 text-xs">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => navigate(`/tasks/${task.id}`)}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-[#060a12]/30 px-3 rounded-xl transition-all cursor-pointer group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono p-0.5 px-1 bg-indigo-950/40 border border-indigo-500/15 text-indigo-400 rounded">
                          {task.id}
                        </span>
                        <h4 className="font-extrabold text-slate-200 group-hover:text-indigo-450 transition-colors uppercase tracking-tight">
                          {task.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-450 font-sans line-clamp-1 max-w-xl">{task.description}</p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 sm:self-center self-start">
                      <PriorityBadge priority={task.priority} />
                      <StatusBadge status={task.status} />

                      <div className="flex items-center gap-2">
                        {task.assigneeAvatar ? (
                          <img
                            src={task.assigneeAvatar}
                            alt={task.assigneeName || "Worker"}
                            className="w-5.5 h-5.5 rounded-full object-cover ring-1 ring-slate-800"
                            title={task.assigneeName}
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-5.5 h-5.5 rounded-full bg-slate-900 border border-slate-800 text-[8px] font-mono flex items-center justify-center text-slate-500" title="Unassigned">X</div>
                        )}
                        <span className="text-[10px] text-slate-400 font-mono font-bold">{task.dueDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TACTICAL ACTIVITY TAB ================= */}
        {activeTab === "activity" && (
          <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md space-y-6">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono border-b border-slate-900 pb-3">
              Chronological Tactical Audit Log
            </h3>

            {activities.length === 0 ? (
              <div className="py-12 text-center text-slate-500 font-mono text-xs">NO MILITARY RECORD DETECTED ON THIS PORTFOLIO.</div>
            ) : (
              <div className="relative border-l border-slate-900 pl-4 ml-2.5 space-y-6 text-xs">
                {activities.map((act) => (
                  <div key={act.id} className="relative group">
                    {/* Pulsing state dot */}
                    <span className="absolute -left-[20.5px] top-1 h-3 w-3 rounded-full bg-slate-950 border-2 border-indigo-500 shadow-[0_0_8px_#5f5bf6]" />

                    <div className="space-y-0.5">
                      <div className="font-mono text-[10px] text-indigo-400 font-black">{act.timestamp}</div>
                      <div className="font-sans text-slate-200">
                        <span className="font-extrabold text-slate-355">{act.user}</span>: {act.action}
                      </div>
                      <div className="text-[8px] font-mono text-slate-500 uppercase tracking-widest pt-0.5">
                        Scope type: {act.targetType} / Log reference: {act.id}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= FILE ATTACHMENTS TAB ================= */}
        {activeTab === "files" && (
          <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
                Cryptographic Audit File Repository
              </h3>
              <p className="text-xs text-slate-400 mt-1">Upload and review certs, specs, security blueprints, and logs.</p>
            </div>

            {/* Drag and Drop Box */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer",
                isDragging 
                  ? "bg-indigo-950/20 border-indigo-500" 
                  : "bg-slate-950/20 border-slate-900 hover:border-slate-800"
              )}
            >
              <Upload className="w-10 h-10 text-slate-650 mx-auto mb-3 animate-pulse" />
              <p className="text-xs font-mono text-slate-400 uppercase font-bold">
                Drag and drop cryptographic certs or blue-records here
              </p>
              <p className="text-[10px] text-slate-505 font-mono uppercase mt-1">
                Supports .pem, .key, .pdf, .json (Max 12MB)
              </p>
            </div>

            {/* Files List Table */}
            <div className="border border-slate-900 rounded-xl overflow-hidden font-mono text-[10px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 bg-[#03060c] text-slate-455 uppercase font-bold tracking-wider">
                    <th className="py-3 px-4 pl-5">Asset Filename</th>
                    <th className="py-3 px-4 text-center">Version</th>
                    <th className="py-3 px-4">Size</th>
                    <th className="py-3 px-4 block sm:inline-block">Uploaded by</th>
                    <th className="py-3 pr-5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/60 text-slate-355">
                  {files.map((file) => (
                    <tr key={file.id} className="hover:bg-slate-950/30">
                      <td className="py-3 px-4 pl-5 font-bold text-white uppercase">{file.name}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-1.5 py-0.5 bg-indigo-950/40 border border-indigo-500/15 rounded text-indigo-400 text-[8px] font-black">
                          v{file.version}.0
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">{file.size}</td>
                      <td className="py-3 px-4 text-slate-400 uppercase">{file.uploader} ({file.date})</td>
                      <td className="py-3 pr-5 px-4 text-right">
                        <button
                          onClick={() => setFiles(files.filter(f => f.id !== file.id))}
                          className="p-1 rounded text-slate-600 hover:text-rose-400 hover:bg-rose-950/20 transition-all cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= SECURITY COMPLIANCE TAB ================= */}
        {activeTab === "security" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Compliance Checklist */}
              <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md">
                <h3 className="text-xs font-mono text-[#10b981] uppercase tracking-widest font-black border-b border-slate-900 pb-3 mb-5">
                  [COMPLIANCE CERTIFICATION AUDIT RULES]
                </h3>

                <div className="space-y-4 text-xs font-mono select-none">
                  {complianceChecks.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleCompliance(item.id)}
                      className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/30 border border-slate-950 hover:border-slate-800 transition-all cursor-pointer"
                    >
                      <div className="pt-0.5">
                        <div className={cn(
                          "w-4.5 h-4.5 border rounded flex items-center justify-center transition-all shrink-0",
                          item.passed 
                            ? "bg-emerald-950/30 border-emerald-500 text-emerald-400" 
                            : "bg-slate-900 border-slate-850 text-slate-550"
                        )}>
                          {item.passed && <span>✔</span>}
                        </div>
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className={cn(
                          "font-bold transition-all uppercase leading-tight",
                          item.passed ? "text-slate-205 line-through decoration-slate-600" : "text-slate-105"
                        )}>
                          {item.label}
                        </div>
                        <div className="text-[8px] tracking-widest text-slate-550 flex items-center gap-1.5 uppercase leading-none font-bold">
                          <span>SECTION: {item.section}</span>
                          <span>•</span>
                          <span className={item.passed ? "text-emerald-500" : "text-amber-500 animate-pulse"}>
                            {item.passed ? "PASS" : "ACTION REQUIRED"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Simulated HSM details */}
            <div className="space-y-6">
              <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-4">
                <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest font-black border-b border-slate-900 pb-2">
                  [CALCULATING KEY WRAPPINGS]
                </h3>

                <div className="space-y-3 font-mono text-[10px]">
                  <div className="p-3 bg-indigo-950/15 border border-indigo-500/10 rounded-xl space-y-2">
                    <span className="block text-[8px] text-indigo-400 font-extrabold uppercase">CALIBRATING CLOUD-HSM NODES</span>
                    <div className="flex justify-between items-center text-xs font-black text-white">
                      <span>HSM-WEST-01:</span>
                      <span className="text-emerald-400">ONLINE</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-black text-white">
                      <span>HSM-DR-02:</span>
                      <span className="text-emerald-400">ONLINE</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-black text-white">
                      <span>WRAPPER KEY STAGE:</span>
                      <span className="text-[#3b82f6]">FIPS-140-2 LEVEL 3</span>
                    </div>
                  </div>

                  <div className="text-slate-500 font-sans text-xs leading-relaxed">
                    Note: To edit rotation rates, HSM wrapping parameters, or compliance guidelines, modify the core portfolio registry properties under Overview parameters.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
