import { trpc } from "@/lib/trpc";
import { COOKIE_NAME, UNAUTHED_ERR_MSG } from '@shared/const';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import { startLogin } from "./const";
import "./index.css";
import { containsResizeObserverWarning, isResizeObserverWarning } from "./_core/resizeObserverGuard";
import { normalizeClientError } from "./_core/clientErrorGuard";
import { installDomRemovalGuard } from "./_core/domRecovery";

installDomRemovalGuard();

const queryClient = new QueryClient();

const reportClientDiagnostic = (type: string, message: string, context?: unknown) => {
  if (typeof window === "undefined") return;
  try {
    const safeContext = context === undefined ? undefined : JSON.stringify(context, (_key, value) => typeof value === "string" && value.length > 800 ? value.slice(0, 800) : value).slice(0, 4000);
    void fetch("/api/trpc/dashboard.reportClientDiagnostic?batch=1", {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ 0: { json: { type, message: message.slice(0, 4000), route: window.location.pathname, context: safeContext } } }),
    }).catch(() => undefined);
  } catch {
    // Diagnostics must never interfere with the application.
  }
};

// Chromium can emit this notification when a ResizeObserver callback causes
// another layout pass in the same frame. It is not an application exception,
// but the dev overlay may promote it to a fatal screen. Suppress only this
// known browser warning and leave all other errors untouched.
if (typeof window !== "undefined") {
  const originalConsoleError = console.error.bind(console);
  console.error = (...args: unknown[]) => {
    if (containsResizeObserverWarning(args)) return;
    originalConsoleError(...args);
  };

  window.addEventListener(
    "error",
    event => {
      if (isResizeObserverWarning(event.message)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }

      // Preserve real client errors in the console with a clear diagnostic prefix.
      // The event is intentionally not canceled, so the development overlay still
      // reports the original exception to the administrator.
      const clientError = normalizeClientError(event.error, event.message);
      if (clientError) {
        originalConsoleError("[Client Error]", clientError);
        reportClientDiagnostic("client-error", clientError instanceof Error ? clientError.message : clientError);
      }
    },
    true,
  );

  window.addEventListener("unhandledrejection", event => {
    const rejection = normalizeClientError(event.reason);
    if (rejection) {
      originalConsoleError("[Unhandled Promise Rejection]", rejection);
      reportClientDiagnostic("unhandled-rejection", rejection instanceof Error ? rejection.message : rejection);
    }
  });
}

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;

  if (!isUnauthorized) return;

  startLogin();
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Query Error]", error);
    reportClientDiagnostic("api-query-error", error instanceof Error ? error.message : String(error));
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Mutation Error]", error);
    reportClientDiagnostic("api-mutation-error", error instanceof Error ? error.message : String(error));
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      headers() {
        // Preview auto-login fallback: when the browser blocks iframe cookies
        // (Safari ITP / private browsing / WebView), the runtime mirrors the
        // session into sessionStorage so we can forward it as a Bearer token.
        // The regular OAuth cookie flow keeps working and takes priority server-side.
        try {
          const raw = sessionStorage.getItem("manus-cookie");
          if (raw) {
            const prefix = `${COOKIE_NAME}=`;
            const pair = raw.split(";").find(s => s.trim().startsWith(prefix));
            const token = pair?.trim().slice(prefix.length);
            if (token) {
              return { Authorization: `Bearer ${token}` };
            }
          }
        } catch {
          // sessionStorage unavailable
        }
        return {};
      },
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
);
