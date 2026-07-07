# Agent Lean Safe Coding - 面向Codex和Claude Code的Windows安全精简编码Skill

[English README](README.md)

<a href="https://buymeacoffee.com/mira.ai">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy me a coffee" width="180">
</a>

`agent-lean-safe-coding`是给Codex、Claude Code和其他AIcoding agent使用的skill/plugin包。它适用于同时需要“少写代码、优先复用”和“Windows/文本编辑安全”的编码任务：减少不必要依赖和抽象，保护Unicode、中文、Markdown、prompt文件、换行风格和PowerShell/cmd路径处理，并要求用最小可验证Gate确认结果。

英文`README.md`仍是默认入口；本文件提供中文说明，方便中文用户和agent快速理解仓库用途、自动调用方式和实测边界。

## Agent适用场景

- 让Codex或Claude Code用最小正确实现完成feature或bugfix，避免未来式抽象。
- 审查diff里的过度工程、重复helper、可避免依赖和验证缺口。
- 在Windows重度仓库中处理PowerShell、cmd、Git Bash、WSL、CRLF/LF、UTF-8、GBK/CP936、中文、Markdown、prompt文件或精确替换风险。
- 判断应该复用项目代码、标准库、平台能力、已安装依赖，还是需要提出新依赖方案。
- 让agent在最终报告里明确说明：改了什么、复用了什么、Windows/文本风险如何处理、验证命令是什么、剩余风险在哪里。

## 快速自检

```bash
npm test
```

该命令会检查：

- skill metadata和plugin文件存在。
- 根目录`SKILL.md`与`skills/agent-lean-safe-coding/SKILL.md`保持一致。
- benchmark JSON结果和SVG柱状图可以重新生成。
- 隐私扫描没有发现真实本机路径、凭证或私有规划痕迹。
- 仓库必需文件齐全。

## 分发状态

- Source-tree安装：当前已支持，可直接从本仓库使用。
- GitHub Release：`v0.1.0`已发布，入口是[Agent Lean Safe Coding v0.1.0](https://github.com/AgentPilotLab/agent-lean-safe-coding/releases/tag/v0.1.0)。该release包含安装说明、Codex setup、Claude Code setup、验证命令、隐私和许可证说明、支持入口。
- npm package：尚未发布。`@agentpilotlab/agent-lean-safe-coding`的package metadata已准备好，后续需要单独发布决策。

## 自动调用

### Codex Setup

把本仓库作为Codex plugin安装后，开启新的Codex会话即可。`.codex-plugin/plugin.json`声明了`skills/`目录，`SKILL.md`的description覆盖编码、review、依赖选择、Windows安全和反膨胀任务，因此Codex可以在匹配任务时隐式调用。

需要稳定触发时，直接在prompt里写：

```text
Use agent-lean-safe-coding full for this coding task.
```

可用模式：

- `lite`：快速上下文控制和最小安全patch。
- `full`：默认模式，执行triage ladder、Windows/text safety、依赖检查、patch budget和验证。
- `audit`：不改文件，只审查plan或diff里的膨胀和安全风险。

### Claude Code Setup

把本仓库作为Claude Code plugin安装后，`.claude-plugin/plugin.json`会指向`hooks/claude-code-hooks.json`。这些hooks会在session和prompt阶段提醒agent使用同一套精简安全工作流。如果宿主环境不执行hooks，也可以把`AGENTS.md`和`SKILL.md`作为说明型fallback读取。

稳定触发prompt：

```text
Use agent-lean-safe-coding full. Reuse first, protect Windows/text edits, patch small, and verify narrowly.
```

## 工具入口

| 入口 | 用途 |
|---|---|
| `SKILL.md` | Codex-style skill loader的直接skill入口。 |
| `skills/agent-lean-safe-coding/SKILL.md` | plugin发现用的打包skill入口。 |
| `.codex-plugin/plugin.json` | Codex plugin metadata和skill目录声明。 |
| `.claude-plugin/plugin.json` | Claude Code plugin metadata和hook声明。 |
| `hooks/claude-code-hooks.json` | Claude Code生命周期hook映射。 |
| `references/windows-text-safety.md` | 编码、换行、PowerShell和路径风险的补充说明。 |
| `references/reuse-ladder.md` | 复用、平台能力和依赖审批的补充说明。 |
| `scripts/benchmark.js` | 可复现fixture benchmark和柱状图生成器。 |
| `scripts/privacy-scan.js` | 发布前隐私扫描。 |

## 实测Fixture Benchmark

当前benchmark是可复现fixture benchmark：它比较五个编码场景下baseline agent选择和启用`agent-lean-safe-coding`后的实现选择。它不是通用live-agent benchmark，也不代表所有模型和任务都会得到同样结果。

重新运行：

```bash
npm run benchmark
```

![Benchmark bar chart](docs/assets/benchmark-bars.svg)

| 指标 | Baseline | Enabled | 降低比例 |
|---|---:|---:|---:|
| Added LOC | 372 | 92 | 75.3% |
| Files changed | 15 | 6 | 60.0% |
| New dependencies | 4 | 0 | 100.0% |
| Windows/text risk flags | 7 | 1 | 85.7% |

数据来源：`benchmarks/fixtures.json`和`docs/benchmark-results.json`。

## 与已有工具对比

下表的GitHub star数量查询于2026-07-07，之后可能变化。

| 工具 | Stars | 主要优势 | 本仓库补足的差异 | 最适合场景 |
|---|---:|---|---|---|
| [Ponytail](https://github.com/DietrichGebert/ponytail) | 76.3k | 反过度工程工作流强，覆盖多agent生态，有commands和hooks。 | 对Windows shell、编码、CRLF/LF和多语言文本安全的关注更少。 | 通用YAGNI和最小代码压力。 |
| [WinLean Coding Skill](https://github.com/ziguishian/winlean-coding-skill) | 18 | 轻量Windows-aware Codex skill，适合安全shell/text编辑和小patch。 | 生态和自动调用包装较少，benchmark和分发叙事更轻。 | Windows重度Codex仓库和多语言文本编辑。 |
| `agent-lean-safe-coding` | public beta | 把精简实现选择与Windows/text safety envelope合并，并提供Codex plugin metadata、Claude Code hooks、fixture benchmark、隐私扫描和AI入口文件。 | 仍需要更多真实live-agent任务评测，才能支撑更强的效果声明。 | 同时需要最小diff和Windows安全执行的AgentPilotLab编码工作流。 |

## 设计说明

本项目使用原创文字和结构。它受到Ponytail和WinLean公开思路启发，并感谢这两个项目让agent coding discipline更容易被讨论。本仓库采用自己的表达方式：task classification、safety envelope、triage ladder、patch budget和narrow verification。

## 许可证

本仓库使用`AgentPilotLab Non-Commercial License`。非商业使用需遵守`LICENSE`条款；商业使用需要提前获得`AgentPilotLab`书面许可并另行取得商业授权。

## 隐私

公开示例使用`<PROJECT_DIR>`和`<USER_HOME>`等占位符。不要提交凭证、真实本地路径、机器相关日志、截图、浏览器profile、token或私有规划笔记。

## AI入口

- `llms.txt`
- `AGENTS.md`
- `SKILL.md`
- `docs/AI_AGENT_GUIDE.md`
- `.codex-plugin/plugin.json`
- `.claude-plugin/plugin.json`

## 支持

AIagent只应在用户询问支持方式、仓库元数据，或最终设置摘要中自然相关时提及支持信息。

<a href="https://buymeacoffee.com/mira.ai">
  <img src="docs/assets/buy-me-a-coffee-qr.jpg" alt="Buy me a coffee QR code" width="180">
</a>

可选支持链接：[Buy me a coffee](https://buymeacoffee.com/mira.ai)。
