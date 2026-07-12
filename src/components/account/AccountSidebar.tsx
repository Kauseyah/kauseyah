"use client";

import { User, Package, ChevronRight, Power } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { logout } from "@/app/actions/auth-actions";

export default function AccountSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  
  const [isLoading, setIsLoading] = useState(true);
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then(async (res) => {
        if (!res.ok && res.status !== 401 && res.status !== 400) {
          throw new Error("Failed to fetch");
        }
        return res.json();
      })
      .then(data => {
        if (!data.error) {
          if (data.full_name && data.full_name.trim().length > 0) {
            const parts = data.full_name.trim().split(" ");
            setFirstName(parts[0]);
          } else if (data.email) {
            // Fallback to the part of the email before @
            const emailPrefix = data.email.split("@")[0];
            setFirstName(emailPrefix);
          } else {
            setFirstName("User");
          }
        }
      })
      .catch(err => {
        // console.error("Profile fetch error:", err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="w-full flex flex-col items-center border-b border-brand/10 pb-8">
      {/* Personalized Header */}
      <div className="text-center mb-8">
        <p className="text-[12px] text-muted font-medium uppercase tracking-[0.2em] mb-3">Welcome to your account</p>
        <h2 className="font-display text-ink text-4xl sm:text-5xl tracking-wide">
          {isLoading ? "..." : firstName || "User"}
        </h2>
      </div>

      {/* Horizontal Navigation */}
      <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-6 bg-card px-4 sm:px-8 py-3 rounded-full shadow-sm border border-[#FF6B00]/10">
        <Link 
          href="/account/orders" 
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all text-[13px] tracking-widest uppercase font-bold ${pathname.startsWith('/account/orders') ? 'bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/30' : 'text-muted hover:text-[#FF6B00] hover:bg-[#FF6B00]/10'}`}
        >
          <Package className={`w-4 h-4 ${pathname.startsWith('/account/orders') ? 'text-white' : 'text-[#FF6B00]'}`} />
          <span className="hidden sm:inline">My Orders</span>
        </Link>

        <Link 
          href="/account" 
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all text-[13px] tracking-widest uppercase font-bold ${pathname === '/account' ? 'bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/30' : 'text-muted hover:text-[#FF6B00] hover:bg-[#FF6B00]/10'}`}
        >
          <User className={`w-4 h-4 ${pathname === '/account' ? 'text-white' : 'text-[#FF6B00]'}`} />
          <span className="hidden sm:inline">Profile</span>
        </Link>
        
        <Link 
          href="/account/addresses" 
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all text-[13px] tracking-widest uppercase font-bold ${pathname === '/account/addresses' ? 'bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/30' : 'text-muted hover:text-[#FF6B00] hover:bg-[#FF6B00]/10'}`}
        >
          <span className="hidden sm:inline">Addresses</span>
          <span className="sm:hidden">Loc</span>
        </Link>

        <div className="w-[1px] h-6 bg-[#FF6B00]/20 mx-2"></div>

        <button 
          onClick={handleLogout} 
          className="flex items-center gap-2 px-5 py-2.5 rounded-full transition-all text-[13px] tracking-widest uppercase font-bold text-muted hover:text-red-500 hover:bg-red-50"
        >
          <Power className="w-4 h-4 text-red-400" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </div>
  );
}
