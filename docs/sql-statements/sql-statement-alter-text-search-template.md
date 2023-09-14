# ALTER TEXT SEARCH TEMPLATE

## Description

Changes the definition of a text search template.

## Synopsis

``` {#sql_command_synopsis}
ALTER TEXT SEARCH TEMPLATE <name> RENAME TO <new_name>
ALTER TEXT SEARCH TEMPLATE <name> SET SCHEMA <new_schema>
```

## Description

`ALTER TEXT SEARCH TEMPLATE` changes the definition of a text search parser. Currently, the only supported functionality is to change the template's name.

You must be a superuser to use `ALTER TEXT SEARCH TEMPLATE`.

## Parameters

name
:   The name (optionally schema-qualified) of an existing text search template.

new_name
:   The new name of the text search template.

new_schema
:   The new schema for the text search template.

## Compatibility

There is no `ALTER TEXT SEARCH TEMPLATE` statement in the SQL standard.

## See Also

[CREATE TEXT SEARCH TEMPLATE](CREATE_TEXT_SEARCH_TEMPLATE.html), [DROP TEXT SEARCH TEMPLATE](DROP_TEXT_SEARCH_TEMPLATE.html)

**Parent topic:** SQL Commands

