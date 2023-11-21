---
title: 通过 RPM 包手动部署
---

# 通过 RPM 包在物理机上手动部署 Cloudberry Database

本文档介绍如何通过 RPM 包在物理机上安装与部署 Cloudberry Database。在阅读本文前，建议先阅读[软硬件配置需求](/i18n/zh/docusaurus-plugin-content-docs/current/cbdb-op-software-hardware.md)和[物理机部署前准备工作](/i18n/zh/docusaurus-plugin-content-docs/current/cbdb-op-prepare-to-deploy.md)。

本文所介绍的部署方法可用于生产环境。

本文示例以 CentOS 7.6 为例，说明如何部署 Cloudberry Database v1.0.0。主要分为以下步骤：

1. [准备节点服务器](#第-1-步准备节点服务器)。
2. [安装 RPM 包](#第-2-步安装-rpm-包)。
3. [配置节点间互信](#第-3-步配置节点间互信)。
4. [初始化数据库](#第-4-步初始化-cloudberry-database)。
5. [登录数据库](#第-5-步登录数据库)。

## 第 1 步：准备节点服务器

参照[物理机部署前准备工作](/i18n/zh/docusaurus-plugin-content-docs/current/cbdb-op-prepare-to-deploy.md)的内容，完成节点服务器的准备工作。

## 第 2 步：安装 RPM 包

在完成准备工作后，就可以安装 Cloudberry Database 了。你需要从 [Cloudberry Database 发布页面](https://github.com/cloudberrydb/cloudberrydb/releases)下载对应的 RPM 安装包，然后在每个节点上通过安装包进行安装。

1. 下载 Cloudberry Database 的 RPM 安装包至 `gpadmin` 主目录 `/home/gpadmin/`：

    ```bash
    wget -P /home/gpadmin <下载地址>
    ```

2. 在 `/home/gpadmin` 目录下安装 RPM 包。

    执行以下命令时，你需要将 `<RPM 安装包路径>` 替换为实际的安装包路径，并使用 `root` 用户执行。安装时，会自动创建默认安装目录 `/usr/local/cloudberry-db/`。

    ```bash
    cd /home/gpadmin
    yum install <RPM 安装包路径>
    ```

3. 为 `gpadmin` 用户授予安装目录的权限：

    ```bash
    chown -R gpadmin:gpadmin /usr/local
    chown -R gpadmin:gpadmin /usr/local/cloudberry*
    ```

## 第 3 步：配置节点间互信

1. 切换到 `gpadmin` 用户，后续操作使用 `gpadmin` 用户进行。

    ```bash
    su - gpadmin
    ```

2. 创建节点的信息配置文件。

    在 `/home/gpadmin/` 目录下创建节点的配置文件，包含 `all_hosts` 和 `seg_hosts` 文件，分别存放全部节点和数据节点的主机信息，代码如下所示：

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

3. 为各主机之间配置 SSH 互信。

    1. 在各主机上执行 `ssh-keygen` 生成 SSH 密钥，示例如下：

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

    2. 在各主机上使用 `ssh-copy-id` 配置免密，示例如下：

        ```bash
        ssh-copy-id  cbdb-coordinator
        ssh-copy-id  cbdb-standbycoordinator
        ssh-copy-id  cbdb-datanode01
        ssh-copy-id  cbdb-datanode02
        ssh-copy-id  cbdb-datanode03
        ```

    3. 验证节点之间的 SSH 是否全部打通，即服务器之间免密码登录是否成功，示例如下：

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

        若无法执行 `gpssh`，可在 Coordinator 节点先执行如下命令 `source /usr/local/cloudberry-db/greenplum_path.sh`。

## 第 4 步：初始化 Cloudberry Database

执行以下操作前，你需要先执行 `su - gpadmin` 切换到 `gpadmin` 用户。

1. 在所有节点（Coordinator/Standby Coordinator/Segment）的 `~/.bashrc` 文件中新增一行 `source` 命令，示例如下：

    ```bash
    source /usr/local/cloudberry-db/greenplum_path.sh
    ```

2. 执行 `source` 命令使得新增内容生效：

    ```bash
    source ~/.bashrc
    ```

3. 在 Coordinator 节点上使用 `gpssh` 命令为 Segment 节点创建数据目录和 Mirror 目录，本文档中两个目录分别为 `/data0/primary/` 和 `/data0/mirror/`，示例如下：

    ```bash
    gpssh -f seg_hosts
    mkdir -p /data0/primary/
    mkdir -p /data0/mirror/
    ```

4. 在 Coordinator 节点上创建数据目录，本文档以 `/data0/coordinator` 为例：

    ```bash
    mkdir -p /data0/coordinator/
    ```

5. 在 Coordinator 节点上使用 `gpssh` 命令为 Standby 节点创建数据目录，本文档以 `/data0/coordinator/` 为例：

    ```bash
    gpssh -h cbdb-standbycoordinator -e 'mkdir -p /data0/coordinator/'
    ```

6. 在 Coordinator 和 Standby 节点的主机上，往 `~/.bashrc` 文件再添加一行 `COORDINATOR_DATA_DIRECTORY` 的路径声明：`{第 5 步的路径}` + `gpseg-1`，示例如下：

    ```bash
    export COORDINATOR_DATA_DIRECTORY=/data0/coordinator/gpseg-1
    ```

7. 在 Coordinator 和 Standby 节点的主机执行以下命令，使上一步对 `COORDINATOR_DATA_DIRECTORY` 的声明生效。

    ```bash
    source ~/.bashrc
    ```

8. 配置 `gpinitsystem_config` 启动脚本。

    1. 在 Coordinator 节点所在主机上，将模板配置文件复制到该当前目录：

        ```bash
        cp $GPHOME/docs/cli_help/gpconfigs/gpinitsystem_config .
        ```

    2. 修改 `gpinitsystem_config` 文件。

        - 注意端口，Coordinator 节点、Segment 节点、Mirror 节点。
        - 将 `DATA_DIRECTORY` 修改为 Segment 计算节点的数据目录，即前面步骤中的 `/data0/primary`。
        - 将 `COORDINATOR_HOSTNAME` 修改为 Coordinator 节点主机名。本文档中 Coordinator 主机名为 `cbdb-coordinator`。
        - 将 `COORDINATOR_DIRECTORY` 修改为 Coordinator 节点数据目录，即前面步骤中的 `/data0/coordinator`。
        - 将 `MIRROR_DATA_DIRECTORY` 修改为 Mirror 的数据目录，即前面步骤的 `/data0/mirror`。
        
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

        - 在初始化过程中如果需要生成默认的数据库，则需要填写数据库名。本文档中，初始化生成 `warehouse`数据库。

            ```conf
            ########################################
            #### OTHER OPTIONAL PARAMETERS
            ########################################

            #### Create a database of this name after initialization.
            DATABASE_NAME=warehouse
            ```

9. 初始化 Cloudberry Database。使用 `gpinitsystem` 命令进行初始化，命令示例如下：

    ```bash
    gpinitsystem -c  gpinitsystem_config -h /home/gpadmin/seg_hosts
    ```

    在以上 `gpinitsystem` 中，`-c` 为配置文件，`-h` 为计算节点列表。

    如果需要初始化 Standby Coordinator 节点，则参考如下命令初始化：

    ```bash
    gpinitstandby -s cbdb-standbycoordinator
    ```

## 第 5 步：登录数据库

至此，Cloudberry Database 已经成功部署，你可以参考以下命令来登录数据库：

```bash
psql -h <hostname> -p <port> -U <username> -d <database>
```

以上命令中：

- `<hostname>` 是 Cloudberry Database 服务器的 Coordinator 节点 IP 地址。
- `<port>` 是 Cloudberry Database 的端口号，默认为 `5432`。
- `<username>` 是数据库的用户名。
- `<database>` 是要连接的数据库名称。

执行命令后，系统将提示你输入数据库密码。输入正确的密码后，你将成功登录到 Cloudberry Database，并可以执行相应的 SQL 查询和操作。请确保你有正确的权限来访问目标数据库。

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
