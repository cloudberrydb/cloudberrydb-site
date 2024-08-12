---
title: DROP COLLATION
---

# DROP COLLATION

Removes a previously defined collation.

## Synopsis

```sql
DROP COLLATION [ IF EXISTS ] <name> [ CASCADE | RESTRICT ]
```

## Description

`DROP COLLATION` removes a previously defined collation. To be able to drop a collation, you must own the collation.

## Parameters

**`IF EXISTS`**

Do not throw an error if the collation does not exist. A notice is issued in this case.

**`name`**

The name of the collation. The collation name can be schema-qualified.

**`CASCADE`**

Automatically drop objects that depend on the collation, and in turn all objects that depend on those objects.

**`RESTRICT`**

Refuse to drop the collation if any objects depend on it. This is the default.

## Examples

To drop the collation named `german`:

```sql
DROP COLLATION german;
```

## Compatibility

The `DROP COLLATION` command conforms to the SQL standard, apart from the `IF EXISTS` option, which is a Cloudberry Database extension.

## See also

[ALTER COLLATION](/docs/sql-stmts/alter-collation.md), [CREATE COLLATION](/docs/sql-stmts/create-collation.md)
