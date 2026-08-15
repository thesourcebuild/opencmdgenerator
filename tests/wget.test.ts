import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type WgetSpec } from "@cmdgen/wget";

const line = (spec: WgetSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<WgetSpec> = {}): WgetSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("url and flags", () => {
  it("a bare url with no flags", () => {
    expect(line(spec({ url: "https://example.com/file.zip" }))).toBe("wget https://example.com/file.zip");
  });

  it("renders -c, -q, -r", () => {
    expect(line(spec({ url: "https://example.com/file.zip", flags: { continueDownload: true } }))).toBe(
      "wget -c https://example.com/file.zip",
    );
    expect(line(spec({ url: "https://example.com/file.zip", flags: { quiet: true } }))).toBe(
      "wget -q https://example.com/file.zip",
    );
    expect(line(spec({ url: "https://example.com/file.zip", flags: { recursive: true } }))).toBe(
      "wget -r https://example.com/file.zip",
    );
  });

  it("renders --no-parent as a long-form boolean flag", () => {
    expect(line(spec({ url: "https://example.com/file.zip", flags: { noParent: true } }))).toBe(
      "wget --no-parent https://example.com/file.zip",
    );
  });

  it("renders -O as a detached short-form text value", () => {
    expect(line(spec({ url: "https://example.com/install.sh", flags: { outputDocument: "install.sh" } }))).toBe(
      "wget -O install.sh https://example.com/install.sh",
    );
  });

  it("renders -P as a detached short-form text value", () => {
    expect(line(spec({ url: "https://example.com/file.zip", flags: { directoryPrefix: "downloads/" } }))).toBe(
      "wget -P downloads/ https://example.com/file.zip",
    );
  });

  it("renders --user-agent as an attached long-form text value", () => {
    expect(line(spec({ url: "https://example.com/file.zip", flags: { userAgent: "Mozilla/5.0" } }))).toBe(
      "wget --user-agent=Mozilla/5.0 https://example.com/file.zip",
    );
  });

  it("combines multiple flags with the url last", () => {
    expect(
      line(
        spec({
          url: "https://example.com/file.zip",
          flags: { recursive: true, noParent: true },
        }),
      ),
    ).toBe("wget -r --no-parent https://example.com/file.zip");

    expect(
      line(
        spec({
          url: "https://example.com/install.sh",
          flags: { continueDownload: true, outputDocument: "install.sh" },
        }),
      ),
    ).toBe("wget -O install.sh -c https://example.com/install.sh");
  });
});

describe("lint", () => {
  it("WGET001 catches an empty url", () => {
    expect(lint(spec()).diagnostics.map((d) => d.code)).toContain("WGET001");
  });

  it("WGET001 also catches a whitespace-only url", () => {
    expect(lint(spec({ url: "   " })).diagnostics.map((d) => d.code)).toContain("WGET001");
  });

  it("a plain wget with a url has no diagnostics", () => {
    expect(lint(spec({ url: "https://example.com/file.zip" })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Download a file' is a bare wget", () => {
    expect(line(getPreset("download-a-file")!.apply(spec()))).toBe("wget https://example.com/file.zip");
  });

  it("'Resume an interrupted download' is -c", () => {
    expect(line(getPreset("resume-a-download")!.apply(spec()))).toBe("wget -c https://example.com/file.zip");
  });

  it("'Save under a specific name' is -O install.sh", () => {
    expect(line(getPreset("save-with-a-name")!.apply(spec()))).toBe(
      "wget -O install.sh https://example.com/install.sh",
    );
  });
});

describe("describeSpec", () => {
  it("describes the default case", () => {
    expect(describeSpec(spec({ url: "https://example.com/file.zip" }))).toBe(
      "Download https://example.com/file.zip.",
    );
  });

  it("describes an empty url with the SOME_URL placeholder", () => {
    expect(describeSpec(spec())).toBe("Download SOME_URL.");
  });

  it("describes resume, quiet, and recursive with no-parent as trailing clauses", () => {
    const described = describeSpec(
      spec({
        url: "https://example.com/file.zip",
        flags: { continueDownload: true, quiet: true, recursive: true, noParent: true },
      }),
    );
    expect(described).toContain("resuming a partially-downloaded file instead of starting over");
    expect(described).toContain("without printing progress output");
    expect(described).toContain("recursively, without ever ascending to the parent directory");
  });

  it("describes a custom save directory, filename, and user agent as trailing clauses", () => {
    const described = describeSpec(
      spec({
        url: "https://example.com/file.zip",
        flags: { directoryPrefix: "downloads/", outputDocument: "file.zip", userAgent: "Mozilla/5.0" },
      }),
    );
    expect(described).toContain("saving files under downloads/");
    expect(described).toContain("saving it as file.zip");
    expect(described).toContain("sending a custom User-Agent of Mozilla/5.0");
  });
});
