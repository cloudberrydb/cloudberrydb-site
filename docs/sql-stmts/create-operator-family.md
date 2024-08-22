---
title: CREATE OPERATOR FAMILY
---

# CREATE OPERATOR FAMILY

Defines a new operator family.

## Synopsis

```sql
CREATE OPERATOR FAMILY <name>  USING <index_method>  
```

## Description

`CREATE OPERATOR FAMILY` creates a new operator family. An operator family defines a collection of related operator classes, and perhaps some additional operators and support functions that are compatible with these operator classes but not essential for the functioning of any individual index. (Operators and functions that are essential to indexes should be grouped within the relevant operator class, rather than being "loose" in the operator family. Typically, single-data-type operators are bound to operator classes, while cross-data-type operators can be loose in an operator family containing operator classes for both data types.)

The new operator family is initially empty. It should be populated by issuing subsequent `CREATE OPERATOR CLASS` commands to add contained operator classes, and optionally `ALTER OPERATOR FAMILY` commands to add "loose" operators and their corresponding support functions.

If a schema name is given then the operator family is created in the specified schema. Otherwise it is created in the current schema. Two operator families in the same schema can have the same name only if they are for different index methods.

The user who defines an operator family becomes its owner. Presently, the creating user must be a superuser. (This restriction is made because an erroneous operator family definition could confuse or even crash the server.)

Refer to [Interfacing Extensions to Indexes](https://www.postgresql.org/docs/12/xindex.html) in the PostgreSQL documentation for more information.

## Parameters

**`name`**

The (optionally schema-qualified) name of the operator family to be created.

**`index_method`**

The name of the index method this operator family is for.

## Compatibility

`CREATE OPERATOR FAMILY` is a Cloudberry Database extension. There is no `CREATE OPERATOR FAMILY` statement in the SQL standard.

## See also

[ALTER OPERATOR FAMILY](/docs/sql-stmts/alter-operator-family.md), [DROP OPERATOR FAMILY](/docs/sql-stmts/drop-operator-family.md), [ALTER OPERATOR CLASS](/docs/sql-stmts/alter-operator-class.md), [CREATE OPERATOR CLASS](/docs/sql-stmts/create-operator-class.md), [DROP OPERATOR CLASS](/docs/sql-stmts/drop-operator-class.md)
