---
title: reindexdb
---

# reindexdb

Rebuilds indexes in a database.

## Synopsis

```shell
reindexdb [<connection-option> ...] [<option> ...] [-S | --schema <schema>] ...
        [-t | --table <table>] 
        [-i | --index <index>] ... [<dbname>]

reindexdb [<connection-option> ...] [<option> ...] -a | --all

reindexdb [<connection-option> ...] [<option> ...] -s | --system [<dbname>]

reindexdb -? | --help

reindexdb -V | --version
```

## Description

`reindexdb` is a utility for rebuilding indexes in Cloudberry Database.

`reindexdb` is a wrapper around the SQL command [`REINDEX`](/docs/sql-stmts/reindex.md). There is no effective difference between reindexing databases via this utility and via other methods for accessing the server.

## Options

`reindexdb` accepts the following command-line arguments:

**`-a`**<br />
**`--all`**

Reindex all databases.

**`[-d] dbname`**<br />
**`[--dbname=]dbname`**

Specifies the name of the database to be reindexed, when `-a` or `--all` is not used. If this is not specified, Cloudberry Database reads the database name from the environment variable `PGDATABASE`. If that is not set, the user name specified for the connection is used. The dbname can be a [connection string](https://www.postgresql.org/docs/12/libpq-connect.html#LIBPQ-CONNSTRING). If so, connection string parameters will override any conflicting command line options.

**`-e`**<br />
**`--echo`**

Echo the commands that `reindexdb` generates and sends to the server.

**`-i index`**<br />
**`--index=index`**

Recreate index only. You can recreate multiple indexes by specifying multiple `-i` switches.

**`-q`**<br />
**`--quiet`**

Do not display progress messages.

**`-s`**<br />
**`--system`**

Reindex system catalogs only.

**`-S schema`**<br />
**`--schema=schema`**

Reindex schema only. You can reindex multiple schemas by specifying multiple `-S` switches.

**`-t table`**<br />
**`--table=table`**

Reindex table only. You can reindex multiple tables by specifying multiple `-t` switches.

**`-v`**<br />
**`--verbose`**

Print detailed information during processing.

**`-V`**<br />
**`--version`**

Print the `reindexdb` version and exit.

**`-?`**<br />
**`--help`**

Show help about `reindexdb` command line arguments, and exit.

**Connection Options**

`reindexdb` also accepts the following command-line arguments for connection parameters:

**`-h host`**<br />
**`--host=host`**

Specifies the host name of the machine on which the Cloudberry coordinator database server is running. If not specified, reads from the environment variable `PGHOST` or defaults to localhost.

**`-p port`**<br />
**`--port=port`**

Specifies the TCP port on which the Cloudberry coordinator database server is listening for connections. If not specified, reads from the environment variable `PGPORT` or defaults to 5432.

**`-U username`**<br />
**`--username=username`**

The database user name to connect as. If not specified, reads from the environment variable `PGUSER` or defaults to the current system user name.

**`-w`**<br />
**`--no-password`**

Never issue a password prompt. If the server requires password authentication and a password is not available by other means such as a `.pgpass` file, the connection attempt will fail. This option can be useful in batch jobs and scripts where no user is present to enter a password.

**`-W`**<br />
**`--password`**

Force `reindexdb` to prompt for a password before connecting to a database.
This option is never essential, since `reindexdb` automatically prompts for a password if the server demands password authentication. However, `reindexdb` will waste a connection attempt finding out that the server wants a password. In some cases it is worth typing `-W` to avoid the extra connection attempt.

**`--maintenance-db=dbname`**

Specifies the name of the database to connect to discover what other databases should be reindexed, when `-a` or `--all` is used. If not specified, the `postgres` database will be used, and if that does not exist, `template1` will be used. This can be a [connection](https://www.postgresql.org/docs/12/libpq-connect.html#LIBPQ-CONNSTRING). If so, connection string parameters will override any conflicting command line options. Also, connection string parameters other than the database name itself will be re-used when connecting to other databases.

## Notes

`reindexdb` causes locking of system catalog tables, which could affect currently running queries. To avoid disrupting ongoing business operations, schedule the `reindexb` operation during a period of low activity.

`reindexdb` might need to connect several times to the coordinator server, asking for a password each time. It is convenient to have a `~/.pgpass` file in such cases.

## Environment

**`PGDATABASE`**<br />
**`PGHOST`**<br />
**`PGPORT`**<br />
**`PGUSER`**

Default connection parameters.

**`PG_COLOR`**

Specifies whether to use color in diagnostic messages. Possible values are `always`, `auto`, and `never`.

This utility, like most other Cloudberry Database utilities, also uses the environment variables supported by `libpq`.

## Diagnostics

In case of difficulty, see [REINDEX](/docs/sql-stmts/reindex.md) and [psql](/docs/sys-utilities/psql.md) for discussions of potential problems and error messages. The database server must be running at the targeted host. Also, any default connection settings and environment variables used by the `libpq` front-end library will apply.

## Notes

`reindexdb` might need to connect several times to the Cloudberry Database server, asking for a password each time. It is convenient to have a `~/.pgpass` file in such cases.

## Examples

To reindex the database named `mydb`:

```shell
reindexdb mydb
```

To reindex the table `foo` and the index `bar` in a database named `abcd`:

```shell
reindexdb --table=foo --index=bar abcd
```

## See also

[REINDEX](/docs/sql-stmts/reindex.md)
