---
title: DROP RULE
---

# DROP RULE

Removes a rewrite rule.

## Synopsis

```sql
DROP RULE [IF EXISTS] <name> ON <table_name> [CASCADE | RESTRICT]
```

## Description

`DROP RULE` drops a rewrite rule from a table or view.

## Parameters

**`IF EXISTS`**

Do not throw an error if the rule does not exist. Cloudberry Database issues a notice in this case.

**`name`**

The name of the rule to remove.

**`table_name`**

The name (optionally schema-qualified) of the table or view that the rule applies to.

**`CASCADE`**

Automatically drop objects that depend on the rule, and in turn all objects that depend on those objects.

**`RESTRICT`**

Refuse to drop the rule if any objects depend on it. This is the default.

## Examples

Remove the rewrite rule `sales_2006` on the table `sales`:

```sql
DROP RULE sales_2006 ON sales;
```

## Compatibility

`DROP RULE` is a Cloudberry Database extension, as is the entire query rewrite system.

## See also

[`ALTER RULE`](/docs/sql-stmts/alter-rule.md), [`CREATE RULE`](/docs/sql-stmts/create-rule.md)
