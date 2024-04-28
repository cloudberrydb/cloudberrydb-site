---
slug: cloudberrydb-dec-weekly
title: Cloudberry Database 社区简报 - 2023/12
authors: [cloudberrydbteam]
tags: [newsletter]
image: /img/blog/202312.png
---

你好！希望你在过去的新年假期度过了一段愉快的时光。感谢你浏览 12 月份最新一期 Cloudberry Database 社区简报！

在本简报中，我我们将分享项目最新更新、关键改进和社区成员贡献成果。一起看看有哪些新动态吧。

<!-- truncate -->

## Pull Request 清单

- Add guc gp_enable_explain_motion_detail to show sender time when Explain Analyse [#352](https://github.com/cloudberrydb/cloudberrydb/pull/352) by @songdongxiaoa2
- Turn on enable_shared_postgres_backend by default [#351](https://github.com/cloudberrydb/cloudberrydb/pull/351) by @gfphoenix78
- Change  `MAX_TARABLE_SYMLINK_PATH_LENGTH`  to 200 [#350](https://github.com/cloudberrydb/cloudberrydb/pull/350) by @shmiwy
- Fix compile error that pipe is redefined [#349](https://github.com/cloudberrydb/cloudberrydb/pull/349) by @gfphoenix78
- [Answer Query Using Materialized Views] Correct PlannerInfo fields after rewritten. [#348](https://github.com/cloudberrydb/cloudberrydb/pull/348) by @avamingli
- Add macro RelationIsNonblockRelation to expand code path like AO/CO [#347](https://github.com/cloudberrydb/cloudberrydb/pull/347) by @gfphoenix78
- Feature: Orca optimizor support pax storage table [#346](https://github.com/cloudberrydb/cloudberrydb/pull/346) by @gfphoenix78
- Feature encoding option for custom table AM [#343](https://github.com/cloudberrydb/cloudberrydb/pull/343) by @gfphoenix78
- [Answer Query Using Materialized Views] Support GROUP BY, GROUPING SETS, ROLLUP, CUBE in origin query. [#342](https://github.com/cloudberrydb/cloudberrydb/pull/342) by @avamingli
- Rename postgres.so to libpostgres.so [#341](https://github.com/cloudberrydb/cloudberrydb/pull/341) by @gfphoenix78
- Fix issues about namespace pg_ext_aux [#340](https://github.com/cloudberrydb/cloudberrydb/pull/340) by @gfphoenix78
- Dispatch by shared memory [#339](https://github.com/cloudberrydb/cloudberrydb/pull/339) by @Ray-Eldath
- Add callback in TableAmRoutine to handle swapping relation files [#338](https://github.com/cloudberrydb/cloudberrydb/pull/338) by @gfphoenix78
- Check index unique & skip prefetch for non-heap relation [#337](https://github.com/cloudberrydb/cloudberrydb/pull/337) by @gfphoenix78
- Add reloption support for custom table access method [#336](https://github.com/cloudberrydb/cloudberrydb/pull/336) by @gfphoenix78
- Add custom object class support [#335](https://github.com/cloudberrydb/cloudberrydb/pull/335) by @gfphoenix78
- Add namespace pg_ext_aux for extension [#333](https://github.com/cloudberrydb/cloudberrydb/pull/333) by @gfphoenix78
- Add dml hook for extensions [#332](https://github.com/cloudberrydb/cloudberrydb/pull/332) by @gfphoenix78
- Move struct workfile_set to workfile_mgr.c [#331](https://github.com/cloudberrydb/cloudberrydb/pull/331) by @gfphoenix78
- Fix \\d in psql to show correct storage name from pg_am [#330](https://github.com/cloudberrydb/cloudberrydb/pull/330) by @gfphoenix78
- Refactor the table AM: scan_begin_extractcolumns to contain execution context [#329](https://github.com/cloudberrydb/cloudberrydb/pull/329) by @gfphoenix78
- Expose some functions to support PAX for partition tables [#328](https://github.com/cloudberrydb/cloudberrydb/pull/328) by @gfphoenix78
- Enable SingleQE join with SegmentGeneralWorkers [#327](https://github.com/cloudberrydb/cloudberrydb/pull/327) by @avamingli
- Fix: may cause UAF problem in get_size_from_segDBs [#326](https://github.com/cloudberrydb/cloudberrydb/pull/326) by @jiaqizho
- Fix: Illegal PGnotify declaration [#325](https://github.com/cloudberrydb/cloudberrydb/pull/325)  by @jiaqizho
- Doc: update README.md for CloudberryDB [#324](https://github.com/cloudberrydb/cloudberrydb/pull/324) by @tuhaihe
- [Answer Query Using Materialized Views] Compute Aggregations on Materialized Views. [#322](https://github.com/cloudberrydb/cloudberrydb/pull/322) by @avamingli
- [Answer Query Using Materialized Views] Refactor codes to new file aqumv.c [#321](https://github.com/cloudberrydb/cloudberrydb/pull/321) by @avamingli
- Use FDW to query multiple servers as shards [#320](https://github.com/cloudberrydb/cloudberrydb/pull/320) by @oppenheimer01

## Issue 清单

- [Bug] [AQUMV]ERROR: invalid attnum 3 for relation "aqumv_t2" (ruleutils.c:7260) [#344](https://github.com/cloudberrydb/cloudberrydb/issues/344) by @avamingli
- [Bug] Run  `gpstop -m`  should shutdown with mode  `maintenance`  instead of  `smart` [#334](https://github.com/cloudberrydb/cloudberrydb/issues/334) by @tuhaihe
- Clean up CBDB_PARALLEL_FIXME [#323](https://github.com/cloudberrydb/cloudberrydb/issues/323) by @avamingli

## 工具与周边

我们最近发布了 Cloudberry Database 备份工具 - [gpbackup for CloudberryDB](https://github.com/cloudberrydb/gpbackup)。我们邀请你进行体验试用，更多 Cloudberry Database 工具和扩展正在推进中，敬请期待。

此外，我们已经完成了新网站的原型设计工作，未来几个月将进行开发工作，敬请期待。

我们还要感谢我们的文档团队，他们正在努力验证和编写文档。

## 贡献者

🎈️🎊️ 感谢以下贡献者在本月对 Cloudberry Database 的贡献，无论是提交 Pull Request、报告 issue 还是更新网站或文档，都让 Cloudberry Database 项目和社区越来越好，我们都欢迎：

> @songdongxiaoa2, @gfphoenix78, @shmiwy, @avamingli, @Ray-Eldath, @jiaqizho, @tuhaihe, @oppenheimer01, @IdaLee666, @TomShawn

## 加入我们

Cloudberry Database 致力于打造中立、开放和友好的数据库技术社区，我们面向任何人保持开放，无论其经验水平如何。我们鼓励各种类型的贡献，无论大小多少，可参考[《贡献指南》](https://cloudberrydb.org/contribute/how-to-contribute)查看可参与贡献的方式。

除此之外，我们为社区成员提供了丰富的交流、求助和获取反馈的渠道，可查看[支持页面](https://cloudberrydb.org/support)了解详情。如有任何问题或反馈，大胆求助即可，我们乐意帮助！

加入我们，成为社区成员的一份子吧！