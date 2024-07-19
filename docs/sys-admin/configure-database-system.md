---
title: Configure Database System
toc_max_heading_level: 5
---

# Configure Database System

Server configuration parameters affect the behavior of Cloudberry Database. They are part of the PostgreSQL "Grand Unified Configuration" system, so they are sometimes called "GUCs". Most of the Cloudberry Database server configuration parameters are the same as the PostgreSQL configuration parameters, but some are specific to Cloudberry Database.

## Coordinator and local parameters

Server configuration files contain parameters that configure server behavior. The Cloudberry Database configuration file, `postgresql.conf`, resides in the data directory of the database instance.

The coordinator and each segment instance have their own `postgresql.conf` file. Some parameters are local: each segment instance examines its `postgresql.conf` file to get the value of that parameter. Set local parameters on the coordinator and on each segment instance.

Other parameters are coordinator parameters that you set on the coordinator instance. The value is passed down to (or in some cases ignored by) the segment instances at query run time.

## Set configuration parameters

Many configuration parameters limit who can change them and where or when they can be set. For example, to change certain parameters, you must be a Cloudberry Database superuser. Other parameters can be set only at the system level in the `postgresql.conf` file or require a system restart to take effect.

Many configuration parameters are session parameters. You can set session parameters at the system level, the database level, the role level or the session level. Database users can change most session parameters within their session, but some require superuser permissions.

### Set a local configuration parameter

To change a local configuration parameter across multiple segments, update the parameter in the `postgresql.conf` file of each targeted segment, both primary and mirror. Use the `gpconfig` utility to set a parameter in all Cloudberry Database `postgresql.conf` files. For example:

```shell
$ gpconfig -c gp_vmem_protect_limit -v 4096
```

Restart Cloudberry Database to make the configuration changes effective:

```shell
$ gpstop -r
```

### Set a coordinator configuration parameter

To set a coordinator configuration parameter, set it at the Cloudberry Database coordinator instance. If it is also a session parameter, you can set the parameter for a particular database, role or session. If a parameter is set at multiple levels, the most granular level takes precedence. For example, session overrides role, role overrides database, and database overrides system.

#### Set parameters at the system level

Coordinator parameter settings in the coordinator `postgresql.conf` file are the system-wide default. To set a coordinator parameter:

1. Edit the `$COORDINATOR_DATA_DIRECTORY/postgresql.conf` file.
2. Find the parameter to set, uncomment it (remove the preceding `#` character), and type the desired value.
3. Save and close the file.
4. For session parameters that do not require a server restart, upload the `postgresql.conf` changes as follows:

    ```shell
    $ gpstop -u
    ```

    For parameter changes that require a server restart, restart Cloudberry Database as follows:

    ```shell
    $ gpstop -r
    ```

#### Set parameters at the database level

Use `ALTER DATABASE` to set parameters at the database level. For example:

```sql
ALTER DATABASE mydatabase SET search_path TO myschema;
```

When you set a session parameter at the database level, every session that connects to that database uses that parameter setting. Settings at the database level override settings at the system level.

#### Set parameters at the row level

Use `ALTER ROLE` to set a parameter at the role level. For example:

```sql
ALTER ROLE bob SET search_path TO bobschema;
```

When you set a session parameter at the role level, every session initiated by that role uses that parameter setting. Settings at the role level override settings at the database level.

#### Set parameters in a session level

Any session parameter can be set in an active database session using the `SET` command. For example:

```sql
SET statement_mem TO '200MB';
```

The parameter setting is valid for the rest of that session or until you issue a `RESET `command. For example:

```sql
RESET statement_mem;
```

Settings at the session level override those at the role level.

## View server configuration parameter settings

The SQL command `SHOW` allows you to see the current server configuration parameter settings. For example, to see the settings for all parameters:

```shell
$ psql -c 'SHOW ALL;'
```

`SHOW` lists the settings for the coordinator instance only. To see the value of a particular parameter across the entire system (and all segments), use the `gpconfig` utility. For example:

```shell
$ gpconfig --show max_connections
```
