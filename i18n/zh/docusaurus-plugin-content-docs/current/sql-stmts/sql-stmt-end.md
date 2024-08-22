---
title: END
---

# END

提交当前事务。

## 语法概要

```sql
END [WORK | TRANSACTION] [AND [NO] CHAIN]
```

## 描述

`END` 提交当前事务。事务中的所有更改对其他用户可见，并且在发生崩溃时保证是持久的。该命令是 Cloudberry Database 的扩展，等效于 [`COMMIT`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/commit.md)。

## 参数

**`WORK`**<br />
**`TRANSACTION`**

可选关键字。二者作用相同，没有什么差别。

**`AND CHAIN`**

如果指定了 `AND CHAIN`，则立即启动一个新事务，其事务特性（参见 [SET TRANSACTION](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/set-transaction.md)）与刚刚完成的事务相同。否则，不会启动新事务。

## 注意事项

使用 [`ROLLBACK`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/rollback.md) 来终止一个事务。

在事务之外使用 `END` 不会有任何实际效果，但会引发警告消息。

## 示例

提交当前事务并使所有更改持久化：

```sql
END;
```

## 兼容性

`END` 是 Cloudberry Database 的扩展，提供了与 SQL 标准中的 [`COMMIT`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/commit.md) 等效的功能。

## 另见

[`BEGIN`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/begin.md)、[`COMMIT`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/commit.md)、[`ROLLBACK`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/rollback.md)
