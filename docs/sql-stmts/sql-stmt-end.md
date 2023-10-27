---
title: END
---

# END

Commits the current transaction.

## Synopsis

```sql
END [WORK | TRANSACTION] [AND [NO] CHAIN]
```

## Description

`END` commits the current transaction. All changes made by the transaction become visible to others and are guaranteed to be durable if a crash occurs. This command is a Cloudberry Database extension that is equivalent to [`COMMIT`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/sql-stmt-commit.md).

## Parameters

**`WORK`**<br />
**`TRANSACTION`**

Optional keywords. They have no effect.

**`AND CHAIN`**

If `AND CHAIN` is specified, a new transaction is immediately started with the same transaction characteristics (see [SET TRANSACTION](/docs/sql-stmts/sql-stmt-set-transaction.md)) as the just finished one. Otherwise, no new transaction is started.

## Notes

Use [`ROLLBACK`](/docs/sql-stmts/sql-stmt-rollback.md) to terminate a transaction.

Issuing `END` when not inside a transaction does no harm, but it will provoke a warning message.

## Examples

To commit the current transaction and make all changes permanent:

```sql
END;
```

## Compatibility

`END` is a Cloudberry Database extension that provides functionality equivalent to [`COMMIT`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/sql-stmt-commit.md), which is specified in the SQL standard.

## See also

[`BEGIN`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/sql-stmt-begin.md), [`COMMIT`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/sql-stmt-commit.md), [`ROLLBACK`](/docs/sql-stmts/sql-stmt-rollback.md)
