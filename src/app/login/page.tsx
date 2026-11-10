"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Mic,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/ui/container";
import { Waveform } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

type Role = "customer" | "worker";
type AuthMethod = "phone" | "email";

function LoginForm() {
  const searchParams = useSearchParams();
  const initialRole: Role = searchParams.get("role") === "worker" ? "worker" : "customer";

  const [role, setRole] = useState<Role>(initialRole);
  const [method, setMethod] = useState<AuthMethod>("phone");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      {/* Top Navigation */}
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
            Need help?{" "}
            <a href="tel:051111767426" className="font-medium text-link hover:underline">
              051 111-ROSHAN
            </a>
          </div>
        </Container>
      </header>

      {/* Main Login Canvas */}
      <main className="flex flex-1 items-center justify-center py-12 px-4 sm:px-6">
        <div className="w-full max-w-[440px]">
          {/* Card Container */}
          <div className="rounded-3xl border border-line bg-white p-7 sm:p-9 shadow-card">
            {/* Header */}
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-[12px] font-medium text-ink-secondary border border-line/80">
                <ShieldCheck className="size-3.5 text-accent" />
                Verified & Secure Access
              </span>
              <h1 className="mt-4 text-[26px] font-semibold tracking-[-0.02em] text-ink">
                Sign in to Roshan Rozgar
              </h1>
              <p className="mt-1 text-[14px] text-ink-secondary">
                {role === "customer"
                  ? "Book trusted trade workers in Islamabad & Rawalpindi"
                  : "کاریگر اکاؤنٹ لاگ اِن · جابز اور روزگار کے لیے"}
              </p>
            </div>

            {/* Role Switcher Pill (Apple Segmented Control) */}
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
                Customer · کسٹمر
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
                Trade Worker · کاریگر
              </button>
            </div>

            {/* Worker Special Voice-First Banner */}
            {role === "worker" && (
              <div className="mt-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-900 font-urdu text-[16px]">
                    🎤
                  </div>
                  <div className="flex-1">
                    <div className="text-[14px] font-semibold text-amber-950 font-urdu leading-tight">
                      بول کر فوری لاگ اِن کریں
                    </div>
                    <p className="mt-1 text-[12px] text-amber-900/80 leading-relaxed font-urdu">
                      اپنا نام، موبائل نمبر یا شناختی کارڈ بولیں۔ پاس ورڈ ٹائپ کرنے کی ضرورت نہیں۔
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
                        <span>ریکارڈنگ جاری ہے... (بولیں)</span>
                      ) : voiceRecorded ? (
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="size-3.5" /> آواز موصول ہو گئی
                        </span>
                      ) : (
                        <span>مائیکروفون پر کلک کریں</span>
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
            )}

            {/* Auth Method Selector for Customer */}
            {role === "customer" && (
              <div className="mt-5 flex items-center justify-center gap-6 border-b border-line pb-3 text-[13px]">
                <button
                  type="button"
                  onClick={() => setMethod("phone")}
                  className={cn(
                    "relative pb-2 font-medium transition-colors",
                    method === "phone" ? "text-ink font-semibold" : "text-ink-secondary hover:text-ink"
                  )}
                >
                  Phone & SMS Code
                  {method === "phone" && (
                    <span className="absolute inset-x-0 -bottom-[13px] h-[2px] bg-accent rounded-full" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setMethod("email")}
                  className={cn(
                    "relative pb-2 font-medium transition-colors",
                    method === "email" ? "text-ink font-semibold" : "text-ink-secondary hover:text-ink"
                  )}
                >
                  Email & Password
                  {method === "email" && (
                    <span className="absolute inset-x-0 -bottom-[13px] h-[2px] bg-accent rounded-full" />
                  )}
                </button>
              </div>
            )}

            {/* Form Fields */}
            <form onSubmit={(e) => e.preventDefault()} className="mt-5 space-y-4">
              {method === "phone" || role === "worker" ? (
                <div>
                  <label className="block text-[12px] font-medium text-ink-secondary mb-1.5">
                    {role === "worker" ? "موبائل فون نمبر (Mobile Number)" : "Mobile Phone Number"}
                  </label>
                  <div className="relative flex rounded-xl border border-line bg-surface/40 focus-within:bg-white focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/10 transition-all">
                    <span className="inline-flex items-center border-r border-line px-3 text-[14px] font-medium text-ink-secondary">
                      🇵🇰 +92
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="300 1234567"
                      className="w-full bg-transparent px-3 py-3 text-[15px] text-ink placeholder:text-ink-tertiary outline-none"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-ink-tertiary">
                    We&apos;ll send a one-time 4-digit verification code via SMS or WhatsApp.
                  </p>
                </div>
              ) : (
                <>
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
                        className="w-full bg-transparent pl-10 pr-4 py-3 text-[15px] text-ink placeholder:text-ink-tertiary outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[12px] font-medium text-ink-secondary">Password</label>
                      <button
                        type="button"
                        className="text-[12px] font-medium text-link hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative rounded-xl border border-line bg-surface/40 focus-within:bg-white focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/10 transition-all">
                      <Lock className="absolute left-3.5 top-3.5 size-4 text-ink-tertiary" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full bg-transparent pl-10 pr-10 py-3 text-[15px] text-ink placeholder:text-ink-tertiary outline-none"
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
                </>
              )}

              {/* Remember me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="size-4 rounded border-line text-accent focus:ring-accent/20"
                  />
                  <span className="text-[13px] text-ink-secondary">Keep me signed in</span>
                </label>
                {role === "worker" && (
                  <span className="text-[12px] text-ink-tertiary font-urdu">
                    کوڈ موصول نہیں ہوا؟ مدد لیں
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full h-12 rounded-full bg-ink text-white font-medium text-[15px] hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-sm mt-3"
              >
                <span>
                  {role === "worker"
                    ? "4 ہندسوں کا کوڈ حاصل کریں (Get OTP)"
                    : method === "phone"
                    ? "Send Verification Code"
                    : "Sign in"}
                </span>
                <ArrowRight className="size-4" />
              </button>
            </form>

            {/* Apple Divider */}
            {role === "customer" && (
              <>
                <div className="relative my-6 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-line" />
                  </div>
                  <span className="relative bg-white px-3 text-[12px] font-medium text-ink-tertiary">
                    or continue with
                  </span>
                </div>

                {/* Social Login Options */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="flex h-11 items-center justify-center gap-2 rounded-xl border border-line bg-surface/30 hover:bg-surface text-[13px] font-medium text-ink transition-colors"
                  >
                    <svg className="size-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.8c.63-.78 1.06-1.85.94-2.93-.91.04-2.02.61-2.67 1.39-.58.68-1.09 1.77-.95 2.83 1.02.08 2.05-.51 2.68-1.29z" />
                    </svg>
                    <span>Apple ID</span>
                  </button>

                  <button
                    type="button"
                    className="flex h-11 items-center justify-center gap-2 rounded-xl border border-line bg-surface/30 hover:bg-surface text-[13px] font-medium text-ink transition-colors"
                  >
                    <svg className="size-4" viewBox="0 0 24 24">
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
                    <span>Google</span>
                  </button>
                </div>
              </>
            )}

            {/* Footer Navigation */}
            <div className="mt-8 border-t border-line/80 pt-5 text-center text-[13px] text-ink-secondary">
              Don&apos;t have an account yet?{" "}
              <Link
                href={role === "worker" ? "/signup?role=worker" : "/signup"}
                className="font-semibold text-link hover:underline inline-flex items-center gap-1"
              >
                <span>{role === "worker" ? "کاریگر رجسٹریشن" : "Create an account"}</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>

          {/* Legal disclaimer */}
          <p className="mt-6 text-center text-[12px] text-ink-tertiary leading-relaxed">
            By signing in, you agree to Roshan Rozgar&apos;s{" "}
            <Link href="/terms" className="underline hover:text-ink">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-ink">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </main>

      {/* Subtle Bottom Bar */}
      <footer className="border-t border-line/60 bg-white/60 py-4 text-center text-[12px] text-ink-tertiary">
        <Container>
          <span>© 2026 Roshan Rozgar (روشن روزگار) · Islamabad & Rawalpindi, Pakistan</span>
        </Container>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FBFBFD]">
          <div className="size-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
