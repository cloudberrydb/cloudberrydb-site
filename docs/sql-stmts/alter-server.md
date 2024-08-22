---
title: ALTER SERVER
---

# ALTER SERVER

Changes the definition of a foreign server.

## Synopsis

```sql
ALTER SERVER <name> [ VERSION '<new_version>' ]
    [ OPTIONS ( [ ADD | SET | DROP ] <option> ['<value>'] [, ... ] ) ]

ALTER SERVER <name> OWNER TO { <new_owner> | CURRENT_USER | SESSION_USER }
                
ALTER SERVER <name> RENAME TO <new_name>
```

## Description

`ALTER SERVER` changes the definition of a foreign server. The first form of the command changes the version string or the generic options of the server. Cloudberry Database requires at least one clause. The second and third forms of the command change the owner or the name of the server.

To alter the server, you must be the owner of the server. To alter the owner you must:

- Own the server.
- Be a direct or indirect member of the new owning role.
- Have `USAGE` privilege on the server's foreign-data wrapper.

Superusers automatically satisfy all of these criteria.

## Parameters

**`name`**

The name of an existing server.

**`new_version`**

The new server version.

**`OPTIONS ( [ ADD | SET | DROP ] option ['value'] [, ... ] )`**

Change the server's options. `ADD`, `SET`, and `DROP` specify the action to perform. If no operation is explicitly specified, the default operation is `ADD`. Option names must be unique. Cloudberry Database validates names and values using the server's foreign-data wrapper library.

**`new_owner`**

Specifies the new owner of the foreign server.

**`new_name`**

Specifies the new name of the foreign server.

## Examples

Change the definition of a server named `foo` by adding connection options:

```sql
ALTER SERVER foo OPTIONS (host 'foo', dbname 'foodb');
```

Change the option named `host` for a server named `foo`, and set the server version:

```sql
ALTER SERVER foo VERSION '9.1' OPTIONS (SET host 'baz');
```

## Compatibility

`ALTER SERVER` conforms to ISO/IEC 9075-9 (SQL/MED). The `OWNER TO` and `RENAME` forms are Cloudberry Database extensions.

## See also

[CREATE SERVER](/docs/sql-stmts/create-server.md), [DROP SERVER](/docs/sql-stmts/drop-server.md)
