#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const required = [
  "SKILL.md",
  "skills/agent-lean-safe-coding/SKILL.md",
  "agents/openai.yaml",
  ".codex-plugin/plugin.json",
  ".claude-plugin/plugin.json",
  "hooks/claude-code-hooks.json",
  "README.md",
  "LICENSE",
  "AGENTS.md",
  "llms.txt",
  "docs/AI_AGENT_GUIDE.md",
  "docs/assets/benchmark-bars.svg",
  "docs/benchmark-results.json"
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length) {
  console.error(`Missing required files: ${missing.join(", ")}`);
  process.exit(1);
}

const skill = fs.readFileSync(path.join(root, "SKILL.md"), "utf8");
if (skill.includes("[TODO") || !/^---\nname: agent-lean-safe-coding\n/m.test(skill)) {
  console.error("SKILL.md is incomplete or has invalid frontmatter.");
  process.exit(1);
}

const codex = JSON.parse(fs.readFileSync(path.join(root, ".codex-plugin", "plugin.json"), "utf8"));
const claude = JSON.parse(fs.readFileSync(path.join(root, ".claude-plugin", "plugin.json"), "utf8"));
if (codex.name !== "agent-lean-safe-coding" || claude.name !== "agent-lean-safe-coding") {
  console.error("Plugin names must match agent-lean-safe-coding.");
  process.exit(1);
}
if (codex.license !== "SEE LICENSE IN LICENSE") {
  console.error("Codex plugin license must reference LICENSE.");
  process.exit(1);
}

console.log("Repository validation passed.");
