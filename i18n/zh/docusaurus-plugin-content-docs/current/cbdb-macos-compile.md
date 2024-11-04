---
title: 在 macOS 上
---

# 在 macOS 上编译和安装 Cloudberry Database

:::info 提示
本文档来自 GitHub 仓库 [`cloudberrydb/cloudberrydb`](https://github.com/cloudberrydb/cloudberrydb/blob/main/deploy/build/README.macOS.md)。
:::

本文档分享了如何在 macOS 上（单节点）构建、编译和安装 Cloudberry Database 以供开发测试使用。请按照以下步骤操作。

根据我们的测试，在配备 Intel 和 Apple 芯片处理器（M1 或 M2）的 macOS Ventura 13.4+ 上，以下步骤能顺利执行。如果你有早前版本的 macOS，建议先升级系统。请确保你的 Mac 电脑至少有 4 核处理器和 8 GB 内存，并连接到互联网。

:::caution 注意
请勿使用本指南进行生产部署。
:::

## 第 1 步：安装依赖项

1. 将 Cloudberry Database 的源代码从 GitHub 克隆到本地 Mac。

    ```bash
    git clone git@github.com:cloudberrydb/cloudberrydb.git
    ```

2. 进入 `cloudberrydb/` 目录。

    ```bash
    cd cloudberrydb/
    ```

3. 运行以下命令安装依赖项。系统会提示你输入 macOS 系统的 sudo 密码。

    ```bash
    source deploy/build/README.macOS.bash
    ```

    :::info 提示
    如果系统中未安装 [Homebrew](https://brew.sh/)，此命令会自动安装 Homebrew。
    :::

## 第 2 步：为本地主机配置免密 SSH 登录

1. 打开 macOS 系统的**系统设置** \> **通用** \> **共享** \> **远程登录**，在 macOS 上启用**远程登录**。
2. 验证 macOS 系统是否开启与 localhost 的免密 SSH 连接：

    ```bash
    ssh $(hostname)
    ```

    - 如果以上命令运行没有报错或没有提示输入密码，请执行 `exit` 并阅读下一节[第 3 步：配置、编译和安装](#第-3-步配置编译和安装)。
    - 如果需要输入密码，请按照以下步骤设置免密码 SSH 连接。

        1. 执行 `ssh-keygen`，然后执行 `cat ~/.ssh/id_rsa.pub >>  ~/.ssh/authorized_keys`。
        2. 再次执行 `ssh $(hostname)`，检查免密码 SSH 连接是否可用。
        3. 如果可用，执行 `exit` 并阅读下一节[第 3 步：配置、编译和安装](#第-3-步配置编译和安装)。

:::info 提示

- 如果你是第一次使用 `ssh` 连接到 localhost，在遇到以下提示时，你需要确认继续连接：

    ```bash
    The authenticity of host '<your hostname>' can't be established.
    ECDSA key fingerprint is SHA256:<fingerprint here>.
    Are you sure you want to continue connecting (yes/no)?
    ```

- 如果主机名无法解析，请尝试将你的机器名添加到 `/etc/hosts`，例如：

    ```bash
    echo -e "127.0.0.1\t$HOSTNAME" | sudo tee -a /etc/hosts
    ```

:::

## 第 3 步：配置、编译和安装

```bash
# 在 `cloudberrydb/` 目录下运行以下命令。
# 1. 配置构建环境。

BREWPREFIX=$(brew --prefix); export PATH="$BREWPREFIX/opt/gnu-sed/libexec/gnubin:$BREWPREFIX/opt/apr/bin:$PATH"; CXXFLAGS="-I $BREWPREFIX/include" CFLAGS="-ggdb -Og -g3 -fno-omit-frame-pointer -I $BREWPREFIX/include" LDFLAGS="-L $BREWPREFIX/lib" CC=$(which gcc-13) CXX=$(which g++-13) ./configure --enable-debug --prefix=$(cd ~; pwd)/install/cbdb;

# 2. 编译并安装 Cloudberry Database。

make -j8
make -j8 install

# 3. 将 Cloudberry Database 的 Greenplum 环境引入运行中的 shell。

source $(cd ~; pwd)/install/cbdb/greenplum_path.sh

# 4. 安装 Python 依赖。

pip3 install --user -r python-dependencies.txt

# 5. 开启示例集群。

PORT_BASE=8000 make create-demo-cluster
```

执行以下命令，该命令会配置端口和环境变量，例如 `PGPORT`（主节点的默认端口） 和 `COORDINATOR_DATA_DIRECTORY`（主节点的数据目录）。

```bash
source gpAux/gpdemo/gpdemo-env.sh
```

## 第 4 步：验证集群

1. 执行以下命令来验证集群是否已成功启动。如果成功启动，你会在输出结果中看到端口在 `8000` 到 `8007` 之间的多个 `postgres` 进程。

    ```bash
    ps -ef | grep postgres
    ```
    
2. 连接至 Cloudberry Database，通过查询系统表 `gp_segement_configuration` 查看活跃 segment 的信息。关于此系统表的详细描述，参见 [Greenplum 文档](https://docs.vmware.com/en/VMware-Greenplum/7/greenplum-database/ref_guide-system_catalogs-gp_segment_configuration.html)。

    ```sql
    $ psql -p 8000 postgres
    postgres=# select version();
    postgres=# select * from gp_segment_configuration;
    ```
    
    示例输出：

    ```shell
    $ psql -p 8000 postgres
    psql (14.4, server 14.4)
    Type "help" for help.

    postgres=# select version();
                                                                                             version                                                                                         
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     PostgreSQL 14.4 (Cloudberry Database 1.0.0+1c0d6e2224 build dev) on x86_64-apple-darwin22.4.0, compiled by gcc-13 (Homebrew GCC 13.2.0) 13.2.0, 64-bit compiled on Sep 22 2023 10:56:01
    (1 row)

    postgres=# select * from gp_segment_configuration;
     dbid | content | role | preferred_role | mode | status | port |          hostname           |           address           |                                                 datadir                                                  | warehouseid 
    ------+---------+------+----------------+------+--------+------+-----------------------------+-----------------------------+----------------------------------------------------------------------------------------------------------+-------------
        1 |      -1 | p    | p              | n    | u      | 8000 | cbdb.local | cbdb.local | /Users/cbdb/Documents/GitHub/upstream/cloudberrydb/gpAux/gpdemo/datadirs/qddir/demoDataDir-1         |           0
        8 |      -1 | m    | m              | s    | u      | 8001 | cbdb.local | cbdb.local | /Users/cbdb/Documents/GitHub/upstream/cloudberrydb/gpAux/gpdemo/datadirs/standby                     |           0
        3 |       1 | p    | p              | s    | u      | 8003 | cbdb.local | cbdb.local | /Users/cbdb/Documents/GitHub/upstream/cloudberrydb/gpAux/gpdemo/datadirs/dbfast2/demoDataDir1        |           0
        6 |       1 | m    | m              | s    | u      | 8006 | cbdb.local | cbdb.local | /Users/cbdb/Documents/GitHub/upstream/cloudberrydb/gpAux/gpdemo/datadirs/dbfast_mirror2/demoDataDir1 |           0
        2 |       0 | p    | p              | s    | u      | 8002 | cbdb.local | cbdb.local | /Users/cbdb/Documents/GitHub/upstream/cloudberrydb/gpAux/gpdemo/datadirs/dbfast1/demoDataDir0        |           0
        5 |       0 | m    | m              | s    | u      | 8005 | cbdb.local | cbdb.local | /Users/cbdb/Documents/GitHub/upstream/cloudberrydb/gpAux/gpdemo/datadirs/dbfast_mirror1/demoDataDir0 |           0
        4 |       2 | p    | p              | s    | u      | 8004 | cbdb.local | cbdb.local | /Users/cbdb/Documents/GitHub/upstream/cloudberrydb/gpAux/gpdemo/datadirs/dbfast3/demoDataDir2        |           0
        7 |       2 | m    | m              | s    | u      | 8007 | cbdb.local | cbdb.local | /Users/cbdb/Documents/GitHub/upstream/cloudberrydb/gpAux/gpdemo/datadirs/dbfast_mirror3/demoDataDir2 |           0
    (8 rows)

    postgres=# 
    ```

3. 现在你可以执行以下命令来启动集群:

    ```bash
    # 在你克隆源代码的文件夹中
    make installcheck-world
    ```

恭喜 🎉！你已成功安装并创建了 CloudberryDB 集群。祝你开心！😉
