---
title: DROP STATISTICS
---

# DROP STATISTICS

Removes extended statistics.

## Synopsis

```sql
DROP STATISTICS [ IF EXISTS ] <name> [, ...] [ CASCADE | RESTRICT ]
```

## Description

`DROP STATISTICS` removes statistics object(s) from the database. Only the statistics object's owner, the schema owner, or a superuser can drop a statistics object.

## Parameters

**`IF EXISTS`**

Do not throw an error if the statistics object does not exist. Cloudberry Database issues a notice in this case.

**`name`**

The name (optionally schema-qualified) of the statistics object to drop.

CASCADE
**`RESTRICT`**

These key words have no effect, since there are no dependencies on statistics.

## Examples

Destroy two statistics objects in different schemas, without failing if they do not exist:

```sql
DROP STATISTICS IF EXISTS
    accounting.users_uid_creation,
    public.grants_user_role;
```


## Compatibility

There is no `DROP STATISTICS` command in the SQL standard.

## See also

[ALTER STATISTICS](/docs/sql-stmts/alter-statistics.md), [CREATE STATISTICS](/docs/sql-stmts/create-statistics.md)
