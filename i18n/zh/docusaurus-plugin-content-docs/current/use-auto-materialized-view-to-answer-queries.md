---
title: 自动使用物化视图进行查询优化
---

# 自动使用物化视图进行查询优化（引入自 v1.5.0 版本）

自 v1.5.0 版本起，Cloudberry Database 支持在查询规划阶段自动使用物化视图来计算部分或全部查询（即 AQUMV）。这一功能特别适用于在大表上进行的查询，能显著提高查询处理时间。AQUMV 使用增量物化视图 (IMV)，因为当相关表有写入操作时，IMV 通常能保持最新的数据。

## 场景说明

- 大数据量的聚合查询：对于需要从数百万条记录中进行聚合的查询，AQUMV 能显著减少查询时间。
- 频繁更新的大表：在数据频繁更新的环境中，使用 IMV 可以确保查询结果的实时性和准确性。
- 复杂计算的场景：对于包含复杂计算（如以下示例中的平方根和绝对值计算）的查询，AQUMV 可以通过预计算这些值在物化视图中，加快查询速度。

## 使用示例

要启用 AQUMV 功能，需要先创建物化视图，并将系统参数 `enable_answer_query_using_materialized_views` 的值设为 `ON`。下面是不使用 AQUMV 与使用 AQUMV 执行相同复杂查询的结果对比。

1. 创建表格 `aqumv_t1`。

    ```sql
    CREATE TABLE aqumv_t1(c1 INT, c2 INT, c3 INT) DISTRIBUTED BY (c1);
    ```

2. 往表中插入数据，并收集表上的统计信息。

    ```sql
    INSERT INTO aqumv_t1 SELECT i, i+1, i+2 FROM generate_series(1, 100000000) i;
    ANALYZE aqumv_t1;
    ```

3. 在不开启 AQUMV 的情况下执行查询，耗时 7384.329 ms。

    ```sql
    SELECT SQRT(ABS(ABS(c2) - c1 - 1) + ABS(c2)) FROM aqumv_t1 WHERE c1 > 30 AND c1 < 40 AND SQRT(ABS(c2)) > 5.8;

        sqrt
    -------------------66.0827625302982196.2449979983983985.9160797830996166.1644140029689766.3245553203367595.830951894845301
    (7 rows)

    Time: 7384.329 ms (00:07.384)
    ```

    该查询的计划如下，可见优化器对表进行了扫描 (`Seq Scan on aqumv_t1`)。

    ```sql
    EXPLAIN(COSTS OFF) SELECT SQRT(ABS(ABS(c2) - c1 - 1) + ABS(c2)) FROM aqumv_t1 WHERE c1 > 30 AND c1 < 40 AND SQRT(ABS(c2)) > 5.8;

                                                    QUERY PLAN

    -------------------------------------------------------------------------------------------------------------
    Gather Motion 3:1  (slice1; segments: 3)
    ->  Seq Scan on aqumv_t1
            Filter: ((c1 > 30) AND (c1 < 40) AND (sqrt((abs(c2))::double precision) > '5.8'::double pre
    cision))
    Optimizer: Postgres query optimizer
    (4 rows)
    ```

4. 现在基于 `aqumv_t1` 创建物化视图 `mvt1`，并收集该视图的统计信息。

    ```sql
    CREATE INCREMENTAL MATERIALIZED VIEW mvt1 AS SELECT c1 AS mc1, c2 AS mc2, ABS(c2) AS mc3, ABS(ABS(c2) - c1 - 1) AS mc4
    FROM aqumv_t1 WHERE c1 > 30 AND c1 < 40;

    ANALYZE mvt1;
    ```

5. 开启 AQUMV 相关配置参数：

    ```sql
    SET enable_answer_query_using_materialized_views = ON;
    ```

6. 现在 AQUMV 已开启，再次执行相同的表查询，耗时 45.701 ms。

    ```sql
    SELECT SQRT(ABS(ABS(c2) - c1 - 1) + ABS(c2)) FROM aqumv_t1 WHERE c1 > 30 AND c1 < 40 AND SQRT(ABS(c2)) > 5.8;

        sqrt
    -------------------66.0827625302982196.2449979983983985.8309518948453015.9160797830996166.1644140029689766.324555320336759
    (7 rows)

    Time: 45.701 ms
    ```

    该查询的计划如下，可见优化器没有扫描 `aqumv_t1` 表，而扫描了物化视图 `mvt1` (`Seq Scan on public.mvt1`)。

    ```sql
    explain(verbose, costs off)select sqrt(abs(abs(c2) - c1 - 1) + abs(c2)) from aqumv_t1 where c1 > 30 and c1 < 40 and sqrt(abs(c2)) > 5.8;

                                    QUERY PLAN
    --------------------------------------------------------------------------------
    Gather Motion 3:1  (slice1; segments: 3)
    Output: (sqrt(((mc4 + mc3))::double precision))
    ->  Seq Scan on public.mvt1
            Output: sqrt(((mc4 + mc3))::double precision)
            Filter: (sqrt((mvt1.mc3)::double precision) > '5.8'::double precision)
    Settings: enable_answer_query_using_materialized_views = 'on', optimizer = 'off'
    Optimizer: Postgres query optimizer
    (7 rows)
    ```

    在以上示例中，在没有使用物化视图的情况下，查询耗时为 7384.329 毫秒。而启用 AQUMV 后，使用物化视图的相同查询仅耗时 45.701 毫秒。这说明物化视图通过预先计算和存储相关计算结果，只包含了满足特定条件（`c1 > 30 and c1 < 40`）的行。

    因此以上表查询 `select sqrt(abs(abs(c2) - c1 - 1) + abs(c2)) from aqumv_t1 where c1 > 30 and c1 < 40 and sqrt(abs(c2)) > 5.8;` 实际上等效于对物化视图的查询语句 `select sqrt(mc4 + mc3) from mvt1 where sqrt(mc3) > 5.8;`。

通过这种方式，当执行相同的查询时，可以直接从物化视图中获取数据，而不是从原始表中，这样 AQUMV 能显著提高查询性能，特别是在处理大数据量和复杂计算时。

## 实现原理

AQUMV 是通过对查询树进行等效转换来实现查询优化的。

表查询只有满足以下条件后，Cloudberry Database  才会自动使用物化视图：

- 物化视图必须包含查询表达式所需的所有行。
- 如果物化视图包含比查询更多的行，可能需要添加额外的过滤条件。
- 所有输出表达式必须能够从视图的输出中计算得出。
- 输出表达式可以完全或部分与物化视图的目标列表匹配。

当存在多个有效的物化视图候选项时，或者当从物化视图中查询的成本高于直接从原始表中查询（例如，原始表有索引等情况），可以让规划器根据代价估算决定最佳选择。

## 使用限制

- 只支持对单一关系的 `SELECT` 查询，适用于物化视图查询和原始查询。
- 当前不支持的功能包括：聚合 (AGG)、子查询、原始查询的排序 (ORDER BY)、连接 (JOIN)、子链接(SUBLINK)、分组 (GROUP BY)、窗口函数、公共表表达式 (CTE)、去重 (DISTINCT ON)、刷新物化视图(REFRESH MATERIALIZED VIEW)、`CREATE AS` 语句。

## 相关其他功能

[并行创建 AO 表与刷新物化视图](/i18n/zh/docusaurus-plugin-content-docs/current/parallel-create-ao-refresh-mv.md)

[增量物化视图说明文档](/i18n/zh/docusaurus-plugin-content-docs/current/use-incremental-materialized-view.md)
