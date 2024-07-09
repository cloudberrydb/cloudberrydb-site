---
title: 单计算节点部署
---

# 单计算节点模式部署 Cloudberry Database

Cloudberry Database 与 PostgreSQL 并不完全兼容，部分功能和语法都是专有的。如果用户业务已经依赖 Cloudberry Database，想在单节点上使用 Cloudberry Database 特有的语法和功能，规避与 PostgreSQL 的兼容性问题，那么可以使用这种单计算节点的部署方式。

自 v1.5.0 起，Cloudberry Database 提供这一单计算节点的部署模式。该模式在 `utility` gp_role 下运行，仅有一个 coordinator (QD) 和一个 coordinator standby 节点，没有 segment 节点和数据分布。用户可以直接连接到 coordinator 并执行查询，就像连接的是一个正常的多节点集群一样。注意，由于没有数据分布，一些 SQL 语句在单计算节点部署下没有效果，还有一些 SQL 语句不受支持。具体可见最后一节[用户行为变更](#用户行为变更)。

在阅读本文前，建议先阅读[软硬件配置需求](/i18n/zh/docusaurus-plugin-content-docs/current/cbdb-op-software-hardware.md)和[物理机部署前准备工作](/i18n/zh/docusaurus-plugin-content-docs/current/cbdb-op-prepare-to-deploy.md)。

:::warning 警告
本文档介绍的方法仅适用于通过 RPM 包部署 Cloudberry Database v1.5.4，不适用于部署此前版本的 Cloudberry Database。
:::

## 部署方法

### 第 1 步：部署前准备

1. 按顺序依次执行以下命令，以配置运行环境：

    ```shell
    # 安装 EPEL 仓库
    yum install -y epel-release

    # 将 /usr/local/lib 和 /usr/local/lib64 目录添加到 ld.so.conf 文件中，以便系统能够找到这些目录下的库文件
    echo -e "/usr/local/lib \n/usr/local/lib64" >> /etc/ld.so.conf

    # 将 /usr/lib 和 /usr/lib64 目录添加到 ld.so.conf 文件中，以便系统能够找到这些目录下的库文件
    echo -e "/usr/lib \n/usr/lib64" >> /etc/ld.so.conf

    # 重新加载动态库缓存，使系统能够识别新增的库目录
    ldconfig
    ```

2. 按顺序依次执行以下命令，为 `gpadmin` 用户配置免密认证。

    ```bash
    #!/bin/bash

    # 创建一个名为 gpadmin 的组
    /usr/sbin/groupadd gpadmin

    # 创建一个名为 gpadmin 的用户，将其添加到 gpadmin 组和 wheel 组
    /usr/sbin/useradd gpadmin -g gpadmin -G wheel

    # 设置 gpadmin 用户的密码为 "cbdb@123"
    echo "cbdb@123"|passwd --stdin gpadmin

    # 添加 gpadmin 用户到 /etc/sudoers 文件，赋予其无密码执行所有命令的权限
    echo "gpadmin        ALL=(ALL)       NOPASSWD: ALL" >> /etc/sudoers

    # 添加 root 用户到 /etc/sudoers 文件，赋予其无密码执行所有命令的权限
    echo "root        ALL=(ALL)       NOPASSWD: ALL" >> /etc/sudoers

    # 生成 root 用户的 RSA 私钥，不设置密码，并将输出重定向到空设备
    ssh-keygen -t rsa -N '' -f /root/.ssh/id_rsa <<< $'\n' >/dev/null 2>&1

    # 在 /etc/ssh/sshd_config 文件中添加 "PasswordAuthentication yes"，允许密码登录
    echo "PasswordAuthentication yes" >> /etc/ssh/sshd_config

    # 修改 /etc/ssh/sshd_config 文件，将 "UseDNS YES" 替换为 "UseDNS no"，禁用 DNS 查询
    sed -i "s/#UseDNS YES/UseDNS no/g" /etc/ssh/sshd_config

    # 以 gpadmin 用户身份生成 RSA 私钥，不设置密码，并将输出重定向到空设备
    sudo -u gpadmin ssh-keygen -t rsa -N '' -f /home/gpadmin/.ssh/id_rsa <<< $'\n' >/dev/null 2>&1

    # 以 gpadmin 用户身份将 gpadmin 用户的公钥添加到其 authorized_keys 文件
    sudo -u gpadmin cat /home/gpadmin/.ssh/id_rsa.pub >> /home/gpadmin/.ssh/authorized_keys

    # 将 /home/gpadmin 目录的所有权修改为 gpadmin 用户
    sudo chown -R gpadmin:gpadmin /home/gpadmin/

    # 使用 ssh-keyscan 命令将主机的公钥添加到当前用户的 known_hosts 文件
    ssh-keyscan $(hostname) >> ~/.ssh/known_hosts
    ```

### 第 2 步：通过 RPM 包安装 Cloudberry Database

1. 下载 Cloudberry Database 的 RPM 安装包至当前目录。例如下载 `https://github.com/cloudberrydb/cloudberrydb/releases/download/1.5.4/cloudberrydb-1.5.4-1.el7.x86_64.rpm`。你需要将命令中的下载地址替换为实际的安装包地址。

    ```bash
    wget https://github.com/cloudberrydb/cloudberrydb/releases/download/1.5.4/cloudberrydb-1.5.4-1.el7.x86_64.rpm
    ```

2. 安装 RPM 包。你需要将命令中的安装包名替换为实际的安装包命。

    ```bash
    yum install -y cloudberrydb-1.5.3-1.x86_64.rpm
    ```

### 第 3 步：部署单计算节点的 Cloudberry Database

使用脚本工具 [`gpdemo`](/i18n/zh/docusaurus-plugin-content-docs/current/sys-utilities/db-util-gpdemo.md) 快速部署 Cloudberry Database。`gpdemo` 包含在 RPM 包中，将随配置脚本（gpinitsystem、gpstart、gpstop 等）一并安装到 `GPHOME/bin` 目录下，支持快捷部署无 Segment 节点的 Cloudberry Database。

以下命令创建一个新文件夹，并执行 `gpdemo` 来部署 Cloudberry Database 集群。

```bash
#!/bin/bash

# 将 /usr/local/cloudberrydb 目录的所有者和所属组更改为 gpadmin
chown gpadmin:gpadmin /usr/local/cloudberrydb

# 使用 pip3 安装特定版本的 Python 库
pip3 install psutil==5.7.0 pygresql==5.2 pyyaml==5.3.1

# 切换到 gpadmin 用户
su - gpadmin

# 创建一个名为 test_gpadmin 的目录
mkdir test_gpadmin

# 进入 test_gpadmin 目录
cd test_gpadmin

# 导入 Greenplum 环境变量
source /usr/local/cloudberrydb/greenplum_path.sh

# 运行 gpdemo 命令创建 Cloudberry Database 数据库
gpdemo

# 导入 gpdemo 的环境变量
source gpdemo-env.sh

# 检查 Cloudberry Database 数据库的状态
gpstate -s
```

### 第 4 步：连接到 Cloudberry Database 数据库

1. 连接到 Cloudberry Database。

    ```sql
    psql -p 7000 postgres
    ```

2. 查看活动 Segment 的信息。

    ```sql
    postgres=# select * from gp_segment_configuration;
    ```

## 常见问题

### 如何确认集群的部署模式

执行以下步骤确认当前 Cloudberry Database 的部署模式：

1. 连接到 Coordinator 节点。
2. 执行 `SHOW ``gp_role``;` 查看当前集群的运行模式。

    - 如果结果返回 `utility`，表示集群处于 Utility 运行模式，即维护模式，该模式下只有 Coordinator 节点可用。

        此时继续执行 `SHOW ``gp_internal_is_singlenode``;` 查看集群是否是单计算节点模式。

        - 如果结果返回 `on`，表示当前集群是单计算节点模式。
        - 如果结果返回 `off`，表示当前集群是普通维护模式 (utility maintenance mode)。

    - 如果结果返回 `dispatch`，表示当前集群是包含 Segment 节点的普通集群。你可以通过 `SELECT * FROM gp_segment_configuration;` 进一步确认集群的 Segment 数量、状态、端口、数据目录等信息。

### 数据目录位置在哪里

`gpdemo` 会自动在当前路径 (`$PWD`) 下创建数据目录。对于单计算节点部署：

- Coordinator 默认目录为：`./datadirs/singlenodedir`
- Coordinator Standby 默认目录为：`./datadirs/standby`

## 实现原理

启用单计算节点部署时，部署脚本将向配置文件 `postgresql.conf` 中写入 `gp_internal_is_singlenode = true`，并以 `gp_role = utility` 参数启动一个 Coordinator 和一个 Coordinator standby 节点。所有数据均写入本地，没有 Segment 和数据分布。

## 用户行为变更

在单计算节点模式下， Cloudberry Database 的产品行为有如下变更，用户在执行相关操作前需注意：

- 在使用 `CREATE TABLE` 语句建表时，`DISTRIBUTED BY` 子句不再生效。执行此类语句时，该子句的效果将被忽略，并输出一条新的警告 `WARNING: DISTRIBUTED BY clause has no effect in singlenode mode`。
- `SELECT` 语句的 `SCATTER BY` 子句不再有效。执行此类语句时，该子句的效果将被忽略，并输出一条新的警告 `WARNING: SCATTER BY clause has no effect in singlenode mode`。
- 其他不再支持的语句（例如 `ALTER TABLE SET DISTRIBUTED BY`）将以**错误（ERROR）**指出并拒绝执行。
- 由于没有 Segment 而不存在全局事务和全局死锁，`UPDATE` 和 `DELETE` 语句的锁级别将从 `ExclusiveLock` 独占锁降低至 `RowExclusiveLock` 行意向锁以提供更好的并发性能。该行为和 PostgreSQL 是一致的。
