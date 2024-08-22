---
title: DROP MATERIALIZED VIEW
---

# DROP MATERIALIZED VIEW

删除一个物化视图。

## 语法概要

```sql
DROP MATERIALIZED VIEW [ IF EXISTS ] <name> [, ...] [ CASCADE | RESTRICT ]
```

## 描述

`DROP MATERIALIZED VIEW` 用于删除一个已有的物化视图。要执行此命令，你必须是物化视图的所有者。

## 参数

**`IF EXISTS`**

如果物化视图不存在，则不抛出错误。此时 Cloudberry Database 会发出一个提醒。

**`name`**

要删除的物化视图的名称（可以选择性地指定其所在的数据库 schema 作为限定）。

**`CASCADE`**

自动删除依赖于物化视图的对象（例如其他物化视图或普通视图），以及依赖于这些对象的所有对象。

**`RESTRICT`**

如果有任何对象依赖于物化视图，Cloudberry Database 会拒绝删除物化视图。这是默认行为。

## 示例

该命令会删除名为 `order_summary` 的物化视图：

```sql
DROP MATERIALIZED VIEW order_summary;
```

## 兼容性

`DROP MATERIALIZED VIEW` 是 Cloudberry Database 的语言扩展，在 SQL 标准中没有。

## 另见

[`ALTER MATERIALIZED VIEW`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/alter-materialized-view.md)、[`CREATE MATERIALIZED VIEW`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/create-materialized-view.md)、[`REFRESH MATERIALIZED VIEW`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/refresh-materialized-view.md)
