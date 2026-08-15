import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type SemanageSpec } from "@cmdgen/semanage";

const line = (spec: SemanageSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<SemanageSpec> = {}): SemanageSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("fcontext", () => {
  it("renders add with -t and a quoted pattern", () => {
    expect(
      line(spec({ objectType: "fcontext", action: "add", target: "/web(/.*)?", type: "httpd_sys_content_t" })),
    ).toBe("semanage fcontext -a -t httpd_sys_content_t '/web(/.*)?'");
  });

  it("renders delete without -t, even if type is set", () => {
    expect(line(spec({ objectType: "fcontext", action: "delete", target: "/web(/.*)?", type: "httpd_sys_content_t" }))).toBe(
      "semanage fcontext -d '/web(/.*)?'",
    );
  });

  it("renders modify with -t", () => {
    expect(line(spec({ objectType: "fcontext", action: "modify", target: "/web(/.*)?", type: "httpd_sys_content_t" }))).toBe(
      "semanage fcontext -m -t httpd_sys_content_t '/web(/.*)?'",
    );
  });

  it("renders list with no target or type at all", () => {
    expect(line(spec({ objectType: "fcontext", action: "list", target: "/web(/.*)?", type: "httpd_sys_content_t" }))).toBe(
      "semanage fcontext -l",
    );
  });
});

describe("port", () => {
  it("splits target into -p <proto> <port>", () => {
    expect(line(spec({ objectType: "port", action: "add", target: "8080/tcp", type: "http_port_t" }))).toBe(
      "semanage port -a -t http_port_t -p tcp 8080",
    );
  });

  it("renders delete as -p <proto> <port>, without -t", () => {
    expect(line(spec({ objectType: "port", action: "delete", target: "8080/tcp" }))).toBe(
      "semanage port -d -p tcp 8080",
    );
  });

  it("omits -p when the target has no slash", () => {
    expect(line(spec({ objectType: "port", action: "add", target: "8080", type: "http_port_t" }))).toBe(
      "semanage port -a -t http_port_t 8080",
    );
  });
});

describe("lint", () => {
  it("SEM001 catches an empty target for add", () => {
    expect(lint(spec({ target: "" })).diagnostics.map((d) => d.code)).toContain("SEM001");
  });

  it("SEM001 does not fire for list", () => {
    expect(lint(spec({ action: "list", target: "" })).diagnostics.map((d) => d.code)).not.toContain("SEM001");
  });

  it("SEM002 catches a missing type on add", () => {
    expect(lint(spec({ action: "add", target: "/web(/.*)?", type: "" })).diagnostics.map((d) => d.code)).toContain(
      "SEM002",
    );
  });

  it("SEM002 catches a missing type on modify", () => {
    expect(lint(spec({ action: "modify", target: "/web(/.*)?", type: "" })).diagnostics.map((d) => d.code)).toContain(
      "SEM002",
    );
  });

  it("SEM002 does not fire for delete or list", () => {
    expect(lint(spec({ action: "delete", target: "/web(/.*)?", type: "" })).diagnostics.map((d) => d.code)).not.toContain(
      "SEM002",
    );
    expect(lint(spec({ action: "list", type: "" })).diagnostics.map((d) => d.code)).not.toContain("SEM002");
  });

  it("SEM003 catches a port target with no protocol", () => {
    expect(
      lint(spec({ objectType: "port", action: "add", target: "8080", type: "http_port_t" })).diagnostics.map(
        (d) => d.code,
      ),
    ).toContain("SEM003");
  });

  it("SEM003 does not fire for fcontext", () => {
    expect(
      lint(spec({ objectType: "fcontext", action: "add", target: "/web(/.*)?", type: "httpd_sys_content_t" })).diagnostics.map(
        (d) => d.code,
      ),
    ).not.toContain("SEM003");
  });

  it("SEM004 always fires, with no fix, for delete", () => {
    const diagnostics = lint(spec({ objectType: "port", action: "delete", target: "8080/tcp" })).diagnostics;
    const diagnostic = diagnostics.find((d) => d.code === "SEM004");
    expect(diagnostic).toBeDefined();
    expect(diagnostic!.level).toBe("destructive");
    expect(diagnostic!.fix).toBeUndefined();
  });

  it("SEM004 does not fire for add/modify/list", () => {
    expect(
      lint(spec({ action: "add", target: "/web(/.*)?", type: "httpd_sys_content_t" })).diagnostics.map((d) => d.code),
    ).not.toContain("SEM004");
  });

  it("a fully specified fcontext add has no diagnostics", () => {
    expect(lint(spec({ objectType: "fcontext", action: "add", target: "/web(/.*)?", type: "httpd_sys_content_t" })).diagnostics).toEqual(
      [],
    );
  });

  it("a fully specified port add has no diagnostics", () => {
    expect(lint(spec({ objectType: "port", action: "add", target: "8080/tcp", type: "http_port_t" })).diagnostics).toEqual(
      [],
    );
  });
});

describe("presets", () => {
  it("'Label a directory for httpd'", () => {
    expect(line(getPreset("label-a-web-directory")!.apply(spec()))).toBe(
      "semanage fcontext -a -t httpd_sys_content_t '/web(/.*)?'",
    );
  });

  it("'Allow a custom port for a service'", () => {
    expect(line(getPreset("allow-a-custom-port")!.apply(spec()))).toBe(
      "semanage port -a -t http_port_t -p tcp 8080",
    );
  });

  it("'List file context rules'", () => {
    expect(line(getPreset("list-file-context-rules")!.apply(spec()))).toBe("semanage fcontext -l");
  });

  it("'Remove a custom port label'", () => {
    expect(line(getPreset("remove-a-custom-port")!.apply(spec()))).toBe("semanage port -d -p tcp 8080");
  });
});

describe("describeSpec", () => {
  it("describes an add, and states the scope limit", () => {
    const described = describeSpec(getPreset("label-a-web-directory")!.apply(spec()));
    expect(described).toContain("Add a file context rule for /web(/.*)? with type 'httpd_sys_content_t'.");
    expect(described).toContain("Scoped to semanage's two most common object types");
  });

  it("describes a port delete", () => {
    expect(describeSpec(spec({ objectType: "port", action: "delete", target: "8080/tcp" }))).toContain(
      "Delete the port label for 8080/tcp.",
    );
  });

  it("describes a list", () => {
    expect(describeSpec(spec({ objectType: "fcontext", action: "list" }))).toContain(
      "List every file context rule.",
    );
  });

  it("describes an empty target with a placeholder", () => {
    expect(describeSpec(spec({ objectType: "port", action: "add", target: "", type: "" }))).toContain(
      "Add a port label for SOME_PORT/PROTO.",
    );
  });
});
