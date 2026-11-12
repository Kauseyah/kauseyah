"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Mail, 
  Download, 
  Upload, 
  Send, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  Sparkles, 
  ShieldCheck,
  RefreshCw,
  FileSpreadsheet
} from "lucide-react";
import { 
  getNewsletterSubscribers, 
  exportSubscribersCSV, 
  importSubscribersFromCSV, 
  sendNewsletterCampaign,
  createNewsletterCampaign,
  sendNewsletterCampaignBatch
} from "@/app/actions/newsletter-actions";
import toast from "react-hot-toast";

export default function NewsletterClient() {
  const [activeTab, setActiveTab] = useState<"subscribers" | "campaign" | "import">("subscribers");
  const [loading, setLoading] = useState(true);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [stats, setStats] = useState({ active: 0, unsubscribed: 0, total: 0 });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [migrationNeeded, setMigrationNeeded] = useState(false);

  // Campaign state
  const [campaignTitle, setCampaignTitle] = useState("");
  const [campaignSubject, setCampaignSubject] = useState("");
  const [campaignPreview, setCampaignPreview] = useState("");
  const [campaignHtml, setCampaignHtml] = useState("");
  const [isSendingCampaign, setIsSendingCampaign] = useState(false);
  const [campaignProgress, setCampaignProgress] = useState<{ sent: number; total: number; percent: number } | null>(null);

  // Import state
  const [csvText, setCsvText] = useState("");
  const [importPreview, setImportPreview] = useState<any | null>(null);
  const [isProcessingImport, setIsProcessingImport] = useState(false);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const res = await getNewsletterSubscribers({ search, status: statusFilter });
      if (res.error) {
        toast.error(res.error);
      } else {
        setSubscribers(res.subscribers || []);
        if (res.stats) setStats(res.stats);
        if (res.migrationNeeded) setMigrationNeeded(true);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSubscribers();
  };

  const handleExportCSV = async () => {
    try {
      toast.loading("Generating CSV export...", { id: "export-csv" });
      const res = await exportSubscribersCSV();
      if (res.error || !res.csv) {
        toast.error(res.error || "Failed to export", { id: "export-csv" });
        return;
      }

      const blob = new Blob([res.csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `kauseyah-subscribers-${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Subscribers CSV downloaded", { id: "export-csv" });
    } catch (err: any) {
      toast.error(err.message || "Export error", { id: "export-csv" });
    }
  };

  const handlePreviewImport = async () => {
    if (!csvText.trim()) {
      toast.error("Please paste CSV contents or upload a file first.");
      return;
    }

    setIsProcessingImport(true);
    try {
      const res = await importSubscribersFromCSV(csvText, false);
      if (res.error) {
        toast.error(res.error);
      } else {
        setImportPreview(res);
        toast.success(`Parsed ${res.validCount} valid contacts`);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to preview import");
    } finally {
      setIsProcessingImport(false);
    }
  };

  const handleCommitImport = async () => {
    setIsProcessingImport(true);
    try {
      const res = await importSubscribersFromCSV(csvText, true);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(`Successfully imported ${res.importedCount} new subscribers!`);
        setCsvText("");
        setImportPreview(null);
        setActiveTab("subscribers");
        fetchSubscribers();
      }
    } catch (err: any) {
      toast.error(err.message || "Import execution error");
    } finally {
      setIsProcessingImport(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvText(text);
      setImportPreview(null);
    };
    reader.readAsText(file);
  };

  const handleSendCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignSubject || !campaignHtml) {
      toast.error("Please provide both subject and content.");
      return;
    }

    if (!confirm(`Are you sure you want to send this campaign to ${stats.active} active subscribers? Duplicate sends will be automatically prevented.`)) {
      return;
    }

    setIsSendingCampaign(true);
    setCampaignProgress({ sent: 0, total: stats.active, percent: 0 });

    try {
      toast.loading("Initializing campaign...", { id: "send-campaign" });
      const initRes = await createNewsletterCampaign({
        title: campaignTitle || campaignSubject,
        subject: campaignSubject,
        previewText: campaignPreview || undefined,
        contentHtml: campaignHtml,
      });

      if (initRes.error || !initRes.campaignId) {
        toast.error(initRes.error || "Failed to initialize campaign", { id: "send-campaign" });
        setIsSendingCampaign(false);
        setCampaignProgress(null);
        return;
      }

      const campaignId = initRes.campaignId;
      let isDone = false;
      let lastBatch: any = null;

      while (!isDone) {
        const batchRes = await sendNewsletterCampaignBatch(campaignId, 15);
        if (batchRes.error) {
          toast.error(batchRes.error, { id: "send-campaign" });
          setIsSendingCampaign(false);
          return;
        }

        lastBatch = batchRes;
        isDone = Boolean(batchRes.done);

        const totalSent = batchRes.totalSent || 0;
        const total = batchRes.totalRecipients || stats.active || 1;
        const pct = Math.min(100, Math.round((totalSent / total) * 100));

        setCampaignProgress({ sent: totalSent, total, percent: pct });
        toast.loading(`Broadcasting: ${totalSent} / ${total} delivered (${pct}%)...`, { id: "send-campaign" });
      }

      toast.success(
        `Campaign completed! Delivered: ${lastBatch?.totalSent || 0}, Failed: ${lastBatch?.totalFailed || 0}`,
        { id: "send-campaign" }
      );
      setCampaignTitle("");
      setCampaignSubject("");
      setCampaignPreview("");
      setCampaignHtml("");
      setCampaignProgress(null);
      setActiveTab("subscribers");
      fetchSubscribers();
    } catch (err: any) {
      toast.error(err.message || "Campaign sending error", { id: "send-campaign" });
      setCampaignProgress(null);
    } finally {
      setIsSendingCampaign(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Mail className="text-[#FF6B00]" size={28} />
            The Kauseyah Craft Journal
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Newsletter subscribers, email marketing campaigns, and customer database management.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setActiveTab("import")}
            className="flex items-center gap-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
          >
            <Upload size={14} />
            <span>Import Contacts</span>
          </button>
        </div>
      </div>

      {/* Migration Notice if table not yet run */}
      {migrationNeeded && (
        <div className="p-4 bg-amber-950/40 border border-amber-500/30 rounded-xl text-amber-200 text-sm flex items-start gap-3">
          <AlertTriangle size={20} className="text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-white">Database Migration Ready in Supabase SQL Editor</p>
            <p className="text-xs text-amber-200/80">
              The table <code>newsletter_subscribers</code> has not yet been executed in your Supabase project. 
              The SQL migration file is ready at <code>supabase/migrations/20261104_newsletter_gift_notifications.sql</code>. 
              Copy and execute it in your Supabase dashboard to enable live queries.
            </p>
          </div>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Subscribers</span>
            <Users size={18} className="text-blue-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{stats.total}</p>
          <p className="text-[11px] text-slate-500 mt-1">Across all sources</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active (Opted In)</span>
            <CheckCircle2 size={18} className="text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{stats.active}</p>
          <p className="text-[11px] text-emerald-400 mt-1">Eligible for campaign sends</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Unsubscribed</span>
            <AlertTriangle size={18} className="text-rose-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{stats.unsubscribed}</p>
          <p className="text-[11px] text-rose-400 mt-1">Suppressed immediately</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab("subscribers")}
          className={`pb-3 transition-colors relative ${
            activeTab === "subscribers" ? "text-white" : "text-slate-500 hover:text-slate-300"
          }`}
        >
          Subscribers Directory
          {activeTab === "subscribers" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B00]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("campaign")}
          className={`pb-3 transition-colors relative flex items-center gap-1.5 ${
            activeTab === "campaign" ? "text-white" : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <Sparkles size={14} className="text-[#FF6B00]" />
          <span>Compose Campaign</span>
          {activeTab === "campaign" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B00]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("import")}
          className={`pb-3 transition-colors relative flex items-center gap-1.5 ${
            activeTab === "import" ? "text-white" : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <FileSpreadsheet size={14} />
          <span>Customer CSV Import</span>
          {activeTab === "import" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B00]" />
          )}
        </button>
      </div>

      {/* TAB 1: SUBSCRIBERS DIRECTORY */}
      {activeTab === "subscribers" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-sm p-6 space-y-6">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-72">
                <Search size={15} className="absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by email or name..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-[#FF6B00]"
                />
              </div>
              <button
                type="submit"
                className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-xl text-xs font-semibold"
              >
                Search
              </button>
            </form>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#FF6B00]"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="unsubscribed">Unsubscribed</option>
              </select>

              <button
                onClick={fetchSubscribers}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
                title="Refresh"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="py-16 text-center text-slate-500">
              <Loader2 size={24} className="animate-spin mx-auto mb-2 text-[#FF6B00]" />
              <p className="text-xs">Loading subscribers...</p>
            </div>
          ) : subscribers.length === 0 ? (
            <div className="py-16 text-center text-slate-500 space-y-2">
              <Users size={32} className="mx-auto text-slate-700" />
              <p className="text-sm font-medium text-slate-400">No subscribers found</p>
              <p className="text-xs text-slate-600">Subscribers who sign up via the Craft Journal form will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Consent Status</th>
                    <th className="py-3 px-4">Source</th>
                    <th className="py-3 px-4">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {subscribers.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{s.email}</div>
                        {s.first_name && <div className="text-[11px] text-slate-400">{s.first_name}</div>}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            s.status === "active"
                              ? "bg-emerald-950/50 text-emerald-400 border border-emerald-500/30"
                              : "bg-rose-950/50 text-rose-400 border border-rose-500/30"
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {s.consent_given ? (
                          <span className="flex items-center gap-1.5 text-emerald-400">
                            <ShieldCheck size={14} />
                            <span>Opted In</span>
                          </span>
                        ) : (
                          <span className="text-slate-500">Unconfirmed</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] font-mono">
                          {s.source || "web_form"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {s.created_at ? new Date(s.created_at).toLocaleDateString("en-IN") : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: COMPOSE CAMPAIGN */}
      {activeTab === "campaign" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Send size={18} className="text-[#FF6B00]" />
              Broadcast Campaign
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Deliver an edition of The Kauseyah Craft Journal to all <strong>{stats.active}</strong> active, opted-in patrons.
              Each message includes automated <code>List-Unsubscribe</code> headers and immediate suppression links.
            </p>
          </div>

          <form onSubmit={handleSendCampaign} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Internal Campaign Title
                </label>
                <input
                  type="text"
                  required
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  placeholder="e.g. Volume 12 — The Loom Lore of Chhattisgarh"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-[#FF6B00]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Email Subject Line <span className="text-[#FF6B00]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={campaignSubject}
                  onChange={(e) => setCampaignSubject(e.target.value)}
                  placeholder="e.g. Stories Woven by Hands: Meet Master Weaver Balaram"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-[#FF6B00]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Preview Text <span className="text-slate-600 font-normal">(Snippet displayed in inbox preview)</span>
              </label>
              <input
                type="text"
                value={campaignPreview}
                onChange={(e) => setCampaignPreview(e.target.value)}
                placeholder="A rare look into natural dyes and generational handloom artistry."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-[#FF6B00]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Journal Content <span className="text-slate-600 font-normal">(HTML Supported)</span>
              </label>
              <textarea
                required
                rows={10}
                value={campaignHtml}
                onChange={(e) => setCampaignHtml(e.target.value)}
                placeholder="<p>Dear Patrons,</p><p>We are delighted to bring you stories from...</p>"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white placeholder-slate-600 outline-none focus:border-[#FF6B00] font-mono leading-relaxed"
              />
            </div>

            {campaignProgress && (
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex justify-between text-xs text-slate-300 font-medium">
                  <span>Broadcasting progress:</span>
                  <span className="text-[#FF6B00] font-bold">
                    {campaignProgress.sent} / {campaignProgress.total} ({campaignProgress.percent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#FF6B00] h-full transition-all duration-300"
                    style={{ width: `${campaignProgress.percent}%` }}
                  />
                </div>
              </div>
            )}

            <div className="pt-4 flex justify-between items-center border-t border-slate-800">
              <p className="text-xs text-slate-500">
                Safe batching (15/chunk) &bull; Duplicate-send protection enabled
              </p>
              <button
                type="submit"
                disabled={isSendingCampaign || stats.active === 0}
                className="bg-[#FF6B00] hover:bg-[#e05e00] text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isSendingCampaign ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Broadcasting Batch...</span>
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    <span>Send to {stats.active} Subscribers</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: CUSTOMER CSV IMPORT */}
      {activeTab === "import" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileSpreadsheet size={18} className="text-[#FF6B00]" />
              Customer Database CSV Import
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Import existing customer records into The Kauseyah Craft Journal subscribers. 
              Only contacts with explicit marketing consent will be imported. Duplicates will be automatically deduplicated.
            </p>
          </div>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-800 hover:border-[#FF6B00]/50 rounded-2xl p-6 text-center transition-colors">
              <Upload size={32} className="mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-semibold text-white">Choose a CSV file or paste contents below</p>
              <p className="text-xs text-slate-500 mt-1">Columns detected: <code>email</code>, <code>name</code> (optional), <code>consent</code> (optional, e.g. yes/true)</p>
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileUpload}
                className="mt-4 text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:uppercase file:bg-slate-800 file:text-white hover:file:bg-[#FF6B00] file:transition-colors cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Raw CSV Data
              </label>
              <textarea
                rows={6}
                value={csvText}
                onChange={(e) => {
                  setCsvText(e.target.value);
                  setImportPreview(null);
                }}
                placeholder="email,name,consent&#10;aditi@example.com,Aditi Sharma,yes&#10;rohit@example.com,Rohit Verma,true"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-white placeholder-slate-700 outline-none focus:border-[#FF6B00] font-mono leading-relaxed"
              />
            </div>

            {/* Preview Box */}
            {importPreview && (
              <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#FF6B00] flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  Import Validation Summary
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px] uppercase">Total Rows</span>
                    <strong className="text-white text-base">{importPreview.totalRows}</strong>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="text-emerald-400 block text-[10px] uppercase">Ready to Import</span>
                    <strong className="text-emerald-400 text-base">{importPreview.readyToImportCount}</strong>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="text-amber-400 block text-[10px] uppercase">Existing Duplicates</span>
                    <strong className="text-amber-400 text-base">{importPreview.existingDuplicates}</strong>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="text-rose-400 block text-[10px] uppercase">Missing Consent</span>
                    <strong className="text-rose-400 text-base">{importPreview.missingConsentCount}</strong>
                  </div>
                </div>

                {importPreview.sample?.length > 0 && (
                  <div className="text-xs text-slate-400 pt-2">
                    <span className="font-semibold text-slate-300">Sample eligible contacts:</span>{" "}
                    {importPreview.sample.map((s: any) => s.email).join(", ")}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              {!importPreview ? (
                <button
                  type="button"
                  onClick={handlePreviewImport}
                  disabled={isProcessingImport || !csvText.trim()}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isProcessingImport && <Loader2 size={14} className="animate-spin" />}
                  <span>Validate & Preview CSV</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCommitImport}
                  disabled={isProcessingImport || importPreview.readyToImportCount === 0}
                  className="bg-[#FF6B00] hover:bg-[#e05e00] text-white px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isProcessingImport && <Loader2 size={14} className="animate-spin" />}
                  <span>Confirm & Import ({importPreview.readyToImportCount}) Subscribers</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

