---
title: gpdemo
---

# gpdemo（引入自 v1.5.0 版本）

在 v1.5.0 以前，如果用户想在单节点上部署带有 Segment 的 Cloudberry Database 小型集群用于演示，需要花费时间编写配置文件和参数。自 v1.5.0 起，用户只需要通过内置的 `gpdemo` 脚本，使用一条命令就能快速部署指定 Segment 数的 Cloudberry Database 集群。

`gpdemo` 将随其他系统工具（例如 `gpinitsystem`、`gpstart`、`gpstop` 等）一并安装到 `GPHOME/bin` 目录下。

:::warning 警告
除部署单计算节点的集群外，不建议将 `gpdemo` 用于生产环境。
:::

## 使用方法

在目标服务器上安装完成 RPM 包，并正确加载 `greenplum_path.sh` 后，即可执行 `gpdemo`。

### 默认部署

要快速创建一套集群，且对集群数据目录位置、初始端口、Segment 数量等无特殊要求，可无参数执行 `gpdemo`：

```bash
gpdemo
```

执行该命令后，脚本会在当前路径下创建测试集群。集群的默认配置如下：

- Segment 数：3
- 数据目录：`./datadirs`
- Coordinator 初始端口：`7000`

:::info 提示
创建完成后，脚本会在当前目录生成一个包含集群基本信息的 `gpdemo-env.sh` 文件。在使用 `gpdemo` 对集群进行操作前，你需要执行 `source gpdemo-env.sh` 以加载这些信息。

每次新建 shell 会话后都需要加载一次。你可以将这行指令加入到 `~/.bashrc` 或 `~/.zshrc` 来自动加载。
:::

### 带自定义配置的部署

如果需要对集群的 Segment 数量、数据目录位置、初始端口等进行定制，可参考以下说明。

#### 指定 Segment 数量

在默认部署下，集群的 Segment 数量为 3。

要指定集群的 Segment 数量，你可以在 `gpdemo` 命令中加入 `NUM_PRIMARY_MIRROR_PAIRS` 参数。例如指定 Segment 数量为 3，可执行：

```bash
NUM_PRIMARY_MIRROR_PAIRS=3 gpdemo
```

:::info 提示
- 每个 Segment 由一个 Primary 和一个 Mirror 组成，所以该参数值每增加一，将多创建两个节点。建议设置为奇数以更好地捕捉数据分布问题。
- 当设置为 0 时，将部署一个单计算节点集群，详见[部署单计算节点的 Cloudberry Database 集群](/i18n/zh/docusaurus-plugin-content-docs/current/deploy-cbdb-with-single-node.md)。
:::

#### 指定节点的数据目录

集群各节点的数据默认位于 `./datadirs`，即当前目录的 `datadirs` 子目录下。若想要指定集群的数据目录位置，你可以选择任一方法：

- 通过 `cd` 切换到目标目录，再执行 `gpdemo`。
- 在 `gpdemo` 命令中指定 `DATADIRS` 参数来设置数据目录，例如：

    ```bash
    DATADIRS=/target/directory/ gpdemo
    ```

:::info 提示
在部署完成后，如果你需要通过修改 `pg_hha.conf` 配置文件等方式手动调整数据目录的位置，可能需要知道 Coordinator 和各个 Segment 数据目录的默认位置：

- 普通多节点集群模式（即 `NUM_PRIMARY_MIRROR_PAIRS` > 0）
    - Coordinator：`./datadirs/qddir`
    - Coordinator Standby：`./datadirs/standby`
    - Segments
        - Primary：`./datadirs/dbfast<N>` 其中`<N>`为 Segment 编号。
        - Mirror：`./datadirs/dbfast_mirror<N>` 其中`<N>`为 Segment 编号。

- 单节点部署模式（即 `NUM_PRIMARY_MIRROR_PAIRS` = 0）
    - Coordinator：`./datadirs/singlenodedir`
    - Coordinator Standby：`./datadirs/standby`
:::

#### 指定集群 Coordinator 节点的初始端口

在默认部署下，集群的 Coordinator 端口为 `7000`，集群中所有其它节点的端口都是从该值起连续分配的。

要指定集群 Coordinator 节点的初始端口，你可以在 `gpdemo` 命令中加入 `PORT_BASE` 参数，例如：

```bash
PORT_BASE=7000 gpdemo
```

#### 指定集群每个节点的额外初始化参数

`BLDWRAP_POSTGRES_CONF_ADDONS` 指定集群每个节点的额外初始化参数。默认值为 `fsync=off` 以提供更好地并发性能。

**在生产环境下，请使用 `export BLDWRAP_POSTGRES_CONF_ADDONS="fsync=on"` 以启用 fsync，否则会影响集群的 ACID 特性。使用单节点模式时，fsync 会自动启用，不需要额外操作。**

## 命令行选项说明

`gpdemo` 提供若干命令行选项，解释如下，可通过 `gpdemo -H` 查看。

| 选项         | 作用                                                                                                                                                                          |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-K`         | 创建集群时，跳过数据一致性检查。不建议使用该选项，                                                                                                                            |
| `-c`         | 检查端口占用情况，确认是否可以创建测试集群。<br /><br />执行 `gpdemo -c` 前，你需要先执行 `source gpdemo-env.sh` 以加载集群基本信息。该 `sh` 文件位于创建集群时所在的目录下。           |
| `-d`         | 删除测试集群。<br /><br />执行 `gpdemo -d` 前，你需要先执行 `source gpdemo-env.sh` 以加载集群基本信息。该 `sh` 文件位于创建集群时所在的目录下。                                         |
| `-p`         | 查看 Coordinator 和各 Segment 上集群状态、版本等信息。<br /><br />执行 `gpdemo -p` 前，你需要先执行 `source gpdemo-env.sh` 以加载集群基本信息。该 `sh` 文件位于创建集群时所在的目录下。 |
| `-h` 或 `-H` | `gpdemo -h` 输出较为简略的帮助说明。`gpdemo -H` 输出较为详细的帮助说明，包括环境变量等额外配置。                                                                              |
| `-v`         | 查看当前的 `gpdemo` 版本。                                                                                                                                                    |
