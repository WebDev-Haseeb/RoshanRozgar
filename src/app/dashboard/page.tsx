"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Zap,
  Wrench,
  Snowflake,
  Hammer,
  Paintbrush,
  Car,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  MapPin,
  Banknote,
  Briefcase,
  ChevronRight,
  Loader2,
  Phone,
  User,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { buttonStyles } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/primitives";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const TRADES = [
  { id: "electrician", name: "Electrician", urdu: "برقی ماہر", icon: Zap },
  { id: "plumber", name: "Plumber", urdu: "پلمبر", icon: Wrench },
  { id: "ac", name: "AC & Heating", urdu: "اے سی ٹیکنیشن", icon: Snowflake },
  { id: "carpenter", name: "Carpenter", urdu: "بڑھئی", icon: Hammer },
  { id: "painter", name: "Painter", urdu: "رنگ و روغن", icon: Paintbrush },
  { id: "mechanic", name: "Auto Mechanic", urdu: "آٹو مکینک", icon: Car },
];

const SECTORS = [
  "Islamabad · F-6 / F-7 / F-8",
  "Islamabad · F-10 / F-11",
  "Islamabad · G-9 / G-10 / G-11",
  "Islamabad · I-8 / I-9 / I-10",
  "Islamabad · DHA & Bahria Town",
  "Rawalpindi · Saddar & Cantt",
  "Rawalpindi · Satellite Town",
  "Rawalpindi · Westridge",
  "Rawalpindi · Bahria Town / Chaklala",
];

interface JobItem {
  id: string;
  customer_id: string;
  worker_id: string | null;
  trade: string;
  title: string;
  description: string;
  sector: string;
  address: string;
  budget: number;
  status: "pending" | "accepted" | "in_progress" | "completed" | "cancelled";
  created_at: string;
  customer_name?: string;
  customer_email?: string;
  worker_name?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();

  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [availableJobs, setAvailableJobs] = useState<JobItem[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [isAvailableOnline, setIsAvailableOnline] = useState(true);

  // New Job Modal state
  const [showNewJobModal, setShowNewJobModal] = useState(false);
  const [newTrade, setNewTrade] = useState("electrician");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newSector, setNewSector] = useState(SECTORS[2]);
  const [newBudget, setNewBudget] = useState("2500");
  const [posting, setPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  // Fetch jobs from Supabase
  const loadJobs = async () => {
    if (!user) return;
    try {
      setLoadingJobs(true);
      const isWorker = profile?.role === "worker";

      if (isWorker) {
        // Fetch worker's assigned jobs and also available leads in their trade
        const [assignedRes, availableRes] = await Promise.all([
          fetch(`/api/jobs?workerId=${encodeURIComponent(user.uid)}`),
          fetch(`/api/jobs?available=true&trade=${encodeURIComponent(profile?.trade || "electrician")}`),
        ]);

        if (assignedRes.ok) {
          const data = await assignedRes.json();
          setJobs(data.jobs || []);
        }
        if (availableRes.ok) {
          const availData = await availableRes.json();
          setAvailableJobs(availData.jobs || []);
        }
      } else {
        // Customer view: fetch customer's jobs
        const res = await fetch(`/api/jobs?customerId=${encodeURIComponent(user.uid)}`);
        if (res.ok) {
          const data = await res.json();
          setJobs(data.jobs || []);
        }
      }
    } catch (err) {
      console.error("Failed to load jobs:", err);
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      loadJobs();
    }
  }, [user, profile, authLoading]);

  // Handle post new job
  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTitle.trim()) return;

    try {
      setPosting(true);
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: user.uid,
          trade: newTrade,
          title: newTitle.trim(),
          description: newDescription.trim(),
          sector: newSector,
          budget: Number(newBudget) || 0,
        }),
      });

      if (res.ok) {
        setPostSuccess(true);
        setNewTitle("");
        setNewDescription("");
        setTimeout(() => {
          setPostSuccess(false);
          setShowNewJobModal(false);
          loadJobs();
        }, 1200);
      }
    } catch (err) {
      console.error("Failed to create job:", err);
    } finally {
      setPosting(false);
    }
  };

  // Worker accepts a lead
  const handleAcceptJob = async (jobId: string) => {
    if (!user) return;
    try {
      const res = await fetch("/api/jobs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          workerId: user.uid,
          status: "accepted",
        }),
      });
      if (res.ok) {
        loadJobs();
      }
    } catch (err) {
      console.error("Failed to accept job:", err);
    }
  };

  // Update job status (e.g. Mark completed)
  const handleUpdateStatus = async (jobId: string, status: "in_progress" | "completed") => {
    try {
      const res = await fetch("/api/jobs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, status }),
      });
      if (res.ok) {
        loadJobs();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FBFBFD] flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FBFBFD] flex flex-col justify-between">
        <SiteHeader />
        <Container className="py-24 text-center">
          <div className="mx-auto max-w-md rounded-3xl border border-line bg-white p-10 shadow-card">
            <ShieldCheck className="mx-auto size-12 text-accent" />
            <h1 className="mt-4 text-[24px] font-semibold text-ink">Sign in required</h1>
            <p className="mt-2 text-[14px] text-ink-secondary">
              Please sign in to view your orders, active requests, and verified dashboard.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link href="/login" className={buttonStyles({ variant: "dark", size: "lg", className: "w-full" })}>
                Sign in
              </Link>
              <Link href="/signup" className={buttonStyles({ variant: "secondary", size: "lg", className: "w-full" })}>
                Create account
              </Link>
            </div>
          </div>
        </Container>
        <SiteFooter />
      </div>
    );
  }

  const isWorker = profile?.role === "worker";

  return (
    <div className="min-h-screen bg-[#FBFBFD] flex flex-col justify-between">
      <SiteHeader />

      <main className="flex-1 py-10">
        <Container className="space-y-8">
          {/* Header Banner */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-semibold tracking-wider uppercase text-ink-tertiary">
                  Roshan Rozgar Dashboard
                </span>
                <span className="size-1 rounded-full bg-ink-tertiary" />
                <span className="text-[12px] font-medium text-accent">
                  {isWorker ? "Worker Portal (کاریگر پورٹل)" : "Customer Portal"}
                </span>
              </div>
              <h1 className="mt-1 text-[32px] font-semibold tracking-[-0.02em] text-ink">
                Welcome, {user.displayName || user.email?.split("@")[0]}
              </h1>
              <p className="text-[14px] text-ink-secondary">
                {profile?.sector || "Islamabad & Rawalpindi"} · Verified Account
              </p>
            </div>

            <div className="flex items-center gap-3">
              {isWorker ? (
                <button
                  type="button"
                  onClick={() => setIsAvailableOnline(!isAvailableOnline)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-all border",
                    isAvailableOnline
                      ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                      : "border-line bg-surface text-ink-tertiary"
                  )}
                >
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      isAvailableOnline ? "bg-emerald-500 animate-pulse" : "bg-neutral-400"
                    )}
                  />
                  <span>{isAvailableOnline ? "Online (دستیاب)" : "Offline (چھٹی)"}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowNewJobModal(true)}
                  className={buttonStyles({ variant: "dark", size: "md", className: "shadow-sm" })}
                >
                  <Plus className="size-4" />
                  <span>Book a Worker / نیا کام</span>
                </button>
              )}
            </div>
          </div>

          {/* Metric Bento Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
              <div className="flex items-center justify-between text-ink-tertiary">
                <span className="text-[12px] font-medium">{isWorker ? "Completed Jobs" : "Active Bookings"}</span>
                <Briefcase className="size-4 text-accent" />
              </div>
              <div className="mt-3 text-[28px] font-semibold tracking-tight text-ink">
                {isWorker ? profile?.jobsCompleted || 0 : jobs.filter((j) => j.status !== "completed").length}
              </div>
              <div className="mt-1 text-[12px] text-ink-tertiary">
                {isWorker ? "Verified by customer sign-off" : "Ongoing in Islamabad/Rawalpindi"}
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
              <div className="flex items-center justify-between text-ink-tertiary">
                <span className="text-[12px] font-medium">{isWorker ? "Escrow Balance" : "Escrow Protection"}</span>
                <Banknote className="size-4 text-emerald-600" />
              </div>
              <div className="mt-3 text-[28px] font-semibold tracking-tight text-ink">
                PKR {isWorker ? "0" : "Guaranteed"}
              </div>
              <div className="mt-1 text-[12px] text-emerald-700">0% Commission · 100% Safe</div>
            </div>

            <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
              <div className="flex items-center justify-between text-ink-tertiary">
                <span className="text-[12px] font-medium">Rating & Trust</span>
                <ShieldCheck className="size-4 text-accent" />
              </div>
              <div className="mt-3 text-[28px] font-semibold tracking-tight text-ink">
                {isWorker ? "5.0 ★" : "Verified Pro"}
              </div>
              <div className="mt-1 text-[12px] text-ink-tertiary">
                {isWorker ? "Top Rated Professional" : "NADRA CNIC Inspected"}
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
              <div className="flex items-center justify-between text-ink-tertiary">
                <span className="text-[12px] font-medium">Trade Specialization</span>
                <Zap className="size-4 text-amber-500" />
              </div>
              <div className="mt-3 text-[22px] font-semibold tracking-tight text-ink capitalize truncate">
                {isWorker ? profile?.trade || "Electrician" : "All Trades"}
              </div>
              <div className="mt-1 text-[12px] text-ink-tertiary font-urdu">
                {isWorker ? "تصدیق شدہ پیشہ ور" : "تمام ماہرین دستیاب"}
              </div>
            </div>
          </div>

          {/* WORKER VIEW: Available Leads Section */}
          {isWorker && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[20px] font-semibold text-ink">
                    Available Leads in Your Area (نئی جابز)
                  </h2>
                  <p className="text-[13px] text-ink-secondary">
                    Open customer requests matching your trade ({profile?.trade || "electrician"})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={loadJobs}
                  className="text-[13px] font-medium text-link hover:underline"
                >
                  Refresh Leads
                </button>
              </div>

              {availableJobs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-line bg-surface/50 p-8 text-center">
                  <p className="text-[14px] text-ink-secondary">
                    No open leads right now in your trade. New requests from customers will appear here automatically!
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {availableJobs.map((job) => (
                    <div
                      key={job.id}
                      className="rounded-2xl border border-line bg-white p-5 shadow-card flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-tint px-2.5 py-0.5 text-[11px] font-medium text-accent uppercase tracking-wider">
                            {job.trade}
                          </span>
                          <span className="text-[14px] font-semibold text-ink">
                            PKR {job.budget?.toLocaleString() || "Negotiable"}
                          </span>
                        </div>
                        <h3 className="mt-2 text-[16px] font-semibold text-ink">{job.title}</h3>
                        {job.description && (
                          <p className="mt-1 text-[13px] text-ink-secondary line-clamp-2">
                            {job.description}
                          </p>
                        )}
                        <div className="mt-3 flex items-center gap-2 text-[12px] text-ink-tertiary">
                          <MapPin className="size-3.5" />
                          <span>{job.sector || "Islamabad"}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-line flex items-center justify-between">
                        <span className="text-[11px] text-ink-tertiary">
                          Posted {new Date(job.created_at).toLocaleDateString()}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAcceptJob(job.id)}
                          className={buttonStyles({ variant: "dark", size: "sm" })}
                        >
                          Accept Job / جاب قبول کریں
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Main Bookings / Assigned Jobs Section */}
          <div className="rounded-3xl border border-line bg-white shadow-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <div>
                <h2 className="text-[18px] font-semibold text-ink">
                  {isWorker ? "My Accepted & Ongoing Work (میری جابز)" : "Your Service Requests & Bookings"}
                </h2>
                <p className="text-[13px] text-ink-secondary">
                  Live status, contact information, and escrow settlement
                </p>
              </div>
              <button
                type="button"
                onClick={loadJobs}
                className="text-[13px] font-medium text-link hover:underline"
              >
                Refresh
              </button>
            </div>

            {loadingJobs ? (
              <div className="p-12 text-center">
                <Loader2 className="mx-auto size-6 animate-spin text-ink-tertiary" />
                <p className="mt-2 text-[13px] text-ink-tertiary">Loading data from Supabase...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="p-12 text-center">
                <Briefcase className="mx-auto size-10 text-ink-tertiary" />
                <h3 className="mt-3 text-[16px] font-medium text-ink">No requests recorded yet</h3>
                <p className="mt-1 text-[13px] text-ink-secondary">
                  {isWorker
                    ? "Check the Available Leads section above to accept your first customer job."
                    : "Post your first service request to connect with verified trade workers nearby."}
                </p>
                {!isWorker && (
                  <button
                    type="button"
                    onClick={() => setShowNewJobModal(true)}
                    className={buttonStyles({ variant: "dark", size: "md", className: "mt-4" })}
                  >
                    Post a Service Request
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-line">
                {jobs.map((job) => (
                  <div key={job.id} className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[15px] font-semibold text-ink">{job.title}</span>
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide",
                            job.status === "completed"
                              ? "bg-emerald-100 text-emerald-800"
                              : job.status === "in_progress"
                              ? "bg-blue-100 text-blue-800"
                              : job.status === "accepted"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-surface text-ink-secondary"
                          )}
                        >
                          {job.status}
                        </span>
                      </div>
                      <p className="text-[13px] text-ink-secondary">
                        {job.description || "No additional description provided."}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-[12px] text-ink-tertiary pt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3.5" />
                          {job.sector || "Islamabad"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Banknote className="size-3.5" />
                          PKR {job.budget?.toLocaleString() || "0"} (Escrow protected)
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3.5" />
                          {new Date(job.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {isWorker && job.status === "accepted" && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(job.id, "in_progress")}
                          className={buttonStyles({ variant: "secondary", size: "sm" })}
                        >
                          Mark In Progress
                        </button>
                      )}
                      {isWorker && job.status === "in_progress" && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(job.id, "completed")}
                          className={buttonStyles({ variant: "dark", size: "sm" })}
                        >
                          Complete Job / مکمل کریں
                        </button>
                      )}
                      {job.status === "completed" && (
                        <span className="inline-flex items-center gap-1 text-[13px] font-medium text-emerald-600">
                          <CheckCircle2 className="size-4" />
                          <span>Finished</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Container>
      </main>

      {/* New Job Modal for Customer */}
      {showNewJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl border border-line bg-white p-7 shadow-float">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <h3 className="text-[18px] font-semibold text-ink">Post a Service Request</h3>
                <p className="text-[13px] text-ink-secondary">
                  Connect with verified electricians, plumbers & technicians
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowNewJobModal(false)}
                className="text-ink-tertiary hover:text-ink text-[20px] font-bold"
              >
                ✕
              </button>
            </div>

            {postSuccess ? (
              <div className="py-12 text-center">
                <CheckCircle2 className="mx-auto size-12 text-emerald-600 animate-bounce" />
                <h4 className="mt-3 text-[18px] font-semibold text-ink">Job Posted to Supabase!</h4>
                <p className="mt-1 text-[13px] text-ink-secondary">
                  Nearby verified workers are being notified.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateJob} className="mt-5 space-y-4">
                {/* Trade picker */}
                <div>
                  <label className="block text-[12px] font-medium text-ink-secondary mb-1.5">
                    Select Trade Category
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {TRADES.map((t) => {
                      const Icon = t.icon;
                      const isSel = newTrade === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setNewTrade(t.id)}
                          className={cn(
                            "flex flex-col items-center p-2 rounded-xl border text-center transition-all",
                            isSel
                              ? "border-accent bg-accent-tint/40 text-accent font-medium"
                              : "border-line bg-surface/30 hover:bg-surface text-ink-secondary"
                          )}
                        >
                          <Icon className="size-4 mb-1" />
                          <span className="text-[12px]">{t.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Job Title */}
                <div>
                  <label className="block text-[12px] font-medium text-ink-secondary mb-1.5">
                    Job Title / What needs fixing?
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Inverter AC installation or Main breaker tripping"
                    required
                    className="w-full rounded-xl border border-line bg-surface/30 px-3.5 py-2.5 text-[14px] text-ink outline-none focus:border-accent focus:bg-white"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[12px] font-medium text-ink-secondary mb-1.5">
                    Description / Details
                  </label>
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Describe the issue, tools needed, or preferred time..."
                    rows={3}
                    className="w-full rounded-xl border border-line bg-surface/30 px-3.5 py-2.5 text-[14px] text-ink outline-none focus:border-accent focus:bg-white"
                  />
                </div>

                {/* Sector & Budget */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-medium text-ink-secondary mb-1.5">
                      Sector
                    </label>
                    <select
                      value={newSector}
                      onChange={(e) => setNewSector(e.target.value)}
                      className="w-full rounded-xl border border-line bg-surface/30 px-3 py-2.5 text-[13px] text-ink outline-none"
                    >
                      {SECTORS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-ink-secondary mb-1.5">
                      Estimated Budget (PKR)
                    </label>
                    <input
                      type="number"
                      value={newBudget}
                      onChange={(e) => setNewBudget(e.target.value)}
                      step="500"
                      min="500"
                      className="w-full rounded-xl border border-line bg-surface/30 px-3 py-2.5 text-[13px] text-ink outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowNewJobModal(false)}
                    className={buttonStyles({ variant: "secondary", size: "md" })}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={posting}
                    className={buttonStyles({ variant: "dark", size: "md" })}
                  >
                    {posting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Posting to Supabase...</span>
                      </>
                    ) : (
                      <span>Post Service Request</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}
