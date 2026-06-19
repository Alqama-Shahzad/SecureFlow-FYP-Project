import React, { useState } from "react";
import { Copy, Check, ShieldAlert, Binary } from "lucide-react";

interface HashViewerProps {
  hash: string;
  label?: string;
  isGenesis?: boolean;
  className?: string;
}

export function HashViewer({ hash, label, isGenesis, className = "" }: HashViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isZeroHash = hash.replace(/0/g, "") === "";

  return (
    <div className={`p-2.5 rounded-xl border border-slate-900 bg-slate-950/40 hover:bg-slate-950/70 transition-all font-mono text-[11px] flex items-center justify-between gap-3 ${className}`}>
      <div className="min-w-0 flex-1">
        {label && (
          <div className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest flex items-center gap-1 mb-1">
            <Binary size={10} className="text-slate-600" />
            {label}
            {isZeroHash && (
              <span className="text-[8px] text-amber-500 bg-amber-500/10 px-1 rounded border border-amber-500/15">GENESIS COMPLIANCE BASIS</span>
            )}
          </div>
        )}
        <div className="text-white break-all tracking-tight font-medium leading-relaxed font-mono">
          {hash}
        </div>
      </div>

      <button
        onClick={handleCopy}
        type="button"
        className="p-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/50 text-slate-400 hover:text-white transition-all cursor-pointer shadow-sm hover:scale-105 shrink-0"
        title="Copy raw SHA-256 block signature to workspace clipboard"
      >
        {copied ? (
          <Check size={12} className="text-emerald-400 animate-scale" />
        ) : (
          <Copy size={12} />
        )}
      </button>
    </div>
  );
}
