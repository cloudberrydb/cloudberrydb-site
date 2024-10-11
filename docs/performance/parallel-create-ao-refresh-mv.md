---
title: Create AO/AOCO Tables and Refresh Materialized Views in Parallel
---

# Create AO/AOCO Tables and Refresh Materialized Views in Parallel (New in v1.5.0)

Since v1.5.0, Cloudberry Database supports creating append-optimized (AO) tables and append-optimized column-oriented (AOCO) tables in parallel by using the `CREATE TABLE AS` statement, and supports refreshing materialized views in parallel based on the AO or AOCO tables. Parallel processing accelerates table creation and materialized view refresh.

To use the parallel feature, you need to first set the value of the system parameter `enable_parallel` to `ON`.

## Usage example

### Create AO/AOCO tables in parallel

1. Create a base table `t_p2` and use `WITH` to specify the number of parallel workers in the table creation statement.

    ```sql
    CREATE TABLE t_p2(c1 INT, c2 INT) WITH (parallel_workers=2) DISTRIBUTED BY (c1);
    ```

2. Insert data into `t_p2` and collect statistics on this table.

    ```sql
    INSERT INTO t_p2 SELECT i, i+1 FROM generate_series(1, 10000000) i;
    ANALYZE t_p2;
    ```

3. Enable parallel processing and turn off the GPORCA optimizer.

    ```sql
    SET enable_parallel = ON;
    SET optimizer = OFF;
    ```

4. Use `CREATE TABLE AS` to create a table based on `t_p2`. The parallel operator appears in the execution plan, indicating that tables have been created in parallel.

    - Create an AO table:

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

    - Create an AOCO table:

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

### Refresh materialized views in parallel

1. Create a base table `t_p` and use `WITH` to specify the number of parallel workers in the table creation statement.

    ```sql
    CREATE TABLE t_p(c1 INT, c2 INT) WITH (parallel_workers=8) DISTRIBUTED BY (c1);
    ```

2. Insert data into `t_p` and collect statistics on this table.

    ```sql
    INSERT INTO t_p SELECT i, i+1 FROM generate_series(1, 10000000) i;
    ANALYZE t_p;
    ```

3. Create a materialized view `matv` that uses row storage (AO row) or column storage (AO column), depending on the parameter `ao_row`. The content of the materialized view is aggregated query results derived from table `t_p`.

    ```sql
    CREATE MATERIALIZED VIEW matv USING ao_row AS SELECT SUM(a.c2) AS c2, AVG(b.c1) AS c1 FROM t_p a JOIN t_p b ON a.c1 = b.c1 WITH NO DATA DISTRIBUTED BY (c2);
    ```

    ```sql
    CREATE MATERIALIZED VIEW matv USING ao_column AS SELECT SUM(a.c2) AS c2, AVG(b.c1) AS c1 FROM t_p a JOIN t_p b ON a.c1 = b.c1 WITH NO DATA DISTRIBUTED BY (c2);
    ```

4. Enable parallel processing and turn off the GPORCA optimizer.

    ```sql
    SET enable_parallel = ON;
    SET optimizer = OFF;
    ```

5. Refresh the materialized view.

    ```sql
    REFRESH MATERIALIZED VIEW matv;
    ```

You can use tools to record the refresh durations, and compare the difference in the durations when turning on and off the parallel processing. You can see the acceleration from parallel processing.

## Acceleration effect

| Whether to enable parallel processing | Time spent on refreshing materialized view based on AO table | Time spent on refreshing materialized view based on AOCO table | Time spent on creating AO table using `CREATE TABLE AS` | Time spent on creating AOCO table using `CREATE TABLE AS` |
| ------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------- | ------------------------------------------------------- | --------------------------------------------------------- |
| Non-parallel                          | 6.18 ms                                                      | 5.91 ms                                                        | 6.56 ms                                                 | 6.06 ms                                                   |
| Parallel, with 4 workers              | 2.83 ms                                                      | 2.81 ms                                                        | 2.37 ms                                                 | 2.48 ms                                                   |

## See also

- [Use Automatic Materialized Views for Query Optimization](./use-auto-materialized-view-to-answer-queries.md)
- [Incremental Materialized View in Cloudberry Database](./use-incremental-materialized-view.md)