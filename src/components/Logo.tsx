export function Logo({ className = "", size = 32 }: { className?: string; size?: number }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img
        src="/logo.webp"
        alt="SecureFlow logo"
        referrerPolicy="no-referrer"
        style={{ height: `${size}px`, width: "auto" }}
        className="max-w-full object-contain filter drop-shadow-[0_0_12px_rgba(99,102,241,0.15)]"
      />
    </div>
  );
}


