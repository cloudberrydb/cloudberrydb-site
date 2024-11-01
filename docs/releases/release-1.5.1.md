---
title: 1.5.1
---

:::caution

This is not an Apache release!

:::

# Cloudberry Database v1.5.1 Release Notes

Version number: v1.5.1

Cloudberry Database v1.5.1 is a minor release that includes a few bug fixes.

Quick try: [v1.5.1](https://github.com/cloudberrydb/cloudberrydb/releases/tag/1.5.1)

## Improvements

* Check the uniqueness of index and skip prefetching for non-heap relations [#337](https://github.com/cloudberrydb/cloudberrydb/pull/337) @[gfphoenix78](https://github.com/gfphoenix78)
* Compute aggregations on materialized views [#322](https://github.com/cloudberrydb/cloudberrydb/pull/322) @[avamingli](https://github.com/avamingli)
* Introduce the `pg_ext_aux` namespace for extensions [#333](https://github.com/cloudberrydb/cloudberrydb/pull/333) @[gfphoenix78](https://github.com/gfphoenix78)
* Implement a DML hook for extensions [#332](https://github.com/cloudberrydb/cloudberrydb/pull/332) @[gfphoenix78](https://github.com/gfphoenix78)
* Support custom object classes [#335](https://github.com/cloudberrydb/cloudberrydb/pull/335) @[gfphoenix78](https://github.com/gfphoenix78)
* Add reloption support for custom table access methods [#336](https://github.com/cloudberrydb/cloudberrydb/pull/336) @[gfphoenix78](https://github.com/gfphoenix78)
* Introduce a callback in `TableAmRoutine` to manage swapping relation files [#338](https://github.com/cloudberrydb/cloudberrydb/pull/338) @[gfphoenix78](https://github.com/gfphoenix78)
* Update terminal information to reflect CloudberryDB [#300](https://github.com/cloudberrydb/cloudberrydb/pull/300) @[tuhaihe](https://github.com/tuhaihe)
* Refactor table AM to include execution context in `scan_begin_extractcolumns` [#329](https://github.com/cloudberrydb/cloudberrydb/pull/329) @[gfphoenix78](https://github.com/gfphoenix78)
* Expose functions to support PAX for partition tables [#328](https://github.com/cloudberrydb/cloudberrydb/pull/328) @[gfphoenix78](https://github.com/gfphoenix78)


## Bug fixes

* Fix an illegal `PGnotify` declaration issue [#325](https://github.com/cloudberrydb/cloudberrydb/pull/325) @[jiaqizho](https://github.com/jiaqizho)
* Fix a potential Use-After-Free (UAF) issue in `get_size_from_segDBs` [#326](https://github.com/cloudberrydb/cloudberrydb/pull/326) @[jiaqizho](https://github.com/jiaqizho)
* Fix the storage name display in `\d` command in psql from `pg_am` [#330](https://github.com/cloudberrydb/cloudberrydb/pull/330) @[gfphoenix78](https://github.com/gfphoenix78)
* Fix issues related to the `pg_ext_aux` namespace [#340](https://github.com/cloudberrydb/cloudberrydb/pull/340) @[gfphoenix78](https://github.com/gfphoenix78)
