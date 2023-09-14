# ABORT

Terminates the current transaction.

## Synopsis

```sql
ABORT [WORK | TRANSACTION] [AND [NO] CHAIN]
```

## Description

`ABORT` rolls back the current transaction and causes all the updates made by the transaction to be discarded. This command is identical in behavior to the standard SQL command [ROLLBACK](/docs/sql-statements/sql-statement-rollback.md), and is present only for historical reasons.

## Parameters

WORK
**`TRANSACTION`**

Optional key words. They have no effect.

AND CHAIN
:   If `AND CHAIN` is specified, a new transaction is immediately started with the same transaction characteristics (see [SET TRANSACTION](/docs/sql-statements/sql-statement-set-transaction.md)) as the just finished one. Otherwise, no new transaction is started.

## Notes

Use [COMMIT](/docs/sql-statements/sql-statement-commit.md) to successfully terminate a transaction.

Issuing `ABORT` outside of a transaction block emits a warning and otherwise has no effect.

## Examples

To terminate all changes:

```
ABORT;
```

## Compatibility

This command is a Cloudberry Database extension present for historical reasons. `ROLLBACK` is the equivalent standard SQL command.

## See Also

[BEGIN](/docs/sql-statements/sql-statement-begin.md), [COMMIT](/docs/sql-statements/sql-statement-commit.md), [ROLLBACK](/docs/sql-statements/sql-statement-rollback.md)



