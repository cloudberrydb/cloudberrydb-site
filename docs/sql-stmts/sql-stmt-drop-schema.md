---
title: DROP SCHEMA
---

# DROP SCHEMA

Removes a schema.

## Synopsis

```sql
DROP SCHEMA [IF EXISTS] <name> [, ...] [CASCADE | RESTRICT]
```

## Description

`DROP SCHEMA` removes schemas from the database.

A schema can be dropped only by its owner or a superuser. Note that the owner can drop the schema (and thereby all contained objects) even if they do not own some of the objects within the schema.

## Parameters

**`IF EXISTS`**

Do not throw an error if the schema does not exist. A notice is issued in this case.

**`name`**

The name of the schema to remove.

**`CASCADE`**

Automatically drop objects (tables, functions, etc.) that are contained in the schema, and in turn all objects that depend on those objects.

**`RESTRICT`**

Refuse to drop the schema if it contains any objects. This is the default.

## Notes

Using the `CASCADE` option may result in the command removing objects in other schemas besides the one(s) named.

## Examples

Remove the schema `mystuff` from the database, along with everything it contains:

```sql
DROP SCHEMA mystuff CASCADE;
```

## Compatibility

`DROP SCHEMA` is fully conforming with the SQL standard, except that the standard only allows one schema to be dropped per command. Also, the `IF EXISTS` option is a Cloudberry Database extension.

## See also

[`CREATE SCHEMA`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/sql-stmt-create-schema.md), [`ALTER SCHEMA`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/sql-stmt-alter-schema.md)
