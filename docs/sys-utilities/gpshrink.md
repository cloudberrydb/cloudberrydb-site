---
title: gpshrink
---

# gpshrink

Cloudberry Database scales in clusters using the `gpshrink` system tool. When cluster resources are idle, such as disk space usage consistently below 20% or low CPU and memory usage, `gpshrink` can be used to reduce the size of the cluster, saving server resources. Users can remove segments from redundant servers with the `gpshrink` tool to scale in the cluster.

The gpshrink tool operates in two phases:

1. **Preparation Phase**: Collects information about all user tables in the database that need redistribution.

2. **Data Redistribution Phase**: Redistributes data for all tables in the database cluster, adjusting for the expanded or reduced size of the cluster.

## Steps to Scale In a Cluster Using gpshrink

1. Create a three-node cluster:

    ```bash
    make create-demo-cluster
    ```

2. Create a test table and check pre-scale-in status:

    ```sql
    -- Create table and insert data
    CREATE TABLE test(a INT); 
    INSERT INTO test SELECT i FROM generate_series(1,100) i;
    -- Check data distribution of the test table
    SELECT gp_segment_id, COUNT(*) FROM test GROUP BY gp_segment_id;
    -- Check metadata status
    SELECT * FROM gp_distribution_policy;
    SELECT * FROM gp_segment_configuration;
    ```

3. Create a shrinktest file and list segments to delete:

    ```bash
    touch shrinktest
    ```

    The segment information format should be: hostname|address|port|datadir|dbid|content|role. Include both primary and mirror segment information. To delete multiple segments, list segments with higher content numbers first. Ensure the preferred role matches the role, listing primary before mirror.

    Example format for deleting one segment:

    ```bash
    i-thd001y0|i-thd001y0|7004|/home/gpadmin/cloudberrydb/gpAux/gpdemo/datadirs/dbfast3/demoDataDir2|4|2|p
    i-thd001y0|i-thd001y0|7007|/home/gpadmin/cloudberrydb/gpAux/gpdemo/datadirs/dbfast_mirror3/demoDataDir2|7|2|m
    ```

4. Run the `gpshrink` Command Twice:

    ```bash
    # Preparation phase
    gpshrink -i shrinktest
    # Redistribution phase
    gpshrink -i shrinktest
    ```

    |Main Parameters       | Description |
    | ------------ | -----------------|
    | `-i`         | Specifies the file containing the segments to delete.  |
    | `-c`         | Clears collected table information.  |
    | `-a`         | Gathers statistics for tables after redistribution.  |
    | `-d`         | Sets maximum execution time for redistribution, terminating if exceeded.  |

    :::tip

    How gpshrink Works in Two Phases:

    - The first `gpshrink -i shrinktest` command prepares for scaling in by reading the segments to be deleted from the `shrinktest` file, creating the tables `gpshrink.status` (to record the status of `gpshrink`) and `gpshrink.status_detail` (to record the status of each table), and identifying all tables that need redistribution.
    - The second `gpshrink -i shrinktest` command handles the data redistribution, calculates the segment size after deletion, and redistributes data across the scaled-in cluster. It then removes the corresponding segments from `gp_segment_configuration`. During this phase, creating new tables is not recommended, as they cannot be redistributed across the scaled-in cluster. Some statements might fail due to locked tables.

    :::

    :::tip

    - If the first `gpshrink -i shrinktest` fails, it might be due to an error in the `shrinktest` file. Clear the collected data with `gpshrink -c` and rerun `gpshrink -i shrinktest`.
    - If the second `gpshrink -i shrinktest` fails, log in to the database to check the status of tables and proceed with further redistribution or rollback as needed.

    :::

5. Check the test table status after scaling in:

    ```sql
    -- Check data distribution of the test table
    SELECT gp_segment_id, COUNT(*) FROM test GROUP BY gp_segment_id;
    -- Check metadata status
    SELECT * FROM gp_distribution_policy;
    SELECT * FROM gp_segment_configuration;
    ```