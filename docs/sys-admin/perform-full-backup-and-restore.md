---
title: Perform Full Backup and Restore
---

# Perform Full Backup and Restore

Cloudberry Database supports backing up and restoring the full database in parallel. Parallel operations scale regardless of the number of segments in your system, because segment hosts each write their data to local disk storage at the same time.

`gpbackup` and `gprestore` are Cloudberry Database command-line utilities that create and restore backup sets for Cloudberry Database. By default, `gpbackup` stores only the object metadata files and DDL files for a backup in the Cloudberry Database coordinator data directory. Cloudberry Database segments use the `COPY ... ON SEGMENT` command to store their data for backed-up tables in compressed CSV data files, located in each segment's backups directory.

The backup metadata files contain all of the information that `gprestore` needs to restore a full backup set in parallel. Each `gpbackup` task uses a single transaction in Cloudberry Database. During this transaction, metadata is backed up on the coordinator host, and data for each table on each segment host is written to CSV backup files using `COPY ... ON SEGMENT` commands in parallel. The backup process acquires an `ACCESS SHARE` lock on each table that is backed up.

## Install the `gpbackup` and `gprestore` utilities

Before installing the `gpbackup` and `gprestore` utilities, make sure that you have the [Golang](https://golang.org/doc/) (v1.11 or later) installed and that you have set the [Go `PATH` environment
variable](https://go.dev/doc/install).

1. Pull the `cloudberrydb/gpbackup` GitHub repository to the target machine.

    ```bash
    go install github.com/cloudberrydb/gpbackup@latest
    ```

    The repository is placed in `$GOPATH/pkg/mod/github.com/cloudberrydb/gpbackup`.

2. Enter the `cloudberrydb/gpbackup` directory. Then, build and install the source code:

    ```bash
    cd <$GOPATH/pkg/mod/github.com/cloudberrydb/gpbackup>
    make depend
    make build
    ```

    You might encounter the `fatal: Not a git repository (or any of the parent directories): .git` prompt after running `make depend`. Ignore this prompt, because this does not affect the building.

    The `build` target will put the `gpbackup` and `gprestore` binaries in `$HOME/go/bin`. This operation will also try to copy `gpbackup_helper` to the Cloudberry Database segments (by retrieving hostnames from `gp_segment_configuration`).

3. Check whether the build is successful by checking whether your `$HOME/go/bin` directory contains `gpback`, `gprestore`, and `gpbackup_helper`.

    ```bash
    ls $HOME/go/bin
    ```

4. Validate whether the installation is successful:

    ```bash
    gpbackup --version
    gprestore --version
    ```

## Back up the full database

To perform a complete backup of a database, as well as Cloudberry Database system metadata, use the command:

```bash
gpbackup --dbname <database_name>
```

For example:

```bash
$ gpbackup --dbname test_04

20240108:17:17:18 gpbackup:gpadmin:cbdb-coordinator:001945-[INFO]:-gpbackup version = 1.2.7-beta1+dev.7
20240108:17:17:18 gpbackup:gpadmin:cbdb-coordinator:001945-[INFO]:-Greenplum Database Version = oudberry Database 1.0.0 build 5551471267
20240108:17:17:18 gpbackup:gpadmin:cbdb-coordinator:001945-[INFO]:-Starting backup of database test_04
20240108:17:17:18 gpbackup:gpadmin:cbdb-coordinator:001945-[INFO]:-Backup Timestamp = 20240108171718
20240108:17:17:18 gpbackup:gpadmin:cbdb-coordinator:001945-[INFO]:-Backup Database = test_04
20240108:17:17:18 gpbackup:gpadmin:cbdb-coordinator:001945-[INFO]:-Gathering table state information
20240108:17:17:18 gpbackup:gpadmin:cbdb-coordinator:001945-[INFO]:-Acquiring ACCESS SHARE locks on tables
20240108:17:17:18 gpbackup:gpadmin:cbdb-coordinator:001945-[INFO]:-Gathering additional table metadata
20240108:17:17:18 gpbackup:gpadmin:cbdb-coordinator:001945-[INFO]:-Getting storage information
20240108:17:17:18 gpbackup:gpadmin:cbdb-coordinator:001945-[WARNING]:-No tables in backup set contain data. Performing metadata-only backup instead.
20240108:17:17:18 gpbackup:gpadmin:cbdb-coordinator:001945-[INFO]:-Metadata will be written to /data0/coordinator/gpseg-1/backups/20240108/20240108171718/gpbackup_20240108171718_metadata.sql
20240108:17:17:18 gpbackup:gpadmin:cbdb-coordinator:001945-[INFO]:-Writing global database metadata
20240108:17:17:18 gpbackup:gpadmin:cbdb-coordinator:001945-[INFO]:-Global database metadata backup complete
20240108:17:17:18 gpbackup:gpadmin:cbdb-coordinator:001945-[INFO]:-Writing pre-data metadata
20240108:17:17:18 gpbackup:gpadmin:cbdb-coordinator:001945-[INFO]:-Pre-data metadata metadata backup complete
20240108:17:17:18 gpbackup:gpadmin:cbdb-coordinator:001945-[INFO]:-Writing post-data metadata
20240108:17:17:18 gpbackup:gpadmin:cbdb-coordinator:001945-[INFO]:-Post-data metadata backup complete
20240108:17:17:19 gpbackup:gpadmin:cbdb-coordinator:001945-[INFO]:-Found neither /usr/local/cloudberry-db-1.0.0/bin/gp_email_contacts.yaml nor /home/gpadmin//gp_email_contacts.yaml
20240108:17:17:19 gpbackup:gpadmin:cbdb-coordinator:001945-[INFO]:-Email containing gpbackup report /data0/coordinator/gpseg-1/backups/20240108/20240108171718/gpbackup_20240108171718_report will not be sent
20240108:17:17:19 gpbackup:gpadmin:cbdb-coordinator:001945-[INFO]:-Backup completed successfully
```

The above command creates a file that contains global and database-specific metadata on the Cloudberry Database coordinator host in the default directory, `$COORDINATOR_DATA_DIRECTORY/backups/<YYYYMMDD>/<YYYYMMDDHHMMSS>/`. For example:

```bash
ls $COORDINATOR_DATA_DIRECTORY/backups/20240108/20240108171718

gpbackup_20240108171718_config.yaml   gpbackup_20240108171718_report
gpbackup_20240108171718_metadata.sql  gpbackup_20240108171718_toc.yaml
```

By default, each segment stores each table's data for the backup in a separate compressed CSV file in `<seg_dir>/backups/<YYYYMMDD>/<YYYYMMDDHHMMSS>/`. For example:

```bash
ls /data1/primary/gpseg1/backups/20240108/20240108171718/

gpbackup_0_20240108171718_17166.gz  gpbackup_0_20240108171718_26303.gz
gpbackup_0_20240108171718_21816.gz
```

To consolidate all backup files into a single directory, include the `--backup-dir` option. Note that you need to specify an absolute path with this option:

```bash
$ gpbackup --dbname test_04 --backup-dir /home/gpadmin/backups

20240108:17:34:10 gpbackup:gpadmin:cbdb-coordinator:003348-[INFO]:-gpbackup version = 1.2.7-beta1+dev.7
20240108:17:34:10 gpbackup:gpadmin:cbdb-coordinator:003348-[INFO]:-Greenplum Database Version = oudberry Database 1.0.0 build 5551471267
...
20240108:17:34:12 gpbackup:gpadmin:cbdb-coordinator:003348-[INFO]:-Backup completed successfully

$ find /home/gpadmin/backups/ -type f

/home/gpadmin/backups/gpseg0/backups/20240108/20240108173410/gpbackup_0_20240108173410_16593.gz
/home/gpadmin/backups/gpseg-1/backups/20240108/20240108173410/gpbackup_20240108173410_config.yaml
/home/gpadmin/backups/gpseg-1/backups/20240108/20240108173410/gpbackup_20240108173410_report
/home/gpadmin/backups/gpseg-1/backups/20240108/20240108173410/gpbackup_20240108173410_toc.yaml
/home/gpadmin/backups/gpseg-1/backups/20240108/20240108173410/gpbackup_20240108173410_metadata.sql
/home/gpadmin/backups/gpseg1/backups/20240108/20240108173410/gpbackup_1_20240108173410_16593.gz
```

When performing a backup operation, you can use the `--single-data-file` in situations where the additional overhead of multiple files might be prohibitive. For example, if you use a third party storage solution such as Data Domain with backups.

:::tip
Backing up a materialized view does not back up the materialized view data. Only the materialized view definition is backed up.
:::

## Restore the full database

To use `gprestore` to restore from a backup set, you must use the `--timestamp` option to specify the exact timestamp value (`YYYYMMDDHHMMSS`) to restore. Include the `--create-db` option if the database does not exist in the cluster. For example:

```bash
$ dropdb demo
$ gprestore --timestamp 20240108171718 --create-db

20240108:17:42:26 gprestore:gpadmin:cbdb-coordinator:004115-[INFO]:-Restore Key = 20240108171718
20240108:17:42:26 gprestore:gpadmin:cbdb-coordinator:004115-[INFO]:-gpbackup version = 1.2.7-beta1+dev.7
20240108:17:42:26 gprestore:gpadmin:cbdb-coordinator:004115-[INFO]:-gprestore version = 1.2.7-beta1+dev.7
20240108:17:42:26 gprestore:gpadmin:cbdb-coordinator:004115-[INFO]:-Greenplum Database Version = oudberry Database 1.0.0 build 5551471267
20240108:17:42:26 gprestore:gpadmin:cbdb-coordinator:004115-[INFO]:-Creating database
20240108:17:42:26 gprestore:gpadmin:cbdb-coordinator:004115-[INFO]:-Database creation complete for: test_04
20240108:17:42:26 gprestore:gpadmin:cbdb-coordinator:004115-[INFO]:-Restoring pre-data metadata
Pre-data objects restored:  3 / 3 [=================================] 100.00% 0s
20240108:17:42:26 gprestore:gpadmin:cbdb-coordinator:004115-[INFO]:-Pre-data metadata restore complete
20240108:17:42:26 gprestore:gpadmin:cbdb-coordinator:004115-[INFO]:-Restoring post-data metadata
20240108:17:42:26 gprestore:gpadmin:cbdb-coordinator:004115-[INFO]:-Post-data metadata restore complete
20240108:17:42:26 gprestore:gpadmin:cbdb-coordinator:004115-[INFO]:-Found neither /usr/local/cloudberry-db-1.0.0/bin/gp_email_contacts.yaml nor /home/gpadmin//gp_email_contacts.yaml
20240108:17:42:26 gprestore:gpadmin:cbdb-coordinator:004115-[INFO]:-Email containing gprestore report /data0/coordinator/gpseg-1/backups/20240108/20240108171718/gprestore_20240108171718_20240108174226_report will not be sent
20240108:17:42:26 gprestore:gpadmin:cbdb-coordinator:004115-[INFO]:-Restore completed successfully
```

If you specified a custom `--backup-dir` to consolidate the backup files, include the same `--backup-dir` option when using `gprestore` to locate the backup files:

```bash
$ dropdb test_04
$ gprestore --backup-dir /home/gpadmin/backups/ --timestamp 20240109102646 --create-db

20240109:10:33:17 gprestore:gpadmin:cbdb-coordinator:017112-[INFO]:-Restore Key = 20240109102646
...
20240109:10:33:17 gprestore:gpadmin:cbdb-coordinator:017112-[INFO]:-Restore completed successfully
```

`gprestore` does not attempt to restore global metadata for the Cloudberry Database system by default. If this is required, include the `--with-globals` argument.

By default, `gprestore` uses 1 connection to restore table data and metadata. If you have a large backup set, you can improve performance of the restore by increasing the number of parallel connections with the `--jobs` option. For example:

```bash
$ gprestore --backup-dir /home/gpadmin/backups/ --timestamp 20240109102646 --create-db --jobs 4
```

Test the number of parallel connections with your backup set to determine the ideal number for fast recovery.

:::tip
You cannot perform a parallel restore operation with `gprestore` if the backup combines table backups into a single file per segment with the gpbackup option `--single-data-file`.
:::

Restoring a materialized view does not restore materialized view data. Only the materialized view definition is restored. To populate the materialized view with data, use `REFRESH MATERIALIZED VIEW`. When you refresh the materialized view, the tables that are referenced by the materialized view definition must be available. The `gprestore` log file lists the materialized views that have been restored and the `REFRESH MATERIALIZED VIEW` commands that are used to populate the materialized views with data.

## Filter the contents of a backup or restore

### Filter by schema

`gpbackup` backs up all schemas and tables in the specified database, unless you exclude or include individual schema or table objects with schema level or table level filter options.

The schema level options are `--include-schema`, `--include-schema-file`, or `--exclude-schema`, `--exclude-schema-file` command-line options to gpbackup. For example, if the `test_04` database includes only 2 schemas, `schema1` and `schema2`, both of the following commands back up only the `schema1` schema:

```bash
$ gpbackup --dbname test_04 --include-schema schema1
$ gpbackup --dbname test_04 --exclude-schema schema2
```

You can include multiple `--include-schema` options in a `gpbackup` or multiple `--exclude-schema` options. For example:

```bash
$ gpbackup --dbname test_04 --include-schema schema1 --include-schema schema2
```

If you have a large number of schemas, you can list the schemas in a text file and specify the file with the `--include-schema-file` or `--exclude-schema-file` options in a `gpbackup` command. Each line in the file must define a single schema, and the file cannot contain trailing lines. For example, this command uses a file in the `gpadmin` home directory to include a set of schemas.

```bash
$ gpbackup --dbname test_04 --include-schema-file /home/gpadmin/backup-schemas.txt --backup-dir /home/gpadmin/backups
```

### Filter by table

To filter the individual tables that are included in a backup set, or excluded from a backup set, specify individual tables with the `--include-table` option or the `--exclude-table` option. The table must be schema qualified, `<schema-name>.<table-name>`. The individual table filtering options can be specified multiple times. However, `--include-table` and `--exclude-table` cannot both be used in the same command.

:::tip
If you have used the `--include-table` option in a `gpbackup` command, the database, schema, and the sequence related to the target table you specified are not backed up. Before you restore the backup set, you must create the database, schema, and sequence manually.

For example, if you have used `gpbackup --dbname test_04 --include-table schema1.table1 --backup-dir /home/gpadmin/backups` to back up the `test_04` database, you must create the `test_04` database, `schema1` schema, and `schema1.table1_id_seq` sequence manually before you restore the backup set. Otherwise, the restore operation fails with the error message indicating that the database, schema, or sequence does not exist.
:::

If a table or schema name uses any character other than a lowercase letter, number, or an underscore character, then you must include that name in double quotes. For example:

```bash
gpbackup --dbname test1 --include-table "schema1"."ComplexName Table" --backup-dir /home/gpadmin/backups
```

You can create a list of qualified table names in a text file. When listing tables in a file, each line in the text file must define a single table using the format `<schema-name>.<table-name>`. The file must not include trailing lines or double quotes even if table or schema name uses any character other than a lowercase letter, number, or an underscore character. For example:

```
schema1.table1
schema2.table2
schema1.ComplexName Table
```

After creating the file, you can use it either to include or exclude tables with the gpbackup options `--include-table-file` or `--exclude-table-file`. For example:

```bash
$ gpbackup --dbname test_04 --include-table-file /home/gpadmin/table-list.txt
```

You can combine `--include schema` with `--exclude-table` or `--exclude-table-file` for a backup. The following example uses `--include-schema` with `--exclude-table` to back up a schema except for a single table.

```bash
$ gpbackup --dbname test_04 --include-schema schema1 --exclude-table schema2.table2
```

You cannot combine `--include-schema` with `--include-table` or `--include-table-file`, and you cannot combine `--exclude-schema` with any table filtering option such as `--exclude-table` or `--include-table`.

When you use `--include-table` or `--include-table-file` dependent objects are not automatically backed up or restored, you must explicitly specify the dependent objects that are required. For example, if you back up or restore a view or materialized view, you must also specify the tables that the view or the materialized view uses. If you backup or restore a table that uses a sequence, you must also specify the sequence.

### Filter with `gprestore`

After creating a backup set with `gpbackup`, you can filter the schemas and tables that you want to restore from the backup set using the `gprestore --include-schema` and `--include-table-file` options. These options work in the same way as their `gpbackup` counterparts, but have the following restrictions:

- The tables that you attempt to restore must not already exist in the database.
- If you attempt to restore a schema or table that does not exist in the backup set, the `gprestore` does not execute.
- If you use the `--include-schema` option, `gprestore` cannot restore objects that have dependencies on multiple schemas.
- If you use the `--include-table-file` option, `gprestore` does not create roles or set the owner of the tables. The utility restores table indexes and rules. Triggers are also restored but are not supported in Cloudberry Database.
- The file that you specify with `--include-table-file` cannot include a leaf partition name, as it can when you specify this option with `gpbackup`. If you specified leaf partitions in the backup set, specify the partitioned table to restore the leaf partition data.

    When restoring a backup set that contains data from some leaf partitions of a partitioned table, the partitioned table is restored along with the data for the leaf partitions. For example, you create a backup with the `gpbackup` option `--include-table-file` and the text file lists some leaf partitions of a partitioned table. Restoring the backup creates the partitioned table and restores the data only for the leaf partitions listed in the file.

### Filter by leaf partition

By default, `gpbackup` creates one file for each table on a segment. You can specify the `--leaf-partition-data` option to create one data file per leaf partition of a partitioned table, instead of a single file. You can also filter backups to specific leaf partitions by listing the leaf partition names in a text file to include. For example, consider a table that was created using the statement:

```sql
CREATE TABLE sales (id int, date date, amt decimal(10,2))
DISTRIBUTED BY (id)
PARTITION BY RANGE (date)
( PARTITION Jan23 START (date '2023-01-01') INCLUSIVE ,
  PARTITION Feb23 START (date '2023-02-01') INCLUSIVE ,
  PARTITION Mar23 START (date '2023-03-01') INCLUSIVE ,
  PARTITION Apr23 START (date '2023-04-01') INCLUSIVE ,
  PARTITION May23 START (date '2023-05-01') INCLUSIVE ,
  PARTITION Jun23 START (date '2023-06-01') INCLUSIVE ,
  PARTITION Jul23 START (date '2023-07-01') INCLUSIVE ,
  PARTITION Aug23 START (date '2023-08-01') INCLUSIVE ,
  PARTITION Sep23 START (date '2023-09-01') INCLUSIVE ,
  PARTITION Oct23 START (date '2023-10-01') INCLUSIVE ,
  PARTITION Nov23 START (date '2023-11-01') INCLUSIVE ,
  PARTITION Dec23 START (date '2023-12-01') INCLUSIVE
  END (date '2024-01-01') EXCLUSIVE );

NOTICE:  CREATE TABLE will create partition "sales_1_prt_jan23" for table "sales"
NOTICE:  CREATE TABLE will create partition "sales_1_prt_feb23" for table "sales"
NOTICE:  CREATE TABLE will create partition "sales_1_prt_mar23" for table "sales"
NOTICE:  CREATE TABLE will create partition "sales_1_prt_apr23" for table "sales"
NOTICE:  CREATE TABLE will create partition "sales_1_prt_may23" for table "sales"
NOTICE:  CREATE TABLE will create partition "sales_1_prt_jun23" for table "sales"
NOTICE:  CREATE TABLE will create partition "sales_1_prt_jul23" for table "sales"
NOTICE:  CREATE TABLE will create partition "sales_1_prt_aug23" for table "sales"
NOTICE:  CREATE TABLE will create partition "sales_1_prt_sep23" for table "sales"
NOTICE:  CREATE TABLE will create partition "sales_1_prt_oct23" for table "sales"
NOTICE:  CREATE TABLE will create partition "sales_1_prt_nov23" for table "sales"
NOTICE:  CREATE TABLE will create partition "sales_1_prt_dec23" for table "sales"
CREATE TABLE
```

To back up only data for the last quarter of the year, first create a text file that lists those leaf partition names instead of the full table name:

```
public.sales_1_prt_oct23
public.sales_1_prt_nov23
public.sales_1_prt_dec23
```

Then specify the file with the `--include-table-file` option to generate one data file per leaf partition:

```bash
$ gpbackup --dbname test_04 --include-table-file last-quarter.txt --leaf-partition-data
```

When you specify `--leaf-partition-data`, `gpbackup` generates one data file per leaf partition when backing up a partitioned table. For example, this command generates one data file for each leaf partition:

```bash
$ gpbackup --dbname test_04 --include-table public.sales --leaf-partition-data
```

When leaf partitions are backed up, the leaf partition data is backed up along with the metadata for the entire partitioned table.

## Check report files

When performing a backup or restore operation, `gpbackup` and `gprestore` generate a report file that contains the detailed information of the operations. When email notification is configured, the email sent contains the contents of the report file. For information about email notification, see [Configure email notifications](#configure-email-notifications).

The report file is placed in the Cloudberry Database coordinator backup directory. The report file name contains the timestamp of the operation. Thes following are the formats of the `gpbackup` and `gprestore` report file names.

```
gpbackup_<backup_timestamp>_report
gprestore_<backup_timestamp>_<restore_timesamp>_report
```

For these example report file names, `20240109111719` is the timestamp of the backup and `20240109112545` is the timestamp of the restore operation.

```
gpbackup_20240109111719_report
gprestore_20240109111719_20240109112545_report
```

This backup directory on a Cloudberry Database coordinator host contains both a `gpbackup` and `gprestore` report file.

```bash
$ ls -l /data0/coordinator/gpseg-1/backups/20240109/20240109111719/
total 24

-r--r--r-- 1 gpadmin gpadmin  715 Jan  9 11:17 gpbackup_20240109111719_config.yaml
-r--r--r-- 1 gpadmin gpadmin  895 Jan  9 11:17 gpbackup_20240109111719_metadata.sql
-r--r--r-- 1 gpadmin gpadmin 1441 Jan  9 11:17 gpbackup_20240109111719_report
-r--r--r-- 1 gpadmin gpadmin 1226 Jan  9 11:17 gpbackup_20240109111719_toc.yaml
-r--r--r-- 1 gpadmin gpadmin  569 Jan  9 11:21 gprestore_20240109111719_20240109112128_report
-r--r--r-- 1 gpadmin gpadmin  514 Jan  9 11:25 gprestore_20240109111719_20240109112545_report
```

The contents of the report files are similar. This is an example of the contents of a `gprestore` report file.

```
Greenplum Database Restore Report

timestamp key:           20240109111719
gpdb version:            oudberry Database 1.0.0 build 5551471267
gprestore version:       1.2.7-beta1+dev.7

database name:           test_04
command line:            gprestore --timestamp 20240109111719 --create-db

backup segment count:    2
restore segment count:   2
start time:              Tue Jan 09 2024 11:25:45
end time:                Tue Jan 09 2024 11:25:46
duration:                0:00:01

restore status:          Success
```

## Configure email notifications

`gpbackup` and `gprestore` can send email notifications after a back up or restore operation completes.

To have `gpbackup` or `gprestore` send out status email notifications, you need place a file named `gp_email_contacts.yaml` in the home directory of the user running `gpbackup` or `gprestore` in the same directory as the utilities (`$GPHOME/bin`). A utility issues a message if it cannot locate a `gp_email_contacts.yaml` file in either location. If both locations contain a `.yaml` file, the utility uses the file in user `$HOME`.

The email subject line includes the utility name, timestamp, job status (Success or Failure), and the name of the Greenplum Database host `gpbackup` or `gprestore` is called from. These are example subject lines for `gpbackup` emails.

```shell
gpbackup 20180202133601 on gp-master completed: Success
```

or

```shell
gpbackup 20200925140738 on mdw completed: Failure
```

The email contains summary information about the operation including options, duration, and number of objects backed up or restored. For information about the contents of a notification email, see Report Files.

:::tip
The UNIX mail utility must be running on the Cloudberry Database host and must be configured to allow the Cloudberry Database superuser (`gpadmin`) to send email. Also ensure that the mail program executable is locatable via the `gpadmin` user's `$PATH`.
:::

### gpbackup and gprestore email file format

The `gpbackup` and `gprestore` email notification YAML file `gp_email_contacts.yaml` uses indentation (spaces) to determine the document hierarchy and the relationships of the sections to one another. The use of white space is significant. White space should not be used simply for formatting purposes, and tabs should not be used at all.

If the status parameters are not specified correctly, the utility does not issue a warning. For example, if the success parameter is misspelled and is set to true, a warning is not issued and an email is not sent to the email address after a successful operation. To ensure email notification is configured correctly, run tests with email notifications configured.

This is the format of the `gp_email_contacts.yaml` YAML file for gpbackup email notifications:

```yaml
contacts:
  gpbackup:
  - address: <user>@<domain>
    status:
         success: [true | false]
         success_with_errors: [true | false]
         failure: [true | false]
  gprestore:
  - address: <user>@<domain>
    status:
         success: [true | false]
         success_with_errors: [true | false]
         failure: [true | false]
```

### Email YAML file sections

**`contacts`**

Required. The section that contains the gpbackup and gprestore sections. The YAML file can contain a gpbackup section, a gprestore section, or one of each.

**`gpbackup`**

Optional. Begins the gpbackup email section.

**`address`**

Required. At least one email address must be specified. Multiple email address parameters can be specified. Each address requires a status section. `user@domain` is a single, valid email address.

**`status`**

Required. Specify when the utility sends an email to the specified email address. The default is to not send email notification. You specify sending email notifications based on the completion status of a backup or restore operation. At least one of these parameters must be specified and each parameter can appear at most once.

**`success`**

Optional. Specify whether an email is sent if the operation completes without errors. If the value is `true`, an email is sent if the operation completes without errors. If the value is `false` (the default), an email is not sent.

**`success_with_errors`**

Optional. Specify whether an email is sent if the operation completes with errors. If the value is `true`, an email is sent if the operation completes with errors. If the value is `false` (the default), an email is not sent.

**`failure`**

Optional. Specify if an email is sent if the operation fails. If the value is `true`, an email is sent if the operation fails. If the value is `false` (the default), an email is not sent.

**`gprestore`**

Optional. Begins the gprestore email section. This section contains the address and status parameters that are used to send an email notification after a gprestore operation. The syntax is the same as the gpbackup section.

### Email examples

This example YAML file specifies sending email to email addresses depending on the success or failure of an operation. For a backup operation, an email is sent to a different address depending on the success or failure of the backup operation. For a restore operation, an email is sent to `gpadmin@example.com` only when the operation succeeds or completes with errors.

```yaml
contacts:
  gpbackup:
  - address: gpadmin@example.com
    status:
      success: true
      success_with_errors: true
      failure: true  
  gprestore:
  - address: gpadmin@example.com
    status:
      success: true
      success_with_errors: true
      failure: true
```
