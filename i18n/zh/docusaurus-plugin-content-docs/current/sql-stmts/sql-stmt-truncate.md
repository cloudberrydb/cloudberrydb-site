---
title: TRUNCATE
---

# TRUNCATE

清空一张表或一组表中的所有行。

:::info 注意
Cloudberry Database 并不严格执行参照完整性语法（外键约束）。即使没有指定 `CASCADE` 选项，`TRUNCATE` 也会清空被外键约束引用的表。
:::

## 语法概要

```sql
TRUNCATE [TABLE] [ONLY] <name> [ * ] [, ...] 
    [ RESTART IDENTITY | CONTINUE IDENTITY ] [CASCADE | RESTRICT]
```

## 描述

`TRUNCATE` 从一张表或一组表中快速删除所有行。它的效果与对每张表执行未加限定的 [`DELETE`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/delete.md) 相同，但由于它实际上并不扫描表，因此速度更快。此外，它会立即回收磁盘空间，而不需要后续执行 [`VACUUM`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/vacuum.md) 操作。这在大型表上非常有用。

你必须对表具有 `TRUNCATE` 权限才能对表进行清空。

## 参数

**`name`**

要清空的表的名称（可以选择性地指定其所在的数据库 schema 作为限定）。如果在表名之前指定了 `ONLY`，则只清空该表。如果没有指定 `ONLY`，则清空该表及其所有子表（如果有）。可选地，你可以在表名后指定 `*`，以明确表示包括子表。

**`RESTART IDENTITY`**

自动重启被清空表的列所拥有的序列。

**`CONTINUE IDENTITY`**

不改变序列的值。这是默认行为。

**`CASCADE`**

因为这个关键字适用于外键引用（Cloudberry Database 不支持外键约束），所以它没有任何效果。

**`RESTRICT`**

因为这个关键字适用于外键引用（Cloudberry Database 不支持外键约束），所以它没有任何效果。

## 注意事项

`TRUNCATE` 在其执行的每张表上获取一个 `ACCESS EXCLUSIVE` 锁，这会阻塞对该表的所有其他并发操作。如果指定了 `RESTART IDENTITY`，则要重启的序列也会被独占锁定。如果你需要对表进行并发访问，请使用 `DELETE` 命令。

`TRUNCATE` 命令不会触发表上可能存在的任何用户定义的 `ON DELETE` 触发器。

`TRUNCATE` 命令不会清空继承自指定表的子表。仅指定的表被清空，其子表不受影响。

`TRUNCATE` 操作对于多版本并发控制（MVCC）来说并不安全。清空操作之后，如果并发事务使用了清空之前的快照，那么这些事务看到的表将是空的。

`TRUNCATE` 对于表中的数据而言是事务安全的：如果外围事务未提交，那么清空操作将被安全回滚。

当使用 `RESTART IDENTITY` 选项时，隐式执行的 `ALTER SEQUENCE RESTART` 操作也会在事务中进行；也就是说，如果外围事务未提交，这些操作将被回滚。需要注意的是，如果在事务回滚前对重启的序列进行了额外操作，这些操作对序列的影响同样会被回滚。

`TRUNCATE` 目前不支持外部表。这意味着如果指定的表有任何外部子表，该命令将失败。

## 示例

清空 `films` 和 `distributors` 两张表：

```sql
TRUNCATE films, distributors;
```

清空 `film` 和 `distribution` 两张表，并重设相关的序列生成器：

```sql
TRUNCATE films, distributors RESTART IDENTITY;
```

## 兼容性

SQL:2008 标准包括了一个带有 `TRUNCATE TABLE tablename` 语法的 `TRUNCATE` 命令。`CONTINUE IDENTITY`/`RESTART IDENTITY` 子句也出现在该标准中，但意义略有不同。该命令的一些并发行为由标准留给了实现定义（SQL 标准没有具体的并发行为，这是由各个数据库系统自己决定的），因此如果有必要，应该考虑并与其他数据库实现进行比较。

## 另见

[`DELETE`](https://github.com/cloudberrydb/cloudberrydb-site/blob/cbdb-doc-validation/docs/sql-stmts/delete.md)
