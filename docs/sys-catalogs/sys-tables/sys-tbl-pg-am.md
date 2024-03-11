---
title: pg_am
---

# pg_am

The `pg_am` table in the `pg_catalog` schema stores information about index access methods. There is one row for each index access method supported by the system.

|column|type|references|description|
|------|----|----------|-----------|
|`oid`|oid| |Row identifier (hidden attribute; must be explicitly selected)|
|`amname`|name| |Name of the access method|
|`amhandler`|regproc| | OID of a handler function responsible for supplying information about the access method|
|`amtype`|char| |`t` for table (including materialized views), `i` for index|
