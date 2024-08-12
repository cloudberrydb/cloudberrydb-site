---
title: ABORT
---

# ABORT

终止当前的事务。

## 语法概要

```sql
ABORT [WORK | TRANSACTION] [AND [NO] CHAIN]
```

## 描述

`ABORT` 回滚当前事务，并使事务中的所有更新被丢弃。该命令的行为上与标准 SQL 命令 [`ROLLBACK`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/rollback.md) 完全相同，仅出于历史原因而存在。

## 参数

**`WORK`**<br />
**`TRANSACTION`**

可选关键字。二者作用相同，没有什么差别。

**`AND CHAIN`**

如果在 `ABORT` 命令中指定了 `AND CHAIN`，则会立即启动一个新的事务，该事务的特性与刚刚完成的事务相同（参见 [SET TRANSACTION](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/set-transaction.md)）。如果未指定该选项，则不启动新的事务。

## 注意事项

使用 [`COMMIT`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/commit.md) 成功终止事务。

在事务块之外执行 `ABORT` 会报错，而且不会生效。

## 示例

终止所有更改：

```sql
ABORT;
```

## 兼容性

该命令是 Cloudberry Database 的扩展，仅出于历史原因而存在。`ROLLBACK` 是等效的标准 SQL 命令。

## 另见

[`BEGIN`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/begin.md)、[`COMMIT`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/commit.md)、[`ROLLBACK`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/rollback.md)
