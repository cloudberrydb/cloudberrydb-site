---
title: CREATE DATABASE
---

# CREATE DATABASE

创建一个新数据库。

## 语法概要

```sql
CREATE DATABASE name
    [ [WITH] [OWNER [=] <user_name>]
          [TEMPLATE [=] <template>]
          [TABLESPACE [=] <tablespace_name>]
          [ALLOW_CONNECTIONS [=] <allowconn>]
          [CONNECTION LIMIT [=] <connlimit> ]
          [IS_TEMPLATE [=] <istemplate> ] ]
```

## 描述

`CREATE DATABASE` 创建一个新数据库。

要创建一个数据库，你必须是超级用户或拥有特殊的 `CREATEDB` 权限。请参见 [`CREATE ROLE`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/create-role.md)。

默认情况下，数据库的创建者为新数据库的所有者。超级用户可以使用 `OWNER` 子句创建其他用户拥有的数据库。超级用户甚至可以创建无特殊权限的用户拥有的数据库。拥有 `CREATEDB` 权限的非超级用户只能创建自己拥有的数据库。

默认情况下，新数据库将通过克隆系统数据库 `template1` 来创建。可以通过在命令中使用 `TEMPLATE name` 来指定不同的模板。特别地，在命令中使用 `TEMPLATE template0` 可以创建一个仅包含 Cloudberry Database 预定义标准对象的干净数据库。如果你希望避免将那些可能已添加到 `template1` 的任何安装本地对象复制到新数据库，使用该选项将非常有用。

## 参数

**`name`**

要创建数据库的名称。

**`user_name`**

拥有新数据库的用户名称，或者 `DEFAULT` 以使用默认所有者（运行命令的用户）。要创建由其他角色拥有的数据库，你必须是该角色的直接或间接成员，或者是超级用户。

**`template`**

创建新数据库所基于的模板名称，或者 `DEFAULT` 以使用默认模板（template1）。

**`tablespace_name`**

与新数据库关联的表空间的名称，或者 `DEFAULT` 以使用模板数据库的表空间。该数据库中创建的对象默认使用该表空间。更多信息请参见 [`CREATE TABLESPACE`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/create-tablespace.md)。

**`allowconn`**

如果为 `false`，则无人能连接到这个数据库。默认值为 `true`，表示允许连接（除非受其他机制的限制，例如 `GRANT/REVOKE CONNECT`）。

**`connlimit`**

Coordinator 上允许连接到该数据库的最大并发连接数。默认值为 `-1`，表示没有限制。Cloudberry Database 超级用户不受此限制。

**`istemplate`**

如果为 `true`，则任何拥有 `CREATEDB` 权限的用户都可以克隆这个数据库。如果为 `false`（默认值），则只有超级用户或数据库的所有者可以克隆这个数据库。请注意，不能删除模板数据库。

你可以按任意顺序在命令中写以上参数，无需按照上面所列的参数顺序。

## 注意事项

`CREATE DATABASE` 不能在事务块中运行。

类似 `could not initialize database directory` 的错误很可能与数据目录的权限不足、磁盘已满或其他文件系统问题有关。

使用 [`DROP DATABASE`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/drop-database.md) 来删除数据库。

实用程序 `createdb` 是这个命令的包装程序，为了方便而提供的。

数据库级别的配置参数（通过 [`ALTER DATABASE`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/alter-database.md) 设置）和数据库级别的权限（通过 [`GRANT`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/grant.md) 设置）不会从模板数据库复制。

虽然通过指定数据库名称作为模板来复制一个非 `template1` 的数据库是可能的，但这并不是（至少目前不是）作为一个通用的“复制数据库”功能。主要的限制是在复制模板数据库时，不能有其他会话连接到该模板数据库。如果在开始执行 `CREATE DATABASE` 时存在任何其他连接，则会失败；否则，到模板数据库的新连接会被锁定，直到 `CREATE DATABASE` 完成。

`CONNECTION LIMIT` 选项是近似执行的；如果在数据库仅剩一个连接“槽”时，大约同时启动两个新会话，那么这两个会话都可能启动失败。此外，该限制不适用于超级用户或后台工作进程。

## 示例

创建一个新数据库：

```sql
CREATE DATABASE mydatabase;
```

创建一个由用户 `salesapp` 拥有的数据库 `sales`，默认表空间为 `salesspace`：

```sql
CREATE DATABASE sales OWNER salesapp TABLESPACE salesspace;
```

## 兼容性

SQL 标准中没有 `CREATE DATABASE` 语句。数据库相当于目录，数据库的创建是由实现定义的。

## 另见

[`ALTER DATABASE`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/alter-database.md)、[`DROP DATABASE`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/drop-database.md)
