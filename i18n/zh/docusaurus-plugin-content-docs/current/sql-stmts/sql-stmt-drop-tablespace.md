---
title: DROP TABLESPACE
---

# DROP TABLESPACE

删除一个表空间。

## 语法概要

```sql
DROP TABLESPACE [IF EXISTS] <name>
```

## 描述

`DROP TABLESPACE` 从系统中删除一个表空间。

表空间只能由其所有者或超级用户删除。删除表空间前，必须确保表空间内不含任何数据库对象。需要注意的是，即便当前数据库的表空间未被使用，其他数据库的对象可能还残留在该表空间内。另外，如果任何活动会话的 `temp_tablespaces` 设置中包含了该表空间，由于表空间内存在临时文件，执行 `DROP TABLESPACE` 命令可能会失败。

## 参数

**`IF EXISTS`**

如果表空间不存在，则不抛出错误。在这种情况下，Cloudberry Database 会发出一个提醒。

**`name`**

要删除的表空间的名称。

## 注意事项

不能在事务块中执行 `DROP TABLESPACE`。

建议在系统活动较低的时段执行 `DROP TABLESPACE` 命令，这样可以避免因表和临时对象的并发创建引发的问题。在删除表空间的过程中，存在一个极短的时间窗口，可能会有新的表被创建于即将删除的表空间内。如果出现这种情况，Cloudberry Database 将会发出警告。这是一个 `DROP TABLESPACE` 警告的示例。

```sql
testdb=# DROP TABLESPACE mytest; 
WARNINGtablespace with oid "16415" is not empty  (seg1 192.168.8.145:25433 pid=29023)
WARNINGtablespace with oid "16415" is not empty  (seg0 192.168.8.145:25432 pid=29022)
WARNINGtablespace with oid "16415" is not empty
DROP TABLESPACE
```

在表空间目录中的表数据不会被删除。您可以使用 [`ALTER TABLE`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/alter-table.md) 命令来更改表的表空间定义，并将数据移动到现有的表空间中。

## 示例

删除表空间 `mystuff`：

```sql
DROP TABLESPACE mystuff;
```

## 兼容性

`DROP TABLESPACE` 是 Cloudberry Database 的扩展。

## 另见

[`CREATE TABLESPACE`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/create-tablespace.md)、[`ALTER TABLESPACE`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/alter-tablespace.md)
