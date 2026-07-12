"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/app/actions/auth-actions";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    const res = await resetPassword(password);
    
    if (res?.error) {
      setError(res.error);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/login");
      }, 3000);
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
            New Password
          </h2>
          <p className="mt-3 text-center text-sm text-muted">
            Please enter your new password below.
          </p>
        </div>
        
        {success ? (
          <div className="mt-8 space-y-6">
            <div className="bg-emerald-50 text-emerald-700 p-6 rounded-xl text-center border border-emerald-100 flex flex-col items-center gap-3">
              <CheckCircle2 size={32} className="text-emerald-500" />
              <div>
                <p className="font-semibold mb-1">Password Updated!</p>
                <p className="text-sm text-emerald-600/80">Redirecting to login...</p>
              </div>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleReset}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center border border-red-100 font-medium">
                {error}
              </div>
            )}
            
            <div className="space-y-5">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-ink mb-1.5 ml-1">New Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="appearance-none relative block w-full pl-4 pr-12 py-3.5 border border-gray-300 text-ink rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] sm:text-sm bg-gray-100 transition-all duration-200 placeholder-stone-500"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-stone-400 hover:text-[#FF6B00] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-ink mb-1.5 ml-1">Confirm Password</label>
                <input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="appearance-none relative block w-full px-4 py-3.5 border border-gray-300 text-ink rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] sm:text-sm bg-gray-100 transition-all duration-200 placeholder-stone-500"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full disabled:opacity-70 py-3.5 rounded-xl text-[13px]"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
