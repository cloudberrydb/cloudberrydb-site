---
title: RELEASE SAVEPOINT
---

# RELEASE SAVEPOINT

Destroys a previously defined savepoint.

## Synopsis

```sql
RELEASE [SAVEPOINT] <savepoint_name>
```

## Description

`RELEASE SAVEPOINT` destroys a savepoint previously defined in the current transaction.

Destroying a savepoint makes it unavailable as a rollback point, but it has no other user visible behavior. It does not undo the effects of commands run after the savepoint was established. (To do that, see [ROLLBACK TO SAVEPOINT](/docs/sql-stmts/rollback-to-savepoint.md).) Destroying a savepoint when it is no longer needed may allow the system to reclaim some resources earlier than transaction end.

`RELEASE SAVEPOINT` also destroys all savepoints that were established *after* the named savepoint was established.

## Parameters

**`savepoint_name`**

The name of the savepoint to destroy.

## Notes

Specifying a savepoint name that was not previously defined is an error.

It is not possible to release a savepoint when the transaction is in an aborted state.

If multiple savepoints have the same name, Cloudberry Database releases only the most recently defined unreleased savepoint. Repeated commands release progressively older savepoints.

## Examples

To establish and later destroy a savepoint:

```sql
BEGIN;
    INSERT INTO table1 VALUES (3);
    SAVEPOINT my_savepoint;
    INSERT INTO table1 VALUES (4);
    RELEASE SAVEPOINT my_savepoint;
COMMIT;
```

The above transaction inserts both 3 and 4.

## Compatibility

This command conforms to the SQL standard. The standard specifies that the key word `SAVEPOINT` is mandatory, but Cloudberry Database allows it to be omitted.

## See also

[BEGIN](/docs/sql-stmts/begin.md), [COMMIT](/docs/sql-stmts/commit.md), [ROLLBACK](/docs/sql-stmts/rollback.md), [ROLLBACK TO SAVEPOINT](/docs/sql-stmts/rollback-to-savepoint.md), [SAVEPOINT](/docs/sql-stmts/savepoint.md)
