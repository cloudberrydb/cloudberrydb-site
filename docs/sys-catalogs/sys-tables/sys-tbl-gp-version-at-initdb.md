---
title: gp_version_at_initdb
---

# gp_version_at_initdb

The `gp_version_at_initdb` table in the `pg_catalog` schema is populated on the coordinator and each segment in the Cloudberry Database system. It identifies the version of Cloudberry Database used when the system was first initialized. This table is defined in the `pg_global` tablespace, meaning it is globally shared across all databases in the system.

|column|type|references|description|
|------|----|----------|-----------|
|`schemaversion`|smallint| |Schema version number.|
|`productversion`|text| |Product version number.|
