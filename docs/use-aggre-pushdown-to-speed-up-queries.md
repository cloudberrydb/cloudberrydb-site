---
title: Use Aggregation Pushdown to Speed Up Query Execution
---

# Use aggregation pushdown to speed up query execution

Aggregation pushdown is an optimization technique that moves the aggregation operation closer to the data source. Cloudberry Database supports pushing down aggregation operations, which means that the aggregation operator is processed before the join operator.

In [applicable scenarios](#applicable-scenarios), aggregation pushdown can greatly reduce the size of the input set for join or aggregation operators, thereby enhancing their performance.

:::tip
- In the native PostgreSQL kernel's optimization logic, aggregation operations in each query are always performed after all join operations have been completed (excluding subqueries). Therefore, Cloudberry Database introduces aggregation pushdown, permitting the early execution of aggregation operations in applicable scenarios.
- To determine whether the optimizer's chosen execution plan applies the aggregation pushdown optimization, check the position relationship between aggregation and join in the execution plan tree. If a plan first executes `Partial Aggregation`, then performs `Join`, and finally performs `Final Aggregation`, it indicates that the optimizer has applied aggregation pushdown.
:::

## Usage example

Before using this aggregation pushdown optimization, you need to manually enable the GUC parameter `gp_enable_agg_pushdown`.

In addition, you need to manually set `optimizer=off` to disable the GPORCA optimizer, because this optimization currently only works in the PostgreSQL optimizer.

The following is an example of using aggregation pushdown optimization.

```sql
-- Creates tables t1 and t2.
CREATE TABLE t1(id INT, val1 INT);
CREATE TABLE t2(id INT, val2 INT);

SET OPTIMIZER=OFF; -- Disables the GPORCA optimizer.
SET gp_enable_agg_pushdown=ON; -- Enables the GUC parameter.

-- Executes a query with aggregation and join operations.
EXPLAIN (COSTS OFF) SELECT id, SUM(val1) FROM t1 NATURAL JOIN t2 GROUP BY id;
                     QUERY PLAN
-----------------------------------------------------
 Gather Motion 3:1  (slice1; segments: 3)
   ->  Finalize GroupAggregate
         Group Key: t1.id
         ->  Sort
               Sort Key: t1.id
               ->  Hash Join
                     Hash Cond: (t2.id = t1.id)
                     ->  Seq Scan on t2
                     ->  Hash
                           ->  Partial HashAggregate
                                 Group Key: t1.id
                                 ->  Seq Scan on t1
Optimizer: Postgres query optimizer
(13 rows)
```

From the execution plan result of the above example, you can see that before performing the HashJoin operation, Cloudberry Database first performs an aggregation operation on table `t1` based on the `id` column. This aggregation operation does not compromise the correctness of the statement's results and is likely to reduce the amount of data entering the HashJoin, thereby improving the efficiency of the statement execution.

## Applicable scenarios

Using aggregation pushdown in the following scenarios is expected to get obvious query performance improvements.

### Applicable scenario 1

A table where each record of data corresponds to multiple records of data in another table, requiring the two tables to be joined for group aggregation.

For example, to sum the prices of items in each order from the order table (`order_tbl`) and the order line table (`order_line_tbl`), which means to calculate the total amount of each order `SUM(price)`:

```sql
SELECT o.order_id, SUM(price)
  FROM order_tbl o, order_line_tbl ol
  WHERE o.order_id = ol.order_id
  GROUP BY o.order_id;
```

- Execution method in the native PostgreSQL optimizer: PostgreSQL's native optimizer can perform aggregation only after joining tables. Because every item in `order_line_tbl` corresponds to an order in `order_tbl`, the Join operator will not filter out any data.
- Execution method in Cloudberry Database: assuming that each order contains an average of 10 items, the volume of data is expected to decrease tenfold after aggregation. With aggregation pushdown enabled, the database first aggregates data in `order_line_tbl` based on `order_id`, reducing the volume of data entering the Join operator by tenfold, significantly reducing the cost of the Join operator. The corresponding execution plan is as follows:

```sql
EXPLAIN SELECT o.order_id, SUM(price)
  FROM order_tbl o, order_line_tbl ol
  WHERE o.order_id = ol.order_id
  GROUP BY o.order_id;
                                          QUERY PLAN
-----------------------------------------------------------------------------------------------
 Gather Motion 3:1  (slice1; segments: 3)  (cost=712.89..879.56 rows=10000 width=12)
   ->  Finalize HashAggregate  (cost=712.89..746.23 rows=3333 width=12)
         Group Key: o.order_id
         ->  Hash Join  (cost=617.00..696.23 rows=3333 width=12)
               Hash Cond: (ol.order_id = o.order_id)
               ->  Partial HashAggregate  (cost=538.00..571.38 rows=3338 width=12)
                     Group Key: ol.order_id
                     ->  Seq Scan on order_line_tbl ol  (cost=0.00..371.33 rows=33333 width=8)
               ->  Hash  (cost=37.33..37.33 rows=3333 width=4)
                     ->  Seq Scan on order_tbl o  (cost=0.00..37.33 rows=3333 width=4)
 Optimizer: Postgres query optimizer
```

Similar scenario includes: joining the project table (`project`) and the experiment table (`experiment`), and calculating the total experiment cost in the past year for each `project`. The corresponding reference SQL statement is as follows:

```sql
SELECT proj_name, sum(cost)
    FROM experiment e, project p
    WHERE e.e_pid = p.p_pid AND e.start_time > now() - interval '1 year'
    GROUP BY proj_name;
```

For this query, with aggregation pushdown enabled, Cloudberry Database performs pre-aggregation on the experiment table based on the `e_pid` column, aggregating information of the same project together.

However, if this query also applies many filters on the project table, this might cause a high selectivity rate for join, leading to inefficient execution. Therefore, aggregation pushdown might not be suitable in such cases.

### Applicable scenario 2

In a query statement, the Join operator greatly increases the result set size, requiring grouped calculations.

For example, joining the `person_1` table with the `person_2` table to find out how many unique pairs can be formed for each name that appears in both tables. The SQL query is as follows:

```sql
SELECT p1.name, COUNT(p1.name) FROM person_1 p1, person_2 p2 WHERE p1.name = p2.name GROUP BY p1.name;
```

In this example, if a `name` appears X times in the `p1` table and Y times in the `p2` table, then this name will appear X*Y times in the final result. If a large amount of data is in this scenario, the result set after the join might become very large.

In the above example, if the aggregation operation is pushed down in advance to either the `p1` or `p2` side, then each name will appear at most once after aggregation on that side. This effectively reduces the workload of the Join operator and the size of the input set for the subsequent aggregation operator. The corresponding execution plan is as follows:

```sql
EXPLAIN SELECT p1.name, COUNT(p1.name) FROM person_1 p1, person_2 p2 WHERE p1.name = p2.name GROUP BY p1.name;
                                       QUERY PLAN
-----------------------------------------------------------------------------------------
 Gather Motion 3:1  (slice1; segments: 3)  (cost=1758.62..1925.23 rows=9997 width=12)
   ->  Finalize HashAggregate  (cost=1758.62..1791.94 rows=3332 width=12)
         Group Key: p1.name
         ->  Hash Join  (cost=762.93..1592.17 rows=33290 width=12)
               Hash Cond: (p2.name = p1.name)
               ->  Seq Scan on p2  (cost=0.00..371.33 rows=33333 width=4)
               ->  Hash  (cost=637.97..637.97 rows=9997 width=12)
                     ->  Partial HashAggregate  (cost=538.00..637.97 rows=9997 width=12)
                           Group Key: p1.name
                           ->  Seq Scan on p1  (cost=0.00..371.33 rows=33333 width=4)
 Optimizer: Postgres query optimizer
(11 rows)
```

## Unsuitable scenarios

In the following scenarios, aggregation pushdown is unlikely to bring performance improvement. It is not recommended to enable aggregation pushdown in these scenarios.

### Unsuitable scenario 1

The data volume does not change much after aggregation.

Contrary to the [applicable scenario 1](#applicable-scenario-1) and [applicable scenario 2](#applicable-scenario-2), if aggregation in advance does not greatly change the data volume and cannot reduce the size of the input set for subsequent computing, then it is recommended first to execute the Join operator to avoid unnecessary overhead.

### Unsuitable scenario 2

If the join key is different from the grouping key, pushing down aggregation will change the grouping key used after the pushdown. In such cases, aggregation pushdown that rewrites the grouping key cannot reduce the data volume, causing poor performance of the pushed-down aggregation:

```sql
SELECT t1.value, COUNT(*) FROM t1, t2 WHERE t1.key = t2.key GROUP BY t1.value;
```

For the above query examples, directly pushing down the aggregation to the `t1` side will cause incorrect results, with details similar to the limitations in [unsuitable scenario 1](#unsuitable-scenario-1). To ensure the accuracy of the results, the equivalent grouping key for the actual pushed-down aggregation becomes `GROUP BY t1.key, t1.value`.

In this case, if the key and value in the `t1` table are completely unrelated, each group might only contain a single tuple, so this aggregation pushdown will not have any positive effect. However, if the key and value are strongly correlated, or the same key always corresponds to the same value, then the grouping effect is not affected.

In the example above, the original grouping by `t1.value` is obvious. But after the aggregation pushdown, the grouping key changes to `t1.key, t1.value`, and if the correlation between key and value is weak, it makes the grouping in the aggregation less effective.

## Limitations

This section describes some limitations of the aggregation pushdown feature, including situations where this optimization cannot logically be applied and cases where it is not yet supported in engineering implementation.

### Limitation 1

Aggregation pushdown cannot be applied when filtering is performed on columns other than those in the `GROUP BY` clause during the join and subsequent computing processes. Consider the following SQL query:

```sql
SELECT id, SUM(val) FROM t1, t2 WHERE t1.id = t2.id AND t1.val > t2.val GROUP BY id;
```

In the above example, assume two tuples A and B from table `t1`, both with the `id` value `100`, and a tuple C from table `t2`, also with the `id` value `100`.

During the join process of AB and C, although A and B have the same `id` values, it is not guaranteed that they will both pass or fail the filtering condition `AB.val > C.val`. In this case, pre-aggregating the sum of `val` based on `id` will inevitably combine the `val` s of A and B. However, they might not both pass or fail the filtering condition, causing incorrect results.

In contrast, the following query example is similar but suitable for aggregation pushdown:

```sql
SELECT id, SUM(val) FROM t1, t2 WHERE t1.id = t2.id AND t1.id < t2.id_thre GROUP BY id;
```

This example also considers the same ABC tuples as the previous example. Because the additional filtering condition only uses the `id` column from `t1`, the two tuples AB with the same `id` and the given tuple C will either all pass or all fail the filtering together. Therefore, it is possible to aggregate the sum of `val` s of the AB tuples in advance.

### Limitation 2

Aggregation pushdown on both sides of a Join is not supported. Consider the following SQL query:

```sql
SELECT id, SUM(val) FROM t1, t2 WHERE t1.id = t2.id GROUP BY id;
```

You can rewrite the statement to get an equivalent alternative statement:

```sql
SELECT id, sum1 * cnt2 FROM
    (SELECT id, SUM(val) FROM t1 GROUP BY id) AT1(id, sum1),
    (SELECT id, COUNT(*) FROM t2 GROUP BY id) AT2(id, cnt2)
WHERE AT1.id = AT2.id GROUP BY id;
```

In this example, the aggregation operation is pushed down to both sides of the join. For all tuples in the `t1` table with `id` 100, Cloudberry Database pre-aggregates their `val` s, resulting in a corresponding `sum1`.

During the actual join process, for each tuple in the `t2` table with `id` 100, a join is performed with the tuple belonging to `sum1`, resulting in the corresponding tuples. This means that for each `id` 100 in `t2`, `sum1` will appear once in the final sum, allowing Cloudberry Database to pre-aggregate `t2`, calculating the total number of tuples with `id` 100 as `cnt2`. The final result can then be calculated through `sum1 * cnt2`.

This scenario involves relatively complex statement and expression rewriting, and is currently not supported in Cloudberry Database.
