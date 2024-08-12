---
title: DROP LANGUAGE
---

# DROP LANGUAGE

Removes a procedural language.

## Synopsis

```sql
DROP [PROCEDURAL] LANGUAGE [IF EXISTS] <name> [CASCADE | RESTRICT]
```

## Description

`DROP LANGUAGE` removes the definition of the previously registered procedural language. You must be a superuser or owner of the language to drop a language.

## Parameters

**`PROCEDURAL`**

Optional keyword - has no effect.

**`IF EXISTS`**

Do not throw an error if the language does not exist. A notice is issued in this case.

**`name`**

The name of an existing procedural language. For backward compatibility, the name may be enclosed by single quotes.

**`CASCADE`**

Automatically drop objects that depend on the language (such as functions written in that language), and in turn all objects that depend on those objects.

**`RESTRICT`**

Refuse to drop the language if any objects depend on it. This is the default.

## Examples

Remove the procedural language `plsample`:

```sql
DROP LANGUAGE plsample;
```

## Compatibility

There is no `DROP LANGUAGE` statement in the SQL standard.

## See also

[ALTER LANGUAGE](/docs/sql-stmts/alter-language.md), [CREATE LANGUAGE](/docs/sql-stmts/create-language.md)
