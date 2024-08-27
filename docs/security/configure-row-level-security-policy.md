---
title: Configure Row-Level Security Policy
toc_max_heading_level: 5
---

# Configure Row-Level Security Policy

Row-level security (RLS) policy allows the table owner to define access policies that control users' access to specific rows of the table. When a user tries to query or update a table, the RLS policy will be applied first before any user command is executed to truncate the rows in the table.

Row-level security policies can be created for specific commands, such as `SELECT`/`INSERT`/`UPDATE`/`DELETE`, or for all commands (`ALL`). Row-level security policies can also control access to specific rows in a table based on certain users, user groups, or according to specific conditions.

## Row-Level Security Policy Overview

- By default, no row-level security policy is set for a table. If a user has access to the table according to the SQL permission system, all rows in the table can be queried or updated.

- Users can enable row-level security policies on a table using the `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` command. After the policy is enabled, no other users except the table owner will be able to access and modify the table. Appropriate security policies must be set before other users can access and manipulate rows within the table.

    :::note

    Operations that apply to the entire table (such as `TRUNCATE` and `REFERENCES`) are not restricted by row-level security.

    :::

- Row-level security policies can be specific to commands, user roles, or both. A policy can be applied to all commands, or just to `SELECT`, `INSERT`, `UPDATE`, or `DELETE` individually. Multiple roles can be granted the same policy, and the usual role hierarchy and inheritance rules also apply to row-level security policies.

- Superusers and roles with the `BYPASSRLS` attribute are not subject to row-level security policies. The table owner is typically not constrained by the policy, but row-level security can be enforced on the table owner by using `ALTER TABLE ... FORCE ROW LEVEL SECURITY`.

- Only the table owner can enable, disable, or add row-level security policies.

## Enable and create row-level security policy

The table owner must first enable row-level security policies for a table before creating specific policies.

**Step 1.** Enable row-level security policy

The table owner must first enable row-level security policy using the following command:

    ```
    ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;
    ```

**Step 2.** Create policy

After enabling row-level security policies, you can create policies with `CREATE POLICY`.

A RLS policy must provide an expression in the `USING` or `WITH CHECK` clause that returns a boolean value determining which rows can be returned. This expression is evaluated row-by-row before any conditions and functions in the user's query are executed. Rows for which the expression does not return `true` will not be processed.

You can specify separate expressions to provide independent control over which rows are visible and which can be modified. The policy expressions run as part of the query and have the permissions of the user running the query. Users can also use Security-definer functions to access data not available to the user.

Refer to the following syntax to create a row-level security policy:

    ```
    CREATE POLICY <name> ON <table_name>
        [ AS { PERMISSIVE | RESTRICTIVE } ]
        [ FOR { ALL | SELECT | INSERT | UPDATE | DELETE } ]
        [ TO { <role_name> | PUBLIC | CURRENT_USER | SESSION_USER } [, ...] ]
        [ USING ( <using_expression> ) ]
        [ WITH CHECK ( <check_expression> ) ]
    ```

See the following parameter descriptions for detailed usage:

- `name`: The name of the policy.

- `table_name`: The name of the table to which the policy applies.

- `PERMISSIVE`: Specifies that the policy will be created as a permissive policy. All permissive policies applicable to a given query will be combined using the `OR` operator. By creating permissive policies, administrators can add accessible record sets. By default, policies are permissive.

- `RESTRICTIVE`: Specifies that the policy will be created as a restrictive policy. All restrictive policies applicable to a given query will be combined using the `AND` operator. By creating restrictive policies, administrators can reduce the accessible record set, as each record must pass all restrictive policies.

- Commands (`ALL`, `SELECT`, `INSERT`, `UPDATE`, `DELETE`): The commands to which the policy applies.

- `role_name`: The roles to which the policy applies; the default is `PUBLIC`, meaning the policy will apply to all roles.

- `using_expression`: Any SQL conditional expression (returning a boolean value). The conditional expression cannot contain any aggregate functions or window functions. If row-level security is enabled, this expression will be added to queries that reference the table. Rows for which the expression returns `true` will be visible. Any rows for which the expression returns `false` or `null` will be invisible to the user (in `SELECT` commands) and cannot be modified (`UPDATE` or `DELETE`). Invisible or unmodifiable rows will not be returned and will not generate an error.

- `check_expression`: Any SQL conditional expression (returning a boolean value). The conditional expression cannot contain any aggregate functions or window functions. If row-level security is enabled, this expression will be used for `INSERT` and `UPDATE` operations on the table. Only rows for which the expression evaluates to `true` will be allowed. An error will be raised if any records inserted or resulting from an update evaluate to `false` or `null`.

    :::note

    `check_expression` is evaluated based on the proposed new content of the command, not the original content.

    :::

## Example of using row-level security policy

The following example sets up a row-level access security policy on a table that only allows rows to be returned where `(department = current_setting('myapp.current_department'))` is `true`.

1. Access the database as an administrator:

    ```
    psql -h <host_ip> -p <port> -U <user_name> -d <db_name>
    ```
2. Create a table and insert data:

    ```
    CREATE TABLE projects (
        project_id SERIAL PRIMARY KEY,
        project_name TEXT,
        project_manager TEXT,
        department TEXT
    );

    INSERT INTO projects (project_name, project_manager, department) VALUES
    ('Project Alpha', 'zhangsan', 'Engineering'),
    ('Project Beta', 'lisi', 'HR'),
    ('Project Gamma', 'wangwu', 'Sales');
    ```
3. Enable row-level security policy:

    ```
    ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
    ```
4.  Create the row-level security policy:

    ```
    CREATE POLICY department_policy
    ON projects
    FOR SELECTUSING (department = current_setting('myapp.current_department'));
    ```
    This policy will only return rows where `(department = current_setting('myapp.current_department'))` is `true`.
5. Create test users:

    ```
    CREATE USER zhangsan WITH PASSWORD '<password>';
    CREATE USER lisi WITH PASSWORD '<password>';
    CREATE USER wangwu WITH PASSWORD '<password>';
    ```
6. Grant the test users permission to query the `projects` table:

    ```
    GRANT SELECT ON projects TO zhangsan;
    ```
7. Switch to the test user and define the value of the variable `myapp.current_department` for the current session:

    ```
    SET ROLE zhangsan;
    SET myapp.current_department = 'Engineering';
    ```
8. Query the `projects` table as the current user:

    ```
    SELECT * FROM projects;
    ```

Because the value of `myapp.current_department` is set to `Engineering`, you would expect the following data to be returned:

    ```
    project_id | project_name | project_manager | department
    ------------+--------------+-----------------+------------
            1 | Project Alpha | zhangsan        | Engineering
    ```

Only the row related to the "Engineering" department will be visible to the user `zhangsan` because of the row-level security policy in place.