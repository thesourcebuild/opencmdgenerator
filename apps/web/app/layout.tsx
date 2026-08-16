import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { siteUrl } from "./seo";
import { THEME_STORAGE_KEY } from "./theme-constants";

const SITE_NAME = "OpenCmdGenerator";
const DESCRIPTION =
  "Build, validate and export CLI commands — rsync, cd, git, curl and more. Compose commands visually with platform-aware rendering for POSIX, PowerShell, and Command Prompt. Open source, never executes anything itself.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${SITE_NAME} — Command Line Generator`,
    template: `%s — ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "command generator",
    "command line",
    "CLI",
    "shell",
    "bash",
    "zsh",
    "PowerShell",
    "Command Prompt",
    "cmd",
    "Linux",
    "macOS",
    "Windows",
    "rsync",
    "git",
    "curl",
    "ssh",
    "terminal commands",
  ],
  authors: [{ name: "Muhammad Hassaan Shah", url: "https://github.com/thesourcebuild" }],
  creator: "Muhammad Hassaan Shah",
  alternates: { canonical: siteUrl() },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: siteUrl(),
    title: `${SITE_NAME} — Command Line Generator`,
    description: DESCRIPTION,
    locale: "en_US",
    images: [
      {
        url: siteUrl("og.png"),
        width: 1200,
        height: 630,
        alt: "OpenCmdGenerator — a visual command-line generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Command Line Generator`,
    description: DESCRIPTION,
    images: [siteUrl("og.png")],
  },
};

/**
 * Runs before hydration so the page never flashes the wrong theme — sets the same `.dark` class `useTheme` manages, from the same storage key, before any CSS paints.
 */
const THEME_INIT_SCRIPT = `(function(){try{var v=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});var d=v==="dark"||(v!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;

const APP_JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  url: siteUrl(),
  description: DESCRIPTION,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Windows, macOS, Linux",
  inLanguage: "en",
  license: "https://github.com/thesourcebuild/OpenCmdGenerator/blob/master/LICENSE",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: {
    "@type": "Person",
    name: "Muhammad Hassaan Shah",
    url: "https://github.com/thesourcebuild",
  },
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    url: siteUrl(),
    sameAs: ["https://github.com/thesourcebuild/OpenCmdGenerator"],
  },
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: APP_JSON_LD }} />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
