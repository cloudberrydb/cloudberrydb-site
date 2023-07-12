---
title: ALTER AGGREGATE
description: 了解 SQL 语句 ALTER AGGREGATE 在 Cloudberry Database 中的用法。
---

# ALTER AGGREGATE

`ALTER AGGREGATE` 语句用于更改聚合函数的定义。用户必须拥有聚合函数才能使用 `ALTER AGGREGATE`。要更改聚合函数的模式，还必须对新模式拥有 `CREATE` 权限。要更改所有者，用户还必须是新任命的直接或间接成员，并且该角色必须对聚合函数的模式拥有 `CREATE` 权限。

## 概要

```sql 
ALTER AGGREGATE <name> ( <type> [ , ... ] ) RENAME TO <new_name>

ALTER AGGREGATE <name> ( <type> [ , ... ] ) OWNER TO <new_owner>

ALTER AGGREGATE <name> ( <type> [ , ... ] ) SET SCHEMA <new_schema>
```

### 参数

- **name**：一个现有聚合函数的名称（可以是限定模式）
- **type**：聚合函数能运行的输入数据类型。要引用零参数聚合函数，写入 `*` 代替输入数据类型的列表。
- **new_name**：聚合函数的新名称。
- **new_owner**：聚合函数新的所有者。
- **new_schema**：聚合函数的新 schema。

### 示例

要将 integer 类型的聚合函数 `myavg` 重命名为 `my_average`：

```sql
ALTER AGGREGATE myavg(integer) RENAME TO my_average;
```

更改 integer 类型的聚合函数 `myavg` 的所有者为 `joe`：

```sql
ALTER AGGREGATE myavg(integer) OWNER TO joe;
```

将 integer 类型的聚合函数 `myavg` 移动到 schema `myschema` 中：

```sql
ALTER AGGREGATE myavg(integer) SET SCHEMA myschema;
```

### 兼容性

在 SQL 标准中没有 `ALTER AGGREGATE` 语句。

### 另见

`CREATE`，`AGGREGATE`，`DROP`，`AGGREGATE`
