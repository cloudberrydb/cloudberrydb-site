---
title: ALTER USER MAPPING
---

# ALTER USER MAPPING

Changes the definition of a user mapping for a foreign server.

## Synopsis

```sql
ALTER USER MAPPING FOR { <user_name> | USER | CURRENT_USER | SESSION_USER | PUBLIC }
    SERVER <server_name>
    OPTIONS ( [ ADD | SET | DROP ] <option> ['<value>'] [, ... ] )
```

## Description

`ALTER USER MAPPING` changes the definition of a user mapping for a foreign server.

The owner of a foreign server can alter user mappings for that server for any user. Also, a user granted `USAGE` privilege on the server can alter a user mapping for their own user name.

## Parameters

**`user_name`**

User name of the mapping. `CURRENT_USER` and `USER` match the name of the current user. `PUBLIC` is used to match all present and future user names in the system.

**`server_name`**

Server name of the user mapping.

**`OPTIONS ( [ ADD | SET | DROP ] option ['value'] [, ... ] )`**

Change options for the user mapping. The new options override any previously specified options. `ADD`, `SET`, and `DROP` specify the action to perform. If no operation is explicitly specified, the default operation is `ADD`. Option names must be unique. Cloudberry Database validates names and values using the server's foreign-data wrapper.

## Examples

Change the password for user mapping `bob`, server `foo`:

```sql
ALTER USER MAPPING FOR bob SERVER foo OPTIONS (SET password 'public');
```

## Compatibility

`ALTER USER MAPPING` conforms to ISO/IEC 9075-9 (SQL/MED). There is a subtle syntax issue: The standard omits the `FOR` key word. Since both `CREATE USER MAPPING` and `DROP USER MAPPING` use `FOR` in analogous positions, Cloudberry Database diverges from the standard here in the interest of consistency and interoperability.

## See also

[CREATE USER MAPPING](/docs/sql-stmts/create-user-mapping.md), [DROP USER MAPPING](/docs/sql-stmts/drop-user-mapping.md)
