---
title: 事务操作
---

# 在 Cloudberry Database 中使用事务

SQL 事务允许你将多个 SQL 语句捆绑在一起，形成一个全部成功或全部失败的操作。对于 Cloudberry Database，其 SQL 事务命令包括：

- `BEGIN` 或 `START TRANSACTION`：开始一个事务块。
- `END` 或 `COMMIT`：提交事务的结果。
- `ROLLBACK`：放弃事务，不做任何更改。
- `SAVEPOINT`：在事务中标记一个位置，允许部分回滚。你可以回滚在保存点之后运行的命令，同时保持在保存点之前运行的命令。
- `ROLLBACK TO SAVEPOINT`：将事务回滚到保存点。
- `RELEASE SAVEPOINT`：在事务中销毁一个保存点。

## 事务隔离级别

Cloudberry Database 支持以下标准 SQL 事务隔离级别：

- `READ UNCOMMITTED`（读未提交）和 `READ COMMITTED`（读已提交）的行为与标准的 `READ COMMITTED` 相同。
- `REPEATABLE READ`（可重复读）和 `SERIALIZABLE`（可序列化）的行为与 `REPEATABLE READ` 相同。

以下内容描述了 Cloudberry Database 事务隔离级别的行为。

### 未提交读与已提交读

在 Cloudberry Database 中，任何执行中的命令都无法查看其他并行事务中的未提交更新，因此 `READ UNCOMMITTED` 模式与 `READ COMMITTED` 模式的效果是相同的。`READ COMMITTED` 模式提供了一种快速且简易的方式，能够实现事务的部分隔离效果。在这种模式下，`SELECT`、`UPDATE` 和 `DELETE` 语句都是在查询开始时基于数据库当前的快照来执行的。

具体来说，一个 `SELECT` 查询会：

- 查看查询开始前已经提交的数据。
- 看到在当前事务内执行的更新。
- 不会看到当前事务外未提交的数据。
- 如果在查询初始读取后，其他并行事务提交了变更，这时可能会看到这些变更。

在同一事务内连续执行的多个 `SELECT` 查询可能会看到不同的数据，这是因为在这些查询之间，可能有其他并行事务提交了变更。而 `UPDATE` 和 `DELETE` 命令则只会找到在它们开始执行前就已经提交的数据行。

在 `READ COMMITTED` 事务隔离模式下，允许并行事务在 `UPDATE` 或 `DELETE` 执行前对数据行进行修改或加锁。然而，对于那些执行复杂查询和更新，同时又需要保持数据库视图一致性的应用程序来说，`READ COMMITTED` 的事务隔离水平可能不足以满足需求。

#### 可重复读与序列化隔离级别

在 SQL 标准中，`SERIALIZABLE` 事务隔离级别旨在确保，即便事务是并发运行的，其产生的结果也应当与事务依次运行时的结果相同。在 Cloudberry Database 中，当指定 `SERIALIZABLE` 隔离级别时，实际上会使用 `REPEATABLE READ` 隔离级别。`REPEATABLE READ` 隔离级别可以在无需使用复杂锁定机制的情况下，防止脏读、不可重复读和幻读现象，但这种模式并不能检测到所有在并发事务执行期间可能出现的序列化冲突。因此，你需要仔细检查并发事务，以识别哪些冲突是仅靠禁止对同一数据并发更新所无法预防的。为避免这类冲突，可以采用显式表锁或者更新某个特设的代表冲突的虚拟行。

在 `REPEATABLE READ` 隔离级别下，`SELECT` 查询将：

- 基于事务开始时刻（而非事务内当前查询开始时）的数据快照进行查看。
- 只能看到查询开始前已经提交的数据。
- 能看到在当前事务内进行的更新。
- 无法看到事务外未提交的数据。
- 不会看到其他并发事务所做的更改。
- 在同一事务中连续执行的 `SELECT` 命令总是看到一致的数据。
- `UPDATE`、`DELETE`、`SELECT FOR UPDATE` 和 `SELECT FOR SHARE` 命令仅能找到在命令开始前已经提交的行。如果有并发事务对目标行进行了更新、删除或加锁，`REPEATABLE READ` 事务将等待该并发事务提交或撤销更改。若并发事务提交了更改，`REPEATABLE READ` 事务将选择回滚；若并发事务撤销了更改，`REPEATABLE READ` 事务则可以提交自己的更改。

在 Cloudberry Database 中，默认的事务隔离级别为 `READ COMMITTED`。若需更改事务的隔离级别，可在开始事务时声明隔离级别，或在事务已开始后使用 `SET TRANSACTION` 命令进行设置。

## 另请参阅

- [事务并发控制](/i18n/zh/docusaurus-plugin-content-docs/current/transactional-concurrency-control.md)
- [插入、更新和删除行](/i18n/zh/docusaurus-plugin-content-docs/current/insert-update-delete-rows.md)

