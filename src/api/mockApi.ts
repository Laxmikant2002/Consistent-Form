import { PaymentPayload } from "../types";

const inflight = new Map<string, Promise<{ status: 200 }>>();

export function mockPaymentApi(
  payload: PaymentPayload,
): Promise<{ status: 200 }> {
  const existing = inflight.get(payload.requestId);
  if (existing) return existing;

  const rand = Math.random();

  if (rand < 0.4) {
    const result = new Promise<{ status: 200 }>((resolve) => {
      setTimeout(() => resolve({ status: 200 }), 1000);
    });
    inflight.set(payload.requestId, result);
    return result;
  }

  if (rand < 0.7) {
    return new Promise((_, reject) => {
      setTimeout(() => reject({ status: 503 }), 1000);
    });
  }

  const delayed = new Promise<{ status: 200 }>((resolve) => {
    setTimeout(() => resolve({ status: 200 }), 7000);
  });
  inflight.set(payload.requestId, delayed);
  return delayed;
}
