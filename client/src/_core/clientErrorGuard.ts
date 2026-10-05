export function normalizeClientError(
  error: unknown,
  message?: string | null
): string | Error | null {
  if (error instanceof Error) return error;
  if (typeof error === "string" && error.trim()) return error.trim();
  if (typeof message === "string" && message.trim()) return message.trim();
  if (error !== null && error !== undefined) {
    try {
      const serialized = JSON.stringify(error);
      return serialized && serialized !== "{}" ? serialized : null;
    } catch {
      return null;
    }
  }
  return null;
}
