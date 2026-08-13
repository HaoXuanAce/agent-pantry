# 支付渠道官方契约入口

最后核对：2026-08-12。平台规则可能更新，实施前重新打开目标接口的当前版本，不要只依赖本文件摘要。

## 微信支付 API v3

- [签名验证](https://pay.weixin.qq.com/doc/v3/merchant/4012365342)：核对平台证书、请求头、签名串和原始报文要求。
- [支付通知 API](https://pay.weixin.qq.com/doc/v3/merchant/4012791861)：核对通知结构、解密、响应和重试契约。
- [支付回调和查单关系](https://pay.weixin.qq.com/doc/v3/merchant/4012081606)：设计回调缺失时的主动查询与确认路径。

## 支付宝开放平台

- [异步通知说明](https://opendocs.alipay.com/open/194/103296)：核对通知参数、验签、业务字段与成功响应。
- [异步通知常见问题](https://opendocs.alipay.com/support/01raw8)：排查通知接收、重试和配置问题。
- [签名验签工具与说明](https://opendocs.alipay.com/common/02khjo)：确认当前接口的待验签内容和算法，而不是自行重建规则。

## 使用方式

只加载当前项目实际使用的渠道和 API 版本。官方契约与仓库实现不一致时，把差异列为阻断项，不自动混合两个版本的规则。
