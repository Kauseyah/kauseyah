"use client";

import { useState } from "react";
import { Loader2, Store, Phone, Mail, Link as LinkIcon, Share2, Camera, Video, Briefcase, Save } from "lucide-react";
import { updateSettings } from "@/app/actions/setting-actions";

export default function SettingsForm({ initialSettings }: { initialSettings: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    
    const formData = new FormData(event.currentTarget);
    const result = await updateSettings(formData);
    
    if (result?.error) {
      setMessage({ type: 'error', text: result.error });
    } else {
      setMessage({ type: 'success', text: "Settings saved successfully!" });
      setTimeout(() => setMessage(null), 3000);
    }
    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-500">
      <input type="hidden" name="id" value={initialSettings?.id || ""} />

      {message && (
        <div className={`p-4 rounded-lg text-sm font-medium border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* General Settings */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm p-6 space-y-5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Store size={20} className="text-slate-400" />
            General Information
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Store Name</label>
            <input 
              type="text" name="store_name" required defaultValue={initialSettings?.store_name}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Contact Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="email" name="contact_email" defaultValue={initialSettings?.contact_email}
                className="w-full pl-10 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" name="phone" defaultValue={initialSettings?.phone}
                className="w-full pl-10 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Base Shipping Charge (₹)</label>
            <input 
              type="number" step="0.01" name="shipping_base_charge" defaultValue={initialSettings?.shipping_base_charge}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm text-white"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm p-6 space-y-5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <LinkIcon size={20} className="text-slate-400" />
            Social Media Links
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Facebook</label>
            <div className="relative">
              <Share2 className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" size={16} />
              <input 
                type="url" name="facebook" placeholder="https://facebook.com/..." defaultValue={initialSettings?.facebook}
                className="w-full pl-10 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm text-white placeholder-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Instagram</label>
            <div className="relative">
              <Camera className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-500" size={16} />
              <input 
                type="url" name="instagram" placeholder="https://instagram.com/..." defaultValue={initialSettings?.instagram}
                className="w-full pl-10 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm text-white placeholder-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">YouTube</label>
            <div className="relative">
              <Video className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500" size={16} />
              <input 
                type="url" name="youtube" placeholder="https://youtube.com/..." defaultValue={initialSettings?.youtube}
                className="w-full pl-10 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm text-white placeholder-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">LinkedIn</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" size={16} />
              <input 
                type="url" name="linkedin" placeholder="https://linkedin.com/..." defaultValue={initialSettings?.linkedin}
                className="w-full pl-10 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm text-white placeholder-slate-600"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-2.5 bg-orange-600 text-white text-sm font-bold rounded-lg hover:bg-orange-500 transition-colors disabled:opacity-50 shadow-sm"
        >
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {isSubmitting ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}
