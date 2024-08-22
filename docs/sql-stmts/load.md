---
title: LOAD
---

# LOAD

Loads or reloads a shared library file.

## Synopsis

```sql
LOAD '<filename>'
```

## Description

This command loads a shared library file into the Cloudberry Database server address space. If the file had been loaded previously, it is first unloaded. This command is primarily useful to unload and reload a shared library file that has been changed since the server first loaded it. To make use of the shared library, function(s) in it need to be declared using the `CREATE FUNCTION` command.

The library file name is typically given as just a bare file name, which is sought in the server's library search path (set by `dynamic_library_path`). Alternatively it can be given as a full path name. In either case the platform's standard shared library file name extension may be omitted.

Note that in Cloudberry Database the shared library file (`.so` file) must reside in the same path location on every host in the Cloudberry Database array (coordinators, segments, and mirrors).

Non-superusers can only apply `LOAD` to library files located in `$libdir/plugins/` — the specified `filename` must begin with exactly that string. You must ensure that only “safe” libraries are installed there.

## Parameters

**`filename`**

The path and file name of a shared library file. This file must exist in the same location on all hosts in your Cloudberry Database array.

## Examples

Load a shared library file:

```sql
LOAD '/usr/local/cloudberry-db/lib/myfuncs.so';
```

## Compatibility

`LOAD` is a Cloudberry Database extension.

## See also

[CREATE FUNCTION](/docs/sql-stmts/create-function.md)
