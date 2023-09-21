---
title:  Cloudberry Database Glossary
---

# Cloudberry Database Glossary

## B

- BDA: Big Data Analytics

- Broadcast motion: In a broadcast motion, every segment instance performs a broadcast of its data (sends its own local data to all other segment instances).

- BI: Business intelligence

## C

- CA: certificate authority

## D

- DCA: Data Computing Appliance

- DIA: Data integration Accelerator

- DD: Data Domain

- Data skew: Data skew happens if data is not equally distributed across all active segment instances.

- DDL: Data definition language- A subset of SQL commands used for defining the structure of a database

- Data directory: The data directory is the file system location on disk where database data is stored. The master data directory contains the global system catalog only — no user data is stored on the master. The data directory on the segment instances has user data for that segment plus a local copy of the system catalog. The data directory contains several subdirectories, control files, and configuration files as well.

- Distributed: Certain database objects in Cloudberry Database, such as tables and indexes, are distributed. They are divided into equal parts and spread out among the segment instances based on a hashing algorithm. To the end-user and client software, however, a distributed object appears as a conventional database object.

- Distribution key: In a Cloudberry table that uses hash distribution, one or more columns are used as the distribution key, meaning those columns are used to divide the data among all of the segments. The distribution key should be the primary key of the table or a unique column or set of columns.

- Distribution policy: The distribution policy determines how to divide the rows of a table among the Cloudberry segments. Cloudberry Database provides two types of distribution policy: hash distribution and random distribution.

- DML: Database Manipulation Language. SQL commands that store, manipulate, and retrieve data from tables. INSERT, UPDATE, DELETE, and SELECT are DML
commands.

## E

- ETL: extract-transform-load

## G

- `gp_toolkit`: gp_toolkit is an administrative schema that contains external tables, views, and functions that you can access with SQL commands. All database users can access gp_toolkit to view and query the system log files and other system metrics.

## H

- Hash distribution: With hash distribution, one or more table columns is used as the distribution key for the table. The distribution key is used by a hashing algorithm to assign each row to a particular segment. Keys of the same value will always hash to the same segment.

- Heap tables: Whenever you create a table without specifying a storage structure, the default is a heap storage structure. In a heap structure, the table is an unordered collection of data that allows multiple copies or versions of a row. Heap tables have row-level versioning information and allow updates and deletes. See also append-only tables and multi-version concurrency control.

- Host: A host represents a physical machine or compute node in a Cloudberry Database system. In Cloudberry Database, one host is designated as the master. The other hosts in the system have one or more segments on them.

## I

- `information_schema`: Information schema consists of a standardized set of views that contain information about the objects in the database. These views get system information from the system catalog tables in a standardized way.J

- JDK: Java development kit

## M

- Master host / node: The master is a dedicated processing unit with its own CPU, disks, memory, and network interface. It is responsible for accepting and distributing queries. It is the entry point into the Cloudberry system and does not store data.

- MPP (Massive Parallel Processing): The term enlightens on the fact that a Cloudberry array first, may consist of a theoretically unlimited number of nodes (massive), and second, that the nodes are working in parallel controlled by the master server (parallel processing).

- Mirror: A mirror segment is a standby segment typically used in high-availability environments that is activated should its corresponding primary segment no longer be available. Mirrors are optional.

- MVCC model: Internally, data consistency is maintained by using a multi-version model (Multi-version Concurrency Control, MVCC). This means that while querying a database, each transaction sees a snapshot of data (a database version) as it was some time ago, regardless of the current state of the underlying data.

- Motion node: A motion node is a portion of a query execution plan that indicates data movement between the various database instances of Cloudberry Database (segments and the master). Some operations, such as joins, require segments to send and receive tuples to one another in order to satisfy the operation. A motion node can also indicate data movement from the segments back up to the master.

- Multi-version concurrency control (MVCC): Unlike traditional database systems which use locks for concurrency control, Cloudberry Database (as does PostgreSQL) maintains data consistency by using a multiversion model (multiversion concurrency control or MVCC). This means that while querying a database, each transaction sees a snapshot of data which protects the transaction from viewing inconsistent data that could be caused by (other) concurrent updates on the same data rows. This provides transaction isolation for each database session. MVCC, by eschewing explicit locking methodologies of traditional database systems, minimizes lock contention in order to allow for reasonable performance in multiuser environments. The main advantage to using the MVCC model of concurrency control rather than locking is that in MVCC locks acquired for querying (reading) data do not conflict with locks acquired for writing data, and so reading never blocks writing and writing never blocks reading.

## O

- ODBC: Open Database Connectivity, a standard database access method that makes it possible to access any data from any client application, regardless of which database management system (DBMS) is handling the data. ODBC manages this by inserting a middle layer, called a database driver, between a client application and the DBMS. The purpose of this layer is to translate the application’s data queries into commands that the DBMS understands.

- OLAP: Online Analytical Processing (OLAP) is a category of technologies for collecting, managing, processing and presenting multidimensional data for analysis and management. OLAP leverages existing data from a relational schema or data warehouse (data source) by placing key performance indicators (measures) into context (dimensions). In practice, OLAP functions allow application developers to compose analytic business queries more easily and more efficiently. For example, moving averages and moving sums can be calculated over various intervals; aggregations and ranks can be reset as selected column values change; and complex ratios can be expressed in simple terms.

- OLTP: Online Transaction Processing (OLTP) is a mode of database processing involving single, small updates from end-point applications and real-time
transactional systems

## P

- Primary segment: A primary segment stores a distinct portion of data and is responsible for handling queries.

- Processing skew: If you distribute your data on a good column where the data is laid out well, but some segments end up working harder than others, you introduce processing skew.

- `pg_catalog`: `pg_catalog` contains the system catalog tables, built-in data types, functions, and operators. It is always part of the schema search path, even if it is not explicitly named in the search path.

- `pg_toast`: `pg_toast` stores large objects such as records that exceed the page size. This schema is used internally by the Cloudberry Database system.

- `pg_bitmapindex`: `pg_bitmapindex` stores bitmap index objects such as lists of values. This schema is used internally by the Cloudberry Database system.

- `pg_aoseg`: pg_aoseg stores append-only table objects. This schema is used internally by the Cloudberry Database system.

## Q

- Query dispatcher also called QD: The query dispatcher (QD) is a process that is initiated when users connect to the master and issue SQL commands. This process represents a user session and is responsible for sending the query plan to the segments and coordinating the results it gets back. The query dispatcher process spawns one or more query executor processes to assist in the execution of SQL commands.

- Query executor also called QE: A query executor process (QE) is associated with a query dispatcher (QD) process and operates on its behalf. Query executor processes run on the segment instances and execute their slice of the query plan on a segment.

- Query plan also called QP: A query plan is the set of operations that Cloudberry Database will perform to produce the answer to a given query. Each node or step in the plan represents a database operation such as a table scan, join, aggregation or sort. Plans are read and executed from bottom to top. Cloudberry Database supports an additional plan node type called a motion node. See also slice.

## R

- Random distribution: With random distribution, table rows are sent to the segments as they come in, cycling across the segments in a round-robin fashion. Rows with columns having the same values will not necessarily be located on the same segment. Although a random distribution ensures even data distribution, there are performance advantages to choosing a hash distribution policy whenever possible.

- RAID: Redundant Array of Independent (or Inexpensive) Disks. RAID is a system of using multiple hard drives for sharing or replicating data among the drives. The benefit of RAID is increased data integrity, fault-tolerance and/or performance. Multiple hard drives are grouped and seen by the OS as one logical hard drive.

- Resource queue: A resource queue has attributes that limit the size and/or total number of queries that can be executed by the users (or roles) in that queue.

- Redistribute motion: To perform a local join on the segment instance, matching rows must be located together on the same segment instance. In the case where data was not distributed on the join key, a dynamic redistribution of the needed rows form one of the tables to another segment instance will be performed.

- RPQ: Request for product qualification - Required when client installs third party software on DCA/DIA

## S

- Segment: A segment represents a portion of data in a Cloudberry database. User-defined tables and their indexes are distributed across the available number of segment instances in the Cloudberry Database system. Each segment instance contains a distinct portion of the user data. A primary segment instance and its mirror both store the same segment of data.

- Segment instance: A Postgres database server process, simply called a segment.

- Segment host / node: A node or segment host, in a Cloudberry system is a dedicated processing unit with its own CPU, disks, memory, and network interface. The segment host runs database server processes. It supports 1-n segments depending on the number of processors / cores.

- Slice: In order to achieve maximum parallelism during query execution, Cloudberry divides the work of the query plan into slices. A slice is a portion of the plan that can be worked on independently at the segment level. A query plan is sliced wherever a motion node occurs in the plan, one slice on each side of the motion. Plans that do not require data movement (such as catalog lookups on the master) are known as single-slice plans.

- Shared-nothing architecture: In contrast to a shared-everything architecture in which resources are used by many different applications, a shared nothing architecture grants usage to resources to the same application throughout all the time.

- System catalog: The global system catalog resides on the master and denotes the set of system tables that contain metadata about the Cloudberry Database system itself.

- Scatter / Gather technique: Scattering denotes the process of getting all data from all source systems to all segment instances in the Cloudberry system. Each segment instance in the system gathers the data it is responsible for.

- SSIS: Microsoft SQL Server Integration Services

- SSRS: Microsoft SQL Reporting Services

- SSD: Solid-state drives

## T

- Tuple: A tuple is another name for a row or record in a relational database table.

## W

- WAL: Write-Ahead Logging (WAL) is a standard approach to transaction logging. WAL’s central concept is that changes to data files (where tables and indexes reside) are logged before they are written to permanent storage. Data pages do not need to be flushed to disk on every transaction commit. In the event of a crash, data changes not yet applied to the database can be recovered from the log. A major benefit of using WAL is a significantly reduced number of disk writes.
