/* eslint-disable no-restricted-imports */
import { execFileSync } from "node:child_process";

/**
 * Ground truth for the argv builder.
 *
 * Snapshot tests prove the generator is self-consistent; they cannot prove rsync
 * accepts what it emits. This script feeds each generated command to a real rsync
 * with --dry-run against throwaway paths and checks that rsync's own option
 * parser is happy — the check my snapshots cannot make.
 *
 * It is a dev tool, not part of the app. The app never executes rsync; this
 * script does, deliberately, to validate the generator.
 *
 * Usage:  node scripts/verify-against-rsync.mjs            (uses `rsync`)
 *         node scripts/verify-against-rsync.mjs --wsl      (uses `wsl rsync`)
 */

const useWsl = process.argv.includes("--wsl");

/**
 * Commands are supplied as argv arrays so this script never builds a shell
 * string. They mirror the fixtures in test/argv.test.ts.
 */
const CASES = [
  { name: "archive local", argv: ["-a", "/tmp/rsync-verify-src/", "/tmp/rsync-verify-dst"] },
  {
    name: "mirror with circuit breaker",
    argv: [
      "-a",
      "--delete-after",
      "--max-delete=100",
      "-i",
      "--stats",
      "/tmp/rsync-verify-src/",
      "/tmp/rsync-verify-dst",
    ],
  },
  {
    name: "filters in order",
    argv: [
      "-a",
      "--include",
      "*.jpg",
      "--exclude",
      "*",
      "/tmp/rsync-verify-src/",
      "/tmp/rsync-verify-dst",
    ],
  },
  {
    name: "partial dir and bandwidth limit",
    argv: [
      "-a",
      "--partial",
      "--partial-dir=.rsync-partial",
      "--bwlimit=5M",
      "--max-size=100M",
      "-vh",
      "--stats",
      "/tmp/rsync-verify-src/",
      "/tmp/rsync-verify-dst",
    ],
  },
  {
    name: "checksum verify pass",
    argv: [
      "-a",
      "-c",
      "-i",
      "--stats",
      "/tmp/rsync-verify-src/",
      "/tmp/rsync-verify-dst",
    ],
  },
  {
    name: "root-filesystem style excludes",
    argv: [
      "-a",
      "-H",
      "-A",
      "-X",
      "--numeric-ids",
      "-x",
      "-S",
      "-h",
      "--stats",
      "--exclude",
      "/proc/*",
      "--exclude",
      "/sys/*",
      "/tmp/rsync-verify-src/",
      "/tmp/rsync-verify-dst",
    ],
  },
  {
    name: "paths with spaces and an apostrophe",
    argv: ["-a", "/tmp/rsync-verify-src/Bob's Files/", "/tmp/rsync-verify-dst/Backup Drive"],
  },
  {
    name: "out-format and info",
    argv: [
      "-a",
      "--info=progress2,stats2",
      "--out-format=%i|%n|%l|%b",
      "/tmp/rsync-verify-src/",
      "/tmp/rsync-verify-dst",
    ],
  },
];

function run(argv) {
  const full = ["--dry-run", ...argv];
  if (useWsl) return execFileSync("wsl", ["-e", "rsync", ...full], { encoding: "utf8", stdio: "pipe" });
  return execFileSync("rsync", full, { encoding: "utf8", stdio: "pipe" });
}

function setup() {
  const script =
    "mkdir -p \"/tmp/rsync-verify-src/Bob's Files\" /tmp/rsync-verify-dst && " +
    "echo hello > /tmp/rsync-verify-src/a.txt && " +
    "echo jpeg > /tmp/rsync-verify-src/photo.jpg && " +
    "echo x > \"/tmp/rsync-verify-src/Bob's Files/note.txt\"";
  if (useWsl) execFileSync("wsl", ["-e", "sh", "-c", script], { stdio: "pipe" });
  else execFileSync("sh", ["-c", script], { stdio: "pipe" });
}

const version = run(["--version"]).split("\n")[0];
console.log(`rsync: ${version}\n`);
setup();

let failed = 0;
for (const testCase of CASES) {
  try {
    run(testCase.argv);
    console.log(`  PASS  ${testCase.name}`);
  } catch (error) {
    failed++;
    const stderr = String(error.stderr ?? error.message).trim().split("\n").slice(0, 3).join("\n        ");
    console.log(`  FAIL  ${testCase.name}\n        ${stderr}`);
  }
}

console.log(
  failed === 0
    ? `\nAll ${CASES.length} generated commands accepted by rsync.`
    : `\n${failed} of ${CASES.length} commands rejected by rsync.`,
);
process.exit(failed === 0 ? 0 : 1);
