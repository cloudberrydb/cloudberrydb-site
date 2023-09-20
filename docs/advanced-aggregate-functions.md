---
title: Advanced Aggregate Functions
---

# Advanced Aggregate Functions in Cloudberry Database

The following built-in advanced analytic functions are Cloudberry extensions of the PostgreSQL database. Analytic functions are *immutable*.

> **Note** The Cloudberry MADlib Extension for Analytics provides additional advanced functions to perform statistical analysis and machine learning with Cloudberry Database data.

| Function | Return Type | Full Syntax | Description |
|----------|-------------|-------------|-------------|
| `MEDIAN (expr)` | `timestamp, timestamptz, interval, float` | `MEDIAN (expression)` [^1] | Can take a two-dimensional array as input. Treats such arrays as matrices. |
| `PERCENTILE_CONT (expr) WITHIN GROUP (ORDER BY expr [DESC/ASC])` | `timestamp, timestamptz, interval, float` | `PERCENTILE_CONT(percentage) WITHIN GROUP (ORDER BY expression)` [^2] | Performs an inverse distribution function that assumes a continuous distribution model. It takes a percentile value and a sort specification and returns the same datatype as the numeric datatype of the argument. This returned value is a computed result after performing linear interpolation. Null are ignored in this calculation. |
| `PERCENTILE_DISC (expr) WITHIN GROUP (ORDER BY expr [DESC/ASC])` | `timestamp, timestamptz, interval, float` | `PERCENTILE_DISC(percentage) WITHIN GROUP (ORDER BY expression)` [^3] | Performs an inverse distribution function that assumes a discrete distribution model. It takes a percentile value and a sort specification. This returned value is an element from the set. Null are ignored in this calculation. |
| `sum(array[])` | `smallint[]int[], bigint[], float[]` | `sum(array[[1,2],[3,4]])` [^4] | Performs matrix summation. Can take as input a two-dimensional array that is treated as a matrix. |
| `pivot_sum (label[], label, expr)` | `int[], bigint[], float[]` | `pivot_sum( array['A1','A2'], attr, value)` | A pivot aggregation using sum to resolve duplicate entries. |
| `unnest (array[])` | set of `anyelement` | `unnest( array['one', 'row', 'per', 'item'])` | Transforms a one-dimensional array into rows. Returns a set of `anyelement`, a polymorphic [pseudotype in PostgreSQL](https://www.postgresql.org/docs/12/datatype-pseudo.html). |

[^1]:

    ```sql
    SELECT department_id, MEDIAN(salary) 
    FROM employees 
    GROUP BY department_id;
    ```

[^2]:

    ```sql
    SELECT department_id,
    PERCENTILE_CONT (0.5) WITHIN GROUP (ORDER BY salary DESC)
    "Median_cont"; 
    FROM employees GROUP BY department_id;
    ```

[^3]:

    ```sql
    SELECT department_id, 
    PERCENTILE_DISC (0.5) WITHIN GROUP (ORDER BY salary DESC)
    "Median_desc"; 
    FROM employees GROUP BY department_id;
    ```

[^4]:

    ```sql
    CREATE TABLE mymatrix (myvalue int[]);
    INSERT INTO mymatrix VALUES (array[[1,2],[3,4]]);
    INSERT INTO mymatrix VALUES (array[[0,1],[1,0]]);
    SELECT sum(myvalue) FROM mymatrix;
    sum 
    ---------------
    {{1,3},{4,4}}
    ```
