---
title: Recommended Monitoring and Maintenance Tasks
---

# Recommended Monitoring and Maintenance Tasks

This section lists monitoring and maintenance operations recommended to ensure high availability and consistent performance of your Cloudberry Database cluster.

The tables in the following sections suggest operations that a Cloudberry Database system administrator can perform periodically to ensure that all components of the system are operating optimally. Monitoring operations help you to detect and diagnose problems early. Maintenance operations help you to keep the system up-to-date and avoid deteriorating performance, for example, from bloated system tables or diminishing free disk space.

It is not necessary to implement all of these suggestions in every cluster; use the frequency and severity recommendations as a guide to implement measures according to your service requirements.

## Database state monitoring operations

<table>
  <thead>
    <tr>
      <th>Operations</th>
      <th>Procedure</th>
      <th>Corrective Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        List segments that are currently down. If any rows are returned, this
        should generate a warning or alert.
        <p>Recommended frequency: run every 5 to 10 minutes</p>
        <p>Severity: IMPORTANT</p>
      </td>
<td>
    Run the following query in the <code>postgres</code> database:
    <pre><code>
SELECT *<br /> 
FROM gp_segment_configuration<br />
WHERE status = 'd';
    </code></pre>
</td>
      <td>
        If the query returns any rows, follow these steps to correct the
        problem:
        <ol>
          <li>Verify that the hosts with down segments are responsive. </li>
          <li>
            If hosts are OK, check the log files for the primaries and mirrors
            of the down segments to discover the root cause of the segments
            going down.
          </li>
          <li>
            If no unexpected errors are found, run the 
            <code>gprecoverseg</code> utility to bring the segments back online.
          </li>
        </ol>
      </td>
    </tr>
    <tr>
      <td>
        Check for segments that are up and not in sync. If rows are returned,
        this should generate a warning or alert.
        <p>Recommended frequency: run every 5 to 10 minutes</p>
      </td>
      <td>
        <div>
          Execute the following query in the <code>postgres</code> database:
          <pre>
            <code>SELECT * FROM gp_segment_configuration <br />
WHERE mode = 'n' and status <br />
= 'u' and content &lt;&gt; -1;</code>
          </pre>
        </div>
      </td>
      <td>
        If the query returns rows, then the segment might be in the process of
        moving from <code>Not In Sync</code> to 
        <code>Synchronized</code> mode. Use <code>gpstate -e</code> to track
        progress.
      </td>
    </tr>
    <tr>
      <td>
        Check for segments that are not operating in their preferred role but
        are marked as up and <code>Synchronized</code>. If any segments are
        found, the cluster might not be balanced. If any rows are returned this
        should generate a warning or alert.
        <p>Recommended frequency: run every 5 to 10 minutes</p>
        <p>Severity: IMPORTANT</p>
      </td>
      <td>
        <div>
          Execute the following query in the <code>postgres</code> database:
          <pre>
            <code>
SELECT * FROM gp_segment_configuration<br />WHERE preferred_role &lt;&gt; <br />role and status = 'u' and mode = 's';
            </code>
          </pre>
        </div>
      </td>
      <td>
        <p>
          When the segments are not running in their preferred role, processing
          might be skewed. Run <code>gprecoverseg -r</code> to bring the
          segments back into their preferred roles.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        Run a distributed query to test that it runs on all segments. One row
        should be returned for each primary segment.
        <p>Recommended frequency: run every 5 to 10 minutes</p>
        <p>Severity: CRITICAL</p>
      </td>
      <td>
        <div>
          Execute the following query in the <code>postgres</code> database:
          <pre>
            <code>
SELECT gp_segment_id, count(*)<br />
FROM gp_dist_random('pg_class')<br />
GROUP BY 1;
            </code>
          </pre>
        </div>
      </td>
      <td>
        <p>
          If this query fails, there is an issue dispatching to some segments in
          the cluster. This is a rare event. Check the hosts that are not able
          to be dispatched to ensure there is no hardware or networking issue.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        Test the state of coordinator mirroring on Cloudberry Database. If the
        value is not "STREAMING", an alert or warning will be raised.
        <p>Recommended frequency: run every 5 to 10 minutes</p>
        <p>Severity: IMPORTANT</p>
      </td>
      <td>
        <div>
          Run the following <code>psql</code> 
          command:
          <pre>
            <code>
psql &lt;dbname&gt; -c<br /> 
'SELECT pid, state FROM pg_stat_replication;'
            </code>
          </pre>
        </div>
      </td>
      <td>
        <p>
          Check the log file from the coordinator and standby coordinator for
          errors. If there are no unexpected errors and the machines are up, run
          the <code>gpinitstandby</code> utility to bring the standby online.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        Perform a basic check to see whether the coordinator is up and functioning.
        <p>Recommended frequency: run every 5 to 10 minutes</p>
        <p>Severity: CRITICAL</p>
      </td>
      <td>
        <div>
          Run the following query in the <code>postgres</code> database:
          <pre>
            <code>SELECT count(*) FROM<br />
            gp_segment_configuration;</code>
          </pre>
        </div>
      </td>
      <td>
        <p>
          If this query fails, the active coordinator might be down. Try to start
          the database on the original coordinator if the server is up and
          running. If that fails, try to activate the standby coordinator as
          coordinator.
        </p>
      </td>
    </tr>
  </tbody>
</table>

## Hardware and operating system monitoring

<table>
  <thead>
    <tr>
      <th>Operations</th>
      <th>Procedure</th>
      <th>Corrective Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        Check disk space usage on volumes used for Cloudberry Database data
        storage and the OS.
        <p>Recommended frequency: every 5 to 30 minutes</p>
        <p>Severity: CRITICAL</p>
      </td>
      <td>
        <div>
          <ul>
            <li>
              Set a threshold to raise an alert when a disk reaches a percentage
              of capacity. The recommended threshold is 75% full.
            </li>
            <li>
              It is not recommended to run the system with capacities
              approaching 100%.
            </li>
          </ul>
        </div>
      </td>
      <td>
        Use <code>VACUUM</code>/<code>VACUUM FULL</code> on user tables to
        reclaim space occupied by dead rows.
      </td>
    </tr>
    <tr>
      <td>
        Check for errors or dropped packets on the network interfaces.
        <p>Recommended frequency: hourly</p>
        <p>Severity: IMPORTANT</p>
      </td>
      <td>Set up a network interface checks. </td>
      <td>
        <p>Work with network and OS teams to resolve errors.</p>
      </td>
    </tr>
    <tr>
      <td>
        Check for RAID errors or degraded RAID performance.
        <p>Recommended frequency: every 5 minutes</p>
        <p>Severity: CRITICAL</p>
      </td>
      <td>Set up a RAID check.</td>
      <td>
        <ul>
          <li>Replace failed disks as soon as possible. </li>
          <li>
            Work with the system administration team to resolve other RAID or
            controller errors as soon as possible.
          </li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>
        Check for adequate I/O bandwidth and I/O skew.
        <p>
          Recommended frequency: when create a cluster or when hardware issues
          are suspected.
        </p>
      </td>
      <td>
        Run the Cloudberry Database 
        <code>gpcheckperf</code> utility.
      </td>
      <td>
        <div>
          The cluster might be under-specified if data transfer rates are not
          similar to the following:
          <ul>
            <li>2 GB per second disk read</li>
            <li>1 GB per second disk write</li>
            <li>10 Gigabit per second network read and write </li>
          </ul>
          If transfer rates are lower than expected, consult with your data
          architect regarding performance expectations.
        </div>
        <p>
          If the machines on the cluster display an uneven performance profile,
          work with the system administration team to fix faulty machines.
        </p>
      </td>
    </tr>
  </tbody>
</table>

## Catalog monitoring

<table>
  <thead>
    <tr>
      <th>Operations</th>
      <th>Procedure</th>
      <th>Corrective Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        Run catalog consistency checks in each database to ensure the catalog on
        each host in the cluster is consistent and in a good state.
        <p>You might run this command while the database is up and running. </p>
        <p>Recommended frequency: weekly</p>
        <p>Severity: IMPORTANT</p>
      </td>
      <td>
        Run the Cloudberry Database <code>gpcheckcat</code> utility in each database:
        <pre><code>gpcheckcat -O -p [target_port]</code></pre>
        <div>
          Note: With the 
          <code>-O</code> option, <code>gpcheckcat</code> runs just 10 of its usual 15 tests.
        </div>
      </td>
      <td>Run the repair scripts for any issues identified.</td>
    </tr>
    <tr>
      <td>
        Check for <code>pg_class</code> entries that have no corresponding <code>pg_attribute</code> entry.
        <p>Recommended frequency: monthly</p>
        <p>Severity: IMPORTANT</p>
      </td>
      <td>
        With no users on the system, run the Cloudberry Database <code>gpcheckcat</code> utility in each database:
        <pre><code>gpcheckcat -R pgclass -p [target_port]</code></pre>
      </td>
      <td>Run the repair scripts for any issues identified.</td>
    </tr>
    <tr>
      <td>
        Check for leaked temporary schema and missing schema definition.
        <p>Recommended frequency: monthly</p>
        <p>Severity: IMPORTANT</p>
      </td>
      <td>
        During a downtime, with no users on the system, run the Cloudberry Database <code>gpcheckcat</code> utility in each database:
        <pre><code>gpcheckcat -R namespace -p [target_port]</code></pre>
      </td>
      <td>Run the repair scripts for any issues identified.</td>
    </tr>
    <tr>
      <td>
        Check constraints on randomly distributed tables.
        <p>Recommended frequency: monthly</p>
        <p>Severity: IMPORTANT</p>
      </td>
      <td>
        With no users on the system, run the Cloudberry Database <code>gpcheckcat</code> utility in each database:
        <pre><code>gpcheckcat -R distribution_policy -p [target_port]</code></pre>
      </td>
      <td>Run the repair scripts for any issues identified.</td>
    </tr>
    <tr>
      <td>
        Check for dependencies on non-existent objects.
        <p>Recommended frequency: monthly</p>
        <p>Severity: IMPORTANT</p>
      </td>
      <td>
        During a downtime, with no users on the system, run the Cloudberry Database <code>gpcheckcat</code> utility in each database:
        <pre><code>gpcheckcat -R dependency -p [target_port]</code></pre>
      </td>
      <td>Run the repair scripts for any issues identified.</td>
    </tr>
  </tbody>
</table>

## Data maintenance

<table>
  <thead>
    <tr>
      <th>Operations</th>
      <th>Procedure</th>
      <th>Corrective Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Check for missing statistics on tables. </td>
      <td>
        Check the <code>gp_stats_missing</code> view in each database:
        <pre><code>SELECT * FROM gp_toolkit.gp_stats_missing;</code></pre>
      </td>
      <td>
        Run <code>ANALYZE</code> on tables that are missing statistics.
      </td>
    </tr>
    <tr>
      <td>
        Check for tables that have bloat (dead space) in data files that cannot
        be recovered by a regular <code>VACUUM</code> command.
        <p>Recommended frequency: weekly or monthly</p>
        <p>Severity: WARNING</p>
      </td>
      <td>
        Check the <code>gp_bloat_diag</code> view in each database:
        <pre><code>SELECT * FROM gp_toolkit.gp_bloat_diag;</code></pre>
      </td>
      <td>
        <code>VACUUM FULL</code> acquires an <code>ACCESS EXCLUSIVE</code> lock
        on tables. Run <code>VACUUM FULL</code> during a time when users and
        applications do not require access to the tables, such as during a time
        of low operation, or during a maintenance window.
      </td>
    </tr>
  </tbody>
</table>

## Database maintenance

<table>
  <thead>
    <tr>
      <th>Operation</th>
      <th>Procedure</th>
      <th>Corrective Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        Reclaim space occupied by deleted rows in the heap tables so that the
        space they occupy can be reused.<p>Recommended frequency: daily</p>
        <p>Severity: CRITICAL</p>
      </td>
      <td>
        Vacuum user tables:
        <pre><code>VACUUM &lt;table&gt;;</code></pre>
      </td>
      <td>Vacuum updated tables regularly to prevent bloating.</td>
    </tr>
    <tr>
      <td>
        Update table statistics.
        <p>
          Recommended frequency: after loading data and before executing queries
        </p>
        <p>Severity: CRITICAL</p>
      </td>
      <td>
        Analyze user tables. You can use the 
        <code>analyzedb</code> management utility:
        <pre><code>analyzedb -d &lt;database&gt; -a</code></pre>
      </td>
      <td>
        Analyze updated tables regularly so that the optimizer can produce
        efficient query execution plans.
      </td>
    </tr>
    <tr>
      <td>
        Backup the database data.
        <p>Recommended frequency: daily, or as required by your backup plan</p>
        <p>Severity: CRITICAL</p>
      </td>
      <td>
        Run the <code>gpbackup</code> utility to create a backup of the coordinator and segment databases in
        parallel.
      </td>
      <td>
        Best practice is to have a current backup ready in case the database
        must be restored.
      </td>
    </tr>
    <tr>
      <td>
        Vacuum, reindex, and analyze system catalogs to maintain an efficient
        catalog.
        <p>
          Recommended frequency: weekly, or more often if database objects are
          created and dropped frequently
        </p>
      </td>
      <td>
        <ol>
          <li>
            <code>VACUUM</code> the system tables in each database.
          </li>
          <li>
            Run <code>REINDEX SYSTEM</code> in each database, or use the 
            <code>reindexdb</code> 
            command-line utility with the <code>-s</code> option:
            <pre><code>reindexdb -s &lt;database&gt;</code></pre>
          </li>
          <li>
            <code>ANALYZE</code> each of the system tables:
            <pre><code>analyzedb -s pg_catalog -d &lt;database&gt;</code></pre>
          </li>
        </ol>
      </td>
      <td>
        The optimizer retrieves information from the system tables to create
        query plans. If system tables and indexes are allowed to become bloated
        over time, scanning the system tables increases query execution time. It
        is important to run <code>ANALYZE</code> after reindexing, because <code>REINDEX</code> leaves indexes with no statistics.
      </td>
    </tr>
  </tbody>
</table>

<!-- ## Patching and upgrading

<table>
  <thead>
    <tr>
      <th>Operations</th>
      <th>Procedure</th>
      <th>Corrective Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        Ensure any bug fixes or enhancements are applied to the kernel.
        <p>Recommended frequency: at least every 6 months</p>
        <p>Severity: IMPORTANT</p>
      </td>
      <td>Follow the vendor's instructions to update the Linux kernel.</td>
      <td>
        Keep the kernel current to include bug fixes and security fixes, and to
        avoid difficult future upgrades.
      </td>
    </tr>
    <tr>
      <td>
        Install Cloudberry Database minor releases, for example v1.5.0.<em>x</em>.
        <p>Recommended frequency: quarterly</p>
        <p>Severity: IMPORTANT</p>
      </td>
      <td>
        Follow upgrade instructions in the Cloudberry Database
        <em>Release Notes</em>. Always upgrade to the latest in the series.
      </td>
      <td>
        Keep the Cloudberry Database software current to incorporate bug fixes,
        performance enhancements, and feature enhancements into your Cloudberry Database
        cluster.
      </td>
    </tr>
  </tbody>
</table> -->
