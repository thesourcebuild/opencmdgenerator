import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { THEME_STORAGE_KEY } from "./theme-constants";

export const metadata: Metadata = {
  title: "OpenCmdGenerator",
  description:
    "Build, validate and export CLI commands — rsync, cd, and more. Generates commands for you to run — it never executes anything itself.",
};

/**
 * Runs before hydration so the page never flashes the wrong theme — sets the same `.dark` class `useTheme` manages, from the same storage key, before any CSS paints.
 */
const THEME_INIT_SCRIPT = `(function(){try{var v=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});var d=v==="dark"||(v!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
