---
title: DROP SCHEMA
---

# DROP SCHEMA

删除一个 schema。

## 语法概要

```sql
DROP SCHEMA [IF EXISTS] <name> [, ...] [CASCADE | RESTRICT]
```

## 描述

`DROP SCHEMA` 从数据库中删除 schema。

Schema 只能由其所有者或超级用户删除。请注意，即使所有者不拥有 schema 中的某些对象，他们也可以删除 schema（从而删除 schema 中所有包含的对象）。

## 参数

**`IF EXISTS`**

如果 schema 不存在，则不抛出错误。在这种情况下，Cloudberry Database 会发出一个提醒。

**`name`**

要删除的 schema 的名称。

**`CASCADE`**

自动删除包含在 schema 中的对象（表、函数等），以及依赖于这些对象的所有对象。

**`RESTRICT`**

如果 schema 包含任何对象，Cloudberry Database 会拒绝删除 schema。这是默认行为。

## 注意事项

使用 `CASCADE` 选项可能导致命令删除除命名的 schema 之外的其他 schema 中的对象。

## 示例

从数据库中删除 schema `mystuff`，以及 schema 中包含的所有内容：

```sql
DROP SCHEMA mystuff CASCADE;
```

## 兼容性

`DROP SCHEMA` 是完全符合 SQL 标准的，但该标准只允许一次删除一个 schema。此外，`IF EXISTS` 选项是 Cloudberry Database 的扩展。

## 另见

[`CREATE SCHEMA`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/create-schema.md)、[`ALTER SCHEMA`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/alter-schema.md)
