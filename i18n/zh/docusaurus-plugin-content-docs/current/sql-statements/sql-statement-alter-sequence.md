---
title: ALTER SEQUENCE
description: 了解 SQL 语句 ALTER SEQUENCE 在 Cloudberry Database 中的用法。
---

# ALTER SEQUENCE

`ALTER SEQUENCE` 语句用来更改生成器的序列。

## 概要

```sql
ALTER SEQUENCE <name> [INCREMENT [ BY ] <increment>] 
     [MINVALUE <minvalue> | NO MINVALUE] 
     [MAXVALUE <maxvalue> | NO MAXVALUE] 
     [RESTART [ WITH ] <start>] 
     [CACHE <cache>] [[ NO ] CYCLE] 
     [OWNED BY {<table.column> | NONE}]

ALTER SEQUENCE <name> RENAME TO <new_name>

ALTER SEQUENCE <name> SET SCHEMA <new_schema>
```

## 描述

用户必须是该序列的所有者才能使用 `ALTER SEQUENCE`。要更改序列的 schema，用户还必须拥有新 schema 的 `CREATE` 权限。注意超级用户自动拥有所有的特权。

## 参数

- **name**：要修改的序列的名称（可包括 schema 信息）。
- **increment**：子句 `INCREMENT BY <increment>` 是可选的。正值表示升序，负值表示降序。如果未指定，则将保留旧的增量值。
- **minvalue | NO MINIVALUE**：可选子句 `MINVALUE minvalue` 决定序列能生成的最小值。如果 `NO MINVALUE` 被指定，如果指定了 `NO MINVALUE`，上升序列和下降序列的默认值分别是 `1` 和 `-263-1`。如果这些选项都没有被指定，将保持当前的最小值。
- **maxvalue | NO MAXVALUE**：可选子句 `MAXVALUE maxvalue` 决定序列能生成的最大值。如果 `NO MAXVALUE` 被指定，上升序列和下降序列的默认值分别是 `263-1` 和 `-1`。如果这些选项都没有被指定，将保持当前的最大值。
- **start**：可选子句 `RESTART WITH` 更改该序列的开始值。
- **cache**：子句 `CACHE <cache>` 允许预先分配序列号并将其存储在内存中以便更快地访问。最小值是 `1`（每次只生成一个值，也就是说没有缓存）。如果没有指定，将保留原先的缓冲值。
- **CYCLE**：可用于在升序或降序序列达到最大值或最小值时，允许序列循环。如果达到最大值或最小值，下一个被生成的数字将分别是 `minvalue` 或者 `maxvalue`。
- **NO CYCLE**：如果指定了 `NO CYCLE`，在该序列达到其最大值后，调用 `nextval()` 将会返回错误。如果 `CYCLE` 或 `NO CYCLE` 都没有被指定，将维持原先的循环行为。
- **OWNED BY table.column | OWNED BY NONE**：`OWNED BY` 可以将该序列与某个特定的表列相关联。如果删除该列（或者整个表），该序列也会被自动删除。如果指定了 `OWNED BY`，这种关联会替代之前为该序列指定的关联。被指定的表必须具有相同的所有者并且与该序列在同一个 schema 中。`OWNED BY NONE` 可以移除现有的所有关联。
- **new_name**：该序列的新名称。
- **new_schema**：该序列的新 schema。

## 示例

```sql
ALTER SEQUENCE serial RESTART WITH 105;
```

## 兼容性

`ALTER SEQUENCE` 符合 SQL 标准。除了 `OWNED BY`、`RENAME TO` 和 `SET SCHEMA` 子句之外，都是 Cloudberry Database 数据库的语法扩展。

## 另见

`CREATE SEQUENCE`，`DROP SEQUENCE`，`ALTER TABLE`
