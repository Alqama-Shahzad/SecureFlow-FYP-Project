import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  User, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Briefcase, 
  Save, 
  X, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  ArrowLeft,
  Camera
} from "lucide-react";
import { useProfile, useUpdateProfile } from "../../hooks/useProfileSettings";

const profileFormSchema = z.object({
  firstName: z.string().min(2, "First name must specify at least 2 characters."),
  lastName: z.string().min(2, "Last name must specify at least 2 characters."),
  email: z.string().email("Invalid corporate email domain parameters."),
  phoneNumber: z.string().min(5, "Contact SIP terminal string required for emergency pager cycles."),
  department: z.string().min(2, "Department allocation is required."),
  position: z.string().min(2, "Platform position is required."),
  timezone: z.string().min(2, "Timezone coordinate is required."),
  location: z.string().min(2, "HQ/Subnet geographic coordinate required."),
  bio: z.string().max(800, "Operator bio notes must not exceed 800 characters."),
  avatar: z.string().optional()
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
];

export default function EditProfile() {
  const navigate = useNavigate();
  const { data: profile, isLoading, error } = useProfile();
  const updateMutation = useUpdateProfile();
  
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState("");

  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema)
  });

  // Pre-populate data once profile is loaded
  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phoneNumber: profile.phoneNumber || "",
        department: profile.department || "",
        position: profile.position || "",
        timezone: profile.timezone || "America/New_York",
        location: profile.location || "New York, USA",
        bio: profile.bio || "",
        avatar: profile.avatar || AVATAR_PRESETS[0]
      });
      setSelectedAvatar(profile.avatar || AVATAR_PRESETS[0]);
    }
  }, [profile, reset]);

  const handlePresetSelect = (url: string) => {
    setSelectedAvatar(url);
    setValue("avatar", url, { shouldDirty: true });
  };

  const handleCustomAvatarInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value.trim();
    if (url) {
      setSelectedAvatar(url);
      setValue("avatar", url, { shouldDirty: true });
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      const mergedFullName = `${values.firstName} ${values.lastName}`.trim();
      await updateMutation.mutateAsync({
        ...values,
        fullName: mergedFullName,
        avatar: selectedAvatar
      });

      setSuccessMsg("Profile administrative payload parsed and committed successfully.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        setSuccessMsg(null);
        navigate("/profile");
      }, 2000);
    } catch (err) {
      console.error("Mutation failed", err);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 space-y-6 animate-fade-in text-slate-400">
        <RefreshCw className="h-6 w-6 animate-spin text-indigo-500 mx-auto" />
        <p className="text-center text-xs font-mono">Fetching workspace profile states...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-8 max-w-lg mx-auto mt-16 border border-slate-900 bg-[#090d16] rounded-2xl text-center space-y-4">
        <AlertTriangle className="h-10 w-10 text-rose-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-100 font-sans">Handshake Lost</h3>
        <p className="text-xs text-slate-400">Unable to load active profile context: {(error as Error)?.message}</p>
        <Link to="/profile" className="px-4 py-2 bg-indigo-950 hover:bg-indigo-900/40 border border-indigo-500/20 text-indigo-300 text-xs rounded-xl font-semibold inline-block">
          Return to Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fade-in text-slate-300 font-sans max-w-4xl">
      
      {/* Upper Navigation Row */}
      <div className="flex items-center gap-3">
        <Link 
          to="/profile" 
          className="p-1.5 border border-slate-900 bg-slate-950 hover:border-slate-805 rounded transition text-slate-400 hover:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-bold">Preferences Dashboard</span>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-100 leading-tight">Edit Corporate Identity</h1>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-990/20 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex gap-3 animate-fade-in items-center">
          <CheckCircle className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {updateMutation.isError && (
        <div className="p-4 bg-red-990/20 border border-red-500/20 text-red-500 text-xs rounded-xl flex gap-3 animate-fade-in items-center">
          <AlertTriangle className="h-4.5 w-4.5 text-red-500 shrink-0" />
          <span>Error compiling updates: {updateMutation.error.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* 1. Avatar Selector Segment */}
        <div className="border border-slate-900 bg-[#090d16]/30 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Camera className="h-4.5 w-4.5 text-indigo-400" />
            <h3 className="font-bold text-slate-200 text-sm">Avatar Profile Photo</h3>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative shrink-0">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full blur opacity-10" />
              <img 
                src={selectedAvatar} 
                alt="Form Avatar" 
                className="relative h-20 w-20 rounded-full border-2 border-slate-900 object-cover bg-slate-950"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="space-y-3.5 w-full">
              <span className="text-[11px] font-mono text-slate-500 block uppercase">Choose SecureFlow Preset</span>
              <div className="flex flex-wrap gap-2.5">
                {AVATAR_PRESETS.map((preset, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => handlePresetSelect(preset)}
                    className={`h-11 w-11 rounded-full border-2 overflow-hidden transition-all duration-150 transform hover:scale-105 ${
                      selectedAvatar === preset 
                        ? "border-indigo-400 ring-2 ring-indigo-950/40" 
                        : "border-slate-900 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={preset} alt={`Preset ${idx}`} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-mono text-slate-550 block">OR INJECT CUSTOM ENCRYPTED URL</span>
                <input 
                  type="text"
                  placeholder="https://images.unsplash.com/photo-..."
                  onChange={handleCustomAvatarInput}
                  className="w-full max-w-xl bg-[#03060c] border border-slate-900 rounded-lg p-2.5 text-xs text-slate-250 font-mono outline-none focus:border-slate-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Primary Coordinates Form Fields */}
        <div className="border border-slate-900 bg-[#090d16]/30 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-900/50 pb-3">
            <User className="h-4.5 w-4.5 text-emerald-400" />
            <h3 className="font-bold text-slate-200 text-sm">Identity & Department Keys</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* First Name */}
            <div className="space-y-1.5">
              <label className="text-[11.5px] font-mono font-bold text-slate-400 block uppercase">First Name</label>
              <input 
                type="text"
                {...register("firstName")}
                className="w-full bg-[#05080e] border border-slate-900 hover:border-slate-805 rounded-lg p-2.5 text-xs text-slate-200 outline-none"
              />
              {errors.firstName && (
                <p className="text-[10.5px] font-mono text-red-500 font-semibold">{errors.firstName.message}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-1.5">
              <label className="text-[11.5px] font-mono font-bold text-slate-400 block uppercase">Last Name</label>
              <input 
                type="text"
                {...register("lastName")}
                className="w-full bg-[#05080e] border border-slate-900 hover:border-slate-805 rounded-lg p-2.5 text-xs text-slate-200 outline-none"
              />
              {errors.lastName && (
                <p className="text-[10.5px] font-mono text-red-500 font-semibold">{errors.lastName.message}</p>
              )}
            </div>

            {/* Corporate Email */}
            <div className="space-y-1.5">
              <label className="text-[11.5px] font-mono font-bold text-slate-400 block uppercase flex items-center justify-between">
                <span>Corporate Email</span>
                <span className="text-[10px] text-slate-550 lowercase">Handshake key</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-550" />
                <input 
                  type="email"
                  {...register("email")}
                  className="w-full bg-[#05080e] border border-slate-900 hover:border-slate-805 rounded-lg pl-10 pr-4 p-2.5 text-xs text-slate-200 outline-none"
                />
              </div>
              {errors.email && (
                <p className="text-[10.5px] font-mono text-red-500 font-semibold">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-[11.5px] font-mono font-bold text-slate-400 block uppercase">Emergency Phone (SIP)</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-550" />
                <input 
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  {...register("phoneNumber")}
                  className="w-full bg-[#05080e] border border-slate-900 hover:border-slate-805 rounded-lg pl-10 pr-4 p-2.5 text-xs text-slate-200 outline-none"
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-[10.5px] font-mono text-red-500 font-semibold">{errors.phoneNumber.message}</p>
              )}
            </div>

            {/* Department */}
            <div className="space-y-1.5">
              <label className="text-[11.5px] font-mono font-bold text-slate-400 block uppercase">Department / Division</label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-3 h-4 w-4 text-slate-550" />
                <input 
                  type="text"
                  {...register("department")}
                  className="w-full bg-[#05080e] border border-slate-900 hover:border-slate-805 rounded-lg pl-10 pr-4 p-2.5 text-xs text-slate-200 outline-none"
                />
              </div>
              {errors.department && (
                <p className="text-[10.5px] font-mono text-red-500 font-semibold">{errors.department.message}</p>
              )}
            </div>

            {/* Position */}
            <div className="space-y-1.5">
              <label className="text-[11.5px] font-mono font-bold text-slate-400 block uppercase">Platform Role / Position</label>
              <input 
                type="text"
                {...register("position")}
                className="w-full bg-[#05080e] border border-slate-900 hover:border-slate-805 rounded-lg p-2.5 text-xs text-slate-200 outline-none"
              />
              {errors.position && (
                <p className="text-[10.5px] font-mono text-red-500 font-semibold">{errors.position.message}</p>
              )}
            </div>

            {/* Geographic Location */}
            <div className="space-y-1.5">
              <label className="text-[11.5px] font-mono font-bold text-slate-400 block uppercase">Subnet Geography Location</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-550 animate-pulse-subtle" />
                <input 
                  type="text"
                  {...register("location")}
                  className="w-full bg-[#05080e] border border-slate-900 hover:border-slate-805 rounded-lg pl-10 pr-4 p-2.5 text-xs text-slate-200 outline-none"
                />
              </div>
              {errors.location && (
                <p className="text-[10.5px] font-mono text-red-500 font-semibold">{errors.location.message}</p>
              )}
            </div>

            {/* Timezone Selection */}
            <div className="space-y-1.5">
              <label className="text-[11.5px] font-mono font-bold text-slate-400 block uppercase">Operational Clock Timezone</label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-3 h-4 w-4 text-slate-550" />
                <select 
                  {...register("timezone")}
                  className="w-full bg-[#05080e] border border-slate-900 hover:border-slate-810 rounded-lg pl-10 pr-4 p-2.5 text-xs text-slate-200 outline-none py-2.5"
                >
                  <option value="America/New_York">America/New_York (EST/EDT)</option>
                  <option value="America/Chicago">America/Chicago (CST/CDT)</option>
                  <option value="America/Denver">America/Denver (MST/MDT)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (PST/PDT)</option>
                  <option value="Europe/London">Europe/London (GMT/BST)</option>
                  <option value="Europe/Paris">Europe/Paris (CET/CEST)</option>
                  <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                  <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
                </select>
              </div>
              {errors.timezone && (
                <p className="text-[10.5px] font-mono text-red-500 font-semibold">{errors.timezone.message}</p>
              )}
            </div>

            {/* Bio info */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[11.5px] font-mono font-bold text-slate-400 block uppercase flex justify-between">
                <span>Personal Bio Overview</span>
                <span className="text-[10px] text-slate-550">Maximum 800 characters</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-550" />
                <textarea 
                  rows={4}
                  {...register("bio")}
                  className="w-full bg-[#05080e] border border-slate-900 hover:border-slate-805 rounded-lg pl-10 pr-4 p-2.5 text-xs text-slate-250 outline-none"
                  placeholder="Tell us about your background, security clearances, and operational assignments..."
                />
              </div>
              {errors.bio && (
                <p className="text-[10.5px] font-mono text-red-500 font-semibold">{errors.bio.message}</p>
              )}
            </div>

          </div>
        </div>

        {/* Action Triggers */}
        <div className="flex justify-end gap-3.5 pt-4">
          <Link 
            to="/profile"
            className="px-5 py-2.5 border border-slate-900 bg-slate-950 hover:bg-slate-900 rounded-lg text-xs font-semibold text-slate-405 hover:text-slate-250 transition"
          >
            Discard
          </Link>

          <button 
            type="submit"
            disabled={updateMutation.isPending}
            className="px-6 py-2.5 bg-indigo-650 hover:bg-indigo-600 rounded-lg text-xs font-semibold text-slate-100 transition flex items-center gap-2 shadow-lg shadow-indigo-950/40"
          >
            {updateMutation.isPending ? (
              <>
                <RefreshCw className="h-4.5 w-4.5 animate-spin" /> Persisting Payload...
              </>
            ) : (
              <>
                <Save className="h-4.5 w-4.5" /> Save Changes
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
