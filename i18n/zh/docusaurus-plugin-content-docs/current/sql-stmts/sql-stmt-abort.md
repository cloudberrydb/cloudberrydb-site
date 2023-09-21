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

`ABORT` rolls back the current transaction and causes all the updates made by the transaction to be discarded. This command is identical in behavior to the standard SQL command [ROLLBACK](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/sql-stmt-rollback.md), and is present only for historical reasons.

## Parameters

**`WORK`**  

**`TRANSACTION`**

Optional key words. They have no effect.

**`AND CHAIN`**

If `AND CHAIN` is specified, a new transaction is immediately started with the same transaction characteristics (see [SET TRANSACTION](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/sql-stmt-set-transaction.md)) as the just finished one. Otherwise, no new transaction is started.

## Notes

Use [COMMIT](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/sql-stmt-commit.md) to successfully terminate a transaction.

Issuing `ABORT` outside of a transaction block emits a warning and otherwise has no effect.

## Examples

To terminate all changes:

```sql
ABORT;
```

## Compatibility

This command is a Cloudberry Database extension present for historical reasons. `ROLLBACK` is the equivalent standard SQL command.

## See also

[BEGIN](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/sql-stmt-begin.md), [COMMIT](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/sql-stmt-commit.md), [ROLLBACK](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/sql-stmt-rollback.md)
