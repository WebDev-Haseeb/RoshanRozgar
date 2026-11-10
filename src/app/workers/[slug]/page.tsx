"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Star,
  MapPin,
  CheckCircle2,
  Briefcase,
  Volume2,
  MessageSquare,
  Plus,
  Share2,
  ArrowLeft,
  Loader2,
  Zap,
  Wrench,
  Snowflake,
  Hammer,
  Paintbrush,
  Car,
  Clock,
  Phone,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { buttonStyles } from "@/components/ui/button";
import { Waveform } from "@/components/ui/primitives";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const TRADE_ICONS: Record<string, any> = {
  electrician: Zap,
  plumber: Wrench,
  ac: Snowflake,
  carpenter: Hammer,
  painter: Paintbrush,
  mechanic: Car,
};

export default function WorkerSlugProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const unwrappedParams = use(params);
  const slug = unwrappedParams.slug;

  const router = useRouter();
  const { user } = useAuth();

  const [profile, setProfile] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  // Direct Hire Modal State
  const [showHireModal, setShowHireModal] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobBudget, setJobBudget] = useState("3000");
  const [submittingJob, setSubmittingJob] = useState(false);
  const [hireSuccess, setHireSuccess] = useState(false);

  useEffect(() => {
    async function fetchWorker() {
      try {
        setLoading(true);
        const res = await fetch(`/api/profile?slug=${encodeURIComponent(slug)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.profile && data.profile.role === "worker") {
            setProfile(data.profile);
            setReviews(data.reviews || []);
          }
        }
      } catch (err) {
        console.error("Failed to fetch worker profile:", err);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchWorker();
    }
  }, [slug]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDirectHire = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !jobTitle.trim() || !profile) return;

    setSubmittingJob(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: user.uid,
          trade: profile.trade || "electrician",
          title: jobTitle.trim(),
          description: jobDescription.trim(),
          sector: profile.sector || "Islamabad",
          budget: Number(jobBudget) || 3000,
        }),
      });

      if (res.ok) {
        const jobData = await res.json();
        // Immediately assign this worker
        if (jobData.job?.id) {
          await fetch("/api/jobs", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jobId: jobData.job.id,
              workerId: profile.uid,
              status: "accepted",
            }),
          });
        }

        setHireSuccess(true);
        setTimeout(() => {
          setHireSuccess(false);
          setShowHireModal(false);
          router.push("/dashboard");
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingJob(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFD] flex flex-col justify-between">
        <SiteHeader />
        <Container className="py-16 space-y-8 animate-pulse max-w-4xl">
          <div className="h-8 w-48 bg-surface-sunken rounded-xl" />
          <div className="h-64 bg-surface rounded-3xl border border-line" />
        </Container>
        <SiteFooter />
      </div>
    );
  }

  // If slug doesn't exist or belongs to a client
  if (!profile) {
    return (
      <div className="min-h-screen bg-[#FBFBFD] flex flex-col justify-between">
        <SiteHeader />
        <Container className="py-24 text-center">
          <div className="mx-auto max-w-md rounded-3xl border border-line bg-white p-10 shadow-card">
            <Briefcase className="mx-auto size-12 text-ink-tertiary" />
            <h1 className="mt-4 text-[22px] font-semibold text-ink">Worker Profile Not Found</h1>
            <p className="mt-2 text-[14px] text-ink-secondary leading-relaxed">
              This custom slug URL is reserved exclusively for verified trade professionals on Roshan Rozgar.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link href="/jobs" className={buttonStyles({ variant: "dark", size: "md", className: "cursor-pointer" })}>
                Browse Verified Workers
              </Link>
              <Link href="/dashboard" className={buttonStyles({ variant: "secondary", size: "md", className: "cursor-pointer" })}>
                Go to Dashboard
              </Link>
            </div>
          </div>
        </Container>
        <SiteFooter />
      </div>
    );
  }

  const TradeIcon = TRADE_ICONS[profile.trade || "electrician"] || Zap;

  return (
    <div className="min-h-screen bg-[#FBFBFD] flex flex-col justify-between">
      <SiteHeader />

      <main className="flex-1 py-10">
        <Container className="max-w-4xl space-y-8">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-between">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-secondary hover:text-ink cursor-pointer transition-colors"
            >
              <ArrowLeft className="size-4" />
              <span>Back to Marketplace</span>
            </Link>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-[12px] font-medium text-ink hover:bg-surface cursor-pointer transition-colors shadow-sm"
            >
              <Share2 className="size-3.5 text-accent" />
              <span>{copied ? "Link Copied!" : "Share Profile"}</span>
            </button>
          </div>

          {/* Hero Worker Card */}
          <div className="rounded-3xl border border-line bg-white p-7 sm:p-10 shadow-card">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div className="flex items-start gap-5">
                <div className="relative">
                  <div className="flex size-20 items-center justify-center rounded-3xl bg-accent-tint text-accent font-semibold text-[28px] shadow-sm">
                    {profile.displayName?.charAt(0) || "W"}
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm ring-2 ring-white">
                    <ShieldCheck className="size-4" />
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-[28px] font-semibold tracking-tight text-ink">
                      {profile.displayName}
                    </h1>
                  </div>

                  <p className="text-[15px] font-medium text-ink-secondary">
                    {profile.tagline || `Certified ${profile.trade} in ${profile.sector || "Islamabad"}`}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2 text-[13px] text-ink-tertiary">
                    <span className="flex items-center gap-1 text-amber-950 font-semibold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      <Star className="size-3.5 fill-amber-500 text-amber-500" />
                      <span>{profile.rating || 5.0} Rating</span>
                    </span>

                    <span className="flex items-center gap-1">
                      <Briefcase className="size-3.5 text-accent" />
                      <span>{profile.jobsCompleted || 0} Jobs Completed</span>
                    </span>

                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5 text-ink-tertiary" />
                      <span>{profile.sector || "Islamabad & Rawalpindi"}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:items-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowHireModal(true)}
                  className={buttonStyles({
                    variant: "dark",
                    size: "md",
                    className: "cursor-pointer whitespace-nowrap shadow-sm w-full sm:w-auto",
                  })}
                >
                  <Plus className="size-4" />
                  <span>Hire This Worker / کام دیں</span>
                </button>

                <Link
                  href="/messages"
                  className={buttonStyles({
                    variant: "secondary",
                    size: "md",
                    className: "cursor-pointer whitespace-nowrap w-full sm:w-auto",
                  })}
                >
                  <MessageSquare className="size-4 text-accent" />
                  <span>Message Worker</span>
                </Link>
              </div>
            </div>

            {/* Custom Slug Link Badge */}
            <div className="mt-6 pt-4 border-t border-line/80 flex items-center justify-between text-[12px] text-ink-tertiary">
              <span className="font-mono text-ink-secondary">
                roshanrozgar.pk/workers/<strong className="text-ink font-semibold">{profile.slug || slug}</strong>
              </span>
              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-medium">
                <CheckCircle2 className="size-3" /> NADRA CNIC Verified Pro
              </span>
            </div>
          </div>

          {/* Voice Intro Player */}
          {profile.voiceNoteTranscript && (
            <div className="rounded-3xl border border-line bg-surface/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsPlayingVoice(!isPlayingVoice)}
                  className="flex size-12 items-center justify-center rounded-full bg-ink text-white hover:bg-black cursor-pointer shadow-sm transition-all"
                >
                  <Volume2 className="size-5" />
                </button>

                <div>
                  <div className="text-[14px] font-semibold text-ink">
                    Spoken Voice Introduction (صوتی تعارف)
                  </div>
                  <p className="text-[12px] text-ink-secondary italic mt-0.5">
                    &ldquo;{profile.voiceNoteTranscript}&rdquo;
                  </p>
                </div>
              </div>

              <Waveform bars={20} active={isPlayingVoice} />
            </div>
          )}

          {/* Specialized Skills & Bilingual Bios */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-line bg-white p-7 shadow-card space-y-4">
              <h3 className="text-[17px] font-semibold text-ink">
                Verified Skills & Craftsmanship
              </h3>
              {profile.skills && profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="rounded-full bg-surface px-3 py-1 text-[13px] font-medium text-ink border border-line/80"
                    >
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-ink-secondary">
                  Specialized in residential and commercial {profile.trade} services.
                </p>
              )}

              {profile.bioEnglish && (
                <div className="pt-3 border-t border-line">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-tertiary mb-1">
                    English Summary
                  </div>
                  <p className="text-[13px] text-ink-secondary leading-relaxed">
                    {profile.bioEnglish}
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-line bg-white p-7 shadow-card space-y-4">
              <h3 className="text-[17px] font-semibold text-ink font-urdu text-right">
                کاریگر کی تفصیلات اور اردو تعارف
              </h3>
              <p className="text-[15px] text-ink leading-relaxed font-urdu text-right">
                {profile.bioUrdu ||
                  "ماہر اور تصدیق شدہ کاریگر۔ اسلام آباد اور راولپنڈی میں معیاری اور بااعتماد سروس کی فراہمی۔"}
              </p>

              <div className="pt-3 border-t border-line text-[12px] text-ink-secondary space-y-1">
                <div className="flex justify-between">
                  <span>Experience:</span>
                  <span className="font-semibold text-ink">{profile.experienceYears || 5} Years</span>
                </div>
                <div className="flex justify-between">
                  <span>Primary Trade:</span>
                  <span className="font-semibold text-ink capitalize">{profile.trade}</span>
                </div>
                <div className="flex justify-between">
                  <span>Escrow Guarantee:</span>
                  <span className="font-semibold text-emerald-700">100% Safe (0% Commission)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Client Reviews Section */}
          <div className="rounded-3xl border border-line bg-white p-7 sm:p-9 shadow-card space-y-5">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <h3 className="text-[18px] font-semibold text-ink">Verified Client Reviews</h3>
                <p className="text-[13px] text-ink-secondary">
                  Feedback from homeowners and property managers in Islamabad & Rawalpindi
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-[16px] font-semibold text-ink">
                <Star className="size-5 fill-amber-500 text-amber-500" />
                <span>{profile.rating || 5.0}</span>
                <span className="text-[12px] text-ink-tertiary font-normal">({reviews.length} reviews)</span>
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-line bg-surface/30 p-8 text-center text-[13px] text-ink-secondary">
                No client reviews yet. Hire this worker to leave the first review after job completion!
              </div>
            ) : (
              <div className="divide-y divide-line">
                {reviews.map((r) => (
                  <div key={r.id} className="py-4 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-semibold text-ink">{r.reviewer_name || "Verified Client"}</span>
                      <div className="flex items-center gap-1 text-[12px] text-amber-900 font-semibold">
                        <Star className="size-3.5 fill-amber-500 text-amber-500" />
                        <span>{r.rating}.0</span>
                      </div>
                    </div>
                    <p className="text-[13px] text-ink-secondary">{r.comment || "Great craftsmanship and prompt delivery."}</p>
                    <span className="text-[11px] text-ink-tertiary block">
                      {new Date(r.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Container>
      </main>

      {/* Direct Hire Modal */}
      {showHireModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-line bg-white p-7 shadow-float space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <h3 className="text-[18px] font-semibold text-ink">Hire {profile.displayName}</h3>
                <p className="text-[12px] text-ink-secondary">Direct booking with Escrow protection</p>
              </div>
              <button
                type="button"
                onClick={() => setShowHireModal(false)}
                className="text-ink-tertiary hover:text-ink text-[18px] font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {hireSuccess ? (
              <div className="py-10 text-center">
                <CheckCircle2 className="mx-auto size-12 text-emerald-600 animate-bounce" />
                <h4 className="mt-2 text-[18px] font-semibold text-ink">Booking Confirmed!</h4>
                <p className="text-[13px] text-ink-secondary mt-1">
                  Redirecting to your dashboard...
                </p>
              </div>
            ) : (
              <form onSubmit={handleDirectHire} className="space-y-4">
                <div>
                  <label className="block text-[12px] font-medium text-ink-secondary mb-1">
                    What needs to be done?
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Main breaker replacement or AC service"
                    required
                    className="w-full rounded-xl border border-line bg-surface/30 p-2.5 text-[14px] text-ink outline-none focus:border-accent focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-ink-secondary mb-1">
                    Job Details / Problem description
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={3}
                    placeholder="Address, time preference, or specific issues..."
                    className="w-full rounded-xl border border-line bg-surface/30 p-2.5 text-[14px] text-ink outline-none focus:border-accent focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-ink-secondary mb-1">
                    Offered Budget (PKR)
                  </label>
                  <input
                    type="number"
                    value={jobBudget}
                    onChange={(e) => setJobBudget(e.target.value)}
                    step="500"
                    min="500"
                    className="w-full rounded-xl border border-line bg-surface/30 p-2.5 text-[14px] text-ink outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-line">
                  <button
                    type="button"
                    onClick={() => setShowHireModal(false)}
                    className={buttonStyles({ variant: "secondary", size: "sm", className: "cursor-pointer" })}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingJob || !jobTitle.trim()}
                    className={buttonStyles({
                      variant: "dark",
                      size: "sm",
                      className: "cursor-pointer disabled:opacity-50",
                    })}
                  >
                    {submittingJob ? "Confirming..." : "Send Job to Worker"}
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
