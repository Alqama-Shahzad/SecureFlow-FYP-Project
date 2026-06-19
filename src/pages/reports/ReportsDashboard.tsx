import React, { useState } from "react";
import { 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Download, 
  RefreshCw, 
  AlertTriangle,
  X,
  PlusCircle,
  HelpCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Database
} from "lucide-react";
import { useReports } from "../../hooks/useReports";
import { useAuthStore } from "../../store/useAuthStore";
import { TableSkeleton } from "../../components/security-shared/SecuritySkeletons";

export default function ReportsDashboard() {
  const { user } = useAuthStore();
  const currentOperator = user?.email || "compliance-officer@secureflow.app";

  // Filter States
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("");

  // Create Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newType, setNewType] = useState<"Security" | "Project" | "User" | "Task" | "System">("Security");
  const [newFormat, setNewFormat] = useState<"PDF" | "CSV" | "Excel">("PDF");
  const [isSuccessMessage, setIsSuccessMessage] = useState<string | null>(null);

  // TanStack Query for Reports list and Mutations
  const { 
    data: reports, 
    isLoading, 
    error, 
    refetch, 
    isRefetching, 
    generateReport, 
    isGenerating, 
    deleteReport 
  } = useReports({
    search,
    type: selectedType,
    format: selectedFormat
  });

  const handleResetFilters = () => {
    setSearch("");
    setSelectedType("");
    setSelectedFormat("");
  };

  const handleCreateReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    try {
      await generateReport({
        title: newTitle,
        description: newDesc,
        type: newType,
        format: newFormat,
        generatedBy: currentOperator
      });

      // Clear Form state
      setNewTitle("");
      setNewDesc("");
      setIsFormOpen(false);
      setIsSuccessMessage(`Regulatory file compiled: Now ready for auditing review.`);
      setTimeout(() => setIsSuccessMessage(null), 4000);
    } catch (err) {
      console.error("Failed to generate compliance report profile", err);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to permanently delete this report profile? This auditing step is irreversible.")) {
      try {
        await deleteReport(id);
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  // Mock download action
  const triggerMockDownload = (title: string, format: string) => {
    alert(`Initializing secure HTTPS transmission envelope...\nDownloading encrypted audit artifact: [${title}.${format.toLowerCase()}]`);
  };

  const getFormatBadgeColor = (format: string) => {
    if (format === "PDF") return "bg-red-950/40 border-red-900/30 text-red-400";
    if (format === "CSV") return "bg-emerald-950/40 border-emerald-900/30 text-emerald-400";
    return "bg-blue-950/40 border-blue-900/30 text-blue-400";
  };

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-in">
      
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-900">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2.5">
            <FileText className="h-7 w-7 text-indigo-400" />
            Regulatory Compliance Center
          </h1>
          <p className="text-slate-400 text-sm mt-1">Generate certified logs, federal auditing checklists, and milestone dependency indexes</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="px-4 py-2 bg-indigo-650 hover:bg-indigo-600 transition text-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-950/40"
          >
            <Plus className="h-4 w-4" /> Generate Report Profile
          </button>
        </div>
      </div>

      {/* 2. Feedback Messaging Banner */}
      {isSuccessMessage && (
        <div className="p-4 bg-emerald-950/25 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex gap-3 animate-fade-in items-center">
          <Clock className="h-4 w-4 shrink-0" />
          <span>{isSuccessMessage}</span>
        </div>
      )}

      {/* 3. Sliding Report compiler form drawers */}
      {isFormOpen && (
        <div className="border border-slate-900 bg-[#090d16]/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden animate-slide-up">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-900/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex justify-between items-center mb-5 border-b border-slate-900/60 pb-3">
            <h3 className="font-bold text-slate-200 text-sm font-sans flex items-center gap-1.5">
              <PlusCircle className="h-4.5 w-4.5 text-indigo-400" /> Configure Auditing Output File
            </h3>
            <button 
              onClick={() => setIsFormOpen(false)}
              className="p-1 border border-slate-900 bg-slate-950 rounded hover:border-slate-805 text-slate-400 hover:text-slate-200 transition"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          <form onSubmit={handleCreateReportSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-slate-400 uppercase block">Report Title</label>
                <input 
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., SWIFT gateway handshake stresses profile"
                  required
                  className="w-full bg-[#05080e] border border-slate-900 rounded-lg p-2.5 text-xs text-slate-200 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-slate-400 uppercase block">Administrative Group</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as any)}
                      className="w-full bg-[#05080e] border border-slate-900 rounded-lg p-2.5 text-xs text-slate-300 outline-none"
                    >
                      <option value="Security">Security Audit</option>
                      <option value="Project">Project Progress</option>
                      <option value="User">User Accounts Matrix</option>
                      <option value="System">System SRE Index</option>
                      <option value="Task">Task Dependency</option>
                    </select>
                  </div>
                  <div>
                    <select
                      value={newFormat}
                      onChange={(e) => setNewFormat(e.target.value as any)}
                      className="w-full bg-[#05080e] border border-slate-900 rounded-lg p-2.5 text-xs text-slate-300 outline-none"
                    >
                      <option value="PDF">PDF Envelope</option>
                      <option value="CSV">Flat CSV logs</option>
                      <option value="Excel">Excel Sheets</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-mono font-medium text-slate-400 uppercase block">Brief Purpose / Description</label>
                <textarea 
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Review parameter controls inside crypto rotational segments..."
                  rows={3}
                  required
                  className="w-full bg-[#05080e] border border-slate-900 rounded-lg p-2.5 text-xs text-slate-300 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-900/60 pt-4">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 border border-slate-900 bg-slate-950 hover:bg-slate-900 rounded-lg text-xs font-semibold text-slate-400 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isGenerating}
                className="px-5 py-2 bg-indigo-650 hover:bg-indigo-600 disabled:opacity-40 transition text-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                {isGenerating ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Database className="h-3.5 w-3.5" />}
                Export Document Checksum
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. Filter Panel */}
      <div className="bg-[#090d16]/40 border border-slate-905 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-mono text-xs font-semibold text-slate-400">
          <Filter className="h-3.5 w-3.5 text-indigo-400" />
          <span>Post-Filtering Queries</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reports title..."
              className="w-full md:w-48 bg-[#05080e] border border-slate-900 text-slate-250 placeholder-slate-550 rounded-lg pl-9 pr-4 py-2 text-xs outline-none focus:ring-1 focus:ring-slate-805"
            />
          </div>

          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-[#05080e] border border-slate-900 text-slate-300 rounded-lg p-2 text-xs outline-none"
            >
              <option value="">All Categories</option>
              <option value="Security">Security</option>
              <option value="Project">Project</option>
              <option value="User">User</option>
              <option value="System">System</option>
              <option value="Task">Task</option>
            </select>
          </div>

          <div>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full bg-[#05080e] border border-slate-900 text-slate-300 rounded-lg p-2 text-xs outline-none"
            >
              <option value="">All Formats</option>
              <option value="PDF">PDF Only</option>
              <option value="CSV">Flat CSV</option>
              <option value="Excel">Excel Spreadsheet</option>
            </select>
          </div>

          <div>
            <button
              onClick={handleResetFilters}
              className="w-full px-4 py-2 border border-slate-900 bg-slate-950 hover:bg-slate-900 text-slate-450 hover:text-slate-200 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1"
            >
              <X className="h-3 w-3" /> Clear
            </button>
          </div>
        </div>
      </div>

      {/* 5. Document List Table */}
      {isLoading ? (
        <TableSkeleton rows={5} cols={5} />
      ) : error || !reports ? (
        <div className="border border-red-500/20 bg-red-950/5 rounded-2xl p-8 text-center space-y-4">
          <AlertTriangle className="h-10 w-10 text-red-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">Compliance Query Halted</h3>
          <p className="text-xs text-slate-400">Database server was unable to retrieve file lists: {(error as Error)?.message}</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="border border-slate-900 bg-[#080b13]/20 rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4">
          <HelpCircle className="h-10 w-10 text-slate-500 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-200">No Auditing Records Selected</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Your parameter query did not return any compiled log files in this storage partition. Try updating search keys.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((rep) => (
            <div 
              key={rep.id} 
              className="border border-slate-900 bg-[#090d16]/25 rounded-2xl p-5 hover:border-slate-805 transition duration-150 flex flex-col justify-between space-y-4 relative group"
            >
              {/* Card headers */}
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500 font-bold">{rep.id}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    <span className="text-[10px] font-mono font-medium text-indigo-400 uppercase tracking-wider">{rep.type} audit</span>
                  </div>
                  
                  <span className={`px-2 py-0.5 text-[9px] font-mono rounded font-bold border ${getFormatBadgeColor(rep.format)}`}>
                    {rep.format}
                  </span>
                </div>

                <h3 className="font-bold text-slate-200 text-sm font-sans tracking-tight group-hover:text-slate-100 transition line-clamp-1">
                  {rep.title}
                </h3>
                
                <p className="text-xs text-slate-450 leading-relaxed line-clamp-2 h-8">
                  {rep.description}
                </p>
              </div>

              {/* Card structural details and downloads actions */}
              <div className="border-t border-slate-900/60 pt-3 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <div className="space-y-0.5">
                  <span className="block text-[10px] text-slate-550">COMPILED BY:</span>
                  <span className="block text-slate-400 truncate max-w-[120px]">{rep.generatedBy}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => triggerMockDownload(rep.title, rep.format)}
                    className="p-2 border border-slate-900 bg-slate-950 hover:bg-slate-900 rounded-lg text-slate-350 hover:text-slate-100 transition flex items-center gap-1 text-[11px] font-bold shrink-0"
                    title={`Securely export encrypted ${rep.format}`}
                  >
                    <Download className="h-3.5 w-3.5" /> <span className="text-[10px] text-slate-400 group-hover:text-slate-200">Envelop ({rep.fileSize})</span>
                  </button>

                  <button
                    onClick={(e) => handleDelete(rep.id, e)}
                    className="p-2 border border-slate-900 hover:border-slate-800 bg-slate-950 hover:bg-red-950/20 text-slate-500 hover:text-red-400 rounded-lg transition shrink-0"
                    title="Permanently Expire Index"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
