---
title: DROP VIEW
---

# DROP VIEW

删除一个视图。

## 语法概要

```sql
DROP VIEW [IF EXISTS] <name> [, ...] [CASCADE | RESTRICT]
```

## 描述

`DROP VIEW` 删除一个已有的视图。只有视图的所有者才能删除它。

## 参数

**`IF EXISTS`**

如果要删除的视图不存在，则不抛出错误。在这种情况下，Cloudberry Database 会发出一个提醒。

**`name`**

要删除的视图的名称（可以选择性地指定其所在的数据库 schema 作为限定）。

**`CASCADE`**

自动删除依赖于该视图的对象（例如其他视图），以及依赖于这些对象的所有对象。

**`RESTRICT`**

如果有对象依赖于该视图，Cloudberry Database 会拒绝删除该视图。这是默认行为。

## 示例

删除视图 `topten`：

```sql
DROP VIEW topten;
```

## 兼容性

`DROP VIEW` 完全符合 SQL 标准，但该标准只允许一次命令删除一个视图。此外，`IF EXISTS` 选项是 Cloudberry Database 的扩展。

## 另见

[`CREATE VIEW`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/create-view.md)、[`ALTER VIEW`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/alter-view.md)
