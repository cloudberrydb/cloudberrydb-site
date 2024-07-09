---
title: Deploy with a Single Computing Node
---

# Deploy Cloudberry Database with a Single Computing Node (New in v1.5.0)

Cloudberry Database is not fully compatible with PostgreSQL, and some features and syntax are Cloudberry Database-specific. If your business already relies on Cloudberry Database and you want to use the Cloudberry Database-specific syntax and features on a single node to avoid compatibility issues with PostgreSQL, you can consider deploying Cloudberry Database free of segments.

Starting from v1.5.0, Cloudberry Database provides the single-computing-node deployment mode. This mode runs under the `utility` gp_role, with only one coordinator (QD) node and one coordinator standby node, without a segment node or data distribution. You can directly connect to the coordinator and run queries as if you were connecting to a regular multi-node cluster. Note that some SQL statements are not effective in this mode because data distribution does not exist, and some SQL statements are not supported. See [user behavior changes](#user-behavior-changes) for details.

Before reading this document, it is recommended to first read the [Software and Hardware Configuration Requirements](/docs/cbdb-op-software-hardware.md) and [Prepare to Deploy Cloudberry Database on Physical Machine](/docs/cbdb-op-prepare-to-deploy.md).

:::warning
The deployment method described in this document is suitable only for deploying Cloudberry Database v1.5.4, not for deploying earlier versions.
:::

## How to deploy

### Step 1. Prepare to deploy

1. Run the following commands in sequence to set up the environment.

    ```shell
    # Installs the EPEL repository.
    yum install -y epel-release

    # Adds the /usr/local/lib and /usr/local/lib64 directories to the ld.so.conf file so that the system can find the library files in these directories.
    echo -e "/usr/local/lib \n/usr/local/lib64" >> /etc/ld.so.conf

    # Adds the /usr/lib and /usr/lib64 directories to the ld.so.conf file so that the system can find the library files in these directories.
    echo -e "/usr/lib \n/usr/lib64" >> /etc/ld.so.conf

    # Reloads the dynamic library cache to make the system recognize the new library directories.
    ldconfig
    ```

2. Run the following commands in sequence to configure password-free authentication for `gpadmin`.

    ```bash
    #!/bin/bash

    # Creates a group named gpadmin
    /usr/sbin/groupadd gpadmin

    # Creates a user named gpadmin, adds it to the gpadmin group and the wheel group.
    /usr/sbin/useradd gpadmin -g gpadmin -G wheel

    # Sets the password for the gpadmin user to "cbdb@123".
    echo "cbdb@123"|passwd --stdin gpadmin

    # Adds the gpadmin user to the /etc/sudoers file, granting permission to run all commands without a password.
    echo "gpadmin        ALL=(ALL)       NOPASSWD: ALL" >> /etc/sudoers

    # Adds the root user to the /etc/sudoers file, granting permission to run all commands without a password.
    echo "root        ALL=(ALL)       NOPASSWD: ALL" >> /etc/sudoers

    # Generates an RSA private key for the root user without a passphrase, and redirects the output to a null device.
    ssh-keygen -t rsa -N '' -f /root/.ssh/id_rsa <<< $'\n' >/dev/null 2>&1

    # Adds "PasswordAuthentication yes" to the /etc/ssh/sshd_config file to allow password login.
    echo "PasswordAuthentication yes" >> /etc/ssh/sshd_config

    # Modifies the /etc/ssh/sshd_config file, replacing "UseDNS YES" with "UseDNS no" to disable DNS queries.
    sed -i "s/#UseDNS YES/UseDNS no/g" /etc/ssh/sshd_config

    # Generates an RSA private key as the gpadmin user without a passphrase, and redirects the output to a null device.
    sudo -u gpadmin ssh-keygen -t rsa -N '' -f /home/gpadmin/.ssh/id_rsa <<< $'\n' >/dev/null 2>&1

    # Adds the public key of the gpadmin user to its authorized_keys file as the gpadmin user.
    sudo -u gpadmin cat /home/gpadmin/.ssh/id_rsa.pub >> /home/gpadmin/.ssh/authorized_keys

    # Changes the ownership of the /home/gpadmin directory to the gpadmin user.
    sudo chown -R gpadmin:gpadmin /home/gpadmin/

    # Uses the ssh-keyscan command to add the host's public key to the current user's known_hosts file.
    ssh-keyscan $(hostname) >> ~/.ssh/known_hosts
    ```

### Step 2. Install Cloudberry Database RPM package

1. Download the Cloudberry Database RPM package to the current directory, For example, downloading `https://github.com/cloudberrydb/cloudberrydb/releases/download/1.5.4/cloudberrydb-1.5.4-1.el7.x86_64.rpm`. You need to replace the download address in the command with the actual target address.

    ```bash
    wget https://github.com/cloudberrydb/cloudberrydb/releases/download/1.5.4/cloudberrydb-1.5.4-1.el7.x86_64.rpm
    ```

2. Install the RPM package. You need to replace the package name in the command with the actual package name.

    ```bash
    yum install -y cloudberrydb-1.5.3-1.x86_64.rpm
    ```

### Step 3. Deploy Cloudberry Database with a single computing node

Use the scripting tool [`gpdemo`](/docs/sys-utilities/db-util-gpdemo.md) to quickly deploy Cloudberry Database. `gpdemo` is included in the RPM package and will be installed in the `GPHOME/bin` directory along with the configuration scripts (gpinitsystem, gpstart, and gpstop). `gpdemo` supports quickly deploying Cloudberry Database with a single computing node.

The commands above create a new directory and run `gpdemo` to deploy a Cloudberry Database cluster of a single computing node.

```bash
#!/bin/bash

# Changes the owner and group of the /usr/local/cloudberrydb directory to gpadmin.
chown gpadmin:gpadmin /usr/local/cloudberrydb

# Installs specific versions of Python libraries using pip3.
pip3 install psutil==5.7.0 pygresql==5.2 pyyaml==5.3.1

# Switches to the gpadmin user.
su - gpadmin

# Creates a directory named test_gpadmin.
mkdir test_gpadmin

# Enters the test_gpadmin directory.
cd test_gpadmin

# Sources the Greenplum environment variables.
source /usr/local/cloudberrydb/greenplum_path.sh

# Runs the gpdemo command to create the Cloudberry Database cluster.
gpdemo

# Sources the gpdemo environment variables.
source gpdemo-env.sh

# Checks the status of Cloudberry Database.
gpstate -s
```

### Step 4. Connect to Cloudberry Database

1. Connect to Cloudberry Database.

    ```sql
    psql -p 7000 postgres
    ```

2. View the information of active segments.

    ```sql
    postgres=# select * from gp_segment_configuration;
    ```

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
