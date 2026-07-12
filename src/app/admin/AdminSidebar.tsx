"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  LogOut,
  ShoppingCart,
  Users,
  CreditCard,
  FileText,
  Menu,
  X
} from "lucide-react";

export default function AdminSidebar({
  totalOrders,
  totalPayments,
  totalCustomers,
  handleLogout
}: {
  totalOrders: number;
  totalPayments: number;
  totalCustomers: number;
  handleLogout: () => void;
}) {
  const pathname = usePathname();
  
  const [seenOrders, setSeenOrders] = useState(totalOrders);
  const [seenPayments, setSeenPayments] = useState(totalPayments);
  const [seenCustomers, setSeenCustomers] = useState(totalCustomers);
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load from local storage
    const storedOrders = localStorage.getItem('seenOrders');
    const storedPayments = localStorage.getItem('seenPayments');
    const storedCustomers = localStorage.getItem('seenCustomers');
    
    // Initialize if exists, otherwise use current total
    if (storedOrders) setSeenOrders(parseInt(storedOrders));
    else localStorage.setItem('seenOrders', totalOrders.toString());

    if (storedPayments) setSeenPayments(parseInt(storedPayments));
    else localStorage.setItem('seenPayments', totalPayments.toString());

    if (storedCustomers) setSeenCustomers(parseInt(storedCustomers));
    else localStorage.setItem('seenCustomers', totalCustomers.toString());
    
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Close mobile sidebar on navigation
    setIsOpen(false);

    // Update seen counts based on current route
    if (pathname.includes('/admin/orders')) {
      setSeenOrders(totalOrders);
      localStorage.setItem('seenOrders', totalOrders.toString());
    }
    if (pathname.includes('/admin/payments')) {
      setSeenPayments(totalPayments);
      localStorage.setItem('seenPayments', totalPayments.toString());
    }
    if (pathname.includes('/admin/customers')) {
      setSeenCustomers(totalCustomers);
      localStorage.setItem('seenCustomers', totalCustomers.toString());
    }
  }, [pathname, totalOrders, totalPayments, totalCustomers, isMounted]);

  const newOrdersCount = isMounted ? Math.max(0, totalOrders - seenOrders) : 0;
  const newPaymentsCount = isMounted ? Math.max(0, totalPayments - seenPayments) : 0;
  const newCustomersCount = isMounted ? Math.max(0, totalCustomers - seenCustomers) : 0;

  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden bg-slate-950 border-b border-slate-900 p-4 flex justify-between items-center shadow-sm w-full shrink-0">
        <div className="flex items-center">
          <Image src="/images/logo1.png" alt="Kauseyah" width={200} height={60} className="h-14 w-auto object-contain" />
        </div>
        <button onClick={() => setIsOpen(true)} className="text-slate-400 hover:text-white">
          <Menu size={24} />
        </button>
      </header>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden transition-opacity" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-slate-950 border-r border-slate-900 shadow-xl font-sans transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:flex
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Close Button for Mobile */}
        <button 
          className="absolute top-4 right-4 md:hidden text-slate-400 hover:text-white z-50"
          onClick={() => setIsOpen(false)}
        >
          <X size={24} />
        </button>

        <div className="p-6 flex items-center justify-center pt-10 md:pt-6">
          <Image src="/images/logo1.png" alt="Kauseyah" width={250} height={80} className="h-20 w-auto object-contain" />
        </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="px-3 pb-2 pt-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase">Overview</div>
        <Link 
          href="/admin/dashboard" 
          className="flex items-center gap-3 px-3 py-2.5 text-slate-300 rounded-xl hover:bg-slate-900 hover:text-white transition-all font-medium text-sm group"
        >
          <LayoutDashboard size={18} strokeWidth={2} className="text-slate-500 group-hover:text-orange-400 transition-colors" />
          <span>Dashboard</span>
        </Link>
        
        <div className="px-3 pb-2 pt-6 text-[11px] font-bold tracking-wider text-slate-500 uppercase">Store Management</div>
        <Link 
          href="/admin/products" 
          className="flex items-center gap-3 px-3 py-2.5 text-slate-300 rounded-xl hover:bg-slate-900 hover:text-white transition-all font-medium text-sm group"
        >
          <Package size={18} strokeWidth={2} className="text-slate-500 group-hover:text-orange-400 transition-colors" />
          <span>Products</span>
        </Link>
        <Link 
          href="/admin/orders" 
          className="flex items-center justify-between px-3 py-2.5 text-slate-300 rounded-xl hover:bg-slate-900 hover:text-white transition-all font-medium text-sm group"
        >
          <div className="flex items-center gap-3">
            <ShoppingCart size={18} strokeWidth={2} className="text-slate-500 group-hover:text-orange-400 transition-colors" />
            <span>Orders</span>
          </div>
          {newOrdersCount > 0 ? (
            <span className="bg-[#FF6B00] text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[24px] h-6 flex items-center justify-center">
              {newOrdersCount}
            </span>
          ) : null}
        </Link>
        <Link 
          href="/admin/customers" 
          className="flex items-center justify-between px-3 py-2.5 text-slate-300 rounded-xl hover:bg-slate-900 hover:text-white transition-all font-medium text-sm group"
        >
          <div className="flex items-center gap-3">
            <Users size={18} strokeWidth={2} className="text-slate-500 group-hover:text-orange-400 transition-colors" />
            <span>Customers</span>
          </div>
          {newCustomersCount > 0 ? (
            <span className="bg-[#FF6B00] text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[24px] h-6 flex items-center justify-center">
              {newCustomersCount}
            </span>
          ) : null}
        </Link>
        <Link 
          href="/admin/payments" 
          className="flex items-center justify-between px-3 py-2.5 text-slate-300 rounded-xl hover:bg-slate-900 hover:text-white transition-all font-medium text-sm group"
        >
          <div className="flex items-center gap-3">
            <CreditCard size={18} strokeWidth={2} className="text-slate-500 group-hover:text-orange-400 transition-colors" />
            <span>Payments</span>
          </div>
          {newPaymentsCount > 0 ? (
            <span className="bg-[#FF6B00] text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[24px] h-6 flex items-center justify-center">
              {newPaymentsCount}
            </span>
          ) : null}
        </Link>

        <div className="px-3 pb-2 pt-6 text-[11px] font-bold tracking-wider text-slate-500 uppercase">Content</div>
        <Link 
          href="/admin/blogs" 
          className="flex items-center gap-3 px-3 py-2.5 text-slate-300 rounded-xl hover:bg-slate-900 hover:text-white transition-all font-medium text-sm group"
        >
          <FileText size={18} strokeWidth={2} className="text-slate-500 group-hover:text-orange-400 transition-colors" />
          <span>Blogs</span>
        </Link>

        <div className="px-3 pb-2 pt-6 text-[11px] font-bold tracking-wider text-slate-500 uppercase">System</div>
        <Link 
          href="/admin/settings" 
          className="flex items-center gap-3 px-3 py-2.5 text-slate-300 rounded-xl hover:bg-slate-900 hover:text-white transition-all font-medium text-sm group"
        >
          <Settings size={18} strokeWidth={2} className="text-slate-500 group-hover:text-orange-400 transition-colors" />
          <span>Settings</span>
        </Link>
      </nav>
      
      <div className="p-4 border-t border-slate-900">
        <form action={handleLogout}>
          <button 
            type="submit"
            className="flex items-center gap-3 w-full px-3 py-2.5 text-slate-400 rounded-xl hover:bg-rose-950/50 hover:text-rose-400 transition-all font-medium text-sm group"
          >
            <LogOut size={18} strokeWidth={2} className="text-slate-500 group-hover:text-rose-400 transition-colors" />
            <span>Logout</span>
          </button>
        </form>
      </div>
    </aside>
    </>
  );
}
