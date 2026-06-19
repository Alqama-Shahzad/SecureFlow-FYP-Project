import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Logo } from "../components/Logo";
import { ShieldCheck } from "lucide-react";

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 2800);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#060913] flex flex-col items-center justify-center relative overflow-hidden selection:bg-indigo-500/30 text-slate-100 font-sans">
      {/* Dark micro-dot layout */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none animate-pulse" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 flex flex-col items-center space-y-7 text-center max-w-sm px-6"
      >
        {/* Beautiful floating workspace tile for the logo */}
        <div className="p-6 bg-[#0d1222]/90 border border-slate-800/80 rounded-2xl shadow-[0_24px_50px_rgba(0,0,0,0.50)] backdrop-blur-xl">
          <Logo size={64} />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="space-y-3"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-xs font-bold text-indigo-400 border border-indigo-500/20 uppercase tracking-wider font-mono mx-auto">
            <ShieldCheck size={11} strokeWidth={2.5} />
            <span>Secure SDLC Platform</span>
          </div>
          <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs mx-auto">
            High-trust project management and delivery for banking and secure cloud environments
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col items-center gap-3 w-full"
        >
          {/* Custom micro metric indicator and clean bar */}
          <div className="w-48 h-1.5 bg-slate-900 rounded-full overflow-hidden relative border border-slate-800/80">
            <motion.div
              className="absolute top-0 left-0 bottom-0 bg-indigo-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.2, delay: 0.1, ease: "easeInOut" }}
            />
          </div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Configuring sandbox instance...
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
