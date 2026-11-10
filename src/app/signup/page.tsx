"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldCheck,
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
  Mail,
  User,
  MapPin,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/ui/container";
import { useAuth } from "@/lib/auth-context";
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole: Role = searchParams.get("role") === "worker" ? "worker" : "customer";

  const { user, signInWithGoogle, signUpWithEmail, loading: authLoading } = useAuth();

  const [role, setRole] = useState<Role>(initialRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState("electrician");
  const [sector, setSector] = useState(SECTORS[2]);
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in, redirect to home
  useEffect(() => {
    if (!authLoading && user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setSubmitting(true);
      await signUpWithEmail(
        email.trim(),
        password,
        name.trim(),
        role,
        role === "worker" ? selectedTrade : undefined,
        sector
      );
      router.push("/");
    } catch (err: any) {
      console.error("Signup error:", err);
      const code = err.code || "";
      if (code === "auth/email-already-in-use") {
        setError("This email is already registered. Please sign in instead.");
      } else if (code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError(err.message || "Failed to create account. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError(null);
    try {
      setGoogleSubmitting(true);
      await signInWithGoogle(role);
      router.push("/");
    } catch (err: any) {
      console.error("Google signup error:", err);
      if (err.code !== "auth/popup-closed-by-user") {
        setError(err.message || "Could not sign up with Google. Please try again.");
      }
    } finally {
      setGoogleSubmitting(false);
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
        <div className="w-full max-w-[500px]">
          <div className="rounded-3xl border border-line bg-white p-7 sm:p-9 shadow-card">
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

            {/* Error banner */}
            {error && (
              <div className="mt-5 flex items-start gap-2.5 rounded-2xl bg-danger-tint border border-danger/20 p-3.5 text-[13px] text-danger">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            {/* Google Fast Sign Up */}
            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={googleSubmitting || submitting}
                className="w-full flex h-12 items-center justify-center gap-3 rounded-full border border-line bg-surface/40 hover:bg-surface text-[14px] font-medium text-ink transition-colors disabled:opacity-60"
              >
                {googleSubmitting ? (
                  <Loader2 className="size-4 animate-spin text-ink-secondary" />
                ) : (
                  <svg className="size-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.97 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                )}
                <span>Sign up with Google</span>
              </button>
            </div>

            {/* Apple Divider */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-line" />
              </div>
              <span className="relative bg-white px-3 text-[12px] font-medium text-ink-tertiary">
                or continue with email
              </span>
            </div>

            <form onSubmit={handleEmailSignup} className="space-y-4">
              {/* If worker: Trade picker */}
              {role === "worker" && (
                <div>
                  <label className="block text-[12px] font-semibold text-ink uppercase tracking-wider mb-2">
                    آپ کا ہنر اور پیشہ (Select Your Trade)
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {TRADES.map((trade) => {
                      const Icon = trade.icon;
                      const isSelected = selectedTrade === trade.id;
                      return (
                        <button
                          key={trade.id}
                          type="button"
                          onClick={() => setSelectedTrade(trade.id)}
                          className={cn(
                            "flex flex-col items-center justify-center p-2.5 rounded-2xl border text-center transition-all",
                            isSelected
                              ? "border-accent bg-accent-tint/40 ring-1 ring-accent"
                              : "border-line bg-surface/30 hover:bg-surface/80"
                          )}
                        >
                          <Icon className={cn("size-4 mb-1", isSelected ? "text-accent" : "text-ink-secondary")} />
                          <span className="text-[12px] font-medium text-ink">{trade.name}</span>
                          <span className="text-[11px] text-ink-tertiary font-urdu">{trade.urdu}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-[12px] font-medium text-ink-secondary mb-1.5">
                  {role === "worker" ? "پورا نام (Full Name)" : "Full Name"}
                </label>
                <div className="relative rounded-xl border border-line bg-surface/40 focus-within:bg-white focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/10 transition-all">
                  <User className="absolute left-3.5 top-3.5 size-4 text-ink-tertiary" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={role === "worker" ? "مثال: اعجاز احمد" : "e.g. Asad Farooq"}
                    required
                    className="w-full bg-transparent pl-10 pr-4 py-3 text-[14px] text-ink placeholder:text-ink-tertiary outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[12px] font-medium text-ink-secondary mb-1.5">
                  Email Address
                </label>
                <div className="relative rounded-xl border border-line bg-surface/40 focus-within:bg-white focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/10 transition-all">
                  <Mail className="absolute left-3.5 top-3.5 size-4 text-ink-tertiary" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    required
                    className="w-full bg-transparent pl-10 pr-4 py-3 text-[14px] text-ink placeholder:text-ink-tertiary outline-none"
                  />
                </div>
              </div>

              {/* Primary Sector */}
              <div>
                <label className="block text-[12px] font-medium text-ink-secondary mb-1.5">
                  {role === "worker" ? "علاقہ (Operating Sector)" : "Your City & Sector"}
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

              {/* Password */}
              <div>
                <label className="block text-[12px] font-medium text-ink-secondary mb-1.5">
                  Create Password
                </label>
                <div className="relative rounded-xl border border-line bg-surface/40 focus-within:bg-white focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/10 transition-all">
                  <Lock className="absolute left-3.5 top-3.5 size-4 text-ink-tertiary" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    minLength={6}
                    className="w-full bg-transparent pl-10 pr-10 py-3 text-[14px] text-ink placeholder:text-ink-tertiary outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-ink-tertiary hover:text-ink"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    required
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || googleSubmitting}
                className="w-full h-12 rounded-full bg-ink text-white font-medium text-[15px] hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-sm mt-3 disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin text-white" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {role === "worker"
                        ? "بطور کاریگر شامل ہوں (Join as Worker)"
                        : "Create Account"}
                    </span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </form>

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
