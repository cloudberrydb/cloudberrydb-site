---
title: pg_filedump
---

# pg_filedump

Filedump, also known as the command-line tool `pg_filedump`, is a system utility that formats Cloudberry Database heap files, index files, and control files into human-readable forms. Using filedump, you can format and dump files in multiple ways, as described in the [Command-line options](#command-line-options) section, and even dump binary data directly.

The repository for Cloudberry Database's filedump can be found at: `https://github.com/cloudberrydb/filedump`

## User scenarios

The filedump tool is primarily used in the following scenarios:

- **File analysis and debugging**: Converts heap, index, or control files from the database into a readable format, helping file content analysis and database issue debugging.
- **Data recovery**: Helps extract and recover data when database files are corrupted.
- **Database learning and research**: Provides developers and administrators a way to directly inspect database file contents, which is useful for studying database internals or learning about file formats.


## Compile and install filedump

Before compiling filedump, you need to have a Cloudberry Database cluster installed with version 1.0.0 or later. The following are the typical steps for compilation:

1. Ensure the CloudberryDB package can be found:

    ```bash
    su - gpadmin
    source /usr/local/cloudberry-db/greenplum_path.sh
    ```

2. Clone the GitHub repository `cloudberrydb/filedump` to your local environment:

    ```bash
    git clone https://github.com/cloudberrydb/filedump.git
    ```

3. Enter the repository directory and run the compilation command:

    ```bash
    cd filedump
    make
    ```

4. Install `pg_filedump`:

    ```bash
    make install
    ```

### Configuration options

The following configuration options are available during the compilation process:

- `ENABLE_ZLIB`: Enables the use of `pg_filedump` on zlib-compressed data files. If the `zlib` headers and libraries are detected, zlib support will be automatically enabled. You can force zlib support to be enabled with the following command:

    ```bash
    make -f Makefile ENABLE_ZLIB=y
    ```

    You can also force it to be disabled by setting this variable to `n`.

- `ENABLE_ZSTD`: Similar settings are used for the `zstd` compression method.

## Usage examples

Assuming you have successfully installed `filedump`, here are some common command examples:

### Format a heap file

```bash
pg_filedump -f /path/to/heap/file
```

Example:

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

### View the content of a control file

```bash
pg_filedump -c /path/to/pg_control
```

Example:

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

### Format and display a specific block range

```bash
pg_filedump -R 0 10 -f /path/to/heap/file
```

Example:

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

### Get detailed information using the `-i` and `-f` options

```bash
pg_filedump -i -f /path/to/heap/file
```

Example:

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

### Command-line options

When using the filedump tool, you can format and dump database files with the following command:

```bash
pg_filedump [-abcdfhikxy] [-R startblock [endblock]] [-D attrlist] [-S blocksize] [-s segsize] [-n segnumber] file
```

The default settings are: relative addressing, formatting the entire file, and using the block size listed in block 0 of the file.

The following options are available for heap and index files:

- **-a**: Displays absolute addresses when formatting. Block header information is always block-relative.
- **-b**: Displays binary block images within a specified range. This option will disable all other formatting options.
- **-d**: Displays a formatted block content dump. This option will disable all other formatting options.
- **-D**: Decodes tuples using a given comma-separated list of types. Supported types include:
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
    - `~`: Ignores all remaining attributes in the tuple.
- **-f**: Displays a formatted block content dump along with interpretation.
- **-h**: Displays help information.
- **-i**: Displays interpreted item details.
- **-k**: Verifies block checksums.
- **-R**: Displays specific block ranges within the file (Blocks are indexed from 0).
    - `[startblock]`: The block to start at.
    - `[endblock]`: The block to end at (exclusive). If only `startblock` is specified, only that single block will be formatted.
- **-s**: Forces the segment size to `[segsize]`.
- **-n**: Forces the segment number to `[segnumber]`.
- **-S**: Forces the block size to `[blocksize]`.
- **-x**: Forces interpreted formatting of block items as index items.
- **-y**: Forces interpreted formatting of block items as heap items.

The following options are available for control files:

- **-c**: Interprets the specified file as a control file.
- **-f**: Displays a formatted content dump along with interpretation.
- **-S**: Forces the block size to `[blocksize]`.

It is recommended to use the `-i` and `-f` options to obtain the most useful dump output.
