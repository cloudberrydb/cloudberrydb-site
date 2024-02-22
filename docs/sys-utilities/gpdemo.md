---
title: gpdemo
---

# gpdemo (New in v1.5.0)

Before v1.5.0, if you want to deploy a small Cloudberry Database cluster with segments on a single node to make a demo, you need to spend time writing configuration files and parameters. Starting from v1.5.0, you can use the built-in `gpdemo` script to quickly deploy a cluster with a specified number of segments only with a single command.

`gpdemo` is installed with other system utilities (such as `gpinitsystem`, `gpstart`, and `gpstop`) in the  `GPHOME/bin` directory.

:::warning
It is not recommended to use `gpdemo` for production environments, except when deploying a single node cluster.
:::

## How to use

You can run `gpdemo` once the RPM package is installed on the target server and `greenplum_path.sh` is correctly loaded.

### Deploy with default settings

To quickly deploy a cluster without special requirements for the data directory location, initial port number, or segment count, you can run `gpdemo` without any parameter:

```bash
gpdemo
```

After running this command, the script creates a cluster in the current path. The default configuration of the cluster is as follows:

- Segment count: 3
- Data directory: `./datadirs`
- The initial port number of coordinator: `7000`

:::info
Once a cluster is deployed, the script generates the `gpdemo-env.sh` file in the current directory containing the basic information of the cluster. Before using `gpdemo` to operate on the cluster, run `source gpdemo-env.sh` to load this information.

You need to run this command for each new shell session. To load the cluster information automatically, you can add this command to `~/.bashrc` or  `~/.zshrc`.
:::

### Deploy with customized settings

If you need to customize the number of segments, data directory location, and the initial port number of the cluster, refer to the following instructions.

#### Specify segment count

For the default deployment, the number of segments in a cluster is 3.

To specify the number of segments in a cluster, you can add the `NUM_PRIMARY_MIRROR_PAIRS` parameter to the `gpdemo` command. For example, to specify the number of segments as 3, you can run:

```bash
NUM_PRIMARY_MIRROR_PAIRS=3 gpdemo
```

:::info
- Each segment node consists of a primary node and a mirror node. So every time the parameter value increases by `1`, 2 more nodes will be created. To better capture data distribution issues, it is recommended to set the value to an odd number.
- When the parameter value is set to 0, a single-computing-node cluster is deployed. See [Deploy Cloudberry Database with a Single Computing Node](/docs/deploy-cbdb-with-single-node.md) for details.
:::

#### Specify the data directory of a node

Each node's data in a cluster is stored in the `./datadirs` subdirectory of the current directory. To set the cluster's data directory location, use one of the following methods:

- Switch to the target directory using `cd` and run `gpdemo`.
- In the `gpdemo` command, specify the `DATADIRS` parameter to set the data directory. For example:

    ```bash
    DATADIRS=/target/directory/ gpdemo
    ```

:::info
After a cluster is deployed, if you want to manually adjust the location of the data directory (by modifying the `pg_hha.conf`configuration file), you might need to know the default directories of the coordinator node and segment nodes.

- Regular multi-node mode (which means `NUM_PRIMARY_MIRROR_PAIRS` >  0)
    - Coordinator: `./datadirs/qddir`
    - Coordinator Standby: `./datadirs/standby`
    - Segments
        - Primary: `./datadirs/dbfast<N>`, where `<N>` is the segment number.
        - Mirror: `./datadirs/dbfast_mirror<N>`, where `<N>`is the segment number.

- Single-node mode (which means `NUM_PRIMARY_MIRROR_PAIRS` =  0)
    - Coordinator: `./datadirs/singlenodedir`
    - Coordinator Standby: `./datadirs/standby`
:::

#### Specify the initial port number of the coordinator node

By default, the port number of the Coordinator node is `7000`. Starting from this number, all other nodes in the cluster are assigned consecutive port numbers.

To specify the initial port number of a cluster's coordinator node, you can add the `PORT_BASE` parameter to the `gpdemo` command. For example:

```bash
PORT_BASE=7000 gpdemo
```

#### Specify additional initialization parameter for each node in the cluster

`BLDWRAP_POSTGRES_CONF_ADDONS` specifies the additional initialization parameter for each node in a cluster. The default value `fsync=off` is for better concurrency performance.

**In a production environment, use `export BLDWRAP_POSTGRES_CONF_ADDONS ="fsync=on"` to enable fsync.  Otherwise, the ACID  characteristics of the database will be affected. In the single-node mode, fsync is automatically enabled.**

## Command-line options

`gpdemo` provides the following command-line options. You can also check them using `gpdemo -H`.

| Option       | Description                                                                                                                                                                                                                                                                       |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-K`         | Skips the data consistency check when deploying a cluster. This option is not recommended.                                                                                                                                                                                        |
| `-c`         | Checks the port occupancy and confirms whether a test cluster can be deployed.<br /><br />Before running `gpdemo -c`, you need to run `source gpdemo-env.sh` to load the basic information of a cluster. The `sh` file is located in the directory where the cluster is created.            |
| `-d`         | Deletes the test cluster.<br /><br />Before running `gpdemo -c`, you need to run `source gpdemo-env.sh` to load the basic information of a cluster. The `sh` file is located in the directory where the cluster is created.                                                                 |
| `-p`         | Views cluster status, version and other information of the coordinator and segment nodes.<br /><br />Before running `gpdemo -c`, you need to run `source gpdemo-env.sh` to load the basic information of a cluster. The `sh` file is located in the directory where the cluster is created. |
| `-H ` or `-H` | `gpdemo -h` outputs a brief help description.`gpdemo -H` outputs a more detailed help description, including additional configurations such as environment variables.                                                                                                             |
| `-v`         | Checks the current `gpdemo` version.                                                                                                                                                                                                                                              |