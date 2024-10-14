---
title: pg_auth_members
---

# pg_auth_members

The `pg_auth_members` system catalog table in the `pg_catalog` schema shows the membership relations between roles. Any non-circular set of relationships is allowed. Because roles are system-wide, `pg_auth_members` is shared across all databases of a Cloudberry Database system.

|column|type|references|description|
|------|----|----------|-----------|
|`roleid`|oid|`pg_authid.oid`|ID of the parent-level (group) role|
|`member`|oid|`pg_authid.oid`|ID of a member role|
|`grantor`|oid|`pg_authid.oid`|ID of the role that granted this membership|
|`admin_option`|boolean| |True if role member might grant membership to others|
