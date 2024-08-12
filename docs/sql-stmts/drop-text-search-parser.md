---
title: DROP TEXT SEARCH PARSER
---

# DROP TEXT SEARCH PARSER

## Description

Removes a text search parser.

## Synopsis

```sql
DROP TEXT SEARCH PARSER [ IF EXISTS ] <name> [ CASCADE | RESTRICT ]
```

## Description

`DROP TEXT SEARCH PARSER` drops an existing text search parser. You must be a superuser to use this command.

## Parameters

**`IF EXISTS`**

Do not throw an error if the text search parser does not exist. Cloudberry Database issues a notice in this case.

**`name`**

The name (optionally schema-qualified) of an existing text search parser.

**`CASCADE`**

Automatically drop objects that depend on the text search parser, and in turn all objects that depend on those objects.

**`RESTRICT`**

Refuse to drop the text search parser if any objects depend on it. This is the default.

## Examples

Remove the text search parser `my_parser`:

```sql
DROP TEXT SEARCH PARSER my_parser;
```

This command will not succeed if there are any existing text search configurations that use the parser. Add `CASCADE` to drop such configurations along with the parser.

## Compatibility

There is no `DROP TEXT SEARCH PARSER` statement in the SQL standard.

## See also

[ALTER TEXT SEARCH PARSER](/docs/sql-stmts/alter-text-search-parser.md), [CREATE TEXT SEARCH PARSER](/docs/sql-stmts/create-text-search-parser.md)
