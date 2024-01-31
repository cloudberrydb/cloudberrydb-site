---
title: pg_attrdef
---

# pg_attrdef

The `pg_attrdef` table in the `pg_catalog` schema stores column default values. The main information about columns is stored in `pg_attribute`. Only columns that explicitly specify a default value (when the table is created or the column is added) will have an entry here.

|column|type|references|description|
|------|----|----------|-----------|
|`oid`|oid| |The object ID|
|`adrelid`|oid| `pg_class.oid` |The table this column belongs to|
|`adnum`|smallint| `pg_attribute.attnum` |The number of the column|
|`adbin`|pg_node_tree| |The internal representation of the column default value|