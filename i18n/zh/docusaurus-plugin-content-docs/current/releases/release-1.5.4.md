---
title: 1.5.4
---

# Cloudberry Database v1.5.4 发版说明

版本号：v1.5.4

Cloudberry Database v1.5.4 是一个小版本，包含了一些提升改进、变更和 bug 修复。

快速试用：[v1.5.4](https://github.com/cloudberrydb/cloudberrydb/releases/tag/1.5.4)

完整的变更日志：[https://github.com/cloudberrydb/cloudberrydb/compare/1.5.3...1.5.4](https://github.com/cloudberrydb/cloudberrydb/compare/1.5.3...1.5.4)

## 提升改进

- 添加 `cbdb_relation_size` 函数 [#428](https://github.com/cloudberrydb/cloudberrydb/pull/428) by [@fanfuxiaoran](https://github.com/fanfuxiaoran)
- 从 Greenplum Database 上游 cherry-pick 更新 (02/07/2022-02/28/2022) [#432](https://github.com/cloudberrydb/cloudberrydb/pull/432) by [@avamingli](https://github.com/avamingli)
- 在 "Answer Query Using Materialized Views" 的原始查询中支持 `DISTINCT` 子句 [#439](https://github.com/cloudberrydb/cloudberrydb/pull/439) by [@avamingli](https://github.com/avamingli)
- 在 "Answer Query Using Materialized Views" 的原始查询中支持 Postgres 特有的 `DISTINCT ON` 子句 [#441](https://github.com/cloudberrydb/cloudberrydb/pull/441) by [@avamingli](https://github.com/avamingli)
- 扩展新的外部变量标签 [#443](https://github.com/cloudberrydb/cloudberrydb/pull/443) by [@jiaqizho](https://github.com/jiaqizho)
- 扩展挂起删除接口 [#442](https://github.com/cloudberrydb/cloudberrydb/pull/442) by [@jiaqizho](https://github.com/jiaqizho)
- 在 "Answer Query Using Materialized Views" 的原始查询中支持 `LIMIT`/`OFFSET`/`FETCH` 子句 [#446](https://github.com/cloudberrydb/cloudberrydb/pull/446) by [@avamingli](https://github.com/avamingli)
- 清理构建工具和指南目录 [#445](https://github.com/cloudberrydb/cloudberrydb/pull/445) by [@tuhaihe](https://github.com/tuhaihe)
- 插入更多数据以在 `regress/misc_jiras.sql` 中使 tuplestore 溢出 [#452](https://github.com/cloudberrydb/cloudberrydb/pull/452) by [@fanfuxiaoran](https://github.com/fanfuxiaoran)

## Bug 修复

- 修复 motion toast 错误 [#436](https://github.com/cloudberrydb/cloudberrydb/pull/436) by [@gfphoenix78](https://github.com/gfphoenix78)
- 修复 `dbconn.py` 中检查密码文件权限的问题 [#438](https://github.com/cloudberrydb/cloudberrydb/pull/438) by [@fanfuxiaoran](https://github.com/fanfuxiaoran)
- 修复 ORCA 的 `Invalid key is inaccessible` 备用方案的间歇性问题 (#15147) [#437](https://github.com/cloudberrydb/cloudberrydb/pull/437) by [@fanfuxiaoran](https://github.com/fanfuxiaoran)
- 修复 `explain(locus)` 的问题 [#433](https://github.com/cloudberrydb/cloudberrydb/pull/433) by [@avamingli](https://github.com/avamingli)
- 使用 checkberry `gpcheckperf` 系列更新解决 Cloudberry Database v1.5.2 中 `gpcheckperf` 不显示磁盘信息的问题 [#430](https://github.com/cloudberrydb/cloudberrydb/pull/430) by [@August-beaulo](https://github.com/August-beaulo)

## 其他变更

- 移除 `cbload` 相关代码 [#431](https://github.com/cloudberrydb/cloudberrydb/pull/431) by [@wenchaozhang-123](https://github.com/wenchaozhang-123)
- 使用 Python 重构 `cbload` 为 `gpdirtableload` [#435](https://github.com/cloudberrydb/cloudberrydb/pull/435) by [@wenchaozhang-123](https://github.com/wenchaozhang-123)
- 移除用作函数或参数名称的 CPP 关键字 [#449](https://github.com/cloudberrydb/cloudberrydb/pull/449) by [@jiaqizho](https://github.com/jiaqizho)

## 🙌🏻️ 新贡献者

[@fanfuxiaoran](https://github.com/fanfuxiaoran) 在 [#428](https://github.com/cloudberrydb/cloudberrydb/pull/428) 中做出了他的首次贡献。

## 🧑🏻‍💻 贡献者列表

感谢所有贡献者使此版本发布成为可能：[@higuoxing](https://github.com/higuoxing), [@tuhaihe](https://github.com/tuhaihe), [@August-beaulo](https://github.com/August-beaulo), [@avamingli](https://github.com/avamingli), [@piyushc01](https://github.com/piyushc01), [@red1452](https://github.com/red1452), [@edespino](https://github.com/edespino), [@jnihal](https://github.com/jnihal), [@Annu149](https://github.com/Annu149), [@jiaqizho](https://github.com/jiaqizho), [@wenchaozhang-123](https://github.com/wenchaozhang-123), [@dgkimura](https://github.com/dgkimura), [@fanfuxiaoran](https://github.com/fanfuxiaoran), [@gfphoenix78](https://github.com/gfphoenix78), [@HelloYJohn](https://github.com/HelloYJohn), [@adam8157](https://github.com/adam8157), [@xiaoxiaoHe-E](https://github.com/xiaoxiaoHe-E), [@InnerLife0](https://github.com/InnerLife0), [@wuyuhao28](https://github.com/wuyuhao28), [@l-wang](https://github.com/l-wang), [@lij55](https://github.com/lij55), [@huansong](https://github.com/huansong), [@chrishajas](https://github.com/chrishajas), [@tglsfdc](https://github.com/tglsfdc), [@fairyfar](https://github.com/fairyfar), [@kainwen](https://github.com/kainwen), [@nmisch](https://github.com/nmisch), [@my-ship-it](https://github.com/my-ship-it)
