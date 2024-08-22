---
title: CREATE PROTOCOL
---

# CREATE PROTOCOL

Registers a custom data access protocol that can be specified when defining a Cloudberry Database external table.

## Synopsis

```sql
CREATE [TRUSTED] PROTOCOL <name> (
   [readfunc='<read_call_handler>'] [, writefunc='<write_call_handler>']
   [, validatorfunc='<validate_handler>' ])
```

## Description

`CREATE PROTOCOL` associates a data access protocol name with call handlers that are responsible for reading from and writing data to an external data source. You must be a superuser to create a protocol.

The `CREATE PROTOCOL` command must specify either a read call handler or a write call handler. The call handlers specified in the `CREATE PROTOCOL` command must be defined in the database.

The protocol name can be specified in a `CREATE EXTERNAL TABLE` command.

For information about creating and enabling a custom data access protocol, refer to the Example Custom Data Access Protocol documentation.

## Parameters

**`TRUSTED`**

If not specified, only superusers and the protocol owner can create external tables using the protocol. If specified, superusers and the protocol owner can `GRANT` permissions on the protocol to other database roles.

**`name`**

The name of the data access protocol. The protocol name is case sensitive. The name must be unique among the protocols in the database.

**`readfunc= 'read_call_handler'`**

The name of a previously registered function that Cloudberry Database calls to read data from an external data source. The command must specify either a read call handler or a write call handler.

**`writefunc= 'write_call_handler'`**

The name of a previously registered function that Cloudberry Database calls to write data to an external data source. The command must specify either a read call handler or a write call handler.

**`validatorfunc='validate_handler'`**

An optional validator function that validates the URL specified in the `CREATE EXTERNAL TABLE` command.

## Notes

Cloudberry Database handles external tables of type `file`, `gpfdist`, and `gpfdists` internally.

Any shared library that implements a data access protocol must be located in the same location on all Cloudberry Database segment hosts. For example, the shared library can be in a location specified by the operating system environment variable `LD_LIBRARY_PATH` on all hosts. You can also specify the location when you define the handler function. For example, when you define the `s3` protocol in the `CREATE PROTOCOL` command, you specify `$libdir/gps3ext.so` as the location of the shared object, where `$libdir` is located at `$GPHOME/lib`.

## Compatibility

`CREATE PROTOCOL` is a Cloudberry Database extension.

## See also

[ALTER PROTOCOL](/docs/sql-stmts/alter-protocol.md), [CREATE EXTERNAL TABLE](/docs/sql-stmts/create-external-table.md), [DROP PROTOCOL](/docs/sql-stmts/drop-protocol.md), [GRANT](/docs/sql-stmts/grant.md)
