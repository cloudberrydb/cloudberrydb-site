---
title: 使用增量物化视图
---

# 使用增量物化视图（引入自 v1.5.0 版本）

本文档介绍 Cloudberry Database 增量物化视图的使用场景、使用方法、使用限制和注意事项。

增量物化视图是物化视图的一种特殊形式。当数据在基础表中发生变化时（例如插入、更新、删除操作），增量物化视图不需要重新计算整个视图中的所有数据。相反，它只更新那些自上次刷新以来发生变化的部分。这样可以节省大量的计算资源和时间，显著提高性能，尤其是在处理大型数据集时。

:::tip 提示
增量物化视图与普通视图的对比：

- 普通视图：普通视图不存储数据，而是每次查询时根据定义的 SQL 语句动态生成结果。这意味着每次执行查询时，都需要重新计算视图的数据，这在处理大量数据时可能非常耗时。
- 增量物化视图：增量物化视图提前计算并存储了结果集，这减少了查询时的计算负担。此外，由于是“增量”更新，当基础数据发生变化时，它只需要更新影响到的部分，而不是重新计算整个数据集。
:::

## 使用场景

- 查询时有中间结果集需要加速。
- 读多写少的场景。

## 使用方法示例

:::info 注意
使用增量物化视图前，确保你所使用的 Cloudberry Database 版本大于等于 1.5.0。v1.4.0 及以下版本的 Cloudberry Database 不支持增量物化视图。
:::

你可以使用 SQL 命令 `CREATE INCREMENTAL MATERIALIZED VIEW` 来创建增量物化视图。完整的语法支持如下：

```sql
CREATE [INCREMENTAL] MATERIALIZED VIEW [ IF NOT EXISTS ] table_name
    [ (column_name [, ...] ) ]
    [ USING method ]
    [ WITH ( storage_parameter [= value] [, ... ] ) ]
    [ TABLESPACE tablespace_name ]
    AS query
    [ WITH [ NO ] DATA ]
```

以下示例说明如何在 Cloudberry Database 中为表格创建增量物化视图。

1. 创建表格 `t0` 和 `t1`。

    ```sql
    CREATE TABLE t0 (a int) DISTRIBUTED BY (a);
    CREATE TABLE t1 (a int) DISTRIBUTED BY (a);
    ```

2. 基于两张表格创建增量物化视图 `m`。

    - 创建简单物化视图。以下语句创建了一个名为 `m` 的增量物化视图。它从表 `t0` 中选择所有列，并根据列 `a` 的值进行数据分布。这意味着视图 `m` 会存储表 `t0` 的数据快照，并能够根据 `t0` 中数据的变化进行增量更新。

        ```sql
        CREATE INCREMENTAL MATERIALIZED VIEW m AS SELECT * FROM t0 DISTRIBUTED BY (a);
        ```

    - 创建带连接操作的物化视图。以下语句也是创建名为 `m` 的增量物化视图，但这次是通过联接表 `t0` 和 `t1`。它选择所有 `t0.a` 的值，但仅当 `t0.a` 的值与 `t1.a` 的值相等时。同样地，视图是根据列 `a` 的值进行数据分布的。

        ```sql
        CREATE INCREMENTAL MATERIALIZED VIEW m AS SELECT t0.a FROM t0, t1 WHERE t0.a = t1.a DISTRIBUTED BY (a);
        ```

3. 向表格中插入数据。其中，`RETURNING *` 子句会在插入数据后返回被插入的行。

    ```sql
    INSERT INTO t0 VALUES (5);
    INSERT INTO t1 VALUES (5);
    INSERT INTO t0 VALUES (8) RETURNING *;
    ```

4. 查看物化视图 `m` 的结构和数据。

    ```sql
    postgres=# \d+ m
                                        MATERIALIZED VIEW "public.m"
    Column |  Type   | Collation | Nullable | Default | Storage | Compression | Stats target | Description 
    --------+---------+-----------+----------+---------+---------+-------------+--------------+-------------
    a      | integer |           |          |         | plain   |             |              | 
    VIEW definition:
    SELECT t0.a
    FROM t0;
    DISTRIBUTED BY: (a)
    Access method: heap
    ```

5. 查看视图 `m` 中的数据。

    ```sql
    postgres=# TABLE m;
    a 
    ---
    5
    (1 row)
    ```

要调试增量物化视图相关语句执行，你可以将系统参数 `debug_print_ivm` 的值设为 `ON`，即执行 `SET debug_print_ivm = ON;`。该参数的详细信息如下：

| 参数名          | 描述说明          | 默认值 | 是否为必填 | 示例                      |
| --------------- | ----------------- | ------ | ---------- | ------------------------- |
| debug_print_ivm | 是否开启 IVM 调试 | off    | 否         | SET debug_print_ivm = ON; |

## 与普通视图的查询性能对比

以下示例展示了在 Cloudberry Database 中，在处理大型数据集时普通视图与增量物化视图的查询性能对比。以下示例使用了 TPC-H 的 Query 15 测试数据集。

### 使用普通视图

1. 创建普通视图 `revenue0`。

    ```sql
    CREATE VIEW revenue0 (supplier_no, total_revenue) AS
            SELECT
                    l_suppkey,
                    SUM(l_extendedprice * (1 - l_discount))
            FROM
                    lineitem
            WHERE
                    l_shipdate >= DATE '1996-01-01'
                    AND l_shipdate < DATE '1996-01-01' + INTERVAL '3' MONTH
            GROUP BY
                    l_suppkey;
    ```

2. 从 `supplier` 表和 `revenue0` 视图中选择供应商的详细信息和他们的最大收入。

    ```sql
    SELECT
            s_suppkey,
            s_name,
            s_address,
            s_phone,
            total_revenue
    FROM
            supplier,
            revenue0
    WHERE
            s_suppkey = supplier_no
            AND total_revenue = (
                    SELECT
                            MAX(total_revenue)
                    FROM
                            revenue0
            )
    ORDER BY s_suppkey;

    s_suppkey |          s_name           |     s_address     |     s_phone     | total_revenue 
    -----------+---------------------------+-------------------+-----------------+---------------
        8449 | Supplier#000008449        | Wp34zim9qYFbVctdW | 20-469-856-8873 |  1772627.2087
    (1 row)

    Time: 3040.23 ms
    ```

以上查询中，视图 `revenue0` 的结果是实时计算出来的，查询耗时 3040.23 ms。

### 使用增量物化视图

你可以在 DDL 阶段创建增量物化视图，从而大幅减少查询耗时。

1. 创建增量物化视图 `revenue0`：

    ```sql
    CREATE INCREMENTAL MATERIALIZED VIEW revenue0 (supplier_no, total_revenue) AS
            SELECT
                    l_suppkey,
                    SUM(l_extendedprice * (1 - l_discount))
            FROM
                    lineitem
            WHERE
                    l_shipdate >= DATE '1996-01-01'
                    AND l_shipdate < DATE '1996-01-01' + INTERVAL '3' MONTH
            GROUP BY
                    l_suppkey;
    ```

2. 从 `supplier` 表和 `revenue0` 视图中选择供应商的详细信息和他们的最大收入，查询耗时 65 ms。

    ```sql
    SELECT                
            s_suppkey,
            s_name,
            s_address,
            s_phone,
            total_revenue
    FROM
            supplier,
            revenue0
    WHERE
            s_suppkey = supplier_no
            AND total_revenue = (
                    SELECT
                            MAX(total_revenue)
                    FROM
                            revenue0
            )
    ORDER BY s_suppkey;

    s_suppkey |          s_name           |     s_address     |     s_phone     | total_revenue 
    -----------+---------------------------+-------------------+-----------------+---------------
        8449 | Supplier#000008449        | Wp34zim9qYFbVctdW | 20-469-856-8873 |  1772627.2087
    (1 row)

    Time: 65.731 ms
    ```

### TPC-H 测试结果对比

使用 TPC-H 测试，在不同数据量下，插入和查询语句执行耗时如下表：

| 数据量 | 普通插入语句 | 带增量物化视图的插入语句 | 带普通视图的查询语句 | 带增量物化视图的查询语句 |
| ------ | ------------ | ------------------------ | -------------------- | ------------------------ |
| 1 GB   | 2712ms       | 3777ms                   | 813ms                | 43ms                     |
| 5 GB   | 15681ms      | 29363ms                  | 3040ms               | 63ms                     |
| 10 GB  | 43011ms      | 73188ms                  | 7057ms               | 102ms                    |

从上表中可见：

- 在各数据量下，带增量物化视图的查询语句远比带普通视图的查询语句执行得快，查询性能提升明显。
- 在各数据量下，带增量物化视图的插入语句不及普通插入语句执行得快，这是因为数据插入到表格后需要同步更新物化视图，因此增量物化视图不适合写入多的场景。

## 使用限制和注意事项

目前，Cloudberry Database 上的增量物化视图有以下使用限制：

- 不支持为 Append-Optimized (AO) 表创建增量物化视图。
- 不支持为分区表创建增量物化视图。
- 不支持在 PAX 存储上创建增量物化视图。
- 在定义增量物化视图时不支持：

    - `min` 和 `max` 函数，自定义聚合函数
    - 左、右连接，即 `LEFT JOIN` 和 `OUTER JOIN`
    - 窗口函数，`HAVING` 子句
    - 子查询，CTE 查询
    - 集合运算 (`UNION`、`INTERSECT`、`EXCEPT`)
    - `DISTINCT ON`、`ORDER BY`、`LIMIT`、`OFFSET`

- 不支持在物化视图上创建增量物化视图。

除此之外，你在 Cloudberry Database  上使用增量物化视图，还需要注意以下问题：

- 引入增量物化视图会导致数据插入、删除、更新变慢。另外，一张基表可能有多个增量物化视图，性能退化倍数和增量物化视图个数成正比。
- 使用增量物化视图会产生临时文件用于存储计算 delta 视图，这可能会占用一些存储空间。
- 物化视图根据视图定义的不同，可能会导致存储成本增加。

# 其他相关功能

[并行创建 AO 表与刷新物化视图](/i18n/zh/docusaurus-plugin-content-docs/current/parallel-create-ao-refresh-mv.md)

[自动使用物化视图进行查询优化](/i18n/zh/docusaurus-plugin-content-docs/current/use-auto-materialized-view-to-answer-queries.md)
