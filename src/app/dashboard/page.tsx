"use client";

import { useEffect, useState, useRef } from "react";
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
  Mic,
  Square,
  Sparkles,
  Volume2,
  MessageSquare,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { buttonStyles } from "@/components/ui/button";
import { Waveform } from "@/components/ui/primitives";
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

const CLIENT_VOICE_SAMPLES = [
  {
    title: "AC Cooling & Gas (Urdu)",
    text: "ہمارے انورٹر اے سی سے ٹھنڈی ہوا نہیں آ رہی اور گیس لیک ہو گئی ہے، اسلام آباد جی ٹین فور میں رہتے ہیں، آج شام تک کاریگر درکار ہے، بجٹ چار ہزار روپے ہے۔",
  },
  {
    title: "Plumber Bathroom Leakage (Urdu)",
    text: "واش روم کے سنک کے نیچے سے پانی لیک ہو رہا ہے اور مکسر ٹیپ بدلنی ہے، بحریہ ٹاؤن راولپنڈی میں ہیں، کل صبح کام کروانا ہے، بجٹ دو ہزار روپے ہے۔",
  },
  {
    title: "Electrician Main Breaker (Urdu/English)",
    text: "Main distribution board breaker trips repeatedly when inverter loads kick in. We are in F-11/2 Islamabad. Need urgent troubleshooting today, budget 3500 PKR.",
  },
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

  // Client Voice Recording State for AI Job Creation
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isAiParsing, setIsAiParsing] = useState(false);
  const [aiParsedJob, setAiParsedJob] = useState<any>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Manual/Post Job State
  const [newTrade, setNewTrade] = useState("electrician");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newSector, setNewSector] = useState(SECTORS[2]);
  const [newBudget, setNewBudget] = useState("2500");
  const [posting, setPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  // Clean recording timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const initialLoadedRef = useRef(false);

  // Fetch jobs from Supabase
  const loadJobs = async (silent = false) => {
    if (!user) return;
    try {
      if (!silent && jobs.length === 0) {
        setLoadingJobs(true);
      }
      const isWorker = profile?.role === "worker";

      if (isWorker) {
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
      const silent = initialLoadedRef.current;
      loadJobs(silent);
      initialLoadedRef.current = true;
    }
  }, [user?.uid, profile?.role, profile?.trade, authLoading]);

  // Voice recording handlers for Client
  const startRecording = async () => {
    try {
      setAiError(null);
      setAudioBlob(null);
      setAudioUrl(null);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    } catch (err: any) {
      setAiError("Microphone access unavailable. You can click one of the sample voice requests below to test AI parsing.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleParseVoiceWithAi = async (textOverride?: string) => {
    setAiError(null);
    setIsAiParsing(true);
    try {
      let audioBase64: string | undefined = undefined;
      if (!textOverride && audioBlob) {
        const buffer = await audioBlob.arrayBuffer();
        audioBase64 = Buffer.from(buffer).toString("base64");
      }

      const res = await fetch("/api/ai/parse-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioBase64,
          mimeType: audioBlob?.type || "audio/webm",
          textInput: textOverride,
          customerSector: profile?.sector || SECTORS[2],
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.parsedJob) {
        throw new Error(data.error || "Failed to parse job with AI");
      }

      setAiParsedJob(data.parsedJob);
      setNewTitle(data.parsedJob.title || "");
      setNewTrade(data.parsedJob.trade || "electrician");
      setNewDescription(data.parsedJob.description || "");
      setNewSector(data.parsedJob.sector || SECTORS[2]);
      setNewBudget(data.parsedJob.budget?.toString() || "2500");
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "Could not parse voice request.");
    } finally {
      setIsAiParsing(false);
    }
  };

  // Submit parsed or manual job to Supabase
  const handleConfirmPostJob = async () => {
    if (!user || !newTitle.trim()) return;
    setPosting(true);
    try {
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
        setTimeout(() => {
          setPostSuccess(false);
          setShowVoiceModal(false);
          setAiParsedJob(null);
          setNewTitle("");
          setNewDescription("");
          loadJobs();
        }, 1200);
      }
    } catch (err) {
      console.error("Job post error:", err);
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

  // Update status (in_progress, completed)
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
      console.error(err);
    }
  };

  // Apple-grade skeleton loading screen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FBFBFD] flex flex-col justify-between">
        <header className="border-b border-line/60 bg-white/80 h-14" />
        <Container className="py-12 space-y-8 animate-pulse max-w-5xl">
          <div className="space-y-3">
            <div className="h-4 w-32 bg-surface-sunken rounded-full" />
            <div className="h-8 w-64 bg-surface-sunken rounded-xl" />
            <div className="h-4 w-48 bg-surface-sunken rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-surface rounded-2xl border border-line" />
            ))}
          </div>
          <div className="h-64 bg-surface rounded-3xl border border-line" />
        </Container>
        <footer className="border-t border-line/60 h-12" />
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
              Please sign in to access your dashboard.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link href="/login" className={buttonStyles({ variant: "dark", size: "lg", className: "w-full cursor-pointer" })}>
                Sign in
              </Link>
              <Link href="/signup" className={buttonStyles({ variant: "secondary", size: "lg", className: "w-full cursor-pointer" })}>
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
                    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-all border cursor-pointer",
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
                  onClick={() => setShowVoiceModal(true)}
                  className={buttonStyles({
                    variant: "dark",
                    size: "md",
                    className: "shadow-sm cursor-pointer inline-flex items-center gap-2",
                  })}
                >
                  <Mic className="size-4 text-accent" />
                  <span>Speak Your Request (بول کر کام بتائیں)</span>
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
                {isWorker ? "Customer verified" : "Ongoing in Islamabad/Rawalpindi"}
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
              <div className="mt-1 text-[12px] text-emerald-700">0% Commission · Direct Settlement</div>
            </div>

            <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
              <div className="flex items-center justify-between text-ink-tertiary">
                <span className="text-[12px] font-medium">Rating & Trust</span>
                <ShieldCheck className="size-4 text-accent" />
              </div>
              <div className="mt-3 text-[28px] font-semibold tracking-tight text-ink">
                {isWorker ? "5.0 ★" : "Verified"}
              </div>
              <div className="mt-1 text-[12px] text-ink-tertiary">
                {isWorker ? "Top Rated Pro" : "NADRA Verified Trades"}
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
                {isWorker ? "تصدیق شدہ کاریگر" : "تمام ماہرین دستیاب"}
              </div>
            </div>
          </div>

          {/* CLIENT VIEW: AI Voice Request Teaser Card */}
          {!isWorker && (
            <div className="rounded-3xl border border-line bg-gradient-to-r from-accent/5 via-white to-surface p-6 sm:p-8 shadow-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="space-y-1.5 max-w-xl">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-accent-tint px-3 py-1 text-[12px] font-semibold text-accent">
                  <Sparkles className="size-3.5" />
                  Voice-First Job Creation with Gemini AI
                </div>
                <h3 className="text-[20px] font-semibold text-ink">
                  Describe what you need fixed by voice (بول کر کام درج کریں)
                </h3>
                <p className="text-[14px] text-ink-secondary leading-relaxed">
                  Simply speak your issue in Urdu or English. Gemini AI extracts the trade, problem details, sector, and fair market budget in seconds.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowVoiceModal(true)}
                className={buttonStyles({
                  variant: "dark",
                  size: "lg",
                  className: "shadow-sm cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-2",
                })}
              >
                <Mic className="size-4 text-accent" />
                <span>Record Request (مائیک دبائیں)</span>
              </button>
            </div>
          )}

          {/* WORKER VIEW: Available Leads Section */}
          {isWorker && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[20px] font-semibold text-ink">
                    Available Leads in Your Area (نئی جابز)
                  </h2>
                  <p className="text-[13px] text-ink-secondary">
                    Open client requests matching {profile?.trade || "your trade"} in Islamabad/Rawalpindi
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => loadJobs(false)}
                  className="text-[13px] font-medium text-link hover:underline cursor-pointer"
                >
                  Refresh Leads
                </button>
              </div>

              {availableJobs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-line bg-surface/50 p-8 text-center">
                  <p className="text-[14px] text-ink-secondary">
                    No open leads right now in your trade. When customers post service requests in your area, they will appear here automatically!
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {availableJobs.map((job) => (
                    <div
                      key={job.id}
                      className="rounded-2xl border border-line bg-white p-5 shadow-card flex flex-col justify-between hover:border-line-strong transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-tint px-2.5 py-0.5 text-[11px] font-medium text-accent uppercase tracking-wider">
                            {job.trade}
                          </span>
                          <span className="text-[15px] font-semibold text-ink">
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
                          className={buttonStyles({ variant: "dark", size: "sm", className: "cursor-pointer" })}
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

          {/* Main Bookings / Assigned Work Section */}
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
                onClick={() => loadJobs(false)}
                className="text-[13px] font-medium text-link hover:underline cursor-pointer"
              >
                Refresh
              </button>
            </div>

            {loadingJobs ? (
              <div className="p-10 space-y-4 animate-pulse">
                {[1, 2].map((i) => (
                  <div key={i} className="h-16 bg-surface rounded-xl" />
                ))}
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
                    onClick={() => setShowVoiceModal(true)}
                    className={buttonStyles({ variant: "dark", size: "md", className: "mt-4 cursor-pointer" })}
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

                    <div className="flex items-center gap-2">
                      <Link
                        href="/messages"
                        className={buttonStyles({ variant: "secondary", size: "sm", className: "cursor-pointer" })}
                      >
                        <MessageSquare className="size-3.5 text-accent" />
                        <span>Chat</span>
                      </Link>

                      {isWorker && job.status === "accepted" && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(job.id, "in_progress")}
                          className={buttonStyles({ variant: "secondary", size: "sm", className: "cursor-pointer" })}
                        >
                          Mark In Progress
                        </button>
                      )}
                      {isWorker && job.status === "in_progress" && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(job.id, "completed")}
                          className={buttonStyles({ variant: "dark", size: "sm", className: "cursor-pointer" })}
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

      {/* CLIENT AI VOICE REQUEST MODAL */}
      {showVoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl border border-line bg-white p-7 shadow-float my-8">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-accent-tint text-accent">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <h3 className="text-[18px] font-semibold text-ink">
                    AI Voice Service Request (بول کر کام بتائیں)
                  </h3>
                  <p className="text-[12px] text-ink-secondary">
                    Powered by Gemini AI · Zero typing required
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowVoiceModal(false)}
                className="text-ink-tertiary hover:text-ink text-[20px] font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {postSuccess ? (
              <div className="py-12 text-center">
                <CheckCircle2 className="mx-auto size-14 text-emerald-600 animate-bounce" />
                <h4 className="mt-3 text-[20px] font-semibold text-ink">Service Request Published!</h4>
                <p className="mt-1 text-[14px] text-ink-secondary">
                  Verified trade workers in your sector have been alerted.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-5">
                {/* Voice Recorder Card */}
                <div className="rounded-2xl border border-line bg-surface/50 p-5">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={isRecording ? stopRecording : startRecording}
                        className={cn(
                          "flex size-14 items-center justify-center rounded-full transition-all shadow-sm cursor-pointer",
                          isRecording
                            ? "bg-danger text-white ring-8 ring-danger/20 animate-pulse"
                            : "bg-ink text-white hover:bg-black"
                        )}
                      >
                        {isRecording ? <Square className="size-5" /> : <Mic className="size-6" />}
                      </button>

                      <div>
                        <div className="text-[14px] font-semibold text-ink">
                          {isRecording ? (
                            <span className="text-danger flex items-center gap-1.5">
                              <span>Recording...</span>
                              <span className="font-mono text-[13px]">
                                00:{recordSeconds < 10 ? `0${recordSeconds}` : recordSeconds}
                              </span>
                            </span>
                          ) : audioBlob ? (
                            <span className="text-emerald-700 flex items-center gap-1.5">
                              <CheckCircle2 className="size-4" /> Audio Recorded ({recordSeconds}s)
                            </span>
                          ) : (
                            <span>Tap mic to describe your problem</span>
                          )}
                        </div>
                        <p className="text-[12px] text-ink-tertiary font-urdu mt-0.5">
                          مثلاً: انورٹر اے سی سروس اور گیس فلنگ درکار ہے، بجٹ چار ہزار۔
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isRecording && <Waveform bars={16} active />}
                      {audioUrl && !isRecording && (
                        <audio controls src={audioUrl} className="h-8 max-w-[170px]" />
                      )}
                      <button
                        type="button"
                        onClick={() => handleParseVoiceWithAi()}
                        disabled={!audioBlob || isAiParsing}
                        className={buttonStyles({
                          variant: "primary",
                          size: "sm",
                          className: "cursor-pointer disabled:opacity-50",
                        })}
                      >
                        {isAiParsing ? (
                          <>
                            <Loader2 className="size-3.5 animate-spin" />
                            <span>Parsing...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="size-3.5" />
                            <span>Parse with AI</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Sample Voice Prompts */}
                  <div className="mt-4 pt-3 border-t border-line/70">
                    <span className="text-[11px] font-medium text-ink-tertiary block mb-2">
                      Or test with a sample voice request:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {CLIENT_VOICE_SAMPLES.map((sample, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleParseVoiceWithAi(sample.text)}
                          disabled={isAiParsing}
                          className="inline-flex items-center gap-1 rounded-full border border-line bg-white px-2.5 py-1 text-[11px] font-medium text-ink-secondary hover:text-ink cursor-pointer transition-colors"
                        >
                          <Volume2 className="size-3 text-accent" />
                          <span>{sample.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {aiError && (
                  <div className="rounded-xl bg-danger-tint p-3 text-[12px] text-danger border border-danger/20">
                    {aiError}
                  </div>
                )}

                {/* Parsed / Editable Form Fields */}
                <div className="space-y-4 pt-2">
                  {aiParsedJob && (
                    <div className="rounded-xl bg-emerald-50 border border-emerald-200/80 p-3 text-[12px] text-emerald-900 flex items-center gap-2">
                      <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                      <span>Gemini AI extracted the trade category, sector, and estimated price below.</span>
                    </div>
                  )}

                  {/* Trade Category Selector */}
                  <div>
                    <label className="block text-[12px] font-medium text-ink-secondary mb-1.5">
                      Trade Category
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
                              "flex flex-col items-center p-2 rounded-xl border text-center transition-all cursor-pointer",
                              isSel
                                ? "border-accent bg-accent-tint/30 text-accent font-medium"
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

                  <div>
                    <label className="block text-[12px] font-medium text-ink-secondary mb-1.5">
                      Job Title / Issue
                    </label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Inverter AC Gas Leakage & Cooling Repair"
                      required
                      className="w-full rounded-xl border border-line bg-surface/30 px-3.5 py-2.5 text-[14px] text-ink outline-none focus:border-accent focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-ink-secondary mb-1.5">
                      Detailed Instructions / Description
                    </label>
                    <textarea
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      rows={3}
                      placeholder="Symptoms, timing, or access instructions..."
                      className="w-full rounded-xl border border-line bg-surface/30 px-3.5 py-2.5 text-[14px] text-ink outline-none focus:border-accent focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[12px] font-medium text-ink-secondary mb-1.5">
                        Sector
                      </label>
                      <select
                        value={newSector}
                        onChange={(e) => setNewSector(e.target.value)}
                        className="w-full rounded-xl border border-line bg-surface/30 px-3 py-2.5 text-[13px] text-ink outline-none cursor-pointer"
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

                  <div className="pt-3 flex items-center justify-end gap-3 border-t border-line">
                    <button
                      type="button"
                      onClick={() => setShowVoiceModal(false)}
                      className={buttonStyles({ variant: "secondary", size: "md", className: "cursor-pointer" })}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmPostJob}
                      disabled={posting || !newTitle.trim()}
                      className={buttonStyles({
                        variant: "dark",
                        size: "md",
                        className: "cursor-pointer disabled:opacity-50",
                      })}
                    >
                      {posting ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          <span>Publishing to Workers...</span>
                        </>
                      ) : (
                        <span>Publish Request / کام پوسٹ کریں</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}
