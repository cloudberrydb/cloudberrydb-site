---
title: 使用聚集下推优化查询
---

# 使用聚集下推优化查询

聚集下推 (Aggregation Pushdown) 是使聚集 (Aggregation) 操作的运算更接近数据源的一种优化技术。Cloudberry Database 支持将聚集运算下推，即将聚集算子提前到连接 (Join) 算子之前进行计算。

在[适用的场景](#适用场景)下，聚集下推能够明显地减少连接算子或者聚集算子的输入集大小，进而提升算子的执行性能。

:::tip 提示
- 在原生 PostgreSQL 内核的优化器逻辑中，每个查询中的聚集操作始终都在全部连接操作结束后才会进行（不包含子查询的情况下）。因此 Cloudberry Database 引入聚集下推特性，使得 Cloudberry Database 能够在合适的场景下选择提前执行聚集操作。
- 要判断优化器选择的执行计划是否应用了聚集下推优化，可以观察 Aggregation 和 Join 在执行计划树中的位置关系。若某个执行计划先进行了 Partial Aggregation 然后再进行 Join 操作，最终才进行 Final Aggregation，则表示优化器应用了聚集下推。
:::

## 使用示例

使用该聚集下推优化前，你需要手动开启 GUC 参数 `gp_enable_agg_pushdown`。

此外，你还需要手动设置 `optimizer=off` 来关闭 GPORCA 优化器，因为当前该优化仅在 PostgreSQL 优化器中生效。

以下为聚集下推优化的使用示例。

```sql
-- 创建 t1 和 t2 两张表格
CREATE TABLE t1(id INT, val1 INT);
CREATE TABLE t2(id INT, val2 INT);

SET OPTIMIZER=OFF; -- 关闭 GPORCA 优化器
SET gp_enable_agg_pushdown=ON; -- 开启 GUC 参数

-- 执行一条带有聚集运算和连接运算的查询
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

从以上示例的执行计划结果中，可以看到在进行 HashJoin 运算前，Cloudberry Database 先对 `t1` 表根据 `id` 列提前执行了聚集运算。该聚集运算并不会破坏语句执行结果的正确性，并大概率能减少进入 HashJoin 的数据量，进而提升语句执行的效率。

## 适用场景

在以下场景下使用聚集下推，预期能获得较为明显的查询性能提升。

### 适用场景一

场景描述：一张表的每条数据对应另一张表中的多条数据，需要将两张表连接起来进行分组聚集运算。

例如需要将订单表 (`order_tbl`) 和订单项表 (`order_line_tbl`) 连接，对于每个订单将其对应订单项的价格求和，即需要计算每个订单的总金额 `SUM(price)`：

```sql
SELECT o.order_id, SUM(price)
  FROM order_tbl o, order_line_tbl ol
  WHERE o.order_id = ol.order_id
  GROUP BY o.order_id;
```

- 在 PostgreSQL 原生优化器中的执行方式：PostgreSQL 原生优化器只能先将两表连接再进行聚集运算。由于 `order_line_tbl` 表中的每个订单项一定存在对应的 `order_tbl` 表中的订单信息，因此该 Join 算子并不会筛选掉任何数据。
- 在 Cloudberry Database 中的执行方式：假设每个订单平均包含 10 个订单项，那么经过 Aggregation 算子进行聚集后，数据量预计会减少 10 倍。开启聚集下推后，数据库将先对 `order_line_tbl` 中的数据根据 `order_id` 进行提前聚集，由此传入 Join 算子的数据量将减少 10 倍，进而显著地降低 Join 算子的开销。对应的执行计划如下：

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

与该场景相似的场景还有：连接项目表 (`project`) 和实验表 (`experiment`)，对于每个项目 `project` 计算过去一年内的实验费用总和。对应的参考 SQL 语句如下：

```sql
SELECT proj_name, sum(cost)
    FROM experiment e, project p
    WHERE e.e_pid = p.p_pid AND e.start_time > now() - interval '1 year'
    GROUP BY proj_name;
```

对于该查询，开启聚集下推后，Cloudberry Database 会提前对 `experiment` 表根据 `e_pid` 列进行预聚集，将同一个 `project` 的信息先聚集在一起。

但如果该查询在 `project` 表上也做了许多筛选的话，可能使得  Join 的筛选率过高，导致执行效率不高，因此聚集下推暂时不适用于这种情况。

### 适用场景二

场景描述：查询语句中的 Join 算子会使得结果集显著变大，并最终需要分组计算结果。

例如需要将 `person_1` 表与 `person_2` 表连接，求出两表之间每个相同的名字能有多少不同的对，SQL 查询如下：

```sql
SELECT p1.name, COUNT(p1.name) FROM person_1 p1, person_2 p2 WHERE p1.name = p2.name GROUP BY p1.name;
```

该例子中若某个 `name` 在 `p1` 表中出现 X 次，在 `p2` 表中出现 Y 次，则该 `name` 在最终的结果中会出现 X*Y 次。若大量的数据都是这种情况，最终 Join 后的结果集可能就会很大。

在以上示例中，如果将聚集运算提前下推到 `p1` 或者 `p2` 侧，则每个 `name` 在该侧进行完聚集之后最多出现一次，能有效地减少 Join 算子的开销，以及后续 Aggregation 算子需要处理的输入集大小。对应执行计划如下：

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

## 不适用的场景

以下场景难以通过聚集下推得到性能提升，不建议开启聚集下推。

### 不适用的场景一

场景描述：执行聚集后数据量变化不大的场景。

与以上[适用场景一](#适用场景一)以及[适用场景二](#适用场景二)相反，若提前进行 Aggregation 不会使得数据量发生变化，无法减少后续计算的输入集大小，则应该先执行 Join 算子避免无谓的开销。

### 不适用的场景二

场景描述：若连接键与分组键不同，则聚集下推会使得下推后的分组键发生变化。这种情况下，聚集下推改写分组键后的聚集无法减少数据量，导致下推后的聚集效果不佳：

```sql
SELECT t1.value, COUNT(*) FROM t1, t2 WHERE t1.key = t2.key GROUP BY t1.value;
```

对于以上查询示例，如果直接将聚集下推到 `t1` 侧会导致得到错误结果，具体细节类似[使用限制一](#使用限制一)场景。为了保证计算结果的正确性，实际下推的聚集操作所等价的分组键会变成 `GROUP BY t1.key, t1.value`。

这种情况下如果 `t1` 表的 `key` 与 `value` 是完全不相干的，那么每个分组可能都只有单个元组，因此该聚集下推不会产生任何正面效果；但如果 `key` 与 `value` 相关性强，或者相同的 `key` 一定对应相同的 `value`，则分组效果不会受到影响。

对于以上示例，原本通过 `t1.value` 分组效果明显。但经过聚集下推后，分组键变成 `t1.key, t1.value`，且 `key` 与 `value` 相关性弱，导致该聚集的分组无法产生明显的效果。

## 使用限制

该小节描述聚集下推特性的一些限制，包括逻辑上无法应用该优化的情况以及工程实现上尚未支持的情况。

### 使用限制一

限制描述：在连接及后续计算过程中，通过 `GROUP BY` 列以外的列进行筛选的情况下无法应用聚集下推。考虑如下的 SQL 查询：

```sql
SELECT id, SUM(val) FROM t1, t2 WHERE t1.id = t2.id AND t1.val > t2.val GROUP BY id;
```

在以上示例中，假设 `id` 为 `100` 的两个来自 `t1` 表的元组 A 和 B，以及来自 `t2` 表同样 `id` 为 `100` 的元组 C。

在 AB 和 C 进行连接的过程中，A 和 B 虽然 `id` 相同，但不能保证它们同时通过或者不通过 `AB.val > C.val` 的筛选条件。在这种情况提前根据 `id` 对 `val` 进行求和必然会将 A 和 B 的 `val` 加到一起，然而它们并不一定同时通过或不通过筛选条件，因此会导致得到错误的结果。

作为对比，以下查询示例与其相似，但可以应用聚集下推：

```sql
SELECT id, SUM(val) FROM t1, t2 WHERE t1.id = t2.id AND t1.id < t2.id_thre GROUP BY id;
```

该例子中同样考虑与前面例子中相同的 ABC 三个元组，由于额外的筛选条件仅用到 `t1` 中的 `id` 列，AB 这两个 `id` 相同的元组与给定的元组 C 连接，要么都通过筛选，要么都不通过筛选，因此可以提前通过聚集操作将 AB 元组的 val 进行求和。

### 使用限制二

限制描述：不支持对 Join 的两侧同时进行聚集下推。考虑如下的 SQL 查询：

```sql
SELECT id, SUM(val) FROM t1, t2 WHERE t1.id = t2.id GROUP BY id;
```

实际上我们可以改写语句，得到与其等价的另一个语句：

```sql
SELECT id, sum1 * cnt2 FROM
    (SELECT id, SUM(val) FROM t1 GROUP BY id) AT1(id, sum1),
    (SELECT id, COUNT(*) FROM t2 GROUP BY id) AT2(id, cnt2)
WHERE AT1.id = AT2.id GROUP BY id;
```

该例子中将聚集操作同时下推到了 Join 的两侧。对于 `t1` 表中 `id` 为 `100` 的全部元组，Cloudberry Database 对其 `val` 提前进行了求和，得到了对应的 `sum1`。

在实际进行连接的过程中，对于 `t2` 表中每个 `id` 为 `100` 的元组，都会与 `sum1` 所属的元组进行连接并得到对应的元组。也就是说 `t2` 中每有一个 `id` 为 `100`，`sum1` 就会在最终的求和结果中出现一次，因此 Cloudberry Database 可以提前对 `t2` 进行聚集，计算出总共有 `cnt2` 个 `id` 为 `100` 的 元组，最后可以通过 `sum1 * cnt2` 来计算最终的结果。

由于该场景涉及到相对复杂的语句改写以及表达式改写，在目前产品中暂不支持。
