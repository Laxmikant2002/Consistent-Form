export type PaymentStatus =
  | "idle"
  | "pending"
  | "retrying"
  | "success"
  | "failed";

export interface PaymentPayload {
  requestId: string;
  email: string;
  amount: number;
}

export interface SubmissionRecord {
  requestId: string;
  email: string;
  amount: number;
  timestamp: string;
  status: "success";
}
