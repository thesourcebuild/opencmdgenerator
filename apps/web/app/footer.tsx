"use client";

type FooterProps = {
  version: string;
};

const GITHUB_URL = "https://github.com/thesourcebuild/OpenCmdGenerator";
const DOCS_URL = "https://github.com/thesourcebuild/OpenCmdGenerator/blob/master/README.md#further-reading";

export function Footer({ version }: FooterProps) {
  return (
    <footer className="mt-4 shrink-0 border-t border-slate-200 bg-white px-4 py-3 text-[11px] text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <p className="font-medium text-slate-600 dark:text-slate-300">
          OpenCmdGenerator v{version}
          <span className="mx-2 text-slate-300 dark:text-slate-700">|</span>
          © 2026 Muhammad Hassaan Shah
        </p>
        <nav className="flex items-center gap-3">
          <a
            href={DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-slate-700 dark:hover:text-slate-200"
          >
            Docs
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-slate-700 dark:hover:text-slate-200"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
