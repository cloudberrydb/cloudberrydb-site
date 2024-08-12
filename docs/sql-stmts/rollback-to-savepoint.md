---
title: ROLLBACK TO SAVEPOINT
---

# ROLLBACK TO SAVEPOINT

Rolls back the current transaction to a savepoint.

## Synopsis

```sql
ROLLBACK [ WORK | TRANSACTION ] TO [ SAVEPOINT ] <savepoint_name>
```

## Description

This command rolls back all commands that were run after the savepoint was established. The savepoint remains valid and can be rolled back to again later, if needed.

`ROLLBACK TO SAVEPOINT` implicitly destroys all savepoints that were established after the named savepoint.

## Parameters

**`WORK`**<br />
**`TRANSACTION`**

Optional key words. They have no effect.

**`savepoint_name`**

The name of the savepoint to roll back to.

## Notes

Use [RELEASE SAVEPOINT](/docs/sql-stmts/release-savepoint.md) to destroy a savepoint without discarding the effects of commands run after it was established.

Specifying a savepoint name that has not been established is an error.

Cursors have somewhat non-transactional behavior with respect to savepoints. Any cursor that is opened inside a savepoint will be closed when the savepoint is rolled back. If a previously opened cursor is affected by a `FETCH` command inside a savepoint that is later rolled back, the cursor remains at the position that `FETCH` left it pointing to (that is, cursor motion caused by `FETCH` is not rolled back). Closing a cursor is not undone by rolling back, either. However, other side-effects caused by the cursor's query (such as side-effects of volatile functions called by the query) *are* rolled back if they occur during a savepoint that is later rolled back. A cursor whose execution causes a transaction to end prematurely is put in a cannot-execute state, so while the transaction can be restored using `ROLLBACK TO SAVEPOINT`, the cursor can no longer be used.

## Examples

To undo the effects of the commands run after `my_savepoint` was established:

```sql
ROLLBACK TO SAVEPOINT my_savepoint;
```

Cursor positions are not affected by a savepoint rollback:

```sql
BEGIN;
DECLARE foo CURSOR FOR SELECT 1 UNION SELECT 2;
SAVEPOINT foo;
FETCH 1 FROM foo;
column 
----------
        1

ROLLBACK TO SAVEPOINT foo;
FETCH 1 FROM foo;
column 
----------
        2

COMMIT;
```

## Compatibility

The SQL standard specifies that the key word `SAVEPOINT` is mandatory, but Cloudberry Database (and Oracle) allow it to be omitted. SQL allows only `WORK`, not `TRANSACTION`, as a noise word after `ROLLBACK`. Also, SQL has an optional clause `AND [NO] CHAIN` which is not currently supported by Cloudberry Database. Otherwise, this command conforms to the SQL standard.

## See also

[`BEGIN`](/docs/sql-stmts/begin.md), [`COMMIT`](/docs/sql-stmts/commit.md), [`RELEASE SAVEPOINT`](/docs/sql-stmts/release-savepoint.md), [`ROLLBACK`](/docs/sql-stmts/rollback.md), [`SAVEPOINT`](/docs/sql-stmts/savepoint.md)
