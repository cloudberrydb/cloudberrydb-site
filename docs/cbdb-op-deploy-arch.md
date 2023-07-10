---
title: Local Deployment Architectures
---

# Local Deployment Architectures

Before reading this document, you are recommended to first understand the architecture of the Cloudberry Database by referring to the [Cloudberry Database Architecture](./cbdb-architecture.md).

This document introduces two architecture options for deploying the Cloudberry Database on your local machine: the "active-standby architecture" and the "automatic high-availability architecture". The main difference between the two is whether or not manual operation and maintenance is required to recover the database from master/standby node failures. Before deploying Cloudberry Database on your local machine, you need to understand these 2 architectures and choose according to your actual needs.

| Deployment architecture | Benefits or advantages | Costs or risks |
| ------------------------ | ---- | ---- |
| Active-standby architecture (default mode) | <ul><li>Similar to the traditional Greenplum architecture. Can make better use of Greenplum's ecological tools.</li><li>No need to deploy high-availability components separately, and the resource requirements are slightly lower.</li></ul> | <ul><li>After the master node is down, the database cannot automatically recover from the failure, and the metadata cannot be updated in time. </li><li>After the master/standby node fails, manual intervention is required for recovery, which might require some manual maintenance costs. </li></ul> |
| Automatic high-availability architecture | After the master/standby node fails:<ul><li>The system automatically switches nodes, with high reliability.</li><li>No manual intervention is required, saving manual maintenance costs.</li></ul> | Needs additional deployment of high-availability related components (fault detection, recovery nodes, and ETCD clusters). |

:::info Glossary

- FTS, or Fault Tolerance Service, represents the fault recovery nodes and a high-availability service component within the Cloudberry Database.
- ETCD: Used to store the cluster topology information and cluster state metadata of Cloudberry Database.
- MPP, or Massively Parallel Processing, refers to the method of processing data on many processors simultaneously in a coordinated way.

:::

## Active-standby architecture (default)

The active-standby architecture is the default deployment architecture of Cloudberry Database on physical machines, which is compatible with Greenplum Database architecture and tool ecosystem. With this deployment architecture, Cloudberry Database behaves the same as traditional Greenplum Database.

In this deployment architecture, you do not need to deploy FTS nodes and ETCD component services. However, in this architecture, the master and standby nodes do not support automatic failure recovery, necessitating manual node switching to recover from failures. The failure recovery might take a long time and the operation is complicated.

The architecture is shown in the figure below:

![Active-standby deployment architecture](./media/cbdb-deploy-manual-high-avail.png)

## Automatic high-availability architecture

In the automatic high-availability architecture, if the master/standby node of the database fails, the system automatically switches nodes. This eliminates the need for time-consuming and complicated manual operations, thereby improving the system's availability and reliability.

With the automatic high-availability architecture, you need to deploy additional FTS high-availability nodes and ETCD service components in the cluster:

- FTS high-availability service: This service operates independently from the master node and is deployed within the cluster. The FTS cluster has only one working node, and the rest of the nodes are hot standby nodes. When the FTS master node is abnormal, the service can automatically switch to the hot standby node. This mechanism is used to ensure that any database node downtime or abnormality will not affect the high availability of FTS and the normal operation of the database function.
- ETCD service component: Used to store and maintain database cluster state metadata. ETCD cluster is guaranteed high availability by the service mechanism itself, and any node downtime or abnormality will not affect the normal operation of ETCD service and database functions.

You can either use separate physical machine resources to deploy the FTS and ETCD clusters or deploy these clusters in a hybrid manner on the same physical machine as the data nodes.

The architecture is shown in the figure below:

![Automatic high-availability architecture](./media/cbdb-deploy-auto-high-avail.png)

:::info Implementation details

The automatic failover for the master node is implemented based on the WAL log synchronization mechanism between the master/standby nodes. When the database log synchronization is abnormal, the master node does not support automatic failover recovery. Once the master/standby log is successfully synchronized, the cluster log synchronization status is updated in the ETCD service, to indicate whether the current master node meets the conditions for automatic failover recovery.

- When the master node is down, only when the log status saved in ETCD is detected as synchronized, the standby node will be automatically promoted to the new master node.
- When the master node is down, if the log status saved in ETCD is detected as unsynchronized, the standby node will not be automatically promoted to the new master node. In this case, the automatic switching between the master/standby nodes might have unpredictable impacts on the database. Therefore, user intervention is still required to confirm the issue and then manually switch node to recover the database system.

:::