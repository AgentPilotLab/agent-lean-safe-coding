#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const blocked = [
  /C:\\Users\\/i,
  /\/Users\//,
  /\/home\//,
  /oliver/i,
  /token\s*[:=]\s*['"][^'"]{8,}/i,
  /api[_-]?key\s*[:=]\s*['"][^'"]{8,}/i,
  /session\s*[:=]\s*['"][^'"]{8,}/i,
  /内部商业/,
  /AGENTS友好/,
  /本地wiki/,
  /商业SEO/
];
const skipDirs = new Set([".git", "node_modules", "dist", ".cache"]);
const findings = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    const rel = path.relative(root, full).replace(/\\/g, "/");
    if (rel === "scripts/privacy-scan.js") continue;
    const stat = fs.statSync(full);
    if (stat.size > 1024 * 1024) continue;
    const text = fs.readFileSync(full, "utf8");
    blocked.forEach((pattern) => {
      if (pattern.test(text) || pattern.test(rel)) {
        findings.push(`${rel}: ${pattern}`);
      }
    });
  }
}

walk(root);

if (findings.length) {
  console.error("Privacy scan failed:");
  findings.forEach((finding) => console.error(`- ${finding}`));
  process.exit(1);
}

console.log("Privacy scan passed.");
