import { BrowserWindow, app, ipcMain, shell } from "electron";
import { z } from "zod";
import { openTextFile, pickDirectory, pickFile, saveTextFile } from "./dialogs";
import { killSession, resizeSession, setRunDataHandler, startSession, writeToSession } from "./run";
import { readProfiles, writeProfiles } from "./store";

/**
 * Every channel is validated. The renderer is the least trusted part of an
 * Electron app, so arguments arriving over IPC get the same treatment as
 * arguments arriving over a network boundary — even though nothing here spawns
 * a process, `saveTextFile` and `openExternal` are both real capabilities.
 */

const PickDirectoryArgs = z
  .object({ title: z.string().max(200).optional(), startingPath: z.string().max(4096).optional() })
  .default({});

const PickFileArgs = z
  .object({
    title: z.string().max(200).optional(),
    extensions: z.array(z.string().regex(/^[A-Za-z0-9]{1,12}$/)).max(20).optional(),
  })
  .default({});

const SaveTextFileArgs = z.object({
  suggestedName: z.string().min(1).max(255),
  contents: z.string().max(5 * 1024 * 1024),
  filters: z
    .array(
      z.object({
        name: z.string().min(1).max(80),
        extensions: z.array(z.string().regex(/^[A-Za-z0-9]{1,12}$/)).max(20),
      }),
    )
    .max(10)
    .optional(),
});

const OpenTextFileArgs = z
  .object({ extensions: z.array(z.string().regex(/^[A-Za-z0-9]{1,12}$/)).max(20).optional() })
  .default({});

/** Only https, and only hosts this app has a reason to link to. */
const EXTERNAL_ALLOWLIST = [/^https:\/\/(www\.)?github\.com\//, /^https:\/\/rsync\.samba\.org\//];

const ProfileJson = z.string().max(10 * 1024 * 1024);

const RunShellKind = z.enum(["cmd", "powershell", "wsl", "bash"]);
const RunStartArgs = z.object({ shellKind: RunShellKind });
// SessionId is a UUID minted by run.ts, never renderer-chosen — validated as a
// shape, not trusted as an identity; ownership is checked in run.ts itself.
const SessionId = z.string().uuid();
const RunWriteArgs = z.object({ sessionId: SessionId, data: z.string().max(8192) });
const RunResizeArgs = z.object({
  sessionId: SessionId,
  cols: z.number().int().min(1).max(500),
  rows: z.number().int().min(1).max(500),
});
const RunKillArgs = z.object({ sessionId: SessionId });

function senderWindow(event: Electron.IpcMainInvokeEvent): BrowserWindow | null {
  return BrowserWindow.fromWebContents(event.sender);
}

/** run:* handlers always need a real window — a PTY session with nowhere to stream output to makes no sense. */
function requireSenderWindow(event: Electron.IpcMainInvokeEvent): BrowserWindow {
  const window = senderWindow(event);
  if (!window) throw new Error("No window associated with this Run request.");
  return window;
}

export function registerIpc(): void {
  ipcMain.handle("app:getVersion", () => app.getVersion());

  ipcMain.handle("dialog:pickDirectory", async (event, raw) =>
    pickDirectory(senderWindow(event), PickDirectoryArgs.parse(raw ?? {})),
  );

  ipcMain.handle("dialog:pickFile", async (event, raw) =>
    pickFile(senderWindow(event), PickFileArgs.parse(raw ?? {})),
  );

  ipcMain.handle("dialog:saveTextFile", async (event, raw) =>
    saveTextFile(senderWindow(event), SaveTextFileArgs.parse(raw)),
  );

  ipcMain.handle("dialog:openTextFile", async (event, raw) =>
    openTextFile(senderWindow(event), OpenTextFileArgs.parse(raw ?? {})),
  );

  ipcMain.handle("shell:openExternal", async (_event, raw) => {
    const url = z.string().url().max(2048).parse(raw);
    if (!EXTERNAL_ALLOWLIST.some((re) => re.test(url))) {
      throw new Error(`Refusing to open a URL outside the allowlist: ${url}`);
    }
    await shell.openExternal(url);
  });

  ipcMain.handle("store:readProfiles", () => readProfiles());

  ipcMain.handle("store:writeProfiles", async (_event, raw) => {
    await writeProfiles(ProfileJson.parse(raw));
  });

  ipcMain.handle("run:start", async (event, raw) => {
    const window = requireSenderWindow(event);
    const { shellKind } = RunStartArgs.parse(raw);
    return startSession({ windowId: window.id, shellKind });
  });

  ipcMain.handle("run:write", (event, raw) => {
    const window = requireSenderWindow(event);
    const { sessionId, data } = RunWriteArgs.parse(raw);
    writeToSession(window.id, sessionId, data);
  });

  ipcMain.handle("run:resize", (event, raw) => {
    const window = requireSenderWindow(event);
    const { sessionId, cols, rows } = RunResizeArgs.parse(raw);
    resizeSession(window.id, sessionId, cols, rows);
  });

  ipcMain.handle("run:kill", (event, raw) => {
    const window = requireSenderWindow(event);
    const { sessionId } = RunKillArgs.parse(raw);
    killSession(window.id, sessionId);
  });

  // Main -> renderer push, same shape as menu.ts's webContents.send calls —
  // routed to the specific window that owns the session, never broadcast.
  setRunDataHandler((sessionId, chunk, windowId) => {
    BrowserWindow.fromId(windowId)?.webContents.send("run:data", { sessionId, chunk });
  });
}
