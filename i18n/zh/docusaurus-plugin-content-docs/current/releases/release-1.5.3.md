---
title: 1.5.3
---

# Cloudberry Database v1.5.3 发版说明

版本号: v1.5.3

Cloudberry Database v1.5.3 是一个小版本更新，包含了一些提升改进、 bug 修复和文档更新。

快速试用: [v1.5.3](https://github.com/cloudberrydb/cloudberrydb/releases/tag/1.5.3)

:::note

如使用源码部署 1.5.3 版本的 Cloudberry Database，请在执行[构建 Cloudberry Database](/i18n/zh/docusaurus-plugin-content-docs/current/cbdb-linux-compile.md#第-4-步构建-cloudberry-database)中的 `./configure` 文件前运行以下命令，以安装所需的依赖。

```
yum install -y go
export GOPROXY=https://goproxy.io,direct
```

在后续版本中，我们使用 Python 重构了相关模块（见 PR [#435](https://github.com/cloudberrydb/cloudberrydb/pull/435)）。因此，如果你使用最新源码进行编译，可以略过上述命令。
:::


完整更新日志: [https://github.com/cloudberrydb/cloudberrydb/compare/1.5.2...1.5.3](https://github.com/cloudberrydb/cloudberrydb/compare/1.5.2...1.5.3)

## 新功能

- Directory Table（目录表）

    自 v1.5.3 版本起，Cloudberry Database 引入了 Directory Table，用于统一纳管对象存储上的非结构化数据。

    面对这些技术挑战，Cloudberry Database 定义了一种 Directory Table 表，用于纳管多种类型的非结构化数据。开发者用户只需使用简单的 SQL 语句就能调用各种计算引擎的能力，实现一站式数据加工和应用开发。

    Directory Table 定位于存储、管理和分析非结构化数据对象。Directory Table 位于表空间中，将非结构化数据文件导入 Directory Table 后，会在 Directory Table 上创建一条记录，即该文件的元数据信息，而文件本身则加载进对象存储中。表上的元数据与对象存储上的对应文件相关联。

    详情参见[用户文档](/i18n/zh/docusaurus-plugin-content-docs/current/advanced-analytics/directory-tables.md)。

## 提升改进

- 在默认 build 中支持 `postgres_fdw` [#400](https://github.com/cloudberrydb/cloudberrydb/pull/400) by @[smartyhero](https://github.com/smartyhero)
- 访问方法 flags 现在可以指示是否支持自定义表的列定向扫描 [#407](https://github.com/cloudberrydb/cloudberrydb/pull/407) by @[gongxun0928](https://github.com/gongxun0928)
- 添加配置参数 `gp_random_insert_segments` 以控制用于随机分布表插入的 segment 数量 [#406](https://github.com/cloudberrydb/cloudberrydb/pull/406) by @[foreyes](https://github.com/foreyes)
- 支持目录表 [#390](https://github.com/cloudberrydb/cloudberrydb/pull/390) by @[wenchaozhang-123](https://github.com/wenchaozhang-123)
- 禁止在 `pg_dump` 中导出 pax 表 [#412](https://github.com/cloudberrydb/cloudberrydb/pull/412) by @[jiaqizho](https://github.com/jiaqizho)
- 更新 `googletest` 模块 URL [#429](https://github.com/cloudberrydb/cloudberrydb/pull/429) by @[tuhaihe](https://github.com/tuhaihe)

## Bug 修复

- 修复调用 `EVP_DecryptUpdate` 时出站数据缓冲区不足的问题 (#479) [#408](https://github.com/cloudberrydb/cloudberrydb/pull/408) by @[kongfanshen-0801](https://github.com/kongfanshen-0801) 
- 修复 `pgrx` 在数值变化接口后找不到 `numeric_is_nan` or `numeric_is_inf` 的问题 [#410](https://github.com/cloudberrydb/cloudberrydb/pull/410) by @[jiaqizho](https://github.com/jiaqizho)
- 修复从目录表复制时存在的问题 [#416](https://github.com/cloudberrydb/cloudberrydb/pull/416) by @[wenchaozhang-123](https://github.com/wenchaozhang-123)
- 修复 `UPDATE` 时用于唯一性检查的 `visimap` 查询 [#423](https://github.com/cloudberrydb/cloudberrydb/pull/423) by @[lss602726449](https://github.com/lss602726449) 
- 修复目录表 CI 管道存在的问题 [#414](https://github.com/cloudberrydb/cloudberrydb/pull/414) by @[wenchaozhang-123](https://github.com/wenchaozhang-123)
- 修复删除目录权限检查问题 [#425](https://github.com/cloudberrydb/cloudberrydb/pull/425) by @[wenchaozhang-123](https://github.com/wenchaozhang-123)
- 修复 `gpconfig` 不转义 '$' 字符的问题 [#403](https://github.com/cloudberrydb/cloudberrydb/pull/403) by @[Ray-Eldath](https://github.com/Ray-Eldath)

## 文档更新

- 更新 README.md 文件 [#411](https://github.com/cloudberrydb/cloudberrydb/pull/411) by @[tuhaihe](https://github.com/tuhaihe)
- 更新部署的 README.md [#409](https://github.com/cloudberrydb/cloudberrydb/pull/409)
 by @[Zhangbaowen-Hashdata](https://github.com/Zhangbaowen-Hashdata)

## 🙌🏻️ 新贡献者

- @[kongfanshen-0801](https://github.com/kongfanshen-0801) 在 [#408](https://github.com/cloudberrydb/cloudberrydb/pull/408) 做出了他的首次贡献。
- @[foreyes](https://github.com/foreyes) 在 [#406](https://github.com/cloudberrydb/cloudberrydb/pull/406) 做出了他的首次贡献。

## 🧑🏻‍💻 贡献者列表

感谢所有贡献者使此版本发布成为可能: @[smartyhero](https://github.com/smartyhero), @[Ray-Eldath](https://github.com/Ray-Eldath), @[gongxun0928](https://github.com/gongxun0928), @[kongfanshen-0801](https://github.com/kongfanshen-0801), @[foreyes](https://github.com/foreyes), @[tuhaihe](https://github.com/tuhaihe), @[Zhangbaowen-Hashdata](https://github.com/Zhangbaowen-Hashdata), @[jiaqizho](https://github.com/jiaqizho), @[wenchaozhang-123](https://github.com/wenchaozhang-123), @[lss602726449](https://github.com/lss602726449), @[soumyadeep2007](https://github.com/soumyadeep2007), @[ashwinstar](https://github.com/ashwinstar) 👍