---
title: ALTER TEXT SEARCH TEMPLATE
---

# ALTER TEXT SEARCH TEMPLATE

> [!WARNING]
> The document page you are reading is not ready yet. It might contain inaccurate or incorrect content. It is not recommended to use this document for serious reference.

## Description

Changes the definition of a text search template.

## Synopsis

```sql
ALTER TEXT SEARCH TEMPLATE <name> RENAME TO <new_name>
ALTER TEXT SEARCH TEMPLATE <name> SET SCHEMA <new_schema>
```

## Description

`ALTER TEXT SEARCH TEMPLATE` changes the definition of a text search parser. Currently, the only supported functionality is to change the template's name.

You must be a superuser to use `ALTER TEXT SEARCH TEMPLATE`.

## Parameters

**`name`**

The name (optionally schema-qualified) of an existing text search template.

**`new_name`**

The new name of the text search template.

**`new_schema`**

The new schema for the text search template.

## Compatibility

There is no `ALTER TEXT SEARCH TEMPLATE` statement in the SQL standard.

## See also

[CREATE TEXT SEARCH TEMPLATE](/docs/sql-stmts/sql-stmt-create-text-search-template.md), [DROP TEXT SEARCH TEMPLATE](/docs/sql-stmts/sql-stmt-drop-text-search-template.md)
