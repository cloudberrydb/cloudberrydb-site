---
title: 并行创建 AO/AOCO 表与刷新物化视图
---

# 并行创建 AO/AOCO 表与刷新物化视图（引入自 v1.5.0 版本）

自 v1.5.0 起，Cloudberry Database 支持使用 `CREATE TABLE AS` 语句并行创建 Append-Optimized (AO) 表和 Append-Optimized Column Oriented (AOCO) 表，同时支持并行刷新基于该表的物化视图，从而加速建表和物化视图刷新。

要使用该并发功能，你需要先将系统参数 `enable_parallel` 的值设为 `ON`。

## 使用示例

### 并发创建 AO/AOCO 表

1. 创建基表 `t_p2`，在建表语句中使用 `WITH` 指定并发算子数量。

    ```sql
    CREATE TABLE t_p2(c1 INT, c2 INT) WITH (parallel_workers=2) DISTRIBUTED BY (c1);
    ```

2. 向表中插入数据，并收集表 `t_p2` 上的统计信息。

    ```sql
    INSERT INTO t_p2 SELECT i, i+1 FROM generate_series(1, 10000000) i;
    ANALYZE t_p2;
    ```

3. 开启并发，并关闭 GPORCA 优化器。

    ```sql
    SET enable_parallel = ON;
    SET optimizer = OFF;
    ```

4. 使用 `CREATE TABLE AS` 基于 `t_p2` 建表，在执行计划中出现了并行算子，说明已经并发建表。

    - 创建 AO 表：

        ```sql
        EXPLAIN(COSTS OFF) CREATE TABLE ctas_ao USING ao_row AS SELECT SUM(a.c2) AS c2, AVG(b.c1) AS c1 FROM t_p2 a JOIN t_p2 b ON a.c1 = b.c1 DISTRIBUTED BY (c2);

                                QUERY PLAN                            
        -----------------------------------------------------------------
        Redistribute Motion 1:3  (slice1; segments: 1)
        Hash Key: (sum(a.c2))
        ->  Finalize Aggregate
                ->  Gather Motion 6:1  (slice2; segments: 6)
                    ->  Partial Aggregate
                            ->  Parallel Hash Join
                                Hash Cond: (a.c1 = b.c1)
                                ->  Parallel Seq Scan on t_p2 a
                                ->  Parallel Hash
                                        ->  Parallel Seq Scan on t_p2 b
        Optimizer: Postgres query optimizer
        (11 rows)
        ```
    
    - 创建 AOCO 表：

        ```sql
        EXPLAIN(COSTS OFF) CREATE TABLE ctas_aoco USING ao_column AS SELECT SUM(a.c2) AS c2, AVG(b.c1) AS c1 FROM t_p2 a JOIN t_p2 b ON a.c1 = b.c1 DISTRIBUTED BY (c2);

                                QUERY PLAN                            
        -----------------------------------------------------------------
        Redistribute Motion 1:3  (slice1; segments: 1)
        Hash Key: (sum(a.c2))
        ->  Finalize Aggregate
                ->  Gather Motion 6:1  (slice2; segments: 6)
                    ->  Partial Aggregate
                            ->  Parallel Hash Join
                                Hash Cond: (a.c1 = b.c1)
                                ->  Parallel Seq Scan on t_p2 a
                                ->  Parallel Hash
                                        ->  Parallel Seq Scan on t_p2 b
        Optimizer: Postgres query optimizer
        (11 rows)
        ```

### 并发刷新物化视图

1. 创建基表 `t_p`，在建表语句中使用 `WITH` 指定并发算子数量。

    ```sql
    CREATE TABLE t_p(c1 INT, c2 INT) WITH (parallel_workers=8) DISTRIBUTED BY (c1);
    ```

2. 向表中插入数据，并收集表 `t_p` 上的统计信息。

    ```sql
    INSERT INTO t_p SELECT i, i+1 FROM generate_series(1, 10000000) i;
    ANALYZE t_p;
    ```

3. 根据参数 `ao_row`，创建一个使用行存储（AO Row）或列存储（AO Column）的物化视图 `matv`。物化视图的内容是从表 `t_p` 派生的聚合查询结果。

    ```sql
    CREATE MATERIALIZED VIEW matv USING ao_row AS SELECT SUM(a.c2) AS c2, AVG(b.c1) AS c1 FROM t_p a JOIN t_p b ON a.c1 = b.c1 WITH NO DATA DISTRIBUTED BY (c2);
    ```

    ```sql
    CREATE MATERIALIZED VIEW matv USING ao_column AS SELECT SUM(a.c2) AS c2, AVG(b.c1) AS c1 FROM t_p a JOIN t_p b ON a.c1 = b.c1 WITH NO DATA DISTRIBUTED BY (c2);
    ```

4. 开启并发，并关闭 GPORCA 优化器。

    ```sql
    SET enable_parallel = ON;
    SET optimizer = OFF;
    ```

5. 刷新物化视图。

    ```sql
    REFRESH MATERIALIZED VIEW matv;
    ```

可以通过记录刷新时长等工具对比关闭和开启并行两种情况下，刷新物化视图的时长差异，你能看到并行刷新物化视图得到的加速。

## 加速效果展示

| 是否开启并行 | 刷新 AO 表物化视图的耗时 | 刷新 AOCO 表物化视图的耗时 | CTAS 创建 AO 表的耗时 | CTAS 创建 AOCO 表的耗时 |
| ------------ | ------------------------ | -------------------------- | --------------------- | ----------------------- |
| 非并行       | 6.18 ms                  | 5.91 ms                    | 6.56 ms               | 6.06 ms                 |
| 并行数为 4   | 2.83 ms                  | 2.81 ms                    | 2.37 ms               | 2.48 ms                 |

## 相关其他特性

[自动使用物化视图进行查询优化](/i18n/zh/docusaurus-plugin-content-docs/current/use-auto-materialized-view-to-answer-queries.md)

[增量物化视图说明文档](/i18n/zh/docusaurus-plugin-content-docs/current/use-incremental-materialized-view.md)
