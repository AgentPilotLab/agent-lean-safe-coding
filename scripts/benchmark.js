#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const fixturePath = path.join(root, "benchmarks", "fixtures.json");
const outJsonPath = path.join(root, "docs", "benchmark-results.json");
const outSvgPath = path.join(root, "docs", "assets", "benchmark-bars.svg");

const fixtures = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
const metrics = ["addedLoc", "filesChanged", "newDependencies", "riskFlags"];
const labels = {
  addedLoc: "Added LOC",
  filesChanged: "Files",
  newDependencies: "Deps",
  riskFlags: "Risk flags"
};

function sumMetric(group, metric) {
  return fixtures.scenarios.reduce((total, scenario) => total + scenario[group][metric], 0);
}

const totals = { baseline: {}, enabled: {} };
const reductionPercent = {};
for (const metric of metrics) {
  totals.baseline[metric] = sumMetric("baseline", metric);
  totals.enabled[metric] = sumMetric("enabled", metric);
  reductionPercent[metric] = totals.baseline[metric] === 0
    ? 0
    : Number((((totals.baseline[metric] - totals.enabled[metric]) / totals.baseline[metric]) * 100).toFixed(1));
}

const result = {
  generatedBy: "scripts/benchmark.js",
  benchmarkType: "fixture-diff-score",
  note: "Reproducible repository fixture benchmark. It scores paired before/after implementation artifacts, not a universal live-agent benchmark.",
  totals,
  reductionPercent
};

fs.mkdirSync(path.dirname(outJsonPath), { recursive: true });
fs.mkdirSync(path.dirname(outSvgPath), { recursive: true });
fs.writeFileSync(outJsonPath, JSON.stringify(result, null, 2) + "\n");

const width = 760;
const height = 340;
const chartTop = 42;
const chartBottom = 286;
const axisLeft = 76;
const groupWidth = 160;
const maxValue = Math.max(...metrics.flatMap((metric) => [totals.baseline[metric], totals.enabled[metric]]));

function barHeight(value) {
  return Math.round((value / maxValue) * (chartBottom - chartTop));
}

function rect(x, y, w, h, fill) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" rx="3"/>`;
}

const bars = [];
metrics.forEach((metric, index) => {
  const x0 = axisLeft + index * groupWidth;
  const baseH = barHeight(totals.baseline[metric]);
  const enabledH = barHeight(totals.enabled[metric]);
  bars.push(rect(x0 + 20, chartBottom - baseH, 42, baseH, "#64748b"));
  bars.push(rect(x0 + 70, chartBottom - enabledH, 42, enabledH, "#16a34a"));
  bars.push(`<text x="${x0 + 41}" y="${chartBottom - baseH - 8}" text-anchor="middle" font-size="12" fill="#334155">${totals.baseline[metric]}</text>`);
  bars.push(`<text x="${x0 + 91}" y="${chartBottom - enabledH - 8}" text-anchor="middle" font-size="12" fill="#166534">${totals.enabled[metric]}</text>`);
  bars.push(`<text x="${x0 + 66}" y="314" text-anchor="middle" font-size="12" fill="#334155">${labels[metric]}</text>`);
});

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Benchmark bar chart comparing baseline and agent-lean-safe-coding enabled results">
  <rect width="100%" height="100%" fill="#ffffff"/>
  <text x="24" y="26" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#0f172a">Fixture Benchmark: Baseline vs Enabled</text>
  <line x1="${axisLeft}" y1="${chartBottom}" x2="724" y2="${chartBottom}" stroke="#cbd5e1"/>
  <line x1="${axisLeft}" y1="${chartTop}" x2="${axisLeft}" y2="${chartBottom}" stroke="#cbd5e1"/>
  <g font-family="Arial, sans-serif">${bars.join("\n    ")}</g>
  <rect x="548" y="20" width="14" height="14" fill="#64748b" rx="2"/>
  <text x="568" y="32" font-family="Arial, sans-serif" font-size="12" fill="#334155">Baseline</text>
  <rect x="632" y="20" width="14" height="14" fill="#16a34a" rx="2"/>
  <text x="652" y="32" font-family="Arial, sans-serif" font-size="12" fill="#334155">Enabled</text>
  <text x="24" y="334" font-family="Arial, sans-serif" font-size="11" fill="#64748b">Lower is better. Generated from benchmarks/fixtures.json by scripts/benchmark.js.</text>
</svg>
`;

fs.writeFileSync(outSvgPath, svg);
console.log(JSON.stringify(result, null, 2));
