import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, getPreset, lint, renderOneLine, type TarSpec } from "@cmdgen/tar";

/** Bundled short flags on, matching the app's default and every tar tutorial. */
const line = (spec: TarSpec) =>
  renderOneLine(buildArgv(spec), { shell: spec.shell, combineShortFlags: true });

/** Unbundled, for asserting individual token order. */
const flat = (spec: TarSpec) =>
  renderOneLine(buildArgv(spec), { shell: spec.shell, combineShortFlags: false });

const spec = (partial: Partial<TarSpec> = {}): TarSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

const bsd = (partial: Partial<TarSpec> = {}): TarSpec => spec({ variant: "bsd", ...partial });

const codes = (s: TarSpec) => lint(s).diagnostics.map((d) => d.code);

describe("modes and the classic bundled form", () => {
  it("produces the idiomatic tar -czvf", () => {
    expect(
      line(spec({ archive: "backup.tar.gz", files: ["src"], flags: { compressionGnu: "gzip", verbose: true } })),
    ).toBe("tar -czvf backup.tar.gz src");
  });

  it("renders the same flags unbundled when asked", () => {
    expect(
      flat(spec({ archive: "backup.tar.gz", files: ["src"], flags: { compressionGnu: "gzip", verbose: true } })),
    ).toBe("tar -c -z -v -f backup.tar.gz src");
  });

  it("keeps -f's value from being swallowed into the bundle", () => {
    // The archive name is a value token, so it must break the short-flag run.
    expect(line(spec({ archive: "a.tar", files: ["x"] }))).toBe("tar -cf a.tar x");
  });

  it("uses the right token per mode", () => {
    expect(line(spec({ mode: "extract", archive: "a.tar" }))).toBe("tar -xf a.tar");
    expect(line(spec({ mode: "list", archive: "a.tar" }))).toBe("tar -tf a.tar");
    expect(line(spec({ mode: "append", archive: "a.tar", files: ["x"] }))).toBe("tar -rf a.tar x");
    expect(line(spec({ mode: "concatenate", archive: "a.tar", files: ["b.tar"] }))).toBe("tar -Af a.tar b.tar");
    expect(line(spec({ mode: "delete", archive: "a.tar", files: ["x"] }))).toBe("tar --delete -f a.tar x");
  });

  it("places -C after the archive but before the files", () => {
    expect(line(spec({ archive: "a.tar", changeDir: "/src", files: ["."] }))).toBe("tar -cf a.tar -C /src .");
  });

  it("renders each exclude as its own --exclude= token, before the files", () => {
    // The glob is quoted deliberately: bare --exclude=*.log would be expanded
    // by the shell against the *current* directory before tar ever saw it, so
    // an unquoted pattern silently means something else entirely. Only the
    // value half is quoted, keeping the flag name readable.
    expect(
      line(spec({ archive: "a.tar", files: ["src"], excludes: ["*.log", "node_modules"] })),
    ).toBe("tar -cf a.tar --exclude='*.log' --exclude=node_modules src");
  });

  it("quotes an archive path containing a space", () => {
    expect(line(spec({ archive: "my backup.tar", files: ["x"] }))).toBe("tar -cf 'my backup.tar' x");
  });

  it("quotes for PowerShell when that shell is selected", () => {
    expect(line(spec({ shell: "powershell", archive: "my backup.tar", files: ["x"] }))).toBe(
      "tar -cf 'my backup.tar' x",
    );
  });

  it("the shell axis changes quoting only — never which flags appear", () => {
    // `@` is a PowerShell operator sigil, so --mtime=@0 must be quoted there
    // while POSIX can leave it bare. tar is one binary invoked identically by
    // both shells, so nothing but the quotes may differ.
    const base: Partial<TarSpec> = { archive: "a.tar", files: ["x"], flags: { mtime: "@0" } };
    const posix = line(spec({ ...base, shell: "posix" }));
    const pwsh = line(spec({ ...base, shell: "powershell" }));

    expect(posix).toBe("tar -cf a.tar --mtime=@0 x");
    expect(pwsh).toBe("tar -cf a.tar --mtime='@0' x");
    expect(posix.replace(/'/g, "")).toBe(pwsh.replace(/'/g, ""));
  });

  it("omits -f entirely when no archive is set (stdin/stdout)", () => {
    expect(line(spec({ files: ["src"], flags: { compressionGnu: "gzip" } }))).toBe("tar -cz src");
  });
});

describe("compression", () => {
  it("renders each compressor's own token", () => {
    expect(line(spec({ archive: "a.tar.bz2", files: ["x"], flags: { compressionGnu: "bzip2" } }))).toBe(
      "tar -cjf a.tar.bz2 x",
    );
    expect(line(spec({ archive: "a.tar.xz", files: ["x"], flags: { compressionGnu: "xz" } }))).toBe(
      "tar -cJf a.tar.xz x",
    );
    // --zstd is a long option, so it cannot bundle with the short flags.
    expect(line(spec({ archive: "a.tar.zst", files: ["x"], flags: { compressionGnu: "zstd" } }))).toBe(
      "tar -c --zstd -f a.tar.zst x",
    );
  });

  it("passes a compressor program through -I, keeping its argument its own token", () => {
    // -I bundles onto -c because an argument-taking short flag is allowed to be
    // last in a bundle; its value then breaks the run, as it must.
    expect(line(spec({ archive: "a.tar.xz", files: ["x"], flags: { useCompressProgram: "xz -9e" } }))).toBe(
      "tar -cI 'xz -9e' -f a.tar.xz x",
    );
    expect(flat(spec({ archive: "a.tar.xz", files: ["x"], flags: { useCompressProgram: "xz -9e" } }))).toBe(
      "tar -c -I 'xz -9e' -f a.tar.xz x",
    );
  });
});

describe("GNU vs bsdtar — the cross-platform core", () => {
  it("drops GNU-only flags when targeting bsdtar, rather than emitting something it would reject", () => {
    const s = bsd({ mode: "extract", archive: "a.tar", changeDir: "/tmp/out", flags: { oneTopLevel: true, transform: "s,^,x/," } });
    expect(line(s)).toBe("tar -xf a.tar -C /tmp/out");
  });

  it("TAR008 reports what was dropped, and its fix clears them", () => {
    const s = bsd({ mode: "extract", archive: "a.tar", changeDir: "/tmp/out", flags: { oneTopLevel: true } });
    expect(codes(s)).toContain("TAR008");
    const fix = lint(s).diagnostics.find((d) => d.code === "TAR008")!.fix!;
    expect(codes(fix.apply(s))).not.toContain("TAR008");
  });

  it("TAR008 stays quiet when every set flag exists in the selected variant", () => {
    expect(codes(spec({ archive: "a.tar", files: ["x"], flags: { oneTopLevel: true } }))).not.toContain("TAR008");
  });

  it("keeps -n's two conflicting meanings apart: bsdtar no-recurse vs GNU seek", () => {
    // Same letter, opposite meanings — modeled as separate ids so neither leaks.
    expect(line(bsd({ archive: "a.tar", files: ["dir"], flags: { noRecursionBsd: true } }))).toBe(
      "tar -cf a.tar -n dir",
    );
    // GNU's --recursion/--no-recursion pair is one tri-state enum, so the form
    // cannot express both at once.
    expect(line(spec({ archive: "a.tar", files: ["dir"], flags: { recursionMode: "no-recursion" } }))).toBe(
      "tar -cf a.tar --no-recursion dir",
    );
    expect(line(spec({ archive: "a.tar", files: ["dir"], flags: { recursionMode: "recursion" } }))).toBe(
      "tar -cf a.tar --recursion dir",
    );
    // Setting bsdtar's -n while targeting GNU tar must not emit -n, because
    // there it would mean --seek instead of --norecurse.
    expect(line(spec({ archive: "a.tar", files: ["dir"], flags: { noRecursionBsd: true } }))).toBe("tar -cf a.tar dir");
    // ...and GNU's -n (--seek) must not leak into a bsdtar command either.
    expect(line(bsd({ archive: "a.tar", files: ["dir"], flags: { seekMode: "seek" } }))).toBe("tar -cf a.tar dir");
  });

  it("keeps -s apart too: bsdtar substitution vs GNU --same-order", () => {
    expect(line(bsd({ mode: "extract", archive: "a.tar", flags: { substituteBsd: "/old/new/" } }))).toBe(
      "tar -xf a.tar -s /old/new/",
    );
    expect(line(spec({ mode: "extract", archive: "a.tar", flags: { sameOrder: true } }))).toBe(
      "tar -xf a.tar --same-order",
    );
  });

  it("offers a different --format value set per implementation", () => {
    expect(line(spec({ archive: "a.tar", files: ["x"], flags: { formatGnu: "v7" } }))).toBe(
      "tar -cf a.tar --format=v7 x",
    );
    expect(line(bsd({ archive: "a.tar", files: ["x"], flags: { formatBsd: "shar" } }))).toBe(
      "tar -cf a.tar --format=shar x",
    );
    // GNU's v7 is not a bsdtar format, so it is dropped there.
    expect(line(bsd({ archive: "a.tar", files: ["x"], flags: { formatGnu: "v7" } }))).toBe("tar -cf a.tar x");
  });

  it("an untouched format dropdown is not treated as a set flag", () => {
    // Regression guard: the inactive enum sentinel must be "none", not "default".
    const s = bsd({ archive: "a.tar", files: ["x"], flags: { formatGnu: "none" } });
    expect(line(s)).toBe("tar -cf a.tar x");
    expect(codes(s)).not.toContain("TAR008");
  });
});

describe("lint — safety and correctness", () => {
  it("TAR001 fires when creating with no inputs, unless -T supplies them", () => {
    expect(codes(spec({ archive: "a.tar" }))).toContain("TAR001");
    expect(codes(spec({ archive: "a.tar", flags: { filesFrom: "list.txt" } }))).not.toContain("TAR001");
    expect(codes(spec({ mode: "extract", archive: "a.tar" }))).not.toContain("TAR001");
  });

  it("TAR002 warns when no archive is set, and says which stream is used", () => {
    expect(lint(spec({ files: ["x"] })).diagnostics.find((d) => d.code === "TAR002")!.message).toContain("output");
    expect(lint(spec({ mode: "extract" })).diagnostics.find((d) => d.code === "TAR002")!.message).toContain("input");
  });

  it("TAR003 flags --remove-files as destructive", () => {
    const s = spec({ archive: "a.tar", files: ["x"], flags: { removeFiles: true } });
    expect(codes(s)).toContain("TAR003");
    expect(lint(s).isDestructive).toBe(true);
  });

  it("TAR004 escalates -P to destructive on extract, but only warns on create", () => {
    const extracting = lint(spec({ mode: "extract", archive: "a.tar", changeDir: "/tmp/o", flags: { absoluteNames: true } }));
    expect(extracting.diagnostics.find((d) => d.code === "TAR004")!.level).toBe("destructive");

    const creating = lint(spec({ archive: "a.tar", files: ["x"], flags: { absoluteNames: true } }));
    expect(creating.diagnostics.find((d) => d.code === "TAR004")!.level).toBe("warning");
  });

  it("TAR005 warns about tar bombs, and either guard silences it", () => {
    expect(codes(spec({ mode: "extract", archive: "a.tar" }))).toContain("TAR005");
    expect(codes(spec({ mode: "extract", archive: "a.tar", changeDir: "out" }))).not.toContain("TAR005");
    expect(codes(spec({ mode: "extract", archive: "a.tar", flags: { oneTopLevel: true } }))).not.toContain("TAR005");
  });

  it("TAR005's fix is GNU-only; bsdtar gets advice instead of a broken flag", () => {
    const gnuFix = lint(spec({ mode: "extract", archive: "a.tar" })).diagnostics.find((d) => d.code === "TAR005")!.fix;
    expect(gnuFix).toBeDefined();

    const bsdDiag = lint(bsd({ mode: "extract", archive: "a.tar" })).diagnostics.find((d) => d.code === "TAR005")!;
    expect(bsdDiag.fix).toBeUndefined();
    expect(bsdDiag.detail).toContain("bsdtar has no --one-top-level");
  });

  it("TAR006 catches two compression methods at once", () => {
    expect(codes(spec({ archive: "a.tgz", files: ["x"], flags: { compressionGnu: "gzip", autoCompress: true } }))).toContain(
      "TAR006",
    );
    expect(codes(spec({ archive: "a.tgz", files: ["x"], flags: { compressionGnu: "gzip" } }))).not.toContain("TAR006");
  });

  it("TAR007 catches a compressor that contradicts the archive's name", () => {
    expect(codes(spec({ archive: "a.tar.xz", files: ["x"], flags: { compressionGnu: "gzip" } }))).toContain("TAR007");
    expect(codes(spec({ archive: "a.tar", files: ["x"], flags: { compressionGnu: "gzip" } }))).toContain("TAR007");
    expect(codes(spec({ archive: "a.tar.gz", files: ["x"], flags: { compressionGnu: "gzip" } }))).not.toContain("TAR007");
    expect(codes(spec({ archive: "a.tgz", files: ["x"], flags: { compressionGnu: "gzip" } }))).not.toContain("TAR007");
  });

  it("TAR009 catches contradictory flags", () => {
    expect(
      codes(spec({ mode: "extract", archive: "a.tar", changeDir: "o", flags: { keepOldFiles: true, overwrite: true } })),
    ).toContain("TAR009");
  });

  it("TAR010 catches a flag whose prerequisite is missing", () => {
    const s = spec({ archive: "a.tar", files: ["x"], flags: { clampMtime: true } });
    expect(codes(s)).toContain("TAR010");
    expect(codes(spec({ archive: "a.tar", files: ["x"], flags: { clampMtime: true, mtime: "@0" } }))).not.toContain(
      "TAR010",
    );
  });

  it("TAR011 rejects delete mode on bsdtar and offers to switch implementation", () => {
    const s = bsd({ mode: "delete", archive: "a.tar", files: ["x"] });
    expect(codes(s)).toContain("TAR011");
    const fixed = lint(s).diagnostics.find((d) => d.code === "TAR011")!.fix!.apply(s);
    expect(fixed.variant).toBe("gnu");
    expect(codes(fixed)).not.toContain("TAR011");
  });

  it("TAR011 covers every mode bsdtar's usage message omits", () => {
    // bsdtar states: "First option must be a mode specifier: -c -r -t -u -x".
    for (const mode of ["diff", "delete", "testLabel"] as const) {
      expect(codes(bsd({ mode, archive: "a.tar", files: ["x"] })), mode).toContain("TAR011");
    }
    for (const mode of ["create", "append", "list", "update", "extract"] as const) {
      expect(codes(bsd({ mode, archive: "a.tar", files: ["x"], changeDir: "o" })), mode).not.toContain("TAR011");
    }
  });

  it("TAR016 rewrites concatenate for bsdtar via @archive instead of sending you to GNU tar", () => {
    // bsdtar has no -A, but its create mode documents `@<archive>` as
    // "Add entries from <archive> to output" — so a rewrite exists.
    const s = bsd({ mode: "concatenate", archive: "dest.tar", files: ["a.tar", "b.tar"] });
    expect(codes(s)).toContain("TAR016");
    expect(codes(s)).not.toContain("TAR011"); // superseded by the more useful advice

    const fixed = lint(s).diagnostics.find((d) => d.code === "TAR016")!.fix!.apply(s);
    expect(fixed.mode).toBe("create");
    expect(fixed.variant).toBe("bsd"); // stays on bsdtar — no implementation switch needed
    expect(line(fixed)).toBe("tar -cf dest.tar @a.tar @b.tar");
    expect(codes(fixed)).not.toContain("TAR016");
  });

  it("@archive survives PowerShell quoting, where a bare @ would be an operator", () => {
    // `@` starts a splat/array in PowerShell, so the token must be quoted for
    // the shell while still reaching bsdtar as literally @a.tar.
    const s = bsd({ shell: "powershell", archive: "dest.tar", files: ["@a.tar"] });
    expect(line(s)).toBe("tar -cf dest.tar '@a.tar'");
    expect(line(bsd({ archive: "dest.tar", files: ["@a.tar"] }))).toBe("tar -cf dest.tar @a.tar");
  });

  it("TAR002 states each implementation's real default for a missing -f", () => {
    // GNU tar reports -f- (stdin/stdout) in its own --show-defaults; bsdtar's
    // help says the default is the tape device \\.\tape0. Saying the wrong one
    // is worse than saying nothing.
    const gnuDiag = lint(spec({ files: ["src"] })).diagnostics.find((d) => d.code === "TAR002")!;
    expect(gnuDiag.message).toContain("standard output");
    expect(gnuDiag.detail).toContain("-f-");

    const bsdDiag = lint(bsd({ files: ["src"] })).diagnostics.find((d) => d.code === "TAR002")!;
    expect(bsdDiag.message).toContain("tape device");
    expect(bsdDiag.detail).toContain("tape0");
    expect(bsdDiag.detail).not.toContain("standard output");
  });

  it("TAR012 rejects in-place modes on a compressed archive", () => {
    expect(codes(spec({ mode: "append", archive: "a.tar.gz", files: ["x"] }))).toContain("TAR012");
    expect(codes(spec({ mode: "append", archive: "a.tar", files: ["x"], flags: { compressionGnu: "gzip" } }))).toContain(
      "TAR012",
    );
    expect(codes(spec({ mode: "append", archive: "a.tar", files: ["x"] }))).not.toContain("TAR012");
    expect(codes(spec({ mode: "extract", archive: "a.tar.gz", changeDir: "o" }))).not.toContain("TAR012");
  });

  it("TAR013 notes that --strip-components does nothing while creating", () => {
    expect(codes(spec({ archive: "a.tar", files: ["x"], flags: { stripComponents: 1 } }))).toContain("TAR013");
    expect(
      codes(spec({ mode: "extract", archive: "a.tar", changeDir: "o", flags: { stripComponents: 1 } })),
    ).not.toContain("TAR013");
  });

  it("TAR014 catches -v mixing into -O's data stream", () => {
    expect(
      codes(spec({ mode: "extract", archive: "a.tar", changeDir: "o", flags: { toStdout: true, verbose: true } })),
    ).toContain("TAR014");
  });

  it("TAR015 catches GNU tar reading a drive letter as a remote host", () => {
    const s = spec({ archive: "C:\\backup.tar", files: ["x"] });
    expect(codes(s)).toContain("TAR015");
    const fixed = lint(s).diagnostics.find((d) => d.code === "TAR015")!.fix!.apply(s);
    expect(codes(fixed)).not.toContain("TAR015");
    // bsdtar does not do remote-host parsing, so the same path is fine there.
    expect(codes(bsd({ archive: "C:\\backup.tar", files: ["x"] }))).not.toContain("TAR015");
  });

  it("a straightforward create has nothing to flag", () => {
    expect(
      lint(spec({ archive: "backup.tar.gz", files: ["src"], flags: { compressionGnu: "gzip", verbose: true } }))
        .diagnostics,
    ).toEqual([]);
  });
});

describe("presets", () => {
  it("'Create .tar.gz' is the classic form", () => {
    const s = getPreset("create-gzip")!.apply(spec({ archive: "backup.tar.gz", files: ["src"] }));
    expect(line(s)).toBe("tar -czvf backup.tar.gz src");
  });

  it("'Extract safely' guards against clobbering and against tar bombs", () => {
    const s = getPreset("extract-safely")!.apply(spec({ archive: "a.tar.gz" }));
    expect(s.mode).toBe("extract");
    expect(codes(s)).not.toContain("TAR005");
    // -k renders after the archive (see ARCHIVE_ORDER) so it does not join the
    // bundle. Only the mode, compressor and -v do — beyond about four letters a
    // bundle stops being the familiar idiom and starts being unreadable.
    expect(line(s)).toBe("tar -xvf a.tar.gz -k --one-top-level");
  });

  it("'Extract safely' skips the GNU-only flag on bsdtar without leaving a stale setting", () => {
    const s = getPreset("extract-safely")!.apply(bsd({ archive: "a.tar.gz" }));
    expect(s.flags.oneTopLevel).toBeUndefined();
    expect(codes(s)).not.toContain("TAR008");
  });

  it("'Reproducible archive' is GNU-only and pins everything nondeterministic", () => {
    expect(getPreset("reproducible")!.isApplicable?.(bsd())).toBe(false);
    const s = getPreset("reproducible")!.apply(spec({ archive: "out.tar.gz", files: ["src"] }));
    // --pax-option drops the atime/ctime records that pax format would otherwise
    // embed, which is the last remaining source of run-to-run variation.
    expect(line(s)).toBe(
      "tar -czf out.tar.gz --numeric-owner --owner=0 --group=0 --mtime=@0 --sort=name --format=pax " +
        "--pax-option=delete=atime,delete=ctime src",
    );
  });

  it("'Extract, unwrapping one level' strips the top directory", () => {
    const s = getPreset("extract-unwrap")!.apply(spec({ archive: "proj-1.2.3.tar.gz", changeDir: "out" }));
    expect(line(s)).toBe("tar -xvf proj-1.2.3.tar.gz -C out --strip-components=1");
  });

  it("'List contents' switches to a read-only mode", () => {
    const s = getPreset("list-contents")!.apply(spec({ archive: "a.tar.gz" }));
    expect(line(s)).toBe("tar -tvf a.tar.gz");
    expect(lint(s).isDestructive).toBe(false);
  });

  it("presets that only make sense for one implementation report that", () => {
    expect(getPreset("incremental-full")!.isApplicable?.(bsd())).toBe(false);
    expect(getPreset("incremental-full")!.isApplicable?.(spec())).toBe(true);
  });
});
