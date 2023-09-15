---
title: CHECKPOINT
---

# CHECKPOINT

Forces a write-ahead log checkpoint.

## Synopsis

```sql
CHECKPOINT
```

## Description

A checkpoint is a point in the write-ahead log sequence at which all data files have been updated to reflect the information in the log. All data files will be flushed to disk.

The `CHECKPOINT` command forces an immediate checkpoint when the command is issued, without waiting for a regular checkpoint scheduled by the system. `CHECKPOINT` is not intended for use during normal operation.

If run during recovery, the `CHECKPOINT` command will force a restartpoint rather than writing a new checkpoint.

Only superusers may call `CHECKPOINT`.

## Compatibility

The `CHECKPOINT` command is a Cloudberry Database extension.
