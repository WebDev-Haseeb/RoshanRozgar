import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Languages, MapPin, Mic, ShieldCheck, Tag as TagIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { buttonStyles } from "@/components/ui/button";
import { Avatar, StatusPill, Tag, Waveform } from "@/components/ui/primitives";
import { Star } from "lucide-react";

const PROOF = [
  { icon: ShieldCheck, label: "Reviews from completed jobs only" },
  { icon: TagIcon, label: "Price agreed before work starts" },
  { icon: Languages, label: "Urdu, Roman Urdu and English" },
];

export function Hero() {
  return (
    <section className="overflow-hidden pt-14 sm:pt-20 lg:pt-24">
      <Container className="text-center">
        <p className="inline-flex items-center gap-2 rounded-full bg-surface px-3.5 py-1.5 text-[13px] font-medium text-ink-secondary">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-50" />
            <span className="relative inline-flex size-2 rounded-full bg-success" />
          </span>
          Now serving Islamabad and Rawalpindi
        </p>

        <h1 className="mt-6 text-[44px] font-semibold leading-[1.04] tracking-[-0.035em] text-ink sm:text-[64px] lg:text-[88px]">
          Skilled hands.
          <br />
          <span className="text-ink-tertiary">Right next door.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-secondary sm:text-[21px]">
          Find a trusted electrician, plumber or AC technician who is nearby and free right now. Just say what is
          broken, in your own words.
        </p>

        <Link
          href="/signup?role=customer"
          className="group mx-auto mt-10 flex w-full max-w-[760px] items-center gap-3 rounded-full bg-white p-2 text-left shadow-float ring-1 ring-line transition-shadow hover:ring-line-strong sm:gap-4 sm:p-2.5"
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent text-white sm:size-14">
            <Mic className="size-5 sm:size-6" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[16px] font-semibold text-ink sm:text-[18px]">
              Bolo, kya kaam hai?
            </span>
            <span className="block truncate text-[13px] text-ink-tertiary sm:text-[15px]">
              “AC thanda nahi kar raha, G-11 mein”
            </span>
          </span>
          <span className="hidden h-8 items-center gap-1.5 rounded-full bg-surface px-3 text-[13px] font-medium text-ink-secondary md:inline-flex">
            <MapPin className="size-3.5" aria-hidden />
            Islamabad
          </span>
          <span className={buttonStyles({ size: "lg", className: "hidden sm:inline-flex" })}>Find a worker</span>
          <ChevronRight className="mr-2 size-5 text-ink-tertiary sm:hidden" aria-hidden />
        </Link>

        <Link
          href="/signup?role=worker"
          className="mt-6 inline-flex items-center gap-1 text-[15px] font-medium text-link hover:underline underline-offset-4"
        >
          Are you a skilled worker? Join by voice
          <ChevronRight className="size-4" aria-hidden />
        </Link>

        <ul className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {PROOF.map(({ icon: Icon, label }) => (
            <li key={label} className="inline-flex items-center gap-2 text-[14px] font-medium text-ink-secondary">
              <Icon className="size-4 text-ink-tertiary" aria-hidden />
              {label}
            </li>
          ))}
        </ul>
      </Container>

      <Container className="mt-14 sm:mt-16">
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-surface sm:aspect-[16/10] sm:rounded-[32px] lg:aspect-[15/8]">
            <Image
              src="/assets/hero-electrician.jpg"
              alt="An electrician standing beside a switchboard in a bright living room"
              fill
              priority
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="object-cover object-[68%_center]"
            />
          </div>

          <div
            aria-hidden
            className="relative z-10 mx-3 -mt-28 grid gap-3 sm:mx-8 sm:-mt-32 sm:max-w-[400px] lg:absolute lg:left-10 lg:top-10 lg:mx-0 lg:mt-0 lg:w-[384px]"
          >
            <div className="rounded-3xl bg-white/95 p-5 shadow-float ring-1 ring-black/5 backdrop-blur">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-ink-secondary">
                  <span className="flex size-7 items-center justify-center rounded-full bg-accent-tint text-accent">
                    <Mic className="size-3.5" />
                  </span>
                  Voice request
                </span>
                <span className="text-[12px] tabular-nums text-ink-tertiary">0:08</span>
              </div>
              <Waveform played={0.55} className="mt-4 h-8" />
              <p className="mt-4 text-[16px] font-medium leading-snug text-ink">
                “Bijli ka board spark kar raha hai, abhi koi aa sakta hai?”
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <Tag tone="accent">Electrician</Tag>
                <Tag tone="warning">Urgent</Tag>
                <Tag>F-10, Islamabad</Tag>
              </div>
            </div>

            <div className="rounded-3xl bg-white/95 p-5 shadow-float ring-1 ring-black/5 backdrop-blur">
              <div className="flex items-center gap-3.5">
                <Avatar src="/assets/worker-electrician.jpg" alt="" size={52} online />
                <div className="min-w-0 flex-1">
                  <p className="text-[17px] font-semibold tracking-[-0.01em] text-ink">Imran Hussain</p>
                  <p className="truncate text-[13px] text-ink-secondary">Electrician · 12 years · 1.2 km away</p>
                  <p className="mt-0.5 inline-flex items-center gap-1 text-[13px] text-ink-secondary">
                    <Star className="size-3.5 fill-star text-star" />
                    <span className="font-semibold text-ink">4.9</span> from 418 jobs
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4">
                <div>
                  <StatusPill>Available now</StatusPill>
                  <p className="mt-1.5 text-[12px] text-ink-tertiary">Can arrive in about 18 min</p>
                </div>
                <span className={buttonStyles({ size: "md" })}>Book · Rs 1,200</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
