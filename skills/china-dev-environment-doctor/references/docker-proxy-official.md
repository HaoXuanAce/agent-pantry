# Docker 代理官方入口

最后核对：2026-08-12。

- [Docker CLI proxy configuration](https://docs.docker.com/engine/cli/proxy/)：核对客户端配置、构建参数、容器环境与敏感信息风险。

Docker CLI、daemon、Docker Desktop、BuildKit 和容器本身可能处于不同网络上下文。遇到 `curl` 正常但 `docker pull` 失败时，先确定真正发起请求的主体，再读取该主体的官方代理配置说明。

不要把代理凭据写入镜像层、公开日志或仓库，也不要通过关闭 TLS 校验制造“成功”。
