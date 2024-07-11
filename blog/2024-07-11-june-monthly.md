---
slug: june-2024-cloudberrydb-community-newsletter
title: "June 2024 - Cloudberry Database Community Newsletter"
authors: [cloudberrydbteam]
tags: [Newsletter]
image: /img/blog/202406.png
---

:::note

 ❤️ Cloudberry Database? Giving it a ⭐ on the [cloudberrydb/cloudberrydb](https://github.com/cloudberrydb/cloudberrydb) repo!

:::

## New Release 1.5.4

Cloudberry Database [v1.5.4](https://github.com/cloudberrydb/cloudberrydb/releases/tag/1.5.4) was released with a few improvements and bug fixes. You can see the full changelog here: [1.5.3...1.5.4](https://github.com/cloudberrydb/cloudberrydb/compare/1.5.3...1.5.4).

🎈️🎊️ Thanks to all the contributors to make this release happen:
> @higuoxing, @tuhaihe, @August-beaulo, @avamingli, @piyushc01, @red1452, @edespino, @jnihal, @Annu149, @jiaqizho, @wenchaozhang-123, @dgkimura, @fanfuxiaoran, @gfphoenix78, @HelloYJohn, @adam8157, @xiaoxiaoHe-E, @InnerLife0, @wuyuhao28, @l-wang, @lij55, @huansong, @chrishajas, @tglsfdc, @fairyfar, @kainwen, @nmisch, @my-ship-it 

## Ecosystem

More tools for Cloudberry Database are public this month, including:

- MADlib for Cloudberry Database: [@cloudberrydb/madlib](https://github.com/cloudberrydb/madlib)
- PL/Java for Cloudberry Database: [@cloudberrydb/pljava](https://github.com/cloudberrydb/pljava) 
- PL/R for Cloudberry Database: [@cloudberrydb/plr](https://github.com/cloudberrydb/plr)
- PXF for Cloudberry Database: [@cloudberrydb/pxf](https://github.com/cloudberrydb/pxf)
- Filedum for Cloudberry Database: [@cloudberrydb/filedump](https://github.com/cloudberrydb/filedump)
- gpbackup-s3-plugin: [@gpbackup-s3-plugin](https://github.com/cloudberrydb/gpbackup-s3-plugin)

## Pull Requests

- [WIP][Bugfix] Fix unstable CI tests [#486](https://github.com/cloudberrydb/cloudberrydb/pull/486) by @foreyes
- Implement some feature of directory table. [#484](https://github.com/cloudberrydb/cloudberrydb/pull/484) by @wenchaozhang-123
- Re-enable the external FTS ICW [#483](https://github.com/cloudberrydb/cloudberrydb/pull/483)  by @jiaqizho
- Call the `query_info_collect_hook` directly if expection happens [#481](https://github.com/cloudberrydb/cloudberrydb/pull/481) by @foreyes
- Fix record password_history when the role is not allowed to use profile. [#480](https://github.com/cloudberrydb/cloudberrydb/pull/480) by @wenchaozhang-123
- Modify weekly build release details [#477](https://github.com/cloudberrydb/cloudberrydb/pull/477) by @Zhangbaowen-Hashdata
- Re-used index after `ALTER COLUMN TYPE` shouldn't change relfilenode [#474](https://github.com/cloudberrydb/cloudberrydb/pull/474) by @lss602726449
- Fix external_tar_download_url [#472](https://github.com/cloudberrydb/cloudberrydb/pull/472) by @smartyhero
- Fix: replace `gpscp` with `gpsync` in ext fts [#470](https://github.com/cloudberrydb/cloudberrydb/pull/470) by @jiaqizho
- [AQUMV] Expose the function adjust view query and varno fix. [#469](https://github.com/cloudberrydb/cloudberrydb/pull/469) by @avamingli
- `directory_table`: matchignore & remove meta-command username output [#464](https://github.com/cloudberrydb/cloudberrydb/pull/464) by @edespino
- Enhance: Add hook to support different way to create/drop/alter warehouse [#462](https://github.com/cloudberrydb/cloudberrydb/pull/462) by @lss602726449
- Update the location of `python-dependencies.txt` [#460](https://github.com/cloudberrydb/cloudberrydb/pull/460) by @Zhangbaowen-Hashdata

## Issues

- [Bug] Errors thrown by gpinitsystem during locale checking [#488](https://github.com/cloudberrydb/cloudberrydb/issues/488) by @xanadu-dev
- [Bug] [uos1050a:aarch64 only] pg_relation_size and get_ao_compression_ratio slightly different from other operating system [#487](https://github.com/cloudberrydb/cloudberrydb/issues/487) by @congxuebin
- [Bug] guc not valid unexpectedly, exposed on lightning external fts build [#485](https://github.com/cloudberrydb/cloudberrydb/issues/485) by @congxuebin
- [Bug] [UOS1050a, UOS1060e] invalid byte sequence for encoding "UTF8": 0xba when create table [#482](https://github.com/cloudberrydb/cloudberrydb/issues/482) by @congxuebin

## Hosting Cloudberry Database under the third-party Foundations

This month, we have been contacting original Greenplum vendors and contribution teams. Most of them have shown interest in joining the efforts to take the Cloudberry Database to a third-party foundation. We want to run the Cloudberry Database for a long and not be controlled by one single commercial company as Greenplum to avoid the unexpected. The work is still in progress, and we are looking forward to providing more updates in the following weeks.

## Difficult with migration from Greenplum to Cloudberry?

Along with the Greenplum going closed-source, many Greenplum users are considering choosing Cloudberry Database as the open-source alternative to the Greenplum. But we also recognize that the migration work can be not easy for users. Now we have decided to open source our business migration tool, but its progress may be slow due to limited resources. We will try our best!

## Join us

The Cloudberry Database community welcomes everyone to contribute, regardless of their level of experience. We encourage all types of contributions, no matter how small. Our [contribution guide](https://cloudberrydb.org/contribute) is available to help you get started with the process.

In addition, we offer various channels for community members to discuss, seek help, provide feedback, and chat. You can find [support](https://cloudberrydb.org/support) here. Let us know if you have any questions or feedback - we're always here to help!

Join us and be part of our community!
