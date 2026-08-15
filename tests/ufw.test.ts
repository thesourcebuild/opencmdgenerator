import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type UfwSpec } from "@cmdgen/ufw";

const line = (spec: UfwSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<UfwSpec> = {}): UfwSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("modes", () => {
  it("a spec with nothing set renders the default status mode as a bare word", () => {
    expect(line(spec())).toBe("ufw status");
  });

  it("enable and disable each render as a single bare word", () => {
    expect(line(spec({ mode: "enable" }))).toBe("ufw enable");
    expect(line(spec({ mode: "disable" }))).toBe("ufw disable");
  });

  it("allow with a protocol renders mode + PORT/PROTOCOL as one token", () => {
    expect(line(spec({ mode: "allow", port: "22", protocol: "tcp" }))).toBe("ufw allow 22/tcp");
  });

  it("deny with protocol udp renders mode + PORT/PROTOCOL", () => {
    expect(line(spec({ mode: "deny", port: "53", protocol: "udp" }))).toBe("ufw deny 53/udp");
  });

  it("protocol 'any' omits the protocol suffix, using the bare port", () => {
    expect(line(spec({ mode: "allow", port: "8080", protocol: "any" }))).toBe("ufw allow 8080");
  });

  it("deleteAllow renders the two-word 'delete allow' form followed by the port token", () => {
    expect(line(spec({ mode: "deleteAllow", port: "22", protocol: "tcp" }))).toBe("ufw delete allow 22/tcp");
  });

  it("allow with an empty port omits the port token entirely", () => {
    expect(line(spec({ mode: "allow", port: "" }))).toBe("ufw allow");
  });

  it("trims whitespace from the port before combining it with the protocol", () => {
    expect(line(spec({ mode: "allow", port: "  22  ", protocol: "tcp" }))).toBe("ufw allow 22/tcp");
  });
});

describe("lint", () => {
  it("UFW001 catches an empty port on allow or deny", () => {
    expect(lint(spec({ mode: "allow", port: "" })).diagnostics.map((d) => d.code)).toContain("UFW001");
    expect(lint(spec({ mode: "deny", port: "" })).diagnostics.map((d) => d.code)).toContain("UFW001");
  });

  it("UFW001 catches a whitespace-only port on deleteAllow", () => {
    expect(lint(spec({ mode: "deleteAllow", port: "   " })).diagnostics.map((d) => d.code)).toContain("UFW001");
  });

  it("UFW001 does not fire for enable, disable, or status regardless of port", () => {
    expect(lint(spec({ mode: "enable", port: "" })).diagnostics.map((d) => d.code)).not.toContain("UFW001");
    expect(lint(spec({ mode: "disable", port: "" })).diagnostics.map((d) => d.code)).not.toContain("UFW001");
    expect(lint(spec({ mode: "status", port: "" })).diagnostics.map((d) => d.code)).not.toContain("UFW001");
  });

  it("a fully specified allow rule has no diagnostics", () => {
    expect(lint(spec({ mode: "allow", port: "22", protocol: "tcp" })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Enable the firewall'", () => {
    expect(line(getPreset("enable-firewall")!.apply(spec()))).toBe("ufw enable");
  });

  it("'Allow SSH'", () => {
    expect(line(getPreset("allow-ssh")!.apply(spec()))).toBe("ufw allow 22/tcp");
  });

  it("'Block a port'", () => {
    expect(line(getPreset("block-a-port")!.apply(spec()))).toBe("ufw deny 8080");
  });
});

describe("describeSpec", () => {
  it("describes enable, disable, and status", () => {
    expect(describeSpec(spec({ mode: "enable" }))).toBe("Turn the firewall on.");
    expect(describeSpec(spec({ mode: "disable" }))).toBe("Turn the firewall off.");
    expect(describeSpec(spec({ mode: "status" }))).toBe("Show the firewall's current status and rules.");
  });

  it("describes allow/deny with a protocol suffix, and deleteAllow as deleting a rule", () => {
    expect(describeSpec(spec({ mode: "allow", port: "22", protocol: "tcp" }))).toBe("Allow traffic on port 22/tcp.");
    expect(describeSpec(spec({ mode: "deny", port: "8080", protocol: "any" }))).toBe("Deny traffic on port 8080.");
    expect(describeSpec(spec({ mode: "deleteAllow", port: "22", protocol: "tcp" }))).toBe(
      "Delete the rule allowing port 22/tcp.",
    );
  });

  it("omits the protocol suffix when protocol is 'any'", () => {
    expect(describeSpec(spec({ mode: "allow", port: "8080", protocol: "any" }))).toBe("Allow traffic on port 8080.");
  });

  it("uses a SOME_PORT placeholder when port is empty for allow/deny/deleteAllow", () => {
    expect(describeSpec(spec({ mode: "allow", port: "" }))).toBe("Allow traffic on port SOME_PORT.");
    expect(describeSpec(spec({ mode: "deny", port: "" }))).toBe("Deny traffic on port SOME_PORT.");
    expect(describeSpec(spec({ mode: "deleteAllow", port: "" }))).toBe("Delete the rule allowing port SOME_PORT.");
  });
});
