---
title: Software and Hardware Configuration
---

# Software and Hardware Configuration

This document introduces the software and hardware configuration required for Cloudberry Database.

## Hardware requirements

### Physical machine

The following section describes the recommended physical machine configuration for Cloudberry Database in test and production environments.

#### For development or test environments

| Component    | CPU  | Memory | Disk type | Network                 | Number of instances |
| ------- | ---- | ---- | -------- | -------------------- | -------- |
| Master  | 4 cores | 8 GB | SSD      | 10 Gigabit network card (2 preferred) | 1+       |
| Segment | 4 cores | 8 GB | SSD      | 10 Gigabit network card (2 preferred) | 1+       |
| ETCD    | 2 cores | 4 GB | SSD      | 10 Gigabit network card (2 preferred) | 2+       |
| FTS     | 2 cores | 4 GB | SSD      | 10 Gigabit network card (2 preferred) | 1+       |

#### For production environments

| Component    | CPU    | Memory   | Disk type | Network                 | Instance count |
| ------- | ------ | ------ | -------- | -------------------- | -------- |
| Master  | 16+ cores | 32+ GB | SSD      | 10 Gigabit network card (2 preferred) | 2+       |
| Segment | 8+ cores  | 32+ GB | SSD      | 10 Gigabit network card (2 preferred) | 2+       |
| ETCD    | 16+ cores | 64+ GB | SSD      | 10 Gigabit network card (2 preferred) | 3+       |
| FTS     | 4+ cores  | 8+ GB   | SSD      | 10 Gigabit network card (2 preferred) | 3+       |

### Storage

- To prevent a high data disk load from affecting the operating system's normal I/O response, mount the operating system and the data disk on separate disks.
- If the host configuration allows, it is recommended to use 2 independent SAS disks as the system disk (RAID1), and another 10 SAS disks as the data disk (RAID5).
- It is recommended to use LVM logical volumes to manage disks for more flexible disk configuration.

For the system disk: The system disk should use an independent disk to avoid impact on the operating system when data disks are heavily loaded. It is recommended that the system disk be configured in dual-disk RAID 1 and the operating system of the system disk be XFS.

For data disks: It is recommended to use LVM to manage data disks. According to test statistics, creating an independent logical volume for each physical volume can achieve the best disk performance. For example:

```bash
pvcreate /dev/vdb
pvcreate /dev/vdc
pvcreate /dev/vdd
vgcreate data /dev/vdb /dev/vdc /dev/vdd
lvcreate --extents 100%pvs -n data0 data /dev/vdb
lvcreate --extents 100%pvs -n data1 data /dev/vdc
lvcreate --extents 100%pvs -n data2 data /dev/vdd 
```

The names of mount points must be consecutive, and the mount points of data disks should be `/data0`, `/data1`, ..., `/dataN`. Data disks should use the XFS file format. For example:

```bash
mkdir -p /data0 /data1 /data2
mkfs.xfs /dev/data/data0
mkfs.xfs /dev/data/data1
mkfs.xfs /dev/data/data2
mount /dev/data/data0 /data0/
mount /dev/data/data1 /data1/
mount /dev/data/data2 /data2/ 
```

## Data exchange network

- **Network card configuration**

    The data exchange network is used for transmitting business data, which has high requirements on network performance and throughput. In a production environment, two 10 Gbps NICs are generally required, and they will be used after bonding. The recommended bond 4 parameter are as follows:

    ```bash
    BONDING_OPTS='mode=4 miimon=100 xmit_hash_policy=layer3+4'
    ```

- **Connectivity requirements**

    - Connect the management console and the database host in the data exchange network. If there is a firewall device between the management console and the database host, ensure that the TCP idle connection can be kept for more than 12 hours.
    - Connect database hosts and management console hosts in the data exchange network, and do not limit the TCP idle connection time.
    - Connect database clients and application programs that access the database with the database master node in the data exchange network.
    - Ensure that the TCP idle connection can be kept for more than 12 hours.

- **Default gateway**

    If the host is configured with a management network, the network card (bond0) of the data exchange network should be used as the default gateway device; otherwise, it might cause abnormal traffic monitoring of the host network, deployment failure, and performance problems. The following is an example of viewing the default gateway.

    ```bash
    netstat -rn | grep ^0.0.0.0
    ```

- **Switch**

    - Make sure that the egress bandwidth of the data network switch from layer 1 to layer 2 is no lower than the maximum disk I/O throughput capacity of a single cabinet (calculated with a single RAID card of 500 MBps).
    - A switch convergence ratio of 4:1 is recommended. When the convergence ratio reaches 6:1, most links will be saturated. Significant packet loss occurs when the convergence ratio reaches 8:1.

## Software requirements

### Supported OS

Cloudberry Database supports the following operating systems:

- Kylin V10 SP1 or SP2
- NeoKylin V7update6
- RHEL/CentOS 7.6+
- openEuler 20.3 LTS SP2

### OS configurations

- **Hostname configuration**

    The database and management console do not have mandatory requirements for host naming rules, but the following requirements need to be met:

    - Must be a valid hostname and must not contain illegal characters.
    - Legal hostname characters include English letters, numbers, and hyphen `-`. Note that the underscore `_` is not a legal character.
    - The hostname is not case sensitive. It is recommended to use all lowercase letters. Using uppercase letters for the hostname might cause Kerberos authentication failure.
    - The hostname must be unique among all hosts.

- **Time synchronization configuration**

    Configure the time synchronization service for all hosts, and the time synchronization service should be started when the host starts. Ensure that the time of all hosts is synchronized. Configure the system time zone as the user's time zone. For Chinese users, set the time zone to UTC/GMT+08:00.

- **SELinux and firewall configuration**

    Disable the firewall and SELinux. For example:

    ```bash
    systemctl stop firewalld
    systemctl disable firewalld
    setenforce 0
    sed -i /etc/selinux/config -e 's/SELINUX=.*/SELINUX=disabled/g'
    ```

- SSH configuration

    The recommended configuration for the SSH server side (`/etc/ssh/sshd_config`) is as follows. After the configuration is complete, run `systemctl restart sshd.service` to make it effective.

    | Parameter                   | Value   | Description             |
    | ---------------------- | ---- | ---------------- |
    | Port                   | 22   | Listening port.         |
    | PasswordAuthentication | yes  | Allows password login, which can be changed after cluster initialization.   |
    | PermitEmptyPass words  | no   | Empty password is not allowed for login. |
    | UseDNS                 | no   | DNS is not used.     |

### Kernel parameter configuration

Kernel parameters are important factors that affect database operation. The management console automatically changes the kernel parameters when initializing a cluster. Make sure that no kernel parameters have been manually set after the operating system is deployed. The following is a script that configures kernel parameters:

<details>
<summary>Kernel parameter script</summary>

```shell
# The script that adjusts the kernel parameters (Ansible)
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

### SSH password-free login

Configure SSH password-free login for all nodes. For example:

```bash
ssh-keygen -t rsa
ssh-copy-id root@192.168.66.154 
```
