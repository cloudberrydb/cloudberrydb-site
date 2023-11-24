---
title: Create and Manage Database
---

# Create and Manage Cloudberry Database

A Cloudberry Database system is a single instance of Cloudberry Database. There can be multiple running Cloudberry Database systems co-existing with each other, but usually a client can only connect to one of them.

There can be multiple databases in a Cloudberry Database system. This is different from some database management systems (such as Oracle) where the database instance *is* the database. Although you can create many databases in a Cloudberry Database system, client programs can connect to and access only one database at a time — you cannot cross-query between databases.

## About template and default databases

Cloudberry Database provides some template databases and a default database, *template1*, *template0*, and *postgres*.

By default, each new database you create is based on a *template1* database. Cloudberry Database uses *template1* to create databases unless you specify another template. Creating objects in *template1* is not recommended. The objects will be in every database you create using the default template database.

Cloudberry Database uses another database template, *template0*, internally. Do not drop or modify *template0*. You can use *template0* to create a completely clean database containing only the standard objects predefined by Cloudberry Database at initialization.

You can use the *postgres* database to connect to Cloudberry Database for the first time. Cloudberry Database uses *postgres* as the default database for administrative connections.

## Create a database 

The `CREATE DATABASE` command creates a new database. For example:

```sql
=> CREATE DATABASE <new_dbname>;
```

To create a database, you must have privileges to create a database or be a Cloudberry Database superuser. If you do not have the correct privileges, you cannot create a database. Contact your Cloudberry Database administrator to either give you the necessary privilege or to create a database for you.

You can also use the client program `createdb` to create a database. For example, running the following command in a command line terminal connects to Cloudberry Database using the provided host name and port and creates a database named *mydatabase*:

```shell
$ createdb -h coordinator_host -p 5432 mydatabase
```

The host name and port must match the host name and port of the installed Cloudberry Database system.

Some objects, such as roles, are shared by all the databases in a Cloudberry Database system. Other objects, such as tables that you create, are known only in the database in which you create them.

:::caution
The `CREATE DATABASE` command is not transactional.
:::

### Clone a database 

By default, a new database is created by cloning the standard system database template, *template1*. Any database can be used as a template when creating a new database, thereby providing the capability to 'clone' or copy an existing database and all objects and data within that database. For example:

```sql
=> CREATE DATABASE <new_dbname> TEMPLATE <old_dbname>;
```

### Create a database with a different owner

Another database owner can be assigned when a database is created:

```sql
=> CREATE DATABASE <new_dbname> WITH <owner=new_user>;
```

## View the list of databases

If you are working in the `psql` client program, you can use the `\l` meta-command to show the list of databases and templates in your Cloudberry Database system. If using another client program and you are a superuser, you can query the list of databases from the `pg_database` system catalog table. For example:

```sql
=> SELECT datname from pg_database;
```

## Alter a database

The `ALTER DATABASE` command changes database attributes such as owner, name, or default configuration attributes. For example, the following command alters a database by setting its default schema search path (the `search_path` configuration parameter):

```sql
=> ALTER DATABASE mydatabase SET search_path TO myschema, public, pg_catalog;
```

To alter a database, you must be the owner of the database or a superuser.

## Drop a database 

The `DROP DATABASE` command drops (or deletes) a database. It removes the system catalog entries for the database and deletes the database directory on disk that contains the data. You must be the database owner or a superuser to drop a database, and you cannot drop a database while you or anyone else is connected to it. Connect to `postgres` (or another database) before dropping a database. For example:

```sql
=> \c postgres
=> DROP DATABASE mydatabase;
```

You can also use the client program `dropdb` to drop a database. For example, the following command connects to Cloudberry Database using the provided host name and port and drops the database *mydatabase*:

```shell
$ dropdb -h coordinator_host -p 5432 mydatabase
```

:::caution
Dropping a database cannot be undone.
:::

The `DROP DATABASE` command is not transactional.
