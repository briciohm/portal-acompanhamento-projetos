function toErrorMessage(value: unknown) {
  if (typeof value === "string") return value.trim();
  if (value instanceof Error) return value.message.trim();
  if (value && typeof value === "object" && "message" in value) {
    const message = (value as { message?: unknown }).message;
    return typeof message === "string" ? message.trim() : "";
  }
  return "";
}

export function isResizeObserverWarning(message: unknown) {
  const normalized = toErrorMessage(message);
  return (
    normalized.startsWith("ResizeObserver loop completed with undelivered notifications") ||
    normalized.startsWith("ResizeObserver loop limit exceeded")
  );
}

export function containsResizeObserverWarning(values: unknown[]) {
  return values.some(value => isResizeObserverWarning(value));
}
