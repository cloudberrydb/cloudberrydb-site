---
title: Update Statistics
---

# Update Statistics in Cloudberry Database

The most important prerequisite for good query performance is to begin with accurate statistics for the tables. Updating statistics with the `ANALYZE` statement enables the query planner to generate optimal query plans. When a table is analyzed, information about the data is stored in the system catalog tables. If the stored information is out of date, the planner can generate inefficient plans.

## View whether statistics are updated

To view whether the statistics of a table are up to date, use the `pg_stat_all_tables` system view. The `last_analyze` column shows the last time the table was analyzed. The `last_autoanalyze` column shows the last time the table was automatically analyzed. The `last_analyze` and `last_autoanalyze` columns are updated when the `ANALYZE` statement is run on the table.

For example, to view whether the statistics of the `test_analyze` table are up to date, run the following query:

```sql
SELECT schemaname, relname, last_analyze, last_autoanalyze 
FROM pg_stat_all_tables 
WHERE relname = 'test_analyze';
```

## Generate statistics selectively

Running [`ANALYZE`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/sql-stmt-analyze.md) with no arguments updates statistics for all tables in the database. This can be a very long-running process and it is not recommended. You should `ANALYZE` tables selectively when data has changed or use the [analyzedb](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/db-utilities/db-util-analyzedb.md) utility.

Running `ANALYZE` on a large table can take a long time. If it is not feasible to run `ANALYZE` on all columns of a very large table, you can generate statistics for selected columns only using `ANALYZE table(column, ...)`. Be sure to include columns used in joins, `WHERE` clauses, `SORT` clauses, `GROUP BY` clauses, or `HAVING` clauses.

For a partitioned table, you can run `ANALYZE` just on partitions that have changed, for example, if you add a new partition. Note that for partitioned tables, you can run `ANALYZE` on the root partitioned table, or on the leaf partitions (files where data and statistics are actually stored). In Cloudberry Database, running `ANALYZE` on a single partition of a partitioned table also updates the statistical information of the root table, indicating that statistics gathering for one partition might affect the entire partitioned table's optimizer statistics. You can find the names of the leaf partitions using the `pg_partition_tree()` function:

```sql
SELECT * FROM pg_partition_tree( 'parent_table' );
```

## Improve statistics quality

There is a trade-off between the amount of time it takes to generate statistics and the quality, or accuracy, of the statistics.

To allow large tables to be analyzed in a reasonable amount of time, `ANALYZE` takes a random sample of the table contents, rather than examining every row. To increase the number of sample values for all table columns adjust the `default_statistics_target` configuration parameter. The target value ranges from `1` to `10000`; the default target value is `100`. 

The `default_statistics_target` variable applies to all columns by default, and specifies the number of values that are stored in the list of common values. A larger target might improve the quality of the query planner's estimates, especially for columns with irregular data patterns.

`default_statistics_target` can be set at the session level using the `SET default_statistics_target` statement. To set the default value of this configuration parameter, you need to set it in the `postgresql.conf` file and performs a reload.

## When to run ANALYZE

Run `ANALYZE`:

- after loading data,
- after `CREATE INDEX` operations,
- and after `INSERT`, `UPDATE`, and `DELETE` operations that significantly change the underlying data.

`ANALYZE` requires only a read lock on the table, so it might be run in parallel with other database activity. But for performance reasons, it is not recommended to run `ANALYZE` while performing loads, `INSERT`, `UPDATE`, `DELETE`, and `CREATE INDEX` operations.

## Configure automatic statistics collection

The `gp_autostats_mode` configuration parameter, together with the `gp_autostats_on_change_threshold` parameter, determines when an automatic analyze operation is triggered. When automatic statistics collection is triggered, the planner adds an `ANALYZE` step to the query.

By default, the value of `gp_autostats_mode` is `none`. Setting this parameter to `on_no_stats` triggers statistics collection for `CREATE TABLE AS SELECT`, `INSERT`, or `COPY` operations invoked by the table owner on any table that has no existing statistics.

Setting `gp_autostats_mode` to `on_change` triggers statistics collection only when the number of rows affected exceeds the threshold defined by `gp_autostats_on_change_threshold`, which has a default value of `2147483647`. The these operations invoked on a table by its owner can trigger automatic statistics collection with `on_change`: `CREATE TABLE AS SELECT`, `UPDATE`, `DELETE`, `INSERT`, and `COPY`.

Setting the `gp_autostats_allow_nonowner` server configuration parameter to `true` also instructs Cloudberry Database to trigger automatic statistics collection on a table when:

- `gp_autostats_mode=on_no_stats` and the first user to `INSERT` or `COPY` into the table is a non-owner.

Setting `gp_autostats_mode` to `none` deactivates automatics statistics collection.

For partitioned tables, automatic statistics collection is not triggered if data is inserted from the top-level parent table of a partitioned table. But automatic statistics collection *is* triggered if data is inserted directly in a leaf table (where the data is stored) of the partitioned table.
