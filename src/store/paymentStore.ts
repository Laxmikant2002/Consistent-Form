import { create } from "zustand";
import { mockPaymentApi } from "../api/mockApi";
import { PaymentStatus, SubmissionRecord } from "../types";

interface PaymentState {
  email: string;
  amount: string;
  status: PaymentStatus;
  retryCount: number;
  requestId: string | null;
  submissions: SubmissionRecord[];

  setEmail: (email: string) => void;
  setAmount: (amount: string) => void;
  submit: () => void;
  reset: () => void;
}

const MAX_RETRIES = 3;

export const usePaymentStore = create<PaymentState>((set, get) => ({
  email: "",
  amount: "",
  status: "idle",
  retryCount: 0,
  requestId: null,
  submissions: [],

  setEmail: (email) => set({ email }),
  setAmount: (amount) => set({ amount }),

  reset: () => set({ status: "idle", retryCount: 0, requestId: null }),

  submit: async () => {
    const { status, retryCount, email, amount, requestId, submissions } = get();

    if (status === "pending" || status === "retrying") return;
    if (!email || !amount) return;

    const id = requestId ?? crypto.randomUUID();
    const numAmount = Number(amount);

    set({
      status: "pending",
      requestId: id,
      retryCount: requestId ? retryCount : 0,
    });

    try {
      await mockPaymentApi({ requestId: id, email, amount: numAmount });

      const alreadyRecorded = submissions.some((s) => s.requestId === id);
      if (!alreadyRecorded) {
        set({
          status: "success",
          submissions: [
            {
              requestId: id,
              email,
              amount: numAmount,
              timestamp: new Date().toISOString(),
              status: "success",
            },
            ...submissions,
          ],
        });
      } else {
        set({ status: "success" });
      }
    } catch (error: any) {
      if (error?.status === 503 && retryCount + 1 < MAX_RETRIES) {
        set({
          status: "retrying",
          retryCount: retryCount + 1,
        });
        setTimeout(() => get().submit(), 2000 * (retryCount + 1));
      } else {
        set({ status: "failed" });
      }
    }
  },
}));
