---
title: 使用 gpload 加载数据
---

# 使用 `gpload` 将数据加载到 Cloudberry Database 中

Cloudberry Database 的 `gpload` 实用程序使用 `gpfdist` 和可读的外部表加载数据。它处理基于文件的外部表并行设置，并允许用户在单个配置文件中配置数据格式、外部表定义和 `gpfdist` 设置。

:::tip 提示
在 `gpload` 中，如果目标表列名是保留关键字、包含大写字母或需要引号 `" "` 来标识列的任何字符，则不支持 `MERGE` 和 `UPDATE` 操作。
:::

## 使用 `gpload`

1. 确保你已经设置好 `gpload` 的运行环境，包括一些来自 Cloudberry Database 安装的依赖文件，例如 gpfdist 和 Python 3，以及对 Cloudberry Database Segment 主机的网络访问。`gpload` 还需要你安装以下依赖包：

    ```shell
    pip install psycopg2 pyyaml
    ```

2. 创建你的加载控制文件。这是一个 YAML 格式的文件，它指定了 Cloudberry Database 的连接信息、gpfdist 配置信息、外部表选项和数据格式。

    例如：

    ```yaml
    ---
    VERSION: 1.0.0.1
    DATABASE: ops
    USER: gpadmin
    HOST: cdw-1
    PORT: 5432
    GPLOAD:
       INPUT:
        - SOURCE:
             LOCAL_HOSTNAME:
               - etl1-1
               - etl1-2
               - etl1-3
               - etl1-4
             PORT: 8081
             FILE: 
               - /var/load/data/*
        - COLUMNS:
               - name: text
               - amount: float4
               - category: text
               - descr: text
               - date: date
        - FORMAT: text
        - DELIMITER: '|'
        - ERROR_LIMIT: 25
        - LOG_ERRORS: true
       OUTPUT:
        - TABLE: payables.expenses
        - MODE: INSERT
       PRELOAD:
        - REUSE_TABLES: true 
    # SQL:
    #   - BEFORE: "INSERT INTO audit VALUES('start', current_timestamp)"
    #   - AFTER: "INSERT INTO audit VALUES('end', current_timestamp)"
    ```

3. 运行 `gpload`，传入加载控制文件。例如：

    ```sql
    gpload -f my_load.yml
    ```
