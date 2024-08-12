---
title: 单计算节点模式部署
---

# 单计算节点模式部署 Cloudberry Database（引入自 v1.5.0 版本）

Cloudberry Database 与 PostgreSQL 并不完全兼容，部分功能和语法都是专有的。如果用户业务已经依赖 Cloudberry Database，想在单节点上使用 Cloudberry Database 特有的语法和功能，规避与 PostgreSQL 的兼容性问题，那么可以使用这种单计算节点的部署方式。

自 v1.5.0 起，Cloudberry Database 提供这一单计算节点的部署模式。该模式在 `utility` gp_role 下运行，仅有一个 coordinator (QD) 和一个 coordinator standby 节点，没有 segment 节点和数据分布。用户可以直接连接到 coordinator 并执行查询，就像连接的是一个正常的多节点集群一样。注意，由于没有数据分布，一些 SQL 语句在单计算节点部署下没有效果，还有一些 SQL 语句不受支持。具体可见最后一节[用户行为变更](#用户行为变更)。

## 部署方法

### 第 1 步：部署前准备

使用 root 用户登录每台主机，按照以下章节的顺序，依次修改各节点主机的设置。

#### 新增 `gpadmin` 管理用户

参考以下示例，创建用户组和用户名 `gpadmin`，将用户组和用户名的标识号设为 `520`，创建并指定主目录 `/home/gpadmin/`。

```bash
groupadd -g 520 gpadmin  # _添加用户组 gpadmin_
useradd -g 520 -u 520 -m -d /home/gpadmin/ -s /bin/bash gpadmin  # _添加用户名 gpadmin 并创建主目录。_
passwd gpadmin  # _为 gpadmin 设置密码，执行后，按照提示输出密码。_
```

#### 禁用 SELinux 和防火墙软件

执行 `systemctl status firewalld` 查看防火墙状态。如果防火墙处于开启状态，你需要关闭防火墙，即在 `/etc/selinux/config` 文件中将 `SELINUX` 参数设为 `disabled`。

```bash
SELINUX=disabled
```

你还可以使用以下命令禁用防火墙：

```bash
systemctl stop firewalld.service
systemctl disable firewalld.service
```

#### 设置系统参数

编辑 `/etc/sysctl.conf` 配置文件，在配置文件中添加相关系统参数，并执行 `sysctl -p` 命令让配置文件生效。

以下配置参数仅供参考，请按实际需要进行设置。下文介绍了其中一些配置参数的详细信息以及推荐设置。

```bash
kernel.shmall = _PHYS_PAGES / 2
kernel.shmall = 197951838
kernel.shmmax = kernel.shmall * PAGE_SIZE
kernel.shmmax = 810810728448
kernel.shmmni = 4096
vm.overcommit_memory = 2
vm.overcommit_ratio = 95
net.ipv4.ip_local_port_range = 10000 65535
kernel.sem = 250 2048000 200 8192
kernel.sysrq = 1
kernel.core_uses_pid = 1
kernel.msgmnb = 65536
kernel.msgmax = 65536
kernel.msgmni = 2048
net.ipv4.tcp_syncookies = 1
net.ipv4.conf.default.accept_source_route = 0
net.ipv4.tcp_max_syn_backlog = 4096
net.ipv4.conf.all.arp_filter = 1
net.ipv4.ipfrag_high_thresh = 41943040
net.ipv4.ipfrag_low_thresh = 31457280
net.ipv4.ipfrag_time = 60
net.core.netdev_max_backlog = 10000
net.core.rmem_max = 2097152
net.core.wmem_max = 2097152
vm.swappiness = 10
vm.zone_reclaim_mode = 0
vm.dirty_expire_centisecs = 500
vm.dirty_writeback_centisecs = 100
vm.dirty_background_ratio = 0
vm.dirty_ratio = 0
vm.dirty_background_bytes = 1610612736
vm.dirty_bytes = 4294967296
```

##### 共享内存设置

在 `/etc/sysctl.conf` 配置文件中：

- `kernel.shmall` 表示可用共享内存的总量，单位是页。`kernel.shmmax` 表示单个共享内存段的最大值，以字节为单位。

    你可以使用操作系统的 `_PHYS_PAGES` 和 `PAGE_SIZE` 两个参数来定义这两个值：

    ```bash
    kernel.shmall = ( _PHYS_PAGES / 2) 
    kernel.shmmax = ( _PHYS_PAGES / 2) * PAGE_SIZE
    ```

    要获取这两个操作系统参数的值，你可以使用 `getconf` ，示例如下：

    ```bash
    $ echo $(expr $(getconf _PHYS_PAGES) / 2) 
    $ echo $(expr $(getconf _PHYS_PAGES) / 2 \$(getconf PAGE_SIZE))
    ```

- `vm.overcommit_memory` 是一个 Linux 内核参数。使用该参数指定对内存过度使用的处理方式。可选值如下：
    - `0`: 探索式处理，即预估可用内存并拒绝占用内存过大的请求。
    - `1`: 允许过度使用。
    - `2`: 拒绝过度使用。
    
    将 `vm.overcommit_memory` 设置为 `2`，即拒绝过度使用。
    
- `vm.overcommit_ratio` 是一个内核参数，是应用进程占用 RAM 的百分比。在 CentOS 上默认值为 `50`。`vm.overcommit_ratio` 的计算公式如下：

    ```bash
    vm.overcommit_ratio = (RAM - 0.026 * gp_vmem) / RAM
    ```

其中 `gp_vmem` 的计算方法如下：

    ```bash
    # 如果系统内存低于 256 GB, 使用如下公式计算：
    gp_vmem = ((SWAP + RAM) – (7.5GB + 0.05 * RAM)) / 1.7

    # 如果系统内存大于等于 256 GB, 使用如下公式计算：
    gp_vmem = ((SWAP + RAM) – (7.5GB + 0.05 * RAM)) / 1.17

    # 以上公式中，SWAP 是主机上的交换空间，以 GB 为单位。
    # RAM 是主机上安装的内存大小，以 GB 为单位。
    ```

##### IP 分段设置

当 Cloudberry Database 内部连接使用 UDP 协议，网卡会控制 IP 数据包的分段和重组。如果 UDP 消息的大小大于网络最大传输单元 (MTU) 的大小，IP 层会对消息进行分段。

- `net.ipv4.ipfrag_high_thresh`：当 IP 分片的总大小超过该阈值时，内核将尝试对 IP 分片进行重组。如果分片超过了这个阈值，但全部片段在规定的时间内仍未到达，内核则不会重组这些分片。该阈值通常用于控制是否对较大的分片进行重组。默认值为 `4194304` 字节（即 4 MB）。
- `net.ipv4.ipfrag_low_thresh`：表示当 IP 分片的总大小低于该阈值时，内核将尽可能地等待更多分片到达，以便进行更大的重组。这个阈值的目的是尽量减少未完成的重组操作，以提高系统性能。默认值为 `3145728` 字节（3 MB）。
- `net.ipv4.ipfrag_time` 是一个控制 IP 分片重组超时时间的内核参数，默认值是 `30`。

推荐将以上参数设为如下值：

```
net.ipv4.ipfrag_high_thresh = 41943040 
net.ipv4.ipfrag_low_thresh = 31457280 
net.ipv4.ipfrag_time = 60
```

##### 系统内存

- 如果服务器内存超过 64 GB，建议在 `/etc/sysctl.conf` 配置文件中进行如下参数设置：

    ```
    vm.dirty_background_ratio = 0
    vm.dirty_ratio = 0
    vm.dirty_background_bytes = 1610612736 # 1.5GB
    vm.dirty_bytes = 4294967296 # 4GB
    ```

- 如果服务器内存低于 64 GB，则不需要设置 `vm.dirty_background_bytes` 和 `vm.dirty_bytes`，建议在 `/etc/sysctl.conf` 配置文件中进行如下参数设置：

    ```
    vm.dirty_background_ratio = 3 
    vm.dirty_ratio = 10
    ```

- 为了应对系统出现内存压力时的紧急情况，建议在 `/etc/sysctl.conf` 配置文件中新增 `vm.min_free_kbytes` 参数，用于控制系统保留的可用内存量。建议将 `vm.min_free_kbytes` 设置为系统物理内存的 3%，命令如下：

    ```bash
    awk 'BEGIN {OFMT = "%.0f";} /MemTotal/ {print "vm.min_free_kbytes =", $2 * .03;}' /proc/meminfo  /etc/sysctl.conf
    ```

- `vm.min_free_kbytes` 的设置不建议超过系统物理内存的 5%。

##### 资源限制设置

编辑 `/etc/security/limits.conf` 文件并添加如下内容，这将对软硬件资源用量进行限制。

```
*soft nofile 524288
*hard nofile 524288
*soft nproc 131072
*hard nproc 131072
```

##### 核心转储（CORE DUMP）设置

1. 添加以下参数至 `/etc/sysctl.conf` 配置文件：

    ```
    kernel.core_pattern=/var/core/core.%h.%t
    ```

2. 执行以下命令使配置生效：

    ```bash
    sysctl -p
    ```

3. 添加以下参数至 `/etc/security/limits.conf`：

    ```
    soft core unlimited
    ```

##### 为 XFS 文件系统设置挂载选项

XFS 是 Cloudberry Database 数据目录的文件系统，XFS 使用以下选项进行挂载：

```
rw,nodev,noatime,inode64
```

你可以在 `/etc/fstab` 文件中设置 XFS 文件挂载，参考如下命令。你需要根据实际情况选择文件路径：

```bash
mkdir -p /data0/
mkfs.xfs -f /dev/vdc
echo "/dev/vdc /data0 xfs rw,nodev,noatime,nobarrier,inode64 0 0"  /etc/fstab
mount /data0
chown -R gpadmin:gpadmin /data0/
```

执行以下命令查看挂载是否成功：

```bash
df -h
```

##### 预读值设置

每个磁盘设备文件的预读 (blockdev) 值应该是 `16384`。要验证磁盘设备的预读取值，你可以使用以下命令：

```bash
sudo /sbin/blockdev --getra <devname>
```

例如，验证本文示例服务器硬盘的文件预读值：

```bash
sudo /sbin/blockdev --getra /dev/vdc
```

要修改设备文件的预读值，你可以使用以下命令：

```bash
sudo /sbin/blockdev --setra <bytes> <devname>
```

例如，修改本文档服务器硬盘的文件预读值：

```bash
sudo /sbin/blockdev --setra 16384 /dev/vdc
```

##### 磁盘的 I/O 调度策略设置

Cloudberry Database 的磁盘类型、操作系统以及调度策略如下：

<table>
<thead>
  <tr>
    <th>存储设备类型</th>
    <th>OS</th>
    <th>推荐的调度策略</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td rowspan="3">NVMe</td>
    <td>RHEL 7</td>
    <td>none</td>
  </tr>
  <tr>
    <td>RHEL 8</td>
    <td>none</td>
  </tr>
  <tr>
    <td>Ubuntu</td>
    <td>none</td>
  </tr>
  <tr>
    <td rowspan="3">SSD</td>
    <td>RHEL 7</td>
    <td>noop</td>
  </tr>
  <tr>
    <td>RHEL 8</td>
    <td>none</td>
  </tr>
  <tr>
    <td>Ubuntu</td>
    <td>none</td>
  </tr>
  <tr>
    <td rowspan="3">其他</td>
    <td>RHEL 7</td>
    <td>deadline</td>
  </tr>
  <tr>
    <td>RHEL 8</td>
    <td>mq-deadline</td>
  </tr>
  <tr>
    <td>Ubuntu</td>
    <td>mq-deadline</td>
  </tr>
</tbody>
</table>

参考以下命令修改调度策略。注意，该命令仅为临时修改，服务器重启后，修改将失效。

```bash
echo schedulername  /sys/block/<devname/queue/scheduler
```

例如，临时修改本文档服务器磁盘 I/O 调度策略：

```bash
echo deadline  /sys/block/vdc/queue/scheduler
```

若要永久修改调度策略，你可以使用系统实用程序 grubby。通过 grubby 修改后，重启服务器后立即生效，示例命令如下所示：

```bash
grubby --update-kernel=ALL --args="elevator=deadline"
```

可以通过如下命令查看内核参数设置：

```bash
grubby --info=ALL
```

##### 禁用透明大页面 (THP)

你需要禁用透明大页面 (THP)，因为它会降低 Cloudberry Database 的性能。禁用的命令如下所示：

```bash
grubby --update-kernel=ALL --args="transparent_hugepage=never"
```

通过如下命令查看 THP 的状态：

```bash
cat /sys/kernel/mm/*transparent_hugepage/enabled
```

##### 禁用 IPC 对象删除

禁用 IPC 对象删除，即把 `RemoveIPC` 的值设为 `no`。你可以在 Cloudberry Database 的 `/etc/systemd/logind.conf` 文件中设置该参数。

```
RemoveIPC=no
```

禁用后，执行如下命令重启服务器使得禁用设置生效：

```bash
service systemd-logind restart
```

##### SSH 连接数阈值设置

要设置 SSH 连接数阈值，你需要修改 `/etc/ssh/sshd_config` 配置文件中的 `MaxStartups` 以及 `MaxSessions` 参数。以下两种写法均可。

```
MaxStartups 200
MaxSessions 200
```

```
MaxStartups 10:30:200
MaxSessions 200
```

执行如下命令重启服务器使得设置生效：

```bash
service sshd restart
```

##### 时钟同步设置

Cloudberry Database 要求为所有主机配置时钟需要同步，时钟同步服务应当随主机启动而启动。有两种同步方式：

- 使用 Coordinator 节点的时间作为来源，其他主机同步 Coordinator 节点主机的时钟。
- 使用外部时钟来源同步。

本文档示例使用外部时钟来源同步，即在 `/etc/chrony.conf` 配置文件中添加如下配置：

```bash
# 使用 pool.ntp.org 项目的公共服务器
# 可考虑加入 pool (http://www.pool.ntp.org/join.html)
server 0.centos.pool.ntp.org iburst
```

设置后，可执行如下命令查看时钟同步状态：

```bash
systemctl status chronyd
```

## 第 2 步：通过 RPM 包安装 Cloudberry Database

1. 下载 Cloudberry Database 的 RPM 安装包至 `gpadmin` 主目录 `/home/gpadmin/`：

    ```bash
    wget -P /home/gpadmin <下载地址>
    ```

2. 在 `/home/gpadmin` 目录下安装 RPM 包。

    执行以下命令时，你需要将 `<RPM 安装包路径>` 替换为实际的安装包路径，并使用 `root` 用户执行。安装时，会自动创建默认安装目录 `/usr/local/cloudberry-db/`。

    ```bash
    cd /home/gpadmin
    yum install <RPM 安装包路径>
    ```

3. 为 `gpadmin` 用户授予安装目录的权限：

    ```bash
    chown -R gpadmin:gpadmin /usr/local
    chown -R gpadmin:gpadmin /usr/local/cloudberry*
    ```

4. 配置节点的本地 SSH 登录。在 `gpadmin` 用户下：

    ```bash
    ssh-keygen
    ssh-copy-id localhost
    ssh `hostname` # 确认本地 SSH 登录能正常工作
    ```

## 第 3 步：部署单计算节点的 Cloudberry Database

使用脚本工具 [`gpdemo`](/i18n/zh/docusaurus-plugin-content-docs/current/sys-utilities/gpdemo.md) 快速部署 Cloudberry Database。`gpdemo` 包含在 RPM 包中，将随配置脚本（gpinitsystem、gpstart、gpstop 等）一并安装到 `GPHOME/bin` 目录下，支持快捷部署无 Segment 节点的 Cloudberry Database。

在上面[为 XFS 文件系统设置挂载选项](#为-xfs-文件系统设置挂载选项)中，XFS 文件系统的数据目录挂载在了 `/data0` 上。以下指令在该数据目录下部署一个单计算节点集群：

```bash
cd /data0
NUM_PRIMARY_MIRROR_PAIRS=0 gpdemo  # 使用 gpdemo 工具
```

在 `gpdemo` 的执行过程中，会输出一条新的警告 `[WARNING]:-SinglenodeMode has been enabled, no segment will be created.`，这表示当前正以单计算节点模式部署 Cloudberry Database。

## 常见问题

### 如何确认集群的部署模式

执行以下步骤确认当前 Cloudberry Database 的部署模式：

1. 连接到 Coordinator 节点。
2. 执行 `SHOW ``gp_role``;` 查看当前集群的运行模式。

    - 如果结果返回 `utility`，表示集群处于 Utility 运行模式，即维护模式，该模式下只有 Coordinator 节点可用。

        此时继续执行 `SHOW ``gp_internal_is_singlenode``;` 查看集群是否是单计算节点模式。

        - 如果结果返回 `on`，表示当前集群是单计算节点模式。
        - 如果结果返回 `off`，表示当前集群是普通维护模式 (utility maintenance mode)。

    - 如果结果返回 `dispatch`，表示当前集群是包含 Segment 节点的普通集群。你可以通过 `SELECT * FROM gp_segment_configuration;` 进一步确认集群的 Segment 数量、状态、端口、数据目录等信息。

### 数据目录位置在哪里

`gpdemo` 会自动在当前路径 (`$PWD`) 下创建数据目录。对于单计算节点部署：

- Coordinator 默认目录为：`./datadirs/singlenodedir`
- Coordinator Standby 默认目录为：`./datadirs/standby`

## 实现原理

启用单计算节点部署时，部署脚本将向配置文件 `postgresql.conf` 中写入 `gp_internal_is_singlenode = true`，并以 `gp_role = utility` 参数启动一个 Coordinator 和一个 Coordinator standby 节点。所有数据均写入本地，没有 Segment 和数据分布。

## 用户行为变更

在单计算节点模式下， Cloudberry Database 的产品行为有如下变更，用户在执行相关操作前需注意：

- 在使用 `CREATE TABLE` 语句建表时，`DISTRIBUTED BY` 子句不再生效。执行此类语句时，该子句的效果将被忽略，并输出一条新的警告 `WARNING: DISTRIBUTED BY clause has no effect in singlenode mode`。
- `SELECT` 语句的 `SCATTER BY` 子句不再有效。执行此类语句时，该子句的效果将被忽略，并输出一条新的警告 `WARNING: SCATTER BY clause has no effect in singlenode mode`。
- 其他不再支持的语句（例如 `ALTER TABLE SET DISTRIBUTED BY`）将以**错误（ERROR）**指出并拒绝执行。
- 由于没有 Segment 而不存在全局事务和全局死锁，`UPDATE` 和 `DELETE` 语句的锁级别将从 `ExclusiveLock` 独占锁降低至 `RowExclusiveLock` 行意向锁以提供更好的并发性能。该行为和 PostgreSQL 是一致的。
