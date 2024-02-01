---
title: "[101-3] Lesson 3: Create Tables"
---

# [101-3] Lesson 3: Create Tables

After creating and preparing a database in [Lesson 2: Create and Prepare a Database](./101-2-create-and-prepare-database), you can start to create tables in the database.

:::note

To introduce Cloudberry Database, we use a public data set, the Airline On-Time Statistics and Delay Causes data set, published by the United States Department of Transportation at http://www.transtats.bts.gov/. The On-Time Performance dataset records flights by date, airline, originating airport, destination airport, and many other flight details. The data is available for flights since 1987. The exercises in this guide use data for about a million flights in 2009 and 2010. You are encouraged to review the SQL scripts in the GitHub `000-cbdb-sandbox/configs/faa.tar.gz` directory as you work through this introduction. You can run most of the exercises by entering the commands yourself or by executing a script in the `faa` directory.

:::

## Create tables using a SQL file in psql

In Cloudberry Database, you can use the `CREATE TABLE` SQL statement to create a table.

In the following steps, you will be guided to run a SQL file `create_dim_tables.sql` that contains the `CREATE TABLE` statements needed to create `faa` databases.

1. Log into Cloudberry Database in Docker as `gpadmin`. Then enter the `faa` directory, in which the SQL file `create_dim_tables.sql` is located.

    ```shell
    [gpadmin@mdw tmp]$ cd /tmp
    [gpadmin@mdw tmp]$ tar xzf faa.tar.gz
    [gpadmin@mdw tmp]$ cd faa
    ```

2. Take a look at the `create_dim_tables.sql` file.

    ```shell
    [gpadmin@mdw faa]$ more create_dim_tables.sql
    ```

    The `create_dim_tables.sql` file contains the following `CREATE TABLE` statements:

    ```sql
    DROP TABLE IF EXISTS faa.d_airports;  -- Drops the table if it exists to avoid name conflict.
    CREATE TABLE faa.d_airports (  -- Creates the table.
        AirportID      INTEGER,
        Name           TEXT,
        City           TEXT,
        Country        TEXT,
        airport_code   TEXT,
        ICOA_code      TEXT,
        Latitude       FLOAT8,
        Longitude      FLOAT8,
        Altitude       FLOAT8,
        TimeZoneOffset FLOAT,
        DST_Flag       TEXT,
        TZ             TEXT
    )
    DISTRIBUTED BY (airport_code);  -- Specifies the distribution column airport_code.

    DROP TABLE IF EXISTS faa.d_wac;
    CREATE TABLE faa.d_wac (wac SMALLINT, area_desc TEXT)
    DISTRIBUTED BY (wac);

    DROP TABLE IF EXISTS faa.d_airlines;
    CREATE TABLE faa.d_airlines (airlineid INTEGER, airline_desc TEXT)
    DISTRIBUTED BY (airlineid);

    DROP TABLE IF EXISTS faa.d_cancellation_codes;
    CREATE TABLE faa.d_cancellation_codes (cancel_code TEXT, cancel_desc TEXT)
    DISTRIBUTED BY (cancel_code);

    DROP TABLE IF EXISTS faa.d_delay_groups;
    CREATE TABLE faa.d_delay_groups (delay_group_code TEXT, delay_group_desc TEXT)
    DISTRIBUTED BY (delay_group_code);

    DROP TABLE IF EXISTS faa.d_distance_groups;
    CREATE TABLE faa.d_distance_groups (distance_group_code TEXT, distance_group_desc TEXT)
    DISTRIBUTED BY (distance_group_code);
    ```

3. Connect to the `tutorial` database as `lily` using the `psql`. You will run the SQL file as `lily`.

    ```shell
    [gpadmin@mdw faa]$ psql -U lily tutorial

    Password for user lily:  # changeme
    ```

    ```shell
    psql (14.4, server 14.4)
    Type "help" for help.
    tutorial=>
    ```

4. Run the `create_dim_tables.sql` file using the `psql` command `\i`.

    ```sql
    tutorial=> \i create_dim_tables.sql
    ```

    The following messages are displayed:

    ```sql
    psql:create_dim_tables.sql:1: NOTICE:  table "d_airports" does not exist, skipping
    DROP TABLE
    CREATE TABLE
    psql:create_dim_tables.sql:18: NOTICE:  table "d_wac" does not exist, skipping
    DROP TABLE
    CREATE TABLE
    psql:create_dim_tables.sql:22: NOTICE:  table "d_airlines" does not exist, skipping
    DROP TABLE
    CREATE TABLE
    psql:create_dim_tables.sql:26: NOTICE:  table "d_cancellation_codes" does not exist, skipping
    DROP TABLE
    CREATE TABLE
    psql:create_dim_tables.sql:30: NOTICE:  table "d_delay_groups" does not exist, skipping
    DROP TABLE
    CREATE TABLE
    psql:create_dim_tables.sql:34: NOTICE:  table "d_distance_groups" does not exist, skipping
    DROP TABLE
    CREATE TABLE
    ```

5. Use the `\dt` command to display all tables in the `faa` schema. You can see that 6 tables have been created.

    ```sql
    tutorial=> \dt
                        List of relations
    Schema |         Name         | Type  | Owner | Storage
   --------+----------------------+-------+-------+---------
    faa    | d_airlines           | table | lily  | heap
    faa    | d_airports           | table | lily  | heap
    faa    | d_cancellation_codes | table | lily  | heap
    faa    | d_delay_groups       | table | lily  | heap
    faa    | d_distance_groups    | table | lily  | heap
    faa    | d_wac                | table | lily  | heap
    (6 rows)
    ```

## About the distribution policy

The definition of a table includes the distribution policy for the data, which is critical for query performance. The goals for the distribution policy are to:

- Distribute the volume of data and query execution work evenly among segments.
- Enable segments to accomplish complicated query processing steps locally.

The distribution policy determines how data is distributed among segments. To get an effective distribution policy requires understanding of the data's characteristics, what kind of queries that would be executed on the data and what distribution strategy will best utilize the parallel execution capacity among segments.

Use the `DISTRIBUTED` clause in `CREATE TABLE` statement to define the distribution policy for a table. Ideally, each segment possesses an equal volume of data and performs equal share of work when queries run. There are 2 kinds of distribution policy syntax in Cloudberry Database:

- `DISTRIBUTED BY (column, ...)` defines a distribution key from one or more columns. A hash function applied to the distribution key determines which segment stores the corresponding row. Rows that have same distribution key are stored on the same segment. If the distribution keys are unique, the hash function will ensure that data is distributed evenly. The default distribution policy is a hash on the primary key of the table or the first column of table if no primary key is specified.
- `DISTRIBUTED RANDOMLY` distributes rows in round-robin fashion among segments.

When different tables that have the same or similar columns as distribution key are about to be joined, join action might be accomplished on segments, which will be much faster than re-distributing rows across segments and then joining. The random distribution policy cannot make it happen, so it is definitely better to have a distribution key for a table.

## What's next

After creating some tables in the database, you can continue to load data into the tables. See [Lesson 4: Data Loading](./101-4-data-loading).

Other tutorials:

- [Lesson 1: Create Users and Roles](./101-1-create-users-and-roles)
- [Lesson 2: Create and Prepare Database](./101-2-create-and-prepare-database)
- [Lesson 5: Queries and Performance Tuning](./101-5-queries-and-performance-tuning)
- [Lesson 6: Backup and Recovery Operations](./101-6-backup-and-recovery-operations)