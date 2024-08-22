---
title: DROP DOMAIN
---

# DROP DOMAIN

Removes a domain.

## Synopsis

```sql
DROP DOMAIN [IF EXISTS] <name> [, ...]  [CASCADE | RESTRICT]
```

## Description

`DROP DOMAIN` removes a previously defined domain. Only the owner of a domain can remove it.

## Parameters

**`IF EXISTS`**

Do not throw an error if the domain does not exist. A notice is issued in this case.

**`name`**

The name (optionally schema-qualified) of an existing domain.

**`CASCADE`**

Automatically drop objects that depend on the domain (such as table columns), and in turn all objects that depend on those objects.

**`RESTRICT`**

Refuse to drop the domain if any objects depend on it. This is the default.

## Examples

Remove the domain named `us_postal_code`:

```sql
DROP DOMAIN us_postal_code;
```

## Compatibility

This command conforms to the SQL standard, except for the `IF EXISTS` option, which is a Cloudberry Database extension.

## See also

[ALTER DOMAIN](/docs/sql-stmts/alter-domain.md), [CREATE DOMAIN](/docs/sql-stmts/create-domain.md)
