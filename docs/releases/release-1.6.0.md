---
title: 1.6.0
---

:::caution

This is not an Apache release!

:::

# Cloudberry Database v1.6.0 Release Notes

Version number: v1.6.0

Cloudberry Database v1.6.0 is a minor release that includes some improvements, changes, and bug fixes.

Quick try: [v1.6.0](https://github.com/cloudberrydb/cloudberrydb/releases/tag/1.6.0)

Full Changelog: [https://github.com/cloudberrydb/cloudberrydb/compare/1.5.4...1.6.0](https://github.com/cloudberrydb/cloudberrydb/compare/1.5.4...1.6.0)

## Improvements and modifications

:::tip
In the following notes, "AQUMV" refers to the "Answer Query Using Materialized Views" feature. See [Use Automatic Materialized Views for Query Optimization](/docs/performance/use-auto-materialized-view-to-answer-queries.md) for details.
:::

- Add `warehouse_id` to `pg_stat_activity_extended` by @[lss602726449](https://github.com/lss602726449) in [#453](https://github.com/cloudberrydb/cloudberrydb/pull/453)
- Modify the ORCA optimizer's processing of `UNION ALL` distribution strategy by @[Light-City](https://github.com/Light-City) in [#399](https://github.com/cloudberrydb/cloudberrydb/pull/399)
- Update the location of `python-dependencies.txt` by @[Zhangbaowen-Hashdata](https://github.com/Zhangbaowen-Hashdata) in [#460](https://github.com/cloudberrydb/cloudberrydb/pull/460)
- Add hook for `exec_simple_query` and support custom spilling memory threshold in the `cost` module by @[songdongxiaoa2](https://github.com/songdongxiaoa2) in [#447](https://github.com/cloudberrydb/cloudberrydb/pull/447)
- Use `contain_var_clause` instead of `pull_var_clause` in AQUMV by @[avamingli](https://github.com/avamingli) in [#451](https://github.com/cloudberrydb/cloudberrydb/pull/451)
- Add `matchignore` and remove meta-command username output for Directory Table by @[edespino](https://github.com/edespino) in [#464](https://github.com/cloudberrydb/cloudberrydb/pull/464)
- Add hook to support different methods to create, drop, or alter warehouses by @[lss602726449](https://github.com/lss602726449) in [#462](https://github.com/cloudberrydb/cloudberrydb/pull/462)
- Re-use index after `ALTER COLUMN TYPE` shouldn't change `relfilenode` by @[lss602726449](https://github.com/lss602726449) in [#474](https://github.com/cloudberrydb/cloudberrydb/pull/474)
- Cherry-pick Resgroup-related code from Greenplum from Mar 2, 2022 to Feb 7, 2023 by @[foreyes](https://github.com/foreyes) in [#448](https://github.com/cloudberrydb/cloudberrydb/pull/448)
- Add a weekly build and release process by @[Zhangbaowen-Hashdata](https://github.com/Zhangbaowen-Hashdata) in [#459](https://github.com/cloudberrydb/cloudberrydb/pull/459)
- Consider mutable functions and bypass expressions with no `Vars` for view query targets in AQUMV by @[avamingli](https://github.com/avamingli) in [#455](https://github.com/cloudberrydb/cloudberrydb/pull/455)
- Expose the function to adjust view query and `varno` fix in AQUMV by @[avamingli](https://github.com/avamingli) in [#469](https://github.com/cloudberrydb/cloudberrydb/pull/469)
- Modify weekly build release details by @[Zhangbaowen-Hashdata](https://github.com/Zhangbaowen-Hashdata) in [#477](https://github.com/cloudberrydb/cloudberrydb/pull/477)
- Call the `query_info_collect_hook` function directly if an exception occurs by @[foreyes](https://github.com/foreyes) in [#481](https://github.com/cloudberrydb/cloudberrydb/pull/481)
- Cherry-pick: Work around a spurious compiler warning in `inet` operators by @[gfphoenix78](https://github.com/gfphoenix78) in [#499](https://github.com/cloudberrydb/cloudberrydb/pull/499)
- Add LoongArch (`loongarch64`) support to `s_lock.h` by @[wangzw](https://github.com/wangzw) in [#500](https://github.com/cloudberrydb/cloudberrydb/pull/500)
- Implement features of the directory table by @[wenchaozhang-123](https://github.com/wenchaozhang-123) in [#484](https://github.com/cloudberrydb/cloudberrydb/pull/484)
- Re-enable the external FTS ICW by @[jiaqizho](https://github.com/jiaqizho) in [#483](https://github.com/cloudberrydb/cloudberrydb/pull/483)
- Change `AOCO_Compression` test case to validate `pg_relation_size` and `get_ao_compression_ratio` within a ±10% expected range by @[congxuebin](https://github.com/congxuebin) in [#493](https://github.com/cloudberrydb/cloudberrydb/pull/493)
- Maintain materialized view data status by @[avamingli](https://github.com/avamingli) in [#501](https://github.com/cloudberrydb/cloudberrydb/pull/501)
- Define `EXT_OID_START` to suggest an OID range for extensions by @[avamingli](https://github.com/avamingli) in [#514](https://github.com/cloudberrydb/cloudberrydb/pull/514)
- Ignore `pg_upgrade` to resolve CI issues by @[avamingli](https://github.com/avamingli) in [#515](https://github.com/cloudberrydb/cloudberrydb/pull/515)
- Reduce flakiness in `fts_segment_reset` test by @[jiaqizho](https://github.com/jiaqizho) in [#518](https://github.com/cloudberrydb/cloudberrydb/pull/518)
- Stabilize `gp_dqa` test case by @[congxuebin](https://github.com/congxuebin) in [#521](https://github.com/cloudberrydb/cloudberrydb/pull/521)
- Doc: Add more tools documentation for Cloudberry Database by @[tuhaihe](https://github.com/tuhaihe) in [#523](https://github.com/cloudberrydb/cloudberrydb/pull/523)
- Reimplement `COPY FROM` for directory table by @[wenchaozhang-123](https://github.com/wenchaozhang-123) in [#527](https://github.com/cloudberrydb/cloudberrydb/pull/527)
- Add materialized view-related trigger cases in SingleNode mode by @[avamingli](https://github.com/avamingli) in [#517](https://github.com/cloudberrydb/cloudberrydb/pull/517)
- Refactor view query target list processing in AQUMV by @[avamingli](https://github.com/avamingli) in [#525](https://github.com/cloudberrydb/cloudberrydb/pull/525)
- Implement the tagging feature by @[wenchaozhang-123](https://github.com/wenchaozhang-123) in [#444](https://github.com/cloudberrydb/cloudberrydb/pull/444)
- Update `orafce` to version 4.9 and enhance it by @[foreyes](https://github.com/foreyes) in [#524](https://github.com/cloudberrydb/cloudberrydb/pull/524)
- Allow normal materialized views to answer queries in AQUMV by @[avamingli](https://github.com/avamingli) in [#528](https://github.com/cloudberrydb/cloudberrydb/pull/528)
- Support `COPY FROM` for directory tables with entry distribution policy by @[wenchaozhang-123](https://github.com/wenchaozhang-123) in [#533](https://github.com/cloudberrydb/cloudberrydb/pull/533)
- Minor improvements to `README.md` by @[reshke](https://github.com/reshke) in [#534](https://github.com/cloudberrydb/cloudberrydb/pull/534)
- Use `FDW` to query multiple servers as shards by @[oppenheimer01](https://github.com/oppenheimer01) in [#320](https://github.com/cloudberrydb/cloudberrydb/pull/320)
- Add an option in `psql` to avoid encoding issues on certain platforms by @[gfphoenix78](https://github.com/gfphoenix78) in [#535](https://github.com/cloudberrydb/cloudberrydb/pull/535)
- Refactor `cbdb_log` to use `vfprintf` by @[ruhuang2001](https://github.com/ruhuang2001) in [#506](https://github.com/cloudberrydb/cloudberrydb/pull/506)
- Update `aocsam.c`: Fix `safeFSWriteSize` argument type by @[reshke](https://github.com/reshke) in [#540](https://github.com/cloudberrydb/cloudberrydb/pull/540)
- Update the CI image to `RockyLinux8` to ensure CI proper operations by @[Zhangbaowen-Hashdata](https://github.com/Zhangbaowen-Hashdata) in [#556](https://github.com/cloudberrydb/cloudberrydb/pull/556)
- Remove the unsupported `AC_FUNC_FSEEKO` macro by @[gfphoenix78](https://github.com/gfphoenix78) in [#543](https://github.com/cloudberrydb/cloudberrydb/pull/543)
- Adjust test cases for the `cloudberrydb` binary swap tests by @[congxuebin](https://github.com/congxuebin) in [#537](https://github.com/cloudberrydb/cloudberrydb/pull/537)
- Implement `CREATE FOREIGN TABLE LIKE` by @[avamingli](https://github.com/avamingli) in [#554](https://github.com/cloudberrydb/cloudberrydb/pull/554)
- Enable `SingleQE` join with `SegmentGeneralWorkers` by @[avamingli](https://github.com/avamingli) in [#327](https://github.com/cloudberrydb/cloudberrydb/pull/327)
- Use `syscache` lookup in `ShouldUseReservedSegno` by @[gongxun0928](https://github.com/gongxun0928) in [#541](https://github.com/cloudberrydb/cloudberrydb/pull/541)
- Implement `READ_STRING_FIELD_NULL` serializable read function by @[wenchaozhang-123](https://github.com/wenchaozhang-123) in [#553](https://github.com/cloudberrydb/cloudberrydb/pull/553)
- Update `appendonlywriter.c` to fix debug messages by @[reshke](https://github.com/reshke) in [#564](https://github.com/cloudberrydb/cloudberrydb/pull/564)
- Support locking directory tables by @[wenchaozhang-123](https://github.com/wenchaozhang-123) in [#572](https://github.com/cloudberrydb/cloudberrydb/pull/572)
- Update `ALTER TABLE` help command content by @[EcaleD](https://github.com/EcaleD) in [#574](https://github.com/cloudberrydb/cloudberrydb/pull/574)
- Cherry-pick `Resgroup V2` and toolkit from Greenplum Database by @[jiaqizho](https://github.com/jiaqizho) in [#531](https://github.com/cloudberrydb/cloudberrydb/pull/531)
- Fallback to PostgreSQL optimizer for ORCA when NL inner plan is index scan by @[gfphoenix78](https://github.com/gfphoenix78) in [#565](https://github.com/cloudberrydb/cloudberrydb/pull/565)
- Add `FIXME` for redundant parameter in `ivm_visible_in_prestate` call by @[reshke](https://github.com/reshke) in [#578](https://github.com/cloudberrydb/cloudberrydb/pull/578)
- Support `DISTRIBUTED BY` clause specification when creating materialized views with the `IF NOT EXISTS` clause by @[reshke](https://github.com/reshke) in [#563](https://github.com/cloudberrydb/cloudberrydb/pull/563)
- Cherry-pick commits related to the recent `Resgroup V2` merge by @[reshke](https://github.com/reshke) in [#579](https://github.com/cloudberrydb/cloudberrydb/pull/579)
- Change temporary table names used for IMMV to less frequent sequences by @[reshke](https://github.com/reshke) in [#581](https://github.com/cloudberrydb/cloudberrydb/pull/581)
- Rephrase comments for deferred IVM case by @[reshke](https://github.com/reshke) in [#576](https://github.com/cloudberrydb/cloudberrydb/pull/576)
- Enable `fsync=on` by default in `gpAux/gpdemo/gpdemo-defaults.sh` by @[yjhjstz](https://github.com/yjhjstz) in [#585](https://github.com/cloudberrydb/cloudberrydb/pull/585)
- Forbid inherited tables from storing in `gp_matview_aux` by @[avamingli](https://github.com/avamingli) in [#587](https://github.com/cloudberrydb/cloudberrydb/pull/587)
- Check that relations have children when performing view matching in AQUMV by @[avamingli](https://github.com/avamingli) in [#577](https://github.com/cloudberrydb/cloudberrydb/pull/577)
- Update `check.c` to fix incorrect references to Cloudberry Database by @[reshke](https://github.com/reshke) in [#600](https://github.com/cloudberrydb/cloudberrydb/pull/600)
- Send rows in binary mode for `ANALYZE` by @[Light-City](https://github.com/Light-City) in [#601](https://github.com/cloudberrydb/cloudberrydb/pull/601)
- Enable `Resgroup` test cases in CI by @[jiaqizho](https://github.com/jiaqizho) in [#539](https://github.com/cloudberrydb/cloudberrydb/pull/539)
- Remove the `cbdb` weekly and release workflows by @[edespino](https://github.com/edespino) in [#615](https://github.com/cloudberrydb/cloudberrydb/pull/615)
- Free `tupleDesc` on commit or abort transaction by @[yjhjstz](https://github.com/yjhjstz) in [#551](https://github.com/cloudberrydb/cloudberrydb/pull/551)
- Replace `gpscp` with `gpsync` in external FTS by @[jiaqizho](https://github.com/jiaqizho) in [#470](https://github.com/cloudberrydb/cloudberrydb/pull/470)
- Add `ao_unique_index_build` test in `greenplum_schedule` by @[lss602726449](https://github.com/lss602726449) in [#562](https://github.com/cloudberrydb/cloudberrydb/pull/562)
- Avoid executing the `qual` clause twice by @[jiaqizho](https://github.com/jiaqizho) in [#396](https://github.com/cloudberrydb/cloudberrydb/pull/396)

## Bug fixes

- Fix the compile error caused by redefinition of `pipe` by @[gfphoenix78](https://github.com/gfphoenix78) in [#349](https://github.com/cloudberrydb/cloudberrydb/pull/349)
- Fix the issue with recording `password_history` when the role is not allowed to use profile by @[wenchaozhang-123](https://github.com/wenchaozhang-123) in [#480](https://github.com/cloudberrydb/cloudberrydb/pull/480)
- Resolve the inconsistent result issue in `gpdtm_plpgsql` test case by @[congxuebin](https://github.com/congxuebin) in [#491](https://github.com/cloudberrydb/cloudberrydb/pull/491)
- Fix the issue of Cloudberry Database CI not running properly by @[Zhangbaowen-Hashdata](https://github.com/Zhangbaowen-Hashdata) in [#497](https://github.com/cloudberrydb/cloudberrydb/pull/497)
- Fix the incorrect display of copy number when using `COPY TO` on a replicated table by @[wenchaozhang-123](https://github.com/wenchaozhang-123) in [#498](https://github.com/cloudberrydb/cloudberrydb/pull/498)
- Fix the memory block size issue in `bitmapinsert` by @[gfphoenix78](https://github.com/gfphoenix78) in [#495](https://github.com/cloudberrydb/cloudberrydb/pull/495)
- Fix the issue of ignoring direct table test files by @[avamingli](https://github.com/avamingli) in [#502](https://github.com/cloudberrydb/cloudberrydb/pull/502)
- Fix `gpinitsystem` issues by @[fanfuxiaoran](https://github.com/fanfuxiaoran) in [#490](https://github.com/cloudberrydb/cloudberrydb/pull/490)
- Fix compile errors detected by GCC 12 by @[gfphoenix78](https://github.com/gfphoenix78) in [#503](https://github.com/cloudberrydb/cloudberrydb/pull/503)
- Fix the `bsearch` compare function in `guc.c` by @[gfphoenix78](https://github.com/gfphoenix78) in [#507](https://github.com/cloudberrydb/cloudberrydb/pull/507)
- Fix commands that forgot to mark meta track by @[avamingli](https://github.com/avamingli) in [#505](https://github.com/cloudberrydb/cloudberrydb/pull/505)
- Fix compile error in C++20 by @[gfphoenix78](https://github.com/gfphoenix78) in [#510](https://github.com/cloudberrydb/cloudberrydb/pull/510)
- Fix the issue that `COPY TO` on directory table always returns `1` by @[wenchaozhang-123](https://github.com/wenchaozhang-123) in [#522](https://github.com/cloudberrydb/cloudberrydb/pull/522)
- Fix `segfilecount` of AO/AOCO during bulk insertion using `COPY` by @[avamingli](https://github.com/avamingli) in [#530](https://github.com/cloudberrydb/cloudberrydb/pull/530)
- Fix the crash of `COPY FROM` on AO/AOCO/PAX partitioned tables by @[avamingli](https://github.com/avamingli) in [#549](https://github.com/cloudberrydb/cloudberrydb/pull/549)
- Fix the issue that occurs when copying some directory tables by @[wenchaozhang-123](https://github.com/wenchaozhang-123) in [#550](https://github.com/cloudberrydb/cloudberrydb/pull/550)
- Fix bugs with base relation truncation for IMMV by @[reshke](https://github.com/reshke) in [#570](https://github.com/cloudberrydb/cloudberrydb/pull/570)
- Fix the compile-time error in `SparseData.h` by @[reshke](https://github.com/reshke) in [#566](https://github.com/cloudberrydb/cloudberrydb/pull/566)
- Fix `pxf_fragment.c` compilation failure by @[Terry1504](https://github.com/Terry1504) in [#590](https://github.com/cloudberrydb/cloudberrydb/pull/590)
- Fix `pg_upgrade` version parsing when upgrading from Greenplum by @[reshke](https://github.com/reshke) in [#599](https://github.com/cloudberrydb/cloudberrydb/pull/599)
- Fix serialization of expression `AEXPR_NOT_DISTINCT` by @[avamingli](https://github.com/avamingli) in [#598](https://github.com/cloudberrydb/cloudberrydb/pull/598)
- Fix writable rules on tables with related materialized views by @[avamingli](https://github.com/avamingli) in [#584](https://github.com/cloudberrydb/cloudberrydb/pull/584)
- Fix the issue with writable CTEs causing incorrect materialized view data status by @[avamingli](https://github.com/avamingli) in [#602](https://github.com/cloudberrydb/cloudberrydb/pull/602)
- Fix the issue of being unable to pull up equivalence class using the projected target list by @[yjhjstz](https://github.com/yjhjstz) in [#606](https://github.com/cloudberrydb/cloudberrydb/pull/606)

## 🙌🏻️ New contributors

- @[Light-City](https://github.com/Light-City) made their first contribution in [#399](https://github.com/cloudberrydb/cloudberrydb/pull/399)
- @[songdongxiaoa2](https://github.com/songdongxiaoa2) made their first contribution in [#447](https://github.com/cloudberrydb/cloudberrydb/pull/447)
- @[edespino](https://github.com/edespino) made their first contribution in [#464](https://github.com/cloudberrydb/cloudberrydb/pull/464)
- @[congxuebin](https://github.com/congxuebin) made their first contribution in [#491](https://github.com/cloudberrydb/cloudberrydb/pull/491)
- @[wangzw](https://github.com/wangzw) made their first contribution in [#500](https://github.com/cloudberrydb/cloudberrydb/pull/500)
- @[reshke](https://github.com/reshke) made their first contribution in [#534](https://github.com/cloudberrydb/cloudberrydb/pull/534)
- @[oppenheimer01](https://github.com/oppenheimer01) made their first contribution in [#320](https://github.com/cloudberrydb/cloudberrydb/pull/320)
- @[ruhuang2001](https://github.com/ruhuang2001) made their first contribution in [#506](https://github.com/cloudberrydb/cloudberrydb/pull/506)
- @[EcaleD](https://github.com/EcaleD) made their first contribution in [#574](https://github.com/cloudberrydb/cloudberrydb/pull/574)
- @[Terry1504](https://github.com/Terry1504) made their first contribution in [#590](https://github.com/cloudberrydb/cloudberrydb/pull/590)

## 🧑🏻‍💻 Contributors

Thanks to all the contributors to make this release happen: @[Aegeaner](https://github.com/Aegeaner), @[EcaleD](https://github.com/EcaleD), @[Light-City](https://github.com/Light-City), @[RMTT](https://github.com/RMTT), @[SmartKeyerror](https://github.com/SmartKeyerror), @[Tao-T](https://github.com/Tao-T), @[Terry1504](https://github.com/Terry1504), @[Zhangbaowen-Hashdata](https://github.com/Zhangbaowen-Hashdata), @[adam8157](https://github.com/adam8157), @[airfan1994](https://github.com/airfan1994), @[andr-sokolov](https://github.com/andr-sokolov), @[ashwinstar](https://github.com/ashwinstar), @[avamingli](https://github.com/avamingli), @[beeender](https://github.com/beeender), @[bmdoil](https://github.com/bmdoil), @[charliettxx](https://github.com/charliettxx), @[congxuebin](https://github.com/congxuebin), @[dgkimura](https://github.com/dgkimura), @[dh-cloud](https://github.com/dh-cloud), @[divyeshddv](https://github.com/divyeshddv), @[dreamedcheng](https://github.com/dreamedcheng), @[edespino](https://github.com/edespino), @[eespino](https://github.com/eespino), @[fairyfar](https://github.com/fairyfar), @[fanfuxiaoran](https://github.com/fanfuxiaoran), @[foreyes](https://github.com/foreyes), @[gfphoenix78](https://github.com/gfphoenix78), @[gongxun0928](https://github.com/gongxun0928), @[gpopt](https://github.com/gpopt), @[higuoxing](https://github.com/higuoxing), @[huansong](https://github.com/huansong), @[hyongtao-db](https://github.com/hyongtao-db), @[jchampio](https://github.com/jchampio), @[jiaqizho](https://github.com/jiaqizho), @[jimmyyih](https://github.com/jimmyyih), @[kainwen](https://github.com/kainwen), @[l-wang](https://github.com/l-wang), @[lss602726449](https://github.com/lss602726449), @[oppenheimer01](https://github.com/oppenheimer01), @[reshke](https://github.com/reshke), @[ruhuang2001](https://github.com/ruhuang2001), @[songdongxiaoa2](https://github.com/songdongxiaoa2), @[soumyadeep2007](https://github.com/soumyadeep2007), @[thedanhoffman](https://github.com/thedanhoffman), @[tuhaihe](https://github.com/tuhaihe), @[wangzw](https://github.com/wangzw), @[wenchaozhang-123](https://github.com/wenchaozhang-123), @[yanwr1](https://github.com/yanwr1), @[yaowangm](https://github.com/yaowangm), @[yjhjstz](https://github.com/yjhjstz), @[zhrt123](https://github.com/zhrt123), @[zxuejing](https://github.com/zxuejing)

<sub>🧂🧪 Try out Cloudberry Database via building [one Docker-based Sandbox](https://github.com/cloudberrydb/bootcamp), which is tailored to help you gain a basic understanding of Cloudberry Database's capabilities and features a range of materials, including tutorials, sample code, and crash courses.</sub>
