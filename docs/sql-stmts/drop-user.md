---
title: DROP USER
---

# DROP USER

Removes a database role.

## Synopsis

```sql
DROP USER [IF EXISTS] <name> [, ...]
```

## Description

`DROP USER` is an alias for [`DROP ROLE`](/docs/sql-stmts/drop-role.md).

## Compatibility

The `DROP USER` statement is a Cloudberry Database extension. The SQL standard leaves the definition of users to the implementation.

## See also

[`DROP ROLE`](/docs/sql-stmts/drop-role.md)
