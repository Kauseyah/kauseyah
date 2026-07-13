"use client";

import { User as UserIcon, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";
import { BRAND_TAGLINE } from "@/constants";

import { useTransition, Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/app/actions/auth-actions";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/account";
  const verified = searchParams.get("verified");
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  // Show a success message if the user just verified their email
  useEffect(() => {
    if (verified === "true") {
      toast.success("Email verified successfully! Please log in.");
    }
  }, [verified]);

  const handleLogin = (formData: FormData) => {
    startTransition(async () => {
      const result = await login(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Welcome back!");
        router.push(redirectTo);
        router.refresh();
      }
    });
  };

  return (
    <form action={handleLogin} className="space-y-3.5">
      <div className="space-y-1.5">
        <label className="font-body text-[11px] font-semibold text-[#111111]/80 ml-1">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#111111]/40" strokeWidth={1.5} />
          <input 
            type="email" 
            name="email"
            placeholder="you@example.com" 
            className="w-full bg-[#FFF8F3]/50 border border-[#E5E5E5] py-2.5 pl-11 pr-4 rounded-xl font-body text-[13px] text-[#111111] outline-none focus:border-[#FF6B00] focus:bg-white focus:shadow-[0_4px_20px_rgba(255,107,0,0.08)] transition-all placeholder:text-[#111111]/30"
            required
            disabled={isPending}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="font-body text-[11px] font-semibold text-[#111111]/80 ml-1">Password</label>
          <Link href="/forgot-password" className="font-body text-[11px] font-semibold text-[#FF6B00] hover:text-[#e55f00] transition-colors">
            Forgot Password?
          </Link>
        </div>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#111111]/40" strokeWidth={1.5} />
          <input 
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="••••••••" 
            className="w-full bg-[#FFF8F3]/50 border border-[#E5E5E5] py-2.5 pl-11 pr-11 rounded-xl font-body text-[13px] text-[#111111] outline-none focus:border-[#FF6B00] focus:bg-white focus:shadow-[0_4px_20px_rgba(255,107,0,0.08)] transition-all placeholder:text-[#111111]/30"
            required
            disabled={isPending}
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

      <button 
        type="submit" 
        disabled={isPending}
        className="w-full group relative flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#e55f00] text-white py-3 mt-6 rounded-xl transition-all duration-300 shadow-[0_8px_20px_rgba(255,107,0,0.25)] hover:shadow-[0_12px_25px_rgba(255,107,0,0.35)] hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:-translate-y-0"
      >
        {isPending ? <Loader2 size={16} className="animate-spin" /> : null}
        <span className="font-body text-[12px] font-bold uppercase tracking-[0.15em]">
          {isPending ? "Signing In..." : "Sign In"}
        </span>
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-white pt-[64px] lg:pt-[76px]">
      <div className="grid lg:grid-cols-2 min-h-[calc(100vh-76px)]">
        
        {/* Left Column - Typography Focus (Hidden on Mobile) */}
        <div className="hidden lg:flex relative w-full h-full bg-[#0D0400] items-center justify-center p-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
             {/* Soft elegant ambient glows instead of an image */}
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
                <UserIcon className="w-4 h-4 text-[#FF6B00]" strokeWidth={1.5} />
              </div>
              <h2 className="font-display text-2xl md:text-3xl text-[#111111] mb-2">
                Welcome Back
              </h2>
              <p className="font-body text-[13px] text-[#111111]/60 leading-snug max-w-[300px] mx-auto hidden sm:block">
                Sign in to view your handcrafted collection.
              </p>
            </div>

            <Suspense fallback={<div className="h-[200px] flex items-center justify-center"><Loader2 className="animate-spin text-[#FF6B00]" /></div>}>
              <LoginForm />
            </Suspense>

            <div className="mt-6 text-center">
              <p className="font-body text-[13px] text-[#111111]/60">
                New to Kauseyah?{" "}
                <Link 
                  href="/register"
                  className="font-bold text-[#111111] hover:text-[#FF6B00] transition-colors ml-1"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
