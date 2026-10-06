import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");

function readProjectFile(relativePath: string) {
  return readFileSync(resolve(projectRoot, relativePath), "utf8");
}

describe("login screen contract", () => {
  it("registers a dedicated login route", () => {
    const app = readProjectFile("client/src/App.tsx");
    expect(app).toContain('<Route path="/login" component={Login} />');
  });

  it("starts OAuth only from the login action", () => {
    const login = readProjectFile("client/src/pages/Login.tsx");
    expect(login).toContain("onClick={() => startLogin()}");
    expect(login).toContain("Sessão identificada");
  });

  it("renders the authenticated profile contract", () => {
    const login = readProjectFile("client/src/pages/Login.tsx");
    const shell = readProjectFile("client/src/components/PortalShell.tsx");
    expect(login).toContain("profileOfUser(user)");
    expect(login).toContain("USER_PROFILE_LABELS[profile]");
    expect(shell).toContain("USER_PROFILE_LABELS[profileOfUser(user)]");
  });

  it("audits both authentication events", () => {
    const oauth = readProjectFile("server/_core/oauth.ts");
    const router = readProjectFile("server/routers.ts");
    const schema = readProjectFile("drizzle/schema.ts");
    expect(oauth).toContain('event: "login"');
    expect(oauth).toContain("recordAuthAudit");
    expect(router).toContain('event: "logout"');
    expect(router).toContain("recordAuthAudit");
    expect(schema).toContain('mysqlTable("auth_audit_logs"');
  });
});
