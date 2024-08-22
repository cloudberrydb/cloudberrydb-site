---
title: clusterdb
---

# clusterdb

Reclusters tables that were previously clustered with `CLUSTER`.

## Synopsis

```shell
clusterdb [<connection-option> ...] [--verbose | -v] [--table | -t <table>] [[--dbname | -d] <dbname]

clusterdb [<connection-option> ...] [--verbose | -v] --all | -a

clusterdb -? | --help

clusterdb -V | --version
```

## Description

To cluster a table means to physically reorder a table on disk according to an index. Clustering helps improving index seek performance for queries that use that index. Clustering is a one-time operation: when the table is subsequently updated, the changes are not clustered. That is, no attempt is made to store new or updated rows according to their index order.

The `clusterdb` utility will find any tables in a database that have previously been clustered with the `CLUSTER` SQL command, and clusters them again on the same index that was last used. Tables that have never been clustered are not affected.

`clusterdb` is a wrapper around the SQL command [`CLUSTER`](/docs/sql-stmts/cluster.md). There is no effective difference between clustering databases via this utility and via other methods for accessing the server.

## Options

`clusterdb` accepts the following command-line arguments:

**`-a`**<br />
**`--all`**

Cluster all databases.

**`[-d] dbname`**<br />
**`[--dbname=]dbname`**

Specifies the name of the database to be clustered, when `-a/--all` is not used. If this is not specified, the database name is read from the environment variable `PGDATABASE`. If that is not set, the user name specified for the connection is used. The dbname can be a [connection string](https://www.postgresql.org/docs/12/libpq-connect.html#LIBPQ-CONNSTRING). If so, connection string parameters will override any conflicting command line options.

**`-e`**<br />
**`--echo`**

Echo the commands that `clusterdb` generates and sends to the server.

**`-q`**<br />
**`--quiet`**

Do not display progress messages.

**`-t table`**<br />
**`--table=table`**

Cluster the named table only. You can cluster multiple tables by specifying multiple `-t` switches.

**`-v`**<br />
**`--verbose`**

Print detailed information during processing.

**`-V`**<br />
**`--version`**

Print the `clusterdb` version, and exit.

**`-?`**<br />
**`--help`**

Show help about `clusterdb` command line arguments, and exit.

### Connection options

`clusterdb` also accepts the following command-line arguments for connection parameters:

**`-h host`**<br />
**`--host=host`**

Specifies the host name of the machine on which the Cloudberry coordinator database server is running. If not specified, reads from the environment variable `PGHOST` or defaults to `localhost`.

**`-p port`**<br />
**`--port=port`**

Specifies the TCP port on which the Cloudberry coordinator database server is listening for connections. If not specified, reads from the environment variable `PGPORT` or defaults to 5432.

**`-U username`**<br />
**`--username=username`**

The database role name to connect as. If not specified, reads from the environment variable `PGUSER` or defaults to the current system role name.

**`-w`**<br />
**`--no-password`**

Never issue a password prompt. If the server requires password authentication and a password is not available by other means such as a `.pgpass` file, the connection attempt will fail. This option can be useful in batch jobs and scripts where no user is present to enter a password.

**`-W`**<br />
**`--password`**

Force `clusterdb` to prompt for a password before connecting to a database.

This option is never essential, since `clusterdb` will automatically prompt for a password if the server demands password authentication. However, `clusterdb` will waste a connection attempt finding out that the server wants a password. In some cases it is worth typing `-W` to avoid the extra connection attempt.

**`--maintenance-db=dbname`**

Specifies the name of the database to connect to discover what other databases should be clustered. If not specified, the `postgres` database will be used, and if that does not exist, `template1` will be used. This can be a [connection](https://www.postgresql.org/docs/12/libpq-connect.html#LIBPQ-CONNSTRING) string. If so, connection string parameters will override any conflicting command line options. Also, connection string parameters other than the database name itself will be re-used when connecting to other databases.

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

In case of difficulty, see [`CLUSTER`](/docs/sql-stmts/cluster.md) and [psql](/docs/sys-utilities/psql.md) for discussions of potential problems and error messages. The database server must be running at the targeted host. Also, any default connection settings and environment variables used by the `libpq` front-end library will apply.

## Examples

To cluster the database named `test`:

```shell
clusterdb test
```

To cluster a single table `foo` in a database named `xyzzy`:

```shell
clusterdb --table=foo xyzzy
```

## See also

[`CLUSTER`](/docs/sql-stmts/cluster.md)
