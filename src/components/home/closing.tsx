import Image from "next/image";
import Link from "next/link";
import { CircleCheck, Mic, Plus } from "lucide-react";
import { Container } from "@/components/ui/container";
import { buttonStyles } from "@/components/ui/button";

const WORKER_POINTS = ["No reading required", "Set your own hours", "Jobs close to home"];

export function ForWorkers() {
  return (
    <section id="workers" className="pb-24 sm:pb-32">
      <Container>
        <div className="grid overflow-hidden rounded-[32px] bg-surface lg:grid-cols-2">
          <div className="p-8 sm:p-12 lg:p-16">
            <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-tertiary">For workers</p>
            <p lang="ur" dir="rtl" className="mt-5 text-left font-urdu text-[26px] leading-[2] text-ink sm:text-[30px]">
              کام آپ کا، پہچان آپ کی
            </p>
            <h2 className="mt-3 text-[38px] font-semibold leading-[1.05] tracking-[-0.03em] text-ink sm:text-[52px]">
              Your skill.
              <br />
              Your name.
            </h2>
            <p className="mt-5 max-w-md text-[17px] leading-relaxed text-ink-secondary">
              Create your profile by speaking for about a minute. Tell us your trade, your area and your
              experience. Customers nearby can then find you, message you and book you.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link href="/signup?role=worker" className={buttonStyles({ variant: "dark", size: "lg" })}>
                <Mic className="size-[18px]" aria-hidden />
                Join as a worker
              </Link>
              <Link href="/login" className={buttonStyles({ variant: "ghost", className: "text-[17px]" })}>
                Already registered? Sign in
              </Link>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
              {WORKER_POINTS.map((point) => (
                <li key={point} className="inline-flex items-center gap-2 text-[14px] font-medium text-ink-secondary">
                  <CircleCheck className="size-[18px] text-success-ink" aria-hidden />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative min-h-[340px] sm:min-h-[420px]">
            <Image
              src="/assets/worker-voice.png"
              alt="A tradesman recording a voice note on his phone"
              fill
              sizes="(min-width: 1024px) 600px, 100vw"
              className="object-cover object-[62%_center]"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

const FAQS = [
  {
    q: "Which cities do you cover?",
    a: "We currently serve Islamabad and Rawalpindi. You can search by sector or neighbourhood, or share your location so we can show the workers closest to you.",
  },
  {
    q: "Do I have to type anything?",
    a: "No. You can describe a job, or set up a worker profile, entirely by voice in Urdu, Roman Urdu or English. If you prefer, every step can also be completed by typing.",
  },
  {
    q: "How is the price decided?",
    a: "The worker sends a quote in Pakistani rupees after you describe the job. You can discuss it in the chat, and the booking is confirmed only once you accept the final amount.",
  },
  {
    q: "How do I pay the worker?",
    a: "Payment is made directly to the worker once the job is done, in the way you both agree. Roshan Rozgar does not process payments at this time.",
  },
  {
    q: "How are ratings kept honest?",
    a: "Reviews can only be written by customers whose booking with that worker has been marked complete. Each review is linked to a real job.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="pb-24 sm:pb-32">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div>
          <h2 className="text-[34px] font-semibold leading-[1.08] tracking-[-0.025em] text-ink sm:text-5xl">
            Questions, answered.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-secondary">
            Everything you need to know before your first booking.
          </p>
        </div>
        <ul className="border-t border-line">
          {FAQS.map(({ q, a }) => (
            <li key={q} className="border-b border-line">
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[18px] font-semibold tracking-[-0.01em] text-ink">
                  {q}
                  <Plus
                    className="size-5 shrink-0 text-ink-tertiary transition-transform duration-200 group-open:rotate-45"
                    aria-hidden
                  />
                </summary>
                <p className="-mt-2 pb-6 pr-10 text-[16px] leading-relaxed text-ink-secondary">{a}</p>
              </details>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export function ClosingCta() {
  return (
    <section className="pb-24 sm:pb-32">
      <Container className="text-center">
        <h2 className="mx-auto max-w-3xl text-[38px] font-semibold leading-[1.05] tracking-[-0.03em] text-ink sm:text-[56px]">
          Something broken?
          <br />
          <span className="text-ink-tertiary">Help is nearby.</span>
        </h2>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/signup?role=customer" className={buttonStyles({ size: "lg", className: "w-full sm:w-auto" })}>
            Find a worker
          </Link>
          <Link
            href="/signup?role=worker"
            className={buttonStyles({ variant: "secondary", size: "lg", className: "w-full sm:w-auto" })}
          >
            Join as a worker
          </Link>
        </div>
      </Container>
    </section>
  );
}
