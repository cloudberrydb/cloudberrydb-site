---
title: "[101-2] Lesson 2: Create and Prepare Database"
---

# [101-2] Lesson 2: Create and Prepare Database

To create a new database in Cloudberry Database, you can either use the `CREATE DATABASE` SQL command in the `psql` client, or use the `createdb` utility. The `createdb` utility is a wrapper around the `CREATE DATABASE` command.

## Quick-start operations

In the following operations, you will be guided to create a new database using the `createdb` utility, to create a schema, and to set search path for schemas. You will also learn how to create a user and grant privileges to the user.

Before moving on to the operations, make sure that you have completed the previous tutorial [Lesson 1: Create Users and Roles](./101-1-create-users-and-roles). You will connect to the tutorial database as the user `lily` with password set up in the previous tutorial.

### Create database

1. Log into Cloudberry Database in Docker. Before creating the `tutorial` database, make sure that this database does not exist.

    ```shell
    [gpadmin@mdw ~]$ dropdb tutorial
    ```

    Output:
    
    ```shell
    dropdb: error: database removal failed: ERROR:  database "tutorial" does not exist
    ```

2. Create the `tutorial` database using the `createdb` utility.

    ```shell
    [gpadmin@mdw ~]$ createdb tutorial
    ```

    ```shell
    [gpadmin@mdw ~]$ psql -l  # Verifies that this database has been created.
                                    List of databases
       Name    |  Owner  | Encoding |   Collate   |    Ctype    |  Access privileges
    -----------+---------+----------+-------------+-------------+---------------------
     gpadmin   | gpadmin | UTF8     | en_US.UTF-8 | en_US.UTF-8 |
     postgres  | gpadmin | UTF8     | en_US.UTF-8 | en_US.UTF-8 |
     template0 | gpadmin | UTF8     | en_US.UTF-8 | en_US.UTF-8 | =c/gpadmin         +
               |         |          |             |             | gpadmin=CTc/gpadmin
     template1 | gpadmin | UTF8     | en_US.UTF-8 | en_US.UTF-8 | =c/gpadmin         +
               |         |          |             |             | gpadmin=CTc/gpadmin
     tutorial  | gpadmin | UTF8     | en_US.UTF-8 | en_US.UTF-8 |
    (5 rows)
    ```

    > **Info:**
    >
    > Unless you specify a different database, the newly created database is a copy of the `template1` database.

3. Create an entry in the `pg_hba.conf` configuration file by appending `local tutorial lily md5` to `/data0/database/master/gpseg-1/pg_hba.conf`.

    ```shell
    [gpadmin@mdw ~]$ echo "local tutorial lily md5" >> /data0/database/master/gpseg-1/pg_hba.conf
    ```

    > **Info:**
    >
    > - `pg_hba.conf` is the configuration file for client access control in Cloudberry Database.
    > - `md5` is the authentication methods, which means that the user needs to enter the password to log in.


4. Reload the configuration file to populate the change.

    ```shell
    [gpadmin@mdw ~]$ gpstop -u
    ```

    ```shell
    20230818:14:18:45:003733 gpstop:mdw:gpadmin-[INFO]:-Starting gpstop with args: -u
    20230818:14:18:45:003733 gpstop:mdw:gpadmin-[INFO]:-Gathering information and validating the environment...
    20230818:14:18:45:003733 gpstop:mdw:gpadmin-[INFO]:-Obtaining Cloudberry Coordinator catalog information
    20230818:14:18:45:003733 gpstop:mdw:gpadmin-[INFO]:-Obtaining Segment details from coordinator...
    20230818:14:18:45:003733 gpstop:mdw:gpadmin-[INFO]:-Cloudberry Version: 'postgres (Cloudberry Database) 1.0.0 build dev'
    20230818:14:18:45:003733 gpstop:mdw:gpadmin-[INFO]:-Signalling all postmaster processes to reload
    ```

5. Connect to the `tutorial` database as the user `lily`. You need to enter the password set up in the [previous tutorial](./101-1-create-users-and-roles#create-a-user-using-the-create-user-command).

    ```shell
    [gpadmin@mdw ~]$ psql -U lily tutorial

    Password for user lily:  # changeme
    psql (14.4, server 14.4)
    Type "help" for help.
    ```

    ```sql
    tutorial=> \q    -- Exits the database.
    ```

### Grant database privileges to users

For database users to properly do their works, you need to grant them the minimum permissions required. For example, a user might need `SELECT` permissions on a table to view data, and need `UPDATE`, `INSERT`, or `DELETE` to modify the data.

In the following operations, the database user `lily` will require permissions to create and manipulate objects in the `tutorial` database.

1. Connect to the `tutorial` database as `gpadmin`.

    ```shell
    [gpadmin@mdw ~]$ psql -U gpadmin tutorial
    ```
    
    Output:

    ```shell
    psql (14.4, server 14.4)
    Type "help" for help.
    ```

2. Grant `lily` all privileges on the `tutorial` database.

    ```sql
    tutorial=# GRANT ALL PRIVILEGES ON DATABASE tutorial TO lily;
    ```

    Output:

    ```sql
    GRANT
    ```

    ```sql
    tutorial=# \q    -- Exits the database.
    ```

### Create schema and set search path

In this section, you will be guided to create a `faa` schema and set the search path to make `faa` the default schema.

> **Info:**
>
> Database schema is a named container for a set of database objects, including tables, data types, and functions. One database can have multiple schemas. Objects in the schema are referenced by prefixing the object name with the schema name, separated with a period. For example, the `person` table in the `employee schema` is written as `employee.person`.
>
> The schema provides a namespace for the objects it contains. If the database is used for multiple applications, each with its own schema, the same table name can be used in each schema. For example, `employee.person` is a different table than `customer.person`. Both tables can be accessed in the same query as long as they are with accordingly schema name.
>
> The database contains a schema search path including a list of schema names. The first schema in the search path is also the schema where new objects are created when no schema is specified. The default search path is user,public, so by default, each object you create belongs to a schema associated with your login name. 

1. Connect to the `tutorial` database as the user `lily`.

    ```shell
    [gpadmin@mdw ~]$ psql -U lily tutorial
    ```

    ```shell
    Password for user lily:  # changeme

    psql (14.4, server 14.4)
    Type "help" for help.
    ```

2. Create the `faa` schema.

    ```sql
    tutorial=> DROP SCHEMA IF EXISTS faa CASCADE;
    tutorial=> CREATE SCHEMA faa;
    ```

3. Set the search path to `faa`, `public`, `pg_catalog`, and `gp_toolkit` schemas.

    ```sql
    tutorial=> SET SEARCH_PATH TO faa, public, pg_catalog, gp_toolkit;
    ```

    Output:

    ```sql
    SET
    ```

4. Verify that the search path is set correctly.

    ```sql
    tutorial=> SHOW search_path;
    ```

    Output:

    ```sql
    search_path
    -------------------------------------
    faa, public, pg_catalog, gp_toolkit
    (1 row)
    ```

5. Associate a search path with the user role `lily`.

    The search path you have set in the previous step is not persistent. You need to set it each time you connect to the database. You can associate a search path with the user role by using the `ALTER ROLE` command, so that each time you connect to the database with that role, the search path is restored.

    ```sql
    tutorial=> ALTER ROLE lily SET search_path TO faa, public, pg_catalog, gp_toolkit;
    ```

    Output:

    ```sql
    ALTER ROLE
    ```

## What's next

After creating and preparing the database, you can start to create tables in the database. See [Lesson 3: Create Tables](./101-3-create-tables) for more information.

Other tutorials:

- [Lesson 1: Create Users and Roles](./101-1-create-users-and-roles)
- [Lesson 4: Data Loading](./101-4-data-loading)
- [Lesson 5: Queries and Performance Tuning](./101-5-queries-and-performance-tuning)
- [Lesson 6: Backup and Recovery Operations](./101-6-backup-and-recovery-operations)
