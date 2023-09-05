---
title: 产品特性
slug: /
---

# Cloudberry Database 产品特性

Cloudberry Database 基于最新的 PostgreSQL 14.4 内核，是当前最先进的成熟开源 MPP 数据库之一，具备高并发、高可用等多种特性，可以对复杂任务进行快速高效计算，以满足海量数据管理和计算的需求，目前在多个领域都有着广泛应用。

本文档从总体上介绍 Cloudberry Database 的特性。

## 多场景高效查询

- Cloudberry Database 支持用户在大数据分析环境和分布式环境下进行有效的查询：

    - **大数据分析环境**：Cloudberry Database 使用内置的 PostgreSQL 的优化器，可更好地支持分布式环境。这意味着它能够在处理大数据分析任务时产生更高效的查询计划。
    - **分布式环境**：采用开源优化器 GPORCA 优化器，经过特定适配，可满足分布式环境下的查询优化需求。

- 提供分区静态和动态减裁、聚集下推、连接过滤等技术，以帮助用户获得最快、最精确的查询结果。
- 提供了基于规则的查询优化手段和基于代价的查询优化手段，帮助用户生成更高效的查询执行计划。

## 多态数据存储

Cloudberry Database 支持多种不同的存储格式，包括 Heap 存储、AO 行存储、AOCS 列存储，用于不同的应用场景。同时，Cloudberry Database 还支持分区表，用户可以按照某个条件定义表的分区方式，查询时根据查询条件自动过滤不需要查询的子表，提高数据的查询效率。

<details>
<summary>点击以查看详情</summary>

- **均匀的数据分布**：通过 Hash 和 Random 的方式进行数据分布，可以更好地利用磁盘性能并解决 I/O 瓶颈问题。
- **多种存储类型的选择**：

    - 行式存储：适用于大多数字段频繁查询和随机行访问较多的情况。
    - 列式存储：当你需要对少数字段进行查询时，这种方式可以大幅节省 I/O 操作，非常适合大数据量频繁访问的场景。

- **专门的存储模式**：Cloudberry Database 设计了 Heap 存储、AO 行存储、AOCS 列存储等不同的存储模式以优化各种应用类型的性能。在最细粒度到分区的层面，一张表可以实现多种存储模式。
- **支持分区表**：你可以根据特定条件定义表的分区方式。在查询时，系统将自动过滤不需要查询的子表，提高数据的查询效率。
- **高效的数据压缩功能**：支持多种压缩算法，如 Zlib 1-9 和 Zstandard 1~19，以提高数据处理性能，并保持 CPU 与压缩比的平衡。
- **对小表的优化**：你可以选择使用 Replication Table，并在创建表时指定自定义 Hash 算法，更灵活地控制数据分布。

</details>

## 多层次的数据安全防护

Cloudberry Database 加强对用户数据的保护，支持函数加密解密，以及透明数据加密和解密。透明数据加密解密指在用户不感知的情况下，加密解密过程由 Cloudberry Database 内核完成，目前可以支持的数据格式包括 Heap 表、AO 行存储、AOCS 列存储。同时加密算法除了常用的 AES 等算法以外，还特别支持国密算法，用户可以方便的扩展自己的算法到透明数据加密中。

<details>
<summary>点击以查看详情</summary>

Cloudberry Database 着重强调数据安全性，提供了全方位的安全保护措施。这些安全特性被设计为满足各种数据库环境需求，并提供多层次的安全防护，包括：

- **数据库隔离**：在 Cloudberry Database 中，数据在各数据库间不共享，实现了多数据库环境的隔离。如果需要进行跨数据库访问，可以使用 DBLink 功能。

- **内部数据组织**：数据库内部的数据逻辑组织包括多种数据对象，如表、视图、索引、函数等，而数据访问则可以跨 Schema 进行。

- **强大的数据存储安全性**：Cloudberry Database 提供了不同的存储模式以支持数据冗余，并采用各种加密方法（包括 AES 128、192、256，DES，以及国密加密等）以确保数据存储的安全性。此外，还支持密文认证，包括 SCRAM-SHA-256、MD5、LDAP、RADIUS 等加密算法。

- **用户数据保护**：Cloudberry Database 提供了函数加密解密，以及透明数据加密解密。透明数据加密解密的过程由 Cloudberry Database 内核完成，用户无需进行任何操作。可以支持的数据格式包括 Heap 表，AO 行存储，AOCS 列存储。除了常见的 AES 等加密算法，也特别支持国密算法，使用户可以方便地扩展自己的算法到透明数据加密中。

- **详细的权限设定**：为了满足不同用户和不同级别的对象（例如：Schema、表、行、列、视图、函数等）的权限需求，Cloudberry Database 提供了丰富的权限设定选项，包括 `SELECT`、`UPDATE`、执行权、所有权等等。

</details>

## 数据加载

Cloudberry Database 提供了一系列高效且灵活的数据加载解决方案，以满足各种数据处理需求，包括并行化和持久化的数据加载、支持灵活的数据源和文件格式、集成多款 ETL 工具、支持流式数据加载、提供高性能的数据访问。

<details>
<summary>点击以查看详情</summary>

- **并行化和持久化的数据加载**：通过外部表技术，Cloudberry Database 支持大批量并行和持久化的数据加载，实现字符集间的自动转换，例如从 GBK 到 UTF8。这一功能使得数据输入变得更为流畅。

- **灵活的数据源和文件格式支持**：无论数据存储在外部文件服务器、Hive、Hbase、HDFS 还是 S3 等多种存储介质，或是处于 CSV、Text、JSON、ORC、Parquet 等多种文件格式，Cloudberry Database 都能提供支持。并且，该数据库也可以加载 Zip 等压缩数据文件。

- **集成多款 ETL 工具**：DataStage、Informatica、Kettle 等多款 ETL 工具都已集成到 Cloudberry Database 中，提升数据处理的便利性。

- **支持流式数据加载**：Cloudberry Database 可针对订阅的 Kafka Topic 启动多个并行读取任务，将读取后的记录缓存，到达一定时间或记录数后，通过 gpfdist 加载到数据库中。这种方式可以确保数据的完整性，不重也不丢，非常适用于流数据采集和实时分析场景。支持达到每分钟几千万的数据加载吞吐量。

- **高性能的数据访问**：PXF 是 Cloudberry Database 的内置组件，可以将外部数据源映射到 Cloudberry Database 的外部表，实现并行和高速的数据访问。PXF 支持混合数据生态的管理和访问，帮助实现 Data Fabric 架构。

</details>

## 多层容错

Cloudberry Database 为了确保数据安全和服务的连续性，采取了数据页面、Checksum、镜像节点配置、控制节点备份的多级容错机制。

<details>

<summary>点击以查看详情</summary>

- **数据页面的 Checksum**：在底层存储上，Cloudberry Database 使用 Checksum 机制进行坏块检测，保证数据的完整性。

- **镜像节点配置**：通过在数据节点间配置镜像节点，Cloudberry Database 能实现服务的高可用和故障切换。一旦检测到主节点发生不可恢复故障，系统会自动切换到备份数据节点，确保用户查询不会受到影响。

- **控制节点的备份**：类似于数据节点，控制节点也可以配置备份节点，以防止主控制节点发生故障。一旦主控制节点发生故障，系统将自动切换到备份控制节点，确保服务的连续性。

</details>

## 丰富的数据分析支持

Cloudberry Database 提供了强大的数据分析功能，使得数据处理、查询和分析变得更加高效，满足各类复杂的数据处理、分析和查询需求。

<details>
<summary>点击以查看详情</summary>

- **并行优化器和执行器**：Cloudberry Database 内核内置了并行优化器和执行器，不仅能够兼容 PostgreSQL 生态，还支持数据分区裁剪、多种索引技术（包括 BTree，Bitmap，Hash，Brin，GIN等），以及 JIT（表达式即时编译处理）等。

- **机器学习组件 - MADlib**：Cloudberry Database 集成了 MADlib 组件，为用户提供了全 SQL 驱动的机器学习功能，让算法、算力和数据能够深度融合。

- **支持多种编程语言**：Cloudberry Database 为开发者提供了丰富的编程语言选择，包括 R、Python、Perl、Java和 PostgreSQL 等，使得用户可以方便地编写自定义函数。

- **基于 MPP 引擎的高性能并行计算**：Cloudberry Database 的 MPP 引擎支持高性能并行计算，与 SQL 无缝集成，可以针对 SQL 执行结果进行快速的计算和分析。

- **PostGIS 地理数据处理**：Cloudberry Database 引入了升级版的 PostGIS 2.X，支持其 MPP 架构，进一步提升了对地理空间数据的处理能力。主要特性包括：

    - 集成对象存储：支持大容量地理空间数据从对象存储（OSS）直接加载入库。
    - 全面的空间数据类型支持：包括 geometry（几何）、geography（地理）、Raster（栅格）等空间数据类型。
    - 时空索引：提供时空索引技术，可以有效加速空间和时间相关的查询。
    - 复杂的空间和地理位置计算：包括球体长度计算以及空间聚集函数（如包含、覆盖、相交等）。

- **Cloudberry Database Text 组件**：这个组件支持利用 ElasticSearch 加速文件检索能力，相比传统的 GIN 数据文本查询性能有数量级的提升，支持多种分词，自然语言处理，以及查询结果渲染等。

</details>

## 灵活的工作负载管理

Cloudberry Database 提供了全面的工作负载管理功能，旨在有效地利用和优化数据库资源，以确保高效、稳定的运行。其工作负载管理主要包括连接级别管理、会话级别管理、SQL 级别管理三个层次的控制。

<details>
<summary>点击以查看详情</summary>

- **连接池 PGBouncer（连接级别管理）**：通过连接池，Cloudberry Database 对用户接入进行统一管理，限制同时活跃的用户数量，以提高效率并避免因频繁创建和销毁服务进程而浪费资源。连接池具有较小的内存占用，并能够支持高并发连接，使用 libevent 进行 Socket 通信以提高通信效率。

- **资源组 Resource Group（会话级别管理）**：通过资源组，Cloudberry Database 能够分析并分类典型的工作负载，量化每个工作负载所需的 CPU、内存、并发度等资源。这样，根据工作负载的实际需求，可以设定适合的资源组，并动态调整资源使用，以确保整体运行效率。同时，还可以利用规则清理空闲的会话，释放不必要的资源。

- **动态资源组分配（SQL 级别管理）**：通过动态资源组分配，Cloudberry Database 能够在 SQL 语句执行前或执行过程中灵活地分配资源，以便优待特定的查询，缩短其运行时间。

</details>

## 多种兼容性

Cloudberry Database 的兼容性表现在 SQL 语法、组件、工具和程序、硬件平台和操作系统等多个方面，这使得它能够灵活应对各种工具、平台和语言。

<details>
<summary>点击以查看详情</summary>

- **SQL 兼容性**：Cloudberry Database 兼容 PostgreSQL 和 Greenplum 语法，支持 SQL-92，SQL-99，以及 SQL 2003 标准，包括 SQL 2003 OLAP 扩展，如窗口函数，`rollup`，`cube` 等。

- **组件兼容性**：基于 PostgreSQL 14.4 内核，Cloudberry Database 兼容市面上常用的大多数 PostgreSQL 组件和扩展。

- **工具和程序兼容性**：与多种 BI 工具、挖掘预测工具、ETL 工具，以及 J2EE/.NET 应用程序都有良好的连通性。

- **硬件平台兼容性**：能够在多种硬件架构下运行，包括 X86、ARM、飞腾、鲲鹏、海光等。

- **操作系统兼容性**：兼容多种操作系统环境，如 CentOS、Ubuntu、Kylin、BC-Linux 等。

</details>
