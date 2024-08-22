---
title: DROP FOREIGN DATA WRAPPER
---

# DROP FOREIGN DATA WRAPPER

Removes a foreign-data wrapper.

## Synopsis

```sql
DROP FOREIGN DATA WRAPPER [ IF EXISTS ] <name> [ CASCADE | RESTRICT ]
```

## Description

`DROP FOREIGN DATA WRAPPER` removes an existing foreign-data wrapper from the current database. A foreign-data wrapper may be removed only by its owner.

## Parameters

**`IF EXISTS`**

Do not throw an error if the foreign-data wrapper does not exist. Cloudberry Database issues a notice in this case.

**`name`**

The name of an existing foreign-data wrapper.

**`CASCADE`**

Automatically drop objects that depend on the foreign-data wrapper (such as foreign tables and servers), and in turn all objects that depend on those objects.

**`RESTRICT`**

Refuse to drop the foreign-data wrapper if any object depends on it. This is the default.

## Examples

Drop the foreign-data wrapper named `dbi`:

```sql
DROP FOREIGN DATA WRAPPER dbi;
```

## Compatibility

`DROP FOREIGN DATA WRAPPER` conforms to ISO/IEC 9075-9 (SQL/MED). The `IF EXISTS` clause is a Cloudberry Database extension.

## See also

[CREATE FOREIGN DATA WRAPPER](/docs/sql-stmts/create-foreign-data-wrapper.md), [ALTER FOREIGN DATA WRAPPER](/docs/sql-stmts/alter-foreign-data-wrapper.md)
