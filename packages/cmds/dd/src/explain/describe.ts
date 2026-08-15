import type { DdSpec } from "../spec";

export function describeSpec(spec: DdSpec): string {
  const inputFile = spec.inputFile.trim() || "SOME_INPUT";
  const outputFile = spec.outputFile.trim() || "SOME_OUTPUT";
  const blockSize = spec.blockSize.trim();
  const count = spec.count.trim();
  const skip = spec.skip.trim();
  const conv = spec.conv.trim();
  const status = spec.status.trim();

  let sentence = `Copy from ${inputFile} to ${outputFile}`;
  if (blockSize !== "") sentence += `, ${blockSize} at a time`;
  if (skip !== "") sentence += `, skipping ${skip} block(s) of input first`;
  if (count !== "") sentence += `, stopping after ${count} block(s)`;
  if (conv !== "") sentence += `, converting with ${conv}`;
  if (status === "progress") sentence += ", showing progress";
  else if (status !== "") sentence += `, with status=${status}`;

  return `${sentence}.`;
}
