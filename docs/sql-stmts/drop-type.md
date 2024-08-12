---
title: DROP TYPE
---

# DROP TYPE

Removes a data type.

## Synopsis

```sql
DROP TYPE [IF EXISTS] <name> [, ...] [CASCADE | RESTRICT]
```

## Description

`DROP TYPE` will remove a user-defined data type. Only the owner of a type can remove it.

## Parameters

**`IF EXISTS`**

Do not throw an error if the type does not exist. Cloudberry Database issues a notice in this case.

**`name`**

The name (optionally schema-qualified) of the data type to remove.

**`CASCADE`**

Automatically drop objects that depend on the type (such as table columns, functions, operators), and in turn all objects that depend on those objects.

**`RESTRICT`**

Refuse to drop the type if any objects depend on it. This is the default.

## Examples

Remove the data type `box`:

```sql
DROP TYPE box;
```

## Compatibility

This command is similar to the corresponding command in the SQL standard, apart from the `IF EXISTS` option, which is a Cloudberry Database extension. But note that much of the `CREATE TYPE` command and the data type extension mechanisms in Cloudberry Database differ from the SQL standard.

## See also

[`ALTER TYPE`](/docs/sql-stmts/alter-type.md), [`CREATE TYPE`](/docs/sql-stmts/create-type.md)
