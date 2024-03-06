---
title: 使用 gpfdist 加载数据
---

# 使用 `gpfdist` 将数据加载到 Cloudberry Database 中

要将数据从本地主机文件或通过内部网络访问的文件加载到 Cloudberry Database 中，你可以在 `CREATE EXTERNAL TABLE` 语句中使用 `gpfdist` 协议。`gpfdist` 是一个文件服务器实用程序，运行在 Cloudberry Database Coordinator 或备用 Coordinator 之外的主机上。`gpfdist` 从主机上的一个目录中为 Cloudberry Database Segment 提供文件服务。

使用 `gpfdist` 服务外部数据时，Cloudberry Database 系统中的所有 Segment 都可以并行读取或写入外部表数据。

支持加载的数据格式有：

- CSV 和 TXT
- `FORMAT` 子句支持的任何分隔文本格式

以下是使用 `gpfdist` 加载数据的一般步骤：

1. 在 Cloudberry Database 的 Coordinator 或备用 Coordinator 之外的主机上安装 gpfdist。请参见[安装 gpfdist](#第-1-步安装-gpfdist)。
2. 在主机上启动 gpfdist。请参见[启动和停止 gpfdist](#第-2-步启动和停止-gpfdist)。
3. 使用 `gpfdist` 协议创建外部表。请参见[使用 gpfdist 与外部表加载数据的示例](#第-3-步使用-gpfdist-与外部表加载数据)。

<details>
<summary>有关 gpfdist</summary>

## 关于 gpfdist

在使用 gpfdist 之前，你需要了解它的工作原理。本节概述了 gpfdist 的工作原理以及如何将它与外部表一起使用。

### 关于 gpfdist 和外部表

`gpfdist` 文件服务器实用程序位于 Cloudberry Database Coordinator 主机和每个 Segment 主机的 `$GPHOME/bin` 目录中。当你启动 `gpfdist` 实例时，你需要指定一个监听端口和一个包含要读取的文件或要写入的文件的目录。例如，以下命令在后台运行 `gpfdist`，监听端口 `8801`，并在 `/home/gpadmin/external_files` 目录中提供文件服务：

```shell
$ gpfdist -p 8801 -d /home/gpadmin/external_files &
```

`CREATE EXTERNAL TABLE` 命令中的 `LOCATION` 子句将外部表定义与一个或多个 `gpfdist` 实例连接起来。如果外部表是可读的，`gpfdist` 服务器会从指定目录中的文件中读取数据记录，将它们打包成一个块，并将块作为响应发送给 Cloudberry Database Segment。Segment 解压接收到的行，并根据外部表的分布策略分发行。如果外部表是可写表，Segment 会将行块发送给 `gpfdist`，并由 `gpfdist` 将它们写入外部文件。

外部数据文件可以包含 CSV 格式的行，或者 `CREATE EXTERNAL TABLE` 命令的 `FORMAT` 子句支持的任意分隔文本格式。

对于可读的外部表，`gpfdist` 会自动解压 `gzip`（`.gz`）和 `bzip2`（`.bz2`）文件。你可以使用通配符（`*`）或其他 C 风格的模式匹配来表示要读取的多个文件。外部文件相对于启动 `gpfdist` 实例时指定的目录。

### 关于 gpfdist 的设置和性能

你可以在多台主机上运行 `gpfdist` 实例，也可以在每台主机上运行多个 `gpfdist` 实例。这样你可以按需部署 `gpfdist` 服务器，以便利用所有可用的网络带宽和 Cloudberry Database 的并行性，从而获得快速的数据加载和卸载速率。

- 允许网络流量同时使用 ETL 主机上的所有网络接口。在 ETL 主机上为每个接口运行一个 gpfdist 实例，然后在外部表定义的 `LOCATION` 子句中声明每个 NIC 的主机名（请参见[示例 1 - 在单网卡机器上运行单个 gpfdist 实例](#示例-1---在单网卡机器上运行单个-gpfdist-实例)）。
- 在 ETL 主机上的多个 gpfdist 实例间均匀分配外部表数据。例如，在具有两个 NIC 的 ETL 系统上，运行两个 gpfdist 实例（每个 NIC 上一个）以优化数据加载性能，并在两个 gpfdist 服务器之间均匀分配外部表数据文件。

:::tip 提示
当你提交文件给 gpfdist 时，建议使用管道 (`|`) 分隔格式化文本。Cloudberry Database 会用单引号或双引号括起逗号分隔的文本字符串。gpfdist 必须删除引号以解析字符串。使用管道分隔格式化文本可以避免额外的步骤，并提高性能。
:::

### 控制 Segment 并行性

`gp_external_max_segs` 服务器配置参数控制可以同时访问单个 gpfdist 实例的 Segment 实例数量。默认值为 64。你可以设置 Segment 实例的数量，使一些 Segment 实例处理外部数据文件，而另一些执行其他数据库处理。你可以在 Coordinator 实例的 `postgresql.conf` 文件中设置此参数。

</details>

## 第 1 步：安装 gpfdist

gpfdist 安装在 Cloudberry Database Coordinator 主机的 `$GPHOME/bin` 目录中。请在 Cloudberry Database Coordinator 或备用 Coordinator 之外的机器上运行 gpfdist，例如专门用于 ETL 处理的机器。在 Coordinator 或备用 Coordinator 上运行 gpfdist 可能会对查询执行产生性能影响。

## 第 2 步：启动和停止 gpfdist

你可以在当前目录位置启动 gpfdist，也可以在任何你指定的目录中启动。默认端口是 `8080`。

对于当前目录中，输入：

```shell
gpfdist &
```

对于不同的目录，指定要提供文件的目录，以及可选的 HTTP 端口。

在后台启动 gpfdist 并将输出消息记录进日志文件：

```shell
$ gpfdist -d /var/load_files -p 8081 -l /home/`gpadmin`/log &
```

对于同一台 ETL 主机上的多个 gpfdist 实例，为每个实例使用不同的基础路径 (base directory) 和端口。例如：

```shell
$ gpfdist -d /var/load_files1 -p 8081 -l /home/`gpadmin`/log1 &
$ gpfdist -d /var/load_files2 -p 8082 -l /home/`gpadmin`/log2 &
```

日志的保存路径为 `/home/gpadmin/log`。

:::info 信息
停止在后台运行的 gpfdist：

首先找到其进程 ID：

```shell
$ ps -ef | grep gpfdist
```

然后终止进程，例如（`3457` 是此示例中的进程 ID）：

```shell
$ kill 3457
```
:::

## 第 3 步：使用 gpfdist 与外部表加载数据

以下示例展示了如何在创建外部表时使用 gpfdist 加载数据到 Cloudberry Database。

:::tip 注意
使用 IPv6 时，始终将数字 IP 地址括在方括号中。
:::

### 示例 1 - 在单网卡机器上运行单个 gpfdist 实例

创建一个可读的外部表 `ext_expenses`，使用 gpfdist 协议。文件使用管道 (`|`) 作为列分隔符。

```sql
=# CREATE EXTERNAL TABLE ext_expenses ( name text,
    date date, amount float4, category text, desc1 text )
    LOCATION ('gpfdist://etlhost-1:8081/*')
FORMAT 'TEXT' (DELIMITER '|');
```

### 示例 2 - 运行多个 gpfdist 实例

创建一个可读的外部表 `ext_expenses`，对所有带 txt 扩展名的文件使用 gpfdist 协议。列分隔符是管道 (`|`)，NULL 是空格 (`' '`)。

```sql
=# CREATE EXTERNAL TABLE ext_expenses ( name text, 
   date date,  amount float4, category text, desc1 text ) 
   LOCATION ('gpfdist://etlhost-1:8081/*.txt', 
             'gpfdist://etlhost-2:8081/*.txt')
   FORMAT 'TEXT' ( DELIMITER '|' NULL ' ') ;
```

### 示例 3 - 运行单个 gpfdist 实例并记录错误

使用 gpfdist 协议创建一个可读的外部表 `ext_expenses`，对所有带 txt 扩展名的文件使用 gpfdist 协议。列分隔符是管道 (`|`)，NULL 是空格 (`' '`)。

当我们在 Cloudberry Database 中访问外部表格时，采用了一种称为“单行错误隔离”模式的处理方式。这意味着，如果输入的数据格式出现任何错误，这些错误不会影响整个表格的处理过程，而是会被单独捕获并记录下来，同时还会提供一份详细的错误描述。你可以查看这些错误，修复问题，然后重新加载被拒绝的数据。如果某个 Segment 上的错误计数大于 `5`（`SEGMENT REJECT LIMIT` 值），整个外部表操作将失败，不会处理任何行。

```sql
=# CREATE EXTERNAL TABLE ext_expenses ( name text, 
   date date, amount float4, category text, desc1 text ) 
   LOCATION ('gpfdist://etlhost-1:8081/*.txt', 
             'gpfdist://etlhost-2:8082/*.txt')
   FORMAT 'TEXT' ( DELIMITER '|' NULL ' ')
   LOG ERRORS SEGMENT REJECT LIMIT 5;
```

从 CSV 格式的文本文件创建可读的 `ext_expenses` 表：

```sql
=# CREATE EXTERNAL TABLE ext_expenses ( name text, 
   date date,  amount float4, category text, desc1 text ) 
   LOCATION ('gpfdist://etlhost-1:8081/*.txt', 
             'gpfdist://etlhost-2:8082/*.txt')
   FORMAT 'CSV' ( DELIMITER ',' )
   LOG ERRORS SEGMENT REJECT LIMIT 5;
```

### 示例 4 - 使用 gpfdist 创建可写外部表

创建一个可写入的外部表 `sales_out`，使用 gpfdist 将输出数据写入文件 `sales.out`。列分隔符是管道 (`|`)，NULL 是空格 (`' '`)。文件将在启动 gpfdist 文件服务器时指定的目录中创建。

```sql
=# CREATE WRITABLE EXTERNAL TABLE sales_out (LIKE sales) 
   LOCATION ('gpfdist://etl1:8081/sales.out')
   FORMAT 'TEXT' ( DELIMITER '|' NULL ' ')
   DISTRIBUTED BY (txn_id);
```
