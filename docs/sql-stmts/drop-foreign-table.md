---
title: DROP FOREIGN TABLE
---

# DROP FOREIGN TABLE

Removes a foreign table.

## Synopsis

```sql
DROP FOREIGN TABLE [ IF EXISTS ] <name> [, ...] [ CASCADE | RESTRICT ]
```

## Description

`DROP FOREIGN TABLE` removes an existing foreign table. Only the owner of a foreign table can remove it.

## Parameters

**`IF EXISTS`**

Do not throw an error if the foreign table does not exist. Cloudberry Database issues a notice in this case.

**`name`**

The name (optionally schema-qualified) of the foreign table to drop.

**`CASCADE`**

Automatically drop objects that depend on the foreign table (such as views), and in turn all objects that depend on those objects.

**`RESTRICT`**

Refuse to drop the foreign table if any objects depend on it. This is the default.

## Examples

To destroy two foreign tables, `films` and `distributors`:

```sql
DROP FOREIGN TABLE films, distributors;
```

## Compatibility

`DROP FOREIGN TABLE` conforms to ISO/IEC 9075-9 (SQL/MED), except that the standard only allows one foreign table to be dropped per command. The `IF EXISTS` clause is a Cloudberry Database extension.

## See also

[ALTER FOREIGN TABLE](/docs/sql-stmts/alter-foreign-table.md), [CREATE FOREIGN TABLE](/docs/sql-stmts/create-foreign-table.md)
