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
      items: ['basic-query-syntax', 'create-and-manage-tablespaces', 'create-and-manage-tables','create-and-manage-schemas','create-and-manage-views','create-and-manage-materialized-views','insert-update-delete-rows','work-with-transactions','transactional-concurrency-control','table-storage-models',

      {
        type: 'category',
        label: 'Advanced Analytics',
        items: ['advanced-analytics/postgis','advanced-analytics/directory-tables']
      }
      ]
     },

     {
       type: 'category',
       label: 'Optimize Query Performance',
       items: ['query-performance-overview', 'update-stats-using-analyze', 'use-unique-index-on-ao-tables', 'use-auto-materialized-view-to-answer-queries', 'use-incremental-materialized-view', 'parallel-create-ao-refresh-mv', 'parallel-query-execution', 'use-aggre-pushdown-to-speed-up-queries', 'use-index-scan-on-ao-tables', 'use-runtimefilter-to-optimize-queries']
     },

     {
       type: 'category',
       label: 'Security and Permission',
       items: ['manage-roles-and-privileges', 'client-auth', 'configure-row-level-security-policy', 'protect-passwords','set-password-profile']
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
        'sys-admin/configure-database-system', 'sys-admin/check-database-system', 'sys-admin/enable-coordinator-mirroring', 'sys-admin/recommended-maintenance-monitoring-tasks']
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
          'sql-stmts/sql-stmt-alter-aggregate',
          'sql-stmts/sql-stmt-alter-collation',
          'sql-stmts/sql-stmt-alter-conversion',
          'sql-stmts/sql-stmt-alter-database',
          'sql-stmts/sql-stmt-alter-default-privileges',
          'sql-stmts/sql-stmt-alter-domain',
          'sql-stmts/sql-stmt-alter-extension',
          'sql-stmts/sql-stmt-alter-external-table',
          'sql-stmts/sql-stmt-alter-foreign-data-wrapper',
          'sql-stmts/sql-stmt-alter-foreign-table',
          'sql-stmts/sql-stmt-alter-function',
          'sql-stmts/sql-stmt-alter-group',
          'sql-stmts/sql-stmt-alter-index',
          'sql-stmts/sql-stmt-alter-language',
          'sql-stmts/sql-stmt-alter-materialized-view',
          'sql-stmts/sql-stmt-alter-operator-class',
          'sql-stmts/sql-stmt-alter-operator-family',
          'sql-stmts/sql-stmt-alter-operator',
          'sql-stmts/sql-stmt-alter-policy',
          'sql-stmts/sql-stmt-alter-procedure',
          'sql-stmts/sql-stmt-alter-protocol',
          'sql-stmts/sql-stmt-alter-resource-group',
          'sql-stmts/sql-stmt-alter-resource-queue',
          'sql-stmts/sql-stmt-alter-role',
          'sql-stmts/sql-stmt-alter-routine',
          'sql-stmts/sql-stmt-alter-rule',
          'sql-stmts/sql-stmt-alter-schema',
          'sql-stmts/sql-stmt-alter-sequence',
          'sql-stmts/sql-stmt-alter-server',
          'sql-stmts/sql-stmt-alter-statistics',
          'sql-stmts/sql-stmt-alter-table',
          'sql-stmts/sql-stmt-alter-tablespace',
          'sql-stmts/sql-stmt-alter-text-search-configuration',
          'sql-stmts/sql-stmt-alter-text-search-dictionary',
          'sql-stmts/sql-stmt-alter-text-search-parser',
          'sql-stmts/sql-stmt-alter-text-search-template',
          'sql-stmts/sql-stmt-alter-trigger',
          'sql-stmts/sql-stmt-alter-type',
          'sql-stmts/sql-stmt-alter-user-mapping',
          'sql-stmts/sql-stmt-alter-user',
          'sql-stmts/sql-stmt-alter-view',
          'sql-stmts/sql-stmt-analyze',
          'sql-stmts/sql-stmt-begin',
          'sql-stmts/sql-stmt-call',
          'sql-stmts/sql-stmt-checkpoint',
          'sql-stmts/sql-stmt-close',
          'sql-stmts/sql-stmt-cluster',
          'sql-stmts/sql-stmt-comment',
          'sql-stmts/sql-stmt-commit',
          'sql-stmts/sql-stmt-copy',
          'sql-stmts/sql-stmt-create-access-method',
          'sql-stmts/sql-stmt-create-aggregate',
          'sql-stmts/sql-stmt-create-cast',
          'sql-stmts/sql-stmt-create-collation',
          'sql-stmts/sql-stmt-create-conversion',
          'sql-stmts/sql-stmt-create-database',
          'sql-stmts/sql-stmt-create-domain',
          'sql-stmts/sql-stmt-create-extension',
          'sql-stmts/sql-stmt-create-external-table',
          'sql-stmts/sql-stmt-create-foreign-data-wrapper',
          'sql-stmts/sql-stmt-create-foreign-table',
          'sql-stmts/sql-stmt-create-function',
          'sql-stmts/sql-stmt-create-group',
          'sql-stmts/sql-stmt-create-index',
          'sql-stmts/sql-stmt-create-language',
          'sql-stmts/sql-stmt-create-materialized-view',
          'sql-stmts/sql-stmt-create-operator-class',
          'sql-stmts/sql-stmt-create-operator-family',
          'sql-stmts/sql-stmt-create-operator',
          'sql-stmts/sql-stmt-create-policy',
          'sql-stmts/sql-stmt-create-procedure',
          'sql-stmts/sql-stmt-create-protocol',
          'sql-stmts/sql-stmt-create-resource-group',
          'sql-stmts/sql-stmt-create-resource-queue',
          'sql-stmts/sql-stmt-create-role',
          'sql-stmts/sql-stmt-create-rule',
          'sql-stmts/sql-stmt-create-schema',
          'sql-stmts/sql-stmt-create-sequence',
          'sql-stmts/sql-stmt-create-server',
          'sql-stmts/sql-stmt-create-statistics',
          'sql-stmts/sql-stmt-create-table-as',
          'sql-stmts/sql-stmt-create-table',
          'sql-stmts/sql-stmt-create-tablespace',
          'sql-stmts/sql-stmt-create-text-search-configuration',
          'sql-stmts/sql-stmt-create-text-search-dictionary',
          'sql-stmts/sql-stmt-create-text-search-parser',
          'sql-stmts/sql-stmt-create-text-search-template',
          'sql-stmts/sql-stmt-create-transform',
          'sql-stmts/sql-stmt-create-trigger',
          'sql-stmts/sql-stmt-create-type',
          'sql-stmts/sql-stmt-create-user-mapping',
          'sql-stmts/sql-stmt-create-user',
          'sql-stmts/sql-stmt-create-view',
          'sql-stmts/sql-stmt-deallocate',
          'sql-stmts/sql-stmt-declare',
          'sql-stmts/sql-stmt-delete',
          'sql-stmts/sql-stmt-discard',
          'sql-stmts/sql-stmt-do',
          'sql-stmts/sql-stmt-drop-access-method',
          'sql-stmts/sql-stmt-drop-aggregate',
          'sql-stmts/sql-stmt-drop-cast',
          'sql-stmts/sql-stmt-drop-collation',
          'sql-stmts/sql-stmt-drop-conversion',
          'sql-stmts/sql-stmt-drop-database',
          'sql-stmts/sql-stmt-drop-domain',
          'sql-stmts/sql-stmt-drop-extension',
          'sql-stmts/sql-stmt-drop-external-table',
          'sql-stmts/sql-stmt-drop-foreign-data-wrapper',
          'sql-stmts/sql-stmt-drop-foreign-table',
          'sql-stmts/sql-stmt-drop-function',
          'sql-stmts/sql-stmt-drop-group',
          'sql-stmts/sql-stmt-drop-index',
          'sql-stmts/sql-stmt-drop-language',
          'sql-stmts/sql-stmt-drop-materialized-view',
          'sql-stmts/sql-stmt-drop-operator-class',
          'sql-stmts/sql-stmt-drop-operator-family',
          'sql-stmts/sql-stmt-drop-operator',
          'sql-stmts/sql-stmt-drop-owned',
          'sql-stmts/sql-stmt-drop-policy',
          'sql-stmts/sql-stmt-drop-procedure',
          'sql-stmts/sql-stmt-drop-protocol',
          'sql-stmts/sql-stmt-drop-resource-group',
          'sql-stmts/sql-stmt-drop-resource-queue',
          'sql-stmts/sql-stmt-drop-role',
          'sql-stmts/sql-stmt-drop-routine',
          'sql-stmts/sql-stmt-drop-rule',
          'sql-stmts/sql-stmt-drop-schema',
          'sql-stmts/sql-stmt-drop-sequence',
          'sql-stmts/sql-stmt-drop-server',
          'sql-stmts/sql-stmt-drop-statistics',
          'sql-stmts/sql-stmt-drop-table',
          'sql-stmts/sql-stmt-drop-tablespace',
          'sql-stmts/sql-stmt-drop-text-search-configuration',
          'sql-stmts/sql-stmt-drop-text-search-dictionary',
          'sql-stmts/sql-stmt-drop-text-search-parser',
          'sql-stmts/sql-stmt-drop-text-search-template',
          'sql-stmts/sql-stmt-drop-transform',
          'sql-stmts/sql-stmt-drop-trigger',
          'sql-stmts/sql-stmt-drop-type',
          'sql-stmts/sql-stmt-drop-user-mapping',
          'sql-stmts/sql-stmt-drop-user',
          'sql-stmts/sql-stmt-drop-view',
          'sql-stmts/sql-stmt-end',
          'sql-stmts/sql-stmt-execute',
          'sql-stmts/sql-stmt-explain',
          'sql-stmts/sql-stmt-fetch',
          'sql-stmts/sql-stmt-grant',
          'sql-stmts/sql-stmt-import-foreign-schema',
          'sql-stmts/sql-stmt-insert',
          'sql-stmts/sql-stmt-listen',
          'sql-stmts/sql-stmt-load',
          'sql-stmts/sql-stmt-lock',
          'sql-stmts/sql-stmt-move',
          'sql-stmts/sql-stmt-notify',
          'sql-stmts/sql-stmt-prepare',
          'sql-stmts/sql-stmt-reassign-owned',
          'sql-stmts/sql-stmt-refresh-materialized-view',
          'sql-stmts/sql-stmt-reindex',
          'sql-stmts/sql-stmt-release-savepoint',
          'sql-stmts/sql-stmt-reset',
          'sql-stmts/sql-stmt-retrieve',
          'sql-stmts/sql-stmt-revoke',
          'sql-stmts/sql-stmt-rollback-to-savepoint',
          'sql-stmts/sql-stmt-rollback',
          'sql-stmts/sql-stmt-savepoint',
          'sql-stmts/sql-stmt-select-into',
          'sql-stmts/sql-stmt-select',
          'sql-stmts/sql-stmt-set-constraints',
          'sql-stmts/sql-stmt-set-role',
          'sql-stmts/sql-stmt-set-session-authorization',
          'sql-stmts/sql-stmt-set-transaction',
          'sql-stmts/sql-stmt-set',
          'sql-stmts/sql-stmt-show',
          'sql-stmts/sql-stmt-start-transaction',
          'sql-stmts/sql-stmt-truncate',
          'sql-stmts/sql-stmt-unlisten',
          'sql-stmts/sql-stmt-update',
          'sql-stmts/sql-stmt-vacuum',
          'sql-stmts/sql-stmt-values',
        ]
      },

        'data-types',

      {
        type: 'category',
        label: 'Built-in Functions',
        items: [
                'functions/function-summary',
                'functions/json-functions-and-operators',
                'functions/window-functions',
                'functions/advanced-aggregate-functions',
                'functions/text-search-functions-and-operators',
                'functions/range-functions-and-operators',
        ]
      },

      {
        type: 'category',
        label: 'System Utilities',
        items: [
                'sys-utilities/db-util-overview',
                'sys-utilities/analyzedb',
                'sys-utilities/clusterdb',
                'sys-utilities/createuser',
                'sys-utilities/db-util-createdb',
                'sys-utilities/db-util-gpaddmirrors',
                'sys-utilities/db-util-gpbackup',
                'sys-utilities/db-util-gpcheckcat',
                'sys-utilities/db-util-gpcheckperf',
                'sys-utilities/db-util-gpconfig',
                'sys-utilities/db-util-gpdeletesystem',
                'sys-utilities/db-util-gpdemo',
                'sys-utilities/db-util-gpexpand',
                'sys-utilities/db-util-gpfdist',
                'sys-utilities/db-util-gpinitstandby',
                'sys-utilities/db-util-gpinitsystem',
                'sys-utilities/db-util-gpload',
                'sys-utilities/db-util-gplogfilter',
                'sys-utilities/db-util-gpmemreport',
                'sys-utilities/db-util-gpmemwatcher',
                'sys-utilities/db-util-gpmovemirrors',
                'sys-utilities/db-util-gppkg',
                'sys-utilities/gprestore',
                'sys-utilities/db-util-gpreload',
                'sys-utilities/db-util-gprecoverseg',
                'sys-utilities/db-util-gpssh-exkeys',
                'sys-utilities/db-util-gpssh',
                'sys-utilities/db-util-gpstart',
                'sys-utilities/db-util-gpstate',
                'sys-utilities/db-util-gpstop',
                'sys-utilities/db-util-gpsync',
                'sys-utilities/db-util-pg-checksums',
                'sys-utilities/db-util-pg-config',
                'sys-utilities/db-util-pg-dump',
                'sys-utilities/db-util-pg-dumpall',
                'sys-utilities/gp-filedump',
                'sys-utilities/db-util-psql',
                'sys-utilities/db-util-reindexdb',
                'sys-utilities/db-util-vacuumdb',
                'sys-utilities/dropdb',
                'sys-utilities/dropuser',
                'sys-utilities/gpactivatestandby',
                'sys-utilities/gpdemo']
       },
     ]
    },

    {
      type: "category",
      label: "Releases",
      link: {
        type: "doc",
        id: "releases/index",
      },
      items: ['releases/release-1.5.4','releases/release-1.5.3','releases/release-1.5.2','releases/release-1.5.1', 'releases/release-1.5.0'],
    },
  ]
}

export default sidebars;
