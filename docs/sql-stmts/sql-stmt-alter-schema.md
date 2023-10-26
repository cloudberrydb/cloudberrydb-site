---
title: ALTER SCHEMA
---

# ALTER SCHEMA

> [!WARNING]
> The document page you are reading is not ready yet. It might contain inaccurate or incorrect content. It is not recommended to use this document for serious reference.

Changes the definition of a schema.

## Synopsis

```sql
ALTER SCHEMA <name> RENAME TO <new_name>

ALTER SCHEMA <name> OWNER TO { <new_owner> | CURRENT_USER | SESSION_USER }
```

## Description

`ALTER SCHEMA` changes the definition of a schema.

You must own the schema to use `ALTER SCHEMA`. To rename a schema you must also have the `CREATE` privilege for the database. To alter the owner, you must also be a direct or indirect member of the new owning role, and you must have the `CREATE` privilege for the database. Note that superusers have all these privileges automatically.

## Parameters

**`name`**

The name of an existing schema.

**`new_name`**

The new name of the schema. The new name cannot begin with `pg_`, as such names are reserved for system schemas.

**`new_owner`**

The new owner of the schema.

## Compatibility

There is no `ALTER SCHEMA` statement in the SQL standard.

## See also

[CREATE SCHEMA](/docs/sql-stmts/sql-stmt-create-schema.md), [DROP SCHEMA](/docs/sql-stmts/sql-stmt-drop-schema.md)
