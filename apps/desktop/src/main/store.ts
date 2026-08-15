import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { app } from "electron";
import { ProfileStore } from "@cmdgen/contracts";

/**
 * Profiles live in a single JSON file in the app's userData directory. Writes go
 * to a temporary file and are then renamed, so a crash mid-write cannot leave a
 * truncated store behind.
 */
function storePath(): string {
  return path.join(app.getPath("userData"), "profiles.json");
}

export async function readProfiles(): Promise<string | null> {
  try {
    const raw = await readFile(storePath(), "utf8");
    // Validate here so a hand-edited or corrupt file surfaces as "no profiles"
    // rather than crashing the renderer on parse.
    const parsed = ProfileStore.safeParse(JSON.parse(raw));
    return parsed.success ? raw : null;
  } catch {
    return null;
  }
}

export async function writeProfiles(json: string): Promise<void> {
  const parsed = ProfileStore.safeParse(JSON.parse(json));
  if (!parsed.success) {
    throw new Error(`Refusing to write malformed profile store: ${parsed.error.message}`);
  }

  const target = storePath();
  const temp = `${target}.${process.pid}.tmp`;
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(temp, JSON.stringify(parsed.data, null, 2), "utf8");
  await rename(temp, target);
}
