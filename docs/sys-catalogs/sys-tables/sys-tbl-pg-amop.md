---
title: pg_amop
---

# pg_amop

The `pg_amop` table in the `pg_catalog` schema stores information about operators associated with index access method operator classes. There is one row for each operator that is a member of an operator class.

An entry's `amopmethod` must match the `opfmethod` of its containing operator family (including `amopmethod` here is an intentional denormalization of the catalog structure for performance reasons). Also, `amoplefttype` and `amoprighttype` must match the `oprleft` and `oprright` fields of the referenced `pg_operator` entry.

|column|type|references|description|
|------|----|----------|-----------|
|`oid`|oid| |Row identifier (hidden attribute; must be explicitly selected)|
|`amopfamily`|oid| `pg_opfamily.oid` |The operator family that this entry is for|
|`amoplefttype`|oid|`pg_type.oid`|Left-hand input data type of operator|
|`amoprighttype`|oid|`pg_type.oid`|Right-hand input data type of operator|
|`amopstrategy`|smallint| |Operator strategy number|
|`amoppurpose`|char| |Operator purpose, either `s` for search or `o` for ordering|
|`amopopr`|oid|`pg_operator.oid`|OID of the operator|
|`amopmethod`|oid|`pg_am.oid`|Index access method for the operator family|
|`amopsortfamily`|oid|`pg_opfamily.oid`|If an ordering operator, the B-tree operator family that this entry sorts according to; zero if a search operator|
