import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type AdduserSpec } from "@cmdgen/adduser";

const line = (spec: AdduserSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<AdduserSpec> = {}): AdduserSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("username and flags", () => {
  it("a bare username with no flags", () => {
    expect(line(spec({ username: "alice" }))).toBe("adduser alice");
  });

  it("renders --system as a boolean flag", () => {
    expect(line(spec({ username: "svc", flags: { system: true } }))).toBe("adduser --system svc");
  });

  it("renders --disabled-login as a boolean flag", () => {
    expect(line(spec({ username: "svc", flags: { disabledLogin: true } }))).toBe("adduser --disabled-login svc");
  });

  it("renders --disabled-password as a boolean flag", () => {
    expect(line(spec({ username: "deploy", flags: { disabledPassword: true } }))).toBe(
      "adduser --disabled-password deploy",
    );
  });

  it("renders --shell as a detached long-form text value", () => {
    expect(line(spec({ username: "alice", flags: { shell: "/bin/bash" } }))).toBe("adduser --shell /bin/bash alice");
  });

  it("renders --home as a detached long-form text value", () => {
    expect(line(spec({ username: "alice", flags: { home: "/home/alice" } }))).toBe(
      "adduser --home /home/alice alice",
    );
  });

  it("renders --ingroup as a detached long-form text value", () => {
    expect(line(spec({ username: "alice", flags: { ingroup: "developers" } }))).toBe(
      "adduser --ingroup developers alice",
    );
  });

  it("renders --gecos as a detached long-form text value, quoted when it contains a space", () => {
    expect(line(spec({ username: "alice", flags: { gecos: "Alice Smith,,," } }))).toBe(
      "adduser --gecos 'Alice Smith,,,' alice",
    );
  });

  it("renders --uid as a detached long-form text value", () => {
    expect(line(spec({ username: "alice", flags: { uid: "1500" } }))).toBe("adduser --uid 1500 alice");
  });

  it("renders --force-badname as a boolean flag", () => {
    expect(line(spec({ username: "Alice", flags: { forceBadname: true } }))).toBe(
      "adduser --force-badname Alice",
    );
  });

  it("combines multiple flags with the username last, in catalogue order", () => {
    expect(
      line(spec({ username: "svc-app", flags: { system: true, disabledLogin: true, shell: "/usr/sbin/nologin" } })),
    ).toBe("adduser --system --disabled-login --shell /usr/sbin/nologin svc-app");
  });
});

describe("lint", () => {
  it("ADD001 catches no username", () => {
    expect(lint(spec()).diagnostics.map((d) => d.code)).toContain("ADD001");
  });

  it("ADD001 also catches a whitespace-only username", () => {
    expect(lint(spec({ username: "   " })).diagnostics.map((d) => d.code)).toContain("ADD001");
  });

  it("ADD002 catches --disabled-login and --disabled-password together, and its fix removes one", () => {
    const s = spec({ username: "alice", flags: { disabledLogin: true, disabledPassword: true } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("ADD002");
    const fix = result.diagnostics.find((d) => d.code === "ADD002")!.fix!;
    expect(lint(fix.apply(s)).diagnostics.map((d) => d.code)).not.toContain("ADD002");
  });

  it("ADD003 fires whenever --system is set", () => {
    expect(lint(spec({ username: "svc", flags: { system: true } })).diagnostics.map((d) => d.code)).toContain(
      "ADD003",
    );
  });

  it("ADD004 fires whenever --force-badname is set", () => {
    expect(
      lint(spec({ username: "Alice", flags: { forceBadname: true } })).diagnostics.map((d) => d.code),
    ).toContain("ADD004");
  });

  it("a plain adduser has no diagnostics", () => {
    expect(lint(spec({ username: "alice" })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Basic interactive user' is a bare adduser alice", () => {
    expect(line(getPreset("basic-user")!.apply(spec()))).toBe("adduser alice");
  });

  it("'System service account' is --system --disabled-login --shell /usr/sbin/nologin svc-app", () => {
    expect(line(getPreset("system-service-account")!.apply(spec()))).toBe(
      "adduser --system --disabled-login --shell /usr/sbin/nologin svc-app",
    );
  });

  it("'SSH-key-only account' is --disabled-password --ingroup deploy deploy", () => {
    expect(line(getPreset("ssh-key-only-account")!.apply(spec()))).toBe(
      "adduser --disabled-password --ingroup deploy deploy",
    );
  });

  it("'User with a specific shell' is --shell /bin/zsh alice", () => {
    expect(line(getPreset("custom-shell")!.apply(spec()))).toBe("adduser --shell /bin/zsh alice");
  });
});

describe("describeSpec", () => {
  it("describes the default case", () => {
    expect(describeSpec(spec({ username: "alice" }))).toBe("Create a new user account named alice.");
  });

  it("describes an empty username with the SOME_USERNAME placeholder", () => {
    expect(describeSpec(spec())).toBe("Create a new user account named SOME_USERNAME.");
  });

  it("describes --system as a system account", () => {
    expect(describeSpec(spec({ username: "svc", flags: { system: true } }))).toBe(
      "Create a new system account named svc.",
    );
  });

  it("describes --disabled-login and --disabled-password as trailing clauses", () => {
    expect(describeSpec(spec({ username: "svc", flags: { disabledLogin: true } }))).toContain(
      "with its password login disabled",
    );
    expect(describeSpec(spec({ username: "deploy", flags: { disabledPassword: true } }))).toContain(
      "leaving it without a usable password",
    );
  });

  it("describes shell, home, ingroup, gecos, uid, and force-badname as trailing clauses", () => {
    const described = describeSpec(
      spec({
        username: "alice",
        flags: {
          shell: "/bin/bash",
          home: "/home/alice",
          ingroup: "developers",
          gecos: "Alice Smith,,,",
          uid: "1500",
          forceBadname: true,
        },
      }),
    );
    expect(described).toContain("with /bin/bash as its login shell");
    expect(described).toContain("using /home/alice as its home directory");
    expect(described).toContain("in the developers group");
    expect(described).toContain('with GECOS info "Alice Smith,,,"');
    expect(described).toContain("using UID 1500");
    expect(described).toContain("skipping username validation");
  });
});
