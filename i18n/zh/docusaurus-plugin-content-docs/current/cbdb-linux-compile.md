---
title: 在 Linux 上
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 在 Linux 系统上编译和安装 Cloudberry Database

:::info
本文档来自 GitHub 仓库 [`cloudberrydb/cloudberrydb`](https://github.com/cloudberrydb/cloudberrydb/blob/main/readmes/README.Linux.md).
:::

本文档分享如何在 Linux 系统（CentOS 7、RHEL 和 Ubuntu）上编译和安装 Cloudberry Database。请注意，本文档仅供开发人员在单节点环境中尝试 Cloudberry Database。**请勿将本文档用于生产环境**。

按照以下步骤设置开发环境：

1. [克隆 GitHub 仓库](#第-1-步克隆-github-仓库)。
2. [安装依赖项](#第-2-步安装依赖项)。
3. [执行平台准备工作](#第-3-步执行平台准备工作)。
4. [构建 Cloudberry Database](#第-4-步构建-cloudberry-database)。
5. [验证集群](#第-5-步验证集群)。

## 第 1 步：克隆 GitHub 仓库

将 GitHub 仓库 `cloudberrydb/cloudberrydb` 克隆到目标机器：

```shell
git clone https://github.com/cloudberrydb/cloudberrydb.git
```

## 第 2 步：安装依赖项

进入仓库目录，根据你的操作系统安装依赖项：

<Tabs>
<TabItem value="centos-7" label="CentOS 7" default>

以下步骤在 CentOS 7 上测试通过。对于其他版本的 CentOS，这些步骤可能有效，但不能保证有效。

1. 执行 `cloudberrydb/cloudberrydb` 仓库下 `readmes` 目录中的 `README.CentOS.bash` 脚本。执行此脚本需要输入密码。然后，系统会自动下载一些必要的依赖项。

    ```bash
    cd cloudberrydb/readmes
    ./README.CentOS.bash
    ```

2. 安装配置所需的其他包。

    ```bash
    yum -y install R apr apr-devel apr-util automake autoconf bash bison bison-devel bzip2 bzip2-devel centos-release-scl curl flex flex-devel gcc gcc-c++ git gdb iproute krb5-devel less libcurl libcurl-devel libevent libevent-devel libxml2 libxml2-devel libyaml libzstd-devel libzstd make openldap openssh openssh-clients openssh-server openssl openssl-devel openssl-libs perl python3-devel readline readline-devel rsync sed sudo tar vim wget which xerces-c-devel zip zlib && \
    yum -y install epel-release
    ```

3. 将 GNU Compiler Collection (GCC) 更新到 `devtoolset-10` 版本，以支持 C++ 14。

    ```bash
    yum install centos-release-scl 
    yum -y install devtoolset-10-gcc devtoolset-10-gcc-c++ devtoolset-10-binutils 
    scl enable devtoolset-10 bash 
    source /opt/rh/devtoolset-10/enable 
    echo "source /opt/rh/devtoolset-10/enable" >> /etc/bashrc
    source /etc/bashrc
    gcc -v
    ```

4. 将 cmake3 链接到 cmake：

    ```bash
    sudo ln -sf /usr/bin/cmake3 /usr/local/bin/cmake
    ```

</TabItem>
<TabItem value="rockey-rhel-8" label="RHEL 8 和 Rocky Linux 8" default>

1. 安装开发工具 Development Tools。

    ```bash
    sudo yum group install -y "Development Tools"
    ```

2. 安装依赖项。

    ```bash
    sudo yum install -y epel-release

    sudo yum install -y apr-devel bison bzip2-devel cmake3 flex gcc gcc-c++ krb5-devel libcurl-devel libevent-devel libkadm5  libxml2-devel libzstd-devel openssl-devel perl-ExtUtils-Embed python3-devel python3-pip readline-devel xerces-c-devel zlib-devel
    ```

3. 执行 `README.Rhel-Rocky.bash` 脚本安装更多依赖项。

    ```bash
    ~/cloudberrydb/readmes/README.Rhel-Rocky.bash
    ```

</TabItem>
<TabItem value="ubuntu-18.04" label="Ubuntu 18.04 或更新版本" default>

1. 执行 `readmes` 目录下的 `README.Ubuntu.bash` 脚本，以安装依赖项。

    ```shell
    # 执行该脚本需要输入密码。
    sudo ~/cloudberrydb/readmes/README.Ubuntu.bash
    ```

    :::info 提示
    - 当执行 `README.Ubutnu.bash` 脚本安装依赖项时，会提示你配置 Kerberos 的 `realm`。你可以输入任意 `realm`，因为这只是用于测试，而且在测试期间，系统会重新配置本地服务器/客户端。如果你想跳过此手动配置，请执行 `export DEBIAN_FRONTEND=noninteractive`。
    - 如果脚本下载安装包失败，请尝试使用另一个 Ubuntu 软件源。
    :::

2. 安装 GCC 10。Ubuntu 18.04 及以上版本应当使用 GCC 10 或以上版本：

    ```bash
    # 安装 gcc-10
    sudo apt install software-properties-common
    sudo add-apt-repository ppa:ubuntu-toolchain-r/test
    sudo apt install gcc-10 g++-10
    sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-10 100
    ```

</TabItem>
</Tabs>

## 第 3 步：执行平台准备工作

在操作系统上安装所有依赖项后，在构建 Cloudberry Database 之前你还需要执行一些平台准备工作。这些操作包括在平台上手动运行 `ldconfig`、创建 `gpadmin` 用户以及设置密码以启动 Cloudberry Database 并进行测试。

1. 确保将 `/usr/local/lib` 和 `/usr/local/lib64` 添加到 `/etc/ld.so.conf` 文件中。

    ```bash
    echo -e "/usr/local/lib \n/usr/local/lib64" >> /etc/ld.so.conf
    ldconfig
    ```

2. 创建 `gpadmin` 用户并设置 SSH 密钥。根据不同的操作系统手动创建 SSH 密钥，这样你就可以在不输入密码的情况下运行 `ssh localhost`。

    <Tabs>
    <TabItem value="centos-rhel-rockey" label="CentOS、Rocky Linux 和 RHEL" default>

    ```bash
    useradd gpadmin  # 创建 gpadmin 用户
    su - gpadmin  # 切换到 gpadmin 用户
    ssh-keygen  # 创建 SSH 密钥
    cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
    chmod 600 ~/.ssh/authorized_keys
    exit
    ```

    </TabItem>
    <TabItem value="ubuntu" label="Ubuntu" default>

    ```bash
    useradd -r -m -s /bin/bash gpadmin  # 创建 gpadmin 用户
    su - gpadmin  # 切换到 gpadmin 用户
    ssh-keygen  # 创建 SSH 密钥
    cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
    chmod 600 ~/.ssh/authorized_keys 
    exit
    ```

    </TabItem>
    </Tabs>

## 第 4 步：构建 Cloudberry Database

安装完所有依赖项并执行了平台准备工作后，你就可以开始构建 Cloudberry Database 了。按顺序执行以下命令。

1. 进入 `cloudberrydb` 目录，执行 `configure` 脚本。

    ```bash
    cd cloudberrydb
    ./configure --with-perl --with-python --with-libxml --with-gssapi --prefix=/usr/local/cloudberrydb
    ```

    :::info 提示
    Cloudberry Database 默认使用 GPORCA 构建。如果你希望构建出不使用 GPORCA 的 Cloudberry Database，请在 `./configure` 命令中添加 `--disable-orca` 参数。

    ```bash
    ./configure --disable-orca --with-perl --with-python --with-libxml --prefix=/usr/local/cloudberrydb
    ```
    
    :::

2. 编译源码并安装数据库。

    ```bash
    make -j8
    make -j8 install
    ```

3. 将 Greenplum 环境引入运行中的 shell。

    ```bash
    cd ..
    cp -r cloudberrydb/ /home/gpadmin/
    cd /home/gpadmin/
    chown -R gpadmin:gpadmin cloudberrydb/
    su - gpadmin
    cd cloudberrydb/
    source /usr/local/cloudberrydb/greenplum_path.sh
    ```

4. 启动示例集群。

    <Tabs>
    <TabItem value="centos" label="CentOS 7" default>

    ```bash
    scl enable devtoolset-10 bash 
    source /opt/rh/devtoolset-10/enable 
    make create-demo-cluster
    ```

    </TabItem>
    <TabItem value="ubuntu-rocky-rhel" label="Ubuntu、Rocky Linux 和 RHEL" default>

    ```bash
    make create-demo-cluster
    ```

    </TabItem>
    </Tabs>

5. 执行以下命令，以准备测试。此命令将为测试配置端口和环境变量。

    该命令会配置端口和环境变量，例如 `PGPORT`（主节点的默认端口）和 `COORDINATOR_DATA_DIRECTORY`（主节点的数据目录）。

    ```bash
    source gpAux/gpdemo/gpdemo-env.sh
    ```

## 第 5 步：验证集群

1. 你可以通过以下命令来验证集群是否已成功启动。如果成功启动，你会看到端口在 `7000` 到 `7007` 之间的多个 `postgres` 进程。

    ```bash
    ps -ef | grep postgres
    ```

2. 连接至 Cloudberry Database，通过查询系统表 `gp_segement_configuration` 查看活跃 segment 的信息。有关此系统表的详细描述，参见 [Greenplum 文档](https://docs.vmware.com/en/VMware-Greenplum/7/greenplum-database/ref_guide-system_catalogs-gp_segment_configuration.html)。

    ```sql
    $ psql -p 7000 postgres
    psql (14.4, server 14.4)
    Type "help" for help.
    
    postgres=# select version();
                                                                                            version                                                                                         
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    PostgreSQL 14.4 (Cloudberry Database 1.0.0+1c0d6e2224 build dev) on x86_64( GCC 13.2.0) 13.2.0, 64-bit compiled on Sep 22 2023 10:56:01
    (1 row)
    
    postgres=# select * from gp_segment_configuration;
     dbid | content | role | preferred_role | mode | status | port |  hostname  |  address   |                                   datadir                                    | warehouseid 
    ------+---------+------+----------------+------+--------+------+------------+------------+------------------------------------------------------------------------------+-------------
        1 |      -1 | p    | p              | n    | u      | 7000 | i-6wvpa9wt | i-6wvpa9wt | /home/gpadmin/cloudberrydb/gpAux/gpdemo/datadirs/qddir/demoDataDir-1         |           0
        8 |      -1 | m    | m              | s    | u      | 7001 | i-6wvpa9wt | i-6wvpa9wt | /home/gpadmin/cloudberrydb/gpAux/gpdemo/datadirs/standby                     |           0
        3 |       1 | p    | p              | s    | u      | 7003 | i-6wvpa9wt | i-6wvpa9wt | /home/gpadmin/cloudberrydb/gpAux/gpdemo/datadirs/dbfast2/demoDataDir1        |           0
        6 |       1 | m    | m              | s    | u      | 7006 | i-6wvpa9wt | i-6wvpa9wt | /home/gpadmin/cloudberrydb/gpAux/gpdemo/datadirs/dbfast_mirror2/demoDataDir1 |           0
        2 |       0 | p    | p              | s    | u      | 7002 | i-6wvpa9wt | i-6wvpa9wt | /home/gpadmin/cloudberrydb/gpAux/gpdemo/datadirs/dbfast1/demoDataDir0        |           0
        5 |       0 | m    | m              | s    | u      | 7005 | i-6wvpa9wt | i-6wvpa9wt | /home/gpadmin/cloudberrydb/gpAux/gpdemo/datadirs/dbfast_mirror1/demoDataDir0 |           0
        4 |       2 | p    | p              | s    | u      | 7004 | i-6wvpa9wt | i-6wvpa9wt | /home/gpadmin/cloudberrydb/gpAux/gpdemo/datadirs/dbfast3/demoDataDir2        |           0
        7 |       2 | m    | m              | s    | u      | 7007 | i-6wvpa9wt | i-6wvpa9wt | /home/gpadmin/cloudberrydb/gpAux/gpdemo/datadirs/dbfast_mirror3/demoDataDir2 |           0
    (8 rows)
    ```