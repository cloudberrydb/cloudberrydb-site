---
title: DROP SERVER
---

# DROP SERVER

Removes a foreign server descriptor.

## Synopsis

```sql
DROP SERVER [ IF EXISTS ] <name> [, ...] [ CASCADE | RESTRICT ]
```

## Description

`DROP SERVER` removes an existing foreign server descriptor. The user running this command must be the owner of the server.

## Parameters

**`IF EXISTS`**

Do not throw an error if the server does not exist. Cloudberry Database issues a notice in this case.

**`name`**

The name of an existing server.

**`CASCADE`**

Automatically drop objects that depend on the server (such as user mappings), and in turn all objects that depend on those objects.

**`RESTRICT`**

Refuse to drop the server if any object depends on it. This is the default.

## Examples

Drop the server named `foo` if it exists:

```sql
DROP SERVER IF EXISTS foo;
```

## Compatibility

`DROP SERVER` conforms to ISO/IEC 9075-9 (SQL/MED). The `IF EXISTS` clause is a Cloudberry Database extension.

## See also

[CREATE SERVER](/docs/sql-stmts/create-server.md), [ALTER SERVER](/docs/sql-stmts/alter-server.md)
