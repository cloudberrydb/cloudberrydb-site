---
title: "[101-0] Lesson 0: Introduction to Database and CloudberryDB Architecture"
---

# [101-0] Lesson 0: Introduction to Database and CloudberryDB Architecture

## Background: Database Concepts

Before starting this tutorials, spend some time to get familiar with how (single instance) databases work. If you already have some knowledge and experience with Oracle, MySQL or especially Postgres - this is great.

Databases (relational databases) are pieces of software that are used to store and manage/process data. Usually these databases are built with the client/server concept - the database is implemented as a server and multiple clients can connect and read or update the data.

The clients usually use SQL language to access the data (or some dialect of the SQL language specification). The clients can be different implementations - proprietary client libraries or ODBC/JDBC compliant.

Database data is usually stored in objects called tables. Tables have predefined structure (columns) and have zero or multiple rows.

Tables can be grouped in logical entities called 'schemas' (or namespaces).

Tables/schemas are located in a 'database' entity. Some database software supports multiple databases per instance (MySQL, Postgres), others support one database per instance (Oracle).

Along with tables there are supporting objects such as indexes, sequences, views, etc.

The database system needs to maintain some metadata - called the database catalog. The database catalog contains information about the data objects and supporting objects as well as anything else that needs to be stored on system level (user authentication, etc.).

SQL (Structured Query Language) is a descriptive language, not imperative language. Therefore it describes what the user needs, not how to get it. When the user describes what he needs, the database need to decide how to get it. This process is called query optimization. The end result from this process is a query plan, which is a step by step instruction how to get the result.

## Introduction to the Cloudberry Database Architecture

Cloudberry Database (or CloudberryDB) is a massively parallel processing (MPP) database server with an architecture specially designed to manage large-scale analytic data warehouses and business intelligence workloads.

MPP (also known as a shared-nothing architecture) refers to systems with two or more processors that cooperate to carry out an operation, each processor with its own memory, operating system, and disks. Cloudberry Database uses this high-performance system architecture to distribute the load of multi-terabyte data warehouses and all of a system's resources in parallel to process a query.

Cloudberry Database is based on the open-source PostgreSQL. It is essentially several PostgreSQL database instances working together as one cohesive database management system (DBMS). It is based on PostgreSQL 14.4 kernel and in most cases it is very similar to PostgreSQL. Database users interact with Cloudberry Database as a regular PostgreSQL DBMS.

In CloudberryDB, internals of PostgreSQL have been modified and optimized to support parallel structure of Cloudberry Database. For instance, system catalog, optimizer, query executor and transaction manager components have been modified and enhanced to be able to execute queries simultaneously across the parallel PostgreSQL database instances. CloudberryDB interconnect (the networking layer) enables communication between distinct PostgreSQL instances and allows the system to behave as one logical database.

Cloudberry Database also includes features designed to optimize PostgreSQL for business intelligence (BI) workloads. For example, CloudberryDB has added parallel data loading (external tables), resource management, query optimizations and storage enhancements,.

_Figure 1. High-Level Cloudberry Database Architecture_

![High-Level Cloudberry Database Architecture](./images/highlevel_arch.jpg)  

The following topics describe the components that make up a Cloudberry Database system and how they work together.

### CloudberryDB Master (Coordinator)

:::note

In the latest build of Cloudberry Database, the name "Master" has been deprecated, and "Coordinator" has been used instead. You are expected to see "coordinator" in the database output.

:::

The Cloudberry Database master is the entry to the Cloudberry Database system. It accepts client connections, handles SQL queries, and then distributes workload to the segment instances.

Cloudberry Database end-users only interact with Cloudberry Database through master node as a typical PostgreSQL database. They connect to database using client such as psql or drivers like JDBC or ODBC.

The master stores global system catalog. Global system catalog is set of system tables that contain metadata for Cloudberry Database itself. Master node does not contain any user table data; user table data resides only on segments. Master node would authenticate client connections, processe incoming SQL commands, distribute workloads among segments, collect the results returned by each segment and return the final results to the client.

### CloudberryDB Segments

Cloudberry Database segment instances are independent PostgreSQL databases that each of them stores a portion of the data and performs the majority of query execution work.

When a user connects to the database via the Cloudberry master and issues queries, accordingly execution plan would be distributed to each segment instance.

The server that has segments running on it is called segment host. A segment host usually has two to eight Cloudberry segments running on it, the number depending on serveral factors: CPU cores, memory, disk, network interfaces or workloads. To get better performance in Cloudberry Database, it is suggested to distribute data and workloads evenly across segments so that execution plan can be finished across all segments and with no bottleneck.

### CloudberryDB Interconnect

The interconnect is the networking layer of the Cloudberry Database architecture.

The interconnect refers to the inter-process communication mechanism in-between segments. By default, interconnect uses User Datagram Protocol (UDP) to send/receive messages over the network. Interconnect provide datagram verification and retransmission mechanism. Reliability is equivalent to Transmission Control Protocol (TCP), performance and scalability exceeds TCP. If a user chooses TCP in interconnect, Cloudberry would have limit around 1000 segment instances. With UDP and interconncet, the limit does not exit.

Now you can start the following lessons by clicking on the links:

- [Lesson 1: Create Users and Roles](./101-1-create-users-and-roles)
- [Lesson 2: Create and Prepare Database](./101-2-create-and-prepare-database)
- [Lesson 3: Create Tables](./101-3-create-tables)
- [Lesson 4: Data Loading](./101-4-data-loading)
- [Lesson 5: Queries and Performance Tuning](./101-5-queries-and-performance-tuning)
- [Lesson 6: Backup and Recovery Operations](./101-6-backup-and-recovery-operations)
