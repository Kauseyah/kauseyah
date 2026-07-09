"use client";

import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function AccountPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });

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
          const parts = (data.full_name || "").split(" ");
          setProfile({
            firstName: parts[0] || "",
            lastName: parts.slice(1).join(" ") || "",
            email: data.email || "",
            phone: data.phone || ""
          });
        }
      })
      .catch(err => {
        console.error("Profile fetch error:", err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const full_name = `${profile.firstName} ${profile.lastName}`.trim();
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name, phone: profile.phone })
      });
      
      if (res.ok) {
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to update profile");
      }
    } catch (e: any) {
      toast.error("An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="relative h-32 bg-gradient-to-r from-orange-50 to-orange-100 border-b border-gray-100">
          <div className="absolute -bottom-10 left-8">
            <div className="w-20 h-20 bg-white rounded-full p-1.5 shadow-md">
              <div className="w-full h-full bg-[#FF6B00] rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                {profile.firstName ? profile.firstName[0].toUpperCase() : "U"}
              </div>
            </div>
          </div>
          <div className="absolute top-4 right-6">
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)} 
                className="bg-white text-[#FF6B00] text-[13px] font-semibold px-4 py-2 rounded-full shadow-sm hover:shadow transition-all flex items-center gap-1.5"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="pt-16 px-8 pb-8">
          <h1 className="text-[20px] font-semibold text-[#111111] mb-1">Personal Information</h1>
          <p className="text-[13px] text-gray-500 mb-8">Manage your personal details and contact information.</p>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#FF6B00] animate-spin" />
            </div>
          ) : (
            <div className="max-w-xl space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[13px] text-gray-700 font-medium ml-1">First Name</label>
                  <input 
                    type="text" 
                    value={profile.firstName} 
                    onChange={e => setProfile({...profile, firstName: e.target.value})}
                    className={`w-full rounded-xl px-4 py-3 text-[14px] text-[#111111] outline-none transition-all duration-200 border ${isEditing ? "bg-white border-gray-200 focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/10 shadow-sm" : "bg-gray-50/50 border-transparent text-gray-600 cursor-not-allowed"}`} 
                    disabled={!isEditing} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] text-gray-700 font-medium ml-1">Last Name</label>
                  <input 
                    type="text" 
                    value={profile.lastName} 
                    onChange={e => setProfile({...profile, lastName: e.target.value})}
                    className={`w-full rounded-xl px-4 py-3 text-[14px] text-[#111111] outline-none transition-all duration-200 border ${isEditing ? "bg-white border-gray-200 focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/10 shadow-sm" : "bg-gray-50/50 border-transparent text-gray-600 cursor-not-allowed"}`} 
                    disabled={!isEditing} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[13px] text-gray-700 font-medium ml-1">Email Address</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={profile.email} 
                    className="w-full rounded-xl px-4 py-3 text-[14px] text-gray-500 bg-gray-50/50 border-transparent cursor-not-allowed outline-none transition-all" 
                    disabled 
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                    <span className="text-[11px] font-semibold bg-gray-200 text-gray-600 px-2 py-0.5 rounded-md">Verified</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[13px] text-gray-700 font-medium ml-1">Mobile Number</label>
                <input 
                  type="tel" 
                  placeholder="+91" 
                  value={profile.phone} 
                  onChange={e => setProfile({...profile, phone: e.target.value})}
                  className={`w-full rounded-xl px-4 py-3 text-[14px] text-[#111111] outline-none transition-all duration-200 border ${isEditing ? "bg-white border-gray-200 focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/10 shadow-sm" : "bg-gray-50/50 border-transparent text-gray-600 cursor-not-allowed"}`} 
                  disabled={!isEditing} 
                />
              </div>

              {isEditing && (
                <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-[#FF6B00] text-white px-8 py-3 rounded-xl text-[14px] font-semibold hover:bg-[#e55f00] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:hover:translate-y-0 flex items-center gap-2"
                  >
                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save Changes
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                    className="px-6 py-3 rounded-xl text-[14px] font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
  );
}
