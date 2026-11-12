"use client";

import { useState } from "react";
import { 
  Loader2, 
  Store, 
  Phone, 
  Mail, 
  Link as LinkIcon, 
  Share2, 
  Camera, 
  Video, 
  Briefcase, 
  Save, 
  Gift, 
  Bell, 
  MessageSquare,
  AlertCircle
} from "lucide-react";
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
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-500 font-sans pb-12">
      <input type="hidden" name="id" value={initialSettings?.id || ""} />

      {message && (
        <div className={`p-4 rounded-xl text-sm font-medium border ${message.type === 'success' ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30' : 'bg-rose-950/40 text-rose-300 border-rose-500/30'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. General Settings */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 space-y-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Store size={18} className="text-[#FF6B00]" />
            General Information
          </h2>
          
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Store Name</label>
            <input 
              type="text" name="store_name" required defaultValue={initialSettings?.store_name || "Kauseyah"}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-[#FF6B00] text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Public Support Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="email" name="contact_email" defaultValue={initialSettings?.contact_email || "support@kauseyah.com"}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-[#FF6B00] text-sm text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Customer Care Phone</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" name="phone" defaultValue={initialSettings?.phone || ""}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-[#FF6B00] text-sm text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Base Shipping Charge (₹)</label>
            <input 
              type="number" step="1" name="shipping_base_charge" defaultValue={initialSettings?.shipping_base_charge ?? 200}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-[#FF6B00] text-sm text-white"
            />
            <p className="text-[11px] text-slate-500 mt-1">Free shipping is applied automatically for orders strictly above ₹6,000.</p>
          </div>
        </div>

        {/* 2. Admin Order Notification Settings */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 space-y-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Bell size={18} className="text-[#FF6B00]" />
            Order Notifications
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Admin Notification Recipient</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#FF6B00]" size={16} />
              <input 
                type="email" 
                name="admin_order_notification_email" 
                defaultValue={initialSettings?.admin_order_notification_email || "shwetarao17@gmail.com"}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-[#FF6B00] text-sm text-white font-medium"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Instant notification with verified payment status, gift selection, and customer delivery details is dispatched here for each order.
            </p>
          </div>

          {/* 3. WhatsApp Integration Status */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <MessageSquare size={15} className="text-emerald-500" />
              Meta WhatsApp Cloud API (Disabled by Default)
            </h3>

            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Enable WhatsApp Notifications</span>
                <input 
                  type="checkbox" 
                  name="whatsapp_enabled"
                  defaultChecked={initialSettings?.whatsapp_enabled || false}
                  className="h-4 w-4 rounded accent-[#FF6B00] cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-amber-400">
                <AlertCircle size={13} className="shrink-0" />
                <span>Status: Disabled until client supplies Meta Business credentials.</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase">Phone Number ID</label>
                <input 
                  type="text" 
                  name="whatsapp_phone_number_id"
                  defaultValue={initialSettings?.whatsapp_phone_number_id || ""}
                  placeholder="e.g. 1048291..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-700"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase">WABA Account ID</label>
                <input 
                  type="text" 
                  name="whatsapp_business_account_id"
                  defaultValue={initialSettings?.whatsapp_business_account_id || ""}
                  placeholder="e.g. 2948201..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 4. Gift Packaging Configurations */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 space-y-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Gift size={18} className="text-[#FF6B00]" />
            Gift Selection &amp; Packaging
          </h2>

          <div className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
            <div>
              <span className="text-xs font-semibold text-white block">Enable Gifting Feature</span>
              <span className="text-[11px] text-slate-400">Allows customers to add gift packaging &amp; messages on product pages.</span>
            </div>
            <input 
              type="checkbox" 
              name="gift_enabled"
              defaultChecked={initialSettings?.gift_enabled ?? true}
              className="h-4 w-4 rounded accent-[#FF6B00] cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Gift Fee (₹)</label>
              <input 
                type="number" step="1" name="gift_charge" defaultValue={initialSettings?.gift_charge ?? 100}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-[#FF6B00] text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Calculation Mode</label>
              <select
                name="gift_charge_mode"
                defaultValue={initialSettings?.gift_charge_mode || "per_item"}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-[#FF6B00] text-sm text-white"
              >
                <option value="per_item">Per Gift Item (+₹100/item)</option>
                <option value="per_order">Per Order (flat fee)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Max Gift Message Length</label>
            <input 
              type="number" name="gift_max_message_length" defaultValue={initialSettings?.gift_max_message_length ?? 250}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-[#FF6B00] text-sm text-white"
            />
            <p className="text-[11px] text-slate-500 mt-1">Characters allowed for customer's personalized note.</p>
          </div>
        </div>

        {/* 5. Social Media Links */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <LinkIcon size={18} className="text-[#FF6B00]" />
            Social Media Links
          </h2>
          
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">Facebook</label>
            <div className="relative">
              <Share2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-500" size={15} />
              <input 
                type="url" name="facebook" placeholder="https://facebook.com/..." defaultValue={initialSettings?.facebook || ""}
                className="w-full pl-10 pr-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-[#FF6B00] text-xs text-white placeholder-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">Instagram</label>
            <div className="relative">
              <Camera className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-500" size={15} />
              <input 
                type="url" name="instagram" placeholder="https://instagram.com/..." defaultValue={initialSettings?.instagram || ""}
                className="w-full pl-10 pr-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-[#FF6B00] text-xs text-white placeholder-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">YouTube</label>
            <div className="relative">
              <Video className="absolute left-3.5 top-1/2 -translate-y-1/2 text-red-500" size={15} />
              <input 
                type="url" name="youtube" placeholder="https://youtube.com/..." defaultValue={initialSettings?.youtube || ""}
                className="w-full pl-10 pr-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-[#FF6B00] text-xs text-white placeholder-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">LinkedIn</label>
            <div className="relative">
              <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400" size={15} />
              <input 
                type="url" name="linkedin" placeholder="https://linkedin.com/..." defaultValue={initialSettings?.linkedin || ""}
                className="w-full pl-10 pr-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-[#FF6B00] text-xs text-white placeholder-slate-600"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="flex items-center gap-2 px-7 py-3 bg-[#FF6B00] text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#e05e00] transition-colors disabled:opacity-50 shadow-md cursor-pointer"
        >
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {isSubmitting ? "Saving..." : "Save Store Settings"}
        </button>
      </div>
    </form>
  );
}
