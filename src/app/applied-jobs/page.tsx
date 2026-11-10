"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  MapPin,
  Banknote,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { buttonStyles } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

export default function AppliedJobsPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const loadMyJobs = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/jobs?workerId=${encodeURIComponent(user.uid)}`);
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
      loadMyJobs();
    }
  }, [user, authLoading]);

  const handleUpdateStatus = async (jobId: string, status: "in_progress" | "completed") => {
    try {
      const res = await fetch("/api/jobs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, status }),
      });
      if (res.ok) {
        loadMyJobs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredJobs = jobs.filter((j) => {
    if (filter === "all") return true;
    return j.status === filter;
  });

  return (
    <div className="min-h-screen bg-[#FBFBFD] flex flex-col justify-between">
      <SiteHeader />

      <main className="flex-1 py-10">
        <Container className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-semibold tracking-wider uppercase text-ink-tertiary">
                  Work History
                </span>
                <span className="size-1 rounded-full bg-ink-tertiary" />
                <span className="text-[12px] font-medium text-accent font-urdu">
                  میری منظور شدہ جابز
                </span>
              </div>
              <h1 className="mt-1 text-[32px] font-semibold tracking-[-0.02em] text-ink">
                My Applied & Accepted Jobs
              </h1>
              <p className="text-[14px] text-ink-secondary">
                Track your active dispatches, mark work in progress, and request escrow release
              </p>
            </div>

            <div className="flex items-center gap-2 bg-surface p-1 rounded-full border border-line text-[13px]">
              {["all", "accepted", "in_progress", "completed"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilter(tab)}
                  className={cn(
                    "px-3 py-1.5 rounded-full capitalize font-medium transition-all",
                    filter === tab ? "bg-white text-ink shadow-sm" : "text-ink-secondary hover:text-ink"
                  )}
                >
                  {tab.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-line bg-white shadow-card p-6 space-y-4 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-surface rounded-2xl" />
              ))}
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-line bg-white p-12 text-center shadow-card">
              <Briefcase className="mx-auto size-12 text-ink-tertiary" />
              <h3 className="mt-3 text-[18px] font-semibold text-ink">No jobs in this category</h3>
              <p className="mt-1 text-[14px] text-ink-secondary max-w-md mx-auto">
                Visit the Available Jobs page to accept work leads in your sector.
              </p>
              <div className="mt-5">
                <Link href="/jobs" className={buttonStyles({ variant: "dark", size: "md" })}>
                  Browse Available Leads
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-line rounded-3xl border border-line bg-white shadow-card overflow-hidden">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[16px] font-semibold text-ink">{job.title}</span>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide",
                          job.status === "completed"
                            ? "bg-emerald-100 text-emerald-800"
                            : job.status === "in_progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        )}
                      >
                        {job.status.replace("_", " ")}
                      </span>
                    </div>

                    <p className="text-[13px] text-ink-secondary">
                      {job.description || "Direct dispatch from customer"}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-[12px] text-ink-tertiary pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3.5" />
                        {job.sector || "Islamabad"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Banknote className="size-3.5" />
                        PKR {job.budget?.toLocaleString() || "0"} (Escrow)
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3.5" />
                        {new Date(job.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {job.status === "accepted" && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(job.id, "in_progress")}
                        className={buttonStyles({ variant: "secondary", size: "sm" })}
                      >
                        Mark In Progress
                      </button>
                    )}
                    {job.status === "in_progress" && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(job.id, "completed")}
                        className={buttonStyles({ variant: "dark", size: "sm" })}
                      >
                        Complete Work / کام مکمل
                      </button>
                    )}
                    {job.status === "completed" && (
                      <span className="inline-flex items-center gap-1 text-[13px] font-medium text-emerald-600">
                        <CheckCircle2 className="size-4" /> Finished & Settled
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
