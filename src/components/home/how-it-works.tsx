import { Check, Mic } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/container";
import { Avatar, StatusPill, Waveform } from "@/components/ui/primitives";

function StepCard({
  number,
  title,
  body,
  children,
}: {
  number: string;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex flex-col rounded-[28px] bg-surface p-6 sm:p-8">
      <span className="text-[13px] font-semibold tabular-nums text-ink-tertiary">{number}</span>
      <h3 className="mt-3 text-[26px] font-semibold tracking-[-0.02em] text-ink">{title}</h3>
      <p className="mt-2 text-[16px] leading-relaxed text-ink-secondary">{body}</p>
      <div aria-hidden className="mt-8 flex flex-1 flex-col rounded-[20px] bg-white p-5 shadow-card">
        {children}
      </div>
    </li>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="pb-24 sm:pb-32">
      <Container>
        <SectionHeading
          align="center"
          title="Three steps. No forms."
          description="Built around the way people already talk about repairs at home."
        />

        <ol className="mt-14 grid gap-4 md:grid-cols-3">
          <StepCard
            number="01"
            title="Say it."
            body="Hold the mic and describe the problem in Urdu, Roman Urdu or English."
          >
            <div className="flex flex-1 flex-col items-center justify-center py-4">
              <span className="relative flex size-16 items-center justify-center rounded-full bg-accent text-white">
                <span className="absolute inset-0 -m-3 rounded-full bg-accent/10" />
                <Mic className="relative size-7" />
              </span>
              <Waveform played={0.6} className="mt-7 h-8" />
            </div>
            <p className="rounded-2xl bg-surface px-4 py-3 text-[14px] font-medium leading-snug text-ink">
              “Kitchen ka nalka leak kar raha hai, aaj shaam aa sakte ho?”
            </p>
          </StepCard>

          <StepCard
            number="02"
            title="See who is free."
            body="Workers near you with live availability, experience and reviews from past jobs."
          >
            <ul className="divide-y divide-line">
              {[
                { img: "/assets/worker-plumber.jpg", name: "Asif Mehmood", meta: "Plumber · 0.8 km · 4.8", status: "Available", tone: "success" as const },
                { img: "/assets/worker-carpenter.png", name: "Ghulam Rasool", meta: "Plumber · 2.1 km · 4.9", status: "Free at 6 PM", tone: "warning" as const },
                { img: "/assets/worker-mechanic.png", name: "Tariq Javed", meta: "Plumber · 2.6 km · 4.7", status: "Offline", tone: "neutral" as const },
              ].map((w) => (
                <li key={w.name} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <Avatar src={w.img} alt="" size={40} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold text-ink">{w.name}</p>
                    <p className="truncate text-[12px] text-ink-secondary">{w.meta}</p>
                  </div>
                  <StatusPill tone={w.tone}>{w.status}</StatusPill>
                </li>
              ))}
            </ul>
          </StepCard>

          <StepCard
            number="03"
            title="Agree and book."
            body="Talk it through, settle a fair price, then confirm. Rate the work when it is done."
          >
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-tertiary">Agreed price</p>
            <p className="mt-2 text-[36px] font-semibold tracking-[-0.03em] text-ink">Rs 3,500</p>
            <p className="text-[13px] text-ink-secondary">AC service and gas refill · Today, 5 to 7 PM</p>
            <ul className="mt-5 space-y-2.5">
              {["Customer confirmed", "Worker confirmed"].map((label) => (
                <li key={label} className="flex items-center justify-between text-[14px] font-medium text-ink">
                  {label}
                  <span className="flex size-5 items-center justify-center rounded-full bg-success text-white">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-5">
              <span className="flex h-11 items-center justify-center rounded-full bg-accent text-[15px] font-medium text-white">
                Booking confirmed
              </span>
            </div>
          </StepCard>
        </ol>
      </Container>
    </section>
  );
}
