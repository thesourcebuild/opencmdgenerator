"use client";

import type { OpensslSpec } from "@cmdgen/openssl";
import {
  FLAG_GROUP_META,
  PRIME_CATALOGUE,
  RAND_CATALOGUE,
  SESS_ID_CATALOGUE,
  S_CLIENT_CATALOGUE,
  S_SERVER_CATALOGUE,
  S_TIME_CATALOGUE,
  setFlag,
} from "@cmdgen/openssl";
import { Panel } from "@cmdgen/ui";
import { FlagsForm } from "./flags-form";

export interface OpensslTlsFieldsProps {
  spec: OpensslSpec;
  onChange: (next: OpensslSpec) => void;
}

const textInputClass =
  "h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950";

/** Fields for rand/prime/s_client/s_server/s_time/sess_id — the "Random & Primes" and "TLS/Network Testing" categories. */
export function OpensslTlsFields({ spec, onChange }: OpensslTlsFieldsProps) {
  if (spec.subcommand === "rand") {
    return (
      <>
        <Panel title="Number of bytes" description="Rendered as a bare trailing positional, e.g. `rand ... 32`.">
          <input
            type="number"
            value={spec.numBytes}
            onChange={(e) => onChange({ ...spec, numBytes: Number(e.target.value) || 0 })}
            className={textInputClass}
          />
        </Panel>
        <Panel title="Output file">
          <input
            value={spec.outputFile}
            onChange={(e) => onChange({ ...spec, outputFile: e.target.value })}
            placeholder="random.bin"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={RAND_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "prime") {
    return (
      <>
        <Panel title="Number" description="A decimal or hex number to check. Leave empty when using -generate below.">
          <input
            value={spec.number}
            onChange={(e) => onChange({ ...spec, number: e.target.value })}
            placeholder="17"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={PRIME_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "s_client") {
    return (
      <>
        <Panel title="Connect target" description="-connect host:port">
          <input
            value={spec.connectTarget}
            onChange={(e) => onChange({ ...spec, connectTarget: e.target.value })}
            placeholder="example.com:443"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={S_CLIENT_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "s_server") {
    return (
      <>
        <Panel title="Accept port" description="-accept port">
          <input
            value={spec.acceptPort}
            onChange={(e) => onChange({ ...spec, acceptPort: e.target.value })}
            placeholder="4433"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={S_SERVER_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "s_time") {
    return (
      <>
        <Panel title="Connect target" description="-connect host:port">
          <input
            value={spec.connectTarget}
            onChange={(e) => onChange({ ...spec, connectTarget: e.target.value })}
            placeholder="example.com:443"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={S_TIME_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "sess_id") {
    return (
      <>
        <Panel title="Input file">
          <input
            value={spec.inFile}
            onChange={(e) => onChange({ ...spec, inFile: e.target.value })}
            placeholder="session.pem"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Output file">
          <input
            value={spec.outputFile}
            onChange={(e) => onChange({ ...spec, outputFile: e.target.value })}
            placeholder="session.out"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={SESS_ID_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  // Every other subcommand belongs to a different category's fields panel —
  // openssl-builder.tsx only ever mounts this component when the current
  // subcommand's category is "rand" or "tls", so this is unreachable in practice.
  return null;
}
