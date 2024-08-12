---
title: DROP SEQUENCE
---

# DROP SEQUENCE

Removes a sequence.

## Synopsis

```sql
DROP SEQUENCE [IF EXISTS] <name> [, ...] [CASCADE | RESTRICT]
```

## Description

`DROP SEQUENCE` removes sequence number generators. You must own the sequence to drop it (or be a superuser).

## Parameters

**`IF EXISTS`**

Do not throw an error if the sequence does not exist. Cloudberry Database issues a notice in this case.

**`name`**

The name (optionally schema-qualified) of the sequence to remove.

**`CASCADE`**

Automatically drop objects that depend on the sequence, and in turn all objects that depend on those objects.

**`RESTRICT`**

Refuse to drop the sequence if any objects depend on it. This is the default.

## Examples

Remove the sequence `myserial`:

```sql
DROP SEQUENCE myserial;
```

## Compatibility

`DROP SEQUENCE` conforms to the SQL standard, except that the standard allows only one sequence to be dropped per command. Also, the `IF EXISTS` option is a Cloudberry Database extension.

## See also

[ALTER SEQUENCE](/docs/sql-stmts/alter-sequence.md), [CREATE SEQUENCE](/docs/sql-stmts/create-sequence.md)
