---
title: DROP TEXT SEARCH TEMPLATE
---

# DROP TEXT SEARCH TEMPLATE

## Description

Removes a text search template.

## Synopsis

```sql
DROP TEXT SEARCH TEMPLATE [ IF EXISTS ] <name> [ CASCADE | RESTRICT ]
```

## Description

`DROP TEXT SEARCH TEMPLATE` drops an existing text search template. You must be a superuser to use this command.

You must be a superuser to use `ALTER TEXT SEARCH TEMPLATE`.

## Parameters

**`IF EXISTS`**

Do not throw an error if the text search template does not exist. Cloudberry Database issues a notice in this case.

**`name`**

The name (optionally schema-qualified) of an existing text search template.

**`CASCADE`**

Automatically drop objects that depend on the text search template, and in turn all objects that depend on those objects.

**`RESTRICT`**

Refuse to drop the text search template if any objects depend on it. This is the default.

## Examples

Remove the text search template `thesaurus`:

```sql
DROP TEXT SEARCH TEMPLATE thesaurus;
```

This command will not succeed if there are any existing text search dictionaries that use the template. Add `CASCADE` to drop such dictionaries along with the template. 

## Compatibility

There is no `DROP TEXT SEARCH TEMPLATE` statement in the SQL standard.

## See also

[ALTER TEXT SEARCH TEMPLATE](/docs/sql-stmts/alter-text-search-template.md), [CREATE TEXT SEARCH TEMPLATE](/docs/sql-stmts/create-text-search-template.md)
