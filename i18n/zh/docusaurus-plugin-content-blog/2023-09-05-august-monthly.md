---
slug: cloudberrydb-august-weekly
title: Cloudberry Database 社区简报 - 2023/8
authors: [cloudberrydbteam]
tags: [newsletter]
image: /img/blog/202308.png
---

各位社区成员，欢迎来到我们的 Cloudberry Database 社区简报栏目！从本月开始，我们将启动每月简报栏目，收集汇总 Cloudberry Database 社区关键信息，同步最新状态。本月是第一期，下面是参考内容。

<!-- truncate -->

## Pull Request 清单

- [FIXME] Wrong results on main branch for INDF query [#180](https://github.com/cloudberrydb/cloudberrydb/pull/180) by @wenchaozhang-123
- Doc: update security policy and PR template [#176](https://github.com/cloudberrydb/cloudberrydb/pull/176) by @tuhaihe
- Catchup 1X_STABLE [#175](https://github.com/cloudberrydb/cloudberrydb/pull/175) by @Ray-Eldath
- Add extensible smgr slot for other storage format. [#173](https://github.com/cloudberrydb/cloudberrydb/pull/173) by @wenchaozhang-123
- Doc: update editor settings for CloudberryDB [#171](https://github.com/cloudberrydb/cloudberrydb/pull/171) by @tuhaihe
- Doc: update the building guide for Linux [#170](https://github.com/cloudberrydb/cloudberrydb/pull/170) by @Zhangbaowen-Hashdata
- Feature: add user-defined index access method [#169](https://github.com/cloudberrydb/cloudberrydb/pull/169) by @hw118118
- Fix create ao table set parallel_workers doesn't take effect [#168](https://github.com/cloudberrydb/cloudberrydb/pull/168) by @Ray-Eldath
- Support create/drop database in serverless architecture [#163](https://github.com/cloudberrydb/cloudberrydb/pull/163) by @roseduan
- Fix: use RelFileNodeId instead of Oid for relfilenode. [#161](https://github.com/cloudberrydb/cloudberrydb/pull/161) by @HuSen8891
- Adjust the method of loading the external preloaded shared libraries [#158](https://github.com/cloudberrydb/cloudberrydb/pull/158) by @MisterRaindrop
- Change json_object name to avoid conflict with jansson lib. [#157](https://github.com/cloudberrydb/cloudberrydb/pull/157) by @MisterRaindrop
- Fix unstable tests reindextable_while_reindex_idx [#156](https://github.com/cloudberrydb/cloudberrydb/pull/156) by @Ray-Eldath
- Adjust the method of loading the external preloaded shared libraries [#155](https://github.com/cloudberrydb/cloudberrydb/pull/155) by @MisterRaindrop
- Change json_object name to avoid conflict with jansson lib. [#154](https://github.com/cloudberrydb/cloudberrydb/pull/154) by @MisterRaindrop
- Improve makeArrayTypeName's algorithm for choosing array type names. [#152](https://github.com/cloudberrydb/cloudberrydb/pull/152) by @lss602726449
- Implement Parallel-aware Hash Left Anti Semi (Not-In) Join [#149](https://github.com/cloudberrydb/cloudberrydb/pull/149) by @avamingli
- Fix bugs which could not create unique index "gp_fastsequence_objid_objmod_index" [#146](https://github.com/cloudberrydb/cloudberrydb/pull/146) by @lss602726449
- Add final Motion earlier in grouping_planner for partial paths [#142](https://github.com/cloudberrydb/cloudberrydb/pull/142) by @avamingli
- Fix: warehouse is not supported without unionstore [#139](https://github.com/cloudberrydb/cloudberrydb/pull/139) by @roseduan
- Support separation of catalog and compute [#138](https://github.com/cloudberrydb/cloudberrydb/pull/138) by @HuSen8891
- FIX: constraint check exception with snapshot memory leak in AO/AOCS [#136](https://github.com/cloudberrydb/cloudberrydb/pull/136) by @lss602726449
- add hashdata extension storage_am related hook [#135](https://github.com/cloudberrydb/cloudberrydb/pull/135) by @wangliang03
- Loosen the restriction outer path has Motion of parallel plan [#134](https://github.com/cloudberrydb/cloudberrydb/pull/134) by @avamingli

除此之外，我们还对 Cloudberry Database 网站做了更新，上线了一批新页面，包括[《安全策略》](https://cloudberrydb.org/community/security)、[《贡献指南》](https://cloudberrydb.org/contribute/how-to-contribute)、[《使用 Git & GitHub》](https://cloudberrydb.org/contribute/git)、[《代码贡献指南》](https://cloudberrydb.org/contribute/code)以及[《提案指南》](https://cloudberrydb.org/contribute/proposal)等等。你可以访问我们的[网站](https://cloudberrydb.org)查看更多内容。

## 提案与建议

- [Proposal] Refactor ORCA to support user-defined access method in pg [#113](https://github.com/orgs/cloudberrydb/discussions/113) by @wfnuser
- [Ideas] Should prune tags after fetching from GP repo [#137](https://github.com/orgs/cloudberrydb/discussions/137) by @Ray-Eldath
- [Proposal] Implement Scorll Parallel Retrieve Cursor. [#120](https://github.com/orgs/cloudberrydb/discussions/120) by @wenchaozhang-123
- [Ideas] Wanna PostgresML in CBDB? An AI application database. LLM embeddings, generate text, or make online predictions using only SQL. [#114](https://github.com/orgs/cloudberrydb/discussions/114) by @avamingli
- [Proposal] Support Incremental View Maintenance (IVM) in Cloudberry Database [#36](https://github.com/orgs/cloudberrydb/discussions/36) by @avamingli

## Issue 清单

- Support dynamic table for Cloud [#179](https://github.com/cloudberrydb/cloudberrydb/issues/179) by @my-ship-it
- ERROR:CBucket.cpp:45: Failed assertion [#178](https://github.com/cloudberrydb/cloudberrydb/issues/178) by @liyxbeijing
- Upgrade pg_vector to 0.5.0 [#177](https://github.com/cloudberrydb/cloudberrydb/issues/177) by @my-ship-it
- cdbd primary segment failure: writer proc reference shared with reader is invalid [#174](https://github.com/cloudberrydb/cloudberrydb/issues/174) by @liyxbeijing
- SPIKE memory usage difference between PG and Cloudberry [#164](https://github.com/cloudberrydb/cloudberrydb/issues/164) by @my-ship-it
- [Enhance] Too many log messages for memory stats when run out of memory [#159](https://github.com/cloudberrydb/cloudberrydb/issues/159) by @gfphoenix78
- Support elastic search SSL for zombodb [#153](https://github.com/cloudberrydb/cloudberrydb/issues/153) by @my-ship-it
- [Bug] gppkg -r is invalid [#151](https://github.com/cloudberrydb/cloudberrydb/issues/151) by @chenfool


## 贡献者

🎈️🎊️ 感谢以下贡献者在本月对 Cloudberry Database 的贡献，无论是提交 Pull Request、报告 issue 还是更新网站或文档，都让 Cloudberry Database 项目和社区越来越好，我们都欢迎：
> @wenchaozhang-123, @tuhaihe, @Ray-Eldath, @Zhangbaowen-Hashdata, @hw118118, @roseduan, @HuSen8891, @MisterRaindrop, @lss602726449, @avamingli, @wangliang03, @my-ship-it, @liyxbeijing, @gfphoenix78, @chenfool, @TomShawn, @wfnuser

## 保持关注

更多动态，欢迎关注我们的 [Twitter 帐号](https://twitter.com/cloudberrydb)。如果你有其它疑问，欢迎参阅[社区支持渠道](https://cloudberrydb.org/support)寻求帮助。

下次见！