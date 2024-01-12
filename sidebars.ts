import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want. 
 */
const sidebars: SidebarsConfig = {
  docsbars: [

    {
      type: 'category',
      label: 'Introduction',
      items: ['cbdb-overview','cbdb-architecture','cbdb-scenarios','cbdb-vs-gp-features']
     },

    {
      type: 'category',
      label: 'Deploy and Build',
      items: [
      {
        type: 'category',
        label: 'Build from Source Code',
        items: ['cbdb-macos-compile','cbdb-linux-compile']
      },
      {
        type: 'category',
        label: 'Deploy on Physical Machine',
        items: ['cbdb-op-software-hardware', 'cbdb-op-prepare-to-deploy', 'cbdb-op-deploy-guide','deploy-cbdb-with-single-node']
      }
     ]
    },

    {
      type: 'category',
      label: 'Load Data',
      items: ['data-loading/load-data-overview',
      {
        type: 'category',
        label: 'Load Data from Local Files',
        items: ['data-loading/load-data-using-copy', 'data-loading/load-data-using-gpfdist', 'data-loading/load-data-using-file-protocol','data-loading/load-data-using-gpload']
      },
      'data-loading/load-data-from-web-services']
    },

    {
      type: 'category',
      label: 'Create and Prepare',
      items: ['create-and-manage-database','start-and-stop-cbdb-database','connect-to-cbdb']
    },

    {
      type: 'category',
      label: 'Operate with Data',
      items: ['basic-query-syntax','create-and-manage-tables','insert-update-delete-rows','work-with-transactions','transactional-concurrency-control']
     },

     {
       type: 'category',
       label: 'Optimize Query Performance',
       items: ['query-performance-overview', 'update-stats-using-analyze','use-unique-index-on-ao-tables','use-auto-materialized-view-to-answer-queries', 'use-incremental-materialized-view', 'parallel-create-ao-refresh-mv']
     },

     {
       type: 'category',
       label: 'Security and Permission',
       items: ['set-password-profile']
     },

    {
      type: 'category',
      label: 'References',
      items: [
      {
        type: 'category',
        label: 'SQL Statements',
        items: [
          'sql-stmts/sql-stmt-abort',
          'sql-stmts/sql-stmt-alter-database',
          'sql-stmts/sql-stmt-alter-rule',
          'sql-stmts/sql-stmt-alter-tablespace',
          'sql-stmts/sql-stmt-create-database',
          'sql-stmts/sql-stmt-create-index',
          'sql-stmts/sql-stmt-create-tablespace',
          'sql-stmts/sql-stmt-drop-database',
          'sql-stmts/sql-stmt-drop-extension',
          'sql-stmts/sql-stmt-drop-external-table',
          'sql-stmts/sql-stmt-drop-index',
          'sql-stmts/sql-stmt-drop-materialized-view',
          'sql-stmts/sql-stmt-drop-role',
          'sql-stmts/sql-stmt-drop-rule',
          'sql-stmts/sql-stmt-drop-schema',
          'sql-stmts/sql-stmt-drop-table',
          'sql-stmts/sql-stmt-drop-tablespace',
          'sql-stmts/sql-stmt-drop-type',
          'sql-stmts/sql-stmt-drop-user',
          'sql-stmts/sql-stmt-drop-view',
          'sql-stmts/sql-stmt-end',
          'sql-stmts/sql-stmt-rollback',
          'sql-stmts/sql-stmt-rollback-to-savepoint',
          'sql-stmts/sql-stmt-savepoint',
          'sql-stmts/sql-stmt-set-role',
          'sql-stmts/sql-stmt-set-transaction',
          'sql-stmts/sql-stmt-start-transaction',
          'sql-stmts/sql-stmt-truncate',
        ]
      },

      {
        type: 'category',
        label: 'System Utilities',
        items: ['sys-utilities/gpdemo']
       },
     ]
    },

    {
      type: 'category',
      label: 'Releases',
      items: ['releases/release-1.5.0']
     }

    {
      type: "category",
      label: "Optimize Query Performance",
      items: ["query-performance-overview", "update-stats-using-analyze"],
    },

    {
      type: 'category',
      label: 'Manage System',
      items: [
        {
        type: 'category',
        label: 'Backup and Restore',
        items: ['sys-admin/backup-and-restore-overview', 'sys-admin/perform-full-backup-and-restore', 'sys-admin/perform-incremental-backup-and-restore']
       },
        'sys-admin/configure-database-system', 'sys-admin/check-database-system', 'sys-admin/recommended-maintenance-monitoring-tasks']
     },

    {
      type: "category",
      label: "References",
      items: [
        {
          type: "category",
          label: "SQL Statements",
          items: [
            "sql-stmts/sql-stmt-abort",
            "sql-stmts/sql-stmt-alter-database",
            "sql-stmts/sql-stmt-alter-rule",
            "sql-stmts/sql-stmt-alter-tablespace",
            "sql-stmts/sql-stmt-create-database",
            "sql-stmts/sql-stmt-create-index",
            "sql-stmts/sql-stmt-create-tablespace",
            "sql-stmts/sql-stmt-drop-database",
            "sql-stmts/sql-stmt-drop-extension",
            "sql-stmts/sql-stmt-drop-external-table",
            "sql-stmts/sql-stmt-drop-index",
            "sql-stmts/sql-stmt-drop-materialized-view",
            "sql-stmts/sql-stmt-drop-role",
            "sql-stmts/sql-stmt-drop-rule",
            "sql-stmts/sql-stmt-drop-schema",
            "sql-stmts/sql-stmt-drop-table",
            "sql-stmts/sql-stmt-drop-tablespace",
            "sql-stmts/sql-stmt-drop-type",
            "sql-stmts/sql-stmt-drop-user",
            "sql-stmts/sql-stmt-drop-view",
            "sql-stmts/sql-stmt-end",
            "sql-stmts/sql-stmt-rollback",
            "sql-stmts/sql-stmt-rollback-to-savepoint",
            "sql-stmts/sql-stmt-savepoint",
            "sql-stmts/sql-stmt-set-role",
            "sql-stmts/sql-stmt-set-transaction",
            "sql-stmts/sql-stmt-start-transaction",
            "sql-stmts/sql-stmt-truncate",
          ],
        },
      ],
    },
  ],
};

export default sidebars;
