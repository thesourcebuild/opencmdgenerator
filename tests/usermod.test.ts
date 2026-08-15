import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type UsermodSpec } from "@cmdgen/usermod";

const line = (spec: UsermodSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<UsermodSpec> = {}): UsermodSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("username and flags", () => {
  it("a bare username with no flags", () => {
    expect(line(spec({ username: "alice" }))).toBe("usermod alice");
  });

  it("renders -l as a detached short-form text value", () => {
    expect(line(spec({ username: "alice", flags: { login: "alice2" } }))).toBe("usermod -l alice2 alice");
  });

  it("renders -d as a detached short-form text value", () => {
    expect(line(spec({ username: "alice", flags: { home: "/home/alice2" } }))).toBe(
      "usermod -d /home/alice2 alice",
    );
  });

  it("renders -m as a boolean flag", () => {
    expect(line(spec({ username: "alice", flags: { home: "/home/alice2", moveHome: true } }))).toBe(
      "usermod -d /home/alice2 -m alice",
    );
  });

  it("renders -g as a detached short-form text value", () => {
    expect(line(spec({ username: "alice", flags: { gid: "developers" } }))).toBe("usermod -g developers alice");
  });

  it("renders -G as a detached short-form text value", () => {
    expect(line(spec({ username: "alice", flags: { groups: "sudo,docker", append: true } }))).toBe(
      "usermod -G sudo,docker -a alice",
    );
  });

  it("renders -s as a detached short-form text value", () => {
    expect(line(spec({ username: "alice", flags: { shell: "/bin/zsh" } }))).toBe("usermod -s /bin/zsh alice");
  });

  it("renders -L and -U as boolean flags", () => {
    expect(line(spec({ username: "alice", flags: { lock: true } }))).toBe("usermod -L alice");
    expect(line(spec({ username: "alice", flags: { unlock: true } }))).toBe("usermod -U alice");
  });

  it("renders -e as a detached short-form text value", () => {
    expect(line(spec({ username: "alice", flags: { expireDate: "2027-01-01" } }))).toBe(
      "usermod -e 2027-01-01 alice",
    );
  });

  it("combines multiple flags with the username last, in catalogue order", () => {
    expect(
      line(spec({ username: "alice", flags: { groups: "sudo,docker", append: true, shell: "/bin/zsh" } })),
    ).toBe("usermod -G sudo,docker -a -s /bin/zsh alice");
  });
});

describe("lint", () => {
  it("USM001 catches no username", () => {
    expect(lint(spec()).diagnostics.map((d) => d.code)).toContain("USM001");
  });

  it("USM001 also catches a whitespace-only username", () => {
    expect(lint(spec({ username: "   " })).diagnostics.map((d) => d.code)).toContain("USM001");
  });

  it("USM002 catches -G without -a, and its fix adds -a", () => {
    const s = spec({ username: "alice", flags: { groups: "sudo,docker" } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("USM002");
    const fix = result.diagnostics.find((d) => d.code === "USM002")!.fix!;
    expect(lint(fix.apply(s)).diagnostics.map((d) => d.code)).not.toContain("USM002");
  });

  it("USM002 does not fire when -G is combined with -a", () => {
    expect(
      lint(spec({ username: "alice", flags: { groups: "sudo,docker", append: true } })).diagnostics.map(
        (d) => d.code,
      ),
    ).not.toContain("USM002");
  });

  it("USM003 catches -a without -G", () => {
    expect(lint(spec({ username: "alice", flags: { append: true } })).diagnostics.map((d) => d.code)).toContain(
      "USM003",
    );
  });

  it("USM004 catches -L and -U together, and its fix removes one", () => {
    const s = spec({ username: "alice", flags: { lock: true, unlock: true } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("USM004");
    const fix = result.diagnostics.find((d) => d.code === "USM004")!.fix!;
    expect(lint(fix.apply(s)).diagnostics.map((d) => d.code)).not.toContain("USM004");
  });

  it("USM005 catches -m without -d", () => {
    expect(lint(spec({ username: "alice", flags: { moveHome: true } })).diagnostics.map((d) => d.code)).toContain(
      "USM005",
    );
  });

  it("USM006 fires when -d is set without -m", () => {
    expect(
      lint(spec({ username: "alice", flags: { home: "/home/alice2" } })).diagnostics.map((d) => d.code),
    ).toContain("USM006");
  });

  it("USM006 does not fire when -d is combined with -m", () => {
    expect(
      lint(spec({ username: "alice", flags: { home: "/home/alice2", moveHome: true } })).diagnostics.map(
        (d) => d.code,
      ),
    ).not.toContain("USM006");
  });

  it("a plain usermod has no diagnostics", () => {
    expect(lint(spec({ username: "alice" })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Rename the login' is -l alice2 alice", () => {
    expect(line(getPreset("rename-login")!.apply(spec()))).toBe("usermod -l alice2 alice");
  });

  it("'Change the login shell' is -s /bin/zsh alice", () => {
    expect(line(getPreset("change-shell")!.apply(spec()))).toBe("usermod -s /bin/zsh alice");
  });

  it("'Add to groups (safe)' is -G sudo,docker -a alice", () => {
    expect(line(getPreset("append-groups")!.apply(spec()))).toBe("usermod -G sudo,docker -a alice");
  });

  it("'Lock the account' is -L alice", () => {
    expect(line(getPreset("lock-account")!.apply(spec()))).toBe("usermod -L alice");
  });

  it("'Move the home directory' is -d /home/alice2 -m alice", () => {
    expect(line(getPreset("move-home")!.apply(spec()))).toBe("usermod -d /home/alice2 -m alice");
  });
});

describe("describeSpec", () => {
  it("describes the default case", () => {
    expect(describeSpec(spec({ username: "alice" }))).toBe("Modify the alice account.");
  });

  it("describes an empty username with the SOME_USERNAME placeholder", () => {
    expect(describeSpec(spec())).toBe("Modify the SOME_USERNAME account.");
  });

  it("describes -l, -g, -s, -e as trailing clauses", () => {
    const described = describeSpec(
      spec({
        username: "alice",
        flags: { login: "alice2", gid: "developers", shell: "/bin/zsh", expireDate: "2027-01-01" },
      }),
    );
    expect(described).toContain("renaming its login to alice2");
    expect(described).toContain("changing its primary group to developers");
    expect(described).toContain("changing its login shell to /bin/zsh");
    expect(described).toContain("set to expire on 2027-01-01");
  });

  it("describes -d differently with and without -m", () => {
    expect(describeSpec(spec({ username: "alice", flags: { home: "/home/alice2" } }))).toContain(
      "changing its recorded home directory to /home/alice2 without moving any files",
    );
    expect(
      describeSpec(spec({ username: "alice", flags: { home: "/home/alice2", moveHome: true } })),
    ).toContain("moving its home directory to /home/alice2");
  });

  it("describes -G differently with and without -a", () => {
    expect(describeSpec(spec({ username: "alice", flags: { groups: "sudo,docker" } }))).toContain(
      "replacing its supplementary groups with sudo,docker",
    );
    expect(
      describeSpec(spec({ username: "alice", flags: { groups: "sudo,docker", append: true } })),
    ).toContain("adding it to the sudo,docker group(s)");
  });

  it("describes -L and -U", () => {
    expect(describeSpec(spec({ username: "alice", flags: { lock: true } }))).toContain("locking the account");
    expect(describeSpec(spec({ username: "alice", flags: { unlock: true } }))).toContain("unlocking the account");
  });
});
