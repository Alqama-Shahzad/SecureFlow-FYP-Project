import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Building, 
  Shield, 
  Mail, 
  Phone, 
  User, 
  ArrowLeft, 
  Save, 
  Image,
  AlertCircle,
  RefreshCw,
  Clock,
  ShieldCheck,
  Lock,
  BadgeAlert
} from "lucide-react";
import { SecureFlowApiService } from "../../services/user-role.service";
import { UserDTO, UserRole, UserStatus } from "../../types/user-role";
import { cn } from "@/lib/utils";

export default function EditUser() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState<UserRole>("Developer");
  const [status, setStatus] = useState<UserStatus>("Active");
  const [avatar, setAvatar] = useState("");

  const PRESET_AVATARS = [
    "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
  ];

  useEffect(() => {
    const fetchUserAndFill = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const u = await SecureFlowApiService.getUserById(id);
        if (u) {
          setFullName(u.fullName);
          setEmail(u.email);
          setPhoneNumber(u.phoneNumber || "");
          setDepartment(u.department);
          setRole(u.role);
          setStatus(u.status);
          setAvatar(u.avatar || "");
        } else {
          setError(`Specified metadata node for UID "${id}" is non-existent within registry.`);
        }
      } catch (err: any) {
        setError(err?.message || "Failure compiling metadata pre-fill indices.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndFill();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || isSaving) return;

    if (!fullName.trim() || !email.trim() || !department.trim()) {
      setError("Please input all core coordinate elements.");
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await SecureFlowApiService.updateUser(id, {
        fullName,
        email,
        phoneNumber: phoneNumber || undefined,
        department,
        role,
        status,
        avatar: avatar || undefined
      });
      navigate(`/users/${id}`);
    } catch (err: any) {
      setError(err?.message || "Failed to update target credentials index.");
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-6 h-6 text-indigo-500 animate-spin" />
        <span className="text-xs text-slate-500 font-mono animate-pulse uppercase tracking-widest">Compiling coordinates...</span>
      </div>
    );
  }

  if (error && !fullName) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        <button
          onClick={() => navigate("/users")}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#03060c] border border-slate-900 rounded-lg text-slate-400 hover:text-white text-xs font-mono transition-colors"
        >
          <ArrowLeft size={13} />
          DIRECTORY HOME
        </button>
        <div className="bg-rose-500/10 border border-rose-500/25 p-6 rounded-2xl text-center space-y-3">
          <BadgeAlert className="w-12 h-12 text-rose-500 mx-auto" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Ledger Node Exception</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Back to details */}
      <div>
        <button
          onClick={() => navigate(`/users/${id}`)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#03060c] border border-slate-900 rounded-lg text-slate-400 hover:text-white text-xs font-mono transition-colors"
        >
          <ArrowLeft size={13} />
          CREDENTIAL FILE
        </button>
      </div>

      {/* Header Info */}
      <div>
        <h1 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-2">
          Mutate Core Coordinates
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Make secure adjustments to identity configurations. All operations are cataloged inside the audit history pipeline.
        </p>
      </div>

      {error && (
        <div className="bg-rose-500/15 border border-rose-500/20 rounded-xl p-4 text-xs font-mono text-rose-400 flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            <strong>ALARM DETAIL:</strong> {error}
          </span>
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="bg-[#090e1a]/80 backdrop-blur-md border border-slate-900 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
        
        {/* Core Profile Coordinates */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-extrabold uppercase font-mono tracking-widest text-indigo-400 border-b border-slate-900/60 pb-1.5">
            1. Core Identity Coordinates
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
                Full Registered Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#03060c] border border-slate-800 text-slate-100 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
                System Email Entry
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#03060c] border border-slate-800 text-slate-100 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
                Secure Phone line
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. +1 (555) 0182-392"
                  className="w-full bg-[#03060c] border border-slate-800 text-slate-100 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
                Assigned Business Unit
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-[#03060c] border border-slate-800 text-slate-100 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Security Parameters & RBAC Selection */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-extrabold uppercase font-mono tracking-widest text-[#2563eb] border-b border-slate-900/60 pb-1.5">
            2. High Clearance Alignments
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* RBAC Role */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
                Security Role Level
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full bg-[#03060c] border border-slate-800 text-slate-100 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans appearance-none"
                >
                  <option value="Developer">Developer (Standard review clearance)</option>
                  <option value="Project Manager">Project Manager (Schedules, actions, and coordination)</option>
                  <option value="Admin">Admin (Full root, cryptology and telemetry controls)</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] text-slate-500">▼</span>
              </div>
            </div>

            {/* Node Status */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
                Clearance Criteria State
              </label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as UserStatus)}
                  className="w-full bg-[#03060c] border border-slate-800 text-slate-100 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans appearance-none"
                >
                  <option value="Active">Active (Normal Clearance)</option>
                  <option value="Inactive">Inactive (Disabled Index)</option>
                  <option value="Suspended">Suspended (System Lockout Protocol)</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] text-slate-500">▼</span>
              </div>
            </div>

          </div>
        </div>

        {/* Profile Avatar Selection Preset */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-extrabold uppercase font-mono tracking-widest text-[#2563eb] border-b border-slate-900/60 pb-1.5">
            3. Ident Avatar Adjustment
          </h3>

          <div className="space-y-3">
            <span className="block text-[9px] font-bold text-slate-500 font-mono uppercase">Update security matrix profile preset:</span>
            
            <div className="flex items-center gap-4 flex-wrap">
              {PRESET_AVATARS.map((av, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setAvatar(av)}
                  className={cn(
                    "relative w-12 h-12 rounded-full border-2 overflow-hidden transition-all duration-200 hover:scale-105",
                    avatar === av ? "border-indigo-500 shadow-xl shadow-indigo-600/10 scale-105" : "border-slate-850 opacity-60 hover:opacity-100"
                  )}
                >
                  <img src={av} alt={`Preset ${index}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  {avatar === av && (
                    <div className="absolute inset-0 bg-indigo-900/20 flex items-center justify-center">
                      <div className="w-3.5 h-3.5 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[8px] font-bold">✓</div>
                    </div>
                  )}
                </button>
              ))}

              <div className="relative flex-1 min-w-[200px]">
                <Image className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="url"
                  placeholder="Or override using custom URL vector..."
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full bg-[#03060c] border border-slate-800 text-slate-100 placeholder-slate-600 rounded-lg pl-8 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Bottom Controls */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-900/60">
          <button
            type="button"
            onClick={() => navigate(`/users/${id}`)}
            className="px-4 py-2 rounded-xl border border-slate-850 bg-slate-900/40 hover:bg-slate-900 text-xs font-mono text-slate-400 hover:text-white transition-all"
          >
            DISCARD CHANGES
          </button>
          
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-black shadow-lg shadow-indigo-600/15 disabled:opacity-50 transition-all font-black"
          >
            <Save size={13} />
            {isSaving ? "MUTATING METADATA..." : "COMMIT REALLOCATIONS"}
          </button>
        </div>

      </form>
    </div>
  );
}
