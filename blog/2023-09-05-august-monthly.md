---
slug: cloudberrydb-august-weekly
title: August Newsletter - Cloudberry Database (2023/08)
authors: [cloudberrydbteam]
tags: [newsletter]
---

Hi, welcome to our Cloudberry Database project newsletter! From this month, we will initiate biweekly/monthly newsletters to gather information and new statuses around the Cloudberry Database. 

## Pull Requests

- [[FIXME] Wrong results on main branch for INDF query](https://github.com/cloudberrydb/cloudberrydb/pull/180) by @wenchaozhang-123
- [Doc: update security policy and PR template](https://github.com/cloudberrydb/cloudberrydb/pull/176) by @tuhaihe
- [Catchup 1X_STABLE](https://github.com/cloudberrydb/cloudberrydb/pull/175) by @Ray-Eldath
- [Add extensible smgr slot for other storage format.](https://github.com/cloudberrydb/cloudberrydb/pull/173) by @wenchaozhang-123
- [Doc: update editor settings for CloudberryDB](https://github.com/cloudberrydb/cloudberrydb/pull/171) by @tuhaihe
- [Doc: update the building guide for Linux](https://github.com/cloudberrydb/cloudberrydb/pull/170) by @Zhangbaowen-Hashdata
- [Feature: add user-defined index access method](https://github.com/cloudberrydb/cloudberrydb/pull/169) by @hw118118
- [Fix create ao table set parallel_workers doesn't take effect](https://github.com/cloudberrydb/cloudberrydb/pull/168) by @Ray-Eldath
- [Feature: add user-defined index access method](https://github.com/cloudberrydb/cloudberrydb/pull/165) by @hw118118
- [Support create/drop database in serverless architecture](https://github.com/cloudberrydb/cloudberrydb/pull/163) by @roseduan
- [Fix: use RelFileNodeId instead of Oid for relfilenode.](https://github.com/cloudberrydb/cloudberrydb/pull/161) by @HuSen8891
- [Adjust the method of loading the external preloaded shared libraries](https://github.com/cloudberrydb/cloudberrydb/pull/158) by @MisterRaindrop
- [Change json_object name to avoid conflict with jansson lib.](https://github.com/cloudberrydb/cloudberrydb/pull/157) by @MisterRaindrop
- [Fix unstable tests reindextable_while_reindex_idx](https://github.com/cloudberrydb/cloudberrydb/pull/156) by @Ray-Eldath
- [Adjust the method of loading the external preloaded shared libraries](https://github.com/cloudberrydb/cloudberrydb/pull/155) by @MisterRaindrop
- [Change json_object name to avoid conflict with jansson lib.](https://github.com/cloudberrydb/cloudberrydb/pull/154) by @MisterRaindrop
- [Improve makeArrayTypeName's algorithm for choosing array type names.](https://github.com/cloudberrydb/cloudberrydb/pull/152) by @lss602726449
- [Implement Parallel-aware Hash Left Anti Semi (Not-In) Join](https://github.com/cloudberrydb/cloudberrydb/pull/149) by @avamingli
- [Fix bugs which could not create unique index "gp_fastsequence_objid_objmod_index"](https://github.com/cloudberrydb/cloudberrydb/pull/146) by @lss602726449
- [Add final Motion earlier in grouping_planner for partial paths](https://github.com/cloudberrydb/cloudberrydb/pull/142) by @avamingli
- [Fix: warehouse is not supported without unionstore](https://github.com/cloudberrydb/cloudberrydb/pull/139) by @roseduan
- [Support separation of catalog and compute](https://github.com/cloudberrydb/cloudberrydb/pull/138) by @HuSen8891
- [FIX: constraint check exception with snapshot memory leak in AO/AOCS](https://github.com/cloudberrydb/cloudberrydb/pull/136) by @lss602726449
- [add hashdata extension storage_am related hook,](https://github.com/cloudberrydb/cloudberrydb/pull/135) by @wangliang03
- [Loosen the restriction outer path has Motion of parallel plan](https://github.com/cloudberrydb/cloudberrydb/pull/134) by @avamingli

In addition, we also have updates for our Cloudberry Database website. Some new pages have been live, including [security policy](https://cloudberrydb.org/community/security), [contribution guide](https://cloudberrydb.org/contribute/how-to-contribute), [working with Git & GitHub](https://cloudberrydb.org/contribute/git), [code Contribution guide](https://cloudberrydb.org/contribute/code), [proposal guide](https://cloudberrydb.org/contribute/proposal), and more. You can visit our [website](https://cloudberrydb.org) to learn more.

## Proposals & Ideas

- [[Proposal] Refactor ORCA to support user-defined access method in pg](https://github.com/orgs/cloudberrydb/discussions/113) by @wfnuser
- [[Ideas] Should prune tags after fetching from GP repo](https://github.com/orgs/cloudberrydb/discussions/137) by @Ray-Eldath
- [[Proposal] Implement Scorll Parallel Retrieve Cursor.](https://github.com/orgs/cloudberrydb/discussions/120) by @wenchaozhang-123
- [[Ideas] Wanna PostgresML in CBDB? An AI application database. LLM embeddings, generate text, or make online predictions using only SQL.](https://github.com/orgs/cloudberrydb/discussions/114) by @avamingli
- [[Proposal] Support Incremental View Maintenance (IVM) in Cloudberry Database](https://github.com/orgs/cloudberrydb/discussions/36) by @avamingli

## Issues

- [Support dynamic table for Cloud](https://github.com/cloudberrydb/cloudberrydb/issues/179) by @my-ship-it
- [ERROR:CBucket.cpp:45: Failed assertion](https://github.com/cloudberrydb/cloudberrydb/issues/178) by @liyxbeijing
- [Upgrade pg_vector to 0.5.0](https://github.com/cloudberrydb/cloudberrydb/issues/177) by @my-ship-it
- [cdbd primary segment failure: writer proc reference shared with reader is invalid](https://github.com/cloudberrydb/cloudberrydb/issues/174) by @liyxbeijing
- [SPIKE memory usage difference between PG and Cloudberry](https://github.com/cloudberrydb/cloudberrydb/issues/164) by @my-ship-it
- [[Enhance] Too many log messages for memory stats when run out of memory](https://github.com/cloudberrydb/cloudberrydb/issues/159) by @gfphoenix78
- [Support elastic search SSL for zombodb](https://github.com/cloudberrydb/cloudberrydb/issues/153) by @my-ship-it
- [[Bug] gppkg -r is invalid](https://github.com/cloudberrydb/cloudberrydb/issues/151) by @chenfool


## Contributors

🎈️🎊️ Thanks to the following contributors for helping make Cloudberry Database better this month:
> @wenchaozhang-123, @tuhaihe, @Ray-Eldath, @Zhangbaowen-Hashdata,
@hw118118, @roseduan, @HuSen8891, @MisterRaindrop, @lss602726449,
@avamingli, @wangliang03, @my-ship-it, @liyxbeijing, @gfphoenix78,
@chenfool, @TomShawn, @wfnuser

## Stay updated

For more updates, please follow us on Twitter. If you have any questions on the Cloudberry Database, you can join our [community channels](https://cloudberrydb.org/support) to ask.

See you next!
