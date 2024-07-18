---
slug: cloudberrydb-sep-weekly
title: Sep Newsletter - Cloudberry Database (2023/09)
authors: [cloudberrydbteam]
tags: [Newsletter]
image: /img/blog/202309.png
---

Welcome to the September monthly newsletter of the Cloudberry Database Community! Our goal with this newsletter is to keep you informed about the most recent developments, trends, and events within our community, as well as to highlight the impressive contributions and accomplishments of our members.

We invite you to join us in embracing the potential of open source technology as we work collaboratively to build an even stronger community.

Let's get started!

<!-- truncate -->

## Pull Requests

- Docs: merge docs for CBDB compilation on Linux systems [#224](https://github.com/cloudberrydb/cloudberrydb/pull/224) by @TomShawn
- New altertable rewrite dispatch policy [#223](https://github.com/cloudberrydb/cloudberrydb/pull/223) by @wangliang03
- bugfix: support hashdata tableam in Orca [#222](https://github.com/cloudberrydb/cloudberrydb/pull/222) by @gongxun0928
- [WIP]Add git hooks for Cloudberry Database development [#221](https://github.com/cloudberrydb/cloudberrydb/pull/221) by @tuhaihe
- Doc: update the building guide for MacOS [#220](https://github.com/cloudberrydb/cloudberrydb/pull/220) by @Zhangbaowen-Hashdata
- support alter table for hashdata format [#219](https://github.com/cloudberrydb/cloudberrydb/pull/219) by @wangliang03
- Fix incorrect index->reltuples after VACUUM [#217](https://github.com/cloudberrydb/cloudberrydb/pull/217) by @lss602726449
- Add regress pipeline for branch union_store_catalog [#211](https://github.com/cloudberrydb/cloudberrydb/pull/211) by @wenchaozhang-123
- change storage_am related catalog table main_manifest field type from… [#210](https://github.com/cloudberrydb/cloudberrydb/pull/210) by @wangliang03
- Add vacuum full in serverless [#209](https://github.com/cloudberrydb/cloudberrydb/pull/209) by @roseduan
- Implement extensible libpq protocol [#208](https://github.com/cloudberrydb/cloudberrydb/pull/208) by @wenchaozhang-123
- support analyze for unionstore table in cloudberry [#207](https://github.com/cloudberrydb/cloudberrydb/pull/207) by @gongxun0928
- SingleNode deployment [#206](https://github.com/cloudberrydb/cloudberrydb/pull/206) by @Ray-Eldath
- Add hooks for plugins to get control in transientrel_init/intorel_initplan. [#203](https://github.com/cloudberrydb/cloudberrydb/pull/203) by @HuSen8891
- Add main_manifest catalog table [#202](https://github.com/cloudberrydb/cloudberrydb/pull/202) by @roseduan
- Fix unportable scripts on macOS [#201](https://github.com/cloudberrydb/cloudberrydb/pull/201) by @Ray-Eldath
- Doc: update README.md for Cloudberry Database [#199](https://github.com/cloudberrydb/cloudberrydb/pull/199) by @tuhaihe
- Fix portability issues on macOS with gcc-13 [#198](https://github.com/cloudberrydb/cloudberrydb/pull/198) by @Ray-Eldath
- Feature: building Postgres backend into shared library [#197](https://github.com/cloudberrydb/cloudberrydb/pull/197) by @lss602726449
- Feature/add ext dml init fini hook for custom table am [#196](https://github.com/cloudberrydb/cloudberrydb/pull/196) by @gongxun0928
- Feature: separation of storage and compute [#192](https://github.com/cloudberrydb/cloudberrydb/pull/192) by @HuSen8891
- Feature: lazy initialize orca optimizer [#191](https://github.com/cloudberrydb/cloudberrydb/pull/191) by @lss602726449
- Add extensible smgr slot for other storage format. [#190](https://github.com/cloudberrydb/cloudberrydb/pull/190) by @wenchaozhang-123
- Feature: Support custom wal rmgr [#189](https://github.com/cloudberrydb/cloudberrydb/pull/189) by @gfphoenix78
- Update license headers for new CBDB source files [#187](https://github.com/cloudberrydb/cloudberrydb/pull/187) by @tuhaihe
- Fix warehouse test when external fts enabled [#182](https://github.com/cloudberrydb/cloudberrydb/pull/182) by @roseduan

## Proposals & Ideas

- [Feature Requests] Multiple character delimiter needs to be supported [#200](https://github.com/orgs/cloudberrydb/discussions/200) by @liang8283
- [Proposal] Support SingleNode Deployment [#188](https://github.com/orgs/cloudberrydb/discussions/188) by @Ray-Eldath

## Issues

- [Bug] Insert into a ao relation with 32 concurrent transactions failled [#216](https://github.com/cloudberrydb/cloudberrydb/issues/216) by @shmiwy
- [Bug] `gp_aoseg_name` may return wrong value. [#215](https://github.com/cloudberrydb/cloudberrydb/issues/215) by @shmiwy
- [Bug] `reltuples` in `pg_class` may be wrong for index [#214](https://github.com/cloudberrydb/cloudberrydb/issues/214) by @shmiwy
- [Bug] pg_relation_size may get wrong result. [#213](https://github.com/cloudberrydb/cloudberrydb/issues/213) by @shmiwy
- [Bug] count(*) query crashed and db in recovery mode [#212](https://github.com/cloudberrydb/cloudberrydb/issues/212) by @liyxbeijing
- [Bug] Report some errors after using new user-defined access methods [#195](https://github.com/cloudberrydb/cloudberrydb/issues/195) by @hw118118
- [Bug] gpinitsystem failed with missing library. [#194](https://github.com/cloudberrydb/cloudberrydb/issues/194) by @RyanWei

## Contributors

🎈️🎊️ Thanks to the following contributors for helping make Cloudberry Database better this month:

> @TomShawn, @wangliang03, @gongxun0928, @tuhaihe, @Zhangbaowen-Hashdata, @lss602726449, @wenchaozhang-123, @roseduan, @Ray-Eldath, @HuSen8891, @gfphoenix78, @liang8283, @shmiwy, @liyxbeijing, @hw118118, @RyanWei

## Join us

The Cloudberry Database community is open to contributions from anyone, regardless of their level of experience. We encourage all types of contributions, no matter how small. Our [contribution guide](https://cloudberrydb.org/contribute/how-to-contribute) is available to help you get started with the process.

In addition, we offer a variety of channels for community members to discuss, seek help, provide feedback, and chat. You can find support [here](https://cloudberrydb.org/support).

We wish you a happy weekend and look forward to seeing you again soon!
