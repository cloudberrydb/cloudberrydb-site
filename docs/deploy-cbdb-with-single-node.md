---
title: Deploy with a Single Computing Node
---

# Deploy Cloudberry Database with a Single Computing Node (New in v1.5.0)

Cloudberry Database is not fully compatible with PostgreSQL, and some features and syntax are Cloudberry Database-specific. If your business already relies on Cloudberry Database and you want to use the Cloudberry Database-specific syntax and features on a single node to avoid compatibility issues with PostgreSQL, you can consider deploying Cloudberry Database free of segments.

Starting from v1.5.0, Cloudberry Database provides the single-computing-node deployment mode. This mode runs under the `utility` gp_role, with only one coordinator (QD) node and one coordinator standby node, without a segment node or data distribution. You can directly connect to the coordinator and run queries as if you were connecting to a regular multi-node cluster. Note that some SQL statements are not effective in this mode because data distribution does not exist, and some SQL statements are not supported. See [user behavior changes](#user-behavior-changes) for details.

## How to deploy

### Step 1. Prepare to deploy

Log into each host as the root user, and modify the settings of each node server in the order of the following sections.

#### Add `gpadmin` admin user

Follow the example below to create a user group and username `gpadmin`. Set the user group and username identifier to `520`. Create and specify the `gpadmin` home directory `/home/gpadmin`.

```bash
groupadd -g 520 gpadmin  # Adds user group gpadmin.
useradd -g 520 -u 520 -m -d /home/gpadmin/ -s /bin/bash gpadmin  # Adds username gpadmin and creates the home directory of gpadmin.
passwd gpadmin  # Sets a password for gpadmin; after executing, follow the prompts to input the password.
```

#### Disable SELinux and firewall software

Run `systemctl status firewalld` to view the firewall status. If the firewall is on, you need to turn it off by setting the `SELINUX` parameter to `disabled` in the `/etc/selinux/config` file.

```bash
SELINUX=disabled
```

You can also disable the firewall using the following commands:

```bash
systemctl stop firewalld.service
systemctl disable firewalld.service
```

#### Set system parameters

Add relevant system parameters in the `/etc/sysctl.conf` configuration file, and run the `sysctl -p` command to make the configuration file effective.

When setting the configuration parameters, you can take the following example as a reference and set them according to your needs. Details of some of these parameters and recommended settings are provided below.

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

##### Shared memory settings

In the `/etc/sysctl.conf` configuration file, `kernel.shmall` represents the total amount of available shared memory, in pages. `kernel.shmmax` represents the maximum size of a single shared memory segment, in bytes.

You can define these 2 values using the operating system's `_PHYS_PAGES` and `PAGE_SIZE` parameters:

```
kernel.shmall = ( _PHYS_PAGES / 2)
kernel.shmmax = ( _PHYS_PAGES / 2) * PAGE_SIZE
```

To get the values of these 2 operating system parameters, you can use `getconf`, for example:

```bash
$echo $(expr $(getconf _PHYS_PAGES)/2) 
$echo $(expr $(getconf _PHYS_PAGES)/2 \*$(getconf PAGE_SIZE))
```

- `vm.overcommit_memory` indicates the overcommit handling modes for memory. Available options are: 
    
    - `0`: Heuristic overcommit handling
    - `1`: Always overcommit
    - `2`: Don't overcommit
    
    Set the value of this parameter to `2` to refuse overcommit.
    
- `vm.overcommit_ratio` is a kernel parameter and is the percentage of RAM occupied by the application process. The default value on CentOS is `50`. `vm.overcommit_ratio` is calculated as follows:

    ```
    vm.overcommit_ratio = (RAM - 0.026 * gp_vmem) / RAM
    ```

- The calculation method of `gp_vmem` is as follows:

    ```
    # If the system memory is less than 256 GB, use the following formula to calculate:
    gp_vmem = ((SWAP + RAM) – (7.5GB + 0.05 * RAM)) / 1.7

    # If the system memory is greater than or equal to 256 GB, use the following formula to calculate:
    gp_vmem = ((SWAP + RAM) – (7.5GB + 0.05 * RAM)) / 1.17

    # In the above formulas, SWAP is the swap space on the host, in GB.
    # RAM is the size of the memory installed on the host, in GB.
    ```

##### IP segmentation settings

When the Cloudberry Database uses the UDP protocol for internal connection, the network card controls the fragmentation and reassembly of IP packets. If the size of a UDP message is larger than the maximum size of network transmission unit (MTU), the IP layer fragments the message.

- `net.ipv4.ipfrag_high_thresh`: When the total size of IP fragments exceeds this threshold, the kernel will attempt to reorganize IP fragments. If the fragments exceed this threshold but all fragments have not arrived within the specified time, the kernel will not reorganize the fragments. This threshold is typically used to control whether larger shards are reorganized. The default value is `4194304` bytes (4 MB).
- `net.ipv4.ipfrag_low_thresh`: Indicates that when the total size of IP fragments is below this threshold, the kernel will wait as long as possible for more fragments to arrive, to allow for larger reorganizations. This threshold is used to minimize unfinished reorganization operations and improve system performance. The default value is `3145728` bytes (3 MB).
- `net.ipv4.ipfrag_time` is a kernel parameter that controls the IP fragment reassembly timeout. The default value is `30`.

It is recommended to set the above parameters to the following values:

```
net.ipv4.ipfrag_high_thresh = 41943040
net.ipv4.ipfrag_low_thresh = 31457280
net.ipv4.ipfrag_time = 60
```

##### System memory

- If the server memory exceeds 64 GB, the following parameters are recommended in the `/etc/sysctl.conf ` configuration file:

    ```
    vm.dirty_background_ratio = 0
    vm.dirty_ratio = 0
    vm.dirty_background_bytes = 1610612736 # 1.5GB
    vm.dirty_bytes = 4294967296 # 4GB
    ```

- If the server memory is less than 64 GB, you do not need to set `vm.dirty_background_bytes ` or `vm.dirty_bytes`. It is recommended to set the following parameters in the `/etc/sysctl.conf ` configuration file:

    ```
    vm.dirty_background_ratio = 3 
    vm.dirty_ratio = 10
    ```

- To deal with emergency situations when the system is under memory pressure, it is recommended to add the `vm.min_free_kbytes` parameter to the `/etc/sysctl.conf` configuration file to control the amount of available memory reserved by the system. It is recommended to set `vm.min_free_kbytes` to 3% of the system's physical memory, with the following command:

    ```bash
    awk 'BEGIN {OFMT = "%.0f";} /MemTotal/ {print "vm.min_free_kbytes =", $2 * .03;}' /proc/meminfo  /etc/sysctl.conf
    ```

- The setting of `vm.min_free_kbytes` is not recommended to exceed 5% of the system's physical memory.

##### Resource limit

Edit the `/etc/security/limits.conf` file and add the following content, which will limit the amount of hardware and software resources.

```
*soft nofile 524288
*hard nofile 524288
*soft nproc 131072
*hard nproc 131072
```

##### CORE DUMP

1. Add the following parameter to the `/etc/sysctl.conf` configuration file:

    ```
    kernel.core_pattern=/var/core/core.%h.%t
    ```

2. Run the following command to make the configuration effective:

    ```bash
    sysctl -p
    ```

3. Add the following parameter to `/etc/security/limits.conf`:

    ```
    * soft core unlimited
    ```

##### Set mount options for the XFS file system

XFS is the file system for the data directory of Cloudberry Database. XFS has the following mount options:

```
rw,nodev,noatime,inode64
```

You can set up XFS file mounting in the `/etc/fstab` file. See the following commands. You need to choose the file path according to the actual situation:

```bash
mkdir -p /data0/
mkfs.xfs -f /dev/vdc
echo "/dev/vdc /data0 xfs rw,nodev,noatime,nobarrier,inode64 0 0"  /etc/fstab
mount /data0
chown -R gpadmin:gpadmin /data0/
```

Run the following command to check whether the mounting is successful:

```bash
df-h
```

##### Blockdev value

The blockdev value for each disk file should be `16384`. To verify the blockdev value of a disk device, use the following command:

```bash
sudo/sbin/blockdev --getra<devname>
```

For example, to verify the blockdev value of the example server disk:

```bash
sudo/sbin/blockdev --getra /dev/vdc
```

To modify the blockdev value of a device file, use the following command:

```bash
sudo/sbin/blockdev --setra<bytes> <devname>
```

For example, to modify the file blockdev value of the hard disk of the example server:

```bash
sudo/sbin/blockdev --setra16384/dev/vdc
```

##### I/O scheduling policy settings for disks

The disk type, operating system, and scheduling policies of Cloudberry Database are as follows:

<table>
<thead>
  <tr>
    <th>Storage device type</th>
    <th>OS</th>
    <th>Recommended scheduling policy</th>
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
    <td rowspan="3">Other</td>
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

Refer to the following command to modify the scheduling policy. Note that this command is only a temporary modification, and the modification becomes invalid after the server is restarted.

```bash
echo schedulername>/sys/block/<devname>/queue/scheduler
```

For example, temporarily modify the disk I/O scheduling policy of the example server:

```bash
echo deadline>/sys/block/vdc/queue/scheduler
```

To permanently modify the scheduling policy, use the system utility `grubby`. After using `grubby`, the modification takes effect immediately after you restart the server. The sample command is as follows:

```bash
grubby --update-kernel=ALL --args="elevator=deadline"
```

To view the kernel parameter settings, use the following command:

```bash
grubby --info=ALL
```

##### Disable Transparent Huge Pages (THP)

You need to disable Transparent Huge Pages (THP), because it reduces database performance. The command is as follows:

```bash
grubby --update-kernel=ALL --args="transparent_hugepage=never"
```

Check the status of THP:

```bash
cat /sys/kernel/mm/*transparent_hugepage/enabled
```

##### Disable IPC object deletion

Disable IPC object deletion by setting the value of `RemoveIPC` to `no`. You can set this parameter in the `/etc/systemd/logind.conf` file of Cloudberry Database.

```
RemoveIPC=no
```

After disabling it, run the following command to restart the server to make the disabling setting effective:

```bash
service systemd-logind restart
```

##### SSH connection threshold

To set the SSH connection threshold, you need to modify the `MaxStartups` and `MaxSessions` parameters in the `/etc/ssh/sshd_config` configuration file. Both of the following writing methods are acceptable.

```
MaxStartups 200
MaxSessions 200
```

```
MaxStartups 10:30:200
MaxSessions 200
```

Run the following command to restart the server to make the setting take effect:

```bash
service sshd restart
```

##### Clock synchronization

Cloudberry Database requires the clock synchronization to be configured for all hosts, and the clock synchronization service should be started when the host starts. You can choose one of the following synchronization methods:

- Use the coordinator node's time as the source, and other hosts synchronize the clock of the coordinator node host.
- Synchronize clocks using an external clock source.

The example in this document uses an external clock source for synchronization, that is, adding the following configuration to the `/etc/chrony.conf` configuration file:

```
# Use public servers from the pool.ntp.org project.
# Please consider joining the pool (http://www.pool.ntp.org/join.html).
server 0.centos.pool.ntp.org iburst
```

After setting, you can run the following command to check the clock synchronization status:

```bash
systemctl status chronyd
```

### Step 2. Install Cloudberry Database

1. Download the RPM package to the home directory of `gpadmin`.

    ```bash
    wget -P /home/gpadmin <download address>
    ```

2. Install the RPM package in the `/home/gpadmin` directory.

    When running the following command, you need to replace `<RPM package path>` with the actual RPM package path, as the `root` user. During the installation, the directory `/usr/local/cloudberry-db/` is automatically created.

    ```bash
    cd /home/gpadmin
    yum install <RPM package path>
    ```

3. Grant the `gpadmin` user the permission to access the `/usr/local/cloudberry-db/` directory.

    ```bash
    chown -R gpadmin:gpadmin /usr/local
    chown -R gpadmin:gpadmin /usr/local/cloudberry*
    ```

4. Configure local SSH connection for the node. As the `gpadmin ` user, perform the following operations:

    ```bash
    ssh-keygen
    ssh-copy-id localhost
    ssh `hostname` # Makes sure that the local SSH connection works well.
    ```

### Step 3. Deploy Cloudberry Database with a single computing node

Use the scripting tool [`gpdemo`](/docs/sys-utilities/gpdemo.md) to quickly deploy Cloudberry Database. `gpdemo` is included in the RPM package and will be installed in the `GPHOME/bin` directory along with the configuration scripts (gpinitsystem, gpstart, and gpstop). `gpdemo` supports quickly deploying Cloudberry Database with a single computing node.

In the above [setting mount options for the XFS file system](#set-mount-options-for-the-xfs-file-system), the XFS  file system's data directory is mounted on `/data0`. The following commands deploy a single-computing-node cluster in this data directory:

```bash
cd /data0
NUM_PRIMARY_MIRROR_PAIRS=0 gpdemo  # Uses gpdemo
```

When `gpdemo` is running, a warning will be output `[WARNING]: -SinglenodeMode has been enabled, no segment will be created.`, which indicates that Cloudberry Database is currently being deployed in the single-computing-node mode.

## Common issues

### How to check the deployment mode of a cluster

Perform the following steps to confirm the deployment mode of the current Cloudberry Database cluster:

1. Connect to the coordinator node.
2. Execute `SHOW gp_role;` to view the operating mode of the cluster.

    - If `utility` is returned, it indicates that the cluster is in utility mode (maintenance mode), where only the coordinator node is available.

        Continue to run the `SHOW gp_internal_is_singlenode;` command to see whether the cluster is in the single-computing-node mode.

        - If `on` is returned, the current cluster is in the single-computing-node mode.
        - If `off` is returned, the current cluster is in utility maintenance mode.

    - If `dispatch` is returned, it means that the current cluster is a regular cluster containing segment nodes. You can further check the segment count, status, port, data directory, and other information of the cluster by running `SELECT * FROM n;`.

### Where is the data directory

`gpdemo` automatically creates a data directory in the current path (`$PWD`). For the single-computing-node deployment:

- The default directory of the coordinator is `./datadirs/singlenodedir`.
- The default directory of the coordinator standby node is `./datadirs/standby`.

## How it works

When you are deploying Cloudberry Database in the single-computing-node mode, the deployment script `gpdemo` writes `gp_internal_is_singlenode = true` to the configuration file `postgresql.conf` and starts a coordinator and a coordinator standby node with the `gp_role = utility` parameter setting. All data is written locally without a segment or data distribution.

## User-behavior changes

In the single-computing-node mode, the product behavior of Cloudberry Database has the following changes. You should pay attention to these changes before performing related operations:

- When you execute `CREATE TABLE` to create a table, the `DISTRIBUTED BY` clause no longer takes effect. A warning is output: `WARNING: DISTRIBUTED BY clause has no effect in singlenode mode`.
- The `SCATTER BY` clause of the `SELECT` statement is no longer effective. A warning is output: `WARNING: SCATTER BY clause has no effect in singlenode mode`.
- Other statements that are not supported (for example, `ALTER TABLE SET DISTRIBUTED BY`) are declined with an error.
- The lock level of `UPDATE` and  `DELETE` statements will be reduced from  `ExclusiveLock` to  `RowExclusiveLock` to provide better concurrency performance, because there is only a single node without global transactions or global deadlocks. This behavior is consistent with PostgreSQL.
