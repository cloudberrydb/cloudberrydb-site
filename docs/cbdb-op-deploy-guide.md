---
title: Deploy Manually Using RPM Package
---

# Deploy Cloudberry Database Manually Using RPM Package

This document introduces how to manually deploy Cloudberry Database on physical machines using RPM package. Before reading this document, it is recommended to first read the [Software and Hardware Configuration Requirements](/docs/cbdb-op-software-hardware.md) and [Prepare to Deploy Cloudberry Database on Physical Machine](/docs/cbdb-op-prepare-to-deploy.md).

The deployment method in this document is for production environments.

The example in this document uses CentOS 7.6 and deploys Cloudberry Database v1.0.0. The main steps are as follows:

1. [Prepare node servers](#step-1-prepare-server-nodes).
2. [Install the RPM package](#step-2-install-the-rpm-package).
3. [Configure mutual trust between nodes](#step-3-configure-mutual-trust-between-nodes).
4. [Initialize the database](#step-4-initialize-cloudberry-database).
5. [Log into the database](#step-5-log-into-cloudberry-database).

## Step 1: Prepare server nodes

Read the [Prepare to Deploy Cloudberry Database on Physical Machine](/docs/cbdb-op-prepare-to-deploy.md) document to prepare the server nodes.

## Step 2. Install the RPM package

After the preparation, it is time to install Cloudberry Database. You need to download the corresponding RPM package from [Cloudberry Database Releases](https://github.com/cloudberrydb/cloudberrydb/releases), and then install the database on each node using the installation package.

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

## Step 3. Configure mutual trust between nodes

1. Switch to the `gpadmin` user, and use the `gpadmin` user for subsequent operations.
2. Create a configuration file for node information.

    Create the node configuration file in the `/home/gpadmin/` directory, including the `all_hosts` and `seg_hosts` files, which store the host information of all nodes and data nodes respectively. The example node information is as follows:

    ```bash
    [gpadmin@cbdb-coordinator gpadmin]$ cat all_hosts

    cbdb-coordinator
    cbdb-standbycoordinator
    cbdb-datanode01
    cbdb-datanode02
    cbdb-datanode03

    [gpadmin@cbdb-coordinator gpadmin]$ cat seg_hosts

    cbdb-datanode01
    cbdb-datanode02
    cbdb-datanode03
    ```

3. Configure SSH trust between hosts.

    1. Run `ssh-keygen` on each host to generate SSH key. For example:

        ```bash
        [gpadmin@cbbd-coordinator cloudberry-db-1.0.0]$ ssh-keygen

        Generating public/private rsa key pair.
        Enter file in which to save the key (/usr/local/cloudberry-db/.ssh/id_rsa):
        Enter passphrase (empty for no passphrase):
        Enter same passphrase again:
        Your identification has been saved in /usr/local/cloudberry-db/.ssh/id_rsa.
        Your public key has been saved in /usr/local/cloudberry-db/.ssh/id_rsa.pub.
        The key fingerprint is:
        SHA256:cvcYS87egYCyh/v6UtdqrejVU5qqF7OvpcHg/T9lRrg gpadmin@cbbd-coordinator
        The key's randomart image is:
        +---[RSA 2048]----+
        |                 |
        |                 |
        |       +         |
        |+      O         |
        |o ...  S         |
        |. +o=  B C       |
        | o B=00 D        |
        |.o=o0o.. =       |
        |O=++*+o+..       |
        +----[SHA256]-----+
        ```

    2. Run `ssh-copy-id` on each host to configure password-free login. The example is as follows:

        ```bash
        ssh-copy-id  cbdb-coordinator
        ssh-copy-id  cbdb-standbycoordinator
        ssh-copy-id  cbdb-datanode01
        ssh-copy-id  cbdb-datanode02
        ssh-copy-id  cbdb-datanode03
        ```

    3. Verify that SSH between nodes is all connected, that is, the password-free login between servers is successful. The example is as follows:

        ```bash
        [gpadmin@cbdb-coordinator ~]$ gpssh -f all_hosts
        => pwd
        [ cbdb-datanode03] b'/usr/local/cloudberry-db\r'
        [ cbdb-coordinator] b'/usr/local/cloudberry-db\r'
        [ cbdb-datanode02] b'/usr/local/cloudberry-db\r'
        [cbdb-standbycoordinator] b'/usr/local/cloudberry-db\r'
        [ cbdb-datanode01] b'/usr/local/cloudberry-db\r'
        =>
        ```

        If you fail to run `gpssh`, you can first run `source /usr/local/cloudberry-db/greenplum_path.sh` on the coordinator node.

## Step 4. Initialize Cloudberry Database

Before performing the following operations, run `su - gpadmin` to switch to the `gpadmin` user.

1. Add a new line of `source` command to the `~/.bashrc` files of all nodes (coordinator/standby coordinator/segment). The example is as follows:

    ```bash
    source /usr/local/cloudberry-db/greenplum_path.sh
    ```

2. Run the `source` command to make the newly added content effective:

    ```bash
    source ~/.bashrc
    ```

3. Use the `gpssh` command on the coordinator node to create data directories and mirror directories for segment nodes. In this document, the 2 directories are `/data0/primary/` and `/data0/mirror/`, respectively. The example is as follows:

    ```bash
    gpssh -f seg_hosts
    mkdir -p /data0/primary/
    mkdir -p /data0/mirror/
    ```

4. Create data directory on the coordinator node. In this document, the directory is `/data0/coordinator/`.

    ```bash
    mkdir -p /data0/coordinator/
    ```

5. Use the `gpssh` command on the coordinator node to create data directory for the standby node. In this document, the directory is `/data0/coordinator/`.

    ```bash
    gpssh -h cbdb-standbycoordinator -e 'mkdir -p /data0/coordinator/'
    ```

6. On the hosts of the coordinator and standby nodes, add a line to the `~/.bashrc` file to declare the path of `COORDINATOR_DATA_DIRECTORY`, which is `{the path step 5}` + `gpseg-1`. For example:

    ```bash
    export COORDINATOR_DATA_DIRECTORY=/data0/coordinator/gpseg-1
    ```

7. Run the following command on the hosts of the coordinator and standby nodes to make the declaration of `COORDINATOR_DATA_DIRECTORY` in the previous step effective.

    ```bash
    source ~/.bashrc
    ```

8. Configure the `gpinitsystem_config` initialization script:

    1. On the host where the coordinator node is located, copy the template configuration file to the current directory:

        ```bash
        cp $GPHOME/docs/cli_help/gpconfigs/gpinitsystem_config .
        ```

    2. Modify the `gpinitsystem_config` file as follows:

        - Pay attention to the port, coordinator node, segment node, and mirror node.
        - Modify `DATA_DIRECTORY` to the data directory of the segment node, for example, `/data0/primary`.
        - Modify `COORDINATOR_HOSTNAME` to the hostname of the coordinator node, for example, `cbdb-coordinator`.
        - Modify `COORDINATOR_DIRECTORY` to the data directory of the coordinator node, for example, `/data0/coordinator`.
        - Modify `MIRROR_DATA_DIRECTORY` to the data directory of the mirror node, for example, `/data0/mirror`.

            ```bash
            [gpadmin@cbdb-coordinator ~]$ cat gpinitsystem_config
            # FILE NAME: gpinitsystem_config

            # Configuration file needed by the gpinitsystem

            ########################################
            #### REQUIRED PARAMETERS
            ########################################

            #### Naming convention for utility-generated data directories.
            SEG_PREFIX=gpseg

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
            COORDINATOR_HOSTNAME=cbdb-coordinator

            #### File system location where the coordinator data directory
            #### will be created.
            COORDINATOR_DIRECTORY=/data0/coordinator

            #### Port number for the coordinator instance.
            COORDINATOR_PORT=5432

            #### Shell utility used to connect to remote hosts.
            TRUSTED_SHELL=ssh

            #### Default server-side character set encoding.
            ENCODING=UNICODE

            ########################################
            #### OPTIONAL MIRROR PARAMETERS
            ########################################

            #### Base number by which mirror segment port numbers
            #### are calculated.
            MIRROR_PORT_BASE=7000

            #### File system location(s) where mirror segment data directories
            #### will be created. The number of mirror locations must equal the
            #### number of primary locations as specified in the
            #### DATA_DIRECTORY parameter.
            declare -a MIRROR_DATA_DIRECTORY=(/data0/mirror)
            ```

        - To create a default database during initialization, you need to fill in the database name. In this example, the `warehouse` database is created during initialization

            ```conf
            ########################################
            #### OTHER OPTIONAL PARAMETERS
            ########################################

            #### Create a database of this name after initialization.
            DATABASE_NAME=warehouse
            ```

9. Use `gpinitsystem` to initialize Cloudberry Database. For example:

    ```bash
    gpinitsystem -c  gpinitsystem_config -h /home/gpadmin/seg_hosts
    ```

    In the command above, `-c` specifies the configuration file and `-h` specifies the computing node list.

    If you need to initialize the standby coordinator node, refer to the following command:

    ```bash
    gpinitstandby -s cbdb-standbycoordinator
    ```

## Step 5. Log into Cloudberry Database

Now you have successfully deployed Cloudberry Database. To log into the database, refer to the following command:

```bash
psql -h <hostname> -p <port> -U <username> -d <database>
```

In the command above:

- `<hostname>` is the IP address of the coordinator node of the Cloudberry Database server.
- `<port>` is the default port number of Cloudberry Database, which is `5432` by default.
- `<username>` is the user name of the database.
- `<database>` is the name of the database to connect.

After you run the `psql` command, the system will prompt you to enter the database password. After you enter the correct password, you will successfully log into the Cloudberry Database and can perform SQL queries and operations. Make sure that you have the correct permissions to access the target database.

```sql
[gpadmin@cddb-coordinator ~]$ psql warehouse
psql (14.4, server 14.4)
Type "help" for help.

warehouse=# SELECT * FROM gp_segment_configuration;
dbid | content | role | preferred_role | mode | status | port  | hostname             | address               | datadir
------------------------------------------------------------------------------------------
1    | -1      | p    | p              | n    | u      | 5432 | cddb-coordinator          | cddb-coordinator           | /data0/coordinator/gpseg-1
8    | -1      | m    | m              | s    | u      | 5432 | cddb-standbycoordinator   | cddb-standbycoordinator    | /data0/coordinator/gpseg-1
2    | 0       | p    | p              | s    | u      | 6000 | cddb-datanode01      | cddb-datanode01       | /data0/primary/gpseg0
5    | 0       | m    | m              | s    | u      | 7000 | cddb-datanode02      | cddb-datanode02       | /data0/mirror/gpseg0
3    | 1       | p    | p              | s    | u      | 6000 | cddb-datanode02      | cddb-datanode02       | /data0/primary/gpseg1
6    | 1       | m    | m              | s    | u      | 7000 | cddb-datanode03      | cddb-datanode03       | /data0/mirror/gpseg1
4    | 2       | p    | p              | s    | u      | 6000 | cddb-datanode03      | cddb-datanode03       | /data0/primary/gpseg2
7    | 2       | m    | m              | s    | u      | 7000 | cddb-datanode01      | cddb-datanode01       | /data0/mirror/gpseg2
(8 rows)
```
