import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import test from "node:test";

test("tracked files exclude private and generated workspace material", () => {
  const files = execFileSync("git", ["ls-files", "-z"])
    .toString()
    .split("\0")
    .filter(Boolean);
  const blocked = files.filter((file) =>
    /(^|\/)(node_modules|dist|\.vercel|source-assets|private-assets)(\/|$)|^docs\/superpowers\/|\.DS_Store$|^qa-/.test(
      file
    )
  );
  assert.deepEqual(blocked, []);
});

test("commit identity is neutral", () => {
  const authors = execFileSync("git", ["log", "--format=%an <%ae>"])
    .toString()
    .trim()
    .split("\n");
  assert.ok(
    authors.every(
      (value) =>
        value ===
        "Portfolio Template Maintainer <template-maintainer@users.noreply.github.com>"
    )
  );
});

test("dist scan keeps built-in PII rules without minifier denylist collisions", () => {
  const verifier = readFileSync("scripts/verify-release.mjs", "utf8");
  assert.match(verifier, /PRIVATE_DENYLIST_FILE:\s*""/);
});

test("release gate scans every reachable Git commit", () => {
  const verifier = readFileSync("scripts/verify-release.mjs", "utf8");
  assert.match(verifier, /privacy-history-check\.mjs/);
});
