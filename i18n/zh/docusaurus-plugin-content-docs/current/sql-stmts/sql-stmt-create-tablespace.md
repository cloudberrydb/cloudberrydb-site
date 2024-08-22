---
title: CREATE TABLESPACE
---

# CREATE TABLESPACE

定义一个新的表空间。

## 语法概要

```sql
CREATE TABLESPACE <tablespace_name>
   [ OWNER { <owner_name> | CURRENT_USER | SESSION_USER } ]
   LOCATION '<directory>' 
   [ WITH (content<ID_1>='<directory>'[, content<ID_2>='<directory>' ... ] [, <tablespace_option = value [, ... ] ] ) ]
```

## 描述

`CREATE TABLESPACE` 为你的 Cloudberry Database 系统注册并配置一个新的表空间。表空间的名称必须与系统中任何现有表空间的名称不同。表空间是 Cloudberry Database 系统对象（全局对象），如果你有足够的权限，你可以从任何数据库使用表空间。

超级用户可以定义一个替代的主机文件系统位置，用于存放包含数据库对象（如表和索引）的数据文件。

拥有适当权限的用户可以将 tablespace_name 传递给 [`CREATE DATABASE`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/create-database.md)、[`CREATE TABLE`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/create-table.md) 或 [`CREATE INDEX`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/create-index.md)，以此指示 Cloudberry Database 将这些对象的数据文件存储在指定的表空间中。

在 Cloudberry Database 中，文件系统位置必须存在于所有主机上，包括运行 Coordinator、备用镜像、每个主要 Segment 和每个镜像 Segment 的主机。

## 参数

**`tablespace_name`**

要创建的表空间的名称。名称不能以 `pg_` 或 `gp_` 开头，因为这样的名称是保留给系统表空间的。

**`owner_name`**

表空间的所有者用户名。如果未指定，默认为执行该命令的用户。虽然只有超级用户有权限创建表空间，但他们可以把表空间的所有权赋予非超级用户。

**`LOCATION 'directory'`**

将被用作表空间的目录，该目录应为空，并需由 Cloudberry Database 系统用户所拥有。您需要提供目录的绝对路径，且路径名长度不得超过 100 个字符。（这个路径用于在 `pg_tblspc` 目录下创建一个符号链接目标。当使用 `pg_basebackup` 等工具将符号链接目标发送至 tar 时，路径会被截短至 100 个字符。）

你可以为 `WITH` 子句中的任何 Cloudberry Database Segment 实例指定不同的表空间目录。

**`contentID_i='directory_i'`**

`contentID_i='directory_i'` 中的 `ID_i` 是 Segment 实例的 content ID。`directory_i` 是主机系统文件位置的绝对路径，Segment 实例将该路径用作表空间的根目录。你不能指定 Coordinator 实例的 content ID（`-1`）。你可以为多个 Segment 指定相同的目录。

如果一个 Segment 实例没有在 `WITH` 子句中列出，Cloudberry Database 将使用 `LOCATION` 子句中指定的表空间目录。

对于 `LOCATION` 目录的限制也适用于 `directory_i`。

**`tablespace_option`**

要调整或重设的表空间参数，目前仅包括 `seq_page_cost` 和 `random_page_cost`。对特定表空间设置这些值可以覆盖查询规划器对于从该表空间的表读取页面成本的默认估算，这一估算基于同名的配置参数所设定（见 `seq_page_cost` 和 `random_page_cost`）。这在某个表空间位于相对于其它 I/O 子系统更快或更慢的磁盘时特别有用。

## 注意事项

因为 `CREATE TABLESPACE` 命令会在 Coordinator 和 Segment 实例的数据目录下的 `pg_tblspc` 目录创建到指定目录的符号链接，Cloudberry Database 的表空间功能只支持那些能够使用符号链接的系统。

你不能在事务块中执行 `CREATE TABLESPACE`。

在创建表空间时，请确保文件系统位置有足够的 I/O 速度和可用磁盘空间。

:::info 注意
Cloudberry Database 不支持为具有相同 content ID 的主-镜像对配置不同的表空间位置。只能为不同的 content ID 配置不同的位置。请勿修改 `pg_tblspc` 目录下的符号链接，以此使得主-镜像对指向不同的文件位置；这会导致错误行为。
:::

## 示例

创建一个新的表空间，并为 Coordinator 和所有 Segment 实例指定文件系统位置：

```sql
CREATE TABLESPACE mytblspace LOCATION '/mydbtspc/mytestspace';
```

在 `/data/indexes` 创建一个由用户 `genevieve` 拥有的表空间 `indexspace`：

```sql
CREATE TABLESPACE indexspace OWNER genevieve LOCATION '/data/indexes';
```

创建一个新的表空间，并为 content ID 为 `0` 和 `1` 的 Segment 实例指定位置。对于未在 `WITH` 子句中列出的 Coordinator 和 Segment 实例，表空间的文件系统位置是 `LOCATION` 子句中指定的目录。

```sql
CREATE TABLESPACE mytblspace LOCATION '/mydbtspc/mytestspace' WITH (content0='/temp/mytest', content1='/temp/mytest');
```

以上示例为两个 Segment 实例指定了相同的位置。你可以为每个 Segment 指定不同的位置。

## 兼容性

`CREATE TABLESPACE` 是 Cloudberry Database 的扩展。

## See also

[`CREATE DATABASE`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/create-database.md)、[`CREATE TABLE`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/create-table.md)、[`CREATE INDEX`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/create-index.md)、[`DROP TABLESPACE`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/drop-tablespace.md)、[`ALTER TABLESPACE`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/alter-tablespace.md)
