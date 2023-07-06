---
title: Local Deployment Guide
---

# Local Deployment Guide

This document describes how to deploy Cloudberry Database in an on-premises environment. Before reading this document, first you need to read [On-Premises Deployment Architecture](./cbdb-op-deploy-arch.md) and [Software and Hardware Configuration Requirements](./cbdb-op-software-hardware.md).

:::info

The deployment methods described in this document are based on the [automatic high availability deployment architecture](./cbdb-op-deploy-arch.md#automatic-high-availability-deployment-architecture).

:::

:::info Glossary

- FTS stands for fault tolerance service. It is the fault recovery node and a high availability service component of Cloudberry Database.
- ETCD: Used to store the cluster topology information and cluster state metadata of Cloudberry Database.
- Hybrid Deployment: The ETCD and FTS clusters are deployed on the same physical machine as the database nodes.

:::

For the testing environment, you can choose any of the following deployment modes (click the link for a detailed description of the corresponding mode):

- [Minimal Deployment Mode](#minimal-deployment-mode): Suitable for quick verification or PoC testing scenarios. It requires less resources (at least 2 servers), but provides poor availability. In this deployment mode, the ETCD and FTS clusters are deployed on the database nodes in a hybrid way.
- [Single-Node Deployment Mode](#single-node-deployment-mode): Suitable for development testing or trial use by open-source users. It only requires single-node resource (that is, one server), and does not guarantee high availability. In this deployment mode, the ETCD and FTS clusters are deployed on a single node.

For the production environment, you can choose any of the following deployment modes (click the link for a detailed description of the corresponding mode):

- [Standard Distributed Deployment Mode](#standard-distributed-deployment-mode): Suitable for production environments, with the highest guarantee of availability. In this mode, you need additional machine resources to deploy the ETCD and FTS clusters independently.
- Hybrid Deployment Mode: Suitable for production environments, with high availability, but not as much as the standard distributed deployment mode. In this mode, the ETCD and FTS clusters are deployed on the database nodes in a hybrid way, without the need for additional machine resources.

## Test environment deployment

:::danger Warning

The following deployment modes are only for testing environments. Do not use the minimal deployment mode and the single-node deployment mode in production environments.

:::

### Minimal deployment mode

This mode is suitable for quick verification or PoC testing scenarios. It requires less resources and provides poor availability. In this deployment mode, you only need to deploy the FTS and ETCD services in a hybrid way on different nodes of the database, without the need to use additional machines to deploy FTS and ETCD as independent clusters.

The minimal deployment mode is a distributed deployment and requires at least 2 physical machines. To learn the configuration required for this mode, see [development and test environment configuration](./cbdb-op-software-hardware.md#development-and-test-environment).

The following are the steps to perform the minimal deployment:

#### Step 1: Plan the deployment

It is recommended to plan the nodes to be deployed according to the following table:

| Component           | Recommended number of physical machines | Description                                                            |
| :------------------ | :-------------------------------------- | :-------------------------------------------------------------------- |
| Master node         | 1                                       |                                                                        |
| Segment (computing node) | 1                                       |                                                                        |
| FTS node            | 0                                       | FTS clusters support hybrid deployment across multiple nodes, and you do not need to reserve separate physical machines for the deployment. Two nodes are deployed by default for availability. |
| ETCD metadata node  | 0                                       | ETCD clusters support multi-node deployment, and you do not need to reserve separate physical machines for the deployment. High availability is natively supported by the application. |

#### Step 2: Prepare configuration files

:::info Note

The following deployment operations are performed using the `gpadmin` user.

:::

1. Prepare 2 physical machines for cluster nodes. Edit the `/etc/hosts` file, and add the cluster nodes to the file, including all IP addresses and aliases in the cluster.

    ```
    # Loopback address       Hostname
    <ip_address 1>           master
    <ip_address 2>           segment1
    ```

2. On the master node, create a file named `all_host` and fill in all the host names in this file.

    ```
    master
    segment1
    ```

3. On the master node, create a file named `seg_host` and fill in all the host names of the Segments in this file.

    ```
    segment1
    ```

4. On the master node, create a file named `cbdb_etcd.conf`. Then write the following configuration items in the file.

    - `gp_etcd_endpoints`: Node names of the ETCD cluster service. You need to configure the node names with the hostnames of master and segment, and the ETCD service will start on these 2 hosts by default.
    - `gp_etcd_account_id`: Tenant ID. You can generate a globally unique UUID using the UUID tool and configure the item.
    - `gp_etcd_cluster_id`: Cluster ID. You can generate a globally unique UUID using the UUID tool and configure the item.

    An example of the configuration file is as follows:

    ```
    gp_etcd_endpoints='master:2379,standby:2379,seg1:2379'
    gp_etcd_account_id='e3cb5400-9589-918d-c178-82d500deac6e'
    gp_etcd_cluster_id='7bc05356-67f9-49fe-804e-12fe30b093ef'
    gp_etcd_namespace='default'
    ```

    :::info

    `gp_etcd_namespace` is the namespace configuration for the cluster, and the on-premises deployment mode can use the default configuration.

    :::

#### Step 4: Create data directory {#minimal-step-4}

1. Append a line of the `source` command in the `~/.bashrc` file on each node. For example:

    ```bash
    # /usr/local/cloudberry-db is the deployment directory for Cloudberry Database.

    source /usr/local/cloudberry-db/greenplum_path.sh
    ```

2. On the master node, use the `gpssh` command to create data directories and mirror directories for segments.

    ```bash
    # For example, /data0/primary and /data0/mirror.

    gpssh -f seg_host -e 'mkdir -p /data0/primary'
    gpssh -f seg_host -e 'mkdir -p /data0/mirror'
    ```

3. Create a data directory on the master node.

    ```bash
    # For example, /data0/master.

    mkdir -p /data0/master
    ```

4. Append a line of the following command to the `~/.bashrc` file on the master node, which is the path `{previous step's path} + gpseg-1`.

    ```bash
    export COORDINATOR_DATA_DIRECTORY=/data0/master/gpseg-1
    ```

5. Run the following command to make `COORDINATOR_DATA_DIRECTORY` effective.

    ```bash
    source ~/.bashrc
    ```

#### Step 5: Configure the `gpinitsystem_config` startup script

1. On the master node, copy the template configuration file to the current directory.

    ```bash
    cp $GPHOME/docs/cli_help/gpconfigs/gpinitsystem_config .
    ```

2. Edit the `gpinitsystem_config` file:

    - Modify the `DATA_DIRECTORY` configuration item to the data directory of the segment node, that is, `/data0/primary` in Step 2 of [Step 4: Create data directory](#minimal-step-4).
    - Modify `COORDINATOR_HOSTNAME` to the hostname of the master primary node.
    - Modify `COORDINATOR_DIRECTORY` to the data directory of the master primary node, that is, `/data0/master` in Step 3 of [Step 4: Create data directory](#minimal-step-4).

    The modified example configuration file is as follows:

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

    If there are segment mirror nodes, you also need to modify `MIRROR_PORT_BASE` and `MIRROR_DATA_DIRECTORY`.

    - `MIRROR_PORT_BASE` is the port used by the mirror.
    - `MIRROR_DATA_DIRECTORY` is the data directory of the mirror, that is, `data0/mirror` in Step 2 of [Step 4: Create data directory](#minimal-step-4).

    The modified example configuration file is as follows:

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

#### Step 6: Initialize the database

Initialize the database using the `gpinitsystem` command:

```bash
gpinitsystem -c gpinitsystem_config -p cbdb_etcd.conf -h seg_host
```

### Single-node deployment mode

Single-node deployment mode means deploying FTS and ETCD services on a single local node. This mode is mainly used for code development in testing scenarios. It does not support high availability features, and is not suitable for production environments.

The single-node deployment mode is non-distributed. All services are deployed on the same physical machine. To learn the configuration required for this mode, see [development and test environment configuration](./cbdb-op-software-hardware.md#development-and-test-environment).

<!-- 要进行单节点部署，执行以下步骤：

1. 下载 Cloudberry Database 源代码到本地目录，下载地址为 <https://github.com/cloudberrydb/cloudberrydb>。
2. 参考 Cloudberry Database 代码仓库中 README.md 文档，编译 Cloudberry Database 源代码并安装。
3. 执行 `make create-demo-cluster` 命令。-->

:::info

Currently, the steps for this deployment mode are on the way. Please keep watching.

:::

## Production deployment

### Standard distributed deployment mode

In this deployment mode, FTS and ETCD cluster nodes are deployed on separate physical machines. The system reliability is high, supporting automatic failover of master/standby nodes, which is suitable for production environments that require high availability.

To learn the configuration required for this mode, see [configuration for production environment](./cbdb-op-software-hardware.md#production-environment).

To deploy Cloudberry Database in this mode, take the following steps.

#### Step 1: Plan the deployment

It is recommended to plan the nodes to be deployed according to the following table:

| Component       | Recommended number of physical machines | Description |
| :-------------  | :---------------- | :---------- |
| Master node     | 1                |             |
| Standby node    | 1                | Standby nodes are used for hot backup of master nodes. |
| Segment (computing node) |  3      | It is recommended to deploy the same number of mirror nodes as computing nodes for high availability. |
| FTS node        | 3                | The FTS cluster supports multi-node independent deployment, with 3 nodes as the default configuration to ensure high availability. |
| ETCD metadata node | 3             | The ETCD cluster supports multi-node independent deployment, with high availability feature natively supported by the application. |

:::info Note

- The following deployment operations are all performed using the `gpadmin` user.
- It is recommended to deploy the FTS nodes and ETCD nodes on the same server to save resources.

:::

#### Step 2: Prepare configuration files

1. Prepare the corresponding physical machines according to the number of nodes planned in the previous step. Edit the `/etc/hosts` file. Then add all cluster nodes including all IP addresses and aliases. For example:

    ```
    # Loopback address       Hostname
    <ip_address 1>           master
    <ip_address 2>           standby 1
    <ip_address 3>           segment 1
    <ip_address 4>           segment 2
    <ip_address 5>           segment 3
    <ip_address 6>           etcd 1
    <ip_address 7>           etcd 2
    <ip_address 8>           etcd 3
    ```

2. On the master node, create a file named `all_host`, and fill in all the hostnames in this file.

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

3. On the master node, create a file named `seg_host`, and fill in all the hostnames of the segment nodes in this file.

    ```
    segment 1
    segment 2
    segment 3
    ```

4. On the master node, create a file named `fts_service.conf`, and fill in all the hostnames of the FTS nodes.

    :::note

    To save hardware resources, you do not need to deploy the FTS service in a separate cluster. It is recommended to co-deploy it with the ETCD service on the ETCD servers.

    :::

    ```
    etcd 1
    etcd 2
    etcd 3
    ```

5. On the master node, create a file named `etcd_service.conf`, and fill in all the hostnames of the ETCD nodes.

    ```
    etcd 1
    etcd 2
    etcd 3
    ```

4. On the master node, create a file named `cbdb_etcd.conf`. Then write the following configuration items in the file.

    - `gp_etcd_endpoints`: Node names of the ETCD cluster service. You need to configure the ETCD service node hosts `{etcd-service-0}`, `{etcd-service-1}`, and `{etcd-service-2}` in `etcd_service.conf`. The ETCD service will start on these 3 hosts by default.
    - `gp_etcd_account_id`: Tenant ID. You can generate a globally unique UUID using the UUID tool and configure the item.
    - `gp_etcd_cluster_id`: Cluster ID. You can generate a globally unique UUID using the UUID tool and configure the item.

    An example of the configuration file is as follows:

    ```conf
    gp_etcd_endpoints='{etcd-service-0}:2379,{etcd-service-1}:2379,{etcd-service-2}:2379'
    gp_etcd_account_id='e3cb5400-9589-918d-c178-82d500deac6e'
    gp_etcd_cluster_id='7bc05356-67f9-49fe-804e-12fe30b093ef'
    gp_etcd_namespace='default'
    ```

    :::info

    `gp_etcd_namespace` is the namespace configuration for the cluster, and the on-premises deployment mode can use the default configuration.

    :::

    For example, to deploy 3 ETCD hosts: etcd1, etcd2, etcd3.

    ```conf
    gp_etcd_endpoints='etcd1:2379,etcd2:2379,etcd3:2379'
    gp_etcd_account_id='e3cb5400-9589-918d-c178-82d500deac6e'
    gp_etcd_cluster_id='7bc05356-67f9-49fe-804e-12fe30b093ef'
    gp_etcd_namespace='default'
    ```

#### Step 3: Configure SSH keyless authentication for the `gpadmin` account

With the `gpadmin` user of the master host, use the `ssh-copy-id` command to configure keyless authentication. Here is an example:

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

#### Step 4: Create data directories {#standard-step-4}

1. In the `~/.bashrc` file of each node, add a line of the `source` command. Here is an example:

    ```bash
    # /usr/local/cloudberry-db is the deployment directory of Cloudberry Database.

    source /usr/local/cloudberry-db/greenplum_path.sh
    ```

2. On the master node, use the `gpssh` command to create data directories and mirror directories for segments.

    ```bash
    # For example, /data0/primary and /data0/mirror.

    gpssh -f seg_host -e 'mkdir -p /data0/primary'
    gpssh -f seg_host -e 'mkdir -p /data0/mirror'
    ```

3. Create a data directory on the master node.

    ```bash
    # For example, /data0/master

    mkdir -p /data0/master
    ```

4. Create a data directory on the standby node.

    ```bash
    # For example, /data0/master.

    gpssh -h standby -e 'mkdir -p /data0/master'
    ```

5. In the `~/.bashrc` file of master and standby nodes, add the following line of command, which is the path `{path in the previous step}` + `gpseg-1`.

    ```bash
    export COORDINATOR_DATA_DIRECTORY=/data0/master/gpseg-1
    ```

6. Run the following command to make `COORDINATOR_DATA_DIRECTORY` effective.

    ```bash
    source ~/.bashrc
    ```

#### Step 5: Configure the `gpinitsystem_config` startup script

1. On the master node, copy the template configuration file to the current directory.

    ```bash
    cp $GPHOME/docs/cli_help/gpconfigs/gpinitsystem_config .
    ```

2. Edit the `gpinitsystem_config` file:

    - Modify the `DATA_DIRECTORY` configuration item to the data directory of the segment node, that is, `/data0/primary` in Step 2 of [Step 4: Create data directory](#standard-step-4).
    - Modify `COORDINATOR_HOSTNAME` to the hostname of the master primary node.
    - Modify `COORDINATOR_DIRECTORY` to the data directory of the master primary node, that is, `/data0/master` in Step 3 of [Step 4: Create data directory](#standard-step-4).

    The modified example configuration file is as follows:

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

    If there are segment mirror nodes, you also need to modify `MIRROR_PORT_BASE` and `MIRROR_DATA_DIRECTORY`.

    - `MIRROR_PORT_BASE` is the port used by the mirror.
    - `MIRROR_DATA_DIRECTORY` is the data directory of the mirror, that is, `data0/mirror` in Step 2 of [Step 4: Create data directory](#standard-step-4).

    The modified example configuration file is as follows:

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

#### Step 6: Initialize the database

Initialize the database using the `gpinitsystem` command:

```bash
gpinitsystem -c gpinitsystem_config -p cbdb_etcd.conf -F fts_service.conf  -E etcd_service.conf -h seg_host -s standby
```

### 混合部署模式

该模式为 CloudBerry Database FTS、ETCD 服务的外部独立部署模式，FTS 和 ETCD 服务复用已有的数据库物理机部署。你不需要额外为 FTS 和 ETCD 部署物理机器，系统可靠性没有标准分布式部署高。该部署模式支持 Master/Standby 节点自动切换故障恢复。

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
