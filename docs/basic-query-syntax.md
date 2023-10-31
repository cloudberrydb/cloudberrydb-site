---
title: Basic Query Syntax
---

# Basic Queries of Cloudberry Database

This document introduce the basic queries of Cloudberry Database.

Cloudberry Database is a high-performance, highly parallel data warehouse developed based on PostgreSQL and Greenplum. Here are some examples of the basic query syntax.

- `SELECT`: Used to retrieve data from databases & tables.

    ```sql
    SELECT * FROM employees;  -- Queries all data in the employees table.
    ```

- Conditional query (`WHERE`): Used to filter result sets based on certain conditions.

    ```sql
    SELECT * FROM employees WHERE salary > 50000;  -- Queries employee information with salary exceeding 50,000.
    ```

- `ORDER BY`: Used to sort query results by one or more columns.

    ```sql
    SELECT * FROM employees ORDER BY salary DESC;  -- Sorts employee information in descending order by salary.
    ```

- Aggregation functions: such as `COUNT`, `SUM`, `AVG`, `MAX`, `MIN`, used for calculating statistics from datasets.

    ```sql
    SELECT AVG(salary) FROM employees;  -- Calculates the average salary of employees.
    ```

- `GROUP BY`: Used in conjunction with aggregation functions to group result sets.

    ```sql
    SELECT department, COUNT(*) FROM employees GROUP BY department;  -- Counts the number of employees by department.
    ```

- Limit the number of results (`LIMIT`): used to limit the number of rows returned by the query result.

    ```sql
    SELECT * FROM employees LIMIT 10;  -- Only queries the information of the first 10 employees.
    ```

- Join query (`JOIN`): used to combine data from two or more tables based on related columns.

    ```sql
    SELECT employees.name, departments.name 
    FROM employees 
    JOIN departments ON employees.department_id = departments.id;  -- Queries employees and their corresponding department names.
    ```

- Subquery: Nested queries in another SQL query.

    ```sql
    SELECT name FROM employees 
    WHERE department_id IN (SELECT id FROM departments WHERE location = 'New York');  -- Queries all employees working in New York.
    ```

The above is just a brief overview of the basic query syntax in Cloudberry Database. Cloudberry Database also provides more advanced queries and functions to help developers perform complex data operations and analyses.

## See also

- [Insert, Update, and Delete Rows](/docs/insert-update-delete-rows.md)
