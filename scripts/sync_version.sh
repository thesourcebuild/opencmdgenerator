#!/usr/bin/env sh
set -eu

# Sync package.json versions with the root version file.
#
#   scripts/sync_version.sh
#   scripts/sync_version.sh 0.1.18

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$script_dir/.." && pwd)
version_file="$repo_root/version"

if [ "$#" -gt 1 ]; then
  echo "usage: scripts/sync_version.sh [version]" >&2
  exit 2
fi

if [ "$#" -eq 1 ]; then
  version=$1
  if [ -z "$version" ]; then
    echo "version cannot be blank" >&2
    exit 2
  fi
  printf '%s\n' "$version" > "$version_file"
else
  if [ ! -f "$version_file" ]; then
    echo "no version file at $version_file" >&2
    exit 1
  fi
  version=$(tr -d '\r\n' < "$version_file")
fi

if [ -z "$version" ]; then
  echo "version file is empty" >&2
  exit 1
fi

sync_package_json() {
  file=$1
  [ -f "$file" ] || return 0
  tmp="$file.tmp.$$"
  awk -v version="$version" '
    !done && /"version"[[:space:]]*:[[:space:]]*"[^"]*"/ {
      sub(/"version"[[:space:]]*:[[:space:]]*"[^"]*"/, "\"version\": \"" version "\"")
      done = 1
    }
    { print }
  ' "$file" > "$tmp"
  if cmp -s "$file" "$tmp"; then
    rm -f "$tmp"
  else
    mv "$tmp" "$file"
    echo "synced version $version into $file"
  fi
}

sync_package_json "$repo_root/package.json"
sync_package_json "$repo_root/apps/desktop/package.json"
sync_package_json "$repo_root/apps/web/package.json"

echo "Version synced: $version"
