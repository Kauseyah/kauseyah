"use client";

import { MapPin, Plus, Loader2, Edit2, Trash2, Check } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

type Address = {
  id: string;
  type: string;
  full_name: string;
  phone_number: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string;
  postal_code: string;
  is_default: boolean;
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    type: "Home",
    full_name: "",
    phone_number: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    postal_code: "",
    is_default: false
  });

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/addresses");
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
      }
    } catch (error) {
      console.error("Failed to fetch addresses", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const resetForm = () => {
    setFormData({
      type: "Home",
      full_name: "",
      phone_number: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      state: "",
      postal_code: "",
      is_default: false
    });
    setEditingId(null);
  };

  const openModal = (address?: Address) => {
    if (address) {
      setEditingId(address.id);
      setFormData({
        type: address.type,
        full_name: address.full_name,
        phone_number: address.phone_number,
        address_line_1: address.address_line_1,
        address_line_2: address.address_line_2 || "",
        city: address.city,
        state: address.state,
        postal_code: address.postal_code,
        is_default: address.is_default
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingId ? `/api/addresses/${editingId}` : "/api/addresses";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success(editingId ? "Address updated" : "Address added");
        setIsModalOpen(false);
        fetchAddresses();
      } else {
        const data = await res.json();
        toast.error(data.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to save address");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    
    try {
      const res = await fetch(`/api/addresses/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Address deleted");
        fetchAddresses();
      } else {
        toast.error("Failed to delete");
      }
    } catch (error) {
      toast.error("Error deleting address");
    }
  };

  const handleSetDefault = async (address: Address) => {
    if (address.is_default) return;
    try {
      const res = await fetch(`/api/addresses/${address.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...address, is_default: true })
      });
      if (res.ok) {
        toast.success("Default address updated");
        fetchAddresses();
      }
    } catch (error) {
      toast.error("Failed to set default");
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-8">
        <div>
          <h1 className="text-2xl font-display text-[#111111] mb-1">Manage Addresses</h1>
          <p className="text-[13px] text-gray-500 font-body">Save and edit your delivery locations.</p>
        </div>
        <button 
          onClick={() => openModal()} 
          className="group relative flex items-center gap-2 bg-gradient-to-r from-[#FF6B00] to-[#FF8C00] text-white px-5 py-2.5 rounded-full text-[13px] font-semibold hover:shadow-[0_8px_20px_rgba(255,107,0,0.25)] hover:-translate-y-0.5 transition-all duration-300"
        >
          <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" />
          Add Address
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#FF6B00] animate-spin" />
        </div>
      ) : addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
          <div className="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center mb-2">
            <MapPin className="w-8 h-8 text-gray-300" strokeWidth={1.5} />
          </div>
          <h2 className="text-[18px] font-display text-[#111111]">No addresses saved</h2>
          <p className="text-[14px] text-gray-500 font-body max-w-[280px]">
            You haven't saved any delivery locations yet. Add one now to make checkout seamless.
          </p>
          <button 
            onClick={() => openModal()}
            className="mt-6 bg-white border border-gray-200 text-[#111111] px-8 py-3 rounded-full text-[13px] font-semibold hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors shadow-sm inline-block"
          >
            Add New Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div key={address.id} className="group relative bg-white border border-gray-100 rounded-[1.25rem] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              {/* Decorative background element */}
              <div className="absolute -right-12 -top-12 w-32 h-32 bg-gradient-to-br from-[#FF6B00]/5 to-transparent rounded-full blur-2xl group-hover:bg-[#FF6B00]/10 transition-colors duration-500" />
              
              {address.is_default && (
                <span className="absolute top-5 right-5 bg-gradient-to-r from-[#111111] to-[#333333] text-white text-[10px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Check className="w-3 h-3" strokeWidth={3} /> Default
                </span>
              )}
              
              <div className="mb-4 relative z-10">
                <span className="inline-block bg-[#FFF8F3] text-[#FF6B00] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 border border-[#FF6B00]/10">
                  {address.type}
                </span>
                <h3 className="text-lg font-display text-[#111111]">{address.full_name}</h3>
                <p className="text-[13px] font-body text-gray-500 mt-1">{address.phone_number}</p>
              </div>
              
              <div className="text-[14px] font-body text-gray-600 leading-relaxed space-y-0.5 mb-6 relative z-10 min-h-[70px]">
                <p>{address.address_line_1}</p>
                {address.address_line_2 && <p>{address.address_line_2}</p>}
                <p>{address.city}, {address.state} {address.postal_code}</p>
              </div>
              
              <div className="flex items-center gap-4 pt-5 border-t border-gray-50 relative z-10">
                <button onClick={() => openModal(address)} className="text-[13px] font-semibold text-gray-600 hover:text-[#FF6B00] transition-colors flex items-center gap-1.5">
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => handleDelete(address.id)} className="text-[13px] font-semibold text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1.5">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
                {!address.is_default && (
                  <button onClick={() => handleSetDefault(address)} className="text-[12px] font-semibold text-gray-400 hover:text-[#111111] ml-auto uppercase tracking-wide transition-colors">
                    Set as default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-[#0D0400]/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto relative z-10 animate-in zoom-in-95 duration-300">
            <div className="p-6 md:p-8 border-b border-gray-50 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur z-20">
              <h2 className="text-2xl font-display text-[#111111]">{editingId ? "Edit Address" : "Add New Address"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-[#111111] transition-colors">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5 font-body">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="col-span-1 sm:col-span-2 bg-gray-50 p-4 rounded-xl">
                  <label className="block text-[12px] font-bold uppercase tracking-wider text-gray-500 mb-3">Address Type</label>
                  <div className="flex flex-wrap gap-3">
                    {["Home", "Work", "Other"].map(type => (
                      <label key={type} className={`flex-1 flex items-center justify-center py-2.5 rounded-lg border text-[13px] font-semibold cursor-pointer transition-all duration-200 ${formData.type === type ? "bg-white border-[#FF6B00] text-[#FF6B00] shadow-sm" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}>
                        <input type="radio" name="type" value={type} checked={formData.type === type} onChange={e => setFormData({...formData, type: e.target.value})} className="sr-only" /> 
                        {type}
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-gray-700 ml-1">Full Name</label>
                  <input required type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-[#111111] focus:ring-4 focus:ring-[#FF6B00]/10 focus:border-[#FF6B00] outline-none transition-all shadow-sm placeholder:text-gray-400" placeholder="e.g. Jane Doe" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-gray-700 ml-1">Phone Number</label>
                  <input required type="tel" value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-[#111111] focus:ring-4 focus:ring-[#FF6B00]/10 focus:border-[#FF6B00] outline-none transition-all shadow-sm placeholder:text-gray-400" placeholder="+1 (555) 000-0000" />
                </div>
                
                <div className="col-span-1 sm:col-span-2 space-y-1.5">
                  <label className="text-[13px] font-semibold text-gray-700 ml-1">Address Line 1</label>
                  <input required type="text" value={formData.address_line_1} onChange={e => setFormData({...formData, address_line_1: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-[#111111] focus:ring-4 focus:ring-[#FF6B00]/10 focus:border-[#FF6B00] outline-none transition-all shadow-sm placeholder:text-gray-400" placeholder="Street address, P.O. box, company name, c/o" />
                </div>
                
                <div className="col-span-1 sm:col-span-2 space-y-1.5">
                  <label className="text-[13px] font-semibold text-gray-700 ml-1">Address Line 2 <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="text" value={formData.address_line_2} onChange={e => setFormData({...formData, address_line_2: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-[#111111] focus:ring-4 focus:ring-[#FF6B00]/10 focus:border-[#FF6B00] outline-none transition-all shadow-sm placeholder:text-gray-400" placeholder="Apartment, suite, unit, building, floor, etc." />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-gray-700 ml-1">City</label>
                  <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-[#111111] focus:ring-4 focus:ring-[#FF6B00]/10 focus:border-[#FF6B00] outline-none transition-all shadow-sm placeholder:text-gray-400" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-gray-700 ml-1">State / Province</label>
                  <input required type="text" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-[#111111] focus:ring-4 focus:ring-[#FF6B00]/10 focus:border-[#FF6B00] outline-none transition-all shadow-sm placeholder:text-gray-400" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-gray-700 ml-1">Postal Code</label>
                  <input required type="text" value={formData.postal_code} onChange={e => setFormData({...formData, postal_code: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-[#111111] focus:ring-4 focus:ring-[#FF6B00]/10 focus:border-[#FF6B00] outline-none transition-all shadow-sm placeholder:text-gray-400" />
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-50 mt-6">
                <label className="flex items-center gap-3 cursor-pointer group w-fit">
                  <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors border ${formData.is_default ? 'bg-[#FF6B00] border-[#FF6B00]' : 'bg-white border-gray-300 group-hover:border-[#FF6B00]'}`}>
                    <input type="checkbox" checked={formData.is_default} onChange={e => setFormData({...formData, is_default: e.target.checked})} className="sr-only" />
                    {formData.is_default && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                  </div>
                  <span className="text-[14px] font-medium text-gray-700 group-hover:text-[#111111] transition-colors">Set as my default delivery address</span>
                </label>
              </div>

              <div className="pt-6 flex gap-3 justify-end sticky bottom-0 bg-white py-4 mt-6 border-t border-gray-50">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-full text-[14px] font-semibold text-gray-600 hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="group relative flex items-center gap-2 bg-gradient-to-r from-[#111111] to-[#333333] text-white px-8 py-3 rounded-full text-[14px] font-semibold hover:shadow-[0_8px_20px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {editingId ? "Update Address" : "Save Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
