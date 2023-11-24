---
title: Start and Stop Database
---

# Start and Stop Cloudberry Database

In a Cloudberry Database DBMS, the database server instances (the coordinator and all segments) are started or stopped across all of the hosts in the system in such a way that they can work together as a unified DBMS.

Because a Cloudberry Database system is distributed across many machines, the process for starting and stopping a Cloudberry Database system is different than the process for starting and stopping a regular PostgreSQL DBMS.

Use the `gpstart` and `gpstop` utilities to start and stop Cloudberry Database, respectively. These utilities are located in the `$GPHOME/bin` directory on your Cloudberry Database coordinator host.

:::tip
Do not issue a `kill` command to end any Postgres process. Instead, use the database command `pg_cancel_backend()`.
:::

Issuing a `kill -9` or `kill -11` can introduce database corruption and prevent root cause analysis from being performed.

## Start Cloudberry Database

Start an initialized Cloudberry Database system by running the `gpstart` utility on the coordinator instance.

Use the `gpstart` utility to start a Cloudberry Database system that has already been initialized by the `gpinitsystem` utility, but has been stopped by the `gpstop` utility. The `gpstart` utility starts Cloudberry Database by starting all the `postgres` instances on the Cloudberry Database cluster. `gpstart` orchestrates this process and performs the process in parallel.

Run `gpstart` on the coordinator host to start Cloudberry Database:

```shell
$ gpstart
```

## Restart Cloudberry Database

Stop the Cloudberry Database system and then restart it.

The `gpstop` utility with the `-r` option can stop and then restart Cloudberry Database after the shutdown completes.

To restart Cloudberry Database, enter the following command on the coordinator host:

```shell
$ gpstop -r
```

## Reload configuration file changes only

Reload changes to Cloudberry Database configuration files without interrupting the system.

The `gpstop` utility can reload changes to the `pg_hba.conf` configuration file and to *runtime* parameters in the coordinator `postgresql.conf` file without service interruption. Active sessions pick up changes when they reconnect to the database. Many server configuration parameters require a full system restart (`gpstop -r`) to activate.

Reload configuration file changes without shutting down the Cloudberry Database system using the `gpstop` utility:

```shell
$ gpstop -u
```

## Start the Coordinator in maintenance mode

Start only the coordinator to perform maintenance or administrative tasks without affecting data on the segments. For example, you can connect to a database only on the coordinator instance in maintenance mode and edit system catalog settings.

1. Run `gpstart` using the `-m` option:

    ```shell
    $ gpstart -m
    ```

2. Connect to the coordinator in maintenance mode to do catalog maintenance. For example:

    ```shell
    $ PGOPTIONS='-c gp_role=utility' psql postgres
    ```

3. After completing your administrative tasks, stop the coordinator in maintenance mode. Then, restart it in production mode.

    ```shell
    $ gpstop -m
    $ gpstart
    ```

    :::caution
    Incorrect use of maintenance mode connections can result in an inconsistent system state. It is recommended that Technical Support perform this operation.
    :::

## Stop Cloudberry Database

The `gpstop` utility stops or restarts your Cloudberry Database system and always runs on the coordinator host. When activated, `gpstop` stops all `postgres` processes in the system, including the coordinator and all segment instances. The `gpstop` utility uses a default of up to multiple parallel worker threads to bring down the Postgres instances that make up the Cloudberry Database cluster. To stop Cloudberry Database immediately, use the fast mode.

:::tip
Immediate shut down mode is not recommended. This mode stops all database processes without allowing the database server to complete transaction processing or clean up any temporary or in-process work files.
:::

- To stop Cloudberry Database:

    ```shell
    $ gpstop
    ```

- To stop Cloudberry Database in fast mode:

    ```shell
    $ gpstop -M fast
    ```

    By default, you are not allowed to shut down Cloudberry Database if there are any client connections to the database. Use the `-M fast` option to roll back all in progress transactions and terminate any connections before shutting down.

## Stop client processes

Cloudberry Database launches a new backend process for each client connection. A Cloudberry Database user with `SUPERUSER` privileges can cancel and terminate these client backend processes.

Canceling a backend process with the `pg_cancel_backend()` function ends a specific queued or active client query. Terminating a backend process with the `pg_terminate_backend()` function terminates a client connection to a database.

The `pg_cancel_backend()` function has two signatures:

- `pg_cancel_backend( pid int4 )`
- `pg_cancel_backend( pid int4, msg text )`

The `pg_terminate_backend()` function has two similar signatures:

- `pg_terminate_backend( pid int4 )`
- `pg_terminate_backend( pid int4, msg text )`

If you provide a `msg`, Cloudberry Database includes the text in the cancel message returned to the client. `msg` is limited to 128 bytes; Cloudberry Database truncates anything longer.

The `pg_cancel_backend()` and `pg_terminate_backend()` functions return `true` if successful, and `false` otherwise.

To cancel or terminate a backend process, you must first identify the process ID of the backend. You can obtain the process ID from the `pid` column of the `pg_stat_activity` view. For example, to view the process information associated with all running and queued queries:

```sql
SELECT usename, pid, state, query, datname
     FROM pg_stat_activity;
```

Sample partial query output:

```sql
usename |  pid     | state  |         query          | datname
---------+-------------------+--------+------------------------+---------
  sammy  |   31861  | idle   | SELECT * FROM testtbl; | testdb
  billy  |   31905  | active | SELECT * FROM topten;  | testdb
```

Use the output to identify the process id (`pid`) of the query or client connection.

For example, to cancel the waiting query identified in the sample output above and include `'Admin canceled long-running query.'` as the message returned to the client:

```sql
=# SELECT pg_cancel_backend(31905 ,'Admin canceled long-running query.');

ERROR:  canceling statement due to user request: "Admin canceled long-running query."
```
