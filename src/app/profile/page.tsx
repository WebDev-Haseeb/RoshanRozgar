"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mic,
  Square,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  User,
  MapPin,
  Briefcase,
  Star,
  Zap,
  Wrench,
  Snowflake,
  Hammer,
  Paintbrush,
  Car,
  Volume2,
  RefreshCw,
  Save,
  ArrowRight,
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

const SAMPLE_VOICE_INTROS = [
  {
    title: "Electrician Sample (Urdu)",
    text: "میرا نام اعجاز احمد ہے، میں جی الیون اسلام آباد کا رہنے والا ہوں۔ پچھلے بارہ سال سے بجلی اور الیکٹریشن کا کام کر رہا ہوں۔ مین ڈی بی بکس، ہاؤس وائرنگ، سولر یو پی ایس اور شارٹ سرکٹ فالٹ ٹریسنگ میں میری مہارت ہے۔ تمام کام معیاری اور ذمہ داری سے کرتا ہوں۔",
  },
  {
    title: "Plumber Sample (Urdu/English)",
    text: "Mera naam Mohammad Bilal hai, Saddar Rawalpindi mein service deta hoon. 8 saal ka plumbing experience hai. Geyser fitting, PPRC piping, sanitary fixtures aur water motor leakage ka kaam professionally karta hoon.",
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, loading: authLoading, updateUserBioProfile, refreshProfile } = useAuth();

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // AI Generation State
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [formattedProfile, setFormattedProfile] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Editable Profile fields
  const [displayName, setDisplayName] = useState("");
  const [trade, setTrade] = useState("electrician");
  const [sector, setSector] = useState(SECTORS[2]);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || "");
      setTrade(profile.trade || "electrician");
      setSector(profile.sector || SECTORS[2]);
      setPhone(profile.phone || "");
    }
  }, [profile]);

  // Clean timer
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

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
              Please sign in to view and edit your profile.
            </p>
            <div className="mt-6">
              <Link href="/login" className={buttonStyles({ variant: "dark", size: "lg", className: "w-full" })}>
                Sign in
              </Link>
            </div>
          </div>
        </Container>
        <SiteFooter />
      </div>
    );
  }

  // Start Voice Recording
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
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        // Stop audio tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.warn("Could not access microphone:", err);
      setAiError("Microphone access unavailable. You can click one of the sample voice intros below to test AI profile formatting.");
    }
  };

  // Stop Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  // Convert Blob to Base64 and send to Gemini
  const handleProcessAiVoice = async (textOverride?: string) => {
    setAiError(null);
    setIsAiProcessing(true);

    try {
      let audioBase64: string | undefined = undefined;

      if (!textOverride && audioBlob) {
        const buffer = await audioBlob.arrayBuffer();
        audioBase64 = Buffer.from(buffer).toString("base64");
      }

      const res = await fetch("/api/ai/format-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioBase64,
          mimeType: audioBlob?.type || "audio/webm",
          textInput: textOverride,
          existingName: displayName || user.displayName || "Worker",
          existingTrade: trade,
          existingSector: sector,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.profile) {
        throw new Error(data.error || "Failed to parse profile with Gemini AI");
      }

      setFormattedProfile(data.profile);
    } catch (err: any) {
      console.error("AI error:", err);
      setAiError(err.message || "Could not format profile. Please try again.");
    } finally {
      setIsAiProcessing(false);
    }
  };

  // Save the AI Formatted Profile to Supabase
  const handleSaveFormattedProfile = async () => {
    if (!formattedProfile) return;
    setIsSaving(true);
    try {
      await updateUserBioProfile({
        displayName: formattedProfile.name || displayName,
        trade: formattedProfile.trade || trade,
        sector: formattedProfile.sector || sector,
        tagline: formattedProfile.tagline,
        skills: formattedProfile.skills,
        experienceYears: formattedProfile.experienceYears,
        bioUrdu: formattedProfile.bioUrdu,
        bioEnglish: formattedProfile.bioEnglish,
        voiceNoteTranscript: formattedProfile.transcription,
      });

      setSaveSuccess(true);
      await refreshProfile();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const isWorker = profile?.role === "worker";

  return (
    <div className="min-h-screen bg-[#FBFBFD] flex flex-col justify-between">
      <SiteHeader />

      <main className="flex-1 py-10">
        <Container className="max-w-4xl space-y-8">
          {/* Header */}
          <div className="border-b border-line pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-semibold tracking-wider uppercase text-ink-tertiary">
                  Verified Identity
                </span>
                <span className="size-1 rounded-full bg-ink-tertiary" />
                <span className="text-[12px] font-medium text-accent">
                  {isWorker ? "Worker Profile (کاریگر پروفائل)" : "Customer Profile"}
                </span>
              </div>
              <h1 className="mt-1 text-[32px] font-semibold tracking-[-0.02em] text-ink">
                {profile?.displayName || user.displayName || user.email?.split("@")[0]}
              </h1>
              <p className="text-[14px] text-ink-secondary">
                {profile?.tagline || `${profile?.sector || "Islamabad & Rawalpindi"} · Member since 2026`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-[13px] font-medium text-emerald-800 border border-emerald-200">
                <ShieldCheck className="size-4 text-emerald-600" />
                <span>NADRA Verified Pro</span>
              </span>
            </div>
          </div>

          {/* AI VOICE-TO-PROFILE GENERATOR (Core Requested Feature) */}
          <div className="rounded-3xl border border-line bg-gradient-to-b from-white to-[#FAFAFC] p-7 sm:p-9 shadow-card">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent-tint text-accent">
                <Sparkles className="size-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-accent">
                    Powered by Gemini AI
                  </span>
                  <span className="text-[12px] text-ink-tertiary font-urdu">
                    صوتی تعارف سے پروفائل
                  </span>
                </div>
                <h2 className="mt-1 text-[22px] font-semibold tracking-tight text-ink">
                  Build Your Profile by Voice (بول کر پروفائل بنائیں)
                </h2>
                <p className="mt-1 text-[14px] text-ink-secondary leading-relaxed">
                  Record a 15–30 second introduction describing your trade, experience, and the work you do in Urdu, Punjabi, or English. Gemini AI will transcribe your voice and format your skills and bilingual bios automatically.
                </p>

                {/* Voice Recorder Control */}
                <div className="mt-6 rounded-2xl border border-line bg-surface/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={isRecording ? stopRecording : startRecording}
                      className={cn(
                        "relative flex size-14 items-center justify-center rounded-full transition-all shadow-sm",
                        isRecording
                          ? "bg-danger text-white ring-8 ring-danger/20 animate-pulse"
                          : "bg-ink text-white hover:bg-black"
                      )}
                    >
                      {isRecording ? <Square className="size-5" /> : <Mic className="size-6" />}
                    </button>

                    <div>
                      <div className="text-[15px] font-semibold text-ink">
                        {isRecording ? (
                          <span className="text-danger flex items-center gap-2">
                            <span>Recording in progress...</span>
                            <span className="text-[13px] font-mono">
                              00:{recordSeconds < 10 ? `0${recordSeconds}` : recordSeconds}
                            </span>
                          </span>
                        ) : audioBlob ? (
                          <span className="text-emerald-700 flex items-center gap-1.5">
                            <CheckCircle2 className="size-4" /> Audio Recorded ({recordSeconds}s)
                          </span>
                        ) : (
                          <span>Click microphone to record your voice intro</span>
                        )}
                      </div>
                      <div className="mt-1 text-[12px] text-ink-tertiary font-urdu">
                        {isRecording
                          ? "اپنا نام، کام، تجربہ اور علاقہ واضح بولیں۔"
                          : "مثلاً: میں اعجاز ہوں، 10 سال سے الیکٹریشن ہوں۔ ڈی بی بکس اور وائرنگ کرتا ہوں۔"}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {isRecording && <Waveform bars={20} active />}

                    {audioUrl && !isRecording && (
                      <audio controls src={audioUrl} className="h-9 max-w-[200px]" />
                    )}

                    <button
                      type="button"
                      onClick={() => handleProcessAiVoice()}
                      disabled={!audioBlob || isAiProcessing}
                      className={buttonStyles({
                        variant: "primary",
                        size: "md",
                        className: "shadow-sm disabled:opacity-50",
                      })}
                    >
                      {isAiProcessing ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          <span>Gemini AI is processing...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="size-4" />
                          <span>Transcribe & Format with AI</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Sample Test Voice Prompts */}
                <div className="mt-4 pt-4 border-t border-line/70">
                  <div className="text-[12px] font-medium text-ink-tertiary mb-2">
                    Or try a sample voice transcript:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SAMPLE_VOICE_INTROS.map((sample, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleProcessAiVoice(sample.text)}
                        disabled={isAiProcessing}
                        className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[12px] font-medium text-ink-secondary hover:text-ink hover:border-line-strong transition-colors"
                      >
                        <Volume2 className="size-3.5 text-accent" />
                        <span>{sample.title}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {aiError && (
                  <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-danger-tint border border-danger/20 p-3.5 text-[13px] text-danger">
                    <AlertCircle className="size-4 shrink-0 mt-0.5" />
                    <span>{aiError}</span>
                  </div>
                )}

                {/* AI FORMATTED PREVIEW RESULT */}
                {formattedProfile && (
                  <div className="mt-6 rounded-2xl border-2 border-accent/30 bg-accent-tint/15 p-6 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between border-b border-line pb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="size-4 text-accent" />
                        <span className="text-[14px] font-semibold text-ink">
                          AI Generated Profile Summary
                        </span>
                      </div>
                      <span className="text-[11px] font-medium uppercase tracking-wider text-accent bg-accent-tint px-2.5 py-0.5 rounded-full">
                        Ready to save
                      </span>
                    </div>

                    <div className="mt-4 space-y-4">
                      {/* Transcription */}
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-tertiary">
                          Spoken Voice Transcript (آواز کا متن)
                        </div>
                        <p className="mt-1 text-[13px] text-ink italic bg-white/70 rounded-xl p-3 border border-line/60">
                          &ldquo;{formattedProfile.transcription}&rdquo;
                        </p>
                      </div>

                      {/* Tagline */}
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-tertiary">
                          Professional Tagline
                        </div>
                        <div className="mt-1 text-[16px] font-semibold text-ink">
                          {formattedProfile.tagline}
                        </div>
                      </div>

                      {/* Skills */}
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-tertiary">
                          Extracted Specialized Skills (مہارتیں)
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {formattedProfile.skills?.map((skill: string, idx: number) => (
                            <span
                              key={idx}
                              className="rounded-full bg-white px-3 py-1 text-[12px] font-medium text-ink shadow-sm border border-line"
                            >
                              ✓ {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Bilingual Bios */}
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl bg-white p-4 border border-line">
                          <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-tertiary font-urdu">
                            اردو میں تعارف (Urdu Bio)
                          </div>
                          <p className="mt-2 text-[14px] text-ink leading-relaxed font-urdu">
                            {formattedProfile.bioUrdu}
                          </p>
                        </div>
                        <div className="rounded-xl bg-white p-4 border border-line">
                          <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-tertiary">
                            English Bio for Clients
                          </div>
                          <p className="mt-2 text-[13px] text-ink-secondary leading-relaxed">
                            {formattedProfile.bioEnglish}
                          </p>
                        </div>
                      </div>

                      {/* Save Button */}
                      <div className="pt-2 flex items-center justify-end gap-3">
                        {saveSuccess && (
                          <span className="flex items-center gap-1.5 text-[13px] font-medium text-emerald-700">
                            <CheckCircle2 className="size-4" /> Profile saved to Supabase!
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={handleSaveFormattedProfile}
                          disabled={isSaving}
                          className={buttonStyles({
                            variant: "dark",
                            size: "md",
                            className: "shadow-sm",
                          })}
                        >
                          {isSaving ? (
                            <>
                              <Loader2 className="size-4 animate-spin" />
                              <span>Saving to Supabase...</span>
                            </>
                          ) : (
                            <>
                              <Save className="size-4" />
                              <span>Save to Profile / پروفائل میں محفوظ کریں</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Current Saved Profile Overview */}
          <div className="rounded-3xl border border-line bg-white p-7 sm:p-9 shadow-card">
            <h3 className="text-[20px] font-semibold text-ink">Active Profile Information</h3>
            <p className="text-[13px] text-ink-secondary">
              This information is reflected on your public verified trade worker profile
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[12px] font-medium text-ink-secondary mb-1.5">
                  Display Name
                </label>
                <div className="relative rounded-xl border border-line bg-surface/30 px-3.5 py-2.5 text-[14px] text-ink">
                  {profile?.displayName || user.displayName || "Not set"}
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-ink-secondary mb-1.5">
                  Email
                </label>
                <div className="relative rounded-xl border border-line bg-surface/30 px-3.5 py-2.5 text-[14px] text-ink">
                  {user.email}
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-ink-secondary mb-1.5">
                  Trade Category
                </label>
                <div className="relative rounded-xl border border-line bg-surface/30 px-3.5 py-2.5 text-[14px] text-ink capitalize font-medium">
                  {profile?.trade || "electrician"}
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-ink-secondary mb-1.5">
                  Operating Sector
                </label>
                <div className="relative rounded-xl border border-line bg-surface/30 px-3.5 py-2.5 text-[14px] text-ink">
                  {profile?.sector || "Islamabad · G-9 / G-10 / G-11"}
                </div>
              </div>
            </div>

            {/* Display Skills */}
            {profile?.skills && profile.skills.length > 0 && (
              <div className="mt-6 border-t border-line pt-5">
                <div className="text-[12px] font-semibold uppercase tracking-wider text-ink-tertiary mb-2">
                  Verified Skills
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-surface px-3 py-1 text-[13px] font-medium text-ink border border-line"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Display Bios */}
            {profile?.bioUrdu && (
              <div className="mt-6 border-t border-line pt-5">
                <div className="text-[12px] font-semibold uppercase tracking-wider text-ink-tertiary font-urdu mb-1">
                  اردو تعارف
                </div>
                <p className="text-[15px] text-ink leading-relaxed font-urdu">
                  {profile.bioUrdu}
                </p>
              </div>
            )}
          </div>
        </Container>
      </main>

      <SiteFooter />
    </div>
  );
}
