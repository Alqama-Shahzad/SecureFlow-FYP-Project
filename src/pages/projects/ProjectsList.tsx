import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  List, 
  Download, 
  FilterX, 
  Building,
  RefreshCw,
  FolderLock
} from "lucide-react";
import { useProjects, useProjectSummary } from "../../hooks/use-projects-tasks";
import { ProjectProgressCard } from "../../components/projects/ProjectProgressCard";
import { ProjectCard } from "../../components/projects/ProjectCard";
import { ProjectTable } from "../../components/projects/ProjectTable";
import { Loader2 } from "lucide-react";

export default function ProjectsList() {
  const navigate = useNavigate();
  const { projects, isLoading, isError, deleteProject, refetch } = useProjects();
  const { data: summary, isLoading: isLoadingSummary } = useProjectSummary();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Selected for bulk operations
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Unique departments for filter
  const departments = useMemo(() => {
    const list = projects.map((p) => p.department);
    return Array.from(new Set(list));
  }, [projects]);
  const [deptFilter, setDeptFilter] = useState("All");

  const filteredProjects = useMemo(() => {
    let list = [...projects];

    // Apply Search
    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.key.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.projectManager.toLowerCase().includes(q) ||
          p.department.toLowerCase().includes(q)
      );
    }

    // Apply Status
    if (statusFilter !== "All") {
      list = list.filter((p) => p.status === statusFilter);
    }

    // Apply Priority
    if (priorityFilter !== "All") {
      list = list.filter((p) => p.priority === priorityFilter);
    }

    // Apply Risk Level
    if (riskFilter !== "All") {
      list = list.filter((p) => p.riskLevel === riskFilter);
    }

    // Apply Department
    if (deptFilter !== "All") {
      list = list.filter((p) => p.department === deptFilter);
    }

    return list;
  }, [projects, searchTerm, statusFilter, priorityFilter, riskFilter, deptFilter]);

  // Pagination computations
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProjects.slice(start, start + itemsPerPage);
  }, [filteredProjects, currentPage]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setPriorityFilter("All");
    setRiskFilter("All");
    setDeptFilter("All");
    setCurrentPage(1);
  };

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this project portfolio? This will remove all related compliance logs.")) {
      try {
        await deleteProject(id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Export JSON backups
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(filteredProjects, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `SecureFlow_Projects_${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white font-mono flex items-center gap-2 uppercase tracking-wider">
            <FolderLock className="text-indigo-400" />
            Project Portfolios
          </h1>
          <p className="text-xs text-slate-400 mt-1 uppercase font-mono tracking-widest">
            Institutional banking pipelines / security audits / deployment milestones
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => refetch()}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all transition-colors cursor-pointer"
            title="Reload repository"
          >
            <RefreshCw size={14} />
          </button>

          <button
            onClick={handleExport}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-[10px] font-bold uppercase tracking-wider font-mono flex items-center gap-1.5 cursor-pointer"
            title="Export portfolio as telemetry package"
          >
            <Download size={13} />
            EXPORT ALL
          </button>

          <button
            onClick={() => navigate("/projects/create")}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase font-mono tracking-widest flex items-center gap-1.5 shadow-lg shadow-indigo-950/40 hover:shadow-indigo-900/30 transition-all cursor-pointer"
          >
            <Plus size={14} />
            REGISTER PORTFOLIO
          </button>
        </div>
      </div>

      {/* Progress Cards Overview display */}
      {!isLoadingSummary && summary && (
        <ProjectProgressCard summary={summary} />
      )}

      {/* Controls & Advanced Filters panel */}
      <div className="bg-[#090e1a]/70 border border-slate-900 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
            <input
              type="text"
              placeholder="Search by code, key, manager, department..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#03060c] border border-slate-900 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 font-sans tracking-wide transition-all"
            />
          </div>

          {/* View Modes and Reset */}
          <div className="flex items-center gap-3">
            {/* View Grid/Table Toggle */}
            <div className="bg-[#03060c] border border-slate-900 rounded-xl p-1 flex items-center">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 px-2 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  viewMode === "grid" 
                    ? "bg-indigo-600 text-white" 
                    : "text-slate-450 hover:text-white"
                }`}
              >
                <LayoutGrid size={12} />
                GRID
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 px-2 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  viewMode === "table" 
                    ? "bg-indigo-600 text-white" 
                    : "text-slate-450 hover:text-white"
                }`}
              >
                <List size={12} />
                TABLE
              </button>
            </div>

            {/* Clear Filters Button */}
            {(searchTerm || statusFilter !== "All" || priorityFilter !== "All" || riskFilter !== "All" || deptFilter !== "All") && (
              <button
                onClick={handleResetFilters}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
              >
                <FilterX size={12} />
                RESET
              </button>
            )}
          </div>
        </div>

        {/* Action Filters Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#03060c]/40 p-3.5 rounded-xl border border-slate-900/40">
          {/* Status Select */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-mono text-slate-500 uppercase font-black tracking-wider">State Pipeline</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#03060c] border border-slate-900 rounded-lg p-1.5 text-[11px] text-slate-300 font-mono focus:outline-none focus:border-indigo-600"
            >
              <option value="All">ALL STATUSES</option>
              <option value="Planning">PLANNING</option>
              <option value="Active">ACTIVE</option>
              <option value="On Hold">ON HOLD</option>
              <option value="Completed">COMPLETED</option>
              <option value="Cancelled">CANCELLED</option>
            </select>
          </div>

          {/* Priority Select */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-mono text-slate-500 uppercase font-black tracking-wider">Priority Rank</label>
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#03060c] border border-slate-900 rounded-lg p-1.5 text-[11px] text-slate-300 font-mono focus:outline-none focus:border-indigo-600"
            >
              <option value="All">ALL PRIORITIES</option>
              <option value="Low">LOW PRIORITY</option>
              <option value="Medium">MEDIUM PRIORITY</option>
              <option value="High">HIGH PRIORITY</option>
              <option value="Critical">CRITICAL SECOP</option>
            </select>
          </div>

          {/* Risk Level Select */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-mono text-slate-500 uppercase font-black tracking-wider">Risk Classification</label>
            <select
              value={riskFilter}
              onChange={(e) => {
                setRiskFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#03060c] border border-slate-900 rounded-lg p-1.5 text-[11px] text-slate-300 font-mono focus:outline-none focus:border-indigo-600"
            >
              <option value="All">ALL RISKS</option>
              <option value="Low">LOW RISK</option>
              <option value="Medium">MEDIUM RISK</option>
              <option value="High">HIGH RISK</option>
              <option value="Critical">CRITICAL RISK</option>
            </select>
          </div>

          {/* Department Select */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-mono text-slate-500 uppercase font-black tracking-wider">Departmental Office</label>
            <select
              value={deptFilter}
              onChange={(e) => {
                setDeptFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#03060c] border border-slate-900 rounded-lg p-1.5 text-[11px] text-slate-300 font-mono focus:outline-none focus:border-[#3b82f6]"
            >
              <option value="All">ALL OFFICES</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Results Container */}
      {isLoading ? (
        <div className="py-24 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#5f5bf6] animate-spin" />
        </div>
      ) : isError ? (
        <div className="bg-rose-950/20 border border-rose-500/20 rounded-2xl p-6 text-center text-rose-300">
          <p className="font-mono text-sm">CRITICAL: ERROR COMMUNICATING WITH REPOSITORY SERVICES.</p>
          <button 
            onClick={() => refetch()}
            className="mt-4 p-2 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-mono text-[10px] font-bold"
          >
            FORCE RE-SYNC
          </button>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl p-12 text-center">
          <p className="font-mono text-xs text-slate-400">NO SECURE PORTFOLIOS MATCH THOSE SELECTION CRITERIA.</p>
          <button 
            onClick={handleResetFilters}
            className="mt-4 px-3 py-1.5 border border-slate-800 hover:border-slate-700 bg-slate-900 rounded-xl text-teal-400 font-mono text-[9px] font-bold"
          >
            FLUSH SEARCH FILTERS
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Visual grid cards/table */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedProjects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onDelete={handleDelete} 
                />
              ))}
            </div>
          ) : (
            <ProjectTable 
              projects={paginatedProjects} 
              onDelete={handleDelete} 
            />
          )}

          {/* Table Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-900 pt-5 font-mono text-[10px]">
              <span className="text-slate-500 uppercase font-black tracking-wider">
                Showing {Math.min(filteredProjects.length, (currentPage - 1) * itemsPerPage + 1)}-
                {Math.min(filteredProjects.length, currentPage * itemsPerPage)} of {filteredProjects.length} registers
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((c) => Math.max(c - 1, 1))}
                  className="p-1 px-3.5 rounded-xl border border-slate-900 bg-slate-950/40 text-slate-300 disabled:opacity-30 disabled:pointer-events-none hover:text-white transition-all cursor-pointer"
                >
                  PREV
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`h-7 w-7 rounded-xl font-bold transition-all cursor-pointer ${
                      currentPage === idx + 1 
                        ? "bg-indigo-600 text-white font-extrabold shadow-sm" 
                        : "border border-slate-900 text-slate-450 hover:bg-slate-900/35 hover:text-white"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((c) => Math.min(c + 1, totalPages))}
                  className="p-1 px-3.5 rounded-xl border border-slate-900 bg-slate-950/40 text-slate-300 disabled:opacity-30 disabled:pointer-events-none hover:text-white transition-all cursor-pointer"
                >
                  NEXT
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
