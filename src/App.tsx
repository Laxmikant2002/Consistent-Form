import { usePaymentStore } from "./store/paymentStore";

const MAX_RETRIES = 3;

function App() {
  const {
    email,
    amount,
    status,
    retryCount,
    submissions,
    setEmail,
    setAmount,
    submit,
    reset,
  } = usePaymentStore();

  const isBusy = status === "pending" || status === "retrying";
  const emailValid = !email || email.includes("@");
  const amountValid = !amount || Number(amount) > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailValid || !amountValid) return;
    submit();
  };

  const getButtonText = () => {
    if (status === "pending") return "Processing…";
    if (status === "retrying") return "Retrying…";
    if (status === "success") return "Done ✓";
    if (status === "failed") return "Try Again";
    return "Submit Payment";
  };

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f9fafb",
          padding: 20,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            background: "white",
            borderRadius: 12,
            boxShadow:
              "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
            padding: 32,
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <img
              src="/logo.png"
              alt="PaySync Logo"
              style={{
                width: 64,
                height: 64,
                marginBottom: 16,
                display: "inline-block",
              }}
            />
            <h1
              style={{
                fontSize: 28,
                fontWeight: 700,
                marginBottom: 8,
                color: "#111",
              }}
            >
              PaySync
            </h1>
            <p style={{ color: "#6b7280", fontSize: 14, opacity: 0.8 }}>
              Eventually consistent payment form
            </p>
          </div>

          <StatusBadge status={status} retryCount={retryCount} />

          <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontWeight: 600,
                  fontSize: 14,
                  color: "#374151",
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={isBusy}
                onFocus={(e) =>
                  !isBusy && (e.target.style.borderColor = "#3b82f6")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = !emailValid
                    ? "#ef4444"
                    : "#e5e7eb")
                }
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 8,
                  border: `2px solid ${!emailValid ? "#ef4444" : "#e5e7eb"}`,
                  fontSize: 15,
                  transition: "all 0.2s",
                  outline: "none",
                  opacity: isBusy ? 0.6 : 1,
                  backgroundColor: "#ffffff",
                }}
              />
              {!emailValid && (
                <p style={{ color: "#ef4444", fontSize: 13, marginTop: 6 }}>
                  Please enter a valid email
                </p>
              )}
            </div>

            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontWeight: 600,
                  fontSize: 14,
                  color: "#374151",
                }}
              >
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100"
                min={0}
                step="0.01"
                required
                disabled={isBusy}
                onFocus={(e) =>
                  !isBusy && (e.target.style.borderColor = "#3b82f6")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = !amountValid
                    ? "#ef4444"
                    : "#e5e7eb")
                }
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 8,
                  border: `2px solid ${!amountValid ? "#ef4444" : "#e5e7eb"}`,
                  fontSize: 15,
                  transition: "all 0.2s",
                  outline: "none",
                  opacity: isBusy ? 0.6 : 1,
                  backgroundColor: "#ffffff",
                }}
              />
              {!amountValid && (
                <p style={{ color: "#ef4444", fontSize: 13, marginTop: 6 }}>
                  Amount must be greater than 0
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isBusy || status === "success"}
              onMouseEnter={(e) => {
                if (!isBusy && status !== "success") {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(59, 130, 246, 0.3)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
              style={{
                width: "100%",
                padding: "14px 20px",
                borderRadius: 8,
                border: "none",
                background:
                  status === "success"
                    ? "#10b981"
                    : isBusy
                      ? "#9ca3af"
                      : status === "failed"
                        ? "#ef4444"
                        : "#3b82f6",
                color: "white",
                fontWeight: 600,
                cursor:
                  isBusy || status === "success" ? "not-allowed" : "pointer",
                fontSize: 15,
                transition: "all 0.2s",
              }}
            >
              {getButtonText()}
            </button>

            {(status === "success" || status === "failed") && (
              <button
                type="button"
                onClick={reset}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#3b82f6";
                  e.currentTarget.style.color = "#3b82f6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  e.currentTarget.style.color = "#374151";
                }}
                style={{
                  width: "100%",
                  marginTop: 12,
                  padding: "12px 20px",
                  borderRadius: 8,
                  border: "2px solid #e5e7eb",
                  background: "white",
                  color: "#374151",
                  fontWeight: 500,
                  cursor: "pointer",
                  fontSize: 14,
                  transition: "all 0.2s",
                }}
              >
                Submit Another
              </button>
            )}
          </form>

          {submissions.length > 0 && (
            <div
              style={{
                marginTop: 32,
                paddingTop: 24,
                borderTop: "1px solid #e5e7eb",
              }}
            >
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  marginBottom: 16,
                  color: "#374151",
                }}
              >
                Recent Submissions ({submissions.length})
              </h2>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {submissions.slice(0, 3).map((record) => (
                  <div
                    key={record.requestId}
                    style={{
                      padding: 14,
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      background: "#f9fafb",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 6,
                      }}
                    >
                      <strong style={{ fontSize: 14, color: "#111" }}>
                        {record.email}
                      </strong>
                      <span
                        style={{
                          color: "#10b981",
                          fontWeight: 700,
                          fontSize: 14,
                        }}
                      >
                        ${record.amount}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>
                      {new Date(record.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function StatusBadge({
  status,
  retryCount,
}: {
  status: string;
  retryCount: number;
}) {
  const configs: Record<
    string,
    { bg: string; color: string; icon: string; label: string }
  > = {
    idle: {
      bg: "#f3f4f6",
      color: "#6b7280",
      icon: "○",
      label: "Waiting for input",
    },
    pending: {
      bg: "#dbeafe",
      color: "#1e40af",
      icon: "◐",
      label: "Processing payment…",
    },
    retrying: {
      bg: "#fef3c7",
      color: "#92400e",
      icon: "⟳",
      label: `Temporary issue. Retrying (${retryCount} / ${MAX_RETRIES})`,
    },
    success: {
      bg: "#d1fae5",
      color: "#065f46",
      icon: "✓",
      label: "Payment successful",
    },
    failed: {
      bg: "#fee2e2",
      color: "#991b1b",
      icon: "✗",
      label: "Payment failed",
    },
  };

  const config = configs[status] || configs.idle;
  const isAnimated = status === "pending" || status === "retrying";

  return (
    <div
      className={isAnimated ? "pulse" : ""}
      style={{
        padding: "14px 16px",
        borderRadius: 8,
        background: config.bg,
        border: `1px solid ${config.color}33`,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <span
        className={status === "pending" ? "spin" : ""}
        style={{
          fontSize: 18,
          color: config.color,
          fontWeight: 700,
          display: "inline-block",
        }}
      >
        {config.icon}
      </span>
      <span
        style={{
          color: config.color,
          fontWeight: 600,
          fontSize: 14,
          flex: 1,
        }}
      >
        {config.label}
      </span>
    </div>
  );
}

export default App;
