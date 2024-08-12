---
title: SET ROLE
---

# SET ROLE

设置当前会话中的当前角色标识符。

## 语法概要

```sql
SET [SESSION | LOCAL] ROLE <rolename>

SET [SESSION | LOCAL] ROLE NONE

RESET ROLE
```

## 描述

该命令将当前 SQL 会话的角色标识符设定为 rolename。角色名称既可以是标识符也可以是字符串字面量。执行 `SET ROLE` 后，对 SQL 命令的权限检查就好像是以命名角色原始登录进行的一样。

指定的 rolename 必须是当前会话用户所属的角色之一。如果会话用户是超级用户，那么他可以选择任何角色。

`NONE` 和 `RESET` 选项用于将当前角色标识符重置为会话开始时的角色。任何用户都可以执行这两个操作。

## 参数

**`SESSION`**

指定该命令对当前会话生效。这是默认行为。

**`LOCAL`**

指定该命令仅对当前事务生效。在 `COMMIT` 或 `ROLLBACK` 之后，会话级别的设置再次生效。注意，如果在事务之外执行 `SET LOCAL`，它将看起来没有任何效果。

**`rolename`**

在当前会话中用于权限检查的角色名称。

**`RESET`**

将当前角色标识符重置为当前会话角色标识符（即登录时使用的角色）。

## 注意事项

通过使用这个命令，可以增加或限制权限。如果会话用户角色设置了 `INHERITS` 属性，那么它自动获得所有它能通过 `SET ROLE` 切换到的角色的权限；在此情形下，`SET ROLE` 实际上会移除直接分配给会话用户及其所在其他角色的权限，仅保留指定角色的权限。反之，如果会话用户角色设置为 `NOINHERITS`，`SET ROLE` 会移除会话用户直接拥有的权限，仅保留指定角色的权限。

特别地，当超级用户切换到一个非超级用户角色时，他们会失去超级用户的特权。

`SET ROLE` 与 `SET SESSION AUTHORIZATION` 产生的效果相似，但它们涉及的权限检查有很大差异。`SET SESSION AUTHORIZATION` 用于确定后续 `SET ROLE` 命令可以切换到哪些角色，而通过 `SET ROLE` 更换角色并不改变后续 `SET ROLE` 命令允许切换到的角色集。

`SET ROLE` 命令不会处理角色通过 `ALTER ROLE` 设置的会话变量；这些会话变量仅在登录时被处理。

## 示例

```sql
SELECT SESSION_USER, CURRENT_USER;
 session_user | current_user 
--------------+--------------
 peter        | peter

SET ROLE 'paul';

SELECT SESSION_USER, CURRENT_USER;
 session_user | current_user 
--------------+--------------
 peter        | paul
```

## 兼容性

Cloudberry Database 允许使用标识符语法（rolename），而 SQL 标准要求角色名称必须写成字符串字面量。SQL 标准不允许在事务中执行 `SET ROLE` 命令；Cloudberry Database 不做此限制。`SESSION` 和 `LOCAL` 修饰符是 Cloudberry Database 的扩展，`RESET` 语法也是如此。

## 另见

[`SET SESSION AUTHORIZATION`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/set-session-authorization.md)
