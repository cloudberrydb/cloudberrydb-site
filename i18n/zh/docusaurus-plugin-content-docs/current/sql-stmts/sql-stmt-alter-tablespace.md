---
title: ALTER TABLESPACE
---

# ALTER TABLESPACE

更改表空间的定义。

## 语法概要

```sql
ALTER TABLESPACE <name> RENAME TO <new_name>

ALTER TABLESPACE <name> OWNER TO { <new_owner> | CURRENT_USER | SESSION_USER }

ALTER TABLESPACE <name> SET ( <tablespace_option> = <value> [, ... ] )

ALTER TABLESPACE <name> RESET ( <tablespace_option> [, ... ] )
```

## 描述

`ALTER TABLESPACE` 更改表空间的定义。

要使用 `ALTER TABLESPACE`，你必须拥有该表空间。要更改所有者，你还必须是新所有者角色的直接或间接成员。请注意，超级用户自动拥有这些权限。

## 参数

**`name`**

已有表空间的名称。

**`new_name`**

表空间的新名称。新名称不能以 `pg_` 或 `gp_` 开头（保留给系统表空间）。

**`new_owner`**

表空间的新所有者。

**`tablespace_parameter`**

要设置或重设的表空间参数。目前，唯一可用的参数是 `seq_page_cost` 和 `random_page_cost`。为特定表空间设置这两个参数，将替代优化器对表空间内表的页面读取成本的常规估算，这一估算是由同名配置参数（请参见 `seq_page_cost` 和 `random_page_cost`）所确定的。如果一个表空间位于比其余 I/O 子系统更快或更慢的磁盘上，设置 `tablespace_parameter` 可能很有用。

## 示例

将表空间 `index_space` 重命名为 `fast_raid`：

```sql
ALTER TABLESPACE index_space RENAME TO fast_raid;
```

将表空间 `index_space` 的所有者更改为 `mary`：

```sql
ALTER TABLESPACE index_space OWNER TO mary;
```

## 兼容性

标准 SQL 中没有 `ALTER TABLESPACE` 语句。

## 另见

[`CREATE TABLESPACE`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/create-tablespace.md)、[`DROP TABLESPACE`](/i18n/zh/docusaurus-plugin-content-docs/current/sql-stmts/drop-tablespace.md)
