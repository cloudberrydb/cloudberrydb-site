---
title: 插入、更新和删除行数据
---

# 插入、更新和删除行数据

本文介绍如何在 Cloudberry Database 中操作行数据，包括：

- [插入行](#插入行)
- [更新现有行](#更新现有行)
- [删除行](#删除行)
- [清空表](#清空表)
- [清空数据库](#清空数据库)

## 插入行

`INSERT` 语句用于往表中插入行。使用此命令需要输入表名以及要插入的每个列值。你可以用任意顺序指定列名。如果不指定列名，请按表中列的顺序列出要插入的数据值，并用逗号分隔。

例如，指定列名和要插入的值：

```sql
INSERT INTO products (name, price, product_no) VALUES ('Cheese', 9.99, 1);
```

仅指定要插入的值：

```sql
INSERT INTO products VALUES (1, 'Cheese', 9.99);
```

通常，数据值是常量，但也可以使用标量表达式。例如：

```sql
INSERT INTO films SELECT * FROM tmp_films WHERE date_prod <
'2016-05-07';
```

可以在单条命令中插入多行。例如：

```sql
INSERT INTO products (product_no, name, price) VALUES
    (1, 'Cheese', 9.99),
    (2, 'Bread', 1.99),
    (3, 'Milk', 2.99);
```

### 往分区表中插入行

要将数据插入分区表，你需要指定根分区表，该根分区表是通过 `CREATE TABLE` 命令创建的。Cloudberry Database 不支持在 `INSERT` 命令中直接指定叶分区，这样会导致报错。这是因为数据插入是由数据库系统自动管理的，所以叶分区对用户不可见。

如果插入的数据不符合任何现有分区的范围（例如，指定的键值与任何分区规则都不匹配），将返回错误。

要确保数据正确地插入分区表，只需要在 `INSERT` 语句中指定根分区表。Cloudberry Database 根据分区键自动将数据行插入正确的叶分区。如果数据行不符合任何叶分区的范围，Cloudberry Database 将返回错误。

示例：

```sql
_-- 将数据插入根分区表_
INSERT INTO sales (sale_id, product_no, year, amount) VALUES (1, 'Cheese', 2021, 9.99);
```

对于上述语句，Cloudberry Database 根据年份列的值自动将数据行插入正确的分区，因此不需要在语句中指定叶分区。

### 在 Append-Optimized 表中插入行

要插入大量数据到 Append-Optimized (AO) 表，请使用外部表或 `COPY` 命令，它们比 `INSERT` 更高效。

Cloudberry Database 中 AO 表的存储设计，是为了高效地加载批量数据，不适合单条 `INSERT` 插入行数据。如果要将大量数据插入 AO 表，建议使用批处理加载方法，例如 `COPY` 命令。Cloudberry Database 支持在 AO 表上执行多个并发的 `INSERT` 事务，但此功能通常用于批量插入而不是单行插入。

## 更新现有行

`UPDATE` 命令用于更新表中的行。使用该命令，你可以更新所有行、所有行的子集或单行，也可以单独更新每列而不影响其他列。

要执行更新操作，你需要指定：

- 待更新的表名和列名。
- 列的新值。
- 待更新行的条件。

例如，以下命令将价格为 5 的所有产品更新至价格为 10：

```sql
UPDATE products SET price = 10 WHERE price = 5;
```

## 删除行

`DELETE` 命令用于删除表中的行。通过指定 `WHERE` 子句，即可删除符合特定条件的行。如果不指定 `WHERE` 子句，则将删除表中的所有行，结果是一个有效但为空的表。例如，要从产品表中删除价格为 10 的所有行：

```sql
DELETE FROM products WHERE price = 10;
```

删除产品表中的所有行：

```sql
DELETE FROM products;
```

## 清空表

`TRUNCATE` 命令用于快速删除表中的所有行。例如：

```sql
TRUNCATE mytable;
```

该命令将一次性清空表中的所有行。注意，在 Cloudberry Database 中，即使不用 `CASCADE` 选项，`TRUNCATE` 命令也会默认影响继承的子表。此外，由于 Cloudberry Database 不支持外键约束，`TRUNCATE` 命令不会触发任何 `ON DELETE` 操作或重写规则。该命令仅清空指定表中的行。

## 清空数据库

被删除或更新后的数据行仍会占用磁盘上的物理空间。你可以定期执行 `VACUUM` 命令来删除这些已过期的行。例如：

```sql
VACUUM mytable;
```

`VACUUM` 命令可以用于收集表级别的统计信息，例如行数和页数。在加载数据后，对所有表（包括 AO 表）进行 `VACUUM` 操作。

在 Cloudberry Database 中维护数据时，特别是频繁执行更新和删除操作时，需要使用 `VACUUM`、`VACUUM FULL` 和 `VACUUM ANALYZE` 命令。

## 另见

- [处理事务](/i18n/zh/docusaurus-plugin-content-docs/current/work-with-transactions.md)
- [事务并发控制](/i18n/zh/docusaurus-plugin-content-docs/current/transactional-concurrency-control.md)
