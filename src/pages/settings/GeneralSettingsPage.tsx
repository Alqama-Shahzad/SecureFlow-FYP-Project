import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Sliders, 
  HelpCircle, 
  Settings, 
  CheckCircle, 
  RefreshCw, 
  Moon, 
  Sun, 
  Laptop, 
  Globe, 
  Layout, 
  Bell, 
  Save, 
  RotateCcw,
  AlertTriangle
} from "lucide-react";
import { useGeneralSettings, useUpdateGeneralSettings } from "../../hooks/useProfileSettings";

type AppearanceMode = "dark" | "light" | "system";

export default function GeneralSettingsPage() {
  const { data: settings, isLoading, error } = useGeneralSettings();
  const updateMutation = useUpdateGeneralSettings();

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // General Setting States managed locally for saving
  const [appearance, setAppearance] = useState<AppearanceMode>("dark");
  const [language, setLanguage] = useState("en-US");
  const [dateFormat, setDateFormat] = useState("YYYY-MM-DD");
  const [timezone, setTimezone] = useState("America/New_York");
  const [compactMode, setCompactMode] = useState(false);
  const [defaultLandingPage, setDefaultLandingPage] = useState("/dashboard");
  const [sidebarBehavior, setSidebarBehavior] = useState<"collapsed" | "expanded" | "hover">("expanded");
  const [cardDensity, setCardDensity] = useState<"compact" | "normal" | "spacious">("normal");

  // Notifications toggles
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [desktopNotifications, setDesktopNotifications] = useState(true);
  const [projectAlerts, setProjectAlerts] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);

  // Synchronize loading parameters
  useEffect(() => {
    if (settings) {
      setAppearance(settings.appearance);
      setLanguage(settings.language);
      setDateFormat(settings.dateFormat);
      setTimezone(settings.timezone);
      setCompactMode(settings.compactMode);
      setDefaultLandingPage(settings.defaultLandingPage);
      setSidebarBehavior(settings.sidebarBehavior);
      setCardDensity(settings.cardDensity);

      if (settings.notificationPreferences) {
        setEmailNotifications(settings.notificationPreferences.emailNotifications);
        setPushNotifications(settings.notificationPreferences.pushNotifications);
        setDesktopNotifications(settings.notificationPreferences.desktopNotifications);
        setProjectAlerts(settings.notificationPreferences.projectAlerts);
        setSystemAlerts(settings.notificationPreferences.systemAlerts);
      }
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync({
        appearance,
        language,
        dateFormat,
        timezone,
        compactMode,
        defaultLandingPage,
        sidebarBehavior,
        cardDensity,
        notificationPreferences: {
          emailNotifications,
          pushNotifications,
          desktopNotifications,
          projectAlerts,
          systemAlerts
        }
      });
      setSuccessMsg("General preference configs synchronized in centralized parameters hub.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error("Failed to persist general settings", err);
    }
  };

  const handleResetDefaults = () => {
    if (confirm("Reset layout preferences and notification vectors to standard SecureFlow defaults?")) {
      setAppearance("dark");
      setLanguage("en-US");
      setDateFormat("YYYY-MM-DD");
      setTimezone("America/New_York");
      setCompactMode(false);
      setDefaultLandingPage("/dashboard");
      setSidebarBehavior("expanded");
      setCardDensity("normal");
      setEmailNotifications(true);
      setPushNotifications(false);
      setDesktopNotifications(true);
      setProjectAlerts(true);
      setSystemAlerts(true);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 text-center space-y-4 animate-fade-in text-slate-400">
        <RefreshCw className="h-6 w-6 animate-spin text-indigo-500 mx-auto" />
        <p className="text-xs font-mono">Retrieving layout metadata preferences...</p>
      </div>
    );
  }

  if (error || !settings) {
    return (
      <div className="p-8 max-w-lg mx-auto mt-16 border border-slate-900 bg-[#090d16] rounded-2xl text-center space-y-4">
        <AlertTriangle className="h-10 w-10 text-rose-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-100">Preferences Fetch Lost</h3>
        <p className="text-xs text-slate-400">Configuration stream lost payload mapping: {(error as Error)?.message}</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-in text-slate-300 font-sans max-w-4xl">
      
      {/* Settings title and sub-links */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2.5">
          <Settings className="h-7 w-7 text-indigo-400" />
          General System Preferences
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Personalize appearance matrices, system timezones, and active dispatch filtering parameters
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-990/20 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex gap-3 animate-fade-in items-center">
          <CheckCircle className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* A. APPEARANCE SETTINGS */}
        <div className="border border-slate-900 bg-[#090d16]/30 rounded-2xl p-6 space-y-5">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <Sun className="h-4.5 w-4.5 text-indigo-400" /> Display Theme Matrix
            </h3>
            <p className="text-xs text-slate-450">Set layout brightness vectors for workspace monitors</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            {([
              { mode: "dark", label: "Midnight Dark (Enforced)", icon: Moon, desc: "Ambient eye protection" },
              { mode: "light", label: "Snow Light", icon: Sun, desc: "High illumination matrix" },
              { mode: "system", label: "System Sync", icon: Laptop, desc: "Follow OS sensor vectors" }
            ] as const).map(({ mode, label, icon: Icon, desc }) => (
              <button
                type="button"
                key={mode}
                onClick={() => setAppearance(mode)}
                className={`p-4 rounded-xl border text-left space-y-2 transition duration-150 relative ${
                  appearance === mode 
                    ? "bg-indigo-950/40 border-indigo-500/30 text-indigo-300" 
                    : "bg-slate-950 border-slate-900 text-slate-500 hover:text-slate-350"
                }`}
              >
                <div className="flex items-center gap-2 font-bold font-sans">
                  <Icon className={`h-4 w-4 ${appearance === mode ? "text-indigo-400 animate-pulse-subtle" : "text-slate-600"}`} />
                  <span>{label}</span>
                </div>
                <p className="text-[10.5px] text-slate-500 font-sans">{desc}</p>
                {appearance === mode && (
                  <span className="absolute top-3 right-3 text-emerald-400 text-[10px] font-bold">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* B. REGULATORY TIME AND LANGUAGES CO-ORDINATES */}
        <div className="border border-slate-900 bg-[#090d16]/30 rounded-2xl p-6">
          <h3 className="font-bold text-slate-200 text-sm mb-5 flex items-center gap-1.5 border-b border-slate-900/50 pb-3">
            <Globe className="h-4.5 w-4.5 text-emerald-400 animate-pulse-subtle" /> Timezone & Handshake Parameters
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            {/* Language dropdown */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold text-slate-400 block uppercase">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-[#05080e] border border-slate-900 text-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-slate-800"
              >
                <option value="en-US">English (United States)</option>
                <option value="en-GB">English (United Kingdom)</option>
                <option value="fr-FR">Français (France)</option>
                <option value="de-DE">Deutsch (Deutschland)</option>
                <option value="ja-JP">日本語 (Japan)</option>
              </select>
            </div>

            {/* Date format */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold text-slate-400 block uppercase">Date Format</label>
              <select
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className="w-full bg-[#05080e] border border-slate-900 text-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-slate-800"
              >
                <option value="YYYY-MM-DD">YYYY-MM-DD (2026-06-19)</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY (19/06/2026)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (06/19/2026)</option>
              </select>
            </div>

            {/* Timezone */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold text-slate-400 block uppercase">System Location Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full bg-[#05080e] border border-slate-900 text-slate-400 rounded-lg p-2.5 text-xs outline-none focus:border-slate-800"
              >
                <option value="America/New_York">America/New_York (EST/EDT)</option>
                <option value="America/Chicago">America/Chicago (CST/CDT)</option>
                <option value="America/Denver">America/Denver (MST/MDT)</option>
                <option value="America/Los_Angeles">America/Los_Angeles (PST/PDT)</option>
                <option value="Europe/London">Europe/London (GMT/BST)</option>
                <option value="Europe/Paris">Europe/Paris (CET/CEST)</option>
                <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
              </select>
            </div>
          </div>
        </div>

        {/* C. DASHBOARD PREFERENCES AND DENSITY LIMITS */}
        <div className="border border-slate-900 bg-[#090d16]/30 rounded-2xl p-6">
          <h3 className="font-bold text-slate-200 text-sm mb-5 flex items-center gap-1.5 border-b border-slate-900/50 pb-3">
            <Layout className="h-4.5 w-4.5 text-indigo-400" /> Space Density & Landing Zones
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            {/* Landing page dropdown */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold text-slate-400 block uppercase">Default Landing Page</label>
              <span className="text-[10px] text-slate-500 block">Where SecureFlow opens post-authorization</span>
              <select
                value={defaultLandingPage}
                onChange={(e) => setDefaultLandingPage(e.target.value)}
                className="w-full bg-[#05080e] border border-slate-900 text-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-slate-800"
              >
                <option value="/dashboard">Main Dashboard overview</option>
                <option value="/projects">Active Project files</option>
                <option value="/tasks">Task checklist records</option>
                <option value="/audit-logs">Audit log ledger verification</option>
                <option value="/security/ids">SOC IDS Monitors</option>
              </select>
            </div>

            {/* Sidebar behavior */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold text-slate-400 block uppercase">Sidebar Behavior</label>
              <span className="text-[10px] text-slate-505 block">Configures how left sidebar navigation adapts</span>
              <select
                value={sidebarBehavior}
                onChange={(e) => setSidebarBehavior(e.target.value as any)}
                className="w-full bg-[#05080e] border border-slate-900 text-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-slate-805"
              >
                <option value="expanded">Expanded (Always visible labels)</option>
                <option value="collapsed">Collapsed (Symbols only)</option>
                <option value="hover">Dynamic Drawer (Slide on mouse hover)</option>
              </select>
            </div>

            {/* Card Density */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold text-slate-400 block uppercase">Component Content Density</label>
              <span className="text-[10px] text-slate-505 block">Defines vertical/horizontal spacing tolerances</span>
              <select
                value={cardDensity}
                onChange={(e) => setCardDensity(e.target.value as any)}
                className="w-full bg-[#05080e] border border-slate-900 text-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-slate-805"
              >
                <option value="normal">Normal (Default balanced layouts)</option>
                <option value="compact">Compact (Highly structural, multi-data views)</option>
                <option value="spacious">Spacious (Generous padding negative space)</option>
              </select>
            </div>

            {/* Compact Mode Toggle */}
            <div className="space-y-2 pt-2 flex items-center justify-between gap-6 border-l border-slate-900 pl-6">
              <div className="space-y-0.5">
                <label className="text-[11px] font-mono font-bold text-slate-400 block uppercase">Compact Table Mode</label>
                <p className="text-[10.5px] text-slate-500 font-sans">Eliminate excessive row dividers in grid indices</p>
              </div>
              <button
                type="button"
                onClick={() => setCompactMode(!compactMode)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 outline-none ${
                  compactMode ? "bg-indigo-550" : "bg-slate-900"
                }`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-100 shadow ring-0 transition duration-200 ${
                  compactMode ? "translate-x-5" : "translate-x-0"
                }`} />
              </button>
            </div>

          </div>
        </div>

        {/* D. NOTIFICATION PREFERENCES */}
        <div className="border border-slate-900 bg-[#090d16]/30 rounded-2xl p-6">
          <h3 className="font-bold text-slate-200 text-sm mb-5 flex items-center gap-1.5 border-b border-slate-900/50 pb-3">
            <Bell className="h-4.5 w-4.5 text-emerald-400 animate-pulse-subtle" /> Dispatch Channel Notifications
          </h3>

          <div className="space-y-4 font-sans text-xs">
            {[
              { id: "email", val: emailNotifications, set: setEmailNotifications, label: "Email Notifications", desc: "Transmit cryptographic verification files and login checklists to backup inbox vectors" },
              { id: "push", val: pushNotifications, set: setPushNotifications, label: "Push Notification Channels", desc: "Deploy socket packets to connected mobile administrator devices" },
              { id: "desktop", val: desktopNotifications, set: setDesktopNotifications, label: "Desktop Alerts", desc: "Display HTML5 floating popups on threat perimeter blocks" },
              { id: "projects", val: projectAlerts, set: setProjectAlerts, label: "Project Delta Alerts", desc: "Transmit notifications on assignee re-allocations and milestone changes" },
              { id: "system", val: systemAlerts, set: setSystemAlerts, label: "Critical System Fault Warnings", desc: "Immediate paging dispatch sequence on SRE cluster node degradations" },
            ].map(({ id, val, set, label, desc }) => (
              <div key={id} className="flex items-center justify-between p-3.5 rounded-xl bg-[#04070d]/35 border border-slate-905 gap-6">
                <div className="space-y-0.5">
                  <span className="font-extrabold text-slate-150 uppercase text-[11px] block">{label}</span>
                  <p className="text-slate-500 text-[10.5px] leading-relaxed max-w-xl">{desc}</p>
                </div>
                
                <button
                  type="button"
                  onClick={() => set(prev => !prev)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 outline-none ${
                    val ? "bg-indigo-550" : "bg-slate-900"
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-100 shadow ring-0 transition duration-200 ${
                    val ? "translate-x-5" : "translate-x-0"
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Actions button blocks */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-900/50">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-4.5 py-2.5 border border-slate-900 bg-slate-950 hover:bg-slate-910 hover:border-slate-805 text-slate-450 hover:text-slate-205 rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
          >
            <RotateCcw className="h-4 w-4" /> Reset Layout Defaults
          </button>

          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="px-6 py-2.5 bg-indigo-650 hover:bg-indigo-600 rounded-lg text-xs font-semibold text-slate-100 transition flex items-center gap-2 shadow-lg shadow-indigo-950/40 font-sans"
          >
            {updateMutation.isPending ? (
              <>
                <RefreshCw className="h-4.5 w-4.5 animate-spin" /> Committing Preferences...
              </>
            ) : (
              <>
                <Save className="h-4.5 w-4.5" /> Save Preference Configuration
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
