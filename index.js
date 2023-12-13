#!/usr/bin/env node

import _groupBy from "lodash.groupby";
import semver from "semver";

const MAJOR_VERSION = process.argv[2] ?? 20;

const releases = await getReleases();
const majorReleases = groupReleases(releases, MAJOR_VERSION);

if (majorReleases.length) {
  console.log("version  | npm      | date       | lts        | security\n--------:|---------:|------------|------------|------------");
  for (const { version, npm, lts, security: _security, date: _date } of majorReleases) {
    const date = new Date(_date).toLocaleDateString("en-US");
    const security = _security ? "(SECURITY)" : "";
    const out = [
      version.padEnd(8, " "),
      npm.padEnd(8, " "),
      date.padEnd(10, " "),
      (lts || "").padEnd(10, " "),
      security,
    ];
    console.log(out.join(" | "));
  }
}

async function getReleases() {
  const releases = await fetch("https://nodejs.org/download/release/index.json");
  return releases.json();
}

function groupReleases(releases = [], majorVersion) {
  const majorReleases = _groupBy(releases, (v) => semver.major(v.version));
  if (majorVersion) {
    return majorReleases[majorVersion] ?? [];
  }
  return majorReleases;
}
