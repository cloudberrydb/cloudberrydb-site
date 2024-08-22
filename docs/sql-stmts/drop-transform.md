---
title: DROP TRANSFORM
---

# DROP TRANSFORM

Removes a transform.

## Synopsis

```sql
DROP TRANSFORM [IF EXISTS] FOR <type_name> LANGUAGE <lang_name> [CASCADE | RESTRICT]
```

## Description

`DROP TRANSFORM` removes a previously defined transform.

To drop a transform, you must own the type and the language. These are the same privileges that are required to create a transform.

## Parameters

**`IF EXISTS`**

Do not throw an error if the transform does not exist. Cloudberry Database issues a notice in this case.

**`type_name`**

The name of the data type of the transform.

**`lang_name`**

The name of the language of the transform.

**`CASCADE`**

Automatically drop objects that depend on the transform, and in turn all objects that depend on those objects.

**`RESTRICT`**

Refuse to drop the transform if any objects depend on it. This is the default.

## Examples

To drop the transform for type `hstore` and language `plpython3u`:

``` sql
DROP TRANSFORM FOR hstore LANGUAGE plpython3u;
```

## Compatibility

This form of `DROP TRANSFORM` is a Cloudberry Database extension. See [CREATE TRANSFORM](/docs/sql-stmts/create-transform.md) for details.

## See also

[CREATE TRANSFORM](/docs/sql-stmts/create-transform.md)
