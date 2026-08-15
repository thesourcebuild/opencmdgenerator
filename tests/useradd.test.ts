import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type UseraddSpec } from "@cmdgen/useradd";

const line = (spec: UseraddSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<UseraddSpec> = {}): UseraddSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("username and flags", () => {
  it("a bare username with no flags", () => {
    expect(line(spec({ username: "alice" }))).toBe("useradd alice");
  });

  it("renders -m as a boolean flag", () => {
    expect(line(spec({ username: "alice", flags: { createHome: true } }))).toBe("useradd -m alice");
  });

  it("renders -d as a detached short-form text value", () => {
    expect(line(spec({ username: "alice", flags: { homeDir: "/home/alice" } }))).toBe(
      "useradd -d /home/alice alice",
    );
  });

  it("renders -s as a detached short-form text value", () => {
    expect(line(spec({ username: "alice", flags: { shell: "/bin/bash" } }))).toBe("useradd -s /bin/bash alice");
  });

  it("renders -g as a detached short-form text value", () => {
    expect(line(spec({ username: "alice", flags: { primaryGroup: "developers" } }))).toBe(
      "useradd -g developers alice",
    );
  });

  it("renders -G as a detached short-form text value", () => {
    expect(line(spec({ username: "alice", flags: { secondaryGroups: "sudo,docker" } }))).toBe(
      "useradd -G sudo,docker alice",
    );
  });

  it("renders -u as a detached short-form text value", () => {
    expect(line(spec({ username: "alice", flags: { uid: "1500" } }))).toBe("useradd -u 1500 alice");
  });

  it("renders -c as a detached short-form text value, quoted when it contains a space", () => {
    expect(line(spec({ username: "alice", flags: { comment: "Alice Smith" } }))).toBe(
      "useradd -c 'Alice Smith' alice",
    );
  });

  it("renders -e as a detached short-form text value", () => {
    expect(line(spec({ username: "alice", flags: { expireDate: "2027-01-01" } }))).toBe(
      "useradd -e 2027-01-01 alice",
    );
  });

  it("combines multiple flags with the username last, in catalogue order", () => {
    expect(
      line(spec({ username: "alice", flags: { createHome: true, shell: "/bin/bash", secondaryGroups: "sudo,docker" } })),
    ).toBe("useradd -m -s /bin/bash -G sudo,docker alice");
  });
});

describe("lint", () => {
  it("USERADD001 catches no username", () => {
    expect(lint(spec()).diagnostics.map((d) => d.code)).toContain("USERADD001");
  });

  it("USERADD001 also catches a whitespace-only username", () => {
    expect(lint(spec({ username: "   " })).diagnostics.map((d) => d.code)).toContain("USERADD001");
  });

  it("a plain useradd has no diagnostics", () => {
    expect(lint(spec({ username: "alice" })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Basic user' is -m alice", () => {
    expect(line(getPreset("basic-user")!.apply(spec()))).toBe("useradd -m alice");
  });

  it("'User with a specific shell' is -m -s /bin/bash alice", () => {
    expect(line(getPreset("user-with-shell")!.apply(spec()))).toBe("useradd -m -s /bin/bash alice");
  });

  it("'User in specific groups' is -m -G sudo,docker alice", () => {
    expect(line(getPreset("user-in-groups")!.apply(spec()))).toBe("useradd -m -G sudo,docker alice");
  });
});

describe("describeSpec", () => {
  it("describes the default case", () => {
    expect(describeSpec(spec({ username: "alice" }))).toBe("Create a new user account named alice.");
  });

  it("describes an empty username with the SOME_USERNAME placeholder", () => {
    expect(describeSpec(spec())).toBe("Create a new user account named SOME_USERNAME.");
  });

  it("describes home directory creation and a custom home path as trailing clauses", () => {
    const described = describeSpec(
      spec({ username: "alice", flags: { createHome: true, homeDir: "/home/alice" } }),
    );
    expect(described).toContain("creating its home directory if it doesn't already exist");
    expect(described).toContain("using /home/alice as its home directory");
  });

  it("describes shell, groups, uid, comment, and expiry date as trailing clauses", () => {
    const described = describeSpec(
      spec({
        username: "alice",
        flags: {
          shell: "/bin/bash",
          primaryGroup: "developers",
          secondaryGroups: "sudo,docker",
          uid: "1500",
          comment: "Alice Smith",
          expireDate: "2027-01-01",
        },
      }),
    );
    expect(described).toContain("with /bin/bash as its login shell");
    expect(described).toContain("with developers as its primary group");
    expect(described).toContain("adding it to the sudo,docker group(s)");
    expect(described).toContain("using UID 1500");
    expect(described).toContain('with comment "Alice Smith"');
    expect(described).toContain("set to expire on 2027-01-01");
  });
});
