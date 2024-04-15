---
slug: cloudberrydb-oct-weekly
title: Oct Newsletter - Cloudberry Database (2023/10)
authors: [cloudberrydbteam]
tags: [newsletter]
image: /img/blog/202310.png
---

Hey there! Welcome to our October newsletter for the Cloudberry Database project! 

<!-- truncate -->

We're so excited to have you on board with us. In this newsletter, we'll be sharing all the latest updates, improvements, and contributions made by our amazing community. From cool new features to pesky bug fixes, we have a lot to chat about, so let's get started!

## Pull Requests

- Add README.Rhel-Rocky.bash [#272](https://github.com/cloudberrydb/cloudberrydb/pull/272) by @Zhangbaowen-Hashdata
- Add combocid dispatch from QD to QE [#271](https://github.com/cloudberrydb/cloudberrydb/pull/271) by @lss602726449
- Update license headers for new CBDB source files [#268](https://github.com/cloudberrydb/cloudberrydb/pull/268) by @tuhaihe
- Doc: Update Linux build docs for Rocky and RHEL [#267](https://github.com/cloudberrydb/cloudberrydb/pull/267) by @TomShawn
- Fix pg_password_history gpcheckcat consitent check failed. [#266](https://github.com/cloudberrydb/cloudberrydb/pull/266) by @wenchaozhang-123
- Rename 'Parallel Broadcast Motion' to 'Broadcast Workers Motion' [#265](https://github.com/cloudberrydb/cloudberrydb/pull/265) by @avamingli
- Correct shared hash table rows estimation [#263](https://github.com/cloudberrydb/cloudberrydb/pull/263) by @avamingli
- Limit CI concurrency to one per PR, redux [#261](https://github.com/cloudberrydb/cloudberrydb/pull/261) by @Ray-Eldath
- Try to fix hashjoin_spill avg result diff in parallel mode [#260](https://github.com/cloudberrydb/cloudberrydb/pull/260) by @avamingli
- Add parallel semi join cases [#257](https://github.com/cloudberrydb/cloudberrydb/pull/257) by @avamingli
- Enhancement: github action support run external_fts test case [#256](https://github.com/cloudberrydb/cloudberrydb/pull/256) by @smartyhero
- Add: some interfaces to get/set transaction state and xids [#255](https://github.com/cloudberrydb/cloudberrydb/pull/255) by @HuSen8891
- Ignore cases related to external_fts [#254](https://github.com/cloudberrydb/cloudberrydb/pull/254) by @avamingli
- Add relcache invaladation synchronization. [#252](https://github.com/cloudberrydb/cloudberrydb/pull/252) by @wenchaozhang-123
- Fix warehouse regress failures [#249](https://github.com/cloudberrydb/cloudberrydb/pull/249) by @roseduan
- Open proper AO/AOCS segment files according to data volume [#248](https://github.com/cloudberrydb/cloudberrydb/pull/248) by @avamingli
- Loosen Parallel Refresh coefficient. [#247](https://github.com/cloudberrydb/cloudberrydb/pull/247) by @avamingli
- Adjust the method of loading the external preloaded shared libraries [#242](https://github.com/cloudberrydb/cloudberrydb/pull/242) by @MisterRaindrop
- Fix test artifact upload path incorrectly [#240](https://github.com/cloudberrydb/cloudberrydb/pull/240) by @Zhangbaowen-Hashdata
- Fix explain(locus) show NULL. [#238](https://github.com/cloudberrydb/cloudberrydb/pull/238) by @avamingli
- Doc: update the codebase information in README.md [#237](https://github.com/cloudberrydb/cloudberrydb/pull/237) by @tuhaihe
- Add: new hook for plugins to validate the relation [#236](https://github.com/cloudberrydb/cloudberrydb/pull/236) by @HuSen8891
- Drop: Delete Windows development documentation [#235](https://github.com/cloudberrydb/cloudberrydb/pull/235) by @Zhangbaowen-Hashdata
- Implement drop warehouse. [#234](https://github.com/cloudberrydb/cloudberrydb/pull/234) by @wenchaozhang-123
- Change myTempNamespace from static variable to extern variable. [#232](https://github.com/cloudberrydb/cloudberrydb/pull/232) by @wenchaozhang-123

## Proposals & Ideas

- [Ideas] CloudberryUI need to support cutomize storage locations. [#227](https://github.com/orgs/cloudberrydb/discussions/227) by @RyanWei
- [Proposal] Process Management Refactor [#243](https://github.com/orgs/cloudberrydb/discussions/243) by @avamingli

## Issues

- [Bug] unexpected reltuples number in pg_class after delete and vacuum [#273](https://github.com/cloudberrydb/cloudberrydb/issues/273) by @congxuebin
- [Bug] UNIQUE index must contain all columns in the table's distribution key [#270](https://github.com/cloudberrydb/cloudberrydb/issues/270) by @congxuebin
- [Bug] unstable pg_upgrade failed [#262](https://github.com/cloudberrydb/cloudberrydb/issues/262) by @avamingli
- [Bug] flaky incorrect results of hashjoin_spill in parallel mode on x86_64 [#259](https://github.com/cloudberrydb/cloudberrydb/issues/259) by @avamingli
- [Bug] Gain 1 more row than expected, from query on session_state.session_level_memory_consumption [#253](https://github.com/cloudberrydb/cloudberrydb/issues/253) by @congxuebin
- [Bug] gpcheckcat 'inconsistent' test failed [#251](https://github.com/cloudberrydb/cloudberrydb/issues/251) by @congxuebin
- [Bug] test case segwalrep/dtm_recovery_on_standby hang [#250](https://github.com/cloudberrydb/cloudberrydb/issues/250) by @smartyhero
- [Bug] rpt_joins case failed [#246](https://github.com/cloudberrydb/cloudberrydb/issues/246) by @smartyhero
- [Bug] dispatch case failed [#245](https://github.com/cloudberrydb/cloudberrydb/issues/245) by @smartyhero
- [Bug] misc_sanity case failed [#244](https://github.com/cloudberrydb/cloudberrydb/issues/244) by @smartyhero

## Contributors

🎈️🎊️ Thanks to the following contributors for helping make Cloudberry Database better this month:

> @Zhangbaowen-Hashdata, @lss602726449, @tuhaihe, @TomShawn, @wenchaozhang-123, @avamingli, @Ray-Eldath, @smartyhero, @HuSen8891, @roseduan, @MisterRaindrop, @congxuebin, @RyanWei

## Join us

The Cloudberry Database community welcomes everyone to contribute, regardless of their level of experience. We encourage all types of contributions, no matter how small. Our [contribution guide](https://cloudberrydb.org/contribute/how-to-contribute) is available to help you get started with the process.

In addition, we offer various channels for community members to discuss, seek help, provide feedback, and chat. You can find support [here](https://cloudberrydb.org/support).

Join us and be part of our community!
