export function isDomRemovalError(error: unknown): boolean {
  if (!error) return false;
  const value = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  return /NotFoundError/i.test(value) && /removeChild|not a child of this node/i.test(value);
}

const RECOVERY_KEY = "dpat-dom-recovery-attempt";

export function recoverFromDomRemovalError(error: unknown): boolean {
  if (typeof window === "undefined" || !isDomRemovalError(error)) return false;
  try {
    if (sessionStorage.getItem(RECOVERY_KEY) === "1") return false;
    sessionStorage.setItem(RECOVERY_KEY, "1");
    window.location.reload();
    return true;
  } catch {
    return false;
  }
}

export function clearDomRecoveryMarker(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(RECOVERY_KEY);
  } catch {
    // sessionStorage may be unavailable; recovery remains best effort.
  }
}

export const DOM_RECOVERY_KEY = RECOVERY_KEY;
