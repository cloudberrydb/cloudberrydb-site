---
title: DROP OWNED
---

# DROP OWNED

Removes database objects owned by a database role.

## Synopsis

```sql
DROP OWNED BY { <name> | CURRENT_USER | SESSION_USER } [, ...] [CASCADE | RESTRICT]
```

## Description

`DROP OWNED` drops all of the objects in the current database that are owned by one of the specified roles. Any privileges granted to the given roles on objects in the current database or on shared objects (databases, tablespaces) will also be revoked.

## Parameters

**`name`**

The name of a role whose objects will be dropped, and whose privileges will be revoked.

**`CASCADE`**

Automatically drop objects that depend on the affected objects, and in turn all objects that depend on those objects.

**`RESTRICT`**

Refuse to drop the objects owned by a role if any other database objects depend on one of the affected objects. This is the default.

## Notes

`DROP OWNED` is often used to prepare for the removal of one or more roles. Because `DROP OWNED` only affects the objects in the current database, it is usually necessary to run this command in each database that contains objects owned by a role that is to be removed.

Using the `CASCADE` option may make the command recurse to objects owned by other users.

The [REASSIGN OWNED](/docs/sql-stmts/reassign-owned.md) command is an alternative that reassigns the ownership of all the database objects owned by one or more roles. However, `REASSIGN OWNED` does not deal with privileges for other objects.

Databases and tablespaces owned by the role(s) will not be removed.

## Examples

Remove any database objects owned by the role named `sally`:

```sql
DROP OWNED BY sally;
```

## Compatibility

The `DROP OWNED` command is a Cloudberry Database extension.

## See also

[REASSIGN OWNED](/docs/sql-stmts/reassign-owned.md), [DROP ROLE](/docs/sql-stmts/drop-role.md)
