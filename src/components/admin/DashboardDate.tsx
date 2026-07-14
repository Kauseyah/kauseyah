"use client";

import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";

export default function DashboardDate() {
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    setDateStr(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
  }, []);

  return (
    <div className="inline-flex w-fit items-center gap-2.5 px-4 py-2.5 bg-gradient-to-b from-slate-900 to-slate-950/50 rounded-xl border border-slate-800 shadow-sm ring-1 ring-white/5">
      <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 shadow-sm text-slate-400">
        <Calendar size={14} className="text-orange-500" />
      </div>
      <span className="text-sm font-semibold text-slate-300 tracking-wide min-w-[100px] text-center">
        {dateStr}
      </span>
    </div>
  );
}
