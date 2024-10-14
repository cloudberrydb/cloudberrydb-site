---
title: pg_aggregate
---

# pg_aggregate

The `pg_aggregate` table in the `pg_catalog` schema stores information about aggregate functions. An aggregate function is a function that operates on a set of values (typically one column from each row that matches a query condition) and returns a single value computed from all these values. Typical aggregate functions are `sum`, `count`, and `max`. Each entry in `pg_aggregate` is an extension of an entry in `pg_proc`. The `pg_proc` entry carries the aggregate's name, input and output data types, and other information that is similar to ordinary functions.

|column|type|references|description|
|------|----|----------|-----------|
|`aggfnoid`|regproc|`pg_proc.oid`|OID of the aggregate function|
|`aggkind`|char| |Aggregate kind: `n` for *normal* aggregates, `o` for *ordered-set* aggregates, or `h` for *hypothetical-set* aggregates|
|`aggnumdirectargs`|smallint| |Number of direct (non-aggregated) arguments of an ordered-set or hypothetical-set aggregate, counting a variadic array as one argument. If equal to `pronargs`, the aggregate must be variadic and the variadic array describes the aggregated arguments as well as the final direct arguments. Always zero for normal aggregates.|
|`aggtransfn`|regproc|`pg_proc.oid`|Transition function OID|
|`aggfinalfn`|regproc|`pg_proc.oid`|Final function OID (zero if none)|
|`aggcombinefn`|regproc|`pg_proc.oid`|Combine function OID (zero if none)|
|`aggserialfn`|regproc|`pg_proc.oid`|OID of the serialization function to convert transtype to `bytea` (zero if none)|
|`aggdeserialfn`|regproc|`pg_proc.oid`|OID of the deserialization function to convert `bytea` to transtype (zero if none)|
|`aggmtransfn`|regproc|`pg_proc.oid`|Forward transition function OID for moving-aggregate mode (zero if none)|
|`aggminvtransfn`|regproc|`pg_proc.oid`|Inverse transition function OID for moving-aggregate mode (zero if none)|
|`aggmfinalfn`|regproc|`pg_proc.oid`|Final function OID for moving-aggregate mode (zero if none)|
|`aggfinalextra`|bool| |True to pass extra dummy arguments to `aggfinalfn`|
|`aggmfinalextra`|bool| |True to pass extra dummy arguments to `aggmfinalfn`|
|`aggfinalmodify`|char| |Indicates whether `aggfinalfn` modifies the transition state|
|`aggmfinalmodify`|char| |Indicates whether `aggmfinalfn` modifies the transition state|
|`aggsortop`|oid|`pg_operator.oid`|Associated sort operator OID (zero if none)|
|`aggtranstype`|oid|`pg_type.oid`|Data type of the aggregate function's internal transition (state) data|
|`aggtransspace`|integer| |Approximate average size (in bytes) of the transition state data, or zero to use a default estimate|
|`aggmtranstype`|oid|`pg_type.oid`|Data type of the aggregate function's internal transition (state) data for moving-aggregate mode (zero if none)|
|`aggmtransspace`|integer| |Approximate average size (in bytes) of the transition state data for moving-aggregate mode, or zero to use a default estimate|
|`agginitval`|text| |The initial value of the transition state. This is a text field containing the initial value in its external string representation. If this field is NULL, the transition state value starts out NULL.|
|`aggminitval`|text| |The initial value of the transition state for moving- aggregate mode. This is a text field containing the initial value in its external string representation. If this field is NULL, the transition state value starts out NULL.|
