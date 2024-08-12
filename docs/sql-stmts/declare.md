---
title: DECLARE
---

# DECLARE

Defines a cursor.

## Synopsis

```sql
DECLARE <name> [BINARY] [INSENSITIVE] [NO SCROLL] [PARALLEL RETRIEVE] CURSOR 
     [{WITH | WITHOUT} HOLD] 
     FOR <query>
```

## Description

`DECLARE` allows a user to create a cursor, which can be used to retrieve a small number of rows at a time out of a larger query. Cursors can return data using [FETCH](/docs/sql-stmts/fetch.md).

> **Note** This page describes usage of cursors at the SQL command level. If you are trying to use cursors inside a PL/pgSQL function, the rules are different, see PL/pgSQL.

Normal cursors return data in text format, the same as a `SELECT` would produce. Since data is stored natively in binary format, the system must do a conversion to produce the text format. Once the information comes back in text form, the client application may need to convert it to a binary format to manipulate it. In addition, data in the text format is often larger in size than in the binary format. Binary cursors return the data in a binary representation that may be more easily manipulated. Nevertheless, if you intend to display the data as text anyway, retrieving it in text form will save you some effort on the client side.

As an example, if a query returns a value of one from an integer column, you would get a string of 1 with a default cursor whereas with a binary cursor you would get a 4-byte field containing the internal representation of the value (in big-endian byte order).

Binary cursors should be used carefully. Many applications, including `psql`, are not prepared to handle binary cursors and expect data to come back in the text format.

> **Note** When the client application uses the 'extended query' protocol to issue a `FETCH` command, the Bind protocol message specifies whether data is to be retrieved in text or binary format. This choice overrides the way that the cursor is defined. The concept of a binary cursor as such is thus obsolete when using extended query protocol — any cursor can be treated as either text or binary.

A cursor can be specified in the `WHERE CURRENT OF` clause of the [UPDATE](/docs/sql-stmts/update.md) or [DELETE](/docs/sql-stmts/delete.md) statement to update or delete table data. The `UPDATE` or `DELETE` statement can only be run on the server, for example in an interactive `psql` session or a script.

**Parallel Retrieve Cursors**

Cloudberry Database supports a special type of cursor, a *parallel retrieve cursor*. You can use a parallel retrieve cursor to retrieve query results, in parallel, directly from the Cloudberry Database segments, bypassing the Cloudberry Database coordinator.

Parallel retrieve cursors do not support the `WITH HOLD` clause. Cloudberry Database ignores the `BINARY` clause when you declare a parallel retrieve cursor.

You open a special retrieve session to each parallel retrieve cursor endpoint, and use the [RETRIEVE](/docs/sql-stmts/retrieve.md) command to retrieve the query results from a parallel retrieve cursor.

## Parameters

**`name`**

The name of the cursor to be created.

**`BINARY`**

Causes the cursor to return data in binary rather than in text format.

> **Note** Cloudberry Database ignores the `BINARY` clause when you declare a `PARALLEL RETRIEVE` cursor.

**`INSENSITIVE`**

Indicates that data retrieved from the cursor should be unaffected by updates to the table(s) underlying the cursor that occur after the cursor is created. In Cloudberry Database, all cursors are insensitive. This key word currently has no effect and is present only for compatibility with the SQL standard.

**`NO SCROLL`**

The cursor cannot be used to retrieve rows in a nonsequential fashion. This is the default behavior in Cloudberry Database; scrollable cursors (`SCROLL`) are not supported.

**`PARALLEL RETRIEVE`**

Declare a parallel retrieve cursor. A parallel retrieve cursor is a special type of cursor that you can use to retrieve results directly from Cloudberry Database segments, in parallel.

**`WITH HOLD`**<br />
**`WITHOUT HOLD`**

`WITH HOLD` specifies that the cursor may continue to be used after the transaction that created it successfully commits. `WITHOUT HOLD` specifies that the cursor cannot be used outside of the transaction that created it. `WITHOUT HOLD` is the default.

> **Note** Cloudberry Database does not support declaring a `PARALLEL RETRIEVE` cursor with the `WITH HOLD` clause. `WITH HOLD` also cannot not be specified when the `query` includes a `FOR UPDATE` or `FOR SHARE` clause.

**`query`**

A [SELECT](/docs/sql-stmts/select.md) or [VALUES](/docs/sql-stmts/values.md) command which will provide the rows to be returned by the cursor.

If the cursor is used in the `WHERE CURRENT OF` clause of the [UPDATE](/docs/sql-stmts/update.md) or [DELETE](/docs/sql-stmts/delete.md) command, the `SELECT` command must satisfy the following conditions:

- Cannot reference a view or external table.
- References only one table.

    The table must be a heap table, and it must not be replicated-distributed (must not be a view, external table, or append-optimized column-oriented table).

- Cannot contain any of the following:
    -  A grouping clause
    -  A set operation such as `UNION ALL` or `UNION DISTINCT`
    -  A sorting clause
    -  A windowing clause
    -  A join or a self-join

    Specifying the `FOR UPDATE` clause in the `SELECT` command prevents other sessions from changing the rows between the time they are fetched and the time they are updated. Without the `FOR UPDATE` clause, a subsequent use of the `UPDATE` or `DELETE` command with the `WHERE CURRENT OF` clause has no effect if the row was changed since the cursor was created.

    > **Note** Specifying the `FOR UPDATE` clause in the `SELECT` command locks the entire table, not just the selected rows.

The key words `BINARY`, `INSENSITIVE`, and `NO SCROLL` can appear in any order.

## Notes

Unless `WITH HOLD` is specified, the cursor created by this command can only be used within the current transaction. Thus, `DECLARE` without `WITH HOLD` is useless outside a transaction block: the cursor would survive only to the completion of the statement. Therefore Cloudberry Database reports an error if this command is used outside a transaction block. Use `BEGIN` and `COMMIT` (or `ROLLBACK`) to define a transaction block.

If `WITH HOLD` is specified and the transaction that created the cursor successfully commits, the cursor can continue to be accessed by subsequent transactions in the same session. (But if the creating transaction ends prematurely, the cursor is removed.) A cursor created with `WITH HOLD` is closed when an explicit `CLOSE` command is issued on it, or the session ends. In the current implementation, the rows represented by a held cursor are copied into a temporary file or memory area so that they remain available for subsequent transactions.

If you create a cursor with the `DECLARE` command in a transaction, you cannot use the `SET` command in the transaction until you close the cursor with the `CLOSE` command.

Scrollable cursors are not currently supported in Cloudberry Database. You can only use `FETCH` or `RETRIEVE` to move the cursor position forward, not backwards.

`DECLARE...FOR UPDATE` is not supported with append-optimized tables.

You can see all available cursors by querying the `pg_cursors` system view.

## Examples

Declare a cursor:

```sql
DECLARE mycursor CURSOR FOR SELECT * FROM mytable;
```

Declare a parallel retrieve cursor for the same query:

```sql
DECLARE myprcursor PARALLEL RETRIEVE CURSOR FOR SELECT * FROM mytable;
```

## Compatibility

SQL standard allows cursors only in embedded SQL and in modules. Cloudberry Database permits cursors to be used interactively.

Cloudberry Database does not implement an `OPEN` statement for cursors. A cursor is considered to be open when it is declared.

The SQL standard allows cursors to move both forward and backward. All Cloudberry Database cursors are forward moving only (not scrollable).

Binary cursors are a Cloudberry Database extension.

The SQL standard makes no provisions for parallel retrieve cursors.

## See also

[CLOSE](/docs/sql-stmts/close.md), [DELETE](/docs/sql-stmts/delete.md), [FETCH](/docs/sql-stmts/fetch.md), [MOVE](/docs/sql-stmts/move.md), [RETRIEVE](/docs/sql-stmts/retrieve.md), [SELECT](/docs/sql-stmts/select.md), [UPDATE](/docs/sql-stmts/update.md)
