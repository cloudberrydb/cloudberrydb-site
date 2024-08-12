---
title: DROP ACCESS METHOD
---

# DROP ACCESS METHOD

Removes an access method

## Synopsis

```sql
DROP ACCESS METHOD [IF EXISTS] <name> [CASCADE | RESTRICT]
```

## Description

`DROP ACCESS METHOD` removes an existing access method. Only superusers can drop access methods.

## Parameters

**`IF EXISTS`**

Do not throw an error if the access method does not exist. Cloudberry Database issues a notice in this case.

**`name`**

The name of an existing access method.

**`CASCADE`**

Automatically drop objects that depend on the access method (such as operator classes, operator families, and indexes), and in turn all objects that depend on those objects.

**`RESTRICT`**

Refuse to drop the access method if any objects depend on it. This is the default.

## Examples

Drop the access method `heptree`;

``` sql
DROP ACCESS METHOD heptree;
```

## Compatibility

`DROP ACCESS METHOD` is a Cloudberry Database extension.

## See also

[CREATE ACCESS METHOD](/docs/sql-stmts/create-access-method.md)
