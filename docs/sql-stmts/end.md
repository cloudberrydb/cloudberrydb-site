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

`END` commits the current transaction. All changes made by the transaction become visible to others and are guaranteed to be durable if a crash occurs. This command is a Cloudberry Database extension that is equivalent to [`COMMIT`](/docs/sql-stmts/commit.md).

## Parameters

**`WORK`**<br />
**`TRANSACTION`**

Optional keywords. They have no effect.

**`AND CHAIN`**

If `AND CHAIN` is specified, a new transaction is immediately started with the same transaction characteristics (see [SET TRANSACTION](/docs/sql-stmts/set-transaction.md)) as the just finished one. Otherwise, no new transaction is started.

## Notes

Use [`ROLLBACK`](/docs/sql-stmts/rollback.md) to terminate a transaction.

Issuing `END` when not inside a transaction does no harm, but it will provoke a warning message.

## Examples

To commit the current transaction and make all changes permanent:

```sql
END;
```

## Compatibility

`END` is a Cloudberry Database extension that provides functionality equivalent to [`COMMIT`](/docs/sql-stmts/commit.md), which is specified in the SQL standard.

## See also

[`BEGIN`](/docs/sql-stmts/begin.md), [`COMMIT`](/docs/sql-stmts/commit.md), [`ROLLBACK`](/docs/sql-stmts/rollback.md)
