---
title: ALTER FUNCTION
description: 了解 SQL 语句 ALTER FUNCTION 在 Cloudberry Database 中的用法。
---

# ALTER FUNCTION

`ALTER FUNCTION` 语句用于更改函数的定义。

## 概要

```sql
ALTER FUNCTION <name> ( [ [<argmode>] [<argname>] <argtype> [, ...] ] ) 
   <action> [, ... ] [RESTRICT]

ALTER FUNCTION <name> ( [ [<argmode>] [<argname>] <argtype> [, ...] ] )
   RENAME TO <new_name>

ALTER FUNCTION <name> ( [ [<argmode>] [<argname>] <argtype> [, ...] ] ) 
   OWNER TO <new_owner>

ALTER FUNCTION <name> ( [ [<argmode>] [<argname>] <argtype> [, ...] ] ) 
   SET SCHEMA <new_schema>
```

其中 `<action>` 是下列操作之一：

```sql
{CALLED ON NULL INPUT | RETURNS NULL ON NULL INPUT | STRICT}
{IMMUTABLE | STABLE | VOLATILE}
{[EXTERNAL] SECURITY INVOKER | [EXTERNAL] SECURITY DEFINER}
COST <execution_cost>
SET <configuration_parameter> { TO | = } { <value> | DEFAULT }
SET <configuration_parameter> FROM CURRENT
RESET <configuration_parameter>
RESET ALL
```

## 描述

用户必须拥有该函数以使用 `ALTER FUNCTION`。要更改函数的模式，用户还必须对新模式具有 `CREATE` 特权。要更改所有者，用户还必须是新拥有角色的直接或间接成员，并且该角色必须对该函数的模式拥有 `CREATE` 权限。

## 参数

- **name**：现有函数的名称（可选方案限定）。
- **argmode**：参数的模式：`IN`、`OUT`、`INOUT` 或 `VARIADIC`。如果省略，默认值为 `IN`。请注意，`ALTER FUNCTION` 实际上并不关注 `OUT` 参数，因为只需要输入参数来确定函数的身份。因此，只列出 `IN`、`INOUT` 和 `VARIADIC` 参数就已经足够了。
- **argname**：参数的名称。请注意，`ALTER FUNCTION` 实际上并不关心参数名称，因为只需要参数数据类型来确定函数的身份。
- **argtype**：函数参数（如果有）的数据类型（可以是方案限定）。
- **new_name**：函数的新名称。
- **new_owner**：函数的新拥有者。请注意，如果函数被标记为 `SECURITY DEFINER`, 随后它将作为新的所有者执行。
- **new_schema**：该函数的新模式。
- **CALLED ON NULL INPUT**：在某些或者全部参数为空值时可以被调用。
- **RETURNS NULL ON NULL INPUT** 和 **STRICT**：如果某个参数为空，则不会调用该函数，而是自动假定为空结果。
- **IMMUTABLE**，**STABLE**，**VOLATILE**：将函数的波动性改为指定的设置。
- **[ EXTERNAL ] SECURITY INVOKER** 和 **[ EXTERNAL ] SECURITY DEFINER**：是否将该函数标记为安全定义器。为了保持 SQL 的一致性，可以忽略关键词 `EXTERNAL`。
- **COST execution_cost**：更改该函数的估计执行代价。参阅 [`CREATE FUNCTION`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-statements/sql-statement-create-function.md) 获取更多信息。
- **configuration_parameter** 和 **value**：当该函数被调用时，用于配置参数的值。如果 `value` 的值是 `DEFAULT` 或者 `RESET`，则删除函数的本地设置，并且该函数会使用环境中存在的值执行。使用 `RESET ALL` 可以清除所有函数本地的设置。`SET FROM CURRENT` 将运行 `ALTER FUNCTION` 时的参数值保存为输入函数时应用的值。
- **RESTRICT**：忽略 SQL 标准。

## 示例

将 integer 类型的函数 `sqrt` 重命名为 `square_root`：

```sql
ALTER FUNCTION sqrt(integer) RENAME TO square_root;
```

更改 integer 类型的 `sqrt` 函数的所有者为 `joe`：

```sql
ALTER FUNCTION sqrt(integer) OWNER TO joe;
```

更改 integer 类型的函数 `sqrt` 的 schema 为 `math`：

```sql
ALTER FUNCTION sqrt(integer) SET SCHEMA math;
```

调整一个函数的自动搜索路径：

```sql
ALTER FUNCTION check_password(text) RESET search_path;
```

## 兼容性

`ALTER FUNCTION` 语句部分兼容 SQL 标准中的 `ALTER FUNCTION` 语句。SQL 标准允许修改一个函数的更多属性，但是不提供重命名函数、标记函数为安全定义器、为函数附加配置参数值或者更改函数的拥有者、schema 或者稳定性等功能。SQL标准还需要 `RESTRICT` 关键字，它在 Cloudberry Database 数据库中是可选的。

## 另见

`CREATE FUNCTION`，`DROP FUNCTION`
