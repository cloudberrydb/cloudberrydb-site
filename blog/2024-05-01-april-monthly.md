---
slug: april-2024-cloudberrydb-community-newsletter
title: "April 2024 - Cloudberry Database Community Newsletter"
authors: [cloudberrydbteam]
tags: [newsletter]
image: /img/blog/202404.png
---

Welcome to the April 2024 community newsletter for the Cloudberry Database project. Let's explore what our Cloudberry Database community happened in this month.

## New Release

We want to make our release often and quickly to ship the latest features and bug fixes of Cloudberry Database. We're on the way. Cloudberry Database 1.5.2 was just shipped with lots of updates. You can view the changelogs and download v1.5.2 to try on the  [release page](https://github.com/cloudberrydb/cloudberrydb/releases/tag/1.5.2).

In the past weeks, we upgraded the bootcamp program to support the Cloudberry Database 1.5.1 version. Along with the new version 1.5.2, we will support it in the following weeks.

<sub>[Bootcamp](https://github.com/cloudberrydb/bootcamp) is one Docker-based Sandbox, which is tailored to help you gain a basic understanding of Cloudberry Database's capabilities and features a range of materials, including tutorials, sample code, and crash courses.</sub>

## Website

We added a bunch of documents to the Cloudberry Database, including  [cloudberrydb-site#75](https://github.com/cloudberrydb/cloudberrydb-site/pull/75),  [cloudberrydb-site#87](https://github.com/cloudberrydb/cloudberrydb-site/pull/87), and  [cloudberrydb-site#70](https://github.com/cloudberrydb/cloudberrydb-site/pull/70). Also, we are working on the web page translation pull request  [cloudberrydb-site#118](https://github.com/cloudberrydb/cloudberrydb-site/pull/118)  review.

## Pull Requests

One notable feature, the directory table([#390](https://github.com/cloudberrydb/cloudberrydb/pull/390)), is merged this monthly. You can use it and are welcome to give your feedback.

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

## Events

Fortunately, the Cloudberry Database's task is approved by the OSPP. If you're a college student, you are welcome to apply our task.

![Summer-OSPP](/img/blog/Summer-OSPP-AC.svg)

Detail: [https://summer-ospp.ac.cn/org/prodetail/24e980375](https://summer-ospp.ac.cn/org/prodetail/24e980375).

## Contributors

🎈️🎊️ Thanks to the following contributors for helping make Cloudberry Database better this month:

> @wenchaozhang-123, @jiaqizho, @tuhaihe, @Zhangbaowen-Hashdata, @kongfanshen-0801, @gongxun0928, @foreyes, @zhangyue-hashdata, @Ray-Eldath, @TomShawn

## Join us

The Cloudberry Database community welcomes everyone to contribute, regardless of their level of experience. We encourage all types of contributions, no matter how small. Our [contribution guide](https://cloudberrydb.org/contribute) is available to help you get started with the process.

In addition, we offer various channels for community members to discuss, seek help, provide feedback, and chat. You can find [support](https://cloudberrydb.org/support) here. Let us know if you have any questions or feedback - we're always here to help!

Join us and be part of our community!

---

[![Slack](https://img.shields.io/badge/Slack-6a32c9)](https://communityinviter.com/apps/cloudberrydb/welcome) [![Twitter](https://img.shields.io/twitter/follow/cloudberrydb)](https://twitter.com/cloudberrydb) [![WeChat](https://img.shields.io/badge/WeChat-eebc46)](https://cloudberrydb.org/community/wechat) [![Website](https://img.shields.io/badge/Website-bbec46)](https://cloudberrydb.org) [![Youtube](https://img.shields.io/badge/Youtube-gebc46)](https://youtube.com/@cloudberrydb) [![Discussions](https://img.shields.io/badge/Forum-gebc46)](https://github.com/orgs/cloudberrydb/discussions)