---
title: DROP TABLESPACE
---

# DROP TABLESPACE

Removes a tablespace.

## Synopsis

```sql
DROP TABLESPACE [IF EXISTS] <name>
```

## Description

`DROP TABLESPACE` removes a tablespace from the system.

A tablespace can only be dropped by its owner or a superuser. The tablespace must be empty of all database objects before it can be dropped. It is possible that objects in other databases may still reside in the tablespace even if no objects in the current database are using the tablespace. Also, if the tablespace is listed in the temp_tablespaces setting of any active session, `DROP TABLESPACE` might fail due to temporary files residing in the tablespace.

## Parameters

**`IF EXISTS`**

Do not throw an error if the tablespace does not exist. Cloudberry Database issues a notice in this case.

**`name`**

The name of the tablespace to remove.

## Notes

You cannot run `DROP TABLESPACE` inside a transaction block.

Run `DROP TABLESPACE` during a period of low activity to avoid issues due to concurrent creation of tables and temporary objects. When a tablespace is dropped, there is a small window in which a table could be created in the tablespace that is currently being dropped. If this occurs, Cloudberry Database returns a warning. This is an example of the `DROP TABLESPACE` warning.

```sql
testdb=# DROP TABLESPACE mytest; 
WARNINGtablespace with oid "16415" is not empty  (seg1 192.168.8.145:25433 pid=29023)
WARNINGtablespace with oid "16415" is not empty  (seg0 192.168.8.145:25432 pid=29022)
WARNINGtablespace with oid "16415" is not empty
DROP TABLESPACE
```

The table data in the tablespace directory is not dropped. You can use the [ALTER TABLE](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/sql-stmt-alter-table.md) command to change the tablespace defined for the table and move the data to an existing tablespace.

## Examples

Remove the tablespace `mystuff`:

```sql
DROP TABLESPACE mystuff;
```

## Compatibility

`DROP TABLESPACE` is a Cloudberry Database extension.

## See also

[`CREATE TABLESPACE`](/docs/sql-stmts/sql-stmt-create-tablespace.md), [`ALTER TABLESPACE`](/docs/sql-stmts/sql-stmt-alter-tablespace.md)
