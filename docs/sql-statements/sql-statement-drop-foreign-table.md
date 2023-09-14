# DROP FOREIGN TABLE

Removes a foreign table.

## Synopsis

``` {#sql_command_synopsis}
DROP FOREIGN TABLE [ IF EXISTS ] <name> [, ...] [ CASCADE | RESTRICT ]
```

## Description

`DROP FOREIGN TABLE` removes an existing foreign table. Only the owner of a foreign table can remove it.

## Parameters

IF EXISTS
:   Do not throw an error if the foreign table does not exist. Greenplum Database issues a notice in this case.

name
:   The name (optionally schema-qualified) of the foreign table to drop.

CASCADE
:   Automatically drop objects that depend on the foreign table (such as views), and in turn all objects that depend on those objects.

RESTRICT
:   Refuse to drop the foreign table if any objects depend on it. This is the default.

## Examples

To destroy two foreign tables, `films` and `distributors`:

```
DROP FOREIGN TABLE films, distributors;
```

## Compatibility

`DROP FOREIGN TABLE` conforms to ISO/IEC 9075-9 (SQL/MED), except that the standard only allows one foreign table to be dropped per command. The `IF EXISTS` clause is a Greenplum Database extension.

## See Also

[ALTER FOREIGN TABLE](ALTER_FOREIGN_TABLE.html), [CREATE FOREIGN TABLE](CREATE_FOREIGN_TABLE.html)

**Parent topic:** [SQL Commands](../sql_commands/sql_ref.html)

