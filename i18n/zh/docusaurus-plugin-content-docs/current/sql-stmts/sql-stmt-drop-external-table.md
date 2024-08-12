---
title: DROP EXTERNAL TABLE
---

# DROP EXTERNAL TABLE

移除一个外部表的定义。

## 语法概要

```sql
DROP EXTERNAL [WEB] TABLE [IF EXISTS] <name> [CASCADE | RESTRICT]
```

## 描述

`DROP EXTERNAL TABLE` 从数据库系统中移除一个外部表的定义。外部数据源或文件不会被删除。要执行此命令，你必须是外部表的所有者。

## 参数

**`WEB`**

删除外部 Web 表的可选关键字。

**`IF EXISTS`**

如果外部表不存在，则不抛出错误。在这种情况下，Cloudberry Database 会发出一个提醒。

**`name`**

现有外部表的名称（可以选择性地指定其所在的数据库 schema 作为限定）。

**`CASCADE`**

自动删除依赖于外部表的对象，例如视图。

**`RESTRICT`**

如果有任何对象依赖于外部表，Cloudberry Database 会拒绝删除外部表。这是默认行为。

## 示例

如果存在的话，移除名为 `staging` 的外部表：

```sql
DROP EXTERNAL TABLE IF EXISTS staging;
```

## 兼容性

在 SQL 标准中没有 `DROP EXTERNAL TABLE` 语句。

## 另见

[`CREATE EXTERNAL TABLE`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/create-external-table.md)、[`ALTER EXTERNAL TABLE`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/alter-external-table.md)
