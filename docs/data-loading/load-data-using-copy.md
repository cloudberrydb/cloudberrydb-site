---
title: Load Data Using COPY
---

# Load Data into Cloudberry Database Using `COPY`

`COPY FROM` copies data from a file or standard input in a local file system into a table and appends the data to the table contents. `COPY` is non-parallel: data is loaded in a single process using the Cloudberry Database coordinator instance. Using `COPY` is only recommended for very small data files.

The `COPY` source file must be accessible to the `postgres` process on the coordinator host. Specify the `COPY` source file name relative to the data directory on the coordinator host, or specify an absolute path.

Cloudberry Database copies data from `STDIN` or `STDOUT` using the connection between the client and the coordinator server.

## Load from a file 

The `COPY` command requests the `postgres` backend to open the specified file, to read it and append it to the target table. To be able to read the file, the backend needs to have read permissions on the file, and you need to specify the file name using an absolute path on the coordinator host, or using a relative path to the coordinator data directory.

```sql
COPY <table_name> FROM </path/to/filename>;
```

## Load from STDIN

To avoid the problem of copying the data file to the coordinator host before loading the data, `COPY FROM STDIN` uses the Standard Input channel and feeds data directly into the `postgres` backend. After the `COPY FROM STDIN` command starts, the backend will accept lines of data until a single line only contains a backslash-period (`\.`).

```sql
COPY <table_name> FROM <STDIN>;
```

## Load data using `\copy` in psql

Do not confuse the psql `\copy` command with the `COPY` SQL command. The `\copy` invokes a regular `COPY FROM STDIN` and sends the data from the psql client to the backend. Therefore, any file must locate on the host where the psql client runs, and must be accessible to the user which runs the client.

To avoid the problem of copying the data file to the coordinator host before loading the data, `COPY FROM STDIN` uses the Standard Input channel and feeds data directly into the `postgres` backend. After the `COPY FROM STDIN` command started, the backend will accept lines of data until a single line only contains a backslash-period (`\.`). psql is wrapping all of this into the handy `\copy` command.

```sql
\copy <table_name> FROM <filename>;
```

## Input format

`COPY FROM` accepts a `FORMAT` parameter, which specifies the format of the input data. The possible values are `TEXT`, `CSV` (Comma Separated Values), and `BINARY`.

```sql
COPY <table_name> FROM </path/to/filename> WITH (FORMAT csv);
```

The `FORMAT csv` will read comma-separated values. The `FORMAT text` by default uses tabulators to separate the values, the `DELIMITER` option specifies a different character as value delimiter.

```sql
COPY <table_name> FROM </path/to/filename> WITH (FORMAT text, DELIMITER '|');
```

By default, the default client encoding is used, and you can change this using the `ENCODING` option. This is useful if data is coming from another operating system.

```sql
COPY <table_name> FROM </path/to/filename> WITH (ENCODING 'latin1');
```
