import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type IptablesSpec } from "@cmdgen/iptables";

const line = (spec: IptablesSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<IptablesSpec> = {}): IptablesSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("action and chain", () => {
  it("renders -A for append, with the chain as a bare word", () => {
    expect(line(spec())).toBe("iptables -A INPUT -j ACCEPT");
  });

  it("renders -I for insert", () => {
    expect(line(spec({ chain: "FORWARD", action: "insert" }))).toBe("iptables -I FORWARD -j ACCEPT");
  });

  it("renders -D for delete", () => {
    expect(line(spec({ chain: "OUTPUT", action: "delete" }))).toBe("iptables -D OUTPUT -j ACCEPT");
  });
});

describe("protocol", () => {
  it("omits -p entirely when protocol is 'any'", () => {
    expect(line(spec({ protocol: "any" }))).not.toContain("-p");
  });

  it("renders -p tcp / -p udp when a real protocol is chosen", () => {
    expect(line(spec({ protocol: "tcp" }))).toBe("iptables -A INPUT -p tcp -j ACCEPT");
    expect(line(spec({ protocol: "udp" }))).toBe("iptables -A INPUT -p udp -j ACCEPT");
  });
});

describe("port", () => {
  it("omits --dport when port is empty", () => {
    expect(line(spec({ port: "" }))).not.toContain("--dport");
  });

  it("includes --dport, trimmed, when port is set", () => {
    expect(line(spec({ protocol: "tcp", port: " 22 " }))).toBe("iptables -A INPUT -p tcp --dport 22 -j ACCEPT");
  });

  it("still renders --dport when protocol is 'any' — IPTABLES001 flags this combination instead of hiding it", () => {
    expect(line(spec({ port: "53" }))).toBe("iptables -A INPUT --dport 53 -j ACCEPT");
  });
});

describe("source", () => {
  it("omits -s when source is empty", () => {
    expect(line(spec({ source: "" }))).not.toContain("-s ");
  });

  it("includes -s, trimmed, when source is set", () => {
    expect(line(spec({ source: " 1.2.3.4 " }))).toBe("iptables -A INPUT -s 1.2.3.4 -j ACCEPT");
  });
});

describe("jump target", () => {
  it("always renders -j, for every jump target", () => {
    expect(line(spec({ jumpTarget: "DROP" }))).toBe("iptables -A INPUT -j DROP");
    expect(line(spec({ jumpTarget: "REJECT" }))).toBe("iptables -A INPUT -j REJECT");
  });
});

describe("full ordering", () => {
  it("renders every piece in the fixed order: action chain -p protocol --dport port -s source -j jump", () => {
    expect(
      line(
        spec({
          chain: "FORWARD",
          action: "insert",
          protocol: "tcp",
          port: "8080",
          source: "10.0.0.5",
          jumpTarget: "REJECT",
        }),
      ),
    ).toBe("iptables -I FORWARD -p tcp --dport 8080 -s 10.0.0.5 -j REJECT");
  });
});

describe("lint", () => {
  it("IPTABLES001 warns when port is set and protocol is 'any'", () => {
    const diagnostics = lint(spec({ port: "22" })).diagnostics;
    expect(diagnostics.map((d) => d.code)).toContain("IPTABLES001");
    expect(diagnostics.find((d) => d.code === "IPTABLES001")!.level).toBe("warning");
  });

  it("IPTABLES001 does not fire once a real protocol is chosen", () => {
    expect(lint(spec({ port: "22", protocol: "tcp" })).diagnostics.map((d) => d.code)).not.toContain("IPTABLES001");
  });

  it("IPTABLES001 does not fire when port is empty", () => {
    expect(lint(spec({ protocol: "any", port: "" })).diagnostics.map((d) => d.code)).not.toContain("IPTABLES001");
  });

  it("a fully specified rule with an explicit protocol has no diagnostics", () => {
    expect(lint(spec({ protocol: "tcp", port: "22" })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Allow incoming SSH'", () => {
    expect(line(getPreset("allow-ssh")!.apply(spec()))).toBe("iptables -A INPUT -p tcp --dport 22 -j ACCEPT");
  });

  it("'Block traffic from a specific IP'", () => {
    expect(line(getPreset("block-an-ip")!.apply(spec()))).toBe("iptables -I INPUT -s 1.2.3.4 -j DROP");
  });

  it("'Delete a matching rule'", () => {
    expect(line(getPreset("delete-a-rule")!.apply(spec()))).toBe("iptables -D INPUT -p tcp --dport 22 -j ACCEPT");
  });
});

describe("describeSpec", () => {
  it("describes the default spec (append, no protocol/port/source, ACCEPT)", () => {
    expect(describeSpec(spec())).toBe("Append a rule to INPUT allowing traffic (jump: ACCEPT).");
  });

  it("describes the allow-ssh preset: append + tcp + port + ACCEPT", () => {
    expect(describeSpec(getPreset("allow-ssh")!.apply(spec()))).toBe(
      "Append a rule to INPUT allowing tcp traffic on port 22 (jump: ACCEPT).",
    );
  });

  it("describes the block-an-ip preset: insert + source + DROP", () => {
    expect(describeSpec(getPreset("block-an-ip")!.apply(spec()))).toBe(
      "Insert a rule at the top of INPUT dropping traffic from 1.2.3.4 (jump: DROP).",
    );
  });

  it("describes the delete-a-rule preset: delete always uses 'matching', regardless of jump target", () => {
    expect(describeSpec(getPreset("delete-a-rule")!.apply(spec()))).toBe(
      "Delete a rule from INPUT matching tcp traffic on port 22 (jump: ACCEPT).",
    );
  });
});
