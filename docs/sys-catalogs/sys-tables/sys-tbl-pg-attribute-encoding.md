---
title: pg_attribute_encoding
---

# pg_attribute_encoding

The `pg_attribute_encoding` system catalog table in the `pg_catalog` schema contains column storage information.

|column|type|modifers|storage|description|
|------|----|--------|-------|-----------|
|`attrelid`|oid|not null|plain|Foreign key to `pg_attribute.attrelid`|
|`attnum`|smallint|not null|plain|Foreign key to `pg_attribute.attnum`|
|`attoptions`|text [ ]| |extended|The options|

For a column with `filenum = f`, the column files on disk use the suffix `(f - 1)*128 to f*128 - 1`. For example:

- Column with `filenum = 1` has files `relfilenode`, `relfilenode.1` .. `relfilenode.127`.
- Column with `filenum = 2` has files `relfilenode.128`, `relfilenode.129` .. `relfilenode.255`.
- Column with `filenum = 3` has files `relfilenode.256`, `relfilenode.257` .. `relfilenode.383`.
