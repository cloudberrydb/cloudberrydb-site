---
title: 1.5.3
---

:::caution

This is not an Apache release!

:::

# Cloudberry Database v1.5.3 Release Notes

Version number: v1.5.3

Cloudberry Database v1.5.3 is a minor release that includes some improvements, bug fixes and doc updates.

Quick try: [v1.5.3](https://github.com/cloudberrydb/cloudberrydb/releases/tag/1.5.3)

:::note

Before running the `./configure` command to [build the Cloudberry Database](/docs/cbdb-linux-compile#step-4-build-cloudberry-database) from the v1.5.3 source code files, make sure to execute the following commands to install the dependencies.

```bash
yum install -y go
export GOPROXY=https://goproxy.io,direct
```

In later versions, we have refactored the relative module using Python (See PR [#435](https://github.com/cloudberrydb/cloudberrydb/pull/435)). If you are building the database from the source code of a later version, you can skip the above commands.
:::

Full changelog: [https://github.com/cloudberrydb/cloudberrydb/compare/1.5.2...1.5.3](https://github.com/cloudberrydb/cloudberrydb/compare/1.5.2...1.5.3)

## New feature

- Directory table

    Starting from v1.5.3, Cloudberry Database supports directory tables for managing multiple types of unstructured data. Developer users can use simple SQL statements to invoke the capabilities of multiple computing engines to achieve one-stop data processing and application development.

    Directory tables store, manage, and analyze unstructured data objects. They reside within tablespaces. When unstructured data files are imported, a directory table record (file metadata) is created, and the file itself is loaded into object storage. The table metadata remains associated with the corresponding object storage file.

    For details, see the [user document](/docs/advanced-analytics/directory-tables.md).

## Improvements

- Support `postgres_fdw` in the default build by @[smartyhero](https://github.com/smartyhero) in [#400](https://github.com/cloudberrydb/cloudberrydb/pull/400)
- Support using access method flags to specify the column-oriented scanning on custom tables by @[gongxun0928](https://github.com/gongxun0928) in [407#](https://github.com/cloudberrydb/cloudberrydb/pull/407)
- Add a configuration parameter `gp_random_insert_segments` to control the number of segments used for inserting data into randomly distributed tables by @[foreyes](https://github.com/foreyes) in [#406](https://github.com/cloudberrydb/cloudberrydb/pull/406)
- Implement Directory Table by @[wenchaozhang-123](https://github.com/wenchaozhang-123) in [#390](https://github.com/cloudberrydb/cloudberrydb/pull/390)
- Disable dumping pax tables in `pg_dump` by @[jiaqizho](https://github.com/jiaqizho) in [#412](https://github.com/cloudberrydb/cloudberrydb/pull/412)
- Update the `googletest` module URL by @[tuhaihe](https://github.com/tuhaihe) in [#429](https://github.com/cloudberrydb/cloudberrydb/pull/429)
- Enable privilege check when dropping directory table by @[wenchaozhang-123](https://github.com/wenchaozhang-123) in [#425](https://github.com/cloudberrydb/cloudberrydb/pull/425)


## Bug fixes

- Fix the issue that the outbound data buffer is not enough when calling `EVP_DecryptUpdate` (#479) by @[kongfanshen-0801](https://github.com/kongfanshen-0801) in [#408](https://github.com/cloudberrydb/cloudberrydb/pull/408)
- Fix the issue that `pgrx` cannot find the function `numeric_is_nan` or `numeric_is_inf` after numeric change interface by @[jiaqizho](https://github.com/jiaqizho) in [#410](https://github.com/cloudberrydb/cloudberrydb/pull/410)
- Fix a copy issue for Directory Table by @[wenchaozhang-123](https://github.com/wenchaozhang-123) in [#416](https://github.com/cloudberrydb/cloudberrydb/pull/416)
- Fix visimap consults for unique checks during UPDATEs by @[lss602726449](https://github.com/lss602726449) in [#423](https://github.com/cloudberrydb/cloudberrydb/pull/423)
- Fix some CI pipeline issues for Directory Table by @[wenchaozhang-123](https://github.com/wenchaozhang-123) in [#414](https://github.com/cloudberrydb/cloudberrydb/pull/414)
- Fix the issue that `gpconfig` does not escape the `$` character by @[Ray-Eldath](https://github.com/Ray-Eldath) in [403#](https://github.com/cloudberrydb/cloudberrydb/pull/403)

## Doc updates

- Update the `README.md` file by @[tuhaihe](https://github.com/tuhaihe) in [#411](https://github.com/cloudberrydb/cloudberrydb/pull/411)
- Update the deployment `README.md` by @[Zhangbaowen-Hashdata](https://github.com/Zhangbaowen-Hashdata) in [#409](https://github.com/cloudberrydb/cloudberrydb/pull/409)

## 🙌🏻️ New contributors

- @[kongfanshen-0801](https://github.com/kongfanshen-0801) made his (or her) first contribution in [#408](https://github.com/cloudberrydb/cloudberrydb/pull/408)
- @[foreyes](https://github.com/foreyes) made his (or her) first contribution in [#406](https://github.com/cloudberrydb/cloudberrydb/pull/406)

## 🧑🏻‍💻 Contributors

Thanks to all the contributors to make this release happen: @[smartyhero](https://github.com/smartyhero), @[Ray-Eldath](https://github.com/Ray-Eldath), @[gongxun0928](https://github.com/gongxun0928), @[kongfanshen-0801](https://github.com/kongfanshen-0801), @[foreyes](https://github.com/foreyes), @[tuhaihe](https://github.com/tuhaihe), @[Zhangbaowen-Hashdata](https://github.com/Zhangbaowen-Hashdata), @[jiaqizho](https://github.com/jiaqizho), @[wenchaozhang-123](https://github.com/wenchaozhang-123), @[lss602726449](https://github.com/lss602726449), @[soumyadeep2007](https://github.com/soumyadeep2007), @[ashwinstar](https://github.com/ashwinstar) 👍