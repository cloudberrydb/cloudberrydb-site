---
title: CREATE DATABASE
---

# CREATE DATABASE

Creates a new database.

## Synopsis

```sql
CREATE DATABASE name
    [ [WITH] [OWNER [=] <user_name>]
          [TEMPLATE [=] <template>]
          [TABLESPACE [=] <tablespace_name>]
          [ALLOW_CONNECTIONS [=] <allowconn>]
          [CONNECTION LIMIT [=] <connlimit> ]
          [IS_TEMPLATE [=] <istemplate> ] ]
```

## Description

`CREATE DATABASE` creates a new database.

To create a database, you must be a superuser or have the special `CREATEDB` privilege. See [`CREATE ROLE`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/sql-stmt-create-role.md).

The creator becomes the owner of the new database by default. Superusers can create databases owned by other users by using the `OWNER` clause. They can even create databases owned by users with no special privileges. Non-superusers with `CREATEDB` privilege can only create databases owned by themselves.

By default, the new database will be created by cloning the standard system database `template1`. A different template can be specified by writing `TEMPLATE name`. In particular, by writing `TEMPLATE template0`, you can create a clean database containing only the standard objects predefined by Cloudberry Database. This is useful if you wish to avoid copying any installation-local objects that may have been added to `template1`.

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
