---
title: 透明数据加密
---

# 透明数据加密

为了满足保护用户数据安全的需求，Cloudberry Database 支持透明数据加密（Transparent Data Encryption，简称  TDE）功能。

透明数据加密（TDE）是一种用于加密数据库数据文件的技术：

- 数据指的是数据库中的数据。
- 文件在硬盘上以密文存储，在内存中以明文处理，TDE 用于保护静态数据，因此也叫静态数据加密。
- “透明”意味着用户无需改变操作习惯，TDE 自动管理加密/解密过程，无需用户或应用程序干预。

## 加密算法简介

### 基本概念

- DEK (Data Encryption Key)：用于加密数据的密钥，由数据库生成，存储在内存中。
- DEK 明文：与 DEK 同义，只能保存在内存中。
- Master Key：主密钥，用于加密 DEK。
- DEK 密文：使用 Master Key 加密后的 DEK，持久化存储。

### 密钥管理模块

密钥管理模块是透明数据加密的核心组件，采用两层密钥结构：Master Key 和 DEK。Master Key 用于加密 DEK，存储在数据库外部；DEK 用于加密数据库数据，密文形式保存在数据库中。

### 算法分类

加密算法分为两类：

- 对称加密：加密和解密使用相同密钥。
- 非对称加密：公钥加密，私钥解密，适合一对多、多对一的加密需求。

对称加密中的分组加密算法是主流选择，性能优于流加密和非对称加密。Cloudberry Database 支持 AES 和 SM4 两种分组加密算法。

#### AES 加密算法

AES 是国际标准的分组加密算法，支持 128、192 和 256 位密钥，常见加密模式包括：

- ECB: 电子密码本模式
- CBC: 密码分组链表模式
- CFB: 密文反馈模式
- OFB: 输出反馈模式
- CTR: 计数器模式

#### 更多 ISO/IEC 加密算法

更多 ISO/IEC 算法包括：

- ISO/IEC 14888-3/AMD1（即 SM2）：非对称加密，基于 ECC，性能优于 RSA。
- ISO/IEC 10118-3:2018（即 SM3）：消息摘要算法，类似 MD5，输出 256 位。
- ISO/IEC 18033-3:2010/AMD1:2021（即 SM4）：无线局域网标准的对称加密算法，支持 128 位密钥和分组长度。

## 使用方法

在使用透明数据加密（TDE）功能前，请确保满足以下条件：

- 安装 OpenSSL：Cloudberry Database 节点上必须安装 OpenSSL。通常，Linux 发行版的操作系统会自带 OpenSSL。
- Cloudberry Database 版本：确保你的 Cloudberry Database 版本不低于 v1.6.0，该版本开始支持 TDE 功能。

在部署 Cloudberry Database 时，可以通过设置来开启 TDE 功能，之后的所有数据加密操作将对用户完全透明。要在数据库初始化时启用 TDE，使用 `gpinitsystem` 命令并指定 `-T` 参数。Cloudberry Database 支持两种加密算法：AES 和 SM4。以下是开启 TDE 的示例：

- 使用 AES256 加密算法：

    ```shell
    gpinitsystem -c gpinitsystem_config -T AES256
    ```

- 使用 SM4 加密算法：

    ```shell
    gpinitsystem -c gpinitsystem_config -T SM4
    ```

## 验证方法

透明数据加密功能对用户是透明的，开启或关闭此特性都不会影响用户的读写操作体验。然而，为了验证加密功能的有效性，可以通过以下步骤模拟密钥文件丢失场景，并确保数据库在没有密钥文件时无法启动。

密钥文件路径在 Coordinator 节点上， 要定位密钥文件的位置，先找到 Coordinator 节点的数据目录，例如：

```shell
COORDINATOR_DATA_DIRECTORY=/home/gpadmin/work/data0/master/gpseg-1
```

然后再找密钥文件：

```shell
$ pwd
/home/gpadmin/work/data0/master/gpseg-1

$ ls -l pg_cryptokeys/live/
total 8
-rw------- 1 gpadmin gpadmin 48 Apr 12 10:26 relation.wkey
-rw------- 1 gpadmin gpadmin 48 Apr 12 10:26 wal.wkey
```

其中 `relation.wkey` 是用来加密数据文件的密钥，`wal.wkey` 是用来加密 WAL 日志的密钥。现在只有 `relation.wkey` 有作用，WAL 日志还没有加密。

### 验证过程

1. 创建表并写入数据。

    - 创建一个附加存储（Append-Only，AO）表并插入数据：

        ```sql
        postgres=# create table ao2 (id int) with(appendonly=true);
        postgres=# insert into ao2 select generate_series(1,10);
        ```

    - 确认数据已成功插入。

2. 停止数据库。

    ```shell
    gpstop -a
    ```

3. 模拟密钥文件丢失。

    - 切换到密钥文件所在目录：

        ```shell
        cd /home/gpadmin/work/data0/master/gpseg-1/pg_cryptokeys/
        ```

    - 将密钥文件移至其他目录（模拟丢失密钥文件的场景）：

        ```shell
        mv live backup
        ```

4. 尝试启动数据库。

    - 使用 `gpstart` 命令启动数据库：

        ```shell
        gpstart -a
        ```

        由于缺少密钥文件，数据库将无法启动。你可以在 Coordinator 节点的数据库日志中看到类似以下的错误日志：

        ```shell
        FATAL: cluster has no data encryption keys
        ```

        这说明数据库在密钥丢失的情况下无法启动，从而确保了数据的安全性。

5. 恢复密钥文件，将之前备份的密钥文件移回原目录：

    ```shell
    mv backup live
    ```

6. 重新启动数据库并验证数据。

    1. 使用 `gpstart` 命令再次启动数据库：

        ```shell
        gpstart -a
        ```

    2. 数据库成功启动后，查询表 `ao2` 验证数据是否正常：

        ```sql
        postgres=# select * from ao2 order by id;
        id
        ----
        1
        2
        3
        4
        5
        6
        7
        8
        9
        10
        (10 rows)
        ```

通过上述步骤，可以验证透明数据加密功能的有效性，即数据库在缺少密钥文件时无法启动，保证了静态数据的安全性。
