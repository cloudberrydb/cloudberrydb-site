---
title: Comparision with Greenplum Features
---

# Comparision with Greenplum Features

Cloudberry Database is 100% compatible with Greenplum. All the Greenplum features you need can be found in Cloudberry Database.

In addition, Cloudberry Database possesses some features that Greenplum currently lacks or does not support. More details are  below.

## General features

:::info

In the following tables, ✅ means support, and ❌ means no support.

:::

| Feature names                                   | Cloudberry Database | Greenplum   |
| ---------------------------------------- | ------------------- | ----------- |
| `EXPLAIN` (WAL) support | ✅                   | ❌           |
| Multiranges                     | ✅                   | ❌           |
| B-tree bottom-up index deletion                     | ✅                   | ❌           |
| Covering indexes for GiST (`INCLUDE`)               | ✅                   | ✅（Upcoming） |
| The `range_agg` range type aggregation function             | ✅                   | ❌           |
| `CREATE ACCESS METHOD`                   | ✅                   | ✅（Upcoming） |
| LZ4 compression for `TOAST` tables             | ✅                   | ❌           |
| JSONB subscripting                               | ✅                   | ❌           |
| Configure the maximum WAL retention for replication slots              | ✅                   | ❌           |
| Verify backup integrity (`pg_verifybackup`)     | ✅                   | ❌           |
| Client can require SCRAM channel binding            | ✅                   | ❌           |
| Vacuum "emergency mode"                        | ✅                   | ❌           |
| Certificate authentication with `postgres_fdw`           | ✅                   | ❌           |
| `UPSERT`                                 | ✅                   | ✅（Upcoming） |
| COPY FROM Where                          | ✅                   | ❌           |
| VACUUM / ANALYZE Skip Lock Table              | ✅                   | ❌           |
| HASH partitioned table                              | ✅                   | ❌           |
| CTE（SEARCH and CYCLE）                        | ✅                   | ❌           |
| Procedure OUT parameters                            | ✅                   | ❌           |
| `CHECK` constraints for foreign tables                    | ✅                   | ❌           |
| Timeout parameter for `pg_terminate_backend`        | ✅                   | ❌           |
| Auto failover for Master                      | ✅                   | ❌           |
| Kubernetes deployment support                 | ✅                   | ❌           |

## Performance-related features

| Feature names                                      | Cloudberry Database | Greenplum |
| ------------------------------------------- | ------------------- | --------- |
| `REINDEX CONCURRENTLY`         | ✅                   | ❌         |
| Aggregation pushdown                                | ✅                   | ❌         |
| `CREATE STATISTICS` - `OR` and `IN/ANY` statistics | ✅                   | ❌         |
| Incremental sort                                    | ✅                   | ❌         |
| Incremental sort for window functions                          | ✅                   | ❌         |
| Query pipelining                                  | ✅                   | ❌         |
| BRIN Index（multi-minmax, bloom）            | ✅                   | ❌         |
| Query parallelism                                    | ✅                   | ❌         |
| Abbrevated keys for sorting                                | ✅                   | ❌         |
| Hash Index WAL support                         | ✅                   | ❌         |
| `postgres_fdw` aggregation pushdown                     | ✅                   | ❌         |
| No need to rewrite the whole table when adding a column                     | ✅                   | ❌         |
| Runtime Filter for Join | ✅                   | ❌         |
| Index Scan for the AppendOnly table                   | ✅                   | ❌         |

## Security-related features

| Feature names                      | Cloudberry Database | Greenplum |
| --------------------------- | ------------------- | --------- |
| Transparent Data Encryption (TDE)          | ✅                   | ❌         |
| Trusted extensions                    | ✅                   | ❌         |
| SCRAM-SHA-256               | ✅                   | ❌         |
| Encrypted TCP/IP connection when GSSAPI | ✅                   | ❌         |
| Row-level security policy              | ✅                   | ❌         |
