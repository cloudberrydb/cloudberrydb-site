---
title: Choose the Table Storage Model
---

# Choose the Table Storage Model

Cloudberry Database supports several storage models and a mix of storage models. When you create a table, you choose how to store its data. This document explains the options for table storage and how to choose the best storage model for your workload.

- [Heap Storage](#heap-storage)
- [Append-Optimized Storage](#append-optimized-storage)
- [Choosing Row or Column-Oriented Storage](#choosing-row-or-column-oriented-storage)
- [Altering a Table](#altering-a-table)
- [Dropping a Table](#dropping-a-table)

:::info
To simplify the creation of database tables, you can specify the default values for some table storage options with the Cloudberry Database server configuration parameter `gp_default_storage_options`.
:::

<!-- **Parent topic:** [Defining Database Objects](../ddl/ddl.html) -->

## Heap storage

By default, Cloudberry Database uses the same heap storage model as PostgreSQL. Heap table storage works best with OLTP-type workloads where the data is often modified after it is initially loaded. `UPDATE` and `DELETE` operations require storing row-level versioning information to ensure reliable database transaction processing. Heap tables are best suited for smaller tables, such as dimension tables, that are often updated after they are initially loaded.

## Append-optimized storage

Append-optimized table storage works best with denormalized fact tables in a data warehouse environment. Denormalized fact tables are typically the largest tables in the system. Fact tables are usually loaded in batches and accessed by read-only queries. Moving large fact tables to an append-optimized storage model eliminates the storage overhead of the per-row update visibility information. This allows for a leaner and easier-to-optimize page structure. The storage model of append-optimized tables is optimized for bulk data loading. Single row `INSERT` statements are not recommended.

### To create a heap table

Row-oriented heap tables are the default storage type.

```sql
=> CREATE TABLE foo (a int, b text) DISTRIBUTED BY (a);
```

Use the `WITH` clause of the `CREATE TABLE` command to declare the table storage options. The default is to create the table as a regular row-oriented heap-storage table. For example, to create an append-optimized table with no compression:

```sql
=> CREATE TABLE bar (a int, b text) 
    WITH (appendoptimized=true)
    DISTRIBUTED BY (a);
```

:::info
You use the `appendoptimized=value` syntax to specify the append-optimized table storage type. `appendoptimized` is a thin alias for the `appendonly` legacy storage option. Cloudberry Database stores `appendonly` in the catalog, and displays the same when listing storage options for append-optimized tables.
:::

`UPDATE` and `DELETE` are not allowed on append-optimized tables in a repeatable read or serizalizable transaction and will cause the transaction to end prematurely.

## Choose row or column-oriented storage

Cloudberry Database provides a choice of storage orientation models: row, column, or a combination of both. This section provides general guidelines for choosing the optimal storage orientation for a table. Evaluate performance using your own data and query workloads.

- Row-oriented storage: good for OLTP types of workloads with many iterative transactions and many columns of a single row needed all at once, so retrieving is efficient.
- Column-oriented storage: good for data warehouse workloads with aggregations of data computed over a small number of columns, or for single columns that require regular updates without modifying other column data.

For most general purpose or mixed workloads, row-oriented storage offers the best combination of flexibility and performance. However, there are use cases where a column-oriented storage model provides more efficient I/O and storage. Consider the following requirements when deciding on the storage orientation model for a table:

- **Updates of table data.** If you load and update the table data frequently, choose a row-oriented heap table. Column-oriented table storage is only available on append-optimized tables.

    See [Heap storage](#heap-storage) for more information.

- **Frequent INSERTs.** If rows are frequently inserted into the table, consider a row-oriented model. Column-oriented tables are not optimized for write operations, because column values for a row must be written to different places on disk.
- **Number of columns requested in queries.** If you typically request all or the majority of columns in the `SELECT` list or `WHERE` clause of your queries, consider a row-oriented model. Column-oriented tables are best suited to queries that aggregate many values of a single column where the `WHERE` or `HAVING` predicate is also on the aggregate column. For example:

    ```sql
    SELECT SUM(salary)...
    ```

    ```sql
    SELECT AVG(salary)... WHERE salary > 10000
    ```

    Or where the `WHERE` predicate is on a single column and returns a relatively small number of rows. For example:

    ```sql
    SELECT salary, dept ... WHERE state='CA'
    ```

- **Number of columns in the table.** Row-oriented storage is more efficient when many columns are required at the same time, or when the row-size of a table is relatively small. Column-oriented tables can offer better query performance on tables with many columns where you access a small subset of columns in your queries.
- **Compression.** Column data has the same data type, so storage size optimizations are available in column-oriented data that are not available in row-oriented data. For example, many compression schemes use the similarity of adjacent data to compress. However, the greater adjacent compression achieved, the more difficult random access can become, as data must be uncompressed to be read.

### To create a column-oriented table

The `WITH` clause of the `CREATE TABLE` command specifies the table's storage options. The default is a row-oriented heap table. Tables that use column-oriented storage must be append-optimized tables. For example, to create a column-oriented table:

```sql
=> CREATE TABLE bar (a int, b text) WITH (appendoptimized=true, orientation=column) DISTRIBUTED BY (a);
```

## Alter a table

The `ALTER TABLE` command changes the definition of a table. Use `ALTER TABLE` to change table attributes such as column definitions, distribution policy, access method, storage parameters, and partition structure. For example, to add a not-null constraint to a table column:

```sql
=> ALTER TABLE address ALTER COLUMN street SET NOT NULL;
```

### Alter table distribution

`ALTER TABLE` provides options to change a table's distribution policy. When the table distribution options change, the table data might be redistributed on disk, which can be resource-intensive. You can also redistribute table data using the existing distribution policy.

### Change the distribution policy

For partitioned tables, changes to the distribution policy apply recursively to the child partitions. This operation preserves the ownership and all other attributes of the table. For example, the following command redistributes the table sales across all segments using the `customer_id` column as the distribution key:

```sql
ALTER TABLE sales SET DISTRIBUTED BY (customer_id); 
```

When you change the hash distribution of a table, table data is automatically redistributed. Changing the distribution policy to a random distribution does not cause the data to be redistributed. For example, the following `ALTER TABLE` command has no immediate effect:

```sql
ALTER TABLE sales SET DISTRIBUTED RANDOMLY;
```

Changing the distribution policy of a table to `DISTRIBUTED REPLICATED` or from `DISTRIBUTED REPLICATED` automatically redistributes the table data.

### Redistribute table data

To redistribute table data for tables with a random distribution policy (or when the hash distribution policy has not changed) use `REORGANIZE=TRUE`. Reorganizing data might be necessary to correct a data skew problem, or when segment resources are added to the system. For example, the following command redistributes table data across all segments using the current distribution policy, including random distribution.

```sql
ALTER TABLE sales SET WITH (REORGANIZE=TRUE);
```

<!-- ### Alter the table access method

You might alter the method for accessing a table using the `SET ACCESS METHOD` clause. Set to `heap` to alter the table to be a heap-storage table, `ao_row` to alter the table to be append-optimized with row-oriented storage (AO), or `ao_column` to alter the table to be append-optimized with column-oriented storage (AOCO).

:::info
Although you can specify the table's access method using `SET <storage_parameter>` or `SET WITH <storage_parameter>`, it is recommended that you use `SET ACCESS METHOD <access_method>` instead.
:::

### Alter the table storage model

You might dynamically update a table's storage model -- including whether the table is heap, AO or AOCO; the table's compression and blocksize settings; and the table's fillfactor; --  by setting a variety of storage parameters when you invoke `ALTER TABLE` with the `SET <storage_parameter>` clause. This is true for both regular tables and partitioned tables. -->

<!-- #### Inheritance rules for altering a partitioned table's storage model

The following inheritance rules apply to the storage model of a partitioned table:

- Altering the storage model at the partition root changes the storage model for all existing children and all future children.

- Altering the storage model at the partition root with the `ONLY` keyword changes the storage model only for all future children.

- Altering the storage model at a leaf changes the storage model only for that leaf. -->

## Drop a table

The `DROP TABLE` command removes tables from the database. For example:

```sql
DROP TABLE mytable;
```

To empty a table of rows without removing the table definition, use `DELETE` or `TRUNCATE`. For example:

```sql
DELETE FROM mytable;

TRUNCATE mytable;
```

`DROP TABLE` always removes any indexes, rules, triggers, and constraints that exist for the target table. Specify `CASCADE`to drop a table that is referenced by a view. `CASCADE` removes dependent views.
