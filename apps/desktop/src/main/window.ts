import { existsSync } from "node:fs";
import path from "node:path";
import { BrowserWindow, app, shell } from "electron";
import { APP_ORIGIN } from "./protocol";

/**
 * Resolve the window icon. Packaged, resources/ sits next to the app bundle;
 * unpackaged, it is in the source tree. Returns undefined rather than a bad path
 * so Electron falls back to its default instead of failing to create a window.
 */
export function appIcon(): string | undefined {
  const name = process.platform === "win32" ? "icon.ico" : "icon.png";
  const candidates = [
    path.join(process.resourcesPath ?? "", name),
    path.join(app.getAppPath(), "resources", name),
    path.join(app.getAppPath(), "..", "..", "resources", name),
  ];
  return candidates.find((p) => p && existsSync(p));
}

/** The only external hosts the app will ever hand to the system browser. */
const EXTERNAL_ALLOWLIST = [/^https:\/\/(www\.)?github\.com\//, /^https:\/\/rsync\.samba\.org\//];

export interface CreateWindowOptions {
  /** Set in development to load the Next dev server instead of the bundle. */
  devUrl?: string;
  preloadPath: string;
}

export function createMainWindow({ devUrl, preloadPath }: CreateWindowOptions): BrowserWindow {
  const window = new BrowserWindow({
    width: 1180,
    height: 840,
    minWidth: 900,
    minHeight: 620,
    show: false,
    backgroundColor: "#0f172a",
    title: "OpenCmdGenerator",
    // Without this Windows shows Electron's atom logo in the title bar, taskbar and
    // Alt-Tab, which is the single loudest "this is not a real application" signal.
    // electron-builder picks the icon up from resources/ for the installer; the
    // window needs it passed explicitly, especially when running unpackaged.
    icon: appIcon(),
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
    // The menu bar stays visible. A File/Edit/View/Help bar is what a desktop
    // application looks like — the browser feel came from the ITEMS in it (Reload,
    // Zoom, DevTools), which now live under a dev-only Developer menu.
    webPreferences: {
      preload: preloadPath,
      // Defaults in modern Electron, but pinned explicitly: these are the
      // difference between a sandboxed renderer and a shell on the user's box.
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      experimentalFeatures: false,
      spellcheck: false,
    },
  });

  window.once("ready-to-show", () => window.show());

  // Nothing in this app should ever open a second window.
  window.webContents.setWindowOpenHandler(({ url }) => {
    if (EXTERNAL_ALLOWLIST.some((re) => re.test(url))) void shell.openExternal(url);
    return { action: "deny" };
  });

  // Client-side routing happens in the renderer; a real navigation away from
  // our own origin is either a bug or an attack.
  window.webContents.on("will-navigate", (event, url) => {
    const permitted = devUrl ? url.startsWith(devUrl) : url.startsWith(APP_ORIGIN);
    if (!permitted) {
      event.preventDefault();
      if (EXTERNAL_ALLOWLIST.some((re) => re.test(url))) void shell.openExternal(url);
    }
  });

  // No WebView tags, no attaching arbitrary preloads.
  window.webContents.on("will-attach-webview", (event) => event.preventDefault());

  void window.loadURL(devUrl ? devUrl : `${APP_ORIGIN}/index.html`);

  // DevTools is opt-in. Opening it automatically in dev made the app look and feel
  // like a browser window rather than a desktop application, which is the wrong
  // default even while developing. Set CMD_GENERATOR_DEVTOOLS=1, or press F12.
  if (process.env.CMD_GENERATOR_DEVTOOLS === "1") {
    window.webContents.openDevTools({ mode: "detach" });
  }

  return window;
}

export const rendererRoot = (appPath: string): string => path.join(appPath, "renderer");
