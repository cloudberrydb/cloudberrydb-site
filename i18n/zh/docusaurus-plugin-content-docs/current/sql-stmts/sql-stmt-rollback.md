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

If `AND CHAIN` is specified, a new transaction is immediately started with the same transaction characteristics (see [SET TRANSACTION](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/sql-stmt-set-transaction.md)) as the just finished one. Otherwise, no new transaction is started.

## Notes

Use [COMMIT](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/sql-stmt-commit.md) to successfully end the current transaction.

Issuing `ROLLBACK` when not inside a transaction block emits a warning and otherwise has no effect. `ROLLBACK AND CHAIN` outside of a transaction block is an error.

## Examples

To discard all changes made in the current transaction:

```sql
ROLLBACK;
```

## Compatibility

The command `ROLLBACK` conforms to the SQL standard. The form `ROLLBACK TRANSACTION` is a Cloudberry Database extension.

## See also

[BEGIN](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/sql-stmt-begin.md), [COMMIT](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/sql-stmt-commit.md), [ROLLBACK TO SAVEPOINT](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/sql-stmt-rollback-to-savepoint.md), [SAVEPOINT](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/sql-stmt-savepoint.md)
