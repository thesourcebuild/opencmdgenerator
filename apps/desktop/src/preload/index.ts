import { contextBridge, ipcRenderer } from "electron";

/**
 * The complete capability surface of the desktop app. Nothing else crosses into
 * the renderer: no ipcRenderer, no node APIs, no `require`.
 *
 * Keep this in sync with `DesktopBridge` in @cmdgen/platform — that interface is
 * what the shared UI code typechecks against.
 */
const MENU_CHANNELS = [
  "menu:newCommand",
  "menu:copyCommand",
  "menu:importProfiles",
  "menu:exportProfiles",
  "menu:settings",
  "menu:about",
] as const;

type MenuAction = (typeof MENU_CHANNELS)[number];

type RunShellKind = "cmd" | "powershell" | "wsl" | "bash";
interface RunDataEvent {
  sessionId: string;
  chunk: string;
}

contextBridge.exposeInMainWorld("cmdGenerator", {
  isDesktop: true,
  platform: process.platform,

  getVersion: () => ipcRenderer.invoke("app:getVersion"),

  pickDirectory: (options?: { title?: string; startingPath?: string }) =>
    ipcRenderer.invoke("dialog:pickDirectory", options ?? {}),

  pickFile: (options?: { title?: string; extensions?: string[] }) =>
    ipcRenderer.invoke("dialog:pickFile", options ?? {}),

  saveTextFile: (options: {
    suggestedName: string;
    contents: string;
    filters?: { name: string; extensions: string[] }[];
  }) => ipcRenderer.invoke("dialog:saveTextFile", options),

  openTextFile: (options?: { extensions?: string[] }) =>
    ipcRenderer.invoke("dialog:openTextFile", options ?? {}),

  openExternal: (url: string) => ipcRenderer.invoke("shell:openExternal", url),

  readProfiles: () => ipcRenderer.invoke("store:readProfiles"),
  writeProfiles: (json: string) => ipcRenderer.invoke("store:writeProfiles", json),

  /**
   * Native menu items dispatch here. Only the fixed channel list above is
   * subscribable, and the listener receives no event object — passing Electron's
   * IpcRendererEvent into the renderer would leak `sender`.
   */
  onMenuAction: (handler: (action: MenuAction) => void) => {
    const wrapped = new Map<MenuAction, () => void>();
    for (const channel of MENU_CHANNELS) {
      const listener = () => handler(channel);
      wrapped.set(channel, listener);
      ipcRenderer.on(channel, listener);
    }
    return () => {
      for (const [channel, listener] of wrapped) ipcRenderer.removeListener(channel, listener);
    };
  },

  /**
   * The one deliberate "actually execute this" surface — see
   * apps/desktop/src/main/run.ts's header comment for the full rationale.
   */
  runStart: (options: { shellKind: RunShellKind }) => ipcRenderer.invoke("run:start", options),
  runWrite: (options: { sessionId: string; data: string }) => ipcRenderer.invoke("run:write", options),
  runResize: (options: { sessionId: string; cols: number; rows: number }) =>
    ipcRenderer.invoke("run:resize", options),
  runKill: (options: { sessionId: string }) => ipcRenderer.invoke("run:kill", options),

  /** Single channel for every session's output in this window — the listener receives no raw event, same reasoning as onMenuAction. */
  onRunData: (handler: (event: RunDataEvent) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, payload: RunDataEvent) => handler(payload);
    ipcRenderer.on("run:data", listener);
    return () => ipcRenderer.removeListener("run:data", listener);
  },
});
