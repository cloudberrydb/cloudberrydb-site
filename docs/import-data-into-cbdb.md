---
title: Load Data into Cloudberry Database
---

# Load Data into Cloudberry Database

This document briefly introduces how to load data into Cloudberry Database.

Cloudberry Database supports high-performance parallel data loading, and for smaller amounts of data, single file, non-parallel data import and export.

Cloudberry Database can read from and write to several types of external data sources.

- The `COPY` SQL command transfers data between an external text file on the coordinator host, or multiple text files on segment hosts, and a Cloudberry Database table.
- Readable external tables allow you to query data outside of the database directly and in parallel using SQL commands such as `SELECT` or `JOIN`, or sort external table data, and you can create views for external tables. External tables are often used to load external data into a regular database table using a command such as `CREATE TABLE table AS SELECT * FROM ext_table`.
- The `gpfdist` utility is the Cloudberry Database parallel file distribution program. It is an HTTP server that is used with external tables to allow Cloudberry Database segments to load external data in parallel, from multiple file systems. You can run multiple instances of gpfdist on different hosts and network interfaces and access them in parallel.
- The `gpload` utility automates the steps of a load task using `gpfdist` and a YAML-formatted control file.

The method you choose to load data depends on the characteristics of the source data—its location, size, format, and any transformations required.

In the simplest case, the COPY SQL command loads data into a table from a text file that is accessible to the Greenplum Database coordinator instance. This requires no setup and provides good performance for smaller amounts of data. With the COPY command, the data copied into or out of the database passes between a single file on the coordinator host and the database. This limits the total size of the dataset to the capacity of the file system where the external file resides and limits the data transfer to a single file write stream.

More efficient data loading options for large datasets take advantage of the Greenplum Database MPP architecture, using the Greenplum Database segments to load data in parallel. These methods allow data to load simultaneously from multiple file systems, through multiple NICs, on multiple hosts, achieving very high data transfer rates. External tables allow you to access external files from within the database as if they are regular database tables. When used with gpfdist, the Greenplum Database parallel file distribution program, external tables provide full parallelism by using the resources of all Greenplum Database segments to load or unload data.
