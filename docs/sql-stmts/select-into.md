---
title: SELECT INTO
---

# SELECT INTO

Defines a new table from the results of a query.

## Synopsis

```sql
[ WITH [ RECURSIVE ] <with_query> [, ...] ]
SELECT [ALL | DISTINCT [ON ( <expression> [, ...] )]]
    * | <expression> [ [AS] <output_name> ] [, ...]
    INTO [TEMPORARY | TEMP | UNLOGGED ] [TABLE] <new_table>
    [FROM <from_item> [, ...]]
    [WHERE <condition>]
    [GROUP BY <expression> [, ...]]
    [HAVING <condition> [, ...]]
    [WINDOW <window_name> AS ( <window_definition> ) [, ...]]
    [{UNION | INTERSECT | EXCEPT} [ALL | DISTINCT ] <select>]
    [ORDER BY <expression> [ASC | DESC | USING <operator>] [NULLS {FIRST | LAST}] [, ...]]
    [LIMIT {<count> | ALL}]
    [OFFSET <start> [ ROW | ROWS ] ]
    [FETCH { FIRST | NEXT } [ <count> ] { ROW | ROWS } ONLY ]
    [FOR {UPDATE | SHARE} [OF <table_name> [, ...]] [NOWAIT] [...]]
```

## Description

`SELECT INTO` creates a new table and fills it with data computed by a query. The data is not returned to the client, as it is with a normal `SELECT`. The new table's columns have the names and data types associated with the output columns of the `SELECT`.

## Parameters

**`TEMPORARY`**<br />
**`TEMP`**

If specified, the table is created as a temporary table. Refer to [CREATE TABLE](/docs/sql-stmts/create-table.md) for details.

**`UNLOGGED`**

If specified, the table is created as an unlogged table. Refer to [CREATE TABLE](/docs/sql-stmts/create-table.md) for details.

**`new_table`**

The name (optionally schema-qualified) of the table to be created.

All other parameters for `SELECT INTO` are described in detail on the [SELECT](/docs/sql-stmts/select.md) reference page.


## Notes

[CREATE TABLE AS](/docs/sql-stmts/create-table-as.md) is functionally similar to `SELECT INTO`. `CREATE TABLE AS` is the recommended syntax, since this form of `SELECT INTO` is not available in ECPG or PL/pgSQL, because they interpret the `INTO` clause differently. Also, `CREATE TABLE AS` offers a superset of the functionality provided by `SELECT INTO`.

In contrast to `CREATE TABLE AS`, `SELECT INTO` does not allow specifying properties like a table's access method with `USING <method>` or the table's tablespace with `TABLESPACE <tablespace_name>`. Use [CREATE TABLE AS](/docs/sql-stmts/create-table-as.md) if necessary. Therefore, the default table access method is chosen for the new table.

## Examples

Create a new table `films_recent` consisting only of recent entries from the table `films`:

```sql
SELECT * INTO films_recent FROM films WHERE date_prod >= '2016-01-01';
```

## Compatibility

The SQL standard uses `SELECT INTO` to represent selecting values into scalar variables of a host program, rather than creating a new table. The Cloudberry Database usage of `SELECT INTO` to represent table creation is historical. It is best to use [CREATE TABLE AS](/docs/sql-stmts/create-table-as.md) for this purpose in new applications.

## See also

[SELECT](/docs/sql-stmts/select.md), [CREATE TABLE AS](/docs/sql-stmts/create-table-as.md)
