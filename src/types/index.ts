export type UserRole = "customer" | "worker";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  profileImage?: string;
  createdAt: number;
}

export type AvailabilityStatus = "available" | "busy" | "offline";

export interface WorkerProfile {
  workerId: string;
  trade: string;
  skills: string[];
  experience: number; // in years
  description: string;
  serviceLocation: string;
  latitude?: number;
  longitude?: number;
  availability: AvailabilityStatus;
  averageRating: number;
  totalReviews: number;
  completedJobs: number;
  visitFee?: number;
}

export type JobStatus =
  | "requested"
  | "quoted"
  | "booked"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Job {
  jobId: string;
  customerId: string;
  trade: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  preferredTime?: string;
  imageUrl?: string;
  status: JobStatus;
  createdAt: number;
}

export type QuotationStatus = "pending" | "accepted" | "rejected";

export interface Quotation {
  quotationId: string;
  jobId: string;
  workerId: string;
  customerId: string;
  proposedPrice: number;
  description: string;
  estimatedDuration?: string;
  status: QuotationStatus;
  createdAt: number;
}

export type BookingStatus = "confirmed" | "in_progress" | "completed" | "cancelled";

export interface Booking {
  bookingId: string;
  jobId: string;
  customerId: string;
  workerId: string;
  quotationId: string;
  agreedPrice: number;
  status: BookingStatus;
  createdAt: number;
  completedAt?: number;
}

export interface Conversation {
  conversationId: string;
  customerId: string;
  workerId: string;
  lastMessage?: string;
  updatedAt: number;
}

export type MessageType = "text" | "voice" | "image" | "quote_proposal";

export interface Message {
  messageId: string;
  conversationId: string;
  senderId: string;
  message: string;
  messageType: MessageType;
  audioUrl?: string;
  imageUrl?: string;
  createdAt: number;
}

export interface Review {
  reviewId: string;
  bookingId: string;
  customerId: string;
  workerId: string;
  rating: number;
  comment: string;
  voiceUrl?: string;
  badges?: string[];
  createdAt: number;
}
