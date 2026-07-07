#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const rootSkill = fs.readFileSync(path.join(root, "SKILL.md"), "utf8");
const packagedSkillPath = path.join(root, "skills", "agent-lean-safe-coding", "SKILL.md");
const packagedSkill = fs.readFileSync(packagedSkillPath, "utf8");

if (rootSkill !== packagedSkill) {
  console.error("SKILL.md and skills/agent-lean-safe-coding/SKILL.md differ.");
  process.exit(1);
}

console.log("Skill copies are aligned.");
