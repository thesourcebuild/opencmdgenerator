import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type SourceSpec } from "@cmdgen/source";

const line = (spec: SourceSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<SourceSpec> = {}): SourceSpec => ({
  ...createSpec({ id: "test-spec" }),
  file: "~/.bashrc",
  ...partial,
});

describe("file and args", () => {
  it("a bare file with no arguments", () => {
    // ~ is quoted here, deliberately — source has no cd-style tilde carve-out
    // (same reasoning as ssh's own identity-file test).
    expect(line(spec())).toBe("source '~/.bashrc'");
  });

  it("appends arguments in order", () => {
    expect(line(spec({ file: "deploy.sh", args: ["production", "--verbose"] }))).toBe(
      "source deploy.sh production --verbose",
    );
  });

  it("renders nothing at all with no file and no args", () => {
    expect(line(spec({ file: "" }))).toBe("source");
  });

  it("skips blank argument entries", () => {
    expect(line(spec({ file: "deploy.sh", args: ["", "production", "  "] }))).toBe("source deploy.sh production");
  });
});

describe("lint", () => {
  it("SRC001 catches no file", () => {
    const result = lint(spec({ file: "" }));
    expect(result.diagnostics.map((d) => d.code)).toContain("SRC001");
    expect(result.diagnostics.find((d) => d.code === "SRC001")!.level).toBe("error");
  });

  it("SRC002 notes that arguments are scoped to the script's own $1, $2, ...", () => {
    expect(lint(spec({ args: ["production"] })).diagnostics.map((d) => d.code)).toContain("SRC002");
    expect(lint(spec({ args: [] })).diagnostics.map((d) => d.code)).not.toContain("SRC002");
  });

  it("a plain source has no diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Reload the shell config' sources ~/.bashrc", () => {
    expect(line(getPreset("reload-shell-config")!.apply(spec()))).toBe("source '~/.bashrc'");
  });

  it("'Load environment variables from a file' sources .env", () => {
    expect(line(getPreset("load-environment-file")!.apply(spec()))).toBe("source .env");
  });

  it("'Run a script with arguments' passes positional arguments", () => {
    expect(line(getPreset("run-script-with-arguments")!.apply(spec()))).toBe(
      "source deploy.sh production --verbose",
    );
  });
});

describe("describeSpec", () => {
  it("describes a plain source", () => {
    expect(describeSpec(spec())).toBe("Load and run ~/.bashrc in the current shell.");
  });

  it("describes arguments", () => {
    expect(describeSpec(spec({ file: "deploy.sh", args: ["production", "--verbose"] }))).toBe(
      "Load and run deploy.sh in the current shell, passing production, --verbose as arguments.",
    );
  });

  it("uses a placeholder when no file is given", () => {
    expect(describeSpec(spec({ file: "" }))).toBe("Load and run SOME_SCRIPT in the current shell.");
  });
});
