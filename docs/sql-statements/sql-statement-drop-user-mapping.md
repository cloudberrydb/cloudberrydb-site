# DROP USER MAPPING

Removes a user mapping for a foreign server.

## Synopsis

``` {#sql_command_synopsis}
DROP USER MAPPING [ IF EXISTS ] { <user_name> | USER | CURRENT_USER | PUBLIC } 
    SERVER <server_name>
```

## Description

`DROP USER MAPPING` removes an existing user mapping from a foreign server.

The owner of a foreign server can drop user mappings for that server for any user. Also, a user can drop a user mapping for their own user name if they have been granted the `USAGE` privilege on the server.

## Parameters

IF EXISTS
:   Do not throw an error if the user mapping does not exist. Greenplum Database issues a notice in this case.

user_name
:   User name of the mapping. `CURRENT_USER` and `USER` match the name of the current user. `PUBLIC` is used to match all present and future user names in the system.

server_name
:   Server name of the user mapping.

## Examples

Drop the user mapping named `bob`, server `foo` if it exists:

```
DROP USER MAPPING IF EXISTS FOR bob SERVER foo;
```

## Compatibility

`DROP SERVER` conforms to ISO/IEC 9075-9 (SQL/MED). The `IF EXISTS` clause is a Greenplum Database extension.

## See Also

[CREATE USER MAPPING](CREATE_USER_MAPPING.html), [ALTER USER MAPPING](ALTER_USER_MAPPING.html)

**Parent topic:** SQL Commands

