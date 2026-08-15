import { Menu, app, type BrowserWindow } from "electron";
import { appIcon } from "./window";

/**
 * Headless verification that the packaged renderer really loads over app:// and
 * that React mounted — the two things most likely to break silently between a
 * working `next build` and a working desktop app.
 *
 * Enabled with CMD_GENERATOR_SMOKE=1; exits non-zero on failure so CI can gate on it.
 */
interface InteractiveProbe {
  before?: string;
  after?: string;
  error?: string;
}

/**
 * Clicks the `-z` flag toggle and reports the generated command before and after.
 * If React hydrated, the command gains `-z`. If it did not, the click is inert and
 * both strings are identical.
 */
function checkInteractive(window: BrowserWindow): Promise<InteractiveProbe> {
  return window.webContents.executeJavaScript(
    `(async () => {
       const cmd = () => document.querySelector("pre code")?.textContent ?? "";
       const before = cmd();
       const button = Array.from(document.querySelectorAll("button"))
         .find((b) => (b.textContent || "").trim() === "-z");
       if (!button) return { error: "no -z flag button in the DOM" };
       button.click();
       await new Promise((r) => setTimeout(r, 400));
       return { before, after: cmd() };
     })()`,
  ) as Promise<InteractiveProbe>;
}

interface RunProbe {
  canRunCommands?: boolean;
  echoedOutput?: boolean;
  error?: string;
}

/**
 * Drives the real `run:*` IPC channels directly through `window.cmdGenerator`
 * (there is no exposed app-level `platform()` helper for executeJavaScript to
 * reach into) — starts a real shell session (cmd.exe on Windows, bash on
 * Linux) native to whatever host this smoke test is running on, writes a
 * benign echo, and requires the actual pty output to come back. This
 * exercises the same path `run-terminal-panel.tsx` uses, just without the
 * xterm.js UI on top.
 */
function checkRun(window: BrowserWindow): Promise<RunProbe> {
  return window.webContents.executeJavaScript(
    `(async () => {
       const bridge = window.cmdGenerator;
       const canRunCommands = bridge.platform === "win32" || bridge.platform === "linux";
       if (!canRunCommands) return { canRunCommands };
       const shellKind = bridge.platform === "win32" ? "cmd" : "bash";

       let chunks = "";
       let sessionId;
       const unsubscribe = bridge.onRunData((event) => {
         if (event.sessionId === sessionId) chunks += event.chunk;
       });
       try {
         ({ sessionId } = await bridge.runStart({ shellKind }));
         await bridge.runWrite({ sessionId, data: "echo smoke-run-ok\\r" });
         await new Promise((r) => setTimeout(r, 800));
         return { canRunCommands, echoedOutput: chunks.includes("smoke-run-ok") };
       } catch (error) {
         return { canRunCommands, error: String(error) };
       } finally {
         unsubscribe();
         if (sessionId) await bridge.runKill({ sessionId }).catch(() => {});
       }
     })()`,
  ) as Promise<RunProbe>;
}

export function runSmokeTest(window: BrowserWindow): void {
  const fail = (reason: string) => {
    process.stderr.write(`SMOKE FAIL: ${reason}\n`);
    app.exit(1);
  };

  // Renderer console output, captured so a Content-Security-Policy violation is
  // visible here instead of only in DevTools nobody has open.
  const consoleErrors: string[] = [];
  window.webContents.on("console-message", (event) => {
    if (event.level === "error" || event.level === "warning") {
      consoleErrors.push(event.message.slice(0, 300));
    }
  });

  const timeout = setTimeout(() => fail("renderer did not finish loading within 30s"), 30_000);

  window.webContents.on("did-fail-load", (_e, code, description, url) => {
    clearTimeout(timeout);
    fail(`did-fail-load ${code} ${description} for ${url}`);
  });

  window.webContents.on("did-finish-load", () => {
    void window.webContents
      .executeJavaScript(
        `(() => {
           const body = document.body;
           return {
             url: location.href,
             title: document.title,
             hasMain: !!document.querySelector("main"),
             hasCommand: !!document.querySelector("pre code"),
             commandText: document.querySelector("pre code")?.textContent?.slice(0, 200) ?? "",
             bridge: typeof window.cmdGenerator === "object",
             nodeLeaked: typeof window.require !== "undefined" || typeof window.process !== "undefined",
             textLength: body ? body.innerText.length : 0,
           };
         })()`,
      )
      .then((result: Record<string, unknown>) => {
        clearTimeout(timeout);

        // Main-process facts too: these are what make it read as an application
        // rather than a browser window, and they are easy to regress silently.
        const menu = Menu.getApplicationMenu();
        const shell = {
          appName: app.getName(),
          windowTitle: window.getTitle(),
          iconResolved: appIcon() ?? null,
          menuBarVisible: window.isMenuBarVisible(),
          menus: menu ? menu.items.map((i) => i.label).filter(Boolean) : [],
          devToolsOpen: window.webContents.isDevToolsOpened(),
        };

        process.stdout.write(`SMOKE RESULT: ${JSON.stringify(result, null, 2)}\n`);
        process.stdout.write(`SMOKE SHELL: ${JSON.stringify(shell, null, 2)}\n`);

        if (!result.hasMain) return fail("no <main> element — React did not mount");
        if (!result.bridge) return fail("window.cmdGenerator missing — preload did not run");
        if (result.nodeLeaked) return fail("node globals leaked into the renderer");
        if (!result.hasCommand) return fail("no command preview rendered");
        if (!shell.iconResolved) return fail("no application icon found — Windows would show the Electron logo");
        if (shell.devToolsOpen) return fail("DevTools opened by default — this is not a browser");
        if (shell.appName !== "Command Builder") {
          return fail(`app name is "${shell.appName}", expected the product name`);
        }

        // Everything above is satisfiable by prerendered HTML alone, which is how a
        // build with blocked hydration scripts passed this test while the installed
        // app was completely dead to clicks. So actually click something and require
        // the output to change — that is the only proof React is wired up.
        return checkInteractive(window)
          .then((probe) => {
            process.stdout.write(`SMOKE INTERACTIVE: ${JSON.stringify(probe, null, 2)}\n`);
            if (consoleErrors.length > 0) {
              process.stdout.write(`SMOKE CONSOLE: ${JSON.stringify(consoleErrors, null, 2)}\n`);
            }

            if (probe.error) return fail(`interactivity probe failed: ${probe.error}`);
            if (probe.before === probe.after) {
              const csp = consoleErrors.some((m) => /Content Security Policy/i.test(m));
              return fail(
                "clicking a flag changed nothing — React did not hydrate" +
                  (csp ? " (CSP blocked the inline hydration scripts)" : ""),
              );
            }

            return checkRun(window)
              .then((runProbe) => {
                process.stdout.write(`SMOKE RUN: ${JSON.stringify(runProbe, null, 2)}\n`);

                if (!runProbe.canRunCommands) return fail(`canRunCommands is false on a ${process.platform} build`);
                if (runProbe.error) return fail(`run probe failed: ${runProbe.error}`);
                if (!runProbe.echoedOutput) return fail("a real shell session did not echo back the written command");

                process.stdout.write("SMOKE PASS\n");
                app.exit(0);
              })
              .catch((error: unknown) => fail(`run probe threw: ${String(error)}`));
          })
          .catch((error: unknown) => fail(`interactivity probe threw: ${String(error)}`));
      })
      .catch((error: unknown) => {
        clearTimeout(timeout);
        fail(`executeJavaScript threw: ${String(error)}`);
      });
  });
}
