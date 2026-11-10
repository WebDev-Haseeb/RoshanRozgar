"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  Banknote,
  Clock,
  CheckCircle2,
  Filter,
  Plus,
  Loader2,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { buttonStyles } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

export default function JobsPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrade, setSelectedTrade] = useState<string>("all");

  const loadJobs = async (silent = false) => {
    try {
      if (!silent && jobs.length === 0) {
        setLoading(true);
      }
      const isWorker = profile?.role === "worker";
      const url = isWorker
        ? `/api/jobs?available=true${selectedTrade !== "all" ? `&trade=${selectedTrade}` : ""}`
        : `/api/jobs?customerId=${encodeURIComponent(user?.uid || "")}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      loadJobs(jobs.length > 0);
    }
  }, [user?.uid, profile?.role, authLoading, selectedTrade]);

  const handleApply = async (jobId: string) => {
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
      console.error(err);
    }
  };

  const isWorker = profile?.role === "worker";

  return (
    <div className="min-h-screen bg-[#FBFBFD] flex flex-col justify-between">
      <SiteHeader />

      <main className="flex-1 py-10">
        <Container className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-semibold tracking-wider uppercase text-ink-tertiary">
                  Marketplace
                </span>
                <span className="size-1 rounded-full bg-ink-tertiary" />
                <span className="text-[12px] font-medium text-accent">
                  {isWorker ? "Available Work Leads" : "Your Bookings"}
                </span>
              </div>
              <h1 className="mt-1 text-[32px] font-semibold tracking-[-0.02em] text-ink">
                {isWorker ? "Browse Available Jobs (دستیاب کام)" : "Active Bookings & Jobs"}
              </h1>
              <p className="text-[14px] text-ink-secondary">
                {isWorker
                  ? `Showing open service requests in Islamabad & Rawalpindi matching ${profile?.trade || "your trade"}`
                  : "All service requests and trade worker dispatches placed from your account"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {!isWorker ? (
                <Link href="/dashboard" className={buttonStyles({ variant: "dark", size: "md" })}>
                  <Plus className="size-4" />
                  <span>Post a New Request</span>
                </Link>
              ) : (
                <div className="flex items-center gap-2 text-[13px] text-ink-secondary">
                  <Filter className="size-4 text-ink-tertiary" />
                  <span>Filter by trade:</span>
                  <select
                    value={selectedTrade}
                    onChange={(e) => setSelectedTrade(e.target.value)}
                    className="rounded-full border border-line bg-white px-3 py-1.5 text-[13px] text-ink outline-none"
                  >
                    <option value="all">All Trades</option>
                    <option value="electrician">Electrician</option>
                    <option value="plumber">Plumber</option>
                    <option value="ac">AC & Heating</option>
                    <option value="carpenter">Carpenter</option>
                    <option value="painter">Painter</option>
                    <option value="mechanic">Mechanic</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-52 rounded-3xl bg-surface border border-line p-6 space-y-3">
                  <div className="h-5 w-24 bg-surface-sunken rounded-full" />
                  <div className="h-6 w-3/4 bg-surface-sunken rounded-lg" />
                  <div className="h-4 w-full bg-surface-sunken rounded" />
                  <div className="h-4 w-1/2 bg-surface-sunken rounded" />
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-line bg-white p-12 text-center shadow-card">
              <Briefcase className="mx-auto size-12 text-ink-tertiary" />
              <h3 className="mt-3 text-[18px] font-semibold text-ink">No jobs listed right now</h3>
              <p className="mt-1 text-[14px] text-ink-secondary max-w-md mx-auto">
                {isWorker
                  ? "Check back shortly or refresh. New trade calls from Islamabad/Rawalpindi appear here automatically."
                  : "You haven't posted any jobs yet. Post a service request to hire verified electricians, plumbers, and technicians."}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-3xl border border-line bg-white p-6 shadow-card flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-accent-tint px-2.5 py-0.5 text-[11px] font-medium text-accent uppercase tracking-wider">
                        {job.trade}
                      </span>
                      <span className="text-[16px] font-semibold text-ink">
                        PKR {job.budget?.toLocaleString() || "Negotiable"}
                      </span>
                    </div>

                    <h3 className="mt-3 text-[17px] font-semibold text-ink">{job.title}</h3>
                    <p className="mt-1.5 text-[13px] text-ink-secondary line-clamp-3">
                      {job.description || "No specific details provided."}
                    </p>

                    <div className="mt-4 pt-3 border-t border-line/70 space-y-1.5 text-[12px] text-ink-tertiary">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="size-3.5" />
                        <span>{job.sector || "Islamabad"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="size-3.5" />
                        <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-line flex items-center justify-between">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Escrow Protected
                    </span>
                    {isWorker ? (
                      <button
                        type="button"
                        onClick={() => handleApply(job.id)}
                        className={buttonStyles({ variant: "dark", size: "sm" })}
                      >
                        Accept Lead / کام قبول کریں
                      </button>
                    ) : (
                      <span className="text-[13px] font-medium text-ink capitalize">
                        Status: {job.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </main>

      <SiteFooter />
    </div>
  );
}
