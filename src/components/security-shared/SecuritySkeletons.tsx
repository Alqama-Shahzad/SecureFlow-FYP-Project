import React from "react";

export function SkeletonLoader({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-slate-900/60 rounded-xl border border-slate-900 ${className}`} />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="border border-slate-900 bg-[#090d16]/30 p-5 rounded-xl flex flex-col gap-3 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-slate-900/40" />
      <SkeletonLoader className="h-4 w-24" />
      <SkeletonLoader className="h-8 w-16" />
      <SkeletonLoader className="h-3 w-32" />
    </div>
  );
}

export function GridSkeletons({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <StatCardSkeleton key={idx} />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="border border-slate-900 bg-[#080d16]/40 rounded-xl overflow-hidden animate-pulse">
      <div className="border-b border-slate-900 bg-[#0c1220]/50 p-4 flex justify-between gap-4">
        <div className="h-5 w-1/4 bg-slate-900/80 rounded" />
        <div className="h-5 w-10 bg-slate-900/80 rounded" />
      </div>
      <div className="p-4 space-y-4">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex gap-4 items-center">
            {Array.from({ length: cols }).map((_, c) => (
              <div 
                key={c} 
                className="h-4 bg-slate-900 rounded" 
                style={{ width: c === 0 ? "15%" : c === 1 ? "30%" : c === 2 ? "20%" : "35%" }} 
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="border border-slate-900 bg-[#080c14]/40 p-5 rounded-xl flex flex-col gap-4 animate-pulse">
      <div className="h-5 w-1/3 bg-slate-900/70 rounded" />
      <div className="h-[250px] w-full bg-slate-900/40 rounded-lg flex items-end justify-between p-4 gap-2">
        <div className="h-24 w-full bg-slate-900/40 rounded-t" />
        <div className="h-36 w-full bg-slate-900/40 rounded-t" />
        <div className="h-16 w-full bg-slate-900/40 rounded-t" />
        <div className="h-48 w-full bg-slate-900/40 rounded-t" />
        <div className="h-28 w-full bg-slate-900/40 rounded-t" />
        <div className="h-44 w-full bg-slate-900/40 rounded-t" />
      </div>
    </div>
  );
}

export function DetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#090d16]/50 p-6 rounded-xl border border-slate-900 animate-pulse">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-slate-800 rounded" />
          <div className="h-4 w-32 bg-slate-900 rounded" />
        </div>
        <div className="h-8 w-24 bg-slate-800 rounded" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-[200px] bg-[#090d16]/30 border border-slate-900 rounded-xl" />
          <div className="h-[150px] bg-[#090d16]/30 border border-slate-900 rounded-xl" />
        </div>
        <div className="h-[380px] bg-[#090d16]/30 border border-slate-900 rounded-xl" />
      </div>
    </div>
  );
}
