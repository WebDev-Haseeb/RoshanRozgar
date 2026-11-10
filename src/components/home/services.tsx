import Link from "next/link";
import { ArrowRight, Car, Droplet, Hammer, PaintRoller, Snowflake, Zap } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/container";

const TRADES = [
  { icon: Zap, name: "Electrician", urdu: "الیکٹریشن", detail: "Wiring, switchboards, UPS and fans", color: "#E08600", tint: "#FFF4E0" },
  { icon: Droplet, name: "Plumber", urdu: "پلمبر", detail: "Leaks, taps, geysers and drainage", color: "#0A84FF", tint: "#E6F3FF" },
  { icon: Snowflake, name: "AC Technician", urdu: "اے سی ٹیکنیشن", detail: "Servicing, gas refill and repairs", color: "#00A3BF", tint: "#E5F8FB" },
  { icon: Hammer, name: "Carpenter", urdu: "ترکھان", detail: "Doors, furniture and fittings", color: "#A2672E", tint: "#F7EFE6" },
  { icon: PaintRoller, name: "Painter", urdu: "پینٹر", detail: "Interior, exterior and touch-ups", color: "#8E44D6", tint: "#F4EEFC" },
  { icon: Car, name: "Mechanic", urdu: "مکینک", detail: "Cars and motorcycles at your door", color: "#4A4F57", tint: "#EEF0F3" },
];

export function Services() {
  return (
    <section id="services" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          title="What needs fixing?"
          description="Choose a trade, or simply describe the problem and we will find the right person."
        />

        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
          {TRADES.map(({ icon: Icon, name, urdu, detail, color, tint }) => (
            <li key={name}>
              <Link
                href="/signup?role=customer"
                className="group flex h-full flex-col rounded-[24px] bg-surface p-5 transition-colors hover:bg-surface-hover sm:p-6"
              >
                <span
                  className="flex size-12 items-center justify-center rounded-full"
                  style={{ backgroundColor: tint, color }}
                >
                  <Icon className="size-[22px]" aria-hidden />
                </span>
                <span className="mt-8 text-[17px] font-semibold tracking-[-0.01em] text-ink">{name}</span>
                <span lang="ur" dir="rtl" className="mt-1 text-left font-urdu text-[14px] leading-[2] text-ink-secondary">
                  {urdu}
                </span>
                <span className="mt-2 text-[13px] leading-snug text-ink-secondary">{detail}</span>
                <ArrowRight
                  className="mt-5 size-4 text-ink-tertiary transition-transform group-hover:translate-x-0.5 group-hover:text-ink"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
