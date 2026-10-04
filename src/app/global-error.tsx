"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{ padding: 40, textAlign: "center", fontFamily: "sans-serif" }}>
          <h2>Une erreur s'est produite.</h2>
          <button onClick={() => reset()} style={{ padding: "10px 20px", marginTop: 20 }}>
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
