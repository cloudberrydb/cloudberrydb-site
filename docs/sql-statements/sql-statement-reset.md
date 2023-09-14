# RESET

Restores the value of a run-time system configuration parameter to the default value.

## Synopsis

``` {#sql_command_synopsis}
RESET <configuration_parameter>

RESET ALL
```

## Description

`RESET` restores system configuration parameters to their default values. `RESET` is an equivalent command for

``` sql
SET <configuration_parameter> TO DEFAULT
```

Refer to [SET](/docs/sql-statements/sql-statement-set.md) for details.

The default value is defined as the value that the parameter would have had, had no `SET` ever been issued for it in the current session. The actual source of this value might be a compiled-in default, the coordinator `postgresql.conf` configuration file, command-line options, or per-database or per-user default settings. This is subtly different from defining it as "the value that the parameter had at session start", because if the value came from the configuration file, it will be reset to whatever is specified by the configuration file now. See Server Configuration Parameters for more information.

The transactional behavior of `RESET` is the same as `SET`: its effects will be undone by transaction rollback.

## Parameters

configuration_parameter
:   The name of a settable run-time system configuration parameter. See Server Configuration Parameters for details.

ALL
:   Resets all settable run-time configuration parameters to their default values.

## Examples

Set the `statement_mem` configuration parameter to its default value:

```
RESET statement_mem; 
```

## Compatibility

`RESET` is a Greenplum Database extension.

## See Also

[SET](/docs/sql-statements/sql-statement-set.md), [SHOW](/docs/sql-statements/sql-statement-show.md)



