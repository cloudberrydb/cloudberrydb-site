---
title: Incremental Materialized View
---

# Incremental Materialized View in Cloudberry Database (New in v1.5.0)

This document introduces the usage scenarios of the incremental materialized view in Cloudberry Database, how to use it, the restrictions, and the things to note.

The incremental materialized view is a special form of materialized view. When data changes in a base table in Cloudberry Database (such as insertion, update, and deletion), the incremental materialized view does not need to recalculate all the data in the entire view. Instead, it only updates the parts that have changed since the last refresh. This can save a lot of computing resources and time, and significantly improve performance, especially when dealing with large datasets.

:::tip
Comparison between incremental materialized view and regular view:

- Regular view: Regular views do not store data, but dynamically generate results based on the defined SQL statement each time a query is executed. This means that the data on the view needs to be recalculated each time a query is executed, which can be time-consuming when dealing with large amounts of data.
- Incremental materialized view: Incremental materialized views calculate and store the result set in advance, which reduces the computing workload when executing queries. In addition, because it is an "incremental" update, when the base data changes, it only needs to update the affected part instead of recalculating the entire dataset.
:::

# Usage scenarios

- Where intermediate result sets need to be accelerated when executing queries.
- Where there are many read operations but few write operations.

# Usage example

:::info
Before using incremental materialized views, make sure that you are using Cloudberry Database v1.5.0 or a later version. Cloudberry Database v1.4.0 and earlier versions do not support incremental materialized views.
:::

To create an incremental materialized view, you can use the SQL command `CREATE INCREMENTAL MATERIALIZED VIEW`. The complete syntax support is as follows:

```sql
CREATE [INCREMENTAL] MATERIALIZED VIEW [ IF NOT EXISTS ] table_name
    [ (column_name [, ...] ) ]
    [ USING method ]
    [ WITH ( storage_parameter [= value] [, ... ] ) ]
    [ TABLESPACE tablespace_name ]
    AS query
    [ WITH [ NO ] DATA ]
```

The following example shows how to create incremental materialized views for tables in Cloudberry Database.

1. Create tables `t0` and `t1`.

    ```sql
    CREATE TABLE t0 (a int) DISTRIBUTED BY (a);
    CREATE TABLE t1 (a int) DISTRIBUTED BY (a);
    ```

2. Create an incremental materialized view `m` based on the two tables.

    - Create a simple materialized view. The following statement creates an incremental materialized view `m`. It selects all columns from table `t0` and distributes the data based on the values of column `a`. This means that view `m` stores a snapshot of the data in table `t0` and can be incrementally updated based on the data changes in `t0`.

        ```sql
        CREATE INCREMENTAL MATERIALIZED VIEW m AS SELECT * FROM t0 DISTRIBUTED BY (a);
        ```

    - Create a materialized view with join operations. The following statement also creates an incremental materialized view named `m`, but this time by joining tables `t0` and `t1`. It selects all values of `t0.a`, but only if the value of `t0.a` is equal to the value of `t1.a`. Similarly, the view distributes data based on the value of column `a`.

        ```sql
        CREATE INCREMENTAL MATERIALIZED VIEW m AS SELECT t0.a FROM t0, t1 WHERE t0.a = t1.a DISTRIBUTED BY (a);
        ```

3. Insert data into the tables. The `RETURNING *` clause returns the inserted row after the data is inserted.

    ```sql
    INSERT INTO t0 VALUES (5);
    INSERT INTO t1 VALUES (5);
    INSERT INTO t0 VALUES (8) RETURNING *;
    ```

4. Check the structure and data of the materialized view `m`:

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

5. View the data in the view `m`.

    ```sql
    postgres=# TABLE m;
    a 
    ---
    5
    (1 row)
    ```

To debug the statement executions related to incremental materialized views, you can set the value of the system parameter `debug_print_ivm ` to `ON`, that is, execute `SET debug_print_ivm = ON;`. The details of this parameter are as follows:

| Parameter name  | Description description         | Default value | Is it required? | Example                   |
| --------------- | ------------------------------- | ------------- | --------------- | ------------------------- |
| debug_print_ivm | Whether to enable IVM debugging | OFF           | No              | SET debug_print_ivm = ON; |

# Query performance comparison with regular view

The following example compares the query performance of a regular view and that of an incremental materialized view when processing large datasets in Cloudberry Database. The following example uses the Query 15 test dataset of TPC-H.

## With regular view

1. Create a regular view `revenue0`.

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

2. Select the supplier's details and their maximum revenue from the `supplier` table and the `revenue0` view.

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

    In the above query, the result of the view `revenue0` is calculated in real-time, and the query takes 3040.23 ms.

## With incremental materialized view

You can also create an incremental materialized view in the DDL phase, which greatly reduces query time.

1. Create an incremental materialized view `revenue0`.

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

2. Select the supplier details and their maximum revenue from the `supplier` table and the `revenue0` view. The query takes only 65 ms.

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

## TPC-H comparison

We have conducted a TPC-H test to compare the execution time of inserts and queries with regular view and incremental materialized view, respectively, with different data volumes. The result is as follows.

| Data volume | Normal inserts | Inserts with incremental materialized view | Queries with regular view | Queries with incremental materialized view |
| ----------- | -------------- | ------------------------------------------ | ------------------------ | ------------------------------------------ |
| 1 GB        | 2712 ms        | 3777 ms                                    | 813 ms                   | 43 ms                                      |
| 5 GB        | 15681 ms       | 29363 ms                                   | 3040 ms                  | 63 ms                                      |
| 10 GB       | 43011 ms       | 73188 ms                                   | 7057 ms                  | 102 ms                                     |

From the above table, you can see:

- In different data volumes, queries with incremental materialized views are executed much more quickly than normal queries. The query performance is significantly improved with the incremental materialized view.
- In different data volumes, inserts with incremental materialized views are not as quick as the normal inserts. This is because after data is inserted into tables, the database needs to update the materialized view synchronously, so incremental materialized views are not suitable for scenarios with frequent writes.

# Restrictions and notes

Currently, the incremental materialized views on Cloudberry Database have the following usage restrictions:

- Creating incremental materialized views for Append-Optimized (AO) tables is not supported.
- Creating incremental materialized views for partitioned tables is not supported.
- Creating incremental materialized views on PAX storage is not supported.
- The following clauses or operations are not supported when defining incremental materialized views.

    - `min` and `max` functions, custom aggregation functions
    - Left and right joins, namely `LEFT JOIN` and `OUTER JOIN`
    - Window functions, `HAVING` clauses
    - Subqueries, CTE queries
    - Set operations (`UNION`, `INTERSECT`, `EXCEPT`)
    - `DISTINCT ON`, `ORDER BY`, `LIMIT`, `OFFSET`

- Creating incremental materialized views on materialized views is not supported.

In addition, when using incremental materialized views on Cloudberry Database, you need to pay attention to the following issues:

- Using incremental materialized views will slow down data insertion, deletion, and updates. In addition, a base table might have multiple incremental materialized views, and the performance degradation is proportional to the number of incremental materialized views.
- Using incremental materialized views will generate temporary files to store calculation delta views, which might take up some storage space.
- Materialized views might increase storage costs depending on the definition of the view.

## See also

- [Use Automatic Materialized Views for Query Optimization](./use-auto-materialized-view-to-answer-queries.md)
- [Create AO/AOCO Tables and Refresh Materialized Views in Parallel](./parallel-create-ao-refresh-mv.md)