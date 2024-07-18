---
slug: cloudberrydb-nov-weekly
title: Cloudberry Database 社区简报 - 2023/11
authors: [cloudberrydbteam]
tags: [简报]
image: /img/blog/202311.png
---

你好！感谢你阅读我们 11 月的 Cloudberry Database 社区简报。

在本简报中，我们将分享项目最新更新、关键改进和社区成员贡献成果。内容话题丰富，涵盖了新功能、错误修复等。一起开启本期简报吧！

<!-- truncate -->

## 亮点：Cloudberry Database 训练营项目

几周前，我们宣布了 [Cloudberry Database 训练营](https://github.com/cloudberrydb/bootcamp)项目，该项目为社区成员提供了一个 Cloudberry Database 实践和上手操作平台。它专为帮助你了解 Cloudberry Database 功能而量身定制，并提供一系列材料，包括教程、示例代码和速成课程。如果你是 Cloudberry Database 新手，可以从训练营入手。你可以查看[公告博文](/blog/introducing-cloudberrydb-bootcamp)了解详细信息。

![CloudberryDB Sandbox](/img/cbdb-sandbox.png)

## Pull Request 清单

-   Feature: add user-defined index access method [#315](https://github.com/cloudberrydb/cloudberrydb/pull/315)  by @hw118118
-   Judge whether commands need to be dispatched to QEs in QD [#314](https://github.com/cloudberrydb/cloudberrydb/pull/314)  by @wenchaozhang-123
-   make main_manifest table not shared [#311](https://github.com/cloudberrydb/cloudberrydb/pull/311)  by @roseduan
-   Fix: enable trigger throught FDW in the serverless architecture. [#309](https://github.com/cloudberrydb/cloudberrydb/pull/309)  by @lss602726449
-   [Bug][github-actions] icw-parallel-test add MAX_CONNECTIONS [#308](https://github.com/cloudberrydb/cloudberrydb/pull/308)  by @smartyhero
-   Add pg_upgrade and gpAdminLogs log to CI failure artifact [#306](https://github.com/cloudberrydb/cloudberrydb/pull/306)  by @Ray-Eldath
-   Add interface and export struct to public. [#304](https://github.com/cloudberrydb/cloudberrydb/pull/304)  by @HuSen8891
-   Doc: update the terminal info to CloudberryDB [#300](https://github.com/cloudberrydb/cloudberrydb/pull/300)  by @tuhaihe
-   Answer Query Using Materialized Views [#298](https://github.com/cloudberrydb/cloudberrydb/pull/298)  by @avamingli
-   Fix bug deduplicate elemlist is null when elemlist size is 1. [#297](https://github.com/cloudberrydb/cloudberrydb/pull/297)  by @MisterRaindrop
-   Support cloud manager [#296](https://github.com/cloudberrydb/cloudberrydb/pull/296)  by @roseduan
-   Use pg_class instead of gp_segment_configuration to test Entry. [#294](https://github.com/cloudberrydb/cloudberrydb/pull/294)  by @avamingli
-   Rename GP parallel words to CBDB parallel. [#293](https://github.com/cloudberrydb/cloudberrydb/pull/293)  by @avamingli
-   Fix explain bad indent when showing operatorMem. [#292](https://github.com/cloudberrydb/cloudberrydb/pull/292)  by @avamingli
-   Provide gpdemo.sh deployment script [#291](https://github.com/cloudberrydb/cloudberrydb/pull/291)  by @Ray-Eldath
-   Modify internal address in deploy/vagrant [#290](https://github.com/cloudberrydb/cloudberrydb/pull/290)  by @Zhangbaowen-Hashdata
-   Revert "Fix explain bad indent when showing operatorMem." [#289](https://github.com/cloudberrydb/cloudberrydb/pull/289)  by @avamingli
-   Fix explain bad indent when showing operatorMem. [#288](https://github.com/cloudberrydb/cloudberrydb/pull/288)  by @avamingli
-   Doc: update pull request template for CBDB [#287](https://github.com/cloudberrydb/cloudberrydb/pull/287)  by @tuhaihe
-   Add cache invaladation synchronization amoung QD and QEs. [#286](https://github.com/cloudberrydb/cloudberrydb/pull/286)  by @wenchaozhang-123
-   Add motionhazard to the outer side of parallel aware join.(fix flaky incorrect results of agg) [#284](https://github.com/cloudberrydb/cloudberrydb/pull/284)  by @avamingli
-   Reduce external-fts CI pipeline to only icw-test [#282](https://github.com/cloudberrydb/cloudberrydb/pull/282)  by @Ray-Eldath

## Issue 清单

-   [Bug] abscissa type not supported, from sqlancer test [#317](https://github.com/cloudberrydb/cloudberrydb/issues/317)  by @congxuebin
-   'Parallel Safety' in CBDB style parallel plan [#307](https://github.com/cloudberrydb/cloudberrydb/issues/307)  by @avamingli
-   [Bug] regress/aggregates_optimizer due to gporca fallback [#302](https://github.com/cloudberrydb/cloudberrydb/issues/302)  by @Ray-Eldath
-   [Bug] Cluster down during regress/createdb [#301](https://github.com/cloudberrydb/cloudberrydb/issues/301)  by @Ray-Eldath
-   [Bug] explain data change on operatorMem, mpp22698 test failed [#295](https://github.com/cloudberrydb/cloudberrydb/issues/295)  by @congxuebin
-   [Bug] unexpected reltuples number in pg_class after delete and vacuum  [#273](https://github.com/cloudberrydb/cloudberrydb/issues/273)  by @congxuebin
-   [Bug] failed assertion "mp != nullptr" in CMemoryPoolManager.cpp::Destroy (gporca/libgpos) [#285](https://github.com/cloudberrydb/cloudberrydb/issues/285)  by @Ray-Eldath
-   [Bug] regress/stats test failure on external_fts [#281](https://github.com/cloudberrydb/cloudberrydb/issues/281)  by @Ray-Eldath
-   [Bug] There is a problem with the distribution strategy of the orca unionall operator. [#279](https://github.com/cloudberrydb/cloudberrydb/issues/279)  by @Light-City

## 网站

目前，我们正在开发新版本的 Cloudberry Database 官方网站，新版网站采用全新且现代化的设计，会在未来几周内上线。此外，我们正在努力编写 Cloudberry Database 用户文档。请保持关注！

## 贡献者

🎈️🎊️ 感谢以下贡献者在本月对 Cloudberry Database 的贡献，无论是提交 Pull Request、报告 issue 还是更新网站或文档，都让 Cloudberry Database 项目和社区越来越好，我们都欢迎：

> @wenchaozhang-123, @hw118118, @roseduan, @lss602726449, @smartyhero, @HuSen8891, @Ray-Eldath, @tuhaihe, @avamingli, @MisterRaindrop, @Zhangbaowen-Hashdata, @congxuebin, @Light-City, @ginobiliwang, @TomShawn, @RyanWei, @liang8283

## 加入我们

Cloudberry Database 致力于打造中立、开放和友好的数据库技术社区，我们面向任何人保持开放，无论其经验水平如何。我们鼓励各种类型的贡献，无论大小多少，可参考[《贡献指南》](https://cloudberrydb.org/contribute/how-to-contribute)查看可参与贡献的方式。

除此之外，我们为社区成员提供了丰富的交流、求助和获取反馈的渠道，可查看[支持页面](https://cloudberrydb.org/support)了解详情。

快快加入，成为社区成员的一份子吧！
