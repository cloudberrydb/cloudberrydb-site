---
title: Use RuntimeFilter to Optimize Join Queries
---

# Use RuntimeFilter to Optimize Join Queries

When performing join queries on large tables, the SQL optimizer of Cloudberry Database often uses the HashJoin operator. HashJoin builds a hash table based on the join key to match the join key, which might cause a memory access bottleneck and disk bottleneck. RuntimeFilter is an optimization technique that generates filters in real-time during HashJoin operations, which can pre-filter data before executing HashJoin to speed up HashJoin operations. In some scenarios, the RuntimeFilter optimization can double execution efficiency.

HashJoin is commonly used for joining a smaller table with a larger table. In Cloudberry Database, when performing HashJoin, a hash table is typically built based on the smaller table to be joined. Then, by iterating over the tuples in the larger table, it finds matches in the hash table to perform the join. The smaller table used to build the hash table is called the inner table, while the other table used for iterative matching is called the outer table.

The main bottlenecks in executing the HashJoin operator are:

- Memory Access: For each tuple in the outer table, a matching tuple in the hash table needs to be found, involving one or more memory accesses.
- Disk I/O: If the inner table is too large to fit in memory, it must be processed in batches using disk storage, causing significant disk I/O.

With RuntimeFilter optimization enabled, Cloudberry Database builds a RuntimeFilter alongside the hash table. This means filtering the tuples of the larger table before executing HashJoin. During the process, a Bloom Filter is used to implement the RuntimeFilter, occupying much less memory space than the hash table. When the Bloom Filter can be fully stored in the L3 cache, its filtering efficiency is twice that of HashJoin, greatly reducing memory access costs.

The optimization will determine whether to generate a RuntimeFilter operator based on the filtering rate of the connection conditions of HashJoin and the size of the inner table. If the data volume deviates too much from the estimated result during the actual execution, Cloudberry Database will also stop using RuntimeFilter in time.

## Applicable scenarios

If your scenario meets all the following conditions, you can consider using RuntimeFilter optimization in HashJoin operations:

- The size of the inner table in a single segment is within 16 million rows.
- The original HashJoin join key has a selection rate lower than 60%, which means the result set meeting the Hash join condition is less than 60% of the outer table. This can also be understood as a filter rate greater than 40%.

In the above scenarios, the size of the Bloom Filter built by Cloudberry Database through RuntimeFilter is within 2 MB. It can be fully stored in the L3 cache, enabling the filtration of 40% of the tuples in the outer table with minimal overhead, thus yielding a positive impact. In certain scenarios, if the selectivity of the HashJoin join key is below 10%, the efficiency of execution can be doubled by optimizing with RuntimeFilter.

## Limitations

**Currently, RuntimeFilter is only supported when the estimated number of rows in the inner table is less than 16 million.**

This limitation is to prevent the Bloom Filter from occupying too much memory, which might cause slower execution speeds or reduced filtering efficiency. In future updates, there might be support for using RuntimeFilter in scenarios with very large inner tables to avoid disk I/O costs associated with batch processing.

## Usage example

The following is an example of the HashJoin algorithm benefiting from RuntimeFilter:

This optimization is effective only in the PostgreSQL optimizer. Therefore, before enabling RuntimeFilter, you need to first disable the GPORCA optimizer and manually turn on the GUC parameter `gp_enable_runtime_filter`.

```sql
-- Preparation
SET optimizer TO off; -- Disables the GPORCA optimizer to use the PostgreSQL optimizer.
SET gp_enable_runtime_filter TO on; -- Enables the RuntimeFilter optimization.

-- Creates the test table.
DROP TABLE IF EXISTS fact, dim;
CREATE TABLE fact (fid int, did int, val int);
CREATE TABLE dim (did int, proj_id int, filter_val int);

-- Generates test data, and 80% of fact.did overlaps with dim.did.
INSERT INTO fact SELECT i, i % 8000 + 1, i FROM generate_series(1, 100000) s(i);
INSERT INTO dim SELECT i, i % 10, i FROM generate_series(1, 10000) s(i);
ANALYZE fact, dim;

-- Checks the execution plan.
EXPLAIN (COSTS OFF) SELECT COUNT(*) FROM fact, dim
    WHERE fact.did = dim.did AND proj_id < 2;
                                QUERY PLAN
---------------------------------------------------------------------------
 Finalize Aggregate
   ->  Gather Motion 3:1  (slice1; segments: 3)
         ->  Partial Aggregate
               ->  Hash Join
                     Hash Cond: (fact.did = dim.did)
                     ->  RuntimeFilter
                           ->  Seq Scan on fact
                     ->  Hash
                           ->  Broadcast Motion 3:3  (slice2; segments: 3)
                                 ->  Seq Scan on dim
                                       Filter: (proj_id < 2)
 Optimizer: Postgres query optimizer
(12 rows)
```

In the execution plan above, you can see the RuntimeFilter operator. If you want to print more information about the execution, use `EXPLAIN ANALYZE`.

```sql
->  RuntimeFilter (actual time=0.047..5.976 rows=6682 loops=1)
       Bloom Bits: 1048576
       Extra Text: (seg1)   Inner Processed: 2000, Flase Positive Rate: 0.000000
```

## Example of optimization effect

Using the tables from the "Usage example", by joining the `fact` and `dim` tables with the condition that project ID is less than `2`, and using the `did` column as the join key, you can see the effect of using RuntimeFilter in the execution time:

```sql
-- Without RuntimeFilter
EXPLAIN ANALYZE SELECT COUNT(*) FROM fact, dim
    WHERE fact.did = dim.did AND proj_id < 2;

Execution Time: 35956.436 ms

-- With RuntimeFilter
SET gp_enable_runtime_filter TO on;
EXPLAIN ANALYZE SELECT COUNT(*) FROM fact, dim
    WHERE fact.did = dim.did AND proj_id < 2;

Execution Time: 18276.112 ms
```

The above is a part of the `EXPLAIN ANALYZE` results. In the full results, the fact table scan produces 100 million tuples. After being filtered by RuntimeFilter, 22 million tuples remain, and finally, exactly 20 million tuples are left after the HashJoin, as expected. The pre-filtering effect is clear, and the time taken is reduced by approximately 50%.
