---
slug: january-2024-cloudberrydb-community-newsletter
title: "Cloudberry Database 社区简报 - 2024/1"
authors: [cloudberrydbteam]
tags: [newsletter]
image: /img/blog/202401.png
---

感谢你阅读我们的 2024 年第一期 Cloudberry Database 社区简报。在本简报中，将与大家分享 Cloudberry Database 项目和社区最新动态。

<!-- truncate -->

## 亮点

### Cloudberry Database 路线图 2024

我们刚刚发布了 2024 年 Cloudberry Database 路线图，你可以在 [GitHub Discussions #369](https://github.com/orgs/cloudberrydb/discussions/369) 上查看详情。该路线图概述了 2024 年 Cloudberry Database 项目的里程碑，包括功能与增强、内核更新、流处理、湖仓、AI/ML、生态周边和版本计划等。

我们期待你能与我们一起塑造 Cloudberry Database 的未来。欢迎你提出想法并给到反馈。

### 网站焕然一新

2024 年初，我们推出了全新的 Cloudberry Database 网站，该网站具有清新、现代的设计。我们相信你将在新版网站上拥有出色的浏览体验。如果你有任何建议，欢迎告诉我们。

![New Website Screenshot](/img/blog/new-site-screenshot.png)

在接下来的几个月中，我们将引入对响应式布局、日光模式和更多功能的支持。请保持关注。

## Pull Request 清单

- Fix: unstable ao vacuum icw test [#376](https://github.com/cloudberrydb/cloudberrydb/pull/376) by @jiaqizho
- Don't inherit parent's reloptions if child partition's AM differs [#375](https://github.com/cloudberrydb/cloudberrydb/pull/375)  by @yjhjstz
- Extend a new AM method to do acquire sample rows. [#374](https://github.com/cloudberrydb/cloudberrydb/pull/374)  by @wenchaozhang-123
- Fix configue not consistent with configure.ac [#373](https://github.com/cloudberrydb/cloudberrydb/pull/373)  by @lss602726449
- Fix CopyCreateStmtFields, lost intoPolicy field. [#372](https://github.com/cloudberrydb/cloudberrydb/pull/372)  by @yjhjstz
- As ci will failed in upterm stage, revert it now. [#371](https://github.com/cloudberrydb/cloudberrydb/pull/371)  by @wenchaozhang-123
- [AQUMV] Use view's TupleDesc to construct final columns. [#366](https://github.com/cloudberrydb/cloudberrydb/pull/366)  by @avamingli
- Fix AO/AOCS insertDesc memory issue. [#365](https://github.com/cloudberrydb/cloudberrydb/pull/365)  by @avamingli
- Fix greenplum_path.sh change PATH [#363](https://github.com/cloudberrydb/cloudberrydb/pull/363)  by @Ray-Eldath
- make  `shareinput_Xslice_dsm_handle_ptr`  and  `shareinput_Xslice_hash`  non-static [#361](https://github.com/cloudberrydb/cloudberrydb/pull/361)  by @shmiwy
- [Answer Query Using Materialized Views] Support ORDER BY in origin query [#358](https://github.com/cloudberrydb/cloudberrydb/pull/358)  by @avamingli
- [AQUMV] Avoid misbehaviors that are not supported currently. [#357](https://github.com/cloudberrydb/cloudberrydb/pull/357)  by @avamingli
- gpssh: removing b and \r getting added to command output [#355](https://github.com/cloudberrydb/cloudberrydb/pull/355)  by @wenchaozhang-123
- [Answer Query Using Materialized Views] Support HAVING clause in origin query [#354](https://github.com/cloudberrydb/cloudberrydb/pull/354)  by @avamingli

## Issue 清单

- [Bug] a table specified with "appendonly=true, orientation=column" appears not as an ao table [#368](https://github.com/cloudberrydb/cloudberrydb/issues/368)  by @congxuebin
- [Bug] Copy from will fail when talble is ao_row [#364](https://github.com/cloudberrydb/cloudberrydb/issues/364)  by @shmiwy
- ERROR: found two entries in pg_aocsseg_73427122 [#362](https://github.com/cloudberrydb/cloudberrydb/issues/362)  by @liyxbeijing
- TeardownTCPInterconnect issue when interconnect type set as TCP [#360](https://github.com/cloudberrydb/cloudberrydb/issues/360)  by @liyxbeijing
- ic-proxy: interconnect error: connection closed prematurely [#359](https://github.com/cloudberrydb/cloudberrydb/issues/359)  by @liyxbeijing

## 周边工具

`gpbackup for Cloudberry Database` 版本 v1.0.3 发布，你可以从 [GitHub 仓库](https://github.com/cloudberrydb/gpbackup) 下载。

## 贡献者

🎈️🎊️ 感谢以下贡献者在本月对 Cloudberry Database 的贡献，无论是提交 Pull Request、报告 issue 还是更新网站或文档，都让 Cloudberry Database 项目和社区越来越好，我们都欢迎：

> @jiaqizho, @yjhjstz, @wenchaozhang-123, @lss602726449, @avamingli, @Ray-Eldath, @shmiwy, @congxuebin, @liyxbeijing, @tuhaihe, @TomShawn, @IdaLee666, @vitalboyzf

## 加入我们

Cloudberry Database 致力于打造中立、开放和友好的数据库技术社区，我们面向任何人保持开放，无论其经验水平如何。我们鼓励各种类型的贡献，无论大小多少，可参考[《贡献指南》](https://cloudberrydb.org/contribute/how-to-contribute)查看可参与贡献的方式。

除此之外，我们为社区成员提供了丰富的交流、求助和获取反馈的渠道，可查看[支持页面](https://cloudberrydb.org/support)了解详情。如有任何问题或反馈，大胆求助即可，我们乐意帮助！

加入我们，成为社区成员的一份子吧！