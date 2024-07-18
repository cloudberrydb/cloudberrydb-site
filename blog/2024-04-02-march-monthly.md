---
slug: march-2024-cloudberrydb-community-newsletter
title: "March 2024 - Cloudberry Database Community Newsletter"
authors: [cloudberrydbteam]
tags: [Newsletter]
image: /img/blog/202403.png
---

Hey there! Welcome to the March 2024 community newsletter for the Cloudberry Database project. We're excited to share the latest updates on the project and the community. Let's dive in, shall we?

## New Release

Cloudberry Database [v1.5.1](https://github.com/cloudberrydb/cloudberrydb/releases/tag/1.5.1) has been released with a few improvements and bug fixes. For further information, please refer to the [release notes](https://cloudberrydb.org/docs/releases/release-1.5.1). Thanks to all the contributors who made this release happen.

<sub>Want to try it out quickly? Follow our [Bootcamp program](https://cloudberrydb.org/bootcamp) to get started with the Cloudberry Database Sandbox.</sub>

## Website

In March, we added some new features to our website, such as the ability to search the documentation on the site. We also introduced a light mode to enhance the browsing experience. Additionally, we are currently redesigning the homepage of our website, so stay tuned for the new look!

<iframe width="560" height="315" src="https://www.youtube.com/embed/BsirEs9zrJ8?si=duBv99IEii0s_J5L" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Pull Requests

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

## Ideas / Feature Requests

- Support disaster recovery for CBDB in asynchronous mode [#398](https://github.com/orgs/cloudberrydb/discussions/398) By @my-ship-it

What about your thoughts on the new feature? Welcome to leave a comment.

## Contributors

🎈️🎊️ Thanks to the following contributors for helping make Cloudberry Database better this month:

> @smartyhero, @Light-City, @jiaqizho, @HuSen8891, @lss602726449, @wenchaozhang-123, @gfphoenix78, @vitalboyzf, @TomShawn, @my-ship-it

## Join us

The Cloudberry Database community welcomes everyone to contribute, regardless of their level of experience. We encourage all types of contributions, no matter how small. Our [contribution guide](https://cloudberrydb.org/contribute) is available to help you get started with the process.

In addition, we offer various channels for community members to discuss, seek help, provide feedback, and chat. You can find [support](https://cloudberrydb.org/support) here. Let us know if you have any questions or feedback - we're always here to help!

Join us and be part of our community!

---

[![Slack](https://img.shields.io/badge/Slack-6a32c9)](https://communityinviter.com/apps/cloudberrydb/welcome) [![Twitter](https://img.shields.io/twitter/follow/cloudberrydb)](https://twitter.com/cloudberrydb) [![WeChat](https://img.shields.io/badge/WeChat-eebc46)](https://cloudberrydb.org/community/wechat) [![Website](https://img.shields.io/badge/Website-bbec46)](https://cloudberrydb.org) [![Youtube](https://img.shields.io/badge/Youtube-gebc46)](https://youtube.com/@cloudberrydb) [![Discussions](https://img.shields.io/badge/Forum-gebc46)](https://github.com/orgs/cloudberrydb/discussions)