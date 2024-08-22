---
title: CREATE TABLE AS
---

# CREATE TABLE AS

Defines a new table from the results of a query.

## Synopsis

```sql
CREATE [ [ GLOBAL | LOCAL ] { TEMPORARY | TEMP } | UNLOGGED ] TABLE [ IF NOT EXISTS ] <table_name>
        [ (<column_name> [, ...] ) ]
        [ USING <access_method> ]
        [ WITH ( <storage_parameter> [= <value>] [, ... ] ) | WITHOUT OIDS ]
        [ ON COMMIT { PRESERVE ROWS | DELETE ROWS | DROP } ]
        [ TABLESPACE <tablespace_name> ]
        AS <query>
        [ WITH [ NO ] DATA ]
        [ DISTRIBUTED BY ( <column> [<opclass>] [, ... ] ) 
           | DISTRIBUTED RANDOMLY
           | DISTRIBUTED REPLICATED ]
```

## Description

`CREATE TABLE AS` creates a table and fills it with data computed by a [SELECT](/docs/sql-stmts/select.md) command. The table columns have the names and data types associated with the output columns of the `SELECT`, however you can override the column names by giving an explicit list of new column names.

`CREATE TABLE AS` creates a new table and evaluates the query just once to fill the new table initially. The new table will not track subsequent changes to the source tables of the query.

## Parameters

**`GLOBAL | LOCAL`**

Ignored for compatibility. These keywords are deprecated; refer to [CREATE TABLE](/docs/sql-stmts/create-table.md) for details.

**`TEMPORARY | TEMP`**

If specified, the new table is created as a temporary table. Refer to [CREATE TABLE](/docs/sql-stmts/create-table.md) for details.

**`UNLOGGED`**

If specified, the table is created as an unlogged table. Refer to [CREATE TABLE](/docs/sql-stmts/create-table.md) for details.

**`IF NOT EXISTS`**

Do not throw an error if a relation with the same name already exists; simply issue a notice and leave the table unmodified.

**`table_name`**

The name (optionally schema-qualified) of the new table to be created.

**`column_name`**

The name of a column in the new table. If column names are not provided, they are taken from the output column names of the query.

**`USING access_method`**

The optional `USING` clause specifies the table access method to use to store the contents for the new table you are creating; the method must be an access method of type [TABLE](/docs/sql-stmts/select.md#the-table-command). Set to `heap` to access the table as a heap-storage table, `ao_row` to access the table as an append-optimized table with row-oriented storage (AO), or `ao_column` to access the table as an append-optimized table with column-oriented storage (AO/CO). The default access method is determined by the value of the default_table_access_method server configuration parameter.

> **Note:**
>
> Although you can specify the table's access method using `WITH (appendoptimized=true|false, orientation=row|column)`. We recommend that you use `USING <access_method>` instead.

**`WITH ( storage_parameter=value )`**

The `WITH` clause specifies optional storage parameters for the new table. Refer to the [Storage Parameters](/docs/sql-stmts/create-table.md#storage-parameters) section on the `CREATE TABLE` reference page for more information.

**`ON COMMIT`**

The behavior of temporary tables at the end of a transaction block can be controlled using `ON COMMIT`. The three options are:

PRESERVE ROWS — Cloudberry Database takes no special action at the ends of transactions for temporary tables. This is the default behavior.

DELETE ROWS — Cloudberry Database deletes all rows in the temporary table at the end of each transaction block. Essentially, an automatic [TRUNCATE](/docs/sql-stmts/truncate.md) is done at each commit.

DROP — Cloudberry Database drops the temporary table at the end of the current transaction block.

**`TABLESPACE tablespace_name`**

The tablespace_name parameter is the name of the tablespace in which the new table is to be created. If not specified, the database's `default_tablespace` is used, or `temp_tablespaces` if the table is temporary.

**`AS query`**

A [SELECT](/docs/sql-stmts/select.md), [TABLE](/docs/sql-stmts/select.md#the-table-command), or [VALUES](/docs/sql-stmts/values.md) command, or an [EXECUTE](/docs/sql-stmts/execute.md) command that runs a prepared `SELECT`, `TABLE`, or `VALUES` query.

**`DISTRIBUTED BY ( column [opclass] [, ... ] )`**<br />
**`DISTRIBUTED RANDOMLY`**<br />
**`DISTRIBUTED REPLICATED`**

Used to declare the Cloudberry Database distribution policy for the table. Refer to [CREATE TABLE](/docs/sql-stmts/create-table.md) for details.

## Notes

This command is functionally similar to [SELECT INTO](/docs/sql-stmts/select-into.md), but it is preferred since it is less likely to be confused with other uses of the `SELECT INTO` syntax. Furthermore, `CREATE TABLE AS` offers a superset of the functionality offered by `SELECT INTO`.

`CREATE TABLE AS` can be used for fast data loading from external table data sources. See [CREATE EXTERNAL TABLE](/docs/sql-stmts/create-external-table.md).

## Examples

Create a new table `films_recent` consisting of only recent entries from the table `films`:

```sql
CREATE TABLE films_recent AS
  SELECT * FROM films WHERE date_prod >= '2020-01-01';
```

To copy a table completely, you can also use the short form by specifying the `TABLE` command:

```sql
CREATE TABLE films2 AS
  TABLE films;
```

Create a new temporary table `films_recent`, consisting only of recent entries from the table `films`, using a prepared statement. The new table will be dropped at commit:

```sql
PREPARE recentfilms(date) AS
  SELECT * FROM films WHERE date_prod > $1;
CREATE TEMP TABLE films_recent ON COMMIT DROP AS 
  EXECUTE recentfilms('2020-01-01');
```

## Compatibility

`CREATE TABLE AS` conforms to the SQL standard, with the following exceptions:

- The standard requires parentheses around the subquery clause; in Cloudberry Database, these parentheses are optional.
- In the standard, the `WITH [NO] DATA` clause is required, in Cloudberry Database it is optional.
- Cloudberry Database handles temporary tables differently from the standard; see [CREATE TABLE](/docs/sql-stmts/create-table.md) for details.
- The `WITH` clause is a Cloudberry Database extension; storage parameters are not part of the standard.
- The Cloudberry Database concept of tablespaces is not part of the standard. The `TABLESPACE` clause is an extension.

## See also

[CREATE EXTERNAL TABLE](/docs/sql-stmts/create-external-table.md), [CREATE MATERIALIZED VIEW](/docs/sql-stmts/create-materialized-view.md), [CREATE TABLE](/docs/sql-stmts/create-table.md), [EXECUTE](/docs/sql-stmts/execute.md), [SELECT](/docs/sql-stmts/select.md), [SELECT INTO](/docs/sql-stmts/select-into.md), [VALUES](/docs/sql-stmts/values.md)
