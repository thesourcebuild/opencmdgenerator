import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type ServiceSpec } from "@cmdgen/service";

const line = (spec: ServiceSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<ServiceSpec> = {}): ServiceSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("serviceName/action rendering", () => {
  it("renders the start action", () => {
    expect(line(spec({ serviceName: "nginx", action: "start" }))).toBe("service nginx start");
  });

  it("renders the stop action", () => {
    expect(line(spec({ serviceName: "nginx", action: "stop" }))).toBe("service nginx stop");
  });

  it("renders the restart action", () => {
    expect(line(spec({ serviceName: "nginx", action: "restart" }))).toBe("service nginx restart");
  });

  it("renders the reload action", () => {
    expect(line(spec({ serviceName: "nginx", action: "reload" }))).toBe("service nginx reload");
  });

  it("renders the status action (also the default)", () => {
    expect(line(spec({ serviceName: "nginx", action: "status" }))).toBe("service nginx status");
    expect(line(spec({ serviceName: "nginx" }))).toBe("service nginx status");
  });

  it("trims whitespace from serviceName, and omits it entirely when blank", () => {
    expect(line(spec({ serviceName: "  nginx  ", action: "restart" }))).toBe("service nginx restart");
    expect(line(spec())).toBe("service status");
  });
});

describe("lint", () => {
  it("SERVICE001 catches an empty or whitespace-only serviceName", () => {
    expect(lint(spec()).diagnostics.map((d) => d.code)).toContain("SERVICE001");
    expect(lint(spec({ serviceName: "   " })).diagnostics.map((d) => d.code)).toContain("SERVICE001");
  });

  it("a non-empty serviceName has no diagnostics", () => {
    expect(lint(spec({ serviceName: "nginx" })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Restart a service' is service nginx restart", () => {
    expect(line(getPreset("restart-a-service")!.apply(spec()))).toBe("service nginx restart");
  });

  it("'Check a service's status' is service nginx status", () => {
    expect(line(getPreset("check-status")!.apply(spec()))).toBe("service nginx status");
  });

  it("'Stop a service' is service nginx stop", () => {
    expect(line(getPreset("stop-a-service")!.apply(spec()))).toBe("service nginx stop");
  });
});

describe("describeSpec", () => {
  it("describes start", () => {
    expect(describeSpec(spec({ serviceName: "nginx", action: "start" }))).toBe("Start the nginx service.");
  });

  it("describes stop", () => {
    expect(describeSpec(spec({ serviceName: "nginx", action: "stop" }))).toBe("Stop the nginx service.");
  });

  it("describes restart", () => {
    expect(describeSpec(spec({ serviceName: "nginx", action: "restart" }))).toBe("Restart the nginx service.");
  });

  it("describes reload", () => {
    expect(describeSpec(spec({ serviceName: "nginx", action: "reload" }))).toBe(
      "Reload the nginx service's configuration without a full restart.",
    );
  });

  it("describes status, and falls back to the SOME_SERVICE placeholder when serviceName is blank", () => {
    expect(describeSpec(spec({ serviceName: "nginx", action: "status" }))).toBe(
      "Show the nginx service's current status.",
    );
    expect(describeSpec(spec())).toBe("Show the SOME_SERVICE service's current status.");
  });
});
