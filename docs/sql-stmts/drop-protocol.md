---
title: DROP PROTOCOL
---

# DROP PROTOCOL

Removes a data access protocol from a database.

## Synopsis

```sql
DROP PROTOCOL [IF EXISTS] <name>
```

## Description

`DROP PROTOCOL` removes the specified protocol from a database. You specify a protocol name in the `CREATE EXTERNAL TABLE` command to read data from or write data to an external data source.

You must be a superuser or the protocol owner to drop a protocol.

> **Caution** If you drop a data access prococol, external tables that have been defined specifying the protocol will no longer be able to access the external data source.

## Parameters

**`IF EXISTS`**

Do not throw an error if the protocol does not exist. Cloudberry Database issues a notice in this case.

**`name`**

The name of an existing data access protocol.

## Notes

Dropping a data access protocol, does not drop the protocol's call handlers. You must drop these functions manually.

Be sure to remove any shared libraries that were used by the protocol from the Cloudberry Database hosts.

## Compatibility

`DROP PROTOCOL` is a Cloudberry Database extension.

## See also

[CREATE EXTERNAL TABLE](/docs/sql-stmts/create-external-table.md), [CREATE PROTOCOL](/docs/sql-stmts/create-protocol.md)
