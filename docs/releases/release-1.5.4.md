---
title: 1.5.4
---

:::caution

This is not an Apache release!

:::

# Cloudberry Database v1.5.4 Release Notes

Version number: v1.5.4

Cloudberry Database v1.5.4 is a minor release that includes some improvements, changes, and bug fixes.

Quick try: [v1.5.4](https://github.com/cloudberrydb/cloudberrydb/releases/tag/1.5.4)

Full Changelog: [https://github.com/cloudberrydb/cloudberrydb/compare/1.5.3...1.5.4](https://github.com/cloudberrydb/cloudberrydb/compare/1.5.3...1.5.4)

## Improvements

- Add the `cbdb_relation_size` function by [@fanfuxiaoran](https://github.com/fanfuxiaoran) in [#428](https://github.com/cloudberrydb/cloudberrydb/pull/428)
- Cherry-pick the updates from Greenplum Database upstream (02/07/2022-02/28/2022) by [@avamingli](https://github.com/avamingli) in [#432](https://github.com/cloudberrydb/cloudberrydb/pull/432)
- Support the `DISTINCT` clause in origin queries for "Answer Query Using Materialized Views" by [@avamingli](https://github.com/avamingli) in [#439](https://github.com/cloudberrydb/cloudberrydb/pull/439)
- Support the Postgres-specific `DISTINCT ON` clause in origin queries for "Answer Query Using Materialized Views" by [@avamingli](https://github.com/avamingli) in [#441](https://github.com/cloudberrydb/cloudberrydb/pull/441)
- Expand a new external variable tag by [@jiaqizho](https://github.com/jiaqizho) in [#443](https://github.com/cloudberrydb/cloudberrydb/pull/443)
- Expand the pending deletes interface by [@jiaqizho](https://github.com/jiaqizho) in [#442](https://github.com/cloudberrydb/cloudberrydb/pull/442)
- Support the `LIMIT`/`OFFSET`/`FETCH` clause in origin queries for "Answer Query Using Materialized Views" by [@avamingli](https://github.com/avamingli) in [#446](https://github.com/cloudberrydb/cloudberrydb/pull/446)
- Clean up the build tools and guide directories by [@tuhaihe](https://github.com/tuhaihe) in [#445](https://github.com/cloudberrydb/cloudberrydb/pull/445)
- Insert more data to make tuplestore spill in `regress/misc_jiras.sql` by [@fanfuxiaoran](https://github.com/fanfuxiaoran) in [#452](https://github.com/cloudberrydb/cloudberrydb/pull/452)

## Bug fixes

- Fix the motion toast error by [@gfphoenix78](https://github.com/gfphoenix78) in [#436](https://github.com/cloudberrydb/cloudberrydb/pull/436)
- Fix the issue of checking password file permissions in `dbconn.py` by [@fanfuxiaoran](https://github.com/fanfuxiaoran) in [#438](https://github.com/cloudberrydb/cloudberrydb/pull/438)
- Fix the ORCA issue of the flaky `Invalid key is inaccessible` fallback (#15147) by [@fanfuxiaoran](https://github.com/fanfuxiaoran) in [#437](https://github.com/cloudberrydb/cloudberrydb/pull/437)
- Fix `explain(locus)` issues by [@avamingli](https://github.com/avamingli) in [#433](https://github.com/cloudberrydb/cloudberrydb/pull/433)
- Use the checkberry `gpcheckperf` series updates to solve the problem that the `gpcheckperf` in Cloudberry Database v1.5.2 does not display disk information by [@August-beaulo](https://github.com/August-beaulo) in [#430](https://github.com/cloudberrydb/cloudberrydb/pull/430)

## Other changes

- Remove the `cbload`-related code by [@wenchaozhang-123](https://github.com/wenchaozhang-123) in [#431](https://github.com/cloudberrydb/cloudberrydb/pull/431)
- Refactor `cbload` to `gpdirtableload` using Python by [@wenchaozhang-123](https://github.com/wenchaozhang-123) in [#435](https://github.com/cloudberrydb/cloudberrydb/pull/435)
- Remove the CPP keywords that were used as function or parameter names by [@jiaqizho](https://github.com/jiaqizho) in [#449](https://github.com/cloudberrydb/cloudberrydb/pull/449)

## 🙌🏻️ New contributor

[@fanfuxiaoran](https://github.com/fanfuxiaoran) made their first contribution in [#428](https://github.com/cloudberrydb/cloudberrydb/pull/428)

## 🧑🏻‍💻 Contributor list

Thanks to all the contributors to make this release happen: [@higuoxing](https://github.com/higuoxing), [@tuhaihe](https://github.com/tuhaihe), [@August-beaulo](https://github.com/August-beaulo), [@avamingli](https://github.com/avamingli), [@piyushc01](https://github.com/piyushc01), [@red1452](https://github.com/red1452), [@edespino](https://github.com/edespino), [@jnihal](https://github.com/jnihal), [@Annu149](https://github.com/Annu149), [@jiaqizho](https://github.com/jiaqizho), [@wenchaozhang-123](https://github.com/wenchaozhang-123), [@dgkimura](https://github.com/dgkimura), [@fanfuxiaoran](https://github.com/fanfuxiaoran), [@gfphoenix78](https://github.com/gfphoenix78), [@HelloYJohn](https://github.com/HelloYJohn), [@adam8157](https://github.com/adam8157), [@xiaoxiaoHe-E](https://github.com/xiaoxiaoHe-E), [@InnerLife0](https://github.com/InnerLife0), [@wuyuhao28](https://github.com/wuyuhao28), [@l-wang](https://github.com/l-wang), [@lij55](https://github.com/lij55), [@huansong](https://github.com/huansong), [@chrishajas](https://github.com/chrishajas), [@tglsfdc](https://github.com/tglsfdc), [@fairyfar](https://github.com/fairyfar), [@kainwen](https://github.com/kainwen), [@nmisch](https://github.com/nmisch), [@my-ship-it](https://github.com/my-ship-it)