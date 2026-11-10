import Link from "next/link";
import { Sparkles, Mic, Wrench, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1D1D1F] flex flex-col font-sans">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E8E8ED] px-6 lg:px-16 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF7A00] to-[#FFC233] flex items-center justify-center text-white font-bold text-sm shadow-sm">
            RR
          </div>
          <span className="font-semibold text-lg tracking-tight">Roshan Rozgar</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#6E6E73]">
          <Link href="#trades" className="hover:text-[#1D1D1F] transition-colors">
            Find a Pro
          </Link>
          <Link href="#how-it-works" className="hover:text-[#1D1D1F] transition-colors">
            How It Works
          </Link>
          <Link href="#workers" className="hover:text-[#1D1D1F] transition-colors">
            For Workers
          </Link>
          <Link href="#trust" className="hover:text-[#1D1D1F] transition-colors">
            Trust & Safety
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-medium bg-[#1D1D1F] text-white rounded-full hover:bg-black transition-all shadow-sm">
            Join as a Worker
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 lg:px-12 py-20 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5F5F7] text-xs md:text-sm font-medium text-[#1D1D1F] mb-8 border border-[#E8E8ED]">
          <Sparkles className="w-4 h-4 text-[#AF52DE]" />
          <span>Now booking by voice — in Urdu, Punjabi & English</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-[#1D1D1F] leading-tight mb-4">
          Skilled hands. <br />
          <span className="text-[#86868B]">Right next door.</span>
        </h1>

        <p className="text-lg md:text-xl text-[#6E6E73] max-w-2xl mb-10 leading-relaxed font-normal">
          Find a trusted electrician, plumber, or AC technician in Islamabad & Rawalpindi who is nearby and free right now. Zero typing required.
        </p>

        {/* Voice Search Pill */}
        <div className="w-full max-w-2xl bg-white border border-[#E8E8ED] shadow-xl rounded-full p-2.5 flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#0071E3] to-[#AF52DE] flex items-center justify-center text-white shrink-0 shadow-md">
            <Mic className="w-5 h-5" />
          </div>
          <div className="flex-1 text-left px-2">
            <p className="text-sm md:text-base font-semibold text-[#1D1D1F]">Bolo, kya kaam hai?</p>
            <p className="text-xs text-[#86868B]">e.g. “AC thanda nahi kar raha, G-11 mein”</p>
          </div>
          <button className="px-6 py-3 bg-[#0071E3] hover:bg-[#0066CC] text-white font-medium text-sm rounded-full transition-all shrink-0">
            Find a Pro
          </button>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs md:text-sm font-medium text-[#6E6E73]">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#34C759]" />
            <span>1,240 pros available now</span>
          </div>
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-[#6E6E73]" />
            <span>Avg. arrival 22 min</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#6E6E73]" />
            <span>CNIC-checked & neighbour-rated</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E8E8ED] bg-[#F5F5F7] px-6 lg:px-16 py-8 text-center text-xs text-[#86868B]">
        <p>© 2026 Roshan Rozgar (روشن روزگار) — CUI Tech Fest AI Web Forge Hackathon.</p>
      </footer>
    </div>
  );
}
