"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Hero } from "@/components/home/hero";
import { Services } from "@/components/home/services";
import { HowItWorks } from "@/components/home/how-it-works";
import { VoiceFirst } from "@/components/home/voice-first";
import { Trust } from "@/components/home/trust";
import { ClosingCta, Faq, ForWorkers } from "@/components/home/closing";

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  if (!loading && user) {
    return null;
  }

  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Services />
        <HowItWorks />
        <VoiceFirst />
        <Trust />
        <ForWorkers />
        <Faq />
        <ClosingCta />
      </main>
      <SiteFooter />
    </>
  );
}
