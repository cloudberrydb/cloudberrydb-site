---
title: Create and Manage Views
---

# Create and Manage Views in Cloudberry Database

In Cloudberry Database, views enable you to save frequently used or complex queries, then access them in a `SELECT` statement as if they were a table. A view is not physically materialized on disk: the query runs as a subquery when you access the view.

## Creating views

The `CREATE VIEW`command defines a view of a query. For example:

```sql
CREATE VIEW comedies AS SELECT * FROM films WHERE kind = 'comedy';
```

<!-- Views ignore `ORDER BY` and `SORT` operations stored in the view. -->

## Dropping views

The `DROP VIEW` command removes a view. For example:

```sql
DROP VIEW topten;
```

The `DROP VIEW...CASCADE` command also removes all dependent objects. As an example, if another view depends on the view which is about to be dropped, the other view will be dropped as well. Without the `CASCADE` option, the `DROP VIEW` command will fail.

## Best practices when creating views

When defining and using a view, remember that a view is just a SQL statement and is replaced by its definition when the query is run.

These are some common uses of views.

- They allow you to have a recurring SQL query or expression in one place for easy reuse.
- They can be used as an interface to abstract from the actual table definitions, so that you can reorganize the tables without having to modify the interface.

If a subquery is associated with a single query, consider using the `WITH` clause of the `SELECT` command instead of creating a seldom-used view.

In general, these uses do not require nesting views, which means defining views based on other views.

These are 2 patterns of creating views that tend to be problematic because the view's SQL is used during query execution.

- Defining many layers of views so that your final queries look deceptively simple.

    Problems arise when you try to enhance or troubleshoot queries that use the views, for example, by examining the execution plan. The query's execution plan tends to be complicated and it is difficult to understand and how to improve it.

- Defining a denormalized "world" view. A view that joins a large number of database tables that is used for a wide variety of queries.

    Performance issues can occur for some queries that use the view for some `WHERE` conditions while other `WHERE` conditions work well.