import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { ArrowLeft, Loader2, Save, Users, Calendar } from "lucide-react";
import { useProject, useProjects } from "../../hooks/use-projects-tasks";
import { SecureFlowApiService } from "../../services/user-role.service";
import { UserDTO } from "../../types/user-role";

const editSchema = zod.object({
  name: zod.string().min(3, "Project title must contain at least 3 characters.").max(100),
  key: zod.string().min(2, "Code key must be between 2 and 5 characters.").max(5).toUpperCase(),
  description: zod.string().min(10, "Scope description must detail compliance guidelines."),
  projectManager: zod.string().min(1, "Portfolio Manager is required."),
  startDate: zod.string().min(1, "Start Date is required."),
  deadline: zod.string().min(1, "Deadline Date is required."),
  priority: zod.enum(["Low", "Medium", "High", "Critical"]),
  status: zod.enum(["Planning", "Active", "On Hold", "Completed", "Cancelled"]),
  department: zod.string().min(1, "Department is required."),
  tagsString: zod.string().optional(),
  riskLevel: zod.enum(["Low", "Medium", "High", "Critical"]),
  budget: zod.number().min(5000, "Portfolio budget must meet minimum parameters ($5000)."),
  visibility: zod.enum(["Private", "Internal", "Public"]),
}).refine(data => {
  const start = new Date(data.startDate);
  const end = new Date(data.deadline);
  return end >= start;
}, {
  message: "Completion target deadline must reach after the Start Date.",
  path: ["deadline"]
});

type EditFormValues = zod.infer<typeof editSchema>;

export default function EditProject() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { project, isLoading: isLoadingProj } = useProject(id || "");
  const { updateProject, isUpdating } = useProjects();
  
  const [systemUsers, setSystemUsers] = useState<UserDTO[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // Load system workers
  useEffect(() => {
    async function loadUsers() {
      setIsLoadingUsers(true);
      try {
        const list = await SecureFlowApiService.getUsers();
        setSystemUsers(list.filter(u => u.status === "Active"));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingUsers(false);
      }
    }
    loadUsers();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<EditFormValues>({
    resolver: zodResolver(editSchema)
  });

  // Pre-seed form fields from retrieved project parameters
  useEffect(() => {
    if (project) {
      reset({
        name: project.name,
        key: project.key,
        description: project.description,
        projectManager: project.projectManager,
        startDate: project.startDate,
        deadline: project.deadline,
        priority: project.priority,
        status: project.status,
        department: project.department,
        tagsString: project.tags.join(", "),
        riskLevel: project.riskLevel,
        budget: project.budget,
        visibility: project.visibility
      });
      setSelectedMembers(project.teamMembers.map(m => m.id));
    }
  }, [project, reset]);

  if (isLoadingProj) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
        <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Retreating subsystem node parameters...</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="py-12 text-center bg-[#090e1a] border border-slate-900 rounded-2xl max-w-lg mx-auto">
        <p className="text-xs font-mono text-rose-450 uppercase font-black">Subsystem Portfolio Not Located inside Register</p>
        <button 
          onClick={() => navigate("/projects")}
          className="mt-4 px-3 py-1 bg-slate-900 rounded-xl text-slate-350 text-[10px] uppercase font-mono font-bold"
        >
          Return to Registry
        </button>
      </div>
    );
  }

  const onFormSubmit = async (values: EditFormValues) => {
    if (selectedMembers.length === 0) {
      alert("At least one engineer must be assigned to this layout.");
      return;
    }

    try {
      const pmObj = systemUsers.find(u => u.fullName === values.projectManager);
      const membersToSave = systemUsers
        .filter(u => selectedMembers.includes(u.id))
        .map(u => ({
          id: u.id,
          fullName: u.fullName,
          email: u.email,
          role: u.role === "Project Manager" ? "Portfolio Coordinator" : "Applied Cryptography Engineer",
          avatar: u.avatar,
          onlineStatus: "online" as const,
          capacity: 80
        }));

      const tags = values.tagsString 
        ? values.tagsString.split(",").map(t => t.trim()).filter(t => t.length > 0)
        : [];

      await updateProject({
        id: project.id,
        fields: {
          name: values.name,
          key: values.key,
          description: values.description,
          projectManager: values.projectManager,
          projectManagerId: pmObj?.id,
          teamMembers: membersToSave,
          startDate: values.startDate,
          deadline: values.deadline,
          priority: values.priority,
          status: values.status,
          department: values.department,
          tags,
          riskLevel: values.riskLevel,
          budget: values.budget,
          visibility: values.visibility
        }
      });

      navigate(`/projects/${project.id}`);
    } catch (err: any) {
      alert("Registration override failed: " + err.message);
    }
  };

  const toggleMemberSelection = (userId: string) => {
    setSelectedMembers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header and Go Back buttons */}
      <div className="flex items-center gap-3 border-b border-slate-900 pb-5">
        <button
          type="button"
          onClick={() => navigate(`/projects/${project.id}`)}
          className="p-2 rounded-xl bg-slate-950 border border-slate-900 hover:border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white font-mono uppercase tracking-wider">
            Override Subsystem Record
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 uppercase font-mono tracking-widest">
            Key-signing code: {project.key} / Portfolio UUID: {project.id}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Core fields card */}
        <div className="bg-[#090e1a]/85 border border-slate-900 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md space-y-6">
          <h2 className="text-xs font-mono text-[#3b82f6] uppercase tracking-widest font-black flex items-center gap-2">
            <span>[SECTION I] PORTFOLIO PARAMETERS</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Title */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-extrabold block">
                Portfolio Subsystem Name *
              </label>
              <input
                type="text"
                {...register("name")}
                className="w-full bg-[#03060c] border border-slate-900 rounded-xl py-2 px-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#5f5bf6] transition-all"
              />
              {errors.name && (
                <p className="text-[10px] font-mono text-rose-450 mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Key code */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-extrabold block">
                Code Key * (2-5 Uppercase Letters)
              </label>
              <input
                type="text"
                {...register("key")}
                className="w-full bg-[#03060c] border border-slate-900 rounded-xl py-2 px-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#5f5bf6] transition-all font-mono font-bold"
              />
              {errors.key && (
                <p className="text-[10px] font-mono text-rose-450 mt-1">{errors.key.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-extrabold block">
              Subsytem Functional Scope & Security Auditing Brief *
            </label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full bg-[#03060c] border border-slate-900 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#5f5bf6] transition-all font-sans leading-relaxed"
            />
            {errors.description && (
              <p className="text-[10px] font-mono text-rose-450 mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 border-t border-slate-900/60 pt-5">
            {/* PM select */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-extrabold block">
                Portfolio Officer Manager *
              </label>
              <select
                {...register("projectManager")}
                className="w-full bg-[#03060c] border border-slate-900 rounded-xl p-2.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-[#5f5bf6]"
              >
                <option value="">SELECT OFFICER</option>
                <option value="Sarah Jenkins">Sarah Jenkins (Project Manager)</option>
                <option value="Alex Rivera">Alex Rivera (System Admin)</option>
                <option value="Marcus Vane">Marcus Vane (Ledger Manager)</option>
                <option value="Kaelen Mercer">Kaelen Mercer (Cryptographer Dev)</option>
              </select>
              {errors.projectManager && (
                <p className="text-[10px] font-mono text-rose-450 mt-1">{errors.projectManager.message}</p>
              )}
            </div>

            {/* Department */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-extrabold block">
                Departmental Allocation *
              </label>
              <select
                {...register("department")}
                className="w-full bg-[#03060c] border border-slate-900 rounded-xl p-2.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-[#5f5bf6]"
              >
                <option value="">SELECT DEPARTMENT</option>
                <option value="Secured Banking">Secured Banking</option>
                <option value="Compliance Architecture">Compliance Architecture</option>
                <option value="Treasury Operations">Treasury Operations</option>
                <option value="Consumer Credit">Consumer Credit</option>
                <option value="Infrastructure Security">Infrastructure Security</option>
              </select>
              {errors.department && (
                <p className="text-[10px] font-mono text-rose-450 mt-1">{errors.department.message}</p>
              )}
            </div>

            {/* Budget */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-extrabold block">
                Portfolio Budget Allocation ($ USD) *
              </label>
              <input
                type="number"
                {...register("budget", { valueAsNumber: true })}
                className="w-full bg-[#03060c] border border-slate-900 text-xs text-white px-3 py-2.5 rounded-xl font-mono focus:outline-none focus:border-[#5f5bf6]"
              />
              {errors.budget && (
                <p className="text-[10px] font-mono text-rose-450 mt-1">{errors.budget.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Security configuration card */}
        <div className="bg-[#090e1a]/85 border border-slate-900 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md space-y-6">
          <h2 className="text-xs font-mono text-[#10b981] uppercase tracking-widest font-black flex items-center gap-2">
            <span>[SECTION II] CRYPTOGRAPHIC & CLASSIFICATION CONTROLS</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Priority Select */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-extrabold block">
                Project Priority Rank
              </label>
              <select
                {...register("priority")}
                className="w-full bg-[#03060c] border border-slate-900 rounded-xl p-2.5 text-xs text-slate-300 font-mono focus:outline-none"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
                <option value="Critical">Critical SecOps</option>
              </select>
            </div>

            {/* Risk Select */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-extrabold block">
                Risk Classification Level
              </label>
              <select
                {...register("riskLevel")}
                className="w-full bg-[#03060c] border border-slate-900 rounded-xl p-2.5 text-xs text-slate-300 font-mono focus:outline-none"
              >
                <option value="Low">Low Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="High">High Risk</option>
                <option value="Critical">Critical Risk</option>
              </select>
            </div>

            {/* Visibility Select */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-extrabold block">
                Information Classification Scope
              </label>
              <select
                {...register("visibility")}
                className="w-full bg-[#03060c] border border-slate-900 rounded-xl p-2.5 text-xs text-slate-300 font-mono focus:outline-none"
              >
                <option value="Private">Private / Vault Restrict</option>
                <option value="Internal">Internal SecureFlow Use</option>
                <option value="Public">Public / Client Shared</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 border-t border-slate-900/60 pt-5">
            {/* Start date */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-extrabold block">
                Development Start Target Date *
              </label>
              <div className="relative">
                <Calendar size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-550" />
                <input
                  type="date"
                  {...register("startDate")}
                  className="w-full bg-[#03060c] border border-slate-905 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-650 focus:outline-none transition-all font-mono"
                />
              </div>
            </div>

            {/* Deadline date */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-extrabold block">
                Completion Deadline Target *
              </label>
              <div className="relative">
                <Calendar size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-550" />
                <input
                  type="date"
                  {...register("deadline")}
                  className="w-full bg-[#03060c] border border-slate-905 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-655 focus:outline-none transition-all font-mono"
                />
              </div>
              {errors.deadline && (
                <p className="text-[10px] font-mono text-rose-455 mt-1">{errors.deadline.message}</p>
              )}
            </div>

            {/* Status Selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-extrabold block">
                Initial Pipeline Status
              </label>
              <select
                {...register("status")}
                className="w-full bg-[#03060c] border border-slate-900 rounded-xl p-2.5 text-xs text-slate-300 font-mono focus:outline-none"
              >
                <option value="Planning font-mono">Planning</option>
                <option value="Active">Active</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Tags string */}
          <div className="space-y-2 pt-4 border-t border-slate-900/60">
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-extrabold block">
              Subsystem Cryptographic Tags (Comma separated list)
            </label>
            <input
              type="text"
              {...register("tagsString")}
              placeholder="e.g. HSM, Audit, HSM-Sync, Swift"
              className="w-full bg-[#03060c] border border-slate-900 rounded-xl py-2 px-3 text-xs text-white focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* Team allocation card */}
        <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md space-y-6">
          <h2 className="text-xs font-mono text-[#f59e0b] uppercase tracking-widest font-black flex items-center gap-2">
            <Users size={14} />
            <span>[SECTION III] OPERATIONAL TEAM ALLOCATION</span>
          </h2>

          <div className="space-y-3">
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">
              Select Engineers & Auditors coordinates to bundle with this portfolio node:
            </p>

            {isLoadingUsers ? (
              <div className="py-6 text-center text-slate-550 font-mono text-xs">COMMUNICATING WITH USER DATABASE...</div>
            ) : systemUsers.length === 0 ? (
              <div className="py-6 text-center text-slate-550 font-mono text-xs">NO COORD WORKERS IDENTIFIED.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {systemUsers.map((user) => {
                  const isSelected = selectedMembers.includes(user.id);
                  return (
                    <div
                      key={user.id}
                      onClick={() => toggleMemberSelection(user.id)}
                      className={`border rounded-xl p-3 flex items-center justify-between cursor-pointer transition-all ${
                        isSelected 
                          ? "bg-indigo-950/20 border-indigo-500/30 text-white" 
                          : "bg-slate-950/20 border-slate-900 text-slate-400 hover:border-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                          alt={user.fullName}
                          className="w-8 h-8 rounded-full object-cover border border-slate-905"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="text-xs font-semibold">{user.fullName}</div>
                          <div className="text-[9px] font-mono text-slate-500 leading-none uppercase">{user.role} ({user.department})</div>
                        </div>
                      </div>

                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                        isSelected 
                          ? "border-indigo-500 bg-indigo-600 text-white" 
                          : "border-slate-850 bg-slate-950"
                      }`}>
                        {isSelected && <span className="text-[9px] leading-none">✔</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Buttons bottom rows */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => navigate(`/projects/${project.id}`)}
            className="px-5 py-2.5 rounded-xl border border-slate-900 hover:border-slate-850 bg-slate-950 text-slate-400 hover:text-white font-mono text-xs font-extrabold uppercase transition-all cursor-pointer"
          >
            DISCARD OVERRIDES
          </button>

          <button
            type="submit"
            disabled={isUpdating}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:pointer-events-none text-white font-mono text-xs font-extrabold uppercase flex items-center gap-2 tracking-wider transition-all cursor-pointer hover:shadow-lg shadow-indigo-950/40"
          >
            {isUpdating ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Save size={14} />
            )}
            COMMIT SYSTEM RECORD OVERRIDES
          </button>
        </div>
      </form>
    </div>
  );
}
