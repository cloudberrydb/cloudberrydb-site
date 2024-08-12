---
title: ROLLBACK TO SAVEPOINT
---

# ROLLBACK TO SAVEPOINT

将当前事务回滚到一个保存点。

## 语法概要

```sql
ROLLBACK [ WORK | TRANSACTION ] TO [ SAVEPOINT ] <savepoint_name>
```

## 描述

该命令将回滚某一保存点之后执行的所有命令。保存点仍然有效。如果需要，可以再次回滚到该保存点。

`ROLLBACK TO SAVEPOINT` 隐式地销毁了在指定保存点之后建立的所有保存点。

## 参数

**`WORK`**<br />
**`TRANSACTION`**

可选关键字。二者作用相同，没有什么差别。

**`savepoint_name`**

要回滚到的保存点的名称。

## 注意事项

你可以使用 [`RELEASE SAVEPOINT`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/release-savepoint.md) 来销毁一个保存点，而不丢弃该保存点之后执行的命令的效果。

指定一个未建立的保存点名称会引发报错。

关于保存点，游标表现出一定的非事务行为。任何在保存点内开启的游标，当该保存点回滚时都将被关闭。若在保存点内执行的 `FETCH` 操作影响了之前已经打开的游标，即便该保存点后来被回滚，游标仍将保持在 `FETCH` 操作后的位置（即 `FETCH` 导致的游标移动不会被回滚）。同样，游标的关闭操作也不会因回滚而撤销。然而，如果游标查询的其他副作用（如查询调用的易变函数产生的副作用）出现在之后被回滚的保存点期间，这些副作用则会被回滚。如果游标的执行导致事务提前结束，该游标将进入一个无法执行状态，虽然可以通过 `ROLLBACK TO SAVEPOINT` 恢复事务，但游标将不再可用。

## 示例

撤销保存点 `my_savepoint` 之后执行的命令的效果：

```sql
ROLLBACK TO SAVEPOINT my_savepoint;
```

保存点回滚不会影响游标的位置：

```sql
BEGIN;
DECLARE foo CURSOR FOR SELECT 1 UNION SELECT 2;
SAVEPOINT foo;
FETCH 1 FROM foo;
column 
----------
        1

ROLLBACK TO SAVEPOINT foo;
FETCH 1 FROM foo;
column 
----------
        2

COMMIT;
```

## 兼容性

SQL 标准规定关键字 `SAVEPOINT` 是必须的，但 Cloudberry Database（以及 Oracle）允许它被省略。SQL 只允许在 `ROLLBACK` 之后使用 `WORK`，而不是 `TRANSACTION`。此外，SQL 还有一个可选的 `AND [NO] CHAIN` 子句，Cloudberry Database 目前不支持。除此之外，该命令符合 SQL 标准。

## 另见

[`BEGIN`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/begin.md)、[`COMMIT`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/commit.md)、[`RELEASE SAVEPOINT`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/release-savepoint.md)、[`ROLLBACK`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/rollback.md)、[`SAVEPOINT`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/savepoint.md)
