import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-6 pt-6 px-2 border-t border-slate-800">
      <div className="text-sm text-slate-400">
        Page <span className="font-medium text-white">{currentPage}</span> of{" "}
        <span className="font-medium text-white">{totalPages}</span>
      </div>
      
      <div className="flex items-center gap-2">
        {currentPage > 1 ? (
          <Link
            href={`?page=${currentPage - 1}`}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white transition-all text-sm"
          >
            <ChevronLeft size={16} />
            Previous
          </Link>
        ) : (
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/50 text-slate-600 cursor-not-allowed text-sm">
            <ChevronLeft size={16} />
            Previous
          </div>
        )}

        {currentPage < totalPages ? (
          <Link
            href={`?page=${currentPage + 1}`}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white transition-all text-sm"
          >
            Next
            <ChevronRight size={16} />
          </Link>
        ) : (
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/50 text-slate-600 cursor-not-allowed text-sm">
            Next
            <ChevronRight size={16} />
          </div>
        )}
      </div>
    </div>
  );
}

