---
title: DROP DATABASE
---

# DROP DATABASE

删除一个数据库。

## 语法概要

```sql
DROP DATABASE [IF EXISTS] <name>
```

## 描述

`DROP DATABASE` 用于删除数据库。这个操作会移除数据库的目录条目，并且删除存放数据的目录。只有数据库的所有者才有权限执行这个命令。同时，当你或其他人正在连接目标数据库时，无法执行此命令。你需要连接到 `postgres` 或其他任意数据库来执行此命令。

:::caution 警告
`DROP DATABASE` 一旦执行无法撤销。请谨慎使用！
:::

## 参数

**`IF EXISTS`**

如果数据库不存在，则不抛出错误。在这种情况下，Cloudberry Database 会发出一个提醒。

**`name`**

要删除的数据库的名称。

## 注意事项

你不能在事务块中执行 `DROP DATABASE`。

不能在连接到目标数据库时运行此命令。因此，使用 dropdb 程序可能更方便，它是 `DROP DATABASE` 命令的一个封装程序。

## 示例

删除一个名为 `testdb` 的数据库：

```sql
DROP DATABASE testdb;
```

## 兼容性

在 SQL 标准中没有 `DROP DATABASE` 语句。

## 另见

[`ALTER DATABASE`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/alter-database.md)、[`CREATE DATABASE`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/create-database.md)
