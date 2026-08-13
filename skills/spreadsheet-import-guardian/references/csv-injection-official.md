# CSV 公式注入安全参考

最后核对：2026-08-12。

- [OWASP CSV Injection](https://owasp.org/www-community/attacks/CSV_Injection)：理解电子表格把非可信单元格解释为公式的风险与常见危险前缀。
- [OWASP Web Security Testing Guide: CSV Injection](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/21-Testing_for_CSV_Injection)：设计导出、下载和目标客户端验证用例。

CSV 引号解决的是分隔符转义，不是公式执行。防护方式必须结合实际目标客户端和产品对原始值保真的要求验证。
