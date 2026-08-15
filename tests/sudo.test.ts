import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type SudoSpec } from "@cmdgen/sudo";

const line = (spec: SudoSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<SudoSpec> = {}): SudoSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("command splitting and flags", () => {
  it("a single-word command with no flags", () => {
    expect(line(spec({ command: "whoami" }))).toBe("sudo whoami");
  });

  it("a multi-word command splits into one token per word", () => {
    expect(line(spec({ command: "apt update" }))).toBe("sudo apt update");
  });

  it("a word needing its own quoting is quoted individually, not the whole line", () => {
    expect(line(spec({ command: "find *.log" }))).toBe("sudo find '*.log'");
  });

  it("collapses extra internal whitespace between words", () => {
    expect(line(spec({ command: "apt   update" }))).toBe("sudo apt update");
  });

  it("an empty command renders no trailing tokens", () => {
    expect(line(spec({ command: "" }))).toBe("sudo");
  });

  it("renders -u as a detached short-form text value before the command", () => {
    expect(line(spec({ command: "whoami", flags: { asUser: "www-data" } }))).toBe("sudo -u www-data whoami");
  });

  it("renders -i, -s, -v, -k, -l as bare boolean flags", () => {
    expect(line(spec({ flags: { interactiveShell: true } }))).toBe("sudo -i");
    expect(line(spec({ flags: { shell: true } }))).toBe("sudo -s");
    expect(line(spec({ flags: { validate: true } }))).toBe("sudo -v");
    expect(line(spec({ flags: { invalidate: true } }))).toBe("sudo -k");
    expect(line(spec({ flags: { listCommands: true } }))).toBe("sudo -l");
  });

  it("combines -u with a command", () => {
    expect(line(spec({ command: "systemctl restart nginx", flags: { asUser: "deploy" } }))).toBe(
      "sudo -u deploy systemctl restart nginx",
    );
  });
});

describe("lint", () => {
  it("SUDO001 catches an empty command with no standalone flag set", () => {
    expect(lint(spec()).diagnostics.map((d) => d.code)).toContain("SUDO001");
  });

  it("SUDO001 also catches a whitespace-only command with no standalone flag set", () => {
    expect(lint(spec({ command: "   " })).diagnostics.map((d) => d.code)).toContain("SUDO001");
  });

  it("SUDO001 is exempted by -i alone", () => {
    expect(lint(spec({ flags: { interactiveShell: true } })).diagnostics).toEqual([]);
  });

  it("SUDO001 is exempted by -s alone", () => {
    expect(lint(spec({ flags: { shell: true } })).diagnostics).toEqual([]);
  });

  it("SUDO001 is exempted by -v alone", () => {
    expect(lint(spec({ flags: { validate: true } })).diagnostics).toEqual([]);
  });

  it("SUDO001 is exempted by -k alone", () => {
    expect(lint(spec({ flags: { invalidate: true } })).diagnostics).toEqual([]);
  });

  it("SUDO001 is exempted by -l alone", () => {
    expect(lint(spec({ flags: { listCommands: true } })).diagnostics).toEqual([]);
  });

  it("a plain sudo with a command has no diagnostics", () => {
    expect(lint(spec({ command: "whoami" })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Run a command as root' is a bare sudo with a command", () => {
    expect(line(getPreset("run-as-root")!.apply(spec()))).toBe("sudo apt update");
  });

  it("'Run a command as another user' is -u www-data", () => {
    expect(line(getPreset("run-as-another-user")!.apply(spec()))).toBe("sudo -u www-data whoami");
  });

  it("'Start an interactive root shell' is -i", () => {
    expect(line(getPreset("interactive-root-shell")!.apply(spec()))).toBe("sudo -i");
  });
});

describe("describeSpec", () => {
  it("describes a command with elevated privileges", () => {
    expect(describeSpec(spec({ command: "apt update" }))).toBe('Run "apt update" with elevated privileges.');
  });

  it("describes -u as running as another user instead of root", () => {
    expect(describeSpec(spec({ command: "whoami", flags: { asUser: "www-data" } }))).toBe(
      'Run "whoami" with elevated privileges, as www-data instead of root.',
    );
  });

  it("describes -i as a standalone interactive login shell", () => {
    expect(describeSpec(spec({ flags: { interactiveShell: true } }))).toBe("Start an interactive login shell as root.");
  });

  it("describes -s as a standalone shell", () => {
    expect(describeSpec(spec({ flags: { shell: true } }))).toBe("Run root's shell.");
  });

  it("describes -v, -k, and -l as their standalone actions", () => {
    expect(describeSpec(spec({ flags: { validate: true } }))).toContain("Extend sudo's cached-credential timeout");
    expect(describeSpec(spec({ flags: { invalidate: true } }))).toContain("Invalidate sudo's cached credentials");
    expect(describeSpec(spec({ flags: { listCommands: true } }))).toContain(
      "List the commands this user is allowed to run with sudo",
    );
  });

  it("falls back to a generic placeholder when neither a command nor a standalone flag is set", () => {
    expect(describeSpec(spec())).toBe("Run SOME_COMMAND with elevated privileges.");
  });
});
