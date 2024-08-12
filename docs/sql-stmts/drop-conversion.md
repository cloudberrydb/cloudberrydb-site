---
title: DROP CONVERSION
---

# DROP CONVERSION

Removes a conversion.

## Synopsis

```sql
DROP CONVERSION [IF EXISTS] <name> [CASCADE | RESTRICT]
```

## Description

`DROP CONVERSION` removes a previously defined conversion. To be able to drop a conversion, you must own the conversion.

## Parameters

**`IF EXISTS`**

Do not throw an error if the conversion does not exist. A notice is issued in this case.

**`name`**

The name of the conversion. The conversion name may be schema-qualified.

CASCADE
**`RESTRICT`**

These keywords have no effect since there are no dependencies on conversions.

## Examples

Drop the conversion named `myname`:

```sql
DROP CONVERSION myname;
```

## Compatibility

There is no `DROP CONVERSION` statement in the SQL standard. The standard has `CREATE TRANSLATION` and `DROP TRANSLATION` statements that are similar to the Cloudberry Database `CREATE CONVERSION` and `DROP CONVERSION` statements.

## See also

[ALTER CONVERSION](/docs/sql-stmts/alter-conversion.md), [CREATE CONVERSION](/docs/sql-stmts/create-conversion.md)
