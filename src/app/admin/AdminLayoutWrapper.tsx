"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function AdminLayoutWrapper({ 
  children, 
  sidebar 
}: { 
  children: ReactNode; 
  sidebar: ReactNode;
}) {
  const pathname = usePathname();
  
  // Check if we are on any authentication-related page
  const isAuthPage = 
    pathname.includes('/admin/login') || 
    pathname.includes('/admin/forgot-password') || 
    pathname.includes('/admin/reset-password');

  // If it's an auth page, render without the dashboard layout wrappers
  if (isAuthPage) {
    return <div className="min-h-screen bg-white">{children}</div>;
  }

  // Otherwise, render the full admin dashboard layout
  return (
    <div className={`flex flex-col md:flex-row h-screen bg-slate-50`}>
      {sidebar}
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-950">
        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6 md:p-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="max-w-[1200px] mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
