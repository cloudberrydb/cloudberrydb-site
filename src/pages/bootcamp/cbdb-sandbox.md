---
title: Sandbox of Single-Node Cloudberry Database
---

# Install Single-Node Cloudberry Database in a Docker Container

This document guides you on how to quickly set up and connect to a single-node Cloudberry Database in a Docker environment. You can try out Cloudberry Database by performing some basic operations and running SQL commands.

:::warning

This guide is intended for testing or development. DO NOT use it for production.

:::

## Prerequisites

Make sure that your environment meets the following requirements:

- Platform requirement: Any platform with Docker runtime. For details, refer to [Get Started with Docker](https://www.docker.com/get-started/).
- Other dependencies: Git, SSH, and internet connection

## Build the Sandbox

This section introduces how to set up the Docker container in which the source code of Cloudberry Database v1.0 (released in [Cloudberry Database Release Page](https://github.com/cloudberrydb/cloudberrydb/releases)) will be compiled. In this CentOS 7.9 Docker container, a single-node cluster will be initialized with one coordinator and two segments. Both x86 and ARM CPUs (including Apple chips) are supported.

Build steps:

1. Start Docker Desktop and make sure it is running properly on your host platform.

2. Download this repository (which is [cloudberrydb/bootcamp](https://github.com/cloudberrydb/bootcamp)) to the target machine.

    ```shell
    git clone https://github.com/cloudberrydb/bootcamp.git
    ```

3. Enter the repository and run the `run.sh` script to start the Docker container. This will start the automatic installation process.

    ```shell
    cd bootcamp/000-cbdb-sandbox
    chmod +x ./run.sh
    ./run.sh
    ```

    Once the script finishes without error, the sandbox is built successfully. 

## Connect to the database

You can now connect to the database and try some basic operations.

1. Connect to the Docker container from the host machine:

    ```shell
    docker exec -it $(docker ps -q) /bin/bash
    ```

    If it is successful, you will see the following prompt:

    ```shell
    [root@mdw /]$
    ```

2. Log into Cloudberry Database in Docker. See the following commands and example outputs:

    ```shell
    [root@mdw /] su - gpadmin  # Switches to the gpadmin user.

    # Last login: Tue Oct 24 10:26:14 CST 2023 on pts/1

    [gpadmin@mdw ~]$ psql  # Connects to the database with the default database name "gpadmin".

    # psql (14.4, server 14.4)
    # Type "help" for help.
    ```

    ```sql
    gpadmin=# SELECT VERSION();  -- Checks the database version.
                                                                                            version

    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    -----
    PostgreSQL 14.4 (Cloudberry Database 1.0.0 build dev) on aarch64-unknown-linux-gnu, compiled by gcc (GCC) 10.2.1 20210130 (Red Hat 10.2.1-11), 64-bit compiled on Oct 24 2023 10:24:28
    (1 row)
    ```

In addition to using the `docker exec` command, you can also use the `ssh` command. This command will connect to the database with the default database name `gpadmin`:

```shell
ssh gpadmin@localhost # Password: cbdb@123
```

Now you have a Cloudberry Database and can continue with [101 Cloudberry Database Tutorials](./#2-101-cloudberrydb-tourials)! Enjoy!

