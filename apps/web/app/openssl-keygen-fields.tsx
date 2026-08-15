"use client";

import type { OpensslKeyAlgorithm, OpensslSpec } from "@cmdgen/openssl";
import {
  DHPARAM_CATALOGUE,
  DSAPARAM_CATALOGUE,
  DSA_CATALOGUE,
  ECPARAM_CATALOGUE,
  EC_CATALOGUE,
  FLAG_GROUP_META,
  GENDSA_CATALOGUE,
  GENPKEY_CATALOGUE,
  GENRSA_CATALOGUE,
  PKEYPARAM_CATALOGUE,
  PKEY_CATALOGUE,
  RSA_CATALOGUE,
  setFlag,
} from "@cmdgen/openssl";
import { Panel } from "@cmdgen/ui";
import { FlagsForm } from "./flags-form";

export interface OpensslKeygenFieldsProps {
  spec: OpensslSpec;
  onChange: (next: OpensslSpec) => void;
}

const textInputClass =
  "h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950";
const selectClass =
  "h-9 w-full max-w-md rounded-md border border-slate-300 bg-white px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950";

/** Fields for genrsa/genpkey/gendsa/rsa/dsa/ec/pkey/dhparam/ecparam/dsaparam/pkeyparam — the "Key Generation" category. */
export function OpensslKeygenFields({ spec, onChange }: OpensslKeygenFieldsProps) {
  if (spec.subcommand === "genrsa") {
    return (
      <>
        <Panel title="Output file">
          <input
            value={spec.outputFile}
            onChange={(e) => onChange({ ...spec, outputFile: e.target.value })}
            placeholder="key.pem"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Bits" description="Rendered as a bare trailing number, e.g. openssl genrsa -out key.pem 4096.">
          <input
            type="number"
            min={1}
            value={spec.bits}
            onChange={(e) => onChange({ ...spec, bits: e.target.value === "" ? 0 : Number(e.target.value) })}
            className={textInputClass}
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={GENRSA_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "genpkey") {
    return (
      <>
        <Panel title="Algorithm">
          <select
            value={spec.algorithm}
            onChange={(e) => onChange({ ...spec, algorithm: e.target.value as OpensslKeyAlgorithm })}
            className={selectClass}
          >
            <option value="RSA">RSA</option>
            <option value="EC">EC</option>
            <option value="ED25519">ED25519</option>
            <option value="X25519">X25519</option>
            <option value="DSA">DSA</option>
          </select>
        </Panel>
        <Panel title="Output file">
          <input
            value={spec.outputFile}
            onChange={(e) => onChange({ ...spec, outputFile: e.target.value })}
            placeholder="key.pem"
            className={textInputClass}
          />
        </Panel>
        {(spec.algorithm === "RSA" || spec.algorithm === "DSA") && (
          <Panel title="Bits" description="Rendered as -pkeyopt rsa_keygen_bits:<n> — only meaningful for RSA/DSA.">
            <input
              type="number"
              min={1}
              value={spec.bits}
              onChange={(e) => onChange({ ...spec, bits: e.target.value === "" ? 0 : Number(e.target.value) })}
              className={textInputClass}
            />
          </Panel>
        )}
        {spec.algorithm === "EC" && (
          <Panel title="Curve name" description="Rendered as -pkeyopt ec_paramgen_curve:<name> — only meaningful for EC.">
            <input
              value={spec.curveName}
              onChange={(e) => onChange({ ...spec, curveName: e.target.value })}
              placeholder="prime256v1"
              className={textInputClass}
            />
          </Panel>
        )}
        <Panel title="Flags">
          <FlagsForm
            catalogue={GENPKEY_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "gendsa") {
    return (
      <>
        <Panel title="Parameter file" description="A DSA parameter file, e.g. produced by dsaparam — rendered as a trailing positional.">
          <input
            value={spec.paramFile}
            onChange={(e) => onChange({ ...spec, paramFile: e.target.value })}
            placeholder="dsaparam.pem"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Output file">
          <input
            value={spec.outputFile}
            onChange={(e) => onChange({ ...spec, outputFile: e.target.value })}
            placeholder="dsakey.pem"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={GENDSA_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "rsa" || spec.subcommand === "dsa" || spec.subcommand === "ec" || spec.subcommand === "pkey") {
    const catalogue =
      spec.subcommand === "rsa" ? RSA_CATALOGUE : spec.subcommand === "dsa" ? DSA_CATALOGUE : spec.subcommand === "ec" ? EC_CATALOGUE : PKEY_CATALOGUE;
    return (
      <>
        <Panel title="Input file">
          <input
            value={spec.inFile}
            onChange={(e) => onChange({ ...spec, inFile: e.target.value })}
            placeholder="key.pem"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Output file">
          <input
            value={spec.outputFile}
            onChange={(e) => onChange({ ...spec, outputFile: e.target.value })}
            placeholder="out.pem"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={catalogue}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "dhparam" || spec.subcommand === "dsaparam") {
    const catalogue = spec.subcommand === "dhparam" ? DHPARAM_CATALOGUE : DSAPARAM_CATALOGUE;
    return (
      <>
        <Panel title="Output file">
          <input
            value={spec.outputFile}
            onChange={(e) => onChange({ ...spec, outputFile: e.target.value })}
            placeholder="params.pem"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Bits" description="Rendered as a bare trailing number.">
          <input
            type="number"
            min={1}
            value={spec.bits}
            onChange={(e) => onChange({ ...spec, bits: e.target.value === "" ? 0 : Number(e.target.value) })}
            className={textInputClass}
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={catalogue}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "ecparam") {
    return (
      <>
        <Panel title="Curve name">
          <input
            value={spec.curveName}
            onChange={(e) => onChange({ ...spec, curveName: e.target.value })}
            placeholder="prime256v1"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Output file">
          <input
            value={spec.outputFile}
            onChange={(e) => onChange({ ...spec, outputFile: e.target.value })}
            placeholder="ecparam.pem"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={ECPARAM_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "pkeyparam") {
    return (
      <>
        <Panel title="Input file">
          <input
            value={spec.inFile}
            onChange={(e) => onChange({ ...spec, inFile: e.target.value })}
            placeholder="params.pem"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Output file">
          <input
            value={spec.outputFile}
            onChange={(e) => onChange({ ...spec, outputFile: e.target.value })}
            placeholder="out.pem"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={PKEYPARAM_CATALOGUE}
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
  // subcommand's category is "keygen", so this is unreachable in practice.
  return null;
}
