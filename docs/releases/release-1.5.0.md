---
title: 1.5.0
---

:::caution

This is not an Apache release!

:::

# Cloudberry Database v1.5.0 Release Notes

Version number: v1.5.0

Cloudberry Database v1.5.0 adds several new features, and includes several performance/stability optimizations and bug fixes.

Quick try: [v1.5.0](https://github.com/cloudberrydb/cloudberrydb/releases/tag/1.5.0)

## New features

<table>
<thead>
  <tr>
    <th>Type</th>
    <th>Feature</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td rowSpan="4">Query processing</td>
    <td>Supports creating AO or AOCO tables and refreshing materialized views in parallel.</td>
  </tr>
  <tr>
    <td>Supports automatically using materialized views to optimize queries.</td>
  </tr>
  <tr>
    <td>Supports deploying a cluster with only a single computing node.</td>
  </tr>
  <tr>
    <td>Supports quickly deploying a cluster with only a command.</td>
  </tr>
  <tr>
    <td rowSpan="2">Storage</td>
    <td>Supports incremental materialized views.</td>
  </tr>
  <tr>
    <td>Supports using unique indexes on AO tables.</td>
  </tr>
  <tr>
    <td>Security</td>
    <td>Supports configuring user password policy using Profile.</td>
  </tr>
</tbody>
</table>

Each new feature is described as follows:

### Query processing

- **Supports creating AO or AOCO tables and refreshing materialized views in parallel.**

    Starting from v1.5.0, Cloudberry Database supports creating append-optimized (AO) tables and append-optimized column-oriented (AOCO) tables in parallel by using the `CREATE TABLE AS` statement, and supports refreshing materialized views in parallel based on the AO or AOCO tables. Parallel processing accelerates table creation and materialized view refresh.

    See [Create AO/AOCO Tables and Refresh Materialized Views in Parallel](/docs/parallel-create-ao-refresh-mv.md) for details.

- **Supports automatically using materialized views to optimize queries.**

    Starting from v1.5.0, Cloudberry Database supports automatically using materialized views to process some or all queries (called AQUMV) during the query planning phase. The applicable scenarios include:

    - Aggregation queries on large data sets: For queries that need to aggregate results from millions of records, AQUMV can significantly reduce query time.
    - Frequently updated large tables: In an environment where data is frequently updated, IMV can ensure that the query results are real-time and accurate.

    See [Use Automatic Materialized Views for Query Optimization](/docs/use-auto-materialized-view-to-answer-queries.md) for details.

### Cluster management

- **Supports deploying a cluster with only a single computing node.**

    Before v1.5.0, when you deployed a Cloudberry Database cluster, you needed to deploy at least one coordinator node and one segment node, as well as specify numerous configuration information and startup parameters. This process was relatively complex and time-consuming.

    Starting from v1.5.0, you can deploy a single-computing-node Cloudberry Database cluster just like deploying PostgreSQL. The cluster only contains one coordinator node, without the need to specify numerous configuration parameters or pre-allocate computing resources for multiple nodes.

    You can quickly deploy a single-node Cloudberry Database cluster using the tool `gpdemo`. See [Deploy Cloudberry Database with a Single Computing Node](/docs/deploy-cbdb-with-single-node.md) for details.

- **Supports quickly deploying a cluster with only a command.**

    Before v1.5.0, you needed to spend time writing configuration files and parameters if you wanted to deploy a small cluster with segments on a single node to make a demo. Starting from v1.5.0, to deploy a Cloudberry Database cluster with a specified number of segments, you only need to use the built-in script `gpdemo`  with a single command, that is:

    ```bash
    gpdemo
    ```

    See [Use gpdemo to Quickly Deploy Cloudberry Database](/docs/sys-utilities/gpdemo.md) for details.

### Storage

- **Supports incremental materialized views.**

    The incremental materialized view is a special form of materialized view. When data is inserted, updated, or deleted in a base table in Cloudberry Database, the incremental materialized view does not need to recalculate all the data in the entire view. Instead, it only updates the parts that have been updated since the last refresh. This can save a lot of computing resources and time, and significantly improve performance, especially when dealing with large datasets.

    Starting from v1.5.0, if a query involves intermediary result sets that require acceleration, or in scenarios with many read operations but few write operations, you can use incremental materialized views to speed up the queries. See [Incremental Materialized View in Cloudberry Database](/docs/use-incremental-materialized-view.md) for details.

- **Supports using unique indexes on AO tables.**

    Starting from v1.5.0, you can create a unique index on an Append-Optimized (AO) or Append-Optimized Column Store (AOCS) table in Cloudberry Database. With a unique index, Cloudberry Database checks the unique constraint when data is inserted into the AO table to ensure the uniqueness of the data. At the same time, the database optimizes specific queries with the characteristic of uniqueness to improve the query performance.

    See [Create Unique Index on AO Table](/docs/use-unique-index-on-ao-tables.md) for details.

### Security

- **Supports configuring user password policy using Profile.**

    Profile refers to the password policy configuration, which is used to control the password security policy of users in Cloudberry Database. You can bind  a profile to one or more users to control the password security policy of database users. Profile defines the rules for user management and password reuse. With Profile, the database administrator can use SQL to force some constraints, such as locking accounts after login failures or controlling the number of password reuses.

    Starting from v1.5.0, Cloudberry Database supports creating profiles through SQL statements and binding profiles to one or more users, thereby controlling the password policy for database users.

    See [Configure password policy in Cloudberry Database](/docs/set-password-profile.md) for details.

## Change description

### SQL syntax changes

`CREATE MATERIALIZED VIEW` now supports the `INCREMENTAL` option. You can use the SQL command `CREATE INCREMENTAL MATERIALIZED VIEW` to create incremental materialized views. The complete syntax support is as follows:

```sql
CREATE [INCREMENTAL] MATERIALIZED VIEW [ IF NOT EXISTS ] table_name
    [ (column_name [, ...] ) ]
    [ USING method ]
    [ WITH ( storage_parameter [= value] [, ... ] ) ]
    [ TABLESPACE tablespace_name ]
    AS query
    [ WITH [ NO ] DATA ]
```

### Functionality changes

None

### Parameter changes

None

## Bug fixes

- Fixed an issue of memory overflow in AOCO tables. This bug led to the following error message:

    ```sql
    SET default_table_access_method=ao_column;
    CREATE temp TABLE nocolumns();

    SELECT EXISTS(SELECT * FROM nocolumns);

    WARNING:  detected write past chunk end in ExecutorState 0x8f79b78  (seg0 slice1 127.0.1.1:7002 pid=16215)
    ```

- Fixed the alignment issue of `operatorMem` in the output results when viewing query plans using `EXPLAIN`. The display before the fix is as follows:

    ```sql
    SET gp_resqueue_print_operator_memory_limits=ON;
    EXPLAIN(COSTS OFF) SELECT COUNT(*) FROM test_hj_spill;

                                    QUERY PLAN
    ----------------------------------------------------------------------------
    Finalize AggregateoperatorMem: 100 kB

        ->  Gather Motion 3:1  (slice1; segments: 3)operatorMem: 100 kB

                    ->  Partial AggregateoperatorMem: 100 kB

                            ->  Seq Scan on test_hj_spilloperatorMem: 100 kB
    ```

- Fixed an issue causing memory exception in the snapshot under certain conditions, which might lead to a core dump during transaction processing in some scenarios.
- Improved the accuracy of internal table size estimation in parallel hash joins during parallel scan operations.
- Added support for Semi HashJoin types during parallel scans.
- Improved the logic for handling `NOT IN` clauses. Now Cloudberry Database can correctly handle scenarios involving `NULL` values. For example, executing queries like `SELECT c1 FROM t1_lasj WHERE c1 NOT IN (SELECT c1n FROM t2_lasj_has_null WHERE c1n IS NULL OR c1n IS NULL);` can output the correct results.
- Fixed issues encountered when compiling and running Cloudberry Database on macOS.
- Fixed an issue where the user's `search_path` was altered during `CREATE EXTENSION`.
