"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, sans-serif",
          background: "#FAFAFB",
          color: "#16161D",
        }}
      >
        <div style={{ maxWidth: 480, margin: "80px auto", padding: "0 24px" }}>
          <h1 style={{ fontSize: 20, marginBottom: 8 }}>Application error</h1>
          <p style={{ color: "#5B5B6B", fontSize: 14, lineHeight: 1.5 }}>
            {error.message.includes("module factory is not available")
              ? "Clear your browser cache and hard-reload. If the problem persists, run npm run cache:reset and restart the dev server."
              : error.message}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              marginTop: 16,
              padding: "8px 14px",
              borderRadius: 6,
              border: "none",
              background: "#6D4AFF",
              color: "#fff",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
