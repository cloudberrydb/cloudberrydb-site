---
title: RETRIEVE
---

# RETRIEVE

Retrieves rows from a query using a parallel retrieve cursor.

## Synopsis

```sql
RETRIEVE { <count> | ALL } FROM ENDPOINT <endpoint_name>
```

## Description

`RETRIEVE` retrieves rows using a previously-created parallel retrieve cursor. You retrieve the rows in individual retrieve sessions, separate direct connections to individual segment endpoints that will serve the results for each individual segment. When you initiate a retrieve session, you must specify `gp_retrieve_conn=true` on the connection request. Because a retrieve session is independent of the parallel retrieve cursors or their corresponding endpoints, you can `RETRIEVE` from multiple endpoints in the same retrieve session.

A parallel retrieve cursor has an associated position, which is used by `RETRIEVE`. The cursor position can be before the first row of the query result, on any particular row of the result, or after the last row of the result.

> **Note:**
>
> Because Cloudberry Database does not support scrollable cursors, the `RETRIEVE` command moves a parallel retrieve cursor only forward in position.

When it is created, a parallel retrieve cursor is positioned before the first row. After retrieving some rows, the cursor is positioned on the row most recently retrieved.

If `RETRIEVE` runs off the end of the available rows then the cursor is left positioned after the last row.

`RETRIEVE ALL` always leaves the parallel retrieve cursor positioned after the last row.

## Parameters

**`count`**

Retrieve the next count number of rows. count must be a positive number.

**`ALL`**

Retrieve all remaining rows.

**`endpoint_name`**

The name of the endpoint from which to retrieve the rows.

## Outputs

On successful completion, a `RETRIEVE` command returns the fetched rows (possibly empty) and a count of the number of rows fetched (possibly zero).

## Notes

Use `DECLARE ... PARALLEL RETRIEVE CURSOR` to define a parallel retrieve cursor.

Parallel retrieve cursors do not support `FETCH` or `MOVE` operations.

## Examples

Start the transaction:

```sql
BEGIN;
```

Create a parallel retrieve cursor:

```sql
DECLARE mycursor PARALLEL RETRIEVE CURSOR FOR SELECT * FROM films;
```

List the cursor endpoints:

```sql
SELECT * FROM gp_endpoints WHERE cursorname='mycursor';
```

Note the hostname, port, auth_token, and name associated with each endpoint.

In another terminal window, initiate a retrieve session using a hostname, port, and auth_token returned from the previous query. For example:

```sql
PGPASSWORD=d3825fc07e56bee5fcd2b1d0b600c85e PGOPTIONS='-c gp_retrieve_conn=true' psql -d testdb -h sdw3 -p 6001;
```

Fetch all rows from an endpoint (for example, the endpoint named `prc10000001100000005`):

```sql
RETRIEVE ALL FROM ENDPOINT prc10000001100000005;
```

Exit the retrieve session.

```sql
\q
```

Back in the original session, close the cursor and end the transaction:

```sql
CLOSE mycursor;
COMMIT;
```

## Compatibility

`RETRIEVE` is a Cloudberry Database extension. The SQL standard makes no provisions for parallel retrieve cursors.

## See also

[DECLARE](/docs/sql-stmts/declare.md), [CLOSE](/docs/sql-stmts/close.md)
