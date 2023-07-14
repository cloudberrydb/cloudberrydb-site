---
title: ALTER OPERATOR
description: 了解 SQL 语句 ALTER OPERATOR 在 Cloudberry Database 中的用法。
---

# ALTER OPERATOR

`ALTER OPERATOR` 语句用于更改运算符的定义。

## 概要

```sql
ALTER OPERATOR <name> ( {<lefttype> | NONE} , {<righttype> | NONE} ) 
   OWNER TO <newowner>
```

## 描述

`ALTER OPERATOR` 用于更改运算符的定义。唯一可用的功能是更改运算符的所有者。

用户必须是运算符的所有者才能使用 `ALTER OPERATOR`。要更改所有者，用户还必须是新所有者的直接或间接的成员，并且该角色必须拥有该运算符 schema 上的 `CREATE` 权限。

## 参数

- **name**：现有运算符的名称(可选方案限定)。
- **lefttype**：运算符左操作数的数据类型。如果没有左操作数，记为 NONE。
- **righttype**：运算符右操作数的数据类型。如果运算符没有右操作数，记为 NONE。
- **newowner**：运算符新的所有者。

## 示例

更改 TEXT 类型的自定义运算符 `a @@ b` 的所有者：

```sql
ALTER OPERATOR @@ (text, text) OWNER TO joe;
```

## 兼容性

在 SQL 标准中没有 ALTEROPERATOR 语句 

## 另见

`CREATE OPERATOR`，`DROP OPERATOR`
