---
title: ROLLBACK
---

# ROLLBACK

Stops the current transaction.

## Synopsis

```sql
ROLLBACK [WORK | TRANSACTION] [AND [NO] CHAIN]
```

## Description

`ROLLBACK` rolls back the current transaction and causes all the updates made by the transaction to be discarded.

## Parameters

**`WORK`**<br />
**`TRANSACTION`**

Optional key words. They have no effect.

**`AND CHAIN`**

If `AND CHAIN` is specified, a new transaction is immediately started with the same transaction characteristics (see [`SET TRANSACTION`](/docs/sql-stmts/sql-stmt-set-transaction.md)) as the just finished one. Otherwise, no new transaction is started.

## Notes

Use [`COMMIT`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/sql-stmt-commit.md) to successfully end the current transaction.

Issuing `ROLLBACK` when not inside a transaction block emits a warning and otherwise has no effect. `ROLLBACK AND CHAIN` outside of a transaction block is an error.

## Examples

To discard all changes made in the current transaction:

```sql
ROLLBACK;
```

## Compatibility

The command `ROLLBACK` conforms to the SQL standard. The form `ROLLBACK TRANSACTION` is a Cloudberry Database extension.

## See also

[`BEGIN`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/sql-stmt-begin.md), [`COMMIT`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/sql-stmt-commit.md), [`ROLLBACK TO SAVEPOINT`](/docs/sql-stmts/sql-stmt-rollback-to-savepoint.md), [`SAVEPOINT`](/docs/sql-stmts/sql-stmt-savepoint.md)
