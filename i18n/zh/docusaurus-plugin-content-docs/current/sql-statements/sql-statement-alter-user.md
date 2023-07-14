---
title: ALTER USER
description: 了解 SQL 语句 ALTER USER 在 Cloudberry Database 中的用法。
---

# ALTER USER

`ALTER USER` 语句用于更改数据库用户（角色）的定义。

## 概要

```sql
ALTER USER <name> RENAME TO <newname>

ALTER USER <name> SET <config_parameter> {TO | =} {<value> | DEFAULT}

ALTER USER <name> RESET <config_parameter>

ALTER USER <name> [ [WITH] <option> [ ... ] ]
```

其中，<option> 可以是：

```sql
      SUPERUSER | NOSUPERUSER
    | CREATEDB | NOCREATEDB
    | CREATEROLE | NOCREATEROLE
    | CREATEUSER | NOCREATEUSER
    | INHERIT | NOINHERIT
    | LOGIN | NOLOGIN
    | [ENCRYPTED | UNENCRYPTED] PASSWORD '<password>'
    | VALID UNTIL '<timestamp>'
```

## 描述

`ALTER USER` 是一个已弃用的命令，但由于历史原因仍然被保留，它是 `ALTER ROLE` 的别名。

## 兼容性

`ALTER USER` 语句是 Cloudberry Database 数据库的语法扩展。

## 另见

`ALTER ROLE`
