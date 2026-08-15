import path from "node:path";
import { BrowserWindow, app } from "electron";
import { registerIpc } from "./ipc";
import { buildMenu } from "./menu";
import { registerScheme, serveRenderer } from "./protocol";
import { killAllSessions, killSessionsForWindow } from "./run";
import { runSmokeTest } from "./smoke";
import { createMainWindow } from "./window";

function createWindow(devUrl: string | undefined) {
  const window = createMainWindow({
    devUrl,
    preloadPath: path.join(__dirname, "../preload/index.cjs"),
  });
  buildMenu(window, { isDev: Boolean(devUrl) });
  // A closed window's Run sessions have no one left to stream output to —
  // window-all-closed/before-quit cover the whole-app-exit case below.
  // Captured before the listener fires: a destroyed BrowserWindow's own
  // property access afterward isn't something to rely on.
  const windowId = window.id;
  window.on("closed", () => killSessionsForWindow(windowId));
  return window;
}

// Must happen before the app is ready.
registerScheme();

// package.json's name is "@cmdgen/desktop", which would surface in the About box and
// in native dialogs. Set the real product name instead.
app.setName("OpenCmdGenerator");

// Windows groups taskbar buttons, pins and notifications by AppUserModelId. Without
// it, an unpackaged run shows up as "Electron" and pinning misbehaves. Matches the
// electron-builder `appId` in electron-builder.config.cjs.
if (process.platform === "win32") {
  app.setAppUserModelId("com.example.cmdgenerator");
}

const devUrl = process.env.CMD_GENERATOR_DEV_URL;

// One instance only: profiles are a single JSON file and two writers would race.
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on("second-instance", () => {
    const existing = BrowserWindow.getAllWindows()[0];
    if (existing) {
      if (existing.isMinimized()) existing.restore();
      existing.focus();
    }
  });

  app.whenReady().then(() => {
    // In production the renderer sits next to the bundled main process output.
    // In dev it comes from the Next dev server, so nothing needs serving.
    if (!devUrl) {
      serveRenderer(path.join(app.getAppPath(), "renderer"));
    }

    registerIpc();

    const window = createWindow(devUrl);

    if (process.env.CMD_GENERATOR_SMOKE === "1") runSmokeTest(window);

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow(devUrl);
    });
  });

  app.on("window-all-closed", () => {
    killAllSessions();
    if (process.platform !== "darwin") app.quit();
  });

  // Belt and braces alongside each window's own "closed" cleanup above — a
  // crash or forced quit skips "closed" for windows still open at the time,
  // but never skips "before-quit".
  app.on("before-quit", () => killAllSessions());

  // Belt and braces: refuse to attach a renderer that somehow asks for Node.
  app.on("web-contents-created", (_event, contents) => {
    contents.on("will-attach-webview", (event) => event.preventDefault());
  });
}
