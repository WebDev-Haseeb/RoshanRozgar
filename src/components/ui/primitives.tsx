import Image from "next/image";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "neutral" | "accent";

const toneStyles: Record<Tone, { pill: string; dot: string }> = {
  success: { pill: "bg-success-tint text-success-ink", dot: "bg-success" },
  warning: { pill: "bg-warning-tint text-warning-ink", dot: "bg-warning" },
  neutral: { pill: "bg-surface text-ink-secondary", dot: "bg-ink-tertiary" },
  accent: { pill: "bg-accent-tint text-link", dot: "bg-accent" },
};

export function StatusPill({
  tone = "success",
  children,
  className,
}: {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-[12px] font-medium",
        toneStyles[tone].pill,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", toneStyles[tone].dot)} />
      {children}
    </span>
  );
}

export function Tag({ children, tone = "neutral" }: { children: React.ReactNode; tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center whitespace-nowrap rounded-full px-2.5 text-[12px] font-medium",
        toneStyles[tone].pill,
      )}
    >
      {children}
    </span>
  );
}

export function Avatar({
  src,
  alt,
  size = 44,
  online = false,
  className,
}: {
  src: string;
  alt: string;
  size?: number;
  online?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("relative inline-flex shrink-0", className)} style={{ width: size, height: size }}>
      <Image
        src={src}
        alt={alt}
        width={size * 2}
        height={size * 2}
        className="size-full rounded-full bg-surface object-cover object-top"
      />
      {online && (
        <span className="absolute bottom-0 right-0 size-3 rounded-full bg-success ring-2 ring-white" />
      )}
    </span>
  );
}

export function Stars({ value = 5, size = 14, className }: { value?: number; size?: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          aria-hidden
          style={{ width: size, height: size }}
          className={i < Math.round(value) ? "fill-star text-star" : "fill-line-strong text-line-strong"}
        />
      ))}
    </span>
  );
}

const BAR_HEIGHTS = [6, 10, 16, 12, 20, 26, 18, 24, 30, 22, 14, 26, 32, 20, 12, 18, 26, 16, 10, 22, 28, 14, 8, 12, 18, 10, 6];

export function Waveform({
  played = 0,
  active = false,
  bars = BAR_HEIGHTS.length,
  className,
  activeClassName = "bg-accent",
  idleClassName = "bg-line-strong",
}: {
  played?: number;
  active?: boolean;
  bars?: number;
  className?: string;
  activeClassName?: string;
  idleClassName?: string;
}) {
  const heights = BAR_HEIGHTS.slice(0, bars);
  const effectivePlayed = active ? 1 : played;
  return (
    <span className={cn("flex items-center gap-[3px]", className)} aria-hidden>
      {heights.map((h, i) => (
        <span
          key={i}
          className={cn(
            "w-[3px] shrink-0 rounded-full transition-all",
            i / heights.length <= effectivePlayed ? activeClassName : idleClassName,
            active && "animate-pulse"
          )}
          style={{ height: h }}
        />
      ))}
    </span>
  );
}
