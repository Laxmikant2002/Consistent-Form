# PaySync – Eventually Consistent Payment Form

**TypeScript + Zustand app with state machines, retry logic, and idempotency.**

## 🚀 Live Demo

[https://eventual-consistent-form.vercel.app/](https://eventual-consistent-form.vercel.app/)

## 📦 Installation & Running

```bash
npm install
npm run dev      # Dev server at http://localhost:5174
npm run build    # Production build
```

## ✨ Key Features

- **State Machine**: idle → pending → success/failed with retry logic
- **Retry Logic**: Automatic retries on 503 errors (up to 3 attempts)
- **Idempotency**: Prevents duplicate submissions with unique request IDs
- **Mock API**: Simulates real-world payment scenarios (40% success, 30% 503, 30% delayed)

## 🛠 Tech Stack

- React 19 + TypeScript
- Zustand for state management
- Vite for build tooling
