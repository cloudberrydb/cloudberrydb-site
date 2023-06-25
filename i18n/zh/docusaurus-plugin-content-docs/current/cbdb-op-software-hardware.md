---
title: 软硬件配置需求
---

# 软硬件配置需求

本文介绍 Cloudberry Database 所需要的软件和硬件配置需求。

## 硬件需求

### 物理机

以下部署介绍 Cloudberry Database 在测试和生产环境中，推荐的物理机配置。

#### 开发及测试环境

| 组件    | CPU  | 内存 | 硬盘类型 | 网络                 | 实例数量 |
| ------- | ---- | ---- | -------- | -------------------- | -------- |
| Master  | 4 核 | 8 GB | SSD      | 万兆网卡（2 块最佳） | 1+       |
| Segment | 4 核 | 8 GB | SSD      | 万兆网卡（2 块最佳） | 1+       |
| ETCD    | 2 核 | 8 GB | SSD      | 万兆网卡（2 块最佳） | 2+       |
| FTS     | 2 核 | 8 GB | SSD      | 万兆网卡（2 块最佳） | 1+       |

#### 生产环境

| 组件    | CPU    | 内存   | 硬盘类型 | 网络                 | 实例数量 |
| ------- | ------ | ------ | -------- | -------------------- | -------- |
| Master  | 16 核+ | 32 GB+ | SSD      | 万兆网卡（2 块最佳） | 2+       |
| Segment | 8 核+  | 32 GB+ | SSD      | 万兆网卡（2 块最佳） | 2+       |
| ETCD    | 16 核+ | 64 GB+ | SSD      | 万兆网卡（2 块最佳） | 3+       |
| FTS     | 4 核+  | 8 GB   | SSD      | 万兆网卡（2 块最佳） | 3+       |

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

### 操作系统配置

- **主机名称配置**

    数据库和管理控制台对主机名称命名规则没有强制要求，但是需要满足以下条件：

    - 必须是合法的主机名，不得包含非法字符。
    - 合法主机名字符包括英文字母、数字和连接符 `-`。注意：下划线 `_` 不是合法字符。
    - 主机名不区分大小写，建议全部使用小写字母。使用大写字母作为主机名，可能会导致 Kerberos 认证失败。
    - 所有主机中，主机名必须唯一。

- **时间同步配置**

    你需为所有主机配置时间同步服务，时间同步服务应当随主机启动而启动。需保证所有主机时间同步。系统时区需配置为客户所在时区，中国客户应当设置为东八区。

- **SELinux 与防火墙配置**

    需禁用防火墙和 SELinux 功能，示例如下：

    ```bash
    systemctl stop firewalld
    systemctl disable firewalld
    setenforce 0
    sed -i /etc/selinux/config -e 's/SELINUX=.*/SELINUX=disabled/g'
    ```

- SSH 配置

    SSH 服务端的配置（`/etc/ssh/sshd_config`）如下。配置完成后，执行 `systemctl restart sshd.service` 命令重启生效。

    | 参数                   | 值   | 说明             | 说明                   |
    | ---------------------- | ---- | ---------------- | ---------------------- |
    | Port                   | 22   | 监听端口         |                        |
    | PasswordAuthentication | yes  | 允许密码登陆。   | 集群初始化后可以变更。 |
    | PermitEmptyPass words  | no   | 禁止空密码登陆。 |                        |
    | UseDNS                 | no   | 不使用 DNS。     |                        |

### 内核参数配置

内核参数是关系到数据库稳定运行的重要因素。管理控制台在初始化集群的时候会自动变更内核参数。需确认安装操作系统之后，没有人工设置过内核参数。配置内核参数的脚本参见以下脚本：

<details>
<summary>内核参数脚本</summary>

```shell
# 内核参数调整脚本（Ansible）
---
 - name: Set max_map_count 
 sysctl:
  name: vm.max_map_count
  value: "262144"
  state: present
  reload: no 

 - name: Set kernel.shmmax
 sysctl:  
  name: kernel.shmmax 
  value: "500000000000"
  state: present
  reload: no 

 - name: Set kernel.shmmni
 sysctl: 
  name: kernel.shmmni
  value: "4096"
  state: present reload: no 

 - name: Set kernel.shmall
 sysctl: 
  name: kernel.shmall
  value: "4000000000"
  state: present
  reload: no 

 - name: Set kernel.sem
 sysctl: 
  name: kernel.sem
  value: 250 512000 100 2048
  state: present
  reload: no
 
 - name: Set kernel.sysrq 
 sysctl: 
  name: kernel.sysrq
  value: "1"
  state: present
  reload: no 

 - name: Set kernel.msgmnb
 sysctl: 
  name: kernel.msgmnb
  value: "65535"
  state: present
  reload: no 

 - name: Set kernel.msgmax
 sysctl: 
  name: kernel.msgmax
  value: "65535"
  state: present
  reload: no 

 - name: Set kernel.msgmni
 sysctl: 
  name: kernel.msgmni
  value: "2048"
  state: present
  reload: no 
 
- name: Set kernel.core_pattern
 sysctl: 
  name: kernel.core_pattern
  value: "core-%e-%s-%u-%g-%p-%t"
  state: present
  reload: no 
 
- name: Set net.ipv4.tcp_syncookies
 sysctl: 
  name: net.ipv4.tcp_syncookies
  value: "1"
  state: present
  reload: no 

 - name: Set net.ipv4.tcp_syn_retries
 sysctl: 
  name: net.ipv4.tcp_syn_retries
  value: "7"
  state: present
  reload: no 

 - name: Set net.ipv4.ip_forward
 sysctl: 
  name: net.ipv4.ip_forward value: "1"
  state: present
 reload: no 
 
 - name: Set net.ipv4.conf.default.accept_source_route
 sysctl: 
 name: net.ipv4.conf.default.accept_source_route
 value: "0"
 state: present
 reload: no 

 - name: Set net.ipv4.tcp_tw_recycle
 sysctl: 
 name: net.ipv4.tcp_tw_recycle value: "0"
 state: present
 reload: no 

  - name: Set net.ipv4.tcp_tw_reuse
 sysctl: 
  name: net.ipv4.tcp_tw_reuse
  value: "1"
  state: present
  reload: no 

 - name: Set net.ipv4.tcp_max_syn_backlog
sysctl: 
 name: net.ipv4.tcp_max_syn_backlog
 value: "4096"
 state: present
 reload: no 

 - name: Set net.ipv4.conf.all.arp_filter
 sysctl: 
  name: net.ipv4.conf.all.arp_filter
  value: "1"
  state: present
  reload: no 

 - name: Set net.ipv4.ip_local_port_range
 sysctl: 
  name: net.ipv4.ip_local_port_range
  value: 1025 65535
  state: present
  reload: no 
 
 -name: Set net.core.netdev_max_backlog
 sysctl: 
  name: net.core.netdev_max_backlog
  value: "10000"
  state: present
  reload: no 
 
- name: Set net.core.rmem_max
 sysctl: 
  name: net.core.rmem_max
  value: "2097152"
  state: present
  reload: no 
 
- name: Set net.core.wmem_max
 sysctl: 
  name: net.core.wmem_max
  value: "2097152"
  state: present
 reload: no 

name: Set fs.inotify.max_user_watches
 sysctl: 
 name: fs.inotify.max_user_watches
 value: "524288"
 state: present
 reload: no 

  - name: Set net.ipv4.neigh.default.gc_thresh1
 sysctl: 
 name: net.ipv4.neigh.default.gc_thresh1
 value: "8192"
 state: present
 reload: no
 
 - name: Set net.ipv4.neigh.default.gc_thresh2
 sysctl: 
  name: net.ipv4.neigh.default.gc_thresh2
  value: "32768"
  state: present
  reload: no 

 - name: Set net.ipv4.neigh.default.gc_thresh3
 sysctl: 
  name: net.ipv4.neigh.default.gc_thresh3
  value: "65536"
  state: present
  reload: no 

 - name: Set net.ipv6.neigh.default.gc_thresh1
 sysctl: 
  name: net.ipv6.neigh.default.gc_thresh1
  value: "8192"
  state: present
  reload: no 

 - name: Set net.ipv6.neigh.default.gc_thresh2
 sysctl: 
  name: net.ipv6.neigh.default.gc_thresh2
  value: "32768"
  state: present
  reload: no 

 - name: Set net.ipv6.neigh.default.gc_thresh3
 sysctl: 
  name: net.ipv6.neigh.default.gc_thresh3
  value: "65536"
  state: present
  reload: no 

 - name: Set fs.nr_open
 sysctl:  
  name: fs.nr_open value: "3000000"
  state: present
  reload: yes 
  ignore_errors: yes 

 - name: Set limit nproc
  pam_limits: 
  domain: "*"
  limit_type: '-' 
  limit_item: nproc
  value: "131072" 

 - name: Set limit nofile
 pam_limits: 
 domain: "*"
 limit_type: '-'
 limit_item: nofile
 value: "65535" 

 - name: Set limit core
 pam_limits: 
 domain: "*"
 limit_type: '-' 
 limit_item: core
 value: "unlimited" 

 -name: Enable ClientAliveInterval for sshd 
 lineinfile:
  path: /etc/ssh/sshd_config
  regexp: '^ClientAliveInterval'
  line: 'ClientAliveInterval 60'
  state: present 

 -name: Enable ClientAliveInterval for sshd
 lineinfile: 
  path: /etc/ssh/sshd_config
  regexp: '^ClientAliveCountMax'
  line: 'ClientAliveCountMax 3'
  state: present 

 -name: Enable PasswordAuthentication for sshd
 lineinfile: 
  path: /etc/ssh/sshd_config
  regexp: '^PasswordAuthentication'
  line: 'PasswordAuthentication yes'
  state: present 

 -name: Disable GSSAPIAuthentication for sshd lineinfile: 
  path: /etc/ssh/sshd_config
  regexp: '^GSSAPIAuthentication'
  line: 'GSSAPIAuthentication no'
  state: present 

 -name: Disable PermitEmptyPasswords for sshd 
 lineinfile:
  path: /etc/ssh/sshd_config
  regexp: '^PermitEmptyPasswords'
  line: 'PermitEmptyPasswords no'
  state: present 

 -name: Disable UseDNS for sshd
 lineinfile: 
  path: /etc/ssh/sshd_config
  regexp: '^UseDNS'
  line: 'UseDNS no'
  state: present 

 -name: Restart sshd daemon
 systemd: 
  state: restarted
  daemon_reload: yes
  name: sshd 
  ignore_errors: yes 

 - name: Change ssh client log level to ERROR
 lineinfile: 
  path: /etc/ssh/ssh_config
  regexp: '^LogLevel'
  line: 'LogLevel ERROR'
  insertafter: '^Host' 
  state: present 

 -name: Enable ServerAliveInterval for ssh
 lineinfile: 
  path: /etc/ssh/ssh_config
  regexp: '^ServerAliveInterval'
  line: 'ServerAliveInterval 60'
  insertafter: '^Host' 
  state: present 

 -name: Enable ServerAliveCountMax for ssh
 lineinfile: 
  path: /etc/ssh/ssh_config
  regexp: '^ServerAliveCountMax'
  line: 'ServerAliveCountMax 3'
  insertafter: '^Host'
  state: present 

 -name: Disable removing IPC when logout
 lineinfile: 
  path: /etc/systemd/logind.conf
  regexp: '^RemoveIPC'
  line: 'RemoveIPC=no'
  state: present 
  when: ansible_distribution_major_version == '7' or ansible_distribution == 'Kylin Linux Advanced Server' 

 -name: Restart login daemon
 systemd: 
  state: restarted 
  daemon_reload: yes 
  name: systemd-logind
  when: ansible_distribution_major_version == '7' or ansible_distribution == 
'Kylin Linux Advanced Server' ignore_errors: yes 

 -name: Set SElinux to permissive mode
 selinux: 
  policy: targeted 
  state: permissive
 ignore_errors: yes 

 - name: Disable SElinux
 selinux: 
  state: disabled
 ignore_errors: yes 

 -name: Disable firewalld
 systemd: 
  name: firewalld
  state: stopped
  enabled: no 
 ignore_errors: yes 
```

</details>

### SSH 免密

你需要为部署机到所有其他服务器的连接配置 root 免密，示例如下：

```bash
$ ssh-keygen -t rsa
$ ssh-copy-id root@192.168.66.154 
```
