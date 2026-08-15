import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type IfconfigSpec } from "@cmdgen/ifconfig";

const line = (spec: IfconfigSpec) => renderOneLine(buildArgv(spec), spec.platform);

const spec = (partial: Partial<IfconfigSpec> = {}): IfconfigSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("POSIX (ifconfig)", () => {
  it("a bare ifconfig lists every interface", () => {
    expect(line(spec())).toBe("ifconfig");
  });

  it("a bare interface name", () => {
    expect(line(spec({ interfaceName: "eth0" }))).toBe("ifconfig eth0");
  });

  it("renders the up and down bare keywords", () => {
    expect(line(spec({ interfaceName: "eth0", state: "up" }))).toBe("ifconfig eth0 up");
    expect(line(spec({ interfaceName: "eth0", state: "down" }))).toBe("ifconfig eth0 down");
  });

  it("renders a bare netmask keyword+value pair", () => {
    expect(line(spec({ interfaceName: "eth0", netmask: "255.255.255.0" }))).toBe(
      "ifconfig eth0 netmask 255.255.255.0",
    );
  });

  it("renders a bare mtu keyword+value pair", () => {
    expect(line(spec({ interfaceName: "eth0", mtu: "1500" }))).toBe("ifconfig eth0 mtu 1500");
  });

  it("combines interface, state, netmask, and mtu in order", () => {
    expect(
      line(spec({ interfaceName: "eth0", state: "up", netmask: "255.255.255.0", mtu: "1500" })),
    ).toBe("ifconfig eth0 up netmask 255.255.255.0 mtu 1500");
  });

  it("quotes an interface name with spaces", () => {
    expect(line(spec({ interfaceName: "eth 0" }))).toBe("ifconfig 'eth 0'");
  });

  it("Windows-only flags are silently dropped", () => {
    expect(line(spec({ interfaceName: "eth0", flags: { all: true, release: true } }))).toBe("ifconfig eth0");
  });

  it("mac renders identically to linux", () => {
    expect(line(spec({ platform: "mac", interfaceName: "en0", state: "up" }))).toBe("ifconfig en0 up");
  });
});

describe("Windows-hosted POSIX (Cygwin/MSYS2/WSL real ifconfig)", () => {
  const cygwin = (partial: Partial<IfconfigSpec> = {}): IfconfigSpec => spec({ platform: "windows-cygwin", ...partial });
  const msys = (partial: Partial<IfconfigSpec> = {}): IfconfigSpec => spec({ platform: "windows-msys", ...partial });
  const wsl = (partial: Partial<IfconfigSpec> = {}): IfconfigSpec => spec({ platform: "windows-wsl", ...partial });

  it("binary stays ifconfig, not ipconfig", () => {
    expect(line(cygwin())).toBe("ifconfig");
    expect(line(msys())).toBe("ifconfig");
    expect(line(wsl())).toBe("ifconfig");
  });

  it("renders the up/down/netmask/mtu bare keywords identically to linux/mac", () => {
    expect(line(cygwin({ interfaceName: "eth0", state: "up" }))).toBe("ifconfig eth0 up");
    expect(line(msys({ interfaceName: "eth0", state: "down" }))).toBe("ifconfig eth0 down");
    expect(line(wsl({ interfaceName: "eth0", state: "down" }))).toBe("ifconfig eth0 down");
    expect(
      line(cygwin({ interfaceName: "eth0", state: "up", netmask: "255.255.255.0", mtu: "1500" })),
    ).toBe("ifconfig eth0 up netmask 255.255.255.0 mtu 1500");
    expect(
      line(wsl({ interfaceName: "eth0", state: "up", netmask: "255.255.255.0", mtu: "1500" })),
    ).toBe("ifconfig eth0 up netmask 255.255.255.0 mtu 1500");
  });

  it("quotes like POSIX, not cmd/PowerShell", () => {
    expect(line(cygwin({ interfaceName: "eth 0" }))).toBe("ifconfig 'eth 0'");
    expect(line(msys({ interfaceName: "eth 0" }))).toBe("ifconfig 'eth 0'");
    expect(line(wsl({ interfaceName: "eth 0" }))).toBe("ifconfig 'eth 0'");
  });

  it("Windows-only flags (/all, /release, /renew, /flushdns) are silently dropped", () => {
    expect(
      line(cygwin({ interfaceName: "eth0", flags: { all: true, release: true, renew: true, flushDns: true } })),
    ).toBe("ifconfig eth0");
    expect(
      line(msys({ interfaceName: "eth0", flags: { all: true, release: true, renew: true, flushDns: true } })),
    ).toBe("ifconfig eth0");
    expect(
      line(wsl({ interfaceName: "eth0", flags: { all: true, release: true, renew: true, flushDns: true } })),
    ).toBe("ifconfig eth0");
  });
});

describe("Windows (ipconfig)", () => {
  const cmd = (partial: Partial<IfconfigSpec> = {}): IfconfigSpec => spec({ platform: "windows-cmd", ...partial });
  const ps = (partial: Partial<IfconfigSpec> = {}): IfconfigSpec => spec({ platform: "windows-powershell", ...partial });

  it("a bare ipconfig lists every adapter, on both cmd.exe and PowerShell", () => {
    expect(line(cmd())).toBe("ipconfig");
    expect(line(ps())).toBe("ipconfig");
  });

  it("an adapter name", () => {
    expect(line(cmd({ interfaceName: "Ethernet" }))).toBe("ipconfig Ethernet");
    expect(line(ps({ interfaceName: "Ethernet" }))).toBe("ipconfig Ethernet");
  });

  it("renders /all, /release, /renew, /flushdns", () => {
    expect(line(cmd({ flags: { all: true } }))).toBe("ipconfig /all");
    expect(line(cmd({ flags: { release: true } }))).toBe("ipconfig /release");
    expect(line(cmd({ flags: { renew: true } }))).toBe("ipconfig /renew");
    expect(line(cmd({ flags: { flushDns: true } }))).toBe("ipconfig /flushdns");
  });

  it("puts the adapter name after the flag, matching real ipconfig /release ADAPTER", () => {
    expect(line(cmd({ interfaceName: "Ethernet", flags: { release: true } }))).toBe("ipconfig /release Ethernet");
  });

  it("POSIX-only operand fields are silently ignored", () => {
    expect(line(cmd({ interfaceName: "Ethernet", state: "up", netmask: "255.255.255.0", mtu: "1500" }))).toBe(
      "ipconfig Ethernet",
    );
  });

  it("quotes an adapter name with spaces differently on cmd.exe vs PowerShell", () => {
    expect(line(cmd({ interfaceName: "Local Area Connection" }))).toBe('ipconfig "Local Area Connection"');
    expect(line(ps({ interfaceName: "Local Area Connection" }))).toBe("ipconfig 'Local Area Connection'");
  });
});

describe("presets", () => {
  it("'List all interfaces' is bare ifconfig on POSIX, bare ipconfig on Windows", () => {
    expect(line(getPreset("list-all-interfaces")!.apply(spec({ interfaceName: "eth0" })))).toBe("ifconfig");
    expect(
      line(getPreset("list-all-interfaces")!.apply(spec({ platform: "windows-cmd", interfaceName: "Ethernet" }))),
    ).toBe("ipconfig");
  });

  it("'Bring an interface up' is POSIX only, which includes Cygwin/MSYS2/WSL", () => {
    expect(line(getPreset("bring-interface-up")!.apply(spec()))).toBe("ifconfig eth0 up");
    expect(getPreset("bring-interface-up")!.isApplicable?.(spec({ platform: "windows-cmd" }))).toBe(false);
    expect(getPreset("bring-interface-up")!.isApplicable?.(spec({ platform: "windows-powershell" }))).toBe(false);
    expect(getPreset("bring-interface-up")!.isApplicable?.(spec({ platform: "mac" }))).toBe(true);
    expect(getPreset("bring-interface-up")!.isApplicable?.(spec({ platform: "windows-cygwin" }))).toBe(true);
    expect(getPreset("bring-interface-up")!.isApplicable?.(spec({ platform: "windows-msys" }))).toBe(true);
    expect(getPreset("bring-interface-up")!.isApplicable?.(spec({ platform: "windows-wsl" }))).toBe(true);
  });

  it("'Release the DHCP lease' is Windows only, which excludes Cygwin/MSYS2/WSL", () => {
    expect(line(getPreset("release-dhcp-lease")!.apply(spec({ platform: "windows-cmd" })))).toBe("ipconfig /release");
    expect(getPreset("release-dhcp-lease")!.isApplicable?.(spec({ platform: "linux" }))).toBe(false);
    expect(getPreset("release-dhcp-lease")!.isApplicable?.(spec({ platform: "mac" }))).toBe(false);
    expect(getPreset("release-dhcp-lease")!.isApplicable?.(spec({ platform: "windows-powershell" }))).toBe(true);
    expect(getPreset("release-dhcp-lease")!.isApplicable?.(spec({ platform: "windows-cygwin" }))).toBe(false);
    expect(getPreset("release-dhcp-lease")!.isApplicable?.(spec({ platform: "windows-msys" }))).toBe(false);
    expect(getPreset("release-dhcp-lease")!.isApplicable?.(spec({ platform: "windows-wsl" }))).toBe(false);
  });
});

describe("lint", () => {
  it("has no rules — nothing to catch", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
    expect(lint(spec({ flags: { release: true, renew: true } })).diagnostics).toEqual([]);
  });
});

describe("describeSpec", () => {
  it("describes a bare listing on POSIX", () => {
    expect(describeSpec(spec())).toBe("List every network interface.");
  });

  it("describes a bare listing on Windows", () => {
    expect(describeSpec(spec({ platform: "windows-cmd" }))).toBe("List every network adapter.");
  });

  it("describes a bare listing on Cygwin/MSYS2/WSL with POSIX wording, not Windows wording", () => {
    expect(describeSpec(spec({ platform: "windows-cygwin" }))).toBe("List every network interface.");
    expect(describeSpec(spec({ platform: "windows-msys" }))).toBe("List every network interface.");
    expect(describeSpec(spec({ platform: "windows-wsl" }))).toBe("List every network interface.");
  });

  it("describes a specific interface", () => {
    expect(describeSpec(spec({ interfaceName: "eth0" }))).toBe("Show configuration for eth0.");
  });

  it("mentions bringing the interface up or down", () => {
    expect(describeSpec(spec({ interfaceName: "eth0", state: "up" }))).toBe(
      "Show configuration for eth0, bringing it up.",
    );
    expect(describeSpec(spec({ interfaceName: "eth0", state: "down" }))).toBe(
      "Show configuration for eth0, bringing it down.",
    );
  });

  it("mentions netmask and mtu", () => {
    expect(describeSpec(spec({ interfaceName: "eth0", netmask: "255.255.255.0", mtu: "1500" }))).toBe(
      "Show configuration for eth0, setting its netmask to 255.255.255.0, setting its MTU to 1500.",
    );
  });

  it("mentions the Windows-only flags", () => {
    expect(describeSpec(spec({ platform: "windows-cmd", flags: { release: true } }))).toBe(
      "List every network adapter, releasing its DHCP lease.",
    );
    expect(describeSpec(spec({ platform: "windows-cmd", flags: { renew: true } }))).toBe(
      "List every network adapter, renewing its DHCP lease.",
    );
    expect(describeSpec(spec({ platform: "windows-cmd", flags: { flushDns: true } }))).toBe(
      "List every network adapter, flushing the DNS resolver cache.",
    );
    expect(describeSpec(spec({ platform: "windows-cmd", flags: { all: true } }))).toBe(
      "List every network adapter, showing detailed configuration for every adapter.",
    );
  });
});
