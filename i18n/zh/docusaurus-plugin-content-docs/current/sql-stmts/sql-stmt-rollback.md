---
title: ROLLBACK
---

# ROLLBACK

终止当前事务。

## 语法概要

```sql
ROLLBACK [WORK | TRANSACTION] [AND [NO] CHAIN]
```

## 描述

`ROLLBACK` 回滚当前事务，导致事务中的所有更改被丢弃。

## 参数

**`WORK`**<br />
**`TRANSACTION`**

可选关键字。二者作用相同，没有什么差别。

**`AND CHAIN`**

如果指定了 `AND CHAIN`，则立即启动一个新事务，其事务特性（参见 [SET TRANSACTION](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/set-transaction.md)）与刚刚完成的事务相同。否则，不会启动新事务。

## 注意事项

使用 [`COMMIT`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/commit.md) 来成功结束当前事务。

在事务块之外使用 `ROLLBACK` 会发出警告消息，但不会有任何实际效果。在事务块之外使用 `ROLLBACK AND CHAIN` 会引发错误。

## 示例

丢弃当前事务中的所有更改：

```sql
ROLLBACK;
```

## 兼容性

`ROLLBACK` 命令符合 SQL 标准。`ROLLBACK TRANSACTION` 是 Cloudberry Database 的扩展。

## 另见

[`BEGIN`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/begin.md)、[`COMMIT`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/commit.md)、[`ROLLBACK TO SAVEPOINT`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/rollback-to-savepoint.md)、[`SAVEPOINT`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/savepoint.md)
