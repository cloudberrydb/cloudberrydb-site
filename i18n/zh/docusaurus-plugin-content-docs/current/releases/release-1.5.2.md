---
title: 1.5.2
---

# Cloudberry Database v1.5.2 发版说明

版本号：v1.5.2

Cloudberry Database v1.5.2 是一个小版本，包含了一些提升改进和 bug 修复。

快速试用：[v1.5.2](https://github.com/cloudberrydb/cloudberrydb/releases/tag/1.5.2)

完整的变更日志：[https://github.com/cloudberrydb/cloudberrydb/compare/1.5.1...1.5.2](https://github.com/cloudberrydb/cloudberrydb/compare/1.5.1...1.5.2)

## 提升改进

- 对于物化视图功能，支持原查询中的 `GROUP BY`、`GROUPING SETS`、`ROLLUP` 和 `CUBE` 子句 [#342](https://github.com/cloudberrydb/cloudberrydb/pull/342) by @[avamingli](https://github.com/avamingli)
- 使用 `pg_class` 替代 `gp_segment_configuration` 来测试 `Entry` [#294](https://github.com/cloudberrydb/cloudberrydb/pull/294) by @[avamingli](https://github.com/avamingli)
- GPORCA 优化器现在支持 PAX（Partition Attributes Across）存储表 [#346](https://github.com/cloudberrydb/cloudberrydb/pull/346) by @[gfphoenix78](https://github.com/gfphoenix78)
- 添加 `RelationIsNonblockRelation` 宏以扩展类似 `AO`/`CO` 的代码路径 [#347](https://github.com/cloudberrydb/cloudberrydb/pull/347) by @[gfphoenix78](https://github.com/gfphoenix78)
- 为自定义表访问方式添加特性编码选项 [#343](https://github.com/cloudberrydb/cloudberrydb/pull/343) by @[gfphoenix78](https://github.com/gfphoenix78)
- 默认启用 `enable_shared_postgres_backend` [#351](https://github.com/cloudberrydb/cloudberrydb/pull/351) by @[gfphoenix78](https://github.com/gfphoenix78)
- 对于物化视图，修正重写后的 `PlannerInfo` 字段 [#348](https://github.com/cloudberrydb/cloudberrydb/pull/348) by @[avamingli](https://github.com/avamingli)
- 对于物化视图，支持原查询中的 `HAVING` 子句 [#354](https://github.com/cloudberrydb/cloudberrydb/pull/354) by @[avamingli](https://github.com/avamingli)
- 避免当前不支持的行为 [#357](https://github.com/cloudberrydb/cloudberrydb/pull/357) by @[avamingli](https://github.com/avamingli)
- 对于物化视图，支持原查询中的 `ORDER BY` 子句 [#358](https://github.com/cloudberrydb/cloudberrydb/pull/358) by @[avamingli](https://github.com/avamingli)
- 使 `shareinput_Xslice_dsm_handle_ptr` 和 `shareinput_Xslice_hash` 非静态化 [#361](https://github.com/cloudberrydb/cloudberrydb/pull/361) by @[shmiwy](https://github.com/shmiwy)
- 在 `upterm` 阶段撤销 `ci` 以避免失败 [#371](https://github.com/cloudberrydb/cloudberrydb/pull/371) by @[wenchaozhang-123](https://github.com/wenchaozhang-123)
- 从 `gpssh` 命令输出中移除 `b` 和 `\r` [#355](https://github.com/cloudberrydb/cloudberrydb/pull/355) by @[wenchaozhang-123](https://github.com/wenchaozhang-123)
- 如果子分区的表访问方式不同，则不继承父分区的 `reloptions` [#375](https://github.com/cloudberrydb/cloudberrydb/pull/375) by @[yjhjstz](https://github.com/yjhjstz)
- 扩展新的表访问方法以获取样本行 [#374](https://github.com/cloudberrydb/cloudberrydb/pull/374) by @[wenchaozhang-123](https://github.com/wenchaozhang-123)
- 使用物化视图的 `TupleDesc` 构建最终列 [#366](https://github.com/cloudberrydb/cloudberrydb/pull/366) by @[avamingli](https://github.com/avamingli)
- 在 `interconnect` 模块中添加测试和基准测试 [#384](https://github.com/cloudberrydb/cloudberrydb/pull/384) by @[jiaqizho](https://github.com/jiaqizho)
- 为表访问方法添加新的回调 `'scan_flags'` [#391](https://github.com/cloudberrydb/cloudberrydb/pull/391) by @[HuSen8891](https://github.com/HuSen8891)
- 将数值结构和接口导出到公共部分 [#392](https://github.com/cloudberrydb/cloudberrydb/pull/392) by @[jiaqizho](https://github.com/jiaqizho)
- 将预加载的 `interconnect` 移动到头文件中 [#388](https://github.com/cloudberrydb/cloudberrydb/pull/388) by @[gfphoenix78](https://github.com/gfphoenix78)
- 为表访问方法添加内联函数 `'table_scan_flags'` 以获取标志 [#395](https://github.com/cloudberrydb/cloudberrydb/pull/395) by @[HuSen8891](https://github.com/HuSen8891)
- 添加 `gpshrink` 以支持弹性扩缩容 [#393](https://github.com/cloudberrydb/cloudberrydb/pull/393) by @[lss602726449](https://github.com/lss602726449)
- 提交 [#386](https://github.com/cloudberrydb/cloudberrydb/pull/386) 以部分回滚 [#201](https://github.com/cloudberrydb/cloudberrydb/pull/201) by @[Ray-Eldath](https://github.com/Ray-Eldath)
- 将入口根切片卸载到 `QE` [#385](https://github.com/cloudberrydb/cloudberrydb/pull/385) by @[Ray-Eldath](https://github.com/Ray-Eldath)

## Bug 修复

- 修复 `AO`/`AOCS` `insertDesc` 内存问题 [#365](https://github.com/cloudberrydb/cloudberrydb/pull/365) by @[avamingli](https://github.com/avamingli)
- 修复 `CopyCreateStmtFields` 丢失 `intoPolicy` 字段的问题 [#372](https://github.com/cloudberrydb/cloudberrydb/pull/372) by @[yjhjstz](https://github.com/yjhjstz)
- 修复 `configue` 与 `configure.ac` 不一致的问题 [#373](https://github.com/cloudberrydb/cloudberrydb/pull/373) by @[lss602726449](https://github.com/lss602726449)
- 修复不稳定的 `ao`、`vacuum` 和 `icw` 测试 [#376](https://github.com/cloudberrydb/cloudberrydb/pull/376) by @[jiaqizho](https://github.com/jiaqizho)
- 修复涉及演示集群的 shell 脚本问题 [#377](https://github.com/cloudberrydb/cloudberrydb/pull/377) by @[gfphoenix78](https://github.com/gfphoenix78)
- 修复命名空间 `pg_ext_aux` 中的 `CREATE TYPE` [#380](https://github.com/cloudberrydb/cloudberrydb/pull/380) by @[gfphoenix78](https://github.com/gfphoenix78)
- 修复 `CdbPathLocus_HashedOJ` 对于 `parallel_workers` 初始化为 `0` 的问题 [#387](https://github.com/cloudberrydb/cloudberrydb/pull/387) by @[HuSen8891](https://github.com/HuSen8891)
- 修复 `pgcrypto` 和后端/crypto 中重新定义的 `sm4` [#394](https://github.com/cloudberrydb/cloudberrydb/pull/394) by @[jiaqizho](https://github.com/jiaqizho)

## 🙌🏻️ 新贡献者

@[shmiwy](https://github.com/) 在 [#361](https://github.com/cloudberrydb/cloudberrydb/pull/361) 中做出了他的首次贡献。

## 🧑🏻‍💻 贡献者列表

感谢所有贡献者使此版本发布成为可能：@[avamingli](https://github.com/avamingli), @[gfphoenix78](https://github.com/gfphoenix78), @[shmiwy](https://github.com/shmiwy), @[wenchaozhang-123](https://github.com/wenchaozhang-123), @[yjhjstz](https://github.com/yjhjstz), @[lss602726449](https://github.com/lss602726449), @[jiaqizho](https://github.com/jiaqizho), @[HuSen8891](https://github.com/HuSen8891), @[Ray-Eldath](https://github.com/Ray-Eldath) 👍
