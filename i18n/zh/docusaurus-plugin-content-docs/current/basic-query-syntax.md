---
title: 基本查询语法
---

# 基本查询语法

本文档介绍了 Cloudberry Database 的基本查询。

Cloudberry Database 是基于 PostgreSQL 和 Greenplum 开发的高性能、高并行的数据仓库。以下是一些基本查询语法的示例。

- `SELECT`：用于从数据库和表中检索数据。

    ```sql
    SELECT * FROM employees;  -- 查询 employees 表中的所有数据。
    ```

- 条件查询 (`WHERE`)：基于特定条件过滤结果集。

    ```sql
    SELECT * FROM employees WHERE salary > 50000;  -- 查询薪水超过 50,000 的员工信息。
    ```

- `ORDER BY`：用于按一个或多个列对查询结果进行排序。

    ```sql
    SELECT * FROM employees ORDER BY salary DESC;  -- 按薪水降序排列员工信息。
    ```

- 聚合函数：用于从数据集中计算统计信息，例如 `COUNT`、`SUM`、`AVG`、`MAX`、`MIN`。

    ```sql
    SELECT AVG(salary) FROM employees;  -- 计算员工的平均薪水。
    ```

- `GROUP BY`：与聚合函数一起使用，用于指定分组聚合的列信息。

    ```sql
    SELECT department, COUNT(*) FROM employees GROUP BY department;  -- 按部门统计员工数量。
    ```

- 限制结果数量 (`LIMIT`)：用于限制查询结果返回的行数。

    ```sql
    SELECT * FROM employees LIMIT 10;  -- 仅查询前 10 个员工的信息。
    ```

- 连接查询 (`JOIN`)：用于基于相关列将两个或多个表的数据组合在一起。

    ```sql
    SELECT employees.name, departments.name 
    FROM employees 
    JOIN departments ON employees.department_id = departments.id;  -- 查询员工及其对应的部门名称。
    ```

- 子查询：在另一个 SQL 查询中的嵌套查询。

    ```sql
    SELECT name FROM employees 
    WHERE department_id IN (SELECT id FROM departments WHERE location = 'New York');  -- 查询所有在纽约工作的员工。
    ```

以上只是 Cloudberry Database 基本查询语法的简要概述。Cloudberry Database 还提供更高级的查询和功能，帮助开发者执行复杂的数据操作和分析。
