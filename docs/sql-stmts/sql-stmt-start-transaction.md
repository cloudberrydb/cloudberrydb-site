---
title: START TRANSACTION
---

# START TRANSACTION

Starts a transaction block.

## Synopsis

```sql
START TRANSACTION [<transaction_mode>] [, ...]

-- where <transaction_mode> is one of:

   ISOLATION LEVEL {SERIALIZABLE | REPEATABLE READ | READ COMMITTED | READ UNCOMMITTED}
   READ WRITE | READ ONLY
   [NOT] DEFERRABLE
```

## Description

`START TRANSACTION` begins a new transaction block. If the isolation level, read/write mode, or deferrable mode is specified, the new transaction has those characteristics, as if [SET TRANSACTION](/docs/sql-stmts/sql-stmt-set-transaction.md) was run. This is the same as the [`BEGIN`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/sql-stmt-begin.md) command.

## Parameters

Refer to [SET TRANSACTION](/docs/sql-stmts/sql-stmt-set-transaction.md) for information on the meaning of the parameters to this statement.


## Compatibility

In the standard, it is not necessary to issue `START TRANSACTION` to start a transaction block: any SQL command implicitly begins a block. Cloudberry Database's behavior can be seen as implicitly issuing a `COMMIT` after each command that does not follow `START TRANSACTION` (or `BEGIN`), and it is therefore often called 'autocommit'. Other relational database systems may offer an autocommit feature as a convenience.

The `DEFERRABLE` transaction_mode is a Cloudberry Database language extension.

The SQL standard requires commas between successive transaction_modes, but for historical reasons Cloudberry Database allows the commas to be omitted.

See also the compatibility section of [SET TRANSACTION](/docs/sql-stmts/sql-stmt-set-transaction.md).

## See also

[`BEGIN`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/sql-stmt-begin.md), [`COMMIT`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/sql-stmt-commit.md), [`ROLLBACK`](/docs/sql-stmts/sql-stmt-rollback.md), [`SAVEPOINT`](/docs/sql-stmts/sql-stmt-savepoint.md), [`SET TRANSACTION`](/docs/sql-stmts/sql-stmt-set-transaction.md)
