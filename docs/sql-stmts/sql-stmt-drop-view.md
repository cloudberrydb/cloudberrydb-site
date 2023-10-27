---
title: DROP VIEW
---

# DROP VIEW

Removes a view.

## Synopsis

```sql
DROP VIEW [IF EXISTS] <name> [, ...] [CASCADE | RESTRICT]
```

## Description

`DROP VIEW` removes an existing view. Only the owner of a view can remove it.

## Parameters

**`IF EXISTS`**

Do not throw an error if the view does not exist. Cloudberry Database issues a notice in this case.

**`name`**

The name (optionally schema-qualified) of the view to remove.

**`CASCADE`**

Automatically drop objects that depend on the view (such as other views), and in turn all objects that depend on those objects.

**`RESTRICT`**

Refuse to drop the view if any objects depend on it. This is the default.

## Examples

Remove the view `topten`:

```sql
DROP VIEW topten;
```

## Compatibility

`DROP VIEW` fully conforms to the SQL standard, except that the standard only allows one view to be dropped per command. Also, the `IF EXISTS` option is a Cloudberry Database extension.

## See also

[`CREATE VIEW`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/sql-stmt-create-view.md), [`ALTER VIEW`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/sql-stmt-alter-view.md)
