# 微信小程序官方检查入口

最后核对：2026-08-12。提审前以当前平台控制台和官方文档为准。

- [小程序产品与运营文档](https://developers.weixin.qq.com/miniprogram/product/)：核对发布、运营与平台能力入口。
- [用户隐私保护指引](https://developers.weixin.qq.com/miniprogram/dev/framework/user-privacy/)：建立隐私接口与声明清单。
- [隐私授权接口说明](https://developers.weixin.qq.com/miniprogram/dev/framework/user-privacy/PrivacyAuthorize.html)：核对授权时机、接口行为与失败路径。

使用时把代码实际调用、第三方依赖、平台声明和用户同意状态逐项对应。文档入口不能替代目标 AppID 控制台中的真实配置。
