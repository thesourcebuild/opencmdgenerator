/**
 * Plain module (no "use client") so both the server-rendered inline script in
 * `layout.tsx` and the client-side `useTheme` hook can share one literal
 * value — a constant exported from a "use client" module resolves to
 * `undefined` when imported into a Server Component, since that boundary
 * only carries component references across, not arbitrary values.
 */
export const THEME_STORAGE_KEY = "OpenCmdGenerator:theme:v1";
