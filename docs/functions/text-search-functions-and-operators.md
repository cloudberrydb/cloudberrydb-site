---
title: Text Search Functions and Operators
---

# Text Search Functions and Operators in Cloudberry Database

The following tables summarize the functions and operators that are provided for full text searching.

|Operator|Description|Example|Result|
|--------|-----------|-------|------|
|`@@`|`tsvector` matches `tsquery` ?|`to_tsvector('fat cats ate rats') @@ to_tsquery('cat & rat')`|`t`|
|`@@@`|deprecated synonym for `@@`|`to_tsvector('fat cats ate rats') @@@ to_tsquery('cat & rat')`|`t`|
|`\|\|`|concatenate`tsvector`s|`'a:1 b:2'::tsvector \|\| 'c:1 d:2 b:3'::tsvector`|`'a':1 'b':2,5 'c':3 'd':4`|
|`&&`|AND `tsquery`s together|`'fat \| rat'::tsquery && 'cat'::tsquery`|`( 'fat' \| 'rat' ) & 'cat'`|
|`\|\|`|OR `tsquery`s together|`'fat \| rat'::tsquery \|\| 'cat'::tsquery`|`( 'fat' \| 'rat' ) \| 'cat'`|
|`!!`|negate a`tsquery`|`!! 'cat'::tsquery`|`!'cat'`|
|`@>`|`tsquery` contains another ?|`'cat'::tsquery @> 'cat & rat'::tsquery`|`f`|
|`<@`|`tsquery` is contained in ?|`'cat'::tsquery <@ 'cat & rat'::tsquery`|`t`|

> **Note** The `tsquery` containment operators consider only the lexemes listed in the two queries, ignoring the combining operators.

In addition to the operators shown in the table, the ordinary B-tree comparison operators (`=`, `<`, etc) are defined for types `tsvector` and `tsquery`. These are not very useful for text searching but allow, for example, unique indexes to be built on columns of these types.

|Function|Return Type|Description|Example|Result|
|--------|-----------|-----------|-------|------|
|`get_current_ts_config()`|regconfig|get default text search configuration|get_current_ts_config()|english|
|`length(tsvector)`|integer|number of lexemes in tsvector|length('fat:2,4 cat:3 rat:5A'::tsvector)|3|
|`numnode(tsquery)`|integer|number of lexemes plus operators in tsquery|numnode('(fat & rat) \| cat'::tsquery)|5|
|`plainto_tsquery([ config regconfig , ] querytext)`|tsquery|produce tsquery ignoring punctuation|plainto_tsquery('english', 'The Fat Rats')|'fat' & 'rat'|
|`querytree(query tsquery)`|text|get indexable part of a tsquery|querytree('foo & ! bar'::tsquery)|'foo'|
|`setweight(tsvector, "char")`|tsvector|assign weight to each element of tsvector|setweight('fat:2,4 cat:3 rat:5B'::tsvector, 'A')|'cat':3A 'fat':2A,4A 'rat':5A|
|`strip(tsvector)`|tsvector|remove positions and weights from tsvector|strip('fat:2,4 cat:3 rat:5A'::tsvector)|'cat' 'fat' 'rat'|
|`to_tsquery([ config regconfig , ] query text)`|tsquery|normalize words and convert to tsquery|to_tsquery('english', 'The & Fat & Rats')|'fat' & 'rat'|
|`to_tsvector([ config regconfig , ] documenttext)`|tsvector|reduce document text to tsvector|to_tsvector('english', 'The Fat Rats')|'fat':2 'rat':3|
|`ts_headline([ config regconfig, ] documenttext, query tsquery [, options text ])`|text|display a query match|ts_headline('x y z', 'z'::tsquery)|x y <b>z</b>|
|`ts_rank([ weights float4[], ] vector tsvector,query tsquery [, normalization integer ])`|float4|rank document for query|ts_rank(textsearch, query)|0.818|
|`ts_rank_cd([ weights float4[], ] vectortsvector, query tsquery [, normalizationinteger ])`|float4|rank document for query using cover density|ts_rank_cd('{0.1, 0.2, 0.4, 1.0}', textsearch, query)|2.01317|
|`ts_rewrite(query tsquery, target tsquery,substitute tsquery)`|tsquery|replace target with substitute within query|ts_rewrite('a & b'::tsquery, 'a'::tsquery, 'foo\|bar'::tsquery)|'b' & ( 'foo' \| 'bar' )|
|`ts_rewrite(query tsquery, select text)`|tsquery|replace using targets and substitutes from a SELECTcommand|SELECT ts_rewrite('a & b'::tsquery, 'SELECT t,s FROM aliases')|'b' & ( 'foo' \| 'bar' )|
|`tsvector_update_trigger()`|trigger|trigger function for automatic tsvector column update|CREATE TRIGGER ... tsvector_update_trigger(tsvcol, 'pg_catalog.swedish', title, body)| |
|`tsvector_update_trigger_column()`|trigger|trigger function for automatic tsvector column update|CREATE TRIGGER ... tsvector_update_trigger_column(tsvcol, configcol, title, body)| |

> **Note** All the text search functions that accept an optional `regconfig` argument will use the configuration specified by `default_text_search_config` when that argument is omitted.

The functions in the following table are listed separately because they are not usually used in everyday text searching operations. They are helpful for development and debugging of new text search configurations.

|Function|Return Type|Description|Example|Result|
|--------|-----------|-----------|-------|------|
|`ts_debug([ *config* regconfig, ] *document* text, OUT *alias* text, OUT *description* text, OUT *token* text, OUT *dictionaries* regdictionary[], OUT *dictionary* regdictionary, OUT *lexemes* text[])`|`setof record`|test a configuration|`ts_debug('english', 'The Brightest supernovaes')`|`(asciiword,"Word, all ASCII",The,{english_stem},english_stem,{}) ...`|
|`ts_lexize(*dict* regdictionary, *token* text)`|`text[]`|test a dictionary|`ts_lexize('english_stem', 'stars')`|`{star}`|
|`ts_parse(*parser_name* text, *document* text, OUT *tokid* integer, OUT *token* text)`|`setof record`|test a parser|`ts_parse('default', 'foo - bar')`|``(1,foo) ...``|
|`ts_parse(*parser_oid* oid, *document* text, OUT *tokid* integer, OUT *token* text)`|`setof record`|test a parser|`ts_parse(3722, 'foo - bar')`|`(1,foo) ...`|
|`ts_token_type(*parser_name* text, OUT *tokid* integer, OUT *alias* text, OUT description text)`|`setof record`|get token types defined by parser|`ts_token_type('default')`|`(1,asciiword,"Word, all ASCII") ...`|
|`ts_token_type(*parser_oid* oid, OUT *tokid* integer, OUT *alias* text, OUT *description* text)`|`setof record`|get token types defined by parser|`ts_token_type(3722)`|`(1,asciiword,"Word, all ASCII") ...`|
|`ts_stat(*sqlquery* text, [ *weights* text, ] OUT *word* text, OUT *ndocinteger*, OUT *nentry* integer)`|`setof record`|get statistics of a tsvectorcolumn|`ts_stat('SELECT vector from apod')`|`(foo,10,15) ...`|
