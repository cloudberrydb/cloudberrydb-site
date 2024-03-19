---
title: 使用 File 协议加载数据
---

# 使用 `file://` 协议加载数据至 Cloudberry Database

`file://` 协议是 Cloudberry Database 专有协议，用于将数据从本地 Segment 主机服务器文件加载到 Cloudberry Database 中。

`file://` 协议用于指定操作系统文件位置的 URI。所创建的外部表指定了 `file://` 协议，这些外部表是只读表。

URI 包括主机名、端口和文件路径。每个文件都必须位于一个 Segment 主机上，且可以被 Cloudberry Database 超级用户（`gpadmin`）访问。URI 中使用的主机名必须与 `gp_segment_configuration` 系统目录表中注册的 Segment 主机名匹配。

`LOCATION` 子句可以有多个 URI，如[使用示例](#使用示例)中所示。

在 `LOCATION` 子句中指定的 URI 数量是用于并行访问外部表的 Segment 实例数量。对于每个 URI，Cloudberry Database 会将指定主机上的主 Segment 分配给文件。在加载数据时，为了获得最大并发度，将数据分成与主 Segment 数量相同的大小相等的文件。这样可以确保所有 Segment 参与数据加载。每个 Segment 主机上的外部文件数量不能超过该主机上的主 Segment 实例数量。例如，如果每个 Segment 主机有 4 个主 Segment 实例，你可以在每个 Segment 主机上放置 4 个外部文件。基于 `file://` 协议的表只能是可读表。

系统视图 `pg_max_external_files` 显示了每个外部表允许的外部表文件数量。当使用 `file://` 协议时，此视图列出了每个 Segment 主机上可用的文件槽。该视图仅适用于 `file://` 协议。例如：

```sql
SELECT * FROM pg_max_external_files;
```

## 使用示例

加载多个 CSV 格式的文件，这些文件都有标题行：

创建一个可读外部表 `ext_expenses`，使用 `file` 协议。这些文件是 CSV 格式，且有标题行。

```sql
=# CREATE EXTERNAL TABLE ext_expenses ( name text, 
   date date,  amount float4, category text, desc1 text ) 
   LOCATION ('file://filehost/data/international/*', 
             'file://filehost/data/regional/*',
             'file://filehost/data/supplement/*.csv')
   FORMAT 'CSV' (HEADER);
```

```sql
CREATE EXTERNAL TABLE ext_expenses (
   name text, date date, amount float4, category text, desc1 text ) 
LOCATION ('file://host1:5432/data/expense/*.csv', 
          'file://host2:5432/data/expense/*.csv', 
          'file://host3:5432/data/expense/*.csv') 
FORMAT 'CSV' (HEADER);
```
