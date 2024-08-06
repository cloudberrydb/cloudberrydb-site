---
title: 部署前准备
---

# 物理机部署前准备工作

在物理机上部署 Cloudberry Database 前，你需要做一些准备工作。在开始部署之前，请阅读本文档以及[软硬件配置要求](/i18n/zh/docusaurus-plugin-content-docs/current/cbdb-op-software-hardware.md)。

## 规划部署架构

根据 [Cloudberry Database 架构](/i18n/zh/docusaurus-plugin-content-docs/current/cbdb-architecture.md)和[软硬件配置要求](/i18n/zh/docusaurus-plugin-content-docs/current/cbdb-op-software-hardware.md)规划部署架构，确定所需的服务器数量。确保所有的服务器都在一个安全组内，并且配置了互信。

本文示例的部署规划为 1 Coordinator + 1 Standby + 3 Segment (Primary + Mirror)，共 5 台服务器。

## 修改服务器设置

使用 root 用户登录每台主机，按照以下章节的顺序，依次修改各节点主机的设置。

### 修改主机名

使用 `hostnamectl set-hostname` 命令分别修改每台主机的 hostname，须满足以下命名规则：

- 只包括英文字母、数字和连接符 `-`。注意：下划线 `_` 不是合法字符。
- 不区分大小写，建议全部使用小写字母。使用大写字母作为主机名，可能会导致 Kerberos 认证失败。
- 所有主机中，每台主机名必须全局唯一。

示例如下：

```bash
hostnamectl set-hostname cbdb-coordinator
hostnamectl set-hostname cbdb-standbycoordinator
hostnamectl set-hostname cbdb-datanode01
hostnamectl set-hostname cbdb-datanode02
hostnamectl set-hostname cbdb-datanode03
```

### 新增 `gpadmin` 管理用户

参考以下示例，创建用户组和用户名 `gpadmin`，将用户组和用户名的标识号设为 `520`，创建并指定主目录 `/home/gpadmin/`。

```bash
groupadd -g 520 gpadmin  # 添加用户组 gpadmin
useradd -g 520 -u 520 -m -d /home/gpadmin/ -s /bin/bash gpadmin  # 添加用户名 gpadmin 并创建主目录。
passwd gpadmin  # 为 gpadmin 设置密码，执行后，按照提示输出密码。
```

### 禁用 SELinux 和防火墙软件

执行 `systemctl status firewalld` 查看防火墙状态。如果防火墙处于开启状态，你需要关闭防火墙，即在 `/etc/selinux/config` 文件中将 `SELINUX` 参数设为 `disabled`。

```bash
SELINUX=disabled
```

你还可以使用以下命令禁用防火墙：

```bash
systemctl stop firewalld.service
systemctl disable firewalld.service
```

### 修改网络映射

检查 `/etc/hosts` 文件，确保该文件包含 Cloudberry Database 所有主机别名与其网络 IP 地址的映射。示例如下：

```
192.168.1.101  cbdb-coordinator
192.168.1.102  cbdb-standbycoordinator
192.168.1.103  cbdb-datanode01
192.168.1.104  cbdb-datanode02
192.168.1.105  cbdb-datanode03
```

### 设置系统参数

编辑 `/etc/sysctl.conf` 配置文件，在配置文件中添加相关系统参数，并执行 `sysctl -p` 命令让配置文件生效。

以下配置参数仅供参考，请按实际需要进行设置。下文介绍了其中一些配置参数的详细信息以及推荐设置。

```conf
# kernel.shmall = _PHYS_PAGES / 2
kernel.shmall = 197951838
# kernel.shmmax = kernel.shmall * PAGE_SIZE
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

#### 共享内存设置

在 `/etc/sysctl.conf` 配置文件中，`kernel.shmall` 表示可用共享内存的总量，单位是页。`kernel.shmmax` 表示单个共享内存段的最大值，以字节为单位。

你可以使用操作系统的 `_PHYS_PAGES` 和 `PAGE_SIZE` 两个参数来定义这两个值：

```conf
kernel.shmall = ( _PHYS_PAGES / 2) 
kernel.shmmax = ( _PHYS_PAGES / 2) * PAGE_SIZE
```

要获取这两个操作系统参数的值，你可以使用 `getconf` ，示例如下：

```bash
$ echo $(expr $(getconf _PHYS_PAGES) / 2) 
$ echo $(expr $(getconf _PHYS_PAGES) / 2 \* $(getconf PAGE_SIZE))
```

#### Segment 的内存设置

在 `/etc/sysctl.conf` 配置文件中，

- `vm.overcommit_memory` 是一个 Linux 内核参数。使用该参数指定对内存过度使用的处理方式。可选值如下：
  
    - `0`: 探索式处理，即预估可用内存并拒绝占用内存过大的请求。
    - `1`: 允许过度使用。
    -  `2`: 拒绝过度使用。
  
    将 `vm.overcommit_memory` 设置为 `2`，即拒绝过度使用。

- `vm.overcommit_ratio` 是一个内核参数，是应用进程占用 RAM 的百分比。在 CentOS 上默认值为 `50`。`vm.overcommit_ratio` 的计算公式如下：

    ```
    vm.overcommit_ratio = (RAM - 0.026 * gp_vmem) / RAM
    ```

    其中 `gp_vmem` 的计算方法如下：

    ```
    # 如果系统内存低于 256 GB, 使用如下公式计算：
    gp_vmem = ((SWAP + RAM) – (7.5GB + 0.05 * RAM)) / 1.7

    # 如果系统内存大于等于 256 GB, 使用如下公式计算：
    gp_vmem = ((SWAP + RAM) – (7.5GB + 0.05 * RAM)) / 1.17

    # 以上公式中，SWAP 是主机上的交换空间，以 GB 为单位。
    # RAM 是主机上安装的内存大小，以 GB 为单位。
    ```

#### 端口设置

在 `/etc/sysctl.conf` 配置文件中，`net.ipv4.ip_local_port_range` 用于指定端口范围。为了避免 Cloudberry Database 与其他应用程序之间出现端口冲突，需要通过操作系统参数指定端口范围。在后续设置 Cloudberry Database 初始化参数时候，请勿使用这个范围的端口。

假设 `net.ipv4.ip_local_port_range = 10000 65535`，那么 Cloudberry Database 相关的端口应避免设置在区间 `[10000,65535]` 内，可以设置为 `6000` 和 `7000`，示例如下：

```
PORT_BASE = 6000 
MIRROR_PORT_BASE = 7000
```

#### IP 分段设置

当 Cloudberry Database 内部连接使用 UDP 协议，网卡会控制 IP 数据包的分段和重组。如果 UDP 消息的大小大于网络最大传输单元 (MTU) 的大小，IP 层会对消息进行分段。

- `net.ipv4.ipfrag_high_thresh`：当 IP 分片的总大小超过该阈值时，内核将尝试对 IP 分片进行重组。如果分片超过了这个阈值，但全部片段在规定的时间内仍未到达，内核则不会重组这些分片。该阈值通常用于控制是否对较大的分片进行重组。默认值为 `4194304` 字节（即 4 MB）。
- `net.ipv4.ipfrag_low_thresh`：表示当 IP 分片的总大小低于该阈值时，内核将尽可能地等待更多分片到达，以便进行更大的重组。这个阈值的目的是尽量减少未完成的重组操作，以提高系统性能。默认值为 `3145728` 字节（3 MB）。
- `net.ipv4.ipfrag_time` 是一个控制 IP 分片重组超时时间的内核参数，默认值是 `30`。

推荐将以上参数设为如下值：

```conf
net.ipv4.ipfrag_high_thresh = 41943040 
net.ipv4.ipfrag_low_thresh = 31457280 
net.ipv4.ipfrag_time = 60 
```

#### 系统内存

- 如果服务器内存超过 64 GB，建议在 `/etc/sysctl.conf` 配置文件中进行如下参数设置：

    ```conf
    vm.dirty_background_ratio = 0
    vm.dirty_ratio = 0
    vm.dirty_background_bytes = 1610612736 # 1.5GB
    vm.dirty_bytes = 4294967296 # 4GB
    ```

- 如果服务器内存低于 64 GB，则不需要设置 `vm.dirty_background_bytes` 和 `vm.dirty_bytes`，建议在 `/etc/sysctl.conf` 配置文件中进行如下参数设置：

    ```conf
    vm.dirty_background_ratio = 3 
    vm.dirty_ratio = 10
    ```

- 为了应对系统出现内存压力时的紧急情况，建议在 `/etc/sysctl.conf` 配置文件中新增 `vm.min_free_kbytes` 参数，用于控制系统保留的可用内存量。建议将 `vm.min_free_kbytes` 设置为系统物理内存的 3%，命令如下：

    ```bash
    awk 'BEGIN {OFMT = "%.0f";} /MemTotal/ {print "vm.min_free_kbytes =", $2 * .03;}' /proc/meminfo >> /etc/sysctl.conf
    ```

    `vm.min_free_kbytes` 的设置不建议超过系统物理内存的 5%。

#### 资源限制设置

编辑 `/etc/security/limits.conf` 文件并添加如下内容，这将对软硬件资源用量进行限制。

```
*soft nofile 524288
*hard nofile 524288
*soft nproc 131072
*hard nproc 131072
```

#### CORE DUMP 设置

1. 添加以下参数至 `/etc/sysctl.conf` 配置文件：

    ```conf
    kernel.core_pattern=/var/core/core.%h.%t
    ```

2. 执行以下命令使配置生效：

    ```bash
    sysctl -p
    ```

3. 添加以下参数至 `/etc/security/limits.conf`：

    ```
    * soft core unlimited
    ```

#### 为 XFS 文件系统设置挂载选项

XFS 是 Cloudberry Database 数据目录的文件系统，XFS 使用以下选项进行挂载：

```
rw,nodev,noatime,inode64
```

你可以在 `/etc/fstab` 文件中设置 XFS 文件挂载，参考如下命令。你需要根据实际情况选择文件路径：

```bash
mkdir -p /data0/
mkfs.xfs -f /dev/vdc
echo "/dev/vdc /data0 xfs rw,nodev,noatime,nobarrier,inode64 0 0" >> /etc/fstab
mount /data0
chown -R gpadmin:gpadmin /data0/
```

执行以下命令查看挂载是否成功：

```bash
df -h
```

#### 预读值设置

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

#### 磁盘的 I/O 调度策略设置

Cloudberry Database 的磁盘类型、操作系统以及调度策略如下：

<table>
    <tr>
        <th rowspan="3">存储设备类型</th>
        <th rowspan="3">OS</th>
        <th rowspan="3">推荐的调度策略</th>
    </tr>
    <tr></tr>
    <tr></tr>
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
</table>

参考以下命令修改调度策略。注意，该命令仅为临时修改，服务器重启后，修改将失效。

```bash
echo schedulername > /sys/block/<devname>/queue/scheduler
```

例如，临时修改本文档服务器磁盘 I/O 调度策略：

```bash
echo deadline > /sys/block/vdc/queue/scheduler
```

若要永久修改调度策略，你可以使用系统实用程序 grubby。通过 grubby 修改后，重启服务器后立即生效，示例命令如下所示：

```bash
grubby --update-kernel=ALL --args="elevator=deadline"
```

可以通过如下命令查看内核参数设置：

```bash
grubby --info=ALL
```

#### 禁用透明大页面 (THP)

你需要禁用透明大页面 (THP)，因为它会降低 Cloudberry Database 的性能。禁用的命令如下所：

```bash
grubby --update-kernel=ALL --args="transparent_hugepage=never"
```

通过如下命令查看 THP 的状态：

```bash
cat /sys/kernel/mm/*transparent_hugepage/enabled
```

#### 禁用 IPC 对象删除

禁用 IPC 对象删除，即把 `RemoveIPC` 的值设为 `no`。你可以在 Cloudberry Database 的 `/etc/systemd/logind.conf` 文件中设置该参数。

```
RemoveIPC=no
```

禁用后，执行如下命令重启服务器使得禁用设置生效：

```bash
service systemd-logind restart
```

#### SSH 连接数阈值设置

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

#### 时钟同步设置

Cloudberry Database 要求为所有主机配置时钟需要同步，时钟同步服务应当随主机启动而启动。有两种同步方式：

- 使用 Coordinator 节点的时间作为来源，其他主机同步 Coordinator 节点主机的时钟。
- 使用外部时钟来源同步。

本文档示例使用外部时钟来源同步，即在 `/etc/chrony.conf` 配置文件中添加如下配置：

```conf
# Use public servers from the pool.ntp.org project.
# Please consider joining the pool (http://www.pool.ntp.org/join.html).
server 0.centos.pool.ntp.org iburst
```

设置后，可执行如下命令查看时钟同步状态：

```bash
systemctl status chronyd
```