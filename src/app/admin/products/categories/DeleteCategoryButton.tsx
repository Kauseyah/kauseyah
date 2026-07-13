"use client";

import { Trash2 } from "lucide-react";
import { useTransition, useState } from "react";
import { deleteCategory } from "@/app/actions/categories";
import toast from "react-hot-toast";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";

export default function DeleteCategoryButton({ categoryId }: { categoryId: string }) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteCategory(categoryId);
        if (result?.error) {
          toast.error(result.error);
        } else {
          toast.success("Category deleted successfully");
        }
        setIsOpen(false);
      } catch (error) {
        toast.error("Failed to delete category");
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
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        isPending={isPending}
      />
    </>
  );
}
