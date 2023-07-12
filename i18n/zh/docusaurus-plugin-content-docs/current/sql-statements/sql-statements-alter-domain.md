---
title: ALTER DOMAIN
description: 了解 SQL 语句 ALTER DOMAIN 在 Cloudberry Database 中的用法。
---

# ALTER DOMAIN

`ALTER DOMAIN` 语句用于更改现有域的定义。

## 概要

```sql
ALTER DOMAIN <name> { SET DEFAULT <expression> | DROP DEFAULT }

ALTER DOMAIN <name> { SET | DROP } NOT NULL

ALTER DOMAIN <name> ADD <domain_constraint>

ALTER DOMAIN <name> DROP CONSTRAINT <constraint_name> [RESTRICT | CASCADE]

ALTER DOMAIN <name> OWNER TO <new_owner>

ALTER DOMAIN <name> SET SCHEMA <new_schema>
```

## 描述

ALTER DOMAIN 更改一个现有域的定义。有几种子形式：

- `SET DEFAULT` 或 `DROP DEFAULT`：这种子形式设置或删除域的默认值。请注意，默认值仅适用于后续的 `INSERT` 命令。它们不影响使用域的表中已经存在的行。
- `SET NOT NULL` 或 `DROP NOT NULL`：这种子形式会标记域是否允许 `NULL` 值或者拒绝 `NULL` 值。仅当使用域的列不包含空值时，才可以设置 `NOT NULL`。
- `ADD domain_constraint`：这种子形式使用和 `CREATE DOMAIN` 相同的语法为域增加一个新的约束。如果所有使用域的列满足新的约束，则添加成功。
- `DROP CONSTRAINT`：这种子形式删除域的约束。
- `OWNER`：这种子形式将域的所有者更改为指定的用户。
- `SET SCHEMA`：这种子形式更改域的 schema。与域相关联的任何约束也被移动到新的 schema 中。

## 参数

- **name**：要更改的现有域的名称（可选方案限定）。
- **domain_constraint**：域的新域约束。
- **constraint_name**：要删除的现有约束的名称。
- **CASCADE**：自动删除依赖约束的对象。
- **RESTRICT**：如果有任何依赖对象，拒绝删除约束。这是默认行为。
- **new_owner**：域的新所有者的用户名
- **new_schema**：域的新 schema。

## 示例

添加 `NOT NULL` 约束：

```sql
ALTER DOMAIN zipcode SET NOT NULL;
```

删除 `NOT NULL` 约束：

```sql
ALTER DOMAIN zipcode DROP NOT NULL;
```

向域添加检查约束：

```sql
ALTER DOMAIN zipcode ADD CONSTRAINT zipchk CHECK 
(char_length(VALUE) = 5);
```

从域中删除检查约束：

```sql
ALTER DOMAIN zipcode DROP CONSTRAINT zipchk;
```

将域移动到不同的 schema：

```sql
ALTER DOMAIN zipcode SET SCHEMA customers;
```

## 兼容性

`ALTER DOMAIN` 符合 SQL 标准，除了 `OWNER` 和 `SET SCHEMA` 变型，它们是 Cloudberry Database 的扩展。

## 另见

`CREATE DOMAIN`，`DROP DOMAIN`
