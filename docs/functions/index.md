---
title: Summary of Built-in Functions
---

#  Summary of Built-in Functions

Cloudberry Database supports built-in functions and operators including analytic functions and window functions that can be used in window expressions.


```mdx-code-block
import DocCardList from '@theme/DocCardList';

<DocCardList />
```

## Cloudberry Database function types

Cloudberry Database evaluates functions and operators used in SQL expressions. Some functions and operators are only allowed to run on the coordinator since they could lead to inconsistencies in Cloudberry Database segment instances. This table describes the Cloudberry Database Function Types.

|Function Type|Cloudberry Support|Description|Comments|
|-------------|-----------------|-----------|--------|
|IMMUTABLE|Yes|Relies only on information directly in its argument list. Given the same argument values, always returns the same result.| |
|STABLE|Yes, in most cases|Within a single table scan, returns the same result for same argument values, but results change across SQL statements.|Results depend on database lookups or parameter values. `current_timestamp` family of functions is `STABLE`; values do not change within an execution.|
|VOLATILE|Restricted|Function values can change within a single table scan. For example: `random()`, `timeofday()`.|Any function with side effects is volatile, even if its result is predictable. For example: `setval()`.|

In Cloudberry Database, data is divided up across segments — each segment is a distinct PostgreSQL database. To prevent inconsistent or unexpected results, do not run functions classified as `VOLATILE` at the segment level if they contain SQL commands or modify the database in any way. For example, functions such as `setval()` are not allowed to run on distributed data in Cloudberry Database because they can cause inconsistent data between segment instances.

To ensure data consistency, you can safely use `VOLATILE` and `STABLE` functions in statements that are evaluated on and run from the coordinator. For example, the following statements run on the coordinator (statements without a `FROM` clause):

```sql
SELECT setval('myseq', 201);
SELECT foo();
```

If a statement has a `FROM` clause containing a distributed table *and* the function in the `FROM` clause returns a set of rows, the statement can run on the segments:

```sql
SELECT * from foo();
```

Cloudberry Database does not support functions that return a table reference (`rangeFuncs`) or functions that use the `refCursor` datatype.

## Built-in functions and operators

The following table lists the categories of built-in functions and operators supported by PostgreSQL. All functions and operators are supported in Cloudberry Database as in PostgreSQL with the exception of `STABLE` and `VOLATILE` functions, which are subject to the restrictions noted in [Cloudberry Database Function Types](#topic27). See the [Functions and Operators](https://www.postgresql.org/docs/14/functions.html) section of the PostgreSQL documentation for more information about these built-in functions and operators.

|Operator/Function Category|VOLATILE Functions|STABLE Functions|Restrictions|
|--------------------------|------------------|----------------|------------|
|[Logical Operators](https://www.postgresql.org/docs/14/functions-logical.html)| | | |
|[Comparison Operators](https://www.postgresql.org/docs/14/functions-comparison.html)| | | |
|[Mathematical Functions and Operators](https://www.postgresql.org/docs/14/functions-math.html)|random<br/><br/>setseed| | |
|[String Functions and Operators](https://www.postgresql.org/docs/14/functions-string.html)|*All built-in conversion functions*|convert<br/><br/>pg_client_encoding| |
|[Binary String Functions and Operators](https://www.postgresql.org/docs/14/functions-binarystring.html)| | | |
|[Bit String Functions and Operators](https://www.postgresql.org/docs/14/functions-bitstring.html)| | | |
|[Pattern Matching](https://www.postgresql.org/docs/14/functions-matching.html)| | | |
|[Data Type Formatting Functions](https://www.postgresql.org/docs/14/functions-formatting.html)| |to_char<br/><br/>to_timestamp| |
|[Date/Time Functions and Operators](https://www.postgresql.org/docs/14/functions-datetime.html)|timeofday|age<br/><br/>current_date<br/><br/>current_time<br/><br/>current_timestamp<br/><br/>localtime<br/><br/>localtimestamp<br/><br/>now| |
|[Enum Support Functions](https://www.postgresql.org/docs/14/functions-enum.html)| | | |
|[Geometric Functions and Operators](https://www.postgresql.org/docs/14/functions-geometry.html)| | | |
|[Network Address Functions and Operators](https://www.postgresql.org/docs/14/functions-net.html)| | | |
|[Sequence Manipulation Functions](https://www.postgresql.org/docs/14/functions-sequence.html)|nextval()<br/><br/>setval()| | |
|[Conditional Expressions](https://www.postgresql.org/docs/14/functions-conditional.html)| | | |
|[Array Functions and Operators](https://www.postgresql.org/docs/14/functions-array.html)| |*All array functions*| |
|[Aggregate Functions](https://www.postgresql.org/docs/14/functions-aggregate.html)| | | |
|[Subquery Expressions](https://www.postgresql.org/docs/14/functions-subquery.html)| | | |
|[Row and Array Comparisons](https://www.postgresql.org/docs/14/functions-comparisons.html)| | | |
|[Set Returning Functions](https://www.postgresql.org/docs/14/functions-srf.html)|generate_series| | |
|[System Information Functions](https://www.postgresql.org/docs/14/functions-info.html)| |*All session information functions*<br/><br/>*All access privilege inquiry functions*<br/><br/>*All schema visibility inquiry functions*<br/><br/>*All system catalog information functions*<br/><br/>*All comment information functions*<br/><br/>*All transaction ids and snapshots*| |
|[System Administration Functions](https://www.postgresql.org/docs/14/functions-admin.html)|set_config<br/><br/>pg_cancel_backend<br/><br/>pg_reload_conf<br/><br/>pg_rotate_logfile<br/><br/>pg_start_backup<br/><br/>pg_stop_backup<br/><br/>pg_size_pretty<br/><br/>pg_ls_dir<br/><br/>pg_read_file<br/><br/>pg_stat_file<br/><br/>|current_setting<br/><br/>*All database object size functions*|> **Note** The function `pg_column_size` displays bytes required to store the value, possibly with TOAST compression.|
|[XML Functions](https://www.postgresql.org/docs/14/functions-xml.html) and function-like expressions| |cursor_to_xml(cursor refcursor, count int, nulls boolean, tableforest boolean, targetns text)<br/><br/> cursor_to_xmlschema(cursor refcursor, nulls boolean, tableforest boolean, targetns text)<br/><br/>database_to_xml(nulls boolean, tableforest boolean, targetns text)<br/><br/>database_to_xmlschema(nulls boolean, tableforest boolean, targetns text)<br/><br/>database_to_xml_and_xmlschema(nulls boolean, tableforest boolean, targetns text)<br/><br/>query_to_xml(query text, nulls boolean, tableforest boolean, targetns text)<br/><br/>query_to_xmlschema(query text, nulls boolean, tableforest boolean, targetns text)<br/><br/>query_to_xml_and_xmlschema(query text, nulls boolean, tableforest boolean, targetns text)<br/><br/> schema_to_xml(schema name, nulls boolean, tableforest boolean, targetns text)<br/><br/>schema_to_xmlschema(schema name, nulls boolean, tableforest boolean, targetns text)<br/><br/>schema_to_xml_and_xmlschema(schema name, nulls boolean, tableforest boolean, targetns text)<br/><br/>table_to_xml(tbl regclass, nulls boolean, tableforest boolean, targetns text)<br/><br/>table_to_xmlschema(tbl regclass, nulls boolean, tableforest boolean, targetns text)<br/><br/>table_to_xml_and_xmlschema(tbl regclass, nulls boolean, tableforest boolean, targetns text)<br/><br/>xmlagg(xml)<br/><br/>xmlconcat(xml[, ...])<br/><br/>xmlelement(name name [, xmlattributes(value [AS attname] [, ... ])] [, content, ...])<br/><br/>xmlexists(text, xml)<br/><br/>xmlforest(content [AS name] [, ...])<br/><br/>xml_is_well_formed(text)<br/><br/>xml_is_well_formed_document(text)<br/><br/>xml_is_well_formed_content(text)<br/><br/>xmlparse ( `{ DOCUMENT \| CONTENT }` value)<br/><br/>xpath(text, xml)<br/><br/>xpath(text, xml, text[])<br/><br/>xpath_exists(text, xml)<br/><br/>xpath_exists(text, xml, text[])<br/><br/>xmlpi(name target [, content])<br/><br/>xmlroot(xml, version text \| no value [, standalone yes\|no\|no value])<br/><br/>xmlserialize ( `{ DOCUMENT \| CONTENT }` value AS type )<br/><br/>xml(text)<br/><br/>text(xml)<br/><br/>xmlcomment(xml)<br/><br/>xmlconcat2(xml, xml)<br/><br/>| |
