---
title: CREATE RESOURCE GROUP
---

# CREATE RESOURCE GROUP

Defines a new resource group.

## Synopsis

```sql
CREATE RESOURCE GROUP <name> WITH (<group_attribute>=<value> [, ... ])
```

where group_attribute is one of:

```sql
CPU_MAX_PERCENT=<integer> | CPUSET=<coordinator_cores>;<segment_cores>
[ MEMORY_LIMIT=<integer> ]
[ CPU_WEIGHT=<integer> ]
[ CONCURRENCY=<integer> ]
[ MIN_COST=<integer> ]
```

## Description

Creates a new resource group for Cloudberry Database resource management. You can create resource groups to manage resources for roles or to manage the resources of a Cloudberry Database external component such as PL/Container.

A resource group that you create to manage a user role identifies concurrent transaction, memory, and CPU limits for the role when resource groups are enabled. You may assign such resource groups to one or more roles.

A resource group that you create to manage the resources of a Cloudberry Database external component such as PL/Container identifies the memory and CPU limits for the component when resource groups are enabled. These resource groups use cgroups for both CPU and memory management. Assignment of resource groups to external components is component-specific. For example, you assign a PL/Container resource group when you configure a PL/Container runtime. You cannot assign a resource group that you create for external components to a role, nor can you assign a resource group that you create for roles to an external component.

You must have `SUPERUSER` privileges to create a resource group. The maximum number of resource groups allowed in your Cloudberry Database cluster is 100.

Cloudberry Database pre-defines two default resource groups: `admin_group` and `default_group`. These group names, as well as the group name `none`, are reserved.

To set appropriate limits for resource groups, the Cloudberry Database administrator must be familiar with the queries typically run on the system, as well as the users/roles running those queries and the external components they may be using, such as PL/Containers.

After creating a resource group for a role, assign the group to one or more roles using the [ALTER ROLE](/docs/sql-stmts/alter-role.md) or [CREATE ROLE](/docs/sql-stmts/create-role.md) commands.

After you create a resource group to manage the CPU and memory resources of an external component, configure the external component to use the resource group. For example, configure the PL/Container runtime `resource_group_id`.

## Parameters

**`name`**

The name of the resource group.

**`CONCURRENCY integer`**

Optional. The maximum number of concurrent transactions, including active and idle transactions, that are permitted for this resource group. The `CONCURRENCY` value must be an integer in the range [0 .. `max_connections`]. The default `CONCURRENCY` value for resource groups defined for roles is 20.

You must set `CONCURRENCY` to `0` for resource groups that you create for external components.

> **Note** You cannot set the `CONCURRENCY` value for the `admin_group` to `0`.

**`CPU_MAX_PERCENT integer`**

Optional. The percentage of the maximum available CPU resources that the resource group can use. The value range is `1-100`. 

**`CPU_WEIGHT integer`**

Optional. The scheduling priority of the current group. The value range is `1-500`, the default is `100. 

**`CPUSET <coordinator_cores>;<segment_cores>`**

`CPUSET` identifies the CPU cores to reserve for this resource group on the coordinator host and on segment hosts. The CPU cores that you specify must be available in the system and cannot overlap with any CPU cores that you specify for other resource groups.

> **Note** You must specify either `CPU_MAX_PERCENT` or `CPUSET` when you create a resource group, but not both.

Specify cores as a comma-separated list of single core numbers or core number intervals. Define the coordinator host cores first, followed by segment host cores, and separate the two with a semicolon. You must enclose the full core configuration in single quotes. For example, '1;1,3-4' configures core 1 for the coordinator host, and cores 1, 3, and 4 for the segment hosts.

> **Note** You can configure `CPUSET` for a resource group only after you have enabled resource group-based resource management for your Cloudberry Database cluster.

**`MEMORY_LIMIT integer`**

Optional. The maximum available memory, in MB, to reserve for this resource group. This value determines the total amount of memory that all worker processes within a resource group can consume on a segment host during query execution. 

The minimum memory quantity you can specify for a resource group is `0`. The default value is `-1`. 

When you specify a `MEMORY_LIMIT` of `-1`, `MEMORY LIMIT` takes the value of the `statement_mem` server configuration parameter. 

> **Note** If the server configuration parameter `gp_resgroup_memory_query_fixed_mem` is set, its value overrides at the session level the value of `MEMORY_LIMIT`.

**`MIN_COST integer`**

Optional. The limit on the cost of the query plan generated by a query in this resource group. When the query plan cost of the query is less than this value, the query will be unassigned from the resource group to which it belongs. 

This means that low-cost queries will execute more quickly, as they are not subject to resource constraints. 

The value range is `0-500`. The default value is `0`, which means that the cost is not used to bypass the query. 

## Notes

You cannot submit a `CREATE RESOURCE GROUP` command in an explicit transaction or sub-transaction.

Use the `gp_toolkit.gp_resgroup_config` system view to display the limit settings of all resource groups:

```sql
SELECT * FROM gp_toolkit.gp_resgroup_config;
```

## Examples

Create a resource group with CPU and memory limit percentages of 35:

```sql
CREATE RESOURCE GROUP rgroup1 WITH (CPU_MAX_PERCENT=35, MEMORY_LIMIT=35);
```

Create a resource group with a concurrent transaction limit of 20, a memory limit of 15, and a CPU limit of 25:

```sql
CREATE RESOURCE GROUP rgroup2 WITH (CONCURRENCY=20, 
  MEMORY_LIMIT=15, CPU_MAX_PERCENT=25);
```

Create a resource group to manage PL/Container resources specifying a memory limit of 10, and a CPU limit of 10:

```sql
CREATE RESOURCE GROUP plc_run1 WITH (MEMORY_LIMIT=10, CPU_MAX_PERCENT=10,
  CONCURRENCY=0);
```

Create a resource group with a memory limit percentage of 11 to which you assign CPU core 1 on the coordinator host, and cores 1 to 3 on segment hosts:

```sql
CREATE RESOURCE GROUP rgroup3 WITH (CPUSET='1;1-3', MEMORY_LIMIT=11);
```

## Compatibility

`CREATE RESOURCE GROUP` is a Cloudberry Database extension. There is no provision for resource groups or resource management in the SQL standard.

## See also

[ALTER ROLE](/docs/sql-stmts/alter-role.md), [CREATE ROLE](/docs/sql-stmts/create-role.md), [ALTER RESOURCE GROUP](/docs/sql-stmts/alter-resource-group.md), [DROP RESOURCE GROUP](/docs/sql-stmts/drop-resource-group.md)
