---
title: 1.5.1
---

# Cloudberry Database v1.5.1 发版说明

版本号：v1.5.1

Cloudberry Database v1.5.1 是一个小版本，包含了一些 bug 修复。

快速试用：[v1.5.1](https://github.com/cloudberrydb/cloudberrydb/releases/tag/1.5.1)

## 提升改进

* 检查索引的唯一性并对非堆关系跳过预取 [#337](https://github.com/cloudberrydb/cloudberrydb/pull/337) @[gfphoenix78](https://github.com/gfphoenix78)
* 在物化视图上计算聚合 [#322](https://github.com/cloudberrydb/cloudberrydb/pull/322) @[avamingli](https://github.com/avamingli)
* 引入 `pg_ext_aux` 命名空间用于扩展 [#333](https://github.com/cloudberrydb/cloudberrydb/pull/333) @[gfphoenix78](https://github.com/gfphoenix78)
* 为扩展实现 DML hook [#332](https://github.com/cloudberrydb/cloudberrydb/pull/332) @[gfphoenix78](https://github.com/gfphoenix78)
* 支持自定义对象类 [#335](https://github.com/cloudberrydb/cloudberrydb/pull/335) @[gfphoenix78](https://github.com/gfphoenix78)
* 为自定义表访问方法添加 reloption 支持 [#336](https://github.com/cloudberrydb/cloudberrydb/pull/336) @[gfphoenix78](https://github.com/gfphoenix78)
* 在 `TableAmRoutine` 中引入回调以管理交换关系文件 [#338](https://github.com/cloudberrydb/cloudberrydb/pull/338) @[gfphoenix78](https://github.com/gfphoenix78)
* 更新终端中与 CloudberryDB 相关的字段显示信息 [#300](https://github.com/cloudberrydb/cloudberrydb/pull/300) @[tuhaihe](https://github.com/tuhaihe)
* 重构表 AM，以在 `scan_begin_extractcolumns` 中包含执行上下文 [#329](https://github.com/cloudberrydb/cloudberrydb/pull/329) @[gfphoenix78](https://github.com/gfphoenix78)
* 公开函数以支持分区表的 PAX [#328](https://github.com/cloudberrydb/cloudberrydb/pull/328) @[gfphoenix78](https://github.com/gfphoenix78)

## Bug 修复

* 修复非法 `PGnotify` 声明的问题 [#325](https://github.com/cloudberrydb/cloudberrydb/pull/325) @[jiaqizho](https://github.com/jiaqizho)
* 修复 `get_size_from_segDBs` 中可能的使用后释放 (UAF) 问题 [#326](https://github.com/cloudberrydb/cloudberrydb/pull/326) @[jiaqizho](https://github.com/jiaqizho)
* 修正 psql 中 `\d` 命令从 `pg_am` 显示存储名称的问题 [#330](https://github.com/cloudberrydb/cloudberrydb/pull/330) @[gfphoenix78](https://github.com/gfphoenix78)
* 修复与 `pg_ext_aux` 命名空间相关的问题 [#340](https://github.com/cloudberrydb/cloudberrydb/pull/340) @[gfphoenix78](https://github.com/gfphoenix78)
