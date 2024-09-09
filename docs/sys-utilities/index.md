---
title: Utility Overview
---

# Utility Overview

The command-line utilities provided with Cloudberry Database.

Cloudberry Database uses the standard PostgreSQL client and server programs and provides additional management utilities for administering a distributed Cloudberry Database DBMS.

Several utilities are installed when you install the Cloudberry Database server. These utilities reside in `$GPHOME/bin`.

Superscripts identify those utilities that require separate downloads, as well as those utilities that are also installed with the Client and Loader Tools Packages. All utilities are installed when you install the Cloudberry Database server, unless specifically identified by a superscript.

For more information about a utility, see the corresponding topic listed in the System Utilities section. 

## Reference for Client Applications

- [clusterdb](./clusterdb.md) — cluster a database
- [createdb](./createdb.md) — create a new database
- [createuser](./createuser.md) — define a new user account
- [dropdb](./dropdb.md) — remove a database
- [dropuser](./dropuser.md) — remove a user account
- [pg_config](./pg-config.md) — retrieve information about the installed version of PostgreSQL
- [pg_dump](./pg-dump.md) — extract a database into a script file or other archive file
- [pg_dumpall](./pg-dumpall.md) — extract a database cluster into a script file
- [pg_restore](./pg-restore.md) — restore a database from an archive file created by pg_dump
- [psql](./psql.md) — interactive terminal
- [reindexdb](./reindexdb.md) — reindex a database
- [vacuumdb](./vacuumdb.md) — garbage-collect and analyze a database

## Reference for Server Applications

- [pg_checksums](./pg-checksums.md) — enable, disable or check data checksums in a database cluster

## Reference for Administrator

- [analyzedb](./analyzedb.md) - performs `ANALYZE` operations on tables incrementally and concurrently
- [gpaddmirrors](./gpaddmirrors.md) - add mirror segments to a Cloudberry Database system that was initially configured without mirroring
- [gpbackup](./gpbackup.md) - create a Cloudberry Database backup for use with the gprestore utility
- [gpcheckcat](./gpcheckcat.md) - test Cloudberry Database catalog tables for inconsistencies
- [gpcheckperf](./gpcheckperf.md) - verifiy the baseline hardware performance of the specified hosts
- [gpconfig](./gpconfig.md) - set server configuration parameters on all segments within a Cloudberry Database system
- [gpdeletesystem](./gpdeletesystem.md) - delete a Cloudberry Database system that was initialized using gpinitsystem
- [gpdemo](./gpdemo.md) - deploy a small Cloudberry Database cluster with segments on a single node to make a demo
- [gpexpand](./gpexpand.md) - expand an existing Cloudberry Database across new hosts in the system
- [gpfdist](./gpfdist.md) - serve data files to or writes data files out from Cloudberry Database segments
- [gpinitstandby](./gpinitstandby.md) - add and/or initialize a standby coordinator host for a Cloudberry Database system
- [gpinitsystem](./gpinitsystem.md) - initialize a Cloudberry Database system using configuration parameters specified in the gpinitsystem_config file
- [gpload](./gpload.md) - run a load job as defined in a YAML formatted control file
- [gplogfilter](./gplogfilter.md) - search through Cloudberry Database log files for specified entries
- [gpmemreport](./gpmemreport.md) - interpret the output created by the gpmemwatcher utility and generates output files in a readable format
- [gpmemwatcher](./gpmemwatcher.md) - track the memory usage of each process in a database cluster.
- [gpmovemirrors](./gpmovemirrors.md) - move mirror segment instances to new locations
- [gppkg](./gppkg.md) - package manager to install, upgrade, migrate, and remove extensions in `.gppkg` format
- [gprestore](./gprestore.md) - restore a database backup that was created using the gpbackup utility
- [gpreload](./gpreload.md) - reload table data sorting the data based on specified columns
- [gprecoverseg](./gprecoverseg.md) - recover a primary or mirror segment instance that has been marked as down (if mirroring is enabled)
- [gpshrink](./gpshrink.md) - use `gpshrink` to reduce the size of the cluster, saving server resources
- [gpssh-exkeys](./gpssh-exkeys.md) - exchange SSH public keys between hosts
- [gpssh](./gpssh.md) - provide SSH access to multiple hosts at once
- [gpstart](./gpstart.md) - start a Cloudberry Database system
- [gpstate](./gpstate.md) - show the status of a running Cloudberry Database system
- [gpstop](./gpstop.md) - stop or restart a Cloudberry Database system
- [gpsync](./gpsync.md) - copy files between multiple hosts at once
- [gpactivatestandby](./gpactivatestandby.md) - activate a standby coordinator host and makes it the active coordinator