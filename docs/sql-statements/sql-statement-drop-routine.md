# DROP ROUTINE

Removes a routine.

## Synopsis

``` {#sql_command_synopsis}
DROP ROUTINE [IF EXISTS] name ( [ [argmode] [argname] argtype [, ...] ] )
    [CASCADE | RESTRICT]
```

## Description

`DROP ROUTINE` removes the definition of an existing routine, which can be an aggregate function, a normal function, or a procedure. Refer to [DROP AGGREGATE](/docs/sql-statements/sql-statement-drop-aggregate.md), [DROP FUNCTION](/docs/sql-statements/sql-statement-drop-function.md), and [DROP PROCEDURE](/docs/sql-statements/sql-statement-drop-procedure.md) for the description of the parameters, more examples, and further details.

## Examples

To drop the routine `foo` for type `integer`:

```
DROP ROUTINE foo(integer);
```

This command will work independent of whether `foo` is an aggregate, function, or procedure.

## Compatibility

This command conforms to the SQL standard, with these Greenplum Database extensions:

- The standard only allows one routine to be dropped per command.

- The `IF EXISTS` option.

- The ability to specify argument modes and names.

- Aggregate functions are an extension.

## See Also

[DROP AGGREGATE](/docs/sql-statements/sql-statement-drop-aggregate.md), [DROP FUNCTION](/docs/sql-statements/sql-statement-drop-function.md), [DROP PROCEDURE](/docs/sql-statements/sql-statement-drop-procedure.md), [ALTER ROUTINE](/docs/sql-statements/sql-statement-alter-routine.md)



