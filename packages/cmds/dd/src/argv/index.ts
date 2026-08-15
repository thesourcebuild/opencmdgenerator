import type { Arg, Argv } from "@cmdgen/engine";
import type { DdSpec } from "../spec";

export type { Arg, Argv };

/**
 * Build the dd invocation. dd takes no catalogue flags at all (see
 * `catalogue/flags.ts` — `FLAGS` is empty) — every operand is a plain
 * `KEY=VALUE` token with no leading dash and no spaces around `=`, so each
 * one is pushed here directly as an `Arg` with `attached: true`, in this
 * fixed order: if=, of=, bs=, count=, skip=, conv=, status=. There is no
 * `buildFlagArgs` call to make since there is no catalogue to render from.
 *
 * DANGER: if= and of= are one keystroke apart and utterly asymmetric in
 * consequence — get them backwards, or simply point of= at the wrong
 * device, and dd overwrites it silently and irreversibly. This app never
 * executes anything it generates, but the command itself is real. DD003 in
 * `lint/rules.ts` is the one guard offered here, and only for the narrower
 * case of if= and of= naming the same file.
 */
export function buildArgv(spec: DdSpec): Argv {
  const inputFile = spec.inputFile.trim();
  const outputFile = spec.outputFile.trim();
  const blockSize = spec.blockSize.trim();
  const count = spec.count.trim();
  const skip = spec.skip.trim();
  const conv = spec.conv.trim();
  const status = spec.status.trim();

  const args: Arg[] = [];
  if (inputFile !== "") args.push({ text: `if=${inputFile}`, role: "value", attached: true });
  if (outputFile !== "") args.push({ text: `of=${outputFile}`, role: "value", attached: true });
  if (blockSize !== "") args.push({ text: `bs=${blockSize}`, role: "value", attached: true });
  if (count !== "") args.push({ text: `count=${count}`, role: "value", attached: true });
  if (skip !== "") args.push({ text: `skip=${skip}`, role: "value", attached: true });
  if (conv !== "") args.push({ text: `conv=${conv}`, role: "value", attached: true });
  if (status !== "") args.push({ text: `status=${status}`, role: "value", attached: true });

  return { binary: "dd", args };
}
