---
title: Concurrency Control for Transactions
---

# Transactional Concurrency Control in Cloudberry Database

This document introduces the transactional concurrency control in Cloudberry Database, including:

- [MVCC mechanism](#mvcc-mechanism)
- [Lock modes](#lock-modes)
- [Global Deadlock Detector](#global-deadlock-detector)

## MVCC mechanism

Cloudberry Database and PostgreSQL do not use locks for concurrency control. Instead, they maintain data consistency through a multi-version model known as Multi-version Concurrency Control (MVCC). MVCC ensures transaction isolation for each database session, allowing each query transaction to see a consistent snapshot of data. This ensures that the data observed by a transaction remains consistent and unaffected by other concurrent transactions.

However, the specific data changes visible to a transaction are influenced by its isolation level. The default isolation level is "READ COMMITTED," which means that a transaction can observe data changes made by other transactions that have already been committed. If the isolation level is set to "REPEATABLE READ," then queries within that transaction will observe the data because it was at the beginning of the transaction and will not see changes made by other transactions in the interim. To specify the isolation level of a transaction, you can use the statement `BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ` to start a transaction with the "REPEATABLE READ" isolation level.

Because MVCC does not use explicit locks for concurrency control, lock contention is minimized and Cloudberry Database maintains reasonable performance in multi-user environments. Locks acquired for querying (reading) data do not conflict with locks acquired for writing data.

## Lock modes

Cloudberry Database provides multiple lock modes to control concurrent access to data in tables. Most Cloudberry Database SQL commands automatically acquire the appropriate locks to ensure that referenced tables are not dropped or modified in incompatible ways while a command runs. For applications that cannot adapt easily to MVCC behavior, you can use the `LOCK` command to acquire explicit locks. However, proper use of MVCC generally provides better performance.

|Lock Mode|Associated SQL Commands|Conflicts With|
|---------|-----------------------|--------------|
|ACCESS SHARE|`SELECT`|ACCESS EXCLUSIVE|
|ROW SHARE|`SELECT...FOR lock_strength`|EXCLUSIVE, ACCESS EXCLUSIVE|
|ROW EXCLUSIVE|`INSERT`, `COPY`|SHARE, SHARE ROW EXCLUSIVE, EXCLUSIVE, ACCESS EXCLUSIVE|
|SHARE UPDATE EXCLUSIVE|`ANALYZE`|SHARE UPDATE EXCLUSIVE, SHARE, EXCLUSIVE, ACCESS EXCLUSIVE|
|SHARE|`CREATE INDEX`|ROW EXCLUSIVE, SHARE UPDATE EXCLUSIVE, SHARE ROW EXCLUSIVE, EXCLUSIVE, ACCESS EXCLUSIVE|
|SHARE ROW EXCLUSIVE| |ROW EXCLUSIVE, SHARE UPDATE EXCLUSIVE, SHARE, SHARE ROW EXCLUSIVE, EXCLUSIVE, ACCESS EXCLUSIVE|
|EXCLUSIVE|`DELETE`, `UPDATE`, `SELECT...FOR lock_strength`, `REFRESH MATERIALIZED VIEW CONCURRENTLY`|ROW SHARE, ROW EXCLUSIVE, SHARE UPDATE EXCLUSIVE, SHARE, SHARE ROW EXCLUSIVE, EXCLUSIVE, ACCESS EXCLUSIVE|
|ACCESS EXCLUSIVE|`ALTER TABLE`, `DROP TABLE`, `TRUNCATE`, `REINDEX`, `CLUSTER`, `REFRESH MATERIALIZED VIEW` (without `CONCURRENTLY`), `VACUUM FULL`|ACCESS SHARE, ROW SHARE, ROW EXCLUSIVE, SHARE UPDATE EXCLUSIVE, SHARE, SHARE ROW EXCLUSIVE, EXCLUSIVE, ACCESS EXCLUSIVE|

:::info
By default, the Global Deadlock Detector is deactivated, and Cloudberry Database acquires the more restrictive `EXCLUSIVE` lock (rather than `ROW EXCLUSIVE` in PostgreSQL) for `UPDATE` and `DELETE`.

When the Global Deadlock Detector is enabled:

- The lock mode for some `DELETE` and `UPDATE` operations on heap tables is `ROW EXCLUSIVE`. See [Global Deadlock Detector](#global-deadlock-detector).
:::

## Global Deadlock Detector

The Cloudberry Database Global Deadlock Detector background worker process collects lock information on all segments and uses a directed algorithm to detect the existence of local and global deadlocks. This algorithm allows Cloudberry Database to relax concurrent update and delete restrictions on heap tables. (Cloudberry Database still employs table-level locking on AO/CO tables, restricting concurrent `UPDATE`, `DELETE`, and `SELECT...FOR lock_strength` operations.)

By default, the Global Deadlock Detector is deactivated and Cloudberry Database runs the concurrent `UPDATE` and `DELETE` operations on a heap table serially. You can activate these concurrent updates and have the Global Deadlock Detector determine when a deadlock exists by setting the parameter `gp_enable_global_deadlock_detector` in the `postgresql.conf` configuration file to `on` and then restarting the database.

When the Global Deadlock Detector is enabled, the background worker process is automatically started on the coordinator host when you start Cloudberry Database. You configure the interval at which the Global Deadlock Detector collects and analyzes lock waiting data via the `gp_global_deadlock_detector_period` server configuration parameter in the `postgresql.conf` configuration file.

If the Global Deadlock Detector determines that deadlock exists, it breaks the deadlock by cancelling one or more backend processes associated with the youngest transaction(s) involved.

When the Global Deadlock Detector determines a deadlock exists for the following types of transactions, only one of the transactions will succeed. The other transactions will fail with an error indicating that concurrent updates to the same row is not allowed.

- Concurrent transactions on the same row of a heap table where the first transaction is an update operation and a later transaction runs an update or delete and the query plan contains a motion operator.
- Concurrent update transactions on the same distribution key of a heap table that are run by the Postgres-based planner.
- Concurrent update transactions on the same row of a hash table that are run by the GPORCA optimizer.

:::tip
Cloudberry Database uses the interval specified in the `deadlock_timeout` server configuration parameter for local deadlock detection. Because the local and global deadlock detection algorithms differ, the cancelled process(es) may differ depending upon which detector (local or global) Cloudberry Database triggers first.
:::

:::tip
If the `lock_timeout` server configuration parameter is turned on and set to a value smaller than `deadlock_timeout` and `gp_global_deadlock_detector_period`, Cloudberry Database will cancel a statement before it would ever trigger a deadlock check in that session.
:::

To view lock waiting information for all segments, run the `gp_dist_wait_status()` user-defined function. You can use the output of this function to determine which transactions are waiting on locks, which transactions are holding locks, the lock types and mode, the waiter and holder session identifiers, and which segments are running the transactions. Sample output of the `gp_dist_wait_status()` function follows:

```sql
SELECT * FROM pg_catalog.gp_dist_wait_status();

-[ RECORD 1 ]----+--------------
segid            | 0
waiter_dxid      | 11
holder_dxid      | 12
holdTillEndXact  | t
waiter_lpid      | 31249
holder_lpid      | 31458
waiter_lockmode  | ShareLock
waiter_locktype  | transactionid
waiter_sessionid | 8
holder_sessionid | 9
-[ RECORD 2 ]----+--------------
segid            | 1
waiter_dxid      | 12
holder_dxid      | 11
holdTillEndXact  | t
waiter_lpid      | 31467
holder_lpid      | 31250
waiter_lockmode  | ShareLock
waiter_locktype  | transactionid
waiter_sessionid | 9
holder_sessionid | 8
```

When it cancels a transaction to break a deadlock, the Global Deadlock Detector reports the following error message:

```
ERROR:  canceling statement due to user request: "cancelled by global deadlock detector"
```

### Global Deadlock Detector UPDATE and DELETE compatibility

The Global Deadlock Detector can manage concurrent updates for these types of `UPDATE` and `DELETE` commands on heap tables:

- Simple `UPDATE` of a single table. Update a non-distribution key with the Postgres-based planner. The command does not contain a `FROM` clause, or a sub-query in the `WHERE` clause.

    ```sql
    UPDATE t SET c2 = c2 + 1 WHERE c1 > 10;
    ```

-   Simple `DELETE` of a single table. The command does not contain a sub-query in the `FROM` or `WHERE` clauses.

    ```sql
    DELETE FROM t WHERE c1 > 10;
    ```

- Split `UPDATE`. For the Postgres-based planner, the `UPDATE` command updates a distribution key.

    ```sql
    UPDATE t SET c = c + 1; -- c is a distribution key
    ```

    For GPORCA, the `UPDATE` command updates a distribution key or references a distribution key.

    ```sql
    UPDATE t SET b = b + 1 WHERE c = 10; -- c is a distribution key
    ```

- Complex `UPDATE`. The `UPDATE` command includes multiple table joins.

    ```sql
    UPDATE t1 SET c = t1.c+1 FROM t2 WHERE t1.c = t2.c;
    ```

    Or the command contains a sub-query in the `WHERE` clause.

    ```sql
    UPDATE t SET c = c + 1 WHERE c > ALL(SELECT * FROM t1);
    ```

- Complex `DELETE`. A complex `DELETE` command is similar to a complex `UPDATE`, and involves multiple table joins or a sub-query.

    ```sql
    DELETE FROM t USING t1 WHERE t.c > t1.c;
    ```

The following table shows the concurrent `UPDATE` or `DELETE` commands that are managed by the Global Deadlock Detector. For example, concurrent simple `UPDATE` commands on the same table row are managed by the Global Deadlock Detector. For a concurrent complex `UPDATE` and a simple `UPDATE`, only one `UPDATE` is performed, and an error is returned for the other `UPDATE`.

|Command|Simple `UPDATE`|Simple `DELETE`|Split `UPDATE`|Complex `UPDATE`|Complex `DELETE`|
|-------|---------------|---------------|--------------|----------------|----------------|
|Simple `UPDATE`|YES|YES|NO|NO|NO|
|Simple `DELETE`|YES|YES|NO|YES|YES|
|Split `UPDATE`|NO|NO|NO|NO|NO|
|Complex `UPDATE`|NO|YES|NO|NO|NO|
|Complex `DELETE`|NO|YES|NO|NO|YES|

## See also

- [Work with Transactions](/docs/work-with-transactions.md)
- [Insert, Update, and Delete Rows](/docs/insert-update-delete-rows.md)