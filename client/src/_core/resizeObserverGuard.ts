export function isResizeObserverWarning(message: string | null | undefined) {
  const normalized = message?.trim() ?? "";
  return (
    normalized.startsWith("ResizeObserver loop completed with undelivered notifications") ||
    normalized.startsWith("ResizeObserver loop limit exceeded")
  );
}

export function containsResizeObserverWarning(values: unknown[]) {
  return values.some(value => isResizeObserverWarning(typeof value === "string" ? value : String(value ?? "")));
}
