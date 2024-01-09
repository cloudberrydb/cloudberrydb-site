---
slug: cloudberrydb-dec-weekly
title: December Newsletter - Cloudberry Database (2023/12)
authors: [cloudberrydbteam]
tags: [newsletter]
---
Hello there! We hope you're having a great time during the holiday season. Thank you for joining us for the latest Cloudberry Database project newsletter in December!

In this newsletter, we will be sharing the latest updates, improvements, and contributions made by our incredible members. Let's dive right in and explore what's new!

<!-- truncate -->

## Pull Requests

- [Add guc gp_enable_explain_motion_detail to show sender time when Explain Analyse #352](https://github.com/cloudberrydb/cloudberrydb/pull/352)  by @songdongxiaoa2
- [Turn on enable_shared_postgres_backend by default #351](https://github.com/cloudberrydb/cloudberrydb/pull/351)  by @gfphoenix78
- [change  `MAX_TARABLE_SYMLINK_PATH_LENGTH`  to 200 #350](https://github.com/cloudberrydb/cloudberrydb/pull/350)  by @shmiwy
- [Fix compile error that pipe is redefined #349](https://github.com/cloudberrydb/cloudberrydb/pull/349)  by @gfphoenix78
- [[Answer Query Using Materialized Views] Correct PlannerInfo fields after rewritten. #348](https://github.com/cloudberrydb/cloudberrydb/pull/348)  by @avamingli
- [Add macro RelationIsNonblockRelation to expand code path like AO/CO #347](https://github.com/cloudberrydb/cloudberrydb/pull/347)  by @gfphoenix78
- [Feature: Orca optimizor support pax storage table #346](https://github.com/cloudberrydb/cloudberrydb/pull/346)  by @gfphoenix78
- [Feature encoding option for custom table AM #343](https://github.com/cloudberrydb/cloudberrydb/pull/343)  by @gfphoenix78
- [[Answer Query Using Materialized Views] Support GROUP BY, GROUPING SETS, ROLLUP, CUBE in origin query. #342](https://github.com/cloudberrydb/cloudberrydb/pull/342)  by @avamingli
- [Rename postgres.so to libpostgres.so #341](https://github.com/cloudberrydb/cloudberrydb/pull/341)  by @gfphoenix78
- [Fix issues about namespace pg_ext_aux #340](https://github.com/cloudberrydb/cloudberrydb/pull/340)  by @gfphoenix78
- [Dispatch by shared memory #339](https://github.com/cloudberrydb/cloudberrydb/pull/339)  by @Ray-Eldath
- [Add callback in TableAmRoutine to handle swapping relation files #338](https://github.com/cloudberrydb/cloudberrydb/pull/338)  by @gfphoenix78
- [Check index unique & skip prefetch for non-heap relation #337](https://github.com/cloudberrydb/cloudberrydb/pull/337)  by @gfphoenix78
- [Add reloption support for custom table access method #336](https://github.com/cloudberrydb/cloudberrydb/pull/336)  by @gfphoenix78
- [Add custom object class support #335](https://github.com/cloudberrydb/cloudberrydb/pull/335)  by @gfphoenix78
- [Add namespace pg_ext_aux for extension #333](https://github.com/cloudberrydb/cloudberrydb/pull/333)  by @gfphoenix78
- [Add dml hook for extensions #332](https://github.com/cloudberrydb/cloudberrydb/pull/332)  by @gfphoenix78
- [Move struct workfile_set to workfile_mgr.c #331](https://github.com/cloudberrydb/cloudberrydb/pull/331)  by @gfphoenix78
- [Fix \\d in psql to show correct storage name from pg_am #330](https://github.com/cloudberrydb/cloudberrydb/pull/330)  by @gfphoenix78
- [Refactor the table AM: scan_begin_extractcolumns to contain execution context #329](https://github.com/cloudberrydb/cloudberrydb/pull/329)  by @gfphoenix78
- [Expose some functions to support PAX for partition tables #328](https://github.com/cloudberrydb/cloudberrydb/pull/328)  by @gfphoenix78
- [Enable SingleQE join with SegmentGeneralWorkers #327](https://github.com/cloudberrydb/cloudberrydb/pull/327)  by @avamingli
- [Fix: may cause UAF problem in get_size_from_segDBs #326](https://github.com/cloudberrydb/cloudberrydb/pull/326)  by @jiaqizho
- [Fix: Illegal PGnotify declaration #325](https://github.com/cloudberrydb/cloudberrydb/pull/325)  by @jiaqizho
- [Doc: update README.md for CloudberryDB #324](https://github.com/cloudberrydb/cloudberrydb/pull/324)  by @tuhaihe
- [[Answer Query Using Materialized Views] Compute Aggregations on Materialized Views. #322](https://github.com/cloudberrydb/cloudberrydb/pull/322)  by @avamingli
- [[Answer Query Using Materialized Views] Refactor codes to new file aqumv.c #321](https://github.com/cloudberrydb/cloudberrydb/pull/321)  by @avamingli
- [Use FDW to query multiple servers as shards #320](https://github.com/cloudberrydb/cloudberrydb/pull/320)  by @oppenheimer01

## Issues

- [[Bug] [AQUMV]ERROR: invalid attnum 3 for relation "aqumv_t2" (ruleutils.c:7260) #344](https://github.com/cloudberrydb/cloudberrydb/issues/344)  by @avamingli
- [[Bug] Run  `gpstop -m`  should shutdown with mode  `maintenance`  instead of  `smart` #334](https://github.com/cloudberrydb/cloudberrydb/issues/334)  by @tuhaihe
- [Clean up CBDB_PARALLEL_FIXME #323](https://github.com/cloudberrydb/cloudberrydb/issues/323)  by @avamingli

## Tools and more

We have recently released the backup utility,  [gpbackup for CloudberryDB](https://github.com/cloudberrydb/gpbackup). We invite you to try it out and look forward to the upcoming tools and extensions for CloudberryDB.

Additionally, we have finished the prototype work for our new website, which will be developed in the coming months. Please stay tuned.

We also want to give a shoutout to our CloudberryDB documentation team who are working hard to verify and organize documents. Thank you so much for your dedication!

## Contributors

🎈️🎊️ Thanks to the following contributors for helping make Cloudberry Database better this month:

> @songdongxiaoa2, @gfphoenix78, @shmiwy, @avamingli, @Ray-Eldath, @jiaqizho, @tuhaihe, @oppenheimer01, @IdaLee666, @TomShawn

## Join us

The Cloudberry Database community welcomes everyone to contribute, regardless of their level of experience. We encourage all types of contributions, no matter how small. Our  [contribution guide](https://cloudberrydb.org/contribute/how-to-contribute)  is available to help you get started with the process.

In addition, we offer various channels for community members to discuss, seek help, provide feedback, and chat. You can find  [support](https://cloudberrydb.org/support)  here. Let us know if you have any questions or feedback - we're always here to help!

Join us and be part of our community!
