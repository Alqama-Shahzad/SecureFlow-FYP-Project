import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Lock, 
  Trash2, 
  Terminal, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  AlertOctagon, 
  Key, 
  Cpu, 
  Globe, 
  Globe2, 
  Smartphone, 
  Info,
  Sliders,
  Database,
  RotateCcw
} from "lucide-react";
import { 
  useSecuritySettings, 
  useUpdateSecuritySettings, 
  useActiveSessions, 
  useTerminateSession 
} from "../../hooks/useProfileSettings";

export default function SecuritySettingsPage() {
  const { data: secSettings, isLoading: isLoadingSec, error: errorSec } = useSecuritySettings();
  const { data: sessions, isLoading: isLoadingSess } = useActiveSessions();
  
  const updateMutation = useUpdateSecuritySettings();
  const terminateMutation = useTerminateSession();

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Security preferences local states
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(30);
  const [passwordExpiryDays, setPasswordExpiryDays] = useState(90);
  const [rememberDevice, setRememberDevice] = useState(true);
  
  // Access restrictions states
  const [ipRestrictions, setIpRestrictions] = useState("");
  const [failedLoginThreshold, setFailedLoginThreshold] = useState(5);
  const [accountLockDurationMinutes, setAccountLockDurationMinutes] = useState(15);
  const [trustedDevicesOnly, setTrustedDevicesOnly] = useState(false);

  // Monitoring preferences states
  const [loginAlertsEnabled, setLoginAlertsEnabled] = useState(true);
  const [securityNotificationsEnabled, setSecurityNotificationsEnabled] = useState(true);
  const [suspiciousActivityAlertsEnabled, setSuspiciousActivityAlertsEnabled] = useState(true);

  // Synchronize values from server context
  useEffect(() => {
    if (secSettings) {
      setTwoFactorEnabled(secSettings.twoFactorEnabled);
      setSessionTimeoutMinutes(secSettings.sessionTimeoutMinutes);
      setPasswordExpiryDays(secSettings.passwordExpiryDays);
      setRememberDevice(secSettings.rememberDevice);
      setIpRestrictions(secSettings.ipRestrictions);
      setFailedLoginThreshold(secSettings.failedLoginThreshold);
      setAccountLockDurationMinutes(secSettings.accountLockDurationMinutes);
      setTrustedDevicesOnly(secSettings.trustedDevicesOnly);
      setLoginAlertsEnabled(secSettings.loginAlertsEnabled);
      setSecurityNotificationsEnabled(secSettings.securityNotificationsEnabled);
      setSuspiciousActivityAlertsEnabled(secSettings.suspiciousActivityAlertsEnabled);
    }
  }, [secSettings]);

  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync({
        twoFactorEnabled,
        sessionTimeoutMinutes: Number(sessionTimeoutMinutes),
        passwordExpiryDays: Number(passwordExpiryDays),
        rememberDevice,
        ipRestrictions,
        failedLoginThreshold: Number(failedLoginThreshold),
        accountLockDurationMinutes: Number(accountLockDurationMinutes),
        trustedDevicesOnly,
        loginAlertsEnabled,
        securityNotificationsEnabled,
        suspiciousActivityAlertsEnabled
      });
      setSuccessMsg("Security privilege vectors and CIDR restriction envelopes stored successfully.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error("Failed to update security parameters", err);
    }
  };

  const handleTerminateSession = async (sessionId: string) => {
    if (confirm("Forcibly revoke cryptographic signature and terminate this session? User will be kicked to login portal.")) {
      try {
        await terminateMutation.mutateAsync(sessionId);
        setSuccessMsg("Session envelope expired. Access token has been blacklisted on proxy router.");
        setTimeout(() => setSuccessMsg(null), 3000);
      } catch (err) {
        console.error("Failed to revoke session", err);
      }
    }
  };

  const handleRestoreDefaults = () => {
    if (confirm("Restore security configuration parameters to strict DoD zero-trust defaults?")) {
      setTwoFactorEnabled(true);
      setSessionTimeoutMinutes(15);
      setPasswordExpiryDays(60);
      setRememberDevice(false);
      setIpRestrictions("10.0.0.0/8");
      setFailedLoginThreshold(3);
      setAccountLockDurationMinutes(30);
      setTrustedDevicesOnly(true);
      setLoginAlertsEnabled(true);
      setSecurityNotificationsEnabled(true);
      setSuspiciousActivityAlertsEnabled(true);
    }
  };

  if (isLoadingSec) {
    return (
      <div className="p-6 md:p-8 text-center space-y-4 animate-fade-in text-slate-400">
        <RefreshCw className="h-6 w-6 animate-spin text-indigo-500 mx-auto" />
        <p className="text-xs font-mono">Loading crypto security schemas...</p>
      </div>
    );
  }

  if (errorSec || !secSettings) {
    return (
      <div className="p-8 max-w-lg mx-auto mt-16 border border-slate-900 bg-[#090d16] rounded-2xl text-center space-y-4">
        <AlertOctagon className="h-10 w-10 text-rose-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-100">IAM Tunnel Offline</h3>
        <p className="text-xs text-slate-400">Security preferences module payload lost: {(errorSec as Error)?.message}</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-in text-slate-300 font-sans max-w-4xl">
      
      {/* Page Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2.5">
          <ShieldCheck className="h-7 w-7 text-rose-400 animate-pulse-subtle" />
          High Assurance Security Settings
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Review active sessions, configure CIDR subnets permissioning, and manage password policies
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-990/20 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex gap-3 animate-fade-in items-center">
          <CheckCircle className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 1. SESSION MANAGEMENT TABLE */}
      <div className="border border-slate-900 bg-[#090d16]/30 rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <Terminal className="h-4.5 w-4.5 text-indigo-400" /> Active Hardware Sessions
            </h3>
            <p className="text-xs text-slate-450 mt-0.5">Revoke active sessions executing on secure ports</p>
          </div>
          <span className="text-[10px] font-mono text-indigo-400 font-bold bg-indigo-950/20 border border-indigo-900/30 px-2 py-0.5 rounded">
            Proxy Guard
          </span>
        </div>

        {isLoadingSess ? (
          <div className="h-20 w-full bg-slate-950 animate-pulse rounded" />
        ) : !sessions || sessions.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-550 border border-dashed border-slate-900 rounded-xl">
            No active hardware session tokens mapped.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-900 bg-slate-950/50 font-mono text-slate-500 text-[10px] uppercase">
                  <th className="py-2.5 px-3">Device / Terminal</th>
                  <th className="py-2.5 px-3">IP Address</th>
                  <th className="py-2.5 px-3">Browser Cluster</th>
                  <th className="py-2.5 px-3">Last Active</th>
                  <th className="py-2.5 px-3 text-right">Revocation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60 font-mono">
                {sessions.map((sess) => (
                  <tr key={sess.id} className="hover:bg-slate-950/30 transition">
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-200 flex items-center gap-1.5 uppercase text-[10.5px]">
                        {sess.isCurrent ? <Cpu className="h-3.5 w-3.5 text-emerald-400" /> : <Smartphone className="h-3.5 w-3.5 text-slate-500" />}
                        {sess.deviceName}
                        {sess.isCurrent && (
                          <span className="text-[9px] font-mono rounded bg-emerald-950 text-emerald-400 px-1.5 py-0.5 ml-1 border border-emerald-900/30">CURRENT</span>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-350">{sess.ipAddress}</td>
                    <td className="py-3 px-3 text-slate-400">{sess.browser}</td>
                    <td className="py-3 px-3 text-slate-450">{sess.lastActive}</td>
                    <td className="py-3 px-3 text-right">
                      {sess.isCurrent ? (
                        <span className="text-[10px] text-slate-550 italic pr-3 font-mono">Protected</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleTerminateSession(sess.id)}
                          className="p-1 px-2 border border-slate-900 hover:border-red-900/40 bg-slate-950 text-slate-405 hover:text-red-400 rounded transition font-bold"
                          title="Forcibly expire authorization token"
                        >
                          Revoke Token
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <form onSubmit={handleSaveSecurity} className="space-y-6">
        
        {/* 2. AUTHENTICATION SCHEMAS */}
        <div className="border border-slate-900 bg-[#090d16]/30 rounded-2xl p-6">
          <h3 className="font-bold text-slate-200 text-sm mb-5 flex items-center gap-1.5 border-b border-slate-900/50 pb-3">
            <Key className="h-4.5 w-4.5 text-rose-400" /> Multi-Factor & Expiry Matrices
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            
            {/* Two Factor Authentication Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-900 gap-6">
              <div className="space-y-0.5">
                <label className="text-[11.5px] font-mono font-bold text-slate-300 block uppercase">Enforce 2FA/MFA Multi-Factor</label>
                <p className="text-[10.5px] text-slate-500 font-sans">Mandatory hardware keys/authenticator OTP keys login flow</p>
              </div>

              <button
                type="button"
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 outline-none ${
                  twoFactorEnabled ? "bg-indigo-550" : "bg-slate-900"
                }`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-100 shadow ring-0 transition duration-200 ${
                  twoFactorEnabled ? "translate-x-5" : "translate-x-0"
                }`} />
              </button>
            </div>

            {/* Remember Device Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-900 gap-6">
              <div className="space-y-0.5">
                <label className="text-[11.5px] font-mono font-bold text-slate-300 block uppercase">Remember Trusted Hardware</label>
                <p className="text-[10.5px] text-slate-500 font-sans">Bypass 2FA checks on verified mac address devices for 30 days</p>
              </div>

              <button
                type="button"
                onClick={() => setRememberDevice(!rememberDevice)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 outline-none ${
                  rememberDevice ? "bg-indigo-550" : "bg-slate-900"
                }`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-100 shadow ring-0 transition duration-200 ${
                  rememberDevice ? "translate-x-5" : "translate-x-0"
                }`} />
              </button>
            </div>

            {/* Session Timeout */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/40 border border-slate-900">
              <label className="text-[11.5px] font-mono font-bold text-slate-300 block uppercase flex justify-between">
                <span>Session Expiration Duration</span>
                <span className="text-indigo-400">{sessionTimeoutMinutes} Minutes</span>
              </label>
              <input 
                type="range"
                min={5}
                max={120}
                step={5}
                value={sessionTimeoutMinutes}
                onChange={(e) => setSessionTimeoutMinutes(Number(e.target.value))}
                className="w-full accent-indigo-550 h-1.5 block cursor-pointer bg-slate-900"
              />
              <span className="text-[10px] text-slate-500 font-sans block">Automatic termination on keyboard/mouse inactivity</span>
            </div>

            {/* Password Expiry days */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/40 border border-slate-900">
              <label className="text-[11.5px] font-mono font-bold text-slate-300 block uppercase">Passphrase Recurrent Expiry</label>
              <select
                value={passwordExpiryDays}
                onChange={(e) => setPasswordExpiryDays(Number(e.target.value))}
                className="w-full bg-[#05080e] border border-slate-900 text-slate-300 rounded-lg p-2 text-xs outline-none"
              >
                <option value={30}>Strict NIST Limit (30 Days)</option>
                <option value={60}>High Assurance (60 Days)</option>
                <option value={90}>Standard Enterprise Corporate (90 Days)</option>
                <option value={180}>Relaxed policy (180 Days)</option>
              </select>
              <span className="text-[10px] text-slate-500 font-sans block">Forced password rotation cycle deadlines</span>
            </div>

          </div>
        </div>

        {/* 3. ACCESS RESTRICTIONS AND CIDR SHIELD */}
        <div className="border border-slate-900 bg-[#090d16]/30 rounded-2xl p-6">
          <h3 className="font-bold text-slate-200 text-sm mb-5 flex items-center gap-1.5 border-b border-slate-900/50 pb-3">
            <Globe2 className="h-4.5 w-4.5 text-indigo-400 animate-pulse-subtle" /> Network CIDR Firewalls & Lock Duration
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            
            {/* IP Restrictions */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[11.5px] font-mono font-bold text-slate-300 block uppercase">IP Whitelists (CIDR notation)</label>
              <input 
                type="text"
                value={ipRestrictions}
                onChange={(e) => setIpRestrictions(e.target.value)}
                placeholder="e.g. 10.0.0.0/8, 192.168.1.0/24"
                className="w-full bg-[#05080e] border border-slate-900 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-slate-800"
              />
              <span className="text-[10px] text-slate-500 font-sans block">Only requests matching this comma-separated subnet checklist bypass absolute proxy blocks</span>
            </div>

            {/* Locked threshold */}
            <div className="space-y-1.5">
              <label className="text-[11.5px] font-mono font-bold text-slate-300 block uppercase">Brute-Force Failed Attempts Threshold</label>
              <select
                value={failedLoginThreshold}
                onChange={(e) => setFailedLoginThreshold(Number(e.target.value))}
                className="w-full bg-[#05080e] border border-slate-900 text-slate-300 rounded-lg p-2.5 text-xs outline-none"
              >
                <option value={3}>3 Failed handshakes (High Alert)</option>
                <option value={5}>5 Failed handshakes (Standard policy)</option>
                <option value={10}>10 Attempt parameters allowed</option>
              </select>
            </div>

            {/* Lock Duration */}
            <div className="space-y-1.5">
              <label className="text-[11.5px] font-mono font-bold text-slate-300 block uppercase">Terminal Lockout Invalidation Window</label>
              <select
                value={accountLockDurationMinutes}
                onChange={(e) => setAccountLockDurationMinutes(Number(e.target.value))}
                className="w-full bg-[#05080e] border border-slate-900 text-slate-300 rounded-lg p-2.5 text-xs outline-none"
              >
                <option value={15}>15 Minutes Cooldown</option>
                <option value={30}>30 Minutes Lockout</option>
                <option value={60}>60 Minutes (High-security locked)</option>
                <option value={1440}>Infinite manual security unlock required</option>
              </select>
            </div>

            {/* Trusted Devices Only Toggle */}
            <div className="flex items-center justify-between p-3 md:col-span-2 rounded-xl bg-slate-950/40 border border-slate-900 gap-6">
              <div className="space-y-0.5">
                <label className="text-[11.5px] font-mono font-bold text-slate-300 block uppercase">Require MDM Verified Certificate</label>
                <p className="text-[10.5px] text-slate-500 font-sans">Verify MDM enrollment certificates over TLS handshake prior to granting access</p>
              </div>

              <button
                type="button"
                onClick={() => setTrustedDevicesOnly(!trustedDevicesOnly)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 outline-none ${
                  trustedDevicesOnly ? "bg-indigo-550" : "bg-slate-900"
                }`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-100 shadow ring-0 transition duration-200 ${
                  trustedDevicesOnly ? "translate-x-5" : "translate-x-0"
                }`} />
              </button>
            </div>

          </div>
        </div>

        {/* 4. INCIDENT AUDITING TUNES */}
        <div className="border border-slate-900 bg-[#090d16]/30 rounded-2xl p-6">
          <h3 className="font-bold text-slate-200 text-sm mb-5 flex items-center gap-1.5 border-b border-slate-900/50 pb-3">
            <Sliders className="h-4.5 w-4.5 text-emerald-400" /> Audit Log Warning Filters
          </h3>

          <div className="space-y-4 font-sans text-xs">
            {[
              { id: "log-alrt", val: loginAlertsEnabled, set: setLoginAlertsEnabled, label: "Immediate Login Alerts", desc: "Sms operator checklist notifications immediately when new IP signatures authorize login keys" },
              { id: "sec-notif", val: securityNotificationsEnabled, set: setSecurityNotificationsEnabled, label: "Federal Security Alerts", desc: "Log audit events to SOC console streams when role matrix values alter" },
              { id: "susp-act", val: suspiciousActivityAlertsEnabled, set: setSuspiciousActivityAlertsEnabled, label: "Real-time Edge Suspicion Flags", desc: "Dispatch warning indicators to WAF terminals when payload overflows occur" },
            ].map(({ id, val, set, label, desc }) => (
              <div key={id} className="flex items-center justify-between p-3.5 rounded-xl bg-[#04070d]/35 border border-slate-905 gap-6">
                <div className="space-y-0.5">
                  <span className="font-extrabold text-slate-150 uppercase text-[11px] block">{label}</span>
                  <p className="text-slate-500 text-[10.5px] max-w-xl leading-relaxed">{desc}</p>
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

        {/* Actions Button Row */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-900/50">
          <button
            type="button"
            onClick={handleRestoreDefaults}
            className="px-4.5 py-2.5 border border-slate-900 bg-slate-950 hover:bg-slate-910 hover:border-slate-805 text-slate-450 hover:text-slate-205 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 font-mono"
          >
            <RotateCcw className="h-4 w-4" /> DoD Defaults Restore
          </button>

          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="px-6 py-2.5 bg-indigo-650 hover:bg-indigo-600 rounded-lg text-xs font-semibold text-slate-100 transition flex items-center gap-2 shadow-lg shadow-indigo-950/40 font-sans"
          >
            {updateMutation.isPending ? (
              <>
                <RefreshCw className="h-4.5 w-4.5 animate-spin" /> Committing Privilege Envs...
              </>
            ) : (
              <>
                <ShieldCheck className="h-4.5 w-4.5" /> Save Security Settings
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
