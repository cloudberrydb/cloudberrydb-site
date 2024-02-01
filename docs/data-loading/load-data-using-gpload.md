---
title: Load Data Using gpload
---

# Load Data into Cloudberry Database Using `gpload`

The `gpload` utility of Cloudberry Database loads data using readable external tables and the Cloudberry Database parallel file server (gpfdist). It handles parallel file-based external table setup and allows users to configure their data format, external table definition, and gpfdist setup in a single configuration file.

:::tip
In `gpload`, `MERGE` and `UPDATE` operations are not supported if the target table column name is a reserved keyword, has capital letters, or includes any character that requires quotes `" "` to identify the column.
:::

## To use gpload 

1. Ensure that your environment is set up to run `gpload`. Some dependent files from your Cloudberry Database installation are required, such as gpfdist and Python 3, as well as network access to the Cloudberry Database segment hosts. `gpload` also requires that you install the following packages:

    ```shell
    pip install psycopg2 pyyaml
    ```

2. Create your load control file. This is a YAML-formatted file that specifies the Cloudberry Database connection information, gpfdist configuration information, external table options, and data format.

    For example:

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

3.  Run `gpload`, passing in the load control file. For example:

    ```sql
    gpload -f my_load.yml
    ```
