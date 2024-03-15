---
title: 在 AO 表上使用唯一索引
---

# 在 AO 表上使用唯一索引（引入自 v1.5.0 版本）

自 v1.5.0 版本起，你可以在 Cloudberry Database 的 Append-Optimized (AO) 或 AOCS 表上添加唯一索引。有了唯一索引，Cloudberry Database 会在将数据插入到 AO 表时，强制检查唯一性约束，从而保证数据的唯一性，同时能够与优化器一起优化特定的查询，从而提高数据库的查询性能。但这也带来的一定的开销用于维护唯一索引，尤其是在插入数据时。

## 实现原理

针对存在唯一索引的场景，在向 AO 表插入数据时，Cloudberry Database 会在 AO 表的辅助索引结构 BlockDirectory 中插入 placeholder，以阻塞相同 key 的插入，从而实现唯一索引。

## 如何在 AO 表上添加唯一索引

有两种方法可以在 AO 表上添加唯一索引，你可以根据自己的业务需要进行选择：

- 在建表的同时指定唯一键或约束：

    ```sql
    CREATE TABLE foo(i int UNIQUE) USING ao_row;
    CREATE TABLE bar(i int UNIQUE) USING ao_column;
    CREATE TABLE foo2(i int, CONSTRAINT iuniq UNIQUE(i));
    ```

- 在建表后单独添加唯一索引或约束：

    ```sql
    CREATE TABLE baz(i int) with (appendonly=true);
    CREATE UNIQUE INDEX on baz(i);

    CREATE TABLE foobar(i int) USING ao_row;
    ALTER TABLE foobar ADD CONSTRAINT unique_i UNIQUE (i);
    ```

## 使用示例

1. 创建一张有唯一约束的 AO 示例表。

    ```sql
    postgres=# CREATE TABLE foo(i int UNIQUE) USING ao_row;
    CREATE TABLE

    postgres=# \d foo
                    Table "public.foo"
    Column |  Type   | Collation | Nullable | Default 
    --------+---------+-----------+----------+---------
    i      | integer |           |          | 
    Compression Type: None
    Compression Level: 0
    Block Size: 32768
    Checksum: t
    Indexes:
        "foo_i_key" UNIQUE CONSTRAINT, btree (i)
    Distributed by: (i)
    ```

2. 往表中插入相同的键值，会返回 `duplicate key` 的错误。

    ```sql
    postgres=# INSERT INTO foo VALUES(1);
    INSERT 0 1

    postgres=# INSERT INTO foo VALUES(1);
    ERROR:  duplicate key value violates unique constraint "foo_i_key"  (seg1 127.0.1.1:8003 pid=557)
    DETAIL:  Key (i)=(1) already exists.
    ```

并发插入数据的示例：在 READ COMMITTED 事务级别下，两个事务并发地向同一张 AO 表的插入相同的值，一个成功，另一个被阻塞。

1. 如果一个事务成功，那么另一个插入失败

    ```sql
    -- 会话 1
    postgres=# BEGIN;
    BEGIN

    postgres=*# INSERT INTO foo VALUES(1);
    INSERT 0 1  -- 成功插入

    postgres=*# COMMIT;
    COMMIT
    ```

    ```sql
    -- 会话 2
    postgres=# BEGIN;
    BEGIN

    postgres=*# INSERT INTO foo VALUES(1);
    ERROR:  duplicate key value violates unique constraint "foo_i_key"  (seg1 127.0.1.1:8003 pid=2726)
    DETAIL:  Key (i)=(1) already exists.  -- 插入失败

    postgres=!# END;
    ROLLBACK
    ```

2. 如果一个事务插入失败，那么另一个事务会插入成功。

    ```sql
    postgres=# BEGIN;
    BEGIN
    postgres=*# INSERT INTO foo VALUES(1);
    INSERT 0 1
    postgres=*# ROLLBACK;
    ROLLBACK
    ```

    ```sql
    postgres=# BEGIN;
    BEGIN
    postgres=*# INSERT INTO foo VALUES(1);
    INSERT 0 1
    postgres=*# COMMIT;
    COMMIT
    ```
