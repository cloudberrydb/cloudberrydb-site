---
title: DROP RULE
---

# DROP RULE

删除一个重写规则。

## 语法概要

```sql
DROP RULE [IF EXISTS] <name> ON <table_name> [CASCADE | RESTRICT]
```

## 描述

`DROP RULE` 从表或视图中删除一个重写规则。

## 参数

**`IF EXISTS`**

如果规则不存在，则不抛出错误。在这种情况下，Cloudberry Database 会发出一个提醒。

**`name`**

要删除的规则的名称。

**`table_name`**

应用规则的表或视图的名称（可以选择性地指定其所在的数据库 schema 作为限定）。

**`CASCADE`**

自动删除依赖于规则的对象，以及依赖于这些对象的所有对象。

**`RESTRICT`**

如果有对象依赖于规则，Cloudberry Database 会拒绝删除规则。这是默认值。

## 示例

从表 `sales` 中删除重写规则 `sales_2006`：

```sql
DROP RULE sales_2006 ON sales;
```

## 兼容性

`DROP RULE` 是 Cloudberry Database 的扩展，整个查询重写系统也是如此。

## 另见

[`ALTER RULE`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/alter-rule.md)、[`CREATE RULE`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/create-rule.md)
