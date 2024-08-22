---
title: ALTER STATISTICS
---

# ALTER STATISTICS

Changes the definition of an extended statistics object.

## Synopsis

```sql
ALTER STATISTICS <name> RENAME TO <new_name>

ALTER STATISTICS <name> OWNER TO { <new_owner> | CURRENT_USER | SESSION_USER }

ALTER STATISTICS <name> SET SCHEMA <new_schema>
```

## Description

`ALTER STATISTICS` changes the parameters of an existing extended statistics object. Any parameters not specifically set in the `ALTER STATISTICS` command retain their prior settings.

You must own the statistics object to use `ALTER STATISTICS`. To change a statistics object's schema, you must also have `CREATE` privilege on the new schema. To alter the owner, you must also be a direct or indirect member of the new owning role, and that role must have `CREATE` privilege on the statistics object's schema. (These restrictions enforce that altering the owner doesn't do anything you couldn't do by dropping and recreating the statistics object. However, a superuser can alter ownership of any statistics object anyway.)

## Parameters

**`name`**

The name (optionally schema-qualified) of the statistics object to be altered.

**`new_owner`**

The user name of the new owner of the statistics object.

**`new_name`**

The new name for the statistics object.

**`new_schema`**

The new schema for the statistics object.


## Compatibility

There is no `ALTER STATISTICS` statement in the SQL standard.

## See also

[CREATE STATISTICS](/docs/sql-stmts/create-statistics.md), [DROP STATISTICS](/docs/sql-stmts/drop-statistics.md)
