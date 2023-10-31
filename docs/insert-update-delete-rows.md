---
title: Insert, Update, and Delete Rows
---

# Insert, Update, and Delete Row Data in Cloudberry Database

This document introduces how to manipulate row data in Cloudberry Database, including:

- [Inserting rows](#insert-rows)
- [Updating existing rows](#update-existing-rows)
- [Deleting rows](#delete-rows)
- [Truncating a table](#truncate-a-table)
- [Vacuuming the database](#vacuum-the-database)

## Insert rows

Use the `INSERT` command to create rows in a table. This command requires the table name and a value for each column in the table; you might optionally specify the column names in any order. If you do not specify column names, list the data values in the order of the columns in the table, separated by commas.

For example, to specify the column names and the values to insert:
insert
```sql
INSERT INTO products (name, price, product_no) VALUES ('Cheese', 9.99, 1);
```

To specify only the values to insert:

```sql
INSERT INTO products VALUES (1, 'Cheese', 9.99);
```

Usually, the data values are literals (constants), but you can also use scalar expressions. For example:

```sql
INSERT INTO films SELECT * FROM tmp_films WHERE date_prod < 
'2016-05-07';
```

You can insert multiple rows in a single command. For example:

```sql
INSERT INTO products (product_no, name, price) VALUES
    (1, 'Cheese', 9.99),
    (2, 'Bread', 1.99),
    (3, 'Milk', 2.99);
```

### Insert rows into partitioned tables

To insert data into a partitioned table, you are expected to specify the root partitioned table that was created with the `CREATE TABLE` command. Directly specifying a leaf partition in an `INSERT` command is not supported, and attempting to do so will cause an error, because leaf partitions are invisible to users and data insertion is managed automatically by the database system.

An error will be returned if the data being inserted does not fit the range of any existing partitions (for example, the specified key value does not match any partition rules).

To ensure data is correctly inserted into a partitioned table, you only need to specify the root partitioned table in your `INSERT` statement. The database system will automatically insert the data row into the appropriate leaf partition based on the partition key. If a data row does not conform to the range of any leaf partition, the database will return an error.

Example:

```sql
-- Inserting data into the root partitioned table
INSERT INTO sales (sale_id, product_no, year, amount) VALUES (1, 'Cheese', 2021, 9.99);
```

The above statement will automatically insert the data row into the correct partition based on the value of the year column. You should not, and need not, attempt to directly specify any leaf partition for data insertion.

### Insert rows into append-optimized tables

To insert large amounts of data, use external tables or the `COPY` command. These load mechanisms are more efficient than `INSERT` for inserting many rows.

The storage model of append-optimized tables in Cloudberry Database is designed for efficient bulk data loading rather than single row `INSERT` statements. For high-volume data insertions, it is recommended to use batch loading methods such as the `COPY` command. Cloudberry Database can support multiple concurrent `INSERT` transactions on append-optimized tables; however, this capability is typically intended for batch insertions rather than single-row operations.

## Update existing rows

The `UPDATE` command updates rows in a table. You can update all rows, a subset of all rows, or individual rows in a table. You can update each column separately without affecting other columns.

To perform an update, you need:

- The name of the table and columns to update.
- The new values of the columns.
- One or more conditions specifying the row or rows to be updated.

For example, the following command updates all products that have a price of *5* to have a price of *10*:

```sql
UPDATE products SET price = 10 WHERE price = 5;
```

## Delete rows

The `DELETE` command deletes rows from a table. Specify a `WHERE` clause to delete rows that match certain criteria. If you do not specify a `WHERE` clause, all rows in the table are deleted. The result is a valid, but empty, table. For example, to remove all rows from the products table that have a price of *10*:

```sql
DELETE FROM products WHERE price = 10;
```

To delete all rows from a table:

```sql
DELETE FROM products;
```

### Truncate a table

Use the `TRUNCATE` command to quickly remove all rows in a table. For example:

```sql
TRUNCATE mytable;
```

This command empties a table of all rows in one operation. Note that in Cloudberry Database, the `TRUNCATE` command will affect inherited child tables by default, even without using the `CASCADE` option. In addition, because Cloudberry Database does not support foreign key constraints, the `TRUNCATE` command will not trigger any `ON DELETE` actions or rewrite rules. The command truncates only rows in the named table.

## Vacuum the database

Deleted or updated data rows occupy physical space on disk even though new transactions cannot see them. Periodically running the `VACUUM` command removes these expired rows. For example:

```sql
VACUUM mytable;
```

The `VACUUM` command collects table-level statistics such as the number of rows and pages. Vacuum all tables after loading data, including append-optimized tables.

You need to use the `VACUUM`, `VACUUM FULL`, and `VACUUM ANALYZE` commands to maintain the data in a Cloudberry Database especially if updates and deletes are frequently performed on your database data.

## See also

- [Work with Transactions](/docs/work-with-transactions.md)
- [Transactional Concurrency Control](/docs/transactional-concurrency-control.md)
