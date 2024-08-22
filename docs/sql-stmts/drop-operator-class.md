---
title: DROP OPERATOR CLASS
---

# DROP OPERATOR CLASS

Removes an operator class.

## Synopsis

```sql
DROP OPERATOR CLASS [IF EXISTS] <name> USING <index_method> [CASCADE | RESTRICT]
```

## Description

`DROP OPERATOR` drops an existing operator class. To run this command you must be the owner of the operator class.

`DROP OPERATOR CLASS` does not drop any of the operators or functions referenced by the class. If there are any indexes depending on the operator class, you will need to specify `CASCADE` for the drop to complete.

## Parameters

**`IF EXISTS`**

Do not throw an error if the operator class does not exist. A notice is issued in this case.

**`name`**

The name (optionally schema-qualified) of an existing operator class.

**`index_method`**

The name of the index access method the operator class is for.

**`CASCADE`**

Automatically drop objects that depend on the operator class (such as indexes), and in turn all objects that depend on those objects.

**`RESTRICT`**

Refuse to drop the operator class if any objects depend on it. This is the default.

## Notes

`DROP OPERATOR CLASS` will not drop the operator family containing the class, even if there is nothing else left in the family (in particular, in the case where the family was implicitly created by `CREATE OPERATOR CLASS`). An empty operator family is harmless, but for the sake of tidiness you might wish to remove the family with `DROP OPERATOR FAMILY`; or perhaps better, use `DROP OPERATOR FAMILY` in the first place.

## Examples

Remove the B-tree operator class `widget_ops`:

```sql
DROP OPERATOR CLASS widget_ops USING btree;
```

This command will not succeed if there are any existing indexes that use the operator class. Add `CASCADE` to drop such indexes along with the operator class.

## Compatibility

There is no `DROP OPERATOR CLASS` statement in the SQL standard.

## See also

[ALTER OPERATOR CLASS](/docs/sql-stmts/alter-operator-class.md), [CREATE OPERATOR CLASS](/docs/sql-stmts/create-operator-class.md), [DROP OPERATOR FAMILY](/docs/sql-stmts/drop-operator-family.md)
