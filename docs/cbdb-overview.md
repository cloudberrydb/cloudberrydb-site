---
title: Feature Overview
slug: /
---

# Cloudberry Database Feature Overview

Cloudberry Database, built on the latest PostgreSQL 14.4 kernel, is one of the most advanced and mature open-source MPP databases available. It comes with multiple features, including high concurrency and high availability. It can perform quick and efficient computing for complex tasks, meeting the demands of managing and computing vast amounts of data. It is widely applied in multiple fields.

This document gives a general introduction to the features of Cloudberry Database.

## Efficient queries in different scenarios

- Cloudberry Database allows you to perform efficient queries in big data analysis environments and distributed environments:

    - **Big data analysis environment**: Cloudberry Database uses the built-in PostgreSQL optimizer, which offers better support for distributed environments. This means that it can generate more efficient query plans when handling big data analysis tasks.
    - **Distributed environment**: Built in with the specially-adapted open-source GPORCA optimizer, Cloudberry Database meets the query optimization needs in distributed environments.

- Multiple technologies are used such as static and dynamic partition pruning, aggregate push-down, and join filtering to help you get the fastest and most accurate query results possible.
- Both rule-based and cost-based query optimization methods are provided to help you generate more efficient query execution plans.

## Polymorphic data storage

For different scenarios, Cloudberry Database supports multiple storage formats, including Heap storage, AO row storage, and AOCS column storage. Cloudberry Database also supports partitioned tables. You can define the partitioning of a table based on certain conditions. When executing a query, it automatically filters out the sub-tables that are not needed for the query to improve query efficiency.

<details>
<summary>Click to see details</summary>

- **Even data distribution**: By using Hash and Random methods for data distribution, Cloudberry Database takes better advantage of disk performance and solves I/O bottleneck issues.
- **Storage types**:

    - Row-based storage: Suitable for scenarios where most fields are frequently queried, and there are many random row accesses.
    - Column-based storage: When you need to query a small number of fields, this method can greatly save I/O operations, making it ideal for scenarios where large amounts of data are accessed frequently.

- **Specialized storage modes**: Cloudberry Database has different storage modes such as Heap storage, AO row storage, AOCS column storage to optimize the performance of different types of applications. At the finest granularity level of partitioning, a table can have multiple storage modes.
- **Support for partitioned tables**: You can define the partitioning of a table based on specific conditions. During querying, the system will automatically filter out the sub-tables that are not needed for the query to improve query efficiency.
- **Efficient data compression function**: Cloudberry Database supports multiple compression algorithms, such as Zlib 1-9 and Zstandard 1~19, to improve data processing performance and maintain a balance between CPU and compression ratio.
- **Optimization for small tables**: You can choose to use the Replication Table and specify a custom Hash algorithm when creating the table, allowing for more flexible control of data distribution.

</details>

## Multi-layer data security

Cloudberry Database enhances user data protection by supporting function encryption and transparent data encryption (TDE). TDE means that the Cloudberry Database kernel performs these processes invisibly to users. The data formats subject to TDE include Heap tables, AO row storage, and AOCS column storage. In addition to common encryption algorithms like AES, Cloudberry Database also supports national secret algorithms, allowing seamless integration of your own algorithms into TDE process.

<details>
<summary>Click to view details</summary>

Cloudberry Database focuses on data security and provides security protection measures. These security measures are designed to satisfy different database environment needs and offer multi-layer security protection:

- **Database isolation**: In Cloudberry Database, data is not shared between databases, which achieves isolation in a multi-database environment. If cross-database access is required, you can use the DBLink feature.
- **Internal data organization**: The logical organization of data in the database includes data objects such as tables, views, indexes, and functions. Data access can be performed across schemas.
- **Data storage security**: Cloudberry Database offers different storage modes to support data redundancy. It uses encryption methods including AES 128, AES 192, AES 256, DES, and national secret encryption to secure data storage. It also supports ciphertext authentication, which includes encryption algorithms like SCRAM-SHA-256, MD5, LDAP, RADIUS.
- **User data protection**: Cloudberry Database supports function encryption and decryption, and transparent data encryption and decryption. The process is implemented by the Cloudberry Database kernel without any user interaction. It supports data formats such as Heap tables, AO row storage, and AOCS column storage. In addition to common encryption algorithms like AES, Cloudberry Database also supports national secret algorithms, allowing you to easily add your own algorithms into transparent data encryption.
- **Detailed permission settings**: To satisfy different users and objects (like schemas, tables, rows, columns, views, functions), Cloudberry Database provides a range of permission setting options, including `SELECT`, `UPDATE`, execution, and ownership.

</details>

## Data loading

Cloudberry Database provides a series of efficient and flexible data loading solutions to meet various data processing needs, including parallel and persistent data loading, support for flexible data sources and file formats, integration of multiple ETL tools, and support for stream data loading and high-performance data access.

<details>
<summary>Click to view details</summary>

- **Parallel and persistent data loading**: Cloudberry Database supports massive parallel and persistent data loading through external table technology, and performs automatic conversion between character sets, such as from GBK to UTF-8. This feature makes data entry much smoother.

- **Flexible data source and file format support**: Cloudberry Database supports data sources such as external file servers, Hive, Hbase, HDFS or S3, and supports data formats such as CSV, Text, JSON, ORC, and Parquet. In addition, the database can also load compressed data files such as Zip.

- **Integrate multiple ETL tools**: Cloudberry Database is integrated with ETL tools such as DataStage, Informatica, and Kettle to facilitate data processing.

- **Support stream data loading**: Cloudberry Database can start multiple parallel read tasks for the subscribed Kafka topic, cache the read records, and load the records into the database via gpfdist after a certain time or number of records. This method can ensure the integrity of data without duplication or loss, and is suitable for stream data collection and real-time analysis scenarios. Cloudberry Database supports data loading throughput of tens of millions per minute.

- **High-performance data access**: PXF is a built-in component of Cloudberry Database, which can map external data sources to external tables of Cloudberry Database to achieve parallel and high-speed data access. PXF supports the management and access of hybrid data ecology and helps realize the Data Fabric architecture.

</details>

## Multi-layer fault tolerance

To ensure data security and service continuity, Cloudberry Database adopts a multi-level fault-tolerant mechanism of data pages, checksum, mirror node configuration, and control node backup.

<details>

<summary>Click to view details</summary>

- **Checksum of data page**: In the underlying storage, Cloudberry Database uses the checksum mechanism to detect bad blocks to ensure data integrity.

- **Mirror node configuration**: By configuring mirror nodes among segments (or data nodes), Cloudberry Database can achieve high availability and failover of services. Once an unrecoverable failure of the coordinator node is detected, the system will automatically switch to the backup segment to ensure that user queries will not be affected.

- **Backup of control nodes**: Similar to segments, coordinator nodes (or control nodes) can also be configured as backup nodes or standby nodes in case the coordinator node fails. Once the coordinator node fails, the system will automatically switch to the standby node to ensure the continuity of services.

</details>

## Rich data analysis support

Cloudberry Database provides powerful data analysis features. These features make data processing, query and analysis more efficient, and meets multiple complex data processing, analysis and query requirements.

<details>
<summary>Click to view details</summary>

- **Parallel optimizer and executor**: The Cloudberry Database kernel has a built-in parallel optimizer and executor, which is not only compatible with the PostgreSQL ecosystem, but also supports data partition pruning and multiple indexing technologies (including B-Tree, Bitmap, Hash, Brin, GIN), and JIT (expression just-in-time compilation processing).

- **Machine learning components MADlib**: Cloudberry Database integrates MADlib components, providing users with fully SQL-driven machine learning features, enabling deep integration of algorithms, computing power, and data.

- **Support multiple programming languages**: Cloudberry Database provides developers with rich programming languages, including R, Python, Perl, Java, and PostgreSQL, so that they can easily write custom functions.

- **High-performance parallel computing based on MPP engine**: The MPP engine of Cloudberry Database supports high-performance parallel computing, seamlessly integrated with SQL, and can perform fast computing and analysis on SQL execution results.

- **PostGIS geographic data processing**: Cloudberry Database introduces an upgraded version of PostGIS 2.X, supports its MPP architecture, and further improves the processing capability of geospatial data. Key features include:

     - Support for object storage: supports directly loading large-capacity geospatial data from object storage (OSS) into the database.
     - Comprehensive spatial data type support: including geometry, geography, and raster.
     - Spatio-temporal index: Provides spatio-temporal index technology, which can effectively accelerate spatial and temporal queries.
     - Complex spatial and geographic calculations: including sphere length calculations as well as spatial aggregation functions (such as contain, cover, intersect).

- **Cloudberry Database text component**: This component supports using ElasticSearch to accelerate file retrieval capabilities. Compared with traditional GIN data text query performance, this component has an order of magnitude improvement. It supports multiple word segmentation, natural language processing, and query result rendering.

</details>

## Flexible workload management

Cloudberry Database provides comprehensive workload management capabilities designed to effectively utilize and optimize database resources to ensure efficient and stable operations. Its workload management includes three levels of control: connection level management, session level management, and SQL level management.

<details>
<summary>Click to view details</summary>

- **Connection pool PGBouncer (connection-level management)**: Through the connection pool, Cloudberry Database manages user access in a unified manner, and limits the number of concurrently active users to improve efficiency, and avoid wasting resources caused by frequently creating and destructing service processes. The connection pool has a small memory footprint and can support high concurrent connections, using libevent for Socket communication to improve communication efficiency.

- **Resource Group (session-level management)**: Through resource groups, Cloudberry Database can analyze and categorize typical workloads, and quantify the CPU, memory, concurrency and other resources required by each workload. In this way, according to the actual requirements of the workload, you can set a suitable resource group and dynamically adjust the resource usage to ensure the overall operating efficiency. At the same time, you can use rules to clean up idle sessions and release unnecessary resources.

- **Dynamic resource group allocation (SQL-level management)**: Through dynamic resource group allocation, Cloudberry Database can flexibly allocate resources before or during the execution of SQL statements, which can give priority to specific queries and shorten the execution time.

</details>

## Multiple compatibility

The compatibility of Cloudberry Database is reflected in multiple aspects such as SQL syntax, components, tools and programs, hardware platforms and operating systems. This makes the database flexible enough to deal with different tools, platforms and languages.

<details>
<summary>Click to view details</summary>

- **SQL compatibility**: Cloudberry Database is compatible with PostgreSQL and Greenplum syntax, supports SQL-92, SQL-99, and SQL 2003 standards, including SQL 2003 OLAP extensions, such as window functions, `rollup`, and `cube`.

- **Component compatibility**: Based on the PostgreSQL 14.4 kernel, Cloudberry Database is compatible with most of the PostgreSQL components and extensions commonly used.

- **Tool and program compatibility**: Good connectivity with various BI tools, mining forecasting tools, ETL tools, and J2EE/.NET applications.

- **Hardware platform compatibility**: Can run on a variety of hardware architectures, including X86, ARM, Phytium, Kunpeng, and Haiguang.

- **Operating system compatibility**: Compatible with multiple operating system environments, such as CentOS, Ubuntu, Kylin, and BC-Linux.

</details>
