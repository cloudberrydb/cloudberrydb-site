---
title: 1.5.2
---

:::caution

This is not an Apache release!

:::

# Cloudberry Database v1.5.2 Release Notes

Version number: v1.5.2

Cloudberry Database v1.5.2 is a minor release that includes some improvements and bug fixes.

Quick try: [v1.5.2](https://github.com/cloudberrydb/cloudberrydb/releases/tag/1.5.2)

Full changelog: [https://github.com/cloudberrydb/cloudberrydb/compare/1.5.1...1.5.2](https://github.com/cloudberrydb/cloudberrydb/compare/1.5.1...1.5.2)

## Improvements

- Support `GROUP BY`, `GROUPING SETS`, `ROLLUP`, `CUBE` in origin queries for materialized views by @[avamingli](https://github.com/avamingli) in [#342](https://github.com/cloudberrydb/cloudberrydb/pull/342)
- Use `pg_class` instead of `gp_segment_configuration` to test `Entry` by @[avamingli](https://github.com/avamingli) in [#294](https://github.com/cloudberrydb/cloudberrydb/pull/294)
- The GPORCA optimizer now supports the PAX (Partition Attributes Across) storage table by @[gfphoenix78](https://github.com/gfphoenix78) in [#346](https://github.com/cloudberrydb/cloudberrydb/pull/346)
- Add the `RelationIsNonblockRelation` macro to expand code path like `AO`/`CO` by @[gfphoenix78](https://github.com/gfphoenix78) in [#347](https://github.com/cloudberrydb/cloudberrydb/pull/347)
- Feature encoding options for the custom table access method by @[gfphoenix78](https://github.com/gfphoenix78) in [#343](https://github.com/cloudberrydb/cloudberrydb/pull/343)
- Enable `enable_shared_postgres_backend` by default by @[gfphoenix78](https://github.com/gfphoenix78) in [#351](https://github.com/cloudberrydb/cloudberrydb/pull/351)
- Correct `PlannerInfo` fields after rewritten for materialized views by @[avamingli](https://github.com/avamingli) in [#348](https://github.com/cloudberrydb/cloudberrydb/pull/348)
- Support the `HAVING` clause in origin queries for materialized views by @[avamingli](https://github.com/avamingli) in [#354](https://github.com/cloudberrydb/cloudberrydb/pull/354)
- Avoid misbehaviors that are not supported currently by @[avamingli](https://github.com/avamingli) in [#357](https://github.com/cloudberrydb/cloudberrydb/pull/357)
- Support `ORDER BY` in origin queries for materialized views by @[avamingli](https://github.com/avamingli) in [#358](https://github.com/cloudberrydb/cloudberrydb/pull/358)
- Make `shareinput_Xslice_dsm_handle_ptr` and `shareinput_Xslice_hash` non-static by @[shmiwy](https://github.com/shmiwy) in [#361](https://github.com/cloudberrydb/cloudberrydb/pull/361)
- Revert `ci` in the `upterm` stage to avoid failure by @[wenchaozhang-123](https://github.com/wenchaozhang-123) in [#371](https://github.com/cloudberrydb/cloudberrydb/pull/371)
- Remove `b` and `\r` in the `gpssh` command output by @[wenchaozhang-123](https://github.com/wenchaozhang-123) in [#355](https://github.com/cloudberrydb/cloudberrydb/pull/355)
- Do not inherit the parent's reloptions if the child partition's `AM` differs by @[yjhjstz](https://github.com/yjhjstz) in [#375](https://github.com/cloudberrydb/cloudberrydb/pull/375)
- Extend a new table access method to do acquire sample rows by @[wenchaozhang-123](https://github.com/wenchaozhang-123) in [#374](https://github.com/cloudberrydb/cloudberrydb/pull/374)
- Use materialized views' `TupleDesc` to construct final columns by @[avamingli](https://github.com/avamingli) in [#366](https://github.com/cloudberrydb/cloudberrydb/pull/366)
- Add tests and benchmark in the `interconnect` module by @[jiaqizho](https://github.com/jiaqizho) in [#384](https://github.com/cloudberrydb/cloudberrydb/pull/384)
- Add a new callback `'scan_flags'` for the table access method by @[HuSen8891](https://github.com/HuSen8891) in [#391](https://github.com/cloudberrydb/cloudberrydb/pull/391)
- Export numeric structure and interface to public by @[jiaqizho](https://github.com/jiaqizho) in [#392](https://github.com/cloudberrydb/cloudberrydb/pull/392)
- Move the preloaded `interconnect` to the header file by @[gfphoenix78](https://github.com/gfphoenix78) in [#388](https://github.com/cloudberrydb/cloudberrydb/pull/388)
- Add an inline function `'table_scan_flags'` for table access method to get the flags by @[HuSen8891](https://github.com/HuSen8891) in [#395](https://github.com/cloudberrydb/cloudberrydb/pull/395)
- Add `gpshrink` to support elastic scaling by @[lss602726449](https://github.com/lss602726449) in [#393](https://github.com/cloudberrydb/cloudberrydb/pull/393)
- Revert [#201](https://github.com/cloudberrydb/cloudberrydb/pull/201) partially by @[Ray-Eldath](https://github.com/Ray-Eldath) in [#386](https://github.com/cloudberrydb/cloudberrydb/pull/386)
- Offload the entry root slice to `QE` by @[Ray-Eldath](https://github.com/Ray-Eldath) in [#385](https://github.com/cloudberrydb/cloudberrydb/pull/385)

## Bug fixes

- Fix the `AO`/`AOCS` `insertDesc` memory issue by @[avamingli](https://github.com/avamingli) in [#365](https://github.com/cloudberrydb/cloudberrydb/pull/365)
- Fix the issue that `CopyCreateStmtFields` lost the `intoPolicy` field by @[yjhjstz](https://github.com/yjhjstz) in [#372](https://github.com/cloudberrydb/cloudberrydb/pull/372)
- Fix the issue that `configue` is not consistent with `configure.ac` by @[lss602726449](https://github.com/lss602726449) in [#373](https://github.com/cloudberrydb/cloudberrydb/pull/373)
- Fix the unstable `ao`, `vacuum` and `icw` tests by @[jiaqizho](https://github.com/jiaqizho) in [#376](https://github.com/cloudberrydb/cloudberrydb/pull/376)
- Fix the issue that the shell script involves demo cluster by @[gfphoenix78](https://github.com/gfphoenix78) in [#377](https://github.com/cloudberrydb/cloudberrydb/pull/377)
- Fix `CREATE TYPE` in namespace `pg_ext_aux` by @[gfphoenix78](https://github.com/gfphoenix78) in [#380](https://github.com/cloudberrydb/cloudberrydb/pull/380)
- Fix the issue that `parallel_workers` is initialized as `0` for `CdbPathLocus_HashedOJ` by @[HuSen8891](https://github.com/HuSen8891) in [#387](https://github.com/cloudberrydb/cloudberrydb/pull/387)
- Fix the redefined `sm4` in `pgcrypto` and backend/crypto by @[jiaqizho](https://github.com/jiaqizho) in [#394](https://github.com/cloudberrydb/cloudberrydb/pull/394)

## 🙌🏻️ New contributor

@[shmiwy](https://github.com/shmiwy) made his (or her) first contribution in [#361](https://github.com/cloudberrydb/cloudberrydb/pull/361).

## 🧑🏻‍💻 Contributors

Thanks to all the contributors to make this release happen: @[avamingli](https://github.com/avamingli), @[gfphoenix78](https://github.com/gfphoenix78), @[shmiwy](https://github.com/shmiwy), @[wenchaozhang-123](https://github.com/wenchaozhang-123), @[yjhjstz](https://github.com/yjhjstz), @[lss602726449](https://github.com/lss602726449), @[jiaqizho](https://github.com/jiaqizho), @[HuSen8891](https://github.com/HuSen8891), @[Ray-Eldath](https://github.com/Ray-Eldath) 👍
