---
title: COMMIT
---

# COMMIT

Commits the current transaction.

## Synopsis

```sql
COMMIT [WORK | TRANSACTION] [AND [NO] CHAIN]
```

## Description

`COMMIT` commits the current transaction. All changes made by the transaction become visible to others and are guaranteed to be durable if a crash occurs.

## Parameters

**`WORK`**<br />
**`TRANSACTION`**

Optional key words. They have no effect.

**`AND CHAIN`**

If `AND CHAIN` is specified, a new transaction is immediately started with the same transaction characteristics (see [SET TRANSACTION](/docs/sql-stmts/set-transaction.md)) as the just finished one. Otherwise, no new transaction is started.

## Notes

Use [ROLLBACK](/docs/sql-stmts/rollback.md) to prematurely end a transaction.

Issuing `COMMIT` when not inside a transaction does no harm, but it will provoke a warning message. `COMMIT AND CHAIN` when not inside a transaction is an error.

## Examples

To commit the current transaction and make all changes permanent:

```sql
COMMIT;
```

## Compatibility

The command `COMMIT` conforms to the SQL standard. The form `COMMIT TRANSACTION` is a Cloudberry Database extension.

## See also

[BEGIN](/docs/sql-stmts/begin.md), [END](/docs/sql-stmts/end.md), [ROLLBACK](/docs/sql-stmts/rollback.md), [START TRANSACTION](/docs/sql-stmts/start-transaction.md)
