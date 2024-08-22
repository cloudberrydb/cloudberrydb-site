---
title: ALTER RULE
---

# ALTER RULE

更改规则的定义。

## 语法概要

```sql
ALTER RULE name ON <table_name> RENAME TO <new_name>
```

## 描述

`ALTER RULE` 更改现有规则的属性。目前，唯一可用的操作是更改规则的名称。

要使用 `ALTER RULE`，你必须拥有规则适用的表或视图。

## 参数

**`name`**

要更改的现有规则的名称。

**`table_name`**

该规则所适用的表或视图的名称（可以选择性地指定其所在的数据库 schema 作为限定）。

**`new_name`**

规则的新名称。

## 示例

要重命名现有规则：

```sql
ALTER RULE notify_all ON emp RENAME TO notify_me; 
```

## 兼容性

`ALTER RULE` 是 Cloudberry Database 的扩展，整个查询重写系统也是如此。

## 另见

[`CREATE RULE`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/create-rule.md)、[`DROP RULE`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/drop-rule.md)

