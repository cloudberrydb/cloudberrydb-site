---
slug: march-2024-cloudberrydb-community-newsletter
title: "Cloudberry Database 社区简报 - 2024/3"
authors: [cloudberrydbteam]
tags: [newsletter]
image: /img/blog/202403.png
---

欢迎阅读我们的 2024 年 3 月 Cloudberry Database 社区简报。我们非常高兴能与大家分享 Cloudberry Database 项目和社区最新动态。马上开始吧！

<!-- truncate -->

## 版本发布

Cloudberry Database [v1.5.1](https://github.com/cloudberrydb/cloudberrydb/releases/tag/1.5.1) 发布，该版本是 1.5.0 的系列修正版本，并带有部分改进提升。更多信息，可参考[发布说明](https://cloudberrydb.org/docs/releases/release-1.5.1)了解详情。

<sub>想要快速体验？欢迎跟随我们的[训练营项目](https://cloudberrydb.org/bootcamp)，从构建 Cloudberry Database 沙箱开始上手体验。</sub>

## 网站

3 月份，我们在网站上添加了一些新功能，例如支持文档搜索。同时，我们还引入了日光模式来增强浏览体验。此外，我们目前正在重新设计网站首页架构和内容，敬请期待！

<iframe width="560" height="315" src="https://www.youtube.com/embed/BsirEs9zrJ8?si=duBv99IEii0s_J5L" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Pull Request 清单

- Default build for postgres_fdw [#400](https://github.com/cloudberrydb/cloudberrydb/pull/400) by @smartyhero
- Modify the orca optimizer's processing of unionall distribution strategy [#399](https://github.com/cloudberrydb/cloudberrydb/pull/399) by @Light-City
- Fix: invalid record type in projection list [#397](https://github.com/cloudberrydb/cloudberrydb/pull/397) by @jiaqizho
- [DNM]Fix: no need to do the qual-clause twice [#396](https://github.com/cloudberrydb/cloudberrydb/pull/396) by @jiaqizho
- Add inline function 'table_scan_flags' for table AM to get the flags [#395](https://github.com/cloudberrydb/cloudberrydb/pull/395) by @HuSen8891
- Fix: redefined sm4 in pgcrypto and backend/crypto [#394](https://github.com/cloudberrydb/cloudberrydb/pull/394) by @jiaqizho
- Enhancement: Add gpshrink to support elastic scaling [#393](https://github.com/cloudberrydb/cloudberrydb/pull/393) by @lss602726449
- Export numeric structure and interface to public [#392](https://github.com/cloudberrydb/cloudberrydb/pull/392) by @jiaqizho
- Add new callback 'scan_flags' for table access method [#391](https://github.com/cloudberrydb/cloudberrydb/pull/391) by @HuSen8891
- Implement of Directory table [#390](https://github.com/cloudberrydb/cloudberrydb/pull/390) by @wenchaozhang-123
- Move preloaded interconnect to the header file [#388](https://github.com/cloudberrydb/cloudberrydb/pull/388) by @gfphoenix78

## 功能需求与建议

- Support disaster recovery for CBDB in asynchronous mode [#398](https://github.com/orgs/cloudberrydb/discussions/398) By @my-ship-it

你觉得这个功能需求如何？欢迎留言评论，交流探讨。

## 贡献者

🎈️🎊️ 感谢以下贡献者在本月对 Cloudberry Database 的贡献：

> @smartyhero, @Light-City, @jiaqizho, @HuSen8891, @lss602726449, @wenchaozhang-123, @gfphoenix78, @vitalboyzf, @TomShawn, @my-ship-it

## 加入我们

Cloudberry Database 致力于打造中立、开放和友好的数据库技术社区，我们面向任何人保持开放，无论其经验水平如何。我们鼓励各种类型的贡献，无论大小多少，可参考[《贡献指南》](https://cloudberrydb.org/contribute/how-to-contribute)查看可参与贡献的方式。

除此之外，我们为社区成员提供了丰富的交流、求助和获取反馈的渠道，可查看[支持页面](https://cloudberrydb.org/support)了解详情。如有任何问题或反馈，大胆求助即可，我们乐意帮助！

加入我们，成为社区成员的一份子吧！

---

[![Slack](https://img.shields.io/badge/Slack-6a32c9)](https://communityinviter.com/apps/cloudberrydb/welcome) [![Twitter](https://img.shields.io/twitter/follow/cloudberrydb)](https://twitter.com/cloudberrydb) [![WeChat](https://img.shields.io/badge/WeChat-eebc46)](https://cloudberrydb.org/community/wechat) [![Website](https://img.shields.io/badge/Website-bbec46)](https://cloudberrydb.org) [![Youtube](https://img.shields.io/badge/Youtube-gebc46)](https://youtube.com/@cloudberrydb) [![Discussions](https://img.shields.io/badge/Forum-gebc46)](https://github.com/orgs/cloudberrydb/discussions)