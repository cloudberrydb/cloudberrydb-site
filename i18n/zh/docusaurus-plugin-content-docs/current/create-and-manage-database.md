---
title: 创建和管理数据库
---

# 创建和管理 Cloudberry Database

Cloudberry Database 系统是 Cloudberry Database 的单个实例。在 Cloudberry Database 中可能有多个正在运行的数据库系统，但通常客户端只能连接到其中一个系统。

一个 Cloudberry Database 数据库系统 (DBMS) 中可能有多个数据库。这不同于某些“数据库实例即是数据库”的 DBMS，例如 Oracle。尽管你可以在 Cloudberry Database 系统中创建多个数据库，但客户端程序一次只能连接和访问一个数据库，而不能在数据库之间进行交叉查询。

## 模板和默认数据库

Cloudberry Database 提供了若干模板数据库（`template1` 和 `template0` ）和默认数据库 (`postgres`)。

默认情况下，你创建的每个新数据库都基于 `template1` 数据库。除非你指定了其他模板数据库，Cloudberry Database 默认使用 `template1` 创建数据库。不建议在 `template1` 中创建数据库对象，否则基于 `template1` 新创建的每个数据库中都有这些对象。

Cloudberry Database 在内部使用另一个数据库模板 `template0`。你可以使用 `template0` 创建一个完全干净的数据库，其中仅包含 Cloudberry Database 在初始化时预定义的标准对象。请勿删除或修改 `template0`。

首次连接到 Cloudberry Database 时，你可以使用 `postgres` 数据库。Cloudberry Database 使用 `postgres` 作为管理连接的默认数据库。

## 创建数据库

用 `CREATE DATABASE` 命令创建一个新的数据库。例如：

```sql
=> CREATE DATABASE <new_dbname>;
```

要创建数据库，你需要有创建数据库的权限，或者你需要是 Cloudberry Database 的超级用户。如果你没有相应的权限，则无法创建数据库。请联系 Cloudberry Database 管理员授权，或请管理员为你创建数据库。

此外，你还可以使用客户端程序 `createdb` 来创建数据库。例如，在命令行终端中执行以下命令，在命令中使用实际的主机名和端口连接到 Cloudberry Database，并创建一个名为 `mydatabase` 的数据库：

```shell
$ createdb -h coordinator_host -p 5432 mydatabase
```

主机名和端口必须与已安装的 Cloudberry Database 系统的主机名和端口匹配。

某些数据库对象（例如角色）由 Cloudberry Database 系统中的所有数据库共享。其他对象（例如创建的表）仅在创建它们的数据库中才是可见的。

:::caution
`CREATE DATABASE` 命令不是事务性的。
:::

### 克隆数据库

Cloudberry Database 默认通过克隆标准系统数据库模板 `template1` 来创建新数据库。创建新数据库时，任何数据库都可以用作模板，你可以“克隆”或复制现有数据库以及该数据库中的所有对象和数据。例如：

```sql
=> CREATE DATABASE <new_dbname> TEMPLATE <old_dbname>;
```

### 创建数据库时分配其他所有者

创建数据库时，你可以指定另一个角色为该数据库的所有者：

```sql
=> CREATE DATABASE <new_dbname> WITH <owner=new_user>;
```

## 查看数据库列表

如果你使用的是 `psql` 客户端程序，你可以使用 `\l` 元命令来查看 Cloudberry Database 系统中的数据库和模板列表。如果使用的是其他客户端程序并且你是超级用户，则可以从 `pg_database` 系统目录表中查询数据库列表。例如：

```sql
=> SELECT datname from pg_database;
```

## 更改数据库

`ALTER DATABASE` 命令可更改数据库所有者、名称或默认配置等数据库属性。以下示例命令设置数据库的默认 schema 搜索路径（`search_path` 配置参数）：

```sql
=> ALTER DATABASE mydatabase SET search_path TO myschema, public, pg_catalog;
```

若要更改数据库，你必须是数据库的所有者或超级用户。

## 删除数据库

`DROP DATABASE` 命令用于删除数据库。它删除数据库的系统目录条目，并删除磁盘上包含数据的数据库目录。要执行 `DROP DATABASE`，你必须是数据库的所有者或超级用户。如果有用户正在连接数据库，则无法删除该数据库。删除某个数据库前，请先连接到 `postgres` 数据库（或其他数据库），然后再执行删除命令。例如：

```sql
=> \c postgres
=> DROP DATABASE mydatabase;
```

另外，你也可以使用客户端程序 `dropdb` 来删除数据库。例如，以下命令使用提供的主机名和端口连接到 Cloudberry Database，并删除数据库 `mydatabase`：

```shell
$ dropdb -h coordinator_host -p 5432 mydatabase
```

:::caution
数据库被删除后无法撤消。
:::

`DROP DATABASE` 命令不是事务性的。

