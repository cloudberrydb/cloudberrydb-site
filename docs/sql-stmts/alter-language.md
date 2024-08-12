---
title: ALTER LANGUAGE
---

# ALTER LANGUAGE

Changes the definition of a procedural language.

## Synopsis

```sql
ALTER [ PROCEDURAL ] LANGUAGE <name> RENAME TO <new_name>
ALTER [ PROCEDURAL ] LANGUAGE <name> OWNER TO { <new_owner> | CURRENT_USER | SESSION_USER }
```

## Description

`ALTER LANGUAGE` changes the definition of a procedural language for a specific database. Definition changes supported include renaming the language or assigning a new owner. You must be superuser or the owner of the language to use `ALTER LANGUAGE`.

## Parameters

**`name`**

Name of a language.

**`new_name`**

The new name of the language.

**`new_owner`**

The new owner of the language.

## Compatibility

There is no `ALTER LANGUAGE` statement in the SQL standard.

## See also

[CREATE LANGUAGE](/docs/sql-stmts/create-language.md), [DROP LANGUAGE](/docs/sql-stmts/drop-language.md)
