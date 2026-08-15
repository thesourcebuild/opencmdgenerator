"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { PlatformEnvironment } from "@cmdgen/contracts";
import { toAppPlatform } from "@cmdgen/contracts";
import type { CdPlatform } from "@cmdgen/cd";
import type { PathFlavor } from "@cmdgen/rsync";
import type { TarVariant } from "@cmdgen/tar";
import type { MkdirPlatform } from "@cmdgen/mkdir";
import type { LnPlatform } from "@cmdgen/ln";
import type { MvPlatform } from "@cmdgen/mv";
import type { CpPlatform } from "@cmdgen/cp";
import type { CatPlatform } from "@cmdgen/cat";
import type { EchoPlatform } from "@cmdgen/echo";
import type { GrepPlatform } from "@cmdgen/grep";
import type { IfconfigPlatform } from "@cmdgen/ifconfig";
import type { TraceroutePlatform } from "@cmdgen/traceroute";
import type { CalPlatform } from "@cmdgen/cal";
import type { ExportPlatform } from "@cmdgen/export";
import type { AliasPlatform } from "@cmdgen/alias";
import type { ClearPlatform } from "@cmdgen/clear";
import type { WhoamiPlatform } from "@cmdgen/whoami";
import { MANIFESTS } from "@cmdgen/registry";
import { platform } from "@cmdgen/platform";
import { CommandHeader } from "./command-header";
import { ScrollToTop } from "./scroll-to-top";
import { SettingsOverlay } from "./settings-overlay";
import { Sidebar } from "./sidebar";

/**
 * Each builder is its own bespoke UI (rsync has endpoint pickers and a
 * trailing-slash visualizer; cd has a platform picker) — not a single
 * generic renderer — so they are lazy-loaded per selection via `next/dynamic`
 * rather than bundled together. That is what actually keeps picking one
 * command from pulling in the other's code, `@cmdgen/registry`'s `MANIFESTS`
 * only supplies the cheap sidebar listing.
 */
const RsyncBuilder = dynamic(() => import("./rsync-builder").then((m) => m.RsyncBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const CdBuilder = dynamic(() => import("./cd-builder").then((m) => m.CdBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const SshBuilder = dynamic(() => import("./ssh-builder").then((m) => m.SshBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const LsBuilder = dynamic(() => import("./ls-builder").then((m) => m.LsBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const RmBuilder = dynamic(() => import("./rm-builder").then((m) => m.RmBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const KillBuilder = dynamic(() => import("./kill-builder").then((m) => m.KillBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const TarBuilder = dynamic(() => import("./tar-builder").then((m) => m.TarBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const ScpBuilder = dynamic(() => import("./scp-builder").then((m) => m.ScpBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const ChmodBuilder = dynamic(() => import("./chmod-builder").then((m) => m.ChmodBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const PwdBuilder = dynamic(() => import("./pwd-builder").then((m) => m.PwdBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const MkdirBuilder = dynamic(() => import("./mkdir-builder").then((m) => m.MkdirBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const TouchBuilder = dynamic(() => import("./touch-builder").then((m) => m.TouchBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const LnBuilder = dynamic(() => import("./ln-builder").then((m) => m.LnBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const MvBuilder = dynamic(() => import("./mv-builder").then((m) => m.MvBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const CpBuilder = dynamic(() => import("./cp-builder").then((m) => m.CpBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const ChownBuilder = dynamic(() => import("./chown-builder").then((m) => m.ChownBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const CatBuilder = dynamic(() => import("./cat-builder").then((m) => m.CatBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const EchoBuilder = dynamic(() => import("./echo-builder").then((m) => m.EchoBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const HeadBuilder = dynamic(() => import("./head-builder").then((m) => m.HeadBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const TailBuilder = dynamic(() => import("./tail-builder").then((m) => m.TailBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const LessBuilder = dynamic(() => import("./less-builder").then((m) => m.LessBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const GrepBuilder = dynamic(() => import("./grep-builder").then((m) => m.GrepBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const SortBuilder = dynamic(() => import("./sort-builder").then((m) => m.SortBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const DiffBuilder = dynamic(() => import("./diff-builder").then((m) => m.DiffBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const CmpBuilder = dynamic(() => import("./cmp-builder").then((m) => m.CmpBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const CommBuilder = dynamic(() => import("./comm-builder").then((m) => m.CommBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const ExportBuilder = dynamic(() => import("./export-builder").then((m) => m.ExportBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const AliasBuilder = dynamic(() => import("./alias-builder").then((m) => m.AliasBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const ClearBuilder = dynamic(() => import("./clear-builder").then((m) => m.ClearBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const WhoamiBuilder = dynamic(() => import("./whoami-builder").then((m) => m.WhoamiBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const UnameBuilder = dynamic(() => import("./uname-builder").then((m) => m.UnameBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const PsBuilder = dynamic(() => import("./ps-builder").then((m) => m.PsBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const TopBuilder = dynamic(() => import("./top-builder").then((m) => m.TopBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const KillallBuilder = dynamic(() => import("./killall-builder").then((m) => m.KillallBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const DfBuilder = dynamic(() => import("./df-builder").then((m) => m.DfBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const MountBuilder = dynamic(() => import("./mount-builder").then((m) => m.MountBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const ManBuilder = dynamic(() => import("./man-builder").then((m) => m.ManBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const WhatisBuilder = dynamic(() => import("./whatis-builder").then((m) => m.WhatisBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const WhereisBuilder = dynamic(() => import("./whereis-builder").then((m) => m.WhereisBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const CalBuilder = dynamic(() => import("./cal-builder").then((m) => m.CalBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const DdBuilder = dynamic(() => import("./dd-builder").then((m) => m.DdBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const ZipBuilder = dynamic(() => import("./zip-builder").then((m) => m.ZipBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const UnzipBuilder = dynamic(() => import("./unzip-builder").then((m) => m.UnzipBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const WgetBuilder = dynamic(() => import("./wget-builder").then((m) => m.WgetBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const IfconfigBuilder = dynamic(() => import("./ifconfig-builder").then((m) => m.IfconfigBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const TracerouteBuilder = dynamic(() => import("./traceroute-builder").then((m) => m.TracerouteBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const AptBuilder = dynamic(() => import("./apt-builder").then((m) => m.AptBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const PacmanBuilder = dynamic(() => import("./pacman-builder").then((m) => m.PacmanBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const YumBuilder = dynamic(() => import("./yum-builder").then((m) => m.YumBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const RpmBuilder = dynamic(() => import("./rpm-builder").then((m) => m.RpmBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const SudoBuilder = dynamic(() => import("./sudo-builder").then((m) => m.SudoBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const PasswdBuilder = dynamic(() => import("./passwd-builder").then((m) => m.PasswdBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const UseraddBuilder = dynamic(() => import("./useradd-builder").then((m) => m.UseraddBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const ServiceBuilder = dynamic(() => import("./service-builder").then((m) => m.ServiceBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const UfwBuilder = dynamic(() => import("./ufw-builder").then((m) => m.UfwBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const IptablesBuilder = dynamic(() => import("./iptables-builder").then((m) => m.IptablesBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const CurlBuilder = dynamic(() => import("./curl-builder").then((m) => m.CurlBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const GitBuilder = dynamic(() => import("./git-builder").then((m) => m.GitBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const AdduserBuilder = dynamic(() => import("./adduser-builder").then((m) => m.AdduserBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const GroupaddBuilder = dynamic(() => import("./groupadd-builder").then((m) => m.GroupaddBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const GroupmodBuilder = dynamic(() => import("./groupmod-builder").then((m) => m.GroupmodBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const UsermodBuilder = dynamic(() => import("./usermod-builder").then((m) => m.UsermodBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const SuBuilder = dynamic(() => import("./su-builder").then((m) => m.SuBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const PkillBuilder = dynamic(() => import("./pkill-builder").then((m) => m.PkillBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const WhichBuilder = dynamic(() => import("./which-builder").then((m) => m.WhichBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const WhereBuilder = dynamic(() => import("./where-builder").then((m) => m.WhereBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const SystemctlBuilder = dynamic(() => import("./systemctl-builder").then((m) => m.SystemctlBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const JournalctlBuilder = dynamic(() => import("./journalctl-builder").then((m) => m.JournalctlBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const CrontabBuilder = dynamic(() => import("./crontab-builder").then((m) => m.CrontabBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const AtBuilder = dynamic(() => import("./at-builder").then((m) => m.AtBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const HaltBuilder = dynamic(() => import("./halt-builder").then((m) => m.HaltBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const PoweroffBuilder = dynamic(() => import("./poweroff-builder").then((m) => m.PoweroffBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const RebootBuilder = dynamic(() => import("./reboot-builder").then((m) => m.RebootBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const ShutdownBuilder = dynamic(() => import("./shutdown-builder").then((m) => m.ShutdownBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const DigBuilder = dynamic(() => import("./dig-builder").then((m) => m.DigBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const NslookupBuilder = dynamic(() => import("./nslookup-builder").then((m) => m.NslookupBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const WhoisBuilder = dynamic(() => import("./whois-builder").then((m) => m.WhoisBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const RouteBuilder = dynamic(() => import("./route-builder").then((m) => m.RouteBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const PingBuilder = dynamic(() => import("./ping-builder").then((m) => m.PingBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const NetstatBuilder = dynamic(() => import("./netstat-builder").then((m) => m.NetstatBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const FirewallCmdBuilder = dynamic(() => import("./firewall-cmd-builder").then((m) => m.FirewallCmdBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const BlkidBuilder = dynamic(() => import("./blkid-builder").then((m) => m.BlkidBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const LsblkBuilder = dynamic(() => import("./lsblk-builder").then((m) => m.LsblkBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const DuBuilder = dynamic(() => import("./du-builder").then((m) => m.DuBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const FdiskBuilder = dynamic(() => import("./fdisk-builder").then((m) => m.FdiskBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const MkfsBuilder = dynamic(() => import("./mkfs-builder").then((m) => m.MkfsBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const UmountBuilder = dynamic(() => import("./umount-builder").then((m) => m.UmountBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const UpdatedbBuilder = dynamic(() => import("./updatedb-builder").then((m) => m.UpdatedbBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const LocateBuilder = dynamic(() => import("./locate-builder").then((m) => m.LocateBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const ChgrpBuilder = dynamic(() => import("./chgrp-builder").then((m) => m.ChgrpBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const RmdirBuilder = dynamic(() => import("./rmdir-builder").then((m) => m.RmdirBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const PatchBuilder = dynamic(() => import("./patch-builder").then((m) => m.PatchBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const FindBuilder = dynamic(() => import("./find-builder").then((m) => m.FindBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const AwkBuilder = dynamic(() => import("./awk-builder").then((m) => m.AwkBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const SedBuilder = dynamic(() => import("./sed-builder").then((m) => m.SedBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const CutBuilder = dynamic(() => import("./cut-builder").then((m) => m.CutBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const UniqBuilder = dynamic(() => import("./uniq-builder").then((m) => m.UniqBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const WcBuilder = dynamic(() => import("./wc-builder").then((m) => m.WcBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const TeeBuilder = dynamic(() => import("./tee-builder").then((m) => m.TeeBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const GzipBuilder = dynamic(() => import("./gzip-builder").then((m) => m.GzipBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const GunzipBuilder = dynamic(() => import("./gunzip-builder").then((m) => m.GunzipBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const UptimeBuilder = dynamic(() => import("./uptime-builder").then((m) => m.UptimeBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const VmstatBuilder = dynamic(() => import("./vmstat-builder").then((m) => m.VmstatBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const FreeBuilder = dynamic(() => import("./free-builder").then((m) => m.FreeBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const SemanageBuilder = dynamic(() => import("./semanage-builder").then((m) => m.SemanageBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const GetenforceBuilder = dynamic(() => import("./getenforce-builder").then((m) => m.GetenforceBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const SetenforceBuilder = dynamic(() => import("./setenforce-builder").then((m) => m.SetenforceBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const RsyslogdBuilder = dynamic(() => import("./rsyslogd-builder").then((m) => m.RsyslogdBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const HistoryBuilder = dynamic(() => import("./history-builder").then((m) => m.HistoryBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const InfoBuilder = dynamic(() => import("./info-builder").then((m) => m.InfoBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const EmacsBuilder = dynamic(() => import("./emacs-builder").then((m) => m.EmacsBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const NanoBuilder = dynamic(() => import("./nano-builder").then((m) => m.NanoBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const ViBuilder = dynamic(() => import("./vi-builder").then((m) => m.ViBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const MoreBuilder = dynamic(() => import("./more-builder").then((m) => m.MoreBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const SourceBuilder = dynamic(() => import("./source-builder").then((m) => m.SourceBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const SshKeygenBuilder = dynamic(() => import("./ssh-keygen-builder").then((m) => m.SshKeygenBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const AptGetBuilder = dynamic(() => import("./apt-get-builder").then((m) => m.AptGetBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const FfmpegBuilder = dynamic(() => import("./ffmpeg-builder").then((m) => m.FfmpegBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});
const OpensslBuilder = dynamic(() => import("./openssl-builder").then((m) => m.OpensslBuilder), {
  ssr: false,
  loading: () => <BuilderSkeleton />,
});

export function AppShell() {
  const [selectedId, setSelectedId] = useState(MANIFESTS[0]!.id);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [env, setEnv] = useState<PlatformEnvironment | undefined>(undefined);

  // The "which build am I targeting" choice lives here, not inside each
  // builder — the left sidebar needs to show and control it too.
  const [pathFlavor, setPathFlavor] = useState<PathFlavor>("unix");
  const [cdPlatform, setCdPlatform] = useState<CdPlatform>("linux");
  const [tarVariant, setTarVariant] = useState<TarVariant>("gnu");
  const [mkdirPlatform, setMkdirPlatform] = useState<MkdirPlatform>("linux");
  const [ifconfigPlatform, setIfconfigPlatform] = useState<IfconfigPlatform>("linux");
  const [traceroutePlatform, setTraceroutePlatform] = useState<TraceroutePlatform>("linux");
  const [calPlatform, setCalPlatform] = useState<CalPlatform>("linux");
  const [lnPlatform, setLnPlatform] = useState<LnPlatform>("linux");
  const [mvPlatform, setMvPlatform] = useState<MvPlatform>("linux");
  const [cpPlatform, setCpPlatform] = useState<CpPlatform>("linux");
  const [catPlatform, setCatPlatform] = useState<CatPlatform>("linux");
  const [echoPlatform, setEchoPlatform] = useState<EchoPlatform>("linux");
  const [grepPlatform, setGrepPlatform] = useState<GrepPlatform>("linux");
  const [exportPlatform, setExportPlatform] = useState<ExportPlatform>("linux");
  const [aliasPlatform, setAliasPlatform] = useState<AliasPlatform>("linux");
  const [clearPlatform, setClearPlatform] = useState<ClearPlatform>("linux");
  const [whoamiPlatform, setWhoamiPlatform] = useState<WhoamiPlatform>("posix");

  const isWindowsHost = env !== undefined && toAppPlatform(env) === "windows";

  useEffect(() => {
    void platform()
      .environment()
      .then((resolved) => setEnv(resolved));
  }, []);

  // Runs once, exactly when `env` first resolves as a Windows host — these
  // dropdowns start at Linux otherwise (unchanged from before), but a
  // Windows desktop host should open onto its own native shell, not someone
  // else's OS. Only the *lifted, controlled* platform states live here;
  // ls/rm/kill/pwd/head/tail/sort/diff/curl (and rsync/ssh/tar/scp's
  // `initialShell`) take the same Windows-aware default inline at their JSX
  // call sites below instead, since each is a one-time initializer prop, not
  // state owned here. `cal`'s own platform axis has no Windows value at all
  // (linux/mac only — its Windows story lives in a separately fixed `shell`
  // field), so it's excluded from all of this.
  const appliedWindowsDefaults = useRef(false);
  useEffect(() => {
    if (!isWindowsHost || appliedWindowsDefaults.current) return;
    appliedWindowsDefaults.current = true;
    setCdPlatform("windows-powershell");
    setMkdirPlatform("windows-powershell");
    setIfconfigPlatform("windows-powershell");
    setTraceroutePlatform("windows-powershell");
    setLnPlatform("windows-powershell");
    setMvPlatform("windows-powershell");
    setCpPlatform("windows-powershell");
    setCatPlatform("windows-powershell");
    setEchoPlatform("windows-powershell");
    setGrepPlatform("windows-powershell");
    setExportPlatform("windows-powershell");
    setAliasPlatform("windows-powershell");
    setClearPlatform("windows-powershell");
    setWhoamiPlatform("windows-powershell");
  }, [isWindowsHost]);

  const pickDirectory = useMemo(
    () => (title: string) => platform().pickDirectory({ title }),
    [],
  );

  const canPick = env?.canPickDirectories ?? false;
  const manifest = MANIFESTS.find((m) => m.id === selectedId);
  const mainRef = useRef<HTMLElement>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="flex h-screen min-h-0 flex-col overflow-hidden bg-slate-50 dark:bg-slate-950">
      <header className="flex shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-sm font-semibold">Command Builder</h1>
        <div className="ml-auto text-xs text-slate-400">{MANIFESTS.length} commands</div>
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          aria-label="Settings"
          title="Settings"
          className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <GearIcon />
        </button>
      </header>

      <SettingsOverlay open={settingsOpen} onClose={() => setSettingsOpen(false)} />

      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`shrink-0 overflow-hidden border-r border-slate-200 bg-white transition-[width] duration-150 dark:border-slate-800 dark:bg-slate-900 ${
            sidebarOpen ? "w-64" : "w-11"
          }`}
        >
          {sidebarOpen ? (
            <Sidebar
              manifests={MANIFESTS}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onCollapse={() => setSidebarOpen(false)}
            />
          ) : (
            <div className="flex h-full flex-col items-center pt-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                aria-label="Expand sidebar"
                title="Expand sidebar"
                className="rounded-md border border-slate-200 p-1.5 text-slate-500 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <MenuIcon />
              </button>
            </div>
          )}
        </aside>

        <main ref={mainRef} className="flex-1 overflow-y-auto p-6">
          <CommandHeader manifest={manifest} />

          {selectedId === "rsync" && (
            <RsyncBuilder
              canPick={canPick}
              onPickDirectory={pickDirectory}
              initialShell={isWindowsHost ? "powershell" : "posix"}
              pathFlavor={pathFlavor}
              onPathFlavorChange={setPathFlavor}
            />
          )}
          {selectedId === "cd" && (
            <CdBuilder
              canPick={canPick}
              onPickDirectory={pickDirectory}
              platform={cdPlatform}
              onPlatformChange={setCdPlatform}
            />
          )}
          {selectedId === "ssh" && <SshBuilder initialShell={isWindowsHost ? "powershell" : "posix"} />}
          {selectedId === "ls" && <LsBuilder initialPlatform={isWindowsHost ? "windows-powershell" : "linux"} />}
          {selectedId === "rm" && <RmBuilder initialPlatform={isWindowsHost ? "windows-powershell" : "linux"} />}
          {selectedId === "kill" && <KillBuilder initialPlatform={isWindowsHost ? "windows-powershell" : "linux"} />}
          {selectedId === "tar" && (
            <TarBuilder
              variant={tarVariant}
              onVariantChange={setTarVariant}
              initialShell={isWindowsHost ? "powershell" : "posix"}
            />
          )}
          {selectedId === "scp" && (
            <ScpBuilder
              canPick={canPick}
              onPickDirectory={pickDirectory}
              initialShell={isWindowsHost ? "powershell" : "posix"}
              pathFlavor={pathFlavor}
              onPathFlavorChange={setPathFlavor}
            />
          )}
          {selectedId === "chmod" && <ChmodBuilder />}
          {selectedId === "pwd" && <PwdBuilder initialPlatform={isWindowsHost ? "windows-powershell" : "linux"} />}
          {selectedId === "mkdir" && <MkdirBuilder platform={mkdirPlatform} onPlatformChange={setMkdirPlatform} />}
          {selectedId === "touch" && <TouchBuilder />}
          {selectedId === "ln" && <LnBuilder platform={lnPlatform} onPlatformChange={setLnPlatform} />}
          {selectedId === "mv" && <MvBuilder platform={mvPlatform} onPlatformChange={setMvPlatform} />}
          {selectedId === "cp" && <CpBuilder platform={cpPlatform} onPlatformChange={setCpPlatform} />}
          {selectedId === "chown" && <ChownBuilder />}
          {selectedId === "cat" && <CatBuilder platform={catPlatform} onPlatformChange={setCatPlatform} />}
          {selectedId === "echo" && <EchoBuilder platform={echoPlatform} onPlatformChange={setEchoPlatform} />}
          {selectedId === "head" && <HeadBuilder initialPlatform={isWindowsHost ? "windows-powershell" : "linux"} />}
          {selectedId === "tail" && <TailBuilder initialPlatform={isWindowsHost ? "windows-powershell" : "linux"} />}
          {selectedId === "less" && <LessBuilder />}
          {selectedId === "grep" && <GrepBuilder platform={grepPlatform} onPlatformChange={setGrepPlatform} />}
          {selectedId === "sort" && <SortBuilder initialPlatform={isWindowsHost ? "windows-cmd" : "linux"} />}
          {selectedId === "diff" && <DiffBuilder initialPlatform={isWindowsHost ? "windows-cmd" : "linux"} />}
          {selectedId === "cmp" && <CmpBuilder />}
          {selectedId === "comm" && <CommBuilder />}
          {selectedId === "export" && <ExportBuilder platform={exportPlatform} onPlatformChange={setExportPlatform} />}
          {selectedId === "alias" && <AliasBuilder platform={aliasPlatform} onPlatformChange={setAliasPlatform} />}
          {selectedId === "clear" && <ClearBuilder platform={clearPlatform} onPlatformChange={setClearPlatform} />}
          {selectedId === "whoami" && <WhoamiBuilder platform={whoamiPlatform} onPlatformChange={setWhoamiPlatform} />}
          {selectedId === "uname" && <UnameBuilder />}
          {selectedId === "ps" && <PsBuilder />}
          {selectedId === "top" && <TopBuilder />}
          {selectedId === "killall" && <KillallBuilder />}
          {selectedId === "df" && <DfBuilder />}
          {selectedId === "mount" && <MountBuilder />}
          {selectedId === "man" && <ManBuilder />}
          {selectedId === "whatis" && <WhatisBuilder />}
          {selectedId === "whereis" && <WhereisBuilder />}
          {selectedId === "cal" && <CalBuilder platform={calPlatform} onPlatformChange={setCalPlatform} />}
          {selectedId === "dd" && <DdBuilder />}
          {selectedId === "zip" && <ZipBuilder />}
          {selectedId === "unzip" && <UnzipBuilder />}
          {selectedId === "wget" && <WgetBuilder />}
          {selectedId === "ifconfig" && <IfconfigBuilder platform={ifconfigPlatform} onPlatformChange={setIfconfigPlatform} />}
          {selectedId === "traceroute" && <TracerouteBuilder platform={traceroutePlatform} onPlatformChange={setTraceroutePlatform} />}
          {selectedId === "apt" && <AptBuilder />}
          {selectedId === "pacman" && <PacmanBuilder />}
          {selectedId === "yum" && <YumBuilder />}
          {selectedId === "rpm" && <RpmBuilder />}
          {selectedId === "sudo" && <SudoBuilder />}
          {selectedId === "passwd" && <PasswdBuilder />}
          {selectedId === "useradd" && <UseraddBuilder />}
          {selectedId === "service" && <ServiceBuilder />}
          {selectedId === "ufw" && <UfwBuilder />}
          {selectedId === "iptables" && <IptablesBuilder />}
          {selectedId === "curl" && <CurlBuilder initialShell={isWindowsHost ? "powershell" : "posix"} />}
          {selectedId === "git" && <GitBuilder initialShell={isWindowsHost ? "powershell" : "posix"} />}
          {selectedId === "adduser" && <AdduserBuilder />}
          {selectedId === "groupadd" && <GroupaddBuilder />}
          {selectedId === "groupmod" && <GroupmodBuilder />}
          {selectedId === "usermod" && <UsermodBuilder />}
          {selectedId === "su" && <SuBuilder />}
          {selectedId === "pkill" && <PkillBuilder />}
          {selectedId === "which" && <WhichBuilder />}
          {selectedId === "where" && <WhereBuilder />}
          {selectedId === "systemctl" && <SystemctlBuilder />}
          {selectedId === "journalctl" && <JournalctlBuilder />}
          {selectedId === "crontab" && <CrontabBuilder />}
          {selectedId === "at" && <AtBuilder />}
          {selectedId === "halt" && <HaltBuilder />}
          {selectedId === "poweroff" && <PoweroffBuilder />}
          {selectedId === "reboot" && <RebootBuilder />}
          {selectedId === "shutdown" && <ShutdownBuilder />}
          {selectedId === "dig" && <DigBuilder />}
          {selectedId === "nslookup" && <NslookupBuilder />}
          {selectedId === "whois" && <WhoisBuilder />}
          {selectedId === "route" && <RouteBuilder />}
          {selectedId === "ping" && <PingBuilder />}
          {selectedId === "netstat" && <NetstatBuilder />}
          {selectedId === "firewall-cmd" && <FirewallCmdBuilder />}
          {selectedId === "blkid" && <BlkidBuilder />}
          {selectedId === "lsblk" && <LsblkBuilder />}
          {selectedId === "du" && <DuBuilder />}
          {selectedId === "fdisk" && <FdiskBuilder />}
          {selectedId === "mkfs" && <MkfsBuilder />}
          {selectedId === "umount" && <UmountBuilder />}
          {selectedId === "updatedb" && <UpdatedbBuilder />}
          {selectedId === "locate" && <LocateBuilder />}
          {selectedId === "chgrp" && <ChgrpBuilder />}
          {selectedId === "rmdir" && <RmdirBuilder />}
          {selectedId === "patch" && <PatchBuilder />}
          {selectedId === "find" && <FindBuilder />}
          {selectedId === "awk" && <AwkBuilder />}
          {selectedId === "sed" && <SedBuilder />}
          {selectedId === "cut" && <CutBuilder />}
          {selectedId === "uniq" && <UniqBuilder />}
          {selectedId === "wc" && <WcBuilder />}
          {selectedId === "tee" && <TeeBuilder />}
          {selectedId === "gzip" && <GzipBuilder />}
          {selectedId === "gunzip" && <GunzipBuilder />}
          {selectedId === "uptime" && <UptimeBuilder />}
          {selectedId === "vmstat" && <VmstatBuilder />}
          {selectedId === "free" && <FreeBuilder />}
          {selectedId === "semanage" && <SemanageBuilder />}
          {selectedId === "getenforce" && <GetenforceBuilder />}
          {selectedId === "setenforce" && <SetenforceBuilder />}
          {selectedId === "rsyslogd" && <RsyslogdBuilder />}
          {selectedId === "history" && <HistoryBuilder />}
          {selectedId === "info" && <InfoBuilder />}
          {selectedId === "emacs" && <EmacsBuilder />}
          {selectedId === "nano" && <NanoBuilder />}
          {selectedId === "vi" && <ViBuilder />}
          {selectedId === "more" && <MoreBuilder />}
          {selectedId === "source" && <SourceBuilder />}
          {selectedId === "ssh-keygen" && <SshKeygenBuilder />}
          {selectedId === "apt-get" && <AptGetBuilder />}
          {selectedId === "ffmpeg" && <FfmpegBuilder initialShell={isWindowsHost ? "powershell" : "posix"} />}
          {selectedId === "openssl" && <OpensslBuilder initialShell={isWindowsHost ? "powershell" : "posix"} />}
        </main>
      </div>

      <ScrollToTop containerRef={mainRef} />
    </div>
  );
}

function BuilderSkeleton() {
  return (
    <div className="grid animate-pulse gap-4 lg:grid-cols-2">
      {[0, 1].map((col) => (
        <div key={col} className="space-y-4">
          {[0, 1].map((row) => (
            <div key={row} className="h-32 rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />
          ))}
        </div>
      ))}
    </div>
  );
}

function GearIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
