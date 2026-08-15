import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type RouteSpec } from "@cmdgen/route";

const line = (spec: RouteSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<RouteSpec> = {}): RouteSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("action/destination/gateway rendering", () => {
  it("renders a bare show", () => {
    expect(line(spec())).toBe("route");
    expect(line(spec({ action: "show" }))).toBe("route");
  });

  it("renders add with a destination and gateway", () => {
    expect(line(spec({ action: "add", destination: "192.168.1.0/24", gateway: "192.168.1.1" }))).toBe(
      "route add 192.168.1.0/24 gw 192.168.1.1",
    );
  });

  it("renders add with only a destination when gateway is blank", () => {
    expect(line(spec({ action: "add", destination: "default" }))).toBe("route add default");
  });

  it("renders delete as the real 'del' token, not the spelled-out word", () => {
    expect(line(spec({ action: "delete", destination: "192.168.1.0/24", gateway: "192.168.1.1" }))).toBe(
      "route del 192.168.1.0/24 gw 192.168.1.1",
    );
  });

  it("ignores destination/gateway entirely for show", () => {
    expect(line(spec({ action: "show", destination: "192.168.1.0/24", gateway: "192.168.1.1" }))).toBe("route");
  });

  it("trims whitespace from destination and gateway", () => {
    expect(line(spec({ action: "add", destination: "  default  ", gateway: "  192.168.1.1  " }))).toBe(
      "route add default gw 192.168.1.1",
    );
  });
});

describe("lint", () => {
  it("RTE001 catches an empty destination for add", () => {
    expect(lint(spec({ action: "add" })).diagnostics.map((d) => d.code)).toContain("RTE001");
  });

  it("RTE001 catches an empty destination for delete", () => {
    expect(lint(spec({ action: "delete" })).diagnostics.map((d) => d.code)).toContain("RTE001");
  });

  it("RTE001 does not fire for show, even with no destination", () => {
    expect(lint(spec({ action: "show" })).diagnostics.map((d) => d.code)).not.toContain("RTE001");
  });

  it("RTE002 unconditionally warns on add/delete regardless of destination/gateway", () => {
    expect(
      lint(spec({ action: "add", destination: "192.168.1.0/24", gateway: "192.168.1.1" })).diagnostics.map(
        (d) => d.code,
      ),
    ).toContain("RTE002");
    const diag = lint(spec({ action: "delete", destination: "192.168.1.0/24" })).diagnostics.find(
      (d) => d.code === "RTE002",
    )!;
    expect(diag.level).toBe("warning");
  });

  it("RTE002 does not fire for show", () => {
    expect(lint(spec({ action: "show" })).diagnostics.map((d) => d.code)).not.toContain("RTE002");
  });

  it("a plain show has no diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Show the routing table' is a bare route", () => {
    expect(line(getPreset("show-the-routing-table")!.apply(spec()))).toBe("route");
  });

  it("'Add a route via a gateway' is route add ... gw ...", () => {
    expect(line(getPreset("add-a-route")!.apply(spec()))).toBe("route add 192.168.1.0/24 gw 192.168.1.1");
  });

  it("'Add a default route' targets 'default'", () => {
    expect(line(getPreset("add-a-default-route")!.apply(spec()))).toBe("route add default gw 192.168.1.1");
  });

  it("'Delete a route' is route del ... gw ...", () => {
    expect(line(getPreset("delete-a-route")!.apply(spec()))).toBe("route del 192.168.1.0/24 gw 192.168.1.1");
  });
});

describe("describeSpec", () => {
  it("describes show", () => {
    expect(describeSpec(spec({ action: "show" }))).toBe("Show the kernel routing table.");
  });

  it("describes add with a gateway", () => {
    expect(describeSpec(spec({ action: "add", destination: "192.168.1.0/24", gateway: "192.168.1.1" }))).toBe(
      "Add a route to 192.168.1.0/24 via gateway 192.168.1.1.",
    );
  });

  it("describes add without a gateway", () => {
    expect(describeSpec(spec({ action: "add", destination: "default" }))).toBe("Add a route to default.");
  });

  it("describes delete", () => {
    expect(describeSpec(spec({ action: "delete", destination: "192.168.1.0/24", gateway: "192.168.1.1" }))).toBe(
      "Delete the route to 192.168.1.0/24 via gateway 192.168.1.1.",
    );
  });

  it("falls back to a placeholder when the destination is blank", () => {
    expect(describeSpec(spec({ action: "add" }))).toBe("Add a route to SOME_DESTINATION.");
  });
});
