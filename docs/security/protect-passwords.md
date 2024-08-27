---
title: Protect Passwords
---

# Protect passwords in Cloudberry Database

In its default configuration, Cloudberry Database saves MD5 or SCRAM-SHA-256 hashes of login users' passwords in the `pg_authid` system catalog rather than saving clear text passwords. Anyone who is able to view the `pg_authid` table can see hash strings, but no passwords. This also ensures that passwords are obscured when the database is dumped to backup files.

The hash function runs when the password is set by using any of the following commands:

- `CREATE USER name WITH PASSWORD 'password'`
- `CREATE ROLE name WITH LOGIN PASSWORD 'password'`
- `ALTER USER name WITH PASSWORD 'password'`
- `ALTER ROLE name WITH PASSWORD 'password'`

:::info
The SQL command syntax and `password_encryption` configuration variable include the term *encrypt*, but the passwords are not technically encrypted. They are *hashed* and therefore cannot be decrypted.
:::

The hash is calculated on the concatenated clear text password and role name. The MD5 hash produces a 32-byte hexadecimal string prefixed with the characters `md5` while the SCRAM-SHA-256 hash produces a 64-byte hexadecimal string prefixed with the characters `SCRAM-SHA-256`. The hashed password is saved in the `rolpassword` column of the `pg_authid` system table.

To set `password_encryption` globally, edit the `postgresql.conf` file and set the `password_encryption` parameter to `md5` or `scram-sha-256`.

To set `password_encryption` in a session, use the SQL `SET` command:

```sql
SET password_encryption = 'md5';
```