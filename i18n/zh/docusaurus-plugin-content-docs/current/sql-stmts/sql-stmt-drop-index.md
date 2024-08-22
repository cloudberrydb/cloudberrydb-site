---
title: DROP INDEX
---

# DROP INDEX

删除一个索引。

## 语法概要

```sql
DROP INDEX [ CONCURRENTLY ] [ IF EXISTS ] <name> [, ...] [ CASCADE | RESTRICT ]
```

## 描述

`DROP INDEX` 从数据库系统中删除一个索引。要执行此命令，你必须是索引的所有者。

## 参数

**`CONCURRENTLY`**

删除索引的同时不锁定对索引表的并发查询、插入、更新和删除。普通的 `DROP INDEX` 会在表上获取一个 `ACCESS EXCLUSIVE` 锁，阻塞其他访问，直到索引被删除完成。使用该选项，命令会等待冲突事务完成。

在使用此选项时，有一些注意事项：你只能指定一个索引名称，不支持 `CASCADE` 选项。（因此，支持 `UNIQUE` 或 `PRIMARY KEY` 约束的索引不能通过这种方式删除。）此外，你可以在事务块中执行常规的 `DROP INDEX` 命令，但不能执行 `DROP INDEX CONCURRENTLY`。

**`IF EXISTS`**

如果索引不存在，则不抛出错误。在这种情况下，Cloudberry Database 会发出一个提醒。

**`name`**

要删除的索引的名称（可以选择性地指定其所在的数据库 schema 作为限定）。

**`CASCADE`**

自动删除依赖于索引的对象，以及依赖于这些对象的所有对象。

**`RESTRICT`**

如果有任何对象依赖于索引，Cloudberry Database 会拒绝删除索引。这是默认行为。

## 示例

删除索引 `title_idx`：

```sql
DROP INDEX title_idx;
```

## 兼容性

`DROP INDEX` 是 Cloudberry Database 的语言扩展。SQL 标准中没有关于索引的规定。

## 另见

[`ALTER INDEX`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/alter-index.md)、[`CREATE INDEX`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/create-index.md)
