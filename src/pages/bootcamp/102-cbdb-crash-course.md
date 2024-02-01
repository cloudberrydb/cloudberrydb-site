---
title: "[102] Cloudberry Database Crash Course"
---

# [102] Cloudberry Database Crash Course

This crash course provides an extensive overview of Cloudberry Database, an open-source Massively Parallel Processing (MPP) database. It covers key concepts, features, utilities, and hands-on exercises to become proficient with CBDB.

Topics include:

- [\[102\] Cloudberry Database Crash Course](#102-cloudberry-database-crash-course)
  - [Lesson 0. Prerequisite](#lesson-0-prerequisite)
  - [Lesson 1. Where to read the official documentation](#lesson-1-where-to-read-the-official-documentation)
  - [Lesson 2. How to install CBDB](#lesson-2-how-to-install-cbdb)
  - [Lesson 3. Cluster architecture](#lesson-3-cluster-architecture)
  - [Lesson 4. Management utilities](#lesson-4-management-utilities)
  - [Lesson 5. Start and stop a cluster](#lesson-5-start-and-stop-a-cluster)
  - [Lesson 6. Check cluster state](#lesson-6-check-cluster-state)
  - [Lesson 7. How CBDB segment mirroring works](#lesson-7-how-cbdb-segment-mirroring-works)
  - [Lesson 8. CBDB's fault tolerance and segment recovery](#lesson-8-cbdbs-fault-tolerance-and-segment-recovery)
  - [Lesson 9. Set up and manage the standby master instance in CBDB](#lesson-9-set-up-and-manage-the-standby-master-instance-in-cbdb)
  - [Lesson 10. Expand a cluster](#lesson-10-expand-a-cluster)
  - [Lesson 11. Check cluster performance](#lesson-11-check-cluster-performance)
  - [Lesson 12. User data and table distribution](#lesson-12-user-data-and-table-distribution)
  - [Lesson 13. Database catalog](#lesson-13-database-catalog)
  - [Lesson 14. CBDB data directories](#lesson-14-cbdb-data-directories)
  - [Lesson 15. Instance processes](#lesson-15-instance-processes)
      - [master processes:](#master-processes)
      - [primary processes:](#primary-processes)
      - [mirror processes:](#mirror-processes)
  - [Lesson 16. Database log files](#lesson-16-database-log-files)
  - [Lesson 17. Table types in CBDB: heap, AO, and AOCO](#lesson-17-table-types-in-cbdb-heap-ao-and-aoco)
  - [Lesson 18. External tables](#lesson-18-external-tables)
  - [Lesson 19. Workload management](#lesson-19-workload-management)

## Lesson 0. Prerequisite

Before starting this crash course, spend some time going through the [Cloudberry Database Tutorials Based on Single-Node Installation](./#1-cloudberrydb-sandbox) to get familiar with Cloudberry Database and how it works.

## Lesson 1. Where to read the official documentation

Take a quick look at the official [CBDB Documentation](https://cloudberrydb.org/docs). No need to worry if you do not understand everything.

## Lesson 2. How to install CBDB

To begin your journey with CBDB, you are expected to install CBDB in your preferred environment. The following options are available:

- For testing or trying out CBDB in a sandbox environment, see [Install CBDB in a Sandbox](./cbdb-sandbox).
- For deploying CBDB in other environments (including the production environment) and the prerequisite software/hardware configuration, see [CBDB Deployment Guide](https://cloudberrydb.org/docs/cbdb-op-deploy-guide).

## Lesson 3. Cluster architecture

A CBDB cluster has one master host (usually named `mdw`) and multiple segment hosts (usually named `sdwXX`).

:::note

If someone is referring to `mdw`, he is referring to the "master host". Similarly, when somebody is referring to "sdw10", he is referring to the 10th segment host.

:::

A master host usually contains only one instance - the master instance. The segment hosts might contain many worker instances. Every instance has its own set of processes, data directory, and listening port. For example, usually, the listening port of the master instance (where all clients will connect to) is `5432`.

Every segment instance has its own listening port, and the base port is specified in the cluster configuration file.

Instances can have 2 roles - primary and mirror. Primary instances serve database queries. Mirror instances simply track and record data changes in primary instances, but do not serve database queries. If the primary instance goes down for some reason, then the corresponding mirror instance transitions to the primary role and starts serving queries (the original primary instance, currently down, is marked as mirror).

The cluster information is stored in the `gp_segment_configuration` system table, which looks like this (use the "psql" command to connect to the database to execute queries):

```shell
[gpadmin@mdw ~]$ psql

psql (14.4, server 14.4)
Type "help" for help.
```

```sql
gpadmin=# SELECT * FROM gp_segment_configuration;

 dbid | content | role | preferred_role | mode | status | port  | hostname | address |            datadir
------+---------+------+----------------+------+--------+-------+----------+---------+--------------------------------
    1 |      -1 | p    | p              | n    | u      |  5432 | mdw      | mdw     | /data0/database/master/gpseg-1
    2 |       0 | p    | p              | n    | u      | 40000 | mdw      | mdw     | /data0/database/primary/gpseg0
    3 |       1 | p    | p              | n    | u      | 40001 | mdw      | mdw     | /data0/database/primary/gpseg1
(3 rows)
```

The columns of this system are described as follows.

- `dbid`: uniquely identifies a segment.
- `content`: uniquely identifies segment pairs (primary and mirror). The primary and the corresponding mirror will have the same `content` ID, but different `dbid` values. The master has the `content` value of `-1`. The worker instances have incremental content values of `0`, `1`, `2`, `3`...
- `role`: the current role of the segment.
- `preferred_role`: the role of the segment in the original configuration. Note that if an original mirror instance has taken over and become primary now, the role will be changed. This column records the original role.
- `mode`: the mode of the segment. The value options are `s` (in sync), `c` (in change tracking), and `r` (in recovery).
- `status`: the status of the segment. The value options are `u` (up) and `d` (down).
- `port`: the listening port of the segment. For clients, only the listening port of the master is important. The segment listening ports are important for the master to communicate with them.
- `hostname`: the hostname of the segment.
- `address`: each host can have different network controllers with different IP addresses and different names associated.
- `datadir`: the data directory where data is stored for each segment.

**Exercise**

Connect to the CBDB cluster that you have created and take a look at the `gp_segment_configuration` table. Try to learn the rows and columns. Take a look at the cluster configuration file that you used to create the cluster.

## Lesson 4. Management utilities

Management utilities in CBDB are command-line tools used to administer and manage the database cluster. Some key points:

- They allow performing tasks like starting, stopping, and configuring the database.
- Help monitor the health and status of the cluster.
- Used for maintenance like recovering nodes and rebalancing data.
- Help scale out the cluster by expanding with more nodes.
- Utilities work across master, standby master, and multiple segment instances.

In summary, management utilities are command-line programs and scripts used by DBAs to administer, monitor, maintain and manage a CBDB cluster. The following are some common utilities.

- `gpstop`: stops database cluster.
- `gpstart`: starts database cluster.
- `psql`: a command-line client.
- `gpconfig`: shows or changes configuration parameters.
- `gpdeletesystem`: deletes a cluster.
- `pg_dump`, `gpbackup`, `gprestore`: performs backup and restore operations.
- `gpinitstanby`, `gpactivatestandby`: manages the standby master instance.
- `gprecoverseg`: recovers segment.
- `gpfdist`, `gpload`: operates with external tables.
- `gpssh`, `gpscp`, `gpssh-exkeys`: for cluster navigation.
- Logging - all utilities write log files under `~/gpAdminLogs/` - one file per day

**Exercise**

Read the help information for these tools (`<tool_name> --help`).

## Lesson 5. Start and stop a cluster

- Start a CBDB cluster using `gpstart`:

    ```shell
    [gpadmin@mdw ~]$ gpstart -a
    ```

    ```shell
    20230823:16:14:23:004256 gpstart:mdw:gpadmin-[INFO]:-Starting gpstart with args: -a
    20230823:16:14:23:004256 gpstart:mdw:gpadmin-[INFO]:-Gathering information and validating the environment...
    20230823:16:14:23:004256 gpstart:mdw:gpadmin-[INFO]:-Cloudberry Binary Version: 'postgres (Cloudberry Database) 1.0.0 build dev'
    20230823:16:14:23:004256 gpstart:mdw:gpadmin-[INFO]:-Cloudberry Catalog Version: '302206171'
    20230823:16:14:23:004256 gpstart:mdw:gpadmin-[INFO]:-Starting Coordinator instance in admin mode
    20230823:16:14:23:004256 gpstart:mdw:gpadmin-[INFO]:-CoordinatorStart pg_ctl cmd is env GPSESSID=0000000000 GPERA=None $GPHOME/bin/pg_ctl -D /data0/database/master/gpseg-1 -l /data0/database/master/gpseg-1/log/startup.log -w -t 600 -o " -p 5432 -c gp_role=utility " start
    20230823:16:14:23:004256 gpstart:mdw:gpadmin-[INFO]:-Obtaining Cloudberry Coordinator catalog information
    20230823:16:14:23:004256 gpstart:mdw:gpadmin-[INFO]:-Obtaining Segment details from coordinator...
    20230823:16:14:23:004256 gpstart:mdw:gpadmin-[INFO]:-Setting new coordinator era
    20230823:16:14:23:004256 gpstart:mdw:gpadmin-[INFO]:-Coordinator Started...
    20230823:16:14:23:004256 gpstart:mdw:gpadmin-[INFO]:-Shutting down coordinator
    20230823:16:14:23:004256 gpstart:mdw:gpadmin-[INFO]:-Commencing parallel primary and mirror segment instance startup, please wait...
    20230823:16:14:24:004256 gpstart:mdw:gpadmin-[INFO]:-Process results...
    20230823:16:14:24:004256 gpstart:mdw:gpadmin-[INFO]:-
    20230823:16:14:24:004256 gpstart:mdw:gpadmin-[INFO]:-----------------------------------------------------
    20230823:16:14:24:004256 gpstart:mdw:gpadmin-[INFO]:-   Successful segment starts                                            = 4
    20230823:16:14:24:004256 gpstart:mdw:gpadmin-[INFO]:-   Failed segment starts                                                = 0
    20230823:16:14:24:004256 gpstart:mdw:gpadmin-[INFO]:-   Skipped segment starts (segments are marked down in configuration)   = 0
    20230823:16:14:24:004256 gpstart:mdw:gpadmin-[INFO]:-----------------------------------------------------
    20230823:16:14:24:004256 gpstart:mdw:gpadmin-[INFO]:-Successfully started 4 of 4 segment instances
    20230823:16:14:24:004256 gpstart:mdw:gpadmin-[INFO]:-----------------------------------------------------
    20230823:16:14:24:004256 gpstart:mdw:gpadmin-[INFO]:-Starting Coordinator instance mdw directory /data0/database/master/gpseg-1
    20230823:16:14:24:004256 gpstart:mdw:gpadmin-[INFO]:-CoordinatorStart pg_ctl cmd is env GPSESSID=0000000000 GPERA=45b5ca734de32094_230823161423 $GPHOME/bin/pg_ctl -D /data0/database/master/gpseg-1 -l /data0/database/master/gpseg-1/log/startup.log -w -t 600 -o " -p 5432 -c gp_role=dispatch " start
    20230823:16:14:24:004256 gpstart:mdw:gpadmin-[INFO]:-Command pg_ctl reports Coordinator mdw instance active
    20230823:16:14:24:004256 gpstart:mdw:gpadmin-[INFO]:-Connecting to db template1 on host localhost
    20230823:16:14:24:004256 gpstart:mdw:gpadmin-[INFO]:-No standby coordinator configured.  skipping...
    20230823:16:14:24:004256 gpstart:mdw:gpadmin-[INFO]:-Database successfully started
    ```

- Stop a CBDB cluster using `gpstop`:

    ```shell
    [gpadmin@mdw ~]$ gpstop -a
    ```

    ```shell
    20230823:16:14:18:004143 gpstop:mdw:gpadmin-[INFO]:-Starting gpstop with args: -a
    20230823:16:14:18:004143 gpstop:mdw:gpadmin-[INFO]:-Gathering information and validating the environment...
    20230823:16:14:18:004143 gpstop:mdw:gpadmin-[INFO]:-Obtaining Cloudberry Coordinator catalog information
    20230823:16:14:18:004143 gpstop:mdw:gpadmin-[INFO]:-Obtaining Segment details from coordinator...
    20230823:16:14:18:004143 gpstop:mdw:gpadmin-[INFO]:-Cloudberry Version: 'postgres (Cloudberry Database) 1.0.0 build dev'
    20230823:16:14:18:004143 gpstop:mdw:gpadmin-[INFO]:-Commencing Coordinator instance shutdown with mode='smart'
    20230823:16:14:18:004143 gpstop:mdw:gpadmin-[INFO]:-Coordinator segment instance directory=/data0/database/master/gpseg-1
    20230823:16:14:18:004143 gpstop:mdw:gpadmin-[INFO]:-Stopping coordinator segment and waiting for user connections to finish ...
    server shutting down
    20230823:16:14:19:004143 gpstop:mdw:gpadmin-[INFO]:-Attempting forceful termination of any leftover coordinator process
    20230823:16:14:19:004143 gpstop:mdw:gpadmin-[INFO]:-Terminating processes for segment /data0/database/master/gpseg-1
    20230823:16:14:19:004143 gpstop:mdw:gpadmin-[INFO]:-No standby coordinator host configured
    20230823:16:14:19:004143 gpstop:mdw:gpadmin-[INFO]:-Targeting dbid [2, 4, 3, 5] for shutdown
    20230823:16:14:19:004143 gpstop:mdw:gpadmin-[INFO]:-Commencing parallel primary segment instance shutdown, please wait...
    20230823:16:14:19:004143 gpstop:mdw:gpadmin-[INFO]:-0.00% of jobs completed
    20230823:16:14:19:004143 gpstop:mdw:gpadmin-[INFO]:-100.00% of jobs completed
    20230823:16:14:19:004143 gpstop:mdw:gpadmin-[INFO]:-Commencing parallel mirror segment instance shutdown, please wait...
    20230823:16:14:19:004143 gpstop:mdw:gpadmin-[INFO]:-0.00% of jobs completed
    20230823:16:14:20:004143 gpstop:mdw:gpadmin-[INFO]:-100.00% of jobs completed
    20230823:16:14:20:004143 gpstop:mdw:gpadmin-[INFO]:-----------------------------------------------------
    20230823:16:14:20:004143 gpstop:mdw:gpadmin-[INFO]:-   Segments stopped successfully      = 4
    20230823:16:14:20:004143 gpstop:mdw:gpadmin-[INFO]:-   Segments with errors during stop   = 0
    20230823:16:14:20:004143 gpstop:mdw:gpadmin-[INFO]:-----------------------------------------------------
    20230823:16:14:20:004143 gpstop:mdw:gpadmin-[INFO]:-Successfully shutdown 4 of 4 segment instances
    20230823:16:14:20:004143 gpstop:mdw:gpadmin-[INFO]:-Database successfully shutdown with no errors reported
    ```

**Exercise**

Read the log entries for `gpstop` and `gpstart`, and try to understand what they mean. Read and exercise the different options for `gpstart` and `gpstop`.

## Lesson 6. Check cluster state

- Check the state of a cluster using `gpstate`.

    `gpstate` is the utility that can give you information about the state of the cluster. You can add different options to see different aspects of the cluster state.

    ```shell
    [gpadmin@mdw ~]$ gpstate
    ```

    ```shell
    20230823:16:17:41:004530 gpstate:mdw:gpadmin-[INFO]:-Starting gpstate with args:
    20230823:16:17:41:004530 gpstate:mdw:gpadmin-[INFO]:-local Cloudberry Version: 'postgres (Cloudberry Database) 1.0.0 build dev'
    20230823:16:17:41:004530 gpstate:mdw:gpadmin-[INFO]:-coordinator Cloudberry Version: 'PostgreSQL 14.4 (Cloudberry Database 1.0.0 build dev) on aarch64-unknown-linux-gnu, compiled by gcc (GCC) 10.2.1 20210130 (Red Hat 10.2.1-11), 64-bit compiled on Aug  9 2023 14:45:43'
    20230823:16:17:41:004530 gpstate:mdw:gpadmin-[INFO]:-Obtaining Segment details from coordinator...
    20230823:16:17:41:004530 gpstate:mdw:gpadmin-[INFO]:-Gathering data from segments...
    20230823:16:17:41:004530 gpstate:mdw:gpadmin-[INFO]:-Cloudberry instance status summary
    20230823:16:17:41:004530 gpstate:mdw:gpadmin-[INFO]:-----------------------------------------------------
    20230823:16:17:41:004530 gpstate:mdw:gpadmin-[INFO]:-   Coordinator instance                                      = Active
    20230823:16:17:41:004530 gpstate:mdw:gpadmin-[INFO]:-   Coordinator standby                                       = No coordinator standby configured
    20230823:16:17:41:004530 gpstate:mdw:gpadmin-[INFO]:-   Total segment instance count from metadata                = 4
    20230823:16:17:41:004530 gpstate:mdw:gpadmin-[INFO]:-----------------------------------------------------
    20230823:16:17:41:004530 gpstate:mdw:gpadmin-[INFO]:-   Primary Segment Status
    20230823:16:17:41:004530 gpstate:mdw:gpadmin-[INFO]:-----------------------------------------------------
    20230823:16:17:41:004530 gpstate:mdw:gpadmin-[INFO]:-   Total primary segments                                    = 2
    20230823:16:17:41:004530 gpstate:mdw:gpadmin-[INFO]:-   Total primary segment valid (at coordinator)              = 2
    20230823:16:17:41:004530 gpstate:mdw:gpadmin-[INFO]:-   Total primary segment failures (at coordinator)           = 0
    20230823:16:17:41:004530 gpstate:mdw:gpadmin-[INFO]:-   Total number of postmaster.pid files missing              = 0
    20230823:16:17:41:004530 gpstate:mdw:gpadmin-[INFO]:-   Total number of postmaster.pid files found                = 2
    20230823:16:17:41:004530 gpstate:mdw:gpadmin-[INFO]:-   Total number of postmaster.pid PIDs missing               = 0
    20230823:16:17:41:004530 gpstate:mdw:gpadmin-[INFO]:-   Total number of postmaster.pid PIDs found                 = 2
    20230823:16:17:41:004530 gpstate:mdw:gpadmin-[INFO]:-   Total number of /tmp lock files missing                   = 0
    20230823:16:17:41:004530 gpstate:mdw:gpadmin-[INFO]:-   Total number of /tmp lock files found                     = 2
    20230823:16:17:41:004530 gpstate:mdw:gpadmin-[INFO]:-   Total number postmaster processes missing                 = 0
    20230823:16:17:41:004530 gpstate:mdw:gpadmin-[INFO]:-   Total number postmaster processes found                   = 2
    20230823:16:17:41:004530 gpstate:mdw:gpadmin-[INFO]:-----------------------------------------------------
    20230823:16:17:41:004530 gpstate:mdw:gpadmin-[INFO]:-   Mirror Segment Status
    20230823:16:17:41:004530 gpstate:mdw:gpadmin-[INFO]:-----------------------------------------------------
    20230823:16:17:41:004530 gpstate:mdw:gpadmin-[INFO]:-   Total mirror segments                                     = 2
    20230823:16:17:41:004530 gpstate:mdw:gpadmin-[INFO]:-   Total mirror segment valid (at coordinator)               = 2
    20230823:16:17:41:004530 gpstate:mdw:gpadmin-[INFO]:-   Total mirror segment failures (at coordinator)            = 0
    20230823:16:17:41:004530 gpstate:mdw:gpadmin-[INFO]:-   Total number of postmaster.pid files missing              = 0
    20230823:16:17:41:004530 gpstate:mdw:gpadmin-[INFO]:-   Total number of postmaster.pid files found                = 2
    20230823:16:17:41:004530 gpstate:mdw:gpadmin-[INFO]:-   Total number of postmaster.pid PIDs missing               = 0
    20230823:16:17:41:004530 gpstate:mdw:gpadmin-[INFO]:-   Total number of postmaster.pid PIDs found                 = 2
    20230823:16:17:41:004530 gpstate:mdw:gpadmin-[INFO]:-   Total number of /tmp lock files missing                   = 0
    20230823:16:17:41:004530 gpstate:mdw:gpadmin-[INFO]:-   Total number of /tmp lock files found                     = 2
    20230823:16:17:41:004530 gpstate:mdw:gpadmin-[INFO]:-   Total number postmaster processes missing                 = 0
    20230823:16:17:41:004530 gpstate:mdw:gpadmin-[INFO]:-   Total number postmaster processes found                   = 2
    20230823:16:17:41:004530 gpstate:mdw:gpadmin-[INFO]:-   Total number mirror segments acting as primary segments   = 0
    20230823:16:17:41:004530 gpstate:mdw:gpadmin-[INFO]:-   Total number mirror segments acting as mirror segments    = 2
    20230823:16:17:41:004530 gpstate:mdw:gpadmin-[INFO]:-----------------------------------------------------
    ```

- Check the status of a cluster by querying the `gp_segment_configuration` system table. The `gp_segment_configuration` table displays the "master instance" information about the state of the cluster.

**Exercise**

Check the cluster state and try to collect the information using `gpstate` or `gp_segment_configuration`.

## Lesson 7. How CBDB segment mirroring works

**CBDB mirroring overview:**

Each segment instance in a Cloudberry Database has 2 possible roles: primary and mirror.

- Primary role: serves user queries.
- Mirror role: tracks and records data changes from the primary using WAL replication but does not serve user queries.

If the primary segment instance encounters an issue and goes down, its corresponding mirror segment takes over the primary role to ensure continuity in serving queries. The system will then mark the original, now non-functional, primary segment as a mirror.

**Segment modes**

A segment can exist in one of the following modes:

- `s`: In sync.
- `c`: Change tracking.
- `r`: In recovery.

The ideal state for both primary and mirror segments is to be up and in-sync (represented as `P:u/s` and `M:u/s`).

**Scenarios for CBDB mirroring**

- Scenario 1: When the mirror instance goes down, the following process occurs.

    1. The primary segment transitions from the in-sync mode to the change tracking mode (`P:u/c` and `M:d/s`).
    2. All data changes are recorded and stored.
    3. The DBA, upon noticing this, investigates and starts a recovery for the mirror instance using the `gprecoverseg` command.
    4. Both the primary and mirror segments transition to the recovery mode (`P:u/r`, `M:u/r`).
    5. Post recovery, both the primary and mirror segments revert to the in-sync mode (`P:u/s`, `M:u/s`).

    This scenario remains transparent to users because the primary segment is still functional. Therefore, queries continue to run without interruptions.

- Scenario 2: When the primary instance goes down, the following process occurs.

    1. All active sessions on the primary instance are terminated.
    2. The database system marks the primary instance as "down" and promotes the mirror instance to the primary role, enabling it to track changes (`M:d/s`, `P:u/c`).
    3. The DBA, upon detecting this situation, investigates and starts recovering the mirror using the `gprecoverseg` command.
    4. On starting the recovery, both primary and mirror segments transition to the recovery mode `(M:u/r`, `P:u/r`).
    5. Once the recovery is completed, both segments switch to the in-sync mode (`M:u/s`, `P:u/s`).

    After this recovery, the roles of the instances have been changed (the original primary is now a mirror). To revert the segments to their original roles, you need to rebalance them. This can be done by either:

    - Using the `gpstop` and `gpstart` commands.
    - Using the `gprecoverseg -r` command for rebalancing.

**Add mirrors to an existing cluster**

If your CBDB cluster was initially created without mirrors, you can use the `gpaddmirrors` utility to add mirrors to the existing cluster. See the following example:

```shell
[gpadmin@mdw ~]$ gpaddmirrors
```

<details>

<summary>The example output of gpaddmirrors</summary>

```shell
20230823:16:02:50:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-Starting gpaddmirrors with args:
20230823:16:02:50:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-local Cloudberry Version: 'postgres (Cloudberry Database) 1.0.0 build dev'
20230823:16:02:50:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-coordinator Cloudberry Version: 'PostgreSQL 14.4 (Cloudberry Database 1.0.0 build dev) on aarch64-unknown-linux-gnu, compiled by gcc (GCC) 10.2.1 20210130 (Red Hat 10.2.1-11), 64-bit compiled on Aug  9 2023 14:45:43'
20230823:16:02:50:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-Obtaining Segment details from coordinator...
20230823:16:02:50:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-Successfully finished pg_controldata /data0/database/primary/gpseg0 for dbid 2:
stdout: pg_control version number:            13000700
Catalog version number:               302206171
Database system identifier:           7270424369249924934
Database cluster state:               in production
pg_control last modified:             Wed 23 Aug 2023 03:59:52 PM CST
Latest checkpoint location:           0/50EBA18
Latest checkpoint's REDO location:    0/50EB9E0
Latest checkpoint's REDO WAL file:    000000010000000000000001
Latest checkpoint's TimeLineID:       1
Latest checkpoint's PrevTimeLineID:   1
Latest checkpoint's full_page_writes: on
Latest checkpoint's NextXID:          0:762
Latest checkpoint's NextGxid:         1
Latest checkpoint's NextOID:          13266
Latest checkpoint's NextRelfilenode:  12002
Latest checkpoint's NextMultiXactId:  1
Latest checkpoint's NextMultiOffset:  0
Latest checkpoint's oldestXID:        752
Latest checkpoint's oldestXID's DB:   1
Latest checkpoint's oldestActiveXID:  761
Latest checkpoint's oldestMultiXid:   1
Latest checkpoint's oldestMulti's DB: 1
Latest checkpoint's oldestCommitTsXid:0
Latest checkpoint's newestCommitTsXid:0
Time of latest checkpoint:            Wed 23 Aug 2023 03:59:52 PM CST
Fake LSN counter for unlogged rels:   0/3E8
Minimum recovery ending location:     0/0
Min recovery ending loc's timeline:   0
Backup start location:                0/0
Backup end location:                  0/0
End-of-backup record required:        no
wal_level setting:                    replica
wal_log_hints setting:                off
max_connections setting:              60
max_worker_processes setting:         13
max_wal_senders setting:              10
max_prepared_xacts setting:           250
max_locks_per_xact setting:           128
track_commit_timestamp setting:       off
Maximum data alignment:               8
Database block size:                  32768
Blocks per segment of large relation: 32768
WAL block size:                       32768
Bytes per WAL segment:                67108864
Maximum length of identifiers:        64
Maximum columns in an index:          32
Maximum size of a TOAST chunk:        8140
Size of a large-object chunk:         8192
Date/time type storage:               64-bit integers
Float8 argument passing:              by value
Data page checksum version:           1
Mock authentication nonce:            94edd2a762753f7d12faff1737ffb338dec6e01a90eb3d509c6afc67e78bf58e
File encryption method:

stderr:
20230823:16:02:50:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-Successfully finished pg_controldata /data0/database/primary/gpseg1 for dbid 3:
stdout: pg_control version number:            13000700
Catalog version number:               302206171
Database system identifier:           7270424369087874885
Database cluster state:               in production
pg_control last modified:             Wed 23 Aug 2023 03:59:52 PM CST
Latest checkpoint location:           0/50EBA18
Latest checkpoint's REDO location:    0/50EB9E0
Latest checkpoint's REDO WAL file:    000000010000000000000001
Latest checkpoint's TimeLineID:       1
Latest checkpoint's PrevTimeLineID:   1
Latest checkpoint's full_page_writes: on
Latest checkpoint's NextXID:          0:762
Latest checkpoint's NextGxid:         1
Latest checkpoint's NextOID:          13266
Latest checkpoint's NextRelfilenode:  12002
Latest checkpoint's NextMultiXactId:  1
Latest checkpoint's NextMultiOffset:  0
Latest checkpoint's oldestXID:        752
Latest checkpoint's oldestXID's DB:   1
Latest checkpoint's oldestActiveXID:  761
Latest checkpoint's oldestMultiXid:   1
Latest checkpoint's oldestMulti's DB: 1
Latest checkpoint's oldestCommitTsXid:0
Latest checkpoint's newestCommitTsXid:0
Time of latest checkpoint:            Wed 23 Aug 2023 03:59:52 PM CST
Fake LSN counter for unlogged rels:   0/3E8
Minimum recovery ending location:     0/0
Min recovery ending loc's timeline:   0
Backup start location:                0/0
Backup end location:                  0/0
End-of-backup record required:        no
wal_level setting:                    replica
wal_log_hints setting:                off
max_connections setting:              60
max_worker_processes setting:         13
max_wal_senders setting:              10
max_prepared_xacts setting:           250
max_locks_per_xact setting:           128
track_commit_timestamp setting:       off
Maximum data alignment:               8
Database block size:                  32768
Blocks per segment of large relation: 32768
WAL block size:                       32768
Bytes per WAL segment:                67108864
Maximum length of identifiers:        64
Maximum columns in an index:          32
Maximum size of a TOAST chunk:        8140
Size of a large-object chunk:         8192
Date/time type storage:               64-bit integers
Float8 argument passing:              by value
Data page checksum version:           1
Mock authentication nonce:            baf9fb0b44c5cc558357b266024336445d958e35f8896fcd94b5ef2143ad052d
File encryption method:

stderr:
20230823:16:02:50:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-Heap checksum setting consistent across cluster
Enter mirror segment data directory location 1 of 2 >
/data0/database/mirror
Enter mirror segment data directory location 2 of 2 >
/data0/database/mirror
20230823:16:03:16:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-Cloudberry Add Mirrors Parameters
20230823:16:03:16:003517 gpaddmirrors:mdw:gpadmin-[INFO]:---------------------------------------------
20230823:16:03:16:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-Cloudberry coordinator data directory    = /data0/database/master/gpseg-1
20230823:16:03:16:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-Cloudberry coordinator port              = 5432
20230823:16:03:16:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-Batch size                              = 16
20230823:16:03:16:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-Segment batch size                      = 64
20230823:16:03:16:003517 gpaddmirrors:mdw:gpadmin-[INFO]:---------------------------------------------
20230823:16:03:16:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-Mirror 1 of 2
20230823:16:03:16:003517 gpaddmirrors:mdw:gpadmin-[INFO]:---------------------------------------------
20230823:16:03:16:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-   Primary instance host        = mdw
20230823:16:03:16:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-   Primary instance address     = mdw
20230823:16:03:16:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-   Primary instance directory   = /data0/database/primary/gpseg0
20230823:16:03:16:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-   Primary instance port        = 40000
20230823:16:03:16:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-   Mirror instance host         = mdw
20230823:16:03:16:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-   Mirror instance address      = mdw
20230823:16:03:16:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-   Mirror instance directory    = /data0/database/mirror/gpseg0
20230823:16:03:16:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-   Mirror instance port         = 41000
20230823:16:03:16:003517 gpaddmirrors:mdw:gpadmin-[INFO]:---------------------------------------------
20230823:16:03:16:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-Mirror 2 of 2
20230823:16:03:16:003517 gpaddmirrors:mdw:gpadmin-[INFO]:---------------------------------------------
20230823:16:03:16:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-   Primary instance host        = mdw
20230823:16:03:16:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-   Primary instance address     = mdw
20230823:16:03:16:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-   Primary instance directory   = /data0/database/primary/gpseg1
20230823:16:03:16:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-   Primary instance port        = 40001
20230823:16:03:16:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-   Mirror instance host         = mdw
20230823:16:03:16:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-   Mirror instance address      = mdw
20230823:16:03:16:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-   Mirror instance directory    = /data0/database/mirror/gpseg1
20230823:16:03:16:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-   Mirror instance port         = 41001
20230823:16:03:16:003517 gpaddmirrors:mdw:gpadmin-[INFO]:---------------------------------------------

Continue with add mirrors procedure Yy|Nn (default=N):
> y
20230823:16:03:30:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-Starting to create new pg_hba.conf on primary segments
20230823:16:03:31:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-Successfully modified pg_hba.conf on primary segments to allow replication connections
20230823:16:03:31:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-2 segment(s) to add
20230823:16:03:31:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-Setting up the required segments for recovery
20230823:16:03:31:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-Running recovery for the required segments
mdw (dbid 4): pg_basebackup: base backup completed
mdw (dbid 5): pg_basebackup: base backup completed
20230823:16:03:33:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-Updating configuration with new mirrors
20230823:16:03:33:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-Starting mirrors
20230823:16:03:33:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-era is 45b5ca734de32094_230823155950
20230823:16:03:33:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-Commencing parallel segment instance startup, please wait...
20230823:16:03:34:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-Process results...
20230823:16:03:34:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-
20230823:16:03:34:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-******************************************************************
20230823:16:03:34:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-Mirror segments have been added; data synchronization is in progress.
20230823:16:03:34:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-Data synchronization will continue in the background.
20230823:16:03:34:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-Use  gpstate -s  to check the resynchronization progress.
20230823:16:03:34:003517 gpaddmirrors:mdw:gpadmin-[INFO]:-******************************************************************
```
<br />
</details>

**Exercise**

Add mirrors to your cluster. If your cluster already has mirrors, delete the cluster and recreate one without mirrors (removing mirror segments is not supported).

## Lesson 8. CBDB's fault tolerance and segment recovery

**CBDB's fault tolerance system**

CBDB's Fault Tolerant Service (FTS) continuously watches over the cluster to ensure uninterrupted work with active segments. If a segment goes down, the system makes adjustments to ensure a primary instance is always ready for every content. A situation where both the primary and mirror instances of a content fail is called a "double fault," rendering the database unusable.

**Working principle of the FTS service**

The FTS service operates from the master node using the "ftsprober" process. This process periodically scans segments. If it identifies any changes compared to the last saved configuration, it makes the necessary adjustments. Details about these adjustments are stored in the master log file and the `gp_configuration_history` table, while the status of each instance is updated in the `gp_segment_configuration` table.

The following is a preview of the `gp_configuration_history` table:

```sql
gpadmin=# SELECT * FROM gp_configuration_history;

             time              | dbid |                                      desc
-------------------------------+------+--------------------------------------------------------------------------------
 2023-08-23 16:03:33.917057+08 |    4 | gpaddmirrors: segment config for resync: inserted mirror segment configuration
 2023-08-23 16:03:33.917057+08 |    5 | gpaddmirrors: segment config for resync: inserted mirror segment configuration
 2023-08-23 16:03:52.784083+08 |    2 | FTS: update role, status, and mode for dbid 2 with contentid 0 to p, u, and s
 2023-08-23 16:03:52.78515+08  |    4 | FTS: update role, status, and mode for dbid 4 with contentid 0 to m, u, and s
 2023-08-23 16:03:52.794198+08 |    3 | FTS: update role, status, and mode for dbid 3 with contentid 1 to p, u, and s
 2023-08-23 16:03:52.794214+08 |    5 | FTS: update role, status, and mode for dbid 5 with contentid 1 to m, u, and s
(6 rows)
```

**Recover a downed segment**

If a segment is down, you can recover it using the `gprecoverseg` utility. This tool will read the `gp_segment_configuration` table, identify the downed segment, and try to recover it using its related primary segment. However, for this recovery to work, the primary segment must be active.

**Investigate segment failures**

1. Check the `gp_segment_configuration` table to find the downed segments and their mirrors.
2. Read the master log file to determine when the failure occurred. Look for log entries that start with "FTS:".
3. Read the `gp_configuration_history` table to see a list of logged events.
4. Check the primary and mirror log files to understand why the segment failed.
5. Once you know the cause of the failure, use `gprecoverseg` to restore the segments.
6. To keep an eye on the recovery, use the `gpstate -e` command.

**Exercise**

1. Find the processes related to one of your database instances and stop it.
2. Watch the `gp_segment_configuration` table for any changes.
3. Next, read the master log file and again check the `gp_segment_configuration` table.
4. To fix the failed segment, use the recovery tools.
5. Confirm in the `gp_segment_configuration` table that the segment has been recovered.

## Lesson 9. Set up and manage the standby master instance in CBDB

**Understand the role of the standby master**

In the CBDB architecture, the master instance can be a single point of failure. To avoid this, it is recommended to set up and maintain a "standby master" instance. Typically, this standby instance is set up on a distinct server, referred to as the "standby master server" or "smdw".

**Manage standby master**

- To create the standby master (from the master server), use `gpinitstandby -s smdw`.
- If the standby master falls out-of-sync, you can resynchronize it using `gpinitstandby -n`.
- To remove the standby master, use `gpinitstandby -r`.

After setting up the standby instance, you can query the `gp_segment_configuration` table. In the table output, the new standby instance will be visible, which is identified by a `content` value of `-1` and a `role` value of `'m'`.

**Promote the standby master**

If the master server or master instance is unavailable, the standby master can step in to take its place. To promote the standby master to the role of the master, run the `gpactivatestandby` command from the standby server.

Upon running this command, the roles change: the standby master becomes the master, while the original master gets demoted to the role of the standby instance, although it remains offline. You can query the `gp_segment_configuration` table again to notice these changes.

**Exercise**

1. Create the standby master.
2. Remove the standby master.
3. Create the standby master again.
4. Activate this standby master to make it the primary master.
5. Create another standby master on the original master server.
6. Activate this new standby master.

Throughout these steps, keep an eye on the `gp_segment_configuration` table. This will help you understand the changes in roles and the state of each instance.

## Lesson 10. Expand a cluster

If you need to expand a cluster, you can use the `gpexpand` tool. You can add new hosts or more segments to the current hosts.

**Steps to expand a cluster**

1. Run `gpexpand` and answer questions.

    Run "gpexpand". In this step, you will be guided to answer questions about what you want to do. After answering all the questions, it makes a "configuration file" and stops. You should look at this file to check whether it is doing what you want.

2. Run `gpexpand -i <config_file>` to create new instances for the cluster.

    This step creates the new instances of the cluster. These new instances will show up in the `gp_segment_configuration` table. The cluster is now expanded, but the new instances do not have the data from users yet.

    `gpexpand` also makes a new area called the `gpexpand` schema. This area has a list of tables that need to be spread out in the next step.

3. Run `gpexpand` again to redistribute or spread out the data.

    Here, the data, which was only in the old instances, is now spread out to the expanded cluster. You can do this step many times by setting a time limit with the `-d` option. When all data is spread out, `gpexpand` stops.

4. Finish up.

    Now, the cluster is expanded and the data is spread out. The `gpexpand` schema is still there. You can look at it if you need to. It will not cause any problems.

    But if you want to expand the cluster again, `gpexpand` will tell you to remove it using `gpexpand -c` before it can continue.

**Exercise**

1. Run `gpexpand` to add more segments to your current servers.
2. Run `gpexpand` again to add segments on new servers.
3. Look at the `gp_segment_configuration` table to see how it changes with each action.

## Lesson 11. Check cluster performance

You can use the `gpcheckperf` utility to check performance on a set of hosts (cluster). This utility can be used to check the following:

- I/O performance per host (with the `-r -d` options)

    > Note: gpcheckperf will use the `dd` command to perform read test and write test on each host.

- Network performance (with the `-r -n|N|M` options)

    > Note: `-n` means sequential. `-N` means parallel with even number of hosts. `-M` means full matrix mode.

- Memory bandwidth test per host (with the `-r -s` options)

    > Note: The utility uses the STREAM benchmark program to measure sustainable memory bandwidth (in MB/s).

**Exercise**

Run `gpcheckcat` with the various options and interpret the results.

## Lesson 12. User data and table distribution

In CBDB, the master instance does not store user data. Segments store user data, and the data is not shared between segments.


All CBDB Database tables are distributed. When you create or alter a table, you optionally specify DISTRIBUTED BY (hash distribution), DISTRIBUTED RANDOMLY (random distribution), or DISTRIBUTED REPLICATED (fully distributed) to determine the table row distribution.

Consider the following points when deciding on a table distribution policy.

- *Even Data Distribution* — For the best possible performance, all segments should contain equal portions of data. If the data is unbalanced or skewed, the segments with more data must work harder to perform their portion of the query processing. Choose a distribution key that is unique for each record, such as the primary key.
- *Local and Distributed Operations* — Local operations are faster than distributed operations. Query processing is fastest if the work associated with join, sort, or aggregation operations is done locally, at the segment level. Work done at the system level requires distributing tuples across the segments, which is less efficient. When tables share a common distribution key, the work of joining or sorting on their shared distribution key columns is done locally. With a random distribution policy, local join operations are not an option.
- *Even Query Processing* — For best performance, all segments should handle an equal share of the query workload. Query workload can be skewed if a table's data distribution policy and the query predicates are not well matched. For example, suppose that a sales transactions table is distributed on the customer ID column (the distribution key). If a predicate in a query references a single customer ID, the query processing work is concentrated on just one segment.

The replicated table distribution policy (DISTRIBUTED REPLICATED) should be used only for small tables. Replicating data to every segment is costly in both storage and maintenance, and prohibitive for large fact tables. The primary use cases for replicated tables are to:

- remove restrictions on operations that user-defined functions can perform on segments, and
- improve query performance by making it unnecessary to broadcast frequently used tables to all segments.


In the following example, we can see the vaule "1" for c1 column is alwasy located in the same segment (gp_segment_id=1) if the table is distributed by hash.

```
gpadmin=# create table t1 (c1 int) distributed by (c1);
CREATE TABLE

gpadmin=# insert into t1 values (1);
INSERT 0 1
gpadmin=# insert into t1 values (1);
INSERT 0 1
gpadmin=# insert into t1 values (1);
INSERT 0 1
gpadmin=# insert into t1 values (1);
INSERT 0 1

gpadmin=# select gp_segment_id, * from t1;
 gp_segment_id | c1
---------------+----
             1 |  1
             1 |  1
             1 |  1
             1 |  1
(4 rows)

```

In the following example, we can see the vaule "1" for c1 column is randomly distributed on all segments (gp_segment_id=0 and gp_segment_id=1) if the table is distributed randomly.

```
gpadmin=# create table t2 (c1 int) distributed randomly;
CREATE TABLE

gpadmin=# insert into t2 values (1);
INSERT 0 1
gpadmin=# insert into t2 values (1);
INSERT 0 1
gpadmin=# insert into t2 values (1);
INSERT 0 1
gpadmin=# insert into t2 values (1);
INSERT 0 1

gpadmin=# select gp_segment_id, * from t2;
 gp_segment_id | c1
---------------+----
             0 |  1
             1 |  1
             1 |  1
             1 |  1
(4 rows)
```

Exercise: Reproduce the above with your own table and observe the effects.

## Lesson 13. Database catalog

System tables prefixed with *gp_* relate to the parallel features of CBDB Database. Tables prefixed with *pg_* are either standard PostgreSQL system catalog tables supported in CBDB Database, or are related to features CBDB that provides to enhance PostgreSQL for data warehousing workloads. Note that the global system catalog for CBDB Database resides on the coordinator instance.

Exercise: Run the following query to get a list of catalog table names.

```
select tablename from pg_tables where schemaname='pg_catalog';
```

## Lesson 14. CBDB data directories

In the master instance, the data directory is located at `/data0/database/master/gpseg-1`.

The following are the contents in the data directory of the master instance and coordinator instance:

```shell
[gpadmin@mdw gpseg-1]$ ls -tlr
```

```shell
total 156
-rw------- 1 gpadmin gpadmin     3 Aug 23 15:59 PG_VERSION
drwx------ 2 gpadmin gpadmin  4096 Aug 23 15:59 pg_twophase
drwx------ 2 gpadmin gpadmin  4096 Aug 23 15:59 pg_tblspc
drwx------ 2 gpadmin gpadmin  4096 Aug 23 15:59 pg_snapshots
drwx------ 2 gpadmin gpadmin  4096 Aug 23 15:59 pg_serial
drwx------ 2 gpadmin gpadmin  4096 Aug 23 15:59 pg_replslot
drwx------ 2 gpadmin gpadmin  4096 Aug 23 15:59 pg_notify
drwx------ 4 gpadmin gpadmin  4096 Aug 23 15:59 pg_multixact
drwx------ 2 gpadmin gpadmin  4096 Aug 23 15:59 pg_dynshmem
drwx------ 2 gpadmin gpadmin  4096 Aug 23 15:59 pg_cryptokeys
drwx------ 2 gpadmin gpadmin  4096 Aug 23 15:59 pg_commit_ts
-rw------- 1 gpadmin gpadmin    88 Aug 23 15:59 postgresql.auto.conf
-rw------- 1 gpadmin gpadmin  1636 Aug 23 15:59 pg_ident.conf
drwx------ 2 gpadmin gpadmin  4096 Aug 23 15:59 pg_xact
drwx------ 3 gpadmin gpadmin  4096 Aug 23 15:59 pg_wal
drwx------ 2 gpadmin gpadmin  4096 Aug 23 15:59 pg_subtrans
drwx------ 2 gpadmin gpadmin  4096 Aug 23 15:59 pg_distributedlog
-rw------- 1 gpadmin gpadmin 31760 Aug 23 15:59 postgresql.conf
-rw------- 1 gpadmin gpadmin    10 Aug 23 15:59 internal.auto.conf
-rw-rw-r-- 1 gpadmin gpadmin   860 Aug 23 15:59 gpssh.conf
drwx------ 6 gpadmin gpadmin  4096 Aug 23 15:59 base
-rw-rw-r-- 1 gpadmin gpadmin  4723 Aug 23 15:59 pg_hba.conf
-rw------- 1 gpadmin gpadmin    38 Aug 23 16:14 current_logfiles
-rw------- 1 gpadmin gpadmin   112 Aug 23 16:14 postmaster.opts
drwx------ 2 gpadmin gpadmin  4096 Aug 23 16:14 pg_stat
-rw------- 1 gpadmin gpadmin   130 Aug 23 16:14 gpsegconfig_dump
-rw------- 1 gpadmin gpadmin    88 Aug 23 16:14 postmaster.pid
drwx------ 2 gpadmin gpadmin  4096 Aug 23 16:14 log
drwx------ 2 gpadmin gpadmin  4096 Aug 23 16:14 global
drwx------ 4 gpadmin gpadmin  4096 Aug 23 16:39 pg_logical
drwx------ 2 gpadmin gpadmin  4096 Aug 23 16:44 pg_stat_tmp
```

In the segment instances, the data directory is located at `/data0/database/primary/gpseg0` and `/data0/database/primary/gpseg1`. The following are the contents in the data directory of a segment instance:

```shell
[gpadmin@mdw gpseg-1]$ cd /data0/database/primary/gpseg0
[gpadmin@mdw gpseg0]$ ls -ltr
```

```shell
total 180
drwx------ 2 gpadmin gpadmin  4096 Aug 23 15:59 pg_twophase
drwx------ 2 gpadmin gpadmin  4096 Aug 23 15:59 pg_tblspc
drwx------ 2 gpadmin gpadmin  4096 Aug 23 15:59 pg_snapshots
drwx------ 2 gpadmin gpadmin  4096 Aug 23 15:59 pg_serial
drwx------ 2 gpadmin gpadmin  4096 Aug 23 15:59 pg_notify
drwx------ 4 gpadmin gpadmin  4096 Aug 23 15:59 pg_multixact
drwx------ 2 gpadmin gpadmin  4096 Aug 23 15:59 pg_dynshmem
drwx------ 2 gpadmin gpadmin  4096 Aug 23 15:59 pg_cryptokeys
drwx------ 2 gpadmin gpadmin  4096 Aug 23 15:59 pg_commit_ts
-rw------- 1 gpadmin gpadmin     3 Aug 23 15:59 PG_VERSION
-rw------- 1 gpadmin gpadmin  1636 Aug 23 15:59 pg_ident.conf
drwx------ 2 gpadmin gpadmin  4096 Aug 23 15:59 pg_xact
drwx------ 2 gpadmin gpadmin  4096 Aug 23 15:59 pg_subtrans
drwx------ 2 gpadmin gpadmin  4096 Aug 23 15:59 pg_distributedlog
-rw------- 1 gpadmin gpadmin 31637 Aug 23 15:59 postgresql.conf
-rw------- 1 gpadmin gpadmin    10 Aug 23 15:59 internal.auto.conf
-rw------- 1 gpadmin gpadmin  4915 Aug 23 16:03 pg_hba.conf
drwx------ 7 gpadmin gpadmin  4096 Aug 23 16:03 base
drwx------ 3 gpadmin gpadmin  4096 Aug 23 16:03 pg_replslot
drwx------ 3 gpadmin gpadmin  4096 Aug 23 16:03 pg_wal
-rw------- 1 gpadmin gpadmin   120 Aug 23 16:03 postgresql.auto.conf
drwx------ 2 gpadmin gpadmin  4096 Aug 23 16:14 log
-rw------- 1 gpadmin gpadmin    38 Aug 23 16:14 current_logfiles
-rw------- 1 gpadmin gpadmin   112 Aug 23 16:14 postmaster.opts
-rw------- 1 gpadmin gpadmin    89 Aug 23 16:14 postmaster.pid
drwx------ 2 gpadmin gpadmin  4096 Aug 23 16:14 pg_stat
drwx------ 2 gpadmin gpadmin  4096 Aug 23 16:29 global
drwx------ 4 gpadmin gpadmin  4096 Aug 23 16:44 pg_logical
-rw------- 1 gpadmin gpadmin 32768 Aug 23 16:44 fts_probe_file.bak
drwx------ 2 gpadmin gpadmin  4096 Aug 23 16:44 pg_stat_tmp
```

**Exercise**

Explore the data directory and subdirectories. Take a look at the configuration files.

## Lesson 15. Instance processes

- postgres process: the process with the data directory in its name (-D ...) - this process is the parent for all other database processes and it handles connections to this instance

- logger process: writes log entries in the log file

- stats collector process: statistics collector is a subsystem that supports collection and reporting of information about server activity. Presently, the collector can count accesses to tables and indexes in both disk-block and individual-row terms.

- background writer process: writes "dirty" (new or modified) buffers to the on-disk datafiles.

- sweeper process: related to workload management and prioritization

- checkpoint process: performs checkpoints

- walwriter process: periodically flushes the WAL buffer to disk

- ftsprobe process: runs in the coordinator node, and periodically polls the segments to maintain the status of each segment.

- walsender process: runs in primary segment, and sends the WALs to the mirror segment

- walreceiver process:  runs in mirror segment, and receives WALs from primary segment

- conXXX: user connection worker process


#### master processes:

```
[gpadmin@mdw ~]$ ps aux|grep 5432
gpadmin   4409  0.0  0.4 209960 39776 ?        Ss   16:14   0:00 /usr/local/cloudberry-db/bin/postgres -D /data0/database/master/gpseg-1 -p 5432 -c gp_role=dispatch
gpadmin   4410  0.0  0.0  45544  5160 ?        Ss   16:14   0:00 postgres:  5432, master logger process
gpadmin   4412  0.0  0.1 210256  9484 ?        Ss   16:14   0:00 postgres:  5432, checkpointer
gpadmin   4413  0.0  0.0 210124  7440 ?        Ss   16:14   0:00 postgres:  5432, background writer
gpadmin   4414  0.0  0.1 210124 10304 ?        Ss   16:14   0:00 postgres:  5432, walwriter
gpadmin   4415  0.0  0.1 211544 12068 ?        Ss   16:14   0:00 postgres:  5432, autovacuum launcher
gpadmin   4416  0.0  0.0  45768  5672 ?        Ss   16:14   0:00 postgres:  5432, stats collector
gpadmin   4417  0.0  0.2 278596 22164 ?        Ssl  16:14   0:00 postgres:  5432, dtx recovery process
gpadmin   4418  0.0  0.2 278416 21624 ?        Ssl  16:14   0:00 postgres:  5432, ftsprobe process
gpadmin   4427  0.0  0.1 211492 11244 ?        Ss   16:14   0:00 postgres:  5432, logical replication launcher
gpadmin   4428  0.0  0.2 277792 17748 ?        Ssl  16:14   0:00 postgres:  5432, pg_cron launcher
gpadmin   4429  0.0  0.0 210124  5316 ?        Ss   16:14   0:00 postgres:  5432, sweeper process
gpadmin   4846  0.0  0.5 294692 48516 ?        Ssl  16:25   0:00 postgres:  5432, gpadmin gpadmin [local] con46 cmd172 idle
```

#### primary processes:

```
[gpadmin@mdw ~]$ ps aux|grep 40000
gpadmin   4373  0.0  0.5 212912 41404 ?        Ss   16:14   0:00 /usr/local/cloudberry-db/bin/postgres -D /data0/database/primary/gpseg0 -p 40000 -c gp_role=execute
gpadmin   4377  0.0  0.0  45540  5272 ?        Ss   16:14   0:00 postgres: 40000, logger process
gpadmin   4390  0.0  0.1 213212  9328 ?        Ss   16:14   0:00 postgres: 40000, checkpointer
gpadmin   4391  0.0  0.0 213076  7856 ?        Ss   16:14   0:00 postgres: 40000, background writer
gpadmin   4392  0.0  0.1 213076 10428 ?        Ss   16:14   0:00 postgres: 40000, walwriter
gpadmin   4393  0.0  0.1 213784  9948 ?        Ss   16:14   0:00 postgres: 40000, autovacuum launcher
gpadmin   4394  0.0  0.0  45768  5816 ?        Ss   16:14   0:00 postgres: 40000, stats collector
gpadmin   4395  0.0  0.0 213624  7984 ?        Ss   16:14   0:00 postgres: 40000, logical replication launcher
gpadmin   4396  0.0  0.0 212912  4480 ?        Ss   16:14   0:00 postgres: 40000, sweeper process
gpadmin   4400  0.0  0.1 214868 12432 ?        Ss   16:14   0:00 postgres: 40000, walsender gpadmin 172.17.0.2(37278) streaming 0/100F9088
```

#### mirror processes:

```
[gpadmin@mdw ~]$ ps aux|grep 41000
gpadmin   4375  0.0  0.5 212912 41196 ?        Ss   16:14   0:00 /usr/local/cloudberry-db/bin/postgres -D /data0/database/mirror/gpseg0 -p 41000 -c gp_role=execute
gpadmin   4379  0.0  0.0  45540  5160 ?        Ss   16:14   0:00 postgres: 41000, logger process
gpadmin   4383  0.0  0.1 213344 10908 ?        Ss   16:14   0:00 postgres: 41000, startup recovering 000000010000000000000004
gpadmin   4385  0.0  0.1 212912  8352 ?        Ss   16:14   0:00 postgres: 41000, checkpointer
gpadmin   4386  0.0  0.0 212912  6260 ?        Ss   16:14   0:00 postgres: 41000, background writer
gpadmin   4387  0.1  0.1 213788  9740 ?        Ss   16:14   0:04 postgres: 41000, walreceiver streaming 0/100F9088
```

Exercise: Try to identify the processes for the instances in your cluster.

## Lesson 16. Database log files

Each instance has its own log files which are located in the `<data_directory>/log` directory.

```shell
[gpadmin@mdw log]$ pwd

/data0/database/primary/gpseg0/log

[gpadmin@mdw log]$ ls -ltr

total 20
-rw------- 1 gpadmin gpadmin 8842 Aug 23 16:14 gpdb-2023-08-23_155951.csv
-rw------- 1 gpadmin gpadmin  468 Aug 23 16:14 startup.log
-rw------- 1 gpadmin gpadmin 3269 Aug 23 16:17 gpdb-2023-08-23_161424.csv
```

The standard log file name is `gpdb_<date>-<time>.csv`.

**Exercise**

Look at the log file and do different things in the database (create table, run queries, etc.)

## Lesson 17. Table types in CBDB: heap, AO, and AOCO

**Heap tables**

In CBDB, the standard table type is "heap". These tables store rows on pages, and one data file can contain multiple pages. They support common SQL tasks such as `SELECT`, `INSERT`, `UPDATE`, `DELETE`, and `TRUNCATE`. Each row in a heap table has a header. However, these tables do not support compression.

**AO tables**

Unlike heap tables, AO tables do not have a row header but they do allow compression. This feature makes AO tables a good fit for big fact tables.

**AOCO (column-oriented) tables**

For tasks that focus on single columns, like average (`AVG`) or sum, using row-oriented storage is not the ideal option. Instead, column-oriented tables, which store data by its column, are more efficient. This is because when you query one column, it does not get slowed down by the size or count of other columns.

AOCO tables offer compression, and they compress even better than AO tables. This is due to the consistent type of data in one file, which means that all data in a single column is of the same kind.

**Exercise**

Make a heap table, an AO table, and an AOCO table. After creating them, use the `\d+ psql` command to view the results.

## Lesson 18. External tables

CBDB supports external tables. These tables are set up in the database, but they link to data outside of the database. Here is where the data for these tables can come from:

- A file on your local filesystem.
- A file on a remote host (you need to use the `gpfdist` server for this).
- HDFS, which stands for the `gphdfs` type.
- Data generated on the spot with a command.

One good thing about external tables is that they make it easy to load data into CBDB. When you use a command like `INSERT INTO table SELECT * FROM ext_table`, data gets loaded all at once from different parts, instead of one piece at a time.

**Exercise**

Try making different types of external tables and play around with them to learn more.

## Lesson 19. Workload management

In CBDB, we have something called Resource Queues, or RQ for short. Think of an RQ as a group of sessions that need similar things and share resources. You can put any user into an RQ.

Also, there is a feature called Priority. You can set a priority level for a whole RQ, which means every session in that RQ will have that priority. But if you want, you can set a priority for just one session using the `gp_adjust_priority()` function.

**Exercise**

Make a user, set up an RQ, put the user in the RQ, then run a query. Watch and see what happens to the RQ.