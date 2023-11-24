---
title: 连接到数据库
---

# 连接到 Cloudberry Database

本文档介绍如何连接到 Cloudberry Database。

## 连接参数

你可以使用与 PostgreSQL 兼容的客户端程序（例如 `psql`）连接到 Cloudberry Database。用户和管理员总是通过 *coordinator* 连接到 Cloudberry Database。Segment 不接受客户端连接。

为了建立与 Cloudberry Database coordinator 的连接，你需要了解以下连接信息，并相应地配置你的客户端程序。

|连接参数|描述|环境变量|
|--------|----|-------|
|应用程序名|连接到数据库的应用程序名称。在 `application_name` 连接参数中的默认值是 *psql*。|`$PGAPPNAME`|
|数据库名|待连接数据库的名称。对于新初始化的系统，首次连接请使用 `postgres` 数据库。|`$PGDATABASE`|
|主机名|Cloudberry Database coordinator 的主机名。默认主机是本地主机。|`$PGHOST`|
|端口|Cloudberry Database coordinator 实例运行的端口号。默认值为 `5432`。|`$PGPORT`|
|用户名|连接的数据库用户（角色）名称。这不一定与你的操作系统用户名相同。如果你不确定你的数据库用户名是什么，请与你的 Cloudberry Database 管理员联系。请注意，每个 Cloudberry Database 系统在初始化时都会自动创建一个超级用户帐户。此帐户的名称与初始化 Cloudberry 系统的用户的操作系统名称相同（通常为 `gpadmin`）。|`$PGUSER`|

[使用 psql 连接](#使用-psql-连接) 介绍了连接到 Cloudberry Database 的示例命令。

## 支持的客户端应用程序

你可以使用多种客户端应用程序连接到 Cloudberry Database：

- Cloudberry 安装中包含了一些[客户端应用程序](#客户端应用程序)。在这些应用程序中，`psql` 是一个交互式命令行界面。
- 使用标准的[数据库应用程序接口](#使用应用程序接口连接)，例如 ODBC 和 JDBC，你可以创建自己的客户端应用程序，与 Cloudberry Database 进行连接。
- 大多数使用标准数据库接口（例如 ODBC 和 JDBC）的客户端工具，都可以配置为连接到 Cloudberry Database。

### 客户端应用程序

Cloudberry Database 的安装中，随附包含了一些客户端工具应用程序，位于 coordinator 主机安装的 `$GPHOME/bin` 目录下。以下是最常用的客户端应用程序：

|名称|用途|
|----|---|
|`createdb`|创建新的数据库|
|`createuser`|定义新的数据库角色|
|`dropdb`|删除数据库|
|`dropuser`|删除角色|
|`psql`|PostgreSQL 交互终端|
|`reindexdb`|对数据库进行重新索引|
|`vacuumdb`|收集并分析数据库的垃圾|

使用这些客户端应用程序时，您必须通过 coordinator 实例连接到数据库。您需要知道目标数据库的名称、coordinator 的主机名和端口号，以及要连接的数据库用户名。你可以在连接命令上中使用 `-d`、`-h`、`-p` 和 `-U` 选项分别指定这些信息。如果没有为某个参数显示指定选项，数据库将首先使用数据库名称来作为该参数的默认值。

所有这些选项都有默认值，如果未指定选项，则使用这些默认值：默认主机是本地主机 localhost。默认端口号是 `5432`。默认用户名是操作系统的用户名称，数据库名称也是如此。请注意，操作系统用户名和 Cloudberry Database 用户名不一定相同。

如果默认值不正确，您可以适当设置环境变量 `PGDATABASE`、`PGHOST`、`PGPORT` 和 `PGUSER` 的值，或使用 `psql` 的 `~/.pgpass` 文件来保存经常使用的密码。

### 使用 psql 连接

根据默认值或你设置的环境变量，使用 `psql` 访问数据库，示例如下：

```shell
$ psql -d cbdb-database -h coordinator_host -p 5432 -U `gpadmin`
```

```shell
$ psql cbdb-database
```

```shell
$ psql
```

如果尚未创建用户定义的数据库，你可以先连接到 `postgres` 数据库来访问系统。例如：

```shell
$ psql postgres
```

连接到数据库后，`psql` 展示了一个提示符，提示符后面是 `psql` 当前连接的数据库名称，后面跟着字符串 `=>`（如果你是数据库超级用户则为 `=#`）。例如：

```shell
cbdb-database=>
```

在提示符中，你可以输入 SQL 命令。为了将 SQL 命令发送到服务器并运行，SQL 命令必须以 `;`（分号）结尾。例如：

```sql
=> SELECT * FROM mytable;
```

## 使用应用程序接口连接

你可能希望开发自己的客户端应用程序与 Cloudberry Database 进行交互。PostgreSQL 为最常用的数据库应用程序编程接口（API）提供了一系列数据库驱动程序，这些驱动程序也可以与 Cloudberry Database 一起使用。这些驱动程序需要单独下载。

每个驱动程序（除了随 PostgreSQL 一起提供的 `libpq`）都是独立的 PostgreSQL 开发项目。你需要下载、安装并配置这些应用程序，才能连接到 Cloudberry Database。这些驱动程序如下：

|API|PostgreSQL 驱动程序|下载链接|
|---|------------------|-------|
|ODBC|psqlODBC|[psqlODBC - PostgreSQL ODBC 驱动程序](https://odbc.postgresql.org/)|
|JDBC|pgjdbc|[PostgreSQL JDBC 驱动程序](https://jdbc.postgresql.org/)|
|Perl DBI|pgperl|[DBD-Pg](https://metacpan.org/release/DBD-Pg)|
|Python DBI|pygresql|[PyGreSQL](http://www.pygresql.org/)|
|Python DBI|psycopg2|[Psycopg](https://www.psycopg.org/)|
|libpq C 库|libpq|[libpq - C 库](https://www.postgresql.org/docs/12/libpq.html)|

使用 API 访问 Cloudberry Database 的通用说明是：

1. 从适当来源下载你的编程语言平台和相应的 API。例如，你可以从 Oracle 获取 Java 开发工具包（JDK）和 JDBC API。
2. 根据 API 规范，编写你的客户端应用程序。在编写应用程序时，请注意 Cloudberry Database 中的 SQL 支持，这样就不会包含不受支持的 SQL 语法。

下载适当的驱动程序并配置与你的 Cloudberry Database coordinator 实例的连接。

## 常见连接问题

有很多原因可能会导致客户端应用程序无法成功连接到 Cloudberry Database。以下表格介绍了连接问题的一些常见原因以及如何解决。

| 问题 | 解决方案 |
| ---- | -------- |
| 没有针对主机或用户的 `pg_hba.conf` 条目 | 要允许远程客户端连接到 Cloudberry Database，你需要配置 Cloudberry Database coordinator 实例以接受这些连接。这需要通过在 `pg_hba.conf` 配置文件（该文件位于 coordinator 实例的数据目录中）添加适当的条目来实现。 |
| Cloudberry Database 没有运行 | 如果 Cloudberry Database coordinator 实例停止运行，用户将无法连接。你可以通过在 Cloudberry coordinator 主机上运行 `gpstate` 实用程序来验证 Cloudberry Database 系统是否在运行。 |
| 网络问题：连接超时 | 如果用户从远程客户端连接到 Cloudberry coordinator 主机，网络问题可能会阻止连接（例如，DNS 主机名解析问题、主机系统关闭等）。为排除网络问题，请从远程客户端主机连接到 Cloudberry coordinator 主机。例如：`ping hostname`。<br/><br/>如果系统无法解析参与 Cloudberry Database 的主机的主机名和 IP 地址，查询和连接将会失败。某些操作会使用 `localhost` 连接到 Cloudberry Database coordinator，而其他操作则会使用实际的主机名，因此你必须能够解析这两者。如果你遇到这个错误，请首先确保你能够从 coordinator 主机通过网络连接到 Cloudberry Database 列表中的每个主机。在 coordinator 和所有 segment 的 `/etc/hosts` 文件中，确保你拥有 Cloudberry Database 列表中涉及的所有主机的正确主机名和 IP 地址。`127.0.0.1` 必须解析为 `localhost`。 |
