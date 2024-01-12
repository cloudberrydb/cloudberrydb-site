---
title: Backup and Restore Overview
---

# Backup and Restore Overview

Cloudberry Database offers both parallel and non-parallel methods for database backups and restores. Parallel operations handle large systems efficiently because each segment host writes data to its local disk at the same time. Non-parallel operations, however, transfer all data over the network to the coordinator, which then writes it to its storage. This method not only concentrates I/O on a single host but also requires the coordinator to have enough local disk space for the entire database.

## Parallel backup with `gpbackup` and `gprestore`

Cloudberry Database provides `gpbackup` and `gprestore` for parallel backup and restore utilities. `gpbackup` uses table-level `ACCESS SHARE` locks instead of `EXCLUSIVE` locks on the `pg_class` catalog table. This enables you to execute DML statements such as `CREATE`, `ALTER`, `DROP`, and `TRUNCATE` during backups, as long as these statements do not target the current backup set.

Backup files created with `gpbackup` are designed to provide future capabilities for restoring individual database objects along with their dependencies, such as functions and required user-defined data types.

For details about backup and restore using `gpbackup` and `gprestore`, see [Perform Full Backup and Restore](/docs/sys-admin/perform-full-backup-and-restore.md) and [Perform Incremental Backup and Restore](/docs/sys-admin/perform-incremental-backup-and-restore.md).

## Non-parallel backup with `pg_dump`

You can also use the PostgreSQL non-parallel backup utilitiesm`pg_dump` and `pg_dumpall` to create a single dump file on the coordinator host that contains all data from all active segments.

The PostgreSQL non-parallel utilities should be used only for special cases. They are much slower than using `gpbackup` and `gprestore` because all of the data must pass through the coordinator. In addition, it is often the case that the coordinator host has insufficient disk space to save a backup of an entire distributed Cloudberry Database.

The `pg_restore` utility requires compressed dump files created by `pg_dump` or `pg_dumpall`. Before starting the restore, you should modify the `CREATE TABLE` statements in the dump files to include the Cloudberry Database `DISTRIBUTED` clause. If you do not include the `DISTRIBUTED` clause, Cloudberry Database assigns default values, which might not be optimal.

To perform a non-parallel restore using parallel backup files, you can copy the backup files from each segment host to the coordinator host, and then load them through the coordinator.

Another non-parallel method for backing up Cloudberry Database data is to use the `COPY TO` SQL command to copy all or a portion of a table out of the database to a delimited text file on the coordinator host.