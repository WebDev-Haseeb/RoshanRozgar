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
  Star,
  MessageSquare,
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

  // Complete Contract & Rating State
  const [ratingJob, setRatingJob] = useState<any | null>(null);
  const [ratingStars, setRatingStars] = useState(5);
  const [ratingComment, setRatingComment] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratingSuccess, setRatingSuccess] = useState(false);

  const loadMyJobs = async (silent = false) => {
    if (!user) return;
    try {
      if (!silent && jobs.length === 0) {
        setLoading(true);
      }
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
      loadMyJobs(jobs.length > 0);
    }
  }, [user?.uid, authLoading]);

  const handleUpdateStatus = async (jobId: string, status: "in_progress" | "completed") => {
    try {
      const res = await fetch("/api/jobs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, status }),
      });
      if (res.ok) {
        loadMyJobs(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitJobRating = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratingJob || !user) return;
    setSubmittingRating(true);
    try {
      const res = await fetch("/api/jobs/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: ratingJob.id,
          reviewerId: user.uid,
          rating: ratingStars,
          comment: ratingComment.trim(),
        }),
      });

      if (res.ok) {
        setRatingSuccess(true);
        setTimeout(() => {
          setRatingSuccess(false);
          setRatingJob(null);
          setRatingComment("");
          setRatingStars(5);
          loadMyJobs(true);
        }, 1200);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingRating(false);
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
                    <Link
                      href="/messages"
                      className={buttonStyles({ variant: "secondary", size: "sm", className: "cursor-pointer" })}
                    >
                      <MessageSquare className="size-3.5 text-accent" />
                      <span>Chat</span>
                    </Link>

                    {job.status === "accepted" && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(job.id, "in_progress")}
                        className={buttonStyles({ variant: "secondary", size: "sm", className: "cursor-pointer" })}
                      >
                        Mark In Progress
                      </button>
                    )}

                    {(job.status === "accepted" || job.status === "in_progress") && (
                      <button
                        type="button"
                        onClick={() => {
                          setRatingJob(job);
                          setRatingStars(5);
                          setRatingComment("");
                        }}
                        className={buttonStyles({ variant: "dark", size: "sm", className: "cursor-pointer gap-1.5" })}
                      >
                        <Star className="size-3.5 fill-amber-400 text-amber-400" />
                        <span>Close & Rate Client / مکمل کریں</span>
                      </button>
                    )}

                    {job.status === "completed" && (
                      <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/50">
                        <CheckCircle2 className="size-4 text-emerald-600" />
                        <span>Finished & Settled / کام مکمل</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </main>

      {/* CONTRACT CLOSING & RATING MODAL */}
      {ratingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl border border-line bg-white p-7 shadow-float my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Star className="size-5 fill-amber-500 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-[18px] font-semibold text-ink">
                    Close Contract & Rate Client / معاہدہ مکمل کریں
                  </h3>
                  <p className="text-[12px] text-ink-secondary">
                    Review and finalize settlement for this contract
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRatingJob(null)}
                className="text-ink-tertiary hover:text-ink text-[20px] font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {ratingSuccess ? (
              <div className="py-12 text-center">
                <CheckCircle2 className="mx-auto size-14 text-emerald-600 animate-bounce" />
                <h4 className="mt-3 text-[20px] font-semibold text-ink">Contract Closed Successfully!</h4>
                <p className="mt-1 text-[14px] text-ink-secondary">
                  Your rating and feedback have been published.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitJobRating} className="mt-5 space-y-5">
                <div className="rounded-2xl border border-line bg-surface/40 p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-tertiary">
                    Contract Title
                  </div>
                  <div className="mt-0.5 text-[15px] font-semibold text-ink">
                    {ratingJob.title}
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-[12px] text-ink-secondary">
                    <span>Sector: {ratingJob.sector || "Islamabad"}</span>
                    <span>•</span>
                    <span>Budget: PKR {ratingJob.budget?.toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-ink mb-2">
                    Rate this Client (کسٹمر کو ریٹ کریں)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingStars(star)}
                        className="p-1 rounded-lg hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={cn(
                            "size-8 transition-colors",
                            star <= ratingStars
                              ? "fill-amber-400 text-amber-400"
                              : "text-ink-tertiary/40"
                          )}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-[15px] font-semibold text-ink">
                      {ratingStars}.0 / 5.0
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-ink mb-1.5">
                    Written Feedback (تفصیلی تاثرات)
                  </label>
                  <textarea
                    value={ratingComment}
                    onChange={(e) => setRatingComment(e.target.value)}
                    rows={3}
                    placeholder="Was the client prompt, clear with requirements, and accommodating?"
                    className="w-full rounded-2xl border border-line bg-surface/30 p-3.5 text-[14px] text-ink outline-none focus:border-accent focus:bg-white resize-none"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-line">
                  <button
                    type="button"
                    onClick={() => setRatingJob(null)}
                    className={buttonStyles({ variant: "secondary", size: "md", className: "cursor-pointer" })}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingRating}
                    className={buttonStyles({
                      variant: "dark",
                      size: "md",
                      className: "cursor-pointer disabled:opacity-50",
                    })}
                  >
                    {submittingRating ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Submitting Rating...</span>
                      </>
                    ) : (
                      <span>Complete & Submit Rating</span>
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
