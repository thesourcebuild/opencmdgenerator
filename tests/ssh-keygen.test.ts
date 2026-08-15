import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type SshKeygenSpec,
} from "@cmdgen/ssh-keygen";

const line = (spec: SshKeygenSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<SshKeygenSpec> = {}): SshKeygenSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("generation mode", () => {
  it("defaults to -t ed25519", () => {
    expect(line(spec())).toBe("ssh-keygen -t ed25519");
  });

  it("renders -b only for rsa/ecdsa, never ed25519", () => {
    expect(line(spec({ keyType: "rsa", bits: "4096" }))).toBe("ssh-keygen -t rsa -b 4096");
    expect(line(spec({ keyType: "ecdsa", bits: "521" }))).toBe("ssh-keygen -t ecdsa -b 521");
    expect(line(spec({ keyType: "ed25519", bits: "4096" }))).toBe("ssh-keygen -t ed25519");
  });

  it("renders -f, -C, -N, and -q in order", () => {
    expect(line(spec({ outputFile: "~/.ssh/id_ed25519" }))).toBe("ssh-keygen -t ed25519 -f '~/.ssh/id_ed25519'");
    expect(line(spec({ comment: "user@host" }))).toBe("ssh-keygen -t ed25519 -C user@host");
    expect(line(spec({ setPassphrase: true, passphrase: "hunter2" }))).toBe("ssh-keygen -t ed25519 -N hunter2");
    expect(line(spec({ flags: { quiet: true } }))).toBe("ssh-keygen -t ed25519 --quiet");
  });

  it("renders an explicitly empty passphrase as -N ''", () => {
    expect(line(spec({ setPassphrase: true, passphrase: "" }))).toBe("ssh-keygen -t ed25519 -N ''");
  });

  it("omits -N entirely when setPassphrase is false, regardless of the passphrase field", () => {
    expect(line(spec({ setPassphrase: false, passphrase: "hunter2" }))).toBe("ssh-keygen -t ed25519");
  });

  it("renders every field together in real ssh-keygen order", () => {
    const s = spec({
      keyType: "rsa",
      bits: "4096",
      outputFile: "~/.ssh/deploy_key",
      comment: "deploy@ci",
      setPassphrase: true,
      passphrase: "",
      flags: { quiet: true },
    });
    expect(line(s)).toBe("ssh-keygen -t rsa -b 4096 -f '~/.ssh/deploy_key' -C deploy@ci -N '' --quiet");
  });
});

describe("export mode (-y)", () => {
  it("renders -y and -f, ignoring key type/bits/comment/passphrase", () => {
    const s = spec({
      keyType: "rsa",
      bits: "4096",
      comment: "ignored",
      setPassphrase: true,
      passphrase: "ignored",
      outputFile: "~/.ssh/id_ed25519",
      flags: { exportPublicKey: true },
    });
    expect(line(s)).toBe("ssh-keygen -y -f '~/.ssh/id_ed25519'");
  });

  it("renders -q alongside -y", () => {
    expect(line(spec({ outputFile: "id_rsa", flags: { exportPublicKey: true, quiet: true } }))).toBe(
      "ssh-keygen -y -f id_rsa --quiet",
    );
  });

  it("omits -f when no output file is given", () => {
    expect(line(spec({ flags: { exportPublicKey: true } }))).toBe("ssh-keygen -y");
  });
});

describe("lint", () => {
  it("SKG001 warns about an explicitly empty passphrase", () => {
    const result = lint(spec({ setPassphrase: true, passphrase: "" }));
    expect(result.diagnostics.map((d) => d.code)).toContain("SKG001");
    expect(result.diagnostics.find((d) => d.code === "SKG001")!.level).toBe("warning");
  });

  it("SKG001 does not fire when setPassphrase is false, or when a real passphrase is set", () => {
    expect(lint(spec({ setPassphrase: false, passphrase: "" })).diagnostics.map((d) => d.code)).not.toContain(
      "SKG001",
    );
    expect(
      lint(spec({ setPassphrase: true, passphrase: "hunter2" })).diagnostics.map((d) => d.code),
    ).not.toContain("SKG001");
  });

  it("SKG002 notes that -y ignores key type/bits/comment/passphrase", () => {
    expect(lint(spec({ flags: { exportPublicKey: true }, outputFile: "id_rsa" })).diagnostics.map((d) => d.code)).toContain(
      "SKG002",
    );
  });

  it("SKG003 errors when -y has no output file to read", () => {
    const result = lint(spec({ flags: { exportPublicKey: true } }));
    expect(result.diagnostics.map((d) => d.code)).toContain("SKG003");
    expect(result.hasErrors).toBe(true);
    expect(
      lint(spec({ flags: { exportPublicKey: true }, outputFile: "id_rsa" })).diagnostics.map((d) => d.code),
    ).not.toContain("SKG003");
  });

  it("SKG004 warns that -b has no effect for ed25519, and the fix clears it", () => {
    const s = spec({ keyType: "ed25519", bits: "4096" });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("SKG004");
    const fix = result.diagnostics.find((d) => d.code === "SKG004")!.fix!;
    expect(fix.apply(s).bits).toBe("");
    expect(lint(spec({ keyType: "rsa", bits: "4096" })).diagnostics.map((d) => d.code)).not.toContain("SKG004");
  });

  it("a plain ed25519 generation has no diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Generate an Ed25519 key (recommended)' sets the comment", () => {
    expect(line(getPreset("generate-ed25519")!.apply(spec()))).toBe("ssh-keygen -t ed25519 -C user@host");
  });

  it("'Generate an RSA 4096-bit key' sets rsa/4096", () => {
    expect(line(getPreset("generate-rsa-4096")!.apply(spec()))).toBe("ssh-keygen -t rsa -b 4096");
  });

  it("'No passphrase (for automation)' triggers SKG001", () => {
    const s = getPreset("no-passphrase-automation")!.apply(spec());
    expect(line(s)).toBe("ssh-keygen -t ed25519 -N ''");
    expect(lint(s).diagnostics.map((d) => d.code)).toContain("SKG001");
  });

  it("'Export the public key from a private key' sets -y and -f", () => {
    expect(line(getPreset("export-public-key")!.apply(spec()))).toBe("ssh-keygen -y -f '~/.ssh/id_ed25519'");
  });

  it("'Quiet generation (for scripts)' sets -q", () => {
    expect(line(getPreset("quiet-generation")!.apply(spec()))).toBe("ssh-keygen -t ed25519 --quiet");
  });
});

describe("describeSpec", () => {
  it("describes a plain ed25519 generation", () => {
    expect(describeSpec(spec())).toBe("Generate a new Ed25519 SSH key pair.");
  });

  it("describes rsa with bits, file, comment, and a passphrase", () => {
    expect(
      describeSpec(
        spec({ keyType: "rsa", bits: "4096", outputFile: "~/.ssh/deploy_key", comment: "deploy@ci", setPassphrase: true, passphrase: "hunter2" }),
      ),
    ).toBe('Generate a new RSA SSH key pair, 4096 bits, saved to ~/.ssh/deploy_key, commented "deploy@ci", protected by a passphrase.');
  });

  it("describes an explicit empty passphrase distinctly from a real one", () => {
    expect(describeSpec(spec({ setPassphrase: true, passphrase: "" }))).toBe(
      "Generate a new Ed25519 SSH key pair, with no passphrase.",
    );
  });

  it("describes export mode, short-circuiting key/bits/comment/passphrase", () => {
    expect(describeSpec(spec({ outputFile: "~/.ssh/id_ed25519", flags: { exportPublicKey: true } }))).toBe(
      "Print the public key for ~/.ssh/id_ed25519.",
    );
  });
});
