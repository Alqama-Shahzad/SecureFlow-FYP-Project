import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Building, 
  Shield, 
  Mail, 
  Phone, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ShieldCheck, 
  ArrowLeft, 
  Save, 
  Image,
  AlertCircle
} from "lucide-react";
import { SecureFlowApiService } from "../../services/user-role.service";
import { UserRole, UserStatus } from "../../types/user-role";
import { cn } from "@/lib/utils";

export default function CreateUser() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState<UserRole>("Developer");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<UserStatus>("Active");
  const [avatar, setAvatar] = useState("");

  // Visual password reveal
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Computed local password score
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: "PENDING CREDENTIAL", color: "bg-slate-800" };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, label: "COMPROMISED WEAK", color: "bg-rose-500" };
      case 2:
        return { score: 50, label: "MODERATE LEVEL", color: "bg-amber-500" };
      case 3:
        return { score: 75, label: "SECURE PASSWORD", color: "bg-emerald-500" };
      case 4:
        return { score: 100, label: "MILITARY-GRADE MATRIX", color: "bg-indigo-500" };
      default:
        return { score: 0, label: "COMPROMISED WEAK", color: "bg-rose-500" };
    }
  };

  const strength = getPasswordStrength(password);

  // Quick preset avatars
  const PRESET_AVATARS = [
    "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Core validation checks
    if (!fullName.trim() || !email.trim() || !department.trim()) {
      setError("Please fill out all identity information coordinates.");
      return;
    }

    if (password.length < 8) {
      setError("Cryptographic passkeys must contain at least 8 elements.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Credential verification mismatch. Converted passkeys must be identical.");
      return;
    }

    setIsLoading(true);
    try {
      await SecureFlowApiService.createUser({
        fullName,
        email,
        phoneNumber: phoneNumber || undefined,
        department,
        role,
        status,
        avatar: avatar || PRESET_AVATARS[0]
      });

      // Clear layout or navigate back to index on success
      navigate("/users");
    } catch (err: any) {
      setError(err?.message || "Failed to catalog credentials record.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate("/users")}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#03060c] border border-slate-900 rounded-lg text-slate-400 hover:text-white text-xs font-mono transition-colors"
        >
          <ArrowLeft size={13} />
          DIRECTORY BACKLOG
        </button>
      </div>

      {/* Header Info */}
      <div>
        <h1 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-2">
          Provision Access Credentials
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Catalog a secure IAM operator certificate node. System will trigger local validation workflows instantly.
        </p>
      </div>

      {error && (
        <div className="bg-rose-500/15 border border-rose-500/20 rounded-xl p-4 text-xs font-mono text-rose-400 flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            <strong>IDENT COORD ERROR:</strong> {error}
          </span>
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="bg-[#090e1a]/80 backdrop-blur-md border border-slate-900 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
        
        {/* Core Profile Coordinates */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-extrabold uppercase font-mono tracking-widest text-indigo-400 border-b border-slate-900/60 pb-1.5">
            1. Core Profile Coordinates
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
                Full Legal Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Richard Hendricks"
                  className="w-full bg-[#03060c] border border-slate-800 text-slate-100 placeholder-slate-600 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
                Email Vector <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. hendricks@secureflow.app"
                  className="w-full bg-[#03060c] border border-slate-800 text-slate-100 placeholder-slate-600 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
                Phone Coordinate (Secure Comms)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. +1 (555) 0192-384"
                  className="w-full bg-[#03060c] border border-slate-800 text-slate-100 placeholder-slate-600 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
                Assigned Business Unit <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Core Cryptography Ops"
                  className="w-full bg-[#03060c] border border-slate-800 text-slate-100 placeholder-slate-600 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Security Parameters & RBAC Selection */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-extrabold uppercase font-mono tracking-widest text-indigo-400 border-b border-slate-900/60 pb-1.5">
            2. Privilege Allocations & Status
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* RBAC Role */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
                Security Role Clearance
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
                Initial Account Vector Clearance
              </label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as UserStatus)}
                  className="w-full bg-[#03060c] border border-slate-800 text-slate-100 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans appearance-none"
                >
                  <option value="Active">Active (Default Clearance)</option>
                  <option value="Inactive">Inactive (Disabled / Idle State)</option>
                  <option value="Suspended">Suspended (Direct Lockdown Protocol)</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] text-slate-500">▼</span>
              </div>
            </div>

          </div>
        </div>

        {/* Cryptographic Secrets & Passkey */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-extrabold uppercase font-mono tracking-widest text-indigo-400 border-b border-slate-900/60 pb-1.5">
            3. Local Authentication Passkey
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Password */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
                Authentication Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full bg-[#03060c] border border-slate-800 text-slate-100 placeholder-slate-600 rounded-lg pl-9 pr-10 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2.5 space-y-1.5 animate-fade-in">
                  <div className="flex items-center justify-between text-[9px] font-bold font-mono">
                    <span className="text-slate-500">COMPLIANCE CRITERIA:</span>
                    <span className={cn(
                      strength.score >= 75 ? "text-emerald-400" : "text-amber-500"
                    )}>{strength.label}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-950 border border-slate-900 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full transition-all duration-500", strength.color)}
                      style={{ width: `${strength.score}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
                Verify Password Key <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Match password exactly"
                  className="w-full bg-[#03060c] border border-slate-800 text-slate-100 placeholder-slate-600 rounded-lg pl-9 pr-10 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Profile Avatar Selection Preset */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-extrabold uppercase font-mono tracking-widest text-indigo-400 border-b border-slate-900/60 pb-1.5">
            4. Ident Avatar Presets
          </h3>

          <div className="space-y-3">
            <span className="block text-[9px] font-bold text-slate-500 font-mono uppercase">Choose from pre-approved secure identity assets:</span>
            
            <div className="flex items-center gap-4 flex-wrap">
              {PRESET_AVATARS.map((av, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setAvatar(av)}
                  className={cn(
                    "relative w-12 h-12 rounded-full border-2 overflow-hidden transition-all duration-200 hover:scale-105",
                    avatar === av || (!avatar && index === 0) ? "border-indigo-500 shadow-xl shadow-indigo-600/10 scale-105" : "border-slate-850 opacity-60 hover:opacity-100"
                  )}
                >
                  <img src={av} alt={`Preset ${index}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  {(avatar === av || (!avatar && index === 0)) && (
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
                  placeholder="Or provide custom Image URL vector..."
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full bg-[#03060c] border border-slate-800 text-slate-100 placeholder-slate-600 rounded-lg pl-8 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Cancel and Save buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-900/60">
          <button
            type="button"
            onClick={() => navigate("/users")}
            className="px-4 py-2 rounded-xl border border-slate-850 bg-slate-900/40 hover:bg-slate-900 text-xs font-mono text-slate-400 hover:text-white transition-all"
          >
            DISCARD
          </button>
          
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-black shadow-lg shadow-indigo-600/15 disabled:opacity-50 transition-all"
          >
            <Save size={13} />
            {isLoading ? "SAVING NODE..." : "CATALOG CREDENTIALS"}
          </button>
        </div>

      </form>
    </div>
  );
}
