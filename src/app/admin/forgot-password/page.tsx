"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { sendPasswordResetEmail } from "@/app/actions/auth-actions";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const res = await sendPasswordResetEmail(email, '/admin/reset-password');
    
    if (res?.error) {
      setError(res.error);
    } else {
      setSuccess(true);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-[#FF6B00]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[30rem] h-[30rem] bg-[#FFD4A8]/20 rounded-full blur-3xl" />
      
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-[#FFD4A8]/30 relative z-10 backdrop-blur-sm">
        <div>
          <h2 className="mt-4 text-center text-3xl font-display text-ink font-semibold tracking-tight">
            Reset Password
          </h2>
          <p className="mt-3 text-center text-sm text-muted">
            Enter your email to receive a reset link
          </p>
        </div>

        {success ? (
          <div className="mt-8 space-y-6">
            <div className="bg-emerald-50 text-emerald-700 p-6 rounded-xl text-center border border-emerald-100 flex flex-col items-center gap-3">
              <CheckCircle2 size={32} className="text-emerald-500" />
              <div>
                <p className="font-semibold mb-1">Check your inbox</p>
                <p className="text-sm text-emerald-600/80">We've sent a password reset link to {email}</p>
              </div>
            </div>
            <Link href="/admin/login" className="flex items-center justify-center gap-2 text-sm font-medium text-stone-500 hover:text-ink transition-colors w-full py-3">
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center border border-red-100 font-medium">
                {error}
              </div>
            )}
            
            <div className="space-y-5">
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-ink mb-1.5 ml-1">Email Address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-4 py-3.5 border border-gray-300 text-ink rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] sm:text-sm bg-gray-100 transition-all duration-200 placeholder-stone-500"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-2 space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full disabled:opacity-70 py-3.5 rounded-xl text-[13px]"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
              
              <Link href="/admin/login" className="flex items-center justify-center gap-2 text-sm font-medium text-stone-500 hover:text-ink transition-colors w-full py-2">
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
