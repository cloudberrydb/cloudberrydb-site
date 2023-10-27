---
title: ABORT
---

# ABORT

Terminates the current transaction.

## Synopsis

```sql
ABORT [WORK | TRANSACTION] [AND [NO] CHAIN]
```

## Description

`ABORT` rolls back the current transaction and causes all the updates made by the transaction to be discarded. This command is identical in behavior to the standard SQL command [`ROLLBACK`](/docs/sql-stmts/sql-stmt-rollback.md), and is present only for historical reasons.

## Parameters

**`WORK`**<br />
**`TRANSACTION`**

Optional key words. They have no effect.

**`AND CHAIN`**

If `AND CHAIN` is specified, a new transaction is immediately started with the same transaction characteristics (see [SET TRANSACTION](/docs/sql-stmts/sql-stmt-set-transaction.md)) as the just finished one. Otherwise, no new transaction is started.

## Notes

Use [`COMMIT`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/sql-stmt-commit.md) to successfully terminate a transaction.

Issuing `ABORT` outside of a transaction block emits a warning and otherwise has no effect.

## Examples

To terminate all changes:

```sql
ABORT;
```

## Compatibility

This command is a Cloudberry Database extension present for historical reasons. `ROLLBACK` is the equivalent standard SQL command.

## See also

[`BEGIN`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/sql-stmt-begin.md), [`COMMIT`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/sql-stmt-commit.md), [`ROLLBACK`](/docs/sql-stmts/sql-stmt-rollback.md)
