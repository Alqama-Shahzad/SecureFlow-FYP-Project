import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Lock, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Key, 
  CheckCircle, 
  RefreshCw,
  Clock,
  ShieldAlert,
  Info
} from "lucide-react";
import { useChangePassword } from "../../hooks/useProfileSettings";
import { ProfileService } from "../../services/profile.service";

const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, "Current credential verify token is required."),
  newPassword: z.string().min(8, "Credentials must configure at least 8 characters."),
  confirmPassword: z.string().min(1, "Please re-confirm your rotated credential.")
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Confirm password does not match the target credentials.",
  path: ["confirmPassword"]
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export default function ChangePassword() {
  const navigate = useNavigate();
  const passwordMutation = useChangePassword();

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Toggle VisibilityStates
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Real-time password verification strings
  const [newPasswordVal, setNewPasswordVal] = useState("");

  const { register, handleSubmit, formState: { errors, isValid } } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    mode: "onChange"
  });

  // Criteria validation checks
  const criteria = {
    hasMinLength: newPasswordVal.length >= 8,
    hasUppercase: /[A-Z]/.test(newPasswordVal),
    hasLowercase: /[a-z]/.test(newPasswordVal),
    hasNumber: /[0-9]/.test(newPasswordVal),
    hasSpecial: /[^A-Za-z0-9]/.test(newPasswordVal),
  };

  const getStrengthPercent = () => {
    let met = 0;
    if (criteria.hasMinLength) met++;
    if (criteria.hasUppercase) met++;
    if (criteria.hasLowercase) met++;
    if (criteria.hasNumber) met++;
    if (criteria.hasSpecial) met++;
    return (met / 5) * 100;
  };

  const getStrengthLabel = () => {
    const score = getStrengthPercent();
    if (score === 0) return { label: "No Input", color: "bg-slate-900 text-slate-500" };
    if (score <= 40) return { label: "Weaker (Reject)", color: "bg-rose-950 text-rose-400" };
    if (score <= 80) return { label: "Medium (Moderate)", color: "bg-amber-950 text-amber-400 animate-pulse-subtle" };
    return { label: "Military-Grade (Safe)", color: "bg-emerald-950 text-emerald-400" };
  };

  const [lastRotatedDate, setLastRotatedDate] = useState<string>("Loading...");

  useEffect(() => {
    ProfileService.getLastPasswordRotation()
      .then((date) => {
        setLastRotatedDate(new Date(date).toLocaleString());
      })
      .catch(() => {
        setLastRotatedDate("Not rotated recently");
      });
  }, []);

  const onSubmit = async (values: PasswordFormValues) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    
    // Check strength parameters manual validation block
    const allPassed = Object.values(criteria).every(Boolean);
    if (!allPassed) {
      setErrorMsg("Crypto strength limits failed. All corporate regulatory criteria must be resolved.");
      return;
    }

    try {
      await passwordMutation.mutateAsync(values);
      setSuccessMsg("Master credential password rotated successfully. Token cache invalidated.");
      setTimeout(() => {
        setSuccessMsg(null);
        navigate("/profile");
      }, 2500);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to commit credential rotation.");
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fade-in text-slate-300 font-sans max-w-4xl">
      
      {/* Return Row Header */}
      <div className="flex items-center gap-3">
        <Link 
          to="/profile" 
          className="p-1.5 border border-slate-900 bg-slate-950 hover:border-slate-805 rounded transition text-slate-400 hover:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <span className="text-[10px] font-mono text-rose-400 uppercase tracking-widest font-bold">Security & IAM Controls</span>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-100 leading-tight">Credential Signature Rotation</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form panel column */}
        <div className="lg:col-span-2 space-y-6">
          
          {successMsg && (
            <div className="p-4 bg-emerald-990/20 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex gap-3 animate-fade-in items-center">
              <CheckCircle className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 bg-red-990/20 border border-red-500/20 text-red-500 text-xs rounded-xl flex gap-3 animate-fade-in items-center">
              <ShieldAlert className="h-4.5 w-4.5 text-red-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="border border-slate-900 bg-[#090d16]/30 rounded-2xl p-6 space-y-5">
            
            <div className="flex items-center gap-2 border-b border-slate-900/50 pb-3">
              <Key className="h-4.5 w-4.5 text-indigo-400 animate-pulse-subtle" />
              <h3 className="font-bold text-slate-200 text-sm">Rotate Active Passphrase</h3>
            </div>

            {/* A. Current Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold text-slate-400 uppercase block">Current Passphrase</label>
              <div className="relative">
                <input 
                  type={showCurrent ? "text" : "password"}
                  {...register("currentPassword")}
                  className="w-full bg-[#05080e] border border-slate-900 hover:border-slate-805 rounded-lg p-2.5 text-xs text-slate-200 outline-none pr-10"
                  placeholder="Insert active key digest..."
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-350"
                >
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-[10.5px] font-mono text-red-500 font-semibold">{errors.currentPassword.message}</p>
              )}
            </div>

            {/* B. New Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold text-slate-400 uppercase block">New High-Entropy Passphrase</label>
              <div className="relative">
                <input 
                  type={showNew ? "text" : "password"}
                  {...register("newPassword")}
                  onChange={(e) => {
                    setNewPasswordVal(e.target.value);
                    register("newPassword").onChange(e);
                  }}
                  className="w-full bg-[#05080e] border border-slate-900 hover:border-slate-805 rounded-lg p-2.5 text-xs text-slate-200 outline-none pr-10"
                  placeholder="Configure high assurance value..."
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-350"
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-[10.5px] font-mono text-red-500 font-semibold">{errors.newPassword.message}</p>
              )}
            </div>

            {/* C. Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold text-slate-400 uppercase block">Confirm Rotated Passphrase</label>
              <div className="relative">
                <input 
                  type={showConfirm ? "text" : "password"}
                  {...register("confirmPassword")}
                  className="w-full bg-[#05080e] border border-slate-900 hover:border-slate-805 rounded-lg p-2.5 text-xs text-slate-200 outline-none pr-10"
                  placeholder="Repeat rotated digest value..."
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-350"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[10.5px] font-mono text-red-500 font-semibold">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Dynamic Interactive Strength Meter */}
            {newPasswordVal && (
              <div className="space-y-2 pt-2 border-t border-slate-900/60 transition duration-150 animate-fade-in font-mono text-[11px]">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 uppercase">Cryptographic Entropy Strength:</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getStrengthLabel().color}`}>
                    {getStrengthLabel().label}
                  </span>
                </div>
                
                {/* Visual bar meter */}
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      getStrengthPercent() <= 40 ? "bg-rose-500" : getStrengthPercent() <= 80 ? "bg-amber-400" : "bg-emerald-400"
                    }`}
                    style={{ width: `${getStrengthPercent()}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-end pt-3">
              <Link 
                to="/profile"
                className="px-4 py-2 border border-slate-900 bg-slate-950 hover:bg-slate-900 rounded-lg text-xs font-semibold text-slate-400 transition"
              >
                Abort
              </Link>
              <button 
                type="submit"
                disabled={passwordMutation.isPending}
                className="px-5 py-2 bg-indigo-650 hover:bg-indigo-600 disabled:opacity-40 rounded-lg text-xs font-semibold text-slate-100 transition flex items-center gap-1.5"
              >
                {passwordMutation.isPending && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                Authorize Rotation
              </button>
            </div>

          </form>

        </div>

        {/* Requirements & Info Column */}
        <div className="space-y-6">
          
          {/* Metadata dates */}
          <div className="border border-slate-900 bg-slate-950/40 p-4.5 rounded-2xl space-y-3 font-mono text-xs">
            <span className="text-[10px] font-mono text-slate-550 uppercase font-bold flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-indigo-400 animate-pulse-subtle" /> Administrative Records
            </span>
            <div className="space-y-1">
              <span className="block text-slate-500 text-[10px]">PREVIOUS ENCRYPTED ROTATION:</span>
              <span className="text-slate-350 block">{new Date(lastRotatedDate).toLocaleDateString([], { month: "long", day: "2-digit", year: "numeric" })}</span>
            </div>
            <div className="space-y-1">
              <span className="block text-slate-500 text-[10px]">EXPIRY TIMEOUT STATUS:</span>
              <span className="text-emerald-400 font-bold block">Active Session Valid</span>
            </div>
          </div>

          {/* Guidelines Checklist */}
          <div className="border border-slate-900 bg-[#090d16]/30 p-5 rounded-2xl space-y-4">
            <span className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider font-semibold block">Regulatory Criteria</span>
            
            <div className="space-y-3 text-xs">
              {[
                { checked: criteria.hasMinLength, label: "Minimum 8 characters" },
                { checked: criteria.hasUppercase, label: "At least one UPPERCASE letter" },
                { checked: criteria.hasLowercase, label: "At least one lowercase letter" },
                { checked: criteria.hasNumber, label: "At least one numeric [0-9] digit" },
                { checked: criteria.hasSpecial, label: "At least one special character [e.g. @, #, $]" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 transition">
                  <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 text-[10px] font-mono font-bold ${
                    item.checked 
                      ? "bg-emerald-950/50 border-emerald-500/20 text-emerald-400" 
                      : "bg-slate-950 border-slate-900 text-slate-600"
                  }`}>
                    {item.checked ? "✓" : "◦"}
                  </span>
                  <span className={item.checked ? "text-slate-300 font-medium" : "text-slate-500"}>{item.label}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-900/60 pt-4 text-[10.5px] leading-relaxed text-slate-500 flex gap-2.5">
              <Info className="h-4.5 w-4.5 text-indigo-400 shrink-0 mt-0.5" />
              <span>
                To satisfy banking security policies, passwords cannot match credentials used on alternative subnets or historic cycles.
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
