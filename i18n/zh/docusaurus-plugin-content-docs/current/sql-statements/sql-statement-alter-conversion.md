---
title: ALTER CONVERSION
description: 了解 SQL 语句 ALTER CONVERSION 在 Cloudberry Database 中的用法。
---

# ALTER CONVERSION

`ALTER CONVERSION` 语句用于更改转换的定义。

用户必须拥有使用 `ALTER CONVERSION` 的转换权限。要更改所有者，用户还必须是新任命的直接或间接成员，并且该角色必须对转换的模式拥有 `CREATE` 权限。

## 概要

```sql
ALTER CONVERSION <name> RENAME TO <newname>

ALTER CONVERSION <name> OWNER TO <newowner>
```

## 参数

- **name**：现有转换的名称（可选方案限定）。
- **newname**：新的转换名称。
- **newowner**：转换的新所有者。

## 示例

要把转换 `iso_8859_1_to_utf8` 重命名为 `latin1_to_unicode`：

```sql
ALTER CONVERSION iso_8859_1_to_utf8 RENAME TO 
latin1_to_unicode;
```

更改转换 `iso_8859_1_to_utf8` 的所有者为 `joe`：

```sql
ALTER CONVERSION iso_8859_1_to_utf8 OWNER TO joe;
```

## 兼容性

在 SQL 标准中没有 `ALTER CONVERSION` 语句。

## 另见

`CREATE CONVERSION`，`DROP CONVERSION`
