/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User, LogOut, Package, MapPin, Phone, Mail, Lock, ShieldCheck, ArrowRight } from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export default function LoginPage() {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("kauseyah-user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    // Simulate login with default dummy data
    const dummyUser: UserProfile = {
      name: "Aditi Sharma",
      email: email,
      phone: "+91 98765 43210",
      address: "12, Saree Weavers Colony, Indiranagar, Bangalore - 560038",
    };
    localStorage.setItem("kauseyah-user", JSON.stringify(dummyUser));
    setUser(dummyUser);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !address || !password) return;

    const newUser: UserProfile = {
      name,
      email,
      phone,
      address,
    };
    localStorage.setItem("kauseyah-user", JSON.stringify(newUser));
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("kauseyah-user");
    setUser(null);
    setEmail("");
    setPassword("");
    setName("");
    setPhone("");
    setAddress("");
  };

  return (
    <main className="bg-[#FFF8F3] min-h-screen pt-36 pb-20">
      <div className="max-w-4xl mx-auto px-6 md:px-8">
        
        {user ? (
          /* ── USER DASHBOARD ── */
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-3xl border border-[#FF6B00]/10 shadow-[0_8px_30px_rgba(181,84,26,0.02)]">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/20 flex items-center justify-center text-[#FF6B00]">
                  <User size={32} strokeWidth={1.5} />
                </div>
                <div>
                  <h1 className="font-display text-2xl md:text-3xl text-stone-900 font-bold">Welcome back, {user.name}</h1>
                  <p className="font-body text-xs text-stone-500 uppercase tracking-widest mt-1">Kauseyah Patron Member</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 border border-stone-200 hover:border-red-200 hover:text-red-500 px-5 py-2.5 rounded-xl font-body text-xs font-semibold uppercase tracking-wider text-stone-600 bg-white transition-colors cursor-pointer"
              >
                <LogOut size={14} />
                Log Out
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Profile Details */}
              <div className="md:col-span-1 bg-white p-6 rounded-3xl border border-[#FF6B00]/10 shadow-[0_8px_30px_rgba(181,84,26,0.02)] space-y-6">
                <h3 className="font-body text-xs font-bold tracking-[0.2em] uppercase text-stone-900 pb-3 border-b border-[#FF6B00]/10">
                  Profile Information
                </h3>
                <div className="space-y-4 font-body text-sm text-stone-700">
                  <div className="flex items-start gap-3">
                    <Mail size={16} className="text-[#FF6B00] shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-stone-400 block font-bold uppercase tracking-wider">Email Address</span>
                      <span className="font-medium text-stone-800 break-all">{user.email}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone size={16} className="text-[#FF6B00] shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-stone-400 block font-bold uppercase tracking-wider">Phone Number</span>
                      <span className="font-medium text-stone-800">{user.phone}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-[#FF6B00] shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-stone-400 block font-bold uppercase tracking-wider">Delivery Address</span>
                      <span className="font-medium text-stone-800 leading-relaxed block">{user.address}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order History */}
              <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-[#FF6B00]/10 shadow-[0_8px_30px_rgba(181,84,26,0.02)] space-y-6">
                <h3 className="font-body text-xs font-bold tracking-[0.2em] uppercase text-stone-900 pb-3 border-b border-[#FF6B00]/10">
                  Recent Orders
                </h3>
                <div className="space-y-4">
                  <div className="border border-stone-150 p-5 rounded-2xl flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center bg-[#FAF9F5]">
                    <div className="space-y-1.5 font-body">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-xs text-stone-900">#KAS-998310</span>
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Delivered</span>
                      </div>
                      <p className="text-[11px] text-stone-500">Ordered on June 24, 2026 • 1 Masterpiece Item</p>
                    </div>
                    <div className="text-left sm:text-right font-body">
                      <p className="font-bold text-sm text-[#FF6B00]">₹14,999</p>
                      <Link href="/products" className="text-[10px] font-bold text-stone-600 hover:text-[#FF6B00] uppercase tracking-wider flex items-center gap-1 mt-1 transition-colors">
                        View Product <ArrowRight size={10} />
                      </Link>
                    </div>
                  </div>

                  <div className="border border-stone-150 p-5 rounded-2xl flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center bg-[#FAF9F5]">
                    <div className="space-y-1.5 font-body">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-xs text-stone-900">#KAS-997284</span>
                        <span className="bg-stone-100 text-stone-600 border border-stone-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Completed</span>
                      </div>
                      <p className="text-[11px] text-stone-500">Ordered on May 12, 2026 • 2 Items</p>
                    </div>
                    <div className="text-left sm:text-right font-body">
                      <p className="font-bold text-sm text-[#FF6B00]">₹6,450</p>
                      <Link href="/products" className="text-[10px] font-bold text-stone-600 hover:text-[#FF6B00] uppercase tracking-wider flex items-center gap-1 mt-1 transition-colors">
                        View Products <ArrowRight size={10} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ── AUTH FORMS ── */
          <div className="max-w-md mx-auto bg-white border border-[#FF6B00]/10 rounded-3xl p-8 shadow-[0_12px_40px_rgba(181,84,26,0.04)] space-y-6">
            
            {/* Tabs */}
            <div className="flex border-b border-stone-100">
              <button
                onClick={() => setIsLoginTab(true)}
                className={`flex-1 pb-4 text-center font-display text-lg font-semibold transition-colors border-b-2 cursor-pointer ${
                  isLoginTab ? "border-[#FF6B00] text-stone-900" : "border-transparent text-stone-400 hover:text-stone-600"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLoginTab(false)}
                className={`flex-1 pb-4 text-center font-display text-lg font-semibold transition-colors border-b-2 cursor-pointer ${
                  !isLoginTab ? "border-[#FF6B00] text-stone-900" : "border-transparent text-stone-400 hover:text-stone-600"
                }`}
              >
                Create Account
              </button>
            </div>

            {isLoginTab ? (
              /* Sign In Form */
              <form onSubmit={handleLoginSubmit} className="space-y-4 font-body text-xs">
                <div className="space-y-1.5">
                  <label className="block text-stone-800 font-bold uppercase tracking-wider text-[10px]">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. aditi@example.com"
                      className="w-full bg-stone-50 border border-stone-300 focus:border-[#FF6B00] px-4 py-3 rounded-xl text-stone-900 text-sm outline-none transition-all placeholder-stone-400"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-stone-800 font-bold uppercase tracking-wider text-[10px]">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-stone-50 border border-stone-300 focus:border-[#FF6B00] px-4 py-3 rounded-xl text-stone-900 text-sm outline-none transition-all placeholder-stone-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#111111] hover:bg-[#FF6B00] text-white py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors cursor-pointer mt-4"
                >
                  Sign In
                </button>
              </form>
            ) : (
              /* Register Form */
              <form onSubmit={handleRegisterSubmit} className="space-y-4 font-body text-xs">
                <div className="space-y-1.5">
                  <label className="block text-stone-800 font-bold uppercase tracking-wider text-[10px]">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aditi Sharma"
                    className="w-full bg-stone-50 border border-stone-300 focus:border-[#FF6B00] px-4 py-3 rounded-xl text-stone-900 text-sm outline-none transition-all placeholder-stone-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-stone-800 font-bold uppercase tracking-wider text-[10px]">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. aditi@example.com"
                    className="w-full bg-stone-50 border border-stone-300 focus:border-[#FF6B00] px-4 py-3 rounded-xl text-stone-900 text-sm outline-none transition-all placeholder-stone-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-stone-800 font-bold uppercase tracking-wider text-[10px]">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full bg-stone-50 border border-stone-300 focus:border-[#FF6B00] px-4 py-3 rounded-xl text-stone-900 text-sm outline-none transition-all placeholder-stone-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-stone-800 font-bold uppercase tracking-wider text-[10px]">Shipping Address</label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Complete delivery address with pincode..."
                    className="w-full bg-stone-50 border border-stone-300 focus:border-[#FF6B00] px-4 py-3 rounded-xl text-stone-900 text-sm outline-none transition-all placeholder-stone-400 resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-stone-800 font-bold uppercase tracking-wider text-[10px]">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full bg-stone-50 border border-stone-300 focus:border-[#FF6B00] px-4 py-3 rounded-xl text-stone-900 text-sm outline-none transition-all placeholder-stone-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#111111] hover:bg-[#FF6B00] text-white py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors cursor-pointer mt-4"
                >
                  Create Account
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
