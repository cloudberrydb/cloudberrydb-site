---
slug: february-2024-cloudberrydb-community-newsletter
title: "Cloudberry Database 社区简报 - 2024/2"
authors: [cloudberrydbteam]
tags: [newsletter]
image: /img/blog/202402.png
---

在度过了一段漫长的春节假期后，我们终于回到工作岗位迎来复工。本简报为 2024 年 2 月 Cloudberry Database 社区简报。在本简报中，我将分享 Cloudberry Database 项目和社区的最新更新。

<!-- truncate -->

## Pull Request 清单

- Fix: initialize parallel_workers to zero for CdbPathLocus_HashedOJ [#387](https://github.com/cloudberrydb/cloudberrydb/pull/387) by @HuSen8891
- Revert #201 partially [#386](https://github.com/cloudberrydb/cloudberrydb/pull/386) by @Ray-Eldath
- Offload entry root slice to QE [#385](https://github.com/cloudberrydb/cloudberrydb/pull/385) by @Ray-Eldath
- Feature: add tests and benchmark in interconnect module [#384](https://github.com/cloudberrydb/cloudberrydb/pull/384) by @jiaqizho
- Feature: extend int128 to numeric interface [#381](https://github.com/cloudberrydb/cloudberrydb/pull/381) by @jiaqizho
- Fix CREATE TYPE in namespace pg_ext_aux [#380](https://github.com/cloudberrydb/cloudberrydb/pull/380) by @gfphoenix78
- Fix shell script involves demo cluster [#377](https://github.com/cloudberrydb/cloudberrydb/pull/377) by @gfphoenix78

## 版本发布

我们发布了新版本 [v1.5.0](https://github.com/cloudberrydb/cloudberrydb/releases/tag/v1.5.0)，本版本带来了诸多重磅更新。你可以在[发布说明](https://cloudberrydb.org/docs/releases/release-1.5.0)查看更多详细信息。同时，向对本次版本发布做出贡献的贡献者致以感谢。

## 网站

在上个月，我们推出了新版 Cloudberry Database 网站。本月我们正在努力改善网站体验，包括添加响应式布局，以及更新一些页面的中文翻译。更多更新正在推出中。

## 功能需求与建议

- Support scale-down of Cloudberry Database clusters [#382](https://github.com/orgs/cloudberrydb/discussions/382).

## Issue 清单

- ERROR: Make install error on Centos7.9 [#383](https://github.com/cloudberrydb/cloudberrydb/issues/383) by @Zhangbaowen-Hashdata

## 贡献者

🎈️🎊️ 感谢以下贡献者在本月对 Cloudberry Database 的贡献，无论是提交 Pull Request、报告 issue 还是更新网站或文档，都让 Cloudberry Database 项目和社区越来越好，我们都欢迎：

> @HuSen8891, @Ray-Eldath, @jiaqizho, @gfphoenix78, @Zhangbaowen-Hashdata, @tuhaihe, @TomShawn, @vitalboyzf

## 加入我们

Cloudberry Database 致力于打造中立、开放和友好的数据库技术社区，我们面向任何人保持开放，无论其经验水平如何。我们鼓励各种类型的贡献，无论大小多少，可参考[《贡献指南》](https://cloudberrydb.org/contribute/how-to-contribute)查看可参与贡献的方式。

除此之外，我们为社区成员提供了丰富的交流、求助和获取反馈的渠道，可查看[支持页面](https://cloudberrydb.org/support)了解详情。如有任何问题或反馈，大胆求助即可，我们乐意帮助！

加入我们，成为社区成员的一份子吧！