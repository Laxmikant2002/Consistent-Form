# PaySync – Eventually Consistent Payment Form

**Interview-grade TypeScript + Zustand app demonstrating state machines, retry logic, and idempotency.**

## 🎯 Architecture

### State Machine

```
idle → pending → success
idle → pending → retrying → pending (max 3 attempts)
retrying → failed
```

### Tech Stack

- **React 19** + **TypeScript** – Type-safe UI
- **Zustand** – Centralized state management
- **Vite** – Fast build tooling
- **Mock API** – Simulates 40% success, 30% 503, 30% delayed (7s)

## 🚀 Running the App

```bash
npm install
npm run dev      # Dev server at http://localhost:5174
npm run build    # Production build
npm run preview  # Serve production build
```

## 📁 Project Structure

```
src/
├── api/
│   └── mockApi.ts          # Mock payment API with idempotency
├── store/
│   └── paymentStore.ts     # Zustand state machine
├── types.ts                # TypeScript type definitions
├── App.tsx                 # Main UI component
└── main.tsx                # App entry point
```

## 🔑 Key Features

### ✅ Idempotency

- Each submission generates a unique `requestId` via `crypto.randomUUID()`
- Retries reuse the same `requestId` to prevent duplicate charges
- API caches successful responses per `requestId`

### ✅ Retry Logic

- On **503 errors**, automatically retry up to 3 times
- **Exponential backoff**: 2s, 4s, 6s delays
- Clear UI feedback: "Temporary issue. Retrying (2 / 3)"

### ✅ State Management

- **Zustand store** handles all state transitions
- No prop drilling or scattered state
- Deterministic and testable

### ✅ Duplicate Prevention

- Form disables during `pending` and `retrying` states
- Submissions deduplicated by `requestId`
- Only displays unique records in submissions list

## 🎨 UI/UX Highlights

### High-Impact Improvements

- ✅ **Centered card layout** – Professional, balanced design
- ✅ **Status badges** – Color-coded with icons (idle/pending/retrying/success/failed)
- ✅ **Dynamic button text** – "Processing…", "Retrying…", "Done ✓", "Try Again"
- ✅ **Pulse animation** – Visual feedback during async operations
- ✅ **Input validation** – Real-time feedback for invalid email/amount

### UX Clarity

- ✅ **Retry transparency** – "Temporary issue. Retrying (2 / 3)"
- ✅ **Locked inputs** – Prevents state divergence during submission
- ✅ **Validation feedback** – Red borders + helper text for errors
- ✅ **Recent submissions** – Shows last 3 successful payments

## 🧪 Testing Scenarios

1. **Immediate success** (40% chance)
   - Submit → "Processing…" (~1s) → "Done ✓"
2. **503 with retries** (30% chance)
   - Submit → "Processing…" → "Retrying (1/3)" → "Retrying (2/3)" → Success/Failed
3. **Delayed success** (30% chance)
   - Submit → "Processing…" (~7s) → "Done ✓"

## 🎤 Interview Talking Points

### Architecture

> "I modeled the payment flow as a **deterministic state machine** with 5 states. Each submission generates a client-side `requestId` for idempotency. On 503 errors, it retries up to 3 times with exponential backoff while **preserving the same requestId**, ensuring the backend would never see duplicate transactions."

### State Management

> "I chose **Zustand over Redux** because it has zero boilerplate while still providing centralized, predictable state. The entire state machine logic lives in one store, making it easy to test and reason about."

### Duplicate Prevention

> "Duplicates are prevented at three levels: UI (form disabled), client (same `requestId` for retries), and API (cached responses). This mirrors how real payment systems work with idempotency keys."

### UX Design

> "The UI uses **status badges with animations** to provide clear feedback during async operations. Retry logic is transparent to users with messages like 'Temporary issue. Retrying (2/3)', which builds trust during network failures."

## 📊 State Diagram

```
┌──────┐   submit    ┌─────────┐   success   ┌─────────┐
│ idle │ ─────────> │ pending │ ──────────> │ success │
└──────┘             └─────────┘             └─────────┘
                          │
                          │ 503 (retry < 3)
                          ▼
                     ┌──────────┐
                     │ retrying │ ──┐
                     └──────────┘   │ retry
                          │         │
                          │◄────────┘
                          │
                          │ 503 (retry ≥ 3)
                          ▼
                     ┌────────┐
                     │ failed │
                     └────────┘
```

## 📝 Type Safety

All types are strictly defined:

```typescript
type PaymentStatus = "idle" | "pending" | "retrying" | "success" | "failed";

interface PaymentPayload {
  requestId: string;
  email: string;
  amount: number;
}

interface SubmissionRecord {
  requestId: string;
  email: string;
  amount: number;
  timestamp: string;
  status: "success";
}
```

## 🔐 Security Considerations

- Client-side `requestId` generation (production should use server-generated tokens)
- No sensitive data in localStorage
- HTTPS required for production (sensitive payment data)
- Rate limiting should be implemented server-side

## 🚧 Production Enhancements

For a real production system, add:

- Server-side idempotency key validation
- Webhook confirmations for async payment processing
- Proper error codes (not just 503)
- Circuit breaker pattern for API failures
- Logging/monitoring (Sentry, DataDog)
- Unit tests for state machine transitions
- E2E tests with Playwright/Cypress

---

**Built to demonstrate interview-grade architecture in 3–5 hours.**
