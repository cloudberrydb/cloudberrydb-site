---
title: 1.5.0
---

# Cloudberry Database v1.5.0 发版说明

版本号：v1.5.0

Cloudberry Database v1.5.0 新增了若干功能，包含了若干产品性能/稳定性优化，修复了若干错误 (bug)。

快速试用：[v1.5.0](https://github.com/cloudberrydb/cloudberrydb/releases/tag/1.5.0)

## 新功能

<table>
<thead>
  <tr>
    <th>分类</th>
    <th>功能</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td rowspan="4">查询处理</td>
    <td>支持并行创建 AO/AOCO 表和并行刷新物化视图</td>
  </tr>
  <tr>
    <td>支持自动使用物化视图进行查询优化</td>
  </tr>
  <tr>
    <td>支持部署单计算节点的集群</td>
  </tr>
  <tr>
    <td>支持使用命令行“一键”部署集群</td>
  </tr>
  <tr>
    <td rowspan="2">存储</td>
    <td>支持增量物化视图</td>
  </tr>
  <tr>
    <td>支持在 AO 表上使用唯一索引</td>
  </tr>
  <tr>
    <td>安全</td>
    <td>支持登录错误输入密码次数检查</td>
  </tr>
</tbody>
</table>

各个新功能的详细说明如下：

### 查询处理

- **支持并行创建 AO/AOCO 表和并行刷新物化视图。**

    支持使用 `CREATE TABLE AS` 语句并行创建 Append-Optimized (AO) 表和 Append-Optimized Column Oriented (AOCO) 表，同时支持并行刷新基于该表的物化视图，从而加速建表和物化视图刷新。

    详情参见文档[并行创建 AO/AOCO 表与刷新物化视图](/i18n/zh/docusaurus-plugin-content-docs/current/parallel-create-ao-refresh-mv.md)。

- **支持自动使用物化视图进行查询优化**，即在查询规划阶段自动使用物化视图来计算部分或全部查询 (AQUMV)。这一功能使用场景：

    - 大数据量的聚合查询：对于需要从数百万条记录中进行聚合的查询，AQUMV 能显著减少查询时间。
    - 频繁更新的大表：在数据频繁更新的环境中，使用 IMV 可以确保查询结果的实时性和准确性。

    详情参见文档[使用自动物化视图进行查询优化](/i18n/zh/docusaurus-plugin-content-docs/current/use-auto-materialized-view-to-answer-queries.md)。

### 集群管理

- **支持以单计算节点部署集群。**

    在 v1.5.0 以前，用户部署一套 Cloudberry Database 集群时，至少需要部署一个 Coordinator 节点和一个 Segment 节点，还需要指定繁多的配置信息和启动参数，这一过程相对复杂耗时。

    从 v1.5.0 开始，用户可以像部署 PostgreSQL 一样部署单计算节点的 Cloudberry Database 集群，集群仅包含一个 Coordinator 节点，无需指定繁多的配置参数，也无需预分配多个节点的计算资源。

    用户只需使用脚本工具 `gpdemo` 即可快速部署一套单节点的 Cloudberry Database 集群。详情参见文档[部署单计算节点的 Cloudberry Database 集群](/i18n/zh/docusaurus-plugin-content-docs/current/deploy-cbdb-with-single-node.md)。

- **支持使用命令行工具“一键”部署集群。**

    在 v1.5.0 以前，如果用户想在单节点上部署带有 Segment 的小型集群用于演示，需要花费时间编写配置文件和参数。自 v1.5.0 起，用户只需要通过内置的 `gpdemo` 脚本，使用一条命令就能快速部署指定 Segment 数的 Cloudberry Database 集群。即：

    ```bash
    gpdemo
    ```

    详情参见文档 [gpdemo 快捷部署使用文档](/i18n/zh/docusaurus-plugin-content-docs/current/sys-utilities/gpdemo.md)。

### 存储

- **支持增量物化视图。**

    增量物化视图是物化视图的一种特殊形式。当数据在基础表中发生变化时（例如插入、更新、删除操作），增量物化视图不需要重新计算整个视图中的所有数据。相反，它只更新那些自上次刷新以来发生变化的部分。这样可以节省大量的计算资源和时间，显著提高性能，尤其是在处理大型数据集时。

    自 v1.5.0 起，如果查询时有中间结果集需要加速，或者在读多写少的场景下，用户可以使用增量物化视图来加速查询，详情参见文档[增量物化视图说明文档](/i18n/zh/docusaurus-plugin-content-docs/current/use-incremental-materialized-view.md)。

- **在 AO 表上使用唯一索引。**

    自 v1.5.0 起，你可以在 Cloudberry Database 的 Append-Optimized (AO) 或 Append-Optimized Column Store (AOCS) 表上添加唯一索引。有了唯一索引，Cloudberry Database 会在将数据插入到 AO 表时，强制检查唯一性约束，从而保证数据的唯一性，同时能够与优化器一起优化特定的查询，从而提高数据库的查询性能。但这也带来的一定的开销用于维护唯一索引，尤其是在插入数据时。

    详情参见文档[在 AO 表上使用唯一索引](/i18n/zh/docusaurus-plugin-content-docs/current/use-unique-index-on-ao-tables.md)。

### 安全

- **支持创建和绑定数据库的用户密码策略配置。**

    Profile，即密码策略配置，用于控制数据库中用户的密码安全策略。Profile 定义了用户管理和重复使用密码的规则。通过配置 Profile，数据库管理员可以使用 SQL 语句强制添加一些约束，例如在一定次数的登录失败后锁定账户，或者控制密码重复使用次数。

    自 v1.5.0 起，Cloudberry Database  支持通过 SQL 语句创建 Profile，并将 Profile 绑定到一个或多个用户中，从而控制数据库用户的密码安全策略。

    详情参见文档[在 Cloudberry Database 中配置密码策略](/i18n/zh/docusaurus-plugin-content-docs/current/set-password-profile.md)。

## 变更说明

### SQL 语法变更说明

`CREATE MATERIALIZED VIEW` 新支持 `INCREMENTAL` 选项。你可以使用 SQL 命令 `CREATE INCREMENTAL MATERIALIZED VIEW` 来创建增量物化视图。完整的语法支持如下：

```sql
CREATE [INCREMENTAL] MATERIALIZED VIEW [ IF NOT EXISTS ] table_name
    [ (column_name [, ...] ) ]
    [ USING method ]
    [ WITH ( storage_parameter [= value] [, ... ] ) ]
    [ TABLESPACE tablespace_name ]
    AS query
    [ WITH [ NO ] DATA ]
```

### 功能变更说明

无

### 参数变更说明

无

## Bug 修复

- 修复了 AOCO 表内存越界的问题。该 Bug 导致的报错如下所示：

    ```sql
    SET default_table_access_method=ao_column;
    CREATE temp TABLE nocolumns();

    SELECT EXISTS(SELECT * FROM nocolumns);

    WARNING:  detected write past chunk end in ExecutorState 0x8f79b78  (seg0 slice1 127.0.1.1:7002 pid=16215)
    ```

- 修复了使用 `EXPLAIN` 查看查询计划时，输出结果中的 `operatorMem` 对齐问题，修复前显示如下：

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

- 修复了在特定条件下导致快照功能内存异常的问题，这个问题可能会在某些情况下使事务处理过程中发生 core dump。
- 改进了并行扫描操作时，并行哈希连接中内部表格大小的估算精度。
- 并行扫描时新增对 Semi HashJoin 类型的支持。
- 改进了 `NOT IN` 语句的处理逻辑，现在它可以正确地处理包含 `NULL` 值的情况。例如，在执行像 `SELECT c1 FROM t1_lasj WHERE c1 NOT IN (SELECT c1n FROM t2_lasj_has_null WHERE c1n IS NULL OR c1n IS NULL);` 这样的查询时，将得到正确的结果。
- 修复了在 macOS 上编译运行遇到的问题。
- 修复了 `CREATE EXTENSION` 时，用户的 `search_path` 发生变更的问题。
