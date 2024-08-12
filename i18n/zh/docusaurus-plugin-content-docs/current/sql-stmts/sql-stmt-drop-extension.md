---
title: DROP EXTENSION
---

# DROP EXTENSION

从 Cloudberry Database 中移除一个扩展。

## 语法概要

```sql
DROP EXTENSION [ IF EXISTS ] <name> [, ...] [ CASCADE | RESTRICT ]
```

## 描述

`DROP EXTENSION` 从数据库中移除一个扩展，同时也会移除扩展的组件对象。

:::info 注意
原本用于创建扩展的支持文件（例如库和 `.control` 文件）不会被删除。你需要手动从 Cloudberry Database 主机上移除这些文件。
:::

要使用 `DROP EXTENSION`，你必须是扩展的所有者。 

## 参数

**`IF EXISTS`**

如果扩展不存在，则不抛出错误。在这种情况下，Cloudberry Database 会发出一个提醒。

**`name`**

已安装扩展的名称。

**`CASCADE`**

自动删除依赖于该扩展的对象，以及依赖于这些对象的所有对象。更多信息请参考 PostgreSQL 文档 [Dependency Tracking](https://www.postgresql.org/docs/14/ddl-depend.html)。

:::tip 提示
在使用带 `CASCADE` 关键字的 `DROP EXTENSION` 命令之前，你应该清楚地了解所有依赖于该扩展的对象，以避免意外后果。
:::

**`RESTRICT`**

如果有对象依赖于该扩展（除了其自身的成员对象和同一 `DROP` 命令中列出的其他扩展），Cloudberry Database 会拒绝删除该扩展。这是默认行为。

## 示例

从当前数据库中移除扩展 `hstore`：

```sql
DROP EXTENSION hstore;
```

如果在数据库中使用了扩展对象，该命令会失败。例如，如果一张表定义了 `hstore` 类型的列，可以添加 `CASCADE` 选项来强制删除这些依赖对象。

## 兼容性

`DROP EXTENSION` 语句是 Cloudberry Database 的扩展，不在 SQL 标准中。

## 另见

[`CREATE EXTENSION`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/create-extension.md)、[`ALTER EXTENSION`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/alter-extension.md)
