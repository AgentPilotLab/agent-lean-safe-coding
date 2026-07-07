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
  "README.zh-CN.md",
  "LICENSE",
  "AGENTS.md",
  "llms.txt",
  "docs/AI_AGENT_GUIDE.md",
  "docs/assets/benchmark-bars.svg",
  "docs/assets/buy-me-a-coffee-qr.jpg",
  "docs/benchmark-results.json",
  "docs/releases/v0.1.0.md"
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

const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");
const readmeZh = fs.readFileSync(path.join(root, "README.zh-CN.md"), "utf8");
const requiredReadmeSnippets = [
  ["README.md", readme, "https://img.shields.io/badge/README-中文-blue?style=flat-square"],
  ["README.md", readme, "https://img.shields.io/badge/Buy%20me%20a%20coffee-mira.ai-FFDD00?style=flat-square"],
  ["README.md", readme, "## Similar Projects"],
  ["README.md", readme, "https://github.com/AgentPilotLab/agent-lean-safe-coding/releases/tag/v0.1.0"],
  ["README.md", readme, "docs/assets/buy-me-a-coffee-qr.jpg"],
  ["README.md", readme, "## AI Entry Points"],
  ["README.zh-CN.md", readmeZh, "https://img.shields.io/badge/README-English-blue?style=flat-square"],
  ["README.zh-CN.md", readmeZh, "https://img.shields.io/badge/Buy%20me%20a%20coffee-mira.ai-FFDD00?style=flat-square"],
  ["README.zh-CN.md", readmeZh, "## Similar Projects"],
  ["README.zh-CN.md", readmeZh, "https://github.com/AgentPilotLab/agent-lean-safe-coding/releases/tag/v0.1.0"],
  ["README.zh-CN.md", readmeZh, "docs/assets/buy-me-a-coffee-qr.jpg"],
  ["README.zh-CN.md", readmeZh, "## AI入口"]
];
for (const [file, body, snippet] of requiredReadmeSnippets) {
  if (!body.includes(snippet)) {
    console.error(`${file} must include required README standard snippet: ${snippet}`);
    process.exit(1);
  }
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
