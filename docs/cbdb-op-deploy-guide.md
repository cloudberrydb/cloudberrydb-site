---
title: Physical Machine Deployment Guide
---

# Physical Machine Deployment Guide

This document describes how to deploy Cloudberry Database on physical machines. Before reading this document, first you need to read [Physical Machine Deployment Architecture](./cbdb-op-deploy-arch.md) and [Software and Hardware Configuration Requirements](./cbdb-op-software-hardware.md).

:::info

The deployment methods described in this document are based on the [Automatic high availability architecture](./cbdb-op-deploy-arch.md#automatic-high-availability-architecture).

:::

:::info Glossary

- FTS (Fault Tolerance Service) is a high availability fault recovery component of Cloudberry Database.
- ETCD: Used to store the cluster topology information and cluster state metadata of Cloudberry Database.
- Hybrid Deployment: The ETCD and FTS clusters are deployed on the same physical machines as database nodes.

:::

For the test environment, you can choose any of the following deployment modes (click the link for a detailed description):

- [Minimal deployment mode](#minimal-deployment-mode): Suitable for quick verification or PoC scenarios. It requires less resources (at least 2 servers) but provides poor availability. In this mode, the ETCD and FTS clusters are deployed on the database nodes in a hybrid way.
- [Single-node deployment mode](#single-node-deployment-mode): Suitable for development test and trial use by open-source users. It only requires single-node resource (one server), and does not guarantee high availability. In this mode, the ETCD and FTS clusters are deployed on a single node.

For the production environment, you can choose any of the following deployment modes (click the link for a detailed description):

- [Standard distributed deployment mode](#standard-distributed-deployment-mode): Suitable for production environments, with the highest guarantee of availability among all modes. In this mode, you need additional machine resources to deploy the ETCD and FTS clusters independently.
- [Hybrid deployment mode](#hybrid-deployment-mode): Suitable for production environments, with high availability, but not as much as the standard distributed deployment mode. In this mode, the ETCD and FTS clusters are deployed on the database nodes in a hybrid way, and no additional machine resources are required.

## Test environment deployments

:::danger Warning

The following deployment modes are only for test environments. Do not use the minimal deployment mode and the single-node deployment mode in production environments.

:::

### Minimal deployment mode

This mode is suitable for quick verification or PoC scenarios. It requires less resources but provides poor availability. In this deployment mode, you only need to deploy the FTS and ETCD services in a hybrid way on different database nodes, and no additional machine resources are required to deploy FTS and ETCD as independent clusters.

The minimal deployment mode is distributed and requires at least 2 physical machines. To learn the configuration required for this mode, see [recommended configurations for development and test environments](./cbdb-op-software-hardware.md#for-development-or-test-environments).

The following are the steps to perform the minimal deployment:

#### Step 1: Plan the deployment

It is recommended to deploy nodes according to the following table:

| Component           | Recommended number of physical machines | Description                                                            |
| :------------------ | :-------------------------------------- | :-------------------------------------------------------------------- |
| Master node         | 1                                       |                                                                        |
| Segment (computing node) | 1                                       |                                                                        |
| FTS node            | 0                                       | The FTS cluster supports multi-node hybrid deployment, and you do not need to reserve physical machines separately. Two nodes are deployed by default for availability. |
| ETCD metadata node  | 0                                       | ETCD clusters support multi-node deployment, and you do not need to reserve separate physical machines for the deployment. High availability is natively supported by the application. |

#### Step 2: Prepare configuration files

:::info

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

3. On the master node, create a file named `seg_host` and fill in all the host names of the segments in this file.

    ```
    segment1
    ```

4. On the master node, create a file named `cbdb_etcd.conf`. Then write the following configuration items in the file.

    - `gp_etcd_endpoints`: Node names of the ETCD cluster service. You need to configure the node names with the hostnames of master and segment, and the ETCD service will start on these 2 hosts by default.
    - `gp_etcd_account_id`: Tenant ID. You can generate a globally unique UUID using the UUID tool for it.
    - `gp_etcd_cluster_id`: Cluster ID. You can generate a globally unique UUID using the UUID tool for it.

    An example of the configuration file is as follows:

    ```
    gp_etcd_endpoints='master:2379,standby:2379,seg1:2379'
    gp_etcd_account_id='e3cb5400-9589-918d-c178-82d500deac6e'
    gp_etcd_cluster_id='7bc05356-67f9-49fe-804e-12fe30b093ef'
    gp_etcd_namespace='default'
    ```

    :::info

    `gp_etcd_namespace` is the namespace configuration for the cluster, and physical machine deployments use the default configuration.

    :::

#### Step 3: Configure SSH password-free login for the `gpadmin` account

Use the `ssh-copy-id` command to configure password-free login by the `gpadmin` user of the master.

```shell
ssh-copy-id -f master
ssh-copy-id -f seg1
```

#### Step 4: Create data directory {#minimal-step-4}

1. In the `~/.bashrc` file on each node, add the `source` command. For example:

    ```bash
    # /usr/local/cloudberry-db is the deployment directory for Cloudberry Database.

    source /usr/local/cloudberry-db/greenplum_path.sh
    ```

2. On the master node, use the `gpssh` command to create a data directory and a mirror directory for segments.

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

4. In the `~/.bashrc` file on the master node, add the following command with the path `{path in the previous step} + gpseg-1`.

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

    - Modify `DATA_DIRECTORY` to the data directory of the segment node, which is `/data0/primary` as mentioned in step 2 of [Step 4: Create data directory](#minimal-step-4).
    - Modify `COORDINATOR_HOSTNAME` to the hostname of the master node.
    - Modify `COORDINATOR_DIRECTORY` to the data directory of the master node, which is `/data0/master` as mentioned in step 3 of [Step 4: Create data directory](#minimal-step-4).

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

    If there are mirror nodes, `MIRROR_PORT_BASE` and `MIRROR_DATA_DIRECTORY` also need to be modified.

    - `MIRROR_PORT_BASE` is the port used by the mirror node.
    - `MIRROR_DATA_DIRECTORY` is the data directory of the mirror node, which is `/data0/mirror` as mentioned in step 2 of [Step 4: Create data directory](#minimal-step-4).

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

The single-node deployment mode deploys FTS and ETCD services on a single local node. This mode is mainly used for development test scenarios. It does not support high availability and is not suitable for production environments.

The single-node deployment mode is non-distributed. All services are deployed on the same physical machine. To learn the configuration required for this mode, see [development and test environment configuration](./cbdb-op-software-hardware.md#for-development-or-test-environments).

To perform the single-node deployment, take these steps:

1. Download the Cloudberry Database source code to your local directory. The download link is <https://github.com/cloudberrydb/cloudberrydb>.

2. Refer to the [README.md](https://github.com/cloudberrydb/cloudberrydb/tree/main/readmes) in the Cloudberry Database code repository to compile the source code and install the database.

3. Run the `make create-demo-cluster` command.

:::info

The steps for this deployment mode are on the way. Please keep watching.

:::

## Production deployments

### Standard distributed deployment mode

In this deployment mode, FTS and ETCD cluster nodes are deployed on separate physical machines. The system has high reliability and supports automatic fault recovery by switching between master/standby nodes, which is suitable for production environments that require high availability.

To learn the physical configuration required for this mode, see [configuration for production environment](./cbdb-op-software-hardware.md#for-production-environments).

To deploy Cloudberry Database in this mode, take the following steps.

#### Step 1: Plan the deployment

It is recommended to deploy nodes according to the following table:

| Component       | Recommended number of physical machines | Description |
| :-------------  | :---------------- | :---------- |
| Master node     | 1                |             |
| Standby node    | 1                | The standby node is used for hot backup of the master node. |
| Segment (computing node) |  3      | It is recommended to deploy the same number of mirror nodes as computing nodes for high availability. |
| FTS node        | 3                | The FTS cluster supports multi-node independent deployment, with the default configuration of 3 nodes to ensure high availability. |
| ETCD metadata node | 3             | The ETCD cluster supports multi-node independent deployment. High availability is natively supported by applications. |

:::info

- The following deployment operations are performed by the `gpadmin` user.
- It is recommended to deploy the FTS nodes and ETCD nodes on the same server to save resources.

:::

#### Step 2: Prepare configuration files

1. Prepare physical machines according to the recommended nodes in the previous step. Edit the `/etc/hosts` file. Then add all cluster nodes including all IP addresses and aliases. For example:

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

6. On the master node, create a file named `cbdb_etcd.conf`. Then write the following configuration items in the file.

    - `gp_etcd_endpoints`: Node names of the ETCD cluster service. You need to configure the ETCD service node hosts `{etcd-service-0}`, `{etcd-service-1}`, and `{etcd-service-2}` in `etcd_service.conf`. The ETCD service will start on these 3 hosts by default.
    - `gp_etcd_account_id`: Tenant ID. You can generate a globally unique UUID using the UUID tool for it.
    - `gp_etcd_cluster_id`: Cluster ID. You can generate a globally unique UUID using the UUID tool for it.

    An example of the configuration file is as follows:

    ```conf
    gp_etcd_endpoints='{etcd-service-0}:2379,{etcd-service-1}:2379,{etcd-service-2}:2379'
    gp_etcd_account_id='e3cb5400-9589-918d-c178-82d500deac6e'
    gp_etcd_cluster_id='7bc05356-67f9-49fe-804e-12fe30b093ef'
    gp_etcd_namespace='default'
    ```

    :::info

    `gp_etcd_namespace` is the namespace configuration for the cluster. For physical machine deployments, use the default configuration of `gp_etcd_namespace`.

    :::

    For example, to deploy 3 ETCD hosts: etcd1, etcd2, etcd3.

    ```conf
    gp_etcd_endpoints='etcd1:2379,etcd2:2379,etcd3:2379'
    gp_etcd_account_id='e3cb5400-9589-918d-c178-82d500deac6e'
    gp_etcd_cluster_id='7bc05356-67f9-49fe-804e-12fe30b093ef'
    gp_etcd_namespace='default'
    ```

#### Step 3: Configure SSH password-free login for the `gpadmin` account

Use the `ssh-copy-id` command to configure password-free login by the `gpadmin` user of the master. For example:

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

1. In the `~/.bashrc` file of each node, add the `source` command. For example:

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
    # For example, /data0/master.

    mkdir -p /data0/master
    ```

4. Create a data directory on the standby node.

    ```bash
    # For example, /data0/master.

    gpssh -h standby -e 'mkdir -p /data0/master'
    ```

5. In the `~/.bashrc` file of the master and standby nodes, add the following command with the path `{path in the previous step} + gpseg-1`.

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

    - Modify `DATA_DIRECTORY` to the data directory of the segment node, which is `/data0/primary` as mentioned in step 2 of [Step 4: Create data directory](#standard-step-4).
    - Modify `COORDINATOR_HOSTNAME` to the hostname of the master node.
    - Modify `COORDINATOR_DIRECTORY` to the data directory of the master node, which is `/data0/master` as mentioned in step 3 of [Step 4: Create data directory](#standard-step-4).

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

    If there are mirror nodes, `MIRROR_PORT_BASE` and `MIRROR_DATA_DIRECTORY` also need to be modified.

    - `MIRROR_PORT_BASE` is the port used by the mirror node.
    - `MIRROR_DATA_DIRECTORY` is the data directory of the mirror node, which is `/data0/mirror` as mentioned in step 2 of [Step 4: Create data directory](#standard-step-4).

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

### Hybrid deployment mode

In this mode, you can reuse the existing physical machines to deploy the FTS and ETCD services. No additional physical machines are required for FTS and ETCD. The system reliability is not as high as that of the standard distributed deployment. This deployment mode supports automatic fault recovery by switching between master/standby nodes.

To learn the physical configuration required for this mode, see [configuration for production environment](./cbdb-op-software-hardware.md#for-production-environments).

To deploy Cloudberry Database in this mode, take the following steps.

#### Step 1: Plan the deployment

It is recommended to plan the nodes to be deployed according to the following table:

| Component       | Recommended number of physical machines | Description |
| :-------------  | :---------------- | :---------- |
| Master node     | 1                |             |
| Standby node    | 1                | The standby node is used for hot backup of the master node. |
| Segment (computing node) |  3      | It is recommended to deploy the same number of mirror nodes as computing nodes for high availability. The number of segment nodes is determined according to data requirements and related hardware (the number of disks mounted on the machine). |
| FTS node        | 3                | The FTS cluster supports multi-node hybrid deployment, you do not need to reserve physical machines separately. Three nodes are deployed by default for availability. |
| ETCD metadata node | 3             | The ETCD cluster supports multi-node deployment, and you do no need to reserve physical machines separately. High availability is natively supported by applications. |

:::info

- The following deployment operations are performed by the `gpadmin` user.
- Because segments are computing nodes, deploying the ETCD and FTS services on computing nodes might cause performance issues in production environments. To avoid performance issues and improve system reliability, it is recommended to specify an additional physical machine `{host}` through the configuration file to deploy ETCD and FTS services, that is, master + standby + {host} deployment.

:::

#### Step 2: Prepare configuration files

1. Prepare physical machines according to the recommended nodes in the previous step. Edit the `/etc/hosts` file. Then add all cluster nodes including all IP addresses and aliases. For example:

    ```
    # Loopback address       Hostname
    <ip_address 1>           master
    <ip_address 2>           standby 1
    <ip_address 3>           segment 1
    <ip_address 4>           segment 2
    <ip_address 5>           segment 3
    ```

2. On the master node, create a file named `all_host`, and fill in all the hostnames in this file.

    ```
    master
    standby
    segment 1
    segment 2
    segment 3
    ```

3. On the master node, create a file named `seg_host`, and fill in all the hostnames of the segment nodes in this file.

    ```
    segment 1
    segment 2
    segment 3
    ```

4. On the master node, create a file named `cbdb_etcd.conf`. Then write the following configuration items in the file.

    - `gp_etcd_endpoints`: Node names of the ETCD cluster service. You need to configure the node names with the hostnames of master, standby, and the segment on which ETCD are to be deployed. The ETCD service will start on these 3 hosts by default.
    - `gp_etcd_account_id`: Tenant ID. You can generate a globally unique UUID using the UUID tool for it.
    - `gp_etcd_cluster_id`: Cluster ID. You can generate a globally unique UUID using the UUID tool for it.

    An example of the configuration file is as follows:

    ```conf
    gp_etcd_endpoints='master:2379,standby:2379,seg1:2379'
    gp_etcd_account_id='e3cb5400-9589-918d-c178-82d500deac6e'
    gp_etcd_cluster_id='7bc05356-67f9-49fe-804e-12fe30b093ef'
    gp_etcd_namespace='default'
    ```

    :::info

    `gp_etcd_namespace` is the namespace configuration for the cluster. For physical machine deployments, use the default configuration of `gp_etcd_namespace`.

    :::

#### Step 3: Configure SSH password-free login for the `gpadmin` account

With the `gpadmin` user of the master host, use the `ssh-copy-id` command to configure keyless authentication. For example:

```shell
ssh-copy-id -f master
ssh-copy-id -f standby
ssh-copy-id -f seg1
ssh-copy-id -f seg2
ssh-copy-id -f seg3
```

#### Step 4: Create data directories {#hybrid-step-4}

1. In the `~/.bashrc` file of each node, add a line of the `source` command. For example:

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
    # For example, /data0/master.

    mkdir -p /data0/master
    ```

4. Create a data directory on the standby node.

    ```bash
    # For example, /data0/master.

    gpssh -h standby -e 'mkdir -p /data0/master'
    ```

5. In the `~/.bashrc` file of the master and standby nodes, add the following command with the path `{path in the previous step} + gpseg-1`.

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

    - Modify `DATA_DIRECTORY` to the data directory of the segment node, which is `/data0/primary` as mentioned in step 2 of [Step 4: Create data directory](#hybrid-step-4).
    - Modify `COORDINATOR_HOSTNAME` to the hostname of the master node.
    - Modify `COORDINATOR_DIRECTORY` to the data directory of the master node, which is `/data0/master` as mentioned in step 3 of [Step 4: Create data directory](#hybrid-step-4).

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

    If there are mirror nodes, `MIRROR_PORT_BASE` and `MIRROR_DATA_DIRECTORY` also need to be modified.

    - `MIRROR_PORT_BASE` is the port used by the mirror node.
    - `MIRROR_DATA_DIRECTORY` is the data directory of the mirror node, which is `/data0/mirror` as mentioned in step 2 of [Step 4: Create data directory](#hybrid-step-4).

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
gpinitsystem -c gpinitsystem_config -p cbdb_etcd.conf -h seg_host -s standby
```

## Points to note

- If you want to enable the feature that automatically detects whether the master is down and upgrades the standby to master, you need to execute the DML twice in the system.
- The ETCD service requires at least 2 live nodes to operate normally, while the FTS service only requires 1 live node.
- The logs of the FTS node are stored in the `/tmp/fts/log` folder.
