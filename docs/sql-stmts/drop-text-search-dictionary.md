---
title: DROP TEXT SEARCH DICTIONARY
---

# DROP TEXT SEARCH DICTIONARY

Removes a text search dictionary.

## Synopsis

```sql
DROP TEXT SEARCH DICTIONARY [ IF EXISTS ] <name> [ CASCADE | RESTRICT ]
```

## Description

`DROP TEXT SEARCH DICTIONARY` drops an existing text search dictionary. You must be the owner of the dictionary to run this command.

## Parameters

**`IF EXISTS`**

Do not throw an error if the text search dictionary does not exist. Cloudberry Database issues a notice in this case.

**`name`**

The name (optionally schema-qualified) of an existing text search dictionary.

**`CASCADE`**

Automatically drop objects that depend on the text search dictionary, and in turn all objects that depend on those objects.

**`RESTRICT`**

Refuse to drop the text search dictionary if any objects depend on it. This is the default.

## Examples

Remove the text search dictionary `english`:

```sql
DROP TEXT SEARCH DICTIONARY english;
```

This command will not succeed if there are any existing text search configurations that use the dictionary. Add `CASCADE` to drop such configurations along with the dictionary.

## Compatibility

There is no `CREATE TEXT SEARCH DICTIONARY` statement in the SQL standard.

## See also

[ALTER TEXT SEARCH DICTIONARY](/docs/sql-stmts/alter-text-search-dictionary.md), [CREATE TEXT SEARCH DICTIONARY](/docs/sql-stmts/create-text-search-dictionary.md)
