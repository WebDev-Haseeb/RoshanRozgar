"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/ui/container";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

type Role = "customer" | "worker";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole: Role = searchParams.get("role") === "worker" ? "worker" : "customer";

  const { user, signInWithGoogle, signInWithEmail, loading: authLoading } = useAuth();

  const [role, setRole] = useState<Role>(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (!authLoading && user) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setSubmitting(true);
      await signInWithEmail(email.trim(), password);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      const code = err.code || "";
      if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") {
        setError("Invalid email or password. Please check your details.");
      } else if (code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please reset your password or try again later.");
      } else {
        setError(err.message || "Failed to sign in. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      setGoogleSubmitting(true);
      await signInWithGoogle(role);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Google sign in error:", err);
      if (err.code !== "auth/popup-closed-by-user") {
        setError(err.message || "Could not sign in with Google. Please try again.");
      }
    } finally {
      setGoogleSubmitting(false);
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

            {/* Error banner */}
            {error && (
              <div className="mt-5 flex items-start gap-2.5 rounded-2xl bg-danger-tint border border-danger/20 p-3.5 text-[13px] text-danger">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            {/* Google Authentication Button */}
            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
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
                <span>Continue with Google</span>
              </button>
            </div>

            {/* Apple Divider */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-line" />
              </div>
              <span className="relative bg-white px-3 text-[12px] font-medium text-ink-tertiary">
                or sign in with email
              </span>
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
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
                    className="w-full bg-transparent pl-10 pr-4 py-3 text-[15px] text-ink placeholder:text-ink-tertiary outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[12px] font-medium text-ink-secondary">Password</label>
                </div>
                <div className="relative rounded-xl border border-line bg-surface/40 focus-within:bg-white focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/10 transition-all">
                  <Lock className="absolute left-3.5 top-3.5 size-4 text-ink-tertiary" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || googleSubmitting}
                className="w-full h-12 rounded-full bg-ink text-white font-medium text-[15px] hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-sm mt-3 disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin text-white" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>{role === "worker" ? "کاریگر لاگ اِن (Sign in)" : "Sign in"}</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </form>

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
