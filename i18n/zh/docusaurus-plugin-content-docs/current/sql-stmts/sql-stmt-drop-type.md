---
title: DROP TYPE
---

# DROP TYPE

删除一个数据类型。

## 语法概要

```sql
DROP TYPE [IF EXISTS] <name> [, ...] [CASCADE | RESTRICT]
```

## 描述

`DROP TYPE` 删除用户定义的数据类型。只有数据类型的所有者才能进行删除。

## 参数

**`IF EXISTS`**

如果要删除的数据类型不存在，则不抛出错误。在这种情况下，Cloudberry Database 会发出一个提醒。

**`name`**

要删除的数据类型的名称（可以选择性地指定其所在的数据库 schema 作为限定）。

**`CASCADE`**

自动删除依赖于数据类型的对象（例如表列、函数、操作符），以及依赖于这些对象的所有对象。

**`RESTRICT`**

如果有对象依赖于要删除的数据类型，Cloudberry Database 会拒绝删除该数据类型。这是默认行为。

## 示例

删除数据类型 `box`：

```sql
DROP TYPE box;
```

## 兼容性

除了 `IF EXISTS` 选项是 Cloudberry Database 的扩展之外，Cloudberry Database 中的 `DROP TYPE` 命令与 SQL 标准中的 `DROP TYPE` 命令类似。但请注意，Cloudberry Database 中的 `CREATE TYPE` 命令和数据类型扩展机制与 SQL 标准有很大不同。

## 另见

[`ALTER TYPE`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/alter-type.md)、[`CREATE TYPE`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/create-type.md)
