---
title: 配置密码策略
---

# 在 Cloudberry Database 中配置密码策略（引入自 v1.5.0 版本）

Profile，即密码策略配置，用于控制 Cloudberry Database 中用户的密码安全策略。你可以将 Profile 绑定到一个或多个用户中，从而控制数据库用户的密码安全策略。Profile 定义了用户管理和重复使用密码的规则。通过配置 Profile，数据库管理员可以使用 SQL 语句强制添加一些约束，例如在一定次数的登录失败后锁定账户，或者控制密码重复使用次数。

:::info 注意
- 通常来说，Profile（即配置文件）分为密码策略及用户资源使用限制两部分。Cloudberry Database 中的 Profile 目前只支持密码策略，在本文档中提到的 Profile，除非另有说明，均代指 Password Profile（密码策略配置）。

- 只有超级用户可以创建或修改 Profile 的策略，超级用户不受任何 Profile 策略的控制。普通用户只有在允许使用 Profile 时，Profile 的策略才会生效。
:::

密码策略配置默认开启。如果要关闭或开启密码策略配置，你可以设置 `postgresql.conf` 配置文件中的 `enable_password_profile` 参数，该参数默认值为 `true`。如果你希望关闭该功能以及相关的 login monitor 进程，可以将参数值设为 `false` 并重启集群：

```shell
gpconfig -c enable_password_profile -v false
gpstop -ra

# 若要重新开启，可执行 gpconfig -c enable_password_profile -v true 并重启集群。
```

## 实现原理

类似于 Autovacuum 机制，Profile 引入了 Login Monitor Launcher 和 Login Monitor Worker 进程。当用户登录验证失败时，Cloudberry Database 会向 postmaster 发送信号量。postmaster 收到信号后会向 launcher 进程发送信号。launcher 进程在收到信号后，会通知 postmaster 拉起一个 worker 进程，worker 进程中进行元数据回写操作，并在完成后，通知用户进程和 launcher 进程。

## 使用 SQL 语法设置密码策略

目前数据库管理员可以使用 SQL 语句设置 Profile，语句中常用以下密码相关的参数：

| **参数**              | **说明**                                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------------- |
| FAILED_LOGIN_ATTEMPTS | • 指定用户账户被锁定之前最多的失败登录次数。<br />• 有效值包括 `-2`（无限制），`-1`（默认），`1` 到 `9999`，`0` 为无效值。 |
| PASSWORD_LOCK_TIME    | • 指定连续登录失败多次后的锁定时间（单位为小时）。<br />• 有效值为 `-2` 到 `9999`，`0` 为有效值。                          |
| PASSWORD_REUSE_MAX    | • 指定历史密码重复使用次数。- 有效值为 `-2` <br />• `9999`，`0` 为有效值。                                                |

### CREATE PROFILE

创建一个 Profile，并设置对应的密码策略。

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

更新 Profile，修改其中的密码策略。

```sql
ALTER PROFILE profile LIMIT
   password_parameters ... ;
```

### DROP PROFILE

删除一个 Profile。

```sql
DROP PROFILE profile;
```

### CREATE USER ... PROFILE

创建一个用户 `user`，并同时设置其 Profile。

```sql
CREATE USER user PROFILE profile;
```

### ALTER USER ... PROFILE

修改用户 `user` 的 Profile。

```sql
ALTER USER user PROFILE profile;
```

### CREATE USER ... ENABLE/DISABLE PROFILE

创建一个 `user`，并设置是否该用户允许使用 Profile。`ENABLE PROFILE` 为允许，`DISABLE PROFILE` 为不允许。默认创建的用户不允许使用 Profile。

```sql
CREATE USER user
  { ENABLE | DISABLE }
  PROFILE;
```

### ALTER USER ... ENABLE/DISABLE PROFILE

修改用户 `user` 是否允许使用 Profile。

```sql
ALTER USER user
  { ENABLE | DISABLE }
  PROFILE;
```

### CREATE USER ... ACCOUNT LOCK/UNLOCK

创建一个用户 `user`，并设置该 `user` 是否被锁定。`ACCOUNT LOCK` 为锁定用户，该用户不可被登录；`ACCOUNT UNLOCK` 为不锁定，该用户可正常登录。默认的创建用户是不被锁定的。

```sql
CREATE USER user ACCOUNT
  { LOCK | UNLOCK };
```

### ALTER USER ... ACCOUNT LOCK/UNLOCK

修改 `user` 账户是否被锁定。

```sql
ALTER USER user ACCOUNT
  { LOCK | UNLOCK };
```

## 在系统表中查看密码策略信息

应用密码配置策略 Profile 后，Cloudberry Database 会在数据库元信息中做一些变更，即新增 `pg_profile` 和 `pg_password_history` 两张系统表，并在系统表/视图 `pg_authid` 和 `pg_roles` 添加了部分字段。示例如下：

- **pg_catalog.pg_roles**：在 `pg_roles` 下，新增了 `rolprofile`、`rolaccountstatus`、`rolfailedlogins` 字段，分别记录应用 Profile 的数据库用户、账户状态、登录失败的次数。

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

- **pg_catalog.pg_authid**：在 `pg_authid` 下，新增了字段 `rolprofile`、`rolaccountstatus`、`rolfailedlogins`、`rolpasswordsetat`、`rollockdata`、`rolpasswordexpire` 字段，分别记录应用 Profile 的数据库用户、账户状态、登录失败的次数、设置密码的时间、锁定账户的时间、密码到期的时间。

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

    新增的 `pg_profile` 系统表如下：

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

    :::info 信息
    `pg_profile` 表中各字段解释如下：

    - `oid` - 用于唯一标识每个 profile 记录。
    - `prfname` - 配置文件的名称。
    - `prffailedloginattempts` - 允许的失败登录尝试次数，在这之后账户会被锁定。
    - `prfpasswordlocktime` - 密码锁定时间长度，如果一个账户因为失败的登录尝试被锁定，这个字段定义了锁定持续的时间。
    - `prfpasswordreusemax` - 重复使用旧密码之前必须设置的新密码数量。
    - 表中的其他字段，当前暂未生效。
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

    :::info 信息
    `pg_password_history` 表中各字段解释如下：

    - `passhistroleid` - 用于标识与该密码历史记录关联的用户或角色的唯一 ID。
    - `passhistpasswordsetat` - 这是一个带时区的时间戳字段，记录密码被设置或者最后一次修改的确切时间。
    - `passhistpassword` - 存储历史密码的密文。
    :::

## 默认密码策略

创建新用户时，如果没有指定具体的密码策略，Cloudberry Database 默认为该用户应用 Default Profile，即系统初始化时生成的默认密码策略。Cloudberry Database 中的 Default Profile 为 `pg_profile` 表中的  `pg_default` 行。`pg_default` 定义了 Profile 参数的默认值，只有超级用户可以对这些限制进行更新。

如果用户设置的 Profile 中，有值为 `-1`（即使用默认值）的参数，这些参数会从 `pg_default` 中得到具体的值。`pg_default` 的默认值如下所示。如何使用 Default Profile 可以参考[使用场景三](#场景三使用-default-profile-的设置)。

```sql
\x
Expanded display is on.

-- 从 pg_profile 中检查默认密码策略配置文件中的值
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
:::info 注意
`pg_default` 不允许被任何用户（包含超级用户）重新命名 (rename) 或删除 (drop)。
:::

## 场景示例

本节介绍 Profile 的使用场景示例。

### 创建密码策略

在此之前，需要创建一个简单的 Profile，并将数据库用户绑定至该 Profile，示例如下：

```sql
-- 创建 Profile 和用户 myuser
CREATE PROFILE myprofile;
CREATE USER myuser PASSWORD 'mypassword';

-- 将 Profile 绑定至用户 myuser
ALTER USER myuser PROFILE myprofile;

-- 查看用户 myuser 和 Profile 之间的对应关系
SELECT rolname, rolprofile FROM pg_roles WHERE rolname = 'myuser';
 rolname | rolprofile
---------+------------
 myuser  | myprofile
(1 row)
```

## 场景一：设置登录失败的最多尝试次数以及密码锁定时间

修改 Profile，设置登录失败的最多尝试次数为 3，设置密码锁定时间为 2 小时。

:::info 注意
注意：当多个用户登录失败后，返回结果的速度可能会变慢。
:::

```sql
ALTER PROFILE myprofile LIMIT
  FAILED_LOGIN_ATTEMPTS 3
  PASSWORD_LOCK_TIME 2;
  
-- 允许用户 myuser 使用 Profile
ALTER USER myuser ENABLE PROFILE;


-- 查看目录表（pg_profile 是存储与用户配置文件相关的所有详细信息的目录表）中的详细信息。
-- 注意，此处显示的时间以秒为单位。
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

因当前用户 `myuser` 还未登录失败，查询 `pg_roles` 系统表，显示用户的状态为 `OPEN`，系统表 `pg_roles` 中的 `rolfailedlogins` 为 `0`。现在 `myuser` 尝试一次失败的登录并执行相同的查询语句：

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

以上结果显示，用户状态仍为 `OPEN`，但是 `rolfailedlogins` 增加到 `1`。如果继续登录失败，`rolfailedlogins` 会继续增加，直至账户被锁定，如下所示：

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

由于过多的失败登录，用户账户被锁定。用户状态已变为 `LOCKED(TIMED)`，用户账户将在 2 小时后（由 `PASSWORD_LOCK_TIME` 参数控制）自动解锁。

同时系统记录了用户账户锁定的时间戳信息。锁定时间结束后，用户账户的状态会重新变为 `OPEN`，并且允许登录。如果用户先有几次失败的登录，但失败次数没有超出 `FAILED_LOGIN_ATTEMPTS` 的限制，此时如果用户登录成功了，系统会将 `rolfailedlogins` 重置为 0，如下所示：

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

:::info 注意
如果手动将 `PASSWORD_LOCK_TIME` 设为为 0，则用户账户永远不会被锁定。
:::

### 场景二：设置历史密码重复的使用次数

通过参数 `PASSWORD_REUSE_MAX`，可以避免用户设置最近使用过的密码。假设需要避免用户使用最近两次历史密码，可以使用在 `ALTER PROFILE` 命令中通过该参数修改，示例如下：

```sql
ALTER PROFILE myprofile LIMIT
  PASSWORD_REUSE_MAX 2;
  
  -- 查看 Catalog 表，查询到已设置历史密码重复使用两次
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

结果显示，由于 `mypassword` 在被设置为新密码之前已经使用过，因此系统不允许将 `mypassword` 重用为新密码。要设置新密码，需确保在待设置的目标密码之前，有两个不同的密码已经被设置过，如下所示：

```sql
ALTER USER myuser PASSWORD 'mypassword2'; -- Second password change
ALTER USER myuser PASSWORD 'mypassword';
```

:::info 注意
如果将 `PASSWORD_REUSE_MAX` 设为 `0`，则密码永远不可被修改。如果设置为 `-2`（`UNLIMITED`)，则历史密码只有在设置过 `9999` 个新密码后，才可继续被使用。
:::

## 场景三：使用 DEFAULT PROFILE 的设置

创建一个新的 Profile 时，如果不显式指定参数值，那么该 Profile 在 `pg_profile` 表中对应的参数值为 `-1`，表示 Cloudberry Database 会从 `pg_default` 中获取该参数的实际值。

以下以 `FAILED_LOGIN_ATTEMPTS` 为例：

```sql
-- 创建一个 Profile，不显示指定任何参数值
CREATE PROFILE myprf;

-- 查看 pg_profile 中 myprf 的默认参数值
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

以上示例创建了一个名为 `myprf` 的新 Profile。由于创建语句没有显式地指定参数值，所有的参数被设置为 `-1`，这意味着任何被绑定到该 Profile 上的用户将使用 `pg_default` 中的参数值。

下面将 `pg_default` 的 `FAILED_LOGIN_ATTEMPTS` 设置为 `1`，并且创建一个用户测试，示例如下：

```sql
-- 将 pg_default 中的 FAILED_LOGIN_ATTEMPTS 默认值设为 1
-- 所有没有指定 Profile 的用户都会在一次登录失败后被锁定账户
ALTER PROFILE pg_default LIMIT FAILED_LOGIN_ATTEMPTS 1;
\x
Expanded display is on.

-- 查看 pg_profile 中 pg_default 的默认值
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

可以看到该用户的 Profile 为 `pg_default`，用户账户状态为 `OPEN`。接下来，尝试使用错误密码登录该账户。

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

由于 `pg_default` 的 `FAILED_LOGIN_ATTEMPTS` 为 `1`，该用户在登录失败一次后账户即被锁定了。

接下来我们将用户的 Profile 设置为 `myprf`，然后测试相同的操作来观察结果，在测试之前需要先将用户解锁。如下所示：

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

结果显示，用户状态重新变为 `OPEN`，并且 profile 变为 myprf。`rollockdate` 仍然存在，这是符合预期的。接下来再次使用错误密码来登录，再观察返回结果。

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

如预期，用户账户状态又一次被锁定。

## 场景四：超级用户锁定或解锁用户账户

超级用户可以明确指定锁定或解锁用户账户，如下所示：

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

## 场景五：为普通用户开启 Profile

默认场景下，所有新建的普通用户默认不使用 Profile 功能。要使用 Profile，需要显式地指定，如下所示：

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

创建用户后，可以通过 `ALTER USER ENABLE/DISABLE PROFILE` 语句来修改是否使用 Profile。

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
