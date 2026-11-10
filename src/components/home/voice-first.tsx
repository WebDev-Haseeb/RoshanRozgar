import { ArrowRight, Check, Clock, Keyboard, Languages, ListChecks, MapPin, Mic, Snowflake, Wrench } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/container";
import { Waveform } from "@/components/ui/primitives";

const EXTRACTED = [
  { icon: Snowflake, label: "Service", value: "AC Technician" },
  { icon: Wrench, label: "Problem", value: "Not cooling" },
  { icon: Clock, label: "When", value: "Today, after 5 PM" },
  { icon: MapPin, label: "Where", value: "G-11, Islamabad" },
];

const FEATURES = [
  {
    icon: Languages,
    title: "Speak the way you talk",
    body: "Urdu, Roman Urdu and English are all understood, including the everyday mix of the three.",
  },
  {
    icon: ListChecks,
    title: "You confirm every detail",
    body: "Nothing is saved until you have reviewed it. Anything that is wrong can be corrected with a tap.",
  },
  {
    icon: Keyboard,
    title: "Typing is always optional",
    body: "Prefer to type? Every voice step has a simple manual alternative, so no one is left out.",
  },
];

export function VoiceFirst() {
  return (
    <section className="pb-24 sm:pb-32">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Voice first"
          title="Speak. The form fills itself."
          description="Workers and customers describe what they need out loud. The details are laid out clearly for a quick check before anything is saved."
        />

        <div className="mt-14 grid items-center gap-4 rounded-[32px] bg-surface p-4 sm:p-8 lg:grid-cols-[1fr_auto_1fr] lg:gap-8 lg:p-12">
          <div className="rounded-[24px] bg-white p-6 shadow-card sm:p-8">
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-tertiary">What you say</p>
            <div className="mt-6 flex items-center gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                <Mic className="size-5" aria-hidden />
              </span>
              <Waveform played={1} className="h-8 overflow-hidden" activeClassName="bg-ink" />
            </div>
            <p lang="ur" dir="rtl" className="mt-6 font-urdu text-[20px] leading-[2.1] text-ink sm:text-[22px]">
              اے سی ٹھنڈا نہیں کر رہا، آج شام جی الیون میں کوئی آ سکتا ہے؟
            </p>
            <p className="mt-4 border-t border-line pt-4 text-[15px] font-medium leading-relaxed text-ink-secondary">
              “AC thanda nahi kar raha, aaj shaam G-11 mein koi aa sakta hai?”
            </p>
          </div>

          <div className="flex justify-center" aria-hidden>
            <span className="flex size-12 items-center justify-center rounded-full bg-white text-ink shadow-card">
              <ArrowRight className="size-5 rotate-90 lg:rotate-0" />
            </span>
          </div>

          <div className="rounded-[24px] bg-white p-6 shadow-card sm:p-8">
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-tertiary">What gets booked</p>
            <ul className="mt-6 space-y-4">
              {EXTRACTED.map(({ icon: Icon, label, value }) => (
                <li key={label} className="flex items-center gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface text-ink">
                    <Icon className="size-[18px]" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12px] font-medium text-ink-tertiary">{label}</span>
                    <span className="block truncate text-[16px] font-semibold text-ink">{value}</span>
                  </span>
                  <Check className="size-[18px] text-success-ink" strokeWidth={2.5} aria-label="Confirmed" />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ul className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <li key={title}>
              <Icon className="size-7 text-ink" strokeWidth={1.6} aria-hidden />
              <h3 className="mt-5 text-[21px] font-semibold tracking-[-0.015em] text-ink">{title}</h3>
              <p className="mt-2 text-[16px] leading-relaxed text-ink-secondary">{body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
