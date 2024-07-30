---
title: 行级权限管理
toc_max_heading_level: 5
---

# 行级权限管理

行级安全策略 Row-level Security（简称 RLS）允许表的创建者定义行级安全策略，以控制不同用户对表中特定行的查看和操作。当用户尝试对表执行操作时，该策略会在任何操作之前被应用，并根据特定策略对数据进行缩减。

行级安全策略可针对特定命令创建，如 `SELECT`/ `INSERT`/ `UPDATE`/ `DELETE`，或针对所有命令（`ALL`）创建。行级安全策略还可以根据特定用户、用户组，或根据特定条件控制对表中特定行的访问权限。

## 行级安全策略的特点

- 默认情况下，表未设置行级安全策略。如果用户根据 SQL 

- 用户可使用 `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`命令对表启用行级安全策略。在启用该策略后，除表所有者外，其他用户将无法访问和修改表格。必须先设置相应的安全策略，其他用户才可访问和操作表里的行。

    :::note

    应用于整个表的操作（例如 `TRUNCATE` 和 `REFERENCES`）不受行安全的限制。

    :::

-   行级安全策略可以具体到命令、用户角色，或同时包括两者。一个策略可以应用于所有命令，或者只应用于 `SELECT`， `INSERT`， `UPDATE` 或`DELETE`之一。多个角色可以同时被赋予一个策略，常规的角色从属和继承关系也适用于行级安全策略。

-   超级用户和带有`BYPASSRLS`属性的角色不受行级安全策略约束。表的所有者通常不受该策略约束，但可通过 `ALTER TABLE ... FORCE ROW LEVEL SECURITY`对表所有者应用安全策略。

-   仅表所有者可启用、停用及添加行级安全策略。

## 启用并创建安全策略

表所有者须先为一个表启用行级安全策略，再创建具体的策略。

**第一步：** 启用行级安全策略

表所有者须先使用一下命令启用行级安全策略：

    ```
    ALTER TABLE <talbe_name> ENABLE ROW LEVEL SECURITY;
    ```
    
**第二步：** 创建策略

启用行级安全策略后，可通过 `CREATE POLICY`创建策略。行级安全策略须在`USING`或`WITH CHECK`子句中提供一个表达式，该表达返回的布尔值决定了哪些行可被返回。该表达式会在用户查询的所有条件和函数被执行前被逐行评估。表达式未返回 `true`的行将不会被处理。

可以指定单独的表达式来提供对可见行和允许修改行的独立控制。策略表达式作为查询的一部分运行，并具有运行查询用户的相应权限。用户也可以使用 Security-definer 函数来访问用户不可用的数据。

参考以下句法创建行级安全策略：

    ```
    CREATE POLICY <name> ON <table_name>
        [ AS { PERMISSIVE | RESTRICTIVE } ]
        [ FOR { ALL | SELECT | INSERT | UPDATE | DELETE } ]
        [ TO { <role_name> | PUBLIC | CURRENT_USER | SESSION_USER } [, ...] ]
        [ USING ( <using_expression> ) ]
        [ WITH CHECK ( <check_expression> ) ]
    ```

具体用法参见以下参数说明：

- `name`: 策略名称

- `table_name`: 应用该策略的表名

- `PERMISSIVE`：指定该策略将被创建为宽松策略。适用于给定查询的所有宽松策略将使用 `OR` 运算符组合在一起。通过创建宽松的策略，管理员可以添加可访问的记录集。默认情况下，政策是宽松的。

- `RESTRICTIVE`：指定该策略将被创建为限制性策略。适用于给定查询的所有限制性策略将使用 `AND` 运算符组合在一起。通过创建限制性策略，管理员可以减少可访问的记录集，因为每条记录都必须传递所有限制性策略。

- 命令 (`ALL`, `SELECT`, `INSERT`, `UPDATE`, `DELETE`): 策略适用的命令。

- 角色名：策略应用的角色，默认为 `PUBLIC`，即该策略会应用于所有角色。

- `using_expression` : 任意 SQL 条件表达式（返回值为布尔值）。条件表达式不能包含任何聚合函数或窗口函数。如果启用了行级安全性，则此表达式将添加到引用该表的查询中。表达式返回 `true` 的行将可见。表达式返回 `false` 或 `null` 的任何行对于用户（在 `SELECT` 命令中）将不可见，并且不可进行修改（ `UPDATE` 或 `DELETE` ）。不可见或不可修改行将不被返回，且不会提示错误。

- `check_expression`：任意 SQL 条件表达式（返回布尔值）。条件表达式不能包含任何聚合函数或窗口函数。如果启用了行级安全性，则该表达式将用于针对表的 `INSERT` 和 `UPDATE` 操作。仅允许表达式计算结果为 `true` 的行。如果插入的任何记录或更新产生的任何记录的表达式计算结果为 `false` 或 `null`，则会提示错误。

    :::note

    注意：`check_expression` 根据命令建议的新内容，而非原始内容进行评估。

    :::

## 示例：创建行级安全策略

以下示例对表设置了行级访问安全策略，该策略仅允许`(department = current_setting('myapp.current_department'))`为`true`的行被返回。

1. 以管理员身份访问数据库：`psql -h <host_ip> -p <port> -U <user_name> -d <db_name>`
2. 创建表并插入数据：

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
3. 启用行级安全策略：`ALTER TABLE projects ENABLE ROW LEVEL SECURITY;`
4. 创建行级安全策略：

    ```
    CREATE POLICY department_policy
    ON projects
    FOR SELECT
    USING (department = current_setting('myapp.current_department'));
    ```
    该策略仅返回`(department = current_setting('myapp.current_department'))`为 `true`的行。
5. 创建测试用户：
    ```
    CREATE USER zhangsan WITH PASSWORD '<password>';
    CREATE USER lisi WITH PASSWORD '<password>';
    CREATE USER wangwu WITH PASSWORD '<password>';
    ```
6. 向测试用户赋予查询 `projects`表的权限：`GRANT SELECT ON projects TO zhangsan;`
7. 切换至测试用户并定义当前会话中变量 `myapp.current_department`的值：

    ```
    SET ROLE zhangsan;
    SET myapp.current_department = 'Engineering';
    ```
8. 以当前用户查询 projects 表：`SELECT * FROM projects;`。因`myapp.current_department`值为 `engineering`，故期待如下返回数据：

    ```
    project_id | project_name  | project_manager | department
    ------------+---------------+-----------------+-------------
            1 | Project Alpha | zhangsan           | Engineering
    ```