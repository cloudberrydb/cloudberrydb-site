---
title: EXECUTE
---

# EXECUTE

Runs a prepared SQL statement.

## Synopsis

```sql
EXECUTE <name> [ (<parameter> [, ...] ) ]
```

## Description

`EXECUTE` is used to run a previously prepared statement. Since prepared statements only exist for the duration of a session, the prepared statement must have been created by a `PREPARE` statement run earlier in the current session.

If the `PREPARE` statement that created the statement specified some parameters, a compatible set of parameters must be passed to the `EXECUTE` statement, or else Cloudberry Database raises an error. Because (unlike functions) prepared statements are not overloaded based on the type or number of their parameters, the name of a prepared statement must be unique within a database session.

For more information on the creation and usage of prepared statements, see [PREPARE](/docs/sql-stmts/prepare.md).

## Parameters

**`name`**

The name of the prepared statement to run.

**`parameter`**

The actual value of a parameter to the prepared statement. This must be an expression yielding a value that is compatible with the data type of this parameter, as was determined when the prepared statement was created.

## Outputs

The command tag returned by `EXECUTE` is that of the prepared statement, and not `EXECUTE`.

## Examples

Create a prepared statement for an `INSERT` statement, and then run it:

```sql
PREPARE fooplan (int, text, bool, numeric) AS
    INSERT INTO foo VALUES($1, $2, $3, $4);
EXECUTE fooplan(1, 'Hunter Valley', 't', 200.00);
```

## Compatibility

The SQL standard includes an `EXECUTE` statement, but it is only for use in embedded SQL. This version of the `EXECUTE` statement also uses a somewhat different syntax.

## See also

[DEALLOCATE](/docs/sql-stmts/deallocate.md), [PREPARE](/docs/sql-stmts/prepare.md)
