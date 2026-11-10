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
  AlertCircle,
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

  // Real Audio Voice Recording State
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [recordedDraft, setRecordedDraft] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isAiEnhancing, setIsAiEnhancing] = useState(false);
  const [enhancedText, setEnhancedText] = useState("");
  const [micError, setMicError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const speechRecognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);
  const recordedDraftRef = useRef<string>("");

  // Real-time Firebase RTDB Subscription
  useEffect(() => {
    const unsubscribe = subscribeToMessages(activeConv.id, (msgs) => {
      if (msgs.length > 0) {
        setMessages(msgs);
      } else {
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
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
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

  // Start real recording (user stops when they want)
  const startVoiceRecording = async () => {
    setMicError(null);
    setRecordedDraft("");
    recordedDraftRef.current = "";
    setEnhancedText("");
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach((track) => track.stop());

        // Transcribe audio using speech or Gemini API
        setIsTranscribing(true);
        try {
          const buffer = await audioBlob.arrayBuffer();
          const base64 = Buffer.from(buffer).toString("base64");
          const capturedLive = recordedDraftRef.current.trim();

          const res = await fetch("/api/ai/transcribe-chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              audioBase64: base64,
              mimeType: "audio/webm",
              fallbackText: capturedLive,
            }),
          });

          const data = await res.json();
          if (data.transcription && data.transcription.trim()) {
            setRecordedDraft(data.transcription);
            recordedDraftRef.current = data.transcription;
            if (data.improved) {
              setEnhancedText(data.improved);
            }
          } else if (capturedLive) {
            setRecordedDraft(capturedLive);
          }
        } catch (err) {
          console.error("Transcription error:", err);
          if (recordedDraftRef.current) {
            setRecordedDraft(recordedDraftRef.current);
          }
        } finally {
          setIsTranscribing(false);
        }
      };

      // Also use browser speech recognition if available for instant live captions
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        // Support browser language or Urdu
        recognition.lang = navigator.language.startsWith("ur") ? "ur-PK" : (navigator.language || "en-US");

        recognition.onresult = (event: any) => {
          let liveText = "";
          for (let i = 0; i < event.results.length; i++) {
            liveText += event.results[i][0].transcript;
          }
          if (liveText.trim()) {
            recordedDraftRef.current = liveText.trim();
            setRecordedDraft(liveText.trim());
          }
        };

        recognition.onerror = () => {};
        recognition.start();
        speechRecognitionRef.current = recognition;
      }

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    } catch (err: any) {
      console.warn("Microphone access failed:", err);
      setMicError("Microphone access denied. You can click one of the quick voice messages below.");
    }
  };

  // Stop recording whenever user decides
  const stopVoiceRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch (e) {}
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      setIsRecording(false);
    }
  };

  // Enhance voice note with Gemini AI
  const handleEnhanceWithAi = async (textToEnhance: string) => {
    if (!textToEnhance.trim()) return;
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
    if (!textToSend.trim() || sending) return;

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
                <p className="text-[12px] text-ink-secondary">Synchronized with Firebase Realtime DB</p>
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
                  title="Record voice note with user-controlled stop"
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

      {/* USER-CONTROLLED VOICE NOTE SENDER MODAL */}
      {showVoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl border border-line bg-white p-6 sm:p-7 shadow-float space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-accent" />
                <h3 className="text-[17px] font-semibold text-ink">
                  Record Voice Message (صوتی پیغام ریکارڈ کریں)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  stopVoiceRecording();
                  setShowVoiceModal(false);
                }}
                className="text-ink-tertiary hover:text-ink text-[18px] font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-[13px] text-ink-secondary leading-relaxed">
              Click the microphone to start speaking. When you are done, click Stop Recording. Your speech will be transcribed and can be refined by Gemini AI before sending.
            </p>

            {/* User Controlled Recording Controls */}
            <div className="rounded-2xl border border-line bg-surface/50 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                  className={cn(
                    "flex size-14 items-center justify-center rounded-full transition-all shadow-sm cursor-pointer shrink-0",
                    isRecording
                      ? "bg-danger text-white ring-8 ring-danger/20 animate-pulse"
                      : "bg-ink text-white hover:bg-black"
                  )}
                >
                  {isRecording ? <Square className="size-5" /> : <Mic className="size-6" />}
                </button>

                <div>
                  <div className="text-[15px] font-semibold text-ink">
                    {isRecording ? (
                      <span className="text-danger flex items-center gap-2">
                        <span>Recording in progress...</span>
                        <span className="font-mono text-[13px]">
                          00:{recordSeconds < 10 ? `0${recordSeconds}` : recordSeconds}
                        </span>
                      </span>
                    ) : isTranscribing ? (
                      <span className="text-accent flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin" />
                        <span>Transcribing your speech...</span>
                      </span>
                    ) : recordedDraft ? (
                      <span className="text-emerald-700 flex items-center gap-1.5">
                        <CheckCircle2 className="size-4" /> Spoken voice transcribed
                      </span>
                    ) : (
                      <span>Tap mic to speak</span>
                    )}
                  </div>
                  <p className="text-[12px] text-ink-tertiary mt-0.5">
                    {isRecording
                      ? "Speak freely. Click the red button when finished."
                      : "User controlled recording: talk as long as you want."}
                  </p>
                </div>
              </div>

              {isRecording && (
                <div className="flex items-center gap-2">
                  <Waveform bars={16} active />
                  <button
                    type="button"
                    onClick={stopVoiceRecording}
                    className={buttonStyles({
                      variant: "dark",
                      size: "sm",
                      className: "cursor-pointer whitespace-nowrap bg-danger hover:bg-red-700",
                    })}
                  >
                    Stop Recording
                  </button>
                </div>
              )}
            </div>

            {micError && (
              <div className="rounded-xl bg-danger-tint p-3 text-[12px] text-danger border border-danger/20">
                {micError}
              </div>
            )}

            {/* Quick Sample Voice Prompts for instant testing */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-medium text-ink-tertiary">Or select a sample voice prompt:</span>
              <div className="flex flex-col gap-1.5">
                {SAMPLE_VOICE_CHATS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setRecordedDraft(sample);
                      handleEnhanceWithAi(sample);
                    }}
                    className="text-left text-[12px] p-2.5 rounded-xl border border-line bg-white hover:bg-surface text-ink-secondary hover:text-ink cursor-pointer transition-colors"
                  >
                    &ldquo;{sample}&rdquo;
                  </button>
                ))}
              </div>
            </div>

            {/* Editable Transcribed Draft */}
            <div>
              <div className="flex items-center justify-between text-[12px] font-medium text-ink-secondary mb-1">
                <span>Transcribed Voice Note (Editable):</span>
                {recordedDraft && (
                  <button
                    type="button"
                    onClick={() => handleEnhanceWithAi(recordedDraft)}
                    disabled={isAiEnhancing}
                    className="text-accent hover:underline flex items-center gap-1 cursor-pointer text-[11px]"
                  >
                    <Sparkles className="size-3" />
                    <span>{isAiEnhancing ? "Refining with AI..." : "Refine with Gemini AI"}</span>
                  </button>
                )}
              </div>
              <textarea
                value={recordedDraft}
                onChange={(e) => {
                  setRecordedDraft(e.target.value);
                  recordedDraftRef.current = e.target.value;
                }}
                rows={2}
                placeholder="What you spoke will appear here, or you can type directly..."
                className="w-full rounded-xl border border-line bg-surface/30 p-3 text-[13px] text-ink outline-none focus:border-accent focus:bg-white"
              />
            </div>

            {/* Enhanced Message Preview */}
            {enhancedText && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3.5 space-y-1">
                <span className="text-[11px] font-semibold text-emerald-900 uppercase tracking-wider block">
                  Gemini AI Refined Version:
                </span>
                <p className="text-[13px] text-emerald-950 font-medium leading-relaxed font-urdu">
                  {enhancedText}
                </p>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-line">
              <button
                type="button"
                onClick={() => {
                  stopVoiceRecording();
                  setShowVoiceModal(false);
                }}
                className={buttonStyles({ variant: "secondary", size: "sm", className: "cursor-pointer" })}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSendEnhancedVoiceNote}
                disabled={!recordedDraft.trim() && !enhancedText.trim()}
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
