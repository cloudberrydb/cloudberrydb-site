---
title: Parallel Queries Execution
---

# Use Parallel Queries Execution

This document introduces the usage scenarios, usage examples, restrictions, and common issues of parallel query execution in Cloudberry Database. When Cloudberry Database executes a query, multiple CPU cores are used to process a single query, thereby improving query performance. The database dynamically adjusts the number of computing nodes (including the `SeqScan` operator) according to the data volume change.

## Applicable scenarios

Suitable for the scenario where a few segments are deployed on a single physical machine. Using parallel query execution in this scenario can dynamically adjust parallel sessions, spare the need to deploy more segments, and improve performance.

When the host CPU and disk load are not high, enabling parallel sessions for operators can bring better performance.

## How to use

Cloudberry Database supports parallel query execution on AO/AOCO and heap tables.

### Parallel queries on heap tables

1. Before enabling parallel queries, you need to turn off the GPORCA optimizer.

    ```sql
    SET enable_parallel = ON;
    SET optimizer = OFF;
    ```

2. Set the maximum value for the parallel session.

    ```sql
    -- When setting this parameter
    -- you need to consider the number of CPU cores and segments.
    SET max_parallel_workers_per_gather = 4;
    ```

    Query example:

    ```sql
    CREATE TABLE t1 (c1 int,c2 int, c3 int, c4 box) distributed by (c1);
    INSERT INTO t1 SELECT x, 2*x, 3*x, box('6,6,6,6') FROM generate_series(1,1000000) AS x;
    SELECT count(*) from t1;
    ```

### Parallel queries on AO/AOCO tables

1. Before enabling parallel queries, you need to turn off the GPORCA optimizer.

    ```sql
    SET enable_parallel = ON;
    SET optimizer = OFF;
    ```

2. Set the maximum value for the parallel session.

    ```sql
    -- When setting this parameter
    -- you need to consider the number of CPU cores and segments.
    SET max_parallel_workers_per_gather = 4;

    -- Sets how many files the data will be inserted into in a transaction.
    -- Larger values might lead to performance degradation, especially for AOCO tables.
    SET gp_appendonly_insert_files = 8;

    -- Switches to the next file to insert data every 100,000 rows.
    -- This number of rows can be adjusted,
    -- to make the data as evenly distributed as possible across multiple files.
    SET gp_appendonly_insert_files_tuples_range = 100000;
    ```

3. Insert data and run a query.

    ```sql
    CREATE TABLE ao(x INT) USING ao_row;
    INSERT INTO ao SELECT i FROM generate_series(1, 1000000) i;
    -- It is recommended to update statistics first.
    ANALYZE ao;
    SELECT COUNT(*) FROM ao;
    ```

## Parameter description

| Parameter name                            | Description                                                                                    | Default value | Is it required? | Example                                                   |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------- | --------------- | --------------------------------------------------------- |
| `enable_parallel`                         | Determines whether to enable parallel execution.                                               | `OFF`         | Yes             | `SET enable_parallel = ON;`                         |
| `optimizer`                               | Determines whether to enable the GPORCA optimizer.                                             | `ON`          | Yes             | `SET optimizer = OFF;`                              |
| `gp_appendonly_insert_files`              | Specifies how many files the data will be inserted into in a transaction.                      | `4`           | No              | `SET gp_appendonly_insert_files = 8;`                   |
| `gp_appendonly_insert_files_tuples_range` | Specifies the threshold of rows in a file, beyond which data will be inserted into a new file. | `100000`      | No              | `SET gp_appendonly_insert_files_tuples_range = 100000;` |

## Frequently asked questions

- Currently, Cloudberry Database supports executing queries in parallel that contain the following operators. If a query contains other operators, it will not be executed in parallel.

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

- Parallel queries do not always improve query performance. Too many parallel sessions can cause overload and lead to performance degradation.
- Enabling parallel sessions for a query means a significant increase in memory overhead, which might cause errors due to insufficient memory.
