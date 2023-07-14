---
title: ALTER TYPE
description: 了解 SQL 语句 ALTER TYPE 在 Cloudberry Database 中的用法。
---

# ALTER TYPE

`ALTER TYPE` 语句用于更改数据类型的定义。

## 概要

```sql
ALTER TYPE <name>
   OWNER TO <new_owner> | SET SCHEMA <new_schema>
```

## 描述

用户必须是该类型的所有者才能使用 `ALTER TYPE`。要更改类型的 schema，用户还必须对新 schema 拥有 `CREATE` 权限。要更改类型所有者，用户必须是新角色的直接或间接成员，并且该角色在类型的 schema 上有 `CREATE` 权限。

## 参数

- **name**：要修改的现有类型的名称（可选限定 schema）。
- **new_owner**：新的所有者的类型名。
- **new_schema**：该类型的新 schema。

## 示例

更改自定义类型 email 的所有者为 joe：

```sql 
ALTER TYPE email OWNER TO joe;
```

更改用户自定义的 email类型schema为 customers：

```sql 
ALTER TYPE email SET SCHEMA customers;
```

## 兼容性

在 SQL 标准中没有 `ALTER TYPE` 语句。

## 另见

`CREATE TYPE`，`DROP TYPE`
