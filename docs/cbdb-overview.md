---
id: cbdb-overview
title: Product Overview
---

# Cloudberry Database Overview

Cloudberry Database, built on the PostgreSQL 14.4 core (released in mid-2022), stands as one of the most advanced and mature open-source MPP databases available. With a range of high concurrency and high availability features, it is capable of efficiently handling complex tasks, managing and processing massive amounts of data. It is now widely used in multiple fields.

- Outstanding performance: Cloudberry Database has remarkable advantages in data storage, high concurrency, high availability, linear scalability, responsiveness, ease of use, and cost-effectiveness. In the era of big data, Cloudberry Database excels in processing terabyte-level datasets, surpassing Hadoop in terms of stand-alone performance.
- Strong syntax compatibility: Cloudberry Database offers superior usability and functionality compared to the SQL engine on Hadoop, making it more accessible for novice users.
- Comprehensive tooling: Cloudberry Database boasts a comprehensive suite of tools, eliminating the need for extensive tool customization. This makes it an ideal solution for large-scale data warehouse projects, saving time and effort for users.
- Flexible deployment: Cloudberry Database supports flexible deployment options, including the traditional hardware deployment, as well as the multi-cloud and cross-cloud deployments.
- Cloudberry Database provides comprehensive support for diverse data types, formats, and storage media. Its flexibility ensures that it can effectively meet the various requirements of users.

This document introduces the product architecture, the mechanisms of Cloudberry Database's internal modules, and what those mean to users.

## Product architecture

Cloudberry Database is similar to PostgreSQL in most ways. It supports the same SQL commands, has the same features, and can be configured in the same way. Users can interact with Cloudberry Database in a similar way to how they interact with PostgreSQL.

Cloudberry Database uses a technology known as Massively Parallel Processing (MPP) to handle a large amount of data. It spreads the data and tasks across many different servers or hosts.

MPP is also referred to as a shared-nothing architecture. It is a system where many servers work together, each with its own processor, memory, disk, network resources, and operating system. Cloudberry Database uses this high-performance system to evenly distribute large data tasks and use all the system's resources simultaneously for processing queries.

To the user, Cloudberry Database looks like a full-featured Relational Database Management System (RDBMS). But inside, it is made up of multiple PostgreSQL instances. Cloudberry Database uses a feature called distributed clustering to help these PostgreSQL instances work together efficiently. This approach applies to data storage, computations, communications, and management. Cloudberry Database hides the complex details of this distributed setup, giving users a single, logical database view. This simplifies the tasks for developers and operations staff.

The architecture diagram of Cloudberry Database is shown below: [Insert Architecture Diagram]

![Cloudberry Database architecture](./media/cbdb-arch.png)

Cloudberry Database is comprised of the following components:

- The **master** serves as the gateway to Cloudberry Database. It handles client connections and SQL queries, and distributes tasks to segment instances. Users interact with Cloudberry Database by connecting to the master using client programs (such as psql) or application programming interfaces (APIs) like JDBC, ODBC, or the libpq PostgreSQL C API.
    - The master acts as the global system directory, containing a set of system tables that record the metadata of Cloudberry Database. 
    - The master does not store any user data. User data is only stored on segment instances.
    - The master performs authentication for client connections, processes SQL commands, distributes workload among segments, coordinates the results returned by each segment, and presents the final results to the client program.
    - Cloudberry Database uses Write-Ahead Logging (WAL) for master/standby mirroring. In WAL-based logging, all modifications are logged before they are written to disk to ensure data integrity for any in-process operations.

- The **segment** instances are independent Postgres processes. Each segment stores a specific portion of the data and handles the corresponding queries. When a user connects to the database through the master and submits a query request, processes are created on each segment to handle the query. User-defined tables and their indexes are distributed across the available segments, and each data node contains distinct portions of the data. The processes of data processing runs in the corresponding segment. Users interact with segments through the master, and the segment operate on servers known as the segment host.

    Typically, a segment host runs 2 to 8 segment instances, depending on the processor, memory, storage, network interfaces and workload. Balancing the configuration of segment hosts is critical because Cloudberry Database achieves optimal performance by evenly distributing data and workload among segments, allowing all segments to initiate and complete tasks simultaneously.

- The **interconnect** serves as the network layer in the Cloudberry Database system architecture. It refers to the network infrastructure on which the communication of the master and segments depends, using a standard Ethernet switching structure.

    For performance reasons, a 10 GB or faster network is recommended. By default, the interconnect module communicates using the UDP protocol with flow control (UDPIFC) to send messages over the network. Cloudberry Database performs packet validation beyond what UDP offers, which means that the reliability of Cloudberry Database is equivalent to using the TCP protocol, and the performance and scalability exceed that of TCP. If the interconnectx is changed to the TCP protocol instead, Cloudberry Database's scalability is limited to 1000 segments. However, this restriction does not apply when UDPIFC is used as the default protocol.

- Cloudberry Database uses Multiversion Concurrency Control (MVCC) to ensure data consistency. When querying the database, each transaction sees only a snapshot of the data, which ensures that the current transaction does not see other transactions modifying the same records. Accordingly, MVCC provides transaction isolation for every database transaction.

    MVCC minimizes lock contention to ensure performance in multi-user environments by avoiding explicit locking for database transactions. One remarkable advantage of MVCC over locks is that read and write operations do not conflict, and they never block each other.

## Data loading

Cloudberry Database supports massive parallel and persistent data loading through external table technology, and enables automatic conversion between character sets such as GBK and UTF8. Based on the MPP architecture, the Scatter-Gather Streaming<sup>TM</sup> technology provides linear expansion of performance. Cloudberry Database supports a variety of storage media such as external file servers, Hive, Hbase, HDFS, S3 and various file formats such as CSV, Text, JSON, ORC, Parquet, and supports compressed data file loading such as Zip. Cloudberry Database is used by DataStage, Informatica, Kettle for ETL tool integration.

Cloudberry Database also supports streaming data loading. For subscribed Kafka Topics, it launches multiple tasks in parallel to read partition data based on the configured maximum task value. After reading the data, the records are cached until a certain time or record count is reached. They are then loaded into Cloudberry Database using gpfdist to ensure data integrity and prevent duplication or loss. This capability is ideal for scenarios involving streaming data collection and real-time analysis. Cloudberry Database supports a data loading throughput of tens of millions of records per minute.

PXF is a built-in component of Cloudberry Database, which supports mapping external data sources to Cloudberry Database external tables to implement the Data Fabric architecture. Parallel and high-speed data access is realized based on the MPP engine, and hybrid data ecological management and access are supported.

![Data loading architecture diagram](./media/cbdb-data-loading-arch.png)

## Data storage and security

Cloudberry Database computation parallelization is based on the even distribution of data in storage layer, and even data distribution is the key to parallel processing. Cloudberry Database provides two types of data distribution methods, Hash and Random, to ensure that data is evenly distributed on each disk, so that each disk's performance can be exploited and I/O bottleneck can be fundamentally solved. Cloudberry Database provides more flexible distribution methods.

Replication Table can be used for small tables, and users can specify custom Hash algorithms when creating tables to control data distribution flexibly. It supports both row storage and column storage.

- Row storage: fast update speed, frequent query for most fields, more random row access.
- Columnar storage: Few field queries, significant savings in I/O operations, and frequent access to large data volumes.

Cloudberry Database can design the storage mode according to the application type, down to the finest granularity to partition, to achieve a table with multiple storage modes to optimize access performance. When a query is executed, the Cloudberry Database optimizer generates the corresponding optimal query plan based on statistical information and the storage form used by the user, without user intervention.

![Row storage and column storage](./media/cbdb-row-col-storage.png)

Data compression can improve data processing performance. The compression ratio depends on the compression algorithm and the data content, and can reach more than 20 times for mobile communication signaling, call detail records, and clickstream data. Compression is supported in all storage modes, allowing different columns within a table to utilize distinct compression algorithms. Cloudberry Database provides several compression algorithms:

- Zlib 1-9: high compression ratio, occupies more CPU resources, suitable for scenarios with strong CPU computing power.
- Zstandard 1~19: achieve the balance between CPU and compression ratio.

Data security is also very important. Cloudberry Database supports multiple databases, and data is not shared between databases. Cross-database access can be performed through DBLink. The logical organization of data within the database includes multiple types of data objects such as tables, views, indexes, and functions. Data access is supported across schemas.

In terms of storage security, Cloudberry Database supports different storage modes, data redundancy and data encryption (AES 128, AES 192, AES 256, DES and national secret encryption). Cloudberry Database supports ciphertext authentication and various encryption algorithms such as SCRAM-SHA-256, MD5, LDAP, RADIUS. For different users, set various types of permissions on different levels of objects (such as schema, table, row, column, view and function). The permissions that can be set include select, update, execution, ownership and more.

## Data analysis

The Cloudberry Database core has a powerful built-in parallel optimizer and executor, which is compatible with the PostgreSQL ecosystem and supports technologies such as data partition pruning, index(such as BTree, Bitmap, Hash, Brin, GIN), and JIT (expression just-in-time compilation processing).

In addition, Cloudberry Database integrates a large number of rich analysis components:

- Machine learning component MADlib on Cloudberry Database: SQL-driven, algorithm + computing power + data.
- PL language. Developers can write user-defined functions in R, Python, Perl, Java, PostgreSQL, and other languages.
- Based on the MPP engine, Cloudberry Database realizes high-performance, parallel computing, seamlessly integrates with SQL, and executes calculation and analysis on SQL results.
- PostGIS, based on PostGIS 2.X with enterprise-level improvements, supports Cloudberry Database MPP architecture, integrates object storage, supports large-capacity objects, supports all spatial data types (such as geometry, geography, Raster), supports spatio-temporal index, and supports complex spatial and geographic location calculations, sphere length calculations, and spatial aggregation functions (such as contain, cover, intersect).
- The Cloudberry Database Text component supports accelerated document retrieval capabilities via ElasticSearch, which has significantly improved the performance of traditional GIN data text query by an order of magnitude, and supports multiple word segmentation, natural language processing, and query result rendering capabilities.

## Flexible workload management

- Connection pool PGBouncer (Connection level, supports high concurrency of Cloudberry Database clusters at the connection level): the database side manages sessions in a unified manner, controls how many users can access at the same time, avoids frequent creation and destruction of service processes. PGBouncer occupies small memory, supports high concurrency, and uses libevent for socket communication to achieve higher efficiency.
- Resource group (Session level, quantitative control of Cloudberry Database cluster resources at the session level): Sorts out workloads, analyzes the CPU and memory of the load, and publishes requirements, sets Resource Group based on workload analysis, monitors GP operation, dynamically adjusts RS, and uses rules to clean up idle sessions.
- Dynamically allocating resource groups (Query level, dynamically adjust Cloudberry Database cluster resources at the SQL level): before or during the execution of SQL statements, dynamically implement flexible and dynamic allocation of resources, give priority to specific queries to shorten their running time.

## Highly compatible with third-party products

Cloudberry Database has excellent connectivity to BI tools, mining and forecasting tools, ETL tools, J2EEa and .NET applications, data sources and computing engines.

![Third party compatible tools](./media/cbdb-third-party-compati.png)

## Cross-platform and localization support

Cloudberry Database supports multiple hardware architectures, including X86, ARM, Feiteng, Kunpeng, and Haikou systems, as well as operating system environments such as CentOS, Ubuntu, Kylin, and BC-Linux.