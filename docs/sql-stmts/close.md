---
title: CLOSE
---

# CLOSE

Closes a cursor.

## Synopsis

```sql
CLOSE { <cursor_name> | ALL }
```

## Description

`CLOSE` frees the resources associated with an open cursor. After the cursor is closed, no subsequent operations are allowed on it. A cursor should be closed when it is no longer needed.

Every non-holdable open cursor is implicitly closed when a transaction is terminated by `COMMIT` or `ROLLBACK`. A holdable cursor is implicitly closed if the transaction that created it is prematurely ended via `ROLLBACK`. If the creating transaction successfully commits, the holdable cursor remains open until an explicit `CLOSE` is run, or the client disconnects.

## Parameters

**`cursor_name`**

The name of an open cursor to close.

**`ALL`**

Close all open cursors.

## Notes

Cloudberry Database does not have an explicit `OPEN` cursor statement. A cursor is considered open when it is declared. Use the [DECLARE](/docs/sql-stmts/declare.md) statement to declare (and open) a cursor.

You can see all available cursors by querying the `pg_cursors` system view.

If a cursor is closed after a savepoint which is later rolled back, the `CLOSE` is not rolled back; that is, the cursor remains closed.

## Examples

Close the cursor `portala`:

```sql
CLOSE portala;
```

## Compatibility

`CLOSE` is fully conforming with the SQL standard. `CLOSE ALL` is a Cloudberry Database extension.

## See also

[DECLARE](/docs/sql-stmts/declare.md), [FETCH](/docs/sql-stmts/fetch.md), [MOVE](/docs/sql-stmts/move.md), [RETRIEVE](/docs/sql-stmts/retrieve.md)
