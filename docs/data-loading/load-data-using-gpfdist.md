---
title: Load Data Using gpfdist
---

# Load Data into Cloudberry Database Using `gpfdist`

To load data from local host files or files accessible via internal network, you can use the `gpfdist` protocol in the `CREATE EXTERNAL TABLE` statement. gpfdist is a file server utility that runs on a host other than the Cloudberry Database coordinator or standby coordinator. `gpfdist` serves files from a directory on the host to Cloudberry Database segments.

When external data is served by gpfdist, all segments in the Cloudberry Database system can read or write external table data in parallel.

The supported data formats are:

- CSV and TXT
- Any delimited text format supported by the `FORMAT` clause
<!-- - XML and JSON (requires conversion to text format via YAML configuration file) -->

The general procedure for loading data using `gpfdist` is as follows:

1. Install gpfdist on a host other than the Cloudberry Database coordinator or standby coordinator. See [Install gpfdist](#step-1-install-gpfdist).
2. Start gpfdist on the host. See [Start and stop gpfdist](#step-2-start-and-stop-gpfdist).
3. Create an external table using the `gpfdist` protocol. See [Examples for using gpfdist with external tables](#step-3-use-gpfdist-with-external-tables-to-load-data).

<details>
<summary>About gpfdist</summary>

## About gpfdist

Before using gpfdist, you might need to know how it works. This section provides an overview of gpfdist and how to use it with external tables.

### About gpfdist and external tables

The `gpfdist` file server utility is located in the `$GPHOME/bin` directory on your Cloudberry Database coordinator host and on each segment host. When you start a `gpfdist` instance you specify a listen port and the path to a directory containing files to read or where files are to be written. For example, this command runs `gpfdist` in the background, listening on port `8801`, and serving files in the `/home/gpadmin/external_files` directory:

```shell
$ gpfdist -p 8801 -d /home/gpadmin/external_files &
```

The `CREATE EXTERNAL TABLE` command `LOCATION` clause connects an external table definition to one or more `gpfdist` instances. If the external table is readable, the `gpfdist` server reads data records from files from in specified directory, packs them into a block, and sends the block in a response to a Cloudberry Database segment's request. The segments unpack rows that they receive and distribute the rows according to the external table's distribution policy. If the external table is a writable table, segments send blocks of rows in a request to gpfdist and gpfdist writes them to the external file.

External data files can contain rows in CSV format or any delimited text format supported by the `FORMAT` clause of the `CREATE EXTERNAL TABLE` command.

<!-- In addition, `gpfdist` can be configured with a YAML-formatted file to transform external data files between a supported text format and another format, for example XML or JSON. See <ref\> for an example that shows how to use `gpfdist` to read external XML files into a Cloudberry Database readable external table. -->

For readable external tables, `gpfdist` uncompresses `gzip` (`.gz`) and `bzip2` (.`bz2`) files automatically. You can use the wildcard character (`*`) or other C-style pattern matching to denote multiple files to read. External files are assumed to be relative to the directory specified when you started the `gpfdist` instance.

### About gpfdist setup and performance

You can run `gpfdist` instances on multiple hosts and you can run multiple `gpfdist` instances on each host. This allows you to deploy `gpfdist` servers strategically so that you can attain fast data load and unload rates by utilizing all of the available network bandwidth and Cloudberry Database's parallelism.

- Allow network traffic to use all ETL host network interfaces simultaneously. Run one instance of gpfdist for each interface on the ETL host, then declare the host name of each NIC in the `LOCATION` clause of your external table definition (see [Examples for Creating External Tables](#example-1---run-single-gpfdist-instance-on-a-single-nic-machine)).

- Divide external table data equally among multiple gpfdist instances on the ETL host. For example, on an ETL system with two NICs, run two gpfdist instances (one on each NIC) to optimize data load performance and divide the external table data files evenly between the two gpfdist servers.

:::tip
Use pipes (`|`) to separate formatted text when you submit files to gpfdist. Cloudberry Database encloses comma-separated text strings in single or double quotes. gpfdist has to remove the quotes to parse the strings. Using pipes to separate formatted text avoids the extra step and improves performance.
:::

### Control segment parallelism

The `gp_external_max_segs` server configuration parameter controls the number of segment instances that can access a single gpfdist instance simultaneously. 64 is the default. You can set the number of segments such that some segments process external data files and some perform other database processing. Set this parameter in the `postgresql.conf` file of your coordinator instance.

</details>

## Step 1. Install gpfdist

gpfdist is installed in `$GPHOME/bin` of your Cloudberry Database coordinator host installation. Run gpfdist on a machine other than the Cloudberry Database coordinator or standby coordinator, such as on a machine devoted to ETL processing. Running gpfdist on the coordinator or standby coordinator can have a performance impact on query execution.

## Step 2. Start and stop gpfdist

You can start gpfdist in your current directory location or in any directory that you specify. The default port is `8080`.

From your current directory, type:

```shell
gpfdist &
```

From a different directory, specify the directory from which to serve files, and optionally, the HTTP port to run on.

To start gpfdist in the background and log output messages and errors to a log file:

```shell
$ gpfdist -d /var/load_files -p 8081 -l /home/`gpadmin`/log &
```

For multiple gpfdist instances on the same ETL host, use a different base directory and port for each instance. For example:

```shell
$ gpfdist -d /var/load_files1 -p 8081 -l /home/`gpadmin`/log1 &
$ gpfdist -d /var/load_files2 -p 8082 -l /home/`gpadmin`/log2 &
```

The logs are saved in `/home/gpadmin/log`.

:::info
To stop gpfdist when it is running in the background:

First find its process id:

```shell
$ ps -ef | grep gpfdist
```

Then stop the process, for example (where `3457` is the process ID in this example):

```shell
$ kill 3457
```
:::

## Step 3. Use gpfdist with external tables to load data

The following examples show how to use gpfdist when creating an external table to load data into Cloudberry Database.

:::tip
When using IPv6, always enclose the numeric IP addresses in square brackets.
:::

### Example 1 - Run single gpfdist instance on a single-NIC machine

Creates a readable external table, ext_expenses, using the gpfdist protocol. The files are formatted with a pipe (`|`) as the column delimiter.

```sql
=# CREATE EXTERNAL TABLE ext_expenses ( name text,
    date date, amount float4, category text, desc1 text )
    LOCATION ('gpfdist://etlhost-1:8081/*')
FORMAT 'TEXT' (DELIMITER '|');
```

### Example 2 — Run multiple gpfdist instances

Creates a readable external table, `ext_expenses`, using the gpfdist protocol from all files with the txt extension. The column delimiter is a pipe (`|`) and NULL (' ') is a space.

```sql
=# CREATE EXTERNAL TABLE ext_expenses ( name text, 
   date date,  amount float4, category text, desc1 text ) 
   LOCATION ('gpfdist://etlhost-1:8081/*.txt', 
             'gpfdist://etlhost-2:8081/*.txt')
   FORMAT 'TEXT' ( DELIMITER '|' NULL ' ') ;
```

<!-- ### Example 3 — Run multiple gpfdists instances

Creates a readable external table, `ext_expenses`, from all files with the txt extension using the gpfdists protocol. The column delimiter is a pipe (`|`) and NULL (' ') is a space.

1. Run gpfdist with the `--ssl` option.
2. Run the following SQL command to create an external table.

```sql
=# CREATE EXTERNAL TABLE ext_expenses ( name text, 
   date date,  amount float4, category text, desc1 text ) 
   LOCATION ('gpfdists://etlhost-1:8081/*.txt', 
             'gpfdists://etlhost-2:8082/*.txt')
   FORMAT 'TEXT' ( DELIMITER '|' NULL ' ');
``` -->

### Example 3 — Single gpfdist instance with error logging

Uses the gpfdist protocol to create a readable external table, `ext_expenses`, from all files with the txt extension. The column delimiter is a pipe (`|`) and NULL (' ') is a space.

Access to the external table is single row error isolation mode. Input data formatting errors are captured internally in Cloudberry Database with a description of the error. <!-- See Viewing Bad Rows in the Error Log for information about investigating error rows.--> You can view the errors, fix the issues, and then reload the rejected data. If the error count on a segment is greater than `5` (the `SEGMENT REJECT LIMIT` value), the entire external table operation fails and no rows are processed.

```sql
=# CREATE EXTERNAL TABLE ext_expenses ( name text, 
   date date, amount float4, category text, desc1 text ) 
   LOCATION ('gpfdist://etlhost-1:8081/*.txt', 
             'gpfdist://etlhost-2:8082/*.txt')
   FORMAT 'TEXT' ( DELIMITER '|' NULL ' ')
   LOG ERRORS SEGMENT REJECT LIMIT 5;
```

To create the readable `ext_expenses` table from CSV-formatted text files:

```sql
=# CREATE EXTERNAL TABLE ext_expenses ( name text, 
   date date,  amount float4, category text, desc1 text ) 
   LOCATION ('gpfdist://etlhost-1:8081/*.txt', 
             'gpfdist://etlhost-2:8082/*.txt')
   FORMAT 'CSV' ( DELIMITER ',' )
   LOG ERRORS SEGMENT REJECT LIMIT 5;
```

### Example 4 - Create a writable external table with gpfdist

Creates a writable external table,·`sales_out`, that uses gpfdist to write output data to the file `sales.out`. The column delimiter is a pipe (`|`) and NULL (`' '`) is a space. The file will be created in the directory specified when you started the gpfdist file server.

```sql
=# CREATE WRITABLE EXTERNAL TABLE sales_out (LIKE sales) 
   LOCATION ('gpfdist://etl1:8081/sales.out')
   FORMAT 'TEXT' ( DELIMITER '|' NULL ' ')
   DISTRIBUTED BY (txn_id);
```
