---
title: ALTER DATABASE
---

# ALTER DATABASE

更改数据库的属性。

## 语法概要

```sql
ALTER DATABASE <name> [ [WITH] <option> [ ... ]  ]

-- <option> 可以是：

    ALLOW_CONNECTIONS <allowconn>
    CONNECTION LIMIT <connlimit>
    IS_TEMPLATE <istemplate>

ALTER DATABASE <name> RENAME TO <new_name>

ALTER DATABASE <name> OWNER TO { <new_owner> | CURRENT_USER | SESSION_USER }

ALTER DATABASE <name> SET TABLESPACE <new_tablespace>

ALTER DATABASE <name> SET <configuration_parameter> { TO | = } { <value> | DEFAULT }
ALTER DATABASE <name> SET <configuration_parameter> FROM CURRENT
ALTER DATABASE <name> RESET <configuration_parameter>
ALTER DATABASE <name> RESET ALL
```

## 描述

`ALTER DATABASE` 更改数据库的属性。

第一种形式更改每个数据库的设置，详情请参见下文。只有数据库所有者或超级用户才能以这种形式更改设置。

第二种形式更改数据库的名称。只有数据库所有者或超级用户才能重命名数据库。非超级用户所有者必须具有 `CREATEDB` 权限才能重命名数据库。如果你想重命名某数据库，该数据库不能是当前数据库，你需要先连接到另一个数据库才能进行操作。

第三种形式更改数据库的所有者。要更改所有者，你必须拥有该数据库，并且是新所有者角色的直接或间接成员，你还必须有 `CREATEDB` 权限。注意，超级用户自动拥有所有这些权限。

第四种形式更改数据库的默认表空间。只有数据库所有者或超级用户才能这样操作。你还必须对新表空间具有创建权限。执行该命令，Cloudberry Database 会将旧的默认表空间中所有的表或索引物理移动到新的表空间。新的默认表空间必须为空，且无人可以连接到该数据库。请注意，非默认表空间中的表和索引不受影响。

其它的形式更改 Cloudberry Database 配置参数的会话默认值。执行命令后，在该数据库中启动新会话时，指定的值将成为会话的默认值。数据库特定的默认值会覆盖服务器配置文件（`postgresql.conf`）中的设置。只有数据库所有者或超级用户才能更改数据库的会话默认值。某些参数不能以这种方式设置，或者只能由超级用户设置。

## 参数

**`name`**

要更改属性的数据库名称。

**`allowconn`**

如果为 `false`，则无人可以连接到该数据库。

**`connlimit`**

Coordinator 上允许连接到该数据库的最大并发连接数。默认值为 `-1`，表示无限制。Cloudberry Database 超级用户不受此限制。

**`istemplate`**

如果为 `true`，则任何具有 `CREATEDB` 权限的用户都可以克隆该数据库；如果为 `false`，则只有超级用户或数据库所有者可以克隆该数据库。请注意，模板数据库不能被删除。

**`new_name`**

数据库的新名称。

**`new_owner`**

数据库的新所有者。

**`new_tablespace`**

数据库的新默认表空间。

命令的这种形式不能在事务块中执行。

**`configuration_parameter` 值**

将特定配置参数的会话默认值设置为给定值。如果值为 `DEFAULT` 或等效的 `RESET`，则会删除数据库特定的设置，因此系统范围的默认设置将在新会话中继承。使用 `RESET ALL` 来清除所有数据库特定的设置。`SET FROM CURRENT` 会将会话当前的参数值保存为数据库特定的值。

更多有关参数名称和值的信息，请参见 [`SET`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/set.md)。

## 注意事项

还可以将会话默认值与特定角色绑定，而不是与数据库绑定；请参见 [`ALTER ROLE`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/alter-role.md)。如果存在冲突，角色特定的设置会覆盖数据库特定的设置。

## 示例

在 `test` 数据库中默认禁用索引扫描：

```sql
ALTER DATABASE test SET enable_indexscan TO off;
```

为 `mydatabase` 数据库设置默认模式搜索路径：

```sql
ALTER DATABASE mydatabase SET search_path TO myschema, public, pg_catalog;
```

## 兼容性

`ALTER DATABASE` 语句是 Cloudberry Database 的扩展。

## 另见

[`CREATE DATABASE`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/create-database.md)、[`DROP DATABASE`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/drop-database.md)、[`SET`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/set.md)、[`CREATE TABLESPACE`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/create-tablespace.md)
