---
title: CREATE CONVERSION
---

# CREATE CONVERSION

Defines a new encoding conversion.

## Synopsis

```sql
CREATE [DEFAULT] CONVERSION <name>
     FOR <source_encoding> TO <dest_encoding> FROM <function_name>
```

## Description

`CREATE CONVERSION` defines a new conversion between character set encodings. Also, conversions that are marked `DEFAULT` can be used for automatic encoding conversion between client and server. For this purpose, two conversions, from encoding A to B *and* from encoding B to A, must be defined.

To create a conversion, you must have `EXECUTE` privilege on the function and `CREATE` privilege on the destination schema.

## Parameters

**`DEFAULT`**

Indicates that this conversion is the default for this particular source to destination encoding. There should be only one default encoding in a schema for the encoding pair.

**`name`**

The name of the conversion. The conversion name may be schema-qualified. If it is not, the conversion is defined in the current schema. The conversion name must be unique within a schema.

**`source_encoding`**

The source encoding name.

**`dest_encoding`**

The destination encoding name.

**`function_name`**

The function used to perform the conversion. The function name may be schema-qualified. If it is not, the function will be looked up in the path. The function must have the following signature:

```sql
conv_proc(
    integer,  -- source encoding ID
    integer,  -- destination encoding ID
    cstring,  -- source string (null terminated C string)
    internal, -- destination (fill with a null terminated C string)
    integer   -- source string length
) RETURNS void;
```

## Notes

Use [DROP CONVERSION](/docs/sql-stmts/drop-conversion.md) to remove a user-defined conversion.

The privileges required to create a conversion might change in a feature release.

Note that in this release of Cloudberry Database, user-defined functions used in a user-defined conversion must be defined as `IMMUTABLE`. Any compiled code (shared library files) for custom functions must be placed in the same location on every host in your Cloudberry Database array (coordinator and all segments). This location must also be in the `LD_LIBRARY_PATH` so that the server can locate the files.


## Examples

To create a conversion from encoding `UTF8` to `LATIN1` using `myfunc`:

```sql
CREATE CONVERSION myconv FOR 'UTF8' TO 'LATIN1' FROM myfunc;
```

## Compatibility

`CREATE CONVERSION` is a Cloudberry Database extension. There is no `CREATE CONVERSION` statement in the SQL standard, but there is a `CREATE TRANSLATION` statement that is very similar in purpose and syntax.

## See also

[ALTER CONVERSION](/docs/sql-stmts/alter-conversion.md), [CREATE FUNCTION](/docs/sql-stmts/create-function.md), [DROP CONVERSION](/docs/sql-stmts/drop-conversion.md)
