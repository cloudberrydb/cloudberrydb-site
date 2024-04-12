---
title: 使用 COPY 加载数据
---

# 使用 `COPY` 命令将数据加载进 Cloudberry Database

你可以使用 `COPY FROM` 命令从本地文件系统中的文件或通过标准输入加载数据到数据库表中，并将这些数据添加到表的末尾。使用 `COPY` 命令加载数据是一个串行过程，即所有数据都通过单进程在 Cloudberry Database 的 Coordinator 实例中加载。因此，`COPY` 命令更适合数据量较小的情况。

在使用 `COPY` 命令时，Coordinator 主机上运行的 `postgres` 进程必须能够访问源文件。你可以通过指定相对于 Coordinator 主机数据目录的源文件名，或者指定一个绝对路径来直接指定文件的位置。

此外，Cloudberry Database 可以通过客户端与 Coordinator 服务器之间的连接，从标准输入 (STDIN) 读取数据，或向标准输出 (STDOUT) 写入数据。该功能使数据加载更灵活，使得从各种数据源向数据库传输数据成为可能。

## 从文件加载数据

`COPY` 命令指示 `postgres` 数据库的后台进程去打开一个特定的文件，并读取该文件的内容，最后将这些内容添加到指定的表中。为了顺利完成这一过程，数据库后台进程必须具备对该文件的读取权限。这就要求你在指定文件路径时，既可以提供一个位于 Coordinator 主机上的绝对路径，也可以给出一个相对于 Coordinator 数据目录的路径。

```sql
COPY <table_name> FROM </path/to/filename>;
```

## 从标准输入加载数据

在数据加载前，为了免去将数据文件传输至 Coordinator 主机的麻烦，`COPY FROM STDIN` 提供了一种便捷方式，即通过标准输入渠道 (Standard Input Channel) 直接向 `postgres` 数据库后台发送数据。使用这个命令时，数据库后台会持续接收输入的数据行，直到遇到一个仅含有反斜杠和点号（`\.`）的行为止，这标志着数据输入的结束。

```sql
COPY <table_name> FROM <STDIN>;
```

## 在 psql 中使用 `\copy` 加载数据

请勿将 psql 的 `\copy` 命令和 SQL 中的 `COPY` 命令混为一谈。`\copy` 实际上是在客户端调用 `COPY FROM STDIN` 的一个简化操作，它允许直接从 psql 客户端将数据传输到数据库后端。因此，你需要确保要导入的文件位于运行 psql 客户端的同一台机器上，并且该文件对运行客户端的用户是可访问的。

为了避免将数据文件先传至 Coordinator 主机再进行数据加载，`COPY FROM STDIN` 命令通过标准输入渠道直接向 `postgres` 数据库后端输送数据。一旦执行了 `COPY FROM STDIN` 命令，数据库后端就会开始接收数据，直到遇到一个只包含反斜杠和点号（`\.`）的行，这表示数据输入结束。psql 通过 `\copy` 命令巧妙地封装了整个过程，使得从客户端到数据库的数据导入既简便又高效。

```sql
\copy <table_name> FROM <filename>;
```

## 输入格式

`COPY FROM` 接受一个 `FORMAT` 参数，用于指定输入数据的格式。可选的值有 `TEXT`、`CSV`（逗号分隔值）和 `BINARY`。

```sql
COPY <table_name> FROM </path/to/filename> WITH (FORMAT csv);
```

`FORMAT csv` 会读取逗号分隔值。`FORMAT text` 默认使用制表符分隔值，`DELIMITER` 选项可以指定其他字符作为值的分隔符。

```sql
COPY <table_name> FROM </path/to/filename> WITH (FORMAT text, DELIMITER '|');
```

默认情况下，Cloudberry Database 使用默认的客户端编码，你可以通过 `ENCODING` 选项来更改这一设置。数据来自其他操作系统时，这非常有用。

```sql
COPY <table_name> FROM </path/to/filename> WITH (ENCODING 'latin1');
```
