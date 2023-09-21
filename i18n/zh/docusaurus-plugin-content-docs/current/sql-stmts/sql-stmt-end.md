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

`END` commits the current transaction. All changes made by the transaction become visible to others and are guaranteed to be durable if a crash occurs. This command is a Cloudberry Database extension that is equivalent to [COMMIT](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/sql-stmt-commit.md).

## Parameters

**`WORK`**

**`TRANSACTION`**

Optional keywords. They have no effect.

**`AND CHAIN`**

If `AND CHAIN` is specified, a new transaction is immediately started with the same transaction characteristics (see [SET TRANSACTION](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/sql-stmt-set-transaction.md)) as the just finished one. Otherwise, no new transaction is started.

## Notes

Use [ROLLBACK](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/sql-stmt-rollback.md) to terminate a transaction.

Issuing `END` when not inside a transaction does no harm, but it will provoke a warning message.

## Examples

To commit the current transaction and make all changes permanent:

```sql
END;
```

## Compatibility

`END` is a Cloudberry Database extension that provides functionality equivalent to [COMMIT](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/sql-stmt-commit.md), which is specified in the SQL standard.

## See also

[BEGIN](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/sql-stmt-begin.md), [COMMIT](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/sql-stmt-commit.md), [ROLLBACK](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/sql-stmt-rollback.md)
