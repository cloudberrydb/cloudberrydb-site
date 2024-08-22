---
title: pg_filedump
---

# pg_filedump

Filedump，即系统命令行工具 `pg_filedump`，是一个用于将 Cloudberry Database 的堆文件、索引文件和控制文件格式化为人类可读形式的实用工具。通过 filedump，用户可以以多种方式格式化和转储文件，如在[命令行选项说明](#命令选项说明)部分所述，甚至可以直接转储二进制数据。

Cloudberry Database 的 filedump 仓库地址：`https://github.com/cloudberrydb/filedump`

## 使用场景

Filedump 工具主要适用于以下场景：

- 文件分析与调试：将数据库的堆文件、索引文件或控制文件转化为可读格式，有助于分析文件内容、调试数据库问题。
- 数据恢复：在数据库文件损坏时，使用 filedump 可以帮助提取数据并进行恢复。
- 数据库学习与研究：对于研究数据库内部结构或学习数据库文件格式的开发者和管理员，filedump 提供了直接查看数据库文件内容的手段。

## 编译与安装

在编译 filedump 前，你需要安装好一套 Cloudberry Database v1.0.0 及以上版本的集群，以下是典型的编译步骤：

1. 确保 CloudberryDB 包可以被找到：

    ```bash
    su - gpadmin
    source /usr/local/cloudberry-db/greenplum_path.sh
    ```

2. 将 GitHub 仓库 `cloudberrydb/filedump` 克隆至本地：

    ```bash
    git clone https://github.com/cloudberrydb/filedump.git
    ```

3. 进入仓库目录，并执行编译命令：

    ```bash
    cd filredump
    make
    ```

4. 安装 `pg_filedump`：

    ```bash
    make install
    ```

### 配置选项

在编译过程中，以下配置选项是可用的：

- `ENABLE_ZLIB`：用于在 zlib 压缩的数据文件上使用 `pg_filedump`。如果检测到 `zlib` 头文件和库，`zlib` 支持会自动启用。你可以通过以下命令强制启用 zlib 支持：

    ```bash
    make -f Makefile ENABLE_ZLIB=y
    ```

    也可以通过将此变量设置为 `n` 来强制不启用 `zlib` 支持。

- `ENABLE_ZSTD`：类似设置用于 `zstd` 压缩方法。

## 使用示例

假设你已经成功安装了 `filedump`，以下是一些常用的命令示例：

### 格式化一个堆文件

```bash
pg_filedump -f /path/to/heap/file
```

示例如下：

```bash
$ pg_filedump -f /home/gpadmin/datadirs/dbfast1/demoDataDir0/base/13347/16385

*******************************************************************
* PostgreSQL File/Block Formatted Dump Utility
*
* File: /home/gpadmin/datadirs/dbfast1/demoDataDir0/base/13347/16385
* Options used: -f
*******************************************************************

Block    0 ********************************************************
<Header> -----
Block Offset: 0x00000000         Offsets: Lower      44 (0x002c)
Block: Size 32768  Version   14            Upper    32568 (0x7f38)
LSN:  logid      0 recoff 0x0c084ef8      Special  32768 (0x8000)
Items:    5                      Free Space: 32524
Checksum: 0x27ac  Prune XID: 0x00000000  Flags: 0x0000 ()
Length (including item array): 44

0000: 00000000 f84e080c ac270000 2c00387f  .....N...'..,.8.
0010: 00800e80 00000000 d8ff4800 b0ff5000  ..........H...P.
0020: 88ff5000 60ff5000 38ff5000           ..P.`.P.8.P.    

<Data> -----
Item   1 -- Length:   36  Offset: 32728 (0x7fd8)  Flags: NORMAL
7fd8: 1b030000 00000000 00000000 00000000  ................
7fe8: 01000300 02081800 02000000 09426f62  .............Bob
7ff8: 19000000                             ....            

Item   2 -- Length:   40  Offset: 32688 (0x7fb0)  Flags: NORMAL
7fb0: 1b030000 00000000 00000000 00000000  ................
7fc0: 02000300 02081800 03000000 11436861  .............Cha
7fd0: 726c6965 23000000                    rlie#...        

Item   3 -- Length:   40  Offset: 32648 (0x7f88)  Flags: NORMAL
7f88: 1c030000 00000000 00000000 00000000  ................
7f98: 03000300 02081800 04000000 0d446176  .............Dav
7fa8: 69640000 1c000000                    id......        

Item   4 -- Length:   40  Offset: 32608 (0x7f60)  Flags: NORMAL
7f60: 1d030000 00000000 00000000 00000000  ................
7f70: 04000300 02081800 07000000 11436861  .............Cha
7f80: 726c6965 23000000                    rlie#...        

Item   5 -- Length:   40  Offset: 32568 (0x7f38)  Flags: NORMAL
7f38: 1d030000 00000000 00000000 00000000  ................
7f48: 05000300 02081800 08000000 0d446176  .............Dav
7f58: 69640000 1c000000                    id......        

*** End of File Encountered. Last Block Read: 0 ***
```

### 查看控制文件内容

```bash
pg_filedump -c /path/to/pg_control
```

示例如下：

```bash
$ pg_filedump -c /home/gpadmin/datadirs/qddir/demoDataDir-1/global/pg_control

*******************************************************************
* PostgreSQL File/Block Formatted Dump Utility
*
* File: /home/gpadmin/datadirs/qddir/demoDataDir-1/global/pg_control
* Options used: -c
*******************************************************************

<pg_control Contents> *********************************************

                        CRC: Correct
        pg_control Version: 13000700
            Catalog Version: 302406171
            System Identifier: 7405502447288557259
                        State: IN PRODUCTION
                Last Mod Time: Wed Aug 21 16:20:06 2024
    Last Checkpoint Record: Log File (0) Offset (0x0c088f80)
Last Checkpoint Record Redo: Log File (0) Offset (0x0c088f48)
        |-       TimeLineID: 1
        |-         Next XID: 0/809
        |-         Next OID: 24576
        |- Next Relfilenode: 24576
        |-       Next Multi: 1
        |-    Next MultiOff: 0
        |-             Time: Wed Aug 21 16:20:06 2024
    Minimum Recovery Point: Log File (0) Offset (0x00000000)
        Backup Start Record: Log File (0) Offset (0x00000000)
            Backup End Record: Log File (0) Offset (0x00000000)
End-of-Backup Record Required: no
    Maximum Data Alignment: 8
        Floating-Point Sample: 1234567
        Database Block Size: 32768
        Blocks Per Segment: 32768
            XLOG Block Size: 32768
            XLOG Segment Size: 67108864
    Maximum Identifier Length: 64
        Maximum Index Keys: 32
            TOAST Chunk Size: 8140
```

### 格式化并显示特定块范围

```bash
pg_filedump -R 0 10 -f /path/to/heap/file
```

```bash
$ pg_filedump -R 0 10 -f /home/gpadmin/datadirs/dbfast1/demoDataDir0/base/13347/16385

*******************************************************************
* PostgreSQL File/Block Formatted Dump Utility
*
* File: /home/gpadmin/datadirs/dbfast1/demoDataDir0/base/13347/16385
* Options used: -R 0 10 -f
*******************************************************************

Block    0 ********************************************************
<Header> -----
Block Offset: 0x00000000         Offsets: Lower      44 (0x002c)
Block: Size 32768  Version   14            Upper    32568 (0x7f38)
LSN:  logid      0 recoff 0x0c084ef8      Special  32768 (0x8000)
Items:    5                      Free Space: 32524
Checksum: 0x27ac  Prune XID: 0x00000000  Flags: 0x0000 ()
Length (including item array): 44

0000: 00000000 f84e080c ac270000 2c00387f  .....N...'..,.8.
0010: 00800e80 00000000 d8ff4800 b0ff5000  ..........H...P.
0020: 88ff5000 60ff5000 38ff5000           ..P.`.P.8.P.    

<Data> -----
Item   1 -- Length:   36  Offset: 32728 (0x7fd8)  Flags: NORMAL
7fd8: 1b030000 00000000 00000000 00000000  ................
7fe8: 01000300 02081800 02000000 09426f62  .............Bob
7ff8: 19000000                             ....            

Item   2 -- Length:   40  Offset: 32688 (0x7fb0)  Flags: NORMAL
7fb0: 1b030000 00000000 00000000 00000000  ................
7fc0: 02000300 02081800 03000000 11436861  .............Cha
7fd0: 726c6965 23000000                    rlie#...        

Item   3 -- Length:   40  Offset: 32648 (0x7f88)  Flags: NORMAL
7f88: 1c030000 00000000 00000000 00000000  ................
7f98: 03000300 02081800 04000000 0d446176  .............Dav
7fa8: 69640000 1c000000                    id......        

Item   4 -- Length:   40  Offset: 32608 (0x7f60)  Flags: NORMAL
7f60: 1d030000 00000000 00000000 00000000  ................
7f70: 04000300 02081800 07000000 11436861  .............Cha
7f80: 726c6965 23000000                    rlie#...        

Item   5 -- Length:   40  Offset: 32568 (0x7f38)  Flags: NORMAL
7f38: 1d030000 00000000 00000000 00000000  ................
7f48: 05000300 02081800 08000000 0d446176  .............Dav
7f58: 69640000 1c000000                    id......        



*** End of File Encountered. Last Block Read: 0 ***
```

### 使用 `-i` 和 `-f` 选项获取详细信息

```bash
pg_filedump -i -f /path/to/heap/file
```

示例如下：

```bash
$ pg_filedump -i -f /home/gpadmin/datadirs/dbfast1/demoDataDir0/base/13347/16385

*******************************************************************
* PostgreSQL File/Block Formatted Dump Utility
*
* File: /home/gpadmin/datadirs/dbfast1/demoDataDir0/base/13347/16385
* Options used: -i -f
*******************************************************************

Block    0 ********************************************************
<Header> -----
 Block Offset: 0x00000000         Offsets: Lower      44 (0x002c)
 Block: Size 32768  Version   14            Upper    32568 (0x7f38)
 LSN:  logid      0 recoff 0x0c084ef8      Special  32768 (0x8000)
 Items:    5                      Free Space: 32524
 Checksum: 0x27ac  Prune XID: 0x00000000  Flags: 0x0000 ()
 Length (including item array): 44

  0000: 00000000 f84e080c ac270000 2c00387f  .....N...'..,.8.
  0010: 00800e80 00000000 d8ff4800 b0ff5000  ..........H...P.
  0020: 88ff5000 60ff5000 38ff5000           ..P.`.P.8.P.    

<Data> -----
 Item   1 -- Length:   36  Offset: 32728 (0x7fd8)  Flags: NORMAL
  XMIN: 795  XMAX: 0  CID|XVAC: 0
  Block Id: 0  linp Index: 1   Attributes: 3   Size: 24
  infomask: 0x0802 (HASVARWIDTH|XMAX_INVALID) 

  7fd8: 1b030000 00000000 00000000 00000000  ................
  7fe8: 01000300 02081800 02000000 09426f62  .............Bob
  7ff8: 19000000                             ....            

 Item   2 -- Length:   40  Offset: 32688 (0x7fb0)  Flags: NORMAL
  XMIN: 795  XMAX: 0  CID|XVAC: 0
  Block Id: 0  linp Index: 2   Attributes: 3   Size: 24
  infomask: 0x0802 (HASVARWIDTH|XMAX_INVALID) 

  7fb0: 1b030000 00000000 00000000 00000000  ................
  7fc0: 02000300 02081800 03000000 11436861  .............Cha
  7fd0: 726c6965 23000000                    rlie#...        

 Item   3 -- Length:   40  Offset: 32648 (0x7f88)  Flags: NORMAL
  XMIN: 796  XMAX: 0  CID|XVAC: 0
  Block Id: 0  linp Index: 3   Attributes: 3   Size: 24
  infomask: 0x0802 (HASVARWIDTH|XMAX_INVALID) 

  7f88: 1c030000 00000000 00000000 00000000  ................
  7f98: 03000300 02081800 04000000 0d446176  .............Dav
  7fa8: 69640000 1c000000                    id......        

 Item   4 -- Length:   40  Offset: 32608 (0x7f60)  Flags: NORMAL
  XMIN: 797  XMAX: 0  CID|XVAC: 0
  Block Id: 0  linp Index: 4   Attributes: 3   Size: 24
  infomask: 0x0802 (HASVARWIDTH|XMAX_INVALID) 

  7f60: 1d030000 00000000 00000000 00000000  ................
  7f70: 04000300 02081800 07000000 11436861  .............Cha
  7f80: 726c6965 23000000                    rlie#...        

 Item   5 -- Length:   40  Offset: 32568 (0x7f38)  Flags: NORMAL
  XMIN: 797  XMAX: 0  CID|XVAC: 0
  Block Id: 0  linp Index: 5   Attributes: 3   Size: 24
  infomask: 0x0802 (HASVARWIDTH|XMAX_INVALID) 

  7f38: 1d030000 00000000 00000000 00000000  ................
  7f48: 05000300 02081800 08000000 0d446176  .............Dav
  7f58: 69640000 1c000000                    id......        



*** End of File Encountered. Last Block Read: 0 ***
```

### 命令选项说明

使用 filedump 工具时，可以通过以下命令格式化和转储数据库文件：

```bash
pg_filedump [-abcdfhikxy] [-R startblock [endblock]] [-D attrlist] [-S blocksize] [-s segsize] [-n segnumber] file
```

默认设置为：相对地址显示、格式化整个文件、使用文件第 0 块中列出的块大小。

以下选项适用于堆文件和索引文件：

- **-a**：在格式化时显示绝对地址（块头信息始终为相对地址）。
- **-b**：显示指定范围内的二进制块图像（此选项会关闭所有格式化选项）。
- **-d**：显示格式化的块内容转储（此选项会关闭所有其他格式化选项）。
- **-D**：使用给定的逗号分隔类型列表解码元组。支持的类型列表包括：
    - bigint
    - bigserial
    - bool
    - char
    - charN -- char(n)
    - date
    - float
    - float4
    - float8
    - int
    - json
    - macaddr
    - name
    - oid
    - real
    - serial
    - smallint
    - smallserial
    - text
    - time
    - timestamp
    - timetz
    - uuid
    - varchar
    - varcharN -- varchar(n)
    - xid
    - xml
    - `~`：忽略元组中剩下的所有属性
- **-f**：显示格式化的块内容转储并进行解释。
- **-h**：显示帮助信息。
- **-i**：显示解释的项目详细信息。
- **-k**：验证块的校验和。
- **-R**：显示文件中的特定块范围（块从 0 开始索引）。
    - `[startblock]`：开始块编号。
    - `[endblock]`：结束块编号（不包括此块）。如果只指定了 `startblock`，则仅格式化该单个块。
- **-s**：强制段大小为 `[segsize]`。
- **-n**：强制段编号为 `[segnumber]`。
- **-S**：强制块大小为 `[blocksize]`。
- **-x**：强制将块项目解释为索引项。
- **-y**：强制将块项目解释为堆项目。

以下选项适用于控制文件：

- **-c**：将指定的文件解释为控制文件。
- **-f**：显示格式化内容转储并进行解释。
- **-S**：强制块大小为 `[blocksize]`。

通常推荐使用 `-i` 和 `-f` 选项以获取最有用的转储输出。
