---
title: CREATE ACCESS METHOD
---

# CREATE ACCESS METHOD

Defines a new access method.

## Synopsis

```sql
CREATE ACCESS METHOD <name>
    TYPE <access_method_type>
    HANDLER <handler_function>
```

## Description

`CREATE ACCESS METHOD` creates a new access method.

The access method name must be unique within the database.

Only superusers can define new access methods.


## Parameters

**`name`**

The name of the access method to create.

**`access_method_type`**

The type of access method to define. Only `TABLE` and `INDEX` types are supported at present.

**`handler_function`**

handler_function is the name (possibly schema-qualified) of a previously registered function that represents the access method. The handler function must be declared to take a single argument of type `internal`, and its return type depends on the type of access method; for `TABLE` access methods, it must be `table_am_handler` and for `INDEX` access methods, it must be `index_am_handler`. The C-level API that the handler function must implement varies depending on the type of access method. The table access method API is described in [Table Access Method Interface Definition](https://www.postgresql.org/docs/12/tableam.html) in the PostgreSQL documentation. The index access method API is described in [Index Access Method Interface Definition](https://www.postgresql.org/docs/12/indexam.html).

## Examples

Create an index access method `heptree` with handler function `heptree_handler`:

``` sql
CREATE ACCESS METHOD heptree TYPE INDEX HANDLER heptree_handler;
```

## Compatibility

`CREATE ACCESS METHOD` is a Cloudberry Database extension.

## See also

[DROP ACCESS METHOD](/docs/sql-stmts/drop-access-method.md), [CREATE OPERATOR CLASS](/docs/sql-stmts/create-operator-class.md), [CREATE OPERATOR FAMILY](/docs/sql-stmts/create-operator-family.md)
