# Agent Pantry CLI

中文优先的 Agent Skills 检查与安装工具，支持 Codex、Claude Code、Cursor、Gemini CLI 和 GitHub Copilot。

```bash
npx agent-pantry list
npx agent-pantry inspect vibe-to-verified
npx agent-pantry add vibe-to-verified --agent codex --dry-run
npx agent-pantry add vibe-to-verified --agent codex
```

## 为什么使用它？

- Skills 是可直接阅读的纯文本目录；
- 安装前验证 `SKILL.md` 和结构化评测；
- `--dry-run` 会显示目标位置和文件变化；
- `diff` 可以在覆盖前检查本地修改；
- 默认不覆盖已安装 Skill；
- 替换时先验证和暂存，再交换准确的目标目录；
- 无账号、无 API Key、无后台服务、无遥测；
- 安装时不会执行 Skill 内的脚本。

## 安全更新

先比较当前安装与新版本：

```bash
npx agent-pantry diff vibe-to-verified --agent codex
npx agent-pantry add vibe-to-verified --agent codex --force
```

只删除指定 Agent 路径下的指定 Skill：

```bash
npx agent-pantry remove vibe-to-verified --agent codex --yes
```

## 任务包

```bash
npx agent-pantry pack list
npx agent-pantry pack add trust-ai-code --agent codex --dry-run
```

## 完整命令

```text
agent-pantry list [--phase <name>]
agent-pantry search <query>
agent-pantry inspect <skill>
agent-pantry add <skill> --agent <agent> [--global] [--force] [--dry-run]
agent-pantry diff <skill> --agent <agent> [--global]
agent-pantry remove <skill> --agent <agent> [--global] --yes
agent-pantry pack list
agent-pantry pack add <pack> --agent <agent> [--global] [--force] [--dry-run]
agent-pantry verify [skill]
agent-pantry doctor
```

完整项目、Skills 源码和英文文档请访问 [Agent Pantry on GitHub](https://github.com/HaoXuanAce/agent-pantry)。
