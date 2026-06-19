import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Mail, Lock, Shield, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/src/components/Logo";
import { useLogin } from "@/src/hooks/useLogin";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
      email: "",
      password: ""
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    loginMutation.mutate(
      { email: data.email, password: data.password },
      {
        onSuccess: (user: any) => {
          if (user.role === "Admin") {
            navigate("/dashboard/admin");
          } else if (user.role === "Project Manager") {
            navigate("/dashboard/pm");
          } else {
            navigate("/dashboard/developer");
          }
        },
      }
    );
  };

  const fillCredentials = (role: "Admin" | "PM" | "Dev") => {
    if (role === "Admin") {
      setValue("email", "admin@secureflow.app");
    } else if (role === "PM") {
      setValue("email", "pm@secureflow.app");
    } else {
      setValue("email", "dev@secureflow.app");
    }
    setValue("password", "password");
  };

  const isLoading = loginMutation.isPending;
  const error = loginMutation.error ? loginMutation.error.message : null;

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      {/* Sleek Logo centering on dark bg */}
      <Logo size={44} className="mb-2" />

      <Card className="w-full bg-[#0d1222]/90 border border-slate-800/80 shadow-[0_24px_50px_rgba(0,0,0,0.50)] rounded-2xl transition-all relative overflow-hidden backdrop-blur-xl">
        {/* Soft atmospheric gradient corner */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <CardHeader className="space-y-2 pb-6">
          <div className="flex items-center gap-1.5 text-[10px] text-indigo-400 font-bold uppercase tracking-wider bg-indigo-950/50 border border-indigo-500/20 px-2 py-0.5 rounded-md w-max">
            <Shield size={11} />
            <span>Secure Entrance Gateway</span>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white animate-fade-in">Sign In</CardTitle>
          <CardDescription className="text-slate-400 text-sm">
            Enter your certified credentials to access your secure delivery workspace.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-medium flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            {/* Email Address */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-slate-300 text-xs font-semibold uppercase tracking-wider font-mono">Email Address</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <Mail size={15} />
                </span>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@secureflow.app" 
                  className="bg-slate-950/60 border border-slate-800 text-slate-100 pl-9 placeholder:text-slate-600 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 transition-all h-10 w-full rounded-lg"
                  {...register("email")}
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p className="text-rose-400 text-xs font-medium pt-0.5">{errors.email.message}</p>}
            </div>
            
            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-300 text-xs font-semibold uppercase tracking-wider font-mono">Password</Label>
                <Link to="/forgot-password" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                  Forgot?
                </Link>
              </div>
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
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-rose-400 text-xs font-medium pt-0.5">{errors.password.message}</p>}
            </div>

            {/* Remember Device and Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="rememberMe" 
                  className="border-slate-800 bg-slate-950/60 text-indigo-500 focus:ring-indigo-500 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 rounded"
                  onCheckedChange={(checked) => setValue("rememberMe", checked as boolean)}
                  disabled={isLoading}
                />
                <Label htmlFor="rememberMe" className="text-xs text-slate-400 cursor-pointer font-medium select-none">
                  Keep me signed in for 30 days
                </Label>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all h-10 px-4 rounded-lg flex items-center justify-center gap-2 mt-4 shadow-[0_4px_24px_rgba(99,102,241,0.25)]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  Authenticating Session...
                </>
              ) : (
                <>
                  <Shield size={15} />
                  Authorize Session
                </>
              )}
            </Button>
          </form>

          {/* Quick Demo Autofill Block */}
          <div className="pt-2 text-center space-y-2">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">
              Sandbox Single-Click Autofill Profiles
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button 
                type="button"
                onClick={() => fillCredentials("Admin")}
                className="py-2 px-1 bg-[#0a0d17] hover:bg-slate-900 border border-slate-800 rounded-lg text-[10px] font-bold text-slate-400 hover:text-white transition-colors uppercase font-mono tracking-wider"
              >
                Admin
              </button>
              <button 
                type="button"
                onClick={() => fillCredentials("PM")}
                className="py-2 px-1 bg-[#0a0d17] hover:bg-slate-900 border border-slate-800 rounded-lg text-[10px] font-bold text-slate-400 hover:text-white transition-colors uppercase font-mono tracking-wider"
              >
                Manager
              </button>
              <button 
                type="button"
                onClick={() => fillCredentials("Dev")}
                className="py-2 px-1 bg-[#0a0d17] hover:bg-slate-900 border border-slate-800 rounded-lg text-[10px] font-bold text-slate-400 hover:text-white transition-colors uppercase font-mono tracking-wider"
              >
                Developer
              </button>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-2.5 justify-center border-t border-slate-800/80 pt-5 pb-5 bg-slate-950/20">
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
             PLATFORM COMPLIANCE ROLES
           </p>
           <div className="flex gap-4 text-[10px] text-slate-400 font-semibold uppercase font-mono">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Admin
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Manager
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Developer
              </span>
           </div>
        </CardFooter>
      </Card>
    </div>
  );
}
