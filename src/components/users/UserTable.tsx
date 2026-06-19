import React, { useState } from "react";
import { 
  MoreVertical, 
  Eye, 
  Edit2, 
  UserX, 
  UserCheck, 
  Trash2, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  MoreHorizontal,
  Mail,
  Building,
  Calendar,
  FileDown
} from "lucide-react";
import { UserDTO, UserRole, UserStatus } from "../../types/user-role";
import { cn } from "@/lib/utils";

interface UserTableProps {
  users: UserDTO[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: UserStatus) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

export default function UserTable({
  users,
  onView,
  onEdit,
  onToggleStatus,
  onDelete,
  isLoading
}: UserTableProps) {
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Bulk Actions Selection State
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [activeActionsMenu, setActiveActionsMenu] = useState<string | null>(null);

  // Toggle single user checkbox
  const handleSelectUser = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  // Toggle select all
  const handleSelectAll = (currentPageUsers: UserDTO[]) => {
    const currentPageIds = currentPageUsers.map((u) => u.id);
    const allSelected = currentPageIds.every((id) => selectedUserIds.includes(id));

    if (allSelected) {
      setSelectedUserIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    } else {
      setSelectedUserIds((prev) => [
        ...prev,
        ...currentPageIds.filter((id) => !prev.includes(id))
      ]);
    }
  };

  // Format timestamp helper
  const formatDateTime = (isoString?: string) => {
    if (!isoString) return "NEVER DISPATCHED";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }) + " UTC";
  };

  // Get Role Color Classes
  const getRoleBadgeClasses = (role: UserRole) => {
    switch (role) {
      case "Admin":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "Project Manager":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Developer":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      default:
        return "bg-slate-800 text-slate-400 border-slate-700/60";
    }
  };

  // Get Status Bullet/Color Classes
  const getStatusBadgeClasses = (status: UserStatus) => {
    switch (status) {
      case "Active":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Inactive":
        return "bg-slate-500/10 text-slate-400 border-slate-800";
      case "Suspended":
        return "bg-rose-500/10 text-rose-500 border-rose-500/25";
      default:
        return "bg-slate-800 text-slate-400 border-slate-700/60";
    }
  };

  // Calculation for Paginated records
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = users.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(users.length / itemsPerPage) || 1;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-[#090e1a]/40 border border-slate-800 rounded-xl animate-pulse flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-800 rounded-full" />
              <div className="space-y-2">
                <div className="w-32 h-4 bg-slate-800 rounded" />
                <div className="w-24 h-3 bg-slate-800 rounded" />
              </div>
            </div>
            <div className="w-20 h-6 bg-slate-800 rounded-md" />
            <div className="w-24 h-6 bg-slate-800 rounded-md" />
            <div className="w-12 h-4 bg-slate-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl p-12 text-center shadow-xl backdrop-blur-md">
        <UserX className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">No Credentials Found</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mt-2 font-sans">
          No records match the current security filter parameters. Revise your search query or department selections.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      {/* Table & Responsive cards wrapper */}
      <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl overflow-hidden shadow-xl backdrop-blur-md">
        
        {/* Bulk Action Panel if users are selected */}
        {selectedUserIds.length > 0 && (
          <div className="bg-indigo-950/40 border-b border-indigo-500/10 px-5 py-3.5 flex items-center justify-between text-xs font-mono select-none animate-fade-in">
            <div className="flex items-center gap-2 text-indigo-400">
              <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
              <span>{selectedUserIds.length} CREDENTIAL CHANNELS SELECTED</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  alert(`Cryptographic Export triggered for ${selectedUserIds.length} entities.`);
                  setSelectedUserIds([]);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-500/20 bg-indigo-500/10 hover:bg-indigo-600/20 text-indigo-300 transition-all font-bold"
              >
                <FileDown size={13} />
                EXPORT BATCH
              </button>
              <button
                onClick={() => setSelectedUserIds([])}
                className="text-slate-400 hover:text-white transition-all text-[11px]"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}

        {/* Desktop Data-Rich Table (Shown on md and up) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-900 bg-slate-950/20 font-mono text-[10px] text-slate-400 tracking-wider font-bold">
                <th className="py-4 pl-6 pr-3 w-10">
                  <input
                    type="checkbox"
                    checked={
                      paginatedUsers.length > 0 &&
                      paginatedUsers.every((u) => selectedUserIds.includes(u.id))
                    }
                    onChange={() => handleSelectAll(paginatedUsers)}
                    className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                </th>
                <th className="py-4 px-4 uppercase">Identity Card</th>
                <th className="py-4 px-4 uppercase">Email</th>
                <th className="py-4 px-4 uppercase">Role</th>
                <th className="py-4 px-4 uppercase">Department</th>
                <th className="py-4 px-4 uppercase">Auth Clearance</th>
                <th className="py-4 px-4 uppercase">Last Sync</th>
                <th className="py-4 pr-6 pl-4 text-right uppercase">Controller</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/60 font-sans text-xs">
              {paginatedUsers.map((usr) => (
                <tr 
                  key={usr.id} 
                  className={cn(
                    "hover:bg-[#070b12]/50 transition-colors group",
                    selectedUserIds.includes(usr.id) && "bg-indigo-950/10"
                  )}
                >
                  {/* Checkbox */}
                  <td className="py-4 pl-6 pr-3">
                    <input
                      type="checkbox"
                      checked={selectedUserIds.includes(usr.id)}
                      onChange={() => handleSelectUser(usr.id)}
                      className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                  </td>

                  {/* Name and Avatar */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <img
                          src={usr.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
                          alt={usr.fullName}
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-full object-cover border border-slate-800"
                        />
                        <span className={cn(
                          "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#090e1a]",
                          usr.status === "Active" ? "bg-emerald-500" : usr.status === "Inactive" ? "bg-slate-400" : "bg-rose-500"
                        )} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-100 group-hover:text-white transition-colors">{usr.fullName}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">UID: {usr.id}</div>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="py-4 px-4 text-slate-300 font-mono text-[11px] font-medium">{usr.email.toLowerCase()}</td>

                  {/* Role */}
                  <td className="py-4 px-4">
                    <span className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-semibold font-mono border tracking-wider",
                      getRoleBadgeClasses(usr.role)
                    )}>
                      {usr.role}
                    </span>
                  </td>

                  {/* Department */}
                  <td className="py-4 px-4 text-slate-300 font-sans tracking-wide font-medium">{usr.department}</td>

                  {/* Status Badge */}
                  <td className="py-4 px-4">
                    <span className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-bold font-mono border tracking-wider",
                      getStatusBadgeClasses(usr.status)
                    )}>
                      {usr.status}
                    </span>
                  </td>

                  {/* Last Login */}
                  <td className="py-4 px-4 text-slate-400 font-mono text-[10px]">
                    {usr.lastLogin ? formatDateTime(usr.lastLogin) : "NO ACCESS DATA"}
                  </td>

                  {/* Actions Column */}
                  <td className="py-4 pr-6 pl-4 text-right">
                    <div className="relative flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onView(usr.id)}
                        className="p-1 px-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all text-[11px] flex items-center gap-1 font-mono font-bold"
                        title="View detailed credentials"
                      >
                        <Eye size={12} />
                        DECRYPT
                      </button>

                      <div className="relative">
                        <button
                          onClick={() => setActiveActionsMenu(activeActionsMenu === usr.id ? null : usr.id)}
                          className={cn(
                            "p-1.5 rounded-lg border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all",
                            activeActionsMenu === usr.id && "bg-slate-900 border-slate-700 text-white"
                          )}
                        >
                          <MoreVertical size={13} />
                        </button>

                        {activeActionsMenu === usr.id && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setActiveActionsMenu(null)} />
                            <div className="absolute right-0 mt-1.5 w-48 bg-[#0c1223] border border-slate-800 rounded-xl shadow-2xl p-1 z-50 animate-fade-in text-left">
                              <button
                                onClick={() => {
                                  onEdit(usr.id);
                                  setActiveActionsMenu(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-900/60 rounded-lg transition-all font-sans font-medium"
                              >
                                <Edit2 size={13} className="text-slate-400" />
                                Edit Account Page
                              </button>
                              
                              <button
                                onClick={() => {
                                  onToggleStatus(usr.id, usr.status);
                                  setActiveActionsMenu(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-900/60 rounded-lg transition-all font-sans font-medium"
                              >
                                {usr.status === "Suspended" ? (
                                  <>
                                    <UserCheck size={13} className="text-emerald-400" />
                                    Restore Active Clearance
                                  </>
                                ) : (
                                  <>
                                    <UserX size={13} className="text-rose-400" />
                                    Suspend Access Node
                                  </>
                                )}
                              </button>

                              <div className="h-[1px] bg-slate-900 my-1" />

                              <button
                                onClick={() => {
                                  if (confirm(`ADMIN FORCE REVOCATION: Are you absolutely sure you want to permanently shred metadata for ${usr.fullName}?`)) {
                                    onDelete(usr.id);
                                  }
                                  setActiveActionsMenu(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:text-white hover:bg-rose-950/25 rounded-lg transition-all font-sans font-medium"
                              >
                                <Trash2 size={13} className="text-rose-500" />
                                Delete Account
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Responsive Grid / Cards view (Shown under md screen size) */}
        <div className="md:hidden divide-y divide-slate-900 overflow-y-auto">
          {paginatedUsers.map((usr) => (
            <div 
              key={usr.id} 
              className={cn(
                "p-4 flex flex-col space-y-3.5",
                selectedUserIds.includes(usr.id) && "bg-indigo-950/5"
              )}
            >
              {/* Header profile row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={usr.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
                    alt={usr.fullName}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-slate-800"
                  />
                  <div>
                    <div className="font-bold text-slate-100 text-xs">{usr.fullName}</div>
                    <div className="text-[9px] text-slate-500 font-mono mt-0.5">UID: {usr.id}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={selectedUserIds.includes(usr.id)}
                    onChange={() => handleSelectUser(usr.id)}
                    className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded text-[8px] uppercase font-mono border tracking-wider",
                    getStatusBadgeClasses(usr.status)
                  )}>
                    {usr.status}
                  </span>
                </div>
              </div>

              {/* Data tags panel */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-sans bg-slate-950/40 border border-slate-900 rounded-lg p-2.5">
                <div>
                  <span className="text-[8px] font-semibold text-slate-500 font-mono block uppercase">Email Range</span>
                  <span className="text-slate-300 font-mono truncate block text-[10px] mt-0.5">{usr.email}</span>
                </div>
                <div>
                  <span className="text-[8px] font-semibold text-slate-500 font-mono block uppercase">Authority Scope</span>
                  <span className={cn(
                    "inline-block px-1.5 py-0.5 rounded text-[8px] uppercase font-semibold font-mono border tracking-wider mt-0.5",
                    getRoleBadgeClasses(usr.role)
                  )}>
                    {usr.role}
                  </span>
                </div>
                <div className="col-span-2 border-t border-slate-900/60 pt-1.5">
                  <span className="text-[8px] font-semibold text-slate-500 font-mono block uppercase">Operating Node</span>
                  <span className="text-slate-350 text-[10px] font-medium block mt-0.5">{usr.department}</span>
                </div>
              </div>

              {/* Action row */}
              <div className="flex items-center justify-between border-t border-slate-900/50 pt-2.5">
                <div className="text-[9px] text-slate-500 font-mono">
                  Sync: {usr.lastLogin ? formatDateTime(usr.lastLogin).slice(0, 11) : "NO DATA"}
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onView(usr.id)}
                    className="p-1 px-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all text-[10px] flex items-center gap-1 font-mono font-bold"
                  >
                    <Eye size={11} />
                    DECRYPT
                  </button>
                  <button
                    onClick={() => onEdit(usr.id)}
                    className="p-1 px-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all text-[10px] flex items-center gap-1 font-mono font-bold"
                  >
                    <Edit2 size={11} />
                    MUTATE
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`ADMIN FORCE REVOCATION: Are you absolutely sure you want to permanently shred metadata for ${usr.fullName}?`)) {
                        onDelete(usr.id);
                      }
                    }}
                    className="p-1 rounded-lg border border-rose-950/50 bg-rose-950/20 text-rose-400 hover:text-rose-200 transition-all"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2 text-xs text-slate-400 font-mono bg-[#090e1a]/20 border border-slate-900/40 rounded-xl p-3 shadow-sm select-none">
        <span className="font-mono text-[10px]">
          INDEX: <span className="text-white font-bold">{startIndex + 1} - {Math.min(startIndex + itemsPerPage, users.length)}</span> / <span className="text-slate-500">{users.length} MODULES</span>
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((c) => Math.max(c - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-850 bg-slate-950/40 hover:bg-slate-900/60 text-slate-400 hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft size={14} />
          </button>
          
          <span className="text-[10px] tracking-wider uppercase font-bold text-slate-400 bg-slate-950 border border-slate-850 px-2.5 py-1 rounded-md">
            GATES {currentPage} / <span className="text-slate-500">{totalPages}</span>
          </span>

          <button
            onClick={() => setCurrentPage((c) => Math.min(c + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-850 bg-slate-950/40 hover:bg-slate-900/60 text-slate-400 hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
