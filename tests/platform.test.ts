import { afterEach, describe, expect, it } from "vitest";
import { electronPlatform } from "../packages/platform/src/electron";

const globalWithWindow = globalThis as typeof globalThis & { window?: unknown };
const originalWindow = globalWithWindow.window;
const originalVersion = process.env.NEXT_PUBLIC_APP_VERSION;

afterEach(() => {
  if (originalWindow === undefined) {
    delete globalWithWindow.window;
  } else {
    globalWithWindow.window = originalWindow;
  }
  if (originalVersion === undefined) delete process.env.NEXT_PUBLIC_APP_VERSION;
  else process.env.NEXT_PUBLIC_APP_VERSION = originalVersion;
});

describe("electronPlatform", () => {
  it("uses the bridge-reported app version even if the renderer env is stale", async () => {
    process.env.NEXT_PUBLIC_APP_VERSION = "0.1.5";
    (globalThis as typeof globalThis & { window?: unknown }).window = {
      cmdGenerator: {
        platform: "win32",
        getVersion: async () => "0.1.8",
      },
    };

    await expect(electronPlatform.environment()).resolves.toMatchObject({
      appVersion: "0.1.8",
      isDesktop: true,
      platform: "win32",
    });
  });
});
