---
title: ALTER GROUP
description: 了解 SQL 语句 ALTER GROUP 在 Cloudberry Database 中的用法。
---

# ALTER GROUP

`ALTER GROUP` 语句用于更改角色名称或成员关系。

## 概要

```sql
ALTER GROUP <groupname> ADD USER <username> [, ... ]

ALTER GROUP <groupname> DROP USER <username> [, ... ]

ALTER GROUP <groupname> RENAME TO <newname>
```

## 描述

`ALTER GROUP` 是一个被废弃的命令，为了向后兼容而被保留下来。`GROUP`（和 `USER`）已被 `ROLE` 所取代。

## 参数

- **groupname**：要修改的组（角色）的名称。
- **username**：要添加到组或从组中删除的用户（角色）。用户（角色）必须已经存在。
- **newname**：组（角色）的新名称。

## 示例

将用户添加到组中：

```sql
ALTER GROUP staff ADD USER karl, john;
```

从组中删除用户：

```sql
ALTER GROUP workers DROP USER beth;
```

## 兼容性

在 SQL 标准中没有 `ALTER GROUP` 语句。

### 另见

`ALTER ROLE`，`GRANT`，`REVOKE`
