import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, SemanageSpec } from "./spec";
import { SPEC_VERSION } from "./pure";

export function newId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  return `id-${Date.now().toString(36)}-${(counter++).toString(36)}`;
}
let counter = 0;

export interface CreateSpecOptions {
  id?: string;
  name?: string;
  shell?: ShellDialect;
}

export function createSpec(options: CreateSpecOptions = {}): SemanageSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    objectType: "fcontext",
    action: "add",
    target: "",
    type: "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces every operand field wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<SemanageSpec>[] = [
  {
    id: "label-a-web-directory",
    label: "Label a directory for httpd",
    summary: "fcontext -a — lets Apache/nginx read a custom web root by giving it the right SELinux type.",
    commandExample: "semanage fcontext -a -t httpd_sys_content_t '/web(/.*)?'",
    apply: (spec) => ({
      ...spec,
      objectType: "fcontext",
      action: "add",
      target: "/web(/.*)?",
      type: "httpd_sys_content_t",
      flags: {},
    }),
  },
  {
    id: "allow-a-custom-port",
    label: "Allow a custom port for a service",
    summary: "port -a — labels a non-standard port so a service (e.g. a custom httpd port) is allowed to bind it.",
    commandExample: "semanage port -a -t http_port_t -p tcp 8080",
    apply: (spec) => ({
      ...spec,
      objectType: "port",
      action: "add",
      target: "8080/tcp",
      type: "http_port_t",
      flags: {},
    }),
  },
  {
    id: "list-file-context-rules",
    label: "List file context rules",
    summary: "fcontext -l — shows every configured file context rule, custom and built-in.",
    commandExample: "semanage fcontext -l",
    apply: (spec) => ({ ...spec, objectType: "fcontext", action: "list", target: "", type: "", flags: {} }),
  },
  {
    id: "remove-a-custom-port",
    label: "Remove a custom port label",
    summary: "port -d — removes a previously added port label. SEM004 flags this as removing a policy customization.",
    commandExample: "semanage port -d -p tcp 8080",
    apply: (spec) => ({ ...spec, objectType: "port", action: "delete", target: "8080/tcp", type: "", flags: {} }),
  },
];

export function getPreset(id: string): Preset<SemanageSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
