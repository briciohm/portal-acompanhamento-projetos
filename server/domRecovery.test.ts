import { describe, expect, it } from "vitest";
import { isDomRemovalError } from "../client/src/_core/domRecovery";

describe("DOM removal recovery guard", () => {
  it("identifies the Chromium removeChild error", () => {
    expect(isDomRemovalError(new NotFoundError("Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node."))).toBe(true);
  });

  it("does not suppress unrelated errors", () => {
    expect(isDomRemovalError(new Error("Database request failed"))).toBe(false);
    expect(isDomRemovalError(new Error("removeChild failed"))).toBe(false);
  });
});

class NotFoundError extends Error {
  name = "NotFoundError";
}
