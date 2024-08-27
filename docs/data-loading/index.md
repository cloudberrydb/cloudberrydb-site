---
title: Data Loading Overview
---

# Data Loading Overview

Cloudberry Database loads data mainly by transforming external data into external tables (or foreign tables) via loading tools. Then it reads data from these external tables or writes data into them to achieve external data loading.

## Loading process

The general process of loading external data into Cloudberry Database is as follows:

1. Assess the data loading scenario (such as data source location, data type, and data volume) and select an appropriate loading tool.
2. Set up and enable the loading tool.
3. Create an external table, specifying information such as the protocol of the loading tool, data source address, data format in the `CREATE EXTERNAL TABLE` statement.
4. Once the external table is created, data from the external table can be queried directly using the `SELECT` statement, or data can be imported from the external table using `INSERT INTO SELECT`.

## Loading methods and scenarios

Cloudberry Database offers multiple data loading solutions, and you can select different data loading methods according to different data sources.

| Loading method              | Data source                                                 | Data format                                                  | Parallel or not |
| -------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------ | -------- |
| [`copy`](/docs/data-loading/load-data-using-copy.md)                     | Local file system<br /><br />• Coordinator node host (for a single file)<br />• Segment node host (for multiple files) | • TXT<br />• CSV<br />• Binary                                             | No       |
| [`file://` protocol](/docs/data-loading/load-data-using-file-protocol.md)         | Local file system (local segment host, accessible only by superuser) | • TXT<br />• CSV                                             | Yes      |
| [`gpfdist`](/docs/data-loading/load-data-using-gpfdist.md)    | Local host files or files accessible via internal network   | • TXT<br />• CSV<br />• Any delimited text format supported by the `FORMAT` clause<br />• XML and JSON (requires conversion to text format via YAML configuration file) | Yes      |               |
| [Batch loading using `gpload`](/docs/data-loading/load-data-using-gpload.md) (with `gpfdist` as the underlying worker) | Local host files or files accessible via internal network   | • TXT<br />• CSV<br />• Any delimited text format supported by the `FORMAT` clause<br />• XML and JSON (require conversion to text format via YAML configuration file) | Yes      |
| [Creating external web tables](/docs/data-loading/load-data-from-web-services.md)         | Data pulled from network services or from any source accessible by command lines | • TXT<br />• CSV                                             | Yes      |

## Learn more

```mdx-code-block
import DocCardList from '@theme/DocCardList';

<DocCardList />
```