---
title: Backup And Restore
---

# Backup And Restore Cloudberry Database `<@TomShawn 无法验证，建议研发介入>`

Performing backups regularly ensures that you can restore your data or rebuild your Cloudberry Database system if data corruption or a system failure occurs. You can also use backups to migrate data from one Cloudberry Database system to another.

Cloudberry Database supports parallel and non-parallel methods for backing up and restoring databases. Parallel operations scale regardless of the number of segments in your system, because segment hosts each write their data to local disk storage simultaneously. With non-parallel backup and restore operations, the data must be sent over the network from the segments to the coordinator, which writes all of the data to its storage. In addition to restricting I/O to one host, non-parallel backup requires that the coordinator have sufficient local disk storage to store the entire database.

**Parallel backup with gpbackup and gprestore** `<!-- 无法在 cbdb 安装目录中找到 gpbackup 和 gprestore by @TomShawn -->`

`gpbackup` and `gprestore` are the recommended Cloudberry Database backup and restore utilities. `gpbackup` utilizes `ACCESS SHARE` locks at the individual table level, instead of `EXCLUSIVE` locks on the `pg_class` catalog table. This enables you to run DML statements during the backup, such as `CREATE`, `ALTER`, `DROP`, and `TRUNCATE` operations, as long as those operations do not target the current backup set. Backup files created with `gpbackup` are designed to provide future capabilities for restoring individual database objects along with their dependencies, such as functions and required user-defined datatypes.

**Non-parallel backup with pg_dump**

The PostgreSQL [`pg_dump`](/docs/db-utilities/db-util-pg-dump.md) and [`pg_dumpall`](/docs/db-utilities/db-util-pg-dumpall.md) non-parallel backup utilities can be used to create a single dump file on the coordinator host that contains all data from all active segments.

The PostgreSQL non-parallel utilities should be used only for special cases. They are much slower than using the Cloudberry Database backup utilities because all of the data must pass through the coordinator. In addition, it is often the case that the coordinator host has insufficient disk space to save a backup of an entire distributed Cloudberry database.

The [`pg_restore`](/docs/db-utilities/db-util-pg-restore.md) utility requires compressed dump files created by `pg_dump` or `pg_dumpall`. To perform a non-parallel restore using parallel backup files, you can copy the backup files from each segment host to the coordinator host, and then load them through the coordinator.

**Non-parallel restore using parallel backup files**

Another non-parallel method for backing up Cloudberry Database data is to use the [`COPY TO`](/docs/sql-stmts/sql-stmt-copy.md) SQL command to copy all or a portion of a table out of the database to a delimited text file on the coordinator host.
