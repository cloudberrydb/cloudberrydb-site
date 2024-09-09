---
title: 1.6.0
---

# Cloudberry Database v1.6.0 发版说明

版本号：v1.6.0

Cloudberry Database v1.6.0 是一个小版本，包含一系列提升改进、变更和 bug 修复。

快速试用：[v1.6.0](https://github.com/cloudberrydb/cloudberrydb/releases/tag/1.6.0)

完整的变更日志：[https://github.com/cloudberrydb/cloudberrydb/compare/1.5.4...1.6.0](https://github.com/cloudberrydb/cloudberrydb/compare/1.5.4...1.6.0)

## 提升与变更

:::tip 提示
在以下说明中，"AQUMV" 指 "Answer Query Using Materialized Views" 功能，即使用物化视图来加速查询，详情请参阅[自动使用物化视图进行查询优化](/i18n/zh/docusaurus-plugin-content-docs/current/use-auto-materialized-view-to-answer-queries.md)。
:::

- 将 `warehouse_id` 添加到 `pg_stat_activity_extended` [#453](https://github.com/cloudberrydb/cloudberrydb/pull/453) by @[lss602726449](https://github.com/lss602726449)
- 修改 ORCA 优化器对 `UNION ALL` 分发策略的处理 [#399](https://github.com/cloudberrydb/cloudberrydb/pull/399) by @[Light-City](https://github.com/Light-City)
- 更新 `python-dependencies.txt` 的位置 [#460](https://github.com/cloudberrydb/cloudberrydb/pull/460) by @[Zhangbaowen-Hashdata](https://github.com/Zhangbaowen-Hashdata)
- 为 `exec_simple_query` 添加 hook，并支持在 `cost` 模块中自定义溢出内存阈值 [#447](https://github.com/cloudberrydb/cloudberrydb/pull/447) by @[songdongxiaoa2](https://github.com/songdongxiaoa2)
- 在 AQUMV 中使用 `contain_var_clause` 代替 `pull_var_clause` [#451](https://github.com/cloudberrydb/cloudberrydb/pull/451) by @[avamingli](https://github.com/avamingli)
- 为目录表添加 `matchignore` 并移除 meta-command 用户名的输出 [#464](https://github.com/cloudberrydb/cloudberrydb/pull/464) by @[edespino](https://github.com/edespino)
- 添加 hook 以支持不同方法创建、删除或修改仓库 [#462](https://github.com/cloudberrydb/cloudberrydb/pull/462) by @[lss602726449](https://github.com/lss602726449)
- `ALTER COLUMN TYPE` 后重用索引时不再更改 `relfilenode` [#474](https://github.com/cloudberrydb/cloudberrydb/pull/474) by @[lss602726449](https://github.com/lss602726449)
- 从 Greenplum cherry-pick 2022 年 3 月 2 日 - 2023 年 2 月 7 日期间与 Resgroup 相关的代码 [#448](https://github.com/cloudberrydb/cloudberrydb/pull/448) by @[foreyes](https://github.com/foreyes)
- 添加每周构建和发布流程 [#459](https://github.com/cloudberrydb/cloudberrydb/pull/459) by @[Zhangbaowen-Hashdata](https://github.com/Zhangbaowen-Hashdata)
- 在 AQUMV 中考虑可变函数并绕过无 `Vars` 的视图查询目标表达式 [#455](https://github.com/cloudberrydb/cloudberrydb/pull/455) by @[avamingli](https://github.com/avamingli)
- 暴露调整视图查询和 `varno` 修复的函数到 AQUMV [#469](https://github.com/cloudberrydb/cloudberrydb/pull/469) by @[avamingli](https://github.com/avamingli)
- 修改每周构建发布的细节 [#477](https://github.com/cloudberrydb/cloudberrydb/pull/477) by @[Zhangbaowen-Hashdata](https://github.com/Zhangbaowen-Hashdata)
- 如果发生异常，直接调用 `query_info_collect_hook` 函数 [#481](https://github.com/cloudberrydb/cloudberrydb/pull/481) by @[foreyes](https://github.com/foreyes)
- Cherry-pick：在 `inet` 操作符中解决错误的编译器警告 [#499](https://github.com/cloudberrydb/cloudberrydb/pull/499) by @[gfphoenix78](https://github.com/gfphoenix78)
- 为 `s_lock.h` 添加 LoongArch (`loongarch64`) 支持 [#500](https://github.com/cloudberrydb/cloudberrydb/pull/500) by @[wangzw](https://github.com/wangzw)
- 实现目录表的功能 [#484](https://github.com/cloudberrydb/cloudberrydb/pull/484) by @[wenchaozhang-123](https://github.com/wenchaozhang-123)
- 重新启用外部 FTS ICW [#483](https://github.com/cloudberrydb/cloudberrydb/pull/483) by @[jiaqizho](https://github.com/jiaqizho)
- 修改 `AOCO_Compression` 测试用例，验证 `pg_relation_size` 和 `get_ao_compression_ratio` 是否在 ±10% 的预期范围内 [#493](https://github.com/cloudberrydb/cloudberrydb/pull/493) by @[congxuebin](https://github.com/congxuebin)
- 维护物化视图的数据状态 [#501](https://github.com/cloudberrydb/cloudberrydb/pull/501) by @[avamingli](https://github.com/avamingli)
- 定义 `EXT_OID_START` 以建议扩展的 OID 范围 [#514](https://github.com/cloudberrydb/cloudberrydb/pull/514) by @[avamingli](https://github.com/avamingli)
- 忽略 `pg_upgrade` 以解决 CI 问题 [#515](https://github.com/cloudberrydb/cloudberrydb/pull/515) by @[avamingli](https://github.com/avamingli)
- 减少 `fts_segment_reset` 测试的不稳定性 [#518](https://github.com/cloudberrydb/cloudberrydb/pull/518) by @[jiaqizho](https://github.com/jiaqizho)
- 稳定 `gp_dqa` 测试用例 [#521](https://github.com/cloudberrydb/cloudberrydb/pull/521) by @[congxuebin](https://github.com/congxuebin)
- 文档：为 Cloudberry Database 添加更多工具文档 [#523](https://github.com/cloudberrydb/cloudberrydb/pull/523) by @[tuhaihe](https://github.com/tuhaihe)
- 重新实现目录表的 `COPY FROM` 功能 [#527](https://github.com/cloudberrydb/cloudberrydb/pull/527) by @[wenchaozhang-123](https://github.com/wenchaozhang-123)
- 在 SingleNode 模式中添加与物化视图相关的触发器用例 [#517](https://github.com/cloudberrydb/cloudberrydb/pull/517) by @[avamingli](https://github.com/avamingli)
- 重构 AQUMV 中视图查询目标列表的处理 [#525](https://github.com/cloudberrydb/cloudberrydb/pull/525) by @[avamingli](https://github.com/avamingli)
- 实现标签功能 [#444](https://github.com/cloudberrydb/cloudberrydb/pull/444) by @[wenchaozhang-123](https://github.com/wenchaozhang-123)
- 更新 `orafce` 到 4.9 版并进行增强 [#524](https://github.com/cloudberrydb/cloudberrydb/pull/524) by @[foreyes](https://github.com/foreyes)
- 允许普通物化视图在 AQUMV 中回答查询 [#528](https://github.com/cloudberrydb/cloudberrydb/pull/528) by @[avamingli](https://github.com/avamingli)
- 带有 entry 分布策略的目录表支持 `COPY FROM` 功能 [#533](https://github.com/cloudberrydb/cloudberrydb/pull/533) by @[wenchaozhang-123](https://github.com/wenchaozhang-123)
- 对 `README.md` 进行小幅改进 [#534](https://github.com/cloudberrydb/cloudberrydb/pull/534) by @[reshke](https://github.com/reshke)
- 使用 `FDW` 以将多个服务器作为分片进行查询 [#320](https://github.com/cloudberrydb/cloudberrydb/pull/320) by @[oppenheimer01](https://github.com/oppenheimer01)
- 在 `psql` 中添加选项以避免某些平台的编码问题 [#535](https://github.com/cloudberrydb/cloudberrydb/pull/535) by @[gfphoenix78](https://github.com/gfphoenix78)
- 重构 `cbdb_log` 以使用 `vfprintf` [#506](https://github.com/cloudberrydb/cloudberrydb/pull/506) by @[ruhuang2001](https://github.com/ruhuang2001)
- 更新 `aocsam.c`：修复 `safeFSWriteSize` 参数类型 [#540](https://github.com/cloudberrydb/cloudberrydb/pull/540) by @[reshke](https://github.com/reshke)
- 将 CI 镜像更新为 `RockyLinux8` 以确保 CI 的正常运行 [#556](https://github.com/cloudberrydb/cloudberrydb/pull/556) by @[Zhangbaowen-Hashdata](https://github.com/Zhangbaowen-Hashdata)
- 移除不支持的 `AC_FUNC_FSEEKO` 宏 [#543](https://github.com/cloudberrydb/cloudberrydb/pull/543) by @[gfphoenix78](https://github.com/gfphoenix78)
- 调整 `cloudberrydb` 二进制交换测试的测试用例 [#537](https://github.com/cloudberrydb/cloudberrydb/pull/537) by @[congxuebin](https://github.com/congxuebin)
- 实现 `CREATE FOREIGN TABLE LIKE` [#554](https://github.com/cloudberrydb/cloudberrydb/pull/554) by @[avamingli](https://github.com/avamingli)
- 启用 `SingleQE` 与 `SegmentGeneralWorkers` 的连接 [#327](https://github.com/cloudberrydb/cloudberrydb/pull/327) by @[avamingli](https://github.com/avamingli)
- 在 `ShouldUseReservedSegno` 中使用 `syscache` 查找 [#541](https://github.com/cloudberrydb/cloudberrydb/pull/541) by @[gongxun0928](https://github.com/gongxun0928)
- 实现 `READ_STRING_FIELD_NULL` 可序列化的读取函数 [#553](https://github.com/cloudberrydb/cloudberrydb/pull/553) by @[wenchaozhang-123](https://github.com/wenchaozhang-123)
- 更新 `appendonlywriter.c` 以修复调试消息 [#564](https://github.com/cloudberrydb/cloudberrydb/pull/564) by @[reshke](https://github.com/reshke)
- 支持锁定目录表 [#572](https://github.com/cloudberrydb/cloudberrydb/pull/572) by @[wenchaozhang-123](https://github.com/wenchaozhang-123)
- 更新 `ALTER TABLE` 帮助命令的内容 [#574](https://github.com/cloudberrydb/cloudberrydb/pull/574) by @[EcaleD](https://github.com/EcaleD)
- 从 Greenplum Database cherry-pick `Resgroup V2` 和工具包 [#531](https://github.com/cloudberrydb/cloudberrydb/pull/531) by @[jiaqizho](https://github.com/jiaqizho)
- 当 NL 内部计划是索引扫描时，将 ORCA 回退到 PostgreSQL 优化器 [#565](https://github.com/cloudberrydb/cloudberrydb/pull/565) by @[gfphoenix78](https://github.com/gfphoenix78)
- 在调用 `ivm_visible_in_prestate` 时为冗余参数添加 `FIXME` [#578](https://github.com/cloudberrydb/cloudberrydb/pull/578) by @[reshke](https://github.com/reshke)
- 支持在创建物化视图时使用 `IF NOT EXISTS` 子句的同时指定 `DISTRIBUTED BY` 子句 [#563](https://github.com/cloudberrydb/cloudberrydb/pull/563) by @[reshke](https://github.com/reshke)
- Cherry-pick 与最近 `Resgroup V2` 合并相关的提交 [#579](https://github.com/cloudberrydb/cloudberrydb/pull/579) by @[reshke](https://github.com/reshke)
- 更改 IMMV 使用的临时表名为较不常见的序列 [#581](https://github.com/cloudberrydb/cloudberrydb/pull/581) by @[reshke](https://github.com/reshke)
- 修改延迟 IVM 案例的注释 [#576](https://github.com/cloudberrydb/cloudberrydb/pull/576) by @[reshke](https://github.com/reshke)
- 在 `gpAux/gpdemo/gpdemo-defaults.sh` 中默认启用 `fsync=on` [#585](https://github.com/cloudberrydb/cloudberrydb/pull/585) by @[yjhjstz](https://github.com/yjhjstz)
- 禁止继承表存储在 `gp_matview_aux` 中 [#587](https://github.com/cloudberrydb/cloudberrydb/pull/587) by @[avamingli](https://github.com/avamingli)
- 在 AQUMV 中检查执行视图匹配时关系是否有子项 [#577](https://github.com/cloudberrydb/cloudberrydb/pull/577) by @[avamingli](https://github.com/avamingli)
- 更新 `check.c` 以修复对 Cloudberry Database 的错误引用 [#600](https://github.com/cloudberrydb/cloudberrydb/pull/600) by @[reshke](https://github.com/reshke)
- 为 `ANALYZE` 以二进制模式发送行数据 [#601](https://github.com/cloudberrydb/cloudberrydb/pull/601) by @[Light-City](https://github.com/Light-City)
- 在 CI 中启用 `Resgroup` 测试用例 [#539](https://github.com/cloudberrydb/cloudberrydb/pull/539) by @[jiaqizho](https://github.com/jiaqizho)
- 移除 `cbdb` 每周构建和发布的工作流 [#615](https://github.com/cloudberrydb/cloudberrydb/pull/615) by @[edespino](https://github.com/edespino)
- 在提交或中止事务时释放 `tupleDesc` [#551](https://github.com/cloudberrydb/cloudberrydb/pull/551) by @[yjhjstz](https://github.com/yjhjstz)
- 在外部 FTS 中用 `gpsync` 替换 `gpscp` [#470](https://github.com/cloudberrydb/cloudberrydb/pull/470) by @[jiaqizho](https://github.com/jiaqizho)
- 在 `greenplum_schedule` 中添加 `ao_unique_index_build` 测试 [#562](https://github.com/cloudberrydb/cloudberrydb/pull/562) by @[lss602726449](https://github.com/lss602726449)
- 避免重复执行 `qual` 子句 [#396](https://github.com/cloudberrydb/cloudberrydb/pull/396) by @[jiaqizho](https://github.com/jiaqizho)

## Bug 修复

- 修复由于重新定义 `pipe` 导致的编译错误 [#349](https://github.com/cloudberrydb/cloudberrydb/pull/349) by @[gfphoenix78](https://github.com/gfphoenix78)
- 修复在角色不允许使用 profile 时记录 `password_history` 的问题 [#480](https://github.com/cloudberrydb/cloudberrydb/pull/480) by @[wenchaozhang-123](https://github.com/wenchaozhang-123)
- 解决 `gpdtm_plpgsql` 测试用例中的结果不一致问题 [#491](https://github.com/cloudberrydb/cloudberrydb/pull/491) by @[congxuebin](https://github.com/congxuebin)
- 修复 Cloudberry Database CI 无法正常运行的问题 [#497](https://github.com/cloudberrydb/cloudberrydb/pull/497) by @[Zhangbaowen-Hashdata](https://github.com/Zhangbaowen-Hashdata)
- 修复在复制表上使用 `COPY TO` 时复制数量显示不正确的问题 [#498](https://github.com/cloudberrydb/cloudberrydb/pull/498) by @[wenchaozhang-123](https://github.com/wenchaozhang-123)
- 修复 `bitmapinsert` 中的内存块大小问题 [#495](https://github.com/cloudberrydb/cloudberrydb/pull/495) by @[gfphoenix78](https://github.com/gfphoenix78)
- 修复忽略直接表测试文件的问题 [#502](https://github.com/cloudberrydb/cloudberrydb/pull/502) by @[avamingli](https://github.com/avamingli)
- 修复 `gpinitsystem` 问题 [#490](https://github.com/cloudberrydb/cloudberrydb/pull/490) by @[fanfuxiaoran](https://github.com/fanfuxiaoran)
- 修复 GCC 12 检测到的编译错误 [#503](https://github.com/cloudberrydb/cloudberrydb/pull/503) by @[gfphoenix78](https://github.com/gfphoenix78)
- 修复 `guc.c` 中 `bsearch` 比较函数的问题 [#507](https://github.com/cloudberrydb/cloudberrydb/pull/507) by @[gfphoenix78](https://github.com/gfphoenix78)
- 修复忘记标记 meta track 的命令 [#505](https://github.com/cloudberrydb/cloudberrydb/pull/505) by @[avamingli](https://github.com/avamingli)
- 修复 C++20 中的编译错误 [#510](https://github.com/cloudberrydb/cloudberrydb/pull/510) by @[gfphoenix78](https://github.com/gfphoenix78)
- 修复在目录表上执行 `COPY TO` 时总是返回 `1` 的问题 [#522](https://github.com/cloudberrydb/cloudberrydb/pull/522) by @[wenchaozhang-123](https://github.com/wenchaozhang-123)
- 修复使用 `COPY` 进行批量插入时 AO/AOCO 的 `segfilecount` 问题 [#530](https://github.com/cloudberrydb/cloudberrydb/pull/530) by @[avamingli](https://github.com/avamingli)
- 修复在 AO/AOCO/PAX 分区表上执行 `COPY FROM` 时的崩溃问题 [#549](https://github.com/cloudberrydb/cloudberrydb/pull/549) by @[avamingli](https://github.com/avamingli)
- 修复在某些目录表上复制时出现的问题 [#550](https://github.com/cloudberrydb/cloudberrydb/pull/550) by @[wenchaozhang-123](https://github.com/wenchaozhang-123)
- 修复 IMMV 的基础关系截断问题 [#570](https://github.com/cloudberrydb/cloudberrydb/pull/570) by @[reshke](https://github.com/reshke)
- 修复 `SparseData.h` 中的编译错误 [#566](https://github.com/cloudberrydb/cloudberrydb/pull/566) by @[reshke](https://github.com/reshke)
- 修复 `pxf_fragment.c` 的编译失败问题 [#590](https://github.com/cloudberrydb/cloudberrydb/pull/590) by @[Terry1504](https://github.com/Terry1504)
- 修复从 Greenplum 升级时 `pg_upgrade` 版本解析问题 [#599](https://github.com/cloudberrydb/cloudberrydb/pull/599) by @[reshke](https://github.com/reshke)
- 修复表达式 `AEXPR_NOT_DISTINCT` 的序列化问题 [#598](https://github.com/cloudberrydb/cloudberrydb/pull/598) by @[avamingli](https://github.com/avamingli)
- 修复与物化视图相关的表上的可写规则问题 [#584](https://github.com/cloudberrydb/cloudberrydb/pull/584) by @[avamingli](https://github.com/avamingli)
- 修复可写 CTE 导致物化视图数据状态不正确的问题 [#602](https://github.com/cloudberrydb/cloudberrydb/pull/602) by @[avamingli](https://github.com/avamingli)
- 修复无法使用投影目标列表拉起等价类的问题 [#606](https://github.com/cloudberrydb/cloudberrydb/pull/606) by @[yjhjstz](https://github.com/yjhjstz)

## 🙌🏻️ 新贡献者

- @[Light-City](https://github.com/Light-City) 在 [#399](https://github.com/cloudberrydb/cloudberrydb/pull/399) 中做出了他们的首次贡献。
- @[songdongxiaoa2](https://github.com/songdongxiaoa2) 在 [#447](https://github.com/cloudberrydb/cloudberrydb/pull/447) 中做出了他们的首次贡献。
- @[edespino](https://github.com/edespino) 在 [#464](https://github.com/cloudberrydb/cloudberrydb/pull/464) 中做出了他们的首次贡献。
- @[congxuebin](https://github.com/congxuebin) 在 [#491](https://github.com/cloudberrydb/cloudberrydb/pull/491) 中做出了他们的首次贡献。
- @[wangzw](https://github.com/wangzw) 在 [#500](https://github.com/cloudberrydb/cloudberrydb/pull/500) 中做出了他们的首次贡献。
- @[reshke](https://github.com/reshke) 在 [#534](https://github.com/cloudberrydb/cloudberrydb/pull/534) 中做出了他们的首次贡献。
- @[oppenheimer01](https://github.com/oppenheimer01) 在 [#320](https://github.com/cloudberrydb/cloudberrydb/pull/320) 中做出了他们的首次贡献。
- @[ruhuang2001](https://github.com/ruhuang2001) 在 [#506](https://github.com/cloudberrydb/cloudberrydb/pull/506) 中做出了他们的首次贡献。
- @[EcaleD](https://github.com/EcaleD) 在 [#574](https://github.com/cloudberrydb/cloudberrydb/pull/574) 中做出了他们的首次贡献。
- @[Terry1504](https://github.com/Terry1504) 在 [#590](https://github.com/cloudberrydb/cloudberrydb/pull/590) 中做出了他们的首次贡献。

## 🧑🏻‍💻 贡献者列表

感谢所有贡献者使此版本发布成为可能：@[Aegeaner](https://github.com/Aegeaner), @[EcaleD](https://github.com/EcaleD), @[Light-City](https://github.com/Light-City), @[RMTT](https://github.com/RMTT), @[SmartKeyerror](https://github.com/SmartKeyerror), @[Tao-T](https://github.com/Tao-T), @[Terry1504](https://github.com/Terry1504), @[Zhangbaowen-Hashdata](https://github.com/Zhangbaowen-Hashdata), @[adam8157](https://github.com/adam8157), @[airfan1994](https://github.com/airfan1994), @[andr-sokolov](https://github.com/andr-sokolov), @[ashwinstar](https://github.com/ashwinstar), @[avamingli](https://github.com/avamingli), @[beeender](https://github.com/beeender), @[bmdoil](https://github.com/bmdoil), @[charliettxx](https://github.com/charliettxx), @[congxuebin](https://github.com/congxuebin), @[dgkimura](https://github.com/dgkimura), @[dh-cloud](https://github.com/dh-cloud), @[divyeshddv](https://github.com/divyeshddv), @[dreamedcheng](https://github.com/dreamedcheng), @[edespino](https://github.com/edespino), @[eespino](https://github.com/eespino), @[fairyfar](https://github.com/fairyfar), @[fanfuxiaoran](https://github.com/fanfuxiaoran), @[foreyes](https://github.com/foreyes), @[gfphoenix78](https://github.com/gfphoenix78), @[gongxun0928](https://github.com/gongxun0928), @[gpopt](https://github.com/gpopt), @[higuoxing](https://github.com/higuoxing), @[huansong](https://github.com/huansong), @[hyongtao-db](https://github.com/hyongtao-db), @[jchampio](https://github.com/jchampio), @[jiaqizho](https://github.com/jiaqizho), @[jimmyyih](https://github.com/jimmyyih), @[kainwen](https://github.com/kainwen), @[l-wang](https://github.com/l-wang), @[lss602726449](https://github.com/lss602726449), @[oppenheimer01](https://github.com/oppenheimer01), @[reshke](https://github.com/reshke), @[ruhuang2001](https://github.com/ruhuang2001), @[songdongxiaoa2](https://github.com/songdongxiaoa2), @[soumyadeep2007](https://github.com/soumyadeep2007), @[thedanhoffman](https://github.com/thedanhoffman), @[tuhaihe](https://github.com/tuhaihe), @[wangzw](https://github.com/wangzw), @[wenchaozhang-123](https://github.com/wenchaozhang-123), @[yanwr1](https://github.com/yanwr1), @[yaowangm](https://github.com/yaowangm), @[yjhjstz](https://github.com/yjhjstz), @[zhrt123](https://github.com/zhrt123), @[zxuejing](https://github.com/zxuejing)

<sub>🧂🧪 快来试用[基于 Docker 的沙盒](https://github.com/cloudberrydb/bootcamp)，该沙盒专为初次体验 Cloudberry Database 而打造，包含一系列材料，包括教程、示例代码和速成课程，帮助您快速上车 Cloudberry Database。</sub>
