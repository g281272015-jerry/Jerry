import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const IGNORED_DIRS = new Set([".git", ".superpowers", "node_modules", "dist", ".vercel", "coverage"]);
const IGNORED_FILES = new Set([".privacy-denylist.local.txt"]);
const SAFE_VALUES = new Set([
  "hello@example.com",
  "template-maintainer@users.noreply.github.com",
]);
const RULES = [
  ["email", /\b[A-Z0-9._%+-]+@(?!example\.com\b)[A-Z0-9.-]+\.[A-Z]{2,}\b/gi],
  ["mailto", new RegExp(["mail", "to"].join("") + ":(?!hello@example\\.com\\b)[^\\s\"'`]+", "gi")],
  ["telephone", new RegExp(["t", "el"].join("") + ":\\+?[0-9][0-9\\s()-]{7,}", "gi")],
  ["private-path", /\/(?:Users|home)\/[A-Za-z0-9._-]+\//g],
  ["vercel-project", /\b(?:prj|team)_[A-Za-z0-9]{12,}\b/g],
];

async function walk(root, current = root) {
  const entries = await readdir(current, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry.name)) continue;
    if (IGNORED_FILES.has(entry.name)) continue;
    const target = path.join(current, entry.name);
    if (entry.isDirectory()) files.push(...await walk(root, target));
    else files.push(target);
  }
  return files;
}

export function inspectText(file, text, extraTokens) {
  const findings = [];
  for (const [rule, pattern] of RULES) {
    for (const match of text.matchAll(pattern)) {
      if (!SAFE_VALUES.has(match[0])) findings.push({ file, match: match[0], rule });
    }
  }
  for (const token of extraTokens.filter(Boolean)) {
    const isShortAsciiToken = /^[A-Za-z0-9_-]{1,4}$/.test(token);
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const matched = isShortAsciiToken
      ? new RegExp(`\\b${escaped}\\b`, "i").test(text)
      : text.toLocaleLowerCase().includes(token.toLocaleLowerCase());
    if (matched) {
      findings.push({ file, match: token, rule: "private-denylist" });
    }
  }
  return findings;
}

export async function scanTree(root, { extraTokens = [] } = {}) {
  const files = await walk(root);
  const findings = [];
  let scannedFiles = 0;
  for (const file of files) {
    const info = await stat(file);
    if (info.size > 5_000_000) continue;
    const buffer = await readFile(file);
    if (buffer.includes(0)) continue;
    scannedFiles += 1;
    findings.push(...inspectText(path.relative(root, file), buffer.toString("utf8"), extraTokens));
  }
  return { findings, scannedFiles };
}

export async function readLocalTokens() {
  const file = process.env.PRIVATE_DENYLIST_FILE;
  if (!file) return [];
  return (await readFile(file, "utf8"))
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = path.resolve(process.argv[2] || ".");
  const result = await scanTree(root, { extraTokens: await readLocalTokens() });
  if (result.findings.length) {
    for (const finding of result.findings) console.error(`${finding.rule}: ${finding.file}`);
    process.exitCode = 1;
  } else {
    console.log(`Privacy scan passed across ${result.scannedFiles} text files.`);
  }
}
