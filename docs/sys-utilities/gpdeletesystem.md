---
title: gpdeletesystem
---

# gpdeletesystem

Deletes a Cloudberry Database system that was initialized using `gpinitsystem`.

## Synopsis

```shell
gpdeletesystem [-d <coordinator_data_directory>] [-B <parallel_processes>] 
   [-f] [-l <logfile_directory>] [-D]

gpdeletesystem -? 

gpdeletesystem -v
```

## Description

The `gpdeletesystem` utility performs the following actions:

- Stop all `postgres` processes (the segment instances and coordinator instance).
- Deletes all data directories.

Before running `gpdeletesystem`:

- Move any backup files out of the coordinator and segment data directories.
- Make sure that Cloudberry Database is running.
- If you are currently in a segment data directory, change directory to another location. The utility fails with an error when run from within a segment data directory.

This utility will not uninstall the Cloudberry Database software.

## Options

**`-d coordinator_data_directory`**

Specifies the coordinator host data directory. If this option is not specified, the setting for the environment variable `COORDINATOR_DATA_DIRECTORY` is used. If this option is specified, it overrides any setting of `COORDINATOR_DATA_DIRECTORY`. If coordinator_data_directory cannot be determined, the utility returns an error.

**`-B parallel_processes`**

The number of segments to delete in parallel. If not specified, the utility will start up to 60 parallel processes depending on how many segment instances it needs to delete.

**`-f (force)`**

Force a delete even if backup files are found in the data directories. The default is to not delete Cloudberry Database instances if backup files are present.

**`-l logfile_directory`**

The directory to write the log file. Defaults to `~/gpAdminLogs`.

**`-D (debug)`**

Sets logging level to debug.

**`-? (help)`**

Displays the online help.

**`-v (show utility version)`**

Displays the version, status, last updated date, and check sum of this utility.

## Examples

Delete a Cloudberry Database system:

```shell
gpdeletesystem -d /gpdata/gp-1
```

Delete a Cloudberry Database system even if backup files are present:

```shell
gpdeletesystem -d /gpdata/gp-1 -f
```

## See also

[gpinitsystem](/docs/sys-utilities/gpinitsystem.md)
