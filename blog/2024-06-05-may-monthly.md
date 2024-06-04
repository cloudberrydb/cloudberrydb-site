---
slug: may-2024-cloudberrydb-community-newsletter
title: "May 2024 - Cloudberry Database Community Newsletter"
authors: [cloudberrydbteam]
tags: [Newsletter]
image: /img/blog/202405.png
---

❤️ Cloudberry Database? Giving it a ⭐ on the [cloudberrydb/cloudberrydb](https://github.com/cloudberrydb/cloudberrydb) repo!

## New Release

Cloudberry Database v1.5.3 was released with a few improvements, bug fixes, and doc updates. You can check the [release notes](https://cloudberrydb.org/docs/releases/release-1.5.3) for details.

Our Bootcamp program has supported Cloudberry Database v1.5.2 in [#422](https://github.com/orgs/cloudberrydb/discussions/422), but we will not support v1.5.3 because extra dependencies are needed in this release. We will update the bootcamp until the next release v1.5.4 this June.

## Highlights

In the past weekends, Cloudberry Database was on the ["GitHub trending/C"](https://github.com/trending/c?since=daily) list for two days. And our stars grew a lot, thanks to all the stargazers:

[![Star History Chart](https://api.star-history.com/svg?repos=cloudberrydb/cloudberrydb&type=Date)](https://star-history.com/#cloudberrydb/cloudberrydb&Date)

## Ecosystem

PostGIS for Cloudberry Database is in public - [@cloudberrydb/postgis](https://github.com/cloudberrydb/postgis). You can follow the guide to build it on Cloudberry Database. We will upgrade the PostGIS kernel in the following months.

## Pull Requests

- [Answer Query Using Materialized Views] Consider mutable functions and bypass expressions have no Vars for view query target. [#455](https://github.com/cloudberrydb/cloudberrydb/pull/455) by @avamingli
- Enhance: Add warehouse_id to pg_stat_activity_extended [#453](https://github.com/cloudberrydb/cloudberrydb/pull/453) by @lss602726449
- Insert more data to make tuplestore spill in regress/misc_jiras.sql. [#452](https://github.com/cloudberrydb/cloudberrydb/pull/452) by @fanfuxiaoran
- [AQUMV] Use contain_var_clause instead of pull_var_clause. [#451](https://github.com/cloudberrydb/cloudberrydb/pull/451) by @avamingli
- CPP keywords should not be used as function/parameter names [#449](https://github.com/cloudberrydb/cloudberrydb/pull/449) by @jiaqizho
- [WIP] Cherry-pick GUC related code base from GreenPlum [Mar 8, 2022 - Nov 25, 2022] [#448](https://github.com/cloudberrydb/cloudberrydb/pull/448) by @foreyes
- Add hook for exec_simple_query and support self-defined spilling memory threshold in cost module. [#447](https://github.com/cloudberrydb/cloudberrydb/pull/447) by @songdongxiaoa2
- [Answer Query Using Materialized Views] Support LIMIT/OFFSET/FETCH clause on origin query. [#446](https://github.com/cloudberrydb/cloudberrydb/pull/446) by @avamingli
- Cleanup the build tools and guide directories [#445](https://github.com/cloudberrydb/cloudberrydb/pull/445) by @tuhaihe
- Expand a new external var tag [#443](https://github.com/cloudberrydb/cloudberrydb/pull/443) by @jiaqizho
- PendingDelete: expand the pending deletes interface [#442](https://github.com/cloudberrydb/cloudberrydb/pull/442) by @jiaqizho
- [Answer Query Using Materialized Views] Support Postgres special grammar DISTINCT ON clause on origin query. [#441](https://github.com/cloudberrydb/cloudberrydb/pull/441) by @avamingli
- [WIP] Cherry-pick ResourceGroup update from GreenPlum [#440](https://github.com/cloudberrydb/cloudberrydb/pull/440) by @foreyes
- [AQUMV] Support DISTINCT clause on origin query. [#439](https://github.com/cloudberrydb/cloudberrydb/pull/439) by @avamingli
- Fix checking password file permissions in dbconn.py [#438](https://github.com/cloudberrydb/cloudberrydb/pull/438) by @fanfuxiaoran
- [ORCA] Fix flaky "Invalid key is inaccessible" fallback (#15147) [#437](https://github.com/cloudberrydb/cloudberrydb/pull/437) by @fanfuxiaoran
- Fix motion toast error. [#436](https://github.com/cloudberrydb/cloudberrydb/pull/436) by @gfphoenix78
- Refactor cbload to gpdirtableload with python. [#435](https://github.com/cloudberrydb/cloudberrydb/pull/435) by @wenchaozhang-123
- Fix explain(locus) issues. [#433](https://github.com/cloudberrydb/cloudberrydb/pull/433) by @avamingli
- Cherry pick from GPDB (02/07/2022-02/28/2022) [#432](https://github.com/cloudberrydb/cloudberrydb/pull/432) by @avamingli
- Remove cbload relevant codes. [#431](https://github.com/cloudberrydb/cloudberrydb/pull/431) by @wenchaozhang-123
- checkberry gpcheckperf series updates are used to solve the problem that cbdb 1.5.2 version gpcheckperf does not display disk information [#430](https://github.com/cloudberrydb/cloudberrydb/pull/430) by @August-beaulo
- Update the googletest module URL [#429](https://github.com/cloudberrydb/cloudberrydb/pull/429) by @tuhaihe
- Add function cbdb_relation_size [#428](https://github.com/cloudberrydb/cloudberrydb/pull/428) by @fanfuxiaoran
- Fix drop directory privilege check. [#425](https://github.com/cloudberrydb/cloudberrydb/pull/425) by @wenchaozhang-123
- Fix visimap consults for unique checks during UPDATEs [#423](https://github.com/cloudberrydb/cloudberrydb/pull/423) by @lss602726449

## Issues

- [Bug] Cannot access the code URL for googletest to result in GitHub Dependabot can't update dependencies. [#427](https://github.com/cloudberrydb/cloudberrydb/issues/427) by @tuhaihe
- [Bug] cbdb 1.5.2 version gpcheckperf does not display disk information [#421](https://github.com/cloudberrydb/cloudberrydb/issues/421) by @August-beaulo

## Contributors

🎈️🎊️ Thanks to the following contributors for helping make Cloudberry Database better this month:

> @avamingli, @lss602726449, @fanfuxiaoran, @jiaqizho, @foreyes, @songdongxiaoa2, @tuhaihe, @gfphoenix78, @wenchaozhang-123, @August-beaulo, @vitalboyzf, @TomShawn

## Join us

The Cloudberry Database community welcomes everyone to contribute, regardless of their level of experience. We encourage all types of contributions, no matter how small. Our [contribution guide](https://cloudberrydb.org/contribute) is available to help you get started with the process.

In addition, we offer various channels for community members to discuss, seek help, provide feedback, and chat. You can find [support](https://cloudberrydb.org/support) here. Let us know if you have any questions or feedback - we're always here to help!

Join us and be part of our community!
