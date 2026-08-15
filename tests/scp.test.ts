import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type ScpSpec } from "@cmdgen/scp";

const line = (spec: ScpSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<ScpSpec> = {}): ScpSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

const local = (path: string) => ({ kind: "local" as const, path });
const remote = (host: string, path: string, user = "") => ({ kind: "remote" as const, host, user, path });

describe("sources and destination", () => {
  it("renders a local-to-remote upload", () => {
    expect(
      line(spec({ sources: [local("/home/me/report.pdf")], destination: remote("host", "/backup/", "deploy") })),
    ).toBe("scp /home/me/report.pdf deploy@host:/backup/");
  });

  it("renders a remote-to-local download", () => {
    expect(
      line(spec({ sources: [remote("host", "/data/db.sql", "deploy")], destination: local("/home/me/backups/") })),
    ).toBe("scp deploy@host:/data/db.sql /home/me/backups/");
  });

  it("omits the user when none is given on a remote endpoint", () => {
    expect(line(spec({ sources: [local("/a")], destination: remote("host", "/b") }))).toBe("scp /a host:/b");
  });

  it("renders multiple sources before the single destination", () => {
    expect(
      line(spec({ sources: [local("/a"), local("/b"), local("/c")], destination: remote("host", "/dest/") })),
    ).toBe("scp /a /b /c host:/dest/");
  });

  it("skips a fully empty local source but still renders the destination", () => {
    expect(line(spec({ sources: [local("")], destination: remote("host", "/dest/") }))).toBe("scp host:/dest/");
  });
});

describe("connection fields", () => {
  it("renders -i and -P around the identity/port", () => {
    expect(
      line(spec({ sources: [local("/a")], destination: remote("host", "/b"), identityFile: "~/.ssh/id_ed25519", port: "2222" })),
    ).toBe("scp -i '~/.ssh/id_ed25519' -P 2222 /a host:/b");
  });

  it("renders repeatable -o and -X options", () => {
    expect(
      line(
        spec({
          sources: [local("/a")],
          destination: remote("host", "/b"),
          sshOptions: ["ProxyJump=bastion"],
          sftpOptions: ["nrequests=64"],
        }),
      ),
    ).toBe("scp -o ProxyJump=bastion -X nrequests=64 /a host:/b");
  });
});

describe("flags", () => {
  it("renders -r, -p, -C, -B", () => {
    expect(line(spec({ sources: [local("/a")], destination: local("/b"), flags: { recursive: true } }))).toBe("scp -r /a /b");
    expect(line(spec({ sources: [local("/a")], destination: local("/b"), flags: { preserve: true } }))).toBe("scp -p /a /b");
    expect(line(spec({ sources: [local("/a")], destination: local("/b"), flags: { compress: true } }))).toBe("scp -C /a /b");
    expect(line(spec({ sources: [local("/a")], destination: local("/b"), flags: { batchMode: true } }))).toBe("scp -B /a /b");
  });

  it("renders -4/-6 as a mutually exclusive enum", () => {
    expect(line(spec({ sources: [local("/a")], destination: local("/b"), flags: { ipVersion: "ipv4" } }))).toBe("scp -4 /a /b");
    expect(line(spec({ sources: [local("/a")], destination: local("/b"), flags: { ipVersion: "ipv6" } }))).toBe("scp -6 /a /b");
  });

  it("renders -c, -J, -F, -l, -O, -D, -S", () => {
    const s = (flags: ScpSpec["flags"]) => spec({ sources: [local("/a")], destination: local("/b"), flags });
    expect(line(s({ cipherSpec: "aes256-gcm@openssh.com" }))).toBe("scp -c aes256-gcm@openssh.com /a /b");
    expect(line(s({ jumpHost: "user@bastion:22" }))).toBe("scp -J user@bastion:22 /a /b");
    expect(line(s({ sshConfigFile: "~/.ssh/config-work" }))).toBe("scp -F '~/.ssh/config-work' /a /b");
    expect(line(s({ limit: 1000 }))).toBe("scp -l 1000 /a /b");
    expect(line(s({ legacyProtocol: true }))).toBe("scp -O /a /b");
    expect(line(s({ sftpServerPath: "/usr/lib/openssh/sftp-server" }))).toBe("scp -D /usr/lib/openssh/sftp-server /a /b");
    expect(line(s({ program: "/usr/bin/ssh" }))).toBe("scp -S /usr/bin/ssh /a /b");
  });
});

describe("lint", () => {
  it("SCP001 fires when every source is empty", () => {
    expect(lint(spec({ sources: [local("")] })).diagnostics.map((d) => d.code)).toContain("SCP001");
    expect(lint(spec({ sources: [local("/a")] })).diagnostics.map((d) => d.code)).not.toContain("SCP001");
  });

  it("SCP002 fires on an empty destination", () => {
    expect(lint(spec({ sources: [local("/a")], destination: local("") })).diagnostics.map((d) => d.code)).toContain("SCP002");
  });

  it("SCP009 fires when a remote endpoint has no host", () => {
    expect(
      lint(spec({ sources: [local("/a")], destination: remote("", "/b") })).diagnostics.map((d) => d.code),
    ).toContain("SCP009");
  });

  it("SCP003 warns about agent forwarding", () => {
    expect(
      lint(spec({ sources: [local("/a")], destination: local("/b"), flags: { agentForwarding: true } })).diagnostics.map((d) => d.code),
    ).toContain("SCP003");
  });

  it("SCP004 flags -T as destructive", () => {
    const result = lint(spec({ sources: [local("/a")], destination: local("/b"), flags: { disableStrictFilenameCheck: true } }));
    expect(result.isDestructive).toBe(true);
    expect(result.diagnostics.map((d) => d.code)).toContain("SCP004");
  });

  it("SCP005 warns when -D is set", () => {
    expect(
      lint(spec({ sources: [local("/a")], destination: local("/b"), flags: { sftpServerPath: "/usr/lib/openssh/sftp-server" } })).diagnostics.map((d) => d.code),
    ).toContain("SCP005");
  });

  it("SCP006 warns when -S is set", () => {
    expect(
      lint(spec({ sources: [local("/a")], destination: local("/b"), flags: { program: "/usr/bin/ssh" } })).diagnostics.map((d) => d.code),
    ).toContain("SCP006");
  });

  it("SCP007 notes -3 has no effect unless both sides are remote", () => {
    const oneRemote = lint(spec({ sources: [local("/a")], destination: remote("host", "/b"), flags: { viaLocalHost: true } }));
    expect(oneRemote.diagnostics.map((d) => d.code)).toContain("SCP007");

    const bothRemote = lint(
      spec({ sources: [remote("h1", "/a")], destination: remote("h2", "/b"), flags: { viaLocalHost: true } }),
    );
    expect(bothRemote.diagnostics.map((d) => d.code)).not.toContain("SCP007");
  });

  it("SCP008 warns that -D/-X are ignored under the legacy protocol", () => {
    expect(
      lint(
        spec({
          sources: [local("/a")],
          destination: local("/b"),
          flags: { legacyProtocol: true, sftpServerPath: "/usr/lib/openssh/sftp-server" },
        }),
      ).diagnostics.map((d) => d.code),
    ).toContain("SCP008");
    expect(
      lint(spec({ sources: [local("/a")], destination: local("/b"), flags: { legacyProtocol: true } })).diagnostics.map((d) => d.code),
    ).not.toContain("SCP008");
  });

  it("a clean spec has no diagnostics", () => {
    expect(lint(spec({ sources: [local("/a")], destination: remote("host", "/b", "user") })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Upload a file' matches its own commandExample", () => {
    const preset = getPreset("upload-file")!;
    expect(line(preset.apply(spec()))).toBe(preset.commandExample);
  });

  it("'Download a file' matches its own commandExample", () => {
    const preset = getPreset("download-file")!;
    expect(line(preset.apply(spec()))).toBe(preset.commandExample);
  });

  it("'Upload a directory (recursive)' sets -r and matches its own commandExample", () => {
    const preset = getPreset("upload-directory")!;
    const applied = preset.apply(spec());
    expect(applied.flags.recursive).toBe(true);
    expect(line(applied)).toBe(preset.commandExample);
  });

  it("picking presets in sequence never leaks flags from an unrelated, previously-picked preset", () => {
    // Reproduces the class of bug fixed across every command this session:
    // Bandwidth-limited (-l), then Preserve attributes (-p) should NOT also
    // still carry -l, since these presets are unrelated to each other.
    let s = spec({ sources: [local("/a")], destination: local("/b") });
    s = getPreset("bandwidth-limited")!.apply(s);
    s = getPreset("preserve-attributes")!.apply(s);
    expect(line(s)).toBe("scp -p /a /b");
    expect(s.flags.limit).toBeUndefined();
  });

  it("'Scripted / non-interactive' sets batch mode only", () => {
    const s = getPreset("scripted")!.apply(spec({ sources: [local("/a")], destination: local("/b") }));
    expect(line(s)).toBe("scp -B /a /b");
  });

  it("'Via a jump host' sets -J", () => {
    const s = getPreset("via-jump-host")!.apply(spec({ sources: [local("/a")], destination: local("/b") }));
    expect(line(s)).toBe("scp -J user@bastion-host /a /b");
  });
});

describe("describeSpec", () => {
  it("describes a plain copy", () => {
    expect(describeSpec(spec({ sources: [local("/a")], destination: remote("host", "/b", "user") }))).toMatch(
      /^Copy \/a to user@host:\/b\./,
    );
  });

  it("mentions recursion, preservation, and bandwidth limit", () => {
    const s = spec({
      sources: [local("/a")],
      destination: remote("host", "/b"),
      flags: { recursive: true, preserve: true, limit: 500 },
    });
    const text = describeSpec(s);
    expect(text).toMatch(/recursively/);
    expect(text).toMatch(/preserving modification times/);
    expect(text).toMatch(/limited to 500 Kbit\/s/);
  });

  it("short-circuits for -D since nothing else applies", () => {
    const s = spec({ sources: [local("/a")], destination: local("/b"), flags: { sftpServerPath: "/usr/lib/openssh/sftp-server" } });
    expect(describeSpec(s)).toMatch(/local sftp-server program/);
  });
});
