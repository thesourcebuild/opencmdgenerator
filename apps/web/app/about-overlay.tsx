"use client";

import { useEffect } from "react";

const GITHUB_PROFILE_URL = "https://github.com/thesourcebuild";
const PROJECT_URL = "https://github.com/thesourcebuild/OpenCmdGenerator";
const LICENSE_URL = "https://github.com/thesourcebuild/OpenCmdGenerator/blob/master/LICENSE";

export interface AboutOverlayProps {
  open: boolean;
  version: string;
  onClose: () => void;
}

export function AboutOverlay({ open, version, onClose }: AboutOverlayProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="About OpenCmdGenerator"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <h1 className="text-sm font-semibold">About OpenCmdGenerator</h1>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close about"
            title="Close"
            className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <CloseIcon />
          </button>
        </header>
        <div className="space-y-4 p-5 text-sm text-slate-600 dark:text-slate-300">
          <div>
            <p className="text-base font-semibold text-slate-900 dark:text-slate-100">OpenCmdGenerator v{version}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Build shell commands with confidence. Compose, validate, and explain commands across web and desktop.
            </p>
          </div>

          <section className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs dark:border-slate-800 dark:bg-slate-950/40">
            <h2 className="font-semibold text-slate-700 dark:text-slate-200">License</h2>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              Licensed under the GNU General Public License v3.0, identified as GPL-3.0-only.
              <a
                href={LICENSE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 font-medium text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-slate-900 dark:text-slate-300 dark:decoration-slate-600 dark:hover:text-white"
              >
                View full license
              </a>
              .
            </p>
          </section>

          <section className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs dark:border-slate-800 dark:bg-slate-950/40">
            <h2 className="font-semibold text-slate-700 dark:text-slate-200">Author</h2>
            <dl className="mt-1.5 grid gap-1 text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <dt className="w-14 shrink-0 text-slate-400 dark:text-slate-500">Name</dt>
                <dd className="font-medium text-slate-700 dark:text-slate-300">Muhammad Hassaan Shah</dd>
              </div>
              <div className="flex items-center gap-2">
                <dt className="w-14 shrink-0 text-slate-400 dark:text-slate-500">GitHub</dt>
                <dd>
                  <a
                    href={GITHUB_PROFILE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-slate-900 dark:text-slate-300 dark:decoration-slate-600 dark:hover:text-white"
                  >
                    @thesourcebuild
                  </a>
                </dd>
              </div>
              <div className="flex items-center gap-2">
                <dt className="w-14 shrink-0 text-slate-400 dark:text-slate-500">Project</dt>
                <dd>
                  <a
                    href={PROJECT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-slate-900 dark:text-slate-300 dark:decoration-slate-600 dark:hover:text-white"
                  >
                    github.com/thesourcebuild/OpenCmdGenerator
                  </a>
                </dd>
              </div>
            </dl>
          </section>

          <div className="text-center text-[11px] text-slate-400 dark:text-slate-500">
            © 2026 Muhammad Hassaan Shah. All rights reserved under the project license.
          </div>
        </div>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
