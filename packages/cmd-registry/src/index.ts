import type { CommandDefinition, CommandManifest } from "@cmdgen/engine";
import { RSYNC_MANIFEST } from "@cmdgen/rsync";
import { CD_MANIFEST } from "@cmdgen/cd";
import { SSH_MANIFEST } from "@cmdgen/ssh";
import { LS_MANIFEST } from "@cmdgen/ls";
import { RM_MANIFEST } from "@cmdgen/rm";
import { KILL_MANIFEST } from "@cmdgen/kill";
import { TAR_MANIFEST } from "@cmdgen/tar";
import { SCP_MANIFEST } from "@cmdgen/scp";
import { CHMOD_MANIFEST } from "@cmdgen/chmod";
import { PWD_MANIFEST } from "@cmdgen/pwd";
import { MKDIR_MANIFEST } from "@cmdgen/mkdir";
import { TOUCH_MANIFEST } from "@cmdgen/touch";
import { LN_MANIFEST } from "@cmdgen/ln";
import { MV_MANIFEST } from "@cmdgen/mv";
import { CP_MANIFEST } from "@cmdgen/cp";
import { CHOWN_MANIFEST } from "@cmdgen/chown";
import { CAT_MANIFEST } from "@cmdgen/cat";
import { ECHO_MANIFEST } from "@cmdgen/echo";
import { HEAD_MANIFEST } from "@cmdgen/head";
import { TAIL_MANIFEST } from "@cmdgen/tail";
import { LESS_MANIFEST } from "@cmdgen/less";
import { GREP_MANIFEST } from "@cmdgen/grep";
import { SORT_MANIFEST } from "@cmdgen/sort";
import { DIFF_MANIFEST } from "@cmdgen/diff";
import { CMP_MANIFEST } from "@cmdgen/cmp";
import { COMM_MANIFEST } from "@cmdgen/comm";
import { EXPORT_MANIFEST } from "@cmdgen/export";
import { ALIAS_MANIFEST } from "@cmdgen/alias";
import { CLEAR_MANIFEST } from "@cmdgen/clear";
import { WHOAMI_MANIFEST } from "@cmdgen/whoami";
import { UNAME_MANIFEST } from "@cmdgen/uname";
import { PS_MANIFEST } from "@cmdgen/ps";
import { TOP_MANIFEST } from "@cmdgen/top";
import { KILLALL_MANIFEST } from "@cmdgen/killall";
import { DF_MANIFEST } from "@cmdgen/df";
import { MOUNT_MANIFEST } from "@cmdgen/mount";
import { MAN_MANIFEST } from "@cmdgen/man";
import { WHATIS_MANIFEST } from "@cmdgen/whatis";
import { WHEREIS_MANIFEST } from "@cmdgen/whereis";
import { CAL_MANIFEST } from "@cmdgen/cal";
import { DD_MANIFEST } from "@cmdgen/dd";
import { ZIP_MANIFEST } from "@cmdgen/zip";
import { UNZIP_MANIFEST } from "@cmdgen/unzip";
import { WGET_MANIFEST } from "@cmdgen/wget";
import { IFCONFIG_MANIFEST } from "@cmdgen/ifconfig";
import { TRACEROUTE_MANIFEST } from "@cmdgen/traceroute";
import { APT_MANIFEST } from "@cmdgen/apt";
import { PACMAN_MANIFEST } from "@cmdgen/pacman";
import { YUM_MANIFEST } from "@cmdgen/yum";
import { RPM_MANIFEST } from "@cmdgen/rpm";
import { SUDO_MANIFEST } from "@cmdgen/sudo";
import { PASSWD_MANIFEST } from "@cmdgen/passwd";
import { USERADD_MANIFEST } from "@cmdgen/useradd";
import { SERVICE_MANIFEST } from "@cmdgen/service";
import { UFW_MANIFEST } from "@cmdgen/ufw";
import { IPTABLES_MANIFEST } from "@cmdgen/iptables";
import { CURL_MANIFEST } from "@cmdgen/curl";
import { GIT_MANIFEST } from "@cmdgen/git";
import { ADDUSER_MANIFEST } from "@cmdgen/adduser";
import { GROUPADD_MANIFEST } from "@cmdgen/groupadd";
import { GROUPMOD_MANIFEST } from "@cmdgen/groupmod";
import { USERMOD_MANIFEST } from "@cmdgen/usermod";
import { SU_MANIFEST } from "@cmdgen/su";
import { PKILL_MANIFEST } from "@cmdgen/pkill";
import { WHICH_MANIFEST } from "@cmdgen/which";
import { WHERE_MANIFEST } from "@cmdgen/where";
import { SYSTEMCTL_MANIFEST } from "@cmdgen/systemctl";
import { JOURNALCTL_MANIFEST } from "@cmdgen/journalctl";
import { CRONTAB_MANIFEST } from "@cmdgen/crontab";
import { AT_MANIFEST } from "@cmdgen/at";
import { HALT_MANIFEST } from "@cmdgen/halt";
import { POWEROFF_MANIFEST } from "@cmdgen/poweroff";
import { REBOOT_MANIFEST } from "@cmdgen/reboot";
import { SHUTDOWN_MANIFEST } from "@cmdgen/shutdown";
import { DIG_MANIFEST } from "@cmdgen/dig";
import { NSLOOKUP_MANIFEST } from "@cmdgen/nslookup";
import { WHOIS_MANIFEST } from "@cmdgen/whois";
import { ROUTE_MANIFEST } from "@cmdgen/route";
import { PING_MANIFEST } from "@cmdgen/ping";
import { NETSTAT_MANIFEST } from "@cmdgen/netstat";
import { FIREWALL_CMD_MANIFEST } from "@cmdgen/firewall-cmd";
import { BLKID_MANIFEST } from "@cmdgen/blkid";
import { LSBLK_MANIFEST } from "@cmdgen/lsblk";
import { DU_MANIFEST } from "@cmdgen/du";
import { FDISK_MANIFEST } from "@cmdgen/fdisk";
import { MKFS_MANIFEST } from "@cmdgen/mkfs";
import { UMOUNT_MANIFEST } from "@cmdgen/umount";
import { UPDATEDB_MANIFEST } from "@cmdgen/updatedb";
import { LOCATE_MANIFEST } from "@cmdgen/locate";
import { CHGRP_MANIFEST } from "@cmdgen/chgrp";
import { RMDIR_MANIFEST } from "@cmdgen/rmdir";
import { PATCH_MANIFEST } from "@cmdgen/patch";
import { FIND_MANIFEST } from "@cmdgen/find";
import { AWK_MANIFEST } from "@cmdgen/awk";
import { SED_MANIFEST } from "@cmdgen/sed";
import { CUT_MANIFEST } from "@cmdgen/cut";
import { UNIQ_MANIFEST } from "@cmdgen/uniq";
import { WC_MANIFEST } from "@cmdgen/wc";
import { TEE_MANIFEST } from "@cmdgen/tee";
import { GZIP_MANIFEST } from "@cmdgen/gzip";
import { GUNZIP_MANIFEST } from "@cmdgen/gunzip";
import { UPTIME_MANIFEST } from "@cmdgen/uptime";
import { VMSTAT_MANIFEST } from "@cmdgen/vmstat";
import { FREE_MANIFEST } from "@cmdgen/free";
import { SEMANAGE_MANIFEST } from "@cmdgen/semanage";
import { GETENFORCE_MANIFEST } from "@cmdgen/getenforce";
import { SETENFORCE_MANIFEST } from "@cmdgen/setenforce";
import { RSYSLOGD_MANIFEST } from "@cmdgen/rsyslogd";
import { HISTORY_MANIFEST } from "@cmdgen/history";
import { INFO_MANIFEST } from "@cmdgen/info";
import { EMACS_MANIFEST } from "@cmdgen/emacs";
import { NANO_MANIFEST } from "@cmdgen/nano";
import { VI_MANIFEST } from "@cmdgen/vi";
import { MORE_MANIFEST } from "@cmdgen/more";
import { SOURCE_MANIFEST } from "@cmdgen/source";
import { SSH_KEYGEN_MANIFEST } from "@cmdgen/ssh-keygen";
import { APT_GET_MANIFEST } from "@cmdgen/apt-get";
import { FFMPEG_MANIFEST } from "@cmdgen/ffmpeg";
import { OPENSSL_MANIFEST } from "@cmdgen/openssl";
import { FILE_MANIFEST } from "@cmdgen/file";
import { STAT_MANIFEST } from "@cmdgen/stat";
import { TREE_MANIFEST } from "@cmdgen/tree";
import { UMASK_MANIFEST } from "@cmdgen/umask";
import { TAC_MANIFEST } from "@cmdgen/tac";
import { EGREP_MANIFEST } from "@cmdgen/egrep";
import { PASTE_MANIFEST } from "@cmdgen/paste";
import { TR_MANIFEST } from "@cmdgen/tr";
import { XARGS_MANIFEST } from "@cmdgen/xargs";
import { HOSTNAME_MANIFEST } from "@cmdgen/hostname";
import { DATE_MANIFEST } from "@cmdgen/date";
import { LSCPU_MANIFEST } from "@cmdgen/lscpu";
import { LSPCI_MANIFEST } from "@cmdgen/lspci";
import { LSUSB_MANIFEST } from "@cmdgen/lsusb";
import { DMESG_MANIFEST } from "@cmdgen/dmesg";
import { HTOP_MANIFEST } from "@cmdgen/htop";
import { PGREP_MANIFEST } from "@cmdgen/pgrep";
import { BG_MANIFEST } from "@cmdgen/bg";
import { FG_MANIFEST } from "@cmdgen/fg";
import { JOBS_MANIFEST } from "@cmdgen/jobs";
import { NOHUP_MANIFEST } from "@cmdgen/nohup";
import { NICE_MANIFEST } from "@cmdgen/nice";
import { RENICE_MANIFEST } from "@cmdgen/renice";
import { IP_MANIFEST } from "@cmdgen/ip";
import { SS_MANIFEST } from "@cmdgen/ss";
import { FTP_MANIFEST } from "@cmdgen/ftp";
import { TELNET_MANIFEST } from "@cmdgen/telnet";
import { ID_MANIFEST } from "@cmdgen/id";
import { GROUPS_MANIFEST } from "@cmdgen/groups";
import { USERDEL_MANIFEST } from "@cmdgen/userdel";
import { BZIP2_MANIFEST } from "@cmdgen/bzip2";
import { BUNZIP2_MANIFEST } from "@cmdgen/bunzip2";
import { UNALIAS_MANIFEST } from "@cmdgen/unalias";
import { EXIT_MANIFEST } from "@cmdgen/exit";

/**
 * Cheap, eagerly-bundled metadata for every installed command — what a
 * picker/sidebar lists. Add one entry here per new `packages/cmds/<name>`
 * package; `loadCommand` below is where its actual code gets pulled in.
 */
export const MANIFESTS: readonly CommandManifest[] = [
  RSYNC_MANIFEST,
  CD_MANIFEST,
  SSH_MANIFEST,
  LS_MANIFEST,
  RM_MANIFEST,
  KILL_MANIFEST,
  TAR_MANIFEST,
  SCP_MANIFEST,
  CHMOD_MANIFEST,
  PWD_MANIFEST,
  MKDIR_MANIFEST,
  TOUCH_MANIFEST,
  LN_MANIFEST,
  MV_MANIFEST,
  CP_MANIFEST,
  CHOWN_MANIFEST,
  CAT_MANIFEST,
  ECHO_MANIFEST,
  HEAD_MANIFEST,
  TAIL_MANIFEST,
  LESS_MANIFEST,
  GREP_MANIFEST,
  SORT_MANIFEST,
  DIFF_MANIFEST,
  CMP_MANIFEST,
  COMM_MANIFEST,
  EXPORT_MANIFEST,
  ALIAS_MANIFEST,
  CLEAR_MANIFEST,
  WHOAMI_MANIFEST,
  UNAME_MANIFEST,
  PS_MANIFEST,
  TOP_MANIFEST,
  KILLALL_MANIFEST,
  DF_MANIFEST,
  MOUNT_MANIFEST,
  MAN_MANIFEST,
  WHATIS_MANIFEST,
  WHEREIS_MANIFEST,
  CAL_MANIFEST,
  DD_MANIFEST,
  ZIP_MANIFEST,
  UNZIP_MANIFEST,
  WGET_MANIFEST,
  IFCONFIG_MANIFEST,
  TRACEROUTE_MANIFEST,
  APT_MANIFEST,
  PACMAN_MANIFEST,
  YUM_MANIFEST,
  RPM_MANIFEST,
  SUDO_MANIFEST,
  PASSWD_MANIFEST,
  USERADD_MANIFEST,
  SERVICE_MANIFEST,
  UFW_MANIFEST,
  IPTABLES_MANIFEST,
  CURL_MANIFEST,
  GIT_MANIFEST,
  ADDUSER_MANIFEST,
  GROUPADD_MANIFEST,
  GROUPMOD_MANIFEST,
  USERMOD_MANIFEST,
  SU_MANIFEST,
  PKILL_MANIFEST,
  WHICH_MANIFEST,
  WHERE_MANIFEST,
  SYSTEMCTL_MANIFEST,
  JOURNALCTL_MANIFEST,
  CRONTAB_MANIFEST,
  AT_MANIFEST,
  HALT_MANIFEST,
  POWEROFF_MANIFEST,
  REBOOT_MANIFEST,
  SHUTDOWN_MANIFEST,
  DIG_MANIFEST,
  NSLOOKUP_MANIFEST,
  WHOIS_MANIFEST,
  ROUTE_MANIFEST,
  PING_MANIFEST,
  NETSTAT_MANIFEST,
  FIREWALL_CMD_MANIFEST,
  BLKID_MANIFEST,
  LSBLK_MANIFEST,
  DU_MANIFEST,
  FDISK_MANIFEST,
  MKFS_MANIFEST,
  UMOUNT_MANIFEST,
  UPDATEDB_MANIFEST,
  LOCATE_MANIFEST,
  CHGRP_MANIFEST,
  RMDIR_MANIFEST,
  PATCH_MANIFEST,
  FIND_MANIFEST,
  AWK_MANIFEST,
  SED_MANIFEST,
  CUT_MANIFEST,
  UNIQ_MANIFEST,
  WC_MANIFEST,
  TEE_MANIFEST,
  GZIP_MANIFEST,
  GUNZIP_MANIFEST,
  UPTIME_MANIFEST,
  VMSTAT_MANIFEST,
  FREE_MANIFEST,
  SEMANAGE_MANIFEST,
  GETENFORCE_MANIFEST,
  SETENFORCE_MANIFEST,
  RSYSLOGD_MANIFEST,
  HISTORY_MANIFEST,
  INFO_MANIFEST,
  EMACS_MANIFEST,
  NANO_MANIFEST,
  VI_MANIFEST,
  MORE_MANIFEST,
  SOURCE_MANIFEST,
  SSH_KEYGEN_MANIFEST,
  APT_GET_MANIFEST,
  FFMPEG_MANIFEST,
  OPENSSL_MANIFEST,
  FILE_MANIFEST,
  STAT_MANIFEST,
  TREE_MANIFEST,
  UMASK_MANIFEST,
  TAC_MANIFEST,
  EGREP_MANIFEST,
  PASTE_MANIFEST,
  TR_MANIFEST,
  XARGS_MANIFEST,
  HOSTNAME_MANIFEST,
  DATE_MANIFEST,
  LSCPU_MANIFEST,
  LSPCI_MANIFEST,
  LSUSB_MANIFEST,
  DMESG_MANIFEST,
  HTOP_MANIFEST,
  PGREP_MANIFEST,
  BG_MANIFEST,
  FG_MANIFEST,
  JOBS_MANIFEST,
  NOHUP_MANIFEST,
  NICE_MANIFEST,
  RENICE_MANIFEST,
  IP_MANIFEST,
  SS_MANIFEST,
  FTP_MANIFEST,
  TELNET_MANIFEST,
  ID_MANIFEST,
  GROUPS_MANIFEST,
  USERDEL_MANIFEST,
  BZIP2_MANIFEST,
  BUNZIP2_MANIFEST,
  UNALIAS_MANIFEST,
  EXIT_MANIFEST,
];

export function getManifest(id: string): CommandManifest | undefined {
  return MANIFESTS.find((m) => m.id === id);
}

/**
 * Load a command's full behavior on demand. Each case is a dynamic `import()`,
 * so selecting one command in a picker does not pull every other installed
 * command's catalogue/lint/build code into the same bundle.
 */
export async function loadCommand(id: string): Promise<CommandDefinition<unknown>> {
  switch (id) {
    case "rsync":
      return (await import("@cmdgen/rsync/definition"))
        .RSYNC_COMMAND as CommandDefinition<unknown>;
    case "cd":
      return (await import("@cmdgen/cd/definition")).CD_COMMAND as CommandDefinition<unknown>;
    case "ssh":
      return (await import("@cmdgen/ssh/definition")).SSH_COMMAND as CommandDefinition<unknown>;
    case "ls":
      return (await import("@cmdgen/ls/definition")).LS_COMMAND as CommandDefinition<unknown>;
    case "rm":
      return (await import("@cmdgen/rm/definition")).RM_COMMAND as CommandDefinition<unknown>;
    case "kill":
      return (await import("@cmdgen/kill/definition"))
        .KILL_COMMAND as CommandDefinition<unknown>;
    case "tar":
      return (await import("@cmdgen/tar/definition")).TAR_COMMAND as CommandDefinition<unknown>;
    case "scp":
      return (await import("@cmdgen/scp/definition")).SCP_COMMAND as CommandDefinition<unknown>;
    case "chmod":
      return (await import("@cmdgen/chmod/definition"))
        .CHMOD_COMMAND as CommandDefinition<unknown>;
    case "pwd":
      return (await import("@cmdgen/pwd/definition")).PWD_COMMAND as CommandDefinition<unknown>;
    case "mkdir":
      return (await import("@cmdgen/mkdir/definition"))
        .MKDIR_COMMAND as CommandDefinition<unknown>;
    case "touch":
      return (await import("@cmdgen/touch/definition"))
        .TOUCH_COMMAND as CommandDefinition<unknown>;
    case "ln":
      return (await import("@cmdgen/ln/definition")).LN_COMMAND as CommandDefinition<unknown>;
    case "mv":
      return (await import("@cmdgen/mv/definition")).MV_COMMAND as CommandDefinition<unknown>;
    case "cp":
      return (await import("@cmdgen/cp/definition")).CP_COMMAND as CommandDefinition<unknown>;
    case "chown":
      return (await import("@cmdgen/chown/definition"))
        .CHOWN_COMMAND as CommandDefinition<unknown>;
    case "cat":
      return (await import("@cmdgen/cat/definition")).CAT_COMMAND as CommandDefinition<unknown>;
    case "echo":
      return (await import("@cmdgen/echo/definition"))
        .ECHO_COMMAND as CommandDefinition<unknown>;
    case "head":
      return (await import("@cmdgen/head/definition"))
        .HEAD_COMMAND as CommandDefinition<unknown>;
    case "tail":
      return (await import("@cmdgen/tail/definition"))
        .TAIL_COMMAND as CommandDefinition<unknown>;
    case "less":
      return (await import("@cmdgen/less/definition"))
        .LESS_COMMAND as CommandDefinition<unknown>;
    case "grep":
      return (await import("@cmdgen/grep/definition"))
        .GREP_COMMAND as CommandDefinition<unknown>;
    case "sort":
      return (await import("@cmdgen/sort/definition"))
        .SORT_COMMAND as CommandDefinition<unknown>;
    case "diff":
      return (await import("@cmdgen/diff/definition"))
        .DIFF_COMMAND as CommandDefinition<unknown>;
    case "cmp":
      return (await import("@cmdgen/cmp/definition")).CMP_COMMAND as CommandDefinition<unknown>;
    case "comm":
      return (await import("@cmdgen/comm/definition"))
        .COMM_COMMAND as CommandDefinition<unknown>;
    case "export":
      return (await import("@cmdgen/export/definition"))
        .EXPORT_COMMAND as CommandDefinition<unknown>;
    case "alias":
      return (await import("@cmdgen/alias/definition"))
        .ALIAS_COMMAND as CommandDefinition<unknown>;
    case "clear":
      return (await import("@cmdgen/clear/definition"))
        .CLEAR_COMMAND as CommandDefinition<unknown>;
    case "whoami":
      return (await import("@cmdgen/whoami/definition"))
        .WHOAMI_COMMAND as CommandDefinition<unknown>;
    case "uname":
      return (await import("@cmdgen/uname/definition"))
        .UNAME_COMMAND as CommandDefinition<unknown>;
    case "ps":
      return (await import("@cmdgen/ps/definition")).PS_COMMAND as CommandDefinition<unknown>;
    case "top":
      return (await import("@cmdgen/top/definition")).TOP_COMMAND as CommandDefinition<unknown>;
    case "killall":
      return (await import("@cmdgen/killall/definition"))
        .KILLALL_COMMAND as CommandDefinition<unknown>;
    case "df":
      return (await import("@cmdgen/df/definition")).DF_COMMAND as CommandDefinition<unknown>;
    case "mount":
      return (await import("@cmdgen/mount/definition"))
        .MOUNT_COMMAND as CommandDefinition<unknown>;
    case "man":
      return (await import("@cmdgen/man/definition")).MAN_COMMAND as CommandDefinition<unknown>;
    case "whatis":
      return (await import("@cmdgen/whatis/definition"))
        .WHATIS_COMMAND as CommandDefinition<unknown>;
    case "whereis":
      return (await import("@cmdgen/whereis/definition"))
        .WHEREIS_COMMAND as CommandDefinition<unknown>;
    case "cal":
      return (await import("@cmdgen/cal/definition")).CAL_COMMAND as CommandDefinition<unknown>;
    case "dd":
      return (await import("@cmdgen/dd/definition")).DD_COMMAND as CommandDefinition<unknown>;
    case "zip":
      return (await import("@cmdgen/zip/definition")).ZIP_COMMAND as CommandDefinition<unknown>;
    case "unzip":
      return (await import("@cmdgen/unzip/definition"))
        .UNZIP_COMMAND as CommandDefinition<unknown>;
    case "wget":
      return (await import("@cmdgen/wget/definition"))
        .WGET_COMMAND as CommandDefinition<unknown>;
    case "ifconfig":
      return (await import("@cmdgen/ifconfig/definition"))
        .IFCONFIG_COMMAND as CommandDefinition<unknown>;
    case "traceroute":
      return (await import("@cmdgen/traceroute/definition"))
        .TRACEROUTE_COMMAND as CommandDefinition<unknown>;
    case "apt":
      return (await import("@cmdgen/apt/definition")).APT_COMMAND as CommandDefinition<unknown>;
    case "pacman":
      return (await import("@cmdgen/pacman/definition"))
        .PACMAN_COMMAND as CommandDefinition<unknown>;
    case "yum":
      return (await import("@cmdgen/yum/definition")).YUM_COMMAND as CommandDefinition<unknown>;
    case "rpm":
      return (await import("@cmdgen/rpm/definition")).RPM_COMMAND as CommandDefinition<unknown>;
    case "sudo":
      return (await import("@cmdgen/sudo/definition"))
        .SUDO_COMMAND as CommandDefinition<unknown>;
    case "passwd":
      return (await import("@cmdgen/passwd/definition"))
        .PASSWD_COMMAND as CommandDefinition<unknown>;
    case "useradd":
      return (await import("@cmdgen/useradd/definition"))
        .USERADD_COMMAND as CommandDefinition<unknown>;
    case "service":
      return (await import("@cmdgen/service/definition"))
        .SERVICE_COMMAND as CommandDefinition<unknown>;
    case "ufw":
      return (await import("@cmdgen/ufw/definition")).UFW_COMMAND as CommandDefinition<unknown>;
    case "iptables":
      return (await import("@cmdgen/iptables/definition"))
        .IPTABLES_COMMAND as CommandDefinition<unknown>;
    case "curl":
      return (await import("@cmdgen/curl/definition"))
        .CURL_COMMAND as CommandDefinition<unknown>;
    case "git":
      return (await import("@cmdgen/git/definition")).GIT_COMMAND as CommandDefinition<unknown>;
    case "adduser":
      return (await import("@cmdgen/adduser/definition"))
        .ADDUSER_COMMAND as CommandDefinition<unknown>;
    case "groupadd":
      return (await import("@cmdgen/groupadd/definition"))
        .GROUPADD_COMMAND as CommandDefinition<unknown>;
    case "groupmod":
      return (await import("@cmdgen/groupmod/definition"))
        .GROUPMOD_COMMAND as CommandDefinition<unknown>;
    case "usermod":
      return (await import("@cmdgen/usermod/definition"))
        .USERMOD_COMMAND as CommandDefinition<unknown>;
    case "su":
      return (await import("@cmdgen/su/definition")).SU_COMMAND as CommandDefinition<unknown>;
    case "pkill":
      return (await import("@cmdgen/pkill/definition"))
        .PKILL_COMMAND as CommandDefinition<unknown>;
    case "which":
      return (await import("@cmdgen/which/definition"))
        .WHICH_COMMAND as CommandDefinition<unknown>;
    case "where":
      return (await import("@cmdgen/where/definition"))
        .WHERE_COMMAND as CommandDefinition<unknown>;
    case "systemctl":
      return (await import("@cmdgen/systemctl/definition"))
        .SYSTEMCTL_COMMAND as CommandDefinition<unknown>;
    case "journalctl":
      return (await import("@cmdgen/journalctl/definition"))
        .JOURNALCTL_COMMAND as CommandDefinition<unknown>;
    case "crontab":
      return (await import("@cmdgen/crontab/definition"))
        .CRONTAB_COMMAND as CommandDefinition<unknown>;
    case "at":
      return (await import("@cmdgen/at/definition")).AT_COMMAND as CommandDefinition<unknown>;
    case "halt":
      return (await import("@cmdgen/halt/definition"))
        .HALT_COMMAND as CommandDefinition<unknown>;
    case "poweroff":
      return (await import("@cmdgen/poweroff/definition"))
        .POWEROFF_COMMAND as CommandDefinition<unknown>;
    case "reboot":
      return (await import("@cmdgen/reboot/definition"))
        .REBOOT_COMMAND as CommandDefinition<unknown>;
    case "shutdown":
      return (await import("@cmdgen/shutdown/definition"))
        .SHUTDOWN_COMMAND as CommandDefinition<unknown>;
    case "dig":
      return (await import("@cmdgen/dig/definition")).DIG_COMMAND as CommandDefinition<unknown>;
    case "nslookup":
      return (await import("@cmdgen/nslookup/definition"))
        .NSLOOKUP_COMMAND as CommandDefinition<unknown>;
    case "whois":
      return (await import("@cmdgen/whois/definition"))
        .WHOIS_COMMAND as CommandDefinition<unknown>;
    case "route":
      return (await import("@cmdgen/route/definition"))
        .ROUTE_COMMAND as CommandDefinition<unknown>;
    case "ping":
      return (await import("@cmdgen/ping/definition"))
        .PING_COMMAND as CommandDefinition<unknown>;
    case "netstat":
      return (await import("@cmdgen/netstat/definition"))
        .NETSTAT_COMMAND as CommandDefinition<unknown>;
    case "firewall-cmd":
      return (await import("@cmdgen/firewall-cmd/definition"))
        .FIREWALL_CMD_COMMAND as CommandDefinition<unknown>;
    case "blkid":
      return (await import("@cmdgen/blkid/definition"))
        .BLKID_COMMAND as CommandDefinition<unknown>;
    case "lsblk":
      return (await import("@cmdgen/lsblk/definition"))
        .LSBLK_COMMAND as CommandDefinition<unknown>;
    case "du":
      return (await import("@cmdgen/du/definition")).DU_COMMAND as CommandDefinition<unknown>;
    case "fdisk":
      return (await import("@cmdgen/fdisk/definition"))
        .FDISK_COMMAND as CommandDefinition<unknown>;
    case "mkfs":
      return (await import("@cmdgen/mkfs/definition"))
        .MKFS_COMMAND as CommandDefinition<unknown>;
    case "umount":
      return (await import("@cmdgen/umount/definition"))
        .UMOUNT_COMMAND as CommandDefinition<unknown>;
    case "updatedb":
      return (await import("@cmdgen/updatedb/definition"))
        .UPDATEDB_COMMAND as CommandDefinition<unknown>;
    case "locate":
      return (await import("@cmdgen/locate/definition"))
        .LOCATE_COMMAND as CommandDefinition<unknown>;
    case "chgrp":
      return (await import("@cmdgen/chgrp/definition"))
        .CHGRP_COMMAND as CommandDefinition<unknown>;
    case "rmdir":
      return (await import("@cmdgen/rmdir/definition"))
        .RMDIR_COMMAND as CommandDefinition<unknown>;
    case "patch":
      return (await import("@cmdgen/patch/definition"))
        .PATCH_COMMAND as CommandDefinition<unknown>;
    case "find":
      return (await import("@cmdgen/find/definition"))
        .FIND_COMMAND as CommandDefinition<unknown>;
    case "awk":
      return (await import("@cmdgen/awk/definition")).AWK_COMMAND as CommandDefinition<unknown>;
    case "sed":
      return (await import("@cmdgen/sed/definition")).SED_COMMAND as CommandDefinition<unknown>;
    case "cut":
      return (await import("@cmdgen/cut/definition")).CUT_COMMAND as CommandDefinition<unknown>;
    case "uniq":
      return (await import("@cmdgen/uniq/definition"))
        .UNIQ_COMMAND as CommandDefinition<unknown>;
    case "wc":
      return (await import("@cmdgen/wc/definition")).WC_COMMAND as CommandDefinition<unknown>;
    case "tee":
      return (await import("@cmdgen/tee/definition")).TEE_COMMAND as CommandDefinition<unknown>;
    case "gzip":
      return (await import("@cmdgen/gzip/definition"))
        .GZIP_COMMAND as CommandDefinition<unknown>;
    case "gunzip":
      return (await import("@cmdgen/gunzip/definition"))
        .GUNZIP_COMMAND as CommandDefinition<unknown>;
    case "uptime":
      return (await import("@cmdgen/uptime/definition"))
        .UPTIME_COMMAND as CommandDefinition<unknown>;
    case "vmstat":
      return (await import("@cmdgen/vmstat/definition"))
        .VMSTAT_COMMAND as CommandDefinition<unknown>;
    case "free":
      return (await import("@cmdgen/free/definition"))
        .FREE_COMMAND as CommandDefinition<unknown>;
    case "semanage":
      return (await import("@cmdgen/semanage/definition"))
        .SEMANAGE_COMMAND as CommandDefinition<unknown>;
    case "getenforce":
      return (await import("@cmdgen/getenforce/definition"))
        .GETENFORCE_COMMAND as CommandDefinition<unknown>;
    case "setenforce":
      return (await import("@cmdgen/setenforce/definition"))
        .SETENFORCE_COMMAND as CommandDefinition<unknown>;
    case "rsyslogd":
      return (await import("@cmdgen/rsyslogd/definition"))
        .RSYSLOGD_COMMAND as CommandDefinition<unknown>;
    case "history":
      return (await import("@cmdgen/history/definition"))
        .HISTORY_COMMAND as CommandDefinition<unknown>;
    case "info":
      return (await import("@cmdgen/info/definition"))
        .INFO_COMMAND as CommandDefinition<unknown>;
    case "emacs":
      return (await import("@cmdgen/emacs/definition"))
        .EMACS_COMMAND as CommandDefinition<unknown>;
    case "nano":
      return (await import("@cmdgen/nano/definition"))
        .NANO_COMMAND as CommandDefinition<unknown>;
    case "vi":
      return (await import("@cmdgen/vi/definition")).VI_COMMAND as CommandDefinition<unknown>;
    case "more":
      return (await import("@cmdgen/more/definition"))
        .MORE_COMMAND as CommandDefinition<unknown>;
    case "source":
      return (await import("@cmdgen/source/definition"))
        .SOURCE_COMMAND as CommandDefinition<unknown>;
    case "ssh-keygen":
      return (await import("@cmdgen/ssh-keygen/definition"))
        .SSH_KEYGEN_COMMAND as CommandDefinition<unknown>;
    case "apt-get":
      return (await import("@cmdgen/apt-get/definition"))
        .APT_GET_COMMAND as CommandDefinition<unknown>;
    case "ffmpeg":
      return (await import("@cmdgen/ffmpeg/definition"))
        .FFMPEG_COMMAND as CommandDefinition<unknown>;
    case "openssl":
      return (await import("@cmdgen/openssl/definition"))
        .OPENSSL_COMMAND as CommandDefinition<unknown>;
    case "file":
      return (await import("@cmdgen/file/definition"))
        .FILE_COMMAND as CommandDefinition<unknown>;
    case "stat":
      return (await import("@cmdgen/stat/definition"))
        .STAT_COMMAND as CommandDefinition<unknown>;
    case "tree":
      return (await import("@cmdgen/tree/definition"))
        .TREE_COMMAND as CommandDefinition<unknown>;
    case "umask":
      return (await import("@cmdgen/umask/definition"))
        .UMASK_COMMAND as CommandDefinition<unknown>;
    case "tac":
      return (await import("@cmdgen/tac/definition")).TAC_COMMAND as CommandDefinition<unknown>;
    case "egrep":
      return (await import("@cmdgen/egrep/definition"))
        .EGREP_COMMAND as CommandDefinition<unknown>;
    case "paste":
      return (await import("@cmdgen/paste/definition"))
        .PASTE_COMMAND as CommandDefinition<unknown>;
    case "tr":
      return (await import("@cmdgen/tr/definition")).TR_COMMAND as CommandDefinition<unknown>;
    case "xargs":
      return (await import("@cmdgen/xargs/definition"))
        .XARGS_COMMAND as CommandDefinition<unknown>;
    case "hostname":
      return (await import("@cmdgen/hostname/definition"))
        .HOSTNAME_COMMAND as CommandDefinition<unknown>;
    case "date":
      return (await import("@cmdgen/date/definition"))
        .DATE_COMMAND as CommandDefinition<unknown>;
    case "lscpu":
      return (await import("@cmdgen/lscpu/definition"))
        .LSCPU_COMMAND as CommandDefinition<unknown>;
    case "lspci":
      return (await import("@cmdgen/lspci/definition"))
        .LSPCI_COMMAND as CommandDefinition<unknown>;
    case "lsusb":
      return (await import("@cmdgen/lsusb/definition"))
        .LSUSB_COMMAND as CommandDefinition<unknown>;
    case "dmesg":
      return (await import("@cmdgen/dmesg/definition"))
        .DMESG_COMMAND as CommandDefinition<unknown>;
    case "htop":
      return (await import("@cmdgen/htop/definition"))
        .HTOP_COMMAND as CommandDefinition<unknown>;
    case "pgrep":
      return (await import("@cmdgen/pgrep/definition"))
        .PGREP_COMMAND as CommandDefinition<unknown>;
    case "bg":
      return (await import("@cmdgen/bg/definition")).BG_COMMAND as CommandDefinition<unknown>;
    case "fg":
      return (await import("@cmdgen/fg/definition")).FG_COMMAND as CommandDefinition<unknown>;
    case "jobs":
      return (await import("@cmdgen/jobs/definition"))
        .JOBS_COMMAND as CommandDefinition<unknown>;
    case "nohup":
      return (await import("@cmdgen/nohup/definition"))
        .NOHUP_COMMAND as CommandDefinition<unknown>;
    case "nice":
      return (await import("@cmdgen/nice/definition"))
        .NICE_COMMAND as CommandDefinition<unknown>;
    case "renice":
      return (await import("@cmdgen/renice/definition"))
        .RENICE_COMMAND as CommandDefinition<unknown>;
    case "ip":
      return (await import("@cmdgen/ip/definition")).IP_COMMAND as CommandDefinition<unknown>;
    case "ss":
      return (await import("@cmdgen/ss/definition")).SS_COMMAND as CommandDefinition<unknown>;
    case "ftp":
      return (await import("@cmdgen/ftp/definition")).FTP_COMMAND as CommandDefinition<unknown>;
    case "telnet":
      return (await import("@cmdgen/telnet/definition"))
        .TELNET_COMMAND as CommandDefinition<unknown>;
    case "id":
      return (await import("@cmdgen/id/definition")).ID_COMMAND as CommandDefinition<unknown>;
    case "groups":
      return (await import("@cmdgen/groups/definition"))
        .GROUPS_COMMAND as CommandDefinition<unknown>;
    case "userdel":
      return (await import("@cmdgen/userdel/definition"))
        .USERDEL_COMMAND as CommandDefinition<unknown>;
    case "bzip2":
      return (await import("@cmdgen/bzip2/definition"))
        .BZIP2_COMMAND as CommandDefinition<unknown>;
    case "bunzip2":
      return (await import("@cmdgen/bunzip2/definition"))
        .BUNZIP2_COMMAND as CommandDefinition<unknown>;
    case "unalias":
      return (await import("@cmdgen/unalias/definition"))
        .UNALIAS_COMMAND as CommandDefinition<unknown>;
    case "exit":
      return (await import("@cmdgen/exit/definition"))
        .EXIT_COMMAND as CommandDefinition<unknown>;
    default:
      throw new Error(`Unknown command id: "${id}"`);
  }
}
