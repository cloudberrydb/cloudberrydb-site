---
title: SET TRANSACTION
---

# SET TRANSACTION

设置当前事务的特性。

## 语法概要

```sql
SET TRANSACTION <transaction_mode> [, ...]
SET TRANSACTION SNAPSHOT <snapshot_id>
SET SESSION CHARACTERISTICS AS TRANSACTION <transaction_mode> [, ...] 
     [READ ONLY | READ WRITE]
     [NOT] DEFERRABLE

-- <transaction_mode> 是以下之一：

    ISOLATION LEVEL {SERIALIZABLE | REPEATABLE READ | READ COMMITTED | READ UNCOMMITTED}
    READ WRITE | READ ONLY
    [NOT] DEFERRABLE

-- <snapshot_id> 是现有事务的快照标识符，你希望此事务使用该快照运行。
```

## 描述

`SET TRANSACTION` 命令用于设置当前事务的属性。其设置不会对后续事务产生任何影响。而 `SET SESSION CHARACTERISTICS` 则用于为会话中的后续事务设定默认的事务属性。这些默认设置可以通过 `SET TRANSACTION` 对某个具体事务进行单独覆盖。

事务的可设置属性包括事务的隔离等级、访问模式（读/写或仅读）以及是否可延迟。另外，虽然可以为当前事务选择一个快照，但这不可作为会话的默认设置。

:::info
需要事务可序列化时，才能将其设定为可延迟。由于 Cloudberry Database 不支持可序列化的事务，因此使用 `DEFERRABLE` 选项并不会产生任何效果。
:::

一个事务的隔离级别决定了在其他事务并发运行时，该事务能看到的数据。

- **READ COMMITTED**：一个语句只能看到在它开始之前提交的行。这是默认行为。
- **REPEATABLE READ**：当前事务中的所有语句只能看到在事务中执行的第一个查询或数据修改语句之前提交的行。

SQL 标准定义了另外两个隔离级别，`READ UNCOMMITTED` 和 `SERIALIZABLE`。在 Cloudberry Database 中，`READ UNCOMMITTED` 被视为 `READ COMMITTED`。如果你指定了 `SERIALIZABLE`，Cloudberry Database 会回退到 `REPEATABLE READ`。

事务隔离级别在事务的第一个查询或数据修改语句（`SELECT`、`INSERT`、`DELETE`、`UPDATE`、`FETCH` 或 `COPY`）执行后不能再更改。

事务访问模式决定了事务是读/写还是仅读。读/写是默认行为。当一个事务是只读时，这些 SQL 命令是不允许的：

- 如果要写入的表不是临时表，不允许执行 `INSERT`、`UPDATE`、`DELETE` 和 `COPY FROM`。
- 不允许所有的 `CREATE`、`ALTER` 和 `DROP` 命令。
- 不允许 `COMMENT`、`GRANT`、`REVOKE`、`TRUNCATE`。
- 如果 `EXPLAIN ANALYZE` 和 `EXECUTE` 要运行的命令在上述列表中，则不允许 `EXPLAIN ANALYZE` 和 `EXECUTE`。这是一个高级别的只读概念，它并不阻止所有对磁盘的写入。

`DEFERRABLE` 事务属性仅在事务同时设置为 `SERIALIZABLE` 和 `READ ONLY` 时才有效。当事务配置了这些属性后，在最初获取快照时可能会暂时阻塞，但随后能够继续执行，既避免了 `SERIALIZABLE` 事务常见的开销，也不会因为序列化错误而被取消或引起问题。这种模式特别适合执行长时间的报表生成或数据备份。由于 Cloudberry Database 不支持序列化事务，`DEFERRABLE` 属性在 Cloudberry Database 中不会产生任何效果。

`SET TRANSACTION SNAPSHOT` 命令允许新事务采用与现有事务相同的快照来执行。已有事务必须已通过 `pg_export_snapshot()` 函数导出其快照。此函数返回一个快照标识符，该标识符需传递给 `SET TRANSACTION SNAPSHOT` 来指定将导入哪个快照。标识符必须以字符串字面量形式指定，例如 `'000003A1-1'`。`SET TRANSACTION SNAPSHOT` 必须在事务开始时、执行第一个查询或数据修改指令（如 `SELECT`、`INSERT`、`DELETE`、`UPDATE`、`FETCH` 或 `COPY`）之前调用。同时，事务应已设置为 `SERIALIZABLE` 或 `REPEATABLE READ` 隔离级别（否则，因为 `READ COMMITTED` 模式会为每个指令取得新快照，导致快照立即失效）。如果导入快照的事务采用 `SERIALIZABLE` 隔离级别，则导出快照的事务也必须使用相同隔离级别。另外，非只读的序列化事务不能导入来自只读事务的快照。

## 注意事项

如果在执行 `SET TRANSACTION` 前没有先执行 [`START TRANSACTION`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/start-transaction.md) 或 [`BEGIN`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/begin.md)，Cloudberry Database 会发出警告，但不会产生其他影响。

可以通过在 `BEGIN` 或 `START TRANSACTION` 中指定所需的 `transaction_modes` 来省去 `SET TRANSACTION`。但该选项不适用于 `SET TRANSACTION SNAPSHOT`。

可以通过配置参数 `default_transaction_isolation`、`default_transaction_read_only` 和 `default_transaction_deferrable` 来设置或检查会话的默认事务模式。事实上，`SET SESSION CHARACTERISTICS` 只是使用 `SET` 设置这些变量的冗长等效方式。这意味着可以在配置文件中，通过 `ALTER DATABASE` 等方式设置默认值。

当前事务的模式也可以通过配置参数 `transaction_isolation`、`transaction_read_only` 和 `transaction_deferrable` 来设置或检查。设置这些参数的效果与对应的 `SET TRANSACTION` 选项相同，对其设置的时间限制也相同。然而，这些参数不能在配置文件中设置，也不能从除了实时 SQL 之外的任何来源设置。

## 示例

要使用与已有事务相同的快照开始一个新事务，首先需要从已有事务中导出快照。这将返回快照标识符，例如：

```sql
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;
SELECT pg_export_snapshot();
 pg_export_snapshot
---------------------
 00000003-0000001B-1
(1 row)
```

然后在新打开的事务开始时，使用 `SET TRANSACTION SNAPSHOT` 命令指定快照标识符：

```sql
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;
SET TRANSACTION SNAPSHOT '00000003-0000001B-1';
```

## 兼容性

除了 `DEFERRABLE` 事务模式和 `SET TRANSACTION SNAPSHOT` 外，`SET TRANSACTION` 命令在 SQL 标准中有定义。`DEFERRABLE` 事务模式和 `SET TRANSACTION SNAPSHOT` 形式是 Cloudberry Database 的扩展。

在 SQL 标准中，`SERIALIZABLE` 是默认的事务隔离级别。在 Cloudberry Database 中，默认的是 `READ COMMITTED`。由于缺乏谓词锁定，Cloudberry Database 不完全支持 `SERIALIZABLE` 级别，因此当指定 `SERIALIZABLE` 时，它会回退到 `REPEATABLE READ` 级别。本质上，谓词锁定系统通过限制写入内容来防止幻读，而 Cloudberry Database 中使用的多版本并发控制模型（MVCC）通过限制读取内容来防止幻读。

在 SQL 标准中，还有一个事务特性可以通过这些 `SET TRANSACTION` 命令来设置：诊断区域的大小。这个概念是特定于嵌入式 SQL 的，因此并未在 Cloudberry Database 服务器中实现。

SQL 标准要求在连续的 `transaction_modes` 之间使用逗号，但由于历史原因，Cloudberry Database 允许省略逗号。

## 另见

[`BEGIN`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/begin.md)
