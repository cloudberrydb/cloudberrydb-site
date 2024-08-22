---
title: ALTER TRIGGER
---

# ALTER TRIGGER

Changes the definition of a trigger.

## Synopsis

```sql
ALTER TRIGGER <name> ON <table> RENAME TO <newname>
```

## Description

`ALTER TRIGGER` changes properties of an existing trigger. The `RENAME` clause changes the name of the given trigger without otherwise changing the trigger definition. You must own the table on which the trigger acts to be allowed to change its properties.

## Parameters

**`name`**

The name of an existing trigger to alter.

**`table`**

The name of the table on which this trigger acts.

**`newname`**

The new name for the trigger.

## Notes

The ability to temporarily activate or deactivate a trigger is provided by [ALTER TABLE](/docs/sql-stmts/alter-table.md), not by `ALTER TRIGGER`, because `ALTER TRIGGER` has no convenient way to express the option of activating or deactivating all of a table's triggers at once.

Note that Cloudberry Database has limited support of triggers in this release. See [CREATE TRIGGER](/docs/sql-stmts/create-trigger.md) for more information.

## Examples

To rename an existing trigger:

```sql
ALTER TRIGGER emp_stamp ON emp RENAME TO emp_track_chgs;
```

## Compatibility

`ALTER TRIGGER` is a Cloudberry Database extension of the SQL standard.

## See also

[ALTER TABLE](/docs/sql-stmts/alter-table.md), [CREATE TRIGGER](/docs/sql-stmts/create-trigger.md), [DROP TRIGGER](/docs/sql-stmts/drop-trigger.md)
