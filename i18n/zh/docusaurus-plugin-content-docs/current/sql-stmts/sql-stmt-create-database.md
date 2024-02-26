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

`CREATE DATABASE` creates a new database.

`CREATE DATABASE` 创建一个新数据库。

要创建一个数据库，你必须是超级用户或拥有特殊的 `CREATEDB` 权限。请参见 [`CREATE ROLE`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/sql-stmt-create-role.md)。

The creator becomes the owner of the new database by default. Superusers can create databases owned by other users by using the `OWNER` clause. They can even create databases owned by users with no special privileges. Non-superusers with `CREATEDB` privilege can only create databases owned by themselves.

默认情况下，数据库的创建者为新数据库的所有者。超级用户可以使用 `OWNER` 子句创建其他用户拥有的数据库。超级用户甚至可以创建无特殊权限的用户拥有的数据库。拥有 `CREATEDB` 权限的非超级用户只能创建自己拥有的数据库。

By default, the new database will be created by cloning the standard system database `template1`. A different template can be specified by writing `TEMPLATE name`. In particular, by writing `TEMPLATE template0`, you can create a clean database containing only the standard objects predefined by Cloudberry Database. This is useful if you wish to avoid copying any installation-local objects that may have been added to `template1`.

默认情况下，新数据库将通过克隆标准系统数据库 `template1` 来创建。可以通过写 `TEMPLATE name` 来指定不同的模板。特别地，在命令中使用 `TEMPLATE template0` 可以创建一个仅包含 Cloudberry Database 预定义标准对象的干净数据库。如果你希望避免复制可能已添加到 `template1` 的任何安装本地对象，这将非常有用。

## Parameters

**`name`**

The name of a database to create.

**`user_name`**

The name of the database user who will own the new database, or `DEFAULT` to use the default owner (the user running the command). To create a database owned by another role, you must be a direct or indirect member of that role, or be a superuser.

**`template`**

The name of the template from which to create the new database, or `DEFAULT` to use the default template (template1).

**`tablespace_name`**

The name of the tablespace that will be associated with the new database, or `DEFAULT` to use the template database's tablespace. This tablespace will be the default tablespace used for objects created in this database. See [`CREATE TABLESPACE`](/docs/sql-stmts/sql-stmt-create-tablespace.md) for more information.

**`allowconn`**

If `false`, then no one can connect to this database. The default is `true`, allowing connections (except as restricted by other mechanisms, such as `GRANT/REVOKE CONNECT`).

**`connlimit`**

The maximum number of concurrent connections allowed to this database on the coordinator. The default is `-1`, no limit. Cloudberry Database superusers are exempt from this limit.

**`istemplate`**

If `true`, then this database can be cloned by any user with `CREATEDB` privileges; if `false` (the default), then only superusers or the owner of the database can clone it. Note that template databases cannot be dropped.

Optional parameters can be written in any order, not only the order illustrated above.

## Notes

`CREATE DATABASE` cannot be run inside a transaction block.

Errors along the line of “could not initialize database directory” are most likely related to insufficient permissions on the data directory, a full disk, or other file system problems.

Use [`DROP DATABASE`](/docs/sql-stmts/sql-stmt-drop-database.md) to remove a database.

The program createdb is a wrapper program around this command, provided for convenience.

Database-level configuration parameters (set via [`ALTER DATABASE`](/docs/sql-stmts/sql-stmt-alter-database.md)) and database-level permissions (set via [GRANT](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/sql-stmt-grant.md)) are not copied from the template database.

Although it is possible to copy a database other than `template1` by specifying its name as the template, this is not (yet) intended as a general-purpose `"COPY DATABASE"` facility. The principal limitation is that no other sessions can be connected to the template database while it is being copied. `CREATE DATABASE` will fail if any other connection exists when it starts; otherwise, new connections to the template database are locked out until `CREATE DATABASE` completes.

The `CONNECTION LIMIT` option is enforced approximately; if two new sessions start at about the same time when just one connection “slot” remains for the database, it is possible that both will fail. Also, the limit is not enforced against superusers or background worker processes.

## Examples

To create a new database:

```sql
CREATE DATABASE gpdb;
```

To create a database `sales` owned by user `salesapp` with a default tablespace of `salesspace`:

```sql
CREATE DATABASE sales OWNER salesapp TABLESPACE salesspace;
```

## Compatibility

There is no `CREATE DATABASE` statement in the SQL standard. Databases are equivalent to catalogs, whose creation is implementation-defined.

## See also

[`ALTER DATABASE`](/docs/sql-stmts/sql-stmt-alter-database.md), [`DROP DATABASE`](/docs/sql-stmts/sql-stmt-drop-database.md)

