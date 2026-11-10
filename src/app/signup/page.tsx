"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Mic,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Zap,
  Wrench,
  Snowflake,
  Hammer,
  Paintbrush,
  Car,
  Lock,
  User,
  MapPin,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/ui/container";
import { Waveform } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

type Role = "customer" | "worker";

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

function SignupForm() {
  const searchParams = useSearchParams();
  const initialRole: Role = searchParams.get("role") === "worker" ? "worker" : "customer";

  const [role, setRole] = useState<Role>(initialRole);
  const [selectedTrade, setSelectedTrade] = useState("electrician");
  const [experience, setExperience] = useState("3-7");
  const [sector, setSector] = useState(SECTORS[2]);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceRecorded, setVoiceRecorded] = useState(false);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setVoiceRecorded(true);
    } else {
      setIsRecording(true);
      setVoiceRecorded(false);
      setTimeout(() => {
        setIsRecording(false);
        setVoiceRecorded(true);
      }, 3500);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] flex flex-col justify-between antialiased">
      {/* Header */}
      <header className="border-b border-line/60 bg-white/80 backdrop-blur-md">
        <Container className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[14px] font-medium text-ink-secondary transition-colors hover:text-ink"
          >
            <ArrowLeft className="size-4" />
            <span>Back to home</span>
          </Link>
          <Logo />
          <div className="text-[13px] text-ink-tertiary">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-link hover:underline">
              Sign in
            </Link>
          </div>
        </Container>
      </header>

      {/* Main Signup Form */}
      <main className="flex flex-1 items-center justify-center py-12 px-4 sm:px-6">
        <div className="w-full max-w-[520px]">
          <div className="rounded-3xl border border-line bg-white p-7 sm:p-10 shadow-card">
            {/* Header info */}
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-[12px] font-medium text-ink-secondary border border-line/80">
                <Sparkles className="size-3.5 text-accent" />
                Zero-Commission Platform for Skilled Trades
              </span>
              <h1 className="mt-4 text-[26px] font-semibold tracking-[-0.02em] text-ink">
                {role === "customer"
                  ? "Create your customer account"
                  : "بطور تصدیق شدہ کاریگر شامل ہوں"}
              </h1>
              <p className="mt-1 text-[14px] text-ink-secondary">
                {role === "customer"
                  ? "Access verified electricians, plumbers & technicians near you"
                  : "کوئی کمیشن نہیں، براہِ راست گاہک اور محفوظ پیشگی رقم (Escrow)"}
              </p>
            </div>

            {/* Apple Segmented Control */}
            <div className="mt-6 p-1 bg-surface rounded-full border border-line flex items-center text-[13px] font-medium">
              <button
                type="button"
                onClick={() => setRole("customer")}
                className={cn(
                  "flex-1 py-2 rounded-full transition-all text-center",
                  role === "customer"
                    ? "bg-white text-ink shadow-sm font-semibold"
                    : "text-ink-secondary hover:text-ink"
                )}
              >
                I need a worker (Customer)
              </button>
              <button
                type="button"
                onClick={() => setRole("worker")}
                className={cn(
                  "flex-1 py-2 rounded-full transition-all text-center",
                  role === "worker"
                    ? "bg-white text-ink shadow-sm font-semibold"
                    : "text-ink-secondary hover:text-ink"
                )}
              >
                I am a trade worker (کاریگر)
              </button>
            </div>

            {/* WORKER REGISTRATION VIEW */}
            {role === "worker" ? (
              <form onSubmit={(e) => e.preventDefault()} className="mt-6 space-y-5">
                {/* Voice Registration Teaser */}
                <div className="rounded-2xl bg-amber-50/70 border border-amber-200/80 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-900 font-urdu text-[16px]">
                      🎙️
                    </div>
                    <div className="flex-1">
                      <div className="text-[14px] font-semibold text-amber-950 font-urdu leading-tight">
                        آواز سے اندراج (Voice Registration)
                      </div>
                      <p className="mt-1 text-[12px] text-amber-900/80 leading-relaxed font-urdu">
                        ٹائپنگ مشکل ہے؟ صرف مائیک دبائیں اور بتائیں: آپ کا نام، کام اور علاقہ۔
                      </p>
                      <button
                        type="button"
                        onClick={toggleRecording}
                        className={cn(
                          "mt-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-medium transition-all shadow-sm",
                          isRecording
                            ? "bg-danger text-white animate-pulse"
                            : voiceRecorded
                            ? "bg-emerald-600 text-white"
                            : "bg-ink text-white hover:bg-black"
                        )}
                      >
                        <Mic className="size-3.5" />
                        {isRecording ? (
                          <span>ریکارڈنگ جاری ہے... (15 سیکنڈ بولیں)</span>
                        ) : voiceRecorded ? (
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="size-3.5" /> آواز محفوظ ہوگئی
                          </span>
                        ) : (
                          <span>بول کر تعارف کروائیں</span>
                        )}
                      </button>
                      {isRecording && (
                        <div className="mt-3 flex items-center gap-2">
                          <Waveform bars={16} active />
                          <span className="text-[11px] text-danger font-medium">Listening...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Trade Picker */}
                <div>
                  <label className="block text-[12px] font-semibold text-ink uppercase tracking-wider mb-2">
                    آپ کا ہنر اور پیشہ (Select Your Trade)
                  </label>
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                    {TRADES.map((trade) => {
                      const Icon = trade.icon;
                      const isSelected = selectedTrade === trade.id;
                      return (
                        <button
                          key={trade.id}
                          type="button"
                          onClick={() => setSelectedTrade(trade.id)}
                          className={cn(
                            "flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all",
                            isSelected
                              ? "border-accent bg-accent-tint/40 ring-1 ring-accent"
                              : "border-line bg-surface/30 hover:bg-surface/80"
                          )}
                        >
                          <Icon className={cn("size-5 mb-1", isSelected ? "text-accent" : "text-ink-secondary")} />
                          <span className="text-[13px] font-medium text-ink">{trade.name}</span>
                          <span className="text-[11px] text-ink-tertiary font-urdu">{trade.urdu}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Worker Name & Phone */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[12px] font-medium text-ink-secondary mb-1.5">
                      پورا نام (Full Name)
                    </label>
                    <div className="relative rounded-xl border border-line bg-surface/40 focus-within:bg-white focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/10 transition-all">
                      <User className="absolute left-3.5 top-3.5 size-4 text-ink-tertiary" />
                      <input
                        type="text"
                        placeholder="مثال: اعجاز احمد"
                        className="w-full bg-transparent pl-10 pr-4 py-3 text-[14px] text-ink placeholder:text-ink-tertiary outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-ink-secondary mb-1.5">
                      فون نمبر (Mobile Number)
                    </label>
                    <div className="relative flex rounded-xl border border-line bg-surface/40 focus-within:bg-white focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/10 transition-all">
                      <span className="inline-flex items-center border-r border-line px-2.5 text-[13px] font-medium text-ink-secondary">
                        +92
                      </span>
                      <input
                        type="tel"
                        placeholder="300 1234567"
                        className="w-full bg-transparent px-3 py-3 text-[14px] text-ink placeholder:text-ink-tertiary outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Sector / Operating Area */}
                <div>
                  <label className="block text-[12px] font-medium text-ink-secondary mb-1.5">
                    بنیادی علاقہ (Primary Operating Sector)
                  </label>
                  <div className="relative rounded-xl border border-line bg-surface/40 focus-within:bg-white focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/10 transition-all">
                    <MapPin className="absolute left-3.5 top-3.5 size-4 text-ink-tertiary" />
                    <select
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      className="w-full appearance-none bg-transparent pl-10 pr-8 py-3 text-[14px] text-ink outline-none"
                    >
                      {SECTORS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Experience selector */}
                <div>
                  <label className="block text-[12px] font-medium text-ink-secondary mb-1.5">
                    تجربہ (Years of Experience)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "1-3", label: "1 - 3 سال" },
                      { id: "3-7", label: "3 - 7 سال" },
                      { id: "7+", label: "7+ سال (ماہر)" },
                    ].map((exp) => (
                      <button
                        key={exp.id}
                        type="button"
                        onClick={() => setExperience(exp.id)}
                        className={cn(
                          "py-2.5 px-3 rounded-xl border text-[13px] font-medium text-center font-urdu transition-all",
                          experience === exp.id
                            ? "border-accent bg-accent-tint/30 text-link font-semibold"
                            : "border-line bg-surface/30 text-ink-secondary hover:text-ink"
                        )}
                      >
                        {exp.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* NADRA CNIC Trust note */}
                <div className="flex items-center gap-2.5 rounded-xl bg-surface p-3 text-[12px] text-ink-secondary border border-line/80">
                  <ShieldCheck className="size-4 shrink-0 text-emerald-600" />
                  <span className="font-urdu leading-relaxed">
                    رجسٹریشن کے بعد آپ کے شناختی کارڈ اور پولیس سرٹیفکیٹ کی جانچ کے بعد بلیو ویری فائیڈ بیج جاری ہوگا۔
                  </span>
                </div>

                {/* Submit Worker */}
                <button
                  type="submit"
                  className="w-full h-12 rounded-full bg-ink text-white font-medium text-[15px] hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <span className="font-urdu text-[16px]">رجسٹریشن مکمل کریں (Register as Worker)</span>
                  <ArrowRight className="size-4" />
                </button>
              </form>
            ) : (
              /* CUSTOMER REGISTRATION VIEW */
              <form onSubmit={(e) => e.preventDefault()} className="mt-6 space-y-4">
                <div>
                  <label className="block text-[12px] font-medium text-ink-secondary mb-1.5">
                    Full Name
                  </label>
                  <div className="relative rounded-xl border border-line bg-surface/40 focus-within:bg-white focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/10 transition-all">
                    <User className="absolute left-3.5 top-3.5 size-4 text-ink-tertiary" />
                    <input
                      type="text"
                      placeholder="e.g. Asad Farooq"
                      className="w-full bg-transparent pl-10 pr-4 py-3 text-[15px] text-ink placeholder:text-ink-tertiary outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-ink-secondary mb-1.5">
                    Mobile Phone Number
                  </label>
                  <div className="relative flex rounded-xl border border-line bg-surface/40 focus-within:bg-white focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/10 transition-all">
                    <span className="inline-flex items-center border-r border-line px-3 text-[14px] font-medium text-ink-secondary">
                      🇵🇰 +92
                    </span>
                    <input
                      type="tel"
                      placeholder="300 1234567"
                      className="w-full bg-transparent px-3 py-3 text-[15px] text-ink placeholder:text-ink-tertiary outline-none"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-ink-tertiary">
                    We will send a 4-digit SMS OTP to verify your phone.
                  </p>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-ink-secondary mb-1.5">
                    Your City & Sector
                  </label>
                  <div className="relative rounded-xl border border-line bg-surface/40 focus-within:bg-white focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/10 transition-all">
                    <MapPin className="absolute left-3.5 top-3.5 size-4 text-ink-tertiary" />
                    <select
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      className="w-full appearance-none bg-transparent pl-10 pr-8 py-3 text-[14px] text-ink outline-none"
                    >
                      {SECTORS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-ink-secondary mb-1.5">
                    Create Password
                  </label>
                  <div className="relative rounded-xl border border-line bg-surface/40 focus-within:bg-white focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/10 transition-all">
                    <Lock className="absolute left-3.5 top-3.5 size-4 text-ink-tertiary" />
                    <input
                      type="password"
                      placeholder="At least 8 characters"
                      className="w-full bg-transparent pl-10 pr-4 py-3 text-[15px] text-ink placeholder:text-ink-tertiary outline-none"
                    />
                  </div>
                </div>

                {/* Consent checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="mt-0.5 size-4 rounded border-line text-accent focus:ring-accent/20"
                    />
                    <span className="text-[12px] text-ink-secondary leading-snug">
                      I agree to the{" "}
                      <Link href="/terms" className="font-medium text-link hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and acknowledge the{" "}
                      <Link href="/privacy" className="font-medium text-link hover:underline">
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </label>
                </div>

                {/* Submit Customer */}
                <button
                  type="submit"
                  className="w-full h-12 rounded-full bg-ink text-white font-medium text-[15px] hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-sm mt-3"
                >
                  <span>Create Account</span>
                  <ArrowRight className="size-4" />
                </button>
              </form>
            )}

            {/* Footer switcher */}
            <div className="mt-8 border-t border-line/80 pt-5 text-center text-[13px] text-ink-secondary">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-link hover:underline inline-flex items-center gap-1"
              >
                <span>Sign in</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-line/60 bg-white/60 py-4 text-center text-[12px] text-ink-tertiary">
        <Container>
          <span>© 2026 Roshan Rozgar (روشن روزگار) · Islamabad & Rawalpindi, Pakistan</span>
        </Container>
      </footer>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FBFBFD]">
          <div className="size-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
