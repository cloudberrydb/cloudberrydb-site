---
title: gpstate
---

# gpstate

Shows the status of a running Cloudberry Database system.

## Synopsis

```shell
gpstate [-d <coordinator_data_directory>] [-B <parallel_processes>] 
          [-s | -b | -Q | -e] [-m | -c] [-p] [-i] [-f] [-v | -q] | -x 
          [-l <log_directory>]

gpstate -? | -h | --help
```

## Description

The `gpstate` utility displays information about a running Cloudberry Database instance. There is additional information you may want to know about a Cloudberry Database system, since it is comprised of multiple PostgreSQL database instances (segments) spanning multiple machines. The `gpstate` utility provides additional status information for a Cloudberry Database system, such as:

- Which segments are down.
- Coordinator and segment configuration information (hosts, data directories, etc.).
- The ports used by the system.
- A mapping of primary segments to their corresponding mirror segments.

## Options

**`-b (brief status)`**

Optional. Display a brief summary of the state of the Cloudberry Database system. This is the default option.

**`-B parallel_processes`**

The number of segments to check in parallel. You are expected to specify a number following this option, for example, `gpstate -B 3`.

**`-c (show primary to mirror mappings)`**

Optional. Display mapping of primary segments to their corresponding mirror segments.

**`-d coordinator_data_directory`**

Optional. The coordinator data directory. You are expected to specify the data directory following this option, for example, `gpstate -d /data/master/gpseg-1`.

**`-e (show segments with mirror status issues)`**

Show details on primary/mirror segment pairs that have potential issues. These issues include:

- Whether any segments are down.
- Whether any primary-mirror segment pairs are out of sync – including information on how many bytes are remaining to sync (as displayed in the `WAL sync remaining bytes` output field).

:::info
`gpstate -e`does not display segment pairs that are in sync.
:::

- Whether any primary-mirror segment pairs are not in their preferred roles.

**`-f (show standby coordinator details)`**
Display details of the standby coordinator host if configured.

**`-i (show Cloudberry Database version)`**

Display the Cloudberry Database software version information for each instance.

**`-l logfile_directory`**

The directory to write the log file. Defaults to `~/gpAdminLogs`.

**`-m (list mirrors)`**

Optional. List the mirror segment instances in the system and their current role.

**`-p (show ports)`**

List the port numbers used throughout the Cloudberry Database system.

**`-q (no screen output)`**

Optional. Run in quiet mode. Except for warning messages, command output is not displayed on the screen. However, this information is still written to the log file.

**`-Q (quick status)`**

Optional. Checks segment status in the system catalog on the coordinator host. Does not poll the segments for status.

**`-s (detailed status)`**

Optional. Displays detailed status information about the Cloudberry Database system.

**`-v (verbose output)`**

Optional. Displays error messages and outputs detailed status and progress information.

**`-x (expand)`**

Optional. Displays detailed information about the progress and state of a Cloudberry Database system expansion.

**`-? | -h | --help (help)`**

Displays the online help.

## Output Field Definitions

The following output fields are reported by `gpstate -s` for the coordinator:

|Output Data|Description|
|-----------|-----------|
|Coordinator host|host name of the coordinator|
|Coordinator postgres process ID|PID of the coordinator database listener process|
|Coordinator data directory|file system location of the coordinator data directory|
|Coordinator port|port of the coordinator `postgres` database listener process|
|Coordinator current role|dispatch = regular operating mode<br/><br/>utility = maintenance mode|
|CloudberryDB array configuration type|Standard = one NIC per host<br/><br/>Multi-Home = multiple NICs per host|
|CloudberryDB initsystem version|version of Cloudberry Database when system was first initialized|
|CloudberryDB current version|current version of Cloudberry Database|
|Postgres version|version of PostgreSQL that Cloudberry Database is based on|
|CloudberryDB mirroring status|physical mirroring or none|
|Coordinator standby|host name of the standby coordinator|
|Standby coordinator state|status of the standby coordinator: active or passive|

The following output fields are reported by `gpstate -s` for each primary segment:

|Output Data|Description|
|-----------|-----------|
|Hostname|system-configured host name|
|Address|network address host name (NIC name)|
|Datadir|file system location of segment data directory|
|Port|port number of segment `postgres` database listener process|
|Current Role|current role of a segment: Mirror or Primary|
|Preferred Role|role at system initialization time: Mirror or Primary|
|Mirror Status|status of a primary/mirror segment pair:<br/><br/>Synchronized = data is up to date on both<br/><br/>Not in Sync = the mirror segment has not caught up to the primary segment|
|Current write location|Location where primary segment is writing new logs as they come in|
|Bytes remaining to send to mirror|Bytes remaining to be sent from primary to mirror|
|Active PID|active process ID of a segment|
|Configuration reports status as|segment status as reported in the system catalog: Up or Down|
|Database status|status of Cloudberry Database to incoming requests: Up, Down, or Suspended. A Suspended state means database activity is temporarily paused while a segment transitions from one state to another.|

The following output fields are reported by `gpstate -s` for each mirror segment:

|Output Data|Description|
|-----------|-----------|
|Hostname|system-configured host name|
|Address|network address host name (NIC name)|
|Datadir|file system location of segment data directory|
|Port|port number of segment `postgres` database listener process|
|Current Role|current role of a segment: Mirror or Primary|
|Preferred Role|role at system initialization time: Mirror or Primary|
|Mirror Status|status of a primary/mirror segment pair:<br/><br/>Synchronized = data is up to date on both<br/><br/>Not in Sync = the mirror segment has not caught up to the primary segment|
|WAL Sent Location|Log location up to which the primary segment has sent log data to the mirror|
|WAL Flush Location|Log location up to which the mirror segment has flushed the log data to disk|
|WAL Replay Location|Log location up to which the mirror segment has replayed logs locally|
|Bytes received but remain to flush|Difference between flush log location and sent log location|
|Bytes received but remain to replay|Difference between replay log location and sent log location|
|Active PID|active process ID of a segment|
|Configuration reports status as|segment status as reported in the system catalog: Up or Down|
|Database status|status of Cloudberry Database to incoming requests: Up, Down, or Suspended. A Suspended state means database activity is temporarily paused while a segment transitions from one state to another.|

:::info
When there is no connection between a primary segment and its mirror, `gpstate -s` displays `Unknown` in the following fields:

- `Bytes remaining to send to mirror`
- `WAL Sent Location`
- `WAL Flush Location`
- `WAL Replay Location`
- `Bytes received but remain to flush`
- `Bytes received but remain to replay`
:::

The following output fields are reported by `gpstate -f` for standby coordinator replication status:

|Output Data|Description|
|-----------|-----------|
|Standby address|hostname of the standby coordinator|
|Standby data dir|file system location of the standby coordinator data directory|
|Standby port|port of the standby coordinator `postgres` database listener process|
|Standby PID|process ID of the standby coordinator|
|Standby status|status of the standby coordinator: Standby host passive|
|WAL Sender State|write-ahead log (WAL) streaming state: streaming, startup,backup, catchup|
|Sync state|WAL sender synchronization state: sync|
|Sent Location|WAL sender transaction log (xlog) record sent location|
|Flush Location|WAL receiver xlog record flush location|
|Replay Location|standby xlog record replay location|

## Examples

Show detailed status information of a Cloudberry Database system:

```shell
gpstate -s
```

Do a quick check for down segments in the coordinator host system catalog:

```shell
gpstate -Q
```

Show information about mirror segment instances:

```shell
gpstate -m
```

Show information about the standby coordinator configuration:

```shell
gpstate -f
```

Display the Cloudberry Database software version information:

```shell
gpstate -i
```

## See also

[gpstart](/docs/sys-utilities/gpstart.md), [gpexpand](/docs/sys-utilities/gpinitsystem.md), [gplogfilter](/docs/sys-utilities/gplogfilter.md)
