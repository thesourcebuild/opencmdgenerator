import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/out/**",
      "**/.next/**",
      "**/renderer/**",
      "**/release/**",
      "**/*.d.ts",
    ],
  },
  ...tseslint.configs.recommended,
  {
    // .cjs config files (electron-builder) are CommonJS by definition and must
    // use require() — there is no import syntax. The recommended set bans it.
    files: ["**/*.cjs"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": "warn",
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "electron",
              message:
                "Renderer and shared packages must never import electron. Use @cmdgen/platform.",
            },
            {
              name: "child_process",
              message:
                "This app generates shell commands; it does not execute them. No process spawning.",
            },
            {
              name: "node:child_process",
              message:
                "This app generates shell commands; it does not execute them. No process spawning.",
            },
            {
              name: "node-pty",
              message:
                "Process spawning belongs only in apps/desktop/src/main/run.ts (the one deliberate, confirmation-gated exception to this app's never-execute rule — see that file's header). If you're not editing that file, you don't need this.",
            },
          ],
        },
      ],
    },
  },
  {
    // The Electron main and preload processes are the one place electron may be imported.
    files: ["apps/desktop/src/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "child_process",
              message: "No process spawning anywhere in this project.",
            },
            {
              name: "node:child_process",
              message: "No process spawning anywhere in this project.",
            },
            {
              name: "node-pty",
              message:
                "No process spawning anywhere in this project — except apps/desktop/src/main/run.ts, the one deliberate exception (see that file's header comment).",
            },
          ],
        },
      ],
    },
  },
  {
    // The ONE deliberate exception to "no process spawning anywhere in this project" —
    // see run.ts's own header comment for the full rationale. child_process/node:child_process
    // stay banned even here: this file spawns exclusively through node-pty.
    files: ["apps/desktop/src/main/run.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "child_process",
              message: "Use node-pty, not a raw child_process spawn, even here.",
            },
            {
              name: "node:child_process",
              message: "Use node-pty, not a raw child_process spawn, even here.",
            },
          ],
        },
      ],
    },
  },
);
