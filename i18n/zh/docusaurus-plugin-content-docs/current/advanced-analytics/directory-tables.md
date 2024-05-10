---
title: Directory Table
---

# Directory Table

自 v1.5.3 版本起，Cloudberry Database 引入了 Directory Table，用于统一纳管对象存储上的非结构化数据。

在大模型 AI 快速发展的背景下，AI 应用催生出了管理非结构化多模态语料数据的需求。需要持续准备大量非结构化的高质量精选语料、数据迭代训练大模型，以及归纳丰富的知识库。因此，在结构化语料数据管理与语料加工方面，面临技术挑战。

面对这些技术挑战，Cloudberry Database 定义了一种 Directory Table 表，用于纳管多种类型的非结构化数据。开发者用户只需使用简单的 SQL 语句就能调用各种计算引擎的能力，实现一站式数据加工和应用开发。

Directory Table 定位于存储、管理和分析非结构化数据对象。Directory Table 位于表空间中，将非结构化数据文件导入 Directory Table 后，会在 Directory Table 上创建一条记录，即该文件的元数据信息，而文件本身则加载进对象存储中。表上的元数据与对象存储上的对应文件相关联。

## 使用说明

### 创建 Directory Table

你可以在本地存储的表空间中创建 Directory Table，也可以在外部存储（如对象存储服务或 HDFS 等分布式文件系统）的表空间中创建 Directory Table。

#### 在本地存储中创建

在本地存储创建 Directory Table 的语法如下。你需要将 `<table_name>` 和 `<tablespace_name>` 替换为实际的表名和表空间名。

```sql
-- 方法一：不指定表空间，即在已有的默认表空间中创建 Directory Table。
CREATE DIRECTORY TABLE <table_name>；

-- 方法二：先创建表空间，再在表空间中创建 Directory Table。
CREATE TABLESPACE <tablespace_name>
       LOCATION '<tablespace_path>';

CREATE DIRECTORY TABLE <table_name>
       TABLESPACE <tablespace_name>;
```

#### 在外部存储中创建

要在外部存储中创建 Directory Table，你需要先在外部存储中创建表空间。你需要提供访问外部存储服务器所需要的连接信息，包括服务器的 IP 地址、协议、访问密钥等。以下示例展示如何在青云对象存储和 HDFS 上创建 Directory Table。

1. 创建服务器对象，并定义外部数据源的连接方式。Cloudberry Database 支持多种存储的协议，包括 S3 对象存储 和 HDFS。以下示例分别在青云和 HDFS 上创建了名为 `oss_server` 和 `hdfs_server` 的服务器对象。

    - 青云：

        ```sql
        CREATE STORAGE SERVER oss_server OPTIONS(protocol 'qingstor', prefix '<路径前缀>', endpoint '<终端地址>', https 'true', virtual_host 'false');
        ```

    - HDFS：

        ```sql
        CREATE STORAGE SERVER hdfs_server OPTIONS(protocol 'hdfs', namenode '<HDFS 节点 IP:端口>', https 'false');
        ```

    以上命令中涉及的参数如下：

    - `protocol`：用于连接外部数据源的协议。在上面示例中，`'qingstor'` 表示使用青云对象存储服务的协议，`'hdfs'` 表示使用 HDFS 存储服务协议。
    - `prefix`：设置访问对象存储时的路径前缀。设置了该前缀，表明所有操作都将限定在这个特定的路径下，例如 `prefix '/rose-oss-test4/usf1'`。这通常用于组织和隔离存储在同一存储桶中的数据。
    - `endpoint`：指定外部对象存储服务的网络地址。例如，`'pek3b.qingstor.com'` 是青云服务的一个特定区域节点。通过这个端点，Cloudberry Database 可以访问外部数据。
    - `https`：指定是否通过 HTTPS 协议连接到对象存储服务。在此命令中，`'false'` 表示使用非加密的 HTTP 连接。这个设置可能受到数据传输安全要求的影响，通常推荐使用 HTTPS 来确保数据安全。
    - `virtual_host`：确定是否使用虚拟主机方式访问存储桶。`'false'` 意味着不使用虚拟主机样式的桶访问（即，URL 中不包括存储桶名称）。这个选项通常取决于存储服务提供商的 URL 格式支持。
    - `namenode`：表示 HDFS 节点的 IP。你需要将 `<HDFS 节点 IP:端口>` 替换为实际的 IP 地址和端口号，例如 `'192.168.51.106:8020'`。

2. 创建用户映射，为当前用户提供访问这些外部服务器所需的认证信息。

    - 青云：

        ```sql
        CREATE STORAGE USER MAPPING FOR CURRENT_USER STORAGE SERVER oss_server OPTIONS (accesskey '<青云的 accesskey 密钥>', secretkey '<青云的 secretkey 密钥>');
        ```

    - HDFS：

        ```sql
        CREATE STORAGE USER MAPPING FOR CURRENT_USER STORAGE SERVER hdfs_server OPTIONS (auth_method 'simple');
        ```

    以上命令中涉及的参数如下：

    - `accesskey` 和 `secretkey`：这两个参数提供必要的认证信息。`'accesskey'` 和 `'secretkey'` 类似于用户名和密码，用于访问对象存储服务。
    - `auth_method`：表示访问 HDFS 的认证模式。`simple` 表示简单认证模式，`kerberos` 表示使用 Kerberos 认证模式。

3. 在外部服务器上创建表空间。这些表空间特定地链接到了前面定义的外部服务器，表空间的 `location` 选项指向了外部存储上的特定路径。以下示例分别在青云和 HDFS 上创建表空间 `dir_oss` 和 `dir_hdfs`。

    - 青云：

        ```sql
        CREATE TABLESPACE dir_oss location '<对象存储上的表空间路径>' SERVER oss_server HANDLER '$libdir/dfs_tablespace, remote_file_handler';

        -- 你需要将 <对象存储上的表空间路径> 替换为实际的路径，例如 /tbs-49560-0-mgq-multi/oss-server-01-17。
        ```

    - HDFS：

        ```sql
        CREATE TABLESPACE dir_hdfs location '<对象存储上的表空间路径>' SERVER hdfs_server HANDLER '$libdir/dfs_tablespace, remote_file_handler';

        -- 你需要将 <对象存储上的表空间路径> 替换为实际的路径，例如 /tbs-49560-0-mgq-multi/oss-server-01-17。
        ```

4. 在表空间中创建 Directory Table。以下语句分别在表空间 `dir_oss` 和 `dir_hdfs` 中创建了 Directory Table `dir_table_oss` 和 `dir_table_hdfs`。

    ```sql
    CREATE DIRECTORY TABLE dir_table_oss TABLESPACE dir_oss;
    CREATE DIRECTORY TABLE dir_table_hdfs TABLESPACE dir_hdfs;
    ```

    :::tip 提示
    如果你在创建表空间时，遇到 `directory ... does not exist` 的报错，你需要为集群配置 `shared_preload_libraries` 并导入到对象存储。例如先执行 `gpconfig -c shared_preload_libraries -v 'dfs_tablespace'`，再执行 `gpstop -ra` 重启集群。
    :::

### 查看 Directory Table 的字段信息

```sql
\dY   -- 列出当前所有的 Directory Table。
\d <directory_table>   -- 查看某张 Directory Table 的字段信息。
```

通常 Directory Table 的字段如下：

| **字段名**      | **数据类型**    | 注意事项                                                                       |
| --------------- | --------------- | ------------------------------------------------------------------------------ |
| `RELATIVE_PATH` | `TEXT`          |                                                                                |
| `SIZE`          | `NUMBER`        |                                                                                |
| `LAST_MODIFIED` | `TIMESTAMP_LTZ` |                                                                                |
| `MD5`           | `HEX`           |                                                                                |
| `TAGS`          | `JSONB`         | 用户自定义标签。可用来标记数据血缘，文件上传部门/团队，分类等。"k1=v1, k2=v2" |

### 加载文件至 Directory Table

将文件上传至 Directory Table 后，该文件被上传至 Cloudberry Database 管理的本地存储或对象存储中，而 Directory Table 则纳管该文件的元数据。Cloudberry Database v1.5.3 暂不支持用户自行管理对象存储目录文件。

从本地上传文件至数据库对象存储语法如下：

```sql
\COPY '<directory_table_name>' FROM '<local_path_to_file> <target_path>';
COPY '<directory_table_name>' FROM '<local_path_to_file> <target_path>';  -- 可以省略开头的 \

-- <directory_table_name> 为 Directory Table 的表名
-- <local_path_to_file> 为待上传文件的本地路径
-- <target_path> 为本地或对象存储中的目标路径，文件会被上传至该路径
```

:::tip 提示
建议利用 `<path>` 的子目录能力，以确保上传后的目录路径与本地一致，方便对文件进行管理。
:::

为了更好地管理或跟踪文件和数据流，你还可以在上传命令中添加 `tag` ，以提供附加信息或标记：

```sql
\COPY '<directory_table_name>' FROM '<local_path_to_file>' '<target_path>' WITH tag '<tag_name>';
```

示例如下：

```sql
-- 将文件上传至根目录
\COPY BINARY dir_table_oss FROM '/data/country.data' 'country.data';

-- 将文件上传至特定路径 top_level/second_level
\COPY BINARY dir_table_oss FROM '/data/region.tbl' 'top_level/second_level/region.tbl';

-- 将文件上传至根目录，并使用 tag
\COPY BINARY dir_table_oss FROM '/data/country1.data' 'country1.data' with tag 'country';

-- 将文件上传至特定路径 top_level/second_level，并使用 tag
\COPY BINARY dir_table_oss FROM '/data/region1.tbl' 'top_level/second_level/region1.tbl' with tag 'region';
```

你还可以使用命令行工具 `cbload` 将文件批量上传至对象存储。使用 `cbload --inputfile <目录>` 语法将一个目录中的文件上传至对象存储。`cbload` 的命令行参数如下：

```shell
用法：
  cbload [flags]

参数：
      --database string       要连接的数据库（默认为 gpadmin）
      --dest-path string      相对于表根目录的路径（默认：表的根目录）
      --force-password-auth   强制密码提示（默认为 false）
      --help                  打印帮助信息并退出
      --host string           要连接的主机（默认为 localhost）
      --input-file strings    输入的文件或目录
      --logfile string        将日志输出到日志文件（默认无）
      --port int              要连接的端口（默认为 5432）
      --stop-on-error         当发生错误时停止加载文件（默认为 false）
      --table string          要加载到的表
      --tag string            文件标签
      --tasks int             同时加载文件的最大数量（默认为 1）
      --user string           作为用户连接（默认为 gpadmin）
      --verbose               指示工具应生成详细输出（默认为 false）
      --version               打印版本信息并退出
```

### 查询和使用 Directory Table 文件

查询 Directory Table 表内的文件元信息：

```sql
-- 使用表函数 directory_table() 读取文件元数据及内容
SELECT relative_path, 
       size, 
       last_modified, 
       md5,
       tag,
       content
       FROM directory_table('<directory_table>');

-- 使用以下任一语句查询某张的 Directory Table 内的数据。
SELECT * FROM <directory_table>;
SELECT * FROM DIRECTORY_TABLE('<directory_table>');
```

### 删除 Directory  Table 所纳管的文件

要删除 Directory Table 所纳管的文件，你需要有管理员权限：

```sql
SELECT remove_file('dir_table_oss', 'country.data');

-- 该命令删除 dir_table_oss 表所纳管的文件 country.data
```

### 删除 Directory Table

删除指定的 Directory Table。删除后，表内的所有文件也会被删除。 要删除 Directory Table，你需要有管理员权限。

```sql
DROP DIRECTORY TABLE <table_name>;
```
