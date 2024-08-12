---
title: DROP TABLE
---

# DROP TABLE

删除一张表。

## 语法概要

```sql
DROP TABLE [IF EXISTS] <name> [, ...] [CASCADE | RESTRICT]
```

## 描述

`DROP TABLE` 从数据库中删除表。只有表的所有者、schema 的所有者和超级用户才能删除表。若只想删除表中的行而不删除表定义，请使用 [`DELETE`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/delete.md) 或 [`TRUNCATE`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/truncate.md)。

`DROP TABLE` 总是删除目标表的任何索引、规则、触发器和约束。但是，要删除被视图引用的表，必须指定 `CASCADE`。`CASCADE` 会完全删除依赖的视图。

## 参数

**`IF EXISTS`**

如果表不存在，则不抛出错误。在这种情况下，Cloudberry Database 会发出一个提醒。

**`name`**

要删除的表的名称（可以选择性地指定其所在的数据库 schema 作为限定）。

**`CASCADE`**

自动删除依赖于表的对象（例如视图），以及依赖于这些对象的所有对象。

**`RESTRICT`**

如果有对象依赖于表，Cloudberry Database 会拒绝删除表。这是默认行为。

## 示例

删除表 `mytable`：

```sql
DROP TABLE mytable;
```

删除两张表 `films` 和 `distributors`：

```sql
DROP TABLE films, distributors;
```

## 兼容性

`DROP TABLE` 符合 SQL 标准，但该标准只允许一次删除一个表。此外，`IF EXISTS` 选项是 Cloudberry Database 的扩展。

## 另见

[`ALTER TABLE`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/alter-table.md)、[`CREATE TABLE`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/create-table.md)
