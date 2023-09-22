---
title: 迁移加载数据
---

`<!-- 大部分表述无法验证 by @TomShawn>`

# 迁移加载数据到 Cloudberry Database

有几种方式可以把数据加入到 Cloudberry Database 中，每一种都有其合适的用途。

## 带列值的 INSERT 语句

带有值的单个 `INSERT` 语句会向表中加入一行。这个行会流过 Master 并且被分布到一个 Segment 上。这是最慢的方法并且不适合装载大量数据。

## COPY 语句

PostgreSQL 的 `COPY` 语句从外部文件拷贝数据到数据表中。它比 `INSERT` 语句插入多行的效率更高，但是行仍需流过 Master。所有数据都在一个命令中被拷贝，它并不是一种并行处理。

`COPY` 命令的数据输入来自于一个文件或者标准输入。例如：

```sql
COPY table FROM '/data/mydata.csv' WITH CSV HEADER;
```

使用 `COPY` 适合于增加相对较小的数据集合（例如多达上万行的维度表）或者一次性数据装载。在编写脚本处理装载少于 1 万行的少量数据时使用 `COPY`。因为 `COPY` 是一个单一命令，在使用这种方法填充表时没有必要禁用自动提交。使用者可以运行多个并发的 `COPY` 命令以提高性能。

## 外部表

外部表提供了对 Cloudberry Database 之外的来源中数据的访问。可以用 `SELECT` 语句访问它们，外部表通常被用于抽取、装载、转换（ELT）模式，这是一种抽取、转换、装载（ETL）模式的变种，这种模式可以利用 Cloudberry Database 的快速并行数据装载能力。

通过 ETL，数据从来源被抽取，在数据库外部使用外部转换工具（Informatica 或者 Datastage）转换，然后被装载到数据库中。

通过 ETL，Cloudberry Database 外部表提供对外部来源中数据的访问，外部来源可以是只读文件（例如文本、CSV 或者 XML 文件）、Web 服务器、Hadoop 文件系统、可执行的 OS 程序或者 Cloudberry `gpfdist` 的文件服务器。外部表支持选择、排序和连接这样的 SQL 操作，这样数据可以被同时装载和转换，或者被装载到一个装载表并且在数据库内被转换成目标表。

外部表使用 `CREATE EXTERNAL TABLE` 语句定义，该语句有一个 `LOCATION` 子句定义数据的位置以及一个 `FORMAT` 子句定义源数据的格式，这样系统才能够解析输入数据。文件使用 `file://` 协议，并且文件必须位于一台 Segment 主机上由 Cloudberry Database 超级用户可访问的位置。数据可以被分散在 Segment 主 机上，并且每台主机上的每个主 Segment 有不超过一个文件。`LOCATION` 子句 中列出的文件的数量是将并行读取该外部表的 Segment 的数量。

## 使用 gpfdist 的外部表

装载大型事实表的最快方式是使用基于 gpdist 的外部表。gpfdist 是一个使用 HTTP 协议的文件服务器程序，它以并行的方式向 Cloudberry Database 的  Segment 供应外部数据文件。一个 gpfdist 实例每秒能供应 200MB 并且很多 gpfdist 进程可以同时运行，每一个供应要被装载的数据的一部分。当使用者用 `INSERT INTO <table> SELECT * FROM <external_table>` 这样的语句开始装载时，`INSERT` 语句会被 Master 解析并且分布给主 Segment。Segment 连接到 gpfdist 服务器并且并行检索数据，解析并验证数据，从分布键数据计算一个哈希值并且基于哈希键把行发送给它的目标Segment。每个 gpfdist 实例默认将接受最多 64 个来自 Segment 的连接。通过让许多 Segment 和 gpfdist 服务器参与到装载处理中，可以以非常高的速率被装载。

在使用最多 `gp_external_max_segments` 个 gpfdist 时，主 Segment 会并行访问外部文件。在优化 gpfdist 的性能时，随着 Segment 的数量增加会最大化并行性。在尽可能多的 ETL 节点上均匀地散布数据。将非常大型的数据 文件分解成相等的部分，并且把数据分散在尽可能多的文件系统上。

在每个文件系统上运行两个 gpfdist 实例。在装载数据时，gpfdist 在 Segment 节点上容易变成 CPU 密集型的操作。举个例子，如果有八个机架的 Segment 节点，在 Segment 上就有大量可用的 CPU 来驱动更多的 gpfdist 进程。 在尽可能多的接口上运行 gpfdist。要注意绑定网卡并且确保启动足够的 gpfdist 实例配合它们工作。

有必要在所有这些资源上保持工作平均。装载的速度与最慢的节点相同。装载 文件布局上的倾斜将导致整体装载受制于资源瓶颈。
`gp_external_max_segs` 配置参数控制每个 gpfdist 进程能服务的 Segment 数量。默认值是 64。使用者可以在 Master 上的 `postgresql.conf` 配置文件中设置一个不同的值。 总是保持 `gp_external_max_segs` 和 gpfdist 进程的数量为一个偶因子，也就是说 `gp_external_max_segs` 值应该是 gpfdist 进程数的倍数。例如，如果有 12 个 Segment 和 4 个 gpfdist 进程， 规划器会按照下面的方式循环分配 Segment 连接：

```
Segment 1  - gpfdist 1 
Segment 2  - gpfdist 2 
Segment 3  - gpfdist 3 
Segment 4  - gpfdist 4 
Segment 5  - gpfdist 1 
Segment 6  - gpfdist 2 
Segment 7  - gpfdist 3 
Segment 8  - gpfdist 4 
Segment 9  - gpfdist 1 
Segment 10 - gpfdist 2 
Segment 11 - gpfdist 3 
Segment 12 - gpfdist 4
```

在装载到已有表之前删除索引，并且在装载之后重建索引。在已有数据上创建 索引比装载每行时增量更新索引更快。

装载后在表上运行 ANALYZE。在装载期间通过设置 `gp_autostats_mode` 为 `NONE` 来禁用自动统计信息收集。在装载错误后运行 `VACUUM` 以恢复空间。

对重度分区的列存表执行少量高频的数据装载可能会对系统有很大影响，因为在每个时间间隔内被访问的物理文件会很多。

## gpload

gpload 是一种数据装载工具，它扮演着 HashData 外部表并行装载特性的接口的角色。要当心对 gpload 的使用，因为它会创建并且删除外部表，从而可能会导致目 录膨胀。可转而使用 gpfdist，因为它能提供最好的性能。gpload 使用定义在一个 YAML 格式的控制文件中的规范来执行一次装载。它会执行下列操作：

- 调用 gpfdist 进程
- 基于定义的源数据创建一个临时的外部表定义
- 执行 `INSERT`、`UPDATE` 或者 `MERGE` 操作将源数据载入数据库中的目标表
- 删除临时外部表
- 清除 gpfdist 进程

装载会在单个事务中完成。

最佳实践

- 在装载数据之前删掉现有表上的任何索引，并且在装载之后重建那些索引。新创建索引比 装载每行时增量更新索引更快。
- 在装载期间通过将 `gp_autostats_mode` 配置参数设置为 `NONE` 禁用自动统计信息收 集。
- 外部表并非为频繁访问或者 ad hoc 访问而设计。
- 外部表没有统计信息告知优化器。可以用下面这样的语句在 `pg_class` 系统目录中为外部 表设置粗略的行数和磁盘页数估计：

    ```sql
    UPDATE pg_class SET reltuples=400000, relpages=400
    WHERE relname='myexttable';
    ```

- 在使用 gpfdist 时， 通过为 ETL 服务器上的每一块 NIC 运行一个 gpfdist 实例以最大化网络带宽。在 gpfdist 实例之间均匀地划分源数据。
- 在使用 gpload 时，在资源允许的情况下同时运行尽可能多的 gpload 实例。利用可用的 CPU、内存和网络资源以增加能从 ETL 服务器传输到 Cloudberry Database 的数据量。
- 使用 COPY 语句的 `SEGMENT REJECT LIMIT` 子句设置在 `COPY FROM` 命令被中止之前可 以出现错误的行的百分数限制。这个拒绝限制是针对每个 Segment 的。当任意一个 Segment 超过该限制时，命令将被中止且不会有行被增加。使用 `LOG ERRORS` 子句可以 保存错误行。如果有一行在格式上有错误（例如缺少值或者有多余的值，或者数据类型不对），Cloudberry Database 会在内部存储错误信息和行。使用内建 SQL 函数 `gp_read_error_log()` 可以访问这种存储下来的信息。
- 如果装载出现错误， 在该表上运行 `VACUUM` 以恢复空间。
- 在用户装载数据到表中后，在堆表（包括系统目录）上运行 `VACUUM`，并且在所有的表上运行 `ANALYZE`。没有必要在追加优化表上运行 `VACUUM`。如果表已经被分过区，用户可以只清理和分析受数据装载影响的分区。这些步骤会清除来自于被中止的装载、删除或者更新中的行并且为表更新统计信息。
- 在装载大量数据之后重新检查表中的 Segment 倾斜。用户可以使用下面这样的查询来检查倾斜：

    ```sql
    SELECT gp_segment_id, count(*) 
    FROM schema.table 
    GROUP BY gp_segment_id ORDER BY 2;
    ```

- gpfdist 默认假定最大记录尺寸为 32K。要装载大于 32K 的数据记录，用户必须通过在 gpfdist 命令行上指定 `-m <bytes>` 选项来增加最大行尺寸参数。如果用户使用的是 gpload，在 gpload 控制文件中设置 `MAX_LINE_LENGTH` 参数。

注意：与 Informatica Power Exchange 的集成当前被限制为默认的 32K 记录长度。

## 用 hashcopy 迁移数据

- 从源集群迁移所有元数据用户数据到目标集群

    ```shell
    hashcopy --source-host=127.0.0.1 --source-port=15432 --source-user=hdw --dest-host=127.0.0.1 --dest-port=25432 --dest-user=hdw1 --full

    --truncate        目标表导入前存在先truncate，不存在先create，再truncate
    --append          目标表导入前存在append，不存在先create，再append
    ```

- 从源集群迁移一个db到目标集群

    ```shell
    --dbname 从源集群迁移一个db到目标集群,目标数据库不存在会创建同名
    hashcopy --source-host=127.0.0.1 --source-port=15432 --source-user=hdw 
    --dest-host=127.0.0.1 --dest-port=25432 --dest-user=hdw1 
    --dbname="gpadmin" --turncate

    --dest-dbname只能和--dbname配合使用，用于重命名db
    hashcopy --source-host=127.0.0.1 --source-port=15432 --source-user=hdw 
    --dest-host=127.0.0.1 --dest-port=25432 --dest-user=hdw1 --dbname="gapdmin"
    --dest-dbname="mydb1" --truncate
    ```

- 从源集群迁移一个schema到目标集群 db

    ```shell
    --schema 从源集群迁移一个schema到目标集群db,目标数据库对象不存在会创建同名db, schema
    hashcopy --source-host=127.0.0.1 --source-port=15432 --source-user=hdw 
    --dest-host=127.0.0.1 --dest-port=25432 --dest-user=hdw1 
    --schema="gpadmin.schema1" --turncate

    --dest-schema只能和--schema配合使用，用于指定目标schema所在db
    hashcopy --source-host=127.0.0.1 --source-port=15432 --source-user=hdw 
    --dest-host=127.0.0.1 --dest-port=25432 --dest-user=hdw1 
    --schema="gapdmin.schema1" --dest-schema="mydb1.schema1" --truncate
    ```

- 从源集群迁移一个或多个用户表到目标集群

    ```shell
    --include-table 从源集群迁移一个或多个用户表到目标集群(表名格式dbname.schema.table)
    hashcopy --source-host=127.0.0.1 --source-port=15432 --source-user=hdw 
    --dest-host=127.0.0.1 --dest-port=25432 --dest-user=hdw1 
    --include-table="gpadmin.public.aaa,gpadmin.public.bbb" --truncae

    --dest-table只能和--include-table配合使用，用于重命名表
    hashcopy --source-host=127.0.0.1 --source-port=15432 --source-user=hdw 
    --dest-host=127.0.0.1 --dest-port=25432 --dest-user=hdw1
    --include-table="gpadmin.public.aaa,gpadmin.public.bbb"
    --dest-table="gpadmin.public.ccc,gpadmin.public.ddd"
    --truncate
    ```

注意：

- 在使用 `--dbname`，`--schema`，`--include-table` 迁移数据时，数据库内对象会依赖一些全局对象，否则迁移不会正常，在使用如上三个选项迁移数据时，可以加上 `--with-globalmeta` 迁移全局对象信息。
- 每次迁移会话进行时，会生成两个文件 `hashcopy_failed_timestamp`，`hashcopy_succed_timestamp` 文件，用于保存本次迁移会话迁移失败的表，迁移成功的表。`hashcopy_succed_timestamp` 可以直接传入 `--exclude-table-file` 用于重跑迁移任务。
- 迁移时源数据库如果是 `gpdb4` 或 `gpdb5`，源数据库可能会有视图或者函数使用 `gpdb4` 或 `gpdb5` 的系统表，这些系统表结构在 `gpdb6` 已经变更（例如 `pg_stat_activity>procpid,gp_segment_configuration` 等），这些视图和函数不会迁移成功，具体迁移时需要看 `gpAdminlogs/hashcopy_****.log`。
