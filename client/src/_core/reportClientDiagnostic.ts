export function reportClientDiagnostic(
  type: string,
  message: string,
  context?: unknown
) {
  if (typeof window === "undefined") return;

  try {
    const safeContext =
      context === undefined
        ? undefined
        : JSON.stringify(context, (_key, value) =>
            typeof value === "string" && value.length > 800
              ? value.slice(0, 800)
              : value
          ).slice(0, 4000);

    void fetch("/api/trpc/dashboard.reportClientDiagnostic?batch=1", {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        0: {
          json: {
            type: type.slice(0, 64),
            message: message.slice(0, 4000),
            route: window.location.pathname,
            context: safeContext,
          },
        },
      }),
    }).catch(() => undefined);
  } catch {
    // Diagnostics must never interfere with the application.
  }
}
