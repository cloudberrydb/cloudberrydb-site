---
title: Architecture
---

# Cloudberry Database Architecture

This document introduces the product architecture and the implementation mechanism of the internal modules in Cloudberry Database.

In most cases, Cloudberry Database is close to PostgreSQL in terms of SQL support, features, configuration options, and user functionalities. The experience users have with Cloudberry Database is similar to interacting with a standalone PostgreSQL system.

Cloudberry Database uses MPP (Massively Parallel Processing) architecture to store and process large volumes of data by distributing data and computational workloads across multiple servers or hosts.

MPP, also known as the shared-nothing architecture, refers to systems with multiple hosts that work together to perform a task. Each host has its own processor, memory, disk, network resources, and operating system. Cloudberry Database uses this high-performance architecture to distribute data loads and can use all system resources in parallel to process queries.

From the user's point of view, Cloudberry Database is a complete Relational Database Management System (RDBMS). In physical terms, it contains multiple PostgreSQL instances. To make these independent PostgreSQL instances work together, Cloudberry Database carries out distributed cluster processing at different levels for data storage, computation, communication, and management. Although Cloudberry Database is a cluster, it hides all the distributed details from the user and provides a single logical database. This greatly eases the work of developers and operational staff.

The architecture diagram of Cloudberry Database is as follows:

<!-- ![Cloudberry Architecture](./media/cbdb-arch.png) -->

- **Master node** (or control node) is the gateway to the Cloudberry Database system, which accepts client connections and SQL queries, and allocates tasks to data node instances. Users interact with Cloudberry Database by connecting to the master node using a client program (such as psql) or an application programming interface (API) (such as JDBC, ODBC, or libpq PostgreSQL C API).
    - The master node is where the global system catalog located. The global system catalog is a set of system tables that contain metadata about the Cloudberry Database system itself.
    - The master node does not store any user data, and data is stored only in the data node instances.
    - The master node authenticates client connections, handles incoming SQL commands, allocates workload among data nodes, coordinates the results returned by each data node, and presents the final results to the client program.
    - Cloudberry Database uses Write Ahead Logging (WAL) for master node/standby mirroring. In WAL-based logging, all modifications are first written to a log before being written to the disk, which ensures the data integrity of any in-process operation.

- **Segment** (or data node) instances are individual Postgres processes, each storing a portion of the data and executing the corresponding part of the query. When a user connects to the database through the master node and submits a query request, a process is created on each data node to handle the query. User-defined tables and their indices are distributed across all available data nodes in Cloudberry Database, with each data node containing different parts of the data, and processes dealing with different parts of the data running on their respective data nodes. Users interact with the data nodes via the master node, and the data nodes run on servers called data node hosts.

    Typically, a data node host runs 2 to 8 data nodes, depending on the processor, memory, storage, network interface, and workload. The configuration of the data node host needs to be balanced, because evenly distributing the data and workload among the data nodes is the key to achieving optimal performance with Cloudberry Database, which allows all data nodes to start processing a task and finish the work at the same time.

- **Interconnect** is the network layer in the Cloudberry Database system architecture. Interconnect refers to the network infrastructure upon which the communication between the master node and the data nodes relies, which uses a standard Ethernet switching structure.

    For performance reasons, it is recommended to use a network with a speed of 10 GB or faster. By default, the Interconnect module uses the UDP protocol with flow control (UDPIFC) for communication to send messages through the network. The data packet verification performed by Cloudberry Database exceeds the scope provided by UDP, meaning that its reliability is equivalent to using the TCP protocol, and its performance and scalability surpass the TCP protocol. If the Interconnect is changed to use the TCP protocol, the scalability of Cloudberry Database is limited to 1000 data nodes. This limit does not apply when using UDPIFC as the default protocol.

- Cloudberry Database uses Multiversion Concurrency Control (MVCC) to ensure data consistency. This means that when querying the database, each transaction only sees a snapshot of the data, ensuring that current transactions do not see modifications made by other transactions on the same records. This provides transaction isolation for each transaction in the database.

    MVCC minimizes lock contention to ensure performance in a multi-user environment. This is done by avoiding explicit locking for database transactions.
    
    In concurrency control, MVCC does not introduce conflicts for query (read) locks and write locks. In addition, read and write operations do not block each other. This is the biggest advantages of using MVCC over using lock mechanism.
