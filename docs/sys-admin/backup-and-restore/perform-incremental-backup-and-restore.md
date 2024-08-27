---
title: Perform Incremental Backup and Restore
---

# Perform Incremental Backup and Restore

Before reading this document, you are expected to first read the [Perform Full Backup and Restore](/docs/sys-admin/perform-full-backup-and-restore.md) document.

To back up and restore tables incrementally, use the `gpbackup` and `gprestore` utilities. Incremental backups include all specified heap tables, and append-optimized tables (including column-oriented ones) that have changed. Even a single row change triggers a backup of the entire append-optimized table. For partitioned append-optimized tables, only the modified leaf partitions are backed up.

Incremental backups are efficient when the total amount of data in append-optimized tables or table partitions that changed is small compared to the data that has not changed since the last backup.

An incremental backup backs up an append-optimized table only if one of the following operations have been performed on the table after the last full or incremental backup:

- `ALTER TABLE`
- `DELETE`
- `INSERT`
- `TRUNCATE`
- `UPDATE`
- `DROP` and then re-create the table

To restore data from incremental backups, you need a complete incremental backup set.

## About incremental backup sets

An incremental backup set includes the following backups:

- A full backup. This is the full backup that the incremental backups are based on.
- The set of incremental backups that capture the changes to the database from the time of the full backup.

For example, you can create a full backup and then create 3 daily incremental backups. The full backup and all 3 incremental backups are the backup set. For information about using an incremental backup set, see [Example using incremental backup sets](#example-using-incremental-backup-sets).

When you create or add to an incremental backup set, `gpbackup` ensures that the backups in the set are created with a consistent set of backup options to ensure that the backup set can be used in a restore operation. For information about backup set consistency, see [Use incremental backups](#use-incremental-backups).

When you create an incremental backup you include these options with the other `gpbackup` options to create a backup:

- `--leaf-partition-data`: required for all backups in the incremental backup set.

    - Required when you create a full backup that will be the base backup for an incremental backup set.
    - Required when you create an incremental backup.

- `--incremental`: required when you create an incremental backup.

    You cannot combine `--data-only` or `--metadata-only` with `--incremental`.

- `--from-timestamp`: optional. This option can be used with `--incremental`. The timestamp you specify is an existing backup. The timestamp can be either a full backup or incremental backup. The backup being created must be compatible with the backup specified with the `--from-timestamp` option.

## Use incremental backups

When you add an incremental backup to a backup set, `gpbackup` ensures that the full backup and the incremental backups are consistent by checking these `gpbackup` options:

- `--dbname`: the database must be the same.
- `--backup-dir`: the directory must be the same. The backup set, the full backup and the incremental backups, must be in the same location.
- `--single-data-file`: this option must be either specified or absent for all backups in the set.
- `--include-table-file`, `--include-schema`, or any other options that filter tables and schemas must be the same. When checking schema filters, only the schema names are checked, not the objects contained in the schemas.
- `--no-compression`: if this option is specified, it must be specified for all backups in the backup set.

    If compression is used on the on the full backup, compression must be used on the incremental backups. Different compression levels are allowed for the backups in the backup set. For a backup, the default is compression level 1.

If you try to add an incremental backup to a backup set, the backup operation fails if the `gpbackup` options are not consistent.

### Example using incremental backup sets

Each backup has a timestamp taken when the backup is created. For example, if you create a backup on May 14, 2023, the backup file names contain `20230514hhmmss`. The `hhmmss` represents the time: hour, minute, and second.

This example assumes that you have created two full backups and incremental backups of the database `mytest`. To create the full backups, you used this command:

```shell
gpbackup --dbname mytest --backup-dir /mybackup --leaf-partition-data
```

You created incremental backups with this command:

```shell
gpbackup --dbname mytest --backup-dir /mybackup --leaf-partition-data --incremental
```

When you specify the `--backup-dir` option, the backups are created in the `/mybackup` directory on each Cloudberry Database host.

In the example, the full backups have the timestamp keys `20230514054532` and `20231114064330`. The other backups are incremental backups. The example consists of two backup sets, the first with two incremental backups, and second with one incremental backup. The backups are listed from earliest to most recent.

- `20230514054532` (full backup)
- `20230714095512`
- `20230914081205`
- `20231114064330` (full backup)
- `20230114051246`

To create a new incremental backup based on the latest incremental backup, you must include the same `--backup-dir` option as the incremental backup as well as the options `--leaf-partition-data` and `--incremental`.

```shell
gpbackup --dbname mytest --backup-dir /mybackup --leaf-partition-data --incremental
```

You can specify the `--from-timestamp` option to create an incremental backup based on an existing incremental or full backup. Based on the example, this command adds a fourth incremental backup to the backup set that includes `20230914081205` as an incremental backup and uses `20230514054532` as the full backup.

```shell
gpbackup --dbname mytest --backup-dir /mybackup --leaf-partition-data --incremental --from-timestamp 20230914081205
```

This command creates an incremental backup set based on the full backup `20231114064330` and is separate from the backup set that includes the incremental backup `20230114051246`.

```shell
gpbackup --dbname mytest --backup-dir /mybackup --leaf-partition-data --incremental --from-timestamp 20231114064330
```

To restore a database with the incremental backup `20230914081205`, you need the incremental backups `20120914081205` and `20230714095512`, and the full backup `20230514054532`. This would be the `gprestore` command.

```shell
gprestore --backup-dir /backupdir --timestamp 20230914081205
```

### Create an incremental backup with `gpbackup`

The `gpbackup` output displays the timestamp of the backup on which the incremental backup is based. In this example, the incremental backup is based on the backup with timestamp `20230802171642`. The backup `20230802171642` can be an incremental or full backup.

```shell
$ gpbackup --dbname test --backup-dir /backups --leaf-partition-data --incremental

20230803:15:40:51 gpbackup:gpadmin:mdw:002907-[INFO]:-Starting backup of database test
20230803:15:40:52 gpbackup:gpadmin:mdw:002907-[INFO]:-Backup Timestamp = 20230803154051
20230803:15:40:52 gpbackup:gpadmin:mdw:002907-[INFO]:-Backup Database = test
20230803:15:40:52 gpbackup:gpadmin:mdw:002907-[INFO]:-Gathering list of tables for backup
20230803:15:40:52 gpbackup:gpadmin:mdw:002907-[INFO]:-Acquiring ACCESS SHARE locks on tables
Locks acquired:  5 / 5 [================================================================] 100.00% 0s
20230803:15:40:52 gpbackup:gpadmin:mdw:002907-[INFO]:-Gathering additional table metadata
20230803:15:40:52 gpbackup:gpadmin:mdw:002907-[INFO]:-Metadata will be written to /backups/gpseg-1/backups/20230803/20230803154051/gpbackup_20230803154051_metadata.sql
20230803:15:40:52 gpbackup:gpadmin:mdw:002907-[INFO]:-Writing global database metadata
20230803:15:40:52 gpbackup:gpadmin:mdw:002907-[INFO]:-Global database metadata backup complete
20230803:15:40:52 gpbackup:gpadmin:mdw:002907-[INFO]:-Writing pre-data metadata
20230803:15:40:52 gpbackup:gpadmin:mdw:002907-[INFO]:-Pre-data metadata backup complete
20230803:15:40:52 gpbackup:gpadmin:mdw:002907-[INFO]:-Writing post-data metadata
20230803:15:40:52 gpbackup:gpadmin:mdw:002907-[INFO]:-Post-data metadata backup complete
20230803:15:40:52 gpbackup:gpadmin:mdw:002907-[INFO]:-Basing incremental backup off of backup with timestamp = 20230802171642
20230803:15:40:52 gpbackup:gpadmin:mdw:002907-[INFO]:-Writing data to file
Tables backed up:  4 / 4 [==============================================================] 100.00% 0s
20230803:15:40:52 gpbackup:gpadmin:mdw:002907-[INFO]:-Data backup complete
20230803:15:40:53 gpbackup:gpadmin:mdw:002907-[INFO]:-Found neither /usr/local/greenplum-db/./bin/gp_email_contacts.yaml nor /home/gpadmin/gp_email_contacts.yaml
20230803:15:40:53 gpbackup:gpadmin:mdw:002907-[INFO]:-Email containing gpbackup report /backups/gpseg-1/backups/20230803/20230803154051/gpbackup_20230803154051_report will not be sent
20230803:15:40:53 gpbackup:gpadmin:mdw:002907-[INFO]:-Backup completed successfully
```

### Restore from an incremental backup with `gprestore`

When restoring an from an incremental backup, you can specify the `--verbose` option to display the backups that are used in the restore operation on the command line. For example, the following `gprestore` command restores a backup using the timestamp `20230807092740`, an incremental backup. The output includes the backups that were used to restore the database data.

```shell
$ gprestore --create-db --timestamp 20230807162904 --verbose
...
20230807:16:31:56 gprestore:gpadmin:mdw:008603-[INFO]:-Pre-data metadata restore complete
20230807:16:31:56 gprestore:gpadmin:mdw:008603-[DEBUG]:-Verifying backup file count
20230807:16:31:56 gprestore:gpadmin:mdw:008603-[DEBUG]:-Restoring data from backup with timestamp: 20230807162654
20230807:16:31:56 gprestore:gpadmin:mdw:008603-[DEBUG]:-Reading data for table public.tbl_ao from file (table 1 of 1)
20230807:16:31:56 gprestore:gpadmin:mdw:008603-[DEBUG]:-Checking whether segment agents had errors during restore
20230807:16:31:56 gprestore:gpadmin:mdw:008603-[DEBUG]:-Restoring data from backup with timestamp: 20230807162819
20230807:16:31:56 gprestore:gpadmin:mdw:008603-[DEBUG]:-Reading data for table public.test_ao from file (table 1 of 1)
20230807:16:31:56 gprestore:gpadmin:mdw:008603-[DEBUG]:-Checking whether segment agents had errors during restore
20230807:16:31:56 gprestore:gpadmin:mdw:008603-[DEBUG]:-Restoring data from backup with timestamp: 20230807162904
20230807:16:31:56 gprestore:gpadmin:mdw:008603-[DEBUG]:-Reading data for table public.homes2 from file (table 1 of 4)
20230807:16:31:56 gprestore:gpadmin:mdw:008603-[DEBUG]:-Reading data for table public.test2 from file (table 2 of 4)
20230807:16:31:56 gprestore:gpadmin:mdw:008603-[DEBUG]:-Reading data for table public.homes2a from file (table 3 of 4)
20230807:16:31:56 gprestore:gpadmin:mdw:008603-[DEBUG]:-Reading data for table public.test2a from file (table 4 of 4)
20230807:16:31:56 gprestore:gpadmin:mdw:008603-[DEBUG]:-Checking whether segment agents had errors during restore
20230807:16:31:57 gprestore:gpadmin:mdw:008603-[INFO]:-Data restore complete
20230807:16:31:57 gprestore:gpadmin:mdw:008603-[INFO]:-Restoring post-data metadata
20230807:16:31:57 gprestore:gpadmin:mdw:008603-[INFO]:-Post-data metadata restore complete
...
```

The output shows that the restore operation used three backups.

When restoring an from an incremental backup, `gprestore` also lists the backups that are used in the restore operation in the `gprestore` log file.

During the restore operation, `gprestore` displays an error if the full backup or other required incremental backup is not available.

## Incremental backup notes

To create an incremental backup, or to restore data from an incremental backup set, you need the complete backup set. When you archive incremental backups, the complete backup set must be archived. You must archive all the files created on the coordinator and all segments.

If you do not specify the `--from-timestamp` option when you create an incremental backup, `gpbackup` uses the most recent backup with a consistent set of options.

If you specify the `--from-timestamp` option when you create an incremental backup, `gpbackup` ensures that the options of the backup that is being created are consistent with the options of the specified backup.

The `gpbackup` option `--with-stats` is not required to be the same for all backups in the backup set. However, to perform a restore operation with the `gprestore` option --with-stats to restore statistics, the backup you specify must have must have used the `--with-stats` when creating the backup.

You can perform a restore operation from any backup in the backup set. However, changes captured in incremental backups later than the backup use to restore database data will not be restored.

When restoring from an incremental backup set, `gprestore` checks the backups and restores each append-optimized table from the most recent version of the append-optimized table in the backup set and restores the heap tables from the latest backup.

The incremental back up set, a full backup and associated incremental backups, must be on a single device. For example, the backups in a backup set must all be on a file system or must all be on a Data Domain system.

If you specify the `gprestore` option `--incremental` to restore data from a specific incremental backup, you must also specify the `--data-only` option. Before performing the restore operation, `gprestore` ensures that the tables being restored exist. If a table does not exist, `gprestore` returns an error and exits.

:::warning
Changes to the Cloudberry Database segment configuration invalidate incremental backups. After you change the segment configuration (add or remove segment instances), you must create a full backup before you can create an incremental backup.
:::