<p align="center">
  <img src="docs/agent-pantry-banner.svg" alt="Agent Pantry — 值得进入上下文的 Agent Skills" width="100%" />
</p>

<p align="center">
  <a href="https://github.com/HaoXuanAce/agent-pantry/actions/workflows/ci.yml"><img alt="质量门禁" src="https://github.com/HaoXuanAce/agent-pantry/actions/workflows/ci.yml/badge.svg" /></a>
  <a href="https://github.com/HaoXuanAce/agent-pantry/stargazers"><img alt="GitHub Stars" src="https://img.shields.io/github/stars/HaoXuanAce/agent-pantry?style=flat-square&color=c7ff2f&labelColor=11130f" /></a>
</p>

<p align="center">
  <strong>给编程 Agent 使用的、经过人工审阅的工作流。</strong><br />
  看得懂方法，装得进项目，得到可重复的结果，而不是再赌一次 Prompt 运气。
</p>

<p align="center">
  <a href="https://HaoXuanAce.github.io/agent-pantry/">在线目录</a> ·
  <a href="#快速开始">快速开始</a> ·
  <a href="README.en.md">English</a> ·
  <a href="GITHUB_PUBLISH_GUIDE.md">发布指南</a> ·
  <a href="CONTRIBUTING.md">参与贡献</a>
</p>

## 为什么做 Agent Pantry？

大部分 Skills 合集追求 README 里的数量。Agent Pantry 只关心一件事：这个 Skill 是否真正改变了 Agent 的工作方法。

每个 Skill 都包含：

- 明确的触发条件和不适用范围；
- 基于证据的分步工作流；
- 遇到风险或歧义时的停止条件；
- 可以检查的输出契约；
- 至少 4 个带明确预期的结构化评测场景；
- 零账号、零 API Key、零遥测。

当前提供 **14 个可以读完、可以审阅的 Skills**，而不是 800 条无法验证的 Prompt。`reviewed` 只表示说明和评测定义通过仓库检查，不代表已经取得模型 Benchmark 分数。

## 快速开始

使用通用 Skills CLI 直接从 GitHub 安装：

```bash
npx skills add HaoXuanAce/agent-pantry
```

只安装一个 Skill：

```bash
npx skills add HaoXuanAce/agent-pantry --skill bug-triage
```

也可以直接复制纯文本目录：

```bash
cp -R skills/bug-triage .agents/skills/bug-triage
```

仓库还包含一个可独立发布到 npm 的增强 CLI，发布后支持搜索、检查、验证和指定 Agent 安装：

```bash
npx agent-pantry inspect bug-triage
npx agent-pantry add bug-triage --agent codex
```

CLI 只会复制纯文本目录，不启动后台服务，Skill 安装时不会执行任何脚本。

## 60 秒试用

安装 `vibe-to-verified` 后，把一份真实的 AI 生成改动交给编程 Agent：

```text
对当前 diff 使用 vibe-to-verified。不要相信生成器摘要。
检查意外修改范围，确定最高风险等级，建立证据账本，挑战一个失败路径，
最后只给出 MERGE、REVISE 或 STOP，并说明证据。
```

更多可复制的 Skill 审计、线上事故调查和零停机迁移用法见[实战配方](examples/README.md)。

## 首批 Skills

| Skill | 解决的问题 | 主要产物 |
| --- | --- | --- |
| [`vibe-to-verified`](skills/vibe-to-verified) | 验收 AI 生成的代码 | 风险地图、证据账本、合并结论 |
| [`skill-supply-chain-auditor`](skills/skill-supply-chain-auditor) | 安装前审计 Skill | 能力清单、风险证据、安装结论 |
| [`repo-xray`](skills/repo-xray) | 快速理解陌生仓库 | 架构路径、修改范围、风险清单 |
| [`dependency-upgrade-surgeon`](skills/dependency-upgrade-surgeon) | 安全升级依赖 | 兼容矩阵、升级顺序、验证结果 |
| [`zero-downtime-db-migration`](skills/zero-downtime-db-migration) | 零停机数据库变更 | 迁移阶段、锁风险、恢复方案 |
| [`bug-triage`](skills/bug-triage) | 定位模糊或偶发故障 | 复现步骤、因果链、修复边界 |
| [`incident-response-investigator`](skills/incident-response-investigator) | 调查线上事故 | 时间线、假设树、止血结论 |
| [`pull-request-reviewer`](skills/pull-request-reviewer) | 只找真实缺陷的代码审查 | 分级问题、代码证据、测试缺口 |
| [`security-first-review`](skills/security-first-review) | 审计变更中的信任边界 | 攻击路径、证据、最小修复方案 |
| [`test-gap-hunter`](skills/test-gap-hunter) | 找到真正值得补的测试 | 风险矩阵、可执行测试规格 |
| [`api-contract-auditor`](skills/api-contract-auditor) | 发现 API 兼容性破坏 | 契约差异、消费者影响、迁移方案 |
| [`frontend-reconstruction`](skills/frontend-reconstruction) | 高质量还原视觉参考 | 响应式页面、真实状态、视觉验收 |
| [`browser-acceptance-evidence`](skills/browser-acceptance-evidence) | 证明浏览器用户旅程 | 旅程结果、截图、运行时证据 |
| [`release-readiness`](skills/release-readiness) | 判断版本能否上线 | 上线结论、灰度与回滚计划 |

## 组合包

增强 CLI 提供四个任务包：`trust-ai-code`、`ship-without-surprises`、`production-first-aid` 和 `safe-change-kit`。

```bash
npx agent-pantry pack list
npx agent-pantry pack add trust-ai-code --dry-run
```

## 兼容平台

项目使用开放的 [`SKILL.md`](https://agentskills.io/) 目录格式，支持 Codex、Claude Code、Cursor、Gemini CLI 和 GitHub Copilot。你也可以直接从 [`skills/`](skills) 复制任何目录。

## 本地开发

需要 Node.js 20.19+ 和 pnpm 10+：

```bash
pnpm install
pnpm dev
```

运行结构校验、类型检查和测试：

```bash
pnpm check
```

当前的 `reviewed` 表示结构和内容已通过仓库门禁，并不表示模型基准分数。评测场景、触发边界试点和未来基准发布要求见[评测政策](docs/EVALUATION.md)。

## 项目原则

1. **证据先于自信。** 结论应指向代码、命令或可观察行为。
2. **停止条件也是能力。** 好的自动化知道什么时候应该停下来。
3. **输出必须有契约。** “完成”的标准需要明确、可检查。
4. **保持可审阅。** 人类应该能在几分钟内读懂一个完整 Skill。

贡献新 Skill 前请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。这里按质量和独特价值收录，不为增加数量收录。

后续工程里程碑和候选工作流见公开的[路线图](ROADMAP.md)。

## 许可证

代码和 Skills 内容均采用 [MIT License](LICENSE)。
