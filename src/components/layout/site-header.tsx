"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  Briefcase,
  CheckSquare,
  MessageSquare,
  User as UserIcon,
  LogOut,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/ui/container";
import { buttonStyles } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const PUBLIC_NAV_LINKS = [
  { href: "/#services", label: "Services" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#trust", label: "Trust" },
  { href: "/#workers", label: "For workers" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user, profile, logOut, loading } = useAuth();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isWorker = profile?.role === "worker";

  const authNavLinks = isWorker
    ? [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/jobs", label: "Jobs", icon: Briefcase },
        { href: "/applied-jobs", label: "Applied Jobs", icon: CheckSquare },
        { href: "/messages", label: "Messages", icon: MessageSquare },
        { href: "/profile", label: "Profile", icon: UserIcon },
      ]
    : [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/jobs", label: "My Bookings", icon: Briefcase },
        { href: "/messages", label: "Messages", icon: MessageSquare },
        { href: "/profile", label: "Profile", icon: UserIcon },
      ];

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-white/80 backdrop-blur-xl backdrop-saturate-150">
      <Container className="flex h-14 items-center justify-between">
        <Logo />

        {/* Desktop Nav */}
        <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
          {!loading && user
            ? authNavLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "inline-flex items-center gap-1.5 text-[14px] font-medium transition-colors",
                      isActive
                        ? "text-ink font-semibold"
                        : "text-ink-secondary hover:text-ink"
                    )}
                  >
                    <Icon className={cn("size-4", isActive ? "text-accent" : "text-ink-tertiary")} />
                    <span>{link.label}</span>
                  </Link>
                );
              })
            : PUBLIC_NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[14px] font-medium text-ink-secondary transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              ))}
        </nav>

        {/* Right side Auth Controls */}
        <div className="hidden items-center gap-3 md:flex">
          {!loading && user ? (
            <div className="flex items-center gap-2.5">
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3 py-1 text-[13px] font-medium text-ink hover:bg-surface transition-colors"
              >
                <span className="flex size-6 items-center justify-center rounded-full bg-accent/15 text-accent text-[11px] font-semibold">
                  {user.displayName
                    ? user.displayName.charAt(0).toUpperCase()
                    : user.email?.charAt(0).toUpperCase() || "U"}
                </span>
                <span className="max-w-[110px] truncate">
                  {user.displayName || user.email?.split("@")[0]}
                </span>
                {isWorker && (
                  <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-900 font-urdu">
                    کاریگر
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={() => logOut()}
                title="Sign out"
                className="inline-flex size-8 items-center justify-center rounded-full text-ink-secondary hover:text-danger hover:bg-surface transition-colors"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[14px] font-medium text-ink transition-colors hover:text-ink-secondary"
              >
                Sign in
              </Link>
              <Link href="/signup" className={buttonStyles({ variant: "dark", size: "sm" })}>
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="-mr-2 inline-flex size-10 items-center justify-center rounded-full text-ink md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </Container>

      {/* Mobile Drawer */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-x-0 top-14 bottom-0 bg-white md:hidden",
          open ? "visible opacity-100" : "invisible opacity-0",
          "transition-opacity duration-200",
        )}
      >
        <Container className="flex h-full flex-col pb-10 pt-4">
          <nav aria-label="Mobile" className="flex flex-col">
            {!loading && user
              ? authNavLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="border-b border-line py-4 text-[20px] font-semibold tracking-[-0.02em] text-ink flex items-center gap-3"
                    >
                      <Icon className="size-5 text-accent" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })
              : PUBLIC_NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="border-b border-line py-4 text-[22px] font-semibold tracking-[-0.02em] text-ink"
                  >
                    {link.label}
                  </Link>
                ))}
          </nav>
          <div className="mt-auto grid gap-3">
            {!loading && user ? (
              <div className="grid gap-2">
                <div className="rounded-2xl border border-line bg-surface p-4 text-[14px] text-ink">
                  <div className="font-semibold">{user.displayName || user.email}</div>
                  <div className="text-[12px] text-ink-secondary">{user.email}</div>
                  <div className="text-[11px] text-accent mt-1 capitalize font-medium">
                    {profile?.trade || profile?.role || "Verified User"}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logOut();
                    setOpen(false);
                  }}
                  className={buttonStyles({ variant: "secondary", size: "lg", className: "w-full text-danger" })}
                >
                  Sign out
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className={buttonStyles({ variant: "dark", size: "lg", className: "w-full" })}
                >
                  Get started
                </Link>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className={buttonStyles({ variant: "secondary", size: "lg", className: "w-full" })}
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </Container>
      </div>
    </header>
  );
}
