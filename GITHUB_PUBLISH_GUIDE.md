# Agent Pantry：GitHub 建仓与发布完整指南

> 本指南按“中文为主、兼顾国际搜索”的策略编写。仓库首页使用中文 `README.md`，英文版保存在 `README.en.md`。步骤依据 2026 年 8 月的 GitHub 官方文档整理。

## 一、仓库应该叫什么？

### 首选名称

```text
agent-pantry
```

建议不要使用纯中文仓库名，也不要加 `awesome-`。`agent-pantry` 已经出现在网站路径、CLI 包名、品牌图和安装命令里，短、容易记，也包含 GitHub 用户会搜索的 `agent` 关键词。

只有在这个名称无法使用时，才按以下顺序考虑：

1. `agent-pantry-cn`
2. `trusted-agent-skills`
3. `agent-skills-pantry`

如果改用其他仓库名，必须执行本指南第三部分的统一配置命令，不能只修改 GitHub 仓库标题。

### GitHub Description

直接复制这一版：

```text
中文优先的 Agent Skills 工具箱：14 个可审阅工作流、结构化评测、任务包与安全安装 CLI。支持 Codex、Claude Code、Cursor、Gemini CLI 和 Copilot。
```

如果希望更短，可以使用：

```text
中文优先、可审阅、可验证的 Agent Skills 工具箱，支持主流编程 Agent。
```

### Website

仓库创建后填写：

```text
https://<你的GitHub用户名>.github.io/agent-pantry/
```

例如用户名是 `haoxuan-ai`：

```text
https://haoxuan-ai.github.io/agent-pantry/
```

### Topics

建议先添加下面 15 个，不要堆无关关键词：

```text
agent-skills
ai-agents
coding-agents
developer-tools
codex
claude-code
cursor
gemini-cli
github-copilot
code-review
debugging
security
typescript
vue
chinese
```

## 二、创建 GitHub 空仓库

1. 登录 GitHub。
2. 点击右上角 `+`，选择 **New repository**。
3. `Owner` 选择你的个人账号或组织。
4. `Repository name` 填写 `agent-pantry`。
5. `Description` 粘贴上面的中文描述。
6. `Visibility` 选择 **Public**。
7. **不要勾选** `Add a README file`。
8. `.gitignore template` 保持 **None**。
9. `License` 保持 **None**。
10. 点击 **Create repository**。

本地项目已经包含 README、`.gitignore` 和 MIT License。如果 GitHub 再生成一次，第一次推送时会产生不必要的历史冲突。GitHub 的官方建仓入口可参考 [Quickstart for repositories](https://docs.github.com/en/repositories/creating-and-managing-repositories/quickstart-for-repositories)。

## 三、把用户名和仓库地址写入项目

打开终端，进入项目目录：

```bash
cd /Users/haoxuan/Desktop/codex
```

执行统一配置。把 `<你的GitHub用户名>` 换成真实用户名：

```bash
pnpm repo:configure <你的GitHub用户名> agent-pantry
```

示例：

```bash
pnpm repo:configure haoxuan-ai agent-pantry
```

这个命令会统一更新：

- 中英文 README 的安装命令和徽章；
- GitHub Pages 地址；
- 网站顶部和底部的仓库链接；
- Open Graph 与 Twitter 分享图片地址；
- Vite 的 Pages 基础路径；
- CLI 的 npm 包仓库、主页和 Issues 地址；
- 私密安全报告入口。

执行完成后检查：

```bash
pnpm check
```

正确结果应包含：

```text
Validated 14 skills and 4 packs.
Test Files  1 passed
Tests  8 passed
```

## 四、初始化 Git 并创建第一次提交

确认当前目录：

```bash
pwd
```

输出应该是：

```text
/Users/haoxuan/Desktop/codex
```

初始化 `main` 分支：

```bash
git init -b main
```

查看将要提交的文件：

```bash
git status
```

以下目录不应该进入提交：

- `node_modules/`
- `dist/`
- `.firecrawl/`
- `.eval-review/`
- `packages/cli/catalog/`

添加文件：

```bash
git add .
```

再次检查：

```bash
git status
```

创建第一次提交：

```bash
git commit -m "feat: launch Agent Pantry"
```

如果 Git 提示没有配置身份，只需设置你自己的名字和 GitHub 邮箱，然后重新提交：

```bash
git config user.name "你的名字"
git config user.email "你的GitHub邮箱"
```

不希望暴露真实邮箱时，可以在 GitHub 的 **Settings → Emails** 中找到 `noreply` 邮箱。

## 五、连接 GitHub 并推送

HTTPS 方式：

```bash
git remote add origin https://github.com/<你的GitHub用户名>/agent-pantry.git
git push -u origin main
```

如果已经配置 SSH，也可以使用：

```bash
git remote add origin git@github.com:<你的GitHub用户名>/agent-pantry.git
git push -u origin main
```

检查远程地址：

```bash
git remote -v
```

不要把 Personal Access Token 写进远程 URL、README、`.env` 或命令历史。

### 可选：使用 GitHub CLI 一步建仓并推送

如果安装并登录了 `gh`，可以不走网页建仓流程：

```bash
gh repo create agent-pantry --public --source=. --remote=origin --push --description "中文优先的 Agent Skills 工具箱：14 个可审阅工作流、结构化评测、任务包与安全安装 CLI。"
```

网页方式和 `gh` 方式二选一，不要重复创建仓库。

## 六、确认 CI 通过

1. 打开仓库的 **Actions** 标签页。
2. 找到 **Quality gates** 工作流。
3. 等待绿色对勾。
4. 如果失败，打开失败步骤查看日志，不要通过删除测试或关闭工作流获得绿色状态。

质量门禁会运行：

- 14 个 Skills 和 4 个 Packs 的一致性校验；
- Vue 与 CLI 的 TypeScript 检查；
- CLI 自动化测试；
- Vue 和 CLI 构建；
- npm 发布包内容检查。

第一次成功后，README 顶部的 `Quality gates` 徽章会自动变绿。

## 七、开启并发布 GitHub Pages

项目已经包含 `.github/workflows/pages.yml`，不需要在 GitHub 网页中生成新的 Jekyll 工作流。

1. 进入仓库 **Settings**。
2. 左侧进入 **Pages**。
3. 在 **Build and deployment** 中，把 `Source` 选择为 **GitHub Actions**。
4. 进入仓库 **Actions**。
5. 打开 **Deploy catalog to GitHub Pages**。
6. 如果它没有自动运行，点击 **Run workflow**，选择 `main` 后确认。
7. 等待部署完成。
8. 回到 **Settings → Pages**，复制显示的网站地址。

预期地址：

```text
https://<你的GitHub用户名>.github.io/agent-pantry/
```

GitHub 官方流程见 [Configuring a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) 和 [Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

部署后至少检查：

- 首页能打开，不是 404；
- 14 个 Skill 卡片全部存在；
- 搜索和阶段筛选可用；
- 点击卡片可以打开详情；
- 复制安装命令正常；
- 带 `?skill=vibe-to-verified` 的链接可以直接打开指定 Skill；
- 手机宽度下没有横向溢出。

## 八、完善仓库 About 区域

回到仓库 **Code** 首页，点击右侧 **About** 旁的齿轮：

1. `Description` 填写中文描述。
2. `Website` 填写 GitHub Pages 地址。
3. 添加本指南第一部分的 Topics。
4. 勾选 **Releases**。
5. 可以勾选 **Packages**，准备发布 npm CLI 时会用到。
6. 保存。

Topics 能帮助 GitHub 对仓库进行分类，官方说明见 [Classifying your repository with topics](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics)。

## 九、上传社交分享图

仓库已经生成：

```text
docs/agent-pantry-social.png
```

设置步骤：

1. 进入 **Settings → General**。
2. 找到 **Social preview**。
3. 点击 **Edit** 或 **Upload an image**。
4. 上传 `docs/agent-pantry-social.png`。
5. 保存后，把仓库链接发到一个聊天窗口，确认预览图正常。

不要上传网站截图代替品牌图，当前图片已经针对仓库分享卡片排版。官方说明见 [Customizing your repository's social media preview](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview)。

## 十、打开社区功能

进入 **Settings → General → Features**：

- 保持 **Issues** 开启；
- 建议开启 **Discussions**；
- 暂时关闭 Wiki，文档统一放在仓库；
- 不需要 Projects 时先不启用，减少空栏目。

项目已经准备好：

- Bug Report 表单；
- Skill Proposal 表单；
- 私密安全报告链接；
- Pull Request 检查清单；
- 贡献规范；
- 安全政策；
- 路线图。

建议在 Discussions 创建两个置顶讨论：

1. `你最希望新增哪个 Agent Skill？`
2. `Showcase：你用 Agent Pantry 完成了什么？`

## 十一、设置合并方式和分支保护

先等第一次 CI 成功，再进行这一部分。

### 合并方式

进入 **Settings → General → Pull Requests**：

- 开启 **Allow squash merging**；
- 建议关闭 merge commit，保持历史简洁；
- 可开启 **Automatically delete head branches**。

### 分支保护

进入 **Settings → Rules → Rulesets**：

1. 点击 **New ruleset → New branch ruleset**。
2. 名称填写 `Protect main`。
3. Enforcement status 选择 **Active**。
4. Target branches 添加默认分支 `main`。
5. 开启阻止删除和阻止强制推送。
6. 开启合并前必须通过状态检查。
7. 选择 CI 中的 `check` 状态。
8. 如果你愿意所有改动都走 PR，再开启必须通过 Pull Request。

你是唯一维护者且仍在快速调整时，可以暂时不要求 PR，但仍应阻止删除和强制推送。

## 十二、创建第一个 Release

等 CI、Pages 和 README 全部确认后再发 Release。

1. 进入仓库右侧 **Releases**。
2. 点击 **Draft a new release**。
3. 新建标签 `v0.1.0`，目标选择 `main`。
4. 标题填写：

```text
Agent Pantry v0.1.0 — 中文优先的 Agent Skills 工具箱
```

5. Release 内容可以复制：

```markdown
Agent Pantry 首次公开发布。

- 14 个可审阅 Agent Skills
- 4 个任务组合包
- 支持 Codex、Claude Code、Cursor、Gemini CLI 和 GitHub Copilot
- 每个 Skill 至少 4 个结构化评测场景
- 提供搜索、检查、dry-run、diff 和安全替换 CLI
- 提供 Vue 在线目录与中英文文档

重点 Skills：vibe-to-verified、skill-supply-chain-auditor、zero-downtime-db-migration、incident-response-investigator。
```

6. 不勾选 prerelease。
7. 点击 **Publish release**。

GitHub Release 官方流程见 [Managing releases](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository)。

注意：普通仓库 Release 使用 `v0.1.0`。CLI 的 npm 发布工作流使用另一种标签 `cli-v0.1.0`，不要在还没准备 npm Token 和包名时创建这个标签。

## 十三、npm CLI 发布以后再做

GitHub 仓库上线不依赖 npm，建议先获得真实用户反馈，再发布 CLI。

发布前需要：

1. 在 npmjs.com 确认 `agent-pantry` 包名是否可用。
2. 登录 npm 并启用双重验证。
3. 在 GitHub **Settings → Secrets and variables → Actions** 添加 `NPM_TOKEN`。
4. 确认 `packages/cli/package.json` 版本正确。
5. 确认 `pnpm check` 和打包检查通过。
6. 创建并推送与版本完全一致的标签：

```bash
git tag cli-v0.1.0
git push origin cli-v0.1.0
```

这会触发 `.github/workflows/release-cli.yml`。发布前不要测试性地创建 `cli-v*` 标签，因为它代表真实 npm 发布意图。

## 十四、首次推广文案

### GitHub / V2EX / 掘金版

```text
我做了一个中文优先的 Agent Skills 工具箱：Agent Pantry。

它不是几百条 Prompt 的堆积，而是 14 个可以完整读完的工作流。每个 Skill 都有明确触发条件、停止条件、输出契约和至少 4 个结构化评测场景。

目前包含 AI 生成代码验收、Skill 供应链审计、依赖升级、零停机数据库迁移、线上事故调查、代码审查、测试缺口分析和发布检查等工作流，支持 Codex、Claude Code、Cursor、Gemini CLI 与 Copilot。

项目完全开源、无账号、无遥测，也没有用虚构的 98 分包装质量。

仓库：<你的仓库地址>
在线目录：<你的Pages地址>

欢迎试用、提 Issue，也欢迎告诉我你最需要哪个 Skill。
```

### 简短版本

```text
Agent Pantry：中文优先、可审阅、可验证的 Agent Skills 工具箱。14 个真实开发工作流，支持主流编程 Agent，无账号、无遥测。欢迎试用和提 Skill 建议：<仓库地址>
```

推广时优先展示一个具体问题如何被解决，例如“如何验收 AI 一次生成的 30 文件改动”，不要只发仓库链接或 Skills 数量。

## 十五、让仓库持续获得 Star 的工作节奏

### 上线当天

- 确认 CI 和 Pages 为绿色；
- 发布 `v0.1.0`；
- 在个人 GitHub Profile 置顶仓库；
- 发布一篇包含真实用例的中文介绍；
- 回复每一个 Issue 和 Discussion。

### 第一周

- 收集至少 3 个真实使用反馈；
- 把反馈转成公开 Issue；
- 修复安装和文档摩擦；
- 发布一个实际输出示例，而不是继续盲目增加 Skills；
- 给路线图中的小任务增加 `good first issue` 标签。

### 后续每次发布

- 一次只解决一个清晰问题；
- Release Notes 说明新增能力和验证证据；
- 不发布无法复现的模型评分；
- 不为了数量加入重复 Skills；
- 把用户案例补进 `examples/`。

Star 无法被保证，但可以通过“打开仓库立即看懂、复制命令立即能用、质量声明可以复查”显著提高转化。

## 十六、最终上线检查清单

- [ ] 仓库名是 `agent-pantry`
- [ ] 仓库为 Public
- [ ] Description 以中文开头
- [ ] `README.md` 首页是中文
- [ ] `README.en.md` 可以正常切换
- [ ] 已运行 `pnpm repo:configure <用户名> agent-pantry`
- [ ] `pnpm check` 通过
- [ ] `main` 已推送
- [ ] Quality gates 为绿色
- [ ] Pages Source 设置为 GitHub Actions
- [ ] 在线目录可以打开
- [ ] About 的 Website 和 Topics 已填写
- [ ] Social preview 已上传
- [ ] Issues 和 Discussions 已开启
- [ ] `main` 禁止强制推送和删除
- [ ] 发布了 `v0.1.0`
- [ ] 个人主页已置顶仓库
- [ ] 第一篇推广内容包含真实用例

