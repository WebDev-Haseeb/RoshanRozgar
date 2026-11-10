"use client";

import { useState } from "react";
import {
  Send,
  Mic,
  Phone,
  ShieldCheck,
  CheckCheck,
  User,
  Paperclip,
  Volume2,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: "me" | "them";
  text: string;
  time: string;
  isAudio?: boolean;
}

const CONVERSATIONS = [
  {
    id: "conv-1",
    name: "Ejaz Ahmed (Electrician)",
    urdu: "اعجاز احمد · برقی ماہر",
    sector: "Islamabad · G-11/3",
    lastMsg: "میں اوزار لے کر نکل رہا ہوں، 15 منٹ میں پہنچ جاؤں گا۔",
    time: "2m ago",
    unread: 1,
    online: true,
  },
  {
    id: "conv-2",
    name: "Mohammad Bilal (Plumber)",
    urdu: "محمد بلال · پلمبر",
    sector: "Rawalpindi · Saddar",
    lastMsg: "PPRC pipe fittings and motor valve check done.",
    time: "1h ago",
    unread: 0,
    online: false,
  },
];

export default function MessagesPage() {
  const { user, profile } = useAuth();
  const [activeConv, setActiveConv] = useState(CONVERSATIONS[0]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "them",
      text: "السلام علیکم جناب! میں نے آپ کا ڈی بی بریکر ٹرپنگ کا جاب قبول کر لیا ہے۔",
      time: "10:14 AM",
    },
    {
      id: "2",
      sender: "me",
      text: "وعلیکم السلام۔ جی ضرور، جب بھی انورٹر اے سی چلاتے ہیں تو مین بریکر گر جاتا ہے۔",
      time: "10:16 AM",
    },
    {
      id: "3",
      sender: "them",
      text: "کوئی مسئلہ نہیں، غالباً لوڈ کیبل یا 32A بریکر اوور لوڈ ہو رہا ہے۔ میں اوزار لے کر نکل رہا ہوں، 15 منٹ میں پہنچ جاؤں گا۔",
      time: "10:18 AM",
    },
  ]);
  const [inputText, setInputText] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: "me",
      text: inputText.trim(),
      time: "Just now",
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText("");

    // Simulate worker reply in 1.5s
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "them",
          text: "جی ٹھیک ہے، میں راستے میں ہوں۔ شکریہ!",
          time: "Just now",
        },
      ]);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] flex flex-col justify-between">
      <SiteHeader />

      <main className="flex-1 py-8">
        <Container className="max-w-5xl">
          <div className="rounded-3xl border border-line bg-white shadow-card overflow-hidden flex flex-col md:flex-row h-[700px]">
            {/* Conversation List Sidebar */}
            <div className="w-full md:w-80 border-r border-line flex flex-col bg-surface/30">
              <div className="p-4 border-b border-line bg-white">
                <h2 className="text-[18px] font-semibold text-ink">Messages / پیغامات</h2>
                <p className="text-[12px] text-ink-secondary">Direct customer & worker chat</p>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-line/60">
                {CONVERSATIONS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveConv(c)}
                    className={cn(
                      "w-full p-4 text-left transition-colors flex items-start gap-3",
                      activeConv.id === c.id ? "bg-white shadow-sm" : "hover:bg-white/60"
                    )}
                  >
                    <div className="relative">
                      <div className="flex size-10 items-center justify-center rounded-full bg-accent-tint text-accent font-semibold text-[13px]">
                        {c.name.charAt(0)}
                      </div>
                      {c.online && (
                        <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[14px] font-semibold text-ink truncate">{c.name}</span>
                        <span className="text-[11px] text-ink-tertiary">{c.time}</span>
                      </div>
                      <p className="text-[12px] text-ink-secondary truncate mt-0.5">{c.lastMsg}</p>
                      <span className="text-[11px] text-ink-tertiary font-urdu">{c.sector}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
              {/* Chat Header */}
              <div className="p-4 border-b border-line flex items-center justify-between bg-surface/20">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-accent/15 text-accent font-semibold text-[13px]">
                    {activeConv.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[15px] font-semibold text-ink">{activeConv.name}</h3>
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <ShieldCheck className="size-3" /> Verified Pro
                      </span>
                    </div>
                    <p className="text-[12px] text-ink-tertiary">{activeConv.sector}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="tel:03001234567"
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[12px] font-medium text-ink hover:bg-surface transition-colors"
                  >
                    <Phone className="size-3.5 text-emerald-600" />
                    <span>Call Worker</span>
                  </a>
                </div>
              </div>

              {/* Message History */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FBFBFD]">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "flex flex-col max-w-[75%]",
                      m.sender === "me" ? "ml-auto items-end" : "mr-auto items-start"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-3 text-[14px] leading-relaxed shadow-sm",
                        m.sender === "me"
                          ? "bg-ink text-white rounded-br-sm"
                          : "bg-white text-ink border border-line rounded-bl-sm font-urdu"
                      )}
                    >
                      {m.text}
                    </div>
                    <span className="mt-1 text-[11px] text-ink-tertiary px-1">{m.time}</span>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSend} className="p-4 border-t border-line bg-white flex items-center gap-3">
                <button
                  type="button"
                  title="Voice note"
                  className="flex size-10 items-center justify-center rounded-full text-ink-secondary hover:text-ink hover:bg-surface transition-colors"
                >
                  <Mic className="size-5" />
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a message or spoken instruction in Urdu/English..."
                  className="flex-1 rounded-full border border-line bg-surface/40 px-4 py-2.5 text-[14px] text-ink outline-none focus:border-accent focus:bg-white transition-all"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="flex size-10 items-center justify-center rounded-full bg-accent text-white hover:bg-accent-hover transition-colors disabled:opacity-40"
                >
                  <Send className="size-4" />
                </button>
              </form>
            </div>
          </div>
        </Container>
      </main>

      <SiteFooter />
    </div>
  );
}
