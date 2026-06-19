import React from "react";
import { Search, SlidersHorizontal, RotateCcw, Building, Shield, CircleDot } from "lucide-react";
import { UserRole, UserStatus } from "../../types/user-role";

interface UserFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  roleFilter: string;
  onRoleFilterChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  departmentFilter: string;
  onDepartmentFilterChange: (val: string) => void;
  departments: string[];
  onReset: () => void;
}

export default function UserFilters({
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
  departmentFilter,
  onDepartmentFilterChange,
  departments,
  onReset
}: UserFiltersProps) {
  return (
    <div className="bg-[#090e1a]/80 border border-slate-900 rounded-xl p-4 sm:p-5 shadow-lg backdrop-blur-md space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search credential indices, emails, departments..."
            className="w-full bg-[#03060c] border border-slate-800 text-slate-100 placeholder-slate-500 rounded-lg pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono"
          />
        </div>

        {/* Filters and Reset button */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Department Filter */}
          <div className="relative">
            <Building className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <select
              value={departmentFilter}
              onChange={(e) => onDepartmentFilterChange(e.target.value)}
              className="bg-[#03060c] border border-slate-800 text-slate-300 rounded-lg pl-8 pr-8 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer font-sans appearance-none min-w-[130px]"
            >
              <option value="">All Departments</option>
              {departments.map((dep) => (
                <option key={dep} value={dep}>
                  {dep}
                </option>
              ))}
            </select>
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] text-slate-500">▼</span>
          </div>

          {/* Role Filter */}
          <div className="relative">
            <Shield className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <select
              value={roleFilter}
              onChange={(e) => onRoleFilterChange(e.target.value)}
              className="bg-[#03060c] border border-slate-800 text-slate-300 rounded-lg pl-8 pr-8 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer font-sans appearance-none min-w-[120px]"
            >
              <option value="">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Project Manager">Project Manager</option>
              <option value="Developer">Developer</option>
            </select>
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] text-slate-500">▼</span>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <CircleDot className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="bg-[#03060c] border border-slate-800 text-slate-300 rounded-lg pl-8 pr-8 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer font-sans appearance-none min-w-[120px]"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] text-slate-500">▼</span>
          </div>

          {/* Reset Filters */}
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900 text-slate-400 hover:text-white rounded-lg text-xs transition-all font-mono"
            title="Reset active system console filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
