---
title: Manage Roles and Privileges
---

# Manage Roles and Privileges in Cloudberry Database

The Cloudberry Database authorization mechanism stores roles and privileges to access database objects in the database and is administered using SQL statements or command-line utilities.

Cloudberry Database manages database access privileges using *roles*. The concept of roles subsumes the concepts of *users* and *groups*. A role can be a database user, a group, or both. Roles can own database objects (for example, tables) and can assign privileges on those objects to other roles to control access to the objects. Roles can be members of other roles, thus a member role can inherit the object privileges of its parent role.

Every Cloudberry Database system contains a set of database roles (users and groups). Those roles are separate from the users and groups managed by the operating system on which the server runs. However, for convenience you may want to maintain a relationship between operating system user names and Cloudberry Database role names, since many of the client applications use the current operating system user name as the default.

In Cloudberry Database, users log in and connect through the coordinator instance, which then verifies their role and access privileges. The coordinator then issues commands to the segment instances behind the scenes as the currently logged-in role.

Roles are defined at the system level, meaning they are valid for all databases in the system.

In order to bootstrap the Cloudberry Database system, a freshly initialized system always contains one predefined *superuser* role (also referred to as the system user). This role will have the same name as the operating system user that initialized the Cloudberry Database system. Customarily, this role is named `gpadmin`. In order to create more roles you first have to connect as this initial role.

## Security best practices for roles and privileges

- **Secure the gpadmin system user.** Cloudberry Database requires a UNIX user ID to install and initialize the Cloudberry Database system. This system user is referred to as `gpadmin` in the Cloudberry Database documentation. This `gpadmin` user is the default database superuser in Cloudberry Database, as well as the file system owner of the Cloudberry Database installation and its underlying data files. This default administrator account is fundamental to the design of Cloudberry Database. The system cannot run without it, and there is no way to limit the access of this gpadmin user ID. Use roles to manage who has access to the database for specific purposes. You should only use the `gpadmin` account for system maintenance tasks such as expansion and upgrade. Anyone who logs on to a Cloudberry Database host as this user ID can read, alter or delete any data, including system catalog data and database access rights. Therefore, it is very important to secure the gpadmin user ID and only provide access to essential system administrators. Administrators should only log in to Cloudberry Database as `gpadmin` when performing certain system maintenance tasks (such as upgrade or expansion). Database users should never log on as `gpadmin`, and ETL or production workloads should never run as `gpadmin`.
- **Assign a distinct role to each user that logs in.** For logging and auditing purposes, each user that is allowed to log in to Cloudberry Database should be given their own database role. For applications or web services, consider creating a distinct role for each application or service. See [Create New Roles (Users)](#create-new-roles-users).
- **Use groups to manage access privileges.** See [Role membership](#role-membership).
- **Limit users who have the SUPERUSER role attribute.** Roles that are superusers bypass all access privilege checks in Cloudberry Database, as well as resource queuing. Only system administrators should be given superuser rights. See [Altering Role Attributes](#alter-role-attributes).

## Create new roles (users)

A user-level role is considered to be a database role that can log in to the database and initiate a database session. Therefore, when you create a new user-level role using the `CREATE ROLE` command, you must specify the `LOGIN` privilege. For example:

```sql
=# CREATE ROLE jsmith WITH LOGIN;
```

A database role may have a number of attributes that define what sort of tasks that role can perform in the database. You can set these attributes when you create the role, or later using the `ALTER ROLE` command.

### Alter role attributes

A database role might have a number of attributes that define what sort of tasks that role can perform in the database.

|Attributes|Description|
|----------|-----------|
|`SUPERUSER` or `NOSUPERUSER`|Determines if the role is a superuser. You must yourself be a superuser to create a new superuser. `NOSUPERUSER` is the default.|
|`CREATEDB` or `NOCREATEDB`|Determines if the role is allowed to create databases. `NOCREATEDB` is the default.|
|`CREATEROLE` or `NOCREATEROLE`|Determines if the role is allowed to create and manage other roles. `NOCREATEROLE` is the default.|
|`INHERIT` or `NOINHERIT`|Determines whether a role inherits the privileges of roles it is a member. A role with the `INHERIT` attribute can automatically use whatever database privileges have been granted to all roles it is directly or indirectly a member of. `INHERIT` is the default. |
|`LOGIN` or `NOLOGIN`|Determines whether a role is allowed to log in. A role having the `LOGIN` attribute can be thought of as a user. Roles without this attribute are useful for managing database privileges (groups). `NOLOGIN` is the default.|
|`CONNECTION LIMIT *connlimit*`|If role can log in, this specifies how many concurrent connections the role can make. -1 (the default) means no limit.|
|`CREATEEXTTABLE` or `NOCREATEEXTTABLE`|Determines whether a role is allowed to create external tables. `NOCREATEEXTTABLE` is the default. For a role with the `CREATEEXTTABLE` attribute, the default external table `type` is `readable` and the default `protocol` is `gpfdist`. Note that external tables that use the `file` protocol can only be created by superusers.|
|`PASSWORD '*password*'`|Sets the role's password. If you do not plan to use password authentication you can omit this option. If no password is specified, the password will be set to null and password authentication will always fail for that user. A null password can optionally be written explicitly as `PASSWORD NULL`.|
|`DENY deny_interval` or `DENY deny_point` | Restricts access during an interval, specified by day or day and time. For more information see [Time-based authentication](#time-based-authentication).|

You can set these attributes when you create the role, or later using the `ALTER ROLE` command. For example:

```sql
=# ALTER ROLE jsmith WITH PASSWORD 'passwd123';
=# ALTER ROLE jsmith LOGIN;
=# ALTER ROLE jsmith DENY DAY 'Sunday';
```

A role can also have role-specific defaults for many of the server configuration settings. For example, to set the default schema search path for a role:

```sql
=# ALTER ROLE admin SET search_path TO myschema, public;
```

## Role membership

It is frequently convenient to group users together to ease management of object privileges: that way, privileges can be granted to, or revoked from, a group as a whole. In Cloudberry Database, this is done by creating a role that represents the group, and then granting membership in the group role to individual user roles.

Use the `CREATE ROLE` SQL command to create a new group role. For example:

```sql
=# CREATE ROLE admin CREATEROLE CREATEDB;
```

Once the group role exists, you can add and remove members (user roles) using the `GRANT` and `REVOKE` commands. For example:

```sql
=# GRANT admin TO john, sally;
=# REVOKE admin FROM bob;
```

For managing object privileges, you would then grant the appropriate privileges to the group-level role only (see [Managing object privileges](#manage-object-privileges)). The member user roles then inherit the object privileges of the group role. For example:

```sql
=# GRANT ALL ON TABLE mytable TO admin;
=# GRANT ALL ON SCHEMA myschema TO admin;
=# GRANT ALL ON DATABASE mydb TO admin;
```

The role attributes `LOGIN`, `SUPERUSER`, `CREATEDB`, `CREATEROLE`, `CREATEEXTTABLE`, and `RESOURCE QUEUE` are never inherited as ordinary privileges on database objects are. User members must actually `SET ROLE` to a specific role having one of these attributes in order to make use of the attribute. In the above example, we gave `CREATEDB` and `CREATEROLE` to the `admin` role. If `sally` is a member of `admin`, then `sally` could issue the following command to assume the role attributes of the parent role:

```sql
=> SET ROLE admin;
```

## Manage object privileges

When an object (table, view, sequence, database, function, language, schema, or tablespace) is created, it is assigned an owner. The owner is normally the role that ran the creation statement. For most kinds of objects, the initial state is that only the owner (or a superuser) can do anything with the object. To allow other roles to use it, privileges must be granted. Cloudberry Database supports the following privileges for each object type:

| Object Type                  |  privileges                                                                           |
| :-----------------------------| :--------------------------------------------------------------------------------------|
| Tables, External Tables, Views | `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `REFERENCES`, `TRIGGER`, `TRUNCATE`, `ALL`   |
| Columns                       | `SELECT`, `INSERT`, `UPDATE`, `REFERENCES`, `ALL`                                    |
| Sequences                     | `USAGE`, `SELECT`, `UPDATE`, `ALL`                                                   |
| Databases                     | `CREATE`, `CONNECT`, `TEMPORARY`, `TEMP`, `ALL`                                      |
| Domains                       | `USAGE`, `ALL`                                                                       |
| Foreign Data Wrappers         | `USAGE`, `ALL`                                                                       |
| Foreign Servers               | `USAGE`, `ALL`                                                                       |
| Functions                     | `EXECUTE`, `ALL`                                                                     |
| Procedural Languages          | `USAGE`, `ALL`                                                                       |
| Schemas                       | `CREATE`, `USAGE`, `ALL`                                                             |
| Tablespaces                   | `CREATE`, `ALL`                                                                      |
| Types                         | `USAGE`, `ALL`                                                                       |
| Protocols                     | `SELECT`, `INSERT`, `ALL`                                                            |

:::info
You must grant privileges for each object individually. For example, granting `ALL` on a database does not grant full access to the objects within that database. It only grants all of the database-level privileges (`CONNECT`, `CREATE`, `TEMPORARY`) to the database itself.
:::

Use the `GRANT` SQL command to give a specified role privileges on an object. For example, to grant the role named `jsmith` insert privileges on the table named `mytable`:

```sql
=# GRANT INSERT ON mytable TO jsmith;
```

Similarly, to grant `jsmith` select privileges only to the column named `col1` in the table named `table2`:

```sql
=# GRANT SELECT (col1) on TABLE table2 TO jsmith;
```

To revoke privileges, use the `REVOKE` command. For example:

```sql
=# REVOKE ALL PRIVILEGES ON mytable FROM jsmith;
```

You can also use the `DROP OWNED` and `REASSIGN OWNED` commands for managing objects owned by deprecated roles (Note: only an object's owner or a superuser can drop an object or reassign ownership). For example:

```sql
=# REASSIGN OWNED BY sally TO bob;
=# DROP OWNED BY visitor;
```

## Encrypt data

Cloudberry Database is installed with an optional module of encryption/decryption functions called `pgcrypto`. The `pgcrypto` functions allow database administrators to store certain columns of data in encrypted form. This adds an extra layer of protection for sensitive data, as data stored in Cloudberry Database in encrypted form cannot be read by anyone who does not have the encryption key, nor can it be read directly from the disks.

:::info
The `pgcrypto` functions run inside the database server, which means that all the data and passwords move between `pgcrypto` and the client application in clear-text.
:::

To use `pgcrypto` functions, register the `pgcrypto` extension in each database in which you want to use the functions. For example:

```shell
psql -d testdb -c "CREATE EXTENSION pgcrypto"
```

See [pgcrypto](https://www.postgresql.org/docs/12/pgcrypto.html) in the PostgreSQL documentation for more information about individual functions.
