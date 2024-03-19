---
title: 查询性能概述
---

# 查询性能概述

Cloudberry Database 能动态地清除表中的无关分区，并对查询中的不同运算符进行最优内存分配。有了这些优化，数据库执行查询时会减少扫描的数据量，加速查询处理，并支持更多并发。

- 动态分区消除

    在 Cloudberry Database 中，系统会利用仅在执行查询时才能确定的值来动态地对分区进行裁剪，从而提高查询处理速度。通过设置服务器配置参数 `gp_dynamic_partition_pruning` 为 `ON` 或 `OFF` 来启用或禁用动态分区裁剪，默认情况下为 `ON`。

- 内存优化

    Cloudberry Database 为查询中的不同运算符进行最优分配内存，在处理查询的不同阶段释放或重新分配内存。

:::tip 提示
Cloudberry Database 默认使用 GPORCA 优化器。 GPORCA 扩展了 Postgres 优化器的规划和优化能力。
:::
