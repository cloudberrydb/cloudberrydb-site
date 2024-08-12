---
title: JSON Functions and Operators
---

# JSON Functions and Operators in Cloudberry Database

This document describes:

- functions and operators for processing and creating JSON data
- the SQL/JSON path language

## Process and creating JSON data

Cloudberry Database includes built-in functions and operators that create and manipulate JSON data:

- [JSON operators](#json-operators)
- [JSON creation functions](#json-creation-functions)
- [JSON aggregate functions](#json-aggregate-functions)
- [JSON processing functions](#json-processing-functions)

### JSON operators

This table describes the operators that are available for use with the `json` and `jsonb` data types.

|Operator|Right Operand Type|Return Type|Description|Example|Example Result|
|--------|------------------|-----------|-----------|-------|--------------|
|`->`|`int`| `json` or `jsonb` | Get the JSON array element (indexed from zero, negative integers count from the end).|`'[{"a":"foo"},{"b":"bar"},{"c":"baz"}]'::json->2`|`{"c":"baz"}`|
|`->`|`text`| `json` or `jsonb` | Get the JSON object field by key.|`'{"a": {"b":"foo"}}'::json->'a'`|`{"b":"foo"}`|
|`->>`|`int`| `text` | Get the JSON array element as `text`.|`'[1,2,3]'::json->>2`|`3`|
|`->>`|`text`| `text` | Get the JSON object field as `text`.|`'{"a":1,"b":2}'::json->>'b'`|`2`|
|`#>`|`text[]`| `json` or `jsonb` | Get the JSON object at the specified path.|`'{"a": {"b":{"c": "foo"}}}'::json#>'{a,b}`'|`{"c": "foo"}`|
|`#>>`|`text[]`| `text` | Get the JSON object at the specified path as `text`.|`'{"a":[1,2,3],"b":[4,5,6]}'::json#>>'{a,2}'`|`3`|

> **Note** There are parallel variants of these operators for both the `json` and `jsonb` data types. The field/element/path extraction operators return the same data type as their left-hand input (either `json` or `jsonb`), except for those specified as returning `text`, which coerce the value to `text`. The field/element/path extraction operators return `NULL`, rather than failing, if the JSON input does not have the right structure to match the request; for example if no such element exists. The field/element/path extraction operators that accept integer JSON array subscripts all support negative subscripting from the end of arrays.

These standard comparison operators are available for `jsonb`, but not for `json.` They follow the ordering rules for B-tree operations outlined at jsonb Indexing.

|Operator|Description|
|--------|-----------|
|`<`|less than|
|`>`|greater than|
|`<=`|less than or equal to|
|`>=`|greater than or equal to|
|`=`|equal|
|`<>` or `!=`|not equal|

> **Note** The `!=` operator is converted to `<>` in the parser stage. It is not possible to implement `!=` and `<>` operators that do different things.

Operators that require the `jsonb` data type as the left operand are described in the following table. Many of these operators can be indexed by `jsonb` operator classes.

|Operator|Right Operand Type|Description|Example|
|--------|------------------|-----------|-------|
|`@>`|`jsonb`|Does the left JSON value contain the right JSON path/value entries at the top level?|`'{"a":1, "b":2}'::jsonb @> '{"b":2}'::jsonb`|
|`<@`|`jsonb`|Are the left JSON path/value enries contained at the top level within the right JSON value?|`'{"b":2}'::jsonb <@ '{"a":1, "b":2}'::jsonb`|
|`?`|`text`|Does the *string* exist as a top-level key within the JSON value?|`'{"a":1, "b":2}'::jsonb ? 'b'`|
|`?\|` |`text[]`|Do any of these array *strings* exist as a top-level key?|`'{"a":1, "b":2, "c":3}'::jsonb ?\| array['b', 'c']`|
|`?&`|`text[]`|Do all of these array *strings* exist as top-level keys?|`'["a", "b"]'::jsonb ?& array['a', 'b']`|
| `\|\|` | `jsonb` | Concatenate two `jsonb` values into a new `jsonb` value. | `'["a", "b"]'::jsonb \|\| '["c", "d"]'::jsonb` |
| `-` | `text` | Delete key/value pair or *string* elements from left operand. Key/value pairs are matched based on their key value.| `'{"a": "b"}'::jsonb - 'a'` |
| `-` | `text[]` | Delete multiple key/value pairs or *string* elements from left operand. Key/value pairs are matched based on their key value.| `'{"a": "b", "c": "d"}'::jsonb - '{a,c}'::text[]` |
| `-` | `integer` | Delete the array element with specified index (Negative integers count from the end). Throws an error if top level container is not an array.| `'["a", "b"]'::jsonb - 1` |
| `#-` | `text[]` | Delete the field or element with specified path (for JSON arrays, negative integers count from the end)	| `'["a", {"b":1}]'::jsonb #- '{1,b}'` |
| `@?` | `jsonpath` | Does JSON path return any item for the specified JSON value?| `'{"a":[1,2,3,4,5]}'::jsonb @? '$.a[*] ? (@ > 2)'` |
| `@@` | `jsonpath` | Returns the result of JSON path predicate check for the specified JSON value. Only the first item of the result is taken into account. If the result is not Boolean, then `null` is returned.| `'{"a":[1,2,3,4,5]}'::jsonb @@ '$.a[*] > 2'` |

> **Note**  The `||` operator concatenates two JSON objects by generating an object containing the union of their keys, taking the second object's value when there are duplicate keys. All other cases produce a JSON array: first, any non-array input is converted into a single-element array, and then the two arrays are concatenated. It does not operate recursively; only the top-level array or object structure is merged.

> **Note**  The `@?` and `@@` operators suppress the following errors: lacking object field or array element, unexpected JSON item type, and numeric errors. This behavior might be helpful while searching over JSON document collections of varying structure.

### JSON creation functions

This table describes the functions that create `json` and `jsonb` data type values. (There are no equivalent functions for `jsonb` for `row_to_json()` and `array_to_json()`. However, the `to_jsonb()` function supplies much the same functionality as these functions would.)

|Function|Description|Example|Example Result|
|--------|-----------|-------|--------------|
|`to_json(anyelement)` <br /> `to_jsonb(anyelement)`|Returns the value as a `json` or `jsonb` object. Arrays and composites are converted (recursively) to arrays and objects; otherwise, if the input contains a cast from the type to `json`, the cast function is used to perform the conversion; otherwise, a scalar value is produced. For any scalar type other than a number, a Boolean, or a null value, the text representation will be used, in such a fashion that it is a valid `json` or `jsonb` value.|`to_json('Fred said "Hi."'::text)` |`"Fred said "Hi.""`|
|`array_to_json(anyarray [, pretty_bool])`|Returns the array as a JSON array. A multidimensional array becomes a JSON array of arrays. Line feeds will be added between dimension-1 elements if `pretty_bool` is true.|`array_to_json('{{1,5},{99,100}}'::int[])`|`[[1,5],[99,100]]`|
|`row_to_json(record [, pretty_bool])`|Returns the row as a JSON object. Line feeds will be added between level-1 elements if `pretty_bool` is true.|`row_to_json(row(1,'foo'))`|`{"f1":1,"f2":"foo"}`|
|`json_build_array(VARIADIC "any")` <br /> `jsonb_build_array(VARIADIC "any")`|Builds a possibly-heterogeneously-typed JSON array out of a `VARIADIC` argument list.|`json_build_array(1,2,'3',4,5)`|`[1, 2, "3", 4, 5]`|
|`json_build_object(VARIADIC "any")` <br /> `jsonb_build_object(VARIADIC "any")`|Builds a JSON object out of a `VARIADIC` argument list. The argument list is taken in order and converted to a set of key/value pairs.|`json_build_object('foo',1,'bar',2)`|`{"foo": 1, "bar": 2}`|
|`json_object(text[])`<br />`jsonb_object(text[])`| Builds a JSON object out of a text array. The array must have either exactly one dimension with an even number of members, in which case they are taken as alternating key/value pairs, or two dimensions such that each inner array has exactly two elements, which are taken as a key/value pair. |`json_object('{a, 1, b, "def", c, 3.5}')` <br/><br/> `json_object('{{a, 1},{b, "def"},{c, 3.5}}')`|`{"a": "1", "b": "def", "c": "3.5"}`|
|`json_object(keys text[], values text[])` <br/> `jsonb_object(keys text[], values text[])`|Builds a JSON object out of a text array. This form of `json_object` takes keys and values pairwise from two separate arrays. In all other respects it is identical to the one-argument form.|`json_object('{a, b}', '{1,2}')`|`{"a": "1", "b": "2"}`|

> **Note** `array_to_json()` and `row_to_json()` have the same behavior as `to_json()` except for offering a pretty-printing option. The behavior described for `to_json()` likewise applies to each individual value converted by the other JSON creation functions.

> **Note** The hstore extension has a cast from `hstore` to `json`, so that `hstore` values converted via the JSON creation functions will be represented as JSON objects, not as primitive string values.

### JSON aggregate functions

This table shows the functions that aggregate records to an array of JSON objects and pairs of values to a JSON object

|Function|Argument Types|Return Type|Description|
|--------|--------------|-----------|-----------|
|`json_agg(record)` <br /> `jsonb_agg(record)`|`record`|`json`|Aggregates records as a JSON array of objects.|
|`json_object_agg(name, value)` <br /> `jsonb_object_agg(name, value)`|`("any", "any")`|`json`|Aggregates name/value pairs as a JSON object.|

### SQL/JSON path language

SQL/JSON path expressions specify the items to be retrieved from the JSON data, similar to XPath expressions used for SQL access to XML. In Cloudberry Database, path expressions are implemented as the `jsonpath` data type.

JSON query functions and operators pass the provided path expression to the *path engine* for evaluation. If the expression matches the queried JSON data, the corresponding SQL/JSON item is returned. Path expressions are written in the SQL/JSON path language and can also include arithmetic expressions and functions. Query functions treat the provided expression as a text string, so it must be enclosed in single quotes.

A path expression consists of a sequence of elements allowed by the `jsonpath` data type. The path expression is evaluated from left to right, but you can use parentheses to change the order of operations. If the evaluation is successful, a sequence of SQL/JSON items (*SQL/JSON sequence*) is produced, and the evaluation result is returned to the JSON query function that completes the specified computation.

To refer to the JSON data to be queried (the *context item*), use the `$` sign in the path expression. It can be followed by one or more accessor operators, which go down the JSON structure level by level to retrieve the content of context item. Each operator that follows deals with the result of the previous evaluation step.

For example, suppose you have some JSON data from a GPS tracker that you would like to parse, such as:

```shell
{
  "track": {
    "segments": [
      {
        "location":   [ 47.763, 13.4034 ],
        "start time": "2018-10-14 10:05:14",
        "HR": 73
      },
      {
        "location":   [ 47.706, 13.2635 ],
        "start time": "2018-10-14 10:39:21",
        "HR": 135
      }
    ]
  }
}
```

To retrieve the available track segments, you need to use the `.<key>` accessor operator for all the preceding JSON objects:

```shell
'$.track.segments'
```

If the item to retrieve is an element of an array, you have to unnest this array using the `[*]` operator. For example, the following path will return location coordinates for all the available track segments:

```shell
'$.track.segments[*].location'
```

To return the coordinates of the first segment only, you can specify the corresponding subscript in the `[]` accessor operator. Note that the SQL/JSON arrays are 0-relative:

```shell
'$.track.segments[0].location'
```

The result of each path evaluation step can be processed by one or more `jsonpath` operators and methods listed in [SQL/JSON Path Operators and Methods](#sqljson-path-operators-and-methods) below. Each method name must be preceded by a dot. For example, you can get an array size:

```shell
'$.track.segments.size()'
```

For more examples of using `jsonpath` operators and methods within path expressions, see [SQL/JSON Path Operators and Methods](#sqljson-path-operators-and-methods) below.

When defining the path, you can also use one or more *filter expressions* that work similar to the `WHERE` clause in SQL. A filter expression begins with a question mark and provides a condition in parentheses:

```shell
? (condition)
```

Filter expressions must be specified right after the path evaluation step to which they are applied. The result of this step is filtered to include only those items that satisfy the provided condition. SQL/JSON defines three-valued logic, so the condition can be `true`, `false`, or `unknown`. The `unknown` value plays the same role as SQL `NULL` and can be tested for with the is `unknown` predicate. Further path evaluation steps use only those items for which filter expressions return `true`.

Functions and operators that can be used in filter expressions are listed in [jsonpath Filter Expression Elements](#sqljson-filter-expression-elements). The path evaluation result to be filtered is denoted by the `@` variable. To refer to a JSON element stored at a lower nesting level, add one or more accessor operators after `@`.

Suppose you would like to retrieve all heart rate values higher than 130. You can achieve this using the following expression:

```shell
'$.track.segments[*].HR ? (@ > 130)'
```

To get the start time of segments with such values instead, you have to filter out irrelevant segments before returning the start time, so the filter expression is applied to the previous step, and the path used in the condition is different:

```shell
'$.track.segments[*] ? (@.HR > 130)."start time"'
```

You can use several filter expressions on the same nesting level, if required. For example, the following expression selects all segments that contain locations with relevant coordinates and high heart rate values:

```shell
'$.track.segments[*] ? (@.location[1] < 13.4) ? (@.HR > 130)."start time"'
```

Using filter expressions at different nesting levels is also allowed. The following example first filters all segments by location, and then returns high heart rate values for these segments, if available:

```shell
'$.track.segments[*] ? (@.location[1] < 13.4).HR ? (@ > 130)'
```

You can also nest filter expressions within each other:

```shell
'$.track ? (exists(@.segments[*] ? (@.HR > 130))).segments.size()'
```
This expression returns the size of the track if it contains any segments with high heart rate values, or an empty sequence otherwise.

### Deviations from standard

Cloudberry Database's implementation of SQL/JSON path language has the following deviations from the SQL/JSON standard:

- `.datetime()` item method is not implemented yet mainly because immutable `jsonpath` functions and operators cannot reference session timezone, which is used in some datetime operations. Datetime support will be added to `jsonpath` in future versions of Cloudberry Database.
- A path expression can be a Boolean predicate, although the SQL/JSON standard allows predicates only in filters. This is necessary for implementation of the `@@` operator. For example, the following `jsonpath` expression is valid in Cloudberry Database:

    ```shell
    '$.track.segments[*].HR < 70'
    ```
- There are minor differences in the interpretation of regular expression patterns used in `like_regex` filters as described in [Regular expressions](#regular-expressions).

### Strict and lax modes

When you query JSON data, the path expression may not match the actual JSON data structure. An attempt to access a non-existent member of an object or element of an array results in a structural error. SQL/JSON path expressions have two modes of handling structural errors:

- lax (default) — the path engine implicitly adapts the queried data to the specified path. Any remaining structural errors are suppressed and converted to empty SQL/JSON sequences.

- strict — if a structural error occurs, an error is raised.

The lax mode facilitates matching of a JSON document structure and path expression if the JSON data does not conform to the expected schema. If an operand does not match the requirements of a particular operation, it can be automatically wrapped as an SQL/JSON array or unwrapped by converting its elements into an SQL/JSON sequence before performing this operation. Besides, comparison operators automatically unwrap their operands in the lax mode, so you can compare SQL/JSON arrays out-of-the-box. An array of size 1 is considered equal to its sole element. Automatic unwrapping is not performed only when:

- The path expression contains `type()` or `size()` methods that return the type and the number of elements in the array, respectively.

- The queried JSON data contain nested arrays. In this case, only the outermost array is unwrapped, while all the inner arrays remain unchanged. Thus, implicit unwrapping can only go one level down within each path evaluation step.

For example, when querying the GPS data listed above, you can abstract from the fact that it stores an array of segments when using the lax mode:

```shell
'lax $.track.segments.location'
```

In the strict mode, the specified path must exactly match the structure of the queried JSON document to return an SQL/JSON item, so using this path expression will cause an error. To get the same result as in the lax mode, you have to explicitly unwrap the segments array:

```shell
'strict $.track.segments[*].location'
```

The `.**` accessor can lead to surprising results when using the lax mode. For instance, the following query selects every HR value twice:

```shell
lax $.**.HR
```

This happens because the `.**` accessor selects both the segments array and each of its elements, while the `.HR` accessor automatically unwraps arrays when using the lax mode. To avoid surprising results, we recommend using the `.**` accessor only in the strict mode. The following query selects each HR value just once:

```shell
strict $.**.HR
```

### Regular expressions

SQL/JSON path expressions allow matching text to a regular expression with the `like_regex` filter. For example, the following SQL/JSON path query would case-insensitively match all strings in an array that starts with an English vowel:

```shell
'$[*] ? (@ like_regex "^[aeiou]" flag "i")'
```

The optional flag string may include one or more of the characters `i` for case-insensitive match, `m` to allow `^` and `$` to match at newlines, `s` to allow `.` to match a newline, and `q` to quote the whole pattern (reducing the behavior to a simple substring match).

The SQL/JSON standard borrows its definition for regular expressions from the `LIKE_REGEX` operator, which in turn uses the XQuery standard. Cloudberry Database does not currently support the `LIKE_REGEX` operator. Therefore, the `like_regex` filter is implemented using the POSIX regular expression engine as described in [POSIX Regular Expressions](https://www.postgresql.org/docs/12/functions-matching.html#FUNCTIONS-POSIX-REGEXP). This leads to various minor discrepancies from standard SQL/JSON behavior which are catalogued in [Differences From XQuery (LIKE_REGEX)](https://www.postgresql.org/docs/12/functions-matching.html#POSIX-VS-XQUERY). Note, however, that the flag-letter incompatibilities described there do not apply to SQL/JSON, as it translates the XQuery flag letters to match what the POSIX engine expects.

Keep in mind that the pattern argument of `like_regex` is a JSON path string literal, written according to the rules given in jsonpath Type. This means in particular that any backslashes you want to use in the regular expression must be doubled. For example, to match string values of the root document that contain only digits:

```shell
$.* ? (@ like_regex "^\\d+$")
```

### SQL/JSON path operators and methods

The following table describes the operators and methods available in `jsonpath`:

| Operator/Method | Description | Example JSON | Example Query | Result |
|-----------------|-------------|--------------|---------------|--------|
| `+` (unary) | Plus operator that iterates over the SQL/JSON sequence | `{"x": [2.85, -14.7, -9.4]}` | `+ $.x.floor()` | `2, -15, -10` |
| `-` (unary) | Minus operator that iterates over the SQL/JSON sequence | `{"x": [2.85, -14.7, -9.4]}` | `- $.x.floor()` | `-2, 15, 10` |
| `+` (binary) | Addition | `[2]` | `2 + $[0]` | `4` |
| `-` (binary) | Subtraction | `[2]` | `4 - $[0]` | `2` |
| `*` | Multiplication | `[4]` | `2 * $[0]` | `8` |
| `/` | Division | `[8]` | `$[0] / 2` | `4` |
| `%` | Modulus | `[32]` | `$[0] % 10` | `2` |
| `type()` | Type of the SQL/JSON item | `[1, "2", {}]` | `$[*].type()` | `"number", "string", "object"` |
| `size()` | Size of the SQL/JSON item | `{"m": [11, 15]}` | `$.m.size()` | `2` |
| `double()` | Approximate floating-point number converted from an SQL/JSON number or a string | `{"len": "1.9"}` | `$.len.double() * 2` | `3.8` |
| `ceiling()` | Nearest integer greater than or equal to the SQL/JSON number | `{"h": 1.3}` | `$.h.ceiling()` | `2` |
| `floor()` | Nearest integer less than or equal to the SQL/JSON number | `{"h": 1.3}` | `$.h.floor()` | `1` |
| `abs()` | Absolute value of the SQL/JSON number | `{"z": -0.3}` | `$.z.abs()` | `0.3` |
| `keyvalue()` | Sequence of object's key-value pairs represented as array of items containing three fields (`"key"`, `"value"`, and `"id"`). `"id"` is a unique identifier of the object key-value pair belongs to. | `{"x": "20", "y": 32}` | `$.keyvalue()` | `{"key": "x", "value": "20", "id": 0}, {"key": "y", "value": 32, "id": 0}` |


### SQL/JSON filter expression elements

The following table describes the available filter expressions elements for `jsonpath`:

| Value/Predicate | Description | Example JSON | Example Query | Result |
|-----------------|-------------|--------------|---------------|--------|
| `==` | Equality operator | `[1, 2, 1, 3]` | `$[*] ? (@ == 1)` | `1, 1` |
| `!=` | Non-equality operator | `[1, 2, 1, 3]` | `$[*] ? (@ != 1)` | `2, 3` |
| `<>` | Non-equality operator (same as `!=`) | `[1, 2, 1, 3]` | `$[*] ? (@ <> 1)` | `2, 3` |
| `<` | Less-than operator | `[1, 2, 3]` | `$[*] ? (@ < 2)` | `1` |
| `<=` | Less-than-or-equal-to operator | `[1, 2, 3]` | `$[*] ? (@ <= 2)` | `1, 2` |
| `>` | Greater-than operator | `[1, 2, 3]` | `$[*] ? (@ > 2)` | `3` |
| `>=` | Greater-than-or-equal-to operator | `[1, 2, 3]` | `$[*] ? (@ >= 2)` | `2, 3` |
| `true` | Value used to perform comparison with JSON `true` literal | `[{"name": "John", "parent": false}, {"name": "Chris", "parent": true}]` | `$[*] ? (@.parent == true)` | `{"name": "Chris", "parent": true}` |
| `false` | Value used to perform comparison with JSON `false` literal | `[{"name": "John", "parent": false}, {"name": "Chris", "parent": true}]` | `$[*] ? (@.parent == false)` | `{"name": "John", "parent": false}` |
| `null` | Value used to perform comparison with JSON `null` value | `[{"name": "Mary", "job": null}, {"name": "Michael", "job": "driver"}]` | `$[*] ? (@.job == null) .name` | `"Mary"` |
| `&&` | Boolean AND | `[1, 3, 7]` | `$[*] ? (@ > 1 && @ < 5)` | `3` |
| `\|\|` | Boolean OR | `[1, 3, 7]` | `$[*] ? (@ < 1 \|\| @ > 5)` | `7` |
| `!` | Boolean NOT | `[1, 3, 7]` | `$[*] ? (!(@ < 5))` | `7` |
| `like_regex` | Tests whether the first operand matches the regular expression given by the second operand, optionally with modifications described by a string of `flag` characters. | `["abc", "abd", "aBdC", "abdacb", "babc"]` | `$[*] ? (@ like_regex "^ab.*c" flag "i")` | `"abc", "aBdC", "abdacb"` |
| `starts with` | Tests whether the second operand is an initial substring of the first operand | `["John Smith", "Mary Stone", "Bob Johnson"]` | `$[*] ? (@ starts with "John")` | `"John Smith"` |
| `exists` | Tests whether a path expression matches at least one SQL/JSON item | `{"x": [1, 2], "y": [2, 4]}` | `strict $.* ? (exists (@ ? (@[*] > 2)))` | `2, 4` |
| `is unknown` | Tests whether a Boolean condition is `unknown` | `[-1, 2, 7, "infinity"]` | `$[*] ? ((@ > 0) is unknown)` | `"infinity"` |
