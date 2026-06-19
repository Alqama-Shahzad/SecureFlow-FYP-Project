import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link } from "react-router-dom";
import { Loader2, ArrowLeft, Check, ShieldAlert, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Logo } from "@/src/components/Logo";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSuccess(true);
    } catch (err: any) {
      setError("Failed to send reset link. Please try again later.");
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
            <span>Account Recovery</span>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white">Reset Password</CardTitle>
          <CardDescription className="text-slate-400 text-sm">
            {isSuccess 
              ? "Check your email for recovery instructions." 
              : "Enter your registered email and we'll dispatch a secure recovery link."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isSuccess ? (
             <div className="flex flex-col items-center justify-center space-y-6 py-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Check size={24} className="text-emerald-400 font-extrabold" />
                </div>
                <div className="text-center space-y-2 max-w-xs">
                  <h3 className="text-sm font-semibold text-white">Recovery Token Sent</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    We have dispatched a secure password authorization token to your inbox. Check your spam file if it doesn't show up in 2 minutes.
                  </p>
                </div>
                <Link to="/login" className="w-full block">
                  <Button variant="outline" className="w-full border-slate-800 text-slate-300 bg-slate-950/60 hover:bg-slate-900 override:text-white hover:text-white h-10 rounded-lg text-xs font-semibold">
                    Return to Login
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

              <Button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all h-10 px-4 rounded-lg flex items-center justify-center gap-2 mt-2 shadow-[0_4px_24px_rgba(99,102,241,0.25)]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    Dispatching Link...
                  </>
                ) : (
                  "Send Secure Reset Link"
                )}
              </Button>
              
              <div className="mt-4 text-center">
                <Link to="/login" className="text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors inline-flex items-center gap-1.5 font-mono uppercase tracking-wider">
                  <ArrowLeft size={13} />
                  Return to Account Entrance
                </Link>
              </div>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center border-t border-slate-800/80 pt-4 pb-5 bg-slate-950/20">
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
              SECURE WORKSPACE SESSION POLICY
           </p>
        </CardFooter>
      </Card>
    </div>
  );
}
