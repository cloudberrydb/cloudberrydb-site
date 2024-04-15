---
title: 在 AO 表上使用 IndexScan
---

# 在 AO 表上使用 IndexScan

Cloudberry Database 支持对 Append-Optimized 表（简称 AO 表）进行 IndexScan，以此来提升某些场景下的查询效率，例如以下查询：

```sql
SELECT * FROM tbl WHERE val > 100 ORDER BY val LIMIT 10;
```

:::tip 提示
Append-Optimized (AO) 表是一种优化存储方式，面向以批量插入为主的场景，例如大数据分析和数据仓库场景。

当向 AO 表中插入新数据时，Cloudberry Database 会将新数据插入到表的末尾，而不是像普通的表那样寻找空闲空间插入。这意味着在向 AO 表插入数据时，只需要对文件进行追加写入，因此可以获得更高的插入效率。
:::

对于以上查询语句：

- 如果使用 heap 表存储方式，Cloudberry Database 执行该查询可以通过 IndexScan 找到 10 个 `val` 大于 `100` 的元祖，仅需通过索引和数据表读取大约 10 个元祖即可。
- 如果使用 AO 表的存储方式，且假设 `tbl` 表有 10 亿行元组，而我们通过 `LIMIT` 子句指定只需要返回 10 条元组：

    - Cloudberry Database 支持使用 IndexScan 运算来扫描 AO 表，可大幅降低扫描的数据量，大大提升扫描的效率，是比 SeqScan 以及 BitmapScan 更好的扫描方式。SeqScan 或者 BitmapScan 比 IndexScan 多扫描 1 亿倍的数据量。

## 适用场景

该特性适用于对较大的表进行查询，同时会通过 `ORDER BY` 及 `LIMIT` 从句来限制返回的结果集大小的场景：

```sql
SELECT * FROM tbl WHERE val > 100 ORDER BY val LIMIT 10;
```

:::info 注意
“较大的表”可理解为表大小大约为要查询数据的 3000 倍左右。例如使用 `LIMIT 10` 返回 10 条记录，表大于 3 万条记录可算是大表。
:::

根据数据量的大小可能得到不同程度的优化。最适用的场景下，原本需要执行数十分钟的查询能在 1 秒内返回。

## 使用示例

要启用 AO IndexScan，你需要先通过 `SET optimizer TO off;` 关闭 GPORCA 优化器，并将系统参数 `gp_enable_ao_indexscan` 设为 `ON`。

从以下示例可看出，不启用 AO IndexScan 的执行时间为 5888.235 ms，远长于启用 AO IndexScan 的执行时间 15.462 ms。

```sql
SET optimizer TO off; -- 要启用 AO IndexScan，需要先关闭 ORCA 优化器

-- 创建测试表，生成 1 亿条数据，并在 val 列创建索引
CREATE TABLE tbl (id int, val int) WITH (orientation='column', appendonly=true);
INSERT INTO tbl SELECT i, i FROM generate_series(1, 100000000) s(i);

-- 直接进行查询
EXPLAIN ANALYZE SELECT * FROM tbl WHERE val > 100 ORDER BY val LIMIT 10;

(Execution Time: 5888.235 ms)


-- 开启 AO 表 IndexScan 后再次查询
SET gp_enable_ao_indexscan TO on;
EXPLAIN ANALYZE SELECT * FROM tbl WHERE val > 100 ORDER BY val LIMIT 10;

(Execution Time: 15.462 ms)
```

当前该功能仅适用于 PostgreSQL 优化器。同时，由于在某些机械硬盘上，随机 I/O 可能比顺序 I/O 效率低 30000 倍，因此如果在使用较差的机械硬盘的情况下开启该特性，IndexScan 的执行效率可能并不高。
