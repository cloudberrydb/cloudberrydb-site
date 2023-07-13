---
title: ALTER SCHEMA
description: 了解 SQL 语句 ALTER SCHEMA 在 Cloudberry Database 中的用法。
---

# ALTER SCHEMA

`ALTER SCHEMA` 语句用于更改 schema 定义。

## 概要

```sql
ALTER SCHEMA <name> RENAME TO <newname>

ALTER SCHEMA <name> OWNER TO <newowner>
```

## 描述

用户必须是该schema的所有者才能使用 ALTER SCHEMA. 要重命名schema， 用户还必须拥有该数据库的 CREATE特权。 要更改所有者，用户还必须 是新所有者角色的直接或者间接成员，并且该角色必须具有该数据库上的 CREATE 特权。 注意超级用户自动拥有所有这些特权。

## 参数

- **name**：现有 schema 的名称。
- **newname**：该 schema 的新名称。新名称不能以 `pg_` 开头，因为 `pg_` 开头的名称为系统 schema 的保留名称。
- **newowner**：该 schema 的新所有者。

## 兼容性

在 SQL 标准中没有 `ALTER SCHEMA` 语句。

## 另见

`CREATE SCHEMA`，`DROP SCHEMA`
