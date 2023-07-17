---
title: ALTER ROLE
description: 了解 SQL 语句 ALTER ROLE 在 Cloudberry Database 中的用法。
---

# ALTER ROLE

更改数据库的角色（用户或组）。

## 概要

```sql 
ALTER ROLE <name> RENAME TO <newname>

ALTER ROLE <name> SET <config_parameter> {TO | =} {<value> | DEFAULT}

ALTER ROLE <name> RESET <config_parameter>

ALTER ROLE <name> RESOURCE QUEUE {<queue_name> | NONE}

ALTER ROLE <name> [ [WITH] <option> [ ... ] ]
```

其中 `<option>` 可以是：

```sql
| SUPERUSER | NOSUPERUSER
| CREATEDB | NOCREATEDB
| CREATEROLE | NOCREATEROLE
| CREATEEXTTABLE | NOCREATEEXTTABLE 
    [ ( <attribute>='<value>'[, ...] ) ]
        where <attributes> and <value> are:
        type='readable'|'writable'
        protocol='gpfdist'|'http'
| INHERIT | NOINHERIT
| LOGIN | NOLOGIN
| CONNECTION LIMIT <connlimit>
| [ENCRYPTED | UNENCRYPTED] PASSWORD '<password>'
| VALID UNTIL '<timestamp>'
| [ DENY <deny_point> ]
| [ DENY BETWEEN <deny_point> AND <deny_point>]
| [ DROP DENY FOR <deny_point> ]
```

## 描述

`ALTER ROLE` 更改 Cloudberry Database 数据库角色的属性。此命令有几种形式：

-  **RENAME**：更改角色的名称。数据库超级用户可以重命名任何角色。具有 `CREATE ROLE` 权限的角色可以重命名非超级用户角色。当前会话用户无法重命名（可以通过其他用户身份连接来重命名角色）。当密码为 MD5 加密时，重命名角色会清除密码。
-  **SET | RESET**：更改指定角色的会话默认值。每当角色启动新会话时，指定的值将成为会话默认值，覆盖服务器配置文件（`postgresql.conf`）中存在的任何设置。对于没有 `LOGIN` 权限的角色，会话默认值无效。普通角色可以更改自己的会话默认值。超级用户可以更改任何角色的会话默认值。具有 `CREATE ROLE` 权限的角色可以更改非超级用户的会话默认值。
-  **RESOURCE QUEUE**：将角色分配给资源队列。在发出查询时，角色将受到所分配的资源队列的限制。参数为 `NONE`，表示将角色分配给默认资源队列。一个角色只能属于一个资源队列。对于没有 `LOGIN` 特权 的角色，资源队列不起作用。
-  **WITH 选项**：更改角色的属性。如果命令中未提及某个属性，则保留其先前的设置。数据库超级用户可以更改所有角色的所有设置。拥有 `CREATE ROLE` 权限的角色可以更改非超级用户和非复制角色的所有设置。普通角色只能更改自己的密码。

## 参数

- **name**：角色的名称，其属性将被更改。
- **newname**：角色的新名称。
- **config_parameter=value**：将会话默认的参数值设置为给定值。如果设置为 `DEFAULT` 或者 `RESET`，将删除角色特定的参数设置，因此该角色将在新会话中继承系统范围的默认设置。使用 `RESET ALL` 清除所有特定的角色设置。
- **queue_name**：要分配给此角色的资源组的名称。只有拥有 `LOGIN` 权限的角色才可以分配给资源队列。如果设置为 NONE，则代表要从资源队列中移除角色并将其放入默认资源队列中。一个角色只能属于一个资源队列。
- **SUPERUSER | NOSUPERUSER**,<br />
    **CREATEDB | NOCREATEDB**,<br />
    **CREATEROLE | NOCREATEROLE**,<br />
    **CREATEEXTTABLE | NOCREATEEXTTABLE [(attribute='value')]**：<br />
    如果指定了 `CREATEEXTTABLE`，则允许角色创建外部表。如果没被指定，则默认类型为可读，并且默认协议是 gpfdist。`NOCREATEEXTTABLE`（默认）不允许角色创建外部表。注意，使用 `file` 或 `execute` 协议的外部表只能由超级用户创建。
- **INHERIT | NOINHERIT**,<br />
    **LOGIN | NOLOGIN**,<br />
    **CONNECTION LIMIT connlimit**,<br />
    **PASSWORD password**,<br />
    **ENCRYPTED | UNENCRYPT**,<br />
    **VALID UNTIL 'timestamp'**：<br />
    这些子句改变了最初由 `CREATE ROLE` 设置的角色属性。
- **DENY deny_point**,<br />
    **DENY BETWEEN deny_point AND deny_point**：<br />
    `DENY` 和 `DENY BETWEEN` 用于设置登录时强制执行的基于时间的约束。`DENY` 设置拒绝访问的日期或日期和时间。`DENY BETWEEN` 设置拒绝访问的时间间隔。两者都使用具有以下格式的参数 `deny_point`：

    ```sql
    DAY day [ TIME 'time' ]
    ```

    `deny_point` 两部分参数使用以下格式：

    - 对于 `day`：

        ```sql
        {'Sunday' | 'Monday' | 'Tuesday' |'Wednesday' | 'Thursday' | 'Friday' | 
        'Saturday' | 0-6 }
        ```

    - 对于 `time`：`{ 00-23 : 00-59 | 01-12 : 00-59 { AM | PM }}`。该 `DENY BETWEEN` 子句使用两个必须指示日期和时间的`deny_point` 参数：

        ```sql
        DENY BETWEEN deny_point AND deny_point
        ```

## 注解

使用 `GRANT` 和 `REVOKE` 用于添加和删除角色成员资格。

使用此命令时需要谨慎，因为密码未加密。密码将明文发送到服务器，并可能记录在客户端命令的历史记录或服务器日志中。建议使用 `psql` 命令行客户端的 `\password` 命令更改角色的密码，以免暴露明文密码。

此外，你还可以将会话默认值绑定到特定数据库，而不是特定角色。如果存在冲突，则特定于角色的设置将覆盖数据库的设置。

## 示例

更改角色的密码：

```sql
ALTER ROLE daria WITH PASSWORD 'passwd123';
```

更改密码到期日期：

```sql
ALTER ROLE scott VALID UNTIL 'May 4 12:00:00 2015 +1';
```

使密码永久有效：

```sql
ALTER ROLE luke VALID UNTIL 'infinity';
```

赋予角色创建其他角色和新数据库的能力：

```sql
ALTER ROLE joelle CREATEROLE CREATEDB;
```

为 `maintenance_work_mem` 参数设置非默认值：

```sql
ALTER ROLE admin SET maintenance_work_mem = 100000;
```

将角色分配给资源队列：

```sql
ALTER ROLE sammy RESOURCE QUEUE poweruser;
```

授予角色创建可写外部表的权限：

```sql
ALTER ROLE load CREATEEXTTABLE (type='writable');
```

不允许角色在星期日登录：

```sql
ALTER ROLE user3 DENY DAY 'Sunday';
```

移除角色不能在星期日登录的约束：

```sql
ALTER ROLE user3 DROP DENY FOR DAY 'Sunday';
```

## 兼容性

`ALTER ROLE` 语句是一个 Cloudberry Database 的语法扩展。

## 另见

`CREATE ROLE`，`DROP ROLE`，`SET`，`CREATE RESOURCE QUEUE`，`GRANT`，`REVOKE`
