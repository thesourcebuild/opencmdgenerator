import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type SshSpec } from "@cmdgen/ssh";

const line = (spec: SshSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<SshSpec> = {}): SshSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("destination and connection fields", () => {
  it("renders user@host", () => {
    expect(line(spec({ host: "example.com", user: "deploy" }))).toBe("ssh deploy@example.com");
  });

  it("omits the user when none is given", () => {
    expect(line(spec({ host: "example.com" }))).toBe("ssh example.com");
  });

  it("renders -i and -p around the destination", () => {
    // ~/... is quoted here, deliberately — ssh has no cd-style tilde carve-out
    // (see tests/quote.test.ts for why quotePosix quotes it by default).
    expect(
      line(spec({ host: "example.com", user: "deploy", port: "2222", identityFile: "~/.ssh/deploy_ed25519" })),
    ).toBe("ssh -i '~/.ssh/deploy_ed25519' -p 2222 deploy@example.com");
  });

  it("appends a remote command after the destination", () => {
    expect(line(spec({ host: "example.com", remoteCommand: "uptime" }))).toBe("ssh example.com uptime");
  });
});

describe("cmd.exe rendering", () => {
  it("quotes a space-containing identity file path with cmd.exe double-quote rules, not POSIX single quotes", () => {
    expect(
      line(spec({ host: "h", shell: "cmd", identityFile: "C:\\Users\\me\\My Keys\\id_ed25519" })),
    ).toBe('ssh -i "C:\\Users\\me\\My Keys\\id_ed25519" h');
  });
});

describe("flags", () => {
  it("renders -o StrictHostKeyChecking=<value> as one logical flag, not glued together", () => {
    const argv = buildArgv(spec({ host: "h", flags: { strictHostKeyChecking: "accept-new" } }));
    // Two distinct tokens, not one "-o StrictHostKeyChecking=accept-new" blob —
    // otherwise quoting would wrap them together into a single shell argument.
    expect(argv.args.map((a) => a.text)).toEqual(["-o", "StrictHostKeyChecking=accept-new", "h"]);
    expect(line(spec({ host: "h", flags: { strictHostKeyChecking: "accept-new" } }))).toBe(
      "ssh -o StrictHostKeyChecking=accept-new h",
    );
  });

  it("renders port forwarding flags", () => {
    expect(line(spec({ host: "h", flags: { localForward: "8080:localhost:80" } }))).toBe(
      "ssh -L 8080:localhost:80 h",
    );
  });

  it("renders -o BatchMode=yes as two flag tokens", () => {
    expect(line(spec({ host: "h", flags: { batchMode: true } }))).toBe("ssh -o BatchMode=yes h");
  });
});

describe("lint", () => {
  it("SSH001 fires on an empty host", () => {
    expect(lint(spec()).diagnostics.map((d) => d.code)).toContain("SSH001");
    expect(lint(spec({ host: "h" })).diagnostics.map((d) => d.code)).not.toContain("SSH001");
  });

  it("SSH002 warns about agent forwarding", () => {
    expect(lint(spec({ host: "h", flags: { agentForwarding: true } })).diagnostics.map((d) => d.code)).toContain(
      "SSH002",
    );
  });

  it("SSH003 warns about trusted X11 forwarding and the fix switches to -X", () => {
    const s = spec({ host: "h", flags: { x11ForwardingTrusted: true } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("SSH003");
    const fixed = result.diagnostics.find((d) => d.code === "SSH003")!.fix!.apply(s);
    expect(fixed.flags.x11ForwardingTrusted).toBeUndefined();
    expect(fixed.flags.x11Forwarding).toBe(true);
  });

  it("SSH005 requires -N or a remote command alongside -f, and the fix adds -N", () => {
    const s = spec({ host: "h", flags: { background: true } });
    expect(lint(s).diagnostics.map((d) => d.code)).toContain("SSH005");
    expect(lint({ ...s, flags: { ...s.flags, noRemoteCommand: true } }).diagnostics.map((d) => d.code)).not.toContain(
      "SSH005",
    );
    expect(lint({ ...s, remoteCommand: "true" }).diagnostics.map((d) => d.code)).not.toContain("SSH005");

    const fix = lint(s).diagnostics.find((d) => d.code === "SSH005")!.fix!;
    expect(lint(fix.apply(s)).diagnostics.map((d) => d.code)).not.toContain("SSH005");
  });

  it("SSH006 flags disabled host key checking and the fix switches to accept-new", () => {
    const s = spec({ host: "h", flags: { strictHostKeyChecking: "no" } });
    const result = lint(s);
    expect(result.hasErrors).toBe(false);
    expect(result.isDestructive).toBe(true);
    const fixed = result.diagnostics.find((d) => d.code === "SSH006")!.fix!.apply(s);
    expect(fixed.flags.strictHostKeyChecking).toBe("accept-new");
  });

  it("a clean spec has no diagnostics", () => {
    expect(lint(spec({ host: "example.com", user: "deploy" })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Scripted / non-interactive' sets batch mode, a timeout, and accept-new host checking", () => {
    const scripted = getPreset("scripted")!.apply(spec({ host: "h" }));
    expect(line(scripted)).toBe("ssh -o StrictHostKeyChecking=accept-new -o BatchMode=yes -o ConnectTimeout=10 h");
  });

  it("'SOCKS proxy' implies -N", () => {
    const socks = getPreset("socks-proxy")!.apply(spec({ host: "h" }));
    expect(line(socks)).toBe("ssh -D 1080 -N h");
  });

  it("'Local port forward' tunnels localhost:8080 to the remote host's own localhost:3306 (database)", () => {
    const s = getPreset("local-forward")!.apply(spec({ host: "remote-server" }));
    expect(line(s)).toBe("ssh -L 8080:localhost:3306 -N remote-server");
  });

  it("'Remote port forward' exposes localhost:3000 as remote-gateway:9000", () => {
    const s = getPreset("remote-forward")!.apply(spec({ host: "remote-gateway" }));
    expect(line(s)).toBe("ssh -R 9000:localhost:3000 -N remote-gateway");
    // Matches the doc's own risk framing — SSH004 always fires for -R.
    expect(lint(s).diagnostics.map((d) => d.code)).toContain("SSH004");
  });

  it("picking Local, then Remote, then SOCKS in turn leaves only the last one active — they don't accumulate", () => {
    // Reproduces trying out each option in the Examples dropdown one after
    // another: each preset must clear the OTHER forwarding flags, or -L/-R/-D
    // all end up active simultaneously (a real, confusing bug this guards).
    let s = spec({ host: "h" });
    s = getPreset("local-forward")!.apply(s);
    s = getPreset("remote-forward")!.apply(s);
    s = getPreset("socks-proxy")!.apply(s);
    expect(line(s)).toBe("ssh -D 1080 -N h");
    expect(s.flags.localForward).toBeUndefined();
    expect(s.flags.remoteForward).toBeUndefined();

    // And the reverse order, ending on local-forward.
    let t = spec({ host: "h" });
    t = getPreset("socks-proxy")!.apply(t);
    t = getPreset("remote-forward")!.apply(t);
    t = getPreset("local-forward")!.apply(t);
    expect(line(t)).toBe("ssh -L 8080:localhost:3306 -N h");
    expect(t.flags.remoteForward).toBeUndefined();
    expect(t.flags.dynamicForward).toBeUndefined();
  });

  it("presets never leak flags from an unrelated, previously-picked preset — every preset replaces flags wholesale", () => {
    // Reproduces the reported bug: Quick connect (-v), then List supported
    // ciphers (-Q cipher), then Forward a Unix socket, left -v and -Q cipher
    // still active alongside -L because non-forwarding presets used to merge
    // onto whatever flags already existed instead of replacing them outright.
    let s = spec({ host: "h" });
    s = getPreset("quick-connect")!.apply(s);
    s = getPreset("query-ciphers")!.apply(s);
    s = getPreset("unix-socket-forward")!.apply(s);
    expect(line(s)).toBe("ssh -L /tmp/local.sock:/var/run/docker.sock -N h");
    expect(s.flags.verbose).toBeUndefined();
    expect(s.flags.queryOption).toBeUndefined();
  });

  it("'Forward a Unix socket' also clears the other three forwarding flags when picked after them", () => {
    let s = spec({ host: "h" });
    s = getPreset("local-forward")!.apply(s);
    s = getPreset("remote-forward")!.apply(s);
    s = getPreset("socks-proxy")!.apply(s);
    s = getPreset("unix-socket-forward")!.apply(s);
    expect(line(s)).toBe("ssh -L /tmp/local.sock:/var/run/docker.sock -N h");
    expect(s.flags.remoteForward).toBeUndefined();
    expect(s.flags.dynamicForward).toBeUndefined();
  });

  it("local/remote/dynamic forward presets carry a mnemonic, canonical command example, how-it-works, and use case for the Example section", () => {
    for (const id of ["local-forward", "remote-forward", "socks-proxy"]) {
      const preset = getPreset(id)!;
      expect(preset.mnemonic, `${id}.mnemonic`).toBeTruthy();
      // The mnemonic is its own line, not folded into the summary prose.
      expect(preset.summary.includes("Mnemonic"), `${id}.summary should not embed the mnemonic`).toBe(false);
      expect(preset.commandExample, `${id}.commandExample`).toBeTruthy();
      expect(preset.commandExample!.startsWith("ssh "), `${id}.commandExample should be a real ssh invocation`).toBe(true);
      expect(preset.howItWorks, `${id}.howItWorks`).toBeTruthy();
      expect(preset.useCase, `${id}.useCase`).toBeTruthy();
    }

    expect(getPreset("local-forward")!.mnemonic).toBe(
      "-L local_port:remote_host:remote_port or -L local_port:destination_host:destination_port",
    );
    expect(getPreset("remote-forward")!.mnemonic).toBe(
      "-R remote_port:local_host:local_port or remote_port:destination_host:destination_port ",
    );
    expect(getPreset("socks-proxy")!.mnemonic).toBe("-D local_proxy_port");
  });

  it("each forward preset's commandExample is not just plausible-looking — it is what the tool actually generates for that preset", () => {
    // user@host is baked into the destination via the `user` field; the
    // preset's own placeholder host from its example is reused so the two
    // sides can be compared token-for-token.
    const cases: [string, string, string][] = [
      ["local-forward", "user", "remote-server"],
      ["remote-forward", "user", "remote-gateway"],
      ["socks-proxy", "user", "remote-proxy"],
    ];
    for (const [id, user, host] of cases) {
      const preset = getPreset(id)!;
      const applied = preset.apply(spec({ host, user }));
      expect(line(applied), id).toBe(preset.commandExample);
    }
  });

  it("'Forward a Unix socket (e.g. Docker)' forwards a socket path through -L, not a TCP port", () => {
    const s = getPreset("unix-socket-forward")!.apply(spec({ host: "h" }));
    expect(line(s)).toBe("ssh -L /tmp/local.sock:/var/run/docker.sock -N h");
  });

  it("describeSpec distinguishes a Unix socket forward from a port forward", () => {
    const portForward = spec({ host: "h", flags: { localForward: "8080:localhost:80" } });
    expect(describeSpec(portForward)).toMatch(/forwarding local port 8080:localhost:80/);

    const socketForward = spec({ host: "h", flags: { localForward: "/tmp/local.sock:/var/run/docker.sock" } });
    expect(describeSpec(socketForward)).toMatch(/forwarding the Unix socket \/tmp\/local\.sock:\/var\/run\/docker\.sock/);

    const remoteSocketForward = spec({ host: "h", flags: { remoteForward: "/tmp/a.sock:/tmp/b.sock" } });
    expect(describeSpec(remoteSocketForward)).toMatch(/forwarding the remote Unix socket \/tmp\/a\.sock:\/tmp\/b\.sock/);
  });

  it("'Start connection sharing' sets master mode, a control path, and backgrounds with -N", () => {
    // Argv order follows each flag's catalogue `order`, not preset-declaration
    // order — -N/-f (output group) sort before -M/-S (multiplexing group).
    const shared = getPreset("start-connection-sharing")!.apply(spec({ host: "h" }));
    expect(line(shared)).toBe("ssh -N -f -M -S '~/.ssh/cm-%r@%h:%p' h");
  });

  it("'List supported ciphers' sets -Q cipher", () => {
    const q = getPreset("query-ciphers")!.apply(spec({ host: "h" }));
    expect(line(q)).toBe("ssh -Q cipher h");
  });
});

describe("newly-added flags (jump host, auth, multiplexing, diagnostics)", () => {
  it("renders the jump host flag", () => {
    expect(line(spec({ host: "h", flags: { jumpHost: "user@bastion:22" } }))).toBe(
      "ssh -J user@bastion:22 h",
    );
  });

  it("renders IPv4/IPv6 restriction as an enum", () => {
    expect(line(spec({ host: "h", flags: { ipVersion: "ipv4" } }))).toBe("ssh -4 h");
    expect(line(spec({ host: "h", flags: { ipVersion: "ipv6" } }))).toBe("ssh -6 h");
  });

  it("renders -B/-b for interface and address binding", () => {
    expect(line(spec({ host: "h", flags: { bindInterface: "eth0" } }))).toBe("ssh -B eth0 h");
    expect(line(spec({ host: "h", flags: { bindAddress: "192.168.1.5" } }))).toBe("ssh -b 192.168.1.5 h");
  });

  it("renders cipher/mac/pkcs11 authentication flags", () => {
    expect(line(spec({ host: "h", flags: { cipherSpec: "aes256-gcm@openssh.com" } }))).toBe(
      "ssh -c aes256-gcm@openssh.com h",
    );
    expect(line(spec({ host: "h", flags: { macSpec: "hmac-sha2-256" } }))).toBe("ssh -m hmac-sha2-256 h");
    expect(line(spec({ host: "h", flags: { pkcs11: "/usr/lib/opensc-pkcs11.so" } }))).toBe(
      "ssh -I /usr/lib/opensc-pkcs11.so h",
    );
  });

  it("renders GSSAPI forwarding, and -K/-k contradict each other", () => {
    expect(line(spec({ host: "h", flags: { gssapiForwarding: true } }))).toBe("ssh -K h");
    expect(line(spec({ host: "h", flags: { gssapiNoForwarding: true } }))).toBe("ssh -k h");
    expect(
      lint(spec({ host: "h", flags: { gssapiForwarding: true, gssapiNoForwarding: true } })).diagnostics.map(
        (d) => d.code,
      ),
    ).toContain("SSH007");
  });

  it("renders -a/-x, and each contradicts its corresponding forward-enable flag", () => {
    expect(line(spec({ host: "h", flags: { disableAgentForwarding: true } }))).toBe("ssh -a h");
    expect(line(spec({ host: "h", flags: { disableX11Forwarding: true } }))).toBe("ssh -x h");
    expect(
      lint(spec({ host: "h", flags: { agentForwarding: true, disableAgentForwarding: true } })).diagnostics.map(
        (d) => d.code,
      ),
    ).toContain("SSH007");
    expect(
      lint(spec({ host: "h", flags: { x11Forwarding: true, disableX11Forwarding: true } })).diagnostics.map(
        (d) => d.code,
      ),
    ).toContain("SSH007");
  });

  it("renders -g (gatewayPorts) and SSH012 warns about it", () => {
    expect(line(spec({ host: "h", flags: { gatewayPorts: true } }))).toBe("ssh -g h");
    expect(lint(spec({ host: "h", flags: { gatewayPorts: true } })).diagnostics.map((d) => d.code)).toContain(
      "SSH012",
    );
  });

  it("renders -W (stdio forward), and SSH011 warns if a remote command is also set", () => {
    expect(line(spec({ host: "h", flags: { stdioForward: "target:22" } }))).toBe("ssh -W target:22 h");
    expect(
      lint(spec({ host: "h", remoteCommand: "uptime", flags: { stdioForward: "target:22" } })).diagnostics.map(
        (d) => d.code,
      ),
    ).toContain("SSH011");
  });

  it("renders -w (tunnel device) and SSH010 always notes the privilege requirement", () => {
    expect(line(spec({ host: "h", flags: { tunnelDevice: "0:0" } }))).toBe("ssh -w 0:0 h");
    expect(lint(spec({ host: "h", flags: { tunnelDevice: "0:0" } })).diagnostics.map((d) => d.code)).toContain(
      "SSH010",
    );
  });

  it("renders multiplexing flags (-M/-MM, -O, -S)", () => {
    expect(line(spec({ host: "h", flags: { masterMode: "master" } }))).toBe("ssh -M h");
    expect(line(spec({ host: "h", flags: { masterMode: "master-confirm" } }))).toBe("ssh -M -M h");
    expect(line(spec({ host: "h", flags: { controlCommand: "exit" } }))).toBe("ssh -O exit h");
    expect(line(spec({ host: "h", flags: { controlPath: "~/.ssh/cm" } }))).toBe("ssh -S '~/.ssh/cm' h");
  });

  it("SSH009 warns when -O is set without -S", () => {
    expect(
      lint(spec({ host: "h", flags: { controlCommand: "check" } })).diagnostics.map((d) => d.code),
    ).toContain("SSH009");
    expect(
      lint(
        spec({ host: "h", flags: { controlCommand: "check", controlPath: "~/.ssh/cm" } }),
      ).diagnostics.map((d) => d.code),
    ).not.toContain("SSH009");
  });

  it("renders -n (stdin from /dev/null), -y (syslog), -E (log file), -e (escape char)", () => {
    expect(line(spec({ host: "h", flags: { stdinNull: true } }))).toBe("ssh -n h");
    expect(line(spec({ host: "h", flags: { syslog: true } }))).toBe("ssh -y h");
    expect(line(spec({ host: "h", flags: { logFile: "ssh-debug.log" } }))).toBe("ssh -E ssh-debug.log h");
    expect(line(spec({ host: "h", flags: { escapeChar: "none" } }))).toBe("ssh -e none h");
  });

  it("-V, -G and -Q print-and-exit — SSH008 warns that nothing else takes effect", () => {
    expect(lint(spec({ host: "h", flags: { version: true } })).diagnostics.map((d) => d.code)).toContain("SSH008");
    expect(lint(spec({ host: "h", flags: { printConfig: true } })).diagnostics.map((d) => d.code)).toContain(
      "SSH008",
    );
    expect(lint(spec({ host: "h", flags: { queryOption: "kex" } })).diagnostics.map((d) => d.code)).toContain(
      "SSH008",
    );
  });

  it("describeSpec short-circuits for -V/-G/-Q since nothing else applies", () => {
    expect(describeSpec(spec({ host: "h", flags: { version: true } }))).toMatch(/version and exit/);
    expect(describeSpec(spec({ host: "h", flags: { queryOption: "mac" } }))).toMatch(/supported mac list/);
  });
});
