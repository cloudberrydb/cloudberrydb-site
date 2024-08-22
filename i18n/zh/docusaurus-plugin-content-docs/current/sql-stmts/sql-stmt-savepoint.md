---
title: SAVEPOINT
---

# SAVEPOINT

在当前事务中定义一个新的保存点。

## 语法概要

```sql
SAVEPOINT <savepoint_name>
```

## 描述

`SAVEPOINT` 在当前事务中定义一个新的保存点。

保存点是事务中的一个特殊标记，允许在它建立之后执行的所有命令被回滚，将事务状态恢复到保存点时的状态。

## 参数

**`savepoint_name`**

新保存点的名称。如果已经存在同名的保存点，则无法访问该保存点，直到较新的同名保存点被释放。

## 注意事项

使用 [`ROLLBACK TO SAVEPOINT`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/rollback-to-savepoint.md) 来回滚到一个保存点。使用 [`RELEASE SAVEPOINT`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/release-savepoint.md) 来销毁一个保存点，保留该保存点之后执行的命令的效果。

只能在事务块内建立保存点。你可以在一个事务中定义多个保存点。

## 示例

建立一个保存点，然后撤销建立保存点之后执行的所有命令的效果：

```sql
BEGIN;
    INSERT INTO table1 VALUES (1);
    SAVEPOINT my_savepoint;
    INSERT INTO table1 VALUES (2);
    ROLLBACK TO SAVEPOINT my_savepoint;
    INSERT INTO table1 VALUES (3);
COMMIT;
```

以上事务插入了值 1 和 3，但没有插入 2。

建立并稍后销毁一个保存点：

```sql
BEGIN;
    INSERT INTO table1 VALUES (3);
    SAVEPOINT my_savepoint;
    INSERT INTO table1 VALUES (4);
    RELEASE SAVEPOINT my_savepoint;
COMMIT;
```

以上事务插入了值 3 和 4。

使用单个保存点名称：

``` sql
BEGIN;
    INSERT INTO table1 VALUES (1);
    SAVEPOINT my_savepoint;
    INSERT INTO table1 VALUES (2);
    SAVEPOINT my_savepoint;
    INSERT INTO table1 VALUES (3);

    -- 回滚到第二个保存点
    ROLLBACK TO SAVEPOINT my_savepoint;
    SELECT * FROM table1;               -- 显示行 1 和行 2

    -- 释放第二个保存点
    RELEASE SAVEPOINT my_savepoint;

    -- 回滚到第一个保存点
    ROLLBACK TO SAVEPOINT my_savepoint;
    SELECT * FROM table1;               -- 只显示行 1
COMMIT;
```

以上事务首先回滚了行 3，然后回滚了行 2。

## 兼容性

SQL 标准要求新的保存点建立时，自动销毁同名的旧保存点。在 Cloudberry Database 中，旧保存点会被保留，但只有最新的保存点会在回滚或释放时被使用。释放最新的保存点会使旧的保存点再次可被 [`ROLLBACK TO SAVEPOINT`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/rollback-to-savepoint.md) 和 [`RELEASE SAVEPOINT`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/release-savepoint.md) 访问。除此之外，`SAVEPOINT` 完全符合 SQL 标准。

## 另见

[`BEGIN`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/begin.md)、[`COMMIT`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/commit.md)、[`RELEASE SAVEPOINT`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/release-savepoint.md)、[`ROLLBACK`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/rollback.md)、[`ROLLBACK TO SAVEPOINT`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/rollback-to-savepoint.md)
