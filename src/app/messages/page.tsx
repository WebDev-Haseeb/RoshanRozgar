"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Send,
  Mic,
  Phone,
  ShieldCheck,
  CheckCheck,
  User,
  Sparkles,
  Loader2,
  Volume2,
  Square,
  CheckCircle2,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { buttonStyles } from "@/components/ui/button";
import { Waveform } from "@/components/ui/primitives";
import { useAuth } from "@/lib/auth-context";
import { sendMessage, subscribeToMessages, ChatMessage } from "@/lib/chat-service";
import { cn } from "@/lib/utils";

const CONVERSATIONS = [
  {
    id: "lead-g11-electrician",
    name: "Ejaz Ahmed (Electrician)",
    urdu: "اعجاز احمد · برقی ماہر",
    role: "worker" as const,
    sector: "Islamabad · G-11/3",
    lastMsg: "میں اوزار لے کر نکل رہا ہوں، 15 منٹ میں پہنچ جاؤں گا۔",
    time: "Just now",
    online: true,
  },
  {
    id: "lead-saddar-plumber",
    name: "Mohammad Bilal (Plumber)",
    urdu: "محمد بلال · پلمبر",
    role: "worker" as const,
    sector: "Rawalpindi · Saddar",
    lastMsg: "PPRC pipe fittings and motor valve check done.",
    time: "1h ago",
    online: false,
  },
];

const SAMPLE_VOICE_CHATS = [
  "Main saman aur tools le kar nikal chuka hoon, 15 minute mein aap ke ghar pohanch raha hoon.",
  "السلام علیکم، کیا آپ ابھی گھر پر موجود ہیں؟ میں گلی نمبر 4 پر پہنچ گیا ہوں۔",
  "PPRC joint pipe replace ho gaya hai aur leakage bilkul theek ho gayi hai. Tasalli kar lein.",
];

export default function MessagesPage() {
  const { user, profile } = useAuth();
  const [activeConv, setActiveConv] = useState(CONVERSATIONS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);

  // AI Voice Note modal
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [recordedDraft, setRecordedDraft] = useState("");
  const [isAiEnhancing, setIsAiEnhancing] = useState(false);
  const [enhancedText, setEnhancedText] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Real-time Firebase RTDB Subscription
  useEffect(() => {
    const unsubscribe = subscribeToMessages(activeConv.id, (msgs) => {
      if (msgs.length > 0) {
        setMessages(msgs);
      } else {
        // Fallback seed messages if empty in RTDB
        setMessages([
          {
            id: "seed-1",
            senderId: "worker-1",
            senderName: activeConv.name,
            senderRole: "worker",
            text: "السلام علیکم! میں نے آپ کا کام قبول کر لیا ہے۔ کچھ ہی دیر میں پہنچ رہا ہوں۔",
            timestamp: Date.now() - 1000 * 60 * 10,
          },
        ]);
      }
    });

    return () => unsubscribe();
  }, [activeConv.id, activeConv.name]);

  // Auto scroll to latest message
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Clean timer
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleSendTextMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;

    const textToSend = inputText.trim();
    setInputText("");
    setSending(true);

    try {
      const isWorker = profile?.role === "worker";
      await sendMessage(activeConv.id, {
        senderId: user?.uid || "client-user",
        senderName: user?.displayName || (isWorker ? "Worker" : "Customer"),
        senderRole: isWorker ? "worker" : "customer",
        text: textToSend,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  // Start voice recording simulation
  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordedDraft(SAMPLE_VOICE_CHATS[0]);
    } else {
      setIsRecording(true);
      setRecordSeconds(0);
      setRecordedDraft("");
      setEnhancedText("");

      timerRef.current = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);

      // Auto stop after 4s
      setTimeout(() => {
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
        setRecordedDraft(SAMPLE_VOICE_CHATS[0]);
      }, 4000);
    }
  };

  // Enhance voice note with Gemini AI
  const handleEnhanceWithAi = async (textToEnhance: string) => {
    setIsAiEnhancing(true);
    try {
      const res = await fetch("/api/ai/enhance-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawText: textToEnhance,
          senderRole: profile?.role || "customer",
        }),
      });

      const data = await res.json();
      if (data.enhancedText) {
        setEnhancedText(data.enhancedText);
      }
    } catch (err) {
      console.error(err);
      setEnhancedText(textToEnhance);
    } finally {
      setIsAiEnhancing(false);
    }
  };

  // Send AI Enhanced Voice Note
  const handleSendEnhancedVoiceNote = async () => {
    const textToSend = enhancedText || recordedDraft;
    if (!textToSend.trim()) return;

    setSending(true);
    try {
      const isWorker = profile?.role === "worker";
      await sendMessage(activeConv.id, {
        senderId: user?.uid || "client-user",
        senderName: user?.displayName || (isWorker ? "Worker" : "Customer"),
        senderRole: isWorker ? "worker" : "customer",
        text: textToSend,
        isVoice: true,
        aiEnhanced: !!enhancedText,
      });

      setShowVoiceModal(false);
      setRecordedDraft("");
      setEnhancedText("");
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const isMyMessage = (m: ChatMessage) => {
    if (user?.uid) {
      return m.senderId === user.uid;
    }
    const myRole = profile?.role || "customer";
    return m.senderRole === myRole;
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] flex flex-col justify-between">
      <SiteHeader />

      <main className="flex-1 py-8">
        <Container className="max-w-5xl">
          <div className="rounded-3xl border border-line bg-white shadow-card overflow-hidden flex flex-col md:flex-row h-[720px] transition-all">
            {/* Conversation List Sidebar */}
            <div className="w-full md:w-80 border-r border-line flex flex-col bg-surface/30">
              <div className="p-4 border-b border-line bg-white">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <h2 className="text-[17px] font-semibold text-ink">Live Realtime Chats</h2>
                </div>
                <p className="text-[12px] text-ink-secondary">Connected via Firebase RTDB</p>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-line/60">
                {CONVERSATIONS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveConv(c)}
                    className={cn(
                      "w-full p-4 text-left transition-colors flex items-start gap-3 cursor-pointer",
                      activeConv.id === c.id ? "bg-white shadow-sm font-medium" : "hover:bg-white/60"
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
                  <button
                    type="button"
                    onClick={() => setShowVoiceModal(true)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[12px] font-medium text-ink hover:bg-surface cursor-pointer transition-colors"
                  >
                    <Mic className="size-3.5 text-accent" />
                    <span>Voice Message</span>
                  </button>
                  <a
                    href="tel:03001234567"
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[12px] font-medium text-ink hover:bg-surface cursor-pointer transition-colors"
                  >
                    <Phone className="size-3.5 text-emerald-600" />
                    <span>Call</span>
                  </a>
                </div>
              </div>

              {/* Message History with Firebase Realtime Sync */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FBFBFD]">
                {messages.map((m) => {
                  const mine = isMyMessage(m);
                  return (
                    <div
                      key={m.id}
                      className={cn(
                        "flex flex-col max-w-[80%] transition-all",
                        mine ? "ml-auto items-end" : "mr-auto items-start"
                      )}
                    >
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-3 text-[14px] leading-relaxed shadow-sm",
                          mine
                            ? "bg-ink text-white rounded-br-sm"
                            : "bg-white text-ink border border-line rounded-bl-sm font-urdu"
                        )}
                      >
                        {m.isVoice && (
                          <div className="flex items-center gap-1.5 text-[11px] font-medium mb-1 text-accent opacity-90">
                            <Volume2 className="size-3.5" />
                            <span>Voice Note {m.aiEnhanced && "· Enhanced by Gemini AI"}</span>
                          </div>
                        )}
                        <p>{m.text}</p>
                      </div>
                      <span className="mt-1 text-[10px] text-ink-tertiary px-1">
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  );
                })}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Text Input */}
              <form onSubmit={handleSendTextMessage} className="p-4 border-t border-line bg-white flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowVoiceModal(true)}
                  title="Voice note with AI enhancement"
                  className="flex size-10 items-center justify-center rounded-full text-ink-secondary hover:text-accent hover:bg-surface transition-colors cursor-pointer"
                >
                  <Mic className="size-5" />
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a message or use voice button..."
                  className="flex-1 rounded-full border border-line bg-surface/40 px-4 py-2.5 text-[14px] text-ink outline-none focus:border-accent focus:bg-white transition-all"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim() || sending}
                  className="flex size-10 items-center justify-center rounded-full bg-accent text-white hover:bg-accent-hover transition-colors disabled:opacity-40 cursor-pointer"
                >
                  <Send className="size-4" />
                </button>
              </form>
            </div>
          </div>
        </Container>
      </main>

      {/* AI VOICE NOTE SENDER MODAL */}
      {showVoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-line bg-white p-6 shadow-float space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-accent" />
                <h3 className="text-[17px] font-semibold text-ink">
                  AI Voice Message (صوتی پیغام)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowVoiceModal(false)}
                className="text-ink-tertiary hover:text-ink text-[18px] font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-[13px] text-ink-secondary">
              Record a brief voice note. Gemini AI will refine your spoken words into a polite, professional message ready to send.
            </p>

            {/* Mic Button */}
            <div className="rounded-2xl border border-line bg-surface/50 p-5 flex flex-col items-center justify-center text-center space-y-3">
              <button
                type="button"
                onClick={handleToggleRecord}
                className={cn(
                  "flex size-14 items-center justify-center rounded-full transition-all shadow-sm cursor-pointer",
                  isRecording
                    ? "bg-danger text-white ring-8 ring-danger/20 animate-pulse"
                    : "bg-ink text-white hover:bg-black"
                )}
              >
                {isRecording ? <Square className="size-5" /> : <Mic className="size-6" />}
              </button>

              <div className="text-[14px] font-medium text-ink">
                {isRecording ? (
                  <span className="text-danger">Recording... 00:0{recordSeconds}</span>
                ) : recordedDraft ? (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="size-4" /> Spoken note captured
                  </span>
                ) : (
                  <span>Click mic to speak</span>
                )}
              </div>

              {isRecording && <Waveform bars={16} active />}
            </div>

            {/* Quick Sample Voice Drafts */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-medium text-ink-tertiary">Or pick a quick spoken response:</span>
              <div className="flex flex-col gap-1.5">
                {SAMPLE_VOICE_CHATS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setRecordedDraft(sample);
                      handleEnhanceWithAi(sample);
                    }}
                    className="text-left text-[12px] p-2 rounded-xl border border-line bg-white hover:bg-surface text-ink-secondary hover:text-ink cursor-pointer transition-colors"
                  >
                    &ldquo;{sample}&rdquo;
                  </button>
                ))}
              </div>
            </div>

            {/* Draft / AI Enhanced Preview */}
            {recordedDraft && (
              <div className="rounded-2xl border border-line bg-surface/40 p-4 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-medium text-ink-tertiary">
                  <span>Captured Draft:</span>
                  <button
                    type="button"
                    onClick={() => handleEnhanceWithAi(recordedDraft)}
                    disabled={isAiEnhancing}
                    className="text-accent hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="size-3" />
                    <span>{isAiEnhancing ? "Refining..." : "Refine with Gemini AI"}</span>
                  </button>
                </div>

                <p className="text-[13px] text-ink italic">&ldquo;{recordedDraft}&rdquo;</p>

                {enhancedText && (
                  <div className="mt-3 pt-3 border-t border-line">
                    <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block mb-1">
                      Gemini AI Enhanced Version:
                    </span>
                    <p className="text-[13px] text-ink font-medium leading-relaxed font-urdu">
                      {enhancedText}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-line">
              <button
                type="button"
                onClick={() => setShowVoiceModal(false)}
                className={buttonStyles({ variant: "secondary", size: "sm", className: "cursor-pointer" })}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSendEnhancedVoiceNote}
                disabled={!recordedDraft && !enhancedText}
                className={buttonStyles({
                  variant: "dark",
                  size: "sm",
                  className: "cursor-pointer disabled:opacity-50 flex items-center gap-1.5",
                })}
              >
                <Send className="size-3.5" />
                <span>Send to Chat / بھیجیں</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}
