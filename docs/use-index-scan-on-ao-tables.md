---
title: Use IndexScan on AO Tables
---

# Use IndexScan on AO Tables

Cloudberry Database supports IndexScan when querying on App-Optimized (AO) tables to improve query efficiency in certain scenarios, such as the following query:

```sql
SELECT * FROM tbl WHERE val > 100 ORDER BY val LIMIT 10;
```

:::tip
Append-Optimized (AO) tables are an optimized storage method for scenarios that focus on batch insertion, such as big data analysis and data warehouse scenarios. When new data is inserted into an AO table, Cloudberry Database appends the new data to the end of the table, instead of seeking free space for insertion like in regular tables. This means that inserting data into AO tables only requires append operations to the file, thus achieving higher insertion efficiency.
:::

For the above query statement:

- If you use heap table storage, Cloudberry Database executes this query by finding 10 tuples with `val` greater than `100` through IndexScan. It only needs to read about 10 tuples from the index and the table.
- If you use the AO table storage method, and assume that the `tbl` table has 1 billion rows of tuples, we specify through the `LIMIT` clause that only 10 tuples are to be returned:

    - Cloudberry Database supports using IndexScan operations to scan AO tables, which can greatly reduce the amount of data to be scanned and greatly improve the efficiency of scanning. It is a better scanning method than SeqScan and BitmapScan. SeqScan or BitmapScan scans 100 million times more data than IndexScan.

## Applicable scenarios

This feature is suitable for querying on large tables while limiting the size of the returned result set by using  `ORDER BY` and `LIMIT` clauses:

```sql
SELECT * FROM tbl WHERE val > 100 ORDER BY val LIMIT 10;
```

:::info
"Large table" means the table size of about 3000 times the data to be queried. For example, when `LIMIT 10` is used to return 10 records, a table larger than 30,000 records can be considered a large table.
:::

Depending on the size of the data, different degrees of optimization are achieved. In the most suitable scenario, queries that originally required tens of minutes of execution can be returned within 1 second.

## Usage example

To enable AO IndexScan, you need to run `SET optimizer TO off;` to disable the GPORCA optimizer and set the system parameter `gp_enable_ao_indexscan` to `ON`.

From the following example, you can see that the execution time without AO IndexScan is 5888.235 ms, which is much longer than the execution time of 15.462 ms with AO IndexScan enabled.

```sql
SET optimizer TO off; -- To enable AO IndexScan, first disable the GPORCA optimizer.

-- Creates the test table, generates 100 million records of data, and builds index on the val column.
CREATE TABLE tbl (id int, val int) WITH (orientation='column', appendonly=true);
INSERT INTO tbl SELECT i, i FROM generate_series(1, 100000000) s(i);

-- Directly runs a query.
EXPLAIN ANALYZE SELECT * FROM tbl WHERE val > 100 ORDER BY val LIMIT 10;

(Execution Time: 5888.235 ms)


-- Runs the query again after enabling AO IndexScan.
SET gp_enable_ao_indexscan TO on;
EXPLAIN ANALYZE SELECT * FROM tbl WHERE val > 100 ORDER BY val LIMIT 10;

(Execution Time: 15.462 ms)
```

Currently, this feature is only available for the PostgreSQL optimizer. Also, on some mechanical hard drives, random I/O might be 30,000 times less efficient than sequential I/O. If AO IndexScan is enabled in the case of using poor mechanical hard drives, IndexScan's execution efficiency might be less than ideal.
