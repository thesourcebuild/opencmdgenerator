import type { HostPlatform, OpenedTextFile, RunDataEvent, RunSession, RunShellKind, SaveResult } from "@cmdgen/contracts";

/** Native menu items the desktop shell can dispatch into the renderer. */
export type MenuAction =
  | "menu:newCommand"
  | "menu:copyCommand"
  | "menu:importProfiles"
  | "menu:exportProfiles"
  | "menu:about";

/**
 * The exact surface `apps/desktop` exposes on `window` through contextBridge.
 * Declared here so both sides typecheck against one definition, and so the
 * renderer never needs to import anything from electron.
 */
export interface DesktopBridge {
  readonly isDesktop: true;
  readonly platform: HostPlatform;
  getVersion(): Promise<string>;
  pickDirectory(options?: { title?: string; startingPath?: string }): Promise<string | null>;
  pickFile(options?: { title?: string; extensions?: string[] }): Promise<string | null>;
  saveTextFile(options: {
    suggestedName: string;
    contents: string;
    filters?: { name: string; extensions: string[] }[];
  }): Promise<SaveResult>;
  openTextFile(options?: { extensions?: string[] }): Promise<OpenedTextFile | null>;
  openExternal(url: string): Promise<void>;
  readProfiles(): Promise<string | null>;
  writeProfiles(json: string): Promise<void>;
  /** Returns an unsubscribe function. */
  onMenuAction(handler: (action: MenuAction) => void): () => void;

  /** The one deliberate "actually execute this" surface — see `apps/desktop/src/main/run.ts`. */
  runStart(options: { shellKind: RunShellKind }): Promise<RunSession>;
  runWrite(options: { sessionId: string; data: string }): Promise<void>;
  runResize(options: { sessionId: string; cols: number; rows: number }): Promise<void>;
  runKill(options: { sessionId: string }): Promise<void>;
  /** Returns an unsubscribe function. */
  onRunData(handler: (event: RunDataEvent) => void): () => void;
}

declare global {
  interface Window {
    cmdGenerator?: DesktopBridge;
  }
}

export function getDesktopBridge(): DesktopBridge | undefined {
  if (typeof window === "undefined") return undefined;
  return window.cmdGenerator;
}

export const isDesktopHost = (): boolean => getDesktopBridge() !== undefined;
