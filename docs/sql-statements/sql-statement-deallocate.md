# DEALLOCATE

Deallocates a prepared statement.

## Synopsis

``` {#sql_command_synopsis}
DEALLOCATE [PREPARE] { <name> | ALL }
```

## Description

`DEALLOCATE` is used to deallocate a previously prepared SQL statement. If you do not explicitly deallocate a prepared statement, it is deallocated when the session ends.

For more information on prepared statements, see [PREPARE](/docs/sql-statements/sql-statement-prepare.md).

## Parameters

PREPARE
:   Optional key word which is ignored.

name
:   The name of the prepared statement to deallocate.

ALL
:   Deallocate all prepared statements

## Examples

Deallocate the previously prepared statement named `insert_names`:

```
DEALLOCATE insert_names;
```

## Compatibility

The SQL standard includes a `DEALLOCATE` statement, but it is only for use in embedded SQL.

## See Also

[EXECUTE](/docs/sql-statements/sql-statement-execute.md), [PREPARE](/docs/sql-statements/sql-statement-prepare.md)



