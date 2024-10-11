---
title: Use Auto Materialized Views for Query Optimization
---

# Use Automatic Materialized Views for Query Optimization (New in v1.5.0)

Since v1.5.0, Cloudberry Database supports automatically using materialized views to process some or all queries (called AQUMV) during the query planning phase. This feature is suitable for queries on large tables and can greatly reduce query processing time. AQUMV uses incremental materialized views (IMVs) because IMVs usually keep the latest data when related tables have write operations.

## Usage scenarios

- Aggregation queries on large data sets: For queries that need to aggregate results from millions of records, AQUMV can significantly reduce query time.
- Frequently updated large tables: In an environment where data is frequently updated, using IMV can ensure that the query results are real-time and accurate.
- Complex calculations: For queries with complex calculations (such as square root and absolute value calculations), AQUMV can speed up the queries by pre-calculating these values in materialized views.

## Usage example

To enable AQUMV, you need to create a materialized view and set the value of the system parameter `enable_answer_query_using_materialized_views` to `ON`. The following example compares the results of the same complex query without AQUMV and with AQUMV.

1. Create a table `aqumv_t1`.

    ```sql
    CREATE TABLE aqumv_t1(c1 INT, c2 INT, c3 INT) DISTRIBUTED BY (c1);
    ```

2. Insert data into the table and collect statistics from the table.

    ```sql
    INSERT INTO aqumv_t1 SELECT i, i+1, i+2 FROM generate_series(1, 100000000) i;
    ANALYZE aqumv_t1;
    ```

3. Execute a query without enabling AQUMV. The query takes 7384.329 ms.

    ```sql
    SELECT SQRT(ABS(ABS(c2) - c1 - 1) + ABS(c2)) FROM aqumv_t1 WHERE c1 > 30 AND c1 < 40 AND SQRT(ABS(c2)) > 5.8;

        sqrt
    -------------------66.0827625302982196.2449979983983985.9160797830996166.1644140029689766.3245553203367595.830951894845301
    (7 rows)

    Time: 7384.329 ms (00:07.384)
    ```

    From the following query plan, you can see that the optimizer scans the table (`Seq Scan on aqumv_t1 `).

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

4. Create a materialized view `mvt1` based on `aqumv_t1` and collect statistics on the view.

    ```sql
    CREATE INCREMENTAL MATERIALIZED VIEW mvt1 AS SELECT c1 AS mc1, c2 AS mc2, ABS(c2) AS mc3, ABS(ABS(c2) - c1 - 1) AS mc4
    FROM aqumv_t1 WHERE c1 > 30 AND c1 < 40;

    ANALYZE mvt1;
    ```

5. Enable the AQUMV-related configuration parameter.

    ```sql
    SET enable_answer_query_using_materialized_views = ON;
    ```

6. Now AQUMV is enabled. Execute the same query again, which takes only 45.701 ms.

    ```sql
    SELECT SQRT(ABS(ABS(c2) - c1 - 1) + ABS(c2)) FROM aqumv_t1 WHERE c1 > 30 AND c1 < 40 AND SQRT(ABS(c2)) > 5.8;

        sqrt
    -------------------66.0827625302982196.2449979983983985.8309518948453015.9160797830996166.1644140029689766.324555320336759
    (7 rows)

    Time: 45.701 ms
    ```

    From the following query plan, you can see that the optimizer does not scan the `aqumv_t1` table, but scans the materialized view `mvt1` (`Seq Scan on public.mvt1`) instead.

    ```sql
    EXPLAIN(VERBOSE, COSTS OFF) SELECT SQRT(ABS(ABS(c2) - c1 - 1) + ABS(c2)) FROM aqumv_t1 WHERE c1 > 30 AND c1 < 40 AND SQRT(ABS(c2)) > 5.8;

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

    In the above example, the query takes 7384.329 ms without AQUMV and without using the materialized views. In contrast, the same query takes only 45.701 ms with AQUMV enabled and using the materialized view. This means that the materialized view pre-calculates and stores relevant calculation result, so that the view only contains rows that meet the specific condition (`c1 > 30 AND c1 < 40`).

    Therefore, the above table query `SELECT SQRT(ABS(ABS(c2) - c1 - 1) + ABS(c2)) FROM aqumv_t1 WHERE c1 > 30 AND c1 < 40 AND SQRT(ABS(c2)) > 5.8;` is equivalent to querying from the materialized view `SELECT SQRT(ABS(ABS(c2) - c1 - 1) + ABS(c2)) FROM aqumv_t1 WHERE c1 > 30 AND c1 < 40 AND SQRT(ABS(c2)) > 5.8;`.

When the same query is executed, the data can be obtained directly from the materialized view, rather than from the original table. In this way, AQUMV can significantly improve query performance, especially when dealing with large data volumes and complex calculations.

## Implementation

AQUMV implements query optimization by equivalently transforming the query tree.

Cloudberry Database automatically uses materialized views only when the table query meets the following conditions:

- Materialized views must contain all the rows required by the query expression.
- If the materialized view contains more rows than the query, you might need to add additional filters.
- All output expressions must be able to be calculated from the output of the view.
- The output expression can fully or partially match the target list of the materialized view.

When there are multiple valid materialized view candidates, or the cost of querying from the materialized view is higher than querying directly from the original table (for example, the original table has indexes), you can let the planner make the best choice based on cost estimates.

## Restrictions

- Only `SELECT` queries for a single relationship are supported, which is applicable to materialized view queries and the original queries.
- **Unsupported** features include:

    - Aggregation (AGG)
    - Subqueries
    - Sorting of original queries (`ORDER BY`)
    - Joins (`JOIN`)
    - Sublinks (`SUBLINK`)
    - Grouping (`GROUP BY`)
    - Window functions
    - Common table expressions (CTE)
    - Deduplication (`DISTINCT ON`)
    - Refreshing materialized views (`REFRESH MATERIALIZED VIEW`)
    - `CREATE AS` statements

## See also

- [Create AO/AOCO Tables and Refresh Materialized Views in Parallel](./parallel-create-ao-refresh-mv.md)
- [Incremental Materialized View in Cloudberry Database](./use-incremental-materialized-view.md)
