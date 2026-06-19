import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { useTask, useProjects } from "../../hooks/use-projects-tasks";
import { SecureFlowApiService } from "../../services/user-role.service";
import { UserDTO } from "../../types/user-role";

const editTaskSchema = zod.object({
  title: zod.string().min(5, "Task brief title is required.").max(100),
  description: zod.string().min(10, "Please outline exact guidelines for development."),
  projectId: zod.string().min(1, "Portfolio project node must remain allocated."),
  assigneeId: zod.string().optional(),
  priority: zod.enum(["Low", "Medium", "High", "Critical"]),
  status: zod.enum(["Todo", "In Progress", "Review", "Done"]),
  dueDate: zod.string().min(1, "Timeline due date is required."),
  estimatedHours: zod.number().min(1, "Estimated hour count must reach at least 1 hr.").max(500),
  labelsString: zod.string().optional()
});

type EditTaskValues = zod.infer<typeof editTaskSchema>;

export default function EditTask() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { task, isLoading: isLoadingTask, updateTask } = useTask(id || "");
  const { projects } = useProjects();

  const [systemUsers, setSystemUsers] = useState<UserDTO[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

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
    reset,
    watch,
    formState: { errors }
  } = useForm<EditTaskValues>({
    resolver: zodResolver(editTaskSchema)
  });

  // Pre-seed form fields from previous task records
  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        projectId: task.projectId,
        assigneeId: task.assigneeId || "",
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate,
        estimatedHours: task.estimatedHours,
        labelsString: task.labels.join(", ")
      });
    }
  }, [task, reset]);

  const watchProjectId = watch("projectId");

  // Keep assignable workers matched to project specs
  const assignablePersonnel = useMemo(() => {
    if (!watchProjectId) return systemUsers;
    const selectedProj = projects.find(p => p.id === watchProjectId);
    if (!selectedProj) return systemUsers;

    const assignedIds = selectedProj.teamMembers.map(m => m.id);
    return systemUsers.filter(u => assignedIds.includes(u.id));
  }, [watchProjectId, projects, systemUsers]);

  if (isLoadingTask) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
        <span className="text-xs font-mono text-slate-550 uppercase tracking-widest animate-pulse">Loading tactical task variables...</span>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="py-12 bg-[#090e1a] border border-slate-900 rounded-2xl text-center max-w-sm mx-auto">
        <p className="text-xs font-mono text-rose-455 uppercase font-black">Action task node not found inside active registries</p>
        <button 
          onClick={() => navigate("/tasks")}
          className="mt-4 px-3 py-1 bg-slate-900 rounded text-slate-350 text-[10px] uppercase font-mono font-bold"
        >
          Return to pipelines
        </button>
      </div>
    );
  }

  const onFormSubmit = async (values: EditTaskValues) => {
    try {
      const parentProj = projects.find(p => p.id === values.projectId);
      if (!parentProj) throw new Error("Target project portfolio is non-existent within register.");

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
        ? values.labelsString.split(",").map(lbl => lbl.trim()).filter(l => l.length > 0)
        : [];

      await updateTask({
        title: values.title,
        description: values.description,
        assigneeId: values.assigneeId || undefined,
        assigneeName: values.assigneeId ? assigneeName : undefined,
        assigneeAvatar: values.assigneeId ? assigneeAvatar : undefined,
        priority: values.priority,
        status: values.status,
        labels,
        dueDate: values.dueDate,
        estimatedHours: values.estimatedHours
      });

      navigate(`/tasks/${task.id}`);
    } catch (err: any) {
      alert("Verification override failed: " + err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header and Go Back buttons */}
      <div className="flex items-center gap-3 border-b border-slate-900 pb-5">
        <button
          onClick={() => navigate(`/tasks/${task.id}`)}
          className="p-2 rounded-xl bg-slate-950 border border-slate-900 hover:border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white font-mono uppercase tracking-wider">
            REWRITE TASK COORDINATES [{task.id}]
          </h1>
          <p className="text-xs text-slate-405 mt-0.5 uppercase font-mono tracking-widest leading-none">
            Project: {task.projectName} ({task.projectKey})
          </p>
        </div>
      </div>

      {/* Main Form container */}
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Core fields card */}
        <div className="bg-[#090e1a]/85 border border-slate-900 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md space-y-6">
          <h2 className="text-xs font-mono text-[#3b82f6] uppercase tracking-widest font-black mb-3">
            [SECTION I] TASK SPECIFICATIONS
          </h2>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-slate-404 uppercase tracking-wider font-extrabold block">
              Task Brief Title *
            </label>
            <input
              type="text"
              {...register("title")}
              className="w-full bg-[#03060c] border border-slate-900 rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none focus:border-[#3b82f6] transition-all"
            />
            {errors.title && (
              <p className="text-[10px] font-mono text-rose-455 mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Detailed description */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-slate-404 uppercase tracking-wider font-extrabold block">
              Functional Specifications & Action Conditions *
            </label>
            <textarea
              {...register("description")}
              rows={5}
              className="w-full bg-[#03060c] border border-slate-900 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#3b82f6] transition-all font-sans leading-relaxed text-slate-300"
            />
            {errors.description && (
              <p className="text-[10px] font-mono text-rose-455 mt-1">{errors.description.message}</p>
            )}
          </div>
        </div>

        {/* Operational Allocations cards */}
        <div className="bg-[#090e1a]/85 border border-slate-900 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-[#090e1a] space-y-6">
          <h2 className="text-xs font-mono text-[#10b981] uppercase tracking-widest font-black mb-3">
            [SECTION II] DEVELOPMENTAL COORDINATES
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Operator select */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-404 uppercase tracking-wider font-extrabold block flex items-center justify-between">
                <span>ASSIGNED ENGINEER</span>
                <span className="text-[8px] text-[#2563eb] font-bold">PROJECT CAP INTACT</span>
              </label>

              <select
                {...register("assigneeId")}
                className="w-full bg-[#03060c] border border-slate-900 rounded-xl p-2.5 text-xs text-slate-300 font-mono focus:outline-none"
              >
                <option value="">LEAVE UNASSIGNED (BACKLOG QUEUE STATE)</option>
                {assignablePersonnel.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.fullName.toUpperCase()} — {user.role.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Estimated Hours */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-404 uppercase tracking-wider font-extrabold block">
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
              <label className="text-[10px] font-mono text-slate-455 uppercase font-bold text-slate-400 block pb-1">
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

            {/* Status Selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-455 uppercase font-bold text-slate-400 block pb-1">
                Deploy Status State
              </label>
              <select
                {...register("status")}
                className="w-full bg-[#03060c] border border-slate-900 rounded-xl p-2.5 text-xs text-slate-300 font-mono focus:outline-none"
              >
                <option value="Todo">Todo (Backlog Queue)</option>
                <option value="In Progress">In Progress (Active Handshake)</option>
                <option value="Review">Review (Audit)</option>
                <option value="Done">Done (Finished Operations)</option>
              </select>
            </div>

            {/* Due Target Date */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-455 uppercase font-bold text-slate-400 block pb-1">
                Action completion target *
              </label>
              <input
                type="date"
                {...register("dueDate")}
                className="w-full bg-[#03060c] border border-slate-905 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-650 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Labels array */}
          <div className="space-y-2 border-t border-slate-900/60 pt-4">
            <label className="text-[10px] font-mono text-slate-404 uppercase tracking-wider font-extrabold block">
              Functional tags (Comma-separated)
            </label>
            <input
              type="text"
              {...register("labelsString")}
              placeholder="e.g. Backend, Security, Crypto-API"
              className="w-full bg-[#03060c] border border-[#03060c] hover:border-slate-800 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-600 focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* Action button rows */}
        <div className="flex items-center justify-end gap-3 pt-4 font-mono text-xs">
          <button
            type="button"
            onClick={() => navigate(`/tasks/${task.id}`)}
            className="px-5 py-2.5 rounded-xl border border-slate-901 hover:border-slate-801 bg-slate-950 text-slate-405 hover:text-white font-extrabold uppercase transition-all cursor-pointer"
          >
            DISCARD OVERRIDES
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-505 text-white font-extrabold uppercase flex items-center gap-2 tracking-wider transition-all cursor-pointer hover:shadow-lg shadow-indigo-950"
          >
            <Save size={14} />
            COMMIT RESERVATION UPDATES
          </button>
        </div>
      </form>
    </div>
  );
}
