import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

export type LegalSection = {
  id: string;
  title: string;
  content: React.ReactNode;
};

const TABS = [
  { href: "/privacy", label: "Privacy Policy", key: "privacy" },
  { href: "/terms", label: "Terms of Service", key: "terms" },
] as const;

export function LegalPage({
  current,
  title,
  updated,
  intro,
  sections,
}: {
  current: "privacy" | "terms";
  title: string;
  updated: string;
  intro: React.ReactNode;
  sections: LegalSection[];
}) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <header className="border-b border-line">
          <Container className="py-14 sm:py-20">
            <nav aria-label="Legal documents" className="inline-flex rounded-full bg-surface p-1">
              {TABS.map((tab) => (
                <Link
                  key={tab.key}
                  href={tab.href}
                  aria-current={tab.key === current ? "page" : undefined}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors",
                    tab.key === current ? "bg-white text-ink shadow-card" : "text-ink-secondary hover:text-ink",
                  )}
                >
                  {tab.label}
                </Link>
              ))}
            </nav>
            <h1 className="mt-8 text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] text-ink sm:text-[56px]">
              {title}
            </h1>
            <p className="mt-4 text-[15px] text-ink-tertiary">Last updated {updated}</p>
            <div className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-secondary">{intro}</div>
          </Container>
        </header>

        <Container className="grid gap-12 py-14 sm:py-20 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-20">
          <aside className="hidden lg:block">
            <nav aria-label="On this page" className="sticky top-24">
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-tertiary">On this page</p>
              <ol className="mt-4 space-y-2.5 border-l border-line">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="-ml-px block border-l border-transparent pl-4 text-[13px] leading-snug text-ink-secondary transition-colors hover:border-ink hover:text-ink"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <article className="max-w-[720px]">
            {sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                className={cn("scroll-mt-24", index > 0 && "mt-14 border-t border-line pt-14")}
              >
                <h2 className="text-[24px] font-semibold tracking-[-0.02em] text-ink sm:text-[28px]">
                  <span className="mr-3 tabular-nums text-ink-tertiary">{index + 1}.</span>
                  {section.title}
                </h2>
                <div
                  className={cn(
                    "text-[17px] leading-[1.7] text-ink-secondary",
                    "[&_p]:mt-4 [&_h3]:mt-8 [&_h3]:text-[17px] [&_h3]:font-semibold [&_h3]:text-ink",
                    "[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_li]:pl-1 [&_li]:marker:text-ink-tertiary",
                    "[&_strong]:font-semibold [&_strong]:text-ink",
                    "[&_a]:text-link [&_a]:underline-offset-4 hover:[&_a]:underline",
                  )}
                >
                  {section.content}
                </div>
              </section>
            ))}
          </article>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
