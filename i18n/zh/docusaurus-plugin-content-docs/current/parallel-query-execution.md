---
title: 并行执行查询
---

# 并行执行查询

本文档介绍 Cloudberry Database 并行查询的使用场景、使用方法、使用限制和使用该功能的常见问题。Cloudberry Database 支持并行查询功能，即利用多个 CPU 核心来处理单个查询，以此来提高查询性能。在执行查询过程中，计算节点（包括 `SeqScan` 算子）的数量会随着数据量变化动态调整。

## 使用场景

单台物理机上部署少量 Segment，通过动态调整并行度替代大量部署 Segment，并同时提升性能。

在主机 CPU、磁盘负载不高时，开启算子并行有性能优势。

## 使用方法

Cloudberry Database 支持在 AO/AOCO 表和 Heap 表上进行并行查询。

### 并行查询 Heap 表

1. 开启并行查询功能前，需要关闭 GPORCA 优化器。

    ```sql
    SET enable_parallel = ON;
    SET optimizer = OFF;
    ```

2. 设置最大并行度。

    ```sql
    -- 设置需考虑 CPU 核数和 segment 数.
    SET max_parallel_workers_per_gather = 4;
    ```

    查询例子：

    ```sql
    CREATE TABLE t1 (c1 int,c2 int, c3 int, c4 box) distributed by (c1);
    INSERT INTO t1 SELECT x, 2*x, 3*x, box('6,6,6,6') FROM generate_series(1,1000000) AS x;
    SELECT count(*) from t1;
    ```

### 并行查询 AO/AOCO 表

1. 开启并行查询功能前，需要关闭 GPORCA 优化器。

    ```sql
    SET enable_parallel = ON;
    SET optimizer = OFF;
    ```

2. 设置最大并行度。

    ```sql
    -- 设置需考虑 CPU 核数和 segment 数
    SET max_parallel_workers_per_gather = 4;

    -- 设置在一个事务中将数据插入多少个文件里。更大的值可能带来性能下降，尤其是对于 AOCO 表。
    SET gp_appendonly_insert_files = 8;

    -- 每隔 10 万行换下一个文件插入数据，可根据情况调整，让数据尽量均匀分布在多个文件上。
    SET gp_appendonly_insert_files_tuples_range = 100000;
    ```

3. 插入和查询。

    ```sql
    CREATE TABLE ao(x INT) USING ao_row;
    INSERT INTO ao SELECT i FROM generate_series(1, 1000000) i;
    -- 最好先更新统计信息
    ANALYZE ao;
    SELECT COUNT(*) FROM ao;
    ```

## 参数说明

| 参数名                                    | 描述说明                           | 默认值   | 是否为必填 | 示例                                                      |
| ----------------------------------------- | ---------------------------------- | -------- | ---------- | --------------------------------------------------------- |
| `enable_parallel`                         | 是否开启并行特性                   | `OFF`    | 是         | `SET enable_parallel = ON;`                         |
| `optimizer`                               | 是否开启 GPORCA 优化器             | `ON`     | 是         | `SET optimizer = OFF;`                              |
| `gp_appendonly_insert_files`              | 在一个事务中将数据插入多少个文件里 | `4`      | 否         | `SET gp_appendonly_insert_files = 8;`                   |
| `gp_appendonly_insert_files_tuples_range` | 每隔多少行，换下一个文件插入数据   | `100000` | 否         | `SET gp_appendonly_insert_files_tuples_range = 100000;` |

## 常见问题

- 目前支持并行执行包含下列算子的查询语句。Cloudberry Database 暂不支持包含其他算子的查询。

    ```sql
    sequence scan
    index scan
    index only scan
    bitmap heap scan
    append
    hash join
    nestloop join
    merge join
    ```

- 并行查询并非在任何情况下都能提高查询性能。过大的并行度可能造成负载过大，反而导致性能下降。
- 开启并行意味着成倍的内存开销，可能遇到内存不足而报错。
