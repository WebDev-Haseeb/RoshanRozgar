import { rtdb, auth } from "./firebase";
import { ref, push, set, onValue, off, serverTimestamp, query, limitToLast } from "firebase/database";

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "customer" | "worker";
  text: string;
  isVoice?: boolean;
  voiceUrl?: string;
  aiEnhanced?: boolean;
  timestamp: number;
}

export interface ConversationSummary {
  id: string;
  workerId: string;
  workerName: string;
  workerTrade: string;
  customerId: string;
  customerName: string;
  lastMessage: string;
  lastTimestamp: number;
  sector: string;
  unreadCount?: number;
}

/**
 * Send a message to Firebase Realtime Database
 */
export async function sendMessage(
  chatId: string,
  message: {
    senderId: string;
    senderName: string;
    senderRole: "customer" | "worker";
    text: string;
    isVoice?: boolean;
    voiceUrl?: string;
    aiEnhanced?: boolean;
  }
): Promise<ChatMessage> {
  const newMsg: ChatMessage = {
    id: Date.now().toString(),
    ...message,
    timestamp: Date.now(),
  };

  try {
    const messagesRef = ref(rtdb, `chats/${chatId}/messages`);
    const newRef = push(messagesRef);
    newMsg.id = newRef.key || newMsg.id;

    await set(newRef, {
      ...newMsg,
      serverTime: serverTimestamp(),
    });

    // Also update conversation metadata
    const metaRef = ref(rtdb, `chats/${chatId}/meta`);
    await set(metaRef, {
      lastMessage: newMsg.text,
      lastTimestamp: Date.now(),
      lastSenderId: newMsg.senderId,
    });
  } catch (err) {
    console.warn("RTDB write warning (using local optimistic sync):", err);
  }

  return newMsg;
}

/**
 * Subscribe to real-time chat messages from Firebase Realtime Database
 */
export function subscribeToMessages(
  chatId: string,
  callback: (messages: ChatMessage[]) => void
): () => void {
  const messagesRef = query(ref(rtdb, `chats/${chatId}/messages`), limitToLast(100));

  const unsubscribe = onValue(
    messagesRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const list: ChatMessage[] = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
          timestamp: data[key].timestamp || Date.now(),
        }));
        list.sort((a, b) => a.timestamp - b.timestamp);
        callback(list);
      } else {
        callback([]);
      }
    },
    (error) => {
      console.warn("RTDB listener warning:", error);
    }
  );

  return () => {
    off(messagesRef);
  };
}
