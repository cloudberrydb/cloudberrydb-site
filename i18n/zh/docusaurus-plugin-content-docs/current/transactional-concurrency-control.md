---
title: 事务中的并发控制
---

# 事务中的并发控制

本文档介绍 Cloudberry Database 中的事务并发控制，包括：

- [多版本并发控制机制](#多版本并发控制机制)
- [锁模式](#锁模式)
- [全局死锁检测器](#全局死锁检测器)

## 多版本并发控制机制

Cloudberry Database 和 PostgreSQL 不使用锁机制来进行事务并发控制，而是使用多版本并发控制（MVCC）机制来维护数据一致性。MVCC 确保每个数据库会话的事务隔离，使得每个查询事务都能看到一个一致的数据快照。这保证了事务观察到的数据是一致的，不受其他并发事务的影响。

然而，事务可见的具体数据变化受隔离级别的影响。默认的隔离级别是“已提交读”（`READ COMMITTED`），这意味着事务可以观察到其他已提交事务所做的数据变化。如果将隔离级别设置为“可重复读”（`REPEATABLE READ`），那么该事务中的查询将观察到事务开始时的数据状态，并且不会看到其他事务在此期间所做的更改。为了指定事务的隔离级别，你可以使用语句 `BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ` 来以“可重复读”隔离级别启动事务。

由于 MVCC 不使用显式锁进行并发控制，因此最大限度减少了锁争用，Cloudberry Database 在多用户环境中保持了合理的性能。用于查询（读取）数据的锁不会与用于写入数据的锁发生冲突。

## 锁模式

Cloudberry Database 提供多种锁模式来控制对表数据的并发访问。大多数 Cloudberry Database 的 SQL 命令会自动获取适当的锁，以确保在命令执行期间，被引用的表不会被删除或被以不兼容的方式修改。对于那些难以适应 MVCC 行为的应用程序，你可以使用 `LOCK` 命令来获取显式锁。然而，通常情况下，正确使用 MVCC 能够提供更好的性能。

|锁模式|相关 SQL 命令|与之冲突的其他锁模式|
|---------|-----------------------|--------------|
|ACCESS SHARE|`SELECT`|ACCESS EXCLUSIVE|
|ROW SHARE|`SELECT...FOR lock_strength`|EXCLUSIVE, ACCESS EXCLUSIVE|
|ROW EXCLUSIVE|`INSERT`, `COPY`|SHARE, SHARE ROW EXCLUSIVE, EXCLUSIVE, ACCESS EXCLUSIVE|
|SHARE UPDATE EXCLUSIVE|`ANALYZE`|SHARE UPDATE EXCLUSIVE, SHARE, EXCLUSIVE, ACCESS EXCLUSIVE|
|SHARE|`CREATE INDEX`|ROW EXCLUSIVE, SHARE UPDATE EXCLUSIVE, SHARE ROW EXCLUSIVE, EXCLUSIVE, ACCESS EXCLUSIVE|
|SHARE ROW EXCLUSIVE| |ROW EXCLUSIVE, SHARE UPDATE EXCLUSIVE, SHARE, SHARE ROW EXCLUSIVE, EXCLUSIVE, ACCESS EXCLUSIVE|
|EXCLUSIVE|`DELETE`, `UPDATE`, `SELECT...FOR lock_strength`, `REFRESH MATERIALIZED VIEW CONCURRENTLY`|ROW SHARE, ROW EXCLUSIVE, SHARE UPDATE EXCLUSIVE, SHARE, SHARE ROW EXCLUSIVE, EXCLUSIVE, ACCESS EXCLUSIVE|
|ACCESS EXCLUSIVE|`ALTER TABLE`, `DROP TABLE`, `TRUNCATE`, `REINDEX`, `CLUSTER`, `REFRESH MATERIALIZED VIEW`（不带 `CONCURRENTLY`）, `VACUUM FULL`|ACCESS SHARE, ROW SHARE, ROW EXCLUSIVE, SHARE UPDATE EXCLUSIVE, SHARE, SHARE ROW EXCLUSIVE, EXCLUSIVE, ACCESS EXCLUSIVE|

:::info 注意
全局死锁检测器 (Global Deadlock Detector) 是默认关闭的。Cloudberry Database 在执行 `UPDATE` 和 `DELETE` 操作时会获取更为严格的 `EXCLUSIVE`（排他锁），而不是 PostgreSQL 中的 `ROW EXCLUSIVE`（行排他锁）。

当全局死锁检测器开启后：

- 堆表上某些 `DELETE` 和 `UPDATE` 操作的锁模式将是 `ROW EXCLUSIVE`。详见[全局死锁检测器](#全局死锁检测)。
:::

## 全局死锁检测器

Cloudberry Database 的全局死锁检测器 (Global Deadlock Detector) 后台工作进程会收集所有 Segment 上的锁信息，并使用一种有向算法来检测本地和全局死锁是否存在。这种算法让 Cloudberry Database 放宽了对堆表上并发更新和删除操作的限制。尽管如此，Cloudberry Database 在 AO/CO 表上仍采用表级锁定，限制并发的 `UPDATE`、`DELETE` 和 `SELECT...FOR lock_strength` 操作。

默认情况下，全局死锁检测器是关闭的。在 Cloudberry Database 中，堆表上的并发 `UPDATE` 和 `DELETE` 操作会串行运行。若要激活这些并发更新并让全局死锁检测器决定何时存在死锁，你可以在 `postgresql.conf` 配置文件中设置参数 `gp_enable_global_deadlock_detector` 为 `on`，并重启数据库。

当全局死锁检测器启用时，后台工作进程会在 Coordinator 主机上自动启动。你可以通过在 `postgresql.conf` 配置文件中的 `gp_global_deadlock_detector_period` 服务器配置参数来配置全局死锁检测器收集和分析锁等待数据的间隔。

如果全局死锁检测器确定存在死锁，它会采取措施打破死锁，具体做法是取消相关最近事务的一个或多个后台进程。

当全局死锁检测器发现以下类型的事务存在死锁时，其中只有一个事务会成功。其他事务会因为不允许对同一行进行并发更新而失败，并显示相应的错误信息。

- 在堆表上，针对同一行的并发事务，如果第一个事务是更新操作，而后续的事务进行更新或删除，并且查询计划中包含 motion 操作符。
- 基于 Postgres 优化器，针对堆表上同一分布键的并发更新事务。
- 基于 GPORCA 优化器，针对哈希表上同一行的并发更新事务。

:::tip 提示
Cloudberry Database 使用服务器配置参数 `deadlock_timeout` 所指定的间隔来进行本地死锁检测。由于本地和全局死锁检测算法不同，根据哪个检测器（本地或全局）首先触发，被取消的进程可能会有所不同。
:::

:::tip 提示
如果启用了 `lock_timeout` 服务器配置参数，并将其设置为小于 `deadlock_timeout` 和 `gp_global_deadlock_detector_period` 的值，Cloudberry Database 将在会话中触发死锁检查之前取消一个语句。
:::

若要查看所有 Segment 的等锁信息，请执行用户定义函数 `gp_dist_wait_status()`。通过函数的输出，可以确定哪些事务正在等锁，哪些事务持有锁，锁的类型和模式，等待者和持有者的会话标识符，以及哪些 Segment 正在运行事务。以下是一个 `gp_dist_wait_status()` 函数的示例输出：

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

当全局死锁检测器取消了一个事务以打破死锁时，会报告以下错误信息：

```
ERROR: canceling statement due to user request: "cancelled by global deadlock detector"
```

### 全局死锁检测器对并发 `UPDATE` 和 `DELETE` 操作的管理

对于堆表，全局死锁检测器可以管理以下类型的 `UPDATE` 和 `DELETE` 并发操作命令：

- 简单的单表 `UPDATE`（更新）。使用基于 Postgres 优化器更新非分布键。命令不包含 `FROM` 子句，也不在 `WHERE` 子句中包含子查询。

    ```sql
    UPDATE t SET c2 = c2 + 1 WHERE c1 > 10;
    ```

- 简单的单表 `DELETE`（删除）。`FROM` 或 `WHERE` 子句中不包含子查询。

    ```sql
    DELETE FROM t WHERE c1 > 10;
    ```

- 拆分 `UPDATE`。如果使用基于 Postgres 的优化器，`UPDATE` 命令更新一个分布键。

    ```sql
    UPDATE t SET c = c + 1; -- c 是一个分布键
    ```

    如果使用 GPORCA 优化器，`UPDATE` 命令则更新一个分布键或引用一个分布键。

    ```sql
    UPDATE t SET b = b + 1 WHERE c = 10; -- c 是一个分布键
    ```

- 复杂 `UPDATE`，包括多表连接的 `UPDATE` 命令。

    ```sql
    UPDATE t1 SET c = t1.c+1 FROM t2 WHERE t1.c = t2.c;
    ```

    或者命令在 `WHERE` 子句中包含子查询。

    ```sql
    UPDATE t SET c = c + 1 WHERE c > ALL(SELECT * FROM t1);
    ```

- 复杂 `DELETE` 操作，类似于复杂的 `UPDATE` 操作，涉及多表连接或子查询。

    ```sql
    DELETE FROM t USING t1 WHERE t.c > t1.c;
    ```

下表列举了全局死锁检测器所管理的并发 `UPDATE` 和 `DELETE` 命令。这些命令的例子包括：

- 同一表行上的并发简单 `UPDATE` 命令，由全局死锁检测器进行管理。
- 并发的复杂 `UPDATE` 和简单 `UPDATE` 命令，其中只有一个 `UPDATE` 会被执行，而另一个 `UPDATE` 会返回错误。

:::tip 提示
在下面表格中，`YES` 表示可并发执行，`NO` 表示不可并发执行。
:::

|命令|简单 `UPDATE`|简单 `DELETE`|拆分 `UPDATE`|复杂 `UPDATE`|复杂 `DELETE`|
|-------|---------------|---------------|--------------|----------------|----------------|
|简单 `UPDATE`|YES|YES|NO|NO|NO|
|简单 `DELETE`|YES|YES|NO|YES|YES|
|拆分 `UPDATE`|NO|NO|NO|NO|NO|
|复杂 `UPDATE`|NO|YES|NO|NO|NO|
|复杂 `DELETE`|NO|YES|NO|NO|YES|
