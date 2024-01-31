---
title: pg_amproc
---

# pg_amproc

The `pg_amproc` table in the `pg_catalog` schema stores information about support procedures associated with index access method operator classes. There is one row for each support procedure belonging to an operator class.

|column|type|references|description|
|------|----|----------|-----------|
|`oid`|oid| |Row identifier (hidden attribute; must be explicitly selected)|
|`amprocfamily`|oid|`pg_opfamily.oid`|The operator family this entry is for|
|`amproclefttype`|oid|`pg_type.oid`|Left-hand input data type of associated operator|
|`amprocrighttype`|oid|`pg_type.oid`|Right-hand input data type of associated operator|
|`amprocnum`|smallint| |Support procedure number|
|`amproc`|regproc|`pg_proc.oid`|OID of the procedure|
