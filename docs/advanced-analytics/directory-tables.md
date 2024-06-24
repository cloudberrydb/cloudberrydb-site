---
title: Directory Table
---

# Directory Table

Cloudberry Database has introduced *directory tables* in v1.5.3 for unified management of unstructured data on local or object storage.

In the context of large-scale AI, AI applications have generated the need to manage unstructured multi-modal corpora. There is a need to continuously prepare a large amount of high-quality curated unstructured corpora, train large models through data iteration, and summarize rich knowledge bases. Therefore, there are technical challenges in the management and processing of structured corpora.

To address these challenges, Cloudberry Database introduces directory tables for managing multiple types of unstructured data. Developer users can use simple SQL statements to take advantage of the capabilities of multiple computing engines to achieve one-stop data processing and application development.

Directory tables store, manage, and analyze unstructured data objects. They reside within tablespaces. When unstructured data files are imported, a directory table record (file metadata) is created, and the file itself is loaded into object storage. The table metadata remains associated with the corresponding object storage file.

## Usage

### Create a directory table

You can create a directory table in a local tablespace or in a tablespace of an external storage (such as object storage services or distributed file systems like HDFS).

#### Create in local storage

To create a directory table in local storage, follow the SQL syntax below. You need to replace `<table_name>` and `<tablespace_name>` with the actual table name and tablespace name.

```sql
-- Method 1: To create a directory table in a tablespace other than the default one,
-- create the tablespace first and then create the directory table within that tablespace.
CREATE TABLESPACE <tablespace_name>
       LOCATION '<tablespace_path>';

CREATE DIRECTORY TABLE <table_name>
       TABLESPACE <tablespace_name>;


-- Method 2: To create a directory table in the default tablespace, simply omit the TABLESPACE clause.
CREATE DIRECTORY TABLE <table_name>;
```

#### Create in external storage

To create a directory table in an external storage, you first need to create a tablespace in that storage. You'll need to provide connection information of the external storage server, such as server IP address, protocol, and access credentials. The following examples show how to create directory tables on QingCloud Object Storage and HDFS.

1. Create server objects and define connection methods for external data sources. Cloudberry Database supports protocols for multiple storage options, including S3 object storage and HDFS. The following examples create server objects named `oss_server` and `hdfs_server` on QingCloud and HDFS, respectively.

    - For QingCloud:

        ```sql
        CREATE STORAGE SERVER oss_server OPTIONS(protocol 'qingstor', prefix '<path prefix>', endpoint '<endpoint address>', https 'true', virtual_host 'false');
        ```

    - For HDFS:

        ```sql
        CREATE STORAGE SERVER hdfs_server OPTIONS(protocol 'hdfs', namenode '<HDFS node IP:port>', https 'false');
        ```

    The parameters in the above commands are described as follows:

    - `protocol`: The protocol used to connect to the external data source. In the examples above, `'qingstor'` indicates using the QingCloud object storage service protocol, and `'hdfs'` indicates using the HDFS storage service protocol.
    - `prefix`: Sets the path prefix when accessing object storage. If this prefix is set, all operations will be limited to this specific path, such as `prefix '/rose-oss-test4/usf1'`. This is typically used to organize and isolate data stored in the same bucket.
    - `endpoint`: Specifies the network address of the external object storage service. For example, `'pek3b.qingstor.com'` is a specific regional node of the QingCloud service. Through this endpoint, Cloudberry Database can access external data.
    - `https`: Specifies whether to connect to the object storage service using the HTTPS protocol. In this command, `'false'` indicates using an unencrypted HTTP connection. This setting might be influenced by data transmission security requirements, and it is generally recommended to use HTTPS to ensure data security.
    - `virtual_host`: Determines whether to access the bucket using virtual hosting. `'false'` means that bucket access is not done in virtual host style (which means that the bucket name is not included in the URL). This option is typically dependent on the URL format support provided by the storage service provider.
    - `namenode`: Represents the IP of the HDFS node. You need to replace `<HDFS node IP:port>` with the actual IP address and port number, such as `'192.168.51.106:8020'`.

2. Create user mappings to provide the current user with the authentication information required to access these external servers.

    - For QingCloud:

        ```sql
        CREATE STORAGE USER MAPPING FOR CURRENT_USER STORAGE SERVER oss_server OPTIONS (accesskey '<QingCloud access key>', secretkey '<QingCloud secret key>');
        ```

    - For HDFS:

        ```sql
        CREATE STORAGE USER MAPPING FOR CURRENT_USER STORAGE SERVER hdfs_server OPTIONS (auth_method 'simple');
        ```

    The parameters in the above commands are described as follows:

    - `accesskey` and `secretkey`: These parameters provide the necessary authentication information. `'accesskey'` and `'secretkey'` are similar to username and password, and are used to access the object storage service.

    - `auth_method`: Indicates the authentication method for accessing HDFS. `simple` indicates simple authentication mode, and `kerberos` indicates using Kerberos authentication mode.

3. Create tablespaces on the external servers. These tablespaces are specifically associated with the previously defined external servers, and the `location` option of the tablespace specifies a specific path on the external storage. The following examples create tablespaces `dir_oss` and `dir_hdfs` on QingCloud and HDFS, respectively.

    - For QingCloud:

        ```sql
        CREATE TABLESPACE dir_oss location '<object_storage_path>' SERVER oss_server HANDLER '$libdir/dfs_tablespace, remote_file_handler';

        -- You need to replace <object_storage_path> with the actual path on the object storage, such as /tbs-49560-0-mgq-multi/oss-server-01-17.
        ```

    - For HDFS:

        ```sql
        CREATE TABLESPACE dir_hdfs location '<object_storage_path>' SERVER hdfs_server HANDLER '$libdir/dfs_tablespace, remote_file_handler';

        -- You need to replace <object_storage_path> with the actual path on the object storage, such as /tbs-49560-0-mgq-multi/oss-server-01-17.
        ```

4. Create directory tables in the tablespaces. The following statements create directory tables `dir_table_oss` and `dir_table_hdfs` in tablespaces `dir_oss` and `dir_hdfs`, respectively.

    ```sql
    CREATE DIRECTORY TABLE dir_table_oss TABLESPACE dir_oss;
    CREATE DIRECTORY TABLE dir_table_hdfs TABLESPACE dir_hdfs;
    ```

    :::tip
    If you encounter the error message `directory ... does not exist` while creating the tablespace, you need to configure `shared_preload_libraries` for the cluster and then import the library to the object storage. To do this, follow these steps:

    1. Execute the command `gpconfig -c shared_preload_libraries -v 'dfs_tablespace'` to configure the cluster.
    2. Restart the cluster using the command `gpstop -ra`.
    :::

### View the field information of directory table

```sql
\dY    -- Lists all the directory tables.
\d <directory_table>    -- Shows the field information of a directory table.
```

In general, the fields of a directory table are as follows:

| **Field name**      | **Data type**    | Note                                                                       |
| --------------- | --------------- | ------------------------------------------------------------------------------ |
| `RELATIVE_PATH` | `TEXT`          |                                                                                |
| `SIZE`          | `NUMBER`        |                                                                                |
| `LAST_MODIFIED` | `TIMESTAMP_LTZ` |                                                                                |
| `MD5`           | `HEX`           |                                                                                |
| `TAGS`          | `JSONB`         | User-defined tags. Can be used to mark data lineage, file upload department/team, classification. "k1=v1, k2=v2" |

### Upload file into directory table

After uploading a file to a directory table, Cloudberry Database manages the file's upload to local storage or object storage and stores the file's metadata in the directory table. In Cloudberry Database v1.5.3, users cannot directly manage object storage directory files.

Upload files from local storage to database object storage:

```sql
\COPY '<directory_table_name>' FROM '<local_path_to_file> <target_path>';
COPY '<directory_table_name>' FROM '<local_path_to_file> <target_path>';  -- Optionally omits the starting slash \

-- <directory_table_name> is the directory table name.
-- <local_path_to_file> is the local path to the file to be uploaded.
-- <target_path> is the target path to the local or object storage, and the file will be uploaded to this path.
```

:::tip
It is recommended to use the subdirectory capability of `<path>` to ensure that the directory path after uploading is consistent with the local one, which simplifies file management.
:::

For enhanced file management and data flow tracking, you can add tags to the upload command. These tags provide additional information or markings for your files.

```sql
\COPY '<directory_table_name>' FROM '<local_path_to_file>' '<target_path>' WITH tag '<tag_name>';
```

Examples:

```sql
-- Uploads the file to the root path.
\COPY BINARY dir_table_oss FROM '/data/country.data' 'country.data';

-- Uploads the file to a specified path top_level/second_level
\COPY BINARY dir_table_oss FROM '/data/region.tbl' 'top_level/second_level/region.tbl';

-- Uploads the file to the root path with a tag
\COPY BINARY dir_table_oss FROM '/data/country1.data' 'country1.data' with tag 'country';

-- Uploads the file to a specified path top_level/second_level with a tag
\COPY BINARY dir_table_oss FROM '/data/region1.tbl' 'top_level/second_level/region1.tbl' with tag 'region';
```

You can also use the command-line tool `cbload` to upload files in bulk to object storage. Use the syntax `cbload --inputfile <directory>` to upload files in a directory to object storage. The command-line flags for `cbload` are as follows:

```shell
Usage:
  cbload [flags]

Flags:
      --database string       Database to connect to (default gpadmin)
      --dest-path string      Path relative to the table root directory (default: root directory of the table)
      --force-password-auth   Force a password prompt (default false)
      --help                  Print help info and exit
      --host string           Host to connect to (default localhost)
      --input-file strings    Input files or directory
      --logfile string        Log output to logfile (default none)
      --port int              Port to connect to (default 5432)
      --stop-on-error         Stop loading files when an error occurs (default false)
      --table string          Table to load to
      --tag string            File tag
      --tasks int             The maximum number of files that concurrently loads (default 1)
      --user string           User to connect as (default gpadmin)
      --verbose               Indicates that the tool should generate verbose output (default false)
      --version               Print version info and exit
```

### Query and use the files managed by directory table

Query the metadata of a file in directory table:

```sql
-- Uses the table function directory_table() to read the file metadata and content.
SELECT relative_path, 
       size, 
       last_modified, 
       md5,
       tag,
       content
       FROM directory_table('<directory_table>');

-- You can use one of the following statements to query the data of a directory table.
SELECT * FROM <directory_table>;
SELECT * FROM DIRECTORY_TABLE('<directory_table>');
```

### Delete the file managed by Directory  Table

To delete a file managed by directory table, you need the admin privilege:

```sql
SELECT remove_file('dir_table_oss', 'country.data');

-- This command deletes the file country.data managed in the table dir_table_oss.
```

### Delete a directory table

Delete a directory table. After the deletion, all the file managed by the table will be deleted as well. To delete a directory table, you need the admin privilege.

```sql
DROP DIRECTORY TABLE <table_name>;
```
