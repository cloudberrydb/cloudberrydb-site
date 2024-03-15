---
title: 使用 RuntimeFilter 优化 Join 查询
---

# 使用 RuntimeFilter 优化 Join 查询

在执行大表连接查询的时候，SQL 优化器常选用 HashJoin 算子来进行运算。HashJoin 基于连接键构建哈希表来进行连接键的匹配，这可能存在内存访问和磁盘瓶颈。RuntimeFilter 是在执行 HashJoin 运算时，实时产生过滤器 (Filter) 的优化技术，可以在执行 HashJoin 前预先对数据进行筛选，更快地执行 HashJoin。在某些场景下，通过 RuntimeFilter 优化能够使执行效率翻倍。

HashJoin 常用于小表和大表的连接。Cloudberry Database 在执行 HashJoin 运算时，通常基于待连接的两表中较小的表来构建哈希表，然后循环地根据较大表中的元祖，在哈希表中查找连接键匹配的元祖来实现连接。用来构建哈希表的小表被称为内表 (Inner Table)，另一个用来循环匹配的表被称为外表 (Outer Table)。

HashJoin 算子在执行上主要存在以下瓶颈：

- 内存访问：对于外表的每个元组，需要在哈希表中查找匹配的内表元组，涉及一次或多次内存访问。
- 磁盘 I/O：若内表不适合全部放到内存中，需要借助磁盘来分批次进行处理，因此产生大量磁盘 I/O。

针对以上瓶颈开启 RuntimeFilter 优化后，Cloudberry Database 在构建哈希表的同时，也会构建对应的 RuntimeFilter，即在执行 HashJoin 之前对大表的元组进行过滤。在执行过程中，通过布隆过滤器 (Bloom Filter) 来实现 RuntimeFilter，该数据结构所占内存空间远小于哈希表。在能够完全存放在 L3 缓存中的情况下，布隆过滤器的过滤效率为 HashJoin 的两倍，使得内存访问开销大大降低。

该优化会根据 HashJoin 的连接条件的筛选率以及内表的大小来决定是否生成 RuntimeFilter 算子，在实际执行的过程中如果发现数据量与估算结果偏离太大，Cloudberry Database 也会及时停止使用 RuntimeFilter。

## 适用场景

如果场景同时满足以下条件，可以考虑在 HashJoin 运算中使用 RuntimeFilter 优化：

- 单个 Segment 中 HashJoin 的内表大小在 1600 万行以内。
- 原本的 HashJoin 连接键对数据的选择率低于 60%，即满足 Hash 连接条件的结果集大小不到外表的 60%，也可以理解为筛选率大于 40%。

上述场景下，Cloudberry Database 通过 RuntimeFilter 构建的布隆过滤器大小在 2 MB 以内，能够完全存放在 L3 缓存中，进而能以较小的开销筛选掉 40% 的外表元组，因此产生正向收益。在某些场景下，如果该 HashJoin 连接键的选择率低于 10%，通过 RuntimeFilter 优化能够使执行效率翻倍。

## 使用限制

**当前 RuntimeFilter 仅支持在内表行数估计小于 1600 万行的情况下启用。**

该限制是为了避免布隆过滤器占用内存过大，而导致执行速度慢或者筛选效率过低。在未来的更新中，可能会支持在超大内表的情况下使用 RuntimeFilter 来避免分批执行带来的磁盘 IO 开销。

## 用法示例

以下为 HashJoin 算法受益于 RuntimeFilter 的实际例子：

该优化仅在 PostgreSQL 优化器中生效，因此开启前，你需要先关闭 GPORCA 优化器，并手动开启 GUC 的参数 `gp_enable_runtime_filter`。

```sql
-- 准备工作
SET optimizer TO off; -- 关闭 ORCA 优化器，使用 PostgreSQL 优化器
SET gp_enable_runtime_filter TO on; -- 开启 RuntimeFilter 优化

-- 创建表格
DROP TABLE IF EXISTS fact, dim;
CREATE TABLE fact (fid int, did int, val int);
CREATE TABLE dim (did int, proj_id int, filter_val int);

-- 生成测试数据，其中 fact.did 与 dim.did 有 80% 是重叠的
INSERT INTO fact SELECT i, i % 8000 + 1, i FROM generate_series(1, 100000) s(i);
INSERT INTO dim SELECT i, i % 10, i FROM generate_series(1, 10000) s(i);
ANALYZE fact, dim;

-- 查看执行计划
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

以上执行计划中出现了 `RuntimeFilter` 算子。如果要打印更多执行相关的信息，你可以使用 `EXPLAIN ANALYZE`：

```sql
->  RuntimeFilter (actual time=0.047..5.976 rows=6682 loops=1)
       Bloom Bits: 1048576
       Extra Text: (seg1)   Inner Processed: 2000, Flase Positive Rate: 0.000000
```

## 优化效果示例

使用“用法示例”的表，以项目 `id` 小于 `2` 为条件，`did` 列为连接键，将 `fact` 和 `dim` 表连接起来，可从执行时间上看出使用 RuntimeFilter 的效果：

```sql
-- 未开启 RuntimeFilter
EXPLAIN ANALYZE SELECT COUNT(*) FROM fact, dim
    WHERE fact.did = dim.did AND proj_id < 2;

Execution Time: 35956.436 ms

-- 开启 RuntimeFilter
SET gp_enable_runtime_filter TO on;
EXPLAIN ANALYZE SELECT COUNT(*) FROM fact, dim
    WHERE fact.did = dim.did AND proj_id < 2;

Execution Time: 18276.112 ms
```

以上为 `EXPLAIN ANALYZE` 的部分结果。在完整结果中，fact 表扫描出元组 1 亿条，经过 RuntimeFilter 后剩余 2200 万条，最后通过 HashJoin 后刚好剩下预期中的 2000 万条。提前过滤效果明显，耗时也基本上减少了 50%。
