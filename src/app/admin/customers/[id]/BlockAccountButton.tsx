"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, ShieldCheck, Loader2, X, AlertTriangle } from "lucide-react";
import { toggleCustomerStatus } from "@/app/actions/customer-actions";

export default function BlockAccountButton({ 
  customerId, 
  isActive 
}: { 
  customerId: string;
  isActive: boolean | null;
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // Treat null as active, so if it's explicitly false, they are blocked
  const isBlocked = isActive === false;

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  const handleToggle = async () => {
    setShowModal(false);
    setIsUpdating(true);
    
    try {
      const result = await toggleCustomerStatus(customerId, isActive);
      
      if (result?.error) {
        alert(result.error);
      }
    } catch (error) {
      alert("An unexpected error occurred while updating the account status.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={isUpdating}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm ${
          isBlocked
            ? "bg-emerald-900/30 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-900/50"
            : "bg-red-900/30 text-red-400 border border-red-900/50 hover:bg-red-950/50"
        } disabled:opacity-50`}
      >
        {isUpdating ? (
          <Loader2 size={16} className="animate-spin" />
        ) : isBlocked ? (
          <ShieldCheck size={16} />
        ) : (
          <ShieldAlert size={16} />
        )}
        
        {isUpdating 
          ? "Updating..." 
          : isBlocked 
            ? "Unblock Account" 
            : "Block Account"
        }
      </button>

      {/* Custom Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-start justify-between mb-5">
                <div className={`p-3 rounded-full ${isBlocked ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {isBlocked ? <ShieldCheck size={24} /> : <AlertTriangle size={24} />}
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {isBlocked ? "Unblock this account?" : "Block this account?"}
              </h3>
              
              <p className="text-gray-500 mb-6">
                {isBlocked 
                  ? "Are you sure you want to unblock this account? They will regain access to their account and be able to make purchases again."
                  : "Are you sure you want to block this account? They will immediately lose access to log in or make any purchases."}
              </p>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleToggle}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-colors shadow-sm ${
                    isBlocked 
                      ? "bg-green-600 hover:bg-green-700" 
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {isBlocked ? "Yes, Unblock" : "Yes, Block"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
