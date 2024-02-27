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

`DROP DATABASE` drops a database. It removes the catalog entries for the database and deletes the directory containing the data. It can only be run by the database owner. Also, it cannot be run while you or anyone else are connected to the target database. (Connect to `postgres` or any other database to issue this command.)

`DROP DATABASE` 删除一个数据库。它删除数据库的目录项，并删除包含数据的目录。只有数据库所有者才能执行此命令。此外，它不能在您或其他任何人连接到目标数据库时运行。（连接到 `postgres` 或任何其他数据库以发出此命令。）

:::caution 警告
`DROP DATABASE` cannot be undone. Use it with care!
:::

## 参数

**`IF EXISTS`**

如果数据库不存在，则不抛出错误。在这种情况下会发出一个通知。

**`name`**

要删除的数据库的名称。

## 注意事项

你不能在事务块中执行 `DROP DATABASE`。

不能在连接到目标数据库时运行此命令。因此，使用 dropdb 程序可能更方便，它是该命令的一个包装器。

## 示例

删除一个名为 `testdb` 的数据库：

```sql
DROP DATABASE testdb;
```

## 兼容性

在 SQL 标准中没有 `DROP DATABASE` 语句。

## 另见

[`ALTER DATABASE`](/docs/sql-stmts/sql-stmt-alter-database.md), [`CREATE DATABASE`](/docs/sql-stmts/sql-stmt-create-database.md)
