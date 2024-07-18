---
slug: april-2024-cloudberrydb-community-newsletter
title: "Cloudberry Database 社区简报 - 2024/4"
authors: [cloudberrydbteam]
tags: [简报]
image: /img/blog/202404.png
---

欢迎来到 2024 年 4 月 Cloudberry Database 社区简报。我们非常高兴能与大家分享 Cloudberry Database 项目和社区最新动态。马上开始吧！

<!-- truncate -->

## 版本发布

我们希望 Cloudberry Database 版本发布周期更短，发布做到更加快速，能够让用户体验最新的功能和改进。我们当前正朝着这个方向努力。在本月，Cloudberry Database 1.5.2 刚刚发布，该版本搭载了大量更新。你可以在[发布页面](https://github.com/cloudberrydb/cloudberrydb/releases/tag/1.5.2)查看更新日志并下载 v1.5.2 进行尝试。

在过去的几周时间，我们升级了训练营项目，以支持 Cloudberry Database 1.5.1 版本。随着新版本 1.5.2 的推出，我们将在接下来的几周内尽快提供支持。

<sub>[训练营](https://github.com/cloudberrydb/bootcamp) 项目构建了以 Docker 为基础的沙箱，目标在于帮助大家体验 Cloudberry Database 基本能力，该项目提供了系列资料，包括教程、代码示例和速成课程等。</sub>

## 网站

Cloudberry Database 网站近期新增一批文档，包括 [cloudberrydb-site#75](https://github.com/cloudberrydb/cloudberrydb-site/pull/75)、[cloudberrydb-site#87](https://github.com/cloudberrydb/cloudberrydb-site/pull/87) 以及 [cloudberrydb-site#70](https://github.com/cloudberrydb/cloudberrydb-site/pull/70)。此外，我们正在加速审核 [cloudberrydb-site#118](https://github.com/cloudberrydb/cloudberrydb-site/pull/118)，近期将上线一部分页面的中文翻译。

## Pull Request 清单

值得注意的是，directory table ([#390](https://github.com/cloudberrydb/cloudberrydb/pull/390)) 已合并到主分支。你可以体验该功能，欢迎反馈。

- Fix copy from directory table. [#416](https://github.com/cloudberrydb/cloudberrydb/pull/416) by @wenchaozhang-123
- Fix directory table ci pipeline problems. [#414](https://github.com/cloudberrydb/cloudberrydb/pull/414) by @wenchaozhang-123
- Disable dump pax tables in `pg_dump`. [#412](https://github.com/cloudberrydb/cloudberrydb/pull/412) by @jiaqizho
- Doc: update the README.md. [#411](https://github.com/cloudberrydb/cloudberrydb/pull/411) by @tuhaihe
- Fix: pgrx cannot find function after numeric change interface. [#410](https://github.com/cloudberrydb/cloudberrydb/pull/410) by @jiaqizho
- Doc: update the deploying README.md. [#409](https://github.com/cloudberrydb/cloudberrydb/pull/409) by @Zhangbaowen-Hashdata
- Fix: make enough out data buffer when call `EVP_DecryptUpdate`. [#408](https://github.com/cloudberrydb/cloudberrydb/pull/408) by @kongfanshen-0801
- Feature: Use `amflags` to support Column-oriented scanning of custom tableam. [#407](https://github.com/cloudberrydb/cloudberrydb/pull/407) by @gongxun0928
- Add GUC `gp_random_insert_segments` to control the segments used for random distributed table insertion. [#406](https://github.com/cloudberrydb/cloudberrydb/pull/406) by @foreyes
- Push the runtime filter from hashjoin to seqscan or AM. [#405](https://github.com/cloudberrydb/cloudberrydb/pull/405) by @zhangyue-hashdata
- [cherry-pick] [7X] gpconfig does not escape '$' char. [#403](https://github.com/cloudberrydb/cloudberrydb/pull/403) by @Ray-Eldath

## 活动

我们很开心 Cloudberry Database 提交的开源之夏任务通过活动组委会审核，正式发布上线。本活动面向高校在校学生，如果你符合要求，欢迎关注我们的项目。

![Summer-OSPP](/img/blog/Summer-OSPP-AC.svg)

任务详情：[https://summer-ospp.ac.cn/org/prodetail/24e980375](https://summer-ospp.ac.cn/org/prodetail/24e980375)。

## 贡献者

🎈️🎊️ 感谢以下贡献者在本月对 Cloudberry Database 的贡献：

> @wenchaozhang-123, @jiaqizho, @tuhaihe, @Zhangbaowen-Hashdata, @kongfanshen-0801, @gongxun0928, @foreyes, @zhangyue-hashdata, @Ray-Eldath, @TomShawn

## 加入我们

Cloudberry Database 致力于打造中立、开放和友好的数据库技术社区，我们面向任何人保持开放，无论其经验水平如何。我们鼓励各种类型的贡献，无论大小多少，可参考[《贡献指南》](https://cloudberrydb.org/contribute/how-to-contribute)查看可参与贡献的方式。

除此之外，我们为社区成员提供了丰富的交流、求助和获取反馈的渠道，可查看[支持页面](https://cloudberrydb.org/support)了解详情。如有任何问题或反馈，大胆求助即可，我们乐意帮助！

加入我们，成为社区成员的一份子吧！

---

[![Slack](https://img.shields.io/badge/Slack-6a32c9)](https://communityinviter.com/apps/cloudberrydb/welcome) [![Twitter](https://img.shields.io/twitter/follow/cloudberrydb)](https://twitter.com/cloudberrydb) [![WeChat](https://img.shields.io/badge/WeChat-eebc46)](https://cloudberrydb.org/community/wechat) [![Website](https://img.shields.io/badge/Website-bbec46)](https://cloudberrydb.org) [![Youtube](https://img.shields.io/badge/Youtube-gebc46)](https://youtube.com/@cloudberrydb) [![Discussions](https://img.shields.io/badge/Forum-gebc46)](https://github.com/orgs/cloudberrydb/discussions)