"use client";

import { Lock, Eye, EyeOff, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { BRAND_TAGLINE } from "@/constants";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/app/actions/auth-actions";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // On mount, if the Supabase client processes the hash automatically, that's great.
  // But just in case, we will manually parse the hash on submit.
  
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    // Manually parse the session tokens from the URL hash just in case
    const hashStr = window.location.hash.substring(1);
    const urlParams = new URLSearchParams(hashStr);
    const access_token = urlParams.get("access_token");
    const refresh_token = urlParams.get("refresh_token");

    if (access_token && refresh_token) {
      // Explicitly set the session so the server knows who we are
      await supabase.auth.setSession({
        access_token,
        refresh_token,
      });
    }
    
    const { error: resetError } = await supabase.auth.updateUser({ password });
    
    if (resetError) {
      setError(resetError.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
    
    setLoading(false);
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" strokeWidth={1.5} />
        </div>
        <h3 className="font-display text-xl text-[#111111]">Password Updated!</h3>
        <p className="font-body text-[13px] text-[#111111]/70 leading-relaxed">
          Your password has been successfully reset. Redirecting you to login...
        </p>
        <Link 
          href="/login"
          className="inline-flex items-center gap-2 font-body text-[12px] font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-wider mt-4"
        >
          Go to Login <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleReset} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-[13px] text-center border border-red-100 font-medium font-body mb-4">
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <label className="font-body text-[11px] font-semibold text-[#111111]/80 ml-1">New Password</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#111111]/40" strokeWidth={1.5} />
          <input 
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" 
            className="w-full bg-[#FFF8F3]/50 border border-[#E5E5E5] py-2.5 pl-11 pr-11 rounded-xl font-body text-[13px] text-[#111111] outline-none focus:border-[#FF6B00] focus:bg-white focus:shadow-[0_4px_20px_rgba(255,107,0,0.08)] transition-all placeholder:text-[#111111]/30"
            required
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#111111]/40 hover:text-[#FF6B00] transition-colors focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="font-body text-[11px] font-semibold text-[#111111]/80 ml-1">Confirm New Password</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#111111]/40" strokeWidth={1.5} />
          <input 
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••" 
            className="w-full bg-[#FFF8F3]/50 border border-[#E5E5E5] py-2.5 pl-11 pr-4 rounded-xl font-body text-[13px] text-[#111111] outline-none focus:border-[#FF6B00] focus:bg-white focus:shadow-[0_4px_20px_rgba(255,107,0,0.08)] transition-all placeholder:text-[#111111]/30"
            required
            disabled={loading}
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full group relative flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#e55f00] text-white py-3 mt-6 rounded-xl transition-all duration-300 shadow-[0_8px_20px_rgba(255,107,0,0.25)] hover:shadow-[0_12px_25px_rgba(255,107,0,0.35)] hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:-translate-y-0"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : null}
        <span className="font-body text-[12px] font-bold uppercase tracking-[0.15em]">
          {loading ? "Updating..." : "Update Password"}
        </span>
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-white pt-[64px] lg:pt-[76px]">
      <div className="grid lg:grid-cols-2 min-h-[calc(100vh-76px)]">
        
        {/* Left Column - Typography Focus (Hidden on Mobile) */}
        <div className="hidden lg:flex relative w-full h-full bg-[#0D0400] items-center justify-center p-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
             <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-[#FF6B00]/10 rounded-full blur-[120px]" />
             <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-[#FF6B00]/10 rounded-full blur-[100px]" />
          </div>
          
          <div className="relative z-10 flex flex-col items-center text-center max-w-xl">
            <h1 className="font-display text-7xl xl:text-8xl text-white mb-8 tracking-tighter">
              Kauseyah
            </h1>
            <div className="w-12 h-px bg-[#FF6B00] mb-8" />
            <p className="font-body text-[12px] tracking-[0.4em] text-[#FF6B00] uppercase font-bold mb-10">
              {BRAND_TAGLINE}
            </p>
            <p className="font-body text-lg text-white/70 leading-relaxed font-light max-w-md mx-auto">
              Celebrating timeless craftsmanship, honoring tribal heritage, and creating responsibly with conscious design.
            </p>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#FFF8F3] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-b from-[#FF6B00]/5 to-transparent rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          
          <div className="w-full max-w-[420px] bg-white p-6 md:p-8 rounded-[1.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-[#111111] relative z-10">
            <div className="mb-6 text-center">
              <div className="w-10 h-10 bg-[#FFF8F3] rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-4 h-4 text-[#FF6B00]" strokeWidth={1.5} />
              </div>
              <h2 className="font-display text-2xl md:text-3xl text-[#111111] mb-2">
                New Password
              </h2>
              <p className="font-body text-[13px] text-[#111111]/60 leading-snug max-w-[300px] mx-auto hidden sm:block">
                Please create a new, secure password for your account.
              </p>
            </div>

            <ResetPasswordForm />

          </div>
        </div>
      </div>
    </main>
  );
}
