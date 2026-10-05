import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");

function readClientFile(relativePath: string) {
  return readFileSync(resolve(projectRoot, relativePath), "utf8");
}

describe("DOM stability safeguards", () => {
  it("keeps Select content inline instead of mounting a body portal", () => {
    const source = readClientFile("client/src/components/ui/select.tsx");
    expect(source).not.toContain("<SelectPrimitive.Portal>");
    expect(source).toContain("<SelectPrimitive.Content");
  });

  it("keeps tab panels mounted during administrative navigation", () => {
    const source = readClientFile("client/src/components/ui/tabs.tsx");
    expect(source).toContain("forceMount");
  });

  it("does not install or import the previous global removeChild guard", () => {
    const main = readClientFile("client/src/main.tsx");
    const boundary = readClientFile("client/src/components/ErrorBoundary.tsx");
    expect(main).not.toContain("domRecovery");
    expect(boundary).not.toContain("domRecovery");
  });

  it("keeps the mutation toaster local to Admin instead of globally mounted", () => {
    const app = readClientFile("client/src/App.tsx");
    const admin = readClientFile("client/src/pages/Admin.tsx");
    expect(app).not.toContain("<Toaster");
    expect(admin).toContain('import { Toaster } from "@/components/ui/sonner"');
    expect(admin).toContain('<Toaster position="top-right" richColors />');
  });
});
