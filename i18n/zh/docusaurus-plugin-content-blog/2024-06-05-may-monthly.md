---
slug: may-2024-cloudberrydb-community-newsletter
title: "Cloudberry Database 社区简报 - 2024/5"
authors: [cloudberrydbteam]
tags: [Newsletter]
image: /img/blog/202405.png
---

❤️ 喜欢我们？欢迎在 GitHub 上给我们的仓库 [cloudberrydb/cloudberrydb](https://github.com/cloudberrydb/cloudberrydb) 点个赞！

## 发布 1.5.3 版本

Cloudberry Database v1.5.3 已于近期发布，本次版本是一个小版本更新，包含了一些提升改进、 bug 修复和文档更新。你可以查看[发版说明](https://cloudberrydb.org/docs/releases/release-1.5.3)了解详情。

我们的训练营已经在 [#422](https://github.com/orgs/cloudberrydb/discussions/422) 中宣布支持 Cloudberry Database v1.5.2 版本，不过不会支持 v1.5.3，因为 v1.5.3 版本中的某个新增功能需要安装额外依赖（后续改进中已移除额外依赖）。训练营项目将恢复支持本月即将发布的 1.5.4 版本。

## 亮点

在过去的周末，Cloudberry Database 连续 2 天上榜“GitHub 热门仓库” - C 语言类热门项目。特别感谢大家的支持，Cloudberry Database 关注度近期持续上升：

[![Star History Chart](https://api.star-history.com/svg?repos=cloudberrydb/cloudberrydb&type=Date)](https://star-history.com/#cloudberrydb/cloudberrydb&Date)

## 生态周边

PostGIS for Cloudberry Database 于近期发布 - [@cloudberrydb/postgis](https://github.com/cloudberrydb/postgis)。PostGIS 是一款 PostgreSQL 扩展，支持对地理空间数据进行存储、索引和查询。你可以按照指南在 Cloudberry Database 上安装 PostGIS，后续我们也将推进 PostGIS 版本升级。

## Pull Request 清单

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

## Issue 清单

- [Bug] Cannot access the code URL for googletest to result in GitHub Dependabot can't update dependencies. [#427](https://github.com/cloudberrydb/cloudberrydb/issues/427) by @tuhaihe
- [Bug] cbdb 1.5.2 version gpcheckperf does not display disk information [#421](https://github.com/cloudberrydb/cloudberrydb/issues/421) by @August-beaulo

## 贡献者

🎈️🎊️ 感谢以下贡献者在本月对 Cloudberry Database 的贡献：

> @avamingli, @lss602726449, @fanfuxiaoran, @jiaqizho, @foreyes, @songdongxiaoa2, @tuhaihe, @gfphoenix78, @wenchaozhang-123, @August-beaulo, @vitalboyzf, @TomShawn

## 加入我们

Cloudberry Database 致力于打造中立、开放和友好的数据库技术社区，我们面向任何人保持开放，无论其经验水平如何。我们鼓励各种类型的贡献，无论大小多少，可参考[《贡献指南》](https://cloudberrydb.org/contribute/how-to-contribute)查看可参与贡献的方式。

除此之外，我们为社区成员提供了丰富的交流、求助和获取反馈的渠道，可查看[支持页面](https://cloudberrydb.org/support)了解详情。如有任何问题或反馈，大胆求助即可，我们乐意帮助！

加入我们，成为社区成员的一份子吧！

---

[![Slack](https://img.shields.io/badge/Slack-6a32c9)](https://communityinviter.com/apps/cloudberrydb/welcome) [![Twitter](https://img.shields.io/twitter/follow/cloudberrydb)](https://twitter.com/cloudberrydb) [![WeChat](https://img.shields.io/badge/WeChat-eebc46)](https://cloudberrydb.org/community/wechat) [![Website](https://img.shields.io/badge/Website-bbec46)](https://cloudberrydb.org) [![Youtube](https://img.shields.io/badge/Youtube-gebc46)](https://youtube.com/@cloudberrydb) [![Discussions](https://img.shields.io/badge/Forum-gebc46)](https://github.com/orgs/cloudberrydb/discussions)