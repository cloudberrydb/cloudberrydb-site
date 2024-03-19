---
title: 从 Web 服务加载数据
---

# 从 Web 服务加载数据

在 Cloudberry Database 中，你可以通过创建外部 Web 表的方式，从 Web 服务或任何支持命令行访问的数据源加载数据。这里支持的数据格式有文本（TEXT）和 CSV 格式。

通过外部 Web 表，Cloudberry Database 能够像处理常规数据库表一样操作动态数据源。需要注意的是，由于 Web 表中的数据可能会在查询执行过程中发生变化，这些数据不支持重新扫描。

使用 `CREATE EXTERNAL WEB TABLE` 命令可以创建一个 Web 表的定义。你可以选择创建基于命令行的或是基于 URL 的外部 Web 表，但需要注意，这两种定义的格式是不同的，请勿将它们混合使用。

## 使用命令来定义外部 Web 表

在 Cloudberry Database 中，你可以通过 Shell 命令或脚本的输出来定义基于命令的外部 Web 表数据。具体来说，你需要执行 `CREATE EXTERNAL WEB TABLE` 命令来创建外部 Web 表，并在 `EXECUTE` 子句中指明这个 Shell 命令或脚本。这样，当命令执行时，它会捕获那一刻的数据作为表数据。`EXECUTE` 子句负责在数据库系统的指定节点上执行这些命令或脚本，这些节点可能是 Coordinator、某个特定的 Segment 主机，或是多个 Segment 主机。

默认情况下，该命令会在有数据输出需处理的 Segment 主机上执行。例如，如果每个 Segment 主机都运行了 4 个处理输出数据的主 Segment 实例，那么该命令将在每个 Segment 主机上执行 4 次。你也可以通过设定限制来减少执行该 Web 表命令所需的 Segment 实例数量。在 SQL 命令的 `ON` 子句中指定的所有 Segment 将会并发执行此命令。

需要注意的是，你定义的这个外部命令是在数据库环境中执行的，它无法直接访问操作系统层面的环境变量（例如 `.bashrc` 或 `.profile` 中定义的变量）。因此，你需要在 `EXECUTE` 子句中明确设置所需的环境变量。例如：

```sql
=# CREATE EXTERNAL WEB TABLE output (output **text**)
    EXECUTE 'PATH=/home/gpadmin/programs; export PATH; myprogram.sh' 
    FORMAT 'TEXT';
```

此外，为了确保安全和一致性，这些 Shell 脚本必须能被数据库的管理用户 `gpadmin` 执行，并且在 Coordinator 和所有 Segment 主机上都位于相同的路径。

下面的命令示例展示了如何定义一个执行特定脚本的外部 Web 表。这个脚本将在每个有数据输出需要处理的 Segment 主机上执行。

```sql
=# CREATE EXTERNAL WEB TABLE log_output 
    (linenum **int**, message **text**) 
    EXECUTE '/var/load_scripts/get_log_data.sh' ON HOST 
    FORMAT 'TEXT' (DELIMITER '|');
```

## 基于 URL 的外部 Web 表

在 Cloudberry Database 中，你可以直接通过基于 URL 的外部 Web 表使用 HTTP 协议，以此从 Web 服务器获取数据。通过这种方式，数据库能够动态地访问外部数据源。但值得注意的是，一旦获取，这些数据将无法被重新扫描或查询。

你需要在使用 `http://` 协议的 URL 中明确指定 Web 服务器上数据文件的位置，由此定义外部 Web 表。这些 Web 数据文件应存放在 Cloudberry Database 的 Segment 主机可以访问的 Web 服务器上。你指定的 URL 数量直接影响数据库系统并行处理这些外部数据的能力。例如，在拥有 8 个 Segment 的 Cloudberry Database 系统中，如果你指定了 2 个外部数据文件，那么在执行查询时，将会有 2 个 Segment 同时并行访问这些外部 Web 表。

以下示例命令定义了一张能够从多个 URL 中获取数据的外部 Web 表。这种配置方式极大地增强了数据库处理动态外部数据的灵活性和效率。

```sql
=# CREATE EXTERNAL WEB TABLE ext_expenses (name **text**, 
  **date** **date**, amount float4, category **text**, description **text**) 
  LOCATION ( 

  'http://intranet.company.com/expenses/sales/file.csv',
  'http://intranet.company.com/expenses/exec/file.csv',
  'http://intranet.company.com/expenses/finance/file.csv',
  'http://intranet.company.com/expenses/ops/file.csv',
  'http://intranet.company.com/expenses/marketing/file.csv',
  'http://intranet.company.com/expenses/eng/file.csv' 

   )
  FORMAT 'CSV' ( HEADER );
```
