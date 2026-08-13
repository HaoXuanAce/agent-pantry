# Agent Pantry CLI：npm 首次发布与后续自动发布指南

> 适用于当前仓库 `HaoXuanAce/agent-pantry`。本流程按 2026 年 8 月 npm 官方规则设计：首次发布使用一次性 Granular Access Token 在 GitHub Actions 中建立包，成功后立即切换到 OIDC Trusted Publishing，后续不保存 npm 发布令牌。

## 0. 当前状态

已经确认：

- npm 包名：`agent-pantry`
- 当前版本：`0.1.0`
- CLI 命令名：`agent-pantry`
- GitHub 仓库：`https://github.com/HaoXuanAce/agent-pantry`
- npm 包名查询时间：2026-08-12 18:29（Asia/Shanghai）
- 查询结果：Registry 返回 `404 Not Found`，当时没有同名包
- `npm publish --dry-run --access public`：通过
- 发布包大小：约 89.3 kB
- 解压后大小：约 260.8 kB
- 发布文件：57 个
- 质量门禁：21 Skills、7 Packs、类型检查和 8 个 CLI 测试全部通过
- 当前机器未登录 npm
- 当前机器的默认 npm 缓存目录存在权限问题，但 GitHub Actions 不受影响

包名可用性不是预留。只有第一次发布成功，`agent-pantry` 才真正归你的 npm 账号管理。因此不要长时间停留在“Token 已创建但没有运行工作流”的状态。

## 1. 为什么分成首次发布和后续发布？

npm Trusted Publisher 需要先进入一个已经存在的 npm 包的 Settings 页面进行绑定。新包还不存在时无法完成这个设置。

因此采用：

1. **首次发布 `0.1.0`**：使用有效期一天的 Granular Token，通过 GitHub Actions 发布并生成 provenance。
2. **发布成功后**：立即绑定 `release-cli.yml` 为 Trusted Publisher。
3. **清理 Token**：同时从 GitHub 和 npm 删除。
4. **以后发布**：只推送 `cli-v<版本>` 标签，GitHub Actions 使用 OIDC 短期凭据发布。

npm 官方推荐优先使用 [Trusted Publishing](https://docs.npmjs.com/trusted-publishers/)，因为它不需要长期 Token，并且会自动生成 provenance。

## 2. 发布前必须满足的条件

逐项确认：

- [ ] GitHub 仓库是 Public
- [ ] 本地 `main` 已连接 `origin/main`
- [ ] `apps/web/src/config.ts` 中 owner 是 `HaoXuanAce`
- [ ] `packages/cli/package.json` 的 repository 指向 `HaoXuanAce/agent-pantry`
- [ ] npm 账号邮箱已经验证
- [ ] npm 账号已开启 2FA
- [ ] 你可以进入 GitHub 仓库的 Settings 和 Actions

如果 GitHub 用户名不是 `HaoXuanAce`，停止发布，先运行：

```bash
pnpm repo:configure <真实GitHub用户名> agent-pantry
pnpm check
```

provenance 要求 `package.json` 中的公开仓库地址和实际发布来源精确匹配，包括用户名大小写。

## 3. 创建或检查 npm 账号

1. 打开 [npmjs.com](https://www.npmjs.com/)。
2. 登录；没有账号就创建账号。
3. 完成邮箱验证。
4. 点击右上角头像，进入 **Account**。
5. 找到 **Two-Factor Authentication**。
6. 开启 2FA，至少保护授权和发布操作。
7. 保存恢复码到密码管理器，不要放进仓库、Issue、聊天截图或 `.env`。

当前 npm 要求新建和发布包时使用 2FA，或者使用开启 Bypass 2FA 的 Granular Access Token。官方说明见 [Requiring 2FA for package publishing](https://docs.npmjs.com/requiring-2fa-for-package-publishing-and-settings-modification/)。

## 4. 创建只使用一次的 Granular Access Token

这个 Token 只负责首次发布。发布成功后必须撤销。

1. 登录 npmjs.com。
2. 点击头像。
3. 进入 **Access Tokens**。
4. 点击 **Generate New Token**。
5. 选择 **Granular Access Token**。
6. 按下面的值填写：

| 字段 | 精确值 |
| --- | --- |
| Token name | `agent-pantry-bootstrap` |
| Expiration | 1 day，或者页面允许的最短时间 |
| Bypass two-factor authentication | 开启 |
| Allowed IP ranges | 留空 |
| Packages and scopes permissions | Read and write |
| Select packages | All Packages |
| Organizations permissions | No access |

7. 点击生成 Token。
8. 立即复制 Token，页面关闭后通常不会再次显示。
9. 不要把 Token 粘贴到终端、代码、README、Issue 或聊天中。

首次包还不存在，所以无法从列表中单独选择 `agent-pantry`，需要临时选择 **All Packages**。正因为权限较宽，必须设置最短有效期并在发布后立即删除。npm 官方创建字段见 [Creating granular access tokens](https://docs.npmjs.com/creating-and-viewing-access-tokens/)。

## 5. 把 Token 放入 GitHub Actions Secret

1. 打开 `https://github.com/HaoXuanAce/agent-pantry`。
2. 进入 **Settings**。
3. 左侧选择 **Secrets and variables → Actions**。
4. 点击 **New repository secret**。
5. Name 精确填写：

```text
NPM_TOKEN
```

6. Secret 粘贴刚才复制的 npm Token。
7. 点击 **Add secret**。

Secret 名称区分拼写。工作流只读取 `NPM_TOKEN`，写成 `npm_token` 或 `NODE_AUTH_TOKEN` 都不会生效。

## 6. 提交已经准备好的发布文件

当前本地已经准备：

- `.github/workflows/bootstrap-npm.yml`：只用于首次发布；
- `.github/workflows/release-cli.yml`：后续 OIDC 发布；
- `packages/cli/package.json`：中文描述与 public registry 设置；
- `packages/cli/README.md`：npm 包中文首页；
- 本文档。

在本地执行：

```bash
cd /Users/haoxuan/Desktop/codex
pnpm check
git status
```

确认检查通过后添加文件：

```bash
git add .github/workflows/bootstrap-npm.yml
git add .github/workflows/release-cli.yml
git add packages/cli/package.json
git add packages/cli/README.md
git add package.json
git add README.md README.en.md
git add NPM_PUBLISH_GUIDE.md
git add GITHUB_PUBLISH_GUIDE.md
```

如果 `git status` 还显示 `apps/web/` 下的其他修改，那些不是 npm 发布工作流必需文件。确认它们的内容后另行提交，不要为了发布 CLI 把不确定的网页改动一起暂存。

提交并推送：

```bash
git commit -m "ci: prepare secure npm publishing"
git push origin main
```

等待 GitHub 的 **Quality gates** 变成绿色。不要在 CI 失败时继续发布。

## 7. 发布前最后检查一次包名

在本地执行：

```bash
npm view agent-pantry name version --json --cache /private/tmp/agent-pantry-npm-check-cache
```

预期仍然是 `E404 Not Found`。这里的 404 表示包尚不存在，是首次发布前的正确结果。

如果返回了其他人的包信息，停止操作。不要尝试覆盖；改用 scoped 包或更换名称。

## 8. 从 GitHub Actions 发布 0.1.0

1. 打开 GitHub 仓库。
2. 点击 **Actions**。
3. 左侧选择 **Bootstrap npm package**。
4. 点击右侧 **Run workflow**。
5. Branch 选择 `main`。
6. Confirmation 输入框必须精确填写：

```text
publish-agent-pantry-0.1.0
```

7. 点击绿色 **Run workflow**。
8. 打开刚创建的工作流运行。
9. 逐步确认下面的任务为绿色：

```text
Check out repository
Set up pnpm
Set up Node.js
Install dependencies
Run quality gates
Confirm version is not already published
Publish first version with provenance
```

成功日志的最后部分应该出现：

```text
+ agent-pantry@0.1.0
```

如果 confirmation 拼错，publish job 会显示 skipped，这是安全保护，不代表发布成功。

## 9. 验证 npm 页面和真实 CLI

工作流成功后等待 1 到 3 分钟，然后打开：

```text
https://www.npmjs.com/package/agent-pantry
```

检查页面是否显示：

- `agent-pantry`
- `0.1.0`
- 中文 README
- MIT License
- GitHub Repository 链接
- Provenance 信息

查询 Registry：

```bash
npm view agent-pantry name version description dist-tags.latest repository.url --json --cache /private/tmp/agent-pantry-npm-check-cache
```

测试版本和目录：

```bash
npx --cache /private/tmp/agent-pantry-npm-test-cache --yes agent-pantry@0.1.0 --version
npx --cache /private/tmp/agent-pantry-npm-test-cache --yes agent-pantry@0.1.0 doctor
npx --cache /private/tmp/agent-pantry-npm-test-cache --yes agent-pantry@0.1.0 list
```

预期版本：

```text
0.1.0
```

测试结构验证：

```bash
npx --cache /private/tmp/agent-pantry-npm-test-cache --yes agent-pantry@0.1.0 verify vibe-to-verified
```

预期包含：

```text
1/1 skills passed structural verification.
```

测试真实安装预览，但不写文件：

```bash
mkdir -p /private/tmp/agent-pantry-user-test
cd /private/tmp/agent-pantry-user-test
npx --cache /private/tmp/agent-pantry-npm-test-cache --yes agent-pantry@0.1.0 add vibe-to-verified --agent codex --dry-run
npx --cache /private/tmp/agent-pantry-npm-test-cache --yes agent-pantry@0.1.0 pack add trust-ai-code --agent codex --dry-run
```

最后应显示：

```text
Dry run only. No files were written.
```

## 10. 立即配置 Trusted Publisher

首次包存在后，立刻切换到无 Token 发布。

1. 登录 npmjs.com。
2. 打开 `agent-pantry` 包页面。
3. 进入 **Settings**。
4. 找到 **Trusted Publisher**。
5. 选择 **GitHub Actions**。
6. 精确填写：

| npm 字段 | 精确值 |
| --- | --- |
| Organization or user | `HaoXuanAce` |
| Repository | `agent-pantry` |
| Workflow filename | `release-cli.yml` |
| Environment name | 留空 |
| Allowed actions | 勾选 `npm publish` |

7. 保存。

注意：

- Workflow filename 只能填文件名，不能填 `.github/workflows/release-cli.yml`。
- 必须包含 `.yml` 后缀。
- 用户名、仓库名、工作流文件名均按精确值匹配。
- 2026-05-20 之后创建的 Trusted Publisher 必须明确选择至少一种 Allowed action。
- 一个 npm 包同一时间只能配置一个 Trusted Publisher。

## 11. 删除首次发布 Token 和工作流

按这个顺序清理：

### 11.1 删除 GitHub Secret

1. GitHub 仓库进入 **Settings → Secrets and variables → Actions**。
2. 找到 `NPM_TOKEN`。
3. 点击删除并确认。

### 11.2 撤销 npm Token

1. npmjs.com 点击头像进入 **Access Tokens**。
2. 找到 `agent-pantry-bootstrap`。
3. 点击删除或 Revoke。
4. 确认它不再出现在有效 Token 列表。

### 11.3 删除 bootstrap 工作流

本地执行：

```bash
cd /Users/haoxuan/Desktop/codex
git rm .github/workflows/bootstrap-npm.yml
git commit -m "ci: remove npm bootstrap publisher"
git push origin main
```

不要删除 `.github/workflows/release-cli.yml`，它是以后正常发布使用的 OIDC 工作流。

## 12. 以后如何发布新版本

以下示例把 `0.1.0` 升级到 `0.1.1`。

### 12.1 修改版本

```bash
cd /Users/haoxuan/Desktop/codex/packages/cli
npm version patch --no-git-tag-version
cd /Users/haoxuan/Desktop/codex
```

确认版本：

```bash
node -p "require('./packages/cli/package.json').version"
```

应该输出：

```text
0.1.1
```

### 12.2 更新变更记录并检查

把本次变化写入 `CHANGELOG.md`，然后运行：

```bash
pnpm check
cd /Users/haoxuan/Desktop/codex/packages/cli
npm publish --dry-run --access public --cache /private/tmp/agent-pantry-npm-publish-cache
cd /Users/haoxuan/Desktop/codex
```

检查 dry-run 中的 name、version、文件列表和大小。

不要在 monorepo 根目录执行 `npm publish`，也不要使用 `npm publish --prefix packages/cli`。npm 的 `--prefix` 在这个场景可能仍预览根包。根 `package.json` 已加入 `prepublishOnly` 保护，错误位置发布会主动失败。

### 12.3 提交 main

```bash
git add packages/cli/package.json CHANGELOG.md
git commit -m "release: prepare agent-pantry 0.1.1"
git push origin main
```

先等 main 上的 Quality gates 成功。

### 12.4 创建精确匹配的标签

```bash
git tag -a cli-v0.1.1 -m "agent-pantry 0.1.1"
git push origin cli-v0.1.1
```

`release-cli.yml` 会检查：

```text
标签 cli-v0.1.1 == package.json 版本 0.1.1
```

不匹配就拒绝发布。不要删除后重新使用已经发布过的版本号；npm 版本发布后不可覆盖。

### 12.5 检查 OIDC 发布

进入 GitHub Actions 的 **Publish CLI**，确认：

- `Verify tag and package versions match` 通过；
- `Run quality gates` 通过；
- `Publish with trusted publishing` 通过；
- 工作流中没有 `NPM_TOKEN`；
- npm 新版本页面显示 provenance。

Trusted Publishing 会自动生成 provenance，不需要再写 `--provenance`。OIDC 只在发布命令执行时生成短期凭据，`npm whoami` 不会显示这种身份。

## 13. 常见失败及精确处理

### ENEEDAUTH / Unable to authenticate

首次发布时检查：

- GitHub Secret 名字是否精确为 `NPM_TOKEN`；
- Token 是否过期或被撤销；
- Token 是否为 Read and write；
- 是否开启 Bypass 2FA。

后续 Trusted Publishing 检查：

- npm 中 Workflow filename 是否精确为 `release-cli.yml`；
- `.github/workflows/release-cli.yml` 是否存在于发布的 GitHub 仓库；
- workflow 是否有 `id-token: write`；
- runner 是否为 GitHub-hosted `ubuntu-latest`；
- repository URL 是否精确指向 `HaoXuanAce/agent-pantry`。

### E403：需要 2FA

首次 Token 没有开启 Bypass 2FA，重新生成符合第四部分设置的短期 Token。不要关闭账号 2FA。

### E403：没有权限发布这个包

可能是：

- 包名在发布前被别人占用；
- npm 登录账号与 Token 所属账号不一致；
- Token 没有 All Packages 的 Read and write 权限。

不要尝试覆盖他人的包。

### 版本已经存在

npm 不允许覆盖已经发布的同版本。修改 `packages/cli/package.json`，发布更高版本。

### Provenance 失败

检查：

- GitHub 仓库必须是 Public；
- `repository.url` 必须与 GitHub 来源匹配；
- 必须从 GitHub-hosted runner 发布；
- workflow 必须具有 `id-token: write`。

### 本地 npm 出现 `.npm` 权限错误

本机当前存在这个问题。不要为了发布去修改整个用户目录权限，使用本指南命令中的临时缓存参数即可：

```text
--cache /private/tmp/agent-pantry-npm-test-cache
```

正式发布发生在干净的 GitHub-hosted runner，不使用本机缓存。

## 14. 完成检查清单

- [ ] npm 账号邮箱已验证
- [ ] npm 账号已开启 2FA
- [ ] `agent-pantry` 仍未被占用
- [ ] 一天有效期的 bootstrap Token 已创建
- [ ] GitHub Secret 精确命名为 `NPM_TOKEN`
- [ ] 发布准备提交已推送到 main
- [ ] Quality gates 为绿色
- [ ] Bootstrap confirmation 精确输入
- [ ] `agent-pantry@0.1.0` 发布成功
- [ ] npm 页面显示中文 README、GitHub 链接和 provenance
- [ ] `npx agent-pantry@0.1.0 --version` 返回 `0.1.0`
- [ ] `verify`、单 Skill dry-run 和 Pack dry-run 通过
- [ ] npm Trusted Publisher 已绑定 `release-cli.yml`
- [ ] Allowed actions 已勾选 `npm publish`
- [ ] GitHub `NPM_TOKEN` Secret 已删除
- [ ] npm bootstrap Token 已撤销
- [ ] `bootstrap-npm.yml` 已从 main 删除
- [ ] 后续发布只使用 `cli-v<版本>` 标签
