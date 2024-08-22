---
title: DROP ROLE
---

# DROP ROLE

删除一个数据库角色。

## 语法概要

```sql
DROP ROLE [IF EXISTS] <name> [, ...]
```

## 描述

`DROP ROLE` 删除指定的角色。要删除超级用户角色，你必须是超级用户。要删除非超级用户角色，你必须拥有 `CREATE ROLE` 权限。

如果角色仍被任何数据库引用，则无法删除；若试图这样做将会触发错误。删除角色前，必须先删除或转移其所拥有的所有对象的所有权，并撤销该角色被赋予的其他对象上的所有权限。为此，[`REASSIGN OWNED`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/reassign-owned.md) 和 [`DROP OWNED`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/drop-owned.md) 这两个命令非常有用。

然而，不需要删除涉及该角色的角色成员关系；`DROP ROLE` 会自动撤销目标角色在其他角色中的成员关系，以及其他角色在目标角色中的成员关系。其他角色不会被删除或受到其他影响。

## 参数

**`IF EXISTS`**

如果角色不存在，则不抛出错误。在这种情况下，会输出一个提醒。

**`name`**

要删除的角色的名称。

## 示例

删除名为 `sally` 和 `bob` 的角色：

```sql
DROP ROLE sally, bob;
```

## 兼容性

SQL 标准定义了 `DROP ROLE`，但一次只允许删除一个角色，并且它规定的权限要求与 Cloudberry Database 使用的不同。

## 另见

[`REASSIGN OWNED`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/reassign-owned.md)、[`DROP OWNED`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/drop-owned.md)、[`CREATE ROLE`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/create-role.md)、[`ALTER ROLE`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/alter-role.md)、[`SET ROLE`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/set-role.md)
