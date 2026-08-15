import { z } from "zod";

/**
 * `spec` is validated by the owning command's own schema
 * (`packages/cmds/<name>`'s `*Spec`), not here — `contracts` has no idea
 * which commands are installed. A command package narrows a raw `Profile`
 * with `commandId === "rsync"` (or whichever id) before parsing `spec`
 * against its own schema.
 */
export const Profile = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().default(""),
  tags: z.array(z.string()).default([]),
  commandId: z.string(),
  spec: z.unknown(),
  /** Epoch milliseconds. */
  createdAt: z.number().int(),
  updatedAt: z.number().int(),
});
export type Profile = z.infer<typeof Profile>;

/** On-disk / localStorage envelope. Versioned so it can be migrated. */
export const PROFILE_STORE_VERSION = 1 as const;

export const ProfileStore = z.object({
  storeVersion: z.literal(PROFILE_STORE_VERSION).default(PROFILE_STORE_VERSION),
  profiles: z.array(Profile).default([]),
});
export type ProfileStore = z.infer<typeof ProfileStore>;

export const emptyProfileStore = (): ProfileStore => ({
  storeVersion: PROFILE_STORE_VERSION,
  profiles: [],
});
