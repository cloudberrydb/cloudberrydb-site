---
title: "[103-2] TPC-DS: Decision Support Benchmark for Cloudberry Database"
---

# [103-2] TPC-DS: Decision Support Benchmark for Cloudberry Database

This tool is based on the benchmark tool [Pivotal TPC-DS](https://github.com/pivotal/TPC-DS). This repo contains automation of running the DS benchmark on an existing CloudberryDB cluster.

:::note

TPC-DS is a decision support benchmark that models several generally applicable aspects of a decision support system, including queries and data maintenance. The benchmark provides a representative evaluation of performance as a general purpose decision support system. A benchmark result measures query response time in single user mode, query throughput in multi user mode and data maintenance performance for a given hardware, operating system, and data processing system configuration under a controlled, complex, multi-user decision support workload. The purpose of TPC benchmarks is to provide relevant, objective performance data to industry users. You can learn more about TPC-DS from the [TPC website](https://www.tpc.org/tpcds/default5.asp). 

:::

## Context

### Supported TPC-DS Versions

TPC has published the following TPC-DS standards over time:

| TPC-DS Benchmark Version | Published Date | Standard Specification |
|-|-|-|
| 3.2.0 (latest) | 06/15, 2021 | http://www.tpc.org/tpc_documents_current_versions/pdf/tpc-ds_v3.2.0.pdf |
| 2.1.0 | 11/12, 2015 | http://www.tpc.org/tpc_documents_current_versions/pdf/tpc-ds_v2.1.0.pdf |
| 1.3.1 (earliest) | 02/19, 2015 | http://www.tpc.org/tpc_documents_current_versions/pdf/tpc-ds_v1.3.1.pdf |

As of version 1.2 of this tool TPC-DS 3.2.0 is used.

## Setup

### Prerequisites

This is a follow-up tutorial for previous bootcamp steps. Please make sure to have the environment ready for Cloudberry Database Sandbox up and running.

All the following examples use the standard hostname convention of CloudberryDB using `mdw` for master node, and `sdw1..n` for the segment nodes.

### TPC-DS Tools Dependencies

Install the dependencies on `mdw` for compiling the `dsdgen` (data generation) and `dsqgen` (query generation).

```bash
docker exec -it $(docker ps -q) /bin/bash
yum -y install gcc make byacc
```

The source code is from http://tpc.org/tpc_documents_current_versions/current_specifications5.asp.

### Packages

TPC-H and TPC-DS packages are already under "mdw:/tmp/" folder.

```bash
[gpadmin@mdw tmp]$ ls -rlt
-rw-rw-r--  1 root    root    24520013 Jul 27 14:18 TPC-H-CBDB.tar.gz
-rw-rw-r--  1 root    root     7096941 Jul 27 14:18 TPC-DS-CBDB.tar.gz
```

### Execution

To run the benchmark, login as `gpadmin` on `mdw` in the CloudberryDB Sandbox, and execute the following command::

```bash
su - gpadmin
tar xzf TPC-DS-CBDB.tar.gz
cd ~/TPC-DS-CBDB
./run.sh
```

The TPC-DS benchmark needs a few minutes to run before you get the final report, which depends on your machine's hardware. You may check the TPC-DS execution log information file under the same directory with a similar name as below.

```
tpcds_20231109_153553.log
```