---
title: gpsupport
---

# gpsupport

The `gpsupport` tool provides a set of diagnostic utilities to troubleshoot and resolve common supportability issues, along with a consistent method for gathering information.

## Synopsis

```shell
gpsupport <tool> [<tool_options> ...] 

gpsupport -hostfile <file>

gpsupport -help

gpsupport -verbose
```

## Tools

**Cloudberry**

**`[analyze_session](/i18n/zh/docusaurus-plugin-content-docs/current/db-utilities/db-util-gpsupport-analyze-session.md)`**

Collect information from a hung Cloudberry Database session for remote analysis.

**`catalogbackup`**

Back up catalog prior to performing catalog repairs.

**`[gp_log_collector](/i18n/zh/docusaurus-plugin-content-docs/current/db-utilities/db-util-gpsupport-gp-log-collector.md)`**

Basic Cloudberry Database log collection utility.

**`[storage_rca_collector](/i18n/zh/docusaurus-plugin-content-docs/current/db-utilities/db-util-gpsupport-gp-storage-rca-collector.md)`**

Collect storage-related artifacts.

**`gpcheckup`**

Cloudberry Database Health Check.

**`[gpstatscheck](/i18n/zh/docusaurus-plugin-content-docs/current/db-utilities/db-util-gpsupport-gpstatscheck.md)`**

Check for missing stats on objects used in a query.

**`[packcore](/i18n/zh/docusaurus-plugin-content-docs/current/db-utilities/db-util-gpsupport-packcore.md)`**

Package core files into single tarball for remote analysis.

**`primarymirror_lengths`**

Check whether primary and mirror AO and AOCO relfiles are the correct lengths.

**`tablecollect`**

Collect data and index files for data corruption RCA.

### Miscellaneous

**`hostfile`**

Generate hostfiles for use with other tools.

**`replcheck`**

Check whether tool is replicated to all hosts.

**`replicate`**

Replicate tool to all hosts.

**`version`**

Display the gpsupport version.

## Global options

**`-hostfile`**

Limit the hosts where the tool will be run.

**`-help`**

Display the online help.

**`-verbose`**

Print verbose log messages.

## Examples

**Display gpsupport version**

```shell
gpsupport version
```

**Collect a core file**

```shell
gpsupport packcore -cmd collect -core core.1234
```

**Show help for a specific tool**

```shell
gpsupport gp_log_collector -help
```
