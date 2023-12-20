---
title: Create and Manage Schemas
---

# Create and Manage Schemas in Cloudberry Database

In Cloudberry Database, schemas logically organize objects and data in a database. Schemas allow you to have more than one object (such as tables) with the same name in the database without conflict if the objects are in different schemas.

## The Default "Public" Schema

Every database has a default schema named *public*. If you do not create any schemas, objects are created in the *public* schema. All database roles (users) have `CREATE` and `USAGE` privileges in the *public* schema. When you create a schema, you grant privileges to your users to allow access to the schema.

## Create a schema

Use the `CREATE SCHEMA` command to create a new schema. For example:

```sql
=> CREATE SCHEMA myschema;
```

To create or access objects in a schema, write a qualified name consisting of the schema name and table name separated by a period. For example:

```sql
myschema.table
```

See [Schema search paths](#schema-search-paths) for information about accessing a schema.

You can create a schema owned by someone else, for example, to restrict the activities of your users to well-defined namespaces. The syntax is:

```sql
=> CREATE SCHEMA `schemaname` AUTHORIZATION `username`;
```

## Schema search paths

To specify an object's location in a database, use the schema-qualified name. For example:

```sql
=> SELECT * FROM myschema.mytable;
```

You can set the `search_path` configuration parameter to specify the order in which to search the available schemas for objects. The schema listed first in the search path becomes the *default* schema. If a schema is not specified, objects are created in the default schema.

### Set the schema search path

The `search_path` configuration parameter sets the schema search order. The `ALTER DATABASE` command sets the search path. For example:

```sql
=> ALTER DATABASE mydatabase SET search_path TO myschema, 
public, pg_catalog;
```

You can also set `search_path` for a particular role (user) using the `ALTER ROLE` command. For example:

```sql
=> ALTER ROLE sally SET search_path TO myschema, public, 
pg_catalog;
```

:::tip
When working with Cloudberry Database, it is recommended that you:

- Explicitly specify the schema when creating new objects to ensure they are created in the intended schema.
- Not rely on `search_path` to implicitly direct the creation of new objects to a specific schema other than `public`. Otherwise, the database might create the objects in an unintended schema.
:::

### View the current schema

Use the `current_schema()` function to view the current schema. For example:

```sql
=> SELECT current_schema();
```

Use the `SHOW` command to view the current search path. For example:

```sql
=> SHOW search_path;
```

## Drop a schema

Use the `DROP SCHEMA` command to drop (delete) a schema. For example:

```sql
=> DROP SCHEMA myschema;
```

By default, the schema must be empty before you can drop it. To drop a schema and all of its objects (tables, data, functions, and so on) use:

```sql
=> DROP SCHEMA myschema CASCADE;
```

## System schemas

The following system-level schemas exist in every database:

- `pg_catalog` contains the system catalog tables, built-in data types, functions, and operators. It is always part of the schema search path, even if it is not explicitly named in the search path.
- `information_schema` consists of a standardized set of views that contain information about the objects in the database. These views get system information from the system catalog tables in a standardized way.
- `pg_toast` stores large objects such as records that exceed the page size. This schema is used internally by the Cloudberry Database system.
- `pg_bitmapindex` stores bitmap index objects such as lists of values. This schema is used internally by the Cloudberry Database system.
- `pg_aoseg` stores append-optimized table objects. This schema is used internally by the Cloudberry Database system.
- `gp_toolkit` is an administrative schema that contains external tables, views, and functions that you can access with SQL commands. All database users can access `gp_toolkit` to view and query the system log files and other system metrics.
