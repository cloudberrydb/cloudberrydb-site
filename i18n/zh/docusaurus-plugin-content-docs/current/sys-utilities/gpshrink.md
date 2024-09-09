---
title: gpshrink
---

# gpshrink

Cloudberry Database 通过 gpshrink 系统工具缩容集群。集群资源空闲时，例如磁盘空间占用长期低于 20%、CPU 或内存占用率持续较低，则可以使用 gpshrink 来实现集群的缩容，从而节省服务器资源。用户可以通过 gpshrink 工具删除多余服务器上的 segment，从而实现集群缩容。

gpshrink 在执行时分为两阶段：

- 在准备阶段，会收集数据库中所有需要重分布的用户表信息。
- 在数据重分布阶段，会将数据库集群中的所有表进行数据重分布，即将现有的数据库集群中的数据重新分布到扩容或缩容后的数据库中。

## 使用 gpshrink 缩容集群

1. 创建一个三节点的集群。

    ```bash
    make create-demo-cluster
    ```

2. 创建测试表 test 并查看缩容前的状态。

    ```sql
    -- 建表并插入数据
    CREATE TABLE test(a INT); 
    INSERT INTO test SELECT i FROM generate_series(1,100) i;
    -- 查看 test 表的数据分布
    SELECT gp_segment_id, COUNT(*) FROM test GROUP BY gp_segment_id;
    -- 查看元数据状态
    SELECT * FROM gp_distribution_policy;
    SELECT * FROM gp_segment_configuration;
    ```

3. 创建 shrinktest 文件，在其中写入待删除的 segment 的信息。

    ```bash
    touch shrinktest
    ```

    segment 信息的格式为hostname|address|port|datadir|dbid|content|role，每个 segment 的信息需包括 primary 和 mirror 的信息，如下所示。若要删除多个 segment，则需将 content 较大的 segment 写在前面，确保 perferred role 与 role 是一致的，先写 primary 再写 mirror。

    ```bash
    # 以删除一个 segment 为例，以下为写入的 primary 和 mirror 的信息
    i-thd001y0|i-thd001y0|7004|/home/gpadmin/cloudberrydb/gpAux/gpdemo/datadirs/dbfast3/demoDataDir2|4|2|p
    i-thd001y0|i-thd001y0|7007|/home/gpadmin/cloudberrydb/gpAux/gpdemo/datadirs/dbfast_mirror3/demoDataDir2|7|2|m
    ```

4. 执行 `gpshrink` 命令两次。

    ```bash
    # 准备阶段
    gpshrink -i shrinktest
    # 重分布阶段
    gpshrink -i shrinktest
    ```

    |主要参数       | 描述 |
    | ------------ | -----------------|
    | `-i`         | 指定要删除的 segment 文件。  |
    | `-c`         | 清理已收集的表信息。  |
    | `-a`         | 收集重分布后表的统计信息。  |
    | `-d`         | 设置最长执行持续时间，超时将终止，用于重分布阶段。  |

    :::tip

    gpshrink 主要分两阶段实现：

    - 第一条 `gpshrink -i shrinktest` 命令实际上完成了缩容的准备工作：基于输入文件 `shrinktest` 读取被删除的 segment，创建对应的表 `gpshrink.status`（用于记录 gpshrink 的状态和 `gpshrink.status_detail`（用于记录每个表的状态），并获取所有需要执行重分布的表。
    - 第二条 `gpshrink -i shrinktest` 命令则完成了缩容的数据重分布工作：计算删除 segment 后的 sgement size，对每个表执行 `gpshrink`，实现数据重分布，最后在 `gp_segment_configuration` 中删除相应的 segment。在重分布阶段，不建议用户执行创建表的操作，因为新建的表将无法重分布在缩容后的集群中。也可能会出现一些语句执行失败的现象，因为有些表处于被锁定状态。

    :::

    :::tip

    - 若第一条 `gpshrink -i shrinktest` 执行失败，可能的原因是 `shrinktest` 文件错误导致执行中断，此时只需通过 `gpshrink -c` 清除其中收集的数据，再重新执行 `gpshrink -i shrinktest`。
    - 若第二条 `gpshrink -i shrinktest` 发生错误，用户需要登陆数据库，检查数据库中表的状态，并进行进一步的数据重分布或者回滚。

    :::

5. 缩容后再次查看 test 表的状态。

    ```sql
    -- 查看 test 表的数据分布
    SELECT gp_segment_id, COUNT(*) FROM test GROUP BY gp_segment_id;
    -- 查看元数据状态
    SELECT * FROM gp_distribution_policy;
    SELECT * FROM gp_segment_configuration;
    ```