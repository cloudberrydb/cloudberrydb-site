---
title: pg_checksums
---

# pg_checksums

Enables, disables, or checks data checksums in a Cloudberry Database cluster.

## Synopsis

```shell
pg_checksums [<option> ...] [-D <datadir> | --pgdata=<datadir>]

pg_checksums -? | --help

pg_checksums -V | --version
```

## Description

`pg_checksums` is a standard PostgreSQL utility that you can use to check, enable, or disable data checksums in a Cloudberry Database cluster. The server must be shut down cleanly before running `pg_checksums`. When verifying checksums, Cloudberry Database returns the exit status zero if there are no checksum errors, and returns nonzero if it detects at least one checksum failure. When enabling or disabling checksums, Cloudberry returns a nonzero exit status if the operation failed.

When verifying checksums, Cloudberry Database scans every file in the cluster. When enabling checksums, every file in the cluster is rewritten in-place. Disabling checksums only updates the `pg_control` file.


## Options

The following command-line options are available:

**`-D datadir`**<br />
**`--pgdata=datadir`**

Specifies the directory where the database cluster is stored.

**`-c`**<br />
**`--check`**

Checks checksums. This is the default mode when no other options are specified.

**`-d`**<br />
**`--disable`**

Deactivates checksums.

**`-e`**<br />
**`--enable`**

Activates checksums.

**`-f fnode`**<br />
**`--filenode=fnode`**

Only validate checksums in the relation with filenode fnode.

**`-N`**<br />
**`--no-sync`**

By default, `pg_checksums` waits for all files to be written safely to disk. This option causes `pg_checksums` to return without waiting, which is faster, but a subsequent operating system crash could leave the updated data directory corrupt. This option has no effect when specified with `--check`.

> **Note**
> While useful for testing, do not use the `-N/--nosync` option in a production installation.

**`-P`**<br />
**`--progress`**

Enables progress reporting. Turning this on will deliver a progress report while checking or enabling checksums.

**`-v`**<br />
**`--verbose`**

Specifies verbose mode, which lists all checked files.

**`-V`**<br />
**`--version`**

Print the `pg_checksums` version, and exit.

**`-?`**<br />
**`--help`**

Show help about `pg_checksums` command line arguments, and exit.


## Environment

**`PGDATA`**

Specifies the directory where the database cluster is stored; you can specify the `-D` option to the `pg_checksums` command to override this setting.

**`PG_COLOR`**

Specifies whether to use color in diagnostic messages. Possible values are `always`, `auto`, and `never`.

## Notes

Enabling checksums in a large cluster can potentially take a long time. To guard against data loss during this operation, you must not start the cluster, nor start other programs that write to the data directory.

If `pg_checksums` is aborted or killed while enabling or disabling checksums, the cluster's data checksum configuration remains unchanged; you can re-run `pg_checksums` to perform the same operation.
