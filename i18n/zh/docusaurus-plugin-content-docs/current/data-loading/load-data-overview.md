---
title: 数据加载概况
---

# 数据加载概览

Cloudberry Database 主要通过加载工具将外部数据转换为外部表来加载数据。然后从这些外部表中读取数据，或将数据写入外部表中，以此实现外部数据加载。

## 数据加载流程

加载数据进入 Cloudberry Database 的一般流程如下：

1. 评估数据加载场景（例如数据源位置、数据类型和数据量），并选择合适的加载工具。
2. 配置和启用加载工具。
3. 创建外部表，指定 `CREATE EXTERNAL TABLE` 语句中的加载工具协议、数据源地址和数据格式。
4. 创建外部表后，可以直接使用 `SELECT` 语句查询外部表中的数据，或者使用 `INSERT INTO SELECT` 语句从外部表中导入数据。

## 加载方法和场景

Cloudberry Database 提供了多种数据加载解决方案，你可以根据不同的数据源选择不同的数据加载方法。

| 加载方法              | 数据源                                                 | 数据格式                                                  | 是否并行 |
| -------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------ | -------- |
| [`copy`](/i18n/zh/docusaurus-plugin-content-docs/current/data-loading/load-data-using-copy.md)                     | 本地文件系统<br /><br />• Coordinator 节点主机（对于单文件）<br />• Segment 节点主机（对于多文件） | • TXT<br />• CSV<br />• 二进制                                             | 否       |
| [`file://` 协议](/i18n/zh/docusaurus-plugin-content-docs/current/data-loading/load-data-using-file-protocol.md)         | 本地文件系统（本地 Segment 主机，仅超级用户可访问） | • TXT<br />• CSV                                             | 是      |
| [`gpfdist`](/i18n/zh/docusaurus-plugin-content-docs/current/data-loading/load-data-using-gpfdist.md)    |  本地主机文件或者通过内网可访问的文件  | • TXT<br />• CSV<br />• `FORMAT` 子句支持的任意分隔文本格式<br />• XML 和 JSON（需要通过 YAML 配置文件转换为文本格式） | 是     |               |
| [使用 `gpload` 批量加载](/i18n/zh/docusaurus-plugin-content-docs/current/data-loading/load-data-using-gpload.md)（使用 `gpfdists` 为底层工作组件） |  本地主机文件或者可通过内网访问的文件  | • TXT<br />• CSV<br />• `FORMAT` 子句支持的任意分隔文本格式<br />• XML 和 JSON（需要通过 YAML 配置文件转换为文本格式） | 是      |
| [创建外部 Web 表](/i18n/zh/docusaurus-plugin-content-docs/current/data-loading/load-data-from-web-services.md)         | 从网络服务或可通过命令行访问的任意来源提取的数据 | • TXT<br />• CSV                                             | 是      |