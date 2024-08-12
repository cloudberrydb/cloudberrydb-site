---
title: ALTER ROUTINE
---

# ALTER ROUTINE

Changes the definition of a routine.

## Synopsis

```sql
ALTER ROUTINE <name> [ ( [ [<argmode>] [<argname>] <argtype> [, ...] ] ) ] 
   <action> [, ... ] [RESTRICT]

ALTER ROUTINE <name> [ ( [ [<argmode>] [<argname>] <argtype> [, ...] ] ) ]
   RENAME TO <new_name>

ALTER ROUTINE <name> [ ( [ [<argmode>] [<argname>] <argtype> [, ...] ] ) ]
   OWNER TO { <new_owner> | CURRENT_USER | SESSION_USER }

ALTER ROUTINE <name> [ ( [ [<argmode>] [<argname>] <argtype> [, ...] ] ) ]
   SET SCHEMA <new_schema>

ALTER ROUTINE <name> [ ( [ [<argmode>] [<argname>] <argtype> [, ...] ] ) ]
   DEPENDS ON EXTENSION <extension_name>

-- where <action> is one of (depending on the type of routine):

    { IMMUTABLE | STABLE | VOLATILE }
    [ NOT ] LEAKPROOF
    { [EXTERNAL] SECURITY INVOKER | [EXTERNAL] SECURITY DEFINER }
    PARALLEL { UNSAFE | RESTRICTED | SAFE }
    EXECUTE ON { ANY | COORDINATOR | ALL SEGMENTS | INITPLAN }
    COST <execution_cost>
    ROWS <result_rows>
    SET <configuration_parameter> { TO | = } { <value> | DEFAULT }
    SET <configuration_parameter> FROM CURRENT
    RESET <configuration_parameter>
    RESET ALL
```

## Description

`ALTER ROUTINE` changes the definition of a routine, which can be an aggregate function, a normal function, or a procedure. Refer to [ALTER AGGREGATE](/docs/sql-stmts/alter-aggregate.md), [ALTER FUNCTION](/docs/sql-stmts/alter-function.md), and [ALTER PROCEDURE](/docs/sql-stmts/alter-procedure.md) for the description of the parameters, more examples, and further details.

## Examples

To rename the routine `foo` for type `integer` to `foobar`:

```sql
ALTER ROUTINE foo(integer) RENAME TO foobar;
```

This command will work independent of whether `foo` is an aggregate, function, or procedure.

## Compatibility

This statement is partially compatible with the `ALTER ROUTINE` statement in the SQL standard. Refer to [ALTER FUNCTION](/docs/sql-stmts/alter-function.md) and [ALTER PROCEDURE](/docs/sql-stmts/alter-procedure.md) for more details. Allowing routine names to refer to aggregate functions is a Cloudberry Database extension.

## See also

[ALTER AGGREGATE](/docs/sql-stmts/alter-aggregate.md), [ALTER FUNCTION](/docs/sql-stmts/alter-function.md), [ALTER PROCEDURE](/docs/sql-stmts/alter-procedure.md), [DROP ROUTINE](/docs/sql-stmts/drop-routine.md)
