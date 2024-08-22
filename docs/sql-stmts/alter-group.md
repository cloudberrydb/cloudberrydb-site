---
title: ALTER GROUP
---

# ALTER GROUP

Changes a role name or membership.

## Synopsis

```sql
ALTER GROUP <role_specification> ADD USER <user_name> [, ... ]

ALTER GROUP <role_specification> DROP USER <user_name> [, ... ]

-- where <role_specification> can be:

    <role_name>
  | CURRENT_USER
  | SESSION_USER

ALTER GROUP <group_name> RENAME TO <new_name>
```

## Description

`ALTER GROUP` changes the attributes of a user group. This is an obsolete command, though still accepted for backwards compatibility, because users and groups are superseded by the more general concept of roles.

The first two variants add users to a group or remove them from a group. (Any role can play the part of either a "user" or "group" for this purpose. These variants are effectively equivalent to granting or revoking membership in the role named as the "group"; so, the preferred way to do this is to use [GRANT](/docs/sql-stmts/grant.md) or [REVOKE](/docs/sql-stmts/revoke.md).

The third variant changes the name of the group. This is exactly equivalent to renaming the role with [ALTER ROLE](/docs/sql-stmts/alter-role.md).

## Parameters

**`group_name`**

The name of the group (role) to modify.

**`user_name`**

Users (roles) that are to be added to or removed from the group. The users (roles) must already exist; `ALTER GROUP` does not create or drop users.

**`new_name`**

The new name of the group.

## Examples

To add users to a group:

```sql
ALTER GROUP staff ADD USER karl, john;
```

To remove a user from a group:

```sql
ALTER GROUP workers DROP USER beth;
```

## Compatibility

There is no `ALTER GROUP` statement in the SQL standard.

## See also

[ALTER ROLE](/docs/sql-stmts/alter-role.md), [GRANT](/docs/sql-stmts/grant.md), [REVOKE](/docs/sql-stmts/revoke.md)
