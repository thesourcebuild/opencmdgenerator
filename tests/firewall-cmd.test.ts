import { describe, expect, it } from "vitest";
import {
  PRESETS,
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type FirewallCmdSpec,
} from "@cmdgen/firewall-cmd";

const line = (spec: FirewallCmdSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<FirewallCmdSpec> = {}): FirewallCmdSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("actions", () => {
  it("a spec with nothing set renders the default state action", () => {
    expect(line(spec())).toBe("firewall-cmd --state");
  });

  it("reload, panic-on, and panic-off each render as a single bare long option", () => {
    expect(line(spec({ action: "reload" }))).toBe("firewall-cmd --reload");
    expect(line(spec({ action: "panic-on" }))).toBe("firewall-cmd --panic-on");
    expect(line(spec({ action: "panic-off" }))).toBe("firewall-cmd --panic-off");
  });

  it("list-all with no zone omits --zone entirely", () => {
    expect(line(spec({ action: "list-all" }))).toBe("firewall-cmd --list-all");
  });

  it("list-all with a zone renders --zone= first", () => {
    expect(line(spec({ action: "list-all", zone: "public" }))).toBe("firewall-cmd --zone=public --list-all");
  });

  it("add-port renders --add-port=PORT, with --zone= first when set", () => {
    expect(line(spec({ action: "add-port", port: "8080/tcp" }))).toBe("firewall-cmd --add-port=8080/tcp");
    expect(line(spec({ action: "add-port", zone: "public", port: "8080/tcp" }))).toBe(
      "firewall-cmd --zone=public --add-port=8080/tcp",
    );
  });

  it("remove-port renders --remove-port=PORT", () => {
    expect(line(spec({ action: "remove-port", port: "8080/tcp" }))).toBe("firewall-cmd --remove-port=8080/tcp");
  });

  it("add-service and remove-service render --add-service=/--remove-service=", () => {
    expect(line(spec({ action: "add-service", service: "http" }))).toBe("firewall-cmd --add-service=http");
    expect(line(spec({ action: "remove-service", service: "http" }))).toBe("firewall-cmd --remove-service=http");
  });

  it("add-port with an empty port omits the option's own token, but keeps the leading zone", () => {
    expect(line(spec({ action: "add-port", zone: "public", port: "" }))).toBe("firewall-cmd --zone=public");
  });

  it("--permanent renders last, only for the four state-changing actions", () => {
    expect(line(spec({ action: "add-port", port: "8080/tcp", flags: { permanent: true } }))).toBe(
      "firewall-cmd --add-port=8080/tcp --permanent",
    );
    expect(line(spec({ action: "add-service", service: "http", flags: { permanent: true } }))).toBe(
      "firewall-cmd --add-service=http --permanent",
    );
  });

  it("--permanent is silently omitted for state/list-all/reload/panic actions even if the flag is set", () => {
    expect(line(spec({ action: "state", flags: { permanent: true } }))).toBe("firewall-cmd --state");
    expect(line(spec({ action: "reload", flags: { permanent: true } }))).toBe("firewall-cmd --reload");
  });

  it("trims whitespace from zone, port, and service", () => {
    expect(line(spec({ action: "add-port", zone: "  public  ", port: "  8080/tcp  " }))).toBe(
      "firewall-cmd --zone=public --add-port=8080/tcp",
    );
  });
});

describe("lint", () => {
  it("FWC001 catches an empty port on add-port or remove-port", () => {
    expect(lint(spec({ action: "add-port", port: "" })).diagnostics.map((d) => d.code)).toContain("FWC001");
    expect(lint(spec({ action: "remove-port", port: "" })).diagnostics.map((d) => d.code)).toContain("FWC001");
  });

  it("FWC001 does not fire for other actions", () => {
    expect(lint(spec({ action: "state" })).diagnostics.map((d) => d.code)).not.toContain("FWC001");
  });

  it("FWC002 catches an empty service on add-service or remove-service", () => {
    expect(lint(spec({ action: "add-service", service: "" })).diagnostics.map((d) => d.code)).toContain("FWC002");
    expect(lint(spec({ action: "remove-service", service: "" })).diagnostics.map((d) => d.code)).toContain("FWC002");
  });

  it("FWC003 fires unconditionally whenever panic-on is selected, with no fix", () => {
    const result = lint(spec({ action: "panic-on" }));
    expect(result.diagnostics.map((d) => d.code)).toContain("FWC003");
    const diag = result.diagnostics.find((d) => d.code === "FWC003")!;
    expect(diag.level).toBe("destructive");
    expect(diag.fix).toBeUndefined();
  });

  it("FWC003 does not fire for panic-off or any other action", () => {
    expect(lint(spec({ action: "panic-off" })).diagnostics.map((d) => d.code)).not.toContain("FWC003");
    expect(lint(spec({ action: "state" })).diagnostics.map((d) => d.code)).not.toContain("FWC003");
  });

  it("FWC004 fires as info when a state-changing action lacks --permanent, and its fix silences it", () => {
    const s = spec({ action: "add-port", port: "8080/tcp" });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("FWC004");
    const diag = result.diagnostics.find((d) => d.code === "FWC004")!;
    expect(diag.level).toBe("info");
    const fixed = diag.fix!.apply(s);
    expect(lint(fixed).diagnostics.map((d) => d.code)).not.toContain("FWC004");
    expect(fixed.flags.permanent).toBe(true);
  });

  it("FWC004 does not fire once --permanent is already set", () => {
    const s = spec({ action: "add-port", port: "8080/tcp", flags: { permanent: true } });
    expect(lint(s).diagnostics.map((d) => d.code)).not.toContain("FWC004");
  });

  it("FWC004 does not pile on top of an already-incomplete add-port (no port yet)", () => {
    expect(lint(spec({ action: "add-port", port: "" })).diagnostics.map((d) => d.code)).not.toContain("FWC004");
  });

  it("FWC004 does not fire for non-state-changing actions", () => {
    expect(lint(spec({ action: "state" })).diagnostics.map((d) => d.code)).not.toContain("FWC004");
    expect(lint(spec({ action: "list-all" })).diagnostics.map((d) => d.code)).not.toContain("FWC004");
  });

  it("a fully specified, permanent add-port has no diagnostics", () => {
    expect(
      lint(spec({ action: "add-port", port: "8080/tcp", flags: { permanent: true } })).diagnostics,
    ).toEqual([]);
  });
});

describe("presets", () => {
  it("'Check firewall state'", () => {
    expect(line(getPreset("check-state")!.apply(spec()))).toBe("firewall-cmd --state");
  });

  it("'List the default zone's rules'", () => {
    expect(line(getPreset("list-default-zone")!.apply(spec()))).toBe("firewall-cmd --list-all");
  });

  it("'Open a port permanently'", () => {
    expect(line(getPreset("open-port-permanently")!.apply(spec()))).toBe(
      "firewall-cmd --add-port=8080/tcp --permanent",
    );
  });

  it("'Allow a service permanently'", () => {
    expect(line(getPreset("allow-service-permanently")!.apply(spec()))).toBe(
      "firewall-cmd --add-service=http --permanent",
    );
  });

  it("'Reload the firewall configuration'", () => {
    expect(line(getPreset("reload-config")!.apply(spec()))).toBe("firewall-cmd --reload");
  });

  it("no preset applies panic-on", () => {
    for (const preset of PRESETS) {
      expect(preset.apply(spec()).action).not.toBe("panic-on");
    }
  });
});

describe("describeSpec", () => {
  it("describes state, reload, panic-on, and panic-off", () => {
    expect(describeSpec(spec({ action: "state" }))).toBe("Show whether the firewall is currently running.");
    expect(describeSpec(spec({ action: "reload" }))).toBe(
      "Reload firewalld, applying the permanent configuration as the new runtime configuration.",
    );
    expect(describeSpec(spec({ action: "panic-on" }))).toBe(
      "Immediately block ALL network traffic, in or out — including the session used to run this.",
    );
    expect(describeSpec(spec({ action: "panic-off" }))).toBe("Turn off panic mode, restoring normal firewall rules.");
  });

  it("describes add-port/remove-port with the permanence clause", () => {
    expect(describeSpec(spec({ action: "add-port", port: "8080/tcp" }))).toBe(
      "Open port 8080/tcp in the default zone, for this runtime session only (add --permanent to persist it).",
    );
    expect(describeSpec(spec({ action: "add-port", port: "8080/tcp", flags: { permanent: true } }))).toBe(
      "Open port 8080/tcp in the default zone, persisting across reloads and reboots.",
    );
    expect(describeSpec(spec({ action: "remove-port", port: "8080/tcp", zone: "public" }))).toBe(
      "Close port 8080/tcp in the public zone, for this runtime session only (add --permanent to persist it).",
    );
  });

  it("describes add-service/remove-service similarly", () => {
    expect(describeSpec(spec({ action: "add-service", service: "http" }))).toBe(
      "Allow the http service in the default zone, for this runtime session only (add --permanent to persist it).",
    );
    expect(describeSpec(spec({ action: "remove-service", service: "http", flags: { permanent: true } }))).toBe(
      "Disallow the http service in the default zone, persisting across reloads and reboots.",
    );
  });

  it("uses SOME_PORT/SOME_SERVICE placeholders when empty", () => {
    expect(describeSpec(spec({ action: "add-port", port: "" }))).toContain("SOME_PORT");
    expect(describeSpec(spec({ action: "add-service", service: "" }))).toContain("SOME_SERVICE");
  });
});
