---
title: 软硬件配置需求
---

# 软硬件配置需求

本文介绍 Cloudberry Database 所需要的软件和硬件配置需求。

## 硬件需求

### 物理机

以下介绍 Cloudberry Database 在测试和生产环境中，推荐的物理机配置。

#### 开发及测试环境

| 组件    | CPU  | 内存 | 硬盘类型 | 网络                 | 实例数量 |
| ------- | ---- | ---- | -------- | -------------------- | -------- |
| Coordinator  | 4 核 | 8 GB | SSD      | 万兆网卡（2 块最佳） | 1+       |
| Segment | 4 核 | 8 GB | SSD      | 万兆网卡（2 块最佳） | 1+       |
| ETCD    | 2 核 | 4 GB | SSD      | 万兆网卡（2 块最佳） | 2+       |
| FTS     | 2 核 | 4 GB | SSD      | 万兆网卡（2 块最佳） | 1+       |

#### 生产环境

| 组件    | CPU    | 内存   | 硬盘类型 | 网络                 | 实例数量 |
| ------- | ------ | ------ | -------- | -------------------- | -------- |
| Coordinator  | 16 核+ | 32 GB+ | SSD      | 万兆网卡（2 块最佳） | 2+       |
| Segment | 8 核+  | 32 GB+ | SSD      | 万兆网卡（2 块最佳） | 2+       |
| ETCD    | 16 核+ | 64 GB+ | SSD      | 万兆网卡（2 块最佳） | 3+       |
| FTS     | 4 核+  | 8+ GB   | SSD      | 万兆网卡（2 块最佳） | 3+       |

### 存储

- 为了避免数据盘在高负载的情况下，影响操作系统正常的 I/O 响应，操作系统应当与数据盘挂载到不同的磁盘上。
- 在主机配置允许的情况下，建议使用 2 个独立的 SAS 磁盘作为系统盘（RAID1），另外 10 块 SAS 磁盘作为数据盘（RAID5）。 
- 建议使用 LVM 逻辑卷管理磁盘，以获取更灵活的磁盘配置。

关于系统盘：系统盘应当使用独立的磁盘，以避免数据盘高负载时，影响操作系统的运行。建议系统盘为双盘 RAID 1 的配置。建议系统盘操作系统为 XFS。

关于数据盘：建议使用 LVM 管理数据盘。经过测试，为每个物理卷创建一个独立的逻辑卷能获得最好的磁盘性能。示例如下：

```bash
pvcreate /dev/vdb
pvcreate /dev/vdc
pvcreate /dev/vdd
vgcreate data /dev/vdb /dev/vdc /dev/vdd
lvcreate --extents 100%pvs -n data0 data /dev/vdb
lvcreate --extents 100%pvs -n data1 data /dev/vdc
lvcreate --extents 100%pvs -n data2 data /dev/vdd 
```

挂载点名称需连续，数据盘的挂载点应当为 `/data0`，`/data1`，...，`/dataN`。数据盘应当使用 XFS 文件系统格式。示例如下：

```bash
mkdir -p /data0 /data1 /data2
mkfs.xfs /dev/data/data0
mkfs.xfs /dev/data/data1
mkfs.xfs /dev/data/data2
mount /dev/data/data0 /data0/
mount /dev/data/data1 /data1/
mount /dev/data/data2 /data2/ 
```

## 数据交换网络

- **网卡配置**

    数据交换网络是用于业务数据传输的网络，对于网络性能和吞吐要求较高。生产环境下，一般需要两块 10 Gbps 网卡，bond 后作使用。Bond 4 参数建议如下：

    ```bash
    BONDING_OPTS='mode=4 miimon=100 xmit_hash_policy=layer3+4'
    ```

- **连通性要求**

    - 管理控制台与数据库主机应当在数据交换网络中连通，如果管理控制台与数据库主机的网络访问关系中有防火墙设备，应当确保 TCP 空闲连接能够保持 12 小时以上。
    - 数据库主机之间、管理控制台主机之间，应当在数据交换网络中连通，且不应当限制 TCP 空闲连接时间。
    - 数据库客户端、访问数据库的应用程序应当与数据库主节点在数据交换网络中连通。
    -  应当确保 TCP 空闲连接能够保持 12 小时以上。

- **默认网关**

    如果主机配置有管理网络，则应当使用数据交换网络的网卡 (bond0) 作为默认网关设备，否则可能导致主机网络流量监控异常、部署失败和性能问题。下面是一个查看默认网关的示例。

    ```bash
    netstat -rn | grep ^0.0.0.0
    ```

- **交换机**

    - 数据网络交换机的一层到二层的出口带宽不应当低于单机柜最大磁盘 I/O 吞吐能力（以单块 RAID 卡 500 MBps 计算）。
    - 建议交换机收敛比为 4:1。当收敛比达到 6:1 时，大多数链路会达到饱和。当收敛比达到 8:1 时开始出现显著丢包。 

## 软件需求

### 支持的操作系统

CloudBerry Database 支持操作系统包括：

- Kylin V10 SP1 或 SP2
- 中标麒麟 V7update6
- RHEL/CentOS 7.6+
- openEuler 20.3 LTS SP2
- SSH 配置

    SSH 服务端的配置（`/etc/ssh/sshd_config`）如下。配置完成后，执行 `systemctl restart sshd.service` 命令重启生效。

    | 参数                   | 值   | 说明             |
    | ---------------------- | ---- | ---------------- |
    | Port                   | 22   | 监听端口         |
    | PasswordAuthentication | yes  | 允许密码登陆。集群初始化后可以变更。   |
    | PermitEmptyPass words  | no   | 禁止空密码登陆。 |
    | UseDNS                 | no   | 不使用 DNS。     |

### SSH 免密

为所有节点配置免密登录，示例如下：

```bash
ssh-keygen -t rsa
ssh-copy-id root@192.168.66.154 
```
