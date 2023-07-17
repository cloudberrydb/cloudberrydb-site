---
title: ABORT
description: 了解 SQL 语句 ABORT 在 Cloudberry Database 中的用法。
---

# ABORT

`ABORT` 语句用于回滚当前的事务，并丢弃该事务的所有更新。这个语句在行为上与标准 SQL 语句 `ROLLBACK` 相同，当前 `ABORT` 语句只是出于历史原因而存在。

## 概要

```sql 
ABORT [WORK | TRANSACTION]
```

## 参数

`WORK` 和 `TRANSACTION` 为可选关键字，对 `ABORT` 操作没有影响。

## 注意事项

使用 `COMMIT` 成功终止一个事务。

在一个事务块之外发送 `ABORT` 语句会发出一个警告信息，但不会产生效果。

## 兼容性

由于历史原因，这是 Cloudberry Database 数据库的扩展命令，与标准 SQL 命令 `ROLLBACK` 等效。

## 另见

`BEGIN`，`COMMIT`，`ROLLBACK`
