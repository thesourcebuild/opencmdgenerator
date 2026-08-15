import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { dialog } from "electron";
import type { BrowserWindow, OpenDialogOptions, SaveDialogOptions } from "electron";

/**
 * Electron has separate overloads for modal and non-modal dialogs, so the parent
 * window is dispatched on rather than cast away.
 */
const open = (parent: BrowserWindow | null, options: OpenDialogOptions) =>
  parent ? dialog.showOpenDialog(parent, options) : dialog.showOpenDialog(options);

const save = (parent: BrowserWindow | null, options: SaveDialogOptions) =>
  parent ? dialog.showSaveDialog(parent, options) : dialog.showSaveDialog(options);

export interface PickDirectoryOptions {
  title?: string;
  startingPath?: string;
}

export async function pickDirectory(
  parent: BrowserWindow | null,
  options: PickDirectoryOptions = {},
): Promise<string | null> {
  const result = await open(parent, {
    title: options.title ?? "Choose a directory",
    defaultPath: options.startingPath,
    properties: ["openDirectory", "createDirectory", "dontAddToRecent"],
  });
  return result.canceled ? null : (result.filePaths[0] ?? null);
}

export async function pickFile(
  parent: BrowserWindow | null,
  options: { title?: string; extensions?: string[] } = {},
): Promise<string | null> {
  const result = await open(parent, {
    title: options.title ?? "Choose a file",
    properties: ["openFile", "dontAddToRecent"],
    filters: options.extensions?.length
      ? [{ name: "Supported", extensions: options.extensions }]
      : undefined,
  });
  return result.canceled ? null : (result.filePaths[0] ?? null);
}

/**
 * The renderer supplies contents and a suggested name but never a destination
 * path — the user picks that through the OS dialog. Accepting a renderer-chosen
 * path would hand the UI an arbitrary-file-write primitive.
 */
export async function saveTextFile(
  parent: BrowserWindow | null,
  options: {
    suggestedName: string;
    contents: string;
    filters?: { name: string; extensions: string[] }[];
  },
): Promise<{ saved: boolean; path?: string }> {
  const result = await save(parent, {
    title: "Save",
    defaultPath: path.basename(options.suggestedName),
    filters: options.filters,
    properties: ["createDirectory", "showOverwriteConfirmation"],
  });

  if (result.canceled || !result.filePath) return { saved: false };
  await writeFile(result.filePath, options.contents, "utf8");
  return { saved: true, path: result.filePath };
}

const MAX_IMPORT_BYTES = 2 * 1024 * 1024;

export async function openTextFile(
  parent: BrowserWindow | null,
  options: { extensions?: string[] } = {},
): Promise<{ name: string; contents: string } | null> {
  const chosen = await pickFile(parent, { title: "Open", extensions: options.extensions });
  if (!chosen) return null;

  const contents = await readFile(chosen, "utf8");
  if (contents.length > MAX_IMPORT_BYTES) {
    throw new Error("File is too large to be a profile export.");
  }
  return { name: path.basename(chosen), contents };
}
