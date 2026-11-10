import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className={cn("size-7", className)}>
      <circle cx="16" cy="16" r="16" className="fill-sun" />
      <path d="M8 19.5h16" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M11 17a5 5 0 0 1 10 0" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2.5 rounded-full text-ink", className)}
      aria-label="Roshan Rozgar home"
    >
      <LogoMark />
      <span className="text-[17px] font-semibold tracking-[-0.02em]">Roshan Rozgar</span>
    </Link>
  );
}
