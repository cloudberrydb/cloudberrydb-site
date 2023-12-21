---
title: Data Types
---

# Cloudberry Database Data Types

Cloudberry Database has a rich set of native data types available to users. This document shows some of the built-in data types. In addition to the types listed here, there are also some internally used data types, such as oid (object identifier), but those are not documented in this document.

The following data types are specified by SQL: bit, bit varying, boolean, character varying, varchar, character, char, date, double precision, integer, interval, numeric, decimal, real, smallint, time (with or without time zone), and timestamp (with or without time zone).

Each data type has an external representation determined by its input and output functions. Many of the built-in types have obvious external formats. However, several types are either unique to PostgreSQL (and Cloudberry Database), such as geometric paths, or have several possibilities for formats, such as the date and time types. Some of the input and output functions are not invertible. That is, the result of an output function may lose accuracy when compared to the original input.

| Name                     | Alias                | Size            | Range                                       | Description                                              |
|----------------------------|------------------------|-----------------|---------------------------------------------|----------------------------------------------------------|
| `bigint`                   | `int8`                 | 8 bytes       | `-9223372036854775808` to `9223372036854775807` | Large range integer                                     |
| `bigserial`                | `serial8`              | 8 bytes       | `1` to `9223372036854775807`                | Large auto-incrementing integer                         |
| `bit [ (n) ]`              |                        | _n_ bits      | Bit string constant                         | Fixed-length bit string                                  |
| `bit varying [ (n) ]`      | `varbit`               | Actual number of bits | Bit string constant                         | Variable-length bit string                               |
| `boolean`                  | `bool`                 | 1 byte        | `true`/`false`, `t`/`f`, `yes`/`no`, `y`/`n`, `1`/`0` | Logical boolean (true/false)                             |
| `box`                      |                        | 32 bytes      | `((x1,y1),(x2,y2))`                         | Rectangular box in the plane, not allowed in distribution key columns. |
| `bytea1`                   |                        | 1 byte + binary string | Sequence of octets                      | Variable-length binary string                            |
| `character [ (n) ]`        | `char [ (n) ]`         | 1 byte + n  | Strings up to `n` characters in length     | Fixed-length, blank padded                               |
| `character varying [ (n) ]`| `varchar [ (n) ]`      | 1 byte + string size | Strings up to `n` characters in length     | Variable-length with limit                               |
| `cidr`                     |                        | 12 or 24 bytes |                                              | IPv4 and IPv6 networks                                   |
| `circle`                   |                        | 24 bytes      | `<(x,y),r>` (center and radius)             | Circle in the plane, not allowed in distribution key columns. |
| `date`                     |                        | 4 bytes       | `'4714-11-24 BC'` - `'999999-12-31 AD'`     | Calendar date (year, month, day)                         |
| `decimal [ (p, s) ]`1      | `numeric [ (p, s) ]`   | variable        | No limit                                    | User-specified precision, exact                          |
| `double precision`         | `float8`               | 8 bytes       | 15 decimal digits precision               | Variable-precision, inexact                              |
| `inet`                     |                        | 12 or 24 bytes |                                              | IPv4 and IPv6 hosts and networks                         |
| `integer`                  | `int4`                 | 4 bytes       | `-2147483648` to `+2147483647`              | Usual choice for integer                                 |
| `interval [ fields ] [ (p) ]` |                    | 16 bytes      | `-178000000 years` to `178000000 years`     | Time span                                                |
| `json`                     |                        | 1 byte + json size | json of any length                       | Variable unlimited length                                |
| `jsonb`                    |                        | 1 byte + binary string | json of any length in a decomposed binary format | Variable unlimited length                            |
| `lseg`                     |                        | 32 bytes      | `((x1,y1),(x2,y2))`                         | Line segment in the plane - not allowed in distribution key columns. |
| `macaddr`                  |                        | 6 bytes       |                                              | MAC addresses                                            |
| `macaddr8`                 |                        | 8 bytes       |                                              | MAC addresses (EUI-64 format)                            |
| `money`                    |                        | 8 bytes       | `-92233720368547758.08` to `+92233720368547758.07` | Currency amount              |
| `path`                     |                        | 16+16n bytes  | `[(x1,y1),...]`                              | Geometric path in the plane, not allowed in distribution key columns. |
| `point`                    |                        | 16 bytes      | `(x,y)`                                      | Geometric point in the plane, not allowed in distribution key columns. |
| `polygon`                  |                        | 40+16n bytes  | `((x1,y1),...)`                              | Closed geometric path in the plane, not allowed in distribution key columns. |
| `real`                     | `float4`               | 4 bytes       | 6 decimal digits precision                | Variable-precision, inexact                              |
| `serial`                   | `serial4`              | 4 bytes       | `1` to `2147483647`                         | Auto-incrementing integer                                |
| `smallint`                 | `int2`                 | 2 bytes       | `-32768` to `+32767`                        | Small range integer                                      |
| `text`                     |                        | 1 byte + string size | Strings of any length                   | Variable unlimited length                                |
| `time [ (p) ] [ without time zone ]` |             | 8 bytes       | `00:00:00[.000000]` - `24:00:00[.000000]`  | Time of day only                                         |
| `time [ (p) ] with time zone` | `timetz`            | 12 bytes      | `00:00:00+1559` - `24:00:00-1559`           | Time of day only, with time zone                         |
| `timestamp [ (p) ] [ without time zone ]` |         | 8 bytes       | `4713 BC` - `294,276 AD`                    | Both date and time                                       |
| `timestamp [ (p) ] with time zone` | `timestamptz`  | 8 bytes       | `4713 BC` - `294,276 AD`                    | Both date and time, with time zone                       |
| `uuid`                     |                        | 16 bytes      |                                              | Universally Unique Identifiers according to RFC 4122, ISO/IEC 9834-8:2005 |
| `xml`                      |                        | 1 byte + XML size | XML of any length                           | Variable unlimited length                                |
| `txid_snapshot`            |                        |                 |                                              | User-level transaction ID snapshot                       |
