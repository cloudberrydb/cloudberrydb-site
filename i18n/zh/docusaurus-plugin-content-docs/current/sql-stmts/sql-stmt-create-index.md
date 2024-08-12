---
title: CREATE INDEX
---

# CREATE INDEX

定义一个新索引。

## 语法概要

```sql
CREATE [UNIQUE] INDEX [[IF NOT EXISTS] <name>] ON [ONLY] <table_name> [USING <method>]
       ( {<column_name> | (<expression>)} [COLLATE <collation>] [<opclass>] [ ASC | DESC ] [ NULLS { FIRST | LAST } ] [, ...] )
       [ INCLUDE ( column_name [, ...] ) ]
       [ WITH ( <storage_parameter> [= <value>] [, ... ] ) ]
       [ TABLESPACE <tablespace_name> ]
       [ WHERE <predicate> ]
```

## 描述

`CREATE INDEX` 在指定表或物化视图的指定列上构建索引。索引主要用于提高数据库性能（尽管使用不当可能导致性能下降）。

索引的关键字段可以指定为列名，或者作为括号中的表达式。如果索引方法支持多列索引，则可以指定多个字段。

索引字段可以是基于表行的一个或多个列值计算得出的表达式。这项功能能够让我们基于对原始数据的某种处理快速访问数据。例如，基于 `upper(col)` 计算得出的索引能使得查询子句 `WHERE upper(col) = 'JIM'` 利用索引进行快速检索。

Cloudberry Database 提供了 B-tree、hash、bitmap、GiST、SP-GiST、GIN 和 BRIN 索引方法。用户也可以定义自己的索引方法，但这相当复杂。

当语句中存在 `WHERE` 子句时，将创建一个部分索引。部分索引仅涵盖表中的部分条目，通常是指那些相较于表的其他部分，更适合进行索引的部分。例如，如果你有一个包含已开票和未开票订单的表，其中未开票订单占总表的一小部分，但是最常被选择，你可以通过只在这部分上创建索引来提高性能。另一个可能的应用是使用 `WHERE` 和 `UNIQUE` 来强制表的子集上的唯一性。更多信息请参见 PostgreSQL 文档中的 [部分索引](https://www.postgresql.org/docs/14/indexes-partial.html)。

`WHERE` 子句中的表达式只能涉及底层表的列，且能够使用所有列，不限于那些被索引的列。此外，`WHERE` 子句中不允许使用子查询和聚合表达式。对于作为表达式的索引字段，同样的限制条件也适用。

索引定义中所有的函数和操作符都需是不变的，其结果只能基于其参数，不能受任何外界因素（比如其他表的内容或当前时间）影响。这一限制保证了索引行为的明确性。若要在索引表达式或 `WHERE` 子句中使用自定义函数，请确保在创建时将其设为 `IMMUTABLE`。

## 参数

**`UNIQUE`**

当创建索引时（如果数据已存在）和每次添加数据时，检查表中是否存在重复值。重复的条目将会产生报错。唯一索引仅适用于 B-tree 索引。

当唯一索引应用于分区表时，会有额外的限制，请参见 [`CREATE TABLE`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/create-table.md)。

**`IF NOT EXISTS`**

如果同名的关系已经存在，则不报错。在这种情况下 Cloudberry Database 会发出一个提醒。请注意，不保证现有的索引与将要创建的索引相似。当指定了 `IF NOT EXISTS` 时，索引名是必需的。

**`INCLUDE`**

可选的 `INCLUDE` 子句指定了一个列的列表，这些列将作为非关键列包含在索引中。非关键列不能用于索引扫描搜索限定条件，并且在索引强制执行任何唯一性或排除约束时都会被忽略。不过，通过仅扫描索引 (index-only scan)，可以直接从索引条目获取非关键列的内容，无需访问表本身。因此，加入非关键列使得在原本无法应用仅扫描索引的查询中也能使用该技术。

在索引中添加非关键列时要保守，尤其是宽列。如果索引元组超过了索引类型允许的最大大小，数据插入将失败。无论如何，非关键列都会复制索引表中的数据，并使索引的大小膨胀，从而可能减慢搜索速度。

`INCLUDE` 子句中列出的列无需对应的操作符类，即可包含对于特定访问方法未定义操作符类的数据类型列。

由于表达式无法用于仅扫描索引，因此不支持将表达式作为包含列。

目前，B-tree 和 GiST 索引访问方法支持 `INCLUDE`。在 B-tree 和 GiST 索引中，列出在 `INCLUDE` 子句中的列的值包含在对应于堆元组的叶元组中，但不包含在用于树导航的上层索引条目中。

**`name`**

要创建的索引的名称。索引总是在与其父表相同的模式中创建。如果省略了名称，Cloudberry Database 将根据父表的名称和索引列的名称选择一个合适的名称。

**`ONLY`**

如果表是分区的，指定不要在分区上递归创建索引。默认情况下会递归。

**`table_name`**

要创建索引的表的名称（可选的模式限定）。

**`method`**

要使用的索引方法的名称。可选项有 `btree`、`bitmap`、`hash`、`gist`、`spgist`、`gin` 和 `brin`。默认方法是 `btree`。

GPORCA 仅支持 B-tree、bitmap、GiST、GIN 和 BRIN 索引。其他的索引方法 GPORCA 都不支持，用这些方法创建的索引会被忽略。

**`column_name`**

要在其上创建索引的列的名称。

**`expression`**

基于表的一个或多个列的表达式。通常，表达式必须用括号括起来，如语法中所示。但是，如果表达式具有函数调用的形式，则可以省略括号。

**`collation`**

索引所采用的排序规则名称。默认情况下，索引将采用被索引列的声明排序规则或被索引表达式的结果排序规则。对于那些包含非默认排序规则的表达式的查询，使用非默认排序规则的索引可能更为有效。

**`opclass`**

操作符类的名称。

**`ASC`**

指定为升序排序，这是默认设置。

**`DESC`**

指定为降序排序。

**`NULLS FIRST`**

指定空值在非空值之前排序。这是在指定 `DESC` 时的默认设置。

**`NULLS LAST`**

指定空值在非空值之后排序。这是在未指定 `DESC` 时的默认设置。

**`storage_parameter`**

特定于索引方法的存储参数名称。每一种索引方法都有其允许使用的存储参数集。详情请参见[索引存储参数](#索引存储参数)。

**`tablespace_name`**

要创建索引的表空间名称。如果未明确指定，则依据 default_tablespace 的设置，或对临时表上的索引，则参考 temp_tablespaces。

**`predicate`**

部分索引的约束表达式。

## 索引存储参数

可选的 `WITH` 子句指定了索引的*存储参数*。每种索引方法都有其允许使用的存储参数集。B-tree、bitmap、hash、GiST 和 SP-GiST 索引方法都接受这个参数：

**`fillfactor`**

索引的 `fillfactor` 是指定索引页填充密度的百分比。对于 B-tree 来说，其叶节点页面在初始建立索引时以及向索引的右侧（新增最大键值）扩展时，都会根据这一百分比进行填充。若页面后续被完全填满，则会进行分裂，这会逐步降低索引的效率。B-tree 默认的 `fillfactor` 是 `90`，但用户可以根据需要选择 `10` 到 `100` 之间的任何整数值。对于静态表，设置 `fillfactor` 为 `100` 可以最小化索引占用的物理空间；然而，对于更新频繁的表格，较低的 `fillfactor` 值有利于减少页面分裂的频率。其它索引方法虽然使用 `fillfactor` 的方式不同，但原理大致相似，不同方法的默认 `fillfactor` 值也各不相同。

B-tree 索引还接受这个参数：

**`vacuum_cleanup_index_scale_factor`**

`vacuum_cleanup_index_scale_factor` 的每个索引值。

GiST 索引还接受这个参数：

**`buffering`**

指定 Cloudberry Database 是否使用 PostgreSQL 文档中描述的 [GiST buffering build](https://www.postgresql.org/docs/14/gist-implementation.html) 技术来构建索引。`OFF` 表示不使用，`ON` 表示使用，`AUTO` 表示初始时不使用，但一旦索引大小达到 `effective_cache_size` 时就会在运行时启用。默认值是 `AUTO`。

GIN 索引还接受这个参数：

**`fastupdate`**

该设置控制了在 PostgreSQL 文档中描述的 [GIN Fast Update Technique](https://www.postgresql.org/docs/14/gin-implementation.html#GIN-FAST-UPDATE) 技术的使用。它是一个布尔参数，用于开启或关闭 GIN 索引的快速更新技术。`ON` 开启快速更新（默认值），`OFF` 停用快速更新。

:::info 注意
通过使用 `ALTER INDEX` 关闭 `fastupdate` 功能，可以阻止后续插入操作将新条目添加到待处理索引条目的列表中，但这一操作并不会自动清理已有的待处理条目。因此，你可能需要在此之后对表进行 `VACUUM` 操作或调用 `gin_clean_pending_list()` 函数，以确保待处理条目列表得到彻底清空。
:::

**`gin_pending_list_limit`**

自定义 `gin_pending_list_limit` 参数。参数值以千字节为单位。

BRIN 索引还接受这些参数：

**`pages_per_range`**

定义了每个 BRIN 索引条目的一个块范围所包含的表块数（详情请参见 PostgreSQL 文档中的 [BRIN 索引介绍](https://www.postgresql.org/docs/14/brin-intro.html)）。默认值是 `128`。

**`autosummarize`**

当在下一个页面范围内检测到插入操作时，此设置定义了是否自动为前一个页面范围安排一次汇总处理。详情请参见 PostgreSQL 文档中的 [BRIN 索引维护](https://www.postgresql.org/docs/14/brin-intro.html#BRIN-OPERATION)。默认值是 `off`。

## 注意事项

参考 PostgreSQL 文档中的 [索引](https://www.postgresql.org/docs/14/indexes.html) 文档，了解索引何时可以使用、何时不使用以及在哪些特定情况下索引可能有用。

目前，只有 B-tree、bitmap、GiST、GIN 和 BRIN 索引方法支持多列索引。默认情况下，你可以指定最多 32 个字段。目前只有 B-tree 支持唯一索引。

对于索引的每个列，都可以指定一个操作符类。操作符类标识了索引在该列上使用的操作符。例如，一个 4 字节整数的 B-tree 索引将使用 `int4_ops` 类；这个操作符类包括 4 字节整数的比较函数。实际操作中，列数据类型的默认操作符类通常已经足够使用。操作符类的关键意义在于，对某些数据类型而言，可能有多种有意义的排序方式。比如，对于复数数据类型，我们既可以基于绝对值排序，也可以依据实部排序。这可以通过定义两种不同的操作符类来实现，并在创建索引时选择适当的操作符类。详情请参见 PostgreSQL 文档中的[操作符类和操作符族](https://www.postgresql.org/docs/14/indexes-opclass.html)和[扩展与索引的接口](https://www.postgresql.org/docs/14/xindex.html)。

当在一个分区表上执行 `CREATE INDEX` 操作时，默认会对所有分区进行递归处理，确保每个分区都建立了相应的索引。系统首先会检查每个分区是否已存在等效的索引，若存在，这个索引就会被作为分区索引，附加到新创建的索引上，新索引则作为它的父索引。若不存在匹配的索引，则会新建一个索引并自动附加上去；新索引的命名会按照命令中未明确指定索引名的方式来决定。如果使用了 `ONLY` 选项，那么就不会进行递归处理，且该索引会被标记为无效。（当所有分区都建立了匹配的索引后，使用 `ALTER INDEX ... ATTACH PARTITION` 命令可以将索引标记为有效。）但是，值得注意的是，未来通过 `CREATE TABLE ... PARTITION OF` 或 `ALTER TABLE ... ADD PARTITION` 创建的任何分区，无论是否使用了 `ONLY` 选项，都会自动创建匹配的索引。

对于支持有序扫描的索引类型（目前仅限于 B-tree），您可以使用 `ASC`、`DESC`、`NULLS FIRST` 和/或 `NULLS LAST` 这些可选子句来调整索引的排序方式。鉴于有序索引既可以向前也可以向后扫描，通常没有必要创建单一列的 DESC 索引——这一排序方式已经可以通过常规索引实现。这些选项的实际价值在于，它们允许创建多列索引，以适应那些需要混合排序的查询需求，例如 `SELECT ... ORDER BY x ASC, y DESC`。如果您需要在依赖索引避免排序操作的查询中实现“空值优先排序”而不是默认的“空值末尾排序”，`NULLS` 选项将非常有用。

系统定期收集表的所有列的统计信息。新创建的非表达式索引可以立即使用这些统计信息来确定索引的有效性。对于新的表达式索引，你必须执行 [`ANALYZE`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/analyze.md) 来为这些索引生成统计信息。

对大部分索引方法来说，创建索引的速度依赖于 `maintenance_work_mem` 的配置。增加这个值可以缩短创建索引的时间，但前提是不要设置得超过机器实际可用的内存容量，以免引起系统交换（Swapping）。

对于具有 100 到 100,000 个不同值的列，`bitmap` 索引的性能最佳。对于具有超过 100,000 个不同值的列，`bitmap` 索引的性能和空间效率会下降。`bitmap` 索引的大小与表中的行数乘以索引列中的不同值数量成正比。

要删除一条索引，请使用 [`DROP INDEX`](/sql-stmts/drop-index.md)。

与任何长时间运行的事务一样，对表执行 `CREATE INDEX` 可能会影响并发 `VACUUM` 对其他表的清理效果。

## 示例

在 `film` 表的 `title` 列上创建一个唯一的 B-tree 索引：

```sql
CREATE UNIQUE INDEX title_idx ON films (title);
```

在 `title` 列上创建一个 B-tree 索引，并包含 `films` 表中的 `director` 和 `rating` 列：

```sql
CREATE INDEX title_idx ON films (title) INCLUDE (director, rating);
```

在表达式 `lower(title)` 上创建一个索引，以便进行不区分大小写的高效搜索：

```sql
CREATE INDEX ON films ((lower(title)));
```

（在本示例中，我们选择省略索引名称，因此系统将选择一个名称，通常是 `films_lower_idx`。）

使用非默认排序规则创建索引：

```sql
CREATE INDEX title_idx_german ON films (title COLLATE "de_DE");
```

使用非默认空值排序规则创建索引：

```sql
CREATE INDEX title_idx_nulls_low ON films (title NULLS FIRST);
```

使用非默认填充因子创建索引：

```sql
CREATE UNIQUE INDEX title_idx ON films (title) WITH 
(fillfactor = 70);
```

创建一个 GIN 索引，并关闭快速更新：

```sql
CREATE INDEX gin_idx ON documents_table USING gin (locations) WITH (fastupdate = off);
```

在 `films` 表的 `code` 列上创建一个索引，并将索引放在表空间 `indexspace` 中：

```sql
CREATE INDEX code_idx ON films (code) TABLESPACE indexspace;
```

为了能高效地对转换函数的结果使用盒模型操作符，我们在点属性上创建了一个 GiST 索引：

```sql
CREATE INDEX pointloc ON points USING gist (box(location,location));
SELECT * FROM points WHERE box(location,location) && '(0,0),(1,1)'::box;
```

## 兼容性

`CREATE INDEX` 是 Cloudberry Database 对 SQL 标准的扩展。SQL 标准中没有索引的规定。

Cloudberry Database 不支持并发创建索引（不支持 `CONCURRENTLY` 关键字）。

## 另见

[`ALTER INDEX`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/alter-index.md)、[`DROP INDEX`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/drop-index.md)
