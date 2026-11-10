import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/ui/container";

const COLUMNS = [
  {
    title: "Customers",
    links: [
      { href: "/signup?role=customer", label: "Find a worker" },
      { href: "/#services", label: "Services" },
      { href: "/#how-it-works", label: "How it works" },
      { href: "/#trust", label: "Trust and safety" },
    ],
  },
  {
    title: "Workers",
    links: [
      { href: "/signup?role=worker", label: "Join as a worker" },
      { href: "/#workers", label: "Why Roshan Rozgar" },
      { href: "/login", label: "Sign in" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/#faq", label: "Questions" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-surface">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-ink-secondary">
              A local marketplace that connects households in Islamabad and Rawalpindi with skilled trade workers
              nearby.
            </p>
            <p lang="ur" dir="rtl" className="mt-5 text-left font-urdu text-[17px] leading-[2] text-ink-secondary">
              روشن روزگار
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {COLUMNS.map((column) => (
              <div key={column.title}>
                <h3 className="text-[13px] font-semibold text-ink">{column.title}</h3>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[13px] text-ink-secondary transition-colors hover:text-ink"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line-strong/70 pt-6 text-[12px] text-ink-tertiary sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright © 2026 Roshan Rozgar. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-ink">
              Privacy
            </Link>
            <span aria-hidden className="h-3 w-px bg-line-strong" />
            <Link href="/terms" className="hover:text-ink">
              Terms
            </Link>
            <span aria-hidden className="h-3 w-px bg-line-strong" />
            <span>Islamabad · Rawalpindi</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
