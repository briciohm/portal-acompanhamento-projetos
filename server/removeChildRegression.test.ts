import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const read = (relativePath: string) =>
  readFileSync(resolve(projectRoot, relativePath), "utf8");

describe("removeChild regression safeguards", () => {
  it("uses explicit conditional Admin panels instead of Radix Presence", () => {
    const admin = read("client/src/pages/Admin.tsx");
    expect(admin).not.toContain('from "@/components/ui/tabs"');
    expect(admin).toContain("function AdminPanel");
    expect(admin).toContain("if (activeTab !== value) return null");
    expect(admin).toContain("const [governanceTab, setGovernanceTab]");
  });

  it("keeps the Select content in the React-owned tree", () => {
    const select = read("client/src/components/ui/select.tsx");
    expect(select).not.toContain("SelectPrimitive.Portal");
    expect(select).toContain("<SelectPrimitive.Content");
  });

  it("keeps the global error boundary free of DOM monkey patches", () => {
    const main = read("client/src/main.tsx");
    const boundary = read("client/src/components/ErrorBoundary.tsx");
    expect(main).not.toContain("removeChild =");
    expect(boundary).not.toContain("removeChild =");
    expect(main).not.toContain("window.location.reload()");
  });

  it("reports React boundary failures to the real diagnostics panel", () => {
    const boundary = read("client/src/components/ErrorBoundary.tsx");
    const reporter = read("client/src/_core/reportClientDiagnostic.ts");
    expect(boundary).toContain("componentDidCatch");
    expect(boundary).toContain('reportClientDiagnostic("react-error-boundary"');
    expect(boundary).toContain("componentStack");
    expect(reporter).toContain("dashboard.reportClientDiagnostic");
  });
});
