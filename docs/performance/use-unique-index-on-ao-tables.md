---
title: Create Unique Index on AO Table
---

# Create Unique Index on AO Table (New in v1.5.0)

Starting from v1.5.0, you can create a unique index on an Append-Optimized (AO) or Append-Optimized Column Store (AOCS) table in Cloudberry Database. With a unique index, Cloudberry Database checks the unique constraint when data is inserted into the AO table to ensure the uniqueness of the data. At the same time, the database optimizes specific queries with the optimizer to improve the query performance. However, this also brings some overhead for maintaining a unique index, especially when inserting data.

## How it works

For scenarios where a unique index exists in an AO table, when a tuple is inserted into the AO table, Cloudberry Database inserts a placeholder into the auxiliary index structure BlockDirectory of the AO table, which blocks the insertion of the same key and achieves a unique index.

## How to add a unique index on an AO table

You can add a unique index on an AO table in two ways. You can choose one according to your needs.

- Specify a unique key or constraint while creating tables.

    ```sql
    CREATE TABLE foo(i int UNIQUE) USING ao_row;
    CREATE TABLE bar(i int UNIQUE) USING ao_column;
    CREATE TABLE foo2(i int, CONSTRAINT iuniq UNIQUE(i));
    ```

- Add a unique index or constraint separately after creating the table.

    ```sql
    CREATE TABLE baz(i int) with (appendonly=true);
    CREATE UNIQUE INDEX on baz(i);

    CREATE TABLE foobar(i int) USING ao_row;
    ALTER TABLE foobar ADD CONSTRAINT unique_i UNIQUE (i);
    ```

## Usage examples

1. Create an AO table with a unique constraint.

    ```sql
    postgres=# CREATE TABLE foo(i int UNIQUE) USING ao_row;
    CREATE TABLE

    postgres=# \d foo
                    Table "public.foo"
    Column |  Type   | Collation | Nullable | Default 
    --------+---------+-----------+----------+---------
    i      | integer |           |          | 
    Compression Type: None
    Compression Level: 0
    Block Size: 32768
    Checksum: t
    Indexes:
        "foo_i_key" UNIQUE CONSTRAINT, btree (i)
    Distributed by: (i)
    ```

2. Inserting the same key value into the table will return the `duplicate key` error.

    ```sql
    postgres=# INSERT INTO foo VALUES(1);
    INSERT 0 1

    postgres=# INSERT INTO foo VALUES(1);
    ERROR:  duplicate key value violates unique constraint "foo_i_key"  (seg1 127.0.1.1:8003 pid=557)
    DETAIL:  Key (i)=(1) already exists.
    ```

Example of concurrent data insertion: At the READ COMMITTED transaction level, two transactions concurrently insert the same value into the same AO table. One succeeds and the other is blocked.

1. If one transaction succeeds, the other insertion fails

    ```sql
    -- Session 1
    postgres=# BEGIN;
    BEGIN

    postgres=*# INSERT INTO foo VALUES(1);
    INSERT 0 1  -- Insertion successful

    postgres=*# COMMIT;
    COMMIT
    ```

    ```sql
    -- Session 2
    postgres=# BEGIN;
    BEGIN

    postgres=*# INSERT INTO foo VALUES(1);
    ERROR:  duplicate key value violates unique constraint "foo_i_key"  (seg1 127.0.1.1:8003 pid=2726)
    DETAIL:  Key (i)=(1) already exists.  -- Insertion fails

    postgres=!# END;
    ROLLBACK
    ```

2. If one transaction insertion fails, the other transaction will succeed.

    ```sql
    postgres=# BEGIN;
    BEGIN
    postgres=*# INSERT INTO foo VALUES(1);
    INSERT 0 1
    postgres=*# ROLLBACK;
    ROLLBACK
    ```

    ```sql
    postgres=# BEGIN;
    BEGIN
    postgres=*# INSERT INTO foo VALUES(1);
    INSERT 0 1
    postgres=*# COMMIT;
    COMMIT
    ```
