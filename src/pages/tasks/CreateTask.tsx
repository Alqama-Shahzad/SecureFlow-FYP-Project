import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { ArrowLeft, Loader2, Save, FileCode, Users, Plus } from "lucide-react";
import { useTasks, useProjects } from "../../hooks/use-projects-tasks";
import { SecureFlowApiService } from "../../services/user-role.service";
import { UserDTO } from "../../types/user-role";

const taskSchema = zod.object({
  title: zod.string().min(5, "Task title must contain at least 5 characters.").max(100),
  description: zod.string().min(10, "Detail specific operational criteria for developers."),
  projectId: zod.string().min(1, "Please allocate this task to a project subsystem portfolio."),
  assigneeId: zod.string().optional(),
  priority: zod.enum(["Low", "Medium", "High", "Critical"]),
  status: zod.enum(["Todo", "In Progress", "Review", "Done"]),
  dueDate: zod.string().min(1, "Target timeline deadline is required."),
  estimatedHours: zod.number().min(1, "Allocate at least 1 design hour.").max(500),
  labelsString: zod.string().optional()
});

type TaskFormValues = zod.infer<typeof taskSchema>;

export default function CreateTask() {
  const navigate = useNavigate();
  const location = useLocation();
  const { createTask, isCreating } = useTasks();
  const { projects } = useProjects();

  const [systemUsers, setSystemUsers] = useState<UserDTO[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // Prefill projectId if passed from project workspace redirect
  const prefilledProjectId = location.state?.prefilledProjectId || "";

  useEffect(() => {
    async function loadUsers() {
      setIsLoadingUsers(true);
      try {
        const u = await SecureFlowApiService.getUsers();
        setSystemUsers(u.filter(usr => usr.status === "Active"));
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
    watch,
    formState: { errors }
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      projectId: prefilledProjectId,
      priority: "Medium",
      status: "Todo",
      estimatedHours: 8,
      dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split("T")[0] // one week from now
    }
  });

  const watchProjectId = watch("projectId");

  // Filter assignable engineers by selected project team allocation!
  const assignablePersonnel = useMemo(() => {
    if (!watchProjectId) return systemUsers;
    const selectedProj = projects.find(p => p.id === watchProjectId);
    if (!selectedProj) return systemUsers;
    
    const assignedIds = selectedProj.teamMembers.map(m => m.id);
    return systemUsers.filter(u => assignedIds.includes(u.id));
  }, [watchProjectId, projects, systemUsers]);

  const onFormSubmit = async (values: TaskFormValues) => {
    try {
      const parentProj = projects.find(p => p.id === values.projectId);
      if (!parentProj) throw new Error("Target project portfolio node non-existent.");

      let assigneeName = "Unassigned";
      let assigneeAvatar = "";

      if (values.assigneeId) {
        const matchingAssignee = systemUsers.find(u => u.id === values.assigneeId);
        if (matchingAssignee) {
          assigneeName = matchingAssignee.fullName;
          assigneeAvatar = matchingAssignee.avatar || "";
        }
      }

      const labels = values.labelsString 
        ? values.labelsString.split(",").map(l => l.trim()).filter(l => l.length > 0)
        : [];

      await createTask({
        title: values.title,
        description: values.description,
        projectId: values.projectId,
        projectName: parentProj.name,
        projectKey: parentProj.key,
        assigneeId: values.assigneeId || undefined,
        assigneeName: values.assigneeId ? assigneeName : undefined,
        assigneeAvatar: values.assigneeId ? assigneeAvatar : undefined,
        priority: values.priority,
        status: values.status,
        labels,
        dueDate: values.dueDate,
        estimatedHours: values.estimatedHours,
        dependencies: []
      });

      // Redirect back to Kanban board or project details
      if (prefilledProjectId) {
        navigate(`/projects/${prefilledProjectId}`);
      } else {
        navigate("/tasks");
      }
    } catch (err: any) {
      alert("Task creation failure: " + err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header titles row */}
      <div className="flex items-center gap-3 border-b border-slate-900 pb-5">
        <button
          onClick={() => {
            if (prefilledProjectId) {
              navigate(`/projects/${prefilledProjectId}`);
            } else {
              navigate("/tasks");
            }
          }}
          className="p-2 rounded-xl bg-slate-950 border border-slate-900 hover:border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white font-mono uppercase tracking-wider">
            Declare Task Requirement
          </h1>
          <p className="text-xs text-slate-405 mt-0.5 uppercase font-mono tracking-widest leading-none">
            Register cryptographic action coordinates inside target portfolio
          </p>
        </div>
      </div>

      {/* Main Forms body */}
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Core fields cards */}
        <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md space-y-6">
          <h2 className="text-xs font-mono text-[#3b82f6] uppercase tracking-widest font-black mb-3">
            [SECTION I] TASK SPECIFICATIONS
          </h2>

          {/* Project subsytem allocation select */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-extrabold block">
              Allocate Project Subsystem Portfolio *
            </label>
            <select
              {...register("projectId")}
              className="w-full bg-[#03060c] border border-slate-900 rounded-xl p-2.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-[#3b82f6]"
            >
              <option value="">SELECT TARGET SUBSYSTEM...</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name.toUpperCase()} [{p.key}]
                </option>
              ))}
            </select>
            {errors.projectId && (
              <p className="text-[10px] font-mono text-rose-455 mt-1">{errors.projectId.message}</p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-extrabold block">
              Task Brief Title *
            </label>
            <input
              type="text"
              {...register("title")}
              placeholder="e.g. Enforce AES-GCM decryption checking in vault controllers"
              className="w-full bg-[#03060c] border border-slate-900 rounded-xl py-2 px-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#3b82f6] transition-all"
            />
            {errors.title && (
              <p className="text-[10px] font-mono text-rose-455 mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Detailed description */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-extrabold block">
              Functional Specifications & Action Conditions *
            </label>
            <textarea
              {...register("description")}
              rows={5}
              placeholder="Provide clean instructions, error thresholds, target files list, dependencies, and testing schemas..."
              className="w-full bg-[#03060c] border border-slate-900 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#3b82f6] transition-all font-sans leading-relaxed text-slate-300"
            />
            {errors.description && (
              <p className="text-[10px] font-mono text-rose-455 mt-1">{errors.description.message}</p>
            )}
          </div>
        </div>

        {/* Operational Allocations cards */}
        <div className="bg-[#090e1a]/85 border border-slate-900 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md space-y-6">
          <h2 className="text-xs font-mono text-[#10b981] uppercase tracking-widest font-black mb-3">
            [SECTION II] DEVELOPMENTAL COORDINATES
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Operator select */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-extrabold block flex items-center justify-between">
                <span>ASSIGNED ENGINEER</span>
                {watchProjectId && <span className="text-[8px] text-[#2563eb] font-bold">PROJECT CAP SEALED</span>}
              </label>

              <select
                {...register("assigneeId")}
                className="w-full bg-[#03060c] border border-slate-900 rounded-xl p-2.5 text-xs text-slate-300 font-mono focus:outline-none"
              >
                <option value="">LEAVE UNASSIGNED (BACKLOG STATE)</option>
                {assignablePersonnel.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.fullName.toUpperCase()} — {user.role.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Estimated Hours */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-extrabold block">
                Estimated Design / Coding Hours *
              </label>
              <input
                type="number"
                {...register("estimatedHours", { valueAsNumber: true })}
                className="w-full bg-[#03060c] border border-slate-905 text-xs text-white px-3 py-2.5 rounded-xl font-mono focus:outline-none"
              />
              {errors.estimatedHours && (
                <p className="text-[10px] font-mono text-rose-455 mt-1">{errors.estimatedHours.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 border-t border-slate-900/60 pt-5">
            {/* Priority Select */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-extrabold block">
                Priority Rank
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

            {/* Initial Status Select */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-extrabold block">
                Deploy Status State
              </label>
              <select
                {...register("status")}
                className="w-full bg-[#03060c] border border-slate-900 rounded-xl p-2.5 text-xs text-slate-300 font-mono focus:outline-none font-sans"
              >
                <option value="Todo">Todo (Backlog Queue)</option>
                <option value="In Progress">In Progress (Active Handshake)</option>
                <option value="Review">Review (Audit)</option>
                <option value="Done">Done (Finished Operations)</option>
              </select>
            </div>

            {/* Due Target Date */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-extrabold block animate-pulse">
                Action completion target *
              </label>
              <input
                type="date"
                {...register("dueDate")}
                className="w-full bg-[#03060c] border border-slate-900 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-650 focus:outline-none transition-all font-mono"
              />
            </div>
          </div>

          {/* Labels array */}
          <div className="space-y-2 border-t border-slate-900/60 pt-4">
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-extrabold block">
              Functional tags (Comma-separated)
            </label>
            <input
              type="text"
              {...register("labelsString")}
              placeholder="e.g. Backend, Security, Crypto-API"
              className="w-full bg-[#03060c] border border-slate-900 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#10b981] font-mono"
            />
          </div>
        </div>

        {/* Action button rows */}
        <div className="flex items-center justify-end gap-3 pt-4 font-mono text-xs">
          <button
            type="button"
            disabled={isCreating}
            onClick={() => navigate("/tasks")}
            className="px-5 py-2.5 rounded-xl border border-slate-901 hover:border-slate-801 bg-slate-950 text-slate-405 hover:text-white font-extrabold uppercase transition-all cursor-pointer"
          >
            DISCARD
          </button>

          <button
            type="submit"
            disabled={isCreating}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-505 disabled:opacity-30 disabled:pointer-events-none text-white font-extrabold uppercase flex items-center gap-2 tracking-wider transition-all cursor-pointer hover:shadow-lg shadow-indigo-950/40"
          >
            {isCreating ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Save size={14} />
            )}
            COMMIT SECURE TASK RECORD
          </button>
        </div>
      </form>
    </div>
  );
}
