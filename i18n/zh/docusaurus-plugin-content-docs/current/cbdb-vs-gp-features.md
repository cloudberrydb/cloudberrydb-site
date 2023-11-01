---
title: 与 Greenplum 的特性对比
---

# 与 Greenplum 的特性对比

Cloudberry Database 100% 兼容 Greenplum，能提供所有你需要的 Greenplum 特性。

除此之外，Cloudberry Database 还拥有一些 Greenplum 当前不具备或不支持的特性，详见下文。

## 一般特性对比

:::info 说明

- 在以下表格中，✅ 代表支持，❌ 代表不支持。
- 以下表格中的对比，基于 Greenplum 7.0 Beta.3 版本。 

:::

| 功能名                                   | Cloudberry Database | Greenplum   |
| ---------------------------------------- | ------------------- | ----------- |
| 在 `EXPLAIN` 的结果中查看 WAL 的使用信息 | ✅                   | ❌           |
| Multiranges 类型                     | ✅                   | ❌           |
| B 树自底向上索引清理                     | ✅                   | ❌           |
| GiST的覆盖索引 (`INCLUDE`)               | ✅                   | ✅（待发布） |
| `range_agg` 范围类型聚合函数             | ✅                   | ❌           |
| `CREATE ACCESS METHOD`                   | ✅                   | ✅（待发布） |
| `TOAST`  表上的 LZ4 压缩支持             | ✅                   | ❌           |
| JSONB 通过下标读取元素                               | ✅                   | ❌           |
| 配置复制插槽的最大 WAL 保留              | ✅                   | ❌           |
| 验证备份的完整性 (`pg_verifybackup`)     | ✅                   | ❌           |
| 客户端可以要求 SCRAM 通道绑定            | ✅                   | ❌           |
| Vacuum "紧急模式"                        | ✅                   | ❌           |
| 使用 `postgres_fdw` 的证书认证           | ✅                   | ❌           |
| `UPSERT`                                 | ✅                   | ✅（待发布） |
| COPY FROM Where                          | ✅                   | ❌           |
| VACUUM / ANALYZE 跳过锁定表              | ✅                   | ❌           |
| HASH 分区表                              | ✅                   | ❌           |
| CTE (`SEARCH` 和 `CYCLE`)                       | ✅                   | ❌           |
| 存储过程 OUT 参数                            | ✅                   | ❌           |
| 外键表的外键约束                    | ✅                   | ❌           |
| `pg_terminate_backend` 的超时参数        | ✅                   | ❌           |
| Coordinator 自动故障转移                      | ✅                   | ❌           |
| 支持在 Kubernetes 上部署                 | ✅                   | ❌           |

## 性能特性对比

| 功能名                                      | Cloudberry Database | Greenplum |
| ------------------------------------------- | ------------------- | --------- |
| 并发重建索引 `REINDEX CONCURRENTLY`         | ✅                   | ❌         |
| 聚合运算下推                                | ✅                   | ❌         |
| `CREATE STATISTICS` - `OR` 和 `IN/ANY` 统计 | ✅                   | ❌         |
| 增量排序                                    | ✅                   | ❌         |
| 窗口函数的增量排序                          | ✅                   | ❌         |
| 查询流水线                                  | ✅                   | ❌         |
| BRIN 索引（多最小最大值，bloom）            | ✅                   | ❌         |
| 查询并行                                    | ✅                   | ❌         |
| 基于 Abbreviated Keys 进行排序                                | ✅                   | ❌         |
| 哈希索引的 WAL 支持                         | ✅                   | ❌         |
| `postgres_fdw` 聚合下推                     | ✅                   | ❌         |
| 添加列时无需重写整个表                      | ✅                   | ❌         |
| 表连接运算支持运行时过滤器 (Runtime Filter) | ✅                   | ❌         |
| AppendOnly 表支持索引扫描                   | ✅                   | ❌         |

## 安全特性对比

| 功能名                      | Cloudberry Database | Greenplum |
| --------------------------- | ------------------- | --------- |
| 透明数据加密 (TDE)          | ✅                   | ❌         |
| 可信扩展                    | ✅                   | ❌         |
| SCRAM-SHA-256               | ✅                   | ❌         |
| GSSAPI 时的加密 TCP/IP 连接 | ✅                   | ❌         |
| 行级别安全策略              | ✅                   | ❌         |
