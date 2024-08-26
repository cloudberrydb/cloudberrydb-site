---
title: Set Password Profile
---

# Set password policy in Cloudberry Database (New in v1.5.0)

Profile refers to the password policy configuration, which is used to control the password security policy of users in Cloudberry Database. You can bind a profile to one or more users to control the password security policy of database users. Profile defines the rules for user management and password reuse. With Profile, the database administrator can use SQL to force some constraints, such as locking accounts after login failures or controlling the number of password reuses.

:::info
- In general, Profile includes password policy and user resource usage restrictions. Profile in Cloudberry Database only supports password policy. "Profile" mentioned in this document refers to password policy configuration.
- Only superusers can create or modify Profile policies, and superusers are not restricted by any Profile policies. Profile policies will take effect only when regular users are allowed to use Profile.
:::

The Profile feature is enabled by default. You can set the `enable_password_profile` parameter in the `postgresql.conf` file to disable or enable Profile. The default value of `enable_password_profile` is `true`.

To disable Profile and the related login monitor process, you can set `enable_password_profile` to `false` and restart the cluster:

```shell
gpconfig -c enable_password_profile -v false
gpstop -ra

# To re-enable Profile, execute _gpconfig -c enable_password_profile -v true_ and restart the cluster.
```

## Implementation principle

Similar to the Autovacuum mechanism, Profile introduces the Login Monitor Launcher and Login Monitor Worker processes. When user login verification fails, Cloudberry Database will send a signal to the postmaster. After receiving the signal, the postmaster will send a signal to the launcher process. After receiving the signal, the launcher process will notify the postmaster to launch a worker process to perform the metadata write-back operation, and notify the user process and the launcher process after completion.

## Set password policies using SQL

Database administrators can use SQL to set Profile. The following parameters are commonly used.

| **Parameter**         | **Description**                                                                                                                                                             |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FAILED_LOGIN_ATTEMPTS | • The maximum number of failed logins before the user account is locked.<br />• Valid values include `-2` (unlimited), `-1` (default), and `1` to `9999`.`0` is an invalid value. |
| PASSWORD_LOCK_TIME    | • The lock time (in hours) after multiple consecutive failed login attempts. <br />• Valid values are `-2` to `9999`. `0` is a valid value.                                       |
| PASSWORD_REUSE_MAX    | • The number of historical password reuses.<br />• Valid values are `-2` to `9999`. `0` is a valid value.                                                                         |

### CREATE PROFILE

Creates a profile and sets its password policy.

```sql
CREATE PROFILE profile LIMIT
  password_parameters ... ;

password_parameters:
{ { FAILED_LOGIN_ATTEMPTS
  | PASSWORD_REUSE_MAX
  | PASSWORD_LOCK_TIME
  }
  expr
}
```

### ALTER PROFILE

Modifies a password policy.

```sql
ALTER PROFILE profile LIMIT
   password_parameters ... ;
```

### DROP PROFILE

Deletes a profile.

```sql
DROP PROFILE profile;
```

### CREATE USER ... PROFILE

Creates a user and sets its profile.

```sql
CREATE USER user PROFILE profile;
```

### ALTER USER ... PROFILE

Modifies the profile of `user`.

```sql
ALTER USER user PROFILE profile;
```

### CREATE USER ... ENABLE/DISABLE PROFILE

Creates a user and specifies their permission to use Profile. `ENABLE PROFILE` grants permission, while `DISABLE PROFILE` denies it. By default, newly created users are not permitted to use Profile.

```sql
CREATE USER user
  { ENABLE | DISABLE }
  PROFILE;
```

### ALTER USER ... ENABLE/DISABLE PROFILE

Sets whether a user is allowed to use Profile.

```sql
ALTER USER user
  { ENABLE | DISABLE }
  PROFILE;
```

### CREATE USER ... ACCOUNT LOCK/UNLOCK

Creates a user and sets whether the user is locked. `ACCOUNT LOCK` means that the user is locked and cannot  log in. `ACCOUNT UNLOCK` means that the user is not locked and can log in. The default created user is not locked.

```sql
CREATE USER user ACCOUNT
  { LOCK | UNLOCK };
```

### ALTER USER ... ACCOUNT LOCK/UNLOCK

Sets whether to lock the account of a user.

```sql
ALTER USER user ACCOUNT
  { LOCK | UNLOCK };
```

## Check password policy information in system tables

After applying the password configuration policy, Cloudberry Database will update metadata: add two system tables `pg_profile` and `pg_password_history`, and add some fields to the system tables/views `pg_authid` and `pg_roles`. For example:

- **pg_catalog.pg_roles**: In `pg_roles`, the `rolprofile`, `rolaccountstatus`, and `rolfailedlogins` fields are added to record database users who use Profile, the account status, and the number of failed logins.

    ```sql
    View "pg_catalog.pg_roles"
        Column       |           Type           | Collation | Nullable | Default | Storage  | Description
    -------------------+--------------------------+-----------+----------+---------+----------+-------------
    rolname           | name                     |           |          |         | plain    |
    rolsuper          | boolean                  |           |          |         | plain    |
    rolinherit        | boolean                  |           |          |         | plain    |
    rolcreaterole     | boolean                  |           |          |         | plain    |
    rolcreatedb       | boolean                  |           |          |         | plain    |
    rolcanlogin       | boolean                  |           |          |         | plain    |
    rolreplication    | boolean                  |           |          |         | plain    |
    rolconnlimit      | integer                  |           |          |         | plain    |
    rolprofile        | name                     |           |          |         | plain    |
    rolaccountstatus  | smallint                 |           |          |         | plain    |
    rolfailedlogins   | integer                  |           |          |         | plain    |
    rolpassword       | text                     |           |          |         | extended |
    rolvaliduntil     | timestamp with time zone |           |          |         | plain    |
    rolbypassrls      | boolean                  |           |          |         | plain    |
    rolconfig         | text[]                   | C         |          |         | extended |
    rolresqueue       | oid                      |           |          |         | plain    |
    oid               | oid                      |           |          |         | plain    |
    rolcreaterextgpfd | boolean                  |           |          |         | plain    |
    rolcreaterexthttp | boolean                  |           |          |         | plain    |
    rolcreatewextgpfd | boolean                  |           |          |         | plain    |
    rolresgroup       | oid                      |           |          |         | plain    |
    ```

- **pg_catalog.pg_authid**: In `pg_authid`, the `rolprofile`, `rolaccountstatus`, `rolfailedlogins`, `rolpasswordsetat`, `rollockdata`, and `rolpasswordexpire` are added to record the database users who use Profile, the account status, the number of failed logins, password setting time, account lock time, and password expiration time.

    ```sql
    Table "pg_catalog.pg_authid"
        Column       |           Type           | Collation | Nullable | Default | Storage  | Compression | Stats target | Description
    -------------------+--------------------------+-----------+----------+---------+----------+-------------+--------------+-------------
    oid               | oid                      |           | not null |         | plain    |             |              |
    rolname           | name                     |           | not null |         | plain    |             |              |
    rolsuper          | boolean                  |           | not null |         | plain    |             |              |
    rolinherit        | boolean                  |           | not null |         | plain    |             |              |
    rolcreaterole     | boolean                  |           | not null |         | plain    |             |              |
    rolcreatedb       | boolean                  |           | not null |         | plain    |             |              |
    rolcanlogin       | boolean                  |           | not null |         | plain    |             |              |
    rolreplication    | boolean                  |           | not null |         | plain    |             |              |
    rolbypassrls      | boolean                  |           | not null |         | plain    |             |              |
    rolconnlimit      | integer                  |           | not null |         | plain    |             |              |
    rolenableprofile  | boolean                  |           | not null |         | plain    |             |              |
    rolpassword       | text                     | C         |          |         | extended |             |              |
    rolvaliduntil     | timestamp with time zone |           |          |         | plain    |             |              |
    rolprofile        | oid                      |           | not null |         | plain    |             |              |
    rolaccountstatus  | smallint                 |           | not null |         | plain    |             |              |
    rolfailedlogins   | integer                  |           | not null |         | plain    |             |              |
    rolpasswordsetat  | timestamp with time zone |           |          |         | plain    |             |              |
    rollockdate       | timestamp with time zone |           |          |         | plain    |             |              |
    rolpasswordexpire | timestamp with time zone |           |          |         | plain    |             |              |
    rolresqueue       | oid                      |           |          |         | plain    |             |              |
    rolcreaterextgpfd | boolean                  |           |          |         | plain    |             |              |
    rolcreaterexthttp | boolean                  |           |          |         | plain    |             |              |
    rolcreatewextgpfd | boolean                  |           |          |         | plain    |             |              |
    rolresgroup       | oid                      |           |          |         | plain    |             |              |
    Indexes:
        "pg_authid_oid_index" PRIMARY KEY, btree (oid), tablespace "pg_global"
        "pg_authid_rolname_index" UNIQUE CONSTRAINT, btree (rolname), tablespace "pg_global"
        "pg_authid_rolprofile_index" btree (rolprofile), tablespace "pg_global"
        "pg_authid_rolresgroup_index" btree (rolresgroup), tablespace "pg_global"
        "pg_authid_rolresqueue_index" btree (rolresqueue), tablespace "pg_global"
    Tablespace: "pg_global"
    Access method: heap
    ```

- **pg_catalog.pg_profile**

    The newly added `pg_profile` system table is as follows:

    ```sql
    Table "pg_catalog.pg_profile"
            Column          |  Type   | Collation | Nullable | Default | Storage | Compression | Stats target | Description
    -------------------------+---------+-----------+----------+---------+---------+-------------+--------------+-------------
    oid                     | oid     |           | not null |         | plain   |             |              |
    prfname                 | name    |           | not null |         | plain   |             |              |
    prffailedloginattempts  | integer |           | not null |         | plain   |             |              |
    prfpasswordlocktime     | integer |           | not null |         | plain   |             |              |
    prfpasswordlifetime     | integer |           | not null |         | plain   |             |              |
    prfpasswordgracetime    | integer |           | not null |         | plain   |             |              |
    prfpasswordreusetime    | integer |           | not null |         | plain   |             |              |
    prfpasswordreusemax     | integer |           | not null |         | plain   |             |              |
    prfpasswordallowhashed  | integer |           | not null |         | plain   |             |              |
    prfpasswordverifyfuncdb | oid     |           |          |         | plain   |             |              |
    prfpasswordverifyfunc   | oid     |           |          |         | plain   |             |              |
    Indexes:
        "profile_name_index" UNIQUE CONSTRAINT, btree (prfname), tablespace "pg_global"
        "profile_oid_index" UNIQUE CONSTRAINT, btree (oid), tablespace "pg_global"
        "profile_password_verify_function_index" btree (prfpasswordverifyfuncdb, prfpasswordverifyfunc), tablespace "pg_global"
    Tablespace: "pg_global"
    Access method: heap
    ```

  :::info
  The fields in the `pg_profile` table are described as follows:

  - `oid`: used to uniquely identify each profile record.
  - `prfname`: the name of the configuration file.
  - `prffailedloginattempts`: the number of failed login attempts allowed before an account is locked.
  - `prfpasswordlocktime`: the password lock time. If an account is locked due to failed login attempts, this field defines how long the lock lasts.
  - `prfpasswordreusemax`: the number of new passwords that must be set before the old password can be reused.
  - Other fields in the table are not valid.
  :::

- **pg_catalog.pg_password_history**

    ```sql
    Table "pg_catalog.pg_password_history"
            Column         |           Type           | Collation | Nullable | Default | Storage  | Compression | Stats target | Description
    -----------------------+--------------------------+-----------+----------+---------+----------+-------------+--------------+-------------
    passhistroleid        | oid                      |           | not null |         | plain    |             |              |
    passhistpasswordsetat | timestamp with time zone |           | not null |         | plain    |             |              |
    passhistpassword      | text                     | C         | not null |         | extended |             |              |
    Indexes:
        "pg_password_history_role_password_index" UNIQUE CONSTRAINT, btree (passhistroleid, passhistpassword), tablespace "pg_global"
        "pg_password_history_role_passwordsetat_index" btree (passhistroleid, passhistpasswordsetat), tablespace "pg_global"
    Tablespace: "pg_global"
    Access method: heap
    ```

  :::info
  The fields in the `pg_password_history` table are described as follows:

  - `passhistroleid`: a unique ID that identifies the user or role related to this password history.
  - `passhistpasswordsetat`: a timestamp field with the time zone that records the exact time when the password was set or last modified.
  - `Passhistpassword`: the ciphertext that stores historical passwords.
  :::

## Default password policy

When you create a user, Cloudberry Database applies the default Profile to the user by default if no specific password policy is specified. The default Profile is the default password policy during system initialization. The default Profile in Cloudberry Database is the `pg_default` row in the `pg_profile` table. The `pg_default` row defines default values for the Profile parameters, and only superusers can modify these parameters.

If a user sets a parameter with the default value `-1`, the parameter will get its value from `pg_default`. The default values of `pg_default` are as follows. Refer to [Scenario 3](#scenario-3-use-default-profile) for how to use the default Profile.

```sql
\x
Expanded display is on.

-- Checks the values of the default Profile in pg_profile
SELECT * FROM pg_profile WHERE prfname = 'pg_default';
-[ RECORD 1 ]-----------+-----------
oid                     | 10140
prfname                 | pg_default
prffailedloginattempts  | -2
prfpasswordlocktime     | -2
prfpasswordlifetime     | -2
prfpasswordgracetime    | -2
prfpasswordreusetime    | -2
prfpasswordreusemax     | -2
prfpasswordallowhashed  | 1
prfpasswordverifyfuncdb |
prfpasswordverifyfunc   |
```

:::info
The `pg_default` row cannot be renamed or dropped by any user (including superusers).
:::

## Scenario examples

This section introduces typical usage scenarios of Profile.

### Create a password policy

Before creating a password policy, you need to create a profile first and bind a database user to the profile. For example:

```sql
-- Creates a profile and a user.
CREATE PROFILE myprofile;
CREATE USER myuser PASSWORD 'mypassword';

-- Binds the profile to the user.
ALTER USER myuser PROFILE myprofile;

-- Checks the relationship between the user and the profile.
SELECT rolname, rolprofile FROM pg_roles WHERE rolname = 'myuser';
 rolname | rolprofile
---------+------------
 myuser  | myprofile
(1 row)
```

### Scenario 1: Set the maximum number of failed login attempts and password lock time

Modify a Profile to set the maximum number of failed login attempts to 3 and the password lock time to 2 hours.

:::info
When multiple users fail to log in, the result return speed may slow down.
:::

```sql
ALTER PROFILE myprofile LIMIT
  FAILED_LOGIN_ATTEMPTS 3
  PASSWORD_LOCK_TIME 2;
  
-- Allows the user myuser to use Profile.
ALTER USER myuser ENABLE PROFILE;


-- Checks the details in the catalog table (the pg_profile is the catalog table that stores all the details related to the user profile).
-- Note that the time shown below is in seconds.

SELECT prfname, prffailedloginattempts, prfpasswordlocktime
FROM pg_profile
WHERE prfname = 'myprofile';
  prfname  | prffailedloginattempts | prfpasswordlocktime
-----------+------------------------+---------------------
 myprofile |                      3 |                   2
(1 row)

SELECT rolname, rolprofile, get_role_status('myuser'), rolfailedlogins, rollockdate
FROM pg_roles
WHERE rolname = 'myuser';
 rolname | rolprofile | get_role_status | rolfailedlogins | rollockdate
---------+------------+-----------------+-----------------+-------------
 myuser  | myprofile  | OPEN            |               0 |
(1 row)
```

The current user `myuser` does not have any login failures yet. The `pg_roles` system table shows that the user's status is `OPEN`, and the `rolfailedlogins` field in the system table `pg_roles` is `0`. Now `myuser` attempts a failed login and queries `pg_roles` again.

```sql
\c - myuser
Password for user myuser:
FATAL:  password authentication failed for user "myuser"
Previous connection kept

SELECT rolname, rolprofile, get_role_status('myuser'), rolfailedlogins, rollockdate
FROM pg_roles
WHERE rolname = 'myuser';
 rolname | rolprofile | get_role_status | rolfailedlogins | rollockdate
---------+------------+-----------------+-----------------+-------------
 myuser  | myprofile  | OPEN            |               1 |
(1 row)
```

The above result shows that the user status is still `OPEN`, and `rolfailedlogins` have increased to `1`. If the account fails to log in again, the `rolfailedlogins` will continue to increase until the account is locked:

```sql
\c - myuser
Password for user myuser:
FATAL:  role "myuser" is locked
Previous connection kept

SELECT rolname, rolprofile, get_role_status('myuser'), rolfailedlogins, rollockdate
FROM pg_roles
WHERE rolname = 'myuser';
 rolname | rolprofile | get_role_status | rolfailedlogins |           rollockdate            
---------+------------+-----------------+-----------------+----------------------------------
 myuser  | myprofile  | LOCKED(TIMED)   |               4 |13-MAR-23 12:25:50.811022 +08:00
(1 row)
```

The user account is locked because of too many failed logins. The user status has changed to `LOCKED(TIMED)` and the user account will be automatically unlocked after 2 hours (controlled by the `PASSWORD_LOCK_TIME` parameter).

At the same time, the system records the timestamp of the user account lock. When the lock period expires, the user account's status will change back to `OPEN` and login will be allowed. If the user fails to log in several times and the number of failures does not exceed the limit of `FAILED_LOGIN_ATTEMPTS`, then the user can log in successfully, and the system will reset `rolfailedlogins` to `0`. See the following example:

```sql
\c - myuser
Password for user myuser:
You are now connected to database "postgres" as user "myuser".

SELECT rolname, rolprofile, get_role_status('myuser'), rolfailedlogins, rollockdate
FROM pg_roles
WHERE rolname = 'myuser';
 rolname | rolprofile | get_role_status | rolfailedlogins |           rollockdate            
---------+------------+-----------------+-----------------+----------------------------------
 myuser  | myprofile  | OPEN            |               0 |13-MAR-23 12:25:50.811022 +08:00
(1 row)
```

:::info
If `PASSWORD_LOCK_TIME` is manually set to `0`, the user account will never be locked.
:::

### Scenario 2: Set the number of historical password reuses

With the `PASSWORD_REUSE_MAX` parameter, you can prevent users from setting recently used passwords. If you want to prevent users from using the last two historical passwords, you can use `ALTER PROFILE` to modify this parameter. For example:

```sql
ALTER PROFILE myprofile LIMIT
  PASSWORD_REUSE_MAX 2;
  
-- Checks the Catalog table and finds that the number of permitted historical password reuses is 2.
  SELECT prfname, prfpasswordreusemax
  FROM pg_profile
  WHERE prfname = 'myprofile';
    prfname  | prfpasswordreusemax
-----------+---------------------
 myprofile |                   2
(1 row)
```

```sql
ALTER USER myuser PASSWORD 'mynewpassword';

ALTER USER myuser PASSWORD 'mypassword';
ERROR:  The new password should not be the same with latest 2 history password
```

The above result shows that `mypassword` is not allowed to be reused as a new password because it has been used before. To set a new password, make sure that two different in-between passwords have been set before reusing an old password.

```sql
ALTER USER myuser PASSWORD 'mypassword2'; -- Second password change
ALTER USER myuser PASSWORD 'mypassword';
```

:::info
If `PASSWORD_REUSE_MAX` is set to `0`, the password can never be changed. If set to `-2`(`UNLIMITED`), the history password can only be used after `9999` passwords have been set.
:::

### Scenario 3: Use DEFAULT PROFILE

If you do not explicitly specify a parameter value when creating a profile, the parameter value  in the `pg_profile` table is `-1` by default, which means that Cloudberry Database will obtain the value of this parameter from `pg_default`.

Take `FAILED_LOGIN_ATTEMPTS` as an example:

```sql
--Creates a profile without explicitly specifying any parameter values.
CREATE PROFILE myprf;

-- Checks the default parameter value of myprf in pg_profile.

SELECT * FROM pg_profile WHERE prfname = 'myprf';
-[ RECORD 1 ]-----------+------
oid                     | 16386
prfname                 | myprf
prffailedloginattempts  | -1
prfpasswordlocktime     | -1
prfpasswordlifetime     | -1
prfpasswordgracetime    | -1
prfpasswordreusetime    | -1
prfpasswordreusemax     | -1
prfpasswordallowhashed  | -1
prfpasswordverifyfuncdb |
prfpasswordverifyfunc   |
```

The above example creates a profile named `myprf`. Because no parameter values are set explicitly, all parameter values are `-1` by default, which means that any user bound to this profile will use the parameter values in `pg_default`.

The following example sets the `FAILED_LOGIN_ATTEMPTS` parameter of `pg_defau``lt` to `1` and creates a test.

```sql
-- Sets the default value of FAILED_LOGIN_ATTEMPTS in pg_default to 1.
-- All users who do not specify a profile will have their accounts locked after a failed login.

ALTER PROFILE pg_default LIMIT FAILED_LOGIN_ATTEMPTS 1;
\x
Expanded display is on.

-- Checks the default value of pg_default in pg_profile.
SELECT * FROM pg_profile WHERE prfname = 'pg_default';
-[ RECORD 1 ]-----------+-----------
oid                     | 10140
prfname                 | pg_default
prffailedloginattempts  | 1
prfpasswordlocktime     | -2
prfpasswordlifetime     | -2
prfpasswordgracetime    | -2
prfpasswordreusetime    | -2
prfpasswordreusemax     | -2
prfpasswordallowhashed  | 1
prfpasswordverifyfuncdb |
prfpasswordverifyfunc   |

CREATE USER mynewuser PASSWORD 'mynewpassword' ENABLE PROFILE;

SELECT rolname, rolprofile, get_role_status('mynewuser'), rolfailedlogins, rollockdate
FROM pg_roles
WHERE rolname = 'mynewuser';
  rolname  | rolprofile | get_role_status | rolfailedlogins | rollockdate
-----------+------------+-----------------+-----------------+-------------
 mynewuser | pg_default | OPEN            |               0 |
(1 row)
```

From the above result, you can see that the user's profile is `pg_default` and the user account status is `OPEN`. Next, try logging into the account using a wrong password.

```sql
\c - mynewuser
Password for user mynewuser:
FATAL:  password authentication failed for user "mynewuser"
Previous connection kept

SELECT rolname, rolprofile, get_role_status('mynewuser'), rolfailedlogins, rollockdate
FROM pg_roles
WHERE rolname = 'mynewuser';
  rolname  | rolprofile | get_role_status | rolfailedlogins |           rollockdate            
-----------+------------+---------------------+-----------------+----------------------------------
 mynewuser | pg_default | LOCKED(TIMED)   |               1 | 12-MAR-23 09:36:42.132231 +08:00
(1 row)
```

Because `FAILED_LOGIN_ATTEMPTS` of `pg_default` is `1`, the account is locked after one failed login.

Next, set the user's profile to `myprf`, and then test the same operation to observe the result. The user needs to be unlocked before the test.

```sql
ALTER USER mynewuser ACCOUNT unlock PROFILE myprf;

SELECT rolname, rolprofile, get_role_status('mynewuser'), rolfailedlogins, rollockdate
FROM pg_roles
WHERE rolname = 'mynewuser';
  rolname  | rolprofile | get_role_status | rolfailedlogins |           rollockdate            
-----------+------------+---------------------+-----------------+----------------------------------
 mynewuser | myprf      | OPEN            |               0 | 12-MAR-23 09:36:42.132231 +08:00
(1 row)
```

The result shows that the user status changes back to `OPEN` and the profile changes to `myprf`. `rollockdate` still exists as expected. Next, use a wrong password to log in again and observe the returned result.

```sql
\c - mynewuser
Password for user mynewuser:
FATAL:  password authentication failed for user "mynewuser"
Previous connection kept

SELECT rolname, rolprofile, get_role_status('mynewuser'), rolfailedlogins, rollockdate
FROM pg_roles
WHERE rolname = 'mynewuser';
  rolname  | rolprofile | get_role_status | rolfailedlogins |           rollockdate            
-----------+------------+---------------------+-----------------+----------------------------------
 mynewuser | myprf      | LOCKED(TIMED)   |               1 | 12-MAR-23 09:38:26.753832 +08:00
(1 row)
```

As expected, the user account status is locked again.

### Scenario 4: Superuser locks or unlocks user account

A superuser can lock or unlock a user account. For example:

```sql
ALTER USER myuser ACCOUNT LOCK;

SELECT rolname, rolprofile, get_role_status('myuser'), rolfailedlogins, rollockdate
FROM pg_roles
WHERE rolname = 'myuser';
 rolname | rolprofile | get_role_status | rolfailedlogins |           rollockdate            
---------+------------+---------------------+-----------------+----------------------------------
 myuser  | myprofile  | LOCKED          |               0 | 13-MAR-23 12:25:50.811022 +08:00
(1 row)

ALTER USER myuser ACCOUNT UNLOCK;

SELECT rolname, rolprofile, get_role_status('myuser'), rolfailedlogins, rollockdate
FROM pg_roles
WHERE rolname = 'myuser';
 rolname | rolprofile | get_role_status | rolfailedlogins |           rollockdate            
---------+------------+---------------------+-----------------+----------------------------------
 myuser  | myprofile  | OPEN            |               0 | 13-MAR-23 13:23:50.83928 +08:00
(1 row)
```

### Scenario 5: Enable Profile for regular users

By default, a newly created regular user is not bound to a Profile. To use Profile, you need to specify it explicitly. See the following example:

```sql
CREATE USER myuser1;

SELECT rolname, rolprofile, get_role_status('myuser1'), rolfailedlogins, rollockdate, rolenableprofile
FROM pg_roles
WHERE rolname like 'myuser1';
 rolname | rolprofile | get_role_status | rolfailedlogins | rollockdate | rolenableprofile
---------+------------+-----------------+-----------------+-------------+------------------
 myuser1 | pg_default | OPEN            |               0 |             | f
(1 row)

CREATE USER myuser2 ENABLE PROFILE;
SELECT rolname, rolprofile, get_role_status('myuser2'), rolfailedlogins, rollockdate, rolenableprofile
FROM pg_roles
WHERE rolname = 'myuser2';
 rolname | rolprofile | get_role_status | rolfailedlogins | rollockdate | rolenableprofile
---------+------------+-----------------+-----------------+-------------+------------------
 myuser2 | pg_default | OPEN            |               0 |             | t
(1 row)

CREATE USER myuser3 DISABLE PROFILE;
SELECT rolname, rolprofile, get_role_status('myuser3'), rolfailedlogins, rollockdate, rolenableprofile
FROM pg_roles
WHERE rolname = 'myuser3';
 rolname | rolprofile | get_role_status | rolfailedlogins | rollockdate | rolenableprofile
---------+------------+-----------------+-----------------+-------------+------------------
 myuser3 | pg_default | OPEN            |               0 |             | f
(1 row)
```

After creating a user, you can modify whether to use Profile through the SQL statement `ALTER USER ENABLE/DISABLE PROFILE`.

```sql
ALTER USER myuser1 ENABLE PROFILE;

SELECT rolname, rolprofile, get_role_status('myuser1'), rolfailedlogins, rollockdate, rolenableprofile
FROM pg_roles
WHERE rolname = 'myuser1';
 rolname | rolprofile | get_role_status | rolfailedlogins | rollockdate | rolenableprofile
---------+------------+-----------------+-----------------+-------------+------------------
 myuser1 | pg_default | OPEN            |               0 |             | t
(1 row)

ALTER USER myuser1 DISABLE PROFILE;
SELECT rolname, rolprofile, get_role_status('myuser1'), rolfailedlogins, rollockdate, rolenableprofile
FROM pg_roles
WHERE rolname = 'myuser1';
 rolname | rolprofile | get_role_status | rolfailedlogins | rollockdate | rolenableprofile
---------+------------+-----------------+-----------------+-------------+------------------
 myuser1 | pg_default | OPEN            |               0 |             | f
(1 row)
```
