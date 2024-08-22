---
title: START TRANSACTION
---

# START TRANSACTION

开启一个事务块。

## 语法概要

```sql
START TRANSACTION [<transaction_mode>] [, ...]

-- 其中 <transaction_mode> 可以是：

   ISOLATION LEVEL {SERIALIZABLE | REPEATABLE READ | READ COMMITTED | READ UNCOMMITTED}
   READ WRITE | READ ONLY
   [NOT] DEFERRABLE
```

## 描述

`START TRANSACTION` 开启一个新的事务块。如果指定了隔离级别、读/写模式或可延迟模式，新事务将具有这些特性，就像执行了 [SET TRANSACTION](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/set-transaction.md) 命令一样。这与 [`BEGIN`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/begin.md) 命令相同。

## 参数

更多有关该语句的参数信息，请参见 [`SET TRANSACTION`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/set-transaction.md)。

## 兼容性

在标准 SQL 中，不需要使用 `START TRANSACTION` 来开启一个事务块：任何 SQL 命令都会隐式地开启一个事务块。Cloudberry Database 的行为可以看作是在每个不遵循 `START TRANSACTION`（或 `BEGIN`）的命令之后隐式地执行 `COMMIT`，因此通常被称为“自动提交”。其他关系型数据库系统可能会提供自动提交功能作为一种便利。

`DEFERRABLE` `transaction_mode` 是 Cloudberry Database 的语言扩展。

SQL 标准要求在连续的 `transaction_modes` 之间使用逗号，但出于历史原因，Cloudberry Database 允许省略逗号。

另见 [`SET TRANSACTION`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/set-transaction.md) 中的兼容性部分。

## 另见

[`BEGIN`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/begin.md)、[`COMMIT`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/commit.md)、[`ROLLBACK`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/rollback.md)、[`SAVEPOINT`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/savepoint.md)、[`SET TRANSACTION`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/set-transaction.md)
