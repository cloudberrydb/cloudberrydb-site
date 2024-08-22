---
title: BEGIN
---

# BEGIN

Starts a transaction block.

## Synopsis

```sql
BEGIN [WORK | TRANSACTION] [<transaction_mode>]

-- where <transaction_mode> is:

   ISOLATION LEVEL {READ UNCOMMITTED | READ COMMITTED | REPEATABLE READ | SERIALIZABLE}
   READ WRITE | READ ONLY
   [NOT] DEFERRABLE
```

## Description

`BEGIN` initiates a transaction block, that is, all statements after a `BEGIN` command will be run in a single transaction until an explicit [COMMIT](/docs/sql-stmts/commit.md) or [ROLLBACK](/docs/sql-stmts/rollback.md) is given. By default (without `BEGIN`), Cloudberry Database runs transactions in "autocommit" mode, that is, each statement is run in its own transaction and a commit is implicitly performed at the end of the statement (if execution was successful, otherwise a rollback is done).

Statements are run more quickly in a transaction block, because transaction start/commit requires significant CPU and disk activity. Execution of multiple statements inside a transaction is also useful to ensure consistency when making several related changes: other sessions will be unable to see the intermediate states wherein not all the related updates have been done.

If the isolation level, read/write mode, or deferrable mode is specified, the new transaction has those characteristics, as if [SET TRANSACTION](/docs/sql-stmts/set-transaction.md) was run.

## Parameters

WORK
**`TRANSACTION`**

Optional key words. They have no effect.

Refer to [SET TRANSACTION](/docs/sql-stmts/set-transaction.md) for information on the meaning of the other parameters to this statement.

## Notes

[START TRANSACTION](/docs/sql-stmts/start-transaction.md) has the same functionality as `BEGIN`.

Use [COMMIT](/docs/sql-stmts/commit.md) or [ROLLBACK](/docs/sql-stmts/rollback.md) to terminate a transaction block.

Issuing `BEGIN` when already inside a transaction block will provoke a warning message. The state of the transaction is not affected. To nest transactions within a transaction block, use savepoints (see [SAVEPOINT](/docs/sql-stmts/savepoint.md)).

For reasons of backwards compatibility, the commas between successive transaction_modes can be omitted.

## Examples

To begin a transaction block:

```sql
BEGIN;
```

## Compatibility

`BEGIN` is a Cloudberry Database language extension. It is equivalent to the SQL-standard command [START TRANSACTION](/docs/sql-stmts/start-transaction.md), whose reference page contains additional compatibility information.

The `DEFERRABLE` transaction_mode is a Cloudberry Database language extension.

Incidentally, the `BEGIN` key word is used for a different purpose in embedded SQL. You are advised to be careful about the transaction semantics when porting database applications.

## See also

[COMMIT](/docs/sql-stmts/commit.md), [ROLLBACK](/docs/sql-stmts/rollback.md), [SAVEPOINT](/docs/sql-stmts/savepoint.md), [START TRANSACTION](/docs/sql-stmts/start-transaction.md)
