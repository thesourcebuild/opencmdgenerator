import { Menu, app, shell, type BrowserWindow, type MenuItemConstructorOptions } from "electron";

const RSYNC_DOCS = "https://rsync.samba.org/documentation.html";

export interface MenuOptions {
  /** Shows the Developer submenu. Set when running against the dev server. */
  isDev: boolean;
}

/**
 * The application menu.
 *
 * Deliberately not a browser's menu. Reload, zoom and DevTools were in here
 * originally, and a View menu offering "Reload" and "Zoom In" makes a desktop app
 * read as a web page in a frame. Those now live under Developer, which only appears
 * in dev — except for a hidden F12 binding, kept because an invisible menu item's
 * accelerator still fires, so support can open DevTools without it being on display.
 */
export function buildMenu(window: BrowserWindow, options: MenuOptions): void {
  const isMac = process.platform === "darwin";

  const send = (channel: string) => () => window.webContents.send(channel);

  const template: MenuItemConstructorOptions[] = [
    ...(isMac ? ([{ role: "appMenu" }] satisfies MenuItemConstructorOptions[]) : []),
    {
      label: "&File",
      submenu: [
        { label: "New command", accelerator: "CmdOrCtrl+N", click: send("menu:newCommand") },
        {
          label: "Copy command",
          accelerator: "CmdOrCtrl+Shift+C",
          click: send("menu:copyCommand"),
        },
        { type: "separator" },
        { label: "Import profiles…", click: send("menu:importProfiles") },
        { label: "Export profiles…", click: send("menu:exportProfiles") },
        { type: "separator" },
        isMac ? { role: "close" } : { role: "quit" },
      ],
    },
    {
      label: "&Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectAll" },
      ],
    },
    {
      label: "&View",
      submenu: [
        { role: "togglefullscreen" },
        // Hidden, but the accelerator still works. Lets someone diagnose a problem
        // without the app advertising developer tooling in its menus.
        {
          label: "Toggle Developer Tools",
          accelerator: "F12",
          visible: false,
          click: () => window.webContents.toggleDevTools(),
        },
      ],
    },
    ...(options.isDev
      ? ([
          {
            label: "&Developer",
            submenu: [
              { role: "reload" },
              { role: "forceReload" },
              { role: "toggleDevTools" },
              { type: "separator" },
              { role: "resetZoom" },
              { role: "zoomIn" },
              { role: "zoomOut" },
            ],
          },
        ] satisfies MenuItemConstructorOptions[])
      : []),
    {
      label: "&Help",
      submenu: [
        { label: "rsync documentation", click: () => void shell.openExternal(RSYNC_DOCS) },
        { type: "separator" },
        { label: `About ${app.getName()}`, click: send("menu:about") },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}
