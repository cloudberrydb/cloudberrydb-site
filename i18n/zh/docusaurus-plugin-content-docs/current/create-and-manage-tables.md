---
title: 在 Cloudberry Database 中创建和管理表
---

# 在 Cloudberry Database 中创建和管理表

Cloudberry Database 表类似于关系数据库中的表，只是表的行分布在系统中的不同 Segment 中。创建表时，需要指定表的分布策略。

## 创建表格

使用 `CREATE TABLE` 命令创建表并定义其结构，创建表时会定义：

- 表的列及其关联的数据类型。请参阅[选择列数据类型](https://cloudberrydb.io/docs/create-and-manage-tables#choose-column-data-types)。
- 用于限制列或表的约束。请参阅[设置表和列约束](https://cloudberrydb.io/docs/create-and-manage-tables#set-table-and-column-constraints)。
- 表的分布策略，用于定义 Segment 之间划分数据的依据。请[参阅选择表的分布策略](https://cloudberrydb.io/docs/create-and-manage-tables#choose-column-data-types)。
- 表在磁盘上的存储方式。
- 大表的表分区策略。

### 选择列数据类型

列的数据类型决定了该列可以包含的数据类型。选择占用空间小，并能约束数据的最佳数据类型。例如，字符串使用字符类型，日期使用日期或时间戳类型，数字使用数字类型。

对于包含文本数据的表列，建议指定数据类型 `VARCHAR` 或 `TEXT`。不建议指定数据类型 `CHAR`。在 Cloudberry Database 中，数据类型 `VARCHAR` 或 `TEXT` 可以将添加到数据中的填充（即在最后一个非空格字符之后添加的空格字符）视为重要字符，而数据类型 `CHAR` 则不会。

使用能够容纳你的数值数据并允许未来扩展的最小数值数据类型。例如，对适合 `INT` 或 `SMALLINT` 的数据使用 `BIGINT` 会浪费存储空间。如果预计数据值会随时间扩展，请考虑在加载大量数据后从较小的数据类型更改为较大的数据类型的成本是昂贵的。例如，如果当前的数据值适合 `SMALLINT`，但很可能会扩展，则 `INT` 是更好的长期选择。

对跨表连接中的列，请使用相同的数据类型。跨表连接通常使用一张表中的主键和另一张表中的外键。当数据类型不同时，数据库必须转换其中之一，以便可以正确比较数据值，这将增加不必要的开销。

### 设置表和列约束

设置表和列的约束，可以限制表中的数据。Cloudberry Database 对约束的支持与 PostgreSQL 相同，但有一些限制，包括：

- `CHECK` 约束只能引用其定义的表。
- `UNIQUE` 和 `PRIMARY KEY` 约束必须与其表的分布键和分区键（如果有）兼容。

    :::info
    不允许在附加优化表上使用 `UNIQUE` 和 `PRIMARY KEY` 约束，因为这些约束创建的 `UNIQUE` 索引不允许在附加优化表上使用。
    :::

- `FOREIGN KEY` 约束是允许的，但不会强制执行。
- 在分区表上定义的约束适用于整个分区表。不能在表的各个部分上定义约束。

#### 检查约束

检查约束允许指定某个列中的值必须满足布尔（真值）表达式。例如，要求产品价格为正：

```sql
=> CREATE TABLE products 
            ( product_no integer, 
              name text, 
              price numeric CHECK (price > 0) );
```

#### 非空约束

非空约束指定某个列不能采用空值。非空约束始终写成列约束的形式。例如：

```sql
=> CREATE TABLE products 
       ( product_no integer NOT NULL,
         name text NOT NULL,
         price numeric );
```

#### 唯一约束

唯一约束可确保某列或一组列中包含的数据相对于表中的所有行是唯一的。表必须是哈希分布的或复制的（而不是随机分布的）。如果表是哈希分布的，则约束列必须与表的分布键列相同或是其子集。例如：

```sql
=> CREATE TABLE products 
       ( product_no integer `UNIQUE`, 
         name text, 
         price numeric)
      DISTRIBUTED BY (product_no);
```

#### 主键

主键约束是 `UNIQUE` 约束和 `NOT NULL` 约束的组合。表必须是哈希分布的（而不是随机分布的），而主键列必须与表的分布键列相同或是其子集）。如果表有主键，则该列（或列组）默认为表的分布键。例如：

```sql
=> CREATE TABLE products 
       ( `product_no` integer `PRIMARY KEY`, 
         name text, 
         price numeric)
`      DISTRIBUTED BY (``product_no``)`;
```

#### 外键

不支持外键。虽然可以声明外键，但不会强制执行参照完整性。

外键约束指定某列或一组列中的值必须与另一张表的某一行中的值匹配，以保持两个相关表之间的参照完整性。在 Cloudberry Database 的分布表 Segment 之间，无法强制执行参照完整性检查。

#### 排除约束

排除约束确保如果使用指定的运算符在指定的列或表达式上比较任意两行，至少其中一个运算符比较将返回 false 或 null。语法为：

```sql
CREATE TABLE circles (
    c circle,
    EXCLUDE USING gist (c WITH &&)
) DISTRIBUTED REPLICATED;
```

与唯一约束类似，排除约束仅适用于复制的表或当分布键列是约束的一部分，使用与分布键的哈希运算符类似的 `=` 运算符。

排除约束不支持分区表。

请参阅[创建表…约束…排除](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/sql-stmt-create-table.md)以获取详细信息。

添加排除约束会自动创建约束声明中指定的类型的索引。
