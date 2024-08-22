---
title: DROP OPERATOR FAMILY
---

# DROP OPERATOR FAMILY

Removes an operator family.

## Synopsis

```sql
DROP OPERATOR FAMILY [IF EXISTS] <name> USING <index_method> [CASCADE | RESTRICT]
```

## Description

`DROP OPERATOR FAMILY` drops an existing operator family. To run this command you must be the owner of the operator family.

`DROP OPERATOR FAMILY` includes dropping any operator classes contained in the family, but it does not drop any of the operators or functions referenced by the family. If there are any indexes depending on operator classes within the family, you will need to specify `CASCADE` for the drop to complete.

## Parameters

**`IF EXISTS`**

Do not throw an error if the operator family does not exist. A notice is issued in this case.

**`name`**

The name (optionally schema-qualified) of an existing operator family.

**`index_method`**

The name of the index access method the operator family is for.

**`CASCADE`**

Automatically drop objects that depend on the operator family, and in turn all objects that depend on those objects.

**`RESTRICT`**

Refuse to drop the operator family if any objects depend on it. This is the default.

## Examples

Remove the B-tree operator family `float_ops`:

```sql
DROP OPERATOR FAMILY float_ops USING btree;
```

This command will not succeed if there are any existing indexes that use the operator family. Add `CASCADE` to drop such indexes along with the operator family.

## Compatibility

There is no `DROP OPERATOR FAMILY` statement in the SQL standard.

## See also

[ALTER OPERATOR FAMILY](/docs/sql-stmts/alter-operator-family.md), [CREATE OPERATOR FAMILY](/docs/sql-stmts/create-operator-family.md), [ALTER OPERATOR CLASS](/docs/sql-stmts/alter-operator-class.md), [CREATE OPERATOR CLASS](/docs/sql-stmts/create-operator-class.md), [DROP OPERATOR CLASS](/docs/sql-stmts/drop-operator-class.md)
