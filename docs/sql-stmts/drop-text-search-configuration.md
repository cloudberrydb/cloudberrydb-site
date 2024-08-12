---
title: DROP TEXT SEARCH CONFIGURATION
---

# DROP TEXT SEARCH CONFIGURATION

Removes a text search configuration.

## Synopsis

```sql
DROP TEXT SEARCH CONFIGURATION [ IF EXISTS ] <name> [ CASCADE | RESTRICT ]
```

## Description

`DROP TEXT SEARCH CONFIGURATION` drops an existing text search configuration. You must be the owner of the configuration to run this command.

## Parameters

**`IF EXISTS`**

Do not throw an error if the text search configuration does not exist. Cloudberry Database issues a notice in this case.

**`name`**

The name (optionally schema-qualified) of an existing text search configuration.

**`CASCADE`**

Automatically drop objects that depend on the text search configuration, and in turn all objects that depend on those objects.

**`RESTRICT`**

Refuse to drop the text search configuration if any objects depend on it. This is the default.

## Examples

Remove the text search configuration `my_english`:

```sql
DROP TEXT SEARCH CONFIGURATION my_english;
```

This command will not succeed if there are any existing indexes that reference the configuration in `to_tsvector` calls. Add `CASCADE` to drop such indexes along with the text search configuration.

## Compatibility

There is no `DROP TEXT SEARCH CONFIGURATION` statement in the SQL standard.

## See also

[ALTER TEXT SEARCH CONFIGURATION](/docs/sql-stmts/alter-text-search-configuration.md), [CREATE TEXT SEARCH CONFIGURATION](/docs/sql-stmts/create-text-search-configuration.md)
