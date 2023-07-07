---
title: 物理机部署指南
---

# 物理机部署指南

本文档介绍如何在物理机环境中部署 Cloudberry Database。在阅读本文前，你需要先阅读 [Cloudberry Database 物理机部署架构](./cbdb-op-deploy-arch.md) 和 [Cloudberry Database 软硬件配置需求](./cbdb-op-software-hardware.md)。

:::info 注意

本文所介绍的部署方法，都基于[自动高可用部署架构](./cbdb-op-deploy-arch.md#自动高可用部署架构)。

:::

:::info 名词解释

- FTS，全称为 Fault Tolerance Service，即故障恢复节点，为 Cloudberry Database 的高可用服务组件。
- ETCD：用于存储 Cloudberry Database 集群拓扑信息以及集群状态元数据信息。
- 混合部署：将 ETCD 和 FTS 集群部署在与数据库节点的同一物理机资源上。

:::

对于测试环境，你可以选择以下任一部署模式（点击链接查看对应模式的详细说明）：

- [最小化部署模式](#最小化部署模式)：适用于快速验证或者 PoC 测试场景。资源需求小（至少需要两台服务器），可用性保障较差。在该部署模式下，ETCD 和 FTS 集群混合方式部署于数据库节点。
- [单节点部署模式](#单节点部署模式)：适用于研发测试或开源用户试用场景。只需单节点资源（即一台服务器），无高可用保障。在该部署模式下，ETCD 和 FTS 集群部署于单节点上。

对于生产环境，你可以选择以下任一部署模式（点击链接查看对应模式的详细说明）：

- [标准分布式部署模式](#标准分布式部署模式)：适用于生产环境，可用性保障最高。在该模式下，你需要额外的机器资源来独立部署 ETCD 和 FTS 集群。
- [混合部署模式](#混合部署模式)：适用于生产环境，可用性保障较高，但不如标准分布式部署。在该模式下，ETCD 和 FTS 集群混合部署于数据库节点，无需额外的机器资源。

## 测试环境部署

:::danger 警告

以下部署模式仅适用于测试环境。请勿在生产环境下使用最小化部署和单节点部署。

:::

### 最小化部署模式

该模式适用于快速验证或者 PoC 测试场景。资源需求小，可用性保障较差。在该部署模式下，你只需将 FTS 和 ETCD 服务混合部署在数据库的不同节点上，无需使用额外的机器将 FTS 和 ETCD 部署为独立的集群。

最小化部署模式为分布式部署，至少需要两台物理机器。该模式所需的物理机配置参见[开发及测试环境配置](./cbdb-op-software-hardware.md#开发及测试环境)。

最小化部署的方法如下：

#### 第 1 步：规划部署

建议按照下表来规划待部署的节点：

| 组件              | 建议的物理机数量 | 说明                                                         |
| :----------------- | :---------------- | :------------------------------------------------------------ |
| Master 节点       | 1                |                                                              |
| Segment 计算节点 | 1                |                                                              |
| FTS 节点          | 0                 | FTS 集群支持多节点混合部署，无需单独预留物理机，默认配置 2 节点保证可用性。 |
| ETCD 元数据节点   | 0                | ETCD 集群支持多节点部署，无需单独预留物理机，节点高可用功能由应用原生支持。 |

#### 第 2 步：准备配置文件

:::info 注意

以下部署安装操作均在 `gpadmin` 用户下进行。

:::

1. 准备好两台物理机器作为集群节点。编辑 `/etc/hosts` 文件，在该文件中加入集群节点，包括集群中的所有 IP 地址和别名。

    ```
    # Loopback address       Hostname
    <ip_address 1>           master
    <ip_address 2>           segment1
    ```

2. 在 Master 节点上创建名为 `all_host` 的文件，并在该文件中填入所有的主机名。

    ```
    master
    segment1
    ```

3. 在 Master 节点上创建名为 `seg_host` 的文件，并在该文件中填入所有 Segment 的主机名。

    ```
    segment1
    ```

4. 在 Master 节点上创建名为 `cbdb_etcd.conf` 的文件。并在文件中写入以下配置项。

    - `gp_etcd_endpoints`：ETCD 集群服务的节点名称，需要配置为 Master 和 Segment 的主机名，ETCD 服务会默认在这两台主机上启动。
    - `gp_etcd_account_id`：租户 ID。你可以使用 UUID 工具生成并配置为全局唯一的 UUID。
    - `gp_etcd_cluster_id`：集群 ID。你可以使用 UUID 工具生成并配置为全局唯一的 UUID。

    配置文件示例如下：

    ```
    gp_etcd_endpoints='master:2379,standby:2379,seg1:2379'
    gp_etcd_account_id='e3cb5400-9589-918d-c178-82d500deac6e'
    gp_etcd_cluster_id='7bc05356-67f9-49fe-804e-12fe30b093ef'
    gp_etcd_namespace='default'
    ```

    :::info 注意

    `gp_etcd_namespace` 为集群的 namespace 配置，物理机部署方式使用默认配置即可。

    :::

#### 第 3 步：配置 `gpadmin` 账号的 SSH 免密

在 Master 主机的 `gpadmin` 用户下，使用 `ssh-copy-id` 命令配置免密。

```shell
ssh-copy-id -f master
ssh-copy-id -f seg1
```

#### 第 4 步：创建数据目录 {#最小化第-4-步}

1. 在每个节点的 `~/.bashrc` 文件中中添加一行 `source` 命令。示例如下：

    ```bash
    # /usr/local/cloudberry-db 为 Cloudberry Database 的安装目录

    source /usr/local/cloudberry-db/greenplum_path.sh
    ```

2. 在 Master 节点上，使用 `gpssh` 命令为 Segment 创建数据目录和镜像 Mirror 目录。

    ```bash
    # 在本例中分别为 /data0/primary 和 /data0/mirror

    gpssh -f seg_host -e 'mkdir -p /data0/primary'
    gpssh -f seg_host -e 'mkdir -p /data0/mirror'
    ```

3. 在 Master 上创建数据目录。

    ```bash
    # 在本例中为 /data0/master

    mkdir -p /data0/master
    ```

4. 在 Master 节点的 `～/.bashrc` 文件中，再添加如下一行命令，其为路径为 `{上一步路径} + gpseg-1`。

    ```bash
    export COORDINATOR_DATA_DIRECTORY=/data0/master/gpseg-1
    ```

5. 执行以下命令，使 `COORDINATOR_DATA_DIRECTORY` 生效。

    ```bash
    source ~/.bashrc
    ```

#### 第 5 步：配置 `gpinitsystem_config` 启动脚本

1. 在 Master 节点上，将模板配置文件复制到当前目录。

    ```bash
    cp $GPHOME/docs/cli_help/gpconfigs/gpinitsystem_config .
    ```

2. 修改 `gpinitsystem_config` 文件：

    - 将 `DATA_DIRECTORY` 配置项修改为 Segment 计算节点的数据目录，即[第 4 步：创建数据目录](#最小化第-4-步)中第 2 步的 `/data0/primary`。
    - 将 `COORDINATOR_HOSTNAME` 改为 Master 主节点的主机名。
    - 将 `COORDINATOR_DIRECTORY` 修改为 Master 主节点的数据目录，即[第 4 步：创建数据目录](#最小化第-4-步)中第 3 步的 `/data0/master`。

    修改后的示例配置文件如下：

    ```toml
    #### Base number by which primary segment port numbers 
    #### are calculated.
    PORT_BASE=6000
    
    #### File system location(s) where primary segment data directories 
    #### will be created. The number of locations in the list dictate
    #### the number of primary segments that will get created per
    #### physical host (if multiple addresses for a host are listed in 
    #### the hostfile, the number of segments will be spread evenly across
    #### the specified interface addresses).
    declare -a DATA_DIRECTORY=(/data0/primary)
    
    #### OS-configured hostname or IP address of the coordinator host.
    COORDINATOR_HOSTNAME=master
    
    #### File system location where the coordinator data directory 
    #### will be created.
    COORDINATOR_DIRECTORY=/data0/master
    
    #### Port number for the coordinator instance. 
    COORDINATOR_PORT=5432
    
    #### Shell utility used to connect to remote hosts.
    TRUSTED_SHELL=ssh
    
    #### Default server-side character set encoding.
    ENCODING=UNICODE
    ```

    若存在 Segment Mirror 节点，还需修改 `MIRROR_PORT_BASE` 和`MIRROR_DATA_DIRECTORY`。

    - `MIRROR_PORT_BASE` 为 Mirror 使用的端口。
    - `MIRROR_DATA_DIRECTORY` 为 Mirror 的数据目录，即[第 4 步：创建数据目录](#最小化第-4-步)中第 2 步的 `data0/mirror`。

    修改后的示例配置文件如下：

    ```toml
    #### Base number by which mirror segment port numbers 
    #### are calculated.
    MIRROR_PORT_BASE=17000
    
    #### File system location(s) where mirror segment data directories 
    #### will be created. The number of mirror locations must equal the
    #### number of primary locations as specified in the 
    #### DATA_DIRECTORY parameter.
    declare -a MIRROR_DATA_DIRECTORY=(data0/mirror)
    ```

#### 第 6 步：初始化数据库

使用 `gpinitsystem` 命令初始化数据库。

```bash
gpinitsystem -c gpinitsystem_config -p cbdb_etcd.conf -h seg_host
```

### 单节点部署模式

单节点部署模式即在本地单节点上部署 FTS 和 ETCD 服务。该模式主要用于研发测试场景，不支持高可用功能，不适用于生产环境。

单节点部署模式为非分布式部署，所有服务都部署在同一台物理机上。该模式所需的物理机配置参见[开发及测试环境配置](./cbdb-op-software-hardware.md#开发及测试环境)。

<!-- 要进行单节点部署，执行以下步骤：

1. 下载 Cloudberry Database 源代码到本地目录，下载地址为 <https://github.com/cloudberrydb/cloudberrydb>。
2. 参考 Cloudberry Database 代码仓库中 README.md 文档，编译 Cloudberry Database 源代码并安装。
3. 执行 `make create-demo-cluster` 命令。-->

部署方法待添加。

## 生产环境部署

### 标准分布式部署模式

该部署模式下，FTS 和 ETCD 集群节点部署在独立的物理机器上。系统可靠性较高，支持 Master/Standby 节点自动切换故障恢复，适用于对高可用性有要求的生产环境。

该模式部署所需的物理机配置参见[生产环境配置](./cbdb-op-software-hardware.md#生产环境)。

该模式的部署方法如下：

#### 第 1 步：规划部署

建议按照下表来规划待部署的节点：

| 组件              | 建议的物理机数量 | 说明                                                         |
| :----------------- | :---------------- | :------------------------------------------------------------ |
| Master 节点       | 1                |                                                              |
| Standby 节点 | 1 | Standby 节点用于 Master 节点的热备份。 |
| Segment 计算节点 |  3               | 推荐部署与计算节点数量相同的 Mirror 节点做数据高可用。 |
| FTS 节点          | 3 | FTS 集群支持多节点独立部署，默认配置 3 节点保证高可用。 |
| ETCD 元数据节点   | 3               | ETCD 集群支持多节点独立部署，节点高可用功能由应用原生支持。 |

:::info 注意

- 以下部署安装操作均在 `gpadmin` 用户下进行。
- 建议将 FTS 节点和 ETCD 节点部署在同一台服务器上，以节约资源。

:::

#### 第 2 步：准备配置文件

1. 按照上一步规划的节点数，准备好对应的物理机。编辑 `/etc/hosts` 文件，在该文件中加入集群节点，包括集群中的所有 IP 地址和别名。

    ```
    # Loopback address       Hostname
    <ip_address 1>           master
    <ip_address 2>           standby 1
    <ip_address 3>           segment 1
    <ip_address 4>           segment 2
    <ip_address 5>           segment 3
    <ip_address 6>           etcd 1
    <ip_address 7>          etcd 2
    <ip_address 8>          etcd 3
    ```

2. 在 Master 节点上创建名为 `all_host` 的文件，并在该文件中填入所有的主机名。

    ```
    master
    standby
    segment 1
    segment 2
    segment 3
    etcd 1
    etcd 2
    etcd 3
    ```

3. 在 Master 节点上创建名为 `seg_host` 的文件，并在该文件中填入所有 Segment 的主机名。

    ```
    segment 1
    segment 2
    segment 3
    ```

4. 在 Master 节点上创建名为 `fts_service.conf` 的文件，填入所有 FTS 节点的主机名。

    :::note 说明

    为节省硬件资源，FTS 服务不用单独部署集群，建议和 ETCD 服务混合部署在 ETCD 服务器上。

    :::

    ```
    etcd 1
    etcd 2
    etcd 3
    ```

5. 在 Master 节点上创建名为 `etcd_service.conf` 的文件，填入所有 ETCD 节点的主机名。

    ```
    etcd 1
    etcd 2
    etcd 3
    ```

6. 在 Master 节点上创建名为 `cbdb_etcd.conf` 的文件。并在文件中写入以下配置项。

    - `gp_etcd_endpoints`：ETCD 集群服务的节点名称，此处需要配置 `etcd_service.conf` 中指定的 ETCD 服务节点主机 `{etcd-service-0}`，`{etcd-service-1}`，`{etcd-service-2}`。ETCD 服务会默认在这三个主机上启动。
    - `gp_etcd_account_id`：租户 ID。你可以使用 UUID 工具生成并配置为全局唯一的 UUID。
    - `gp_etcd_cluster_id`：集群 ID。你可以使用 UUID 工具生成并配置为全局唯一的 UUID。

    配置文件示例如下：

    ```conf
    gp_etcd_endpoints='{etcd-service-0}:2379,{etcd-service-1}:2379,{etcd-service-2}:2379'
    gp_etcd_account_id='e3cb5400-9589-918d-c178-82d500deac6e'
    gp_etcd_cluster_id='7bc05356-67f9-49fe-804e-12fe30b093ef'
    gp_etcd_namespace='default'
    ```

    :::info 注意

    `gp_etcd_namespace` 为集群的 namespace 配置，物理机部署方式使用默认配置即可。

    :::

    以部署配置三台 ETCD 主机名 etcd1，etcd2，etcd3 为例：

    ```conf
    gp_etcd_endpoints='etcd1:2379,etcd2:2379,etcd3:2379'
    gp_etcd_account_id='e3cb5400-9589-918d-c178-82d500deac6e'
    gp_etcd_cluster_id='7bc05356-67f9-49fe-804e-12fe30b093ef'
    gp_etcd_namespace='default'
    ```

#### 第 3 步：配置 `gpadmin` 账号的 SSH 免密

在 Master 主机的 `gpadmin` 用户下，使用 `ssh-copy-id` 命令配置免密。示例如下：

```shell
ssh-copy-id -f master
ssh-copy-id -f standby
ssh-copy-id -f seg1
ssh-copy-id -f seg2
ssh-copy-id -f seg3
ssh-copy-id -f etcd1
ssh-copy-id -f etcd2
ssh-copy-id -f etcd3
```

#### 第 4 步：创建数据目录 {#标准第-4-步}

1. 在每个节点的 `~/.bashrc` 文件中中添加一行 `source` 命令。示例如下：

    ```bash
    # /usr/local/cloudberry-db 为 Cloudberry Database 的安装目录

    source /usr/local/cloudberry-db/greenplum_path.sh
    ```

2. 在 Master 节点上，使用 `gpssh` 命令为 Segment 创建数据目录和镜像 Mirror 目录。

    ```bash
    # 在本例中分别为 /data0/primary 和 /data0/mirror

    gpssh -f seg_host -e 'mkdir -p /data0/primary'
    gpssh -f seg_host -e 'mkdir -p /data0/mirror'
    ```

3. 在 Master 上创建数据目录。

    ```bash
    # 在本例中为 /data0/master

    mkdir -p /data0/master
    ```

4. 在 Standby 节点上创建数据目录。

    ```bash
    # 本例中为 /data0/master

    gpssh -h standby -e 'mkdir -p /data0/master'
    ```

5. 在 Master 和 Standby 节点的 `～/.bashrc` 文件中，再添加如下一行命令，其为路径为 `{上一步路径} + gpseg-1`。

    ```bash
    export COORDINATOR_DATA_DIRECTORY=/data0/master/gpseg-1
    ```

6. 执行以下命令，使 `COORDINATOR_DATA_DIRECTORY` 生效。

    ```bash
    source ~/.bashrc
    ```

#### 第 5 步：配置 `gpinitsystem_config` 启动脚本

1. 在 Master 节点上，将模板配置文件复制到当前目录。

    ```bash
    cp $GPHOME/docs/cli_help/gpconfigs/gpinitsystem_config .
    ```

2. 修改 `gpinitsystem_config` 文件：

    - 将 `DATA_DIRECTORY` 配置项修改为 Segment 计算节点的数据目录，即[第 4 步：创建数据目录](#标准第-4-步)中第 2 步的 `/data0/primary`。
    - 将 `COORDINATOR_HOSTNAME` 改为 Master 主节点的主机名。
    - 将 `COORDINATOR_DIRECTORY` 修改为 Master 主节点的数据目录，即[第 4 步：创建数据目录](#标准第-4-步)中第 3 步的 `/data0/master`。

    修改后的示例配置文件如下：

    ```toml
    #### Base number by which primary segment port numbers 
    #### are calculated.
    PORT_BASE=6000
    
    #### File system location(s) where primary segment data directories 
    #### will be created. The number of locations in the list dictate
    #### the number of primary segments that will get created per
    #### physical host (if multiple addresses for a host are listed in 
    #### the hostfile, the number of segments will be spread evenly across
    #### the specified interface addresses).
    declare -a DATA_DIRECTORY=(/data0/primary)
    
    #### OS-configured hostname or IP address of the coordinator host.
    COORDINATOR_HOSTNAME=master
    
    #### File system location where the coordinator data directory 
    #### will be created.
    COORDINATOR_DIRECTORY=/data0/master
    
    #### Port number for the coordinator instance. 
    COORDINATOR_PORT=5432
    
    #### Shell utility used to connect to remote hosts.
    TRUSTED_SHELL=ssh
    
    #### Default server-side character set encoding.
    ENCODING=UNICODE
    ```

    若存在 Segment Mirror 节点，还需修改 `MIRROR_PORT_BASE` 和 `MIRROR_DATA_DIRECTORY`。

    - `MIRROR_PORT_BASE` 为 Mirror 使用的端口。
    - `MIRROR_DATA_DIRECTORY` 为 Mirror 的数据目录，即[第 4 步：创建数据目录](#标准第-4-步)中第 2 步的 `data0/mirror`。

    修改后的示例配置文件如下：

    ```toml
    #### Base number by which mirror segment port numbers 
    #### are calculated.
    MIRROR_PORT_BASE=17000
    
    #### File system location(s) where mirror segment data directories 
    #### will be created. The number of mirror locations must equal the
    #### number of primary locations as specified in the 
    #### DATA_DIRECTORY parameter.
    declare -a MIRROR_DATA_DIRECTORY=(data0/mirror)
    ```

#### 第 6 步：初始化数据库

使用 `gpinitsystem` 命令初始化数据库。

```bash
gpinitsystem -c gpinitsystem_config -p cbdb_etcd.conf -F fts_service.conf  -E etcd_service.conf -h seg_host -s standby
```

### 混合部署模式

该模式下，FTS 和 ETCD 服务复用已有的数据库物理机部署。你不需要额外为 FTS 和 ETCD 部署物理机器，系统可靠性没有标准分布式部署高。该部署模式支持 Master/Standby 节点自动切换故障恢复。

该模式部署所需的物理机配置参见[生产环境配置](./cbdb-op-software-hardware.md#生产环境)。

#### 第 1 步：规划部署

建议按照下表来规划待部署的节点：

| 组件              | 建议的物理机数量 | 说明                                                         |
| :----------------- | :---------------- | :------------------------------------------------------------ |
| Master 节点       | 1                |                                                              |
| Standby 节点 | 1 | Standby 节点用于 Master 节点的热备份。 |
| Segment 计算节点 | 3 | 推荐部署与计算节点数量相同的 Mirror 节点做数据高可用。数据节点需要根据用户的数据需求，相关硬件（机器挂载盘数量）来确定。 |
| FTS 节点          | 3 | FTS 集群支持多节点混合部署，无需单独预留物理机，默认配置 3 节点保证高可用。 |
| ETCD 元数据节点   | 3               | ETCD 集群支持多节点部署，无需单独预留物理机，节点高可用功能由应用原生支持。 |

:::info 注意

- 以下部署安装操作均在 `gpadmin` 用户下进行。
- 由于 Segment 为计算节点，如果将 ETCD 和 FTS 服务部署在计算节点，在生产环境下可能会有性能相关问题。为避免性能相关问题，建议通过配置文件指定一台额外的物理机 `{host}` 来部署 ETCD 和 FTS 服务，以提升系统可靠性，即 master + standby + {host} 部署。

:::

#### 第 2 步：准备配置文件

1. 按照上一步规划的节点数，准备好对应的物理机。编辑 `/etc/hosts` 文件，在该文件中加入集群节点，包括集群中的所有 IP 地址和别名。

    ```
    # Loopback address       Hostname
    <ip_address 1>           master
    <ip_address 2>           standby 1
    <ip_address 3>           segment 1
    <ip_address 4>           segment 2
    <ip_address 5>           segment 3
    ```

2. 在 Master 节点上创建名为 `all_host` 的文件，并在该文件中填入所有的主机名。

    ```
    master
    standby
    segment 1
    segment 2
    segment 3
    ```

3. 在 Master 节点上创建名为 `seg_host` 的文件，并在该文件中填入所有 Segment 的主机名。

    ```
    segment 1
    segment 2
    segment 3
    ```

4. 在 Master 节点上创建名为 `cbdb_etcd.conf` 的文件。并在文件中写入以下配置项。

    - `gp_etcd_endpoints`：ETCD 集群服务的节点名称，此处需要配置为 Master、Standby 和需配置 ETCD 的 Segment 主机名。ETCD 服务会默认在三个主机上启动。
    - `gp_etcd_account_id`：租户 ID。你可以使用 UUID 工具生成并配置为全局唯一的 UUID。
    - `gp_etcd_cluster_id`：集群 ID。你可以使用 UUID 工具生成并配置为全局唯一的 UUID。

    配置文件示例如下：

    ```conf
    gp_etcd_endpoints='master:2379,standby:2379,seg1:2379'
    gp_etcd_account_id='e3cb5400-9589-918d-c178-82d500deac6e'
    gp_etcd_cluster_id='7bc05356-67f9-49fe-804e-12fe30b093ef'
    gp_etcd_namespace='default'
    ```

    :::info 注意

    `gp_etcd_namespace` 为集群的 namespace 配置，物理机部署方式使用默认配置即可。

    :::

#### 第 3 步：配置 `gpadmin` 账号的 SSH 免密

在 Master 主机的 `gpadmin` 用户下，使用 `ssh-copy-id` 命令配置免密。示例如下：

```shell
ssh-copy-id -f master
ssh-copy-id -f standby
ssh-copy-id -f seg1
ssh-copy-id -f seg2
ssh-copy-id -f seg3
```

#### 第 4 步：创建数据目录 {#混合第-4-步}

1. 在每个节点的 `~/.bashrc` 文件中中添加一行 `source` 命令。示例如下：

    ```bash
    # /usr/local/cloudberry-db 为 Cloudberry Database 的安装目录

    source /usr/local/cloudberry-db/greenplum_path.sh
    ```

2. 在 Master 节点上，使用 `gpssh` 命令为 Segment 创建数据目录和镜像 Mirror 目录。

    ```bash
    # 在本例中分别为 /data0/primary 和 /data0/mirror

    gpssh -f seg_host -e 'mkdir -p /data0/primary'
    gpssh -f seg_host -e 'mkdir -p /data0/mirror'
    ```

3. 在 Master 上创建数据目录。

    ```bash
    # 在本例中为 /data0/master

    mkdir -p /data0/master
    ```

4. 在 Standby 节点上创建数据目录。

    ```bash
    # 本例中为 /data0/master

    gpssh -h standby -e 'mkdir -p /data0/master'
    ```

5. 在 Master 和 Standby 节点的 `～/.bashrc` 文件中，再添加如下一行命令，其为路径为 `{上一步路径} + gpseg-1`。

    ```bash
    export COORDINATOR_DATA_DIRECTORY=/data0/master/gpseg-1
    ```

6. 执行以下命令，使 `COORDINATOR_DATA_DIRECTORY` 生效。

    ```bash
    source ~/.bashrc
    ```

#### 第 5 步：配置 `gpinitsystem_config` 启动脚本

1. 在 Master 节点上，将模板配置文件复制到当前目录。

    ```bash
    cp $GPHOME/docs/cli_help/gpconfigs/gpinitsystem_config .
    ```

2. 修改 `gpinitsystem_config` 文件：

    - 将 `DATA_DIRECTORY` 配置项修改为 Segment 计算节点的数据目录，即[第 4 步：创建数据目录](#混合第-4-步)中第 2 步的 `/data0/primary`。
    - 将 `COORDINATOR_HOSTNAME` 改为 Master 主节点的主机名。
    - 将 `COORDINATOR_DIRECTORY` 修改为 Master 主节点的数据目录，即[第 4 步：创建数据目录](#混合第-4-步)中第 3 步的 `/data0/master`。

    修改后的示例配置文件如下：

    ```toml
    #### Base number by which primary segment port numbers 
    #### are calculated.
    PORT_BASE=6000

    #### File system location(s) where primary segment data directories 
    #### will be created. The number of locations in the list dictate
    #### the number of primary segments that will get created per
    #### physical host (if multiple addresses for a host are listed in 
    #### the hostfile, the number of segments will be spread evenly across
    #### the specified interface addresses).
    declare -a DATA_DIRECTORY=(/data0/primary)

    #### OS-configured hostname or IP address of the coordinator host.
    COORDINATOR_HOSTNAME=master

    #### File system location where the coordinator data directory 
    #### will be created.
    COORDINATOR_DIRECTORY=/data0/master

    #### Port number for the coordinator instance. 
    COORDINATOR_PORT=5432

    #### Shell utility used to connect to remote hosts.
    TRUSTED_SHELL=ssh

    #### Default server-side character set encoding.
    ENCODING=UNICODE
    ```

    若存在 Segment Mirror 节点，还需修改 `MIRROR_PORT_BASE` 和`MIRROR_DATA_DIRECTORY`。

    - `MIRROR_PORT_BASE` 为 Mirror 使用的端口。
    - `MIRROR_DATA_DIRECTORY` 为 Mirror 的数据目录，即[第 4 步：创建数据目录](#混合第-4-步)中第 2 步的 `data0/mirror`。

    修改后的示例配置文件如下：

    ```toml
    #### Base number by which mirror segment port numbers 
    #### are calculated.
    MIRROR_PORT_BASE=17000
    
    #### File system location(s) where mirror segment data directories 
    #### will be created. The number of mirror locations must equal the
    #### number of primary locations as specified in the 
    #### DATA_DIRECTORY parameter.
    declare -a MIRROR_DATA_DIRECTORY=(data0/mirror)
    ```

#### 第 6 步：初始化数据库

使用 `gpinitsystem` 命令初始化数据库。`-s` 参数用于指定 Standby 的主机名。

```bash
gpinitsystem -c gpinitsystem_config -p cbdb_etcd.conf -h seg_host -s standby
```

## 注意事项

- 自动检测 Master 是否失效，并自动将 Standby 升级为 Master 的功能需要在系统执行两次 dml 才能开启。
- ETCD 服务至少需要存活 2 个节点才能正常工作，FTS 只要存活 1 个节点就能正常工作。
- FTS 节点的日志存放在 `/tmp/fts/log` 文件夹中。



