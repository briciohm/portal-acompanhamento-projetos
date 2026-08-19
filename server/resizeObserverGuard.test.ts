import { describe, expect, it } from "vitest";
import { isResizeObserverWarning } from "../client/src/_core/resizeObserverGuard";

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
