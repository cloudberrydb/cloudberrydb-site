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
| Coordinator  | 4 cores | 8 GB | SSD      | 10 Gbps NIC (2 preferred) | 1+       |
| Segment | 4 cores | 8 GB | SSD      | 10 Gbps NIC (2 preferred) | 1+       |
| ETCD    | 2 cores | 4 GB | SSD      | 10 Gbps NIC (2 preferred) | 2+       |
| FTS     | 2 cores | 4 GB | SSD      | 10 Gbps NIC (2 preferred) | 1+       |

#### For production environments

| Component    | CPU    | Memory   | Disk type | Network                 | Instance count |
| ------- | ------ | ------ | -------- | -------------------- | -------- |
| Coordinator  | 16+ cores | 32+ GB | SSD      | 10 Gbps NIC (2 preferred) | 2+       |
| Segment | 8+ cores  | 32+ GB | SSD      | 10 Gbps NIC (2 preferred) | 2+       |
| ETCD    | 16+ cores | 64+ GB | SSD      | 10 Gbps NIC (2 preferred) | 3+       |
| FTS     | 4+ cores  | 8+ GB   | SSD      | 10 Gbps NIC (2 preferred) | 3+       |

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
    - Connect database clients and application programs that access the database with the database coordinator node in the data exchange network.
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

- SSH configuration

    The recommended configuration for the SSH server side (`/etc/ssh/sshd_config`) is as follows. After the configuration is complete, run `systemctl restart sshd.service` to make it effective.

    | Parameter                   | Value   | Description             |
    | ---------------------- | ---- | ---------------- |
    | Port                   | 22   | Listening port.         |
    | PasswordAuthentication | yes  | Allows password login, which can be changed after cluster initialization.   |
    | PermitEmptyPass words  | no   | Empty password is not allowed for login. |
    | UseDNS                 | no   | DNS is not used.     |

### SSH password-free login

Configure SSH password-free login for all nodes. For example:

```bash
ssh-keygen -t rsa
ssh-copy-id root@192.168.66.154 
```
