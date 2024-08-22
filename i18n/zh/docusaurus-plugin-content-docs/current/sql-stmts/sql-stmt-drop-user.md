---
title: DROP USER
---

# DROP USER

删除一个数据库角色。

## 语法概要

```sql
DROP USER [IF EXISTS] <name> [, ...]
```

## 描述

`DROP USER` 是 [`DROP ROLE`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/drop-role.md) 的别名。

## 兼容性

`DROP USER` 命令是 Cloudberry Database 特别添加的功能，并非 SQL 标准中的内容。SQL 标准没有具体规定用户的定义方式，这是由各个数据库系统自己决定的。

## 另见

[`DROP ROLE`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/drop-role.md)
