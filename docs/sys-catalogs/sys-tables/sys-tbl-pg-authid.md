---
title: pg_authid
---

# pg_authid

The `pg_authid` table in the `pg_catalog` schema contains information about database authorization identifiers (roles). A role subsumes the concepts of users and groups. A user is a role with the `rolcanlogin` flag set. Any role (with or without `rolcanlogin`) might have other roles as members. See [`pg_auth_members`](/docs/sys-catalogs/sys-tables/sys-tbl-pg-auth-members.md).

Because this catalog contains passwords, it must not be publicly readable. `pg_roles` is a publicly readable view on `pg_authid` that blanks out the password field.

Because user identities are system-wide, `pg_authid` is shared across all databases in a Cloudberry Database system: there is only one copy of `pg_authid` per system, not one per database.

|column|type|references|description|
|------|----|----------|-----------|
|`oid`|oid| |Row identifier|
|`rolname`|name| |Role name|
|`rolsuper`|boolean| |Role has superuser privileges|
|`rolinherit`|boolean| |Role automatically inherits privileges of roles it is a member of|
|`rolcreaterole`|boolean| |Role might create more roles|
|`rolcreatedb`|boolean| |Role might create databases|
|`rolcanlogin`|boolean| |Role might log in. That is, this role can be given as the initial session authorization identifier|
|`rolreplication`|boolean| |Role is a replication role. That is, this role can initiate streaming replication and set/unset the system backup mode using `pg_start_backup` and `pg_stop_backup`.|
|`rolbypassrls`|boolean| |Roles bypasses every row-level security policy.|
|`rolconnlimit`|int4| |For roles that can log in, this sets maximum number of concurrent connections this role can make. `-1` means no limit|
|`rolpassword`|text| |Password (possibly encrypted); NULL if none. If the password is encrypted, this column will begin with the string `md5` followed by a 32-character hexadecimal MD5 hash. The MD5 hash will be the user's password concatenated to their user name. For example, if user `joe` has password `xyzzy`, Cloudberry Database will store the md5 hash of `xyzzyjoe`. Cloudberry Database assumes that a password that does not follow that format is unencrypted.|
|`rolvaliduntil`|timestamptz| |Password expiry time (only used for password authentication); NULL if no expiration|
|`rolresqueue`|oid| |Object ID of the associated resource queue ID in `pg_resqueue` |
|`rolcreaterextgpfd`|boolean| |Privilege to create read external tables with the `gpfdist` or `gpfdists` protocol|
|`rolcreaterexhttp`|boolean| |Privilege to create read external tables with the `http` protocol|
|`rolcreatewextgpfd`|boolean| |Privilege to create write external tables with the `gpfdist` or `gpfdists` protocol|
|`rolresgroup`|oid| |Object ID of the associated resource group ID in `pg_resgroup` |
