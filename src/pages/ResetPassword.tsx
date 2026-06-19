import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useParams } from "react-router-dom";
import { Eye, EyeOff, Loader2, Check, X, ShieldAlert, Lock, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Logo } from "@/src/components/Logo";

const resetPasswordSchema = z.object({
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = watch("password", "");

  const requirements = useMemo(() => [
    { id: "length", text: "At least 8 characters", met: password.length >= 8 },
    { id: "uppercase", text: "Uppercase letter", met: /[A-Z]/.test(password) },
    { id: "lowercase", text: "Lowercase letter", met: /[a-z]/.test(password) },
    { id: "number", text: "Number", met: /[0-9]/.test(password) },
    { id: "special", text: "Special character", met: /[^A-Za-z0-9]/.test(password) },
  ], [password]);

  const strengthScore = requirements.filter(r => r.met).length;
  const strengthPercentage = (strengthScore / requirements.length) * 100;
  
  const getStrengthColor = () => {
    if (strengthScore < 3) return "bg-rose-500";
    if (strengthScore < 5) return "bg-amber-500";
    return "bg-[#10b981]";
  };

  const isFormValid = strengthScore === requirements.length;

  const onSubmit = async (data: ResetPasswordValues) => {
    if (!isFormValid) return;

    setIsLoading(true);
    setError(null);
    
    // Mock API Call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSuccess(true);
    } catch (err: any) {
      setError("Failed to reset password. The link might be invalid or expired.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      {/* Sleek Logo centering */}
      <Logo size={44} className="mb-2" />

      <Card className="w-full bg-[#0d1222]/90 border border-slate-800/80 shadow-[0_24px_50px_rgba(0,0,0,0.50)] rounded-2xl transition-all relative overflow-hidden backdrop-blur-xl">
        {/* Corner soft decoration */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <CardHeader className="space-y-2 pb-6">
          <div className="flex items-center gap-1.5 text-[10px] text-indigo-400 font-bold uppercase tracking-wider bg-indigo-950/50 border border-indigo-500/20 px-2 py-0.5 rounded-md w-max">
            <ShieldAlert size={11} />
            <span>Policy Compliance</span>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white">New Password</CardTitle>
          <CardDescription className="text-slate-400 text-sm">
            {isSuccess 
              ? "Your password has been reset successfully." 
              : "Enter your new password below. It must meet standard cryptographic entropy rules."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isSuccess ? (
            <div className="text-center space-y-6 pt-2 pb-6 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <Check size={24} className="text-[#10b981] font-extrabold" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-semibold text-white">Security Key Updated</h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                  Your security descriptor has been committed. You may now return and authorize your new workspace session.
                </p>
              </div>
              <Link to="/login" className="block">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all h-10 px-4 rounded-lg shadow-sm">
                  Continue to Login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-medium flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              
              {/* New Password Input Group */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-slate-300 text-xs font-semibold uppercase tracking-wider font-mono">New Password</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <Lock size={15} />
                  </span>
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    className="bg-slate-950/60 border border-slate-800 text-slate-100 pl-9 pr-9 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 transition-all h-10 w-full rounded-lg"
                    placeholder="••••••••"
                    {...register("password")}
                    disabled={isLoading}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                
                {/* Password Strength Meter */}
                <div className="pt-2.5 space-y-2.5 bg-[#0a0d17] border border-slate-800 rounded-xl p-3">
                   <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                     <span>Entropy Matrix Score</span>
                     <span className="font-bold text-slate-200">{strengthPercentage}%</span>
                   </div>
                   <div className="h-1.5 w-full bg-slate-800/50 rounded-full overflow-hidden">
                      <div 
                         className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                         style={{ width: `${strengthPercentage}%` }}
                      />
                   </div>
                   
                   <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] font-semibold text-slate-400 uppercase font-mono">
                     {requirements.map((req) => (
                       <div key={req.id} className={`flex items-center space-x-1.5 ${req.met ? "text-emerald-400" : "text-slate-500 opacity-60"}`}>
                         {req.met ? <Check size={11} strokeWidth={3} className="shrink-0" /> : <X size={11} className="shrink-0" />}
                         <span>{req.text}</span>
                       </div>
                     ))}
                   </div>
                </div>
              </div>

              {/* Confirm Password Input Group */}
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-slate-300 text-xs font-semibold uppercase tracking-wider font-mono">Confirm Password</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <Lock size={15} />
                  </span>
                  <Input 
                    id="confirmPassword" 
                    type={showConfirmPassword ? "text" : "password"} 
                    className="bg-slate-950/60 border border-slate-800 text-slate-100 pl-9 pr-9 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 transition-all h-10 w-full rounded-lg"
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                    disabled={isLoading}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-rose-400 text-xs font-medium pt-0.5">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all h-10 px-4 rounded-lg flex items-center justify-center gap-2 mt-4 shadow-[0_4px_24px_rgba(99,102,241,0.25)]"
                disabled={isLoading || !isFormValid}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    Committing Cryptographic Key...
                  </>
                ) : (
                  <>
                    <Shield size={15} />
                    Commit New Key
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center border-t border-slate-800/80 pt-4 pb-5 bg-slate-950/20">
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
              SYSTEM LOCKOUT PROTOCOLS FULLY APPLIED
           </p>
        </CardFooter>
      </Card>
    </div>
  );
}
