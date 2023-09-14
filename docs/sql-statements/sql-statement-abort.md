# ABORT

Terminates the current transaction.

## Synopsis

``` {#sql_command_synopsis}
ABORT [WORK | TRANSACTION] [AND [NO] CHAIN]
```

## Description

`ABORT` rolls back the current transaction and causes all the updates made by the transaction to be discarded. This command is identical in behavior to the standard SQL command [ROLLBACK](ROLLBACK.html), and is present only for historical reasons.

## Parameters

WORK
TRANSACTION
:   Optional key words. They have no effect.

AND CHAIN
:   If `AND CHAIN` is specified, a new transaction is immediately started with the same transaction characteristics \(see [SET TRANSACTION](SET_TRANSACTION.html)\) as the just finished one. Otherwise, no new transaction is started.

## Notes

Use [COMMIT](COMMIT.html) to successfully terminate a transaction.

Issuing `ABORT` outside of a transaction block emits a warning and otherwise has no effect.

## Examples

To terminate all changes:

```
ABORT;
```

## Compatibility

This command is a Greenplum Database extension present for historical reasons. `ROLLBACK` is the equivalent standard SQL command.

## See Also

[BEGIN](BEGIN.html), [COMMIT](COMMIT.html), [ROLLBACK](ROLLBACK.html)

**Parent topic:** [SQL Commands](../sql_commands/sql_ref.html)

