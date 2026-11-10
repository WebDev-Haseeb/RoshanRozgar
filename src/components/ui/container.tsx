import { cn } from "@/lib/utils";

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-[1200px] px-5 sm:px-8", className)}>{children}</div>;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "mx-auto max-w-3xl text-center", className)}>
      {eyebrow && (
        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-tertiary">{eyebrow}</p>
      )}
      <h2
        className={cn(
          "text-[34px] font-semibold leading-[1.08] tracking-[-0.025em] text-ink sm:text-5xl",
          eyebrow && "mt-3",
        )}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg leading-relaxed text-ink-secondary sm:text-xl">{description}</p>
      )}
    </div>
  );
}
