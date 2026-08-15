import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type KillSpec } from "@cmdgen/kill";

const line = (spec: KillSpec) => renderOneLine(buildArgv(spec), spec.platform);

const spec = (partial: Partial<KillSpec> = {}): KillSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("signal and targets", () => {
  it("defaults to SIGTERM", () => {
    expect(line(spec({ targets: ["1234"] }))).toBe("kill -TERM 1234");
  });

  it("renders multiple targets in order", () => {
    expect(line(spec({ targets: ["1234", "5678"] }))).toBe("kill -TERM 1234 5678");
  });

  it("accepts a numeric signal", () => {
    expect(line(spec({ signal: "9", targets: ["1234"] }))).toBe("kill -9 1234");
  });

  it("renders just the binary with no targets", () => {
    expect(line(spec({ targets: [] }))).toBe("kill -TERM");
  });

  it("normalizes signal case to upper, regardless of how it was typed", () => {
    expect(line(spec({ signal: "term", targets: ["1234"] }))).toBe("kill -TERM 1234");
    expect(line(spec({ signal: "kill", targets: ["1234"] }))).toBe("kill -KILL 1234");
  });

  it("inserts -- before a first target that looks negative", () => {
    expect(line(spec({ signal: "TERM", targets: ["-1"] }))).toBe("kill -TERM -- -1");
    expect(line(spec({ signal: "TERM", targets: ["-500"] }))).toBe("kill -TERM -- -500");
  });

  it("does not insert -- when the first target is not negative-looking", () => {
    expect(line(spec({ signal: "TERM", targets: ["1234", "-1"] }))).toBe("kill -TERM 1234 -1");
  });
});

describe("signal styles — three equivalent spellings", () => {
  it("bare (default) renders -SIGNAL", () => {
    expect(line(spec({ signal: "TERM", signalStyle: "bare", targets: ["1"] }))).toBe("kill -TERM 1");
  });

  it("short renders -s SIGNAL as two tokens", () => {
    expect(line(spec({ signal: "TERM", signalStyle: "short", targets: ["1"] }))).toBe("kill -s TERM 1");
  });

  it("long renders --signal=SIGNAL as one attached token", () => {
    const argv = buildArgv(spec({ signal: "TERM", signalStyle: "long", targets: ["1"] }));
    expect(argv.args.map((a) => a.text)).toEqual(["--signal=TERM", "1"]);
    expect(line(spec({ signal: "TERM", signalStyle: "long", targets: ["1"] }))).toBe("kill --signal=TERM 1");
  });
});

describe("list/table mode — kill's real second synopsis", () => {
  it("renders -l with no signals (list every name)", () => {
    expect(line(spec({ mode: "list" }))).toBe("kill -l");
  });

  it("renders -l with specific signals to convert, upper-cased", () => {
    expect(line(spec({ mode: "list", listSignals: ["term", "9"] }))).toBe("kill -l TERM 9");
  });

  it("renders -t for table mode", () => {
    expect(line(spec({ mode: "table" }))).toBe("kill -t");
    expect(line(spec({ mode: "table", listSignals: ["HUP"] }))).toBe("kill -t HUP");
  });

  it("ignores signal/targets entirely in list/table mode", () => {
    expect(line(spec({ mode: "list", signal: "KILL", targets: ["1234"] }))).toBe("kill -l");
  });
});

describe("lint — this is the safety-critical part", () => {
  it("KILL001 fires with no targets", () => {
    expect(lint(spec()).diagnostics.map((d) => d.code)).toContain("KILL001");
  });

  it("KILL002 warns about SIGKILL (by name or number) and the fix switches to SIGTERM", () => {
    const byName = spec({ signal: "KILL", targets: ["123"] });
    expect(lint(byName).diagnostics.map((d) => d.code)).toContain("KILL002");
    const byNumber = spec({ signal: "9", targets: ["123"] });
    expect(lint(byNumber).diagnostics.map((d) => d.code)).toContain("KILL002");

    const fix = lint(byName).diagnostics.find((d) => d.code === "KILL002")!.fix!;
    expect(fix.apply(byName).signal).toBe("TERM");
  });

  it("KILL003 flags PID 1", () => {
    expect(lint(spec({ targets: ["1"] })).diagnostics.map((d) => d.code)).toContain("KILL003");
    expect(lint(spec({ targets: ["1234"] })).diagnostics.map((d) => d.code)).not.toContain("KILL003");
  });

  it("KILL004 flags broadcast targets -1 and 0", () => {
    expect(lint(spec({ targets: ["-1"] })).diagnostics.map((d) => d.code)).toContain("KILL004");
    expect(lint(spec({ targets: ["0"] })).diagnostics.map((d) => d.code)).toContain("KILL004");
  });

  it("KILL004 also flags a PID below -1 as targeting a whole process group", () => {
    const codes = lint(spec({ targets: ["-500"] })).diagnostics.map((d) => d.code);
    expect(codes).toContain("KILL004");
    // -500 is a process-group target, not literally "-1" or "0" — must not be misreported as either.
    const message = lint(spec({ targets: ["-500"] })).diagnostics.find((d) => d.code === "KILL004")!.message;
    expect(message).toMatch(/process group/);
  });

  it("KILL004 fires once per distinct special target when several are present at once", () => {
    const codes = lint(spec({ targets: ["-1", "0", "-500"] })).diagnostics.map((d) => d.code);
    expect(codes.filter((c) => c === "KILL004")).toHaveLength(3);
  });

  it("KILL005 warns about a target that isn't a PID or job spec", () => {
    expect(lint(spec({ targets: ["firefox"] })).diagnostics.map((d) => d.code)).toContain("KILL005");
    expect(lint(spec({ targets: ["%1"] })).diagnostics.map((d) => d.code)).not.toContain("KILL005");
  });

  it("KILL006 notes that signal 0 is a permission test, not a real signal", () => {
    expect(lint(spec({ signal: "0", targets: ["1234"] })).diagnostics.map((d) => d.code)).toContain("KILL006");
    expect(lint(spec({ signal: "TERM", targets: ["1234"] })).diagnostics.map((d) => d.code)).not.toContain(
      "KILL006",
    );
  });

  it("a plain SIGTERM to a real PID has no diagnostics", () => {
    expect(lint(spec({ targets: ["4242"] })).diagnostics).toEqual([]);
  });

  it("mode !== 'signal' suppresses every signal/target-specific rule, even with values that would otherwise fire", () => {
    const s = spec({ mode: "list", signal: "0", targets: [] });
    const codes = lint(s).diagnostics.map((d) => d.code);
    expect(codes).toEqual([]);
  });
});

describe("presets", () => {
  it("'Force kill' selects SIGKILL and is flagged destructive", () => {
    const forced = getPreset("force-kill")!.apply(spec({ targets: ["1234"] }));
    expect(line(forced)).toBe("kill -KILL 1234");
    expect(lint(forced).isDestructive).toBe(true);
  });

  it("'Graceful stop' selects SIGTERM", () => {
    expect(line(getPreset("graceful-stop")!.apply(spec({ targets: ["1234"] })))).toBe("kill -TERM 1234");
  });

  it("'List all signal names' switches to list mode with no diagnostics, even with no prior targets", () => {
    const s = getPreset("list-signals")!.apply(spec());
    expect(line(s)).toBe("kill -l");
    expect(lint(s).diagnostics).toEqual([]);
  });

  it("'Signal number reference table' switches to table mode", () => {
    expect(line(getPreset("signal-table")!.apply(spec()))).toBe("kill -t");
  });

  it("picking 'Force kill' then 'List all signal names' leaves no signal/target leakage in the rendered command", () => {
    let s = spec({ targets: ["1234"] });
    s = getPreset("force-kill")!.apply(s);
    s = getPreset("list-signals")!.apply(s);
    expect(line(s)).toBe("kill -l");
  });

  it("every signal-sending preset resets mode back to 'signal', so picking one right after list/table mode isn't a no-op", () => {
    // Regression: these presets used to only set `signal`, leaving a stale
    // mode="list"/"table" in place — buildArgv ignores signal/targets
    // entirely outside "signal" mode, so the rendered command silently never
    // changed, looking exactly like the preset picker had stopped working.
    for (const id of ["graceful-stop", "force-kill", "reload-config", "pause", "resume"]) {
      let s = spec({ targets: ["1234"] });
      s = getPreset("list-signals")!.apply(s);
      expect(line(s), "sanity: list mode active first").toBe("kill -l");

      s = getPreset(id)!.apply(s);
      expect(s.mode, `${id} should reset mode to "signal"`).toBe("signal");
      expect(line(s), `${id} should render a real signal command, not still "kill -l"`).not.toBe("kill -l");
    }
  });
});

describe("cygwin/msys/wsl — identical behavior to posix, kill has no path arguments to convert", () => {
  for (const platform of ["windows-cygwin", "windows-msys", "windows-wsl"] as const) {
    it(`[${platform}] defaults to SIGTERM, same as posix`, () => {
      expect(line(spec({ platform, targets: ["1234"] }))).toBe("kill -TERM 1234");
    });

    it(`[${platform}] accepts a numeric signal and inserts -- before a negative-looking target`, () => {
      expect(line(spec({ platform, signal: "9", targets: ["1234"] }))).toBe("kill -9 1234");
      expect(line(spec({ platform, signal: "TERM", targets: ["-1"] }))).toBe("kill -TERM -- -1");
    });

    it(`[${platform}] renders all three signal styles identically to posix`, () => {
      expect(line(spec({ platform, signal: "TERM", signalStyle: "bare", targets: ["1"] }))).toBe("kill -TERM 1");
      expect(line(spec({ platform, signal: "TERM", signalStyle: "short", targets: ["1"] }))).toBe("kill -s TERM 1");
      expect(line(spec({ platform, signal: "TERM", signalStyle: "long", targets: ["1"] }))).toBe(
        "kill --signal=TERM 1",
      );
    });

    it(`[${platform}] list/table mode renders the same as posix`, () => {
      expect(line(spec({ platform, mode: "list" }))).toBe("kill -l");
      expect(line(spec({ platform, mode: "list", listSignals: ["term", "9"] }))).toBe("kill -l TERM 9");
      expect(line(spec({ platform, mode: "table", listSignals: ["HUP"] }))).toBe("kill -t HUP");
    });

    it(`[${platform}] the binary stays "kill", never "Stop-Process"`, () => {
      expect(buildArgv(spec({ platform, targets: ["1234"] })).binary).toBe("kill");
    });

    it(`[${platform}] "graceful-stop" and "force-kill" presets are applicable and render the same as posix`, () => {
      expect(getPreset("graceful-stop")!.isApplicable?.(spec({ platform }))).toBe(true);
      expect(getPreset("force-kill")!.isApplicable?.(spec({ platform }))).toBe(true);

      const graceful = getPreset("graceful-stop")!.apply(spec({ platform, targets: ["1234"] }));
      expect(line(graceful)).toBe("kill -TERM 1234");
      expect(line(graceful)).toBe(line(getPreset("graceful-stop")!.apply(spec({ targets: ["1234"] }))));

      const forced = getPreset("force-kill")!.apply(spec({ platform, targets: ["1234"] }));
      expect(line(forced)).toBe("kill -KILL 1234");
      expect(line(forced)).toBe(line(getPreset("force-kill")!.apply(spec({ targets: ["1234"] }))));
    });

    it(`[${platform}] describeSpec treats list/table mode the same as posix, not the generic "Send SIG..." fallthrough`, () => {
      expect(describeSpec(spec({ platform, mode: "list" }))).toBe(
        "List every supported signal name — nothing is signaled.",
      );
      expect(describeSpec(spec({ platform, mode: "table" }))).toBe(
        "Print a table of numbers, names, and descriptions for every supported signal name — nothing is signaled.",
      );
      expect(describeSpec(spec({ platform, targets: ["1234"] }))).toBe("Send SIGTERM to process 1234.");
    });

    it(`[${platform}] is byte-identical to posix across a representative set of specs (no path conversion corrupts PIDs/signals)`, () => {
      const variants: Partial<KillSpec>[] = [
        { targets: ["1234", "5678"] },
        { signal: "kill", targets: ["1234"] },
        { mode: "list" },
        { mode: "table", listSignals: ["HUP"] },
      ];
      for (const partial of variants) {
        expect(line(spec({ ...partial, platform }))).toBe(line(spec({ ...partial, platform: "linux" })));
      }
    });
  }
});

describe("mac — renders identically to linux, both are plain POSIX kill", () => {
  it("is byte-identical to linux across a representative set of specs", () => {
    const variants: Partial<KillSpec>[] = [
      { targets: ["1234", "5678"] },
      { signal: "kill", targets: ["1234"] },
      { mode: "list" },
      { mode: "table", listSignals: ["HUP"] },
    ];
    for (const partial of variants) {
      expect(line(spec({ ...partial, platform: "mac" }))).toBe(line(spec({ ...partial, platform: "linux" })));
    }
  });
});

describe("describeSpec", () => {
  it("describes a plain signal send", () => {
    expect(describeSpec(spec({ targets: ["1234"] }))).toBe("Send SIGTERM to process 1234.");
  });

  it("notes what 0 and -1 actually mean", () => {
    expect(describeSpec(spec({ targets: ["0"] }))).toMatch(/own process group/);
    expect(describeSpec(spec({ targets: ["-1"] }))).toMatch(/permission to signal/);
    expect(describeSpec(spec({ targets: ["-500"] }))).toMatch(/whole process group/);
  });

  it("describes list mode", () => {
    expect(describeSpec(spec({ mode: "list" }))).toBe("List every supported signal name — nothing is signaled.");
    expect(describeSpec(spec({ mode: "list", listSignals: ["TERM", "9"] }))).toBe(
      "List 2 signals, converting between name and number — nothing is signaled.",
    );
  });

  it("describes table mode", () => {
    expect(describeSpec(spec({ mode: "table" }))).toBe(
      "Print a table of numbers, names, and descriptions for every supported signal name — nothing is signaled.",
    );
  });
});

describe("PowerShell (Stop-Process)", () => {
  const ps = (partial: Partial<KillSpec> = {}): KillSpec => spec({ platform: "windows-powershell", ...partial });

  it("uses Stop-Process -Id, comma-joining multiple targets", () => {
    expect(line(ps({ targets: ["1234"] }))).toBe("Stop-Process -Id 1234");
    expect(line(ps({ targets: ["1234", "5678"] }))).toBe("Stop-Process -Id 1234,5678");
  });

  it("renders just the binary with no targets", () => {
    expect(line(ps({ targets: [] }))).toBe("Stop-Process");
  });

  it("the signal field is ignored entirely", () => {
    expect(line(ps({ signal: "KILL", targets: ["1234"] }))).toBe("Stop-Process -Id 1234");
  });

  it("-Force renders before -Id", () => {
    expect(line(ps({ targets: ["1234"], flags: { forcePs: true } }))).toBe("Stop-Process -Force -Id 1234");
  });

  it("KILL001 still fires with no targets", () => {
    expect(lint(ps()).diagnostics.map((d) => d.code)).toContain("KILL001");
  });

  it("KILL002 (SIGKILL) never fires — Stop-Process has no signal concept", () => {
    expect(lint(ps({ signal: "KILL", targets: ["123"] })).diagnostics.map((d) => d.code)).not.toContain("KILL002");
  });

  it("KILL003 (PID 1) does not apply — that framing is POSIX/container-specific", () => {
    expect(lint(ps({ targets: ["1"] })).diagnostics.map((d) => d.code)).not.toContain("KILL003");
  });

  it("KILL004 (broadcast) does not apply — Stop-Process -Id has no broadcast concept", () => {
    expect(lint(ps({ targets: ["-1"] })).diagnostics.map((d) => d.code)).not.toContain("KILL004");
  });

  it("KILL005 accepts plain PIDs only — rejects %job specs and negative IDs valid on POSIX", () => {
    expect(lint(ps({ targets: ["%1"] })).diagnostics.map((d) => d.code)).toContain("KILL005");
    expect(lint(ps({ targets: ["-5"] })).diagnostics.map((d) => d.code)).toContain("KILL005");
    expect(lint(ps({ targets: ["1234"] })).diagnostics.map((d) => d.code)).not.toContain("KILL005");
  });

  it("POSIX-only presets do not apply on PowerShell", () => {
    expect(getPreset("graceful-stop")!.isApplicable?.(ps())).toBe(false);
    expect(getPreset("force-kill")!.isApplicable?.(ps())).toBe(false);
  });

  it("'Force stop' preset sets -Force", () => {
    expect(getPreset("force-stop")!.isApplicable?.(spec())).toBe(false);
    expect(line(getPreset("force-stop")!.apply(ps({ targets: ["1234"] })))).toBe("Stop-Process -Force -Id 1234");
  });
});
