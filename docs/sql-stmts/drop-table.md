---
title: DROP TABLE
---

# DROP TABLE

Removes a table.

## Synopsis

```sql
DROP TABLE [IF EXISTS] <name> [, ...] [CASCADE | RESTRICT]
```

## Description

`DROP TABLE` removes tables from the database. Only the table owner, the schema owner, and superuser can drop a table. To empty a table of rows without removing the table definition, use [`DELETE`](/docs/sql-stmts/delete.md) or [`TRUNCATE`](/docs/sql-stmts/truncate.md).

`DROP TABLE` always removes any indexes, rules, triggers, and constraints that exist for the target table. However, to drop a table that is referenced by a view, `CASCADE` must be specified. `CASCADE` removes a dependent view entirely.

## Parameters

**`IF EXISTS`**

Do not throw an error if the table does not exist. Cloudberry Database issues a notice in this case.

**`name`**

The name (optionally schema-qualified) of the table to remove.

**`CASCADE`**

Automatically drop objects that depend on the table (such as views), and in turn all objects that depend on those objects.

**`RESTRICT`**

Refuse to drop the table if any objects depend on it. This is the default.

## Examples

Remove the table `mytable`:

```sql
DROP TABLE mytable;
```

Remove two tables, `films` and `distributors`:

```sql
DROP TABLE films, distributors;
```

## Compatibility

`DROP TABLE` conforms to the SQL standard, except that the standard allows only one table to be dropped per command. Also, the `IF EXISTS` option is a Cloudberry Database extension.

## See also

[`ALTER TABLE`](/docs/sql-stmts/alter-table.md), [`CREATE TABLE`](/docs/sql-stmts/create-table.md)
