const RECOVERY_KEY = "dpat-dom-recovery-attempt";
const GUARD_KEY = "__dpatRemoveChildGuardInstalled";

type RemoveChild = <T extends Node>(child: T) => T;

export function isDomRemovalError(error: unknown): boolean {
  if (!error) return false;
  const value = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  return /NotFoundError/i.test(value) && /removeChild|not a child of this node/i.test(value);
}

export function installDomRemovalGuard(): void {
  if (typeof Node === "undefined") return;
  const nodePrototype = Node.prototype as Node & { [GUARD_KEY]?: boolean };
  if (nodePrototype[GUARD_KEY]) return;

  const nativeRemoveChild = nodePrototype.removeChild as RemoveChild;
  nodePrototype.removeChild = function guardedRemoveChild<T extends Node>(this: Node, child: T): T {
    // A browser extension, password manager, translator, or other external DOM
    // actor may have already removed the node. React's cleanup is idempotent in
    // intent, so treat that exact case as successful and preserve real failures.
    if (child.parentNode !== this) return child;
    return nativeRemoveChild.call(this, child) as T;
  } as RemoveChild;

  Object.defineProperty(nodePrototype, GUARD_KEY, { configurable: false, value: true });
}

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
