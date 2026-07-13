"use client";

import { Trash2 } from "lucide-react";
import { useTransition, useState } from "react";
import { deleteSubcategory } from "@/app/actions/subcategories";
import toast from "react-hot-toast";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";

export default function DeleteSubcategoryButton({ subcategoryId }: { subcategoryId: string }) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteSubcategory(subcategoryId);
        if (result?.error) {
          toast.error(result.error);
        } else {
          toast.success("Subcategory deleted successfully");
        }
        setIsOpen(false);
      } catch (error) {
        toast.error("Failed to delete subcategory");
        setIsOpen(false);
      }
    });
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors p-2 rounded-lg"
        title="Delete"
      >
        <Trash2 size={16} />
      </button>

      <ConfirmDeleteModal 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title="Delete Subcategory"
        description="Are you sure you want to delete this subcategory? This action cannot be undone."
        isPending={isPending}
      />
    </>
  );
}
