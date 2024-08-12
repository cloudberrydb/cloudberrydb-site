---
title: SET
---

# SET

Changes the value of a run-time Cloudberry Database configuration parameter.

## Synopsis

```sql
SET [ SESSION | LOCAL ] <configuration_parameter> { TO | = } { <value> | '<value>' | DEFAULT }

SET [SESSION | LOCAL] TIME ZONE { <value> | '<value>' |  LOCAL | DEFAULT }
```

## Description

The `SET` command changes server configuration parameters. Any configuration parameter classified as a session parameter can be changed on-the-fly with `SET`. (Some require superuser privileges to change, and others cannot be changed after server or session start.) `SET` affects only the value used by the current session.

If `SET` or `SET SESSION` is issued within a transaction that is later cancelled, the effects of the `SET` command disappear when the transaction is rolled back. Once the surrounding transaction is committed, the effects will persist until the end of the session, unless overridden by another `SET`.

The effects of `SET LOCAL` last only till the end of the current transaction, whether committed or not. A special case is `SET` followed by `SET LOCAL` within a single transaction: the `SET LOCAL` value will be seen until the end of the transaction, but afterwards (if the transaction is committed) the `SET` value will take effect.

The effects of `SET` or `SET LOCAL` are also canceled by rolling back to a savepoint that is earlier than the command.

If `SET LOCAL` is used within a function that includes a `SET` option for the same configuration parameter (see [CREATE FUNCTION](/docs/sql-stmts/create-function.md)), the effects of the `SET LOCAL` command disappear at function exit; the value in effect when the function was called is restored anyway. This allows `SET LOCAL` to be used for dynamic or repeated changes of a parameter within a function, while retaining the convenience of using the `SET` option to save and restore the caller's value. Note that a regular `SET` command overrides any surrounding function's `SET` option; its effects persist unless rolled back.

See Server Configuration Parameters for information about server parameters.

## Parameters

**`SESSION`**

Specifies that the command takes effect for the current session. This is the default if neither `SESSION` nor `LOCAL` appears.

**`LOCAL`**

Specifies that the command takes effect for only the current transaction. After `COMMIT` or `ROLLBACK`, the session-level setting takes effect again. Issuing this outside of a transaction block emits a warning and otherwise has no effect.

**`configuration_parameter`**

The name of a settable Cloudberry Database run-time configuration parameter. Only parameters classified as *session* can be changed with `SET`. See Server Configuration Parameters for details.

**`value`**

New value of the parameter. Values can be specified as string constants, identifiers, numbers, or comma-separated lists of these, as appropriate for the particular parameter. `DEFAULT` can be used to specify resetting the parameter to its default value (that is, whatever value it would have had if no `SET` had been issued in the current session). If specifying memory sizing or time units, enclose the value in single quotes.

There are a few configuration parameters that can only be adjusted using the `SET` command or that have a special syntax:

**`SCHEMA`**

`SET SCHEMA '<value>'` is an alias for `SET <search_path> TO <value>`. Only one schema may be specified using this syntax.

**`NAMES`**

`SET NAMES <value>` is an alias for `SET client_encoding TO <value>`.

**`SEED`**

Sets the internal seed for the random number generator (the function `random()`). Allowed values are floating-point numbers between -1 and 1 inclusive.

You can also set the seed by invoking the `setseed()` function:

```sql
SELECT setseed(value);
```

**`TIME ZONE`**

`SET TIME ZONE <value>` is an alias for `SET timezone TO <value>`. The syntax `SET TIME ZONE` allows special syntax for the time zone specification. Examples of valid values follow:

- `'PST8PDT'`
- `'Europe/Rome'`
- `-7` (time zone 7 hours west from UTC)
- `INTERVAL '-08:00' HOUR TO MINUTE` (time zone 8 hours west from UTC).

**`LOCAL`**<br />
**`DEFAULT`**

Set the time zone to your local time zone (that is, server's default value of timezone).

See the [Time Zones](https://www.postgresql.org/docs/12/datatype-datetime.html#DATATYPE-TIMEZONES) section of the PostgreSQL documentation for more information about time zones in Cloudberry Database.

## Examples

Set the schema search path:

```sql
SET search_path TO my_schema, public;
```

Increase the segment host memory per query to 200 MB:

```sql
SET statement_mem TO '200MB';
```

Set the style of date to traditional POSTGRES with "day before month" input convention:

```sql
SET datestyle TO postgres, dmy;
```

Set the time zone for San Mateo, California (Pacific Time):

```sql
SET TIME ZONE 'PST8PDT';
```

Set the time zone for Italy:

```sql
SET TIME ZONE 'Europe/Rome'; 
```

## Compatibility

`SET TIME ZONE` extends syntax defined in the SQL standard. The standard allows only numeric time zone offsets while Cloudberry Database allows more flexible time-zone specifications. All other `SET` features are Cloudberry Database extensions.

## See also

[RESET](/docs/sql-stmts/reset.md), [SHOW](/docs/sql-stmts/show.md)
