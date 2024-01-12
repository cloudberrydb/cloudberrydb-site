---
title: 启动和停止数据库
---

# 启动和停止 Cloudberry Database

在 Cloudberry Database 数据库管理系统中，数据库服务器实例（包括 Coordinator 和所有 Segment）启停和运行在所有系统主机上，这样各实例能够协同工作，形成一个统一的数据库管理系统。

因为 Cloudberry Database 系统分布在多台机器上，所以 Cloudberry Database 系统启动和停止的过程与常规 PostgreSQL 数据库系统不同。

命令行工具 `gpstart` 和 `gpstop` 分别用于启动和停止 Cloudberry Database。它们位于 Coordinator 主机上的 `$GPHOME/bin` 目录中。

:::tip 提示
请勿使用 `kill` 命令来终止 Postgres 进程，因为使用 `kill -9` 或 `kill -11` 会损坏数据库并阻碍故障原因分析。要终止 Postgres 进程，请使用数据库函数 `pg_cancel_backend()`。
:::

## 启动 Cloudberry Database

要启动已初始化的 Cloudberry Database，在 Coordinator 实例上执行 `gpstart`。

如果数据库系统已通过 `gpinitsystem` 初始化并被 `gpstop` 停止，你可以通过 `gpstart` 来重启数据库。`gpstart` 的作用是启动 Cloudberry Database 集群中的所有 `postgres` 实例，从而完成整个数据库的启动。在启动过程中，`gpstart` 会协调和并行执行所有必要的步骤。

在 Coordinator 主机上执行 `gpstart` 来启动 Cloudberry Database：

```shell
$ gpstart
```

## 重启 Cloudberry Database

要重启 Cloudberry Database，请在 Coordinator 主机上执行带 `-r` 选项的 `gpstop` 命令：

```shell
$ gpstop -r
```

## 重新加载配置文件更改

你可以在不中断系统的情况下，重新加载 Cloudberry Database 配置文件的更改。

`gpstop` 支持在不中断服务的情况下，重新加载 `pg_hba.conf` 配置文件和 `postgresql.conf` 中的运行时参数。客户端在重新连接到数据库时，活动会话将应用配置文件中的更改。但是，许多服务器配置参数只在完整重启系统 (`gpstop -r`) 后才生效。

在不关闭 Cloudberry Database 系统的情况下，使用 `gpstop -u` 重新加载配置文件更改：

```shell
$ gpstop -u
```

## 在维护模式下启动 Coordinator

如果要执行维护或管理任务，又不想影响 Segment 上的数据，仅需启动 Coordinator 即可。例如，在维护模式下，你可以只连接到数据库的 Coordinator 实例，并编辑系统目录设置。

1. 在 `gpstart` 中使用 `-m` 选项，进入到维护模式：

    ```shell
    $ gpstart -m
    ```

2. 在维护模式下连接到 Coordinator 以进行 Catalog 维护。例如：

    ```shell
    $ PGOPTIONS='-c gp_role=utility' psql postgres
    ```

3. 完成维护任务后，在维护模式下停止 Coordinator。然后，在生产模式下重新启动 Coordinator。

    ```shell
    $ gpstop -m
    $ gpstart
    ```

    :::caution 警告
    不正确地使用维护模式可能导致系统状态不一致。建议此操作由技术支持来执行。
    :::

## 停止 Cloudberry Database

`gpstop` 在 Coordinator 主机上停止或重启 Cloudberry Database 系统。执行后，`gpstop` 会停止系统中的所有 `postgres` 进程，包括 Coordinator 和所有 Segment 实例。`gpstop` 默认使用多个并行工作线程来关闭组成 Cloudberry Database 集群的 Postgres 实例。要立即停止 Cloudberry Database，请使用快速模式。

:::tip 提示
不建议使用快速模式。此模式会停止所有数据库进程，使数据库服务器来不及完成事务处理，或来不及清理任何临时或进程中的工作文件。
:::

- 停止 Cloudberry Database：

    ```shell
    $ gpstop
    ```

- 在快速模式下停止 Cloudberry Database：

    ```shell
    $ gpstop -M fast
    ```

默认情况下，如果有客户端连接到数据库，则不允许关闭 Cloudberry Database。使用 `-M fast` 选项可以回滚所有正在进行的事务，并在关闭 Cloudberry Database 之前终止任何连接。

## 停止客户端进程

Cloudberry Database 为每个客户端连接启动一个新的后端进程。具有 `SUPERUSER` 权限的 Cloudberry Database 用户可以取消和终止这些客户端的后端进程。

通过 `pg_cancel_backend()` 函数取消后端进程，会结束正在排队或进行的客户端查询。通过 `pg_terminate_backend()` 函数终止后端进程，将终止与数据库的客户端连接。

`pg_cancel_backenda()` 函数有两个签名：

- `pg_cancel_backend( pid int4 )`
- `pg_cancel_backend( pid int4, msg text )`

`pg_terminate_backend()` 函数有两个相似的签名：

- `pg_terminate_backend( pid int4 )`
- `pg_terminate_backend( pid int4, msg text )`

如果你提供 `msg`，Cloudberry Database 会在返回给客户端的取消消息中包含 `msg` 文本。`msg` 限制为 128 字节，Cloudberry Database 会截断任何更长的内容。

`pg_cancel_backend()` 和 `pg_terminate_backend()` 函数如果执行成功，则返回 `true`，否则返回 `false`。

要取消或终止后端进程，必须先获得后端的进程 ID。你可以从 `pg_stat_activity` 视图的 `pid` 列获取进程 ID。例如，查看执行中和排队中所有查询对应的进程信息：

```sql
SELECT usename, pid, state, query, datname
     FROM pg_stat_activity;
```

部分查询输出示例：

```sql
usename |  pid     | state  |         query          | datname
_---------+-------------------+--------+------------------------+---------_
  sammy  |   31861  | idle   | SELECT * FROM testtbl; | testdb
  billy  |   31905  | active | SELECT * FROM topten;  | testdb
```

你可以通过查询输出来识别查询或客户端连接的进程 ID (pid)。

识别查询对应的进程 ID 后，你可以取消等待中的查询。例如，取消上述示例输出中识别的等待查询，并将 `Admin canceled long-running query.` 包含为返回给客户端的消息：

```bash
=# SELECT pg_cancel_backend(31905 ,'Admin canceled long-running query.');

ERROR:  canceling statement due to user request: "Admin canceled long-running query."
```
