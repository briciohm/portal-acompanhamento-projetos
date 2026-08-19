import { describe, expect, it } from "vitest";
import { isResizeObserverWarning } from "../client/src/_core/resizeObserverGuard";
import { normalizeClientError } from "../client/src/_core/clientErrorGuard";

describe("isResizeObserverWarning", () => {
  it("recognizes the Chromium ResizeObserver warning variants", () => {
    expect(isResizeObserverWarning("ResizeObserver loop completed with undelivered notifications.")).toBe(true);
    expect(isResizeObserverWarning("ResizeObserver loop limit exceeded")).toBe(true);
  });

  it("does not suppress unrelated errors", () => {
    expect(isResizeObserverWarning("TypeError: failed to render admin form")).toBe(false);
    expect(isResizeObserverWarning(undefined)).toBe(false);
  });
});

describe("normalizeClientError", () => {
  it("keeps useful Error and message diagnostics", () => {
    const error = new Error("Falha no formulário");
    expect(normalizeClientError(error)).toBe(error);
    expect(normalizeClientError(undefined, "Falha no formulário")).toBe("Falha no formulário");
  });

  it("returns null for empty browser error events", () => {
    expect(normalizeClientError(undefined, undefined)).toBeNull();
    expect(normalizeClientError(null, "  ")).toBeNull();
  });
});
