import Image from "next/image";
import { Banknote, CalendarCheck, Check, ClipboardCheck, Play } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/container";
import { Avatar, Stars, StatusPill, Waveform } from "@/components/ui/primitives";

const REVIEWS = [
  {
    name: "Ayesha K.",
    area: "F-10, Islamabad",
    job: "Switchboard replacement",
    text: "Arrived on time, explained the fault clearly and charged exactly what we agreed.",
  },
  {
    name: "Usman R.",
    area: "Bahria Town, Rawalpindi",
    job: "Geyser repair",
    text: "Polite, careful in the house and cleaned up before leaving. Booking him again.",
  },
];

const LIFECYCLE = ["Requested", "Quoted", "Confirmed", "In progress", "Completed"];

function BentoCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-[28px] bg-surface p-6 sm:p-8 ${className}`}>{children}</div>;
}

export function Trust() {
  return (
    <section id="trust" className="pb-24 sm:pb-32">
      <Container>
        <SectionHeading
          title="Trust, built in."
          description="Every completed job leaves the next customer a little better informed."
        />

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          <BentoCard className="flex flex-col">
            <p className="text-[13px] font-semibold text-ink-secondary">Reviews from real bookings</p>
            <h3 className="mt-2 text-[28px] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[32px]">
              Only customers who booked can review.
            </h3>
            <p className="mt-3 text-[16px] leading-relaxed text-ink-secondary">
              A review can be left only after a job is marked complete, so every rating on a profile reflects
              work that actually happened.
            </p>
            <ul className="mt-8 grid gap-3" aria-label="Example reviews">
              {REVIEWS.map((r) => (
                <li key={r.name} className="rounded-2xl bg-white p-5 shadow-card">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[14px] font-semibold text-ink">{r.name}</p>
                      <p className="text-[12px] text-ink-tertiary">
                        {r.job} · {r.area}
                      </p>
                    </div>
                    <Stars value={5} size={13} />
                  </div>
                  <p className="mt-3 text-[14px] leading-relaxed text-ink-secondary">{r.text}</p>
                </li>
              ))}
            </ul>
          </BentoCard>

          <div className="relative min-h-[420px] overflow-hidden rounded-[28px] bg-surface">
            <Image
              src="/assets/customer-home.png"
              alt="A homeowner welcoming a visitor at her front door"
              fill
              sizes="(min-width: 1024px) 600px, 100vw"
              className="object-cover object-[45%_center]"
            />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/55 to-transparent" />
            <div aria-hidden className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/95 p-4 backdrop-blur sm:inset-x-6 sm:bottom-6 sm:p-5">
              <div className="flex items-center gap-3">
                <Avatar src="/assets/customer-home.png" alt="" size={38} />
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-semibold text-ink">Sana M. · G-11</p>
                  <Stars value={5} size={12} />
                </div>
                <span className="text-[12px] text-ink-tertiary">Voice review</span>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ink text-white">
                  <Play className="size-3.5 translate-x-px fill-white" />
                </span>
                <Waveform played={0.45} className="h-6 flex-1 overflow-hidden" activeClassName="bg-ink" />
                <span className="text-[12px] tabular-nums text-ink-secondary">0:12</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <BentoCard>
            <Banknote className="size-7 text-ink" strokeWidth={1.6} aria-hidden />
            <h3 className="mt-6 text-[22px] font-semibold tracking-[-0.015em] text-ink">Price agreed upfront.</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-secondary">
              Both sides confirm the amount in rupees before anyone sets off. No haggling at the door.
            </p>
            <div aria-hidden className="mt-6 flex items-center justify-between rounded-2xl bg-white px-5 py-4">
              <span className="text-[22px] font-semibold tracking-[-0.02em] text-ink">Rs 3,500</span>
              <StatusPill>Both agreed</StatusPill>
            </div>
          </BentoCard>

          <BentoCard>
            <CalendarCheck className="size-7 text-ink" strokeWidth={1.6} aria-hidden />
            <h3 className="mt-6 text-[22px] font-semibold tracking-[-0.015em] text-ink">Never double-booked.</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-secondary">
              Once a booking is confirmed, the worker is marked busy for everyone else until the job is done.
            </p>
            <ul aria-hidden className="mt-6 space-y-2">
              <li className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-[14px] font-medium text-ink">
                Bilal · AC
                <StatusPill tone="warning">Busy until 7 PM</StatusPill>
              </li>
              <li className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-[14px] font-medium text-ink">
                Asif · Plumber
                <StatusPill>Available</StatusPill>
              </li>
            </ul>
          </BentoCard>

          <BentoCard>
            <ClipboardCheck className="size-7 text-ink" strokeWidth={1.6} aria-hidden />
            <h3 className="mt-6 text-[22px] font-semibold tracking-[-0.015em] text-ink">Always know where it stands.</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-secondary">
              From the first request to the final review, both of you see the same clear status.
            </p>
            <ol aria-hidden className="mt-6 space-y-2.5 rounded-2xl bg-white p-4">
              {LIFECYCLE.map((step, i) => {
                const done = i < 3;
                return (
                  <li key={step} className="flex items-center gap-3 text-[14px]">
                    <span
                      className={`flex size-5 items-center justify-center rounded-full ${
                        done ? "bg-success text-white" : "ring-1 ring-inset ring-line-strong"
                      }`}
                    >
                      {done && <Check className="size-3" strokeWidth={3} />}
                    </span>
                    <span className={done ? "font-medium text-ink" : "text-ink-tertiary"}>{step}</span>
                  </li>
                );
              })}
            </ol>
          </BentoCard>
        </div>
      </Container>
    </section>
  );
}
