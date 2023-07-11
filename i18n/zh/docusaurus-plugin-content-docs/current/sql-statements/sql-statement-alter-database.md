---
title: ALTER DATABASE 语句
description: 了解 SQL 语句 ALTER DATABASE 在 Cloudberry Database 中的用法。
---

`ALTER DATABASE` 用于更改数据库的属性。

## 概要

```sql
ALTER DATABASE <name> [ WITH CONNECTION LIMIT <connlimit> ]

ALTER DATABASE <name> RENAME TO <newname>

ALTER DATABASE <name> OWNER TO <new_owner>

ALTER DATABASE <name> SET TABLESPACE <new_tablespace>

ALTER DATABASE <name> SET <parameter> { TO | = } { <value> | DEFAULT }
ALTER DATABASE <name> SET <parameter> FROM CURRENT
ALTER DATABASE <name> RESET <parameter>
ALTER DATABASE <name> RESET ALL
```

## 描述

`ALTER DATABASE` 更改一个数据库的属性。

以上概要中的示例：

- 第一种形式更改数据库的允许连接限制。只有数据库所有者或超级用户可以更改此设置。

- 第二种形式更改数据库的名称。只有数据库所有者或超级用户才能重命名数据库；非超级用户所有者还必须具有 `CREATEDB` 权限。你无法重命名当前数据库。首先连接到不同的数据库。

- 第三种形式更改数据库的所有者。要更改所有者，你必须拥有该数据库，并且是新拥有角色的直接或间接成员，并且你必须具有 `CREATEDB` 权限。（请注意，超级用户自动拥有所有这些权限。）

- 第四种形式更改数据库的默认表空间。只有数据库所有者或超级用户才能执行此操作；你还必须拥有新表空间的创建权限。此命令将数据库旧默认表空间中的所有表或索引物理移动到新表空间。请注意，非默认表空间中的表和索引不受影响。

- 其余形式更改 Cloudberry Database 配置参数的会话默认值。每当随后在该数据库中启动新会话时，指定的值将成为会话默认值。特定于数据库的默认值会覆盖服务器配置文件 (postgresql.conf) 中存在的任何设置。只有数据库所有者或超级用户才能更改数据库的会话默认值。某些参数不能以这种方式设置，或者只能由超级用户设置。

## 参数

- **name**：要更改其属性的数据库的名称。
- **connlimit**：可能的最大并发连接数。默认值 `-1` 表示没有限制。
- **parameter value**：将此数据库的指定配置参数的会话默认值设置为给定值。如果值为 `DEFAULT`，或者等效地使用 `RESET`，则会删除特定于数据库的设置，因此 Cloudberry Database 将在新会话中继承系统范围的默认设置。你可以使用 `RESET ALL` 清除所有特定于数据库的设置。
- **newname**：数据库的新名称。
- **new_owner**：数据库的新所有者。
- **new_tablespace**：数据库的新默认表空间。

## 注意

你还可以为特定角色（用户）而不是数据库配置参数的会话默认值。如果存在冲突，角色特定的设置将覆盖数据库特定的设置。

## 示例

设置默认 schema 的搜索路径为 `mydatabase` 数据库：

```sql
ALTER DATABASE mydatabase SET search_path TO myschema, 
public, pg_catalog;
```

## 兼容性

`ALTER DATABASE` 语句是一个 Cloudberry Database 的语法扩展。

## 另见

`CREATE DOMAIN`，`DROP DOMAIN`
