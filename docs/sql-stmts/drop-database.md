---
title: DROP DATABASE
---

# DROP DATABASE

Removes a database.

## Synopsis

```sql
DROP DATABASE [IF EXISTS] <name>
```

## Description

`DROP DATABASE` drops a database. It removes the catalog entries for the database and deletes the directory containing the data. It can only be run by the database owner. Also, it cannot be run while you or anyone else are connected to the target database. (Connect to `postgres` or any other database to issue this command.)

:::caution
`DROP DATABASE` cannot be undone. Use it with care!
:::

## Parameters

**`IF EXISTS`**

Do not throw an error if the database does not exist. A notice is issued in this case.

**`name`**

The name of the database to remove.

## Notes

`DROP DATABASE` cannot be run inside a transaction block.

This command cannot be run while connected to the target database. Thus, it might be more convenient to use the program dropdb instead, which is a wrapper around this command.

## Examples

Drop the database named `testdb`:

```sql
DROP DATABASE testdb;
```

## Compatibility

There is no `DROP DATABASE` statement in the SQL standard.

## See also

[`ALTER DATABASE`](/docs/sql-stmts/alter-database.md), [`CREATE DATABASE`](/docs/sql-stmts/create-database.md)
