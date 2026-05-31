"use client";

import { useEffect, useState } from "react";

interface ResendCountdownProps {
  onResend: () => void;
}

export function ResendCountdown({ onResend }: ResendCountdownProps) {
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const done = seconds <= 0;

  return (
    <p className="text-center mt-3" style={{ fontSize: "var(--fs-caption)", color: "var(--text-subtle)" }}>
      Didn&apos;t receive it? Check spam, or{" "}
      <button
        type="button"
        onClick={() => {
          if (!done) return;
          setSeconds(60);
          onResend();
        }}
        disabled={!done}
        className="font-medium transition-colors duration-120"
        style={{
          color: done ? "var(--accent)" : "var(--text-subtle)",
          cursor: done ? "pointer" : "default",
          background: "none",
          border: "none",
          padding: 0,
        }}
      >
        {done ? (
          "resend now"
        ) : (
          <>
            try again in{" "}
            <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
              {seconds}s
            </span>
          </>
        )}
      </button>
    </p>
  );
}
